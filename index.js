require("dotenv").config();
const conn = require("./db/conn");

const Usuario = require("./models/usuario");

const express = require("express");
const handlebars = require("express-handlebars");


const app = express();

app.engine("handlebars", handlebars.engine());
app.set("view engine", 'handlebars')

app.use(
    express.urlencoded({
        urlencoded: true,
    })
);

app.use(express.json());

app.get("/usuarios/novo", (req,res) =>{
    res.render(`formUsuario`);
});

app.get("/", (req,res) =>{
    res.render(`home`);
});

app.get("/usuarios", async (req,res) =>{
    const usuarios =  await Usuario.findAll({raw: true})
    res.render(`usuarios`, { usuarios });
});

app.post("/usuarios/novo",  async (req,res) =>{
   const nickname = req.body.nickname; 
   const nome = req.body.nome;

   const dadosUsuario = {
    nickname,
    nome,
   };

   const usuario = await Usuario.create(dadosUsuario);

   res.send("Usuário inserido sob o id " + usuario.id)
});

app.get("/usuario/:id/atualizar", async (req,res) => 
{
    const id = req.params.id;
    const usuario = await  Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", { usuario })
});


app.listen(8000, () => {
    console.log("Server rodando na porta 8000")
})


conn 
 .sync()
 .then(() => {
    console.log("Conectado! :)");
 })
 .catch((err) =>{
    console.log("Erro :(" + err)
 })