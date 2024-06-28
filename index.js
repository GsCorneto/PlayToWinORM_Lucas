require("dotenv").config();
const { parse } = require("dotenv");
const conn = require("./db/conn");

const Usuario = require("./models/usuario");

const express = require("express");
const handlebars = require("express-handlebars");
const Cartao = require("./models/Cartao");


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

app.post("/usuario/:id/atualizar", async (req,res) => 
    {
        const id = req.params.id;
        const dadosUsuario ={
            nickname: req.body.nickname,
            nome: req.body.nome,
        }
       const registroAfetados = await 
       Usuario.update(dadosUsuario, {where: { id: id }})

       if(registroAfetados > 0){
        res.redirect("/usuarios");
       }else{
        res.send("Erro ao Atualizar!");
       }
    });

app.post("/usuarios/excluir", async(req,res) =>{
    const id = req.body.id;

    const registroAfetados = await 
    Usuario.destroy({where: { id: id }})

    if(registroAfetados > 0){
     res.redirect("/usuarios");
    }else{
     res.send("Erro ao Excluir!");
    }

});
//Rotas Cartões
app.get("/usuarios/:id/cartoes", async (req, res) =>{
    const id  = parseInt(req.params.id)
    const usuario = await Usuario.findByPk(id, {include: ["Cartao"]});

    let cartoes = usuario.Cartaos;
    cartoes = cartoes.map((cartao) => cartao.toJSON());

    res.render("cartoes", {
        usuario: usuario.toJSON(),
        cartoes,
    });
 }
)

app.get("/usuarios/:id/novoCartao", async (req,res) =>{
    const id = parseInt(req.params.body);
    const dadosCartao = {
        numero: req.body.numero,
        nome: req.body.nome,
        cvv: req.body.cvv,
        UsuarioId : id
    };
    Cartao.create(dadosCartao);
    res.redirect(`/usuarios/${id}/cartoes`)
})

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