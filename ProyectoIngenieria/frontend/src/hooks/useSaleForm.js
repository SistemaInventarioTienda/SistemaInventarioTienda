import { useState } from "react";
import { salesConfig } from "../config/entities/salesConfig";

const useSaleForm = () => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedClient, setSelectedClient] = useState("");
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [note, setNote] = useState("");

    // Calcular el total de la venta
    const calculateTotal = () => {
        return selectedProducts.reduce((total, product) => total + product.subtotal, 0);
    };

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
        const saleData = salesConfig.transformData.toBackend({
            FEC_VENTA: new Date().toISOString(),
            DSC_PAYMENT: selectedPaymentMethod,
            ID_CLIENTE: selectedClient,
            PRODUCTS_LIST: selectedProducts,
            ESTADO: 1,
        });

        console.log("Datos de la venta:", JSON.stringify(saleData, null, 2));
        return saleData;
    };

    return {
        selectedProducts,
        selectedClient,
        selectedPaymentMethod,
        note,
        setSelectedClient,
        setSelectedPaymentMethod,
        setNote,
        addProduct,
        updateProductQuantity,
        removeProduct,
        handleSubmit,
        calculateTotal,
    };
};

export default useSaleForm;
