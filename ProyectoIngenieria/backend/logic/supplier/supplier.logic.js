import {mailSupplier, numberSupplier, Supplier} from "../../models/supplier.model.js";
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

export const validateRegisterSupplierUpdate = async (DSC_NOMBRE,IDENTIFICADOR_PROVEEDOR) => {
    try {
        const output = await validateNameSupplierUpdate(DSC_NOMBRE,IDENTIFICADOR_PROVEEDOR);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const validateRegisterPhones = async (phones) => {
    try {
        const output = await validatePhonesSupplier(phones);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const validateRegisterEmails = async (emails) => {
    try {
        const output = await validateEmailsSupplier(emails);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

 export const validateEqualsPhonesSupplier = async (phones) => {
    try {
        const output = await validateEqualsPhones(phones);
        return (output !== false) ? output : true;

    } catch (error) {
        throw new Error(error.message);
    }
}

 export const validateEqualsEmailsSupplier = async (emails) => {
    try {
        const output = await validateEqualsEmails(emails);
        return (output!== false) ? output : true;
    } catch (error) {
        throw new Error(error.message);
    }
}

export const validatIbanAccount = async (account) => {
    try {
        const output = await validateCRIBAN(account);
        return (output!== true)? "La cuenta IBAN esta mal digitada" : true;
    } catch (error) {
        throw new Error(error.message);
    }
 }

async function validateNameSupplier(name) {
    if (await existName(name))
        return ["El nombre del proveedor ya se encuentra en uso."];

    return false;
}

async function validateNameSupplierUpdate(name,id) {
    if (await existNameUpdate(name,id))
        return ["El nombre del proveedor ya se encuentra en uso."];

    return false;
}

async function existName(name) {
    const nameFound = await Supplier.findOne({ where: { DSC_NOMBRE: name} }); 
    return  nameFound?true:false;
}

async function existNameUpdate(name, id) {
    const nameFound = await Supplier.findOne({
        where: {
            DSC_NOMBRE: name,
            IDENTIFICADOR_PROVEEDOR : { [Op.ne]: id }
        }
    });
    return nameFound ? true : false;
}

async function validatePhonesSupplier(phones) {
    const existingPhones = await numberSupplier.findAll({
        where: {
            DSC_TELEFONO: { [Op.in]: phones },
        },
        attributes: ['DSC_TELEFONO']
    });

    if (existingPhones.length > 0) {
        const existingNumbers = existingPhones.map(phone => phone.DSC_TELEFONO);
        return [`Hay números de teléfono en uso: ${existingNumbers.join(', ')}.`];
    }

    return false;  
}

async function validateEmailsSupplier(emails) {
    const existingEmails = await mailSupplier.findAll({
        where: {
            DSC_CORREO: { [Op.in]: emails },
        },
        attributes: ['DSC_CORREO']
    });

    if (existingEmails.length > 0) {
        const existingEmailsList = existingEmails.map(email => email.DSC_CORREO);
        return [`Hay correos en uso: ${existingEmailsList.join(', ')}.`];
    }

    return false;  
}

async function validateEqualsPhones(phones){ 
    const uniquePhones = [...new Set(phones)];
    return (uniquePhones.length!== phones.length) ?  ["No puede haber números de teléfono repetidos."]: false;
}

async function validateEqualsEmails(emails){
    const uniqueEmails = [...new Set(emails)];
   return (uniqueEmails.length!== emails.length) ? ["No puede haber correos repetidos."]: false;
}

async function validateCRIBAN(iban) {
    const ibanPattern = /^CR\d{2}0\d{18}$/;
    return ibanPattern.test(iban);
}
