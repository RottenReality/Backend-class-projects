class Contenedor{

    productos = [
        {
            "title": "abrigo",
            "price": 65,
            "thumbnail": "https://media.istockphoto.com/photos/trenchcoat-picture-id518177352?k=20&m=518177352&s=612x612&w=0&h=ou-nQusk6JNcXpOMECx1tI_ib-JdpY74ZjctvJIT904=",
            "id": 1
          },
          {
            "title": "zapatos",
            "price": 70,
            "thumbnail": "https://img.lalr.co/cms/2017/12/05165632/Zapatos.jpg",
            "id": 2
          }
    ];
    

    constructor(){
    };

    save(objeto){
        try{
            if(this.productos.length > 0){
                const lastId = this.productos[this.productos.length-1].id + 1;
                objeto.id = lastId;
                this.productos.push(objeto);
                return objeto
            } else{
                objeto.id = 1
                this.productos.push(objeto);
                return objeto
            }

        } catch (error) {
            return "error, no se pudo guardar."
        }

    }

    getAll(){
        try {
            if(this.productos.length == 0){
                return "No hay productos"
            }else {
                return this.productos;
            }
        } catch (error) {
            return "error en lectura de productos"
        }
        
    }

    getById(id){
        try {
            if(id <= this.productos.length){
            const producto = this.productos.find(elemento=>elemento.id == id);
            return producto;
            } 
            else{
                return {"error":"producto no encontrado"}
            }

        } catch (error) {
            return {"error":"producto no encontrado"}
        }
    }

    editById(id, obj){
        try {
            if(id <= this.productos.length){
                this.productos[id - 1] = obj
                return " producto editado con éxito"
            }
            else{
                return {"error":"producto no encontrado"}
            }
            
        } catch (error) {
            return {"error":"producto no encontrado"}
        }
    }

    deleteByiD(id){
        try{
            if(id <= this.productos.length){
                const nProds = this.productos.filter(elemento=>elemento.id != id)
                this.productos = nProds
                return "eliminado con exito"}
                else{
                    return {"error":"producto no encontrado"}
                }
        } catch (error){
            return {"error":"producto no encontrado"}
        }
    }

    deleteAll(){
        this.productos = []
        return ("datos eliminados")
    }
    
}



module.exports={ Contenedor }










