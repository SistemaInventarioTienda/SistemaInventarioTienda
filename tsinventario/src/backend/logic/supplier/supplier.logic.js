import {Supplier} from "../../models/supplier.model.js";
import { Op } from 'sequelize';

export const validateRegisterSupplier = async (DSC_NOMBRE) => {
    try {
        const output = await validateNameSupplier(DSC_NOMBRE);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};



async function validateNameSupplier(name) {
    if (await existName(name))
        return ["El nombre del proveedor ya se encuentra en uso."];

    return false;
}

async function existName(name) {
    const nameFound = await Supplier.findOne({ where: { DSC_NOMBRE: name} }); 
    return  nameFound?true:false;
}


