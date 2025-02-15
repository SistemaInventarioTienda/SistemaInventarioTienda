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

export const validateRegisterSubcategoryUpdate = async (DSC_NOMBRE,ID_CATEGORIA,ID_SUBCATEGORIA) => {
    try {
        const output = await validateNameSubcategoryUpdate(DSC_NOMBRE,ID_CATEGORIA,ID_SUBCATEGORIA);
        if (output !== false) {
            return output;
        }
        return true;
    } catch (error) {
        throw new Error(error.message);
    }
};


export const validateDeleteSubcategory= async (ID_SUBCATEGORIA) => {
    try {
        const output = await existSubcategory(ID_SUBCATEGORIA);
        return output;
    } catch (error) {
        throw new Error(error.message);
    }
};



async function validateNameSubcategory(name,idCat) {
    if(!validateNameFormat(name)){
        return ["El nombre del subcategoría no puede contener caracteres especiales ni números."];
    }
    if (await existName(name)){
        return ["El nombre de la subcategoria ya se encuentra en uso."];
    }
    if (!(await existCategory(idCat))){
        return ["La categoría no existe en el sistema."];
    } 
    return false;
}
 
async function validateNameSubcategoryUpdate(name,idCat,idSubCat) {
    if(!validateNameFormat(name)){
        return ["El nombre del subcategoría no puede contener caracteres especiales ni números."];
    }
    if (await existNameAct(name,idSubCat)){
        return ["El nombre de la subcategoria ya se encuentra en uso."];
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

async function existNameAct(name, idToExclude) {
    const query = {
        where: {
            DSC_NOMBRE: name,
            ...(idToExclude && { ID_SUBCATEGORIA: { [Op.ne]: idToExclude } }) 
        }
    };

    const nameFound = await subcategory.findOne(query);
    
    return nameFound !== null;
}

async function existCategory(ID_CATEGORIA) {
    const categoryFound = await Category.findOne({ where: { ID_CATEGORIA: ID_CATEGORIA} }); 
    return  categoryFound?true:false;
}
async function existSubcategory(ID_SUBCATEGORIA) {
    const subcategoryFound = await subcategory.findOne({ where: { ID_SUBCATEGORIA: ID_SUBCATEGORIA,ESTADO: 1} }); 
    return  subcategoryFound?{exist:true,data: subcategoryFound}:{exist:false,message: "La subcategoría se encuentra deshabilitada o no existe en el sistema."} ;
}

 function validateNameFormat(DSC_NOMBRE){
    const dates = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return dates.test(DSC_NOMBRE)
}