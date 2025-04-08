import { Router } from "express";
import { addPayment,modifyPayment,getAllPaymentByCredit, getAllPaymentByCreditByFilter, getCreditById} from "../controllers/credit.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/registerPay/:id",addPayment);
router.put("/registerPayMod/:id",modifyPayment);
router.get("/getpayment",getAllPaymentByCredit);
router.get("/getpaymentByFilter",getAllPaymentByCreditByFilter);
router.get("/getCreditById/:id",getCreditById);


export default router;