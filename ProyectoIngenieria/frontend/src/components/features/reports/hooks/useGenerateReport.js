import { useState, useCallback } from "react";
import { toast } from "sonner";
import { generateReport } from "../../../../api/report";
import { validateReport } from "../../../../schemas/validations/validateReport";
import { getPreviewColumns, getPreviewData } from "../../../../config/entities/reportConfig";

// Opciones para los selects
const reportTypeOptions = [
    { value: "", label: "Seleccionar tipo de reporte" },
    { value: "ComprasXProveedor", label: "Compras por proveedor" },
    // { value: "clients", label: "Clientes" },
    // { value: "suppliers", label: "Proveedores" },
    // { value: "products", label: "Productos" }
];

const formatOptions = [
    { value: "", label: "Seleccionar formato" },
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" }
];


export function useGenerateReport() {
    const [reportType, setReportType] = useState("");
    const [format, setFormat] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [previewData, setPreviewData] = useState([]);
    const [showNoDataMessage, setShowNoDataMessage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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
            const params = {
                EXTENSION: format,
                TYPE: reportType,
                MIN_FEC: startDate?.toISOString().split('T')[0] || '',
                MAX_FEC: endDate?.toISOString().split('T')[0] || ''
            };

            const response = await generateReport(params);

            if (response.downloadLink) {
                window.open(response.downloadLink, '_blank');
                toast.success("Reporte generado correctamente.");
                resetForm();
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

        getPreviewColumns,
        getPreviewData,
    };
}
