import Transaction from "../models/transaction.model.js";
import { getDateCR } from '../libs/date.js';
import { Op, Sequelize  } from 'sequelize';

export const createTransaction = async (req, res) => {

    const { METODO_PAGO, MONTO_PAGO, DSC_TRANSACCION, TIPO_TRANSACCION, ESTADO } = req.body;

    if (METODO_PAGO === "" || MONTO_PAGO === "" || DSC_TRANSACCION === "" || TIPO_TRANSACCION === "" || ESTADO === "") {
        return res.status(400).json({ message: "Todos los campos son requeridos" })
    }

    if (isNaN(Number(MONTO_PAGO)) || isNaN(Number(ESTADO)))
        return res.status(400).json({ message: "El método de pago y el estado deben ser números válidos" });

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
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, orderByField = 'FEC_TRANSACCION', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (

            orderByField === 'METODO_PAGO' || orderByField === 'DSC_TRANSACCION' || orderByField === 'TIPO_TRANSACCION' || orderByField === 'ESTADO'

        ) ? orderByField : 'FEC_TRANSACCION';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const { count, rows } = await Transaction.findAndCountAll({
            attributes: {
                exclude: ['ID_TRANSACCION']
            },
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],

            raw: true

        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron transacciones.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            transaction: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const searchTransaction = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'FEC_TRANSACCION', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'METODO_PAGO' || orderByField === 'DSC_TRANSACCION' || orderByField === 'TIPO_TRANSACCION' || orderByField === 'ESTADO'
        ) ? orderByField : 'FEC_TRANSACCION';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const expectedMatch = { [Op.like]: `%${termSearch}%` };
        const { count, rows } = await Transaction.findAndCountAll({
            attributes: {
                exclude: ['ID_TRANSACCION']
            },
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            where: {
                [Op.or]: [
                    { METODO_PAGO: expectedMatch },
                    { DSC_TRANSACCION: expectedMatch },
                    { TIPO_TRANSACCION: expectedMatch },
                    Sequelize.where(Sequelize.cast(Sequelize.col('MONTO_PAGO'), 'TEXT'), {
                        [Op.like]: `%${termSearch}%`
                    }),
                    Sequelize.where(Sequelize.cast(Sequelize.col('FEC_TRANSACCION'), 'TEXT'), {
                        [Op.like]: `%${termSearch}%`
                    })
                ]
            },
            raw: true
        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron transacciones.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            transaction: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}



