const fs = require('fs');

class ContenedorChat{

    constructor (filename){
        this.filename = filename
    };

    async save(objeto){
        try{
            if(fs.existsSync(this.filename)){
                const mensajes = await this.getAll();
                if(mensajes.length > 0){
                    const lastId = parseInt(mensajes[mensajes.length-1].id) + 1;
                    objeto.id = lastId;
                    mensajes.push(objeto);
                    fs.promises.writeFile(this.filename, JSON.stringify(mensajes, null, 2))
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
            return "error, mensaje no se pudo guardar."
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

}

module.exports = {ContenedorChat};