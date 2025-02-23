export const validateGeneral = (formData) => {
    const errors = [];

    const estadoValue = parseInt(formData.estado, 10);
    if (isNaN(estadoValue) || estadoValue === 0 || estadoValue === "") {
        errors.push("Por favor, seleccione un estado válido.");
    }

    return errors;
};
