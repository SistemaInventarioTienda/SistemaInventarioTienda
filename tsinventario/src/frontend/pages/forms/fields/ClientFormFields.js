export const clientFormFields = [
    { name: 'cedula', label: 'Cédula', type: 'text', required: true },
    { name: 'nombre', label: 'Nombre', type: 'text', required: true },
    { name: 'primerApellido', label: 'Primer Apellido', type: 'text', required: true },
    { name: 'segundoApellido', label: 'Segundo Apellido', type: 'text', required: false },
    { name: 'direccion', label: 'Dirección', type: 'text', required: false },
    {
        name: 'estado',
        label: 'Estado',
        type: 'select',
        options: [
            { value: 1, label: 'Activo' },
            { value: 0, label: 'Inactivo' },
        ],
        required: true,
    },
    { name: 'foto', label: 'Foto', type: 'file', required: false },
    {
        name: 'telefonos',
        label: 'Teléfonos',
        type: 'text',
        required: false,
    },
];
