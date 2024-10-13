import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

// Parte de autenticación de los usuarios del sistema
router.post("/register", validateSchema(registerSchema), register); //Agregar la verificación del token
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken); //Creo que se debe quitar
router.post("/logout", verifyToken, logout);

export default router;
