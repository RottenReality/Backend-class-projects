import { ProductManager } from "../dbOperations/index.js";

class ProductService{
    static async getProducts(){
        return await ProductManager.getAll();
    }
    
    static async getProductById(id){
        return await ProductManager.getById(id);
    }

    static async saveProduct(product){
        return await ProductManager.save(product);
    }
}

export {ProductService}