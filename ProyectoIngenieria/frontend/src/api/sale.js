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
    return {
        "total": 4,
        "totalPages": 1,
        "currentPage": 1,
        "pageSize": 5,
        "sales": [
            {
                "CLIENTE": "Aaron",
                "PRODUCTO": "Zapatillas Nike Air Max",
                "FEC_VENTA": "2025-03-10",
                "MON_TOTAL": 120.50,
                "ESTADO": 1
            },
            {
                "CLIENTE": "Josue Emanuel",
                "PRODUCTO": "Perfume Dior Sauvage",
                "FEC_VENTA": "2025-03-09",
                "MON_TOTAL": 85.99,
                "ESTADO": 1
            },
            {
                "CLIENTE": "Yeiler",
                "PRODUCTO": "Bolso de cuero negro",
                "FEC_VENTA": "2025-03-08",
                "MON_TOTAL": 45.00,
                "ESTADO": 0
            },
            {
                "CLIENTE": "Anthony Daniel",
                "PRODUCTO": "Chaqueta de invierno",
                "FEC_VENTA": "2025-03-07",
                "MON_TOTAL": 150.75,
                "ESTADO": 1
            }
        ]
    };
};

// Función para eliminar (desactivar) una venta
export const deleteSale = async (id) => {
    try {
        const response = await axios.delete(`/sale/delete_sales/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando la venta:', error.message);
        throw error;
    }
};

// Función para buscar una venta
export const searchSale = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/sale/search_sales', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando la venta:', error.message);
        throw error;
    }
};