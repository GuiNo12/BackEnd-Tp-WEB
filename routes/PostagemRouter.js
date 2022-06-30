const express = require('express');
const mongoose = require('mongoose');
const verificaJWT = require('../middleware/verificaJWT');
const router = express.Router();

require('../models/Postagem');

const Postagem = mongoose.model("postagens");

router.get("/postagens", async (req, res) => {
    let response;

    await Postagem.find({}).then((postagens) => {
        response = postagens;
    }).catch((erro) => {
        response = erro;
    })

    res.json(response);
});

router.post("/postagens", verificaJWT, async (req, res) => {
    let response;
    let { username, mensagem } = req.body;

    let novaPostagem = {
        username: username,
        mensagem: mensagem
    }


    await new Postagem(novaPostagem).save().then(() => {
        response = "Postagem adicionada com sucesso!";

    }).catch((erro) => {

        response = { erro: erro.message };
    });

    res.json(response);
});

router.post("/postagens/insereComentario", verificaJWT, async (req, res) => {
    let response;
    let { username, mensagem, idPost } = req.body;

    let novoComentario = {
        username: username,
        mensagem: mensagem,
        data: new Date()
    }

    if (mensagem == null || mensagem == "") {
        response = { erro: "Comentário não pode ser vazio!" }
    } else {
        await Postagem.findOne({ _id: idPost }).then(async (postagem) => {
            postagem.comentarios.push(novoComentario);

            await postagem.save().then(() => {
                response = { "mensagem": "Comentario adicionado com sucesso!" };
            });
        }).catch((erro) => {
            response = { erro: erro.message };
        });
    }

    res.json(response);
});

router.post("/postagens/insereLike", verificaJWT, async (req, res) => {
    let response;
    let { username, idPost } = req.body;

    let novoLike = {
        username: username
    }

    await Postagem.findOne({ _id: idPost }).then(async (postagem) => {
        if (postagem.deslikes.find(deslike => deslike.username == username)) {
            postagem.deslikes.splice(postagem.deslikes.findIndex(deslike => deslike.username == username), 1);
        }

        if (postagem.likes.find(like => like.username == username)) {
            throw new Error("Ação já Realizada!");
        }
        else {
            postagem.likes.push(novoLike);
        }

        await postagem.save().then(() => {
            response = { "mensagem": "Like adicionado com sucesso!" };
        });
    }).catch((erro) => {
        response = { erro: erro.message };
    });

    res.json(response);
});

router.post("/postagens/insereDeslike", verificaJWT, async (req, res) => {
    let response;
    let { username, idPost } = req.body;

    let novoDeslike = {
        username: username
    }

    await Postagem.findOne({ _id: idPost }).then(async (postagem) => {
        if (postagem.likes.find(like => like.username == username)) {
            postagem.likes.splice(postagem.likes.findIndex(like => like.username == username), 1);
        }

        if (postagem.deslikes.find(deslike => deslike.username == username)) {
            throw new Error("Ação já Realizada!");
        }
        else {
            postagem.deslikes.push(novoDeslike);
        }

        await postagem.save().then(() => {
            response = { "mensagem": "Deslike adicionado com sucesso!" };
        });
    }).catch((erro) => {
        response = { erro: erro.message };
    });

    res.json(response);
});

module.exports = router;