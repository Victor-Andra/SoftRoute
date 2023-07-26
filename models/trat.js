const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const TratSchema = mongoose.Schema({
    //identificação do plano de tratamento
    trat_planotipo :{ type: String, required: true },
    trat_beneid :{ type: ObjectId, required: true },
    trat_beneidade :{ type: String, required: false },
    trat_benedatanasc :{ type: String, required: true },
    trat_tratdata :{ type: Date, required: true },
    trat_diagnostico :{ type: String, required: true },
    //plano padrao
    trat_especialidadepad :{ type: String, required: false },
    trat_terapeutaidpad  :{ type: ObjectId, required: false },
    trat_historicopad :{ type: String, required: false },
    trat_objgeralpad :{ type: String, required: false },
    trat_objespecificopad :{ type: String, required: false },
    trat_estrategiapad :{ type: String, required: false },
    trat_obspad :{ type: String, required: false },
    //plano de tratamento IS
    trat_terapeutaidis :{ type: ObjectId, required: false },
    trat_metacurtois :{ type: String, required: false },
    trat_metamediois :{ type: String, required: false },
    trat_metalongois :{ type: String, required: false },
    trat_objetivois :{ type: String, required: false },
    //plano de tratamento AVD
    trat_terapeutaidavd :{ type: ObjectId, required: false },
    trat_metacurtoavd :{ type: String, required: false },
    trat_metamedioavd :{ type: String, required: false },
    trat_metalongoavd :{ type: String, required: false },
    trat_objetivoavd :{ type: String, required: false },
    //plano de tratamento Fisioterapico
    trat_terapeutaidfis :{ type: ObjectId, required: false },
    trat_histclinicofis :{ type: String, required: false },
    trat_metacurtofis :{ type: String, required: false },
    trat_metamediofis :{ type: String, required: false },
    trat_metalongofis :{ type: String, required: false },
    trat_objetivofis :{ type: String, required: false },
    //Dados para de Sistema, quem fez, data criação e quem alterou
    trat_usuid :{ type: ObjectId, required: false },
    trat_usuidedi :{ type: ObjectId, required: false },
    trat_datacad :{ type: Date, required: false },
    trat_dataedi :{ type: Date, required: false }
})

class Trat{
    constructor(
        //identificação do plano de tratamento
        trat_planotipo,
        trat_beneid,
        trat_beneidade,
        trat_benedatanasc,
        trat_tratdata,
        trat_diagnostico,
        //plano padrao
        trat_especialidadepad,
        trat_terapeutaidpad,
        trat_historicopad,
        trat_objgeralpad,
        trat_objespecificopad,
        trat_estrategiapad,
        trat_obspad,
        //plano de tratamento IS
        trat_terapeutaidis,
        trat_metacurtois,
        trat_metamediois,
        trat_metalongois,
        trat_objetivois,
        //plano de tratamento AVD
        trat_terapeutaidavd,
        trat_metacurtoavd,
        trat_metamedioavd,
        trat_metalongoavd,
        trat_objetivoavd,
        //plano de tratamento Fisioterapico
        trat_terapeutaidfis,
        trat_histclinicofis,
        trat_metacurtofis,
        trat_metamediofis,
        trat_metalongofis,
        trat_objetivofis,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuid,
        trat_datacad,
        trat_usuidedi,
        trat_dataedi
        ){
        this.trat_planotipo = trat_planotipo,
        this.trat_beneid = trat_beneid,
        this.trat_beneidade = trat_beneidade,
        this.trat_benedatanasc = trat_benedatanasc,
        this.trat_tratdata = trat_tratdata,
        this.trat_diagnostico = trat_diagnostico,
        //plano padrao
        this.trat_especialidadepad = trat_especialidadepad,
        this.trat_terapeutaidpad = trat_terapeutaidpad,
        this.trat_historicopad = trat_historicopad,
        this.trat_objgeralpad = trat_objgeralpad,
        this.trat_objespecificopad = trat_objespecificopad,
        this.trat_estrategiapad = trat_estrategiapad,
        this.trat_obspad = trat_obspad,
        //plano de tratamento IS
        this.trat_terapeutaidis = trat_terapeutaidis,
        this.trat_metacurtois = trat_metacurtois,
        this.trat_metamediois = trat_metamediois,
        this.trat_metalongois = trat_metalongois,
        this.trat_objetivois = trat_objetivois,
        //plano de tratamento AVD
        this.trat_terapeutaidavd = trat_terapeutaidavd,
        this.trat_metacurtoavd = trat_metacurtoavd,
        this.trat_metamedioavd = trat_metamedioavd,
        this.trat_metalongoavd = trat_metalongoavd,
        this.trat_objetivoavd = trat_objetivoavd,
        //plano de tratamento Fisioterapico
        this.trat_terapeutaidfis = trat_terapeutaidfis,
        this.trat_histclinicofis = trat_histclinicofis,
        this.trat_metacurtofis = trat_metacurtofis,
        this.trat_metamediofis = trat_metamediofis,
        this.trat_metalongofis = trat_metalongofis,
        this.trat_objetivofis = trat_objetivofis,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        this.trat_usuid = trat_usuid,
        this.trat_datacad = trat_datacad,
        this.trat_usuidedi = trat_usuidedi,
        this.trat_dataedi = trat_dataedi   
    }
}

TratSchema.loadClass(Trat)
const TratModel = mongoose.model('tb_trat', TratSchema)
module.exports = {TratModel,TratSchema,
    tratEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await TratModel.findByIdAndUpdate(req.body.tratId, 
            {$set: {
                //identificação do plano de tratamento
        trat_planotipo : req.body.tratPlanotipo,
        trat_beneid : req.body.tratBeneid,
        trat_beneidade : req.body.tratBeneidade,
        trat_benedatanasc : req.body.tratBenedatanasc,
        trat_tratdata : req.body.tratTratdata,
        trat_diagnostico : req.body.tratDiagnostico,
        //plano padrao
        trat_especialidadepad : req.body.tratEspecialidadepad,
        trat_terapeutaidpad : req.body.tratTerapeutaidpad,
        trat_historicopad : req.body.tratHistoricopad,
        trat_objgeralpad : req.body.tratObjgeralpad,
        trat_objespecificopad : req.body.tratObjespecificopad,
        trat_estrategiapad : req.body.tratEstrategiapad,
        trat_obspad : req.body.tratObspad,
        //plano de tratamento IS
        trat_terapeutaidis : req.body.tratTerapeutaidis,
        trat_metacurtois : req.body.tratMetacurtois,
        trat_metamediois : req.body.tratMetamediois,
        trat_metalongois : req.body.tratMetalongois,
        trat_objetivois : req.body.tratObjetivois,
        //plano de tratamento AVD
        trat_terapeutaidavd : req.body.tratTerapeutaidavd,
        trat_metacurtoavd : req.body.tratMetacurtoavd,
        trat_metamedioavd : req.body.tratMetamedioavd,
        trat_metalongoavd : req.body.tratMetalongoavd,
        trat_objetivoavd : req.body.tratObjetivoavd,
        //plano de tratamento Fisioterapico
        trat_terapeutaidfis : req.body.tratTerapeutaidfis,
        trat_histclinicofis : req.body.tratHistclinicofis,
        trat_metacurtofis : req.body.tratMetacurtofis,
        trat_metamediofis : req.body. tratMetamediofis,
        trat_metalongofis : req.body.tratMetalongofis,
        trat_objetivofis : req.body.tratObjetivofis,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuid : req.body.tratUsuid,
        trat_datacad : req.body.tratDatacad,
        trat_usuidedi: req.body.tratUsuidedi,
        trat_dataedi : dataAtual.toISOString()
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
    tratAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("tratmodel");
        console.log("req.body.tratdata:")
        console.log(req.body.tratdata)
        const newTrat = new TratModel({
            trat_planotipo : req.body.tratPlanotipo,
            trat_beneid : req.body.tratBeneid,
            trat_beneidade : req.body.tratBeneidade,
            trat_benedatanasc : req.body.tratBenedatanasc,
            trat_tratdata : req.body.tratTratdata,
            trat_diagnostico : req.body.tratDiagnostico,
            //plano padrao
            trat_especialidadepad : req.body.tratEspecialidadepad,
            trat_historicopad : req.body.tratHistoricopad,
            trat_objgeralpad : req.body.tratObjgeralpad,
            trat_objespecificopad : req.body.tratObjespecificopad,
            trat_estrategiapad : req.body.tratEstrategiapad,
            trat_obspad : req.body.tratObspad,
            //plano de tratamento IS
            trat_terapeutaidis : req.body.tratTerapeutaidis,
            trat_metacurtois : req.body.tratMetacurtois,
            trat_metamediois : req.body.tratMetamediois,
            trat_metalongois : req.body.tratMetalongois,
            trat_objetivois : req.body.tratObjetivois,
            //plano de tratamento AVD
            trat_terapeutaidavd : req.body.tratTerapeutaidavd,
            trat_metacurtoavd : req.body.tratMetacurtoavd,
            trat_metamedioavd : req.body.tratMetamedioavd,
            trat_metalongoavd : req.body.tratMetalongoavd,
            trat_objetivoavd : req.body.tratObjetivoavd,
            //plano de tratamento Fisioterapico
            trat_terapeutaidfis : req.body.tratTerapeutaidfis,
            trat_histclinicofis : req.body.tratHistclinicofis,
            trat_metacurtofis : req.body.tratMetacurtofis,
            trat_metamediofis : req.body. tratMetamediofis,
            trat_metalongofis : req.body.tratMetalongofis,
            trat_objetivofis : req.body.tratObjetivofis,
            //Dados para de Sistema, quem fez, data criação e quem alterou
            trat_usuid : req.body.tratUsuid,
            trat_usuidedi: req.body.tratUsuidedi,
            trat_dataedi : req.body.tratDataedi,
            trat_datacad : dataAtual.toISOString()
            
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