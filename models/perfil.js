const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const PerfilSchema = mongoose.Schema({
    perfil_nome: {
        type: String,
        unique: true,
        required: true
    },
    perfil_descricao: {
        type: String,
        required: true
    },
    perfil_datacad: {
        type: Date
    },
    perfil_dataedi: {
        type: Date
    }
    
})

class Perfil{
    constructor(perfil_nome,perfil_descricao,perfil_datacad,perfil_dataedi){
        this.perfil_nome = perfil_nome,
        this.perfil_descricao = perfil_descricao,
        this.perfil_datacad = perfil_datacad,
        this.perfil_dataedi = perfil_dataedi
    }
}



PerfilSchema.loadClass(Perfil)
const PerfilModel = mongoose.model('tb_perfil', PerfilSchema)
module.exports = {PerfilModel,PerfilSchema,
    perfilEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await PerfilModel.findByIdAndUpdate(req.body.perfilId, 
            {$set: {
                perfil_nome: req.body.perfilNome,
                perfil_descricao: req.body.perfilDescricao,
                perfil_dataedi: dataAtual
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






    perfilAdicionar: async (req,res) => {
        let perfilExiste =  await PerfilModel.findOne({perfil_nome: req.body.perfilNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(perfilExiste){//se tiver null cai no else
            return "O nome da perfil já existe";
        } else {
            console.log("perfilmodel");
            const newPerfil = new PerfilModel({
                perfil_nome: req.body.perfilNome,
                perfil_descricao: req.body.perfilDescricao,
                perfil_datacad: dataAtual
            });
            console.log("newPerfil save");
            await newPerfil.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};