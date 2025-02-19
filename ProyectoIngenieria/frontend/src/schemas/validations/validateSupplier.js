export const validateSupplier = (formData, phones, emails) => {

    const errors = [];

    const tipoProveedorValue = parseInt(formData.tipoProveedor, 10);
    if (isNaN(tipoProveedorValue) || tipoProveedorValue <= 0) {
        console.log("TIPO DE PROVEEDOR", formData.tipoProveedor);
        errors.push('Seleccione un tipo de proveedor válido.');
    }

    if (phones.length <= 0) {
        errors.push("La lista de teléfonos es requerida y no puede estar vacía. Ingrese al menos un teléfono.");
    }

    if (emails.length <= 0) {
        errors.push("La lista de correos es requerida y no puede estar vacía. Ingrese al menos un correo.");
    }

    return errors;
}