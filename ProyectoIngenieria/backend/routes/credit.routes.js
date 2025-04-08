import { Router } from "express";
import { addPayment,modifyPayment,getAllPaymentByCredit, getAllPaymentByCreditByFilter} from "../controllers/credit.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/registerPay/:id",addPayment);
router.put("/registerPayMod/:id",modifyPayment);
router.get("/getpayment",getAllPaymentByCredit);
router.get("/getpaymentByFilter",getAllPaymentByCreditByFilter);


export default router;