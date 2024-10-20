import { Router } from "express";
import {
    updateUser,
    deleteUser,
    getAllUsers,
    searchUser
} from "../controllers/user.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { updateSchema } from "../schemas/auth.schema.js";

const router = Router();
// Parte de administración de usuarios
router.get("/all_user", auth, getAllUsers);
router.put("/update_user/:id", auth,  validateSchema(updateSchema), updateUser);
router.delete("/delete_user/:id", auth, deleteUser);
router.get("/searchUser", auth, searchUser)

export default router;