import { Router } from "express";
import {createSale} from "../controllers/sale.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { saleSchema,detailSchema } from "../schemas/sale.schema.js";

const router = Router();

router.post("/addSale",validateSchema(saleSchema),createSale);


export default router;