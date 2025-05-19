import axios from './axios';

export const createCashClosing = async () => {
    try {
        const response = await axios.post('/cashClosing/createcashclosing');
        return response.data;
    } catch (error) {
        console.error('Error creando el cierre de caja:', error.message);
        throw error;
    }
};


export const getAllCashClosingData = async () => {
    try {
        const response = await axios.get('/cashClosing/getcashtoday');
        return response.data;
    } catch (error) {
        console.error('Error obteniendo datos de cierre de caja:', error.message);
        throw error;
    }
};