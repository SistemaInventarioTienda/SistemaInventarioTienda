import Transaction from "../models/transaction.model.js";
import { getDateCR } from '../libs/date.js';
import { Op, Sequelize } from 'sequelize';
import User from "../models/user.model.js";

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
    try {
        const { METODO_PAGO, MONTO_PAGO, DSC_TRANSACCION, TIPO_TRANSACCION, ESTADO } = req.body;

        if (METODO_PAGO === "" || MONTO_PAGO === "" || DSC_TRANSACCION === "" || TIPO_TRANSACCION === "" || ESTADO === "") {
            return res.status(400).json({ message: "Todos los campos son requeridos." })
        }

        if (isNaN(Number(MONTO_PAGO)) || isNaN(Number(ESTADO)))
            return res.status(400).json({ message: "El método de pago y el estado deben ser números válidos." });

        const transaction = await Transaction.findOne({ where: { ID_TRANSACCION: req.params.id } });
        if (!transaction) return res.status(404).json({ message: "Transacción no encontrada." });

        const TimeHasPassed = await timeHasPassed(transaction.FEC_TRANSACCION); // tiempo de 24h
        if (TimeHasPassed) 
            return res.status(404).json({ message: "El tiempo para modificar una transacción ha expirado." });

        await transaction.update({
            METODO_PAGO: METODO_PAGO,
            MONTO_PAGO: MONTO_PAGO,
            DSC_TRANSACCION: DSC_TRANSACCION,
            TIPO_TRANSACCION: TIPO_TRANSACCION,
            ESTADO: ESTADO
        })

        return res.status(200).json({message: "Transacción actualizada con éxito."})
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}


export const deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            attributes: ['ID_TRANSACCION', 'FEC_TRANSACCION'],
            where: { ID_TRANSACCION: req.params.id }
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transacción no encontrada." });
        }


        const user = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: { DSC_CEDULA: req.user.id }
        })

        if (!user) return res.status(404).json({ message: "El usuario no tiene permiso de eliminar la transacción." })

        const TimeHasPassed = await timeHasPassed(transaction.FEC_TRANSACCION); // tiempo de 24h
        if (TimeHasPassed) {
            return res.status(404).json({ message: "El tiempo para eliminar una transacción ha expirado." });
        }

        await transaction.update(
            {
                ESTADO: 2,
            },
            {
                where: { ID_TRANSACCION: req.params.id }
            }
        );

        return res.status(200).json({ message: "Transacción eliminada con éxito." });
    } catch (error) {
        console.log("Error: ", error)
        return res.status(500).json({ message: error.message });
    }
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
            // attributes: {
            //     exclude: ['ID_TRANSACCION']
            // },
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

        const transactionResults = await Promise.all(
            Object.values(rows).map(async (row) => {
                const canCancel = !(await timeHasPassed(row.FEC_TRANSACCION));
                return {
                    ...row,
                    CAN_CANCEL: canCancel
                };
            })
        );
        
        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            transaction: transactionResults
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
            // attributes: {
            //     exclude: ['ID_TRANSACCION']
            // },
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

        const transactionResults = await Promise.all(
            Object.values(rows).map(async (row) => {
                const canCancel = !(await timeHasPassed(row.FEC_TRANSACCION));
                return {
                    ...row,
                    CAN_CANCEL: canCancel
                };
            })
        );

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            transaction: transactionResults
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

const timeHasPassed = async (dateISO) => { // 2025-04-15T20:42:05.000Z (UTC)
    try {
        const currentDateCR = await getDateCR(); // 2025-04-16 15:44:15 (CST - UTC-6)

        // 1. Convert the current Costa Rica date to a Date object in UTC.
        const [fechaPartCR, horaPartCR] = currentDateCR.split(' ');
        const [yearCR, monthCR, dayCR] = fechaPartCR.split('-');
        const [hoursCR, minutesCR, secondsCR] = horaPartCR.split(':');

        // We create a date in UTC adjusting for the Costa Rica time difference.
        // We subtract 6 hours to convert the local time from Costa Rica to UTC.
        const currentDateUTC = new Date(Date.UTC(
            parseInt(yearCR),
            parseInt(monthCR) - 1,
            parseInt(dayCR),
            parseInt(hoursCR) + 6,
            parseInt(minutesCR),
            parseInt(secondsCR)
        ));

        // 2. Convert the date to be compared to a Date object (it is already in UTC).
        const compareDateUTC = new Date(dateISO);

        // 3. Calculate the difference in milliseconds.
        const diferenciaMilisegundos = currentDateUTC.getTime() - compareDateUTC.getTime();

        // 4. Calculate the difference in hours.
        const diferenciaHoras = diferenciaMilisegundos / (1000 * 60 * 60);
        console.log("Diferencia en horas: ", diferenciaHoras);

        // 5. Return true if the difference is greater than or equal to 24 hours.
        return diferenciaHoras >= 24;

    } catch (error) {
        console.error("Error al comparar las fechas:", error);
        return true;
    }
};
