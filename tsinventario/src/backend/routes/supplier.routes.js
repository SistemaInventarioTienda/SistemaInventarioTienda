import { Router } from "express";
import {getAllSuppliers,createSupplier,deleteSupplier,getAllSupplierTypes} from "../controllers/supplier.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { updateSchema } from "../schemas/auth.schema.js";

const router = Router();

 router.get("/suppliers",getAllSuppliers);
 router.post("/saveSupplier",  createSupplier);
 router.put("/deleteSupplier",deleteSupplier);
 router.get("/supplierTypes",getAllSupplierTypes);




export default router;