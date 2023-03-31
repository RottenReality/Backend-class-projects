import Router from "koa-router";
import { productRouter } from "./api/product.routes.js";
import { userRouter } from "./api/user.routes.js";


const router = new Router({
    prefix:"/"
});

router.use(productRouter.routes());
router.use(userRouter.routes());

router.get("/",(ctx)=>{
    ctx.render('html-onwire', {});
});

export {router as apiRouter};