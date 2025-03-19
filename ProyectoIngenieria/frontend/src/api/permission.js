import axios from '../api/axios';

export const getAllPermission = async () => {
    try {
        const response = await axios.get(`/auth/getmypermissions`);
        
        const result = mapRecords(response?.data?.permissions);
        console.log(result)
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
        reports: permissions.some(registro => registro.nombre === 'Reportes' && registro.estado),
    };
    return resultado;
}
