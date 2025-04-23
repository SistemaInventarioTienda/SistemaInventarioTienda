import { Router } from "express";
import {
    getAllDataFromGrpahic
} from "../controllers/graphics.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();
// Parte de administración de graficos y reportes
router.get("/all_graphics", getAllDataFromGrpahic);

export default router;