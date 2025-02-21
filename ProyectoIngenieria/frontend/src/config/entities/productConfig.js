// Configuración de la entidad "Productos"
import {
    getAllProducts,
    searchProduct,
    registerProduct,
    updateProduct,
    deleteProduct,
} from "../../api/product";

import {
    getAllSubcategories
} from "../../api/subcategory";

// Configuración principal de la entidad
export const productConfig = {
    // Nombre y descripción de la entidad
    entityName: "Producto",
    titlePage: "Productos",
    entityMessage: "Gestión de productos del sistema",

    // Identificador clave de la entidad
    entityKey: "products",

    // Configuración de columnas para la tabla
    columns: [
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_DESCRIPTION", label: "Descripción" },
        { field: "DSC_CODIGO_BARRAS", label: "Código de Barras" },
        { field: "MON_VENTA", label: "Precio Venta" },
        { field: "MON_COMPRA", label: "Precio Compra" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "DSC_NOMBRE", label: "Nombre del Producto", type: "text", required: true },
        { name: "DSC_DESCRIPTION", label: "Descripción", type: "textarea", required: true },
        { name: "DSC_CODIGO_BARRAS", label: "Código de Barras", type: "text", required: true },
        { name: "foto", type: "file", required: false },
        { name: "MON_VENTA", label: "Precio de Venta", type: "number", required: true },
        { name: "MON_COMPRA", label: "Precio de Compra", type: "number", required: true },
        { name: "SUBCATEGORIA", label: "Subcategoría del Producto", type: "select", required: true },
        {
            name: "estado",
            label: "Estado",
            type: "select",
            required: true,
            options: [
                { value: 1, label: "Activo" },
                { value: 0, label: "Inactivo" },
            ],
        },
    ],

    // Funciones API específicas de la entidad
    api: {
        fetchAllSubcategoriesTypes: getAllSubcategories,
        fetchAll: getAllProducts,
        searchByName: searchProduct,
        create: registerProduct,
        update: updateProduct,
        delete: deleteProduct,
    },

    // Transformaciones de datos
    transformData: {
        toFrontend: (product) => ({
            id: product.ID_PRODUCT,
            DSC_NOMBRE: product.DSC_NOMBRE,
            DSC_DESCRIPTION: product.DSC_DESCRIPTION,
            DSC_CODIGO_BARRAS: product.DSC_CODIGO_BARRAS,
            foto: product.URL_IMAGEN,
            MON_VENTA: product.MON_VENTA,
            MON_COMPRA: product.MON_COMPRA,
            estado: product.ESTADO === "ACTIVO" ? 1 : 2,
            ID_SUBCATEGORIA: product.subcategory?.ID_SUBCATEGORIA || "",
        }),

        toBackend: async (formData) => {

            const data = new FormData();
            data.append("ID_PRODUCT", formData.id);
            data.append("DSC_NOMBRE", formData.DSC_NOMBRE);
            data.append("DSC_DESCRIPTION", formData.DSC_DESCRIPTION);
            data.append("DSC_CODIGO_BARRAS", formData.DSC_CODIGO_BARRAS);
            data.append("MON_VENTA", parseFloat(formData.MON_VENTA));
            data.append("MON_COMPRA", parseFloat(formData.MON_COMPRA));
            data.append("ESTADO", formData.estado);
            data.append("SUBCATEGORIA", formData.SUBCATEGORIA);

            if (formData.foto instanceof File) {
                data.append("PRODUCT_IMAGE", formData.foto);
            }

            return data;
        },
    },

    // Transformaciones específicas de campos
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
        URL_IMAGEN: (item) => item.URL_IMAGEN || "/default-product.png",
    },

    // Configuración de acciones
    actions: {
        edit: true,
        delete: true,
        view: true,
    },
};