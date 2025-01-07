import { Router } from "express";
import { registerClient, getAllClients, searchClient, updateClient, deleteClient} from "../controllers/client.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, updateSchema } from "../schemas/client.schema.js";

const router = Router();
// Parte de administración de clientes
router.post("/register", auth, validateSchema(registerSchema), registerClient);
router.get("/all_clients", auth, getAllClients);
router.get("/search_client", auth, searchClient);
router.put("/update_client/:id", auth, validateSchema(updateSchema), updateClient);
router.delete("/delete_client/:id", auth, deleteClient);

export default router;