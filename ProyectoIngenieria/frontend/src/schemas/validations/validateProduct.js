export const validateProduct = (formData ) => {

    const errors = [];

    const subcategoriaValue = parseInt(formData.ID_SUBCATEGORIE, 10);
    if (isNaN(subcategoriaValue) || subcategoriaValue <= 0) {
        console.log("TIPO DE PROVEEDOR", formData.ID_SUBCATEGORIE);
        errors.push('Seleccione un tipo de categoría válido para el producto.');
    }

    return errors;
}