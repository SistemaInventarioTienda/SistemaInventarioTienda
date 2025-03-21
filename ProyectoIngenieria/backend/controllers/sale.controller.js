import { sale, details, credit } from "../models/sale.model.js";
import { getDateCR } from "../libs/date.js";
import { validatedetailsProduct, validateStockProduct } from "../logic/sale/sale.logic.js";
//import {  } from "../logic/validateFields.logic.js";
import Product from "../models/product.model.js";
import Client from "../models/client.model.js";
import { Op } from 'sequelize';



export const createSale = async (req, res) => {
    const { ID_CLIENTE, PORCENT_IMPUESTO, METODO_PAGO, DSC_VENTA, ESTADO_CREDITO, MONT_SUBTOTAL, PORCENT_DESCUENTO, details_list, FEC_VENCIMIENTO } = req.body;

    try {

        let clientID = ID_CLIENTE && ID_CLIENTE > 0 ? ID_CLIENTE : null;

        if (clientID) {
            const client = await Client.findOne({ where: { DSC_CEDULA: ID_CLIENTE } });
            if (!client) {
                return res.status(400).json({ message: "Cliente no encontrado" });
            }
            clientID = client.ID_CLIENTE;
        }

        const validateDetails = await validatedetailsProduct(details_list);
        if (validateDetails !== true) {
            return res.status(400).json({
                message: validateDetails,
            });
        }

        const validateStock = await validateStockProduct(details_list);
        if (validateStock !== true) {
            return res.status(400).json({
                message: validateStock,
            });
        }

        let date = await getDateCR(); // probando validaciones de datos..

        let porcentImpuesto = PORCENT_IMPUESTO ?? 0;
        let porcentDescuento = PORCENT_DESCUENTO ?? 0;
        let dscVenta = (!DSC_VENTA || DSC_VENTA.trim() === "") ? "Gracias por la visita, vuelva pronto" : DSC_VENTA;
        let metodoPago = (!METODO_PAGO || METODO_PAGO.trim() === "") ? "Efectivo" : METODO_PAGO;
        let montSubtotal = (typeof MONT_SUBTOTAL === "number" && MONT_SUBTOTAL >= 0) ? MONT_SUBTOTAL : 0;
        let estadoCredito = +(ESTADO_CREDITO == 1);


        const crdSale = await sale.create({
            ID_CLIENTE: clientID,
            FEC_VENTA: date,
            PORCENT_IMPUESTO: porcentImpuesto,
            METODO_PAGO: metodoPago,
            DSC_VENTA: dscVenta,
            ESTADO_CREDITO: estadoCredito,
            MONT_SUBTOTAL: montSubtotal,
            PORCENT_DESCUENTO: porcentDescuento,
        });




        const idSale = crdSale.dataValues.ID_VENTA;

        if (idSale) {
            if (details_list && Array.isArray(details_list) && details_list.length > 0) {

                const productList = details_list.map(detailsProd => ({
                    ID_VENTA: idSale,
                    ID_PRODUCTO: detailsProd.ID_PRODUCTO,
                    MONT_UNITARIO: detailsProd.MONTO_UNITARIO,
                    CANTIDAD: detailsProd.CANTIDAD,
                }));

                await details.bulkCreate(productList);
            }
        }

        if (estadoCredito && ID_CLIENTE > 0) {
            await credit.create({
                ID_VENTA: idSale,
                FEC_ULTIMOPAGO: date,
                FEC_VENCIMIENTO: FEC_VENCIMIENTO,
                MON_PENDIENTE: montSubtotal,
                ESTADO_CREDITO: estadoCredito,
            });

        }

        if (details_list && Array.isArray(details_list) && details_list.length > 0) {

            await Promise.all(details_list.map(async (detailsProd) => {

                const product = await Product.findOne({
                    where: { ID_PRODUCT: detailsProd.ID_PRODUCTO }
                });

                if (product) {
                    const nuevaCantidad = product.CANTIDAD - detailsProd.CANTIDAD;

                    await Product.update(
                        { CANTIDAD: nuevaCantidad },
                        {
                            where: {
                                ID_PRODUCT: detailsProd.ID_PRODUCTO
                            }
                        }
                    );
                }
            }));

        }

        res.status(201).json({ message: 'Venta realizada Correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar la venta', error });
    }
};



export const getAllSales = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, orderByField = 'FEC_VENTA', order = 'desc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = ['FEC_VENTA', 'ESTADO_CREDITO', 'MONT_SUBTOTAL'].includes(orderByField) ? orderByField : 'FEC_VENTA';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await sale.findAndCountAll({
            attributes: { exclude: [] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: Client,
                    attributes: ['DSC_NOMBRE'],
                },
                {
                    model: details,
                    attributes: ['ID_DETALLEVENTA', 'ID_PRODUCTO', 'MONT_UNITARIO', 'CANTIDAD'],
                }
            ],
            distinct: true
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron Ventas.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            sales: rows.map(row => ({
                ID_VENTA: row.ID_VENTA,
                ID_CLIENTE: row.ID_CLIENTE,
                DSC_NOMBRE: row.Client ? row.Client.DSC_NOMBRE : 'Anónimo',
                FEC_VENTA: row.FEC_VENTA,
                PORCENT_IMPUESTO: row.PORCENT_IMPUESTO,
                METODO_PAGO: row.METODO_PAGO,
                DSC_VENTA: row.DSC_VENTA,
                ESTADO_CREDITO: row.ESTADO_CREDITO,
                MONT_SUBTOTAL: row.MONT_SUBTOTAL,
                PORCENT_DESCUENTO: row.PORCENT_DESCUENTO,
                DETALLES: row.details.map(detalle => ({
                    ID_DETALLEVENTA: detalle.ID_DETALLEVENTA,
                    ID_PRODUCTO: detalle.ID_PRODUCTO,
                    MONT_UNITARIO: detalle.MONT_UNITARIO,
                    CANTIDAD: detalle.CANTIDAD
                }))
            }))
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getSaleDetails = async (req, res) => {
    try {
        const { ID_VENTA } = req.body;

        // Buscar la venta principal
        const saleData = await sale.findOne({
            where: { ID_VENTA: ID_VENTA },
            include: [
                {
                    model: Client,
                    attributes: ['DSC_NOMBRE'],
                },
                {
                    model: details,
                    attributes: ['ID_DETALLEVENTA', 'ID_PRODUCTO', 'MONT_UNITARIO', 'CANTIDAD'],
                }
            ]
        });

        if (!saleData) {
            return res.status(404).json({ message: "Venta no encontrada." });
        }


        res.json({
            ID_VENTA: saleData.ID_VENTA,
            DSC_NOMBRE: saleData.Client ? saleData.Client.DSC_NOMBRE : 'Anónimo',
            FEC_VENTA: saleData.FEC_VENTA,
            PORCENT_IMPUESTO: saleData.PORCENT_IMPUESTO,
            METODO_PAGO: saleData.METODO_PAGO,
            DSC_VENTA: saleData.DSC_VENTA,
            ESTADO_CREDITO: saleData.ESTADO_CREDITO,
            MONT_SUBTOTAL: saleData.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: saleData.PORCENT_DESCUENTO,
            DETALLES: saleData.details.map(detalle => ({
                ID_DETALLEVENTA: detalle.ID_DETALLEVENTA,
                ID_PRODUCTO: detalle.ID_PRODUCTO,
                MONT_UNITARIO: detalle.MONT_UNITARIO,
                CANTIDAD: detalle.CANTIDAD
            }))
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};