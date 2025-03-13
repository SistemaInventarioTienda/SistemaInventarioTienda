// Configuración de la entidad "Compras"

import {
    getAllSales,
    searchSale,
    registerSale,
    deleteSale,
} from "../../api/sale";

// Configuración principal de la entidad
export const salesConfig = {
    entityName: "Venta",
    titlePage: "Ventas",
    entityMessage: "Gestión de las ventas de la tienda",
    entityKey: "sales", // Clave única para identificar los datos de esta entidad

    // Configuración de columnas para la tabla
    columns: [
        { field: "CLIENTE", label: "Cliente" },
        { field: "PRODUCTO", label: "Producto" },
        { field: "FEC_VENTA", label: "Fecha de venta" },
        { field: "MON_TOTAL", label: "Total" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    // Configuración de campos del formulario
    fields: [

    ],

    // Funciones API específicas de la entidad
    api: {
        fetchAll: getAllSales,
        searchByName: searchSale,
        create: registerSale,
        delete: deleteSale,
    },

    // Transformaciones de datos
    transformData: {
        toFrontend: (sale) => ({
            MON_TOTAL: sale.MON_TOTAL,
        }),

        toBackend: (formData) => ({
            FEC_VENTA: formData.FEC_VENTA,
            ID_CLIENTE: formData.ID_CLIENTE,
            PRODUCTS_LIST: formData.PRODUCTS_LIST,
            ESTADO: formData.ESTADO,
        }),
    },

    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "ELIMINADA"),
    },

    // Configuración de acciones permitidas
    actions: {
        edit: true,
        delete: true,
        view: true,
    },
};
