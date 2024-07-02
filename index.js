require("dotenv").config();
const conn = require("./db/conn");

const express = require("express");

const handlebars = require("express-handlebars");

const Cartao = require("./models/Cartao");
const Usuario = require("./models/Usuario");
const Jogo = require("./models/Jogo");
const Conquista = require("./models/Conquista");

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

app.get("/usuarios/:id/atualizar", async (req,res) => 
{
    const id = req.params.id;
    const usuario = await  Usuario.findByPk(id, {raw: true});
    res.render("formUsuario", { usuario })
});

app.post("/usuarios/:id/atualizar", async (req,res) => 
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
});


//Rotas Jogos
app.get("/jogos", async (req,res) =>{
    const jogos =  await Jogo.findAll({raw: true})
    res.render(`jogos`, { jogos });
    //res.send("gahjvcghskdd")
});

app.get("/jogos/novo", (req,res) =>{
    res.render(`formJogos`);
});

app.post("/jogos/novo",  async (req,res) =>{
    const titulo = req.body.titulo; 
    const descricao = req.body.descricao;
    const preco = req.body.preco;
 
    const dadosJogo = {
     titulo,
     descricao,
     preco,
    };
 
    const jogo = await Jogo.create(dadosJogo);
 
    res.send("Jogo inserido sob o id " + jogo.id)
 });
 
 app.get("/jogos/:id/atualizar", async (req,res) => 
 {
     const id = req.params.id;
     const jogo = await  Jogo.findByPk(id, {raw: true});
     res.render("formJogos", { jogo })
 });
 
 app.post("/jogos/:id/atualizar", async (req,res) => 
     {
         const id = req.params.id;
         const dadosJogo ={
             titulo: req.body.titulo,
             descricao: req.body.descricao,
             preco: req.body.preco,
         }
        const registroAfetados = await 
        Jogo.update(dadosJogo, {where: { id: id }})
 
        if(registroAfetados > 0){
         res.redirect("/jogos");
        }else{
         res.send("Erro ao Atualizar!");
        }
     });
 
 app.post("/jogos/excluir", async(req,res) =>{
     const id = req.body.id;
 
     const registroAfetados = await 
     Jogo.destroy({where: { id: id }})
 
     if(registroAfetados > 0){
      res.redirect("/jogos");
     }else{
      res.send("Erro ao Excluir!");
     }
 });


//Rotas Conquistas
app.get("/jogos/:id/trophys", async (req,res) =>{
    const id = req.params.id
    const jogo =  await Jogo.findByPk(id, {include: ["Conquista"]})
    let conquistas = jogo.Conquista;
    conquistas = conquistas.map((conquista) => conquista.toJSON())

    res.render(`trophys`, { jogo: jogo.toJSON(), conquistas});
});

app.get("/jogos/:id/trophysNovo", async (req,res) =>{
    const id = parseInt(req.params.id)
    const jogo =  await Jogo.findByPk(id, {raw: true})
    res.render(`formTrophy`, {jogo});
});

app.post("/jogos/:id/trophysNovo",  async (req,res) =>{
    const titulo = req.body.titulo; 
    const descricao = req.body.descricao;
 
    const dadosConquista = {
     JogoId: parseInt(req.params.id),
     titulo,
     descricao,
    };
 
    const conquistas = await Conquista.create(dadosConquista);
 
    res.send("Conquista inserida sob o id " + conquistas.id)
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