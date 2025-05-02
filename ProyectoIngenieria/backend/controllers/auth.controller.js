import User from "../models/user.model.js";
import Role from "../models/role.model.js";
import jwt from "jsonwebtoken";
import { encryptData, compareData } from "../libs/encryptData.js";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { getDateCR } from '../libs/date.js';
import { validateRegister } from "../logic/user/user.logic.js";
import { validateRegisterUser } from "../logic/validateFields.logic.js";
import { Permission, PermissionUser } from "../models/permission.model.js";

export const register = async (req, res) => {
  try {
    const {
      DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
      DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, CONFIRMARCONTRASENIA
    } = req.body;

    const validateFields = validateRegisterUser(req);
    if (validateFields !== true) {
      return res.status(400).json({
        message: validateFields,
      })
    }

    const output = await validateRegister(DSC_CORREO, DSC_TELEFONO, DSC_CEDULA, DSC_NOMBREUSUARIO);
    if (output !== true) {
      return res.status(400).json({
        message: output,
      })
    }

    if (DSC_CONTRASENIA !== CONFIRMARCONTRASENIA) {
      return res.status(400).json({
        message: 'Las contraseñas no coinciden.',
      })
    }
    // hashing the password
    const passwordHash = await encryptData(DSC_CONTRASENIA, 10);

    // creating the user
    const creadoEn = await getDateCR();
    const newUser = new User({
      DSC_NOMBREUSUARIO,
      DSC_CORREO: DSC_CORREO.toLowerCase(),
      DSC_CONTRASENIA: passwordHash,
      DSC_TELEFONO,
      ID_ROL: 1,
      DSC_CEDULA,
      DSC_NOMBRE,
      DSC_APELLIDOUNO,
      DSC_APELLIDODOS,
      FEC_CREADOEN: creadoEn,
      ESTADO
    });

    // saving the user in the database
    const userSaved = await newUser.save();
    if (userSaved) {
      const permissionsBD = await Permission.findAll({
        attributes: ['ID_PERMISO']
      });

      if (permissionsBD.length === 0) {
        console.log("No hay permisos disponibles.");
        return res.json({
          id: userSaved.ID_USUARIO,
          DSC_NOMBREUSUARIO: userSaved.DSC_NOMBREUSUARIO,
          DSC_CORREO: userSaved.DSC_CORREO,
        });
      }

      const creadoEn = await getDateCR();
      const permissionsToAssign = [];

      for (const permission of permissionsBD) {
        permissionsToAssign.push({
          ID_USUARIO: userSaved.ID_USUARIO,
          ID_PERMISO: permission.ID_PERMISO,
          FEC_CREADOEN: creadoEn,
          ESTADO: 0
        });
      }

      // Guardar todos los permisos en una sola operación
      if (permissionsToAssign.length > 0) {
        await PermissionUser.bulkCreate(permissionsToAssign);
      } else {
        console.log("Ningún permiso de la lista coincide con los permisos existentes.");
      }
    }
    res.json({
      id: userSaved.ID_USUARIO,
      DSC_NOMBREUSUARIO: userSaved.DSC_NOMBREUSUARIO,
      DSC_CORREO: userSaved.DSC_CORREO,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { DSC_NOMBREUSUARIO, DSC_CONTRASENIA, REMEMBERME = false } = req.body;

    const userFound = await User.findOne({
      where: {
        DSC_NOMBREUSUARIO: DSC_NOMBREUSUARIO,
        ESTADO: 1
      }
    });
    if (!userFound)
      return res.status(400).json({
        message: ["Usuario o contraseña incorrecta."],
      });

    const isMatch = await compareData(DSC_CONTRASENIA, userFound.DSC_CONTRASENIA);
    if (!isMatch) {
      return res.status(400).json({
        message: ["Usuario o contraseña incorrecta."],
      });
    }

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
        ID_USUARIO: userFound.ID_USUARIO
      },
      raw: true,
      nest: true
    });

    const leakedPermissions = permissionsUser.map(pu => ({ nombre: pu.Permission?.DSC_NOMBRE, estado: pu.ESTADO ? true : false }));

    // Obtener el rol del usuario
    const role = await Role.findOne({
      attributes: ['DSC_NOMBRE', 'DSC_DESCRIPCION', 'ESTADO'],
      where: { ID_ROL: userFound.ID_ROL }
    });

    const roleDetails = role
      ? {
          nombre: role.DSC_NOMBRE,
          descripcion: role.DSC_DESCRIPCION,
          estado: role.ESTADO
        }
      : null;


    const token = await createAccessToken({
      id: userFound.DSC_CEDULA,
      username: userFound.DSC_NOMBREUSUARIO,
      permissions: leakedPermissions
    },
      REMEMBERME ? '30d' : '1d'
    );

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    console.log("userFound: ", userFound);

    res.json({
      cedula: userFound.DSC_CEDULA,
      nombreUsuario: userFound.DSC_NOMBREUSUARIO,
      email: userFound.DSC_CORREO,
      nombre: userFound.DSC_NOMBRE,
      primerApellido: userFound.DSC_APELLIDOUNO,
      segundoApellido: userFound.DSC_APELLIDODOS,
      telefono: userFound.DSC_TELEFONO,
      correo: userFound.DSC_CORREO,
      estado: userFound.ESTADO,
      fechaCreacion: userFound.FEC_CREADOEN,
      rol: roleDetails

    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.send(false);

  jwt.verify(token, TOKEN_SECRET, async (error, user) => {
    if (error) return res.sendStatus(401);

    const userFound = await User.findOne({ where: { DSC_CEDULA: user.id } });
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound.DSC_CEDULA,
      username: userFound.DSC_NOMBREUSUARIO,
    });
  });
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const getAllPermission = async (req, res) => {
  try {

    const userId = req.params.id || req.user.id || null;
    if (!userId) {
      return res.status(400).json({ message: "Usuario invalido." })
    }

    const userFound = await User.findOne({
      where: {
        DSC_CEDULA: userId,
        ESTADO: 1
      }
    });
    if (!userFound)
      return res.status(400).json({
        message: ["Usuario invalido."],
      });

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
        ID_USUARIO: userFound.ID_USUARIO
      },
      raw: true,
      nest: true
    });

    const leakedPermissions = permissionsUser.map(pu => ({ nombre: pu.Permission?.DSC_NOMBRE, estado: pu.ESTADO ? true : false }));


    return res.status(200).json({ permissions: leakedPermissions })
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}
