import { Context, helpers, config, MongoClient, ObjectId } from "../../dev_deps.ts";
import {Product} from "../types/product.ts";

const {MONGO_URL,DATABASE_NAME} = config();

//conexion de mongo
const client = new MongoClient();
try {
    await client.connect(MONGO_URL);
    console.log("conexion a la base de datos exitosa!")
} catch (error) {
    console.log(error)
}

const db = client.database(DATABASE_NAME);///instancia de la base de datos
const productModel = db.collection<Product>("products");

export const findProds = async(ctx:Context)=>{
    try {
        const prods = await productModel.find().toArray();
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:prods}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const findProdById = async(ctx:Context)=>{
    try {
        const {id} = helpers.getQuery(ctx,{mergeParams:true}); //req.params.id;
        const prod = await productModel.findOne({_id: new ObjectId(id)});
        ctx.response.status = 200;
        ctx.response.body = {status:"success", data:prod};
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const createProd = async(ctx:Context)=>{
    try {
        const body = await ctx.request.body().value;
        const prodCreated = await productModel.insertOne(body);
        ctx.response.status = 200;
        ctx.response.body = {status:"success",data:prodCreated, message:"product created"}
    } catch (error) {
        ctx.response.status = 401;
        ctx.response.body = `Hubo un error ${error}`;
    }
};

export const editProdById = async (ctx: Context) => {
    try {
      const { id } = helpers.getQuery(ctx, { mergeParams: true });
      const body = await ctx.request.body().value;
      const updatedProd = await productModel.updateOne(
        { _id: new ObjectId(id) },
        { $set: body }
      );
      ctx.response.status = 200;
      ctx.response.body = {
        status: "success",
        data: updatedProd,
        message: "product updated",
      };
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = `Hubo un error ${error}`;
    }
  };

  export const deleteProdById = async (ctx: Context) => {
    try {
      const { id } = helpers.getQuery(ctx, { mergeParams: true });
      const deleteCount = await productModel.deleteOne({ _id: new ObjectId(id) });
      if (deleteCount === 1) {
        ctx.response.status = 200;
        ctx.response.body = { status: "success", message: "product deleted" };
      } else {
        ctx.response.status = 404;
        ctx.response.body = { status: "fail", message: "product not found" };
      }
    } catch (error) {
      ctx.response.status = 401;
      ctx.response.body = `Hubo un error ${error}`;
    }
  };