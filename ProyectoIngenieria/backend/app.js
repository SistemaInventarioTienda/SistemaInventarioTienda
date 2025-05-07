import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import categoryRoutes from "./routes/category.routes.js";
import supplierRoutes from "./routes/supplier.routes.js";
import clientRoutes from "./routes/client.routes.js";
import subcategoryRoutes from "./routes/subcategory.routes.js";
import productRoutes from "./routes/product.routes.js";
import saleRoutes from "./routes/sale.routes.js";
import creditRoutes from "./routes/credit.routes.js";
import transactionRoutes from "./routes/transaction.routes.js";
import shoppingRoutes from "./routes/shopping.routes.js";
import graphicsRoutes from "./routes/graphics.routes.js";
import reportRoutes from "./routes/report.routes.js";
import configRoutes from "./routes/config.routes.js";

import { FRONTEND_URL } from "./config.js";

const app = express();

app.use(
  cors({
    credentials: true,
    origin: FRONTEND_URL,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/supplier", supplierRoutes);
app.use("/api/client", clientRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/shopping", shoppingRoutes);
app.use("/api/config", configRoutes);
app.use("/api/credit", creditRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/transaction', transactionRoutes);
app.use('/api/graphics', graphicsRoutes);
app.use('/api/reports', reportRoutes)

if (process.env.NODE_ENV === "production") {
  const path = await import("path");
  app.use(express.static("client/dist"));

  app.get("*", (req, res) => {
    console.log(path.resolve("client", "build", "index.html") );
    res.sendFile(path.resolve("client", "build", "index.html"));
  });
}

export default app;
