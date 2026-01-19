import { Router } from "express";

import { updateNotification,getAllNotifications } from "../controllers/notification.controller.js";
const router = Router();


router.put("/viewNotification/:id",updateNotification);
router.get("/getNotification", getAllNotifications);


export default router;