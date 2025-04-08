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

    // Validación de fecha de recepción
    if (!shoppingData.productReceiptDate) {
        errors.push("Debe especificar la fecha en que se recibieron los productos en inventario");
    }

    return errors;
};