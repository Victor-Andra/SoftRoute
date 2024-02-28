const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExcecaoSchema = mongoose.Schema({

    //Dados do Registro
    excecao_beneid :{ type: ObjectId, required: false },
    excecao_convid :{ type: ObjectId, required: false },
    excecao_terapiaid01 :{ type: ObjectId, required: false },
    excecao_terapeutasid01 :{ type: String, required: false },
    excecao_carimbo01 :{ type: String, required: false },
    excecao_horario01 :{ type: String, required: false },
    excecao_obs01 :{ type: String, required: false },
    excecao_terapiaid02 :{ type: ObjectId, required: false },
    excecao_terapeutasid02 :{ type: String, required: false },
    excecao_carimbo02 :{ type: String, required: false },
    excecao_horario02 :{ type: String, required: false },
    excecao_obs02 :{ type: String, required: false },
    excecao_terapiaid03 :{ type: ObjectId, required: false },
    excecao_terapeutasid03 :{ type: String, required: false },
    excecao_carimbo03 :{ type: String, required: false },
    excecao_horario03 :{ type: String, required: false },
    excecao_obs03 :{ type: String, required: false },
    excecao_terapiaid04 :{ type: ObjectId, required: false },
    excecao_terapeutasid04 :{ type: String, required: false },
    excecao_carimbo04 :{ type: String, required: false },
    excecao_horario04 :{ type: String, required: false },
    excecao_obs04 :{ type: String, required: false },
    excecao_terapiaid05 :{ type: ObjectId, required: false },
    excecao_terapeutasid05 :{ type: String, required: false },
    excecao_carimbo05 :{ type: String, required: false },
    excecao_horario05 :{ type: String, required: false },
    excecao_obs05 :{ type: String, required: false },
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
        excecao_terapiaid01,
        excecao_terapeutasid01,
        excecao_carimbo01,
        excecao_horario01,
        excecao_obs01,
        excecao_terapiaid02,
        excecao_terapeutasid02,
        excecao_carimbo02,
        excecao_horario02,
        excecao_obs02,
        excecao_terapiaid03,
        excecao_terapeutasid03,
        excecao_carimbo03,
        excecao_horario03,
        excecao_obs03,
        excecao_terapiaid04,
        excecao_terapeutasid04,
        excecao_carimbo04,
        excecao_horario04,
        excecao_obs04,
        excecao_terapiaid05,
        excecao_terapeutasid05,
        excecao_carimbo05,
        excecao_horario05,
        excecao_obs05,
        //Atributos de controle
        excecao_usuidcad,
        excecao_usuidedi,
        excecao_datacad,
        excecao_dataedi
        
            
    ){
    
    //Dados do Registro
    this.excecao_beneid = excecao_beneid,
    this.excecao_convid = excecao_convid,
    this.excecao_terapiaid01 = excecao_terapiaid01,
    this.excecao_terapeutasid01 = excecao_terapeutasid01,
    this.excecao_carimbo01 = excecao_carimbo01,
    this.excecao_horario01 = excecao_horario01,
    this.excecao_obs01 = excecao_obs01,
    this.excecao_terapiaid02 = excecao_terapiaid02,
    this.excecao_terapeutasid02 = excecao_terapeutasid02,
    this.excecao_carimbo02 = excecao_carimbo02,
    this.excecao_horario02 = excecao_horario02,
    this.excecao_obs02 = excecao_obs02,
    this.excecao_terapiaid03 = excecao_terapiaid03,
    this.excecao_terapeutasid03 = excecao_terapeutasid03,
    this.excecao_carimbo03 = excecao_carimbo03,
    this.excecao_horario03 = excecao_horario03,
    this.excecao_obs03 = excecao_obs03,
    this.excecao_terapiaid04 = excecao_terapiaid04,
    this.excecao_terapeutasid04 = excecao_terapeutasid04,
    this.excecao_carimbo04 = excecao_carimbo04,
    this.excecao_horario04 = excecao_horario04,
    this.excecao_obs04 = excecao_obs04,
    this.excecao_terapiaid05 = excecao_terapiaid05,
    this.excecao_terapeutasid05 = excecao_terapeutasid05,
    this.excecao_carimbo05 = excecao_carimbo05,
    this.excecao_horario05 = excecao_horario05,
    this.excecao_obs05 = excecao_obs05,
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
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ExcecaoModel.findByIdAndUpdate(req.body.excecaoId, 
            {$set: {
                excecao_beneid : req.body.excecaoBeneid,
                excecao_convid : req.body.excecaoConvid,
                excecao_terapiaid01 : req.body.excecaoTerapiaid01,
                excecao_terapeutasid01 : req.body.excecaoTerapeutasid01,
                excecao_carimbo01 : req.body.excecaoCarimbo01,
                excecao_horario01 : req.body.excecaoHorario01,
                excecao_obs01 : req.body.excecaoObs01,
                excecao_terapiaid02 : req.body.excecaoTerapiaid02,
                excecao_terapeutasid02 : req.body.excecaoTerapeutasid02,
                excecao_carimbo02 : req.body.excecaoCarimbo02,
                excecao_horario02 : req.body.excecaoHorario02,
                excecao_obs02 : req.body.excecaoObs02,
                excecao_terapiaid03 : req.body.excecaoTerapiaid03,
                excecao_terapeutasid03 : req.body.excecaoTerapeutasid03,
                excecao_carimbo03 : req.body.excecaoCarimbo03,
                excecao_horario03 : req.body.excecaoHorario03,
                excecao_obs03 : req.body.excecaoObs03,
                excecao_terapiaid04 : req.body.excecaoTerapiaid04,
                excecao_terapeutasid04 : req.body.excecaoTerapeutasid04,
                excecao_carimbo04 : req.body.excecaoCarimbo04,
                excecao_horario04 : req.body.excecaoHorario04,
                excecao_obs04 : req.body.excecaoObs04,
                excecao_terapiaid05 : req.body.excecaoTerapiaid05,
                excecao_terapeutasid05 : req.body.excecaoTerapeutasid05,
                excecao_carimbo05 : req.body.excecaoCarimbo05,
                excecao_horario05 : req.body.excecaoHorario05,
                excecao_obs05 : req.body.excecaoObs05,
                //Atributos de controle
                excecao_usuidedi : req.body.excecaoUsuidedi,
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
        const newExcecao = new ExcecaoModel({
            excecao_beneid : req.body.excecaoBeneid,
            excecao_convid : req.body.excecaoConvid,
            excecao_terapiaid01 : req.body.excecaoTerapiaid01,
            excecao_terapeutasid01 : req.body.excecaoTerapeutasid01,
            excecao_carimbo01 : req.body.excecaoCarimbo01,
            excecao_horario01 : req.body.excecaoHorario01,
            excecao_obs01 : req.body.excecaoObs01,
            excecao_terapiaid02 : req.body.excecaoTerapiaid02,
            excecao_terapeutasid02 : req.body.excecaoTerapeutasid02,
            excecao_carimbo02 : req.body.excecaoCarimbo02,
            excecao_horario02 : req.body.excecaoHorario02,
            excecao_obs02 : req.body.excecaoObs02,
            excecao_terapiaid03 : req.body.excecaoTerapiaid03,
            excecao_terapeutasid03 : req.body.excecaoTerapeutasid03,
            excecao_carimbo03 : req.body.excecaoCarimbo03,
            excecao_horario03 : req.body.excecaoHorario03,
            excecao_obs03 : req.body.excecaoObs03,
            excecao_terapiaid04 : req.body.excecaoTerapiaid04,
            excecao_terapeutasid04 : req.body.excecaoTerapeutasid04,
            excecao_carimbo04 : req.body.excecaoCarimbo04,
            excecao_horario04 : req.body.excecaoHorario04,
            excecao_obs04 : req.body.excecaoObs04,
            excecao_terapiaid05 : req.body.excecaoTerapiaid05,
            excecao_terapeutasid05 : req.body.excecaoTerapeutasid05,
            excecao_carimbo05 : req.body.excecaoCarimbo05,
            excecao_horario05 : req.body.excecaoHorario05,
            excecao_obs05 : req.body.excecaoObs05,
            //Atributos de controle
            excecao_usuidcad : req.body.excecaoUsuidcad,
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