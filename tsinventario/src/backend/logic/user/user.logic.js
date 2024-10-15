import User from "../../models/user.model.js";
import { Op } from 'sequelize';

export const validateRegister = async (DSC_CORREO, DSC_TELEFONO, DSC_CEDULA, DSC_NOMBREUSUARIO) => {
    try {
        const output = await existData(DSC_CORREO, DSC_TELEFONO, DSC_CEDULA, DSC_NOMBREUSUARIO);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const validateUpdate = async (req) => {
    const {
        DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
        DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
    } = req.body;

    const emailFound = await User.findOne({ 
        where: { 
            DSC_CORREO: DSC_CORREO.toLowerCase(), 
            DSC_CEDULA: {
                [Op.ne]: req.params.id
            } 
        } 
    });
    if(emailFound){
        return ["El correo ya se encuentra en uso."];
    }

    const phoneFound = await User.findOne({ 
        where: { 
            DSC_CORREO: DSC_TELEFONO.toLowerCase(), 
            DSC_CEDULA: {
                [Op.ne]: req.params.id
            } 
        } 
    });
    if(phoneFound){
        return ["El telefono ya se encuentra en uso."];
    }

    const userNameFound = await User.findOne({ 
        where: { 
            DSC_NOMBREUSUARIO: DSC_NOMBREUSUARIO.toLowerCase(), 
            DSC_CEDULA: {
                [Op.ne]: req.params.id
            } 
        } 
    });
    if(userNameFound){
        return ["El nombre de usuario ya se encuentra en uso."];
    }
    return true;
};


// metodos para validación


async function existData(email, phone, idUser, userName) {
    if (await existEmail(email))
        return ["El correo ya se encuentra en uso."];

    if (await existPhone(phone))
        return ["El telefono ya se encuentra en uso."];

    if (await existUserName(userName))
        return ["El nombre de usuario ya se encuentra en uso."];

    if (await existIdUser(idUser))
        return ["La persona ya tiene una cuenta asociada."];

    return false;
}

async function existEmail(email) {
    const emailFound = await User.findOne({ where: { DSC_CORREO: email.toLowerCase() } });
    if (emailFound)
        return true;
    return false;
}

async function existPhone(phone) {
    const phoneFound = await User.findOne({ where: { DSC_TELEFONO: phone } });
    if (phoneFound)
        return true;
    return false;
}

async function existUserName(userName) {
    const userNameFound = await User.findOne({ where: { DSC_NOMBREUSUARIO: userName.toLowerCase() } });
    if (userNameFound)
        return true;
    return false;
}

async function existIdUser(idUser) {
    const idUserFound = await User.findOne({ where: { DSC_CEDULA: idUser.toLowerCase() } });
    if (idUserFound)
        return true;
    return false;
}