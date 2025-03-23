import { z } from "zod";

export const saleSchema = z.object({
ID_CLIENTE:z
.number()
.int()
.positive({message: "Cliente no seleccionado"})
.nullable()
.optional(),

PORCENT_IMPUESTO: z
.number({
    required_error: "Porcentaje no valido.",
}).min(0, { message: "El porcentaje de impuesto debe ser positivo." }),

METODO_PAGO: z
.string({
  required_error: "El metodo de pago es obligatorio",
}),

DSC_VENTA:z
.string()
.optional(),

ESTADO_CREDITO: z
.number()
.int()
.optional()
.refine(val => val === undefined || val === 0 || val === 1, { //Estoy haciendo pruebas con esta logica...
    message: "Estado de crédito inválido",
  }),

MONT_SUBTOTAL: z
.number({required_error: "El monto es requerido"})
.min(0, { message: "El monto debe ser positivo." }),

PORCENT_DESCUENTO: z
.number()
.min(0, { message: "El descuento no puede ser negativo." })
.optional(),
});


export const detailSchema = z.object({
ID_VENTA: z
.number()
.int()
.positive({ message: "ID_VENTA debe ser un número entero positivo" }),

ID_PRODUCTO: z
.number()
.int()
.positive({ message: "ID_PRODUCTO no válido" }),

MONTO_UNITARIO: z
.number({ required_error: "El monto es requerido" })
.min(0, { message: "El monto debe ser un valor positivo" }),

CANTIDAD: z
.number()
.int()
.positive({ message: "La cantidad debe ser un número entero positivo" }).min(1,{message: "La cantidad debe ser un numero mayor a 0"}),
});