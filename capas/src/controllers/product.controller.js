import { ProductService } from "../services/product.service.js"

class ProductController{

    static async getProducts(req,res){
        try {
            const response = await ProductService.getProducts();
            res.status(200).json({
                status:"SUCCESS",
                data:response
            })
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`hubo un error: ${error}`
            })
        }
    }

    static async saveProduct (req,res){
        try {
            const newProduct = req.body;
            const response = await ProductService.saveProduct(newProduct);
            res.status(200).json({
                status:"SUCCESS",
                data:response
            })
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`hubo un error: ${error}`
            })
        }
    }

    static async getProductById(req,res){
        try {
            const id = req.params.id;
            const response = await ProductService.getProductById(id);
            res.status(200).json({
                status:"SUCCESS",
                data:response
            })
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`hubo un error: ${error}`
            })
        }
    }
}

export {ProductController}