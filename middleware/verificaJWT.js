const express = require('express');
const jwt = require('jsonwebtoken');

module.exports = function verificaJWT(request,response,next){
    let token = request.headers['bearer'];

    if(!token){
        return response.status(401).send({
            auth:false,
            erro:"Não existe token no cabeçalho da requisição!"
        });
    }

    jwt.verify(token,process.env.SECRET,function(erro,decoded){
        if(erro){
            return response.status(500).send({
                auth:"false",
                erro:"Falha ao autenticar o token!"
            });
        }

        request.body.username = decoded.username;
        next();
    });
}