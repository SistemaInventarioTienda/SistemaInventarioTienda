import { Router } from "express";
import { getAllProducts, deleteProduct, updateProduct, registerProduct, searchProduct, getProductById} from "../controllers/product.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema, updateSchema } from "../schemas/product.schema.js";

const router = Router();

// Parte de autenticación de los usuarios del sistema
router.post("/register", auth, /*validateSchema(registerSchema),*/ registerProduct);
router.get("/all_product", auth, getAllProducts);
router.get("/get_product/:id", auth, getProductById);
router.put("/update_product/:id", auth, /*validateSchema(updateSchema),*/ updateProduct);
router.delete("/delete_product/:id", auth, deleteProduct);
router.get("/searchProduct", auth, searchProduct)

export default router;
