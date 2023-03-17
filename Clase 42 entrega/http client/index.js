import axios from "axios";


const URL = "localhost:8080"

const getUsers = async()=>{
    try{
        const response = axios.get(`${URL}/products`);
        return response
    } catch (error) {
        console.log(error);
    }
}



const prods = getUsers();

console.log(prods)