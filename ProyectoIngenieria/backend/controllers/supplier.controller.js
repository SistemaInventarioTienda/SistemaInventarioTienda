import { Supplier, mailSupplier, numberSupplier, supplierType } from "../models/supplier.model.js";
import { validateRegisterSupplier, validateRegisterSupplierUpdate, validateRegisterEmails, validateRegisterPhones, validateEqualsEmailsSupplier, validateEqualsPhonesSupplier, validatIbanAccount } from "../logic/supplier/supplier.logic.js"
import { getDateCR } from "../libs/date.js";
import { validateSupplierData, validateSupplierDataUpdate } from "../logic/validateFields.logic.js";
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
            attributes: { exclude: ['FEC_MODIFICADOEN', 'ID_PROVEEDOR'] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: numberSupplier, //"ID_TELEFONOCPROVEEDOR",
                    attributes: ["ID_TELEFONOPROVEEDOR",'DSC_TELEFONO'],
                },
                {
                    model: mailSupplier,//"ID_CORREOPROVEEDOR",
                    attributes: ["ID_CORREOPROVEEDOR",'DSC_CORREO'],
                },
                {
                    model: supplierType,
                    attributes: ['DSC_NOMBRE']
                }
            ],
            distinct: true
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
    // console.log("Hola estamos en [createSupplier] y estos son los datos: ", req.body);
    // console.log("phones: ", req.body.phones);
    // console.log("emails: ", req.body.emails);
    const { DSC_DIRECCIONEXACTA, DSC_VENTA, DSC_NOMBRE, CTA_BANCARIA, ID_TIPOPROVEEDOR, ESTADO, phones, emails } = req.body;

    try {
        const date = await getDateCR();
        const validateFields = validateSupplierData(req);
        if (validateFields !== true) {
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

        const validateIban = await validatIbanAccount(CTA_BANCARIA);
        if (validateIban !== true) {
            return res.status(400).json({
                message: validateIban,
            });
        }

        const validatePhones = await validateEqualsPhonesSupplier(phones);
        if (validatePhones !== true) {
            return res.status(400).json({
                message: validatePhones,
            });
        }
        const validateEmails = await validateEqualsEmailsSupplier(emails);
        if (validateEmails !== true) {
            return res.status(400).json({
                message: validateEmails,
            });
        }

        const phoneNumbers = phones.map(phone => phone.DSC_TELEFONO);
        const emailAddresses = emails.map(email => email.DSC_CORREO);


        const validatePhone = await validateEqualsPhonesSupplier(phoneNumbers);
        if (validatePhone !== true) {
            return res.status(400).json({
                message: validatePhone,
            });
        }
        const validateEmail = await validateEqualsEmailsSupplier(emailAddresses);
        if (validateEmail !== true) {
            return res.status(400).json({
                message: validateEmail,
            });
        }

        const numberValidation = await validateRegisterPhones(phoneNumbers);
        if (numberValidation !== true) {
            return res.status(400).json({
                message: numberValidation,
            });
        }

        const emailValidation = await validateRegisterEmails(emailAddresses);
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

        if (phones && Array.isArray(phoneNumbers) && phoneNumbers.length > 0) {
            const phoneRecords = phoneNumbers.map(phone => ({
                ID_PROVEEDOR: supplier.ID_PROVEEDOR,
                DSC_TELEFONO: phone,
                FEC_CREADOEN: date,
                ESTADO: 1,
            }));

            await numberSupplier.bulkCreate(phoneRecords);
        }

        if (emails && Array.isArray(emailAddresses) && emailAddresses.length > 0) {
            const emailRecords = emailAddresses.map(email => ({
                ID_PROVEEDOR: supplier.ID_PROVEEDOR,
                DSC_CORREO: email,
                FEC_CREADOEN: date,
                ESTADO: 1,
            }));

            await mailSupplier.bulkCreate(emailRecords);
        }

        res.status(201).json({ message: 'Proveedor creado Correctamente' });
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

export const getAllSupplierWithoutPagination = async (req, res) => {
    try {
        const suppliers = await Supplier.findAll({ 
            attributes: { exclude: ['FEC_MODIFICADOEN', 'ID_PROVEEDOR'] },
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
            ],
        });

        res.status(200).json({ suppliers });
    } catch (error) {
        console.error('Error al obtener los proveedores sin paginación:', error);
        res.status(500).json({ message: 'Error desconocido', error });
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
    //console.log("req.body [updatedSupplier]", req.body.DSC_DIRECCIONEXACTA);
    const { IDENTIFICADOR_PROVEEDOR, DSC_DIRECCIONEXACTA, DSC_VENTA, CTA_BANCARIA, DSC_NOMBRE, ID_TIPOPROVEEDOR, ESTADO, phones, emails } = req.body;

    console.log(
        "Hola estamos en [updateSupplier] y estos son los datos del backend: ",
        req.body
      );
    try {
        const date = await getDateCR();
        const supplier = await Supplier.findOne({where: {IDENTIFICADOR_PROVEEDOR: IDENTIFICADOR_PROVEEDOR}});

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

        const validateIban = await validatIbanAccount(CTA_BANCARIA);
        if (validateIban !== true) {
            return res.status(400).json({
                message: validateIban,
            });
        }

        //const phoneNumbers = phones.map(phone => phone.DSC_TELEFONO);
        

        let updatedData = {
            DSC_NOMBRE,
            ID_TIPOPROVEEDOR,
            DSC_DIRECCIONEXACTA,
            DSC_VENTA,
            CTA_BANCARIA,
            ESTADO,
            FEC_MODIFICADOEN: date,
        };

        const phoneNumbers = phones.map(phone => phone.DSC_TELEFONO);
        const emailAddresses = emails.map(email => email.DSC_CORREO);


        // const validatePhones = await validateEqualsPhonesSupplier(phoneNumbers);
        // if (validatePhones !== true) {
        //     return res.status(400).json({
        //         message: validatePhones,
        //     });
        // }
        // const validateEmail = await validateEqualsEmailsSupplier(emailAddresses);
        // if (validateEmail !== true) {
        //     return res.status(400).json({
        //         message: validateEmail,
        //     });
        // }

        // const numberValidation = await validateRegisterPhones(phoneNumbers);
        // if (numberValidation !== true) {
        //     return res.status(400).json({
        //         message: numberValidation,
        //     });
        // }

        // const emailValidation = await validateRegisterEmails(emailAddresses);
        // if (emailValidation !== true) {
        //     return res.status(400).json({
        //         message: emailValidation,
        //     });
        // }



        //---------validacion de los telefonos y correos---------
        const validatePhones = await validatePhonesSupplierUpdate(phoneNumbers, supplier.ID_PROVEEDOR);
        if (Array.isArray(validatePhones)) {
            return res.status(400).json({
                message: validatePhones[0], // Accede al primer mensaje de error
            });
        }
        
        const validateEmails = await validateEmailsSupplierUpdate(emailAddresses, supplier.ID_PROVEEDOR);
        if (Array.isArray(validateEmails)) {
            return res.status(400).json({
                message: validateEmails[0], // Accede al primer mensaje de error
            });
        }
        await Supplier.update(
            updatedData, { where: { IDENTIFICADOR_PROVEEDOR } }
        );
        //--------------------------------------------------------

        //manejo de los telefonos
        if ((phones && phones.length > 0) ) { //|| (emails && emails.length > 0)
            //console.log("Entro al if para modificar los telefonos o los correos");

            const existingPhones = await numberSupplier.findAll({
                where: {ID_PROVEEDOR: supplier.ID_PROVEEDOR},
                attributes: ['ID_TELEFONOPROVEEDOR'],
            });

            const existingPhoneIds = existingPhones.map(phone => phone.ID_TELEFONOPROVEEDOR);
            console.log("Telefonos Existentes [existingPhones]: ", existingPhoneIds);
            
            const phoneIdInRequest = phones
            .filter(phone => phone.ID_TELEFONOCPROVEEDOR)
            .map(phone => phone.ID_TELEFONOCPROVEEDOR);
           
            const phonesToDelete = existingPhoneIds.filter(id => !phoneIdInRequest.includes(id));
            if (phonesToDelete.length > 0) {
                await numberSupplier.destroy({
                    where: {ID_TELEFONOPROVEEDOR: phonesToDelete}
                });
            }

            

            for (const phone of phones) {
                const { ID_TELEFONOCPROVEEDOR, DSC_TELEFONO } = phone;

                if (ID_TELEFONOCPROVEEDOR) {
                    await numberSupplier.update(
                        {DSC_TELEFONO: DSC_TELEFONO},
                        {where: {ID_TELEFONOPROVEEDOR: ID_TELEFONOCPROVEEDOR}}
                    );
                } else {
                    await numberSupplier.create({
                        ID_PROVEEDOR: supplier.ID_PROVEEDOR,
                        DSC_TELEFONO: DSC_TELEFONO,
                        FEC_CREADOEN: date,
                        ESTADO: 1,
                    });
                }
            }

        } else {
            await numberSupplier.destroy({
                where: {ID_PROVEEDOR: supplier.ID_PROVEEDOR}
            })
        }

        if (emails && emails.length > 0) {
            
            const existingEmails = await mailSupplier.findAll({
                where: {ID_PROVEEDOR: supplier.ID_PROVEEDOR},
                attributes: ['ID_CORREOPROVEEDOR'],
            });
        
            const existingEmailIds = existingEmails.map(email => email.ID_CORREOPROVEEDOR);
            const emailIdsInRequest = emails.filter(email => email.ID_CORREOPROVEEDOR).map(email => email.ID_CORREOPROVEEDOR);

            const emailsToDelete = existingEmailIds.filter(id => !emailIdsInRequest.includes(id));
            if (emailsToDelete.length > 0) {
                await mailSupplier.destroy({
                    where: {ID_CORREOPROVEEDOR: emailsToDelete}
                });
            }
            
            //Actualizar o crear correos.
            for (const email of emails) {
                const { ID_CORREOPROVEEDOR, DSC_CORREO } = email;

                console.log("Entro al for para modificar el correo/nId del correo: ", ID_CORREOPROVEEDOR);
                if (ID_CORREOPROVEEDOR) {
                    await mailSupplier.update(
                        {DSC_CORREO: DSC_CORREO},
                        {where: {ID_CORREOPROVEEDOR: ID_CORREOPROVEEDOR}}
                    );
                } else {
                    console.log("Entro al else para crear el correo");
                    await mailSupplier.create({
                        ID_PROVEEDOR: supplier.ID_PROVEEDOR,
                        DSC_CORREO: DSC_CORREO,
                        FEC_CREADOEN: date,
                        ESTADO: 1,
                    });
                }
                
            }
        } else {
            await mailSupplier.destroy({
                where: {ID_PROVEEDOR: supplier.ID_PROVEEDOR}
            })
        }

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
        res.json({ Supplier: supplier });
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


async function validatePhonesSupplierUpdate(phones, supplierId) {
    const existingPhones = await numberSupplier.findAll({
        where: {
            DSC_TELEFONO: { [Op.in]: phones },
            ID_PROVEEDOR: { [Op.ne]: supplierId } 
        },
        attributes: ['DSC_TELEFONO']
    });

    if (existingPhones.length > 0) {
        const existingNumbers = existingPhones.map(phone => phone.DSC_TELEFONO);
        return [`Hay números de teléfono en uso por otro proveedor: ${existingNumbers.join(', ')}.`];
    }

   return false;
}

async function validateEmailsSupplierUpdate(emails, supplierId) {
    try {
        // Consulta los correos electrónicos existentes en la base de datos
        const existingEmails = await mailSupplier.findAll({
            where: { 
                DSC_CORREO: { [Op.in]: emails },
                ID_PROVEEDOR: { [Op.ne]: supplierId } // Excluir el proveedor actual
            },
            attributes: ['DSC_CORREO'] // Solo seleccionamos el campo DSC_CORREO
        });

        // Si hay correos electrónicos en uso por otros proveedores, devolver un mensaje de error
        if (existingEmails.length > 0) {
            const duplicateEmails = existingEmails.map(email => email.DSC_CORREO); // Extraer los correos
            return [`Hay correos en uso por otro proveedor: ${duplicateEmails.join(', ')}.`];
        }

        // Si no hay conflictos, devolver false
        return false;
    } catch (error) {
        console.error("Error en validateEmailsSupplierUpdate:", error);
        throw error; // Propagar el error para manejarlo en el nivel superior
    }
}