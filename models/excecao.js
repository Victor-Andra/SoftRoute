const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExcecaoSchema = mongoose.Schema({

    //Dados do Registro
    excecao_usuidcad :{ type: ObjectId, required: false },
    excecao_datacad :{ type: String, required: false },
    excecao_usuidedi :{ type: ObjectId, required: false },
    excecao_dataedi :{ type: String, required: false },
    //dados Básicos do ATA
    excecao_beneid :{ type: ObjectId, required: true },
    excecao_terapeutaid :{ type: String, required: false },
    excecao_terapiaid :{ type: String, required: false },
    excecao_carimbo: { type: Boolean, required: false },
    excecao_horario: { type: Boolean, required: false },
    excecao_obs: { type: String, required: false }
    
})

class Excecao{
    constructor(
    //Dados do Registro
    excecao_usuidcad,
    excecao_datacad,
    excecao_usuidedi,
    excecao_dataedi,
    //dados Básicos do ATA
    excecao_beneid,
    excecao_terapiaid,
    excecao_terapeutaid,
    excecao_carimbo,
    excecao_horario,
    excecao_obs
            
    ){
    
    //Dados do Registro
    this.excecao_usuidcad = excecao_usuidcad,
    this.excecao_datacad = excecao_dataocad,
    this.excecao_usuidedi = excecao_usuidedi,
    this.excecao_dataedi = excecao_dataedi,
    //dados Básicos das Exceções
    this.excecao_beneid = excecao_beneid,
    this.excecao_terapiaid = excecao_terapiaid,
    this.excecao_terapeutaid = excecao_terapeutaid,
    this.excecao_carimbo = excecao_carimbo,
    this.excecao_horario = excecao_horario,
    this.excecao_obs = excecao_obs
   
    }
}

ExcecaoSchema.loadClass(Excecao)
const ExcecaoModel = mongoose.model('tb_excecao', ExcecaoSchema)
module.exports = {ExcecaoModel,ExcecaoSchema,
    excecaoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega dexcecao atual
        
        //Realiza Atualização
        await ExcecaoModel.findByIdAndUpdate(req.body.excecaoId, 
            {$set: {
                excecao_usuidcad : req.body.excecaoUsuidcad,
                excecao_datacad : req.body.excecaoDatacad,
                excecao_usuidedi : req.body.excecaoUsuidedi,
                excecao_dataedi : dataAtual.toISOString(),
                //dados Básicos do ATA
                excecao_beneid : req.body.excecaoBeneid,
                excecao_terapiaid : req.body.excecaoTerapiaid,
                excecao_terapeutaid : req.body.excecaoTerapeutaid,
                excecao_carimbo : req.body.excecaoCarimbo,
                excecao_horario : req.body.excecaoHorario,
                excecao_obs : req.body.excecaoObs

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
        console.log("excecaomodel");
        console.log("req.body.excecaoI01> "+req.body.excecaoI01temp)
        console.log("excecaomodel2");
        const newExcecao = new ExcecaoModel({
            excecao_usuidcad : req.body.excecaoUsuidcad,
                excecao_dexcecaocad : req.body.excecaoDatacad,
                excecao_usuidedi : req.body.excecaoUsuidedi,
                excecao_dexcecaoedi : dataAtual.toISOString(),
                //dados Básicos do ATA
                excecao_beneid : req.body.excecaoBeneid,
                excecao_terapiaid : req.body.excecaoTerapiaid,
                excecao_terapeutaid : req.body.excecaoTerapeutaid,
                excecao_carimbo : req.body.excecaoCarimbo,
                excecao_horario : req.body.excecaoHorario,
                excecao_obs : req.body.excecaoObs
            
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