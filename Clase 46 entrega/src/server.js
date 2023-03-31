import koa from "koa";
import {koaBody} from "koa-body";
import Handlebars from "handlebars";
import KoaHandlebars from "koa-handlebars";
import { apiRouter } from "./routes/index.js";
import { productRouter } from "./routes/api/product.routes.js";

const app = new koa();


app.use(
  KoaHandlebars({
    viewsDir: 'src/views',
    layoutsDir: 'src/views/layouts',
    partialsDir: 'src/views/partials',
    defaultLayout: 'main',
    extension: 'hbs',
    handlebars: Handlebars,
  })
);

app.use(async (ctx, next) => {
    console.log(`Request received: ${ctx.method} ${ctx.url}`);
    await next();
});

app.use(koaBody());

const PORT = 8080;

app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
);

//app.use(apiRouter.routes());
app.use(productRouter.routes());