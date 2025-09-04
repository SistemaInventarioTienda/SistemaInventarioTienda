import axios from './axios';


export const registerTransaction = async (TransactionData) => {
 
    try {
        const response = await axios.post('/transaction/create_transaction',TransactionData);
 
        return response.data;
    } catch (error) {
        console.error('Error registrando la transaccion:', error.message);
        throw error;
    }
};

export const getAllTransaction = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get('/transaction/get_all_transaction', {
            params: { page, pageSize, orderByField, order }
        });
 
        return response.data;
    } catch (error) {
        console.error('Error obteniendo las transaccion:', error.message);
        throw error;
    }
};

export const updateTransaction = async (id, TransactionData) => {
    try {
        const response = await axios.put(`/transaction/update_transaction/${id}`, TransactionData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando la transaccion:', error.message);
        throw error;
    }
};

export const deleteTransaction = async (id) => {
   
    try {
        const response = await axios.delete(`/transaction/delete_Transaction/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando la transaccion:', error.message);
        throw error;
    }
};

export const search_Transaction = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/transaction/search_Transaction', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando la transaccion:', error.message);
        throw error;
    }
};