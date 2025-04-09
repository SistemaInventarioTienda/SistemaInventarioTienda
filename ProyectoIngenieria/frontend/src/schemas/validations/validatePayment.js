export const validatePayment = (formData) => {
    const errors = [];
    let pendingAmount = formData.MON_PENDIENTE;
    // Validar que MON_ABONADO esté presente
    if (!formData.MON_ABONADO && formData.MON_ABONADO !== 0) {
        errors.push("El campo 'Monto abonado' es obligatorio.");
    }

    // Validar que MON_ABONADO sea un número
    if (isNaN(formData.MON_ABONADO)) {
        errors.push("El campo 'Monto abonado' debe ser un número válido.");
    }

    // Validar que MON_ABONADO sea mayor que 0
    if (parseFloat(formData.MON_ABONADO) <= 0) {
        errors.push("El campo 'Monto abonado' debe ser mayor que 0.");
    }

    // Validar que MON_ABONADO no sea mayor que el saldo pendiente
    if (parseFloat(formData.MON_ABONADO) > parseFloat(pendingAmount)) {
        errors.push("El monto abonado no puede ser mayor que el saldo pendiente.");
    }
    return errors;
}