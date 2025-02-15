// Configuración de la entidad "Subcategorías"
import {
    getAllSubcategories,
    createSubcategory,
    updateSubcategory,
    deleteSubcategory,
} from "../../api/subcategory";

// Configuración principal de la entidad
export const subcategoryConfig = {

    // Identificador clave de la entidad
    entityKey: "subcategory", // Clave única para identificar los datos de esta entidad
    expandableKey: "subcategories", // Clave para identificar como actuar la expandabilidad de la entidad
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
        fetchAll: getAllSubcategories,
        createSub: createSubcategory,
        updateSub: updateSubcategory,
        deleteSub: deleteSubcategory,
    },

    // Transformaciones de datos
    transformData: {

        toFrontend: (subcategory) => ({
            id: subcategory.ID_SUBCATEGORIA,
            nombre: subcategory.DSC_NOMBRE,
            estado: subcategory.ESTADO,
            ID_CATEGORIA: subcategory.ID_CATEGORIA
        }),
        toBackend: (formData) => ({
            ID_CATEGORIA: formData.ID_CATEGORIA,
            ID_SUBCATEGORIA: formData.id,
            DSC_NOMBRE: formData.nombre,
            ESTADO: formData.estado,
        })
    },

    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
    },

    // Configuración de acciones permitidas
    actions: {
        edit: true,
        delete: true,
    },
};
