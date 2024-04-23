const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const PrognivelSchema = mongoose.Schema({
    prognivel_nome: {type: String, unique: true, required: true},
    prognivel_ordem: {type: String, required: false },
    prognivel_descricao: {type: String, required: false },
    //Atributos de controle
    prognivel_usuidcad :{ type: ObjectId, required: false },
    prognivel_usuidedi :{ type: ObjectId, required: false },
    prognivel_datacad :{ type: String, required: false },
    prognivel_dataedi :{ type: String, required: false }
})

class Prognivel{
    constructor(
        prognivel_nome,
        prognivel_ordem,
        prognivel_descricao,
        //Atributos de controle
        prognivel_usuidcad,
        prognivel_usuidedi,
        prognivel_datacad,
        prognivel_dataedi
        ){
        this.prognivel_nome = prognivel_nome,
        this.prognivel_ordem = prognivel_ordem,
        this.prognivel_descricao = prognivel_descricao,
         //Atributos de controle
        this.prognivel_usuidcad = prognivel_usuidcad,
        this.prognivel_usuidedi = prognivel_usuidedi,
        this.prognivel_datacad = prognivel_datacad,
        this.prognivel_dataedi = prognivel_dataedi 
    }
}


PrognivelSchema.loadClass(Prognivel)
const PrognivelModel = mongoose.model('tb_prognivel', PrognivelSchema)
module.exports = {PrognivelModel,PrognivelSchema,
    prognivelEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await PrognivelModel.findByIdAndUpdate(req.body.prognivelId, 
            {$set: {
                prognivel_nome: req.body.prognivelNome,
                prognivel_ordem: req.body.prognivelOrdem,
                prognivel_descricao: req.body.prognivelDescricao,
                prog_usuidedi : req.body.progUsuidedi,
                prog_dataedi : dataAtual
                
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
    prognivelAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("prognivelmodel");
            const newPrognivel = new PrognivelModel({
                prognivel_nome: req.body.prognivelNome,
                prognivel_ordem: req.body.prognivelOrdem,
                prognivel_descricao: req.body.prognivelDescricao,
                prognivel_usuidcad: req.body.prognivelUsuidedi ,
                prognivel_datacad: dataAtual
            });
            console.log("newPrognivel save");
            await newPrognivel.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};