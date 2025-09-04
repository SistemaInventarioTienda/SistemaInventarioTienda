import {
    createProforma,
    getAllProformas,
    deleteProforma,
    searchProforma,
} from "../../api/proforma";

export const proformaConfig = {
    entityName: "Proforma",
    titlePage: "Facturas Proforma",
    entityMessage: "Gestión de facturas proforma",
    entityKey: "proformas",

    columns: [
        { field: "DSC_CODIGO_BARRAS", label: "Código de barras" },
        { field: "FEC_CREACION", label: "Fecha de creación" },
        { field: "FEC_LIMITE", label: "Fecha límite" },
        { field: "MON_TOTAL", label: "Total" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    fields: [
        { name: "FEC_LIMITE", label: "Fecha límite", type: "date" },
        { name: "MON_TOTAL", label: "Total", type: "text" },
        { name: "DSC_PROFORMA", label: "Descripción", type: "textarea" },
    ],

    api: {
        fetchAll: getAllProformas,
        searchByName: searchProforma,
        create: createProforma,
        delete: deleteProforma,
    },

    transformData: {
        toFrontend: (proforma) => ({
            ID_PROFORMA: proforma.ID_PROFORMA,
            DSC_CODIGO_BARRAS: proforma.DSC_CODIGO_BARRAS,
            FEC_CREACION: proforma.FEC_CREACION,
            FEC_LIMITE: proforma.FEC_LIMITE,
            MON_TOTAL: proforma.MON_TOTAL,
            ESTADO: proforma.ESTADO,
            PRODUCTS_LIST:
                proforma.DetailsProformas?.map((d) => ({
                    id: d.ID_PRODUCTO,
                    price: d.PRECIO_UNITARIO,
                    quantity: d.CANTIDAD,
                    tax: d.IMPUESTO,
                    discount: d.DESCUENTO,
                })) || [],
        }),

        toBackend: (formData) => ({
            FEC_LIMITE: formData.FEC_LIMITE,
            MON_TOTAL: formData.MON_TOTAL,
            details_list:
                formData.PRODUCTS_LIST?.map((p) => ({
                    ID_PRODUCT: p.id,
                    PRECIO_UNITARIO: p.price,
                    CANTIDAD: p.quantity,
                    IMPUESTO: p.tax,
                    DESCUENTO: p.discount,
                })) || [],
        }),
    },

    transformConfig: {
        ESTADO: (item) => {
            switch (item.ESTADO) {
                case 1:
                    return "ACTIVA";
                case 0:
                    return "ANULADA";
                default:
                    return "DESCONOCIDO";
            }
        },
        FEC_CREACION: (item) =>
            item.FEC_CREACION
                ? new Date(item.FEC_CREACION).toLocaleDateString("es-ES")
                : null,
        FEC_LIMITE: (item) =>
            item.FEC_LIMITE
                ? new Date(item.FEC_LIMITE).toLocaleDateString("es-ES")
                : null,
    },

    actions: {
        delete: true,
        view: true,
    },
};
