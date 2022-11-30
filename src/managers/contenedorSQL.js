const { response } = require('express');
const knex = require('knex');

//const database = knex(options)

class contenedorSQL{
    constructor(options, tableName){
        this.database = knex(options);
        this.table = tableName
    }

    async getAll(){
        try{
            const response = await this.database.from(this.table).select("*");
            return response;
        } catch(error){
            console.log(`hubo un error ${error}`);
        }
    }

    async save(object){
        try{
            const [id] = await this.database.from(this.table).insert(object);
            return `saved succesfully with id ${id}`;
        } catch(error){
            console.log(`hubo un error ${error}`);
        }
    }
}

module.exports = {contenedorSQL}