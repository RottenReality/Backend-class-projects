const fs = require("fs");
class chatInfo{

    constructor (filename){
        this.filename = filename
    };

    async save(objeto){
        try{
            if(fs.existsSync(this.filename)){
                const mensajes = await this.getAll();
                if(mensajes.length > 0){
                    const lastId = mensajes[mensajes.length-1].id + 1;
                    objeto.id = lastId;
                    mensajes.push(objeto);
                    fs.promises.writeFile(this.filename, JSON.stringify(mensajes, null, 2))
                } else{
                    objeto.id = 1
                    fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
                }
            } else {
                objeto.id = 1
                fs.promises.writeFile(this.filename, JSON.stringify([objeto], null, 2))
            }
        } catch (error) {
            return "error, no se pudo guardar."
        }

    }

    async getAll(){
        try {
            const contenido = await fs.promises.readFile(this.filename, "utf8");
            if(contenido.length > 0){
                const mensajes = JSON.parse(contenido);
                return mensajes;
            } else{
                return [];
            }
            
        } catch (error) {
            return "error en lectura de mensajes"
        }
        
    }


    async getById(id){
        try {
            const productos = await this.getAll();
            const producto = productos.find(elemento=>elemento.id === id);
            return producto;
        } catch (error) {
            return "no se encuentra producto"
        }
    }

    async deleteByiD(id){
        try{
            const productos = await this.getAll();
            const nProds = productos.filter(elemento=>elemento.id !== id)
            fs.promises.writeFile(this.filename, JSON.stringify(nProds, null, 2))
        } catch (error){
            return "no se puede eliminar"
        }
    }

    async deleteAll(){
        fs.promises.writeFile(this.filename,"")
        console.log("datos eliminados")
    }
    
}



module.exports={ chatInfo }










