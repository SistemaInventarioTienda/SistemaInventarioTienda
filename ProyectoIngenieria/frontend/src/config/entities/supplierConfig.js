// Configuración de la entidad "Proveedores"

import {
    getSuppliers,
    searchSupplier,
    registerSupplier,
    updateSupplier,
    deleteSupplier,
} from "../../api/supplier";

// Configuración principal de la entidad
export const supplierConfig = {
    // Nombre y descripción de la entidad
    entityName: "Proveedores",
    entityMessage: "Gestión de proveedores del sistema",

    // Identificador clave de la entidad
    entityKey: "suppliers", // Clave única para identificar los datos de esta entidad

    // Configuración de columnas para la tabla
    columns: [
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_TELEFONO", label: "Teléfono" },
        { field: "DSC_CORREO", label: "Correo" },
        { field: "DSC_TIPOPROVEEDOR", label: "Tipo de Proveedor" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" }, 
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "direccion", label: "Dirección", type: "text", required: true },
        { name: "tipoProveedor", label: "Tipo de Proveedor", type: "select", required: true },
        { name: "estado", label: "Estado", type: "select", required: true },
    ],

    // Funciones API específicas de la entidad
    api: {
        fetchAll: getSuppliers,
        searchByName: searchSupplier,
        create: registerSupplier,
        update: updateSupplier,
        delete: deleteSupplier,
    },

    // Transformaciones de datos
    transformData: {
        // Transformar datos desde la API hacia el frontend
        toFrontend: (supplier) => ({
            nombre: supplier.DSC_NOMBRE,
            tipoProveedor: supplier.supplierType?.DSC_NOMBRE || "No Disponible",
            estado: supplier.ESTADO === "ACTIVO" ? 1 : 2,
            direccion: supplier.DSC_DIRECCIONEXACTA || "No Disponible",
            telefonos: supplier.numberSuppliers?.map((t) => t.DSC_TELEFONO) || [],
            correos: supplier.mailSuppliers?.map((t) => t.DSC_CORREO) || [],
        }),

        // Transformar datos desde el formulario hacia la API
        toBackend: (formData) => ({
            DSC_NOMBRE: formData.nombre,
            ID_TIPOPROVEEDOR: parseInt(formData.tipoProveedor, 10),
            ESTADO: formData.estado === 1 ? "ACTIVO" : "INACTIVO",
            DSC_DIRECCIONEXACTA: formData.direccion,
            phones: formData.telefonos.map((telefono) => ({ DSC_TELEFONO: telefono })),
            emails: formData.correos.map((correo) => ({ DSC_CORREO: correo })),
        }),
    },

    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === "ACTIVO" ? "ACTIVO" : "INACTIVO"),
        DSC_TELEFONO: (item) =>
            item.numberSuppliers?.length > 0
                ? item.numberSuppliers[0].DSC_TELEFONO
                : "Sin Información",
        DSC_CORREO: (item) =>
            item.mailSuppliers?.length > 0
                ? item.mailSuppliers[0].DSC_CORREO
                : "Sin Información",
    },

    // Configuración de acciones permitidas
    actions: {
        edit: true,
        delete: true,
        view: true,
    },
};