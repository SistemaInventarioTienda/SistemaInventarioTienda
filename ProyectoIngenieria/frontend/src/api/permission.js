import axios from '../api/axios';

export const getAllPermission = async () => {
    try {
        return {
            home: true,
            user: true,
            product: true,
            categories: true,
            suppliers: true,
            clients: true,
            sales: true,
            shopping: true,
            reports: true
        };
    } catch (error) {
        console.error('Error fetching permissions:', error.message);
        throw error;
    }
};
