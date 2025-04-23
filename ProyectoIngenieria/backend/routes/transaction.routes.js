import { Router } from "express";
import { createTransaction, updateTransaction, deleteTransaction, getAllTransactions, searchTransaction } from "../controllers/transaction.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { registerSchema } from "../schemas/transaction.schema.js";

const router = Router();
// Parte de administración de usuarios
router.post("/create_transaction", auth, validateSchema(registerSchema), createTransaction);
router.get("/get_all_transaction", auth, getAllTransactions);
router.get("/search_transaction", auth, searchTransaction);
router.delete("/delete_transaction/:id", auth, deleteTransaction);
router.put("/update_transaction/:id", auth, updateTransaction);

export default router;