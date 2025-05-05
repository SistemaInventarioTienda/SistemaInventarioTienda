// config/entities/reportConfig.js
import { getReports, downloadReport } from "../../api/report"

export const reportConfig = {
    entityName: "Reporte",
    titlePage: "Historial de Reportes",
    entityMessage: "Listado de reportes generados",
    entityKey: "reports",

    columns: [
        { field: "nombreReporte", label: "Nombre del reporte" },
        { field: "tipoReporte", label: "Tipo" },
        { field: "fechaRealizado", label: "Fecha de Creación" },
        { field: "formato", label: "Formato" },
        { field: "actions", label: "Acciones" }
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "nombreReporte", label: "Nombre del reporte", type: "text", required: true },
        { name: "tipoReporte", label: "Tipo de Reporte", type: "text", required: true },
        { name: "fechaRealizado", label: "Fecha de Creación del Reporte", type: "text", required: true },
        { name: "formato", label: "Formato de Reporte", type: "text", required: false },
    ],

    api: {
        fetchAll: getReports,
        searchByName: null,
        create: null,
        update: null,
        delete: null
    },

    transformData: {
        toFrontend: (report) => ({
            nombreReporte: report.nombreReporte,
            tipoReporte: report.tipoReporte,
            fechaRealizado: report.fechaRealizado,
            fechaInicio: report.fechaInicio,
            fechaFin: report.fechaFin,
            formato: report.formato,
            archivo: report.filename,
        }),
    },

    transformConfig: {
        fechaRealizado: (item) => {
            if (!item.fechaRealizado) return null;

            const [year, month, day] = item.fechaRealizado.split("-");
            const date = new Date(Number(year), Number(month) - 1, Number(day));

            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        },
        fechaInicio: (item) => {
            if (!item.fechaInicio) return null;

            const [year, month, day] = item.fechaInicio.split("-");
            const date = new Date(Number(year), Number(month) - 1, Number(day));

            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        },
        fechaFin: (item) => {
            if (!item.fechaFin) return null;

            const [year, month, day] = item.fechaFin.split("-");
            const date = new Date(Number(year), Number(month) - 1, Number(day));

            return date.toLocaleDateString("es-ES", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            });
        },
    },

    actions: {
        view: true,
        download: true,
        downloadHandler: (report) => downloadReport(report.filename)
    }
}