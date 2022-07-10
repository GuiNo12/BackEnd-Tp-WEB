const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const Usuario = mongoose.model("usuarios");

router.post("/login",async (req,res) => {
    const {username,password} = req.body;

    let retorno = null;

    let usuario = await Usuario.findOne({username:username});

    if(usuario){
        if(usuario.password === password){
            let name = usuario.name;
            let username = usuario.username;
            let foto = usuario.fotoUsuario
            let token = jwt.sign({username},process.env.SECRET,{});

            retorno = {
                "auth":true,
                "name":name,
                "username":username,
                "fotoUsuario":foto,
                "token":token
            };
        }else{
            retorno = {erro:"Senha incorreta!"};
        }
    }else{
        retorno = {erro:"Usuário incorreto!"};
    }

    res.send(retorno);
});

module.exports = router;