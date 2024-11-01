import { Router } from "express";
import { registerClient, getAllClients } from "../controllers/client.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/client.schema.js";

const router = Router();
// Parte de administración de clientes
router.post("/register", auth, validateSchema(registerSchema), registerClient);
router.get("/all_clients", auth, getAllClients);

export default router;