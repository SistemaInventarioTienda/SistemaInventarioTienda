import { generateBarcodeWebp } from "../../libs/barcode.js";
import { ulid } from 'ulid';
import { writeFile } from 'node:fs/promises';

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import Product from "../../models/product.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const barcodeDir = path.join(__dirname, "../../uploads/images/barcodes");
if (!fs.existsSync(barcodeDir)) {
    fs.mkdirSync(barcodeDir, { recursive: true });
}

export async function createBarCode() {
    const code = ulid();
    const webp = await generateBarcodeWebp(code);

    const filename = `${barcodeDir}/${code}.webp`;
    await writeFile(filename, webp);


    return code;
}

export function isDateValid(currentDate, date) {
    // Formatos de entrada esperados:
    // currentDate: 2025-09-03 17:13:10
    // date: 2025-09-03

    // Formatos de salida esperados:
    // true si currentDate es mayor o igual a date


    // Separar la fecha y hora. Solo deja la fecha
    const currentDateParts = currentDate.split(' ')[0].split('-');
    // Crea un Date con la fecha guardada
    const currentDateNoTime = new Date(currentDateParts[0], currentDateParts[1] - 1, currentDateParts[2]);

    // Separar la fecha enviada en el form
    const dateParts = date.split('-');
    // Crea un Date con la fecha enviada
    const dateValidate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2])

    // valida que la fecha no sea menor a la actual
    return dateValidate >= currentDateNoTime;
}

export async function isProductsValid(products) {
    for (const prod of products) {
        // Validar que precio unitario, impuesto, descuento y cantidad no sean negativos
        const result = validateProformaItem(prod);
        if (!result.success) return { success: false, message: result.message };

        // Validar en la base de datos que exista esa cantidad
        const isAmountValid = await validateAmount(prod.ID_PRODUCT, prod.CANTIDAD);
        if (!isAmountValid.success) return { success: false, message: isAmountValid.message };
    }
    return { success: true };
}


function validateProformaItem(product) {
    // Verifica si los valores son números válidos y no negativos
    if (typeof product.PRECIO_UNITARIO !== 'number' || product.PRECIO_UNITARIO < 0) {
        return { success: false, message: 'El precio unitario no puede ser un valor negativo.' };
    }
    if (typeof product.CANTIDAD !== 'number' || product.CANTIDAD < 0) {
        return { success: false, message: 'La cantidad no puede ser un valor negativo.' };
    }
    if (typeof product.DESCUENTO !== 'number' || product.DESCUENTO < 0) {
        return { success: false, message: 'El descuento no puede ser un valor negativo.' };
    }
    if (typeof product.IMPUESTO !== 'number' || product.IMPUESTO < 0) {
        return { success: false, message: 'El impuesto no puede ser un valor negativo.' };
    }
    return { success: true };
}

async function validateAmount(productId, requestedAmount) {

    productId = productId > 0 ? productId : 0;

    try {
        const product = await Product.findOne({
            where: {
                ID_PRODUCT: productId
            }
        });

        if (!product) return {
            success: false,
            message: `El producto con ID ${productId} no fue encontrado.`
        };

        const availableStock = product.CANTIDAD;
        if (requestedAmount > availableStock) {
            return {
                success: false,
                message: `No hay suficiente stock para el producto ${product.DSC_NOMBRE}. Stock disponible: ${availableStock}, solicitado: ${requestedAmount}.`
            };
        }

        return {
            success: true,
            message: `Stock suficiente para el producto con ID ${productId}.`
        };
    } catch (error) {
        console.error(error)
        return {
            success: false,
            message: "Error interno del servidor al verificar el stock."
        };
    }

}