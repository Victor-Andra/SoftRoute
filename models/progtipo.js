const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgtipoSchema = mongoose.Schema({
    progtipo_nome: {type: String, unique: true, required: true},
    progtipo_ordem: {type: String, required: false },
    progtipo_descricao: {type: String, required: false },
    //Atributos de controle
    progtipo_usuidcad :{ type: ObjectId, required: false },
    progtipo_usuidedi :{ type: ObjectId, required: false },
    progtipo_datacad :{ type: String, required: false },
    progtipo_dataedi :{ type: String, required: false }
})

class Progtipo{
    constructor(
        progtipo_nome,
        progtipo_ordem,
        progtipo_descricao,
        //Atributos de controle
        progtipo_usuidcad,
        progtipo_usuidedi,
        progtipo_datacad,
        progtipo_dataedi
        ){
        this.progtipo_nome = progtipo_nome,
        this.progtipo_ordem = progtipo_ordem,
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
        //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Realiza Atualização
        await ProgtipoModel.findByIdAndUpdate(req.body.progtipoId, 
            {$set: {
                progtipo_nome: req.body.progtipoNome,
                progtipo_ordem: req.body.progtipoOrdem,
                progtipo_descricao: req.body.progtipoDescricao,
                prog_usuidedi : usuarioAtual,
                prog_dataedi : dataAtual.toISOString()
                
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
         //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Realiza Atualização
            console.log("progtipomodel");
            const newProgtipo = new ProgtipoModel({
                progtipo_nome: req.body.progtipoNome,
                progtipo_ordem: req.body.progtipoOrdem,
                progtipo_descricao: req.body.progtipoDescricao,
                progtipo_usuidcad: usuarioAtual ,
                progtipo_datacad: dataAtual.toISOString()
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