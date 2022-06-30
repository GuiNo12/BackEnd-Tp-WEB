const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostagemSchema = new Schema({
    mensagem:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:false,
        default:Date.now()
    },
    comentarios:{
        type:[Object],
        required:false,
        default:[]
    }
});

mongoose.model("postagens",PostagemSchema);