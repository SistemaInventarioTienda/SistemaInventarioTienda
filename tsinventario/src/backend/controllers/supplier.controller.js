import {Supplier,mailSupplier,supplierDirection,numberSupplier,supplierType}  from "../models/supplier.model.js";
import {validateRegisterSupplier} from    "../logic/supplier/supplier.logic.js"
import { getDateCR } from "../libs/date.js";
import {validateSupplierData} from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';



export const getAllSuppliers = async (req, res) => {
    try {
      
        const { page = 1, pageSize = 5, orderByField = 'DSC_NOMBRE', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

       
        const field = ['DSC_NOMBRE', 'ESTADO'].includes(orderByField) ? orderByField : 'DSC_NOMBRE';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

      
        const { count, rows } = await Supplier.findAndCountAll({
            attributes: { exclude: ['FEC_MODIFICADOEN','ID_PROVEEDOR','ID_DIRECCION'] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: supplierDirection,
                    attributes: ['DSC_DIRECCIONEXACTA'],
                },
                {
                    model: numberSupplier,
                    attributes: ['DSC_TELEFONO'],
                },
                {
                    model: mailSupplier,
                    attributes: ['DSC_CORREO'],
                },
                {
                    model: supplierType,
                    attributes: ['DSC_NOMBRE']
                }
            ]
        });

     
        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron Proveedores.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            suppliers: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const createSupplier = async (req, res) => {
    const { DSC_DIRECCIONEXACTA, DSC_NOMBRE, ID_TIPOPROVEEDOR, ESTADO, phones, emails } = req.body;
  
    try {
        const date = await getDateCR(); 
        const validateFields = validateSupplierData(req);
        if(validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }

        const suplierName = await validateRegisterSupplier(DSC_NOMBRE);
        if (suplierName !== true) {
            return res.status(400).json({
                message: suplierName,
            });
        }


      const direction = await supplierDirection.create({
        DSC_DIRECCIONEXACTA,
      });
  

      const supplier = await Supplier.create({
        DSC_NOMBRE,
        ID_TIPOPROVEEDOR,
        ID_DIRECCION: direction.ID_DIRECCIONPROVEEDOR,
        ESTADO,
        FEC_CREADOEN: date,
      });
  
   //faltar validacion de numero y correo,para que no se repitan....
      if (phones && Array.isArray(phones) && phones.length > 0) {
        const phoneRecords = phones.map(phone => ({
          ID_PROVEEDOR: supplier.ID_PROVEEDOR,
          DSC_TELEFONO: phone,
          FEC_CREADOEN: date,
          ESTADO: 1,
        }));
  
        await numberSupplier.bulkCreate(phoneRecords);
      }
  
      if (emails && Array.isArray(emails) && emails.length > 0) {
        const emailRecords = emails.map(email => ({
          ID_PROVEEDOR: supplier.ID_PROVEEDOR,
          DSC_CORREO: email,
          FEC_CREADOEN: date,
          ESTADO: 1,
        }));
  
        await mailSupplier.bulkCreate(emailRecords);
      }
  
      res.status(201).json({ message: 'Proveedor creado Correctamente'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al crear el proveedor', error });
    }
  };
  

  export const deleteSupplier = async (req, res) => {
    const { DSC_NOMBRE } = req.body;
  //se elimina por nombre de proveedor, es unico..
    try {
    
      const supplier = await Supplier.findOne({
        where: {
          DSC_NOMBRE,
          ESTADO: 1,
        },
      });
  
      
      if (!supplier) {
        return res.status(404).json({
          message: 'Proveedor no encontrado o ya está inactivo.',
        });
      }
  
      supplier.ESTADO = 2;
      await supplier.save();
  
      res.status(200).json({
        message: 'Proveedor eliminado exitosamente.'
      });
    } catch (error) {
      console.error('Error al marcar el proveedor', error);
      res.status(500).json({
        message: 'Error al procesar la solicitud.',
        error,
      });
    }
  };
  

  export const getAllSupplierTypes = async (req, res) => {
    try {
        const supplierTypes = await supplierType.findAll();
        res.status(200).json({ type: supplierTypes });
    } catch (error) {
        console.error('Error al obtener los tipos de proveedores:', error);
        res.status(500).json({ message: 'Error desconocido', error });
    }
};
