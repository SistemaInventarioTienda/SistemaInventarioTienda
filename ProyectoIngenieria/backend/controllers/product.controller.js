import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import { getDateCR } from '../libs/date.js';
import multer from 'multer'; 
import path from 'path'; 
import fs from 'fs/promises';

export const getAllProducts = async (req, res) => {
    return res.status(200).json({ message: "Todos los productos" });
}

export const searchProduct = async (req, res) => {
    return res.status(200).json({ message: "Buscar productos" });
}

//======================== Configuración de Multer ========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/images/products/'); // Directorio de carga
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname); // Obtiene la extensión del archivo
        cb(null, 'PROD-' + uniqueSuffix + ext); // Nombre único con extensión
    }
});

const upload = multer({ storage: storage });
export const registerProduct = [
    upload.single('PRODUCT_IMAGE'), // 'PRODUCT_IMAGE' debe coincidir con el nombre del campo en el formulario
    async (req, res) => {
        try {
            const {
                DSC_NOMBRE = null, DSC_DESCRIPTION = null, DSC_CODIGO_BARRAS = null, MON_VENTA = null, MON_COMPRA = null, SUBCATEGORIE = null
            } = req.body;

            const userFound = await User.findOne({
                attributes: ['ID_USUARIO'],
                where: {
                    DSC_CEDULA: req.user?.id,
                    ESTADO: 1
                }
            });
            if (!userFound) {
                await eliminarArchivo(req.file);
                return res.status(400).json({ message: "Invalid request." })
            }

            // creating the product
            const created_at = await getDateCR();
            const barCode = (DSC_CODIGO_BARRAS === null || DSC_CODIGO_BARRAS === '') ? createBarCode(created_at) : DSC_CODIGO_BARRAS;
            const isValid = validateregister({
                DSC_NOMBRE: DSC_NOMBRE,
                DSC_DESCRIPTION: DSC_DESCRIPTION,
                DSC_CODIGO_BARRAS: barCode,
                MON_VENTA: MON_VENTA,
                MON_COMPRA: MON_COMPRA,
                SUBCATEGORIE: SUBCATEGORIE
            });
            if (isValid?.status === 400) {
                await eliminarArchivo(req.file);
                return res.status(400).json({ message: isValid.user_message });
            }

            const productFound = await Product.findOne({
                attributes: ['ID_PRODUCT'],
                where: {
                    DSC_CODIGO_BARRAS: barCode,
                    ESTADO: 1
                }
            })

            if (productFound) {
                await eliminarArchivo(req.file);
                return res.status(403).json({
                    message: "Ya existe un producto con este código de barras.",
                    suggestions: "Si es un producto diferente cambia el código de barras, caso contrario actualiza el registro existente."
                })
            }

            const salesAmount = parseFloat(MON_VENTA);
            const purchaseAmount = parseFloat(MON_COMPRA);

            if (!salesAmount || !purchaseAmount) {
                await eliminarArchivo(req.file);
                return res.status(400).json({
                    message: "El monto de venta o compra no es valido."
                })
            }

            const imagePath = (req.file?.filename) ? req.file.filename : null;
            const newProduct = new Product({
                DSC_NOMBRE,
                DSC_DESCRIPTION,
                DSC_CODIGO_BARRAS: barCode,
                URL_IMAGEN: imagePath,
                MON_VENTA: salesAmount,
                MON_COMPRA: purchaseAmount,
                FEC_CREATED_AT: created_at,
                ESTADO: 1,
                ID_SUBCATEGORIE: SUBCATEGORIE,
                CREATED_BY_USER: userFound.ID_USUARIO
            })

            const productSaved = await newProduct.save();
            if (productSaved) {
                return res.json({
                    message: "Nuevo producto registrado con éxito.",
                    barcode: barCode
                });
            }


        } catch (error) {
            await eliminarArchivo(req.file);
            res.status(500).json({ message: error.message });
        }
    }
];

export const updateProduct = async (req, res) => {
    return res.status(200).json({ message: "Actualizar productos" });
}

export const deleteProduct = async (req, res) => {
    return res.status(200).json({ message: "Eliminar productos" });
}



//======================== REGISTRO DE PRODUCTOS ========================

function validateregister(elements) {
    for (const key in elements) {
        if (!elements[key]) {
            return { status: 400, user_message: `El campo ${key} no puede estar vacio.` }
        }
    }
    return true;
}

function createBarCode(date, length = 15) {
    // Obtener la fecha y hora en formato YYYYMMDDHHmmss
    const formatDate = date.replace(/[-T:.Z ]/g, '').slice(0, 14);

    // Calcular cuántos caracteres faltan para llegar al tamaño deseado
    const randomLength = Math.max(length - formatDate.length, 0);

    // Generar números aleatorios para completar la longitud deseada
    const randomDigits = Array.from({ length: randomLength }, () => Math.floor(Math.random() * 10)).join('');

    // Unir la fecha y los números aleatorios
    return "PROD" + formatDate + randomDigits;
}

async function eliminarArchivo(file) {
    if (file) {
        try {
            await fs.unlink(file.path); // Elimina el archivo
            console.log('Imagen eliminada porque el producto no se guardó:', file.path);
        } catch (error) {
            console.error('Error al eliminar la imagen:', error);
        }
    }
}