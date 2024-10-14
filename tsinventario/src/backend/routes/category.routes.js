import { Router } from "express";
import {getAllCategories,addCategory,UpdateCategory,GetCategoryByName,DisableCategory} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";



const router = Router();


 router.get("/categories",getAllCategories);
 router.post("/saveCategory",validateSchema(categorySchema),addCategory);
 router.put("/updateCategory",validateSchema(categorySchema),UpdateCategory);
 router.get("/getCategoryByName", GetCategoryByName);
 router.put("/disableCategory",validateSchema(categorySchema), DisableCategory);



 export default router;