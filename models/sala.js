const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SalaSchema = mongoose.Schema({
    sala_nome: {
        type: String,
        unique: true,
        required: true
    },
    sala_descricao: {
        type: String,
        required: true
    },
    sala_datacad: {
        type: Date
    },
    sala_dataedi: {
        type: Date
    }
})

class Sala{
    constructor(
        sala_nome,
        sala_descricao,
        sala_datacad,
        sala_dataedi
        ){
        this.sala_nome = sala_nome,
        this.sala_descricao = sala_descricao,
        this.sala_datacad = sala_datacad,
        this.sala_dataedi = sala_dataedi
    }
}

SalaSchema.loadClass(Sala)
const SalaModel = mongoose.model('tb_sala', SalaSchema)
module.exports = {SalaModel,SalaSchema,
    salaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await SalaModel.findByIdAndUpdate(req.body.salaId, 
            {$set: {
                sala_nome: req.body.salaNome,
                sala_descricao: req.body.salaDescricao,
                sala_dataedi: dataAtual
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
        let salaExiste =  await SalaModel.findOne({sala_nome: req.body.salaNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(salaExiste){//se tiver null cai no else
            return "O nome da sala já existe";
            //programar alert
        } else {
            console.log("salamodel");
            const newSala = new SalaModel({
                sala_nome: req.body.salaNome,
                sala_descricao: req.body.salaDescricao,
                sala_datacad: dataAtual
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