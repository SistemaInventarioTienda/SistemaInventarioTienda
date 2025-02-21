import axios from '../api/axios';

// Función para registrar un nuevo producto
export const registerProduct = async (ProductData) => {
    try {
        const response = await axios.post('/product/register', ProductData);
        return response.data;
    } catch (error) {
        console.error('Error registrando el producto:', error.message);
        throw error;
    }
};

// Función para obtener todos los productos
export const getProducts = async (page, pageSize, orderByField, order) => {
    try {
        // const response = await axios.get('/product/all_product', {
        //     params: { page, pageSize, orderByField, order }
        // });
        // return response.data;
        return "";
    } catch (error) {
        console.error('Error obteniendo los Productes:', error.message);
        throw error;
    }
};

// Función para actualizar un producto
export const updateProduct = async (id, ProductData) => {
    try {
        const response = await axios.put(`/product/update_product/${id}`, ProductData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando el producto:', error.message);
        throw error;
    }
};

// Función para eliminar un producto
export const deleteProduct = async (id) => {
    console.log('Deleting Product id:', id);
    try {
        const response = await axios.delete(`/product/delete_product/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando el producto:', error.message);
        throw error;
    }
};

// Función para buscar un Producte
export const searchProduct = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/product/search_product', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando el producto:', error.message);
        throw error;
    }
};