import axios from '../api/axios';

//funcion para registrar proveedores
export const registerSupplier = async (supplierData) => {
    try {
        const response = await axios.post('supplier/saveSupplier', supplierData);
        return response.data;
    } catch (error) {
        console.error('Error registrando el proveedor', error);
        throw error;

    }
};

//funcion para obtener todos los proveedores.
export const getSuppliers = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get('supplier/suppliers', {
            params: { page, pageSize, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error obteniendo los proveedores:', error.message);
        throw error;
    }
};

//funcion para eliminar un proveedor
export const deleteSupplier = async (IDENTIFICADOR_PROVEEDOR) => {
    try {
        console.log('Deleting supplier', IDENTIFICADOR_PROVEEDOR);
        const response = await axios.put('supplier/deleteSupplier', { IDENTIFICADOR_PROVEEDOR });
        return response.data;
    } catch (error) {
        console.error('Error deleting supplier:', error.message);
        throw error;
    }
};

//funcion para actualizar un proveedor

export const updateSupplier = async (supplierData) => {
    console.log("recibido", supplierData);
    try {
        const response = await axios.put('supplier/updateSupplier', supplierData);
        return response.data;
    } catch (error) {
        console.error('Error actualizando el proveedor:', error.message);
        throw error;
    }
};

// Función para obtener todos los tipos de proveedores
export const getAllSupplierTypes = async () => {
    try {
        const response = await axios.get('supplier/supplierTypes');
        return response.data;
    } catch (error) {
        console.error('Error al obtener los tipos de proveedores:', error);
        throw error;
    }
};

// Función para buscar un proveedor
export const searchSupplier = async (page, pageSize, termSearch, orderByField, order) => {
    try {
        const response = await axios.get('supplier/searchSupplier', {
            params: { page, pageSize, termSearch, orderByField, order }
        });
        return response.data;
    } catch (error) {
        console.error('Error buscando el proveedor:', error.message);
        throw error;
    }
};