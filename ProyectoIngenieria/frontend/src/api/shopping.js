import axios from '../api/axios';

// Función para registrar una nueva compra
export const registerShopping = async (ShoppingData) => {
    try {
        const response = await axios.post('/shopping/register', ShoppingData);
        return response.data;
    } catch (error) {
        console.error('Error registrando la compra:', error.message);
        throw error;
    }
};

// Función para obtener todos las compras
export const getAllShoppings = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get('/shopping/all_shoppings', {
            params: { page, pageSize, orderByField, order }
        });
        console.log("response", response);
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las compras:', error.message);
        throw error;
    }
};

// Función para eliminar (desactivar) una compra
export const deleteShopping = async (id) => {
    try {
        const response = await axios.delete(`/shopping/delete_shopping/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando la compra:', error.message);
        throw error;
    }
};

// Función para buscar un Shoppinge
export const searchShopping = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/Shopping/search_shopping', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando el Shoppinge:', error.message);
        throw error;
    }
};