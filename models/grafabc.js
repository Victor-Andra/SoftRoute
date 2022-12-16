const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const GrafabcSchema = mongoose.Schema({
    grafabc_planotipo :{
        type: String,
        required: true
    },
    grafabc_beneid :{
        type: ObjectId,
        required: true
    },
    grafabc_beneidade :{
        type: String,
        required: false
    },
    grafabc_convid :{
        type: ObjectId,
        required: true
    },
    grafabc_usuid :{
        type: String,
        required: true
    },
    grafabc_grafabcdata :{
        type: Date,
        required: true
    },
    grafabc_terapeutaid :{
        type: ObjectId,
        required: true
    },
    grafabc_terapiaid :{
        type: ObjectId,
        required: false
    },
     grafabc_num :{
        type: Number,
        required: true
    },
    grafabc_diagnostico :{
        type: String,
        required: false
    },
    grafabc_histclinico:{
        type: String,
        required: false
    },
    grafabc_metacurto :{
        type: String,
        required: false
    },
    grafabc_metamedio :{
        type: String,
        required: false
    },
    grafabc_metalongo :{
        type: String,
        required: false
    },
    grafabc_objetivo :{
        type: String,
        required: false
    },
    grafabc_datacad :{
        type: Date,
        required: false
    },
    grafabc_dataedi :{
        type: Date,
        required: false
    }
})

class Grafabc{
    constructor(
        grafabc_planotipo,
        grafabc_beneidade,
        grafabc_beneid,
        grafabc_convid,
        grafabc_usuid,
        grafabc_grafabcdata,
        grafabc_terapeutaid,
        grafabc_terapiaid,
        grafabc_num,
        grafabc_diagnostico,
        grafabc_histclinico,
        grafabc_metacurto,
        grafabc_metamedio,
        grafabc_metalongo,
        grafabc_objetivo,
        grafabc_datacad,
        grafabc_dataedi
        ){
        this.grafabc_planotipo = grafabc_planotipo,
        this.grafabc_beneidade = grafabc_beneidade,
        this.grafabc_beneid = grafabc_beneid,
        this.grafabc_convid = grafabc_convid,
        this.grafabc_usuid = grafabc_usuid,
        this.grafabc_grafabcdata = grafabc_grafabcdata,
        this.grafabc_terapeutaid = grafabc_terapeutaid,
        this.grafabc_terapiaid = grafabc_terapiaid,
        this.grafabc_num = grafabc_num,
        this.grafabc_diagnostico = diagnostico,
        this.grafabc_histclinico = grafabc_histclinico,
        this.grafabc_metacurto = grafabc_metacurto,
        this.grafabc_metamedio = grafabc_metamedio,
        this.grafabc_metalongo = grafabc_metalongo,
        this.grafabc_objetivo = grafabc_objetivo,
        this.grafabc_datacad = grafabc_datacad,
        this.grafabc_dataedi = grafabc_dataedi       
    }
}

GrafabcSchema.loadClass(Grafabc)
const GrafabcModel = mongoose.model('tb_grafabc', GrafabcSchema)
module.exports = {GrafabcModel,GrafabcSchema,
    grafabcEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await GrafabcModel.findByIdAndUpdate(req.body.grafabcId, 
            {$set: {
                grafabc_planotipo : req.body.grafabcPlanotipo,
                grafabc_beneidade : req.body.grafabcIdade,
                grafabc_beneid : req.body.grafabcBeneid,
                grafabc_convid : req.body.grafabcConvid,
                grafabc_usuid : req.body.grafabcUsuid,
                grafabc_grafabcdata : req.body.grafabcdata,
                grafabc_terapeutaid : req.body.grafabcTerapeutaid,
                grafabc_terapiaid : req.body.grafabcTerapiaid,
                grafabc_diagnostico : req.body.grafabcDiagnostico,
                grafabc_histclinico : req.body.grafabcHistclinico,
                grafabc_metacurto : req.body.grafabcMetacurto,
                grafabc_metamedio : req.body.grafabcMetamedio,
                grafabc_metalongo : req.body.grafabcMetalongo,
                grafabc_objetivo : req.body.grafabcObjetivo,
                grafabc_dataedi : dataAtual.toISOString()
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
    grafabcAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("grafabcmodel");
        console.log("req.body.grafabcdata:")
        console.log(req.body.grafabcdata)
        const NewGrafabc = new GrafabcModel({
            grafabc_planotipo : req.body.grafabcPlanotipo,
            grafabc_beneidade : req.body.grafabcBeneidade,
            grafabc_beneid : req.body.grafabcBeneid,
            grafabc_convid : req.body.grafabcConvid,
            grafabc_usuid : req.body.grafabcUsuid,
            grafabc_grafabcdata : req.body.grafabcdata,
            grafabc_terapeutaid : req.body.grafabcTerapeutaid,
            grafabc_terapiaid : req.body.grafabcTerapiaid,
            grafabc_num : req.body.nextNum,
            grafabc_diagnostico : req.body.grafabcDiagnostico,
            grafabc_histclinico : req.body.grafabcHistclinico,
            grafabc_metacurto : req.body.grafabcMetacurto,
            grafabc_metamedio : req.body.grafabcMetamedio,
            grafabc_metalongo : req.body.grafabcMetalongo,
            grafabc_objetivo : req.body.grafabcObjetivo,
            grafabc_datacad : dataAtual.toISOString()
            
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