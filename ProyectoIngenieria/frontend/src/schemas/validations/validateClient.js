export const validateClient = (phones) => {

    const errors = [];

    if (phones.length <= 0) {
        errors.push("La lista de teléfonos es requerida y no puede estar vacía. Ingrese al menos un teléfono.");
    }

    return errors;
}