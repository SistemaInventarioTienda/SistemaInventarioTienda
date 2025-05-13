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
    const [taxRate, setTaxRate] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [email, setEmail] = useState("");

    // Calcular el total de la venta
    const calculateTotal = () => {
        const subtotal = selectedProducts.reduce((total, product) => total + product.subtotal, 0);
        const discountAmount = (subtotal * discount) / 100;
        const subtotalAfterDiscount = subtotal - discountAmount;
        const taxAmount = (subtotalAfterDiscount * taxRate) / 100;
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
        if (discount < 0 || discount > 100) {
            if (discount !== 0) {
                setDiscount(0);
                toast.error("El descuento debe estar entre 0% y 100%");
            }
        }
        if (taxRate < 0 || taxRate > 100) {
            setTaxRate(0);
            toast.error("El impuesto debe estar entre 0% y 100%");
        }
    }, [discount, taxRate])

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
        setSelectedSaleType(3);
        setSelectedClient(null);
        setSelectedPaymentMethod("");
        setNote("");
        setDiscount(0);
        setTaxRate(0);
        setEmail("");
    };

    const handleSubmit = async () => {

        const validationErrors = validateSale({
            selectedSaleType,
            selectedClient,
            creditDueDate,
            selectedProducts,
            selectedPaymentMethod,
            taxRate,
            discount
        });

        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }

        const { subtotal, discountAmount } = calculateTotal();

        const ESTADO = selectedSaleType === 1 ? 3 : 1;

        const saleData = salesConfig.transformData.toBackend({
            ID_CLIENTE: selectedClient && selectedClient !== 0 ? Number(selectedClient) : null,
            PORCENT_IMPUESTO: taxRate,
            METODO_PAGO: selectedPaymentMethod,
            DSC_VENTA: note,
            ESTADO_CREDITO: Number(selectedSaleType),
            MONT_SUBTOTAL: subtotal,
            PORCENT_DESCUENTO: discount,
            PRODUCTS_LIST: selectedProducts,
            FEC_VENCIMIENTO: creditDueDate,
            ESTADO: ESTADO, 
            DSC_EMAIL: email
        });

        console.log("Datos de la venta:", JSON.stringify(saleData, null, 2));

        try {
            const response = await handleApiCall(
                () => salesConfig.api.create(saleData),
                "Venta registrada exitosamente."
            );
            console.log(response)
            if (response && response.downloadLink) {
                openReportViewerInNewWindow("pdf", response.downloadLink)
            }
            resetForm();
        } catch (error) {
            console.error("Error al registrar la venta:", error);
        }
    };

    const handleSubmitWithConfirmation = () => {
        if (!selectedClient || !note || discount === 0) {
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
        discount,
        taxRate,
        setSelectedClient,
        setSelectedPaymentMethod,
        setSelectedSaleType,
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
        creditDueDate,
        setCreditDueDate,
        setEmail
    };
};

export default useSaleForm;
