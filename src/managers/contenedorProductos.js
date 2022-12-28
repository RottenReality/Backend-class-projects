const fs = require('fs');
const {faker} = require('@faker-js/faker');
const {commerce, image } = faker;
class Contenedor{

    constructor (filename){
        this.filename = filename
    };

    async save(objeto){
        try{
            if(fs.existsSync(this.filename)){
                const productos = await this.getAll();
                if(productos.length > 0){
                    const lastId = parseInt(productos[productos.length-1].id) + 1;
                    objeto.id = lastId;
                    productos.push(objeto);
                    fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2))
                    return objeto
                } else{
                    objeto.id = 1
                    fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
                    return objeto
                }
            } else {
                objeto.id = 1
                fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
                return objeto
            }
        } catch (error) {
            return "error, producto no se pudo guardar."
        }

    }

    async save5(){
        try{
            
            
            if(fs.existsSync(this.filename)){
                for(let i = 0; i < 5; i++){
                    let objeto = 
                        {
                            title: commerce.product(),
                            price: commerce.price(),
                            thumbnail: image.imageUrl()
                        };

                        const productos = await this.getAll();
                if(productos.length > 0){
                    const lastId = parseInt(productos[productos.length-1].id) + 1;
                    objeto.id = lastId;
                    productos.push(objeto);
                    fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2))
                    return objeto
                } else{
                    objeto.id = 1
                    fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
                    return objeto
                }
                }
                
            } else {
                objeto.id = 1
                fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
                return objeto
            }
        } catch (error) {
            return "error, producto no se pudo guardar."
        }

    }

    

    async getAll(){
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf8");
            if(contenido.length > 0){
                const productos = JSON.parse(contenido);
                return productos;
            } else{
                return [];
            }
            
        } catch (error) {
            return "error en lectura de productos"
        }
        
    }

    async getAllFive(){
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf8");
            if(contenido.length > 0){
                const productos = JSON.parse(contenido);
                return productos;
            } else{
                return [];
            }
            
        } catch (error) {
            return "error en lectura de productos"
        }
        
    }


    async getById(idProd){
        try {
            const lista = await this.getAll();
            const pro = lista.find((elemento)=>elemento.id == idProd);
            return pro;
        } catch (error) {
            return "no se encuentra producto"
        }
    }

    async editById(id, obj){
        try {
            const productos = await this.getAll();
            if(id <= productos.length){
                productos[id - 1] = obj;
                productos[id - 1].id = parseInt(id);
                fs.promises.writeFile(this.filename, JSON.stringify(productos, null, 2));
                return " producto editado con éxito"
            }
            else{
                return {"error":"producto no encontrado"}
            }
            
        } catch (error) {
            return {"error":"producto no encontrado"}
        }
    }

    async deleteByiD(id){
        try{
            const productos = await this.getAll();
            const nProds = productos.filter(elemento=>elemento.id != id)
            fs.promises.writeFile(this.filename, JSON.stringify(nProds, null, 2))
        } catch (error){
            return {"error":"no se puede eliminar"}
        }
    }

    async deleteAll(){
        fs.promises.writeFile(this.filename,"")
        console.log("datos eliminados")
    }
    
}



module.exports = {Contenedor};