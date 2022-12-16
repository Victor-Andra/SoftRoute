const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const GrafprogSchema = mongoose.Schema({
    grafprog_planotipo :{
        type: String,
        required: true
    },
    grafprog_beneid :{
        type: ObjectId,
        required: true
    },
    grafprog_beneidade :{
        type: String,
        required: false
    },
    grafprog_convid :{
        type: ObjectId,
        required: true
    },
    grafprog_usuid :{
        type: String,
        required: true
    },
    grafprog_grafprogdata :{
        type: Date,
        required: true
    },
    grafprog_terapeutaid :{
        type: ObjectId,
        required: true
    },
    grafprog_terapiaid :{
        type: ObjectId,
        required: false
    },
     grafprog_num :{
        type: Number,
        required: true
    },
    grafprog_diagnostico :{
        type: String,
        required: false
    },
    grafprog_histclinico:{
        type: String,
        required: false
    },
    grafprog_metacurto :{
        type: String,
        required: false
    },
    grafprog_metamedio :{
        type: String,
        required: false
    },
    grafprog_metalongo :{
        type: String,
        required: false
    },
    grafprog_objetivo :{
        type: String,
        required: false
    },
    grafprog_datacad :{
        type: Date,
        required: false
    },
    grafprog_dataedi :{
        type: Date,
        required: false
    }
})

class Grafprog{
    constructor(
        grafprog_planotipo,
        grafprog_beneidade,
        grafprog_beneid,
        grafprog_convid,
        grafprog_usuid,
        grafprog_grafprogdata,
        grafprog_terapeutaid,
        grafprog_terapiaid,
        grafprog_num,
        grafprog_diagnostico,
        grafprog_histclinico,
        grafprog_metacurto,
        grafprog_metamedio,
        grafprog_metalongo,
        grafprog_objetivo,
        grafprog_datacad,
        grafprog_dataedi
        ){
        this.grafprog_planotipo = grafprog_planotipo,
        this.grafprog_beneidade = grafprog_beneidade,
        this.grafprog_beneid = grafprog_beneid,
        this.grafprog_convid = grafprog_convid,
        this.grafprog_usuid = grafprog_usuid,
        this.grafprog_grafprogdata = grafprog_grafprogdata,
        this.grafprog_terapeutaid = grafprog_terapeutaid,
        this.grafprog_terapiaid = grafprog_terapiaid,
        this.grafprog_num = grafprog_num,
        this.grafprog_diagnostico = diagnostico,
        this.grafprog_histclinico = grafprog_histclinico,
        this.grafprog_metacurto = grafprog_metacurto,
        this.grafprog_metamedio = grafprog_metamedio,
        this.grafprog_metalongo = grafprog_metalongo,
        this.grafprog_objetivo = grafprog_objetivo,
        this.grafprog_datacad = grafprog_datacad,
        this.grafprog_dataedi = grafprog_dataedi       
    }
}

GrafprogSchema.loadClass(Grafprog)
const GrafprogModel = mongoose.model('tb_grafprog', GrafprogSchema)
module.exports = {GrafprogModel,GrafprogSchema,
    grafprogEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await GrafprogModel.findByIdAndUpdate(req.body.grafprogId, 
            {$set: {
                grafprog_planotipo : req.body.grafprogPlanotipo,
                grafprog_beneidade : req.body.grafprogIdade,
                grafprog_beneid : req.body.grafprogBeneid,
                grafprog_convid : req.body.grafprogConvid,
                grafprog_usuid : req.body.grafprogUsuid,
                grafprog_grafprogdata : req.body.grafprogdata,
                grafprog_terapeutaid : req.body.grafprogTerapeutaid,
                grafprog_terapiaid : req.body.grafprogTerapiaid,
                grafprog_diagnostico : req.body.grafprogDiagnostico,
                grafprog_histclinico : req.body.grafprogHistclinico,
                grafprog_metacurto : req.body.grafprogMetacurto,
                grafprog_metamedio : req.body.grafprogMetamedio,
                grafprog_metalongo : req.body.grafprogMetalongo,
                grafprog_objetivo : req.body.grafprogObjetivo,
                grafprog_dataedi : dataAtual.toISOString()
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
    grafprogAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("grafprogmodel");
        console.log("req.body.grafprogdata:")
        console.log(req.body.grafprogdata)
        const NewGrafprog = new GrafprogModel({
            grafprog_planotipo : req.body.grafprogPlanotipo,
            grafprog_beneidade : req.body.grafprogBeneidade,
            grafprog_beneid : req.body.grafprogBeneid,
            grafprog_convid : req.body.grafprogConvid,
            grafprog_usuid : req.body.grafprogUsuid,
            grafprog_grafprogdata : req.body.grafprogdata,
            grafprog_terapeutaid : req.body.grafprogTerapeutaid,
            grafprog_terapiaid : req.body.grafprogTerapiaid,
            grafprog_num : req.body.nextNum,
            grafprog_diagnostico : req.body.grafprogDiagnostico,
            grafprog_histclinico : req.body.grafprogHistclinico,
            grafprog_metacurto : req.body.grafprogMetacurto,
            grafprog_metamedio : req.body.grafprogMetamedio,
            grafprog_metalongo : req.body.grafprogMetalongo,
            grafprog_objetivo : req.body.grafprogObjetivo,
            grafprog_datacad : dataAtual.toISOString()
            
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