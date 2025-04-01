import { credit, payment } from "../models/sale.model.js";
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
