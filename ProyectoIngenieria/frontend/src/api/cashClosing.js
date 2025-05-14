import axios from './axios';

export const createCashClosing = async (id) => {
    try {
        const response = await axios.put('/cashClosing/createCashClosing/');
        return response.data;
    } catch (error) {
        console.error('Error creando el cierre de caja:', error.message);
        throw error;
    }
};

export const getAllCashClosingData = async (page = 1, pageSize = 5, orderByField, order) => {
    try {
        const allCashData = [
            { TIPO: "Venta", DESCRIPCION: "Venta #1052", HORA: "09:15:23", MONTO: 1250 },
            { TIPO: "Venta", DESCRIPCION: "Venta #1053", HORA: "10:32:45", MONTO: 850.75 },
            { TIPO: "Ingreso", DESCRIPCION: "Pago de factura pendiente", HORA: "12:15:30", MONTO: 1500 },
            { TIPO: "Egreso", DESCRIPCION: "Pago a proveedor", HORA: "13:45:10", MONTO: -2500 },
            { TIPO: "Venta", DESCRIPCION: "Venta #1054", HORA: "14:22:18", MONTO: 950.25 },
            { TIPO: "Transacción", DESCRIPCION: "Transferencia bancaria", HORA: "15:10:05", MONTO: 3000 },
            { TIPO: "Venta", DESCRIPCION: "Venta #1055", HORA: "16:05:42", MONTO: 1201.25 },
        ];

        const metrics = {
            ventas: 5252.25,
            devoluciones: -320.5,
            ingresos: 1500,
            egresos: -7500,
            total: 1931.75,
        };

        return {
            data: allCashData,
            metrics,
        };
    } catch (error) {
        console.error('Error fetching mock cash closing data:', error.message);
        throw error;
    }
};