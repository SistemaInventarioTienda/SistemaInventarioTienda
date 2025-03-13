import { Op } from 'sequelize';
import phoneClient from '../../models/phoneClient.model.js';




export const validateRegisterPhones = async (phones) => {
    try {
        const output = await validatePhonesClient(phones);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};



async function validatePhonesClient(phones) {
    const existingPhones = await phoneClient.findAll({
        where: {
            DSC_TELEFONO: { [Op.in]: phones },
        },
        attributes: ['DSC_TELEFONO']
    });

    if (existingPhones.length > 0) {
        const existingNumbers = existingPhones.map(phone => phone.DSC_TELEFONO);
        return [`Existen números de teléfono en uso: ${existingNumbers.join(', ')}.`];
    }

    return false;  
}