import Router from "koa-router";
import { ProductController } from "../../controllers/product.controller.js";

const router = new Router({
    prefix:"/products"
});

router.get('/', async (ctx) => {
    const products = await ProductController.getProducts();
    ctx.body = products;
  });
  
  router.post('/', async (ctx) => {
    const product = ctx.request.body;
    const newProduct = await ProductController.saveProduct(product);
    ctx.body = newProduct;
  });
  
  router.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    const product = await ProductController.getProduct(id);
    ctx.body = product;
  });

export {router as productRouter};