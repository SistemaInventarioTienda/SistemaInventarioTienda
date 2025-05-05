// Función para verificar si un valor no está vacío (GENERAL)
function isNotEmpty(value) {
    if(typeof value === 'string'){
        return value.trim().length > 0;

    }else if (typeof value === 'number') {
        return !isNaN(value);
    }
    return false;
}

/**
 * Función para validar que los campos al actualizar los datos del usuario estén con valores válidos
 */
export const validateUpdateUser = (req) => {
    const {
        //DSC_CONTRASENIA,ID_ROL,
        DSC_NOMBREUSUARIO, DSC_CORREO,  DSC_TELEFONO,  DSC_CEDULA,
        DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_NOMBREUSUARIO, name: 'DSC_NOMBREUSUARIO' },
        { field: DSC_CORREO, name: 'DSC_CORREO' },
        { field: DSC_TELEFONO, name: 'DSC_TELEFONO' },
        // { field: ID_ROL, name: 'ID_ROL' },
        { field: DSC_CEDULA, name: 'DSC_CEDULA' },
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' },
        { field: DSC_APELLIDOUNO, name: 'DSC_APELLIDOUNO' },
        { field: DSC_APELLIDODOS, name: 'DSC_APELLIDODOS' },
        { field: ESTADO, name: 'ESTADO' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }
    return errors.length > 0 ? errors : true;
};


/**
 * Función para validar que los campos al registrar los datos del usuario estén con valores válidos
 */
export const validateRegisterUser = (req) => {
    const {
        DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
        DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_NOMBREUSUARIO, name: 'DSC_NOMBREUSUARIO' },
        { field: DSC_CORREO, name: 'DSC_CORREO' },
        { field: DSC_TELEFONO, name: 'DSC_TELEFONO' },
        { field: DSC_CONTRASENIA, name: 'DSC_CONTRASENIA'},
        // { field: ID_ROL, name: 'ID_ROL' },
        { field: DSC_CEDULA, name: 'DSC_CEDULA' },
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' },
        { field: DSC_APELLIDOUNO, name: 'DSC_APELLIDOUNO' },
        { field: DSC_APELLIDODOS, name: 'DSC_APELLIDODOS' },
        { field: ESTADO, name: 'ESTADO' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }
    return errors.length > 0 ? errors : true;
};


export const validateCategoryName = (req) => {
    const {
        DSC_NOMBRE
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }
    return errors.length > 0 ? errors : true;
};

export const validateSupplierData = (req) => {
    const {
        DSC_DIRECCIONEXACTA,
        DSC_NOMBRE,
        ID_TIPOPROVEEDOR,
        ESTADO,
        phones,
        emails
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_DIRECCIONEXACTA, name: 'DSC_DIRECCIONEXACTA' },
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' },
        { field: ID_TIPOPROVEEDOR, name: 'TIPO_PROVEEDOR' },
        { field: ESTADO, name: 'ESTADO' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }

    if (!Array.isArray(phones) || phones.length === 0) {
        errors.push('La lista de teléfonos es requerida y no puede estar vacía.');
    } else {
        phones.forEach((phone, index) => {
            if (!phone.DSC_TELEFONO || !isNotEmpty(phone.DSC_TELEFONO)) {
                errors.push(`El teléfono no puede estar vacío.`);
            }
        });
    }

    if (!Array.isArray(emails) || emails.length === 0) {
        errors.push('La lista de correos es requerida y no puede estar vacía.');
    } else {
        emails.forEach((email, index) => {
            if (!email.DSC_CORREO || !isNotEmpty(email.DSC_CORREO)) {
                errors.push(`El correo no puede estar vacío.`);
            } else if (!isValidEmail(email.DSC_CORREO)) {
                errors.push(`El correo no es válido.`);
            }
        });
    }

    return errors.length > 0 ? errors : true;
};


export const validateSupplierDataUpdate = (req) => {
    const {
        DSC_DIRECCIONEXACTA,
        DSC_NOMBRE,
        ID_TIPOPROVEEDOR,
        ESTADO
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_DIRECCIONEXACTA, name: 'DSC_DIRECCIONEXACTA' },
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' },
        { field: ID_TIPOPROVEEDOR, name: 'TIPO_PROVEEDOR' },
        { field: ESTADO, name: 'ESTADO' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }

    return errors.length > 0 ? errors : true;
};


//subcategorias

export const validateSubcategoryData = (req) => {
    const {
        DSC_NOMBRE,
        ID_CATEGORIA
    } = req.body;

    // Lista de campos requeridos
    const fields = [
        { field: DSC_NOMBRE, name: 'DSC_NOMBRE' },
        { field: ID_CATEGORIA, name: 'ID_CATEGORIA' }
    ];

    const errors = [];

    for (const { field, name } of fields) {
        if (!isNotEmpty(field)) {
            errors.push(`El campo ${name} es requerido y no puede estar vacío.`);
        }
    }

    return errors.length > 0 ? errors : true;
};


const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};
