import { createCashClosing, getAllCashClosingData } from "../../api/cashClosing";
import { formatPrice } from "../../utils/formatters";

export const cashClosingConfig = {
    entityName: "Cierre de caja",
    titlePage: "Cierre de Caja",
    entityMessage: "Registro de movimientos y cierre del día",
    entityKey: "cash-closing",

    columns: [
        { field: "TIPO", label: "Tipo" },
        { field: "DESCRIPCION", label: "Descripción" },
        { field: "HORA", label: "Hora" },
        { field: "MONTO", label: "Monto", formatter: formatPrice },
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
        fetchAll: getAllCashClosingData,
        create: createCashClosing,
    },

    transformData: {
        toFrontend: (data) => {
            const date = new Date(data.FECHA);
            const hora = date.toLocaleTimeString("es-CR", { hour: '2-digit', minute: '2-digit' });
            return {
                ID: data.ID,
                TIPO: data.TIPO,
                DESCRIPCION: data.DESCRIPCION,
                HORA: hora,
                MONTO: data.MONTO,
                METODOPAGO: data.METODOPAGO,
            };
        },
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
        MONTO: (item) => formatPrice(item.MONTO),
    },

    actions: {
        create: true,
    },
};
