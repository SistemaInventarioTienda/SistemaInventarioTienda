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
