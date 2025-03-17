import React, { useState, useEffect } from "react";
import { salesConfig } from "../config/entities/salesConfig";
import { toast } from "sonner";

const useSaleForm = () => {

    const TAX_RATE = 13;

    const [isConfirmationModalOpen, setConfirmationModalOpen] = React.useState(false);
    const [confirmationCallback, setConfirmationCallback] = useState(null);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [note, setNote] = useState("");
    const [discount, setDiscount] = useState(0);

    // Calcular el total de la venta
    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce((total, product) => total + product.subtotal, 0);
        const discountAmount = (subtotal * discount) / 100;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = (subtotalAfterDiscount * TAX_RATE) / 100;
        const total = subtotalAfterDiscount + taxAmount;

        return {
            subtotal,
            discountAmount,
            subtotalAfterDiscount,
            taxAmount,
            total
        }
    };

    useEffect(() => {
        if (discount < 1 || discount > 99) {
            if (discount !== 0) {
                setDiscount(0);
                toast.error("El descuento debe estar entre 1% y 99%");
            }
        }
    }, [discount])

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

    const handleSubmit = () => {

        if (selectedProducts.length === 0) {
            toast.error("Debe seleccionar al menos un producto para realizar la venta.");
            return;
        }

        if (!selectedPaymentMethod) {
            toast.error("Debe seleccionar un método de pago.");
            return;
        }

        const { subtotal, discountAmount } = calculateTotal();

        const saleData = salesConfig.transformData.toBackend({
            ID_CLIENTE: selectedClient,
            PORCENT_IMPUESTO: TAX_RATE,
            METODO_PAGO: selectedPaymentMethod,
            DSC_VENTA: note,
            ESTADO_CREDITO: 0,
            MONT_SUBTOTAL: subtotal,
            PORCENT_DESCUENTO: discountAmount,
            PRODUCTS_LIST: selectedProducts,
            ESTADO: 1,
        });

        console.log("Datos de la venta:", JSON.stringify(saleData, null, 2));
        return saleData;
    };

    const handleSubmitWithConfirmation = () => {
        if (!selectedClient || !note) {
            console.log("dentro de confirmacion");
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
        note,
        discount,
        setSelectedClient,
        setSelectedPaymentMethod,
        setNote,
        setDiscount,
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

export default useSaleForm;
