import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";

import { updateNotification,getAllNotifications } from "../controllers/notification.controller.js";
const router = Router();


router.get("/viewNotification/:id",auth, updateNotification);
router.get("/getNotification", getAllNotifications);


export default router;