import { Router } from "express";
import {
  login,
  logout,
  register,
  verifyToken,
  getAllPermission
} from "../controllers/auth.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";

const router = Router();

// Parte de autenticación de los usuarios del sistema
router.post("/register", auth, validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.get("/verify", verifyToken); //Creo que se debe quitar
router.post("/logout", verifyToken, logout);
router.get("/getPermissionsUser/:id", auth, getAllPermission);
router.get("/getmypermissions", auth, getAllPermission);

export default router;
