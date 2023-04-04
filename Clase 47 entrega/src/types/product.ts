import { Double } from "https://deno.land/x/mongo@v0.31.2/mod.ts";
import { ObjectId } from "../../dev_deps.ts";

export interface Product{
    _id: ObjectId;
    title: string;
    price: number;
}