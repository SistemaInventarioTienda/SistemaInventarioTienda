import User from "../models/user.model.js";
import { encryptData } from "../libs/encryptData.js";
import { validateUpdate } from "../logic/user/user.logic.js";
import { getDateCR } from "../libs/date.js";

export const updateUser = async (req, res) => {
    try {
        const {
            DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
            DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
        } = req.body;

        const user = await User.findOne({ where: { DSC_CEDULA: req.params.id } });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const output = await validateUpdate();
        if (output !== true) {
          return res.status(400).json({
            message: output,
          })
        }

        // hashing the password
        const passwordHash = await encryptData(DSC_CONTRASENIA, 10);

        await user.update({
            DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA: passwordHash, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
            DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
        });

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUser = async (req, res) => {

};

export const getAllUsers = async (req, res) => {
    try {
        // Obtén los parámetros de paginación de la solicitud (página y cantidad por página)
        const { page = 1, pageSize = 2 } = req.query;
        const limit = parseInt(pageSize);
        const offset = (parseInt(page) - 1) * limit;

        const { count, rows } = await User.findAndCountAll({
            attributes: {
                exclude: ['DSC_CONTRASENIA', 'ID_USUARIO', 'FEC_CREADOEN']
            },
            limit,
            offset
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
