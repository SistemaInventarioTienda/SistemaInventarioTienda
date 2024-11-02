import axios from '../api/axios';

// Función para registrar un nuevo cliente
export const registerClient = async (clientData) => {
    try {
        const response = await axios.post('/client/register', clientData);
        return response.data;
    } catch (error) {
        console.error('Error registrando el cliente:', error.message);
        throw error;
    }
};

// Función para obtener todos los clientes
export const getClients = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get('/client/all_clients', {
            params: { page, pageSize, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los clientes:', error.message);
        throw error;
    }
};

// Función para actualizar un cliente
export const updateClient = async (id, clientData) => {
    try {
        const response = await axios.put(`/client/update_client/${id}`, clientData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando el cliente:', error.message);
        throw error;
    }
};

// Función para eliminar un cliente
export const deleteClient = async (id) => {
    try {
        const response = await axios.delete(`/client/delete_client/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error eliminando el cliente:', error.message);
        throw error;
    }
};

// Función para buscar un cliente
export const searchClient = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('/client/searchClient', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando el cliente:', error.message);
        throw error;
    }
};
