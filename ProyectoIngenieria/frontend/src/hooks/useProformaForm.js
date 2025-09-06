import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { proformaConfig } from "../config/entities/proformaConfig";
import { toast } from "sonner";

const useProformaForm = () => {
    const [isConfirmationModalOpen, setConfirmationModalOpen] =
        React.useState(false);
    const [confirmationCallback, setConfirmationCallback] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [limitDate, setLimitDate] = useState(null);
    const [note, setNote] = useState("");
    const navigate = useNavigate();

    // Calcular el total de la proforma
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
                    (p.tax || 0)) /
                100,
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

    const addProduct = (product) => {
        setSelectedProducts((prevProducts) => {
            const existingProduct = prevProducts.find((p) => p.id === product.id);
            if (existingProduct) {
                return prevProducts.map((p) =>
                    p.id === product.id
                        ? {
                            ...p,
                            quantity: p.quantity + 1,
                            subtotal: (p.quantity + 1) * p.price,
                        }
                        : p
                );
            } else {
                return [
                    ...prevProducts,
                    {
                        ...product,
                        quantity: 1,
                        subtotal: product.price,
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
                    ? {
                        ...product,
                        [field]: value ?? 0
                    }
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
        setLimitDate(null);
        setNote("");
    };

    const handleSubmit = async () => {
        if (!limitDate) {
            toast.error("Debe seleccionar una fecha límite para la proforma.");
            return;
        }

        if (selectedProducts.length === 0) {
            toast.error("Debe agregar al menos un producto.");
            return;
        }

        const { total } = calculateTotal();

        let formattedDate = null;
        if (limitDate instanceof Date) {
            formattedDate = limitDate.toISOString().split("T")[0];
        } else if (typeof limitDate === "string") {
            formattedDate = limitDate.split("T")[0];
        }

        const proformaData = proformaConfig.transformData.toBackend({
            FEC_LIMITE: formattedDate,
            MON_TOTAL: total,
            PRODUCTS_LIST: selectedProducts,
            DSC_PROFORMA: "",
        });

        try {
            const response = await proformaConfig.api.create(proformaData);


            resetForm();


            // FRONTEND (useProformaForm)
            if (response?.DSC_CODIGO_BARRAS) {
                navigate(`/proformas/${response.DSC_CODIGO_BARRAS}?download=0`);
            }

        } catch (error) {
            console.error("Error al crear la proforma:", error);
        }
    };

    const handleSubmitWithConfirmation = async () => {
        if (!note) {
            setConfirmationModalOpen(true);
            setConfirmationCallback(() => handleSubmit);
            return;
        }
        return await handleSubmit();
    };


    return {
        selectedProducts,
        limitDate,
        note,
        setLimitDate,
        setNote,
        addProduct,
        updateProductQuantity,
        updateProductField,
        removeProduct,
        handleSubmit: handleSubmitWithConfirmation,
        calculateTotal,
        isConfirmationModalOpen,
        setConfirmationModalOpen,
        confirmationCallback,
    };
};

export default useProformaForm;
