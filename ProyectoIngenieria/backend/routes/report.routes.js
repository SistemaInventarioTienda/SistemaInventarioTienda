import { Router } from "express";
import {
    downloadReport,
    getReport
} from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/download_pdf", downloadReport)
router.post("/reports", auth, getReport);

export default router;