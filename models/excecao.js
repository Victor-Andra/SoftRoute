const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExcecaoSchema = mongoose.Schema({

    //Dados do Registro
    excecao_beneid :{ type: ObjectId, required: false },
    excecao_convid :{ type: ObjectId, required: false },
    excecao_terapiaid :{ type: ObjectId, required: false },
    excecao_terapeutaid :{ type: String, required: false },
    excecao_substitutoid :{ type: String, required: false },
    excecao_substerapiaid :{ type: ObjectId, required: false },
    excecao_obs :{ type: String, required: false },
    
    //Atributos de controle
    excecao_usuidcad :{ type: ObjectId, required: false },
    excecao_usuidedi :{ type: ObjectId, required: false },
    excecao_datacad :{ type: String, required: false },
    excecao_dataedi :{ type: String, required: false }
    
    
})

class Excecao{
    constructor(
        excecao_beneid,
        excecao_convid,
        excecao_terapiaid,
        excecao_terapeutaid,
        excecao_substitutoid,
        excecao_substerapiaid,
        excecao_obs,
        
        //Atributos de controle
        excecao_usuidcad,
        excecao_usuidedi,
        excecao_datacad,
        excecao_dataedi
        
            
    ){
    
    //Dados do Registro
    this.excecao_beneid = excecao_beneid,
    this.excecao_convid = excecao_convid,
    this.excecao_terapiaid = excecao_terapiaid,
    this.excecao_terapeutaid = excecao_terapeutaid,
    this.excecao_substitutoid = excecao_substitutoid,
    this.excecao_substerapiaid = excecao_substerapiaid,
    this.excecao_obs = excecao_obs,
    //Atributos de controle
    this.excecao_usuidcad = excecao_usuidcad,
    this.excecao_usuidedi = excecao_usuidedi,
    this.excecao_datacad = excecao_datacad,
    this.excecao_dataedi = excecao_dataedi

   
    }
}

ExcecaoSchema.loadClass(Excecao)
const ExcecaoModel = mongoose.model('tb_excecao', ExcecaoSchema)
module.exports = {ExcecaoModel,ExcecaoSchema,
    excecaoEditar: async (req, res) => {
        let dataAtual = new Date();//Pega data atual
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        console.log(usuarioAtual);
        
        //Realiza Atualização
        await ExcecaoModel.findByIdAndUpdate(req.body.excecaoId, 
            {$set: {
                excecao_beneid : req.body.excecaoBeneid,
                excecao_convid : req.body.excecaoConvid,
                excecao_terapiaid : req.body.excecaoTerapiaid,
                excecao_terapeutaid : req.body.excecaoTerapeutaid,
                excecao_substitutoid : req.body.excecaoSubstitutoid,
                excecao_substerapiaid : req.body.excecaoSubsterapiaid,
                excecao_obs : req.body.excecaoObs,
                //Atributos de controle
                excecao_usuidedi : usuarioAtual,
                excecao_dataedi : dataAtual.toISOString()
                

                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    excecaoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        console.log(usuarioAtual);
        const newExcecao = new ExcecaoModel({
            excecao_beneid : req.body.excecaoBeneid,
                excecao_convid : req.body.excecaoConvid,
                excecao_terapiaid : req.body.excecaoTerapiaid,
                excecao_terapeutaid : req.body.excecaoTerapeutaid,
                excecao_substitutoid : req.body.excecaoSubstitutoid,
                excecao_substerapiaid : req.body.excecaoSubsterapiaid,
                excecao_obs : req.body.excecaoObs,
                //Atributos de controle
                excecao_usuidcad : usuarioAtual,
                excecao_datacad : dataAtual.toISOString()
            
            
        });
        console.log("newExcecao save");
        await newExcecao.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log("err:"+err)
            return err;
        });
    }
};