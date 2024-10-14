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
        return newCategory[0]>0?true:false;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const updateCategory = async (DSC_NOMBRE,ESTADO,ID_CATEGORIA) => {
    try {

        if (!await existIDCat(ID_CATEGORIA)){
            return -2;
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



async function validateNameCat(name) {
    if (await existName(name))
        return ["El nombre ya se encuentra en uso."];

    return false;
}

async function existName(name) {
    const nameFound = await Category.findOne({ where: { DSC_NOMBRE: name} }); 
    return  nameFound?true:false;
}


async function existIDCat(id) {
    const nameFound = await Category.findOne({ where: { ID_CATEGORIA: id} }); 
    return  nameFound?true:false;
}