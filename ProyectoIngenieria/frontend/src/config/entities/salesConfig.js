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
        { field: "DSC_SALETYPE", label: "Tipo de venta" },
        { field: "MONT_SUBTOTAL", label: "Subtotal" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    fields: [
        { name: "DSC_NOMBRE", label: "Cliente", type: "text" },
        { name: "FEC_VENTA", label: "Fecha de venta", type: "text" },
        { name: "DSC_SALETYPE", label: "Tipo de venta", type: "text" },
        { name: "METODO_PAGO", label: "Método de pago", type: "text" },
        { name: "MONT_SUBTOTAL", label: "Subtotal", type: "text" },
        { name: "MONT_TOTAL", label: "Total", type: "text" },
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
            DSC_SALETYPE: sale.ESTADO_CREDITO === 0 ? "Venta a contado" : "Venta a crédito",
            ESTADO: sale.ESTADO,
            PRODUCTS_LIST: sale.DETALLES?.map(product => ({
                id: product.ID_PRODUCTO,
                price: product.MONT_UNITARIO,
                quantity: product.CANTIDAD,
                tax: product.PORCENT_IMPUESTO || 0,
                discount: product.PORCENT_DESCUENTO || 0,
            })) || [],
            MONT_TOTAL: (() => {
                const subtotal = sale.MONT_SUBTOTAL || 0;
                const descuento = sale.PORCENT_DESCUENTO || 0;
                const impuesto = sale.PORCENT_IMPUESTO || 0;

                const descuentoAplicado = (subtotal * descuento) / 100;
                const subtotalConDescuento = subtotal - descuentoAplicado;
                const impuestoAplicado = (subtotalConDescuento * impuesto) / 100;

                return subtotalConDescuento + impuestoAplicado;
            })(),
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
                PORCENT_IMPUESTO: product.tax || 0,
                PORCENT_DESCUENTO: product.discount || 0,
            })) || [],
            FEC_VENCIMIENTO: formData.FEC_VENCIMIENTO,
            ESTADO: formData.ESTADO,
            DSC_CORREO: formData.DSC_EMAIL
        }),
    },

    transformConfig: {
        DSC_SALETYPE: (item) => (item.ESTADO_CREDITO === 0 ? "Venta a contado" : "Venta a crédito"),
        ESTADO: (item) => {
            switch (item.ESTADO) {
                case 1:
                    return "PAGADA";
                case 2:
                    return "ANULADA";
                case 3:
                    return "PENDIENTE";
                default:
                    return "DESCONOCIDO";
            }
        },
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
