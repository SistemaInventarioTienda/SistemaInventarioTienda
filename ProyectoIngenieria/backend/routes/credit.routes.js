import { Router } from "express";
import { addPayment  } from "../controllers/credit.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/registerPay/:id",addPayment);


export default router;