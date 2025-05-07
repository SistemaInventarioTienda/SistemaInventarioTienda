import User from "../models/user.model.js";
import { encryptData, compareData } from "../libs/encryptData.js";
import { validateUpdate } from "../logic/user/user.logic.js";
import { validateUpdateUser } from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';
import { decodedToken } from "../libs/jwt.js";
import { Permission, PermissionUser } from "../models/permission.model.js";
import { getDateCR } from '../libs/date.js';
import { changePasswordEmail } from "../utils/sendEmail.js";

export const updateUser = async (req, res) => {
    try {
        const {
            //, DSC_CONTRASENIA, ID_ROL,
            DSC_NOMBREUSUARIO, DSC_CORREO, DSC_TELEFONO,  DSC_CEDULA,
            DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
        } = req.body;

        const validateFields = validateUpdateUser(req);
        if (validateFields !== true) {
            return res.status(400).json({
                message: validateFields,
            })
        }

        const user = await User.findOne({ where: { DSC_CEDULA: req.params.id } });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // const output = await validateUpdate(req);
        // if (output !== true) {
        //     return res.status(400).json({
        //         message: output,
        //     })
        // }

        // hashing the password
        // var passwordHash;
        // if (DSC_CONTRASENIA) {
        //     passwordHash = await encryptData(DSC_CONTRASENIA, 10);
        // } else {
        //     passwordHash = user.DSC_CONTRASENIA;
        // }


        await user.update({
            // DSC_CONTRASENIA: passwordHash,ID_ROL,
            DSC_NOMBREUSUARIO, DSC_CORREO: DSC_CORREO.toLowerCase(), DSC_TELEFONO, DSC_CEDULA,
            DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
        });

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const user = await User.findOne({
            attributes: {
                exclude: ['DSC_CONTRASENIA', 'FEC_CREADOEN']
            },
            where: { DSC_CEDULA: req.params.id }
        });
        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const { token } = req.cookies;
        const decoded = await decodedToken(token);
        if (user.DSC_CEDULA === decoded.id) {
            /*
             * Authenticated user cannot delete his own account
             * 
            */
            return res.status(403).json({ message: "Tu cuenta no puede ser eliminada. Contacta con soporte para más información." })
        } else if (user.ID_USUARIO === 10) { //Cambiar por el id del administrador debe ser 1
            /*
             * Cannot delete the administrator user
             * 
            */
            return res.status(403).json({ message: "No tienes permiso para realizar esta acción." })
        }

        await user.update(
            {
                ESTADO: 2
            },
            {
                where: { DSC_CEDULA: req.params.id }
            }
        );

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, orderByField = 'DSC_CEDULA', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NOMBRE' || orderByField === 'ESTADO' || orderByField === 'DSC_CEDULA' || orderByField === 'DSC_NOMBREUSUARIO' ||
            orderByField === 'DSC_APELLIDOUNO' || orderByField === 'DSC_APELLIDODOS'
        ) ? orderByField : 'DSC_CEDULA';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const { count, rows } = await User.findAndCountAll({
            attributes: {
                exclude: ['DSC_CONTRASENIA', 'FEC_CREADOEN']
            },
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            raw: true
        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron usuarios.",
            });
        }

        const newRows = await searchPermissions(rows);
        return res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            users: newRows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const searchUser = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 5, termSearch = '', orderByField = 'DSC_CEDULA', order = 'asc' } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const field = (
            orderByField === 'DSC_NOMBRE' || orderByField === 'ESTADO' || orderByField === 'DSC_CEDULA' || orderByField === 'DSC_NOMBREUSUARIO' ||
            orderByField === 'DSC_APELLIDOUNO' || orderByField === 'DSC_APELLIDODOS'
        ) ? orderByField : 'DSC_CEDULA';

        const sortOrder = order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc' ? order : 'asc';
        const expectedMatch = { [Op.like]: `%${termSearch}%` };
        const { count, rows } = await User.findAndCountAll({
            attributes: {
                exclude: ['DSC_CONTRASENIA', 'FEC_CREADOEN']
            },
            limit,
            offset,
            order: [
                [field, sortOrder],
            ],
            where: {
                [Op.or]: [
                    { DSC_CEDULA: expectedMatch },
                    { DSC_NOMBRE: expectedMatch },
                    { DSC_APELLIDOUNO: expectedMatch },
                    { DSC_APELLIDODOS: expectedMatch },
                    { DSC_TELEFONO: expectedMatch },
                    { DSC_NOMBREUSUARIO: expectedMatch }
                ]
            }
        });

        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron usuarios.",
            });
        }
        const newRows = await searchPermissions(rows);

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            users: newRows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const assignPermission = async (req, res) => {
    try {
        const { PERMISSION_LIST } = req.body;
        if (!PERMISSION_LIST) return res.status(404).json({ message: "Permisos no validos." })
        // Buscar usuario por cédula
        const userFound = await User.findOne({
            attributes: ['ID_USUARIO'],
            where: { DSC_CEDULA: req.params.id }
        });

        if (!userFound) {
            return res.status(404).json({ message: "Usuario inválido para asignar permiso." });
        }

        const permissionsBD = await Permission.findAll({
            attributes: ['ID_PERMISO', 'DSC_NOMBRE']
        });

        if (permissionsBD.length === 0) {
            return res.status(404).json({ message: "No hay permisos disponibles." });
        }

        const creadoEn = await getDateCR();
        const permissionsToAssign = [];

        for (const permission of PERMISSION_LIST) {
            // Buscar coincidencia en la BD
            const permissionFound = permissionsBD.find(p => p.DSC_NOMBRE === permission.nombre);

            if (permissionFound) {
                permissionsToAssign.push({
                    ID_USUARIO: userFound.ID_USUARIO,
                    ID_PERMISO: permissionFound.ID_PERMISO,
                    FEC_CREADOEN: creadoEn,
                    ESTADO: permission.estado
                });
            }
        }

        // Eliminar permisos existentes del usuario
        await PermissionUser.destroy({
            where: {
                ID_USUARIO: userFound.ID_USUARIO
            }
        });

        // Insertar los nuevos permisos
        if (permissionsToAssign.length > 0) {
            await PermissionUser.bulkCreate(permissionsToAssign);
            return res.json({ message: "Permisos asignados al usuario." });
        } else {
            return res.status(400).json({ message: "Ningún permiso de la lista coincide con los permisos existentes." });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const searchPermissions = async (rows) => {
    const promises = rows.map(async (row) => {
        const idUsuario = row.ID_USUARIO;
        const permissionsUser = await PermissionUser.findAll({
            attributes: ['ESTADO'],
            include: [
                {
                    model: Permission,
                    as: 'Permission',
                    attributes: ['DSC_NOMBRE']
                }
            ],
            where: {
                ID_USUARIO: idUsuario
            },
            raw: true,
            nest: true
        });

        const leakedPermissions = permissionsUser.map(pu => ({
            nombre: pu.Permission?.DSC_NOMBRE,
            estado: pu.ESTADO ? true : false
        }));

        row.permissions = leakedPermissions;
        delete row.ID_USUARIO;
        return row;
    });

    return Promise.all(promises);
};

export const changePassword = async (req, res) => {
    const userId = req.user?.id
    if (!userId) return res.status(401).json({ message: "El usuario no tiene permiso de realizar esta acción." })

    const { DSC_CONTRASENIA_ACTU, DSC_CONTRASENIA_NUEVA, DSC_CONTRASENIA_CONFIRM } = req.body;
    if (!DSC_CONTRASENIA_ACTU || !DSC_CONTRASENIA_NUEVA || !DSC_CONTRASENIA_CONFIRM)
        return res.status(400).json({ message: "Todos los campos son obligatorios." });

    if (DSC_CONTRASENIA_NUEVA !== DSC_CONTRASENIA_CONFIRM)
        return res.status(400).json({ message: "La nueva contraseña y la confirmación no coinciden." });


    const userFound = await User.findOne({ where: { DSC_CEDULA: userId } })
    if (!userFound)
        return res.status(404).json({ message: "Usuario no encontrado." });

    const isMatch = await compareData(DSC_CONTRASENIA_ACTU, userFound.DSC_CONTRASENIA);
    if (!isMatch)
        return res.status(400).json({
            message: ["Usuario o contraseña incorrecta."],
        });

    // hashing the new password
    const passwordHash = await encryptData(DSC_CONTRASENIA_NUEVA, 10);
    await userFound.update({
        DSC_CONTRASENIA: passwordHash
    });

    const currentDate = await getDateCR();
    changePasswordEmail({ name: userFound.DSC_NOMBRE, date: currentDate, to: userFound.DSC_CORREO });
    return res.status(200).json({ message: "Su contraseña actualizada correctamente." });
}