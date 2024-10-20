import Category from "../../models/category.model.js";
import { Op } from 'sequelize';

export const validateRegisterCat = async (DSC_NOMBRE) => {
    try {
        const output = await validateNameCat(DSC_NOMBRE);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const saveCategory = async (DSC_NOMBRE,ESTADO) => {
    try {
        const newCategory = await Category.create({
            DSC_NOMBRE,
            FEC_CREADOEN: new Date(),
            ESTADO
        });
        return newCategory !== null;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const updateCategory = async (DSC_NOMBRE,ESTADO,ID_CATEGORIA) => {
    try {

        if (!await existIDCat(ID_CATEGORIA)){
            return -2;
        }

        if (await existNameAct(DSC_NOMBRE, ID_CATEGORIA)) {
            return -3; 
        }

        const newCategory = await Category.update({
            DSC_NOMBRE,
            FEC_MODIFICADOEN: new Date(), 
            ESTADO
        },
    { where: { ID_CATEGORIA } }  );
        return newCategory[0]>0?true:-1;
    } catch (error) {
        throw new Error(error.message);
    }
};

export const getCategoryByName = async (DSC_NOMBRE) => {
    // try {
    //     const category = await Category.findOne({ where: { DSC_NOMBRE } });
    //     return category;
    // } catch (error) {
    //     throw new Error(error.message);
    // }
    return await Category.findAll({
        where: {
            DSC_NOMBRE: {
                [Op.like]: `%${DSC_NOMBRE}%`
            }
        }
    });
};

export const disableCategory = async (DSC_NOMBRE) => {
    try {

        if (!await existName(DSC_NOMBRE)) {
            return -2; 
        }

        const newCategory = await Category.update(
            { ESTADO: 2,
              FEC_MODIFICADOEN:new Date()
             }, // Cambia el estado a 0 (desactivado)
            { where: { DSC_NOMBRE } } // Asegúrate de especificar el `where`
        );
        return newCategory[0]>0?true:-1;
    } catch (error) {
        throw new Error(error.message);
    }
};

async function validateNameCat(name) {
    if (await existName(name))
        return ["El nombre ya se encuentra en uso."];

    return false;
}

async function existName(name) {
    const nameFound = await Category.findOne({ where: { DSC_NOMBRE: name} }); 
    return  nameFound?true:false;
}


async function existNameAct(name, idToExclude) {
    const query = {
        where: {
            DSC_NOMBRE: name,
            ...(idToExclude && { ID_CATEGORIA: { [Op.ne]: idToExclude } }) 
        }
    };

    const nameFound = await Category.findOne(query);
    
    return nameFound !== null;
}

async function existIDCat(id) {
    const nameFound = await Category.findOne({ where: { ID_CATEGORIA: id} }); 
    return  nameFound;
}