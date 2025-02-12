import { Op } from 'sequelize';
import subcategory from '../../models/subcategory.model.js';
import Category from '../../models/category.model.js';



export const validateRegisterSubcategory = async (DSC_NOMBRE,ID_CATEGORIA) => {
    try {
        const output = await validateNameSubcategory(DSC_NOMBRE,ID_CATEGORIA);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};




async function validateNameSubcategory(name,idCat) {
    if(!validateNameFormat(name)){
        return ["El nombre del subcategoría no puede contener caracteres especiales ni números."];
    }
    if (await existName(name)){
        return ["El nombre del proveedor ya se encuentra en uso."];
    }
    if (!(await existCategory(idCat))){
        return ["La categoría no existe en el sistema."];
    } 
    return false;
}


async function existName(name) {
    const nameFound = await subcategory.findOne({ where: { DSC_NOMBRE: name} }); 
    return  nameFound?true:false;
}

async function existCategory(ID_CATEGORIA) {
    const categoryFound = await Category.findOne({ where: { ID_CATEGORIA: ID_CATEGORIA} }); 
    return  categoryFound?true:false;
}

 function validateNameFormat(DSC_NOMBRE){
    const dates = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return dates.test(DSC_NOMBRE)
}