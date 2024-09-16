const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const TratSchema = mongoose.Schema({
    //identificação do plano de tratamento
    trat_id:{ type: ObjectId, required: false },
    trat_planotipo :{ type: String, required: true },
    trat_beneid :{ type: ObjectId, required: true },
    trat_beneidade :{ type: String, required: false },
    trat_benedatanasc :{ type: String, required: false },
    trat_tratdata :{ type: Date, required: true },
    trat_tratdatavigencia:{ type: Date, required: false },
    trat_diagnostico :{ type: String, required: false },
    //plano padrao
    trat_especialidadepad :{ type: String, required: false },
    trat_terapeutaidpad  :{ type: ObjectId, required: false },
    trat_regconselhopad :{ type: String, required: false },
    trat_historicopad :{ type: String, required: false },
    trat_objgeralpad :{ type: String, required: false },
    trat_objespecificopad :{ type: String, required: false },
    trat_estrategiapad :{ type: String, required: false },
    trat_obspad :{ type: String, required: false },
    //plano de tratamento TO e IS
    trat_diagnosticoocup :{ type: String, required: false },
    //plano de tratamento IS
    trat_especialidadeis :{ type: String, required: false },
    trat_terapeutaidis :{ type: ObjectId, required: false },
    trat_regconselhois :{ type: String, required: false },
    trat_metacurtois :{ type: String, required: false },
    trat_metamediois :{ type: String, required: false },
    trat_metalongois :{ type: String, required: false },
    trat_objetivois :{ type: String, required: false },
    //plano de tratamento AVD
    trat_especialidadeavd:{ type: String, required: false },
    trat_terapeutaidavd :{ type: ObjectId, required: false },
    trat_regconselhoavd :{ type: String, required: false },
    trat_metacurtoavd :{ type: String, required: false },
    trat_metamedioavd :{ type: String, required: false },
    trat_metalongoavd :{ type: String, required: false },
    trat_objetivoavd :{ type: String, required: false },
    //Dados para de Sistema, quem fez, data criação e quem alterou
    trat_usuidcad :{ type: ObjectId, required: false },
    trat_usuidedi :{ type: ObjectId, required: false },
    trat_datacad :{ type: Date, required: false },
    trat_dataedi :{ type: Date, required: false },
    trat_lixo :{ type: String, required: false }
})

class Trat{
    constructor(
        //identificação do plano de tratamento
        trat_id,
        trat_planotipo,
        trat_beneid,
        trat_beneidade,
        trat_benedatanasc,
        trat_tratdata,
        trat_tratdatavigencia,
        trat_diagnostico,
        //plano padrao
        trat_especialidadepad,
        trat_terapeutaidpad,
        trat_regconselhopad,
        trat_historicopad,
        trat_objgeralpad,
        trat_objespecificopad,
        trat_estrategiapad,
        trat_obspad,
        //plano de tratamento TOAVD e IS
        trat_diagnosticoocup,
        //plano de tratamento IS
        trat_especialidadeis,
        trat_terapeutaidis,
        trat_regconselhois,
        trat_metacurtois,
        trat_metamediois,
        trat_metalongois,
        trat_objetivois,
        //plano de tratamento AVD
        trat_especialidadeavd,
        trat_terapeutaidavd,
        trat_regconselhoavd,
        trat_metacurtoavd,
        trat_metamedioavd,
        trat_metalongoavd,
        trat_objetivoavd,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuidcad,
        trat_datacad,
        trat_usuidedi,
        trat_dataedi,
        trat_lixo,

        ){
        this.trat_id = trat_id,
        this.trat_planotipo = trat_planotipo,
        this.trat_beneid = trat_beneid,
        this.trat_beneidade = trat_beneidade,
        this.trat_benedatanasc = trat_benedatanasc,
        this.trat_tratdata = trat_tratdata,
        this.trat_tratdatavigencia = trat_tratdatavigencia,
        this.trat_diagnostico = trat_diagnostico,
        //plano padrao
        this.trat_especialidadepad = trat_especialidadepad,
        this.trat_terapeutaidpad = trat_terapeutaidpad,
        this.trat_regconselhopad = trat_regconselhopad
        this.trat_historicopad = trat_historicopad,
        this.trat_objgeralpad = trat_objgeralpad,
        this.trat_objespecificopad = trat_objespecificopad,
        this.trat_estrategiapad = trat_estrategiapad,
        this.trat_obspad = trat_obspad,
        //plano de tratamento TO IS e AVD
        this.trat_diagnosticoocup = trat_diagnosticoocup,
        //plano de tratamento IS
        this.trat_especialidadeis = trat_especialidadeis,
        this.trat_terapeutaidis = trat_terapeutaidis,
        this.trat_regconselhois = trat_regconselhois,
        this.trat_metacurtois = trat_metacurtois,
        this.trat_metamediois = trat_metamediois,
        this.trat_metalongois = trat_metalongois,
        this.trat_objetivois = trat_objetivois,
        //plano de tratamento AVD
        this.trat_especialidadeavd = trat_especialidadeavd,
        this.trat_terapeutaidavd = trat_terapeutaidavd,
        this.trat_regconselhoavd = trat_regconselhoavd,
        this.trat_metacurtoavd = trat_metacurtoavd,
        this.trat_metamedioavd = trat_metamedioavd,
        this.trat_metalongoavd = trat_metalongoavd,
        this.trat_objetivoavd = trat_objetivoavd,
        
        //Dados para de Sistema, quem fez, data criação e quem alterou
        this.trat_usuidcad = trat_usuidcad,
        this.trat_datacad = trat_datacad,
        this.trat_usuidedi = trat_usuidedi,
        this.trat_dataedi = trat_dataedi,
        this.trat_lixo = trat_lixo
    }
}

TratSchema.loadClass(Trat)
const TratModel = mongoose.model('tb_trat', TratSchema)
module.exports = {TratModel,TratSchema,
    tratEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let usuarioAtual = req.cookies['idUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let tratId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("tratId:"+tratId)
        
        //Realiza Atualização
        await TratModel.findByIdAndUpdate(req.body.tratId, 
            {$set: {
                //identificação do plano de tratamento
        trat_planotipo : req.body.tratPlanotipo,
        trat_beneid : req.body.tratBeneid,
        trat_beneidade : req.body.tratBeneidade,
        trat_benedatanasc : req.body.tratBenedatanasc,
        trat_tratdata : req.body.tratTratdata,
        trat_tratdatavigencia : req.body.tratTratdatavigencia,
        trat_diagnostico : req.body.tratDiagnostico,
        //plano padrao
        trat_especialidadepad : req.body.tratEspecialidadepad,
        trat_terapeutaidpad : req.body.tratTerapeutaidpad,
        trat_regconselhopad : req.body.tratRegconselhopad,
        trat_historicopad : req.body.tratHistoricopad,
        trat_objgeralpad : req.body.tratObjgeralpad,
        trat_objespecificopad : req.body.tratObjespecificopad,
        trat_estrategiapad : req.body.tratEstrategiapad,
        trat_obspad : req.body.tratObspad,
        //plano de tratamento TO AVD e IS
        trat_diagnosticoocup : req.body.tratDiagnosticoocup,
        //plano de tratamento IS
        trat_especialidadeis : req.body.tratEspecialidadeis,
        trat_terapeutaidis : req.body.tratTerapeutaidis,
        trat_regconselhois : req.body.tratRegconselhois,
        trat_metacurtois : req.body.tratMetacurtois,
        trat_metamediois : req.body.tratMetamediois,
        trat_metalongois : req.body.tratMetalongois,
        trat_objetivois : req.body.tratObjetivois,
        //plano de tratamento AVD
        trat_especialidadeavd : req.body.tratEspecialidadeavd,
        trat_terapeutaidavd : req.body.tratTerapeutaidavd,
        trat_regconselhoavd : req.body.tratRegconselhoavd,
        trat_metacurtoavd : req.body.tratMetacurtoavd,
        trat_metamedioavd : req.body.tratMetamedioavd,
        trat_metalongoavd : req.body.tratMetalongoavd,
        trat_objetivoavd : req.body.tratObjetivoavd,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuidedi: usuarioAtual,
        trat_dataedi : dataAtual,
        trat_lixo : "false"
        
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
    tratLixo: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let usuarioAtual = req.cookies['idUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let tratId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("tratId:"+tratId)
        
        //Realiza Atualização
        await TratModel.findByIdAndUpdate(req.body.tratId, 
            {$set: {
        //Dados para o Sistema: quem fez, data criação ou alteração
        trat_usuidedi: usuarioAtual,
        trat_dataedi : dataAtual,
        trat_lixo : "true"
        
        }}
        ).then((res) =>{
            console.log("Encaminhado para a Lixeira")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    tratAdicionar: async (req,res) => {
        console.log("tratmodel");
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
       
        const newTrat = new TratModel({
            trat_planotipo : req.body.tratPlanotipo,
            trat_beneid : req.body.tratBeneid,
            trat_beneidade : req.body.tratBeneidade,
            trat_benedatanasc : req.body.tratBenedatanasc,
            trat_tratdata : req.body.tratTratdata,
            trat_tratdatavigencia : req.body.tratTratdatavigencia,
            trat_diagnostico : req.body.tratDiagnostico,
            //plano padrao
            trat_especialidadepad : req.body.tratEspecialidadepad,
            trat_terapeutaidpad : req.body.tratTerapeutaidpad,
            trat_regconselhopad : req.body.tratRegconselhopad,
            trat_historicopad : req.body.tratHistoricopad,
            trat_objgeralpad : req.body.tratObjgeralpad,
            trat_objespecificopad : req.body.tratObjespecificopad,
            trat_estrategiapad : req.body.tratEstrategiapad,
            trat_obspad : req.body.tratObspad,
            //plano de tratamento TO AVD e IS
            trat_diagnosticoocup : req.body.tratDiagnosticoocup,
            //plano de tratamento IS
            trat_especialidadeis : req.body.tratEspecialidadeis,
            trat_terapeutaidis : req.body.tratTerapeutaidis,
            trat_regconselhois : req.body.tratRegconselhois,
            trat_metacurtois : req.body.tratMetacurtois,
            trat_metamediois : req.body.tratMetamediois,
            trat_metalongois : req.body.tratMetalongois,
            trat_objetivois : req.body.tratObjetivois,
            //plano de tratamento AVD
            trat_especialidadeavd : req.body.tratEspecialidadeavd,
            trat_terapeutaidavd : req.body.tratTerapeutaidavd,
            trat_regconselhoavd : req.body.tratRegconselhoavd,
            trat_metacurtoavd : req.body.tratMetacurtoavd,
            trat_metamedioavd : req.body.tratMetamedioavd,
            trat_metalongoavd : req.body.tratMetalongoavd,
            trat_objetivoavd : req.body.tratObjetivoavd,
            //Dados para de Sistema, quem fez, data criação e quem alterou
            trat_usuidcad : usuarioAtual,
            trat_datacad : dataAtual,
            trat_lixo : "false"
            
        });
        console.log("newTrat save");
        await newTrat.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};