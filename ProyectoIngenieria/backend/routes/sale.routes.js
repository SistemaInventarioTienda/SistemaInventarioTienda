import { Router } from "express";
import { createSale, getAllSales, getSaleDetails, searchSales,deleteSale } from "../controllers/sale.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { saleSchema, detailSchema } from "../schemas/sale.schema.js";

const router = Router();

router.post("/addSale",auth , validateSchema(saleSchema), createSale);
router.get("/getSales",auth ,getAllSales);
router.post("/getOnlySale",auth, getSaleDetails);
router.get("/searchSale",auth ,searchSales);
router.put("/deleteSale/:id",auth,deleteSale);


export default router;