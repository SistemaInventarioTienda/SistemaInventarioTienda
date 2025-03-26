import { Router } from "express";
import { createSale, getAllSales, getSaleDetails, searchSales } from "../controllers/sale.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { saleSchema, detailSchema } from "../schemas/sale.schema.js";

const router = Router();

router.post("/addSale", validateSchema(saleSchema), createSale);
router.get("/getSales", getAllSales);
router.post("/getOnlySale", getSaleDetails);
router.get("/searchSale", searchSales);


export default router;