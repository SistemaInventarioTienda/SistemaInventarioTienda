import axios from '../api/axios';

export const getMyPermission = async (user) => {
    try {
        const response = await axios.get(`/auth/getmypermissions`, user?.DSC_CEDULA ? user?.DSC_CEDULA : "");
        
        const result = mapRecords(response?.data?.permissions);
        return result;
    } catch (error) {
        console.error('Error fetching permissions:', error.message);
        throw error;
    }
};

function mapRecords(permissions) {
    const resultado = {
        home: true, // Siempre es true
        user: permissions.some(registro => registro.nombre === 'Usuarios' && registro.estado),
        product: permissions.some(registro => registro.nombre === 'Productos' && registro.estado),
        categories: permissions.some(registro => registro.nombre === 'Categorias' && registro.estado),
        suppliers: permissions.some(registro => registro.nombre === 'Proveedores' && registro.estado),
        clients: permissions.some(registro => registro.nombre === 'Clientes' && registro.estado),
        sales: permissions.some(registro => registro.nombre === 'Ventas' && registro.estado),
        shopping: permissions.some(registro => registro.nombre === 'Compras' && registro.estado),
        transaction: permissions.some(registro => registro.nombre === 'Transacciones' && registro.estado),
        reports: permissions.some(registro => registro.nombre === 'Reportes' && registro.estado),
        cashClosing: permissions.some(registro => registro.nombre === 'Reportes' && registro.estado),
    };
    return resultado;
}

export const assignPermission = async (user, PERMISSION_LIST) => {
    try {
        const requestBody = {
            PERMISSION_LIST: PERMISSION_LIST,
        };
        const response = await axios.put(`/user/assign_permission/${user?.DSC_CEDULA}`, requestBody);
        return response;
    } catch (error) {
        console.error('Error fetching permissions:', error.message);
        throw error;
    }
};