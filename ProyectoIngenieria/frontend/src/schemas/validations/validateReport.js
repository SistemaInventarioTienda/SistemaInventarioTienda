export const validateReport = (
    { reportType, format, startDate, endDate, email, frecuency },
    isProgrammed = false
) => {
    const errors = [];

    if (!reportType) {
        errors.push("Seleccione un tipo de reporte válido.");
    }

    if (!format) {
        errors.push("Seleccione un formato de reporte.");
    }

    if (reportType !== "ProveedoresActivos") {
        if (!startDate) {
            errors.push("Seleccione una fecha de inicio.");
        }
    
        if (!endDate) {
            errors.push("Seleccione una fecha de fin.");
        }
    
        if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
            errors.push("La fecha de inicio no puede ser posterior a la fecha de fin.");
        }
    }    

    // Validaciones adicionales solo si es un reporte programado
    if (isProgrammed) {
        if (!email || !/\S+@\S+\.\S+/.test(email)) {
            errors.push("Ingrese un correo electrónico válido.");
        }

        if (!frecuency) {
            errors.push("Seleccione una frecuencia de envío.");
        }
    }

    return errors;
};
