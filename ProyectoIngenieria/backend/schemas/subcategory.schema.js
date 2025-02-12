import { z } from "zod";


export const subcategorySchema = z.object({
    DSC_NOMBRE: z
        .string({
            required_error: "El nombre de la categoría es obligatorio.",
        })
        .min(3, {
            message: "El nombre de la categoría debe tener al menos 3 caracteres.",
        })
        .max(100, {
            message: "El nombre de la categoría no puede tener más de 100 caracteres.",
        }),
    ID_CATEGORIA: z
        .number()
        .int()
        .positive({message: "No seleccionada la categoria"})
        .optional(),
    FEC_CREADOEN: z
        .date({
            required_error: "La fecha de creación es obligatoria.",
        })
        .optional(),
    subcategoriamodificadoen: z
        .date()
        .optional(),
    ESTADO: z
        .number({
            required_error: "El estado es obligatorio.",
        })
        .optional(),
});