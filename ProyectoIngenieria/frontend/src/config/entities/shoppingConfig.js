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
    entityKey: "shopping",

    columns: [
        { field: "PROVEEDOR", label: "Proveedor" },
        { field: "FEC_COMPRA", label: "Fecha de compra" },
        { field: "DSC_METODO_PAGO", label: "Método de pago" },
        { field: "MON_TOTAL", label: "Total" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    fields: [
        { name: "PROVEEDOR", label: "Proveedor", type: "text" },
        { name: "FEC_COMPRA", label: "Fecha de compra", type: "text" },
        { name: "DSC_METODO_PAGO", label: "Método de pago", type: "text" },
        { name: "MON_TOTAL", label: "Total", type: "number" },
    ],

    api: {
        fetchAll: getAllShoppings,
        searchByName: searchShopping,
        create: registerShopping,
        delete: deleteShopping,
    },

    transformData: {
        toFrontend: (shopping) => {
            const products = shopping.PRODUCTS_LISTS || [];

            const total = products.reduce((acc, product) => {
                return acc + (product.MON_CANTIDAD * product.MON_PRECIO_COMPRA);
            }, 0);

            return {
                ID_COMPRA: shopping.ID_COMPRA,
                PROVEEDOR: shopping.PROVEEDOR || "Sin proveedor",
                FEC_COMPRA: shopping.FEC_COMPRA,
                DSC_METODO_PAGO: shopping.DSC_METODO_PAGO,
                MON_TOTAL: total,
                ESTADO: shopping.ESTADO,
                PRODUCTS_LIST: products.map(product => ({
                    name: product.DSC_NOMBRE,
                    quantity: product.MON_CANTIDAD,
                    price: product.MON_PRECIO_COMPRA,
                })),
                CAN_CANCEL: shopping.CAN_CANCEL,
            };
        },

        toBackend: (formData) => ({
            ID_PROVEEDOR: formData.ID_PROVEEDOR,
            DSC_METODO_PAGO: formData.DSC_METODO_PAGO,
            DSC_COMPRA: formData.DSC_COMPRA,
            PRODUCTS_LIST: formData.PRODUCTS_LIST?.map(product => ({
                DSC_CODIGO_BARRAS: product.barcode,
                MON_PRECIO_COMPRA: product.price,
                MON_CANTIDAD: product.quantity,
            })) || [],
            MON_TOTAL: formData.MON_TOTAL,
            FEC_ENTRADA: formData.FEC_ENTRADA,
            FEC_COMPRA: new Date().toISOString(),
        }),
    },

    transformConfig: {
        FEC_COMPRA: (item) => item.FEC_COMPRA
            ? new Date(item.FEC_COMPRA).toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
            : null,
        ESTADO: (item) => {
            const estado = parseInt(item.ESTADO, 10);
            switch (estado) {
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
    },

    actions: {
        delete: true,
        view: true,
    },
};