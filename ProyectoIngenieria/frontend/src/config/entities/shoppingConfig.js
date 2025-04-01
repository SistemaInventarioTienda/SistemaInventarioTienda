import {
    getAllShoppings,
    searchShopping,
    registerShopping,
    deleteShopping,
} from "../../api/shopping";

export const shoppingConfig = {
    entityName: "Compra",
    titlePage: "Compras",
    entityMessage: "Gestión de las compras de la tienda",
    entityKey: "purchases",

    columns: [
        { field: "DSC_NOMBRE", label: "Proveedor" },
        { field: "FEC_COMPRA", label: "Fecha de compra" },
        { field: "METODO_PAGO", label: "Método de pago" },
        { field: "MONT_SUBTOTAL", label: "Subtotal" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    fields: [
        { name: "DSC_NOMBRE", label: "Proveedor", type: "text" },
        { name: "FEC_COMPRA", label: "Fecha de compra", type: "text" },
        { name: "METODO_PAGO", label: "Método de pago", type: "text" },
        { name: "PORCENT_IMPUESTO", label: "Impuesto (%)", type: "number" },
        { name: "PORCENT_DESCUENTO", label: "Descuento (%)", type: "number" },
        { name: "MONT_SUBTOTAL", label: "Subtotal", type: "number" },
        { name: "DSC_COMPRA", label: "Descripción", type: "textarea" },
    ],

    api: {
        fetchAll: getAllShoppings,
        searchByName: searchShopping,
        create: registerShopping,
        delete: deleteShopping,
    },

    transformData: {
        toFrontend: (purchase) => ({
            ID_COMPRA: purchase.ID_COMPRA,
            ID_PROVEEDOR: purchase.ID_PROVEEDOR,
            DSC_NOMBRE: purchase.DSC_NOMBRE || purchase.Supplier?.DSC_NOMBRE || "Sin nombre",
            FEC_COMPRA: purchase.FEC_COMPRA,
            PORCENT_IMPUESTO: purchase.PORCENT_IMPUESTO,
            METODO_PAGO: purchase.METODO_PAGO,
            DSC_COMPRA: purchase.DSC_COMPRA,
            MONT_SUBTOTAL: purchase.MONT_SUBTOTAL,
            PORCENT_DESCUENTO: purchase.PORCENT_DESCUENTO,
            PRODUCTS_LIST: purchase.DETALLES?.map(product => ({
                id: product.ID_PRODUCTO,
                price: product.MON_COMPRA,
                quantity: product.CANTIDAD,
            })) || [],
        }),

        toBackend: (formData) => ({
            ID_PROVEEDOR: formData.ID_PROVEEDOR,
            DSC_METODO_PAGO: formData.DSC_METODO_PAGO,
            DSC_COMPRA: formData.DSC_COMPRA,
            PRODUCTS_LIST: formData.PRODUCTS_LIST?.map(product => ({
                MON_PRECIO_COMPRA: product.price,
                MON_CANTIDAD: product.quantity,
            })) || [],
            MON_TOTAL: formData.MON_TOTAL,
            FEC_COMPRA: new Date().toISOString(),
            FEC_ENTRADA: new Date().toISOString(),
        }),
    },

    transformConfig: {
        FEC_COMPRA: (item) => item.FEC_COMPRA
            ? new Date(item.FEC_COMPRA).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            }) + " " + new Date(item.FEC_COMPRA).toLocaleTimeString("es-ES", {
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