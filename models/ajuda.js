const { data } = require('jquery')
const mongoose = require('mongoose')
const usuario = require('./usuario')
const ObjectId = mongoose.Types.ObjectId

const AjudaSchema = mongoose.Schema({
    //Registro de operadores
    ajuda_datacad :{type: Date, required: false},
    ajuda_dataedi :{type: Date, required: false},
    ajuda_usuidcad :{type: String, required: false},
    ajuda_usuidedi :{type: String, required: false},
    //Ajuda
    ajuda_usuid:{type: ObjectId, required: true},
    ajuda_pergunta :{type: String, required: false},
    ajuda_resposta :{type: String, required: false},
    ajuda_categoria:{type: String, required: false}
   
})

class Ajuda{
    constructor(
    //Registro de operadores
    ajuda_datacad,
    ajuda_dataedi,
    ajuda_usuidcad,
    ajuda_usuidedi,
    //Ajuda
    ajuda_usuid,
    ajuda_pergunta,
    ajuda_resposta,
    ajuda_categoria
    ){
    //Registro de operadores
    this.ajuda_datacad = ajuda_datacad,
    this.ajuda_dataedi = ajuda_dataedi,
    this.ajuda_usuidcad = ajuda_usuidcad,
    this.ajuda_usuidedi = ajuda_usuidedi,
    //Ajuda
    this.ajuda_usuid = ajuda_usuid,
    this.ajuda_pergunta = ajuda_pergunta,
    this.ajuda_resposta = ajuda_resposta,
    this.ajuda_categoria = ajuda_categoria
    }
}

AjudaSchema.loadClass(Ajuda)
const AjudaModel = mongoose.model('tb_ajuda', AjudaSchema)
module.exports = {AjudaModel,AjudaSchema,
    ajudaEditar: async (req, res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AjudaModel.findByIdAndUpdate(req.body.ajudaId, 
            {$set: {
                //Registro de operadores
                ajuda_dataedi : dataAtual,
                ajuda_usuidedi: usuarioAtual,
                //Ajuda
                ajuda_usuid: req.body.ajudaUsuid,
                ajuda_pergunta: req.body.ajudaPergunta,
                ajuda_resposta : req.body.ajudaResposta,
                ajuda_categoria: req.body.ajudaCategoria
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    ajudaAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        //let 
        console.log("ajudamodel");
        console.log("req.body.ajudaDataativ:")
        
        const newAjuda = new AjudaModel({
            //Registro de operadores
            ajuda_datacad: dataAtual,
            //ajuda_usuidcad: req.cookies['idUsu'],
            ajuda_usuidcad: usuarioAtual,

            //Ajuda
            ajuda_usuid: req.body.ajudaUsuid,
            ajuda_pergunta: req.body.ajudaPergunta,
            ajuda_resposta : req.body.ajudaResposta,
            ajuda_categoria: req.body.ajudaCategoria
            
        });
        console.log("newAjuda save");
        await newAjuda.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};