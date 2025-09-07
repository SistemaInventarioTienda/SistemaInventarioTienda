import React, { useState, useEffect } from "react";
import handleApiCall from '../utils/handleApiCall';
import { salesConfig } from '../config/entities/salesConfig';
import { toast } from "sonner";
import { validateSale } from '../schemas/validations/validateSale';
import { openReportViewerInNewWindow } from "../components/features/reports/utils/openReportViewer";
const useSaleForm = () => {

    const [isConfirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [confirmationCallback, setConfirmationCallback] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [selectedSaleType, setSelectedSaleType] = useState(3);
    const [creditDueDate, setCreditDueDate] = useState(null);
    const [note, setNote] = useState("");
    const [email, setEmail] = useState("");

    // Calcular el total de la venta
    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce(
            (total, product) => total + product.subtotal,
            0
        );

        const discountAmount = selectedProducts.reduce(
            (total, p) => total + (p.subtotal * (p.discount || 0)) / 100,
            0
        );

        const subtotalAfterDiscount = subtotal - discountAmount;

        const taxAmount = selectedProducts.reduce(
            (total, p) =>
                total +
                ((p.subtotal - (p.subtotal * (p.discount || 0)) / 100) *
                    (p.tax || 0)) / 100,
            0
        );

        const total = subtotalAfterDiscount + taxAmount;

        return {
            subtotal,
            discountAmount,
            subtotalAfterDiscount,
            taxAmount,
            total,
        };
    };

    const addProduct = (product, override = false) => {
        setSelectedProducts((prevProducts) => {
            const existingProduct = prevProducts.find((p) => p.id === product.id);

            if (existingProduct) {
                return prevProducts.map((p) =>
                    p.id === product.id
                        ? {
                            ...p,
                            quantity: override
                                ? product.quantity // sobrescribe (cuando viene de proforma)
                                : (p.quantity || 0) + (product.quantity || 1),
                            subtotal:
                                (override
                                    ? product.quantity
                                    : (p.quantity || 0) + (product.quantity || 1)) * p.price,
                        }
                        : p
                );
            } else {
                const qty = product.quantity ?? 1;
                return [
                    ...prevProducts,
                    {
                        ...product,
                        quantity: qty,
                        subtotal: qty * product.price,
                        tax: product.tax || 0,
                        discount: product.discount || 0,
                    },
                ];
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

    const updateProductField = (productId, field, value) => {
        setSelectedProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === productId
                    ? { ...product, [field]: value ?? 0 }
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
        setSelectedSaleType(3);
        setSelectedClient(null);
        setSelectedPaymentMethod("");
        setNote("");
        setEmail("");
        setCreditDueDate(null);
    };

    const handleSubmit = async () => {

        const validationErrors = validateSale({
            selectedSaleType,
            selectedClient,
            creditDueDate,
            selectedProducts,
            selectedPaymentMethod,
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        const { subtotal, discountAmount } = calculateTotal();

        const ESTADO = selectedSaleType === 1 ? 3 : 1;

        const saleData = salesConfig.transformData.toBackend({
            ID_CLIENTE: selectedClient && selectedClient !== 0 ? Number(selectedClient) : null,
            METODO_PAGO: selectedPaymentMethod,
            DSC_VENTA: note,
            ESTADO_CREDITO: Number(selectedSaleType),
            MONT_SUBTOTAL: subtotal,
            PRODUCTS_LIST: selectedProducts,
            FEC_VENCIMIENTO: creditDueDate,
            ESTADO: ESTADO,
            DSC_EMAIL: email
        });



        try {
            const response = await handleApiCall(
                () => salesConfig.api.create(saleData),
                "Venta registrada exitosamente."
            );
            if (response && response.downloadLink) {
                openReportViewerInNewWindow("pdf", response.downloadLink)
            }
            resetForm();
        } catch (error) {
            console.error("Error al registrar la venta:", error);
        }
    };

    const handleSubmitWithConfirmation = () => {
        if (!selectedClient || !note) {
            setConfirmationModalOpen(true);
            setConfirmationCallback(() => handleSubmit);
        } else {
            handleSubmit();
        }
    };

    return {
        selectedProducts,
        selectedClient,
        selectedPaymentMethod,
        selectedSaleType,
        note,
        email,
        setSelectedClient,
        setSelectedPaymentMethod,
        setSelectedSaleType,
        setNote,
        addProduct,
        updateProductQuantity,
        updateProductField,
        removeProduct,
        handleSubmit: handleSubmitWithConfirmation,
        calculateTotal,
        setConfirmationModalOpen,
        isConfirmationModalOpen,
        confirmationCallback,
        creditDueDate,
        setCreditDueDate,
        setEmail
    };
};

export default useSaleForm;
