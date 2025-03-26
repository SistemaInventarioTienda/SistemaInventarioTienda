import { getProductById } from "../../api/product";
import {
    getAllSales,
    searchSale,
    registerSale,
    deleteSale,
} from "../../api/sale";

export const salesConfig = {
    entityName: "Venta",
    titlePage: "Ventas",
    entityMessage: "Gestión de las ventas de la tienda",
    entityKey: "sales",

    columns: [
        { field: "DSC_NOMBRE", label: "Cliente" },
        { field: "FEC_VENTA", label: "Fecha de venta" },
        { field: "METODO_PAGO", label: "Método de pago" },
        { field: "MONT_SUBTOTAL", label: "Subtotal" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    fields: [
        { name: "DSC_NOMBRE", label: "Cliente", type: "text" },
        { name: "FEC_VENTA", label: "Fecha de venta", type: "text" },
        { name: "METODO_PAGO", label: "Método de pago", type: "text" },
        { name: "PORCENT_IMPUESTO", label: "Porcentaje de Impuesto", type: "text" },
        { name: "PORCENT_DESCUENTO", label: "Porcentaje de Descuento", type: "text" },
        { name: "MONT_SUBTOTAL", label: "Subtotal", type: "text" },
        { name: "DSC_VENTA", label: "Descripción", type: "textarea" },
        { name: "ESTADO", label: "Estado", type: "text" },
    ],

    api: {
        fetchAll: getAllSales,
        searchByName: searchSale,
        create: registerSale,
        delete: deleteSale,
    },

    transformData: {
        toFrontend: (sale) => ({
            ID_VENTA: sale.ID_VENTA,
            ID_CLIENTE: sale.ID_CLIENTE,
            DSC_NOMBRE: sale.DSC_NOMBRE || sale.Client?.DSC_NOMBRE || "Sin nombre",
            FEC_VENTA: sale.FEC_VENTA,
            PORCENT_IMPUESTO: sale.PORCENT_IMPUESTO,
            METODO_PAGO: sale.METODO_PAGO,
            DSC_VENTA: sale.DSC_VENTA,
            ESTADO_CREDITO: sale.ESTADO_CREDITO,
            MONT_SUBTOTAL: sale.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: sale.PORCENT_DESCUENTO,
            ESTADO: sale.ESTADO,
            PRODUCTS_LIST: sale.DETALLES?.map(product => ({
                id: product.ID_PRODUCTO,
                price: product.MONT_UNITARIO,
                quantity: product.CANTIDAD,
            })) || [],
            CAN_CANCEL: sale.CAN_CANCEL,
        }),

        toBackend: (formData) => ({
            ID_CLIENTE: formData.ID_CLIENTE,
            PORCENT_IMPUESTO: formData.PORCENT_IMPUESTO,
            METODO_PAGO: formData.METODO_PAGO,
            DSC_VENTA: formData.DSC_VENTA,
            ESTADO_CREDITO: formData.ESTADO_CREDITO,
            MONT_SUBTOTAL: formData.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: formData.PORCENT_DESCUENTO,
            details_list: formData.PRODUCTS_LIST?.map(product => ({
                ID_PRODUCTO: product.id,
                MONTO_UNITARIO: product.price,
                CANTIDAD: product.quantity,
            })) || [],
            ESTADO: formData.ESTADO,
        }),
    },

    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "PAGADA" : "ANULADA"),
        FEC_VENTA: (item) => item.FEC_VENTA
            ? new Date(item.FEC_VENTA).toLocaleDateString("es-ES", { 
                day: "2-digit", 
                month: "long", 
                year: "numeric" 
            }) + " " + new Date(item.FEC_VENTA).toLocaleTimeString("es-ES", { 
                hour: "2-digit", 
                minute: "2-digit", 
                second: "2-digit" 
            })
            : null,
    },

    actions: {
        delete: true,
        view: true,
    },
};
