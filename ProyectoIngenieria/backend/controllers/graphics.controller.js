import { QueryTypes } from 'sequelize';
import db from '../db.js';

export const getAllDataFromGrpahic = async (req, res) => {
    try {
        const { LIMIT_PRODUCTS = 5, MIN_FEC = '', MAX_FEC = '', CATEGORY = '' } = req.query;

        const min_f = validateDate(MIN_FEC);
        const max_f = validateDate(MAX_FEC);
        if (!min_f.isValid || !max_f.isValid) {
            const message = "La fecha de inicio " + min_f.message + " y la fecha de corte " + max_f.message;
            return res.status(400).json({ message: message })
        }
        const results = await db.query(
            'CALL sp_getAllDataFromGrpahics(:MIN_FEC, :MAX_FEC, :LIMIT_PRODUCTS, :CATEGORY)',
            {
                replacements: {
                    MIN_FEC: MIN_FEC,
                    MAX_FEC: MAX_FEC,
                    LIMIT_PRODUCTS: LIMIT_PRODUCTS,
                    CATEGORY: CATEGORY
                },
                type: QueryTypes.SELECT
            }
        );

        return res.json({ message: "Datos obtenidos con éxito.", results: results[0], other: results[1]})

    } catch (error) {

    }
}

function validateDate(dateString) {
    const validFormat = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
    if (!validFormat) {
        return { isValid: false, message: 'tiene un formato inválido. Debe ser AAAA-MM-DD.' };
    }

    const dateObject = new Date(dateString);
    if (isNaN(dateObject.getTime())) {
        return { isValid: false, message: 'proporcionada no es válida.' };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    dateObject.setHours(0, 0, 0, 0);

    if (dateObject > today) {
        return { isValid: false, message: 'no puede ser futura.' };
    }

    return { isValid: true, message: 'es válida.' };

}