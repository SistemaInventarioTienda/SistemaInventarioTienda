import { sale, details, credit, db } from "../models/sale.model.js";
import { getDateCR } from "../libs/date.js";
import { getDiscount, getTaxes, validatedetailsProduct, validateStockProduct } from "../logic/sale/sale.logic.js";
import Product from "../models/product.model.js";
import Client from "../models/client.model.js";
import { Op } from 'sequelize';



export const createSale = async (req, res) => {
    const { ID_CLIENTE, PORCENT_IMPUESTO, METODO_PAGO, DSC_VENTA, ESTADO_CREDITO, MONT_SUBTOTAL, PORCENT_DESCUENTO, ESTADO, details_list, FEC_VENCIMIENTO } = req.body;

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
        // let montSubtotal = (typeof MONT_SUBTOTAL === "number" && MONT_SUBTOTAL >= 0)
        //     ? (() => {
        //         const discounted = MONT_SUBTOTAL - getDiscount(MONT_SUBTOTAL, PORCENT_DESCUENTO);
        //         return discounted + getTaxes(discounted, PORCENT_IMPUESTO);
        //     })()
        //     : 0;
        let montoSale = 0;
        let montSubtotal = (typeof MONT_SUBTOTAL === "number" && MONT_SUBTOTAL >= 0) ? MONT_SUBTOTAL : 0;
        // Calcular total para crédito, si aplica
        let montoTotalCredito = montSubtotal;
        let estadoCredito = +(ESTADO_CREDITO == 1);
        if (estadoCredito) {
            const montoConDescuento = montSubtotal - (montSubtotal * porcentDescuento / 100);
            montoTotalCredito = montoConDescuento + (montoConDescuento * porcentImpuesto / 100);

            montoSale =  montoTotalCredito;
            console.log("MONTO TOtal", montoTotalCredito);
        }else{
            montoSale = montSubtotal;
        }

        const crdSale = await sale.create({
            ID_CLIENTE: clientID,
            FEC_VENTA: date,
            PORCENT_IMPUESTO: porcentImpuesto,
            METODO_PAGO: metodoPago,
            DSC_VENTA: dscVenta,
            ESTADO_CREDITO: estadoCredito,
            MONT_SUBTOTAL: montoSale,
            PORCENT_DESCUENTO: porcentDescuento,
            ESTADO: ESTADO,
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
                MON_PENDIENTE: montoSale,
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

        const sales = await Promise.all(
            rows.map(async (row) => {
                const canCancel = !(await EightDaysHavePassed(row.FEC_VENTA));
                return {
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
                    ESTADO: row.ESTADO,
                    DETALLES: row.details.map((detalle) => ({
                        ID_DETALLEVENTA: detalle.ID_DETALLEVENTA,
                        ID_PRODUCTO: detalle.ID_PRODUCTO,
                        MONT_UNITARIO: detalle.MONT_UNITARIO,
                        CANTIDAD: detalle.CANTIDAD,
                    })),
                    CAN_CANCEL: canCancel,
                };
            })
        );
        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            sales: sales,
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
            return res.status(204).json({ message: "Venta no encontrada." });
        }


        const sales = await Promise.all(
            rows.map(async (row) => {
                const canCancel = !(await EightDaysHavePassed(row.FEC_VENTA));
                return {
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
                    DETALLES: row.details.map((detalle) => ({
                        ID_DETALLEVENTA: detalle.ID_DETALLEVENTA,
                        ID_PRODUCTO: detalle.ID_PRODUCTO,
                        MONT_UNITARIO: detalle.MONT_UNITARIO,
                        CANTIDAD: detalle.CANTIDAD,
                    })),
                    CAN_CANCEL: canCancel,
                };
            })
        );
        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            sales: sales,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchSales = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, termSearch = '' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;


        const results = await db.query(
            `CALL Sp_SearchSales(:termSearch, :page, :pageSize);`,
            {
                replacements: {
                    termSearch: `%${termSearch}%`,
                    page: parseInt(page),
                    pageSize: limit,
                },
                type: db.QueryTypes.SELECT,
            }
        );


        const parsedResults = JSON.parse(results[0][0].ResultadoJSON);


        if (!parsedResults || parsedResults.length === 0) {
            return res.status(204).json({
                message: "No se encontraron ventas.",
            });
        }


        const sales = [];

        parsedResults.forEach((data) => {
            if (data?.ID_VENTA) {
                let sale = sales.find((s) => s.ID_VENTA === data.ID_VENTA);
                if (!sale) {
                    sale = {
                        ID_VENTA: data.ID_VENTA,
                        ID_CLIENTE: data.ID_CLIENTE,
                        FEC_VENTA: data.FEC_VENTA,
                        PORCENT_IMPUESTO: data.PORCENT_IMPUESTO,
                        METODO_PAGO: data.METODO_PAGO,
                        DSC_VENTA: data.DSC_VENTA,
                        MONT_SUBTOTAL: data.MONT_SUBTOTAL,
                        PORCENT_DESCUENTO: data.PORCENT_DESCUENTO,
                        ESTADO: data.ESTADO,
                        DSC_NOMBRE: data.DSC_CLIENTE_NOMBRE,
                        Client: {
                            DSC_NOMBRE: data.DSC_CLIENTE_NOMBRE,
                            DSC_APELLIDOUNO: data.DSC_CLIENTE_APELLIDO_UNO,
                            DSC_APELLIDODOS: data.DSC_CLIENTE_APELLIDO_DOS,
                        },
                        DETALLES: [],
                    };

                    sales.push(sale);
                }

                if (data.ID_PRODUCTO) {
                    sale.DETALLES.push({
                        CANTIDAD: data.CANTIDAD,
                        MONT_UNITARIO: data.MONT_UNITARIO,
                        DSC_NOMBRE: data.DSC_PRODUCTO_NOMBRE,
                        ID_PRODUCTO: data.ID_PRODUCTO,
                        Product: {
                            DSC_NOMBRE: data.DSC_PRODUCTO_NOMBRE,
                            MON_VENTA: data.MON_PRODUCTO_VENTA,
                            ID_PRODUCT: data.ID_PRODUCTO,
                        },
                    });
                }
            }
        });


        res.json({
            total: sales.length,
            totalPages: Math.ceil(sales.length / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            sales: sales.slice(offset, offset + limit),
        });
    } catch (error) {
        console.error("Error al buscar ventas:", error);
        return res.status(500).json({
            message: "Error interno del servidor. Por favor, intenta de nuevo.",
        });
    }
};

async function EightDaysHavePassed(dateSale) {
    const currentDate = await getDateCR();

    const eightDaysAgo = new Date(currentDate);
    eightDaysAgo.setDate(eightDaysAgo.getDate() - 8);

    return dateSale <= eightDaysAgo;
}


export const deleteSale = async (req, res) => {

    try {
        const id = req.params.id;

        const saleFound = await sale.findOne({ where: { ID_VENTA: id } })
        const creditFound = await credit.findOne({ where: { ID_VENTA: id } })
        const messages = [];
        if (creditFound) {
            if (creditFound.MON_PENDIENTE <= 0) {
                return res.status(400).json({ message: "No se puede anular un credito que ya fue cancelado," });
            }

            creditFound.ESTADO_CREDITO = 2;
            creditFound.save();
            messages.push("Crédito eliminado correctamente.");
        }

        if (!saleFound) {
            return res.status(400).json({ message: "Venta no encontrada" });
        }

        if (await EightDaysHavePassed(new Date(saleFound.FEC_VENTA))) {
            return res.status(400).json({ message: "No se puede anular la venta, dias excedidos." });
        }


        saleFound.ESTADO = 2;
        saleFound.save();
        await db.transaction(async (t) => {
            const productList = await details.findAll({
                where: { ID_VENTA: id },
                attributes: ['ID_PRODUCTO', 'CANTIDAD'],
                include: [{
                    model: Product,
                    attributes: ['ID_PRODUCT', 'CANTIDAD']
                }],
                transaction: t
            });

            for (const item of productList) {
                const cantidadDevuelta = item.CANTIDAD;
                const producto = item.Product;

                if (producto) {
                    await Product.update(
                        {
                            CANTIDAD: producto.CANTIDAD + cantidadDevuelta
                        },
                        {
                            where: { ID_PRODUCT: producto.ID_PRODUCT },
                            transaction: t
                        }
                    );
                }
            }
        });

        messages.push("Venta eliminada correctamente.");
        res.status(201).json({ message: messages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar la venta', error });
    }
};
