import Router from "koa-router";
import { UserController } from "../../controllers/user.controller.js";

const router = new Router({
    prefix:"/users"
});

router.get('/', async (ctx) => {
    const users = await UserController.getUsers();
    ctx.body = users;
  });
  
  router.post('/', async (ctx) => {
    const user = ctx.request.body;
    const newUser = await UserController.saveUser(user);
    ctx.body = newUser;
  });
  
  router.get('/:id', async (ctx) => {
    const id = ctx.params.id;
    const user = await UserController.getUser(id);
    ctx.body = user;
  });

export {router as userRouter};