import { getDateCR } from "../libs/date.js";
import { QueryTypes } from 'sequelize';
import db from '../db.js';

export const getCashToday = async (req, res) => {

  const currentDay = await getDateCR();
  const results = await db.query(
    'CALL sp_cash_closing(:MIN_FEC, :MAX_FEC)',
    {
      replacements: {
        MIN_FEC: currentDay,
        MAX_FEC: currentDay
      },
      type: QueryTypes.SELECT
    }
  );


  const TOTAL_VENTAS = results[0]?.[0]?.TOTAL_VENTAS || 0;
  const TOTAL_COMPRAS = results[1]?.[0]?.TOTAL_COMPRAS || 0;
  const TOTAL_ABONO = results[2]?.[0]?.TOTAL_ABONO || 0;
  const TOTAL_TRANSACCIONES = results[3]?.[0]?.TOTAL_TRANSACCION || 0;
  const cashData = results.slice(4)
    .filter(r => Object.values(r).every(value => typeof value === 'object' && value !== null))
    .flatMap(r => Object.values(r));
  return res.json({
    message: "Datos obtenidos con éxito.",
    totals: {
      TOTAL_VENTAS,
      TOTAL_COMPRAS,
      TOTAL_ABONO,
      TOTAL_TRANSACCIONES,
      TOTAL: TOTAL_VENTAS + TOTAL_ABONO - TOTAL_COMPRAS
    },
    cashData
  })
};