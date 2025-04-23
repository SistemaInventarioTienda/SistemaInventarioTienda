import axios from './axios';

export const getAllDataFromGraphic = async (params) => {
    try {
        const response = await axios.get(`/graphics/all_graphics`, {
            params: {
                MIN_FEC: params?.MIN_FEC,
                MAX_FEC: params?.MAX_FEC,
                LIMIT_PRODUCTS: params?.LIMIT_PRODUCTS,
            }
        });
        return response.data.results || [];
    } catch (error) {
        console.error('Error fetching data:', error.message);
        throw error;
    }
};