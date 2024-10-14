import Category from "../../models/category.model.js";

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
        return newCategory?true:false;
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