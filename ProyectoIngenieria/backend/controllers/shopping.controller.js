import User from '../models/user.model.js';
import { Supplier } from '../models/supplier.model.js';
import Shopping from '../models/shopping.model.js';
import Details_Shopping from '../models/shopping_details.model.js';
import { getDateCR } from '../libs/date.js';
import { QueryTypes } from 'sequelize';
import db from '../db.js';
import Product from '../models/product.model.js';   

export const getAllShoppings = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, orderByField = 'FEC_CREATED_AT', order = 'desc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = ['FEC_COMPRA', 'FEC_ENTRADA', 'MON_TOTAL', 'DSC_METODO_PAGO', 'PROVEEDOR'].includes(orderByField)
            ? orderByField
            : 'FEC_CREATED_AT';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const [results, totalResults] = await db.query(
            'CALL sp_getAllShoppings(:field, :sortOrder, :limit, :offset)',
            {
                replacements: { field, sortOrder, limit, offset },
                type: QueryTypes.SELECT
            });

        if (!results || results.length === 0) {
            return res.status(204).json({ message: "No se encontraron compras." });
        }

        const total = totalResults[0]?.total || 0;

        const cleanedResults = clearShoppingDetails(results);

        const shoppingsResults = await Promise.all(
            Object.values(cleanedResults).map(async (shopping) => {
                const canCancel = !(await EightDaysHavePassed(shopping.FEC_COMPRA));
                return {
                    ...shopping,
                    CAN_CANCEL: canCancel
                };
            })
        );

        res.json({
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            shopping: shoppingsResults
        });

    } catch (error) {
        console.error("Error en getAllShoppings:", error);
        return res.status(500).json({ message: error.message });
    }
};

export const searchShopping = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'FEC_CREATED_AT', order = 'desc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'FEC_COMPRA' || orderByField === 'FEC_ENTRADA' || orderByField === 'MON_TOTAL' ||
            orderByField === 'DSC_METODO_PAGO' || orderByField === 'PROVEEDOR' || orderByField === 'PRODUCTO' || orderByField === 'ESTADO'
        ) ? orderByField : 'FEC_CREATED_AT';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const [results] = await db.query(
            'CALL sp_searchShoppings(:field, :sortOrder, :limit, :offset, :expectedMatch)',
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
                message: "No se encontraron compras.",
            });
        }

        const cleanedResults = clearShoppingDetails(results);

        const shoppingsResults = await Promise.all(
            Object.values(cleanedResults).map(async (shopping) => {
                const canCancel = !(await EightDaysHavePassed(shopping.FEC_COMPRA));
                return {
                    ...shopping,
                    CAN_CANCEL: canCancel
                };
            })
        );

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            shopping: shoppingsResults
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const registerShopping = async (req, res) => {
    try {
        const {
            FEC_COMPRA = null, FEC_ENTRADA = null, DSC_METODO_PAGO = null, ID_PROVEEDOR = null, PRODUCTS_LIST = null
        } = req.body;


        const userFound = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: {
                DSC_CEDULA: req.user?.id,
                ESTADO: 1
            }
        });
        if (!userFound) {
            return res.status(400).json({ message: "Invalid request." })
        }

        // creating the product
        const currentDate = await getDateCR();
        const isValid = validateregister({
            FEC_COMPRA: currentDate,
            FEC_ENTRADA: FEC_ENTRADA,
            DSC_METODO_PAGO: DSC_METODO_PAGO,
            ID_PROVEEDOR: ID_PROVEEDOR,
            PRODUCTS_LIST: PRODUCTS_LIST
        });
        if (isValid?.status === 400) {
            return res.status(400).json({ message: isValid.user_message });
        }

        const supplierFound = await Supplier.findOne({
            attributes: ['ID_PROVEEDOR'],
            where: {
                IDENTIFICADOR_PROVEEDOR: ID_PROVEEDOR,
                ESTADO: 1
            }
        });

        if (!supplierFound) {
            return res.status(400).json({ message: "Invalid request." })
        }


        const newShopping = new Shopping({
            FEC_COMPRA: currentDate,
            FEC_ENTRADA: FEC_ENTRADA,
            FEC_CREATED_AT: currentDate,
            ESTADO: 1,
            MON_TOTAL: 0,
            DSC_METODO_PAGO: DSC_METODO_PAGO,
            ID_PROVEEDOR: supplierFound.ID_PROVEEDOR,
            CREATED_BY_USER: userFound.ID_USUARIO
        });

        const shoppingSaved = await newShopping.save();
        if (!shoppingSaved) {
            return res.status(400).json({ message: "Error al registrar la compra" });
        }

        const detailsShoppingErrors = [];
        let sumTotal = 0;
        for (const product of PRODUCTS_LIST) {
            try {
                const newDetail = new Details_Shopping({
                    ESTADO: 1,
                    MON_PRECIO_COMPRA: product.MON_PRECIO_COMPRA,
                    MON_CANTIDAD: product.MON_CANTIDAD,
                    DSC_CODIGO_BARRAS: product.DSC_CODIGO_BARRAS,
                    ID_COMPRA: shoppingSaved.ID_COMPRA
                });

                const detailsSaved = await newDetail.save();
                if (detailsSaved) {
                    sumTotal = sumTotal + (product.MON_PRECIO_COMPRA*product.MON_CANTIDAD)
                    const productFound = await Product.findOne({
                        attributes: ['ID_PRODUCT', 'CANTIDAD'],
                        where: {
                            DSC_CODIGO_BARRAS: product.DSC_CODIGO_BARRAS
                        }
                    })
                    if(productFound) {
                        productFound.CANTIDAD = productFound.CANTIDAD + product.MON_CANTIDAD
                        productFound.save();
                    }
                }

            } catch (err) {
                detailsShoppingErrors.push(`Error al agregar el producto con código de barras: ${product.DSC_CODIGO_BARRAS}`);
            }
        }

        // Actualizar el monto total
        shoppingSaved.MON_TOTAL = sumTotal;
        shoppingSaved.save();

        return res.status(200).json({ message: "Compra registrada con éxito.", errors: detailsShoppingErrors ? detailsShoppingErrors : null });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const deleteShopping = async (req, res) => {
    try {
        const shopping = await Shopping.findOne({
            attributes: ['ID_COMPRA', 'UPDATED_BY_USER', 'FEC_UPDATE_AT'],
            where: { ID_COMPRA: req.params.id }
        });
        if (!shopping) {
            return res.status(404).json({ message: "Compra no encontrada." });
        }


        const user = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: { DSC_CEDULA: req.user.id }
        })

        if (!user) {
            return res.status(404).json({ message: "El usuario no tiene permiso de anular la compra." })
        }

        const currentDate = await getDateCR();
        if (!EightDaysHavePassed(shopping.FEC_COMPRA)) {
            return res.status(404).json({ message: "El tiempo para anular la venta ha expirado." });
        }
        await shopping.update(
            {
                ESTADO: 2,
                UPDATED_BY_USER: user.ID_USUARIO,
                FEC_UPDATE_AT: currentDate
            },
            {
                where: { ID_COMPRA: req.params.id }
            }
        );

        return res.status(200).json({ message: "Compra anulada con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//======================== REGISTRO DE PRODUCTOS ======================== 

async function EightDaysHavePassed(dateShopping) {
    const currentDate = await getDateCR();

    const currentDateMidnight = new Date(currentDate);
    currentDateMidnight.setHours(0, 0, 0, 0);

    const eightDaysAgo = new Date(currentDateMidnight);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    const shoppingDate = new Date(dateShopping);
    shoppingDate.setHours(0, 0, 0, 0);

    return shoppingDate <= eightDaysAgo;
}

//======================== REGISTRO DE PRODUCTOS ========================

function validateregister(elements) {
    for (const key in elements) {
        if (!elements[key]) {
            return { status: 400, user_message: `El campo ${key} no puede estar vacio.` }
        }
    }
    return true;
}


// 
const clearShoppingDetails = (data) => {
    if (data && typeof data === 'object') {
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const shopping = data[key];
                if (shopping.PRODUCTS_LISTS) {
                    try {
                        shopping.PRODUCTS_LISTS = JSON.parse(shopping.PRODUCTS_LISTS)
                    } catch (e) {
                        console.error(`Error al analizar Lista de productos para compra ${compra.ID_COMPRA}:`, error);
                        shopping.PRODUCTS_LISTS = [];
                    }
                }
                if (shopping.DETALLE_PRODUCTO && typeof shopping.DETALLE_PRODUCTO === 'string') {
                    try {
                        const parsedDetail = JSON.parse(shopping.DETALLE_PRODUCTO);
                        shopping.DETALLE_PRODUCTO = typeof parsedDetail === 'object' ? parsedDetail : "";
                    } catch (error) {
                        console.error(`Error al analizar DETALLE_PRODUCTO para compra ${shopping.ID_COMPRA}:`, error);
                        shopping.DETALLE_PRODUCTO = "";
                    }
                }
            }
        }
    }
    return data;
}
