const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const SalaSchema = mongoose.Schema({
    sala_nome: { type: String, unique: true, required: true },
    sala_descricao: { type: String, required: true},
    sala_status: { type: String, required: false },
    //controle CRUD
    sala_datacad: { type: Date, required: false  },
    sala_dataedi: { type: Date, required: false  },
    sala_usuidcad: { type: ObjectId, required: false },
    sala_usuidedi: { type: ObjectId, required: false },
    sala_lixo :{ type: String, required: false },
    sala_datalixo: { type: String, required: false },
    sala_usuidlixo: { type: ObjectId, required: false }
    
})

class Sala{
    constructor(
        sala_nome,
        sala_descricao,
        sala_status,
        //controle CRUD
        sala_datacad,
        sala_dataedi,
        sala_usuidcad,
        sala_usuidedi,
        sala_lixo,
        sala_datalixo,
        sala_usuidlixo
        ){
        this.sala_nome = sala_nome,
        this.sala_descricao = sala_descricao,
        this.sala_status = sala_status,
        //controle CRUD
        this.sala_datacad = sala_datacad,
        this.sala_dataedi = sala_dataedi,
        this.sala_usuidcad = sala_usuidcad,
        this.sala_usuidedi = sala_usuidedi,
        this.sala_lixo = sala_lixo,
        this.sala_datalixo = sala_datalixo,
        this.sala_usuidlixo = sala_usuidlixo
    }
}

SalaSchema.loadClass(Sala)
var SalaModel = getModel("softroute", 'tb_sala', SalaSchema)
module.exports = {
    SalaModel,
    SalaSchema,

    salaEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        SalaModel = getModel(db, 'tb_sala', SalaSchema)
        //;

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await SalaModel.findByIdAndUpdate(req.body.salaId, 
            {$set: {
                sala_nome: req.body.salaNome,
                sala_descricao: req.body.salaDescricao,
                sala_status: req.body.salaStatus,
                sala_usuidedi : usuarioAtual, 
                sala_dataedi: dataAtual,
                sala_lixo : "false"
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },


    salaAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        SalaModel = getModel(db, 'tb_sala', SalaSchema)
        //;
        
        let salaExiste =  await SalaModel.findOne({sala_nome: req.body.salaNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        if(salaExiste){//se tiver null cai no else
            return "O nome da sala já existe";
            //programar alert
        } else {
            console.log("salamodel");
            const newSala = new SalaModel({
                sala_nome: req.body.salaNome,
                sala_descricao: req.body.salaDescricao,
                sala_status: "Ativo",
                sala_datacad: dataAtual,
                sala_usuidcad : usuarioAtual, 
            });
            console.log("newSala save");
            await newSala.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};