import { Router } from "express";
import {getAllSuppliers,createSupplier,deleteSupplier,getAllSupplierTypes,updatedSupplier,selectOneSupplier,searchSupplier} from "../controllers/supplier.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { supplierDirectionSchema,supplierSchema } from "../schemas/supplier.schema.js";

const router = Router();

 router.get("/suppliers",getAllSuppliers);
 router.post("/saveSupplier",validateSchema(supplierDirectionSchema),validateSchema(supplierSchema),  createSupplier);
 router.put("/deleteSupplier",deleteSupplier);
 router.get("/supplierTypes",getAllSupplierTypes);
 router.put("/updateSupplier",validateSchema(supplierDirectionSchema), updatedSupplier);
 router.get("/selectSupplier",selectOneSupplier);
 router.get("/searchSupplier", searchSupplier);




export default router;