import { z } from "zod";

export const registerSchema = z.object({
    METODO_PAGO: z.string({
        required_error: "El metodo de pago en que se me van a pagar es obligatorio.",
    }).min(3, {
        message: "El metodo de pago en que se me van a pagar debe tener minimo 3 caracteres.",
    }),
    MONTO_PAGO: z
        .number({
            required_error: "El monto de pago es obligatorio.",
        })
        .min(1, {
            message: "El monto de pago debe ser mayor o igual a uno",
        }),
    DSC_TRANSACCION: z
        .string({
            required_error: "La descripción de la transacción es obligatoria.",
        }).min(1, {
            message: "La descripción de la transacción debe tener al menos un caracter."
        }),
    TIPO_TRANSACCION: z
        .string({
            required_error: "El metodo de pago en que se va a pagar es obligatoria.",
        }).min(3, {
            message: "El metodo de pago en que se va a pagar debe tener minimo 3 caracteres."
        }),
    ESTADO: z
        .number({
            required_error: "El estado de la transacción es obligatorio.",
        }).min(0, {
            required_error: "El estado debe ser un numero."
        }),
});

