import Transaction from "../models/transaction.model.js";
import { getDateCR } from '../libs/date.js';
export const createTransaction = async (req, res) => {

    const { METODO_PAGO, MONTO_PAGO, DSC_TRANSACCION, TIPO_TRANSACCION, ESTADO } = req.body;

    if(METODO_PAGO === "" || MONTO_PAGO === "" || DSC_TRANSACCION === "" || TIPO_TRANSACCION === "" || ESTADO === "") {
        return res.status(400).json({message : "Todos los campos son requeridos"})
    }

    const created_at = await getDateCR();
    const transaction = new Transaction({
        FEC_TRANSACCION: created_at,
        METODO_PAGO: METODO_PAGO,
        MONTO_PAGO: MONTO_PAGO,
        DSC_TRANSACCION: DSC_TRANSACCION,
        TIPO_TRANSACCION: TIPO_TRANSACCION,
        ESTADO: ESTADO
    })

    const transactionSaved = await transaction.save();
    if (transactionSaved) {
        return res.json({
            message: "Nueva transacción registrado con éxito."
        });
    }
}

export const updateTransaction = async (req, res) => {
    return res.status(200).json({ message: "Funciona" })
}


export const deleteTransaction = async (req, res) => {
    return res.status(200).json({ message: "Funciona" })
}

export const getAllTransactions = async (req, res) => {
    return res.status(200).json({ message: "Funciona" })
}

export const searchTransaction = async (req, res) => {
    return res.status(200).json({ message: "Funciona" })
}



