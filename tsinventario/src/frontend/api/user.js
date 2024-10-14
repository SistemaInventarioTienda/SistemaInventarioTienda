import axios from '../api/axios';

export const getUsers = async (page, pageSize) => {
    try {
        const response = await axios.get(`/user/all_user`, { params: { page, pageSize } });
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
        const response = await axios.delete(`/user/delete_user`, { data: { id } });
        return response.data;
    } catch (error) {
        console.error('Error eliminando el usuario:', error);
        throw error;
    }
};
