import axios from '../api/axios';

// Obtener todas las categorías
export const getAllCategories = async (page, pageSize) => {
    try {
        const response = await axios.get(`/category/categories`, { params: { page, pageSize } });
        return response.data;
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        throw error;
    }
};

// Actualizar una categoría
export const saveCategory = async (categoryData) => {
    try {
        const response = await axios.post(`/category/saveCategory/`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error.message);
        throw error;
    }
};

// Eliminar una categoría (si es necesario agregar esta funcionalidad)
export const deleteCategory = async (DSC_NOMBRE) => {
    try {
        console.log('Deleting category', DSC_NOMBRE);
        const response = await axios.put(`/category/disableCategory`, { DSC_NOMBRE });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error.message);
        throw error;
    }
};

// Actualizar una categoría
export const updateCategory = async (categoryData) => {
    try {
        const response = await axios.put(`/category/updateCategory`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category:', error.message);
        throw error;
    }
};

// Buscar una categoría por nombre
export const searchCategoryByName = async (DSC_NOMBRE) => {
    try {
        const response = await axios.get(`/category/searchCategory`, { params: { DSC_NOMBRE } });
        return response.data;
    } catch (error) {
        console.error('Error searching category:', error.message);
        throw error;
    }
};
