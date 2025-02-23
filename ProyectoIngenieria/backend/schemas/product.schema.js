import { z } from "zod";

export const registerSchema = z.object({
    DSC_NOMBRE: z.string({
        required_error: "El nombre del producto es obligatorio.",
    }).min(3, {
        message: "El nombre del producto debe tener minimo 3 caracteres.",
    }),
    DSC_DESCRIPTION: z
        .string({
            required_error: "La descripción es obligatoria.",
        })
        .min(6, {
            message: "La descripción debe tener al menos 6 caracteres.",
        }),
    MON_VENTA: z
        .number({
            required_error: "El monto de venta es obligatorio.",
        }),
    MON_COMPRA: z
        .number({
            required_error: "El monto de compra es obligatorio.",
        }),
    SUBCATEGORIA: z
        .string({
            required_error: "La subcategoria es obligatoria",
        }),
});


export const updateSchema = z.object({
    DSC_NOMBRE: z.string({
        required_error: "El nombre del producto es obligatorio.",
    }).min(3, {
        message: "El nombre del producto debe tener minimo 3 caracteres.",
    }),
    DSC_DESCRIPTION: z
        .string({
            required_error: "La descripción es obligatoria.",
        })
        .min(6, {
            message: "La descripción debe tener al menos 6 caracteres.",
        }),
    MON_VENTA: z
        .number({
            required_error: "El monto de venta es obligatorio.",
        }),
    MON_COMPRA: z
        .number({
            required_error: "El monto de compra es obligatorio.",
        }),
    SUBCATEGORIA: z
        .string({
            required_error: "La subcategoria es obligatoria",
        }),
});
