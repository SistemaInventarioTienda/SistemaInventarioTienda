import axios from './axios';

// Función para registrar una nueva venta
export const registerSale = async (salesData) => {
    try {
        const response = await axios.post('/sale/addSale', salesData);
        return response.data;
    } catch (error) {
        console.error('Error registrando la venta:', error.message);
        throw error;
    }
};

// Función para obtener todos las ventas
export const getAllSales = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get(`/sale/getSales`, {
            params: {
                page,
                pageSize,
                orderByField,
                order
            }
        });
        console.log("OBTENIENDO TODO: ", response.data.sales);
        return response.data;
    } catch (error) {
        console.error('Error fetching subcategories:', error.message);
        throw error;
    }
};

// Función para eliminar (desactivar) una venta
export const deleteSale = async (id) => {
    // try {
    //     const response = await axios.delete(`/sale/delete_sales/${id}`);
    //     return response.data;
    // } catch (error) {
    //     console.error('Error eliminando la venta:', error.message);
    //     throw error;
    // }
};

// Función para buscar una venta
export const searchSale = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/sale/searchSale', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        console.log("RESULTADO BUSCANDO: ", response.data.sales);
        return response.data;
    } catch (error) {
        console.error('Error buscando la venta:', error.message);
        throw error;
    }
};