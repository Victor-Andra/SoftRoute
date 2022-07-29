const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const DebitsubcategSchema = mongoose.Schema({
    debitsubcateg_nome: {
        type: String,
        unique: true,
        required: true
    },
    debitsubcateg_descricao: {
        type: String,
        required: true
    },
    debitsubcateg_debitcategid: {
        type: ObjectId,
        required: true
    },
    debitsubcateg_datacad: {
        type: Date
    },
    debitsubcateg_dataedi: {
        type: Date
    }
    
})

class Debitsubcateg{
    constructor(
        debitsubcateg_nome,
        debitsubcateg_descricao,
        debitsubcateg_debitcategid,
        debitsubcateg_datacad,
        debitsubcateg_dataedi
        ){
        this.debitsubcateg_nome = debitsubcateg_nome,
        this.debitsubcateg_descricao = debitsubcateg_descricao,
        this.debitsubcateg_debitcategid = debitsubcateg_debitcategid,
        this.debitsubcateg_datacad = debitsubcateg_datacad,
        this.debitsubcateg_dataedi = debitsubcateg_dataedi
    }
}


DebitsubcategSchema.loadClass(Debitsubcateg)
const DebitsubcategModel = mongoose.model('tb_debitsubcateg', DebitsubcategSchema)
module.exports = {DebitsubcategModel,DebitsubcategSchema,
    debitsubcategEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await DebitsubcategModel.findByIdAndUpdate(req.body.subcategoriaId, 
            {$set: {
                debitsubcateg_nome: req.body.subcategoriaNome,
                debitsubcateg_descricao: req.body.subcategoriaDescricao,
                debitsubcateg_debitcategid: ObjectId(req.body.subcategoria_categoriaid),
                debitsubcateg_edi: dataAtual
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
    debitsubcategAdicionar: async (req,res) => {
         let dataAtual = new Date();
        console.log("debitsubcategmodel");
        const newDebitsubcateg = new DebitsubcategModel({
            debitsubcateg_nome: req.body.subcategoriaNome,
            debitsubcateg_descricao: req.body.subcategoriaDescricao,
            debitsubcateg_debitcategid: req.body.subcategoria_categoriaid,
            debitsubcateg_datacad: dataAtual
        });
        console.log("newDebitsubcateg save");
        await newDebitsubcateg.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};