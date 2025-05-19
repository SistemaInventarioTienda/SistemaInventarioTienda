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
            params: { page, pageSize, orderByField, order }
        });
        const sales = Array.isArray(response.data.sales) ? response.data.sales : [];
        const transformedSales = sales.map(transformSale);
        return {
            ...response.data,
            sales: transformedSales
        };
    } catch (error) {
        console.error('Error fetching sales:', error.message);
        throw error;
    }
};

// Función para eliminar (desactivar) una venta
export const deleteSale = async (id) => {
    try {
        const response = await axios.put(`/sale/deleteSale/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando la venta:', error.message);
        throw error;
    }
};

// Función para buscar una venta
export const searchSale = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/sale/searchSale', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        const sales = Array.isArray(response.data.sales) ? response.data.sales : [];
        const transformedSales = sales.map(transformSale);
        console.log("transformadas", transformSale);
        return {
            ...response.data,
            sales: transformedSales
        };
    } catch (error) {
        console.error('Error buscando la venta:', error.message);
        throw error;
    }
};

const transformSale = (sale) => {
    const esCredito = sale.ESTADO_CREDITO === 1 || sale.DSC_SALETYPE === "Venta a crédito" || sale.ESTADO === 3;
    const total = sale.MONT_SUBTOTAL || 0;

    let subtotalCalculado = total;

    if (esCredito) {
        const descuento = sale.PORCENT_DESCUENTO || 0;
        const impuesto = sale.PORCENT_IMPUESTO || 0;

        const baseSinImpuesto = total / (1 + impuesto / 100);
        subtotalCalculado = baseSinImpuesto / (1 - descuento / 100);
    }

    return {
        ...sale,
        MONT_SUBTOTAL: parseFloat(subtotalCalculado.toFixed(2)),
    };
};