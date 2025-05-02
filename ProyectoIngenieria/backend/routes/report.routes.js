import { Router } from "express";
import {
    downloadReport,
    createReport
} from "../controllers/report.controller.js";
import {
    getAllReports
} from "../controllers/reports.controller.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/download_report", downloadReport);
router.post("/reports", auth, createReport);
router.get("/get_all_reports", auth, getAllReports);

export default router;