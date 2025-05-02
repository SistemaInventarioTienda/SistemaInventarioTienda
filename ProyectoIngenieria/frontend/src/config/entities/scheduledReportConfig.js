// config/entities/scheduledReportConfig.js
import { getScheduledReports, downloadReport } from "../../api/report";

export const scheduledReportConfig = {
    entityName: "Reporte Programado",
    titlePage: "Reportes Programados",
    entityMessage: "Listado de reportes programados en el sistema",
    entityKey: "scheduledReports",

    columns: [
        { field: "nombreReporte", label: "Nombre del reporte" },
        { field: "tipoReporte", label: "Tipo" },
        { field: "fechaProgramacion", label: "Fecha de Programación" },
        { field: "frecuencia", label: "Frecuencia" },
        { field: "correo", label: "Correo Destino" },
        { field: "formato", label: "Formato" },
        { field: "actions", label: "Acciones" }
    ],

    fields: [
        { name: "nombreReporte", label: "Nombre del reporte", type: "text", required: true },
        { name: "tipoReporte", label: "Tipo de Reporte", type: "text", required: true },
        { name: "fechaProgramacion", label: "Fecha de Programación", type: "text", required: true },
        { name: "frecuencia", label: "Frecuencia", type: "text", required: true, },
        { name: "correo", label: "Correo Electrónico", type: "email", required: true },
        { name: "formato", label: "Formato de Reporte", type: "text", required: true, }
    ],

    api: {
        fetchAll: getScheduledReports,
        delete: null
    },

    transformData: {
        toFrontend: (report) => ({
            nombreReporte: report.nombreReporte,
            tipoReporte: report.tipoReporte,
            fechaProgramacion: report.fechaProgramacion,
            frecuencia: report.frecuencia,
            correo: report.correo,
            formato: report.formato,
            archivo: report.filename
        })
    },

    actions: {
        view: true,
        download: true,
        delete: true,
        downloadHandler: (report) => downloadReport(report.filename)
    }
}