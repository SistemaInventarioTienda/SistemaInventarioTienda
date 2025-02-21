export const validateProduct = (formData ) => {

    const errors = [];

    const subcategoriaValue = parseInt(formData.SUBCATEGORIA, 10);
    if (isNaN(subcategoriaValue) || subcategoriaValue <= 0) {
        console.log("SUBCATEGORIA", formData.SUBCATEGORIA);
        errors.push('Seleccione un tipo de categoría válido para el producto.');
    }

    return errors;
}