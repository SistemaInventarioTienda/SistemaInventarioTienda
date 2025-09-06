import axios from '../api/axios';

export const getAllCredits = async (page, pageSize, orderByField, order) =>{
    try {
        
        const response = await axios.get(`/credit/getpayment`, {params: {page, pageSize, orderByField, order}}); //Falta la ruta del endpoint.
        return response.data;
    } catch (error) {
        console.error('Error fetching credits: ', error.message);
        throw error;
    }
};

export const getCreditById = async (id) =>{
    try {
        const response = await axios.get(`/credit/getCreditById/${id}`);
 
        return response.data;
    } catch (error) {
        console.error('Error fetching credit data', error.message);
        throw error;
    }
};

export const addPayment = async (id, paymentData) => {
    try {
        const response = await axios.post(`/credit/registerPay/${id}`, paymentData);
        return response.data;
    } catch (error) {
        console.error('Error registering payment: ', error.message);
        throw error;
    }
};

export const modifyPayment = async (id, paymentData) => {
    try {
        const response = await axios.put(`/credit/registerPayMod/${id}`,paymentData);
        return response.data;
    } catch (error) {
        console.error('Error registering payment: ', error.message);
        throw error;
    }
};

export const formatDate = (isoDate) => {
    if (!isoDate) return ""; // Manejo de valores nulos o vacíos
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "numeric", year: "numeric" });
  };


export const searchCredits = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get(`/credit/getpaymentByFilter`, {params: {page, pageSize, termSearch, orderByField, order}});//Falta la ruta del endpoint.
        return response.data;
    } catch (error) {
        console.error('Error fetching credits in searchCredits: ', error.message);
        throw error;
    }
};