import { Router } from "express";
import { addPayment,modifyPayment  } from "../controllers/credit.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/registerPay/:id",addPayment);
router.put("/registerPayMod/:id",modifyPayment);


export default router;