const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const MetoutSchema = mongoose.Schema({
    metout_nome: {type: String, unique: true, required: true},
    metout_descricao: {type: String },
    metout_vis: {type: String },
    metout_datacad: {type: Date},
    metout_dataedi: {type: Date}
})

class Metout{
    constructor(
        metout_nome,
        metout_descricao,
        metout_vis,
        metout_datacad,
        metout_dataedi
        ){
        this.metout_nome = metout_nome,
        this.metout_descricao = metout_descricao,
        this.metout_vis = metout_vis,
        this.metout_datacad = metout_datacad,
        this.metout_dataedi = metout_dataedi
    }
}


MetoutSchema.loadClass(Metout)
const MetoutModel = mongoose.model('tb_metout', MetoutSchema)
module.exports = {MetoutModel,MetoutSchema,
    metoutEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await MetoutModel.findByIdAndUpdate(req.body.metoutId, 
            {$set: {
                metout_nome: req.body.metoutNome,
                metout_descricao: req.body.metoutDescricao,
                metout_vis: req.body.metoutvis,
                metout_edi: dataAtual
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
    metoutAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("metoutmodel");
            const newMetout = new MetoutModel({
                metout_nome: req.body.metoutNome,
                metout_descricao: req.body.metoutDescricao,
                metout_vis: req.body.metoutvis,
                metout_datacad: dataAtual
            });
            console.log("newMetout save");
            await newMetout.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};