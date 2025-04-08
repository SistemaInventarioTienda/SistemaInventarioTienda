import { Router } from "express";
import { updateConfiguration, getConfig } from "../controllers/config.controller.js";

import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { configSchema } from "../schemas/config.schema.js";

const router = Router();

router.get("/getConfig",auth, getConfig);
router.put("/updateConfig",auth, validateSchema(configSchema), updateConfiguration); //falta el auth


export default router;