const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EspecializacaoSchema = mongoose.Schema({
    especializacao_nome: { type: String, unique: true, required: true },
    especializacao_ordem: {type: String },
    especializacao_descricao: {type: String },
    especializacao_vis: {type: String },
    especializacao_datacad: { type: Date },
    especializacao_dataedi: { type: Date }
    
})

class Especializacao{
    constructor(
        especializacao_nome,
        especializacao_ordem,
        especializacao_descricao,
        especializacao_vis,
        especializacao_datacad,
        especializacao_dataedi
        ){
        this.especializacao_nome = especializacao_nome,
        this.especializacao_ordem = especializacao_ordem,
        this.especializacao_descricao = especializacao_descricao,
        this.especializacao_vis = especializacao_vis,
        this.especializacao_datacad = especializacao_datacad,
        this.especializacao_dataedi = especializacao_dataedi
    }
}


EspecializacaoSchema.loadClass(Especializacao)
const EspecializacaoModel = mongoose.model('tb_especializacao', EspecializacaoSchema)
module.exports = {EspecializacaoModel,EspecializacaoSchema,
    especializacaoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EspecializacaoModel.findByIdAndUpdate(req.body.especializacaoId, 
            {$set: {
                especializacao_nome: req.body.especializacaoNome,
                especializacao_ordem: req.body.especializacaoOrdem,
                especializacao_descricao: req.body.especializacaoDescricao,
                especializacao_vis: req.body.especializacaoVis,
                especializacao_edi: dataAtual
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
    especializacaoAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("especializacaomodel");
            const newEspecializacao = new EspecializacaoModel({
                especializacao_nome: req.body.especializacaoNome,
                especializacao_ordem: req.body.especializacaoOrdem,
                especializacao_descricao: req.body.especializacaoDescricao,
                especializacao_vis: req.body.especializacaoVis,
                especializacao_datacad: dataAtual
            });
            console.log("newEspecializacao save");
            await newEspecializacao.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};