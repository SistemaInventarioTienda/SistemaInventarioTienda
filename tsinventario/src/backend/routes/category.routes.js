import { Router } from "express";
import {getAllCategories,addCategory,UpdateCategory,GetCategoryByName,DisableCategory} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";



const router = Router();


 router.get("/categories", auth, getAllCategories);
 router.post("/saveCategory",auth, validateSchema(categorySchema),addCategory);
 router.put("/updateCategory",auth, validateSchema(categorySchema),UpdateCategory);
 router.get("/getCategoryByName", auth, GetCategoryByName);
 router.put("/disableCategory",auth, validateSchema(categorySchema), DisableCategory);



 export default router;