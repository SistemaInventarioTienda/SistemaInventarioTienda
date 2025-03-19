import product from "../../models/product.model.js";
import { Op } from 'sequelize';
import { details } from "../../models/sale.model.js";

export const validateStockProduct = async (details_list) => {
    try {
        const output = await validateStock(details_list);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const validatedetailsProduct = async (details_list) => {
    try {
        const output = await verifyCantProduct(details_list);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};



async function validateStock(details_list) {
    const existingStock = await product.findAll({
        where: {
            CANTIDAD: { [Op.lt]: details_list.CANTIDAD},
        },
        attributes: ['DSC_NOMBRE']
    });

    if (existingStock.length > 0) {
        const noStockProd = existingStock.map(details => details.CANTIDAD);
        return [`No hay Stock suficiente para: ${noStockProd.join(', ')}.`];
    }

    return false;  
}


async function verifyCantProduct(details_list){

     const filter=details_list.filter(details=> details.CANTIDAD===0);

    return (filter.length > 0) ?[`Algunos productos no tienen cantidad seleccionada.`]:false ;
} 