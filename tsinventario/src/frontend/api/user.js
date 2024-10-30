import axios from '../api/axios';


// Función para registrar un nuevo usuario
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Error registrando el usuario:', error.message);
    throw error;
  }
};

export const getUsers = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get(`/user/all_user`, { params: { page, pageSize, orderByField, order } });
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error.message);
        throw error;
    }
};

export const updateUser = async (id, userData) => {
    try {
        const response = await axios.put(`/user/update_user/${id}`, userData);
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error.message);
        throw error;
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`/user/delete_user/${id}`);
        // const response = await axios.delete(`/user/delete_user`, { data: { id } });
        return response.data;
    } catch (error) {
        console.error('Error eliminando el usuario:', error);
        throw error;
    }
};

export const searchUser = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get(`/user/searchUser`, { params: { page, pageSize, termSearch, orderByField, order } });
        return response.data;
    } catch (error) {
        console.error('Error searching user:', error.message);
        throw error;
    }
};