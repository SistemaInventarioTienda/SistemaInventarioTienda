import {Supplier,mailSupplier,numberSupplier,supplierType}  from "../models/supplier.model.js";
import {validateRegisterSupplier,validateRegisterSupplierUpdate,validateRegisterEmails,validateRegisterPhones} from    "../logic/supplier/supplier.logic.js"
import { getDateCR } from "../libs/date.js";
import {validateSupplierData,validateSupplierDataUpdate} from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';



export const getAllSuppliers = async (req, res) => {
    try {
      
        const { page = 1, pageSize = 5, orderByField = 'DSC_NOMBRE', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

       
        const field = ['DSC_NOMBRE', 'ESTADO'].includes(orderByField) ? orderByField : 'DSC_NOMBRE';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

      
        const { count, rows } = await Supplier.findAndCountAll({
            attributes: { exclude: ['FEC_MODIFICADOEN','ID_PROVEEDOR'] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
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
    const { DSC_DIRECCIONEXACTA,DSC_VENTA, DSC_NOMBRE,CTA_BANCARIA, ID_TIPOPROVEEDOR, ESTADO, phones, emails } = req.body;
  
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


        const numberValidation = await validateRegisterPhones(phones);
        if (numberValidation !== true) {
            return res.status(400).json({
                message: numberValidation,
            });
        }
  
        const emailValidation = await validateRegisterEmails(emails);
        if (emailValidation !== true) {
            return res.status(400).json({
                message: emailValidation,
            });
        }
  

      
  
      const formattedDate = date.toString().replace(/[:-]/g, '').slice(0, 14);
      const IDENTIFICADOR_PROVEEDOR = `SUP-${formattedDate}-${uuidv4().slice(0, 8)}`;
      const supplier = await Supplier.create({
        IDENTIFICADOR_PROVEEDOR,
        DSC_NOMBRE,
        ID_TIPOPROVEEDOR,
        DSC_VENTA,
        CTA_BANCARIA,
        DSC_DIRECCIONEXACTA,
        ESTADO,
        FEC_CREADOEN: date,
      });
  
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
    const { IDENTIFICADOR_PROVEEDOR } = req.body;
    try {
    
      const supplier = await Supplier.findOne({
        where: {
          IDENTIFICADOR_PROVEEDOR,
          ESTADO: 1,
        },
      });
  
      
      if (!supplier) {
        return res.status(404).json({
          message: 'Proveedor no encontrado o ya está inactivo.',
        });
      }
  
      supplier.ESTADO = 2;
      supplier.FEC_MODIFICADOEN = await getDateCR(); 
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


export const updatedSupplier = async (req, res) => {
  const { IDENTIFICADOR_PROVEEDOR, DSC_DIRECCIONEXACTA,DSC_VENTA,CTA_BANCARIA, DSC_NOMBRE, ID_TIPOPROVEEDOR, ESTADO } = req.body;

  try {
      const date = await getDateCR(); 
      
      const validateFields = validateSupplierDataUpdate(req);
      if (validateFields !== true) {
          return res.status(400).json({
              message: validateFields,
          });
      }

      const suplierName = await validateRegisterSupplierUpdate(DSC_NOMBRE, IDENTIFICADOR_PROVEEDOR);
      if (suplierName !== true) {
          return res.status(400).json({
              message: suplierName,
          });
      }

   
      await Supplier.update(
        {
          DSC_NOMBRE,
          ID_TIPOPROVEEDOR,
          DSC_DIRECCIONEXACTA,
          DSC_VENTA,
          CTA_BANCARIA,
          ESTADO,
          FEC_MODIFICADOEN: date,
        },
        { where: { IDENTIFICADOR_PROVEEDOR } }
      );

      res.status(200).json({
        message: 'Proveedor actualizado correctamente'
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el proveedor', error });
  }
};


export const selectOneSupplier = async (req, res) => {
  const { IDENTIFICADOR_PROVEEDOR } = req.body; 

  try {
    if (!IDENTIFICADOR_PROVEEDOR || !IDENTIFICADOR_PROVEEDOR.trim()) {
      return res.status(400).json({
          message: "El nombre del proveedor es requerido."
      });
  }

      const supplier = await Supplier.findOne({
          where: { IDENTIFICADOR_PROVEEDOR: IDENTIFICADOR_PROVEEDOR },
          attributes: { exclude: ['FEC_MODIFICADOEN'] },
          include: [
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

      if (!supplier) {
          return res.status(404).json({
              message: "Proveedor no encontrado."
          });
      }
      res.json({Supplier: supplier});
  } catch (error) {
      return res.status(500).json({ message: error.message });
  }
};



export const searchSupplier = async (req, res) => {
  try {
      const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_NOMBRE', order = 'asc' } = req.query;
      const limit = parseInt(pageSize);
      const offset = (parseInt(page) - 1) * limit;

      const field = (
          orderByField === 'DSC_NOMBRE' || orderByField === 'ESTADO' || orderByField === 'ID_TIPOPROVEEDOR' 
      ) ? orderByField : 'DSC_NOMBRE';

      const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
      const expectedMatch = { [Op.like]: `%${termSearch}%` }; 

      const { count, rows } = await Supplier.findAndCountAll({
          attributes: {
              exclude: ['FEC_MODIFICADOEN', 'ID_PROVEEDOR'] 
          },
          limit,
          offset,
          order: [
              [field, sortOrder],
          ],
          where: {
              [Op.or]: [
                  { DSC_NOMBRE: expectedMatch }
              ]
          },
          include: [
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
              message: "No se encontraron proveedores.",
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
