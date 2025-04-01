export const validateShopping = (shoppingData) => {
    const errors = [];

    // Validar proveedor
    if (!shoppingData.selectedSupplier) {
        errors.push("Debe seleccionar un proveedor");
    }

    // Validar productos
    if (shoppingData.selectedProducts.length === 0) {
        errors.push("Debe seleccionar al menos un producto");
    }

    // Validar método de pago
    if (!shoppingData.selectedPaymentMethod) {
        errors.push("Debe seleccionar un método de pago");
    }

    // Validar porcentajes
    if (shoppingData.taxRate < 0 || shoppingData.taxRate > 100) {
        errors.push("El impuesto debe estar entre 0% y 100%");
    }

    if (shoppingData.discount < 0 || shoppingData.discount > 100) {
        errors.push("El descuento debe estar entre 0% y 100%");
    }

    return errors;
};