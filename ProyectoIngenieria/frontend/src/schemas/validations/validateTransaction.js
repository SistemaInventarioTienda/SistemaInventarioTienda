export const validateTransaction = (formData) => {
    const errors = [];
    
    if ( formData.METODO_PAGO === ""||formData.METODO_PAGO === null|| formData.METODO_PAGO === undefined) {
        errors.push("Por favor, seleccione un metodo de pago válido.");
    }
    
    if ( formData.TIPO_TRANSACCION === ""||formData.TIPO_TRANSACCION === null|| formData.TIPO_TRANSACCION === undefined) {
        errors.push("Por favor, seleccione un tipo de transaccion válido.");
    }

    if (!formData.MONTO_PAGO) {
        errors.push("Por favor, ingrese un monto válido.");
    } else if (isNaN(formData.MONTO_PAGO) || Number(formData.MONTO_PAGO) <= 0) {
        errors.push("El monto debe ser un número positivo.");
    }

    if (!formData.DSC_TRANSACCION || formData.DSC_TRANSACCION.trim() === "") {
        errors.push("Por favor, ingrese una descripción de la transacción.");
    }

    console.log("ESTADO", formData.estado);
    if(formData.estado === 0 || formData.estado === undefined){
        errors.push("Por favor, seleccione un estado válido para la transacción.");
    }

    return errors;
};
