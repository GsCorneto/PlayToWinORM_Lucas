require("doteenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/usuario")

const express = require("express");
const app = express();

app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(express.json());

app.length("/usuarios/novo", (req,res) =>{
    res.sendFile(`${__dirname}/views/formUsuario.html`);
});


conn 
 .sync()
 .then(() => {
    console.log("Conectado! :)");
 })
 .catch((err) =>{
    console.log("Erro :(" + err)
 })