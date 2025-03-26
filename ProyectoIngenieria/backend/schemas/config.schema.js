import { z } from "zod";

export const configSchema = z.object({
  DSC_RANGO_STOCK: z
    .number({ required_error: "El rango de stock es obligatorio." })
    .int()
    .positive(),
  DSC_NOMBRE: z
    .string({ invalid_type_error: "El nombre debe ser una cadena de texto." })
    .max(50, { message: "El nombre no puede exceder 50 caracteres." })
    .optional(),
  NUM_TELEFONO: z
    .string({ invalid_type_error: "El número de teléfono debe ser una cadena de texto." })
    .regex(/^\d{8}$/, { message: "El número de teléfono debe tener exactamente 8 dígitos numéricos." })
    .optional(),
  DSC_CORREO: z
    .string({ invalid_type_error: "El correo debe ser una cadena de texto." })
    .email({ message: "El formato del correo electrónico no es válido." })
    .max(100, { message: "El correo electrónico no puede exceder 100 caracteres." })
    .optional(),
  DSC_DIRECCION: z
    .string({ invalid_type_error: "La dirección debe ser una cadena de texto." })
    .max(100, { message: "La dirección no puede exceder 100 caracteres." })
    .optional(),
    DSC_ESLOGAN: z
    .string({ invalid_type_error: "El eslogan debe ser una cadena de texto." })
    .max(255, { message: "La dirección no puede exceder 255 caracteres." })
    .optional(),
});