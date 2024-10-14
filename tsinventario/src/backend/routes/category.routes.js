import { Router } from "express";
import {getAllCategories,addCategory} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";


const router = Router();

// Get all categories
 router.get("/categories",getAllCategories);
 router.post("/saveCategory",validateSchema(categorySchema),addCategory);



 export default router;