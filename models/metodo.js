const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const MetodoSchema = mongoose.Schema({
    metodo_nome: {type: String, unique: true, required: true},
    metodo_ordem: {type: String },
    metodo_descricao: {type: String },
    metodo_vis: {type: String },
    metodo_datacad: {type: Date},
    metodo_dataedi: {type: Date}
})

class Metodo{
    constructor(
        metodo_nome,
        metodo_ordem,
        metodo_descricao,
        metodo_vis,
        metodo_datacad,
        metodo_dataedi
        ){
        this.metodo_nome = metodo_nome,
        this.metodo_ordem = metodo_ordem,
        this.metodo_descricao = metodo_descricao,
        this.metodo_vis = metodo_vis,
        this.metodo_datacad = metodo_datacad,
        this.metodo_dataedi = metodo_dataedi
    }
}


MetodoSchema.loadClass(Metodo)
const MetodoModel = mongoose.model('tb_metodo', MetodoSchema)
module.exports = {MetodoModel,MetodoSchema,
    metodoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await MetodoModel.findByIdAndUpdate(req.body.metodoId, 
            {$set: {
                metodo_nome: req.body.metodoNome,
                metodo_ordem: req.body.metodoOrdem,
                metodo_descricao: req.body.metodoDescricao,
                metodo_vis: req.body.metodovis,
                metodo_edi: dataAtual
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
    metodoAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("metodomodel");
            const newMetodo = new MetodoModel({
                metodo_nome: req.body.metodoNome,
                metodo_ordem: req.body.metodoOrdem,
                metodo_descricao: req.body.metodoDescricao,
                metodo_vis: req.body.metodovis,
                metodo_datacad: dataAtual
            });
            console.log("newMetodo save");
            await newMetodo.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};