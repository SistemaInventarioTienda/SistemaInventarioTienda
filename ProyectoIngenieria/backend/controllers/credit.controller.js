import {credit, payment } from "../models/sale.model.js";
import { getDateCR } from "../libs/date.js";




export const addPayment = async (req, res) => {
    try {
        const {MON_ABONADO} = req.body;
        const date=await getDateCR();
        const creditId = await credit.findOne({
            where: { 
                ID_CREDITO: req.params.id,
                ESTADO_CREDITO: 1
            }
        });
        
        if(!creditId){
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

        const payRegist= new payment({
            ID_CREDITO: creditId.ID_CREDITO,
            FEC_ABONO: date,
            MON_ABONADO
        }
        )

        const addPay= payRegist.save();

        if (addPay) {
            creditId.MON_PENDIENTE -= MON_ABONADO;
            if( creditId.MON_PENDIENTE ===0){
                creditId.ESTADO_CREDITO = 0;
            }
            await creditId.save();
            res.status(201).json({ message: 'Abono registrado Correctamente' });   
        }
 
    } catch (error) {
        res.status(500).json({ message: 'Error al realizar el abono del credito', error });
    }
};
