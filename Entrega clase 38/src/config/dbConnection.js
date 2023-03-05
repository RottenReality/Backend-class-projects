import mongoose from "mongoose";
import { options } from "./options.js";

export const connectMongoDB = async () => {
    try {
      await mongoose.connect(options.mongo.url);
      console.log('Conectado a MongoDB');
    } catch (error) {
      console.log('Error al conectar a MongoDB', error);
    }
  };