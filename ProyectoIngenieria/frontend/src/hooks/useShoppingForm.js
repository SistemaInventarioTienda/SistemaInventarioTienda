import React, { useState, useEffect } from "react";
import handleApiCall from '../utils/handleApiCall';
import { shoppingConfig } from '../config/entities/shoppingConfig.js';
import { toast } from "sonner";
import { validateShopping } from '../schemas/validations/validateShopping.js';

export default function useShoppingForm(initialState) {

    const [selectedProducts, setSelectedProducts] = useState(initialState?.selectedProducts || []);
    const [selectedSupplier, setSelectedSupplier] = useState(initialState?.selectedSupplier || "");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(initialState?.selectedPaymentMethod || "");
    const [productReceiptDate, setProductReceiptDate] = useState(initialState?.productReceiptDate || "");
    const [total, setTotal] = useState(initialState?.total || 0);
    const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
    const [confirmationCallback, setConfirmationCallback] = useState(null);

    const initialize = (newState) => {
        setSelectedProducts(newState.selectedProducts || []);
        setSelectedSupplier(newState.selectedSupplier || "");
        setSelectedPaymentMethod(newState.selectedPaymentMethod || "");
        setProductReceiptDate(newState.productReceiptDate || "");
        setTotal(newState.total || 0);
    };

    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce((total, product) =>
            total + (product.price * product.quantity), 0);

        setTotal(subtotal);
        return { total: subtotal };
    };

    useEffect(() => {
        calculateTotal();
    }, [selectedProducts]);

    const addProduct = (product) => {
        setSelectedProducts((prevProducts) => {
            const existingProduct = prevProducts.find(p => p.id === product.id);
            if (existingProduct) {
                return prevProducts.map(p =>
                    p.id === product.id
                        ? { ...p, quantity: p.quantity + 1, subtotal: (p.quantity + 1) * p.price }
                        : p
                );
            } else {
                return [...prevProducts, { ...product, quantity: 1, subtotal: product.price }];
            }
        });
    };

    const updateProductQuantity = (productId, quantity) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? { ...product, quantity, subtotal: quantity * product.price }
                    : product
            )
        );
    };

    const removeProduct = (productId) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.filter((product) => product.id !== productId)
        );
    };

    const resetForm = () => {
        setSelectedProducts([]);
        setSelectedSupplier(null);
        setSelectedPaymentMethod("");
        setProductReceiptDate(null);
    };

    const handleSubmit = async () => {

        const validationErrors = validateShopping({
            selectedSupplier,
            selectedPaymentMethod,
            selectedProducts,
            productReceiptDate,
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        const { total } = calculateTotal();

        const shoppingData = shoppingConfig.transformData.toBackend({
            ID_PROVEEDOR: selectedSupplier,
            DSC_METODO_PAGO: selectedPaymentMethod,
            PRODUCTS_LIST: selectedProducts,
            MON_TOTAL: total,
            FEC_ENTRADA: productReceiptDate,
        });

        try {
            await handleApiCall(
                () => shoppingConfig.api.create(shoppingData),
                "Compra registrada exitosamente."
            );
            resetForm();
        } catch (error) {
            console.error("Error al registrar la compra:", error);
        }
    };

    const handleSubmitWithConfirmation = () => {
        if (!selectedSupplier) {
            setConfirmationModalOpen(true);
            setConfirmationCallback(() => handleSubmit);
        } else {
            handleSubmit();
        }
    };

    return {
        initialize,
        selectedProducts,
        selectedSupplier,
        selectedPaymentMethod,
        setSelectedSupplier,
        setSelectedPaymentMethod,
        addProduct,
        updateProductQuantity,
        removeProduct,
        handleSubmit: handleSubmitWithConfirmation,
        calculateTotal,
        setConfirmationModalOpen,
        isConfirmationModalOpen,
        confirmationCallback,
        productReceiptDate,
        setProductReceiptDate,
        total,
    };
};