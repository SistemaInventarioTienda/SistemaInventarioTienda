import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, autorización denegada." });

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token no valido." });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const authorize = (requieredPermissions) => {
  return (req, res, next) => {
    try {
      const user = req.user;

      if (!user || !user?.permissions) {
        return res
          .status(401)
          .json({ message: "Acceso denegado." });
      }

      const userPermissions = req.user.permissions.map(p => p.nombre);
      const hasPermission = requieredPermissions.some(permission => userPermissions.includes(permission));
      if (!hasPermission) {
        return res.status(403).json({ message: "Acceso denegado: permiso insuficiente" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }
}
