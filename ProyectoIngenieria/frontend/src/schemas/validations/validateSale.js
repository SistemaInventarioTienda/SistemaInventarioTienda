// validateSale.js
export const validateSale = (saleData) => {
    const errors = [];

    // Validar tipo de venta
    if (saleData.selectedSaleType === 3) {
        errors.push("Debe seleccionar el tipo de venta (Contado o Crédito)");
    }

    // Validar seleccion de cliente en venta tipo credito
    if (saleData.selectedSaleType === 1 && !saleData.selectedClient) {
        errors.push("Debe seleccionar un cliente para ventas a crédito");
    }

    // Validar fecha de crédito
    if (saleData.selectedSaleType === 1 && !saleData.creditDueDate) {
        errors.push("La fecha de vencimiento del crédito es obligatoria para ventas a crédito");
    }

    // Validar productos
    if (saleData.selectedProducts.length === 0) {
        errors.push("Debe seleccionar al menos un producto");
    }

    // Validar método de pago
    if (!saleData.selectedPaymentMethod) {
        errors.push("Debe seleccionar un método de pago");
    }

    // Validar porcentajes
    if (saleData.taxRate < 0 || saleData.taxRate > 100) {
        errors.push("El impuesto debe estar entre 0% y 100%");
    }

    if (saleData.discount < 0 || saleData.discount > 100) {
        errors.push("El descuento debe estar entre 0% y 100%");
    }

    return errors;
};