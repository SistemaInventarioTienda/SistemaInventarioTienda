import { Router } from "express";
import { getAllSubcategories, createSubcategory, deleteSubcategory, UpdateSubcategory, getAllSubcategoriesTypes } from "../controllers/subcategory.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { subcategorySchema } from "../schemas/subcategory.schema.js";



const router = Router();


router.get("/subcategories", getAllSubcategories);
router.get("/subcategoriesTypes", getAllSubcategoriesTypes);
router.post("/createSubcategory", validateSchema(subcategorySchema), createSubcategory);
router.put("/deleteSubcategory", deleteSubcategory);
router.put("/updateSubcategory", validateSchema(subcategorySchema), UpdateSubcategory);



export default router;