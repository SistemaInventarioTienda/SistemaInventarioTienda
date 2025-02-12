import subcategory  from "../models/subcategory.model.js";
import Category from "../models/category.model.js";
import { getDateCR } from "../libs/date.js";
import {validateSubcategoryData} from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';





export const getAllSubcategories = async (req, res) => {
    try {
      
        const { page = 1, pageSize = 5, orderByField = 'DSC_NOMBRE', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

       
        const field = ['DSC_NOMBRE', 'ESTADO'].includes(orderByField) ? orderByField : 'DSC_NOMBRE';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

      
        const { count, rows } = await subcategory.findAndCountAll({
            attributes: { exclude: ['subcategoriamodificadoen','ID_SUBCATEGORIA','ID_CATEGORIA'] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: Category,
                    attributes: ['DSC_NOMBRE'],
                }
            ]
        });

     
        if (rows.length === 0) {
            return res.status(200).json({
                message: "No se encontraron subcategorias asociadas.",
            });
        }

        
        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            subcategory: rows
        });
        
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const createSubcategory = async (req, res) => {
    const { DSC_NOMBRE, ID_CATEGORIA, ESTADO } = req.body;

    try {
        const validateFields = validateSubcategoryData(req);
        if (validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            });
        }

        const date = new Date();
        const formattedDate = date.toISOString();

        await subcategory.create({
            DSC_NOMBRE,
            ID_CATEGORIA,
            ESTADO,
            FEC_CREADOEN: formattedDate,
        });

        res.status(201).json({ message: 'Subcategoría creada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la subcategoría', error });
    }
};
