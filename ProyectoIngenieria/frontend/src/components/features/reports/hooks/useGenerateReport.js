import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateReport } from "../../../../api/report";
import { validateReport } from "../../../../schemas/validations/validateReport";
import { openReportViewerInNewWindow } from "../utils/openReportViewer";

// Opciones para los selects
const reportTypeOptions = [
    { value: "", label: "Seleccionar tipo de reporte" },
    { value: "ComprasXProveedor", label: "Compras por proveedor" },
    { value: "VentasXCliente", label: "Ventas por cliente" },
    { value: "ReporteTransaccion", label: "Reporte de transacciones" },
    { value: "ReporteProductos", label: "Reporte de productos" },
];

const formatOptions = [
    { value: "", label: "Seleccionar formato" },
    { value: "pdf", label: "PDF" },
    { value: "xlsx", label: "Excel" }
];


export function useGenerateReport() {
    const [reportType, setReportType] = useState("");
    const [format, setFormat] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [reportURL, setReportURL] = useState(null);

    const addOneDay = (dateStr) => {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + 1);
        return date.toISOString().split('T')[0];
    };

    // Función para actualizar la vista previa
    const updatePreview = useCallback(() => {
        if (!reportType) return;

        setPreviewData([]);
        setShowNoDataMessage(true);
    }, [reportType, startDate, endDate]);

    // Función para el cambio de tipo de reporte
    const handleReportTypeChange = useCallback((e) => {
        const value = e.target.value;
        setReportType(value);
        if (value) {
            setTimeout(() => updatePreview(), 0);
        } else {
            setPreviewData([]);
        }
    }, [updatePreview]);

    // Función para el cambio del formato del reporte
    const handleFormatChange = useCallback((e) => {
        setFormat(e.target.value);
    }, []);

    // Función para el cambio de la fecha de inicio
    const handleStartDateChange = useCallback((date) => {
        setStartDate(date);
        if (reportType) {
            setTimeout(() => updatePreview(), 0);
        }
    }, [reportType, updatePreview]);

    // Función para el cambio de la fecha de fin
    const handleEndDateChange = useCallback((date) => {
        setEndDate(date);
        if (reportType) {
            setTimeout(() => updatePreview(), 0);
        }
    }, [reportType, updatePreview]);

    // Función para limpiar campos del formulario
    const resetForm = () => {
        setReportType("");
        setFormat("");
        setStartDate(null);
        setEndDate(null);
        setPreviewData([]);
        setShowNoDataMessage(false);
    };


    // Función submit para generar el reporte
    const handleSubmit = async () => {
        const errors = validateReport({ reportType, format, startDate, endDate });

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        toast.info("Generando reporte...");

        try {
            let maxFec = endDate?.toISOString().split('T')[0] || '';

            if (reportType === "ReporteTransaccion" && endDate) {
                maxFec = addOneDay(maxFec);
            }

            const params = {
                EXTENSION: format,
                TYPE: reportType,
                MIN_FEC: startDate?.toISOString().split('T')[0] || '',
                MAX_FEC: maxFec,
            };

            const response = await generateReport(params);

            if (response.downloadLink) {
                setReportURL(response.downloadLink);
                toast.success("Reporte generado correctamente.");
                openReportViewerInNewWindow(format, response.downloadLink);
                setTimeout(() => resetForm(), 500);
            } else {
                toast.error("No se recibió un enlace de descarga.");
            }
        } catch (error) {
            toast.error("Error al generar el reporte." + error);
            console.error("Error al generar el reporte:", error);
        }
    };

    return {
        reportType,
        format,
        startDate,
        endDate,
        previewData,
        isLoading,
        showNoDataMessage,

        reportTypeOptions,
        formatOptions,

        handleReportTypeChange,
        handleFormatChange,
        handleStartDateChange,
        handleEndDateChange,
        updatePreview,

        handleSubmit,

    };
}
