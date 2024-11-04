import { Router } from "express";
import {getAllSuppliers,createSupplier,deleteSupplier,getAllSupplierTypes,updatedSupplier,selectOneSupplier} from "../controllers/supplier.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { supplierDirectionSchema,supplierSchema } from "../schemas/supplier.schema.js";

const router = Router();

 router.get("/suppliers",getAllSuppliers);
 router.post("/saveSupplier",  createSupplier);
 router.put("/deleteSupplier",deleteSupplier);
 router.get("/supplierTypes",getAllSupplierTypes);
 router.put("/updateSupplier",validateSchema(supplierDirectionSchema), updatedSupplier);
 router.get("/selectSupplier",selectOneSupplier);




export default router;