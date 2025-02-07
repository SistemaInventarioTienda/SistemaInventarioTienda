import { z } from "zod";

// Schema para Supplier ACTUALIZADO


export const supplierSchema = z.object({
  IDENTIFICADOR_PROVEEDOR: z
  .string({
    required_error: "El identificador del proveedor es obligatorio.",
  })
  .min(1, { message: "El identificador del proveedor no puede estar vacío." })
  .optional(),
  DSC_NOMBRE: z
    .string({
      required_error: "El nombre del proveedor es obligatorio.",
    })
    .min(3, { message: "El nombre del proveedor debe tener al menos 3 caracteres." })
    .max(255, { message: "El nombre del proveedor no puede tener más de 255 caracteres." }),
  ID_TIPOPROVEEDOR: z
    .number()
    .int()
    .positive()
    .optional(),
    DSC_VENTA: z
    .string({
      required_error: "La descripción de venta es obligatoria.",
    })
    .max(500, { message: "La descripción de venta no puede tener más de 500 caracteres." })
    .optional(),
  CTA_BANCARIA: z
    .string({
      required_error: "La cuenta bancaria es obligatoria.",
    })
    .max(500, { message: "La cuenta bancaria no puede tener más de 500 caracteres." }),
    DSC_DIRECCIONEXACTA: z
    .string({
      required_error: "La dirección exacta es obligatoria.",
    })
    .min(5, { message: "La dirección debe tener al menos 5 caracteres." })
    .max(255, { message: "La dirección no puede tener más de 255 caracteres." }),
  ESTADO: z
    .number()
    .int()
    .optional(),
  FEC_CREADOEN: z
    .date()
    .optional(),
  FEC_MODIFICADOEN: z
    .date()
    .optional(),
});

/*
export const supplierDirectionSchema = z.object({
  DSC_DIRECCION: z
    .string({
      required_error: "La dirección exacta es obligatoria.",
    })
    .min(5, { message: "La dirección debe tener al menos 5 caracteres." })
    .max(255, { message: "La dirección no puede tener más de 255 caracteres." }),
});
*/

export const numberSupplierSchema = z.object({
  ID_PROVEEDOR: z
    .number({
      required_error: "El identificador del proveedor es obligatorio.",
    })
    .int()
    .positive(),
  DSC_TELEFONO: z
    .string()
    .regex(/^\d{8}$/, { message: "El número de teléfono debe tener 8 dígitos numéricos." }),
  FEC_CREADOEN: z
    .date()
    .optional(),
  ESTADO: z
    .number()
    .int()
    .optional(),
});

export const mailSupplierSchema = z.object({
  ID_PROVEEDOR: z
    .number({
      required_error: "El identificador del proveedor es obligatorio.",
    })
    .int()
    .positive(),
  DSC_CORREO: z
    .string()
    .email({ message: "El formato del correo electrónico no es válido." })
    .max(100, { message: "El correo electrónico no puede tener más de 100 caracteres." }),
  FEC_CREADOEN: z
    .date()
    .optional(),
  ESTADO: z
    .number()
    .int()
    .optional(),
});

