import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { createCashClosing } from "../controllers/report.controller.js";
import { getCashToday } from "../controllers/cashClosing.controller.js";


const router = Router();
router.post("/createcashclosing", auth, createCashClosing);
router.get("/getcashtoday", auth, getCashToday);
export default router;