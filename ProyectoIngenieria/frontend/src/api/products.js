import axios from './axios';

export const getAllProducts = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get(`/product/all_product`, { params: { page, pageSize, orderByField, order } });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

export const searchProduct = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get(`/product/searchProduct`, { params: { page, pageSize, termSearch, orderByField, order } });
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error.message);
        throw error;
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`/product/delete_product/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando el producto:', error);
        throw error;
    }
};

export const registerProduct = async (productData) => {
    try {
        const response = await axios.post('/product/register', productData);
        return response.data;
    } catch (error) {
        console.error('Error registrando el producto:', error.message);
        throw error;
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`/product/update_product/${id}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw error;
    }
};

