import { Router } from "express";
import { getAllSuppliers, createSupplier, deleteSupplier, getAllSupplierTypes, updatedSupplier, selectOneSupplier, searchSupplier, getAllSupplierWithoutPagination } from "../controllers/supplier.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { supplierSchema } from "../schemas/supplier.schema.js";

const router = Router();

router.get("/suppliers", auth, getAllSuppliers);
router.post("/saveSupplier", auth, validateSchema(supplierSchema), createSupplier);
router.put("/deleteSupplier", auth, deleteSupplier);
router.get("/supplierTypes", auth, getAllSupplierTypes);
router.put("/updateSupplier", auth, updatedSupplier);
router.get("/selectSupplier", auth, selectOneSupplier);
router.get("/searchSupplier", auth, searchSupplier);
router.get("/suppliersWithoutPag", auth, getAllSupplierWithoutPagination);



export default router;