// src/api/proforma.js
import axios from "./axios";

// Crear proforma
export const createProforma = async (proformaData) => {
    try {
        const response = await axios.post("/proforma/createproforma", proformaData);
        return response.data;
    } catch (error) {
        console.error("Error creando la proforma:", error.message);
        throw error;
    }
};

// Obtener todas las proformas
export const getAllProformas = async (page, pageSize, orderByField, order) => {
    try {
        const response = await axios.get(`/proforma/getallproforma`, {
            params: { page, pageSize, orderByField, order },
        });
        return response.data;
    } catch (error) {
        console.error("Error obteniendo proformas:", error.message);
        throw error;
    }
};

// Eliminar (anular) proforma
export const deleteProforma = async (id) => {
    try {
        const response = await axios.put(`/proforma/deleteproforma/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error anulando la proforma:", error.message);
        throw error;
    }
};

// (Opcional) Buscar proforma
export const searchProforma = async (
    page,
    pageSize,
    termSearch,
    orderByField,
    order
) => {
    try {
        const response = await axios.get(`/proforma/getproforma`, {
            params: { page, pageSize, termSearch, orderByField, order },
        });
        return response.data;
    } catch (error) {
        console.error("Error buscando proforma:", error.message);
        throw error;
    }
};

// Obtener proforma lista para convertir en venta
export const getProformaSale = async (id) => {
    try {
        const response = await axios.get(`/proforma/proformasale/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error obteniendo proforma para venta:", error.message);
        throw error;
    }
};