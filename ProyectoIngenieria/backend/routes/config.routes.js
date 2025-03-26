import { Router } from "express";
import { updateConfiguration } from "../controllers/config.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { configSchema } from "../schemas/config.schema.js";

const router = Router();

router.put("/updateConfig", validateSchema(configSchema), updateConfiguration); //falta el auth

export default router;