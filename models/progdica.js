const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgdicaSchema = mongoose.Schema({
    progdica_nome: {type: String, unique: true, required: true},
    progdica_descricao: {type: String },
    //Atributos de controle
    progdica_usuidcad :{ type: ObjectId, required: false },
    progdica_usuidedi :{ type: ObjectId, required: false },
    progdica_datacad :{ type: String, required: false },
    progdica_dataedi :{ type: String, required: false }
})

class Progdica{
    constructor(
        progdica_nome,
        progdica_descricao,
        //Atributos de controle
        progdica_usuidcad,
        progdica_usuidedi,
        progdica_datacad,
        progdica_dataedi
        ){
        this.progdica_nome = progdica_nome,
        this.progdica_descricao = progdica_descricao,
         //Atributos de controle
        this.progdica_usuidcad = progdica_usuidcad,
        this.progdica_usuidedi = progdica_usuidedi,
        this.progdica_datacad = progdica_datacad,
        this.progdica_dataedi = progdica_dataedi 
    }
}


ProgdicaSchema.loadClass(Progdica)
const ProgdicaModel = mongoose.model('tb_progdica', ProgdicaSchema)
module.exports = {ProgdicaModel,ProgdicaSchema,
    progdicaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ProgdicaModel.findByIdAndUpdate(req.body.progdicaId, 
            {$set: {
                progdica_nome: req.body.progdicaNome,
                progdica_descricao: req.body.progdicaDescricao,
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
    progdicaAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("progdicamodel");
            const newProgdica = new ProgdicaModel({
                progdica_nome: req.body.progdicaNome,
                progdica_descricao: req.body.progdicaDescricao,
                progdica_usuidcad: req.body.progdicaUsuidedi ,
                progdica_datacad: dataAtual
            });
            console.log("newProgdica save");
            await newProgdica.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};