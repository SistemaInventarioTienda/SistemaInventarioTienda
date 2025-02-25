// Configuración de la entidad "Clientes"

import {
    getClients,
    searchClient,
    registerClient,
    updateClient,
    deleteClient,
} from "../../api/client";

// Configuración principal de la entidad
export const clientConfig = {
    // Nombre y descripción de la entidad
    entityName: "Cliente",
    titlePage: "Clientes",
    entityMessage: "Gestión de clientes del sistema",

    // Identificador clave de la entidad
    entityKey: "clients", // Clave única para identificar los datos de esta entidad

    // Configuración de columnas para la tabla
    columns: [
        { field: "DSC_CEDULA", label: "Cédula" },
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
        { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
        { field: "DSC_TELEFONO", label: "Teléfono" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" }, // Columnas de acciones (editar, eliminar, etc.)
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "cedula", label: "Cédula", type: "text", required: true },
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
        { name: "segundoApellido", label: "Segundo Apellido", type: "text", required: false },
        { name: "direccion", label: "Dirección", type: "textarea", required: false },
        //{ name: "foto", type: "file", required: false },
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
        fetchAll: getClients,
        searchByName: searchClient,
        create: registerClient,
        update: updateClient,
        delete: deleteClient,
    },

    // Transformaciones de datos
    transformData: {
        // Transformar datos desde la API hacia el frontend
        toFrontend: (client) => ({
            cedula: client.DSC_CEDULA,
            nombre: client.DSC_NOMBRE,
            primerApellido: client.DSC_APELLIDOUNO,
            segundoApellido: client.DSC_APELLIDODOS,
            direccion: client.DSC_DIRECCION,
            estado: client.ESTADO === "ACTIVO" ? 1 : 2,
            telefonos: client.TelefonoClientes?.map((t) => t.DSC_TELEFONO) || [],
            foto: client.URL_FOTO,
        }),

        // Transformar datos desde el formulario hacia la API
        toBackend: async (formData) => {
            const base64Image = formData.foto instanceof File
                ? await convertToBase64(formData.foto)
                : formData.foto;
            const data = {
                DSC_CEDULA: formData.cedula,
                DSC_NOMBRE: formData.nombre,
                DSC_APELLIDOUNO: formData.primerApellido,
                DSC_APELLIDODOS: formData.segundoApellido,
                DSC_DIRECCION: formData.direccion,
                ESTADO: formData.estado,
                FOTO: base64Image || null,
            };

            formData.telefonos?.forEach((telefono, index) => {
                data[`DSC_TELEFONO${index + 1}`] = telefono;
            });

            return data;
        },
    },

    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
        DSC_TELEFONO: (item) =>
            item.TelefonoClientes?.length > 0
                ? item.TelefonoClientes[0].DSC_TELEFONO
                : "Sin Información",
    },

    // Configuración de acciones permitidas
    actions: {
        edit: true,
        delete: true,
        view: true,
    },
};

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            resolve(null); // Si no hay archivo, resolver con null
            return;
        }

        // Solo leer si hay archivo
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};