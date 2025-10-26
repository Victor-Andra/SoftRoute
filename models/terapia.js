const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const TerapiaSchema = mongoose.Schema({
    terapia_nome: { type: String, unique: true, required: true },
    terapia_nomecid: { type: String, required: false },
    terapia_cid: { type: String, required: false },
    terapia_descricao: { type: String, required: false },
    terapia_status :  { type: String, required: false },
    //controle CRUD
    terapia_datacad: { type: Date, required: false },
    terapia_dataedi: { type: Date, required: false },
    terapia_usuidcad: {type: ObjectId, required: false },
    terapia_usuidedi: {type: ObjectId, required: false },
    terapia_lixo :{ type: String, required: false },
    terapia_datalixo: { type: Date, required: false },
    terapia_usuidlixo: { type: ObjectId, required: false }
    
})

class Terapia{
    constructor(
        terapia_nome,
        terapia_nomecid,
        terapia_cid,
        terapia_descricao,
        terapia_status,
        //Controle CRUD
        terapia_datacad,
        terapia_dataedi,
        terapia_usuidcad,
        terapia_usuidedi,
        terapia_lixo,
        terapia_datalixo,
        terapia_usuidlixo
        ){
        this.terapia_nome = terapia_nome,
        this.terapia_nomecid = terapia_nomecid,
        this.terapia_cid = terapia_cid,
        this.terapia_descricao = terapia_descricao,
        this.terapia_status = terapia_status,
        //Controle CRUD
        this.terapia_datacad = terapia_datacad,
        this.terapia_dataedi = terapia_dataedi,
        this.terapia_usuidcad = terapia_usuidcad,
        this.terapia_usuidedi = terapia_usuidedi,
        this.terapia_lixo = terapia_lixo,
        this.terapia_datalixo = terapia_datalixo,
        this.terapia_usuidlixo = terapia_usuidlixo
    }
}


TerapiaSchema.loadClass(Terapia)
var TerapiaModel = getModel("softroute", 'tb_terapia', TerapiaSchema)
module.exports = {
    TerapiaModel,
    TerapiaSchema,

    terapiaEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        TerapiaModel = getModel(db, 'tb_terapia', TerapiaSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];//recupera o ususário atual
        
        //Realiza Atualização
        await TerapiaModel.findByIdAndUpdate(req.body.terapiaId, 
            {$set: {
                terapia_nome: req.body.terapiaNome,
                terapia_nomecid: req.body.terapiaNomeCid,
                terapia_cid: req.body.terapiaCid,
                terapia_descricao: req.body.terapiaDescricao,
                terapia_status: req.body.terapiaStatus,
                terapia_dataedi: dataAtual,
                terapia_usuidedi: usuarioAtual

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
    terapiaAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        TerapiaModel = getModel(db, 'tb_terapia', TerapiaSchema)
        //;
        
        let terapiaExiste =  await TerapiaModel.findOne({terapia_nome: req.body.terapiaNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];//recupera o ususário atual
        if(terapiaExiste){//se tiver null cai no else
            return "O nome da terapia já existe";
        } else {
            console.log("terapiamodel");
            const newTerapia = new TerapiaModel({
                terapia_nome: req.body.terapiaNome,
                terapia_nomecid: req.body.terapiaNomeCid,
                terapia_cid: req.body.terapiaCid,
                terapia_descricao: req.body.terapiaDescricao,
                terapia_status: req.body.terapiaStatus,
                terapia_datacad: dataAtual,
                terapia_usuidcad: usuarioAtual,
                terapia_lixo: "false"
            });
            console.log("newTerapia save");
            await newTerapia.save().then(()=>{
                console.log("Cadastro Realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};