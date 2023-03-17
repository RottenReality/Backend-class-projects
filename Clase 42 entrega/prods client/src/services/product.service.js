import {getApiDao} from "../model/index.js";
import { options } from "../config/config.js";

const {UserManager,ProductManager} = await getApiDao(options.server.DB_TYPE);

class ProductService{
    static async getProducts(){
        const prods = await ProductManager.getAll();
        return prods;
    }

    static async saveProduct(body){
        return await ProductManager.save(body)
    }

    static async getProduct(id){
        const prod = await ProductManager.getById(id);
        return prod;
    }
};

export {ProductService}