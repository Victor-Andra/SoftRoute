const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const DebitcategSchema = mongoose.Schema({
    debitcateg_nome: {
        type: String,
        unique: true,
        required: true
    },
    debitcateg_descricao: {
        type: String,
        required: true
    },
    debitcateg_datacad: {
        type: Date
    },
    debitcateg_dataedi: {
        type: Date
    }
    
})

class Debitcateg{
    constructor(
        debitcateg_nome,
        debitcateg_descricao,
        debitcateg_datacad,
        debitcateg_dataedi
        ){
        this.debitcateg_nome = debitcateg_nome,
        this.debitcateg_descricao = debitcateg_descricao,
        this.debitcateg_datacad = debitcateg_datacad,
        this.debitcateg_dataedi = debitcateg_dataedi
    }
}



DebitcategSchema.loadClass(Debitcateg)
const DebitcategModel = mongoose.model('tb_debitcateg', DebitcategSchema)
module.exports = {DebitcategModel,DebitcategSchema,
    debitcategEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await DebitcategModel.findByIdAndUpdate(req.body.debitcategId, 
            {$set: {
                debitcateg_nome: req.body.debitcategNome,
                debitcateg_descricao: req.body.debitcategDescricao,
                debitcateg_dataedi: dataAtual
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





    debitcategAdicionar: async (req,res) => {
        let debitcategExiste =  await DebitcategModel.findOne({debitcateg_nome: req.body.debitcategNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(debitcategExiste){//se tiver null cai no else
            return "O nome da debitcateg já existe";
            //programar alert
        } else {
            console.log("debitcategmodel");
            const newDebitcateg = new DebitcategModel({
                debitcateg_nome: req.body.debitcategNome,
                debitcateg_descricao: req.body.debitcategDescricao,
                debitcateg_datacad: dataAtual
            });
            console.log("newDebitcateg save");
            await newDebitcateg.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};