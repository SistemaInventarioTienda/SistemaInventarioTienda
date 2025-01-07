import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { encryptData, compareData } from "../libs/encryptData.js";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { getDateCR } from '../libs/date.js';
import { validateRegister } from "../logic/user/user.logic.js";
import { validateRegisterUser } from "../logic/validateFields.logic.js";

export const register = async (req, res) => {
  try {
    const {
      DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
      DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO, CONFIRMARCONTRASENIA
    } = req.body;

    const validateFields = validateRegisterUser(req);
    if(validateFields !== true) {
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

    if(DSC_CONTRASENIA !== CONFIRMARCONTRASENIA){
      return res.status(400).json({
        message: 'Las contraseñas no coinciden.',
      })
    }
    // hashing the password
    const passwordHash = await encryptData(DSC_CONTRASENIA, 10);

    // creating the user
    const creadoEn =  await getDateCR();
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

    // create access token
    // const token = await createAccessToken({
    //   id: userSaved.DSC_CEDULA,
    //   username: userSaved.DSC_NOMBREUSUARIO,
    // });

    // res.cookie("token", token, {
    //   httpOnly: process.env.NODE_ENV !== "development",
    //   secure: true,
    //   sameSite: "none",
    // });

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
          DSC_NOMBREUSUARIO: DSC_NOMBREUSUARIO.toLowerCase(),
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

    const token = await createAccessToken({
      id: userFound.DSC_CEDULA,
      username: userFound.DSC_NOMBREUSUARIO,
    }, 
    REMEMBERME ? '30d' : '1d'
    );

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

    res.json({
      id: userFound.DSC_CEDULA,
      username: userFound.DSC_NOMBREUSUARIO,
      email: userFound.DSC_CORREO,
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
