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
    debitsubcateg_codigoreduzidocredit: {
        type: String,
        required: true
    },
    debitsubcateg_codigoreduzidodebit: {
        type: String,
        required: true
    },
    debitsubcateg_planoconta: {
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
        debitsubcateg_codigoreduzidocredit,
        debitsubcateg_codigoreduzidodebit,
        debitsubcateg_planoconta,
        debitsubcateg_datacad,
        debitsubcateg_dataedi
        ){
        this.debitsubcateg_nome = debitsubcateg_nome,
        this.debitsubcateg_descricao = debitsubcateg_descricao,
        this.debitsubcateg_debitcategid = debitsubcateg_debitcategid,
        this.debitsubcateg_codigoreduzidocredit = debitsubcateg_codigoreduzidocredit,
        this.debitsubcateg_codigoreduzidodebit = debitsubcateg_codigoreduzidodebit,
        this.debitsubcateg_planoconta = debitsubcateg_planoconta,
        this.debitsubcateg_datacad = debitsubcateg_datacad,
        this.debitsubcateg_dataedi = debitsubcateg_dataedi
    }
}

let DebitsubcategModel
DebitsubcategSchema.loadClass(Debitsubcateg)
try {
    DebitcategModel = mongoose.model('tb_debitsubcateg')
} catch (error) {
    DebitcategModel = mongoose.model('tb_debitsubcateg', DebitsubcategSchema)
}
//const DebitsubcategModel = mongoose.model('tb_debitsubcateg', DebitsubcategSchema)
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
                debitsubcateg_codigoreduzidocredit : req.body.subcategoriaCodigoReduzidoC,
                debitsubcateg_codigoreduzidodebit : req.body.subcategoriaCodigoReduzidoD,
                debitsubcateg_planoconta : req.body.subcategoriaPlanoconta,
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
            debitsubcateg_codigoreduzidocredit : req.body.subcategoriaCodigoReduzidoC,
            debitsubcateg_codigoreduzidodebit : req.body.subcategoriaCodigoReduzidoD,
            debitsubcateg_planoconta : req.body.subcategoriaPlanoconta,
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