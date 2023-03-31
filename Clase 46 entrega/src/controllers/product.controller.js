import { ProductService } from "../services/product.service.js";


class ProductController{

    static async getProducts(req,res){
        try {
            const prods = await ProductService.getProducts();
            res.render("html-onwire",{productos:prods});
            // res.status(200).json({
            //     status:"SUCCESS",
            //     data:response
            // });
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`Hubo un error ${error}`
            });
        }
    };

    static async saveProduct(req,res){
        try {
            await ProductService.saveProduct(req.body);
            res.redirect("/products");
            // res.status(200).json({
            //     status:"SUCCESS",
            //     data:response
            // });
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`Hubo un error ${error}`
            });
        }
    };

    static async getProduct(req,res){
        try {
            const response = await ProductService.getProduct(req.params.id);
            res.status(200).json({
                status:"SUCCESS",
                data:response
            });
        } catch (error) {
            res.status(400).json({
                status:"ERROR",
                message:`Hubo un error ${error}`
            });
        }
    };

}

export {ProductController}