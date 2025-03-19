import { z } from "zod";

export const registerSchema = z.object({
    DSC_METODO_PAGO: z
        .string({
            required_error: "La descripción del metodo de pago es obligatorio.",
        }).min(6, {
            message: "El metodo de pago debe tener al menos 6 caracteres.",
        }),
    ID_PROVEEDOR: z
        .string({
            required_error: "Proveedor invalido.",
        }),
    PRODUCTS_LIST: z.array(
        z.object({
            MON_PRECIO_COMPRA: z.number({
                required_error: "El precio de compra es obligatorio.",
            }).min(1, {
                message: "El precio de compra no puede ser negativo.",
            }),
            MON_CANTIDAD: z.number({
                required_error: "La cantidad es obligatoria.",
            }).min(1, {
                message: "La cantidad debe ser al menos 1.",
            }),
            DSC_CODIGO_BARRAS: z.string({
                required_error: "El código de barras es obligatorio.",
            }).min(1, {
                message: "El código de barras no puede estar vacío.",
            }),
        })
    ).min(1, {
        message: "La lista de productos no puede estar vacía.",
    })
});

