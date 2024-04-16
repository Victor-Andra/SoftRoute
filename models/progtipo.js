const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgtipoSchema = mongoose.Schema({
    progtipo_nome: {type: String, unique: true, required: true},
    progtipo_descricao: {type: String },
    //Atributos de controle
    progtipo_usuidcad :{ type: ObjectId, required: false },
    progtipo_usuidedi :{ type: ObjectId, required: false },
    progtipo_datacad :{ type: String, required: false },
    progtipo_dataedi :{ type: String, required: false }
})

class Progtipo{
    constructor(
        progtipo_nome,
        progtipo_descricao,
        //Atributos de controle
        progtipo_usuidcad,
        progtipo_usuidedi,
        progtipo_datacad,
        progtipo_dataedi
        ){
        this.progtipo_nome = progtipo_nome,
        this.progtipo_descricao = progtipo_descricao,
         //Atributos de controle
        this.progtipo_usuidcad = progtipo_usuidcad,
        this.progtipo_usuidedi = progtipo_usuidedi,
        this.progtipo_datacad = progtipo_datacad,
        this.progtipo_dataedi = progtipo_dataedi 
    }
}


ProgtipoSchema.loadClass(Progtipo)
const ProgtipoModel = mongoose.model('tb_progtipo', ProgtipoSchema)
module.exports = {ProgtipoModel,ProgtipoSchema,
    progtipoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ProgtipoModel.findByIdAndUpdate(req.body.progtipoId, 
            {$set: {
                progtipo_nome: req.body.progtipoNome,
                progtipo_descricao: req.body.progtipoDescricao,
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
    progtipoAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("progtipomodel");
            const newProgtipo = new ProgtipoModel({
                progtipo_nome: req.body.progtipoNome,
                progtipo_descricao: req.body.progtipoDescricao,
                progtipo_usuidcad: req.body.progtipoUsuidedi ,
                progtipo_datacad: dataAtual
            });
            console.log("newProgtipo save");
            await newProgtipo.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};