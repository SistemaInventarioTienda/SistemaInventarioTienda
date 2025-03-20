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

    fields: [
        { name: "ID_CLIENTE", label: "Cliente", type: "text" },
        { name: "FEC_VENTA", label: "Fecha de venta", type: "text" },
        { name: "METODO_PAGO", label: "Método de pago", type: "text" },
        { name: "PORCENT_IMPUESTO", label: "Porcentaje de Impuesto", type: "text" },
        { name: "PORCENT_DESCUENTO", label: "Porcentaje de Descuento", type: "text" },
        { name: "MONT_SUBTOTAL", label: "Subtotal", type: "text" },
        { name: "MON_TOTAL", label: "Total", type: "text" },
        { name: "DSC_VENTA", label: "Descripción", type: "textarea" },
        { name: "ESTADO", label: "Estado", type: "text" },
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
            ID_CLIENTE: sale.ID_CLIENTE,
            FEC_VENTA: sale.FEC_VENTA,
            METODO_PAGO: sale.METODO_PAGO,
            PORCENT_IMPUESTO: sale.PORCENT_IMPUESTO,
            PORCENT_DESCUENTO: sale.PORCENT_DESCUENTO,
            MONT_SUBTOTAL: sale.MONT_SUBTOTAL,
            MON_TOTAL: sale.MON_TOTAL,
            DSC_VENTA: sale.DSC_VENTA,
            ESTADO: sale.ESTADO,
            // PRODUCTS_LIST: sale.details_list.map(product => ({
            //     id: product.ID_PRODUCTO,
            //     price: product.MONTO_UNITARIO,
            //     quantity: product.CANTIDAD,
            // })),
        }),

        toBackend: (formData) => ({

            ID_CLIENTE: formData.ID_CLIENTE,
            PORCENT_IMPUESTO: formData.PORCENT_IMPUESTO,
            METODO_PAGO: formData.METODO_PAGO,
            DSC_VENTA: formData.DSC_VENTA,
            ESTADO_CREDITO: formData.ESTADO_CREDITO,
            MONT_SUBTOTAL: formData.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: formData.PORCENT_DESCUENTO,
            details_list: formData.PRODUCTS_LIST.map(product => ({
                ID_PRODUCTO: product.id,
                MONTO_UNITARIO: product.price,
                CANTIDAD: product.quantity,
            })),
            ESTADO: formData.ESTADO,
        }),
    },

    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "PAGADA" : "ANULADA"),
    },

    // Configuración de acciones permitidas
    actions: {
        delete: true,
        view: true,
    },
};
