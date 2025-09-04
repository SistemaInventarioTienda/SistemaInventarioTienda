
import { getDateCR } from "../libs/date.js";
import { createBarCode, isDateValid, isProductsValid } from "../logic/proforma/proforma.logic.js";
import { Proforma, DetailsProforma } from "../models/proforma.model.js";

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

      res.status(200).json({ message: "Factura proforma creada correctamente.", code: code });
    } else {
      res.status(400).json({ message: "Error al crear la factura proforma." });
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error al crear la factura proforma.", error: error.message });
  }
}

export const getAllProForma = async (req, res) => {

}

export const getProForma = async (req, res) => {

}

export const deleteProForma = async (req, res) => {
  try {
    const id = req.params.id;

    const proformaFound = await Proforma.findOne({ where: { ID_PROFORMA: id } });
    if(!proformaFound) return res.status(404).json({ message: "Factura proforma no encontrada." });

    proformaFound.ESTADO = 0;
    await proformaFound.save();

    res.status(200).json({ message: "Factura proforma anulada correctamente." });
  } catch (error) {
    res.status(500).json({ message: "Error al anular la factura proforma.", error: error.message });
  }
}


