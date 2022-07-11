const mongoose = require("mongoose");
require('./Usuario');
const Usuario = mongoose.model("usuarios");

async function adicionaFotoUsuario(postagens){
    let usuarios = await Usuario.find();
    let dicionarioFotoUsuarios = {};

    //Cria um dicionario contendo o nome de usuário e a foto desse usuário.
    for(let usuario of usuarios)
        dicionarioFotoUsuarios[usuario.username] = usuario.fotoUsuario;
    
    for(let i = 0; i < postagens.length; i++){
        postagens[i] = postagens[i].toObject();
        //Adiciona na postagem a foto do usuário
        postagens[i].fotoUsuario = dicionarioFotoUsuarios[postagens[i].username];

        //Adiciona em todos os comentarios a foto do respectivo usuário.
        for(let j = 0; j < postagens[i].comentarios.length; j++){
            postagens[i].comentarios[j].fotoUsuario = dicionarioFotoUsuarios[postagens[i].comentarios[j].username];
        }  
    }
    
    return postagens;
}

module.exports = adicionaFotoUsuario;