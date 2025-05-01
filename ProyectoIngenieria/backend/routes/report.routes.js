import { Router } from "express";
import {
    downloadReport,
    createReport
} from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/download_pdf", downloadReport)
router.post("/reports", auth, createReport);

export default router;