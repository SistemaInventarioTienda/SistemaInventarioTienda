import { Router } from "express";
import { getAllSubcategories, createSubcategory, deleteSubcategory, UpdateSubcategory, getAllSubcategoriesTypes } from "../controllers/subcategory.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { subcategorySchema } from "../schemas/subcategory.schema.js";



const router = Router();


router.get("/subcategories",auth, getAllSubcategories);
router.get("/subcategoriesTypes",auth, getAllSubcategoriesTypes);
router.post("/createSubcategory",auth, validateSchema(subcategorySchema), createSubcategory);
router.put("/deleteSubcategory",auth, deleteSubcategory);
router.put("/updateSubcategory",auth, validateSchema(subcategorySchema), UpdateSubcategory);



export default router;