import { Router } from "../../dev_deps.ts"
import {findProds, findProdById, createProd, editProdById, deleteProdById} from "../controllers/product.controller.ts";

export const productRouter = new Router()
.get("/products", findProds)
.get("/products/:id", findProdById)
.post("/products", createProd)
.put("/products/:id", editProdById)
.delete("/products/:id", deleteProdById)