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

            ID_CLIENTE: formData.ID_CLIENTE,
            PORCENT_IMPUESTO: formData.PORCENT_IMPUESTO,
            METODO_PAGO: formData.METODO_PAGO,
            DSC_VENTA: formData.DSC_VENTA,
            ESTADO_CREDITO: formData.ESTADO_CREDITO,
            MONT_SUBTOTAL: formData.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: formData.PORCENT_DESCUENTO,
            details_list : formData.PRODUCTS_LIST.map(product => ({
                ID_PRODUCTO: product.id,
                MONTO_UNITARIO: product.price,
                CANTIDAD: product.quantity,
            })),
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
