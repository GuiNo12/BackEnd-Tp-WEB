const express = require('express');
const mongoose = require('mongoose');
const verificaJWT = require('../middleware/verificaJWT');
const adicionaFotoUsuario = require('../models/adicionaFotoUsuario');
const router = express.Router();

require('../models/Postagem');

const Postagem = mongoose.model("postagens");

router.get("/postagens", async (req, res) => {
    let postagens = await Postagem.find({});

    postagens = await adicionaFotoUsuario(postagens);

    res.json(postagens);
});

router.get("/postagens/minhasPostagens", verificaJWT, async (req, res) => {
    let { username } = req.body;

    let postagens = await Postagem.find({ "username": username });

    postagens = await adicionaFotoUsuario(postagens);

    res.json(postagens);
});

router.get("/postagens/meusComentarios", verificaJWT, async (req, res) => {
    let { username } = req.body;

    let postagens = await Postagem.find({ "comentarios.username": username });

    postagens = await adicionaFotoUsuario(postagens);

    res.json(postagens);
});

//Rota para deletar uma postagem
router.delete("/postagens/:id", verificaJWT, async (req, res) => {
    let response;

    await Postagem.findOne({ _id: req.params.id }).then(async postagem => {
        if (postagem == null) {
            throw new Error("Postagem não encontrada!");
        }
        if (postagem.username = req.body.username) {
            response = await postagem.deleteOne();
        }
    }).catch((erro) => {

        response = { erro: erro.message };
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
    let response, mensagem;
    let { username, idPost } = req.body;

    let novoLike = {
        username: username
    }

    await Postagem.findOne({ _id: idPost }).then(async (postagem) => {

        if (postagem.dislikes.find(dislike => dislike.username === username)) {
            postagem.dislikes.splice(postagem.dislikes.findIndex(dislike => dislike.username === username), 1);
        }

        let like = postagem.likes.find(like => like.username == username);

        if (like) {
            postagem.likes.splice(like, 1);
            mensagem = "Like removido com sucesso!";
        } else {
            postagem.likes.push(novoLike);
            mensagem = "Like adicionado com sucesso!";
        }

        await postagem.save().then(() => {
            response = { "mensagem": mensagem };
        });
    }).catch((erro) => {
        response = { erro: erro.message };
    });

    res.json(response);
});

router.post("/postagens/insereDislike", verificaJWT, async (req, res) => {
    let response;
    let { username, idPost } = req.body;

    let novoDislike = {
        username: username
    }

    await Postagem.findOne({ _id: idPost }).then(async (postagem) => {
        if (postagem.likes.find(like => like.username == username)) {
            postagem.likes.splice(postagem.likes.findIndex(like => like.username == username), 1);
        }

        let dislike = postagem.dislikes.find(dislike => dislike.username == username);

        if (dislike) {
            postagem.dislikes.splice(dislike, 1);
            mensagem = "Dislike removido com sucesso!";
        }
        else {
            postagem.dislikes.push(novoDislike);
            mensagem = "Dislike adicionado com sucesso!";
        }

        await postagem.save().then(() => {
            response = { "mensagem": mensagem };
        });
    }).catch((erro) => {
        response = { erro: erro.message };
    });

    res.json(response);
});

module.exports = router;