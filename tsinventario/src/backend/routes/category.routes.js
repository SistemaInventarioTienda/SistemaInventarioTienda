import { Router } from "express";
import {getAllCategories,addCategory,UpdateCategory,searchCategories,DisableCategory} from "../controllers/category.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { categorySchema } from "../schemas/category.schema.js";



const router = Router();


 router.get("/categories", auth, getAllCategories);
 router.post("/saveCategory",auth, validateSchema(categorySchema),addCategory);
 router.put("/updateCategory",auth, validateSchema(categorySchema),UpdateCategory);
 router.get("/searchCategory", auth, searchCategories);
 router.put("/disableCategory",auth, validateSchema(categorySchema), DisableCategory);




 export default router;