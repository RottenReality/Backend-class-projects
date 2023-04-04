import { Application, config, Context } from "../dev_deps.ts";
import {productRouter } from "./routes/product.routes.ts";

const {PORT} = config();
const port = parseInt(PORT);

//crear aplicacion del servidor de oak
const app = new Application();



app.use(productRouter.routes());

app.listen({port});
console.log(`Server listening on port ${PORT}`);