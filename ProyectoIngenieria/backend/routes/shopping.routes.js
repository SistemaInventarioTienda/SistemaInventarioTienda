import { Router } from "express";
import { registerShopping, deleteShopping, getAllShoppings, searchShopping } from "../controllers/shopping.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/shopping.schema.js";

const router = Router();

// Parte de autenticación de los usuarios del sistema
router.post("/register", auth, validateSchema(registerSchema), registerShopping);
router.get("/all_shoppings", auth, getAllShoppings);
router.delete("/delete_shopping/:id", auth, deleteShopping);
router.get("/search_shopping", auth, searchShopping)

export default router;
