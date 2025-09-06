
import { getDateCR } from "../libs/date.js";
import { createBarCode, isDateValid, isProductsValid } from "../logic/proforma/proforma.logic.js";
import { Proforma, DetailsProforma } from "../models/proforma.model.js";
import Config from "../models/config.model.js";
import Product from "../models/product.model.js";

import { QueryTypes } from 'sequelize';
import db from '../db.js';

export const createProForma = async (req, res) => {
  const { FEC_LIMITE, MON_TOTAL, details_list } = req.body;
  try {
    const currentDate = await getDateCR();

    if (!isDateValid(currentDate, FEC_LIMITE)) return res.status(400).json({ message: "La fecha limite no es valida. Favor ingresar una mayor o igual a la fecha actual." })

    const validateDetails = await isProductsValid(details_list);
    if (!validateDetails.success) return res.status(400).json({ message: validateDetails });

    const code = await createBarCode();

    const proforma = new Proforma({
      DSC_CODIGO_BARRAS: code,
      ID_EMPRESA: 1,
      FEC_CREACION: currentDate,
      FEC_LIMITE: FEC_LIMITE,
      MON_TOTAL: MON_TOTAL,
      ESTADO: 1
    });
    const proformaSaved = await proforma.save();
    if (proformaSaved) {
      const detailsToSave = details_list.map(d => ({
        ID_PROFORMA: proforma.ID_PROFORMA, // FK
        ID_PRODUCTO: d.ID_PRODUCT,
        PRECIO_UNITARIO: d.PRECIO_UNITARIO,
        CANTIDAD: d.CANTIDAD,
        IMPUESTO: d.IMPUESTO,
        DESCUENTO: d.DESCUENTO
      }));

      await DetailsProforma.bulkCreate(detailsToSave);

      // Enviar a crear la proforma en pdf y devolver
      res.status(200).json({
        success: true,
        message: "Factura proforma creada correctamente.",
        DSC_CODIGO_BARRAS: code
      });

    } else {
      res.status(400).json({ message: "Error al crear la factura proforma." });
    }
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error al crear la factura proforma.", error: error.message });
  }
}

export const getAllProForma = async (req, res) => {
  try {
    const { page = 1, pageSize = 5, orderByField = 'DSC_CODIGO_BARRAS', order = 'asc' } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field = (orderByField === 'MON_TOTAL' || orderByField === 'FEC_CREACION' || orderByField === 'FEC_LIMITE' || orderByField === 'DSC_CODIGO_BARRAS' || orderByField === 'ESTADO') ? orderByField : 'DSC_CODIGO_BARRAS';

    const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

    const { count, rows } = await Proforma.findAndCountAll({
      limit,
      offset,
      order: [[field, sortOrder]],
      attributes: { exclude: ['ID_EMPRESA'] },
      include: [
        {
          model: Config,
          attributes: ['ID_EMPRESA', 'DSC_NOMBRE', 'NUM_TELEFONO', 'DSC_CORREO', 'DSC_DIRECCION']
        },
        {
          model: DetailsProforma,
          attributes: ['ID_PRODUCTO_PROFORMA', 'PRECIO_UNITARIO', 'CANTIDAD', 'IMPUESTO', 'DESCUENTO'],
          include: [
            {
              model: Product,
              attributes: ['ID_PRODUCT', 'DSC_NOMBRE', 'DSC_DESCRIPTION']
            }
          ]
        }
      ]
    });

    if (rows.length === 0) return res.status(204).json({ message: "No se encontraron facturas proformas." })

    return res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      proformas: rows
    })




  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export const searchProForma = async (req, res) => {
  try {

    const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_CODIGO_BARRAS', order = 'desc' } = req.query;
    const limit = parseInt(pageSize);
    const offset = (parseInt(page) - 1) * limit;

    const field = (orderByField === 'MON_TOTAL' || orderByField === 'FEC_CREACION' || orderByField === 'FEC_LIMITE' || orderByField === 'DSC_CODIGO_BARRAS' || orderByField === 'ESTADO') ? orderByField : 'DSC_CODIGO_BARRAS';

    const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

    const [results] = await db.query(
      'CALL sp_searchProformas(:field, :sortOrder, :limit, :offset, :expectedMatch)',
      {
        replacements: {
          field: field,
          sortOrder: sortOrder,
          limit: limit,
          offset: offset,
          expectedMatch: termSearch
        },
        type: QueryTypes.SELECT
      });

    const count = Object.keys(results).length;
    if (count === 0) {
      return res.status(204).json({
        message: "No se encontraron proformas.",
      });
    }

    const parsedResults = Object.values(results).map(r => {
      return {
        ...r,
        PRODUCTS_LISTS: r.PRODUCTS_LISTS ? JSON.parse(r.PRODUCTS_LISTS) : []
      };
    });

    res.json({
      total: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      pageSize: limit,
      proformas: parsedResults
    })


  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: error.message });
  }
}

export const deleteProForma = async (req, res) => {
  try {
    const id = req.params.id;

    const proformaFound = await Proforma.findOne({ where: { ID_PROFORMA: id } });
    if (!proformaFound) return res.status(404).json({ message: "Factura proforma no encontrada." });

    proformaFound.ESTADO = 0;
    await proformaFound.save();

    res.status(200).json({ message: "Factura proforma anulada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al anular la factura proforma.", error: error.message });
  }
}


