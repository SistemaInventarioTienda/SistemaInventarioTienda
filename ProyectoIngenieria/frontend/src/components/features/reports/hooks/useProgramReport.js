import { useState, useCallback } from "react";
import { toast } from "sonner";
import { programReport } from "../../../../api/report";
import { validateReport } from "../../../../schemas/validations/validateReport";

// Opciones para los selects
const reportTypeOptions = [
    { value: "", label: "Seleccionar tipo de reporte" },
    { value: "sales", label: "Ventas" },
    { value: "clients", label: "Clientes" },
    { value: "suppliers", label: "Proveedores" },
    { value: "products", label: "Productos" }
];

const formatOptions = [
    { value: "", label: "Seleccionar formato" },
    { value: "pdf", label: "PDF" },
    { value: "excel", label: "Excel" }
];


export function useProgramReport() {
    const [reportType, setReportType] = useState("");
    const [format, setFormat] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [email, setEmail] = useState("");
    const [frecuency, setFrecuency] = useState("");
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

    // Función para el cambio del correo
    const handleEmailChange = useCallback((e) => {
        setFormat(e.target.value);
    }, []);

    // Función para el cambio de la frecuencia del reporte
    const handleFrecuencyChange = useCallback((value) => {
        setFrecuency(prev => (prev === value ? "" : value));
    }, []);    

    // Función submit para generar el reporte
    const handleSubmit = async () => {
        const errors = validateReport({ reportType, format, startDate, endDate, email, frecuency }, true);

        if (errors.length > 0) {
            errors.forEach(error => toast.error(error));
            return;
        }

        toast.info("Programando reporte...");

        try {
            const params = {
                EXTENSION: format,
                TYPE: reportType,
                MIN_FEC: startDate?.toISOString().split('T')[0] || '',
                MAX_FEC: endDate?.toISOString().split('T')[0] || '',
                EMAIL: email,
                FRECUENCY: frecuency,
            };

            const response = await programReport(params);

            if (response) {
                toast.success("Reporte programado correctamente.");
            } else {
                toast.error("Error al programar el reporte.");
            }
        } catch (error) {
            toast.error("Error al programar el reporte." + error);
            console.error("Error al programar el reporte:", error);
        }
    };

    return {
        reportType,
        format,
        startDate,
        endDate,
        email,
        frecuency,

        previewData,
        isLoading,
        showNoDataMessage,

        reportTypeOptions,
        formatOptions,

        handleReportTypeChange,
        handleFormatChange,
        handleStartDateChange,
        handleEndDateChange,
        handleEmailChange,
        handleFrecuencyChange,


        handleSubmit,
    };
}
