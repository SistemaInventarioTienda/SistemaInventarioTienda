import { Router } from "express";
import { getAllSubcategories,createSubcategory } from "../controllers/subcategory.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { subcategorySchema } from "../schemas/subcategory.schema.js";



const router = Router();


 router.get("/subcategories", getAllSubcategories);
 router.post("/createSubcategory", validateSchema(subcategorySchema), createSubcategory);



 export default router;