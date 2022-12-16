const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EvolSchema = mongoose.Schema({
    evol_planotipo :{
        type: String,
        required: true
    },
    evol_beneid :{
        type: ObjectId,
        required: true
    },
    evol_beneidade :{
        type: String,
        required: false
    },
    evol_convid :{
        type: ObjectId,
        required: true
    },
    evol_usuid :{
        type: String,
        required: true
    },
    evol_evoldata :{
        type: Date,
        required: true
    },
    evol_terapeutaid :{
        type: ObjectId,
        required: true
    },
    evol_terapiaid :{
        type: ObjectId,
        required: false
    },
     evol_num :{
        type: Number,
        required: true
    },
    evol_diagnostico :{
        type: String,
        required: false
    },
    evol_histclinico:{
        type: String,
        required: false
    },
    evol_metacurto :{
        type: String,
        required: false
    },
    evol_metamedio :{
        type: String,
        required: false
    },
    evol_metalongo :{
        type: String,
        required: false
    },
    evol_objetivo :{
        type: String,
        required: false
    },
    evol_datacad :{
        type: Date,
        required: false
    },
    evol_dataedi :{
        type: Date,
        required: false
    }
})

class Evol{
    constructor(
        evol_planotipo,
        evol_beneidade,
        evol_beneid,
        evol_convid,
        evol_usuid,
        evol_evoldata,
        evol_terapeutaid,
        evol_terapiaid,
        evol_num,
        evol_diagnostico,
        evol_histclinico,
        evol_metacurto,
        evol_metamedio,
        evol_metalongo,
        evol_objetivo,
        evol_datacad,
        evol_dataedi
        ){
        this.evol_planotipo = evol_planotipo,
        this.evol_beneidade = evol_beneidade,
        this.evol_beneid = evol_beneid,
        this.evol_convid = evol_convid,
        this.evol_usuid = evol_usuid,
        this.evol_evoldata = evol_evoldata,
        this.evol_terapeutaid = evol_terapeutaid,
        this.evol_terapiaid = evol_terapiaid,
        this.evol_num = evol_num,
        this.evol_diagnostico = diagnostico,
        this.evol_histclinico = evol_histclinico,
        this.evol_metacurto = evol_metacurto,
        this.evol_metamedio = evol_metamedio,
        this.evol_metalongo = evol_metalongo,
        this.evol_objetivo = evol_objetivo,
        this.evol_datacad = evol_datacad,
        this.evol_dataedi = evol_dataedi       
    }
}

EvolSchema.loadClass(Evol)
const EvolModel = mongoose.model('tb_evol', EvolSchema)
module.exports = {EvolModel,EvolSchema,
    evolEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EvolModel.findByIdAndUpdate(req.body.evolId, 
            {$set: {
                evol_planotipo : req.body.evolPlanotipo,
                evol_beneidade : req.body.evolIdade,
                evol_beneid : req.body.evolBeneid,
                evol_convid : req.body.evolConvid,
                evol_usuid : req.body.evolUsuid,
                evol_evoldata : req.body.evoldata,
                evol_terapeutaid : req.body.evolTerapeutaid,
                evol_terapiaid : req.body.evolTerapiaid,
                evol_diagnostico : req.body.evolDiagnostico,
                evol_histclinico : req.body.evolHistclinico,
                evol_metacurto : req.body.evolMetacurto,
                evol_metamedio : req.body.evolMetamedio,
                evol_metalongo : req.body.evolMetalongo,
                evol_objetivo : req.body.evolObjetivo,
                evol_dataedi : dataAtual.toISOString()
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
    evolAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("evolmodel");
        console.log("req.body.evoldata:")
        console.log(req.body.evoldata)
        const NewEvol = new EvolModel({
            evol_planotipo : req.body.evolPlanotipo,
            evol_beneidade : req.body.evolBeneidade,
            evol_beneid : req.body.evolBeneid,
            evol_convid : req.body.evolConvid,
            evol_usuid : req.body.evolUsuid,
            evol_evoldata : req.body.evoldata,
            evol_terapeutaid : req.body.evolTerapeutaid,
            evol_terapiaid : req.body.evolTerapiaid,
            evol_num : req.body.nextNum,
            evol_diagnostico : req.body.evolDiagnostico,
            evol_histclinico : req.body.evolHistclinico,
            evol_metacurto : req.body.evolMetacurto,
            evol_metamedio : req.body.evolMetamedio,
            evol_metalongo : req.body.evolMetalongo,
            evol_objetivo : req.body.evolObjetivo,
            evol_datacad : dataAtual.toISOString()
            
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