export const CategoryFormFields = [
    { name: "nombre", label: "Nombre", type: "text", required: true },
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
];


