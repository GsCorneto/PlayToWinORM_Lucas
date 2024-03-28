require("doteenv").config();
const conn = require("./db/conn");

conn 
 .authenticate()
 .then(() => {
    console.log("Conectado! :)");
 })
 .catch((err) =>{
    console.log("Erro :(" + err)
 })