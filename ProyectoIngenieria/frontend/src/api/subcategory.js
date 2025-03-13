// subcategory.js
import axios from '../api/axios';

export const getAllSubcategories = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get(`/subcategory/subcategories`, {
            params: {
                page,
                pageSize,
                orderByField,
                order
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error.message);
        throw error;
    }
};

export const getAllSubcategoriesTypes = async () => {
    try {
        const response = await axios.get(`/subcategory/subcategoriesTypes`);
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories types:', error.message);
        throw error;
    }
}

export const searchSubcategories = async (page, pageSize, searchTerm, orderByField, order) => {
    try {
        const response = await axios.get(`/subcategory/subcategories`, {
            params: {
                page,
                pageSize,
                DSC_NOMBRE: searchTerm,
                orderByField,
                order
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching subcategories:', error.message);
        throw error;
    }
};

export const createSubcategory = async (subCategoryData) => {
    console.log('Creating subcategory', subCategoryData);
    try {
        const response = await axios.post(`/subcategory/createSubcategory/`, subCategoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating subcategory:', error.message);
        throw error;
    }
};

export const updateSubcategory = async (subCategoryData) => {
    console.log('Updating subcategory', subCategoryData);
    try {
        const response = await axios.put(`/subcategory/updateSubcategory/`, subCategoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating subcategory:', error.message);
        throw error;
    }
};

export const deleteSubcategory = async (subCategoryId) => {
    try {
        const response = await axios.put(`/subcategory/deleteSubcategory/`, {
            ID_SUBCATEGORIA: subCategoryId
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting subcategory:', error.message);
        throw error;
    }
};