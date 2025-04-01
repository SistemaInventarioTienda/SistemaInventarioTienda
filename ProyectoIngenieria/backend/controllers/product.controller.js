import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import subcategory from '../models/subcategory.model.js';
import { getDateCR } from '../libs/date.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs/promises';
import { Op } from 'sequelize';

export const getAllProducts = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, orderByField = 'FEC_CREATED_AT', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NOMBRE' || orderByField === 'DSC_DESCRIPTION' || orderByField === 'DSC_CODIGO_BARRAS' || orderByField === 'MON_VENTA' ||
            orderByField === 'MON_COMPRA' || orderByField === 'ESTADO' || orderByField === 'CATEGORIA'
        ) ? orderByField : 'FEC_CREATED_AT';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const conditionOrder = (field === 'CATEGORIA') ? [{ model: subcategory, as: 'subcategory' }, 'DSC_NOMBRE', sortOrder] : [field, sortOrder];
        const { count, rows } = await Product.findAndCountAll({
            attributes: {
                exclude: ['UPDATED_BY_USER', 'CREATED_BY_USER', 'FEC_UPDATE_AT', 'FEC_CREATED_AT', 'ID_SUBCATEGORIA']
            },
            include: [
                {
                    model: subcategory,
                    as: 'subcategory',
                    attributes: ['DSC_NOMBRE', 'ID_SUBCATEGORIA']
                }
            ],
            limit,
            offset,
            order: [
                conditionOrder
            ]
        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron productos.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            products: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const getProductById = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { ID_PRODUCT: req.params.id },
            attributes: ['ID_PRODUCT', 'DSC_NOMBRE']
        });

        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }

        res.json(product);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchProduct = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'FEC_CREATED_AT', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NOMBRE' || orderByField === 'DSC_DESCRIPTION' || orderByField === 'DSC_CODIGO_BARRAS' || orderByField === 'MON_VENTA' ||
            orderByField === 'MON_COMPRA' || orderByField === 'ESTADO' || orderByField === 'CATEGORIA'
        ) ? orderByField : 'FEC_CREATED_AT';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const conditionOrder = (field === 'CATEGORIA') ? [{ model: subcategory, as: 'subcategory' }, 'DSC_NOMBRE', sortOrder] : [field, sortOrder];
        const expectedMatch = { [Op.like]: `%${termSearch}%` };
        const { count, rows } = await Product.findAndCountAll({
            attributes: {
                exclude: ['UPDATED_BY_USER', 'CREATED_BY_USER', 'FEC_UPDATE_AT', 'FEC_CREATED_AT', 'ID_SUBCATEGORIA']
            },
            include: [
                {
                    model: subcategory,
                    as: 'subcategory',
                    attributes: ['DSC_NOMBRE', 'ID_SUBCATEGORIA']
                }
            ],
            limit,
            offset,
            order: [
                conditionOrder
            ],
            where: {
                [Op.or]: [
                    { DSC_NOMBRE: expectedMatch },
                    { DSC_DESCRIPTION: expectedMatch },
                    { DSC_CODIGO_BARRAS: expectedMatch },
                    { MON_VENTA: expectedMatch },
                    { MON_COMPRA: expectedMatch },
                    { '$subcategory.DSC_NOMBRE$': expectedMatch }
                ]
            }
        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron productos.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            products: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

//======================== Configuración de Multer ========================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../backend/uploads/images/products/'); // Directorio de carga
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
                DSC_NOMBRE = null, DSC_DESCRIPTION = null, DSC_CODIGO_BARRAS = null, MON_VENTA = null, MON_COMPRA = null, SUBCATEGORIA = null
            } = req.body;

            const userFound = await User.findOne({
                attributes: ['ID_USUARIO'],
                where: {
                    DSC_CEDULA: req.user?.id,
                    ESTADO: 1
                }
            });
            if (!userFound) {
                await deleteFile(req.file);
                return res.status(400).json({ message: "Invalid request." })
            }

            // creating the product
            const created_at = await getDateCR();
            const barCode = (DSC_CODIGO_BARRAS === null || DSC_CODIGO_BARRAS === '' || DSC_CODIGO_BARRAS === 'undefined') ? createBarCode(created_at) : DSC_CODIGO_BARRAS;
            const isValid = validateregister({
                DSC_NOMBRE: DSC_NOMBRE,
                DSC_DESCRIPTION: DSC_DESCRIPTION,
                DSC_CODIGO_BARRAS: barCode,
                MON_VENTA: MON_VENTA,
                MON_COMPRA: MON_COMPRA,
                ID_SUBCATEGORIA: SUBCATEGORIA
            });
            if (isValid?.status === 400) {
                await deleteFile(req.file);
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
                await deleteFile(req.file);
                return res.status(403).json({
                    message: "Ya existe un producto con este código de barras.",
                    suggestions: "Si es un producto diferente cambia el código de barras, caso contrario actualiza el registro existente."
                })
            }

            const salesAmount = parseFloat(MON_VENTA);
            const purchaseAmount = parseFloat(MON_COMPRA);

            if (!salesAmount || !purchaseAmount) {
                await deleteFile(req.file);
                return res.status(400).json({
                    message: "El monto de venta o compra no es valido."
                })
            }

            const imagePath = (req.file?.filename) ? req.file.filename : 'image_not_found.png';
            const newProduct = new Product({
                DSC_NOMBRE,
                DSC_DESCRIPTION,
                DSC_CODIGO_BARRAS: barCode,
                URL_IMAGEN: imagePath,
                MON_VENTA: salesAmount,
                MON_COMPRA: purchaseAmount,
                CANTIDAD: 0,
                FEC_CREATED_AT: created_at,
                ESTADO: 1,
                ID_SUBCATEGORIA: SUBCATEGORIA,
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
            await deleteFile(req.file);
            res.status(500).json({ message: error.message });
        }
    }
];

export const updateProduct = [
    upload.single('PRODUCT_IMAGE'), // 'PRODUCT_IMAGE' debe coincidir con el nombre del campo en el formulario
    async (req, res) => {

        const {
            DSC_NOMBRE = null, DSC_DESCRIPTION = null, DSC_CODIGO_BARRAS = null, MON_VENTA = null, MON_COMPRA = null, SUBCATEGORIA = null, ESTADO = null,
        } = req.body;

        const product = await Product.findOne({
            where: { ID_PRODUCT: req.params.id }
        });

        if (!product) {
            await deleteFile(req.file);
            return res.status(404).json({
                message: "No se pudo encontrar el producto."
            })
        }

        const user = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: { DSC_CEDULA: req.user.id }
        })

        if (!user) {
            await deleteFile(req.file);
            return res.status(404).json({ message: "El usuario no tiene permiso de modificar el producto." })
        }

        const salesAmount = parseFloat(MON_VENTA);
        const purchaseAmount = parseFloat(MON_COMPRA);

        if (!salesAmount || !purchaseAmount) {
            await deleteFile(req.file);
            return res.status(400).json({
                message: "El monto de venta o compra no es valido."
            })
        }

        // Validation (similar to registerProduct)
        const isValid = validateregister({
            DSC_NOMBRE: DSC_NOMBRE,
            DSC_DESCRIPTION: DSC_DESCRIPTION,
            DSC_CODIGO_BARRAS: DSC_CODIGO_BARRAS,
            MON_VENTA: salesAmount,
            MON_COMPRA: purchaseAmount,
            ID_SUBCATEGORIA: SUBCATEGORIA,
            ESTADO: ESTADO,
        });

        if (isValid?.status === 400) {
            await deleteFile(req.file);
            return res.status(400).json({ message: isValid.user_message });
        }

        const currentDate = await getDateCR();
        if (req.file) {
            if (product.URL_IMAGEN) {
                console.log(product.URL_IMAGEN, req.file)
                await deleteFile(product.URL_IMAGEN)
            }
            product.URL_IMAGEN = req.file.filename;
        }

        // Update values of the product
        product.DSC_NOMBRE = DSC_NOMBRE || product.DSC_NOMBRE;
        product.DSC_DESCRIPTION = DSC_DESCRIPTION || product.DSC_DESCRIPTION;
        product.DSC_CODIGO_BARRAS = DSC_CODIGO_BARRAS || product.DSC_CODIGO_BARRAS;
        product.MON_VENTA = MON_VENTA || product.MON_VENTA;
        product.MON_COMPRA = MON_COMPRA || product.MON_COMPRA;
        product.ID_SUBCATEGORIA = SUBCATEGORIA || product.ID_SUBCATEGORIA;
        product.ESTADO = ESTADO || product.ESTADO;
        product.FEC_UPDATE_AT = currentDate;
        product.UPDATED_BY_USER = user.ID_USUARIO;
        await product.save();

        return res.status(200).json({ message: "Producto actualizado con éxito." });
    }
]

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findOne({
            attributes: ['ID_PRODUCT', 'UPDATED_BY_USER', 'FEC_UPDATE_AT'],
            where: { ID_PRODUCT: req.params.id }
        });
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado." });
        }


        const user = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: { DSC_CEDULA: req.user.id }
        })

        if (!user) {
            return res.status(404).json({ message: "El usuario no tiene permiso de eliminar el producto." })
        }

        const currentDate = await getDateCR();
        await product.update(
            {
                ESTADO: 2,
                UPDATED_BY_USER: user.ID_USUARIO,
                FEC_UPDATE_AT: currentDate
            },
            {
                where: { ID_PRODUCT: req.params.id }
            }
        );

        return res.status(200).json({ message: "Producto eliminado con éxito." });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
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

async function deleteFile(file) {
    if (file) {
        const filePath = file.path || `uploads\\images\\products\\${file}`;
        if (!filePath.includes('PROD')) return;
        try {
            await fs.unlink(filePath); // Elimina el archivo
            console.log('Archivo eliminado: ', filePath);
        } catch (error) {
            console.error('Error al eliminar el archivo:', error);
        }
    }
}