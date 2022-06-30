const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const TerapiaSchema = mongoose.Schema({
    terapia_nome: { type: String, unique: true, required: true },
    terapia_nomecid: { type: String, required: false },
    terapia_cid: { type: String, required: false },
    terapia_descricao: { type: String, required: false },
    terapia_datacad: { type: Date },
    terapia_dataedi: { type: Date }
    
})

class Terapia{
    constructor(terapia_nome, terapia_descricao, terapia_datacad, terapia_dataedi){
        this.terapia_nome = terapia_nome,
        this.terapia_descricao = terapia_nomecid,
        this.terapia_descricao = terapia_cid,
        this.terapia_descricao = terapia_descricao,
        this.terapia_datacad = terapia_datacad,
        this.terapia_dataedi = terapia_dataedi
    }
}


TerapiaSchema.loadClass(Terapia)
const TerapiaModel = mongoose.model('tb_terapia', TerapiaSchema)
module.exports = {TerapiaModel,TerapiaSchema,
    terapiaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await TerapiaModel.findByIdAndUpdate(req.body.terapiaId, 
            {$set: {
                terapia_nome: req.body.terapiaNome,
                terapia_nomecid: req.body.terapiaNomeCid,
                terapia_cid: req.body.terapiaCid,
                terapia_descricao: req.body.terapiaDescricao,
                terapia_dataedi: dataAtual
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

        let terapiaExiste =  await TerapiaModel.findOne({terapia_nome: req.body.terapiaNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(terapiaExiste){//se tiver null cai no else
            return "O nome da terapia já existe";
        } else {
            console.log("terapiamodel");
            const newTerapia = new TerapiaModel({
                terapia_nome: req.body.terapiaNome,
                terapia_nomecid: req.body.terapiaNomeCid,
                terapia_cid: req.body.terapiaCid,
                terapia_descricao: req.body.terapiaDescricao,
                terapia_datacad: dataAtual
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