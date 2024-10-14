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
export const deleteCategory = async (id) => {
    try {
        const response = await axios.delete(`/category/deleteCategory`, { data: { id } });
        return response.data;
    } catch (error) {
        console.error('Error deleting category:', error.message);
        throw error;
    }
};