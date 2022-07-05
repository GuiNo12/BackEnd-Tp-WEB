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

//Rota para deletar uma postagem
router.delete("/postagens/:id", verificaJWT, async (req, res) => {
    let response;

    await Postagem.findOne({_id:req.params.id}).then(async postagem => {
        if(postagem == null){
            throw new Error("Postagem não encontrada!");
        }
        if(postagem.username = req.body.username){
            response = await postagem.deleteOne();
        }
    }
    ).catch((erro) => {
        console.log(erro);
        response = {erro: erro.message};
    }
    )

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
        if (postagem.dislikes.find(dislike => dislike.username === username)) {
            postagem.dislikes.splice(postagem.dislikes.findIndex(dislike => dislike.username === username), 1);
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

        if (postagem.dislikes.find(dislike => dislike.username == username)) {
            throw new Error("Ação já Realizada!");
        }
        else {
            postagem.dislikes.push(novoDislike);
        }

        await postagem.save().then(() => {
            response = { "mensagem": "Dislike adicionado com sucesso!" };
        });
    }).catch((erro) => {
        response = { erro: erro.message };
    });

    res.json(response);
});

module.exports = router;