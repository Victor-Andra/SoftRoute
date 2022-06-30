const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EspecialidadeSchema = mongoose.Schema({
    especialidade_nome: {
        type: String,
        unique: true,
        required: true
    },
    especialidade_descricao: {
        type: String,

    },
    especialidade_datacad: {
        type: Date
    },
    especialidade_dataedi: {
        type: Date
    }
    
})

class Especialidade{
    constructor(
        especialidade_nome,
        especialidade_descricao,
        especialidade_datacad,
        especialidade_dataedi
        ){
        this.especialidade_nome = especialidade_nome,
        this.especialidade_descricao = especialidade_descricao,
        this.especialidade_datacad = especialidade_datacad,
        this.especialidade_dataedi = especialidade_dataedi
    }
}


EspecialidadeSchema.loadClass(Especialidade)
const EspecialidadeModel = mongoose.model('tb_especialidade', EspecialidadeSchema)
module.exports = {EspecialidadeModel,EspecialidadeSchema,
    especialidadeEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EspecialidadeModel.findByIdAndUpdate(req.body.especialidadeId, 
            {$set: {
                especialidade_nome: req.body.especialidadeNome,
                especialidade_descricao: req.body.especialidadeDescricao,
                especialidade_edi: dataAtual
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






    especialidadeAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("especialidademodel");
            const newEspecialidade = new EspecialidadeModel({
                especialidade_nome: req.body.especialidadeNome,
                especialidade_descricao: req.body.especialidadeDescricao,
                especialidade_datacad: dataAtual
            });
            console.log("newEspecialidade save");
            await newEspecialidade.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};