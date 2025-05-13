import { createCashClosing } from "../../api/sale";

export const cashClosingConfig = {
    entityName: "Cierre de caja",
    titlePage: "Cierre de Caja",
    entityMessage: "Registro de movimientos y cierre del día",
    entityKey: "cash-closing",

    columns: [
        { field: "TIPO", label: "Tipo" },
        { field: "DESCRIPCION", label: "Descripción" },
        { field: "HORA", label: "Hora" },
        { field: "MONTO", label: "Monto" },
    ],

    fields: [
        { name: "fecha", label: "Fecha", type: "date" },
        { name: "ventas", label: "Ventas", type: "number" },
        { name: "devoluciones", label: "Devoluciones", type: "number" },
        { name: "ingresos", label: "Ingresos", type: "number" },
        { name: "egresos", label: "Egresos", type: "number" },
        { name: "total", label: "Total", type: "number" },
    ],

    api: {
        create: createCashClosing,
    },

    transformData: {
        toFrontend: (data) => ({
            ID: data.ID,
            TIPO: data.TIPO,
            DESCRIPCION: data.DESCRIPCION,
            HORA: new Date(data.HORA).toLocaleTimeString("es-ES", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }),
            MONTO: data.MONTO,
        }),

        toBackend: (formData) => ({
            fecha: formData.fecha,
            ventas: formData.ventas,
            devoluciones: formData.devoluciones,
            ingresos: formData.ingresos,
            egresos: formData.egresos,
            total: formData.total,
        }),
    },

    transformConfig: {
        MONTO: (item) =>
            new Intl.NumberFormat("es-CR", {
                style: "currency",
                currency: "CRC",
                minimumFractionDigits: 2,
            }).format(item.MONTO),
    },

    actions: {
        create: true,
    },
};
