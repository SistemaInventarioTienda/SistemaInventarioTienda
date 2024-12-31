import User from "../models/user.model.js";
import { encryptData } from "../libs/encryptData.js";
import { validateUpdate } from "../logic/user/user.logic.js";
import { validateUpdateUser } from "../logic/validateFields.logic.js";
import { Op } from 'sequelize';
import { decodedToken } from "../libs/jwt.js";

export const updateUser = async (req, res) => {
    try {
        const {
            DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
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

        const output = await validateUpdate(req);
        if (output !== true) {
            return res.status(400).json({
                message: output,
            })
        }

        // hashing the password
        var passwordHash;
        if (DSC_CONTRASENIA) {
            passwordHash = await encryptData(DSC_CONTRASENIA, 10);
        } else {
            passwordHash = user.DSC_CONTRASENIA;
        }


        await user.update({
            DSC_NOMBREUSUARIO, DSC_CORREO: DSC_CORREO.toLowerCase(), DSC_CONTRASENIA: passwordHash, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
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
                exclude: ['DSC_CONTRASENIA', 'ID_USUARIO', 'FEC_CREADOEN']
            },
            limit,
            offset,
            order: [
                [field, sortOrder],
            ]
        });


        if (rows.length === 0) {
            return res.status(204).json({
                message: "No se encontraron usuarios.",
            });
        }

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            users: rows
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
                exclude: ['DSC_CONTRASENIA', 'ID_USUARIO', 'FEC_CREADOEN']
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

        res.json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            pageSize: limit,
            users: rows
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}
