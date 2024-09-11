const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EspecialidadePlanoSchema = mongoose.Schema({
    especialidadePlano_nome: { type: String, unique: true, required: true },
    especialidadePlano_descricao: { type: String },
    especialidadePlano_vis: { type: String },//Ordem de visualização, quando não se quer por em ordem alfabética mas por prioridades ou outra lógica
    especialidadePlano_datacad: { type: Date },
    especialidadePlano_dataedi: { type: Date }
    
})

class EspecialidadePlano{
    constructor(
        especialidadePlano_nome,
        especialidadePlano_descricao,
        especialidadePlano_vis,
        especialidadePlano_datacad,
        especialidadePlano_dataedi
        ){
        this.especialidadePlano_nome = especialidadePlano_nome,
        this.especialidadePlano_descricao = especialidadePlano_descricao,
        this.especialidadePlano_vis = especialidadePlano_vis,
        this.especialidadePlano_datacad = especialidadePlano_datacad,
        this.especialidadePlano_dataedi = especialidadePlano_dataedi
    }
}


EspecialidadePlanoSchema.loadClass(EspecialidadePlano)
const EspecialidadePlanoModel = mongoose.model('tb_especialidadePlano', EspecialidadePlanoSchema)
module.exports = {EspecialidadePlanoModel,EspecialidadePlanoSchema,
    especialidadePlanoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EspecialidadePlanoModel.findByIdAndUpdate(req.body.especialidadePlanoId, 
            {$set: {
                especialidadePlano_nome: req.body.especialidadePlanoNome,
                especialidadePlano_descricao: req.body.especialidadePlanoDescricao,
                especialidadePlano_vis: req.body.especialidadePlanoVis,
                especialidadePlano_edi: dataAtual
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






    especialidadePlanoAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("especialidadePlanomodel");
            const newEspecialidadePlano = new EspecialidadePlanoModel({
                especialidadePlano_nome: req.body.especialidadePlanoNome,
                especialidadePlano_descricao: req.body.especialidadePlanoDescricao,
                especialidadePlano_vis: req.body.especialidadePlanoVis,
                especialidadePlano_datacad: dataAtual
            });
            console.log("newEspecialidadePlano save");
            await newEspecialidadePlano.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};