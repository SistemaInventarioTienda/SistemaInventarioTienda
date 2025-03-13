// Configuración de la entidad "Categorías"

import {
    getAllCategories,
    saveCategory,
    updateCategory,
    deleteCategory,
    searchCategoryByName,
} from "../../api/category";

// Configuración principal de la entidad
export const categoryConfig = {
    // Nombre y descripción de la entidad
    entityName: "Categoría",
    titlePage: "Categorías",
    entityMessage: "Gestión de categorías de los productos del sistema",

    // Identificador clave de la entidad
    entityKey: "category", // Clave única para identificar los datos de esta entidad
    expandableKey: "subcategories", // Clave única para identificar el manejo de expadir las filas
    // Configuración de columnas para la tabla
    columns: [
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
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
        fetchAll: getAllCategories,
        searchByName: searchCategoryByName,
        create: saveCategory,
        update: updateCategory,
        delete: deleteCategory,
    },

    // Transformaciones de datos
    transformData: {
        // Transformar datos desde la API hacia el frontend
        toFrontend: (category) => ({
            id: category.ID_CATEGORIA,
            nombre: category.DSC_NOMBRE,
            estado: category.ESTADO === "ACTIVO" ? 1 : 2,
        }),

        // Transformar datos desde el formulario hacia la API
        toBackend: (formData) => ({
            ID_CATEGORIA: formData.id,
            DSC_NOMBRE: formData.nombre,
            ESTADO: formData.estado,
        }),
    },

    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
    },

    // Configuración de acciones permitidas
    actions: {
        edit: true,
        delete: true,
        view: false,
    },
};
