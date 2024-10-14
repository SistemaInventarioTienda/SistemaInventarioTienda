import Category from "../models/category.model.js";
import {validateRegisterCat,saveCategory,updateCategory} from    "../logic/category/category.logic.js"
import { encryptData } from "../libs/encryptData.js";
import { getDateCR } from "../libs/date.js";



//agregar categoria al sistema

export const addCategory = async (req, res) => {
    try {
        const {
            DSC_NOMBRE, ESTADO
        } = req.body;

        
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
                message: "No se encontraron usuarios.",
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
