import { QueryTypes } from 'sequelize';
import db from '../db.js';
import { getDateCR } from '../libs/date.js';

export const getAllDataFromGrpahic = async (req, res) => {
    try {
        const { LIMIT_PRODUCTS = 5, MIN_FEC = '', MAX_FEC = '', CATEGORY = '', FEC_CURRENT = '' } = req.query;

        const min_f = validateDate(MIN_FEC);
        const max_f = validateDate(MAX_FEC);
        if (!min_f.isValid || !max_f.isValid) {
            const message = "La fecha de inicio " + min_f.message + " y la fecha de corte " + max_f.message;
            return res.status(400).json({ message: message })
        }

        let current_date = FEC_CURRENT;
        if(FEC_CURRENT === ''){
            current_date = await getDateCR();
        }
        const results = await db.query(
            'CALL sp_getAllDataFromGrpahics(:MIN_FEC, :MAX_FEC, :LIMIT_PRODUCTS, :CATEGORY, :FEC_CURRENT)',
            {
                replacements: {
                    MIN_FEC: MIN_FEC,
                    MAX_FEC: MAX_FEC,
                    LIMIT_PRODUCTS: LIMIT_PRODUCTS,
                    CATEGORY: CATEGORY,
                    FEC_CURRENT: current_date
                },
                type: QueryTypes.SELECT
            }
        );

        return res.json({ message: "Datos obtenidos con éxito.", top5Products: results[0], products_stock_sold: results[1], last12sales: results[2] })

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