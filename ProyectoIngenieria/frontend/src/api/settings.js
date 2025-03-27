import axios from '../api/axios';

export const getConfig = async () => {
    try {
        const response = await axios.get('config/getConfig');
        return response.data;
    } catch (error) {
        console.error("Error Mostrando datos de configuracion: ",error);
        throw error;
    }
};

export const updateConfig = async (configData) => {
    try {
        const response = await axios.put('config/updateConfig', configData);
        return response.data;
    } catch (error) {
        console.error("Error actualizando datos de configuracion: ", error);
        throw error;
    }
};