// src/constants/paymentOptions.js

export const paymentMethods = [
    { value: "", label: "Seleccione método de pago" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "Sinpe Móvil", label: "Sinpe Móvil" },
    { value: "Tarjeta de crédito", label: "Tarjeta de crédito" },
    { value: "Tarjeta de débito", label: "Tarjeta de débito" },
    { value: "Transferencia bancaria", label: "Transferencia bancaria" },
    { value: "Cheque", label: "Cheque" },
    { value: "Crédito", label: "Crédito" },
    { value: "Pago mixto", label: "Pago mixto" },
];

export const transferMethods = [
    { value: "", label: "Seleccione método" },
    { value: "Efectivo", label: "Efectivo" },
    { value: "Sinpe Móvil", label: "SINPE Móvil" },
    { value: "Transferencia bancaria", label: "Transferencia bancaria" },
    { value: "Tarjeta", label: "Tarjeta (crédito o débito)" },
    { value: "Cheque", label: "Cheque" },
    { value: "Otro", label: "Otro" },
];
