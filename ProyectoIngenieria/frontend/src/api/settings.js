import axios from '../api/axios';

export const getConfig = async () => {
    try {
        
        const response = await axios.get('config/getConfig');
        console.log('api config getConfig', response.data);
        return response.data;
    } catch (error) {
        console.error("Error Mostrando datos de configuracion: ",error);
        throw error;
    }
};

export const updateConfig = async (configData) => {
    try {
        console.log("recibido", configData);
        const response = await axios.put('config/updateConfig', configData);
        console.log('api config update', response.data);
        return response.data;
    } catch (error) {
        console.error("Error actualizando datos de configuracion: ", error);
        throw error;
    }
};