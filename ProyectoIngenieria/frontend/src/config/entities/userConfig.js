// Configuración de la entidad "Usuarios"

import {
    getUsers,
    updateUser,
    registerUser,
    deleteUser,
    searchUser
} from "../../api/user";

// Configuración principal de la entidad
export const userConfig = {
    // Nombre y descripción de la entidad
    entityName: "Usuarios",
    entityMessage: "Gestión de usuarios del sistema",

    // Identificador clave de la entidad
    entityKey: "users", // Clave única para identificar los datos de esta entidad

    // Configuración de columnas para la tabla
    columns: [
        { field: "DSC_CEDULA", label: "Cédula" },
        { field: "DSC_NOMBRE", label: "Nombre" },
        { field: "DSC_APELLIDOUNO", label: "Primer Apellido" },
        { field: "DSC_APELLIDODOS", label: "Segundo Apellido" },
        { field: "DSC_NOMBREUSUARIO", label: "Usuario" },
        { field: "ESTADO", label: "Estado" },
        { field: "actions", label: "Acciones" },
    ],

    // Configuración de campos del formulario
    fields: [
        { name: "cedula", label: "Cédula", type: "text", required: true },
        { name: "nombre", label: "Nombre", type: "text", required: true },
        { name: "primerApellido", label: "Primer Apellido", type: "text", required: true },
        { name: "segundoApellido", label: "Segundo Apellido", type: "text", required: false },
        { name: "correo", label: "Correo", type: "email", required: true },
        { name: "telefono", label: "Teléfono", type: "text", required: true },
        { name: "nombreUsuario", label: "Nombre de Usuario", type: "text", required: true },
        { name: "contrasena", label: "Contraseña", type: "password", required: true },
        { name: "confirmarContrasena", label: "Confirmar Contraseña", type: "password", required: true },
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
        fetchAll: getUsers,
        searchByName: searchUser,
        create: registerUser,
        update: updateUser,
        delete: deleteUser,
    },

    // Transformaciones de datos
    transformData: {
        // Transformar datos desde la API hacia el frontend
        toFrontend: (user) => ({
            cedula: user.DSC_CEDULA,
            nombre: user.DSC_NOMBRE,
            primerApellido: user.DSC_APELLIDOUNO,
            segundoApellido: user.DSC_APELLIDODOS,
            telefono: user.DSC_TELEFONO,
            nombreUsuario: user.DSC_NOMBREUSUARIO,
            correo: user.DSC_CORREO,
            estado: user.ESTADO === "ACTIVO" ? 1 : 2,
        }),

        // Transformar datos desde el formulario hacia la API
        toBackend: (formData) => ({
            DSC_CEDULA: formData.cedula,
            DSC_NOMBRE: formData.nombre,
            DSC_APELLIDOUNO: formData.primerApellido,
            DSC_APELLIDODOS: formData.segundoApellido,
            DSC_CORREO: formData.correo,
            DSC_TELEFONO: formData.telefono,
            DSC_NOMBREUSUARIO: formData.nombreUsuario,
            //DSC_CONTRASENIA: formData.contrasena,
            //CONFIRMARCONTRASENIA: formData.confirmarContrasena, -> Esto se debería hacer en cambiar contraseña
            DSC_CONTRASENIA: 'adminadmin',
            CONFIRMARCONTRASENIA: 'adminadmin',
            ESTADO: formData.estado,
        }),
    },

    // Transformaciones específicas de campos individuales
    transformConfig: {
        ESTADO: (item) => (item.ESTADO === 1 ? "ACTIVO" : "INACTIVO"),
    },

    // Configuración de acciones permitidas
    actions: {
        grantPermissions: true,
        edit: true,
        delete: true,
        view: true,
    },
};
