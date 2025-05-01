import axios from './axios';

// Función para generar un nuevo reporte
export const generateReport = async ({ EXTENSION, TYPE, MIN_FEC, MAX_FEC }) => {
    try {
        const response = await axios.post('/reports/reports', {
            EXTENSION,
            TYPE,
            MIN_FEC,
            MAX_FEC
        });
        return response.data;
    } catch (error) {
        console.error('Error generando el reporte:', error.message);
        throw error;
    }
};

// Función para programar un nuevo reporte
export const programReport = async ({ EXTENSION, TYPE, MIN_FEC, MAX_FEC, EMAIL, FRECUENCY }) => {
    try {
        const response = await axios.post('/reports/programa', {
            EXTENSION,
            TYPE,
            MIN_FEC,
            MAX_FEC,
            EMAIL, 
            FRECUENCY
        });
        return response.data;
    } catch (error) {
        console.error('Error programando el reporte:', error.message);
        throw error;
    }
};