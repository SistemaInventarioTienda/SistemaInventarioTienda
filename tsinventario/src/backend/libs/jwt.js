import { TOKEN_SECRET } from "../config.js";
import jwt from "jsonwebtoken";

export async function createAccessToken(payload, expiresIn = "1d") {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, TOKEN_SECRET, { expiresIn }, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
}

export async function decodedToken(token) {
  try {
    const decoded = jwt.verify(token, TOKEN_SECRET);
    return decoded; // Devuelve el payload decodificado
  } catch (error) {
    console.error("Error al verificar el token:", error);
    return null; // El token es inválido o ha expirado
  }
}
