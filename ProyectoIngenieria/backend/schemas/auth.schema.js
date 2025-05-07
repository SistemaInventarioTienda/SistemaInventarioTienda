import { z } from "zod";

export const registerSchema = z.object({
  DSC_NOMBREUSUARIO: z.string({
    required_error: "El nombre de usuario es obligatorio.",
  }).min(3, {
    message: "El nombre de usuario debe tener minimo 3 caracteres.",
  }),
  DSC_CONTRASENIA: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
  DSC_CORREO: z
    .string({
      required_error: "El correo es obligatorio.",
    })
    .email({
      message: "El correo no es válido.",
    }),
  DSC_TELEFONO: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length === 8, {
      message: "El teléfono debe tener 8 caracteres",
    }),
  ID_ROL: z.number().optional(),
  DSC_CEDULA: z
    .string({
      required_error: "La cedula es obligatoria",
    }).min(9, {
      message: "La cédula debe tener 9 caracteres",
    }).max(9, {
      message: "La cédula debe tener 9 caracteres"
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
});

export const loginSchema = z.object({
  DSC_NOMBREUSUARIO: z.string({
    required_error: "El nombre de usuario es obligatorio.",
  }),
  DSC_CONTRASENIA: z
    .string({
      required_error: "La contraseña es obligatoria.",
    })
    .min(6, {
      message: "La contraseña debe tener al menos 6 caracteres.",
    }),
});

export const updateSchema = z.object({
  DSC_NOMBREUSUARIO: z.string({
    required_error: "El nombre de usuario es obligatorio.",
  }).min(3, {
    message: "El nombre de usuario debe tener minimo 3 caracteres.",
  }),
  // DSC_CONTRASENIA: z
  //   .string({
  //     required_error: "La contraseña es obligatoria.",
  //   }),
  DSC_CORREO: z
    .string({
      required_error: "El correo es obligatorio.",
    })
    .email({
      message: "El correo no es válido.",
    }),
  DSC_TELEFONO: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length === 8, {
      message: "El teléfono debe tener 8 caracteres",
    }),
  ID_ROL: z.number().optional(),
  DSC_CEDULA: z
    .string()
    .optional()
    .refine((val) => val === undefined || val.length <= 15, {
      message: "La cédula no puede tener más de 15 caracteres",
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
});

export const changePasswordSchema = z.object({
  DSC_CONTRASENIA_ACTU: z
  .string({
    required_error: "La contraseña actual es requerida."
  })
  .min(6, {
    message: "La contraseña actual debe tener al menos 6 caracteres.",
  }),
  DSC_CONTRASENIA_NUEVA: z
  .string({
    required_error: "La nueva contraseña es requerida."
  })
  .min(6, {
    message: "La nueva contraseña debe tener al menos 6 caracteres.",
  }),
  DSC_CONTRASENIA_CONFIRM: z
  .string({
    required_error: "La confirmación de la nueva contraseña es requerida."
  })
  .min(6, {
    message: "La confirmación de la nueva contraseña debe tener al menos 6 caracteres.",
  })
})