import { credit, payment,sale } from "../models/sale.model.js";
import Client from "../models/client.model.js";
import { getDateCR } from "../libs/date.js";




export const addPayment = async (req, res) => {
    try {
        const { MON_ABONADO } = req.body;
        const date = await getDateCR();
        const creditId = await credit.findOne({
            where: {
                ID_CREDITO: req.params.id,
                ESTADO_CREDITO: 1
            }
        });

        if (!creditId) {
            return res.status(404).json({
                message: "Credito no disponible para abonar."
            })
        }

        if (MON_ABONADO > creditId.MON_PENDIENTE) {
            return res.status(400).json({ message: 'El monto a rebajar es mayor que el saldo pendiente' });
        }

        if (MON_ABONADO <= 0) {
            return res.status(400).json({ message: 'Monto no permitido' });
        }

        const payRegist = new payment({
            ID_CREDITO: creditId.ID_CREDITO,
            FEC_ABONO: date,
            MON_ABONADO
        }
        )

        const addPay = payRegist.save();

        if (addPay) {
            creditId.MON_PENDIENTE -= MON_ABONADO;
            if (creditId.MON_PENDIENTE === 0) {
                creditId.ESTADO_CREDITO = 0;
            }
            creditId.FEC_ULTIMOPAGO = date;
            await creditId.save();
            res.status(201).json({ message: 'Abono registrado Correctamente' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el abono del credito', error });
    }
};




export const modifyPayment = async (req, res) => {
    try {
        const { MON_ABONADO } = req.body;
        const date = await getDateCR();
        const paymentObj = await payment.findOne({
            where: {
                ID_ABONO: req.params.id
            }
        });
        if (!paymentObj) {
            return res.status(404).json({
                message: "El Abono seleccionado no se encuentra en el sistema."
            })
        }

        

        const fechaAbono = new Date(paymentObj.FEC_ABONO);
        const fechaActual = new Date(await getDateCR());

        const diferenciaMs = Math.abs(fechaActual - fechaAbono);
        const diferenciaMinutos = diferenciaMs / (1000 * 60);


        if (diferenciaMinutos > 30) {
            return res.status(400).json({
                message: "No se puede procesar el abono, tiempo limite excedido."
            });
        }

        const creditId = await credit.findOne({
            where: {
                ID_CREDITO: paymentObj.ID_CREDITO,
                ESTADO_CREDITO: 1
            }
        });
        if (!creditId) {
            return res.status(404).json({
                message: "Credito no disponible para abonar."
            })
        }

        creditId.MON_PENDIENTE += paymentObj.MON_ABONADO;


        if (MON_ABONADO > creditId.MON_PENDIENTE) {
            return res.status(400).json({ message: 'El monto a rebajar es mayor que el saldo pendiente' });
        }

        if (MON_ABONADO <= 0) {
            return res.status(400).json({ message: 'Monto no permitido' });
        }


        paymentObj.FEC_ABONO = date;
        paymentObj.MON_ABONADO = MON_ABONADO;


        const addPay = paymentObj.save();

        if (addPay) {
            creditId.MON_PENDIENTE -= MON_ABONADO;
            if (creditId.MON_PENDIENTE === 0) {
                creditId.ESTADO_CREDITO = 0;
            }
            creditId.FEC_ULTIMOPAGO = date;
            await creditId.save();
            res.status(201).json({ message: 'Abono actualizado correctamente' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el abono del credito', error });
    }
};





export const getAllPaymentByCredit = async (req, res) => {
    try {
        const { page = 1, pageSize = 5, orderByField = 'FEC_VENCIMIENTO', order = 'desc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = ['FEC_VENCIMIENTO', 'ESTADO_CREDITO', 'MON_PENDIENTE','FEC_ULTIMOPAGO'].includes(orderByField) ? orderByField : 'FEC_VENTA';
        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';

        const { count, rows } = await credit.findAndCountAll({
            attributes: { exclude: [] },
            limit,
            offset,
            order: [[field, sortOrder]],
            include: [
                {
                    model: sale, 
                    attributes: ['ID_VENTA'],
                    include: [
                        {
                            model: Client,
                            attributes: ['DSC_NOMBRE']
                        }
                    ]
                },
                {
                    model: payment,
                    attributes: ['ID_ABONO','FEC_ABONO', 'MON_ABONADO'],
                }
            ],
            distinct: true
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron abonos realizados.",
            });
        }

       
        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            sales: rows,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};