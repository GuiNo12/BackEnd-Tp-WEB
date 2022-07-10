const express = require('express');
const mongoose = require('mongoose');
const verificaJWT = require('../middleware/verificaJWT');
const sendMail = require('../email/envioEmail');

const router = express.Router();

require('../models/Usuario');

const Usuario = mongoose.model("usuarios");

//Rota para obter todos os usuários
router.get("/usuarios",verificaJWT,async (req,res) => {
    let response;
    
    await Usuario.find({}).then((usuarios) => {
        response = usuarios;
    }).catch((erro) => {
        response = erro;
    })

    res.json(response);
});

//Rota para cadastrar um novo usuário
router.post("/usuarios",async (req,res) => {
    let response;
    let {username,email,password,name} = req.body;
    const fotoDefault = "https://firebasestorage.googleapis.com/v0/b/goodnews-7d198.appspot.com/o/images%2Fdefault-user.webp?alt=media&token=acb604da-dac6-4cb9-adb2-7bb90acb9075";
    
    let novoUsuario = {
        username:username,
        email:email,
        password:password,
        fotoUsuario:fotoDefault,
        name:name
    }

    await new Usuario(novoUsuario).save().then(() => {
        response = "Usuario criado com sucesso!";
    }).catch((erro) => {
        if(erro.code === 11000){
            response = {erro:"Erro: o nome de usuário: " + username + " já está sendo utilizado!"};
        }else{
            response = {erro:erro};
        }
        
    });
    if(!response.erro){
        await sendMail(novoUsuario.name, novoUsuario.username, novoUsuario.email);
    }

    res.json(response);
});

module.exports = router;