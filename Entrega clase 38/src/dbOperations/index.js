import { MongoContainer } from "./managers/mongo.manager.js";
import {ProductModel} from "./dbModels/product.model.js";

export const ProductManager = new MongoContainer(ProductModel);