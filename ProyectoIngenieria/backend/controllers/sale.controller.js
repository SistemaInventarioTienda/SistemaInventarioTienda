import { sale, details, credit } from "../models/sale.model.js";
import { getDateCR } from "../libs/date.js";
import { validatedetailsProduct } from "../logic/sale/sale.logic.js"; 
//import {  } from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';



export const createSale = async (req, res) => {
    const { ID_CLIENTE, PORCENT_IMPUESTO, METODO_PAGO, DSC_VENTA, ESTADO_CREDITO, MONT_SUBTOTAL, PORCENT_DESCUENTO, details_list, FEC_VENCIMIENTO } = req.body;

    try {

        const validateDetails = await validatedetailsProduct(details_list);
        if (validateDetails !== true) {
            return res.status(400).json({
                message: validateDetails,
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
            ID_CLIENTE,
            FEC_VENTA: date,
            PORCENT_IMPUESTO: porcentImpuesto,
            METODO_PAGO: metodoPago,
            DSC_VENTA: dscVenta,
            ESTADO_CREDITO: estadoCredito,
            MONT_SUBTOTAL: montSubtotal,
            PORCENT_DESCUENTO: porcentDescuento,
        });


        /*
        //para realizar validacion
         const productList = details_list
                .filter(detailsProd => detailsProd.ID_PRODUCTO && detailsProd.MONTO_UNITARIO >= 0 && detailsProd.CANTIDAD > 0)
                .map(detailsProd => ({
                    ID_VENTA: idSale,
                    ID_PRODUCTO: detailsProd.ID_PRODUCTO,
                    MONT_UNITARIO: detailsProd.MONTO_UNITARIO,
                    CANTIDAD: detailsProd.CANTIDAD,
                }));
        */ 

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

        if (estadoCredito && ID_CLIENTE>0) {
            await credit.create({
                ID_VENTA: idSale,
                FEC_ULTIMOPAGO: date,
                FEC_VENCIMIENTO: FEC_VENCIMIENTO,
                MON_PENDIENTE: montSubtotal,
                ESTADO_CREDITO: estadoCredito,
            });

        }

        res.status(201).json({ message: 'Venta realizada Correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al realizar la venta', error });
    }
};

