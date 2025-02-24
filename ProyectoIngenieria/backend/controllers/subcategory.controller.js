import subcategory from "../models/subcategory.model.js";
import Category from "../models/category.model.js";
import { validateRegisterSubcategory, validateDeleteSubcategory, validateRegisterSubcategoryUpdate } from "../logic/subcategory/subcategory.logic.js";
import { getDateCR } from "../libs/date.js";
import { validateSubcategoryData } from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';





export const getAllSubcategories = async (req, res) => {
    try {

        const { page = 1, pageSize = 5, orderByField = 'DSC_NOMBRE', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;


        const field = ['DSC_NOMBRE', 'ESTADO'].includes(orderByField) ? orderByField : 'DSC_NOMBRE';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';


        const { count, rows } = await subcategory.findAndCountAll({
            attributes: { exclude: ['subcategoriamodificadoen'] },
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
        const suplierName = await validateRegisterSubcategory(DSC_NOMBRE, ID_CATEGORIA);
        if (suplierName !== true) {
            return res.status(400).json({
                message: suplierName,
            });
        }

        const date = new Date();
        const formattedDate = date.toISOString();

        subcategory.create({
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


export const UpdateSubcategory = async (req, res) => {
    const { ID_SUBCATEGORIA, DSC_NOMBRE, ID_CATEGORIA, ESTADO } = req.body;

    try {
        const validateFields = validateSubcategoryData(req);
        if (validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            });
        }
        const suplierName = await validateRegisterSubcategoryUpdate(DSC_NOMBRE, ID_CATEGORIA, ID_SUBCATEGORIA);
        if (suplierName !== true) {
            return res.status(400).json({
                message: suplierName,
            });
        }

        const date = await getDateCR();
        subcategory.update(
            {
                DSC_NOMBRE,
                ID_CATEGORIA,
                ESTADO,
                subcategoriamodificadoen: date,
            },
            { where: { ID_SUBCATEGORIA } }
        );
        res.status(201).json({ message: 'Subcategoría actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar la subcategoría', error });
    }
};



export const deleteSubcategory = async (req, res) => {
    const { ID_SUBCATEGORIA } = req.body;
    try {

        const subcategoryFound = await validateDeleteSubcategory(ID_SUBCATEGORIA);

        if (!subcategoryFound.exist) {
            return res.status(404).json({
                message: subcategoryFound.message,
            });
        }

        const subcategory = subcategoryFound.data;
        subcategory.ESTADO = 2;
        subcategory.subcategoriamodificadoen = await getDateCR();
        await subcategory.save();

        res.status(200).json({
            message: 'Subcategoria deshabilitada correctamente.'
        });
    } catch (error) {
        res.status(500).json({
            message: 'Error al deshabilitar la subcategoria.',
            error,
        });
    }
};


export const getAllSubcategoriesTypes = async (req, res) => {
    try {
        const subcategories = await subcategory.findAll({
            attributes: { exclude: ['subcategoriamodificadoen'] },
            order: [['DSC_NOMBRE', 'ASC']],
            include: [
                {
                    model: Category,
                    attributes: ['DSC_NOMBRE'],
                }
            ]
        });

        if (subcategories.length === 0) {
            return res.status(200).json({
                message: "No se encontraron subcategorías.",
            });
        }

        res.json({
            total: subcategories.length,
            subcategory: subcategories
        });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};