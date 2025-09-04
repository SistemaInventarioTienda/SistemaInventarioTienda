
import { getDateCR } from "../libs/date.js";
import {createBarCode, isDateValid, isProductsValid} from "../logic/proforma/proforma.logic.js";

export const createProForma = async (req, res) => {
    const { FEC_LIMITE, MON_TOTAL, details_list } = req.body;
    const currentDate = await getDateCR();

    if(!isDateValid(currentDate, FEC_LIMITE)) return res.status(400).json({message: "La fecha limite no es valida. Favor ingresar una mayor o igual a la fecha actual."})
    
    const validateDetails = await isProductsValid(details_list);
    if(!validateDetails.success) return res.status(400).json({message: validateDetails});

    const code = await createBarCode();

    res.status(200).json({message: "Factura proforma creada correctamente.", code: code});
}

export const getAllProForma = async (req, res) => {

}

export const getProForma = async (req, res) => {

}

export const deleteProForma = async (req, res) => {

}


