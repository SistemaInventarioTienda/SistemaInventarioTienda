import { Router } from "express";
import {getAllCategories} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/auth.schema.js";


const router = Router();

// Get all categories
 router.get("/categories",getAllCategories);



 export default router;