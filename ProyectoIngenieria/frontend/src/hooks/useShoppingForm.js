import React, { useState, useEffect } from "react";
import handleApiCall from '../utils/handleApiCall';
import { shoppingConfig } from '../config/entities/shoppingConfig.js';
import { toast } from "sonner";
import { validateShopping } from '../schemas/validations/validateShopping.js';

const useShoppingForm = () => {
    const [isConfirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [confirmationCallback, setConfirmationCallback] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [note, setNote] = useState("");
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);

    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce((total, product) => total + product.subtotal, 0);
        const discountAmount = (subtotal * discount) / 100;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
        const total = subtotalAfterDiscount + taxAmount;

        return { subtotal, discountAmount, subtotalAfterDiscount, taxAmount, total };
    };

    useEffect(() => {
        if (discount < 0 || discount > 100) {
            setDiscount(0);
            toast.error("El descuento debe estar entre 0% y 100%");
        }
        if (taxRate < 0 || taxRate > 100) {
            setTaxRate(0);
            toast.error("El impuesto debe estar entre 0% y 100%");
        }
    }, [discount, taxRate]);

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
        setNote("");
        setDiscount(0);
        setTaxRate(0);
    };

    const handleSubmit = async () => {
        console.log("selectedSupplier", selectedSupplier);
        const validationErrors = validateShopping({
            selectedSupplier,
            selectedPaymentMethod,
            selectedProducts,
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        const { total } = calculateTotal();

        const shoppingData = shoppingConfig.transformData.toBackend({
            ID_PROVEEDOR: selectedSupplier,
            DSC_METODO_PAGO: selectedPaymentMethod,
            DSC_COMPRA: note,
            PRODUCTS_LIST: selectedProducts,
            MON_TOTAL: total
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
        if (!selectedSupplier || !note || discount === 0) {
            setConfirmationModalOpen(true);
            setConfirmationCallback(() => handleSubmit);
        } else {
            handleSubmit();
        }
    };

    return {
        selectedProducts,
        selectedSupplier,
        selectedPaymentMethod,
        note,
        discount,
        taxRate,
        setSelectedSupplier,
        setSelectedPaymentMethod,
        setNote,
        setDiscount,
        setTaxRate,
        addProduct,
        updateProductQuantity,
        removeProduct,
        handleSubmit: handleSubmitWithConfirmation,
        calculateTotal,
        setConfirmationModalOpen,
        isConfirmationModalOpen,
        confirmationCallback,
    };
};

export default useShoppingForm;