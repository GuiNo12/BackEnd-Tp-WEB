const express = require('express');
const mongoose = require('mongoose');
const verificaJWT = require('../middleware/verificaJWT');

const router = express.Router();

require('../models/Usuario');

const Usuario = mongoose.model("usuarios");

router.get("/usuarios",verificaJWT,async (req,res) => {
    let response;
    
    await Usuario.find({}).then((usuarios) => {
        response = usuarios;
    }).catch((erro) => {
        response = erro;
    })

    res.json(response);
});

router.post("/usuarios",async (req,res) => {
    let response;
    let {username,password,name} = req.body;
    
    let novoUsuario = {
        username:username,
        password:password,
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

    res.json(response);
});

module.exports = router;