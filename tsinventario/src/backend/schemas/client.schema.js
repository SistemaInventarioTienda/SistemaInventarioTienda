import { z } from "zod";

export const registerSchema = z.object({
  DSC_CEDULA: z.string({
    required_error: "La cédula es obligatoria.",
  }).min(9, {
    message: "La cédula debe tener minimo 9 caracteres.",
  }).max(9, {
    message: "La cédula debe tener minimo 9 caracteres.",
  }),
  DSC_NOMBRE: z
    .string({
      required_error: "El nombre es obligatorio.",
    })
    .min(3, {
      message: "El nombre debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El nombre no puede tener más de 50 caracteres.",
    }),
  DSC_APELLIDOUNO: z
    .string({
      required_error: "El primer apellido es obligatorio.",
    })
    .min(3, {
      message: "El primer apellido debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El primer apellido no puede tener más de 50 caracteres.",
    }),
  DSC_APELLIDODOS: z
    .string({
      required_error: "El segundo apellido es obligatorio.",
    })
    .min(3, {
      message: "El segundo apellido debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El segundo apellido no puede tener más de 50 caracteres.",
    }),
  FEC_CREADOEN: z.date({
    required_error: "La fecha de creación es obligatoria.",
  }).optional(),
  ESTADO: z
    .number({
      required_error: "El estado es obligatorio.",
    })
    .optional(),
  DSC_DIRECCION: z.string(
    { required_error: "La dirección del cliente es obligatoria." }
  ),
});


export const updateSchema = z.object({
  DSC_CEDULA: z.string({
    required_error: "La cédula es obligatoria.",
  }).min(9, {
    message: "La cédula debe tener minimo 9 caracteres.",
  }),
  DSC_NOMBRE: z
    .string({
      required_error: "El nombre es obligatorio.",
    })
    .min(3, {
      message: "El nombre debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El nombre no puede tener más de 50 caracteres.",
    }),
  DSC_APELLIDOUNO: z
    .string({
      required_error: "El primer apellido es obligatorio.",
    })
    .min(3, {
      message: "El primer apellido debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El primer apellido no puede tener más de 50 caracteres.",
    }),
  DSC_APELLIDODOS: z
    .string({
      required_error: "El segundo apellido es obligatorio.",
    })
    .min(3, {
      message: "El segundo apellido debe tener más de 3 caracteres.",
    })
    .max(50, {
      message: "El segundo apellido no puede tener más de 50 caracteres.",
    }),
  FEC_CREADOEN: z.date({
    required_error: "La fecha de creación es obligatoria.",
  }).optional(),
  ESTADO: z
    .number({
      required_error: "El estado es obligatorio.",
    })
    .optional(),
  DSC_DIRECCION: z.string(
    { required_error: "La dirección del cliente es obligatoria." }
  ),
});