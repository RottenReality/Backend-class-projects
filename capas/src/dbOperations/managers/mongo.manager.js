class MongoContainer{

    constructor (model){
        this.model = model;
        
    };

    async save(objeto){
        try{
            await this.model.create(objeto);
            return "producto guardado con éxito";
        } catch(error){
            return "error, no se pudo guardar";
        }
    }

    async getAll(){
        try {
            let prods = await this.model.find()
            if(prods.length > 0){
                return prods
            } else{
                return [];
            }
        } catch (error) {
            return "error en lectura de productos"
        }
        
    }

    async getById(idProd){
        try {
            const product = await this.model.findOne({_id:idProd})
            return product
        } catch (error) {
            logger.error(error)
            return "no se encuentra producto"
        }
    }

    async editById(id, obj){
        try {
            this.model.updateOne(
                {_id : id}, 
                {
                    $set: {
                        title: obj.title, 
                        thumbnail: obj.thumbnail, 
                        price: obj.price, 
                        code: obj.code, 
                        description: obj.description, 
                        stock: obj.stock
                    }
                }
            );
            return {"ok":"editado con éxito"}
        } catch (error) {
            return {"error":"producto no encontrado"}
        }
    }

    async deleteByiD(id){
        try{
            await this.model.deleteOne({_id:id});
            return "Producto eliminado con éxito";
        } catch (error){
            return {"error":"no se puede eliminar"}
        }
    }

    async deleteAll(){
        await this.model.deleteMany({});
        return "datos eliminados";
    }
    
}

export {MongoContainer}