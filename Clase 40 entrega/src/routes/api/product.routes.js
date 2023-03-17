import express from "express";
import { ProductController } from "../../controllers/product.controller.js";

const router = express.Router();

router.get("/", ProductController.getProducts);
router.post("/", ProductController.saveProduct);
router.get("/:id", ProductController.getProduct);

export {router as productRouter};