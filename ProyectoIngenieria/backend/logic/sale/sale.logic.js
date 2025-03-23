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
        const output = await verifyProduct(details_list);
        return (output !== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
};



async function validateStock(details_list) {
    const existingStock = await product.findAll({
        where: {
            ID_PRODUCT: {
                [Op.in]: details_list.map(detail => detail.ID_PRODUCTO)
            },
            [Op.or]: details_list.map(detail => ({
                ID_PRODUCT: detail.ID_PRODUCTO,
                CANTIDAD: {
                    [Op.and]: [
                        { [Op.lt]: detail.CANTIDAD },
                        { [Op.ne]: null }
                    ]
                }
            }))
        },
        attributes: ['DSC_NOMBRE']
    });

    if (existingStock.length > 0) {
        const noStockProd = existingStock.map(details => details.DSC_NOMBRE);
        return [`No hay Stock suficiente para: ${noStockProd.join(', ')}.`];
    }

    return false;
}


async function verifyProduct(details_list) { //voy a probar some
    if (details_list.some(details => details.CANTIDAD === 0)) {
        return ['Algunos productos no tienen cantidad seleccionada.'];
    }

    if (details_list.some(details => details.MONTO_UNITARIO <= 0)) {
        return ['Algunos productos no tienen precio asignado.'];
    }

    if (details_list.some(details => details.ID_PRODUCTO <= 0)) {
        return ['No ha sido seleccionado ningun producto.'];
    }

    return false;
}
