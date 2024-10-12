import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { TOKEN_SECRET } from "../config.js";
import { createAccessToken } from "../libs/jwt.js";
import { getDateCR } from '../libs/date.js';

export const register = async (req, res) => {
  try {
    const {
      DSC_NOMBREUSUARIO, DSC_CORREO, DSC_CONTRASENIA, DSC_TELEFONO, ID_ROL, DSC_CEDULA,
      DSC_NOMBRE, DSC_APELLIDOUNO, DSC_APELLIDODOS, ESTADO
    } = req.body;

    const output = await existData(DSC_CORREO, DSC_TELEFONO, DSC_CEDULA, DSC_NOMBREUSUARIO);
    if (output !== false) {
      return res.status(400).json({
        message: output,
      })
    }

    // hashing the password
    const passwordHash = await bcrypt.hash(DSC_CONTRASENIA, 10);

    // creating the user
    const createdAt =  await getDateCR();
    const newUser = new User({
      DSC_NOMBREUSUARIO,
      DSC_CORREO,
      DSC_CONTRASENIA: passwordHash,
      DSC_TELEFONO,
      ID_ROL,
      DSC_CEDULA,
      DSC_NOMBRE,
      DSC_APELLIDOUNO,
      DSC_APELLIDODOS,
      FEC_CREADOEN: createdAt,
      ESTADO
    });

    // saving the user in the database
    const userSaved = await newUser.save();

    // create access token
    const token = await createAccessToken({
      id: userSaved.DSC_CEDULA,
      username: userSaved.DSC_NOMBREUSUARIO,
    });

    res.cookie("token", token, {
      httpOnly: process.env.NODE_ENV !== "development",
      secure: true,
      sameSite: "none",
    });

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
    const { DSC_NOMBREUSUARIO, DSC_CONTRASENIA } = req.body;

    const userFound = await User.findOne({ where: { DSC_NOMBREUSUARIO: DSC_NOMBREUSUARIO.toLowerCase() } });
    if (!userFound)
      return res.status(400).json({
        message: ["El nombre de usuario no existe"],
      });

    const isMatch = await bcrypt.compare(DSC_CONTRASENIA, userFound.DSC_CONTRASENIA);
    if (!isMatch) {
      return res.status(400).json({
        message: ["Usuario o contraseña incorrecta."],
      });
    }

    const token = await createAccessToken({
      id: userFound.DSC_CEDULA,
      username: userFound.DSC_NOMBREUSUARIO,
    });

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

    const userFound = await User.findById(user.id);
    if (!userFound) return res.sendStatus(401);

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
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


async function existData(email, phone, idUser, userName) {
  if (await existEmail(email))
    return ["El correo ya se encuentra en uso."];

  if (await existPhone(phone))
    return ["El telefono ya se encuentra en uso."];

  if (await existUserName(userName))
    return ["El nombre de usuario ya se encuentra en uso."];

  if (await existIdUser(idUser))
    return ["La persona ya tiene una cuenta asociada."];

  return false;
}

async function existEmail(email) {
  const emailFound = await User.findOne({ where: { DSC_CORREO: email.toLowerCase() } });
  if (emailFound)
    return true;
  return false;
}

async function existPhone(phone) {
  const phoneFound = await User.findOne({ where: { DSC_TELEFONO: phone.toLowerCase() } });
  if (phoneFound)
    return true;
  return false;
}

async function existUserName(userName) {
  const userNameFound = await User.findOne({ where: { DSC_NOMBREUSUARIO: userName.toLowerCase() } });
  if (userNameFound)
    return true;
  return false;
}

async function existIdUser(idUser) {
  const idUserFound = await User.findOne({ where: { DSC_CEDULA: idUser.toLowerCase() } });
  if (idUserFound)
    return true;
  return false;
}