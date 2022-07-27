const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const DebitcategsubSchema = mongoose.Schema({
    debitcategsub_nome: {
        type: String,
        unique: true,
        required: true
    },
    debitcategsub_descricao: {
        type: String,
        required: true
    },
    debitcategsub_datacad: {
        type: Date
    },
    debitcategsub_dataedi: {
        type: Date
    }
    
})

class Debitcategsub{
    constructor(
        debitcategsub_nome,
        debitcategsub_descricao,
        debitcategsub_datacad,
        debitcategsub_dataedi
        ){
        this.debitcategsub_nome = debitcategsub_nome,
        this.debitcategsub_descricao = debitcategsub_descricao,
        this.debitcategsub_datacad = debitcategsub_datacad,
        this.debitcategsub_dataedi = debitcategsub_dataedi
    }
}



DebitcategsubSchema.loadClass(Debitcategsub)
const DebitcategsubModel = mongoose.model('tb_debitcategsub', DebitcategsubSchema)
module.exports = {DebitcategsubModel,DebitcategsubSchema,
    debitcategsubEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await DebitcategsubModel.findByIdAndUpdate(req.body.debitcategsubId, 
            {$set: {
                debitcategsub_nome: req.body.debitcategsubNome,
                debitcategsub_descricao: req.body.debitcategsubDescricao,
                debitcategsub_dataedi: dataAtual
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





    debitcategsubAdicionar: async (req,res) => {
        let debitcategsubExiste =  await DebitcategsubModel.findOne({debitcategsub_nome: req.body.debitcategsubNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(debitcategsubExiste){//se tiver null cai no else
            return "O nome da debitcategsub já existe";
            //programar alert
        } else {
            console.log("debitcategsubmodel");
            const newDebitcategsub = new DebitcategsubModel({
                debitcategsub_nome: req.body.debitcategsubNome,
                debitcategsub_descricao: req.body.debitcategsubDescricao,
                debitcategsub_datacad: dataAtual
            });
            console.log("newDebitcategsub save");
            await newDebitcategsub.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};