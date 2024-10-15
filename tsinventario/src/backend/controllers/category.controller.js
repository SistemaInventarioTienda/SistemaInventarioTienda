import Category from "../models/category.model.js";
import {validateRegisterCat,saveCategory,updateCategory,getCategoryByName,disableCategory} from    "../logic/category/category.logic.js"
import { encryptData } from "../libs/encryptData.js";
import { getDateCR } from "../libs/date.js";
import {validateCategoryName} from "../logic/validateFields.logic.js";



//agregar categoria al sistema

export const addCategory = async (req, res) => {
    try {
        const {
            DSC_NOMBRE, ESTADO
        } = req.body;


        const validateFields = validateCategoryName(req);
        if(validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }
        
        const output = await validateRegisterCat(DSC_NOMBRE);
        if (output !== true) {
          return res.status(400).json({
            message: output,
          })
        }


        const status = await saveCategory(DSC_NOMBRE,ESTADO);
        if (status) {
          return res.status(201).json({
            message: ['Se ha guardado con exito la categoria'],
          })
        }else{
            return res.status(400).json({
                message: ['Error al guardar la categoria'],
              });
        }


       
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


//actualizar categoria

export const UpdateCategory = async (req, res) => {
    try {
        const {
            ID_CATEGORIA ,DSC_NOMBRE, ESTADO
        } = req.body;

        const validateFields = validateCategoryName(req);
        if(validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }

        const status = await updateCategory(DSC_NOMBRE,ESTADO,ID_CATEGORIA);
            
       return UpdateCategoryResponse(status, res);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};


export const UpdateCategoryResponse = (status, res) => {
    if (status === true) {
        return res.status(201).json({
            message: 'Se ha actualizado con éxito la categoría',
        });
    } else if (status === -1) {
        return res.status(404).json({
            message: 'Categoría no encontrada',
        });
    } else if (status === -2) {
        return res.status(404).json({
            message: 'Clave no encontrada',
        });
    }else if (status === -3) {
        return res.status(400).json({
            message: 'El nombre ya se encuentra registrado',
        });
    }else{
        return res.status(400).json({
            message: 'El nombre de la categoría ya existe o es inválido',
        });
    }
};



export const getAllCategories = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 2 } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const { count, rows } = await Category.findAndCountAll({
            attributes: {
                exclude: ['FEC_MODIFICADOEN']
            },
            limit,
            offset
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron Categorias.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            category: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const GetCategoryByName = async (req, res) => {
    try {
        const { DSC_NOMBRE } = req.body;

        const category = await getCategoryByName(DSC_NOMBRE);
        
        if (!category) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        }

        return res.status(200).json({ category });
    } catch (error) {
        return res.status(500).json({
            error: {
                message: "Ocurrió un error interno en el servidor",
                details: error.message
            }
        });
    }
};


export const DisableCategory = async (req, res) => {
    try {
        const { DSC_NOMBRE } = req.body; // Asumiendo que el nombre se pasa como parámetro de la URL

        const status = await disableCategory(DSC_NOMBRE);

        if (status === -2) {
            return res.status(404).json({ message: 'Categoría no encontrada' });
        } else if (status) {
            return res.status(200).json({ message: 'Categoría desactivada con éxito, puedes volverla a activar luego.' });
        } else {
            return res.status(400).json({ message: 'Error al desactivar la categoría' });
        }
    } catch (error) {
        return res.status(500).json({
            error: {
                message: "Ocurrió un error interno en el servidor",
                details: error.message
            }
        });
    }
};