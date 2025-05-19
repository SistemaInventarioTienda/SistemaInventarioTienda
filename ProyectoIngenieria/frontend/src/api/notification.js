import axios from 'axios';

export const getAllNotifications = async() => {
    try {
        // const response = await axios.get('/notification/getNotification');
        const response = await axios.get('https://deploybackend-production-e19f.up.railway.app/api/notification/getNotification');
        console.log("Notificaciones", response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        throw error;
    }
}

export const updateNotification = async(id) => {
    try {
        const response = await axios.put(`https://deploybackend-production-e19f.up.railway.app/api/notification/viewNotification/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        throw error;
    }
}