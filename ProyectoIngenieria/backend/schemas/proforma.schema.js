import { z } from "zod";

export const createProformaSchema = z.object({
    MON_TOTAL:z
    .number().positive({message: "El monto total no es valido."}),
    details_list: z.array(z.object({
        ID_PRODUCT: z
        .number().positive({message: "El ID del producto no es valido."}),
        PRECIO_UNITARIO: z
        .number().positive({message: "El precio unitario no es valido."}),
        CANTIDAD: z
        .number().positive({message: "La cantidad no es valida."}),
        DESCUENTO: z
        .number().nonnegative({message: "El descuento no es valido."}),
        IMPUESTO: z
        .number().nonnegative({message: "El impuesto no es valido."}),
    }))
})