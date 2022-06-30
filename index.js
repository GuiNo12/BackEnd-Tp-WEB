const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
require('dotenv/config');

//Routers
const usuarioRouter = require('./routes/UsuarioRouter');
const postagemRouter = require('./routes/PostagemRouter');
const loginRouter = require('./routes/LoginRouter');

//Variaveis globais
const PORT = process.env.PORT || 5000;
const mongoURL = process.env.MONGO_URL;

//Conexao mongoDB
mongoose.connect(mongoURL)
.then(() => {
    console.log("Conectado ao MongoDB");
}).catch((err) => {
    console.log("Erro ao se conectar!");
})

//Configuracoes rest
app.use(express.json());
app.use(cors());

//Routers
app.use(usuarioRouter);
app.use(postagemRouter);
app.use(loginRouter);

app.get("/",(req,res) => {
    res.send("Aplicação rodando !");
});

app.listen(PORT,() =>{
    console.log("Aplicação rodando na porta "+PORT)
})