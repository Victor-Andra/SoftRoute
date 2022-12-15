const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const TratSchema = mongoose.Schema({
    trat_planotipo :{
        type: String,
        required: true
    },
    trat_beneid :{
        type: ObjectId,
        required: true
    },
    trat_beneidade :{
        type: String,
        required: false
    },
    trat_convid :{
        type: ObjectId,
        required: true
    },
    trat_usuid :{
        type: String,
        required: true
    },
    trat_tratdata :{
        type: Date,
        required: true
    },
    trat_terapeutaid :{
        type: ObjectId,
        required: true
    },
    trat_terapiaid :{
        type: ObjectId,
        required: false
    },
     trat_num :{
        type: Number,
        required: true
    },
    trat_diagnostico :{
        type: String,
        required: false
    },
    trat_histclinico:{
        type: String,
        required: false
    },
    trat_metacurto :{
        type: String,
        required: false
    },
    trat_metamedio :{
        type: String,
        required: false
    },
    trat_metalongo :{
        type: String,
        required: false
    },
    trat_objetivo :{
        type: String,
        required: false
    },
    trat_datacad :{
        type: Date,
        required: false
    },
    trat_dataedi :{
        type: Date,
        required: false
    }
})

class Trat{
    constructor(
        trat_planotipo,
        trat_beneidade,
        trat_beneid,
        trat_convid,
        trat_usuid,
        trat_tratdata,
        trat_terapeutaid,
        trat_terapiaid,
        trat_num,
        trat_diagnostico,
        trat_histclinico,
        trat_metacurto,
        trat_metamedio,
        trat_metalongo,
        trat_objetivo,
        trat_datacad,
        trat_dataedi
        ){
        this.trat_planotipo = trat_planotipo,
        this.trat_beneidade = trat_beneidade,
        this.trat_beneid = trat_beneid,
        this.trat_convid = trat_convid,
        this.trat_usuid = trat_usuid,
        this.trat_tratdata = trat_tratdata,
        this.trat_terapeutaid = trat_terapeutaid,
        this.trat_terapiaid = trat_terapiaid,
        this.trat_num = trat_num,
        this.trat_diagnostico = diagnostico,
        this.trat_histclinico = trat_histclinico,
        this.trat_metacurto = trat_metacurto,
        this.trat_metamedio = trat_metamedio,
        this.trat_metalongo = trat_metalongo,
        this.trat_objetivo = trat_objetivo,
        this.trat_datacad = trat_datacad,
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
                trat_planotipo : req.body.tratPlanotipo,
                trat_beneidade : req.body.tratIdade,
                trat_beneid : req.body.tratBeneid,
                trat_convid : req.body.tratConvid,
                trat_usuid : req.body.tratUsuid,
                trat_tratdata : req.body.tratdata,
                trat_terapeutaid : req.body.tratTerapeutaid,
                trat_terapiaid : req.body.tratTerapiaid,
                trat_diagnostico : req.body.tratDiagnostico,
                trat_histclinico : req.body.tratHistclinico,
                trat_metacurto : req.body.tratMetacurto,
                trat_metamedio : req.body.tratMetamedio,
                trat_metalongo : req.body.tratMetalongo,
                trat_objetivo : req.body.tratObjetivo,
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
        const NewTrat = new TratModel({
            trat_planotipo : req.body.tratPlanotipo,
            trat_beneidade : req.body.tratBeneidade,
            trat_beneid : req.body.tratBeneid,
            trat_convid : req.body.tratConvid,
            trat_usuid : req.body.tratUsuid,
            trat_tratdata : req.body.tratdata,
            trat_terapeutaid : req.body.tratTerapeutaid,
            trat_terapiaid : req.body.tratTerapiaid,
            trat_num : req.body.nextNum,
            trat_diagnostico : req.body.tratDiagnostico,
            trat_histclinico : req.body.tratHistclinico,
            trat_metacurto : req.body.tratMetacurto,
            trat_metamedio : req.body.tratMetamedio,
            trat_metalongo : req.body.tratMetalongo,
            trat_objetivo : req.body.tratObjetivo,
            trat_datacad : dataAtual.toISOString()
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};