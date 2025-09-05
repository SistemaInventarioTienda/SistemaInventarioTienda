import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
  createProForma,
  getAllProForma,
  searchProForma,
  deleteProForma
} from "../controllers/proforma.controller.js";
import { createProformaSchema } from "../schemas/proforma.schema.js";


const router = Router();

router.post("/createproforma" /*, auth */, validateSchema(createProformaSchema), createProForma);
router.get("/getallproforma", /*auth,*/ getAllProForma);
router.get("/getproforma", /*auth,*/ searchProForma);
router.delete("/deleteproforma/:id", /*auth,*/ deleteProForma);


export default router;