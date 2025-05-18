import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";

import { updateNotification } from "../controllers/notification.controller.js";
const router = Router();


router.get("/viewNotification/:id",auth, updateNotification);

export default router;