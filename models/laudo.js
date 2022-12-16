const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const LaudoSchema = mongoose.Schema({
    laudo_planotipo :{
        type: String,
        required: true
    },
    laudo_beneid :{
        type: ObjectId,
        required: true
    },
    laudo_beneidade :{
        type: String,
        required: false
    },
    laudo_convid :{
        type: ObjectId,
        required: true
    },
    laudo_usuid :{
        type: String,
        required: true
    },
    laudo_laudodata :{
        type: Date,
        required: true
    },
    laudo_terapeutaid :{
        type: ObjectId,
        required: true
    },
    laudo_terapiaid :{
        type: ObjectId,
        required: false
    },
     laudo_num :{
        type: Number,
        required: true
    },
    laudo_diagnostico :{
        type: String,
        required: false
    },
    laudo_histclinico:{
        type: String,
        required: false
    },
    laudo_metacurto :{
        type: String,
        required: false
    },
    laudo_metamedio :{
        type: String,
        required: false
    },
    laudo_metalongo :{
        type: String,
        required: false
    },
    laudo_objetivo :{
        type: String,
        required: false
    },
    laudo_datacad :{
        type: Date,
        required: false
    },
    laudo_dataedi :{
        type: Date,
        required: false
    }
})

class Laudo{
    constructor(
        laudo_planotipo,
        laudo_beneidade,
        laudo_beneid,
        laudo_convid,
        laudo_usuid,
        laudo_laudodata,
        laudo_terapeutaid,
        laudo_terapiaid,
        laudo_num,
        laudo_diagnostico,
        laudo_histclinico,
        laudo_metacurto,
        laudo_metamedio,
        laudo_metalongo,
        laudo_objetivo,
        laudo_datacad,
        laudo_dataedi
        ){
        this.laudo_planotipo = laudo_planotipo,
        this.laudo_beneidade = laudo_beneidade,
        this.laudo_beneid = laudo_beneid,
        this.laudo_convid = laudo_convid,
        this.laudo_usuid = laudo_usuid,
        this.laudo_laudodata = laudo_laudodata,
        this.laudo_terapeutaid = laudo_terapeutaid,
        this.laudo_terapiaid = laudo_terapiaid,
        this.laudo_num = laudo_num,
        this.laudo_diagnostico = diagnostico,
        this.laudo_histclinico = laudo_histclinico,
        this.laudo_metacurto = laudo_metacurto,
        this.laudo_metamedio = laudo_metamedio,
        this.laudo_metalongo = laudo_metalongo,
        this.laudo_objetivo = laudo_objetivo,
        this.laudo_datacad = laudo_datacad,
        this.laudo_dataedi = laudo_dataedi       
    }
}

LaudoSchema.loadClass(Laudo)
const LaudoModel = mongoose.model('tb_laudo', LaudoSchema)
module.exports = {LaudoModel,LaudoSchema,
    laudoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await LaudoModel.findByIdAndUpdate(req.body.laudoId, 
            {$set: {
                laudo_planotipo : req.body.laudoPlanotipo,
                laudo_beneidade : req.body.laudoIdade,
                laudo_beneid : req.body.laudoBeneid,
                laudo_convid : req.body.laudoConvid,
                laudo_usuid : req.body.laudoUsuid,
                laudo_laudodata : req.body.laudodata,
                laudo_terapeutaid : req.body.laudoTerapeutaid,
                laudo_terapiaid : req.body.laudoTerapiaid,
                laudo_diagnostico : req.body.laudoDiagnostico,
                laudo_histclinico : req.body.laudoHistclinico,
                laudo_metacurto : req.body.laudoMetacurto,
                laudo_metamedio : req.body.laudoMetamedio,
                laudo_metalongo : req.body.laudoMetalongo,
                laudo_objetivo : req.body.laudoObjetivo,
                laudo_dataedi : dataAtual.toISOString()
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
    laudoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("laudomodel");
        console.log("req.body.laudodata:")
        console.log(req.body.laudodata)
        const NewLaudo = new LaudoModel({
            laudo_planotipo : req.body.laudoPlanotipo,
            laudo_beneidade : req.body.laudoBeneidade,
            laudo_beneid : req.body.laudoBeneid,
            laudo_convid : req.body.laudoConvid,
            laudo_usuid : req.body.laudoUsuid,
            laudo_laudodata : req.body.laudodata,
            laudo_terapeutaid : req.body.laudoTerapeutaid,
            laudo_terapiaid : req.body.laudoTerapiaid,
            laudo_num : req.body.nextNum,
            laudo_diagnostico : req.body.laudoDiagnostico,
            laudo_histclinico : req.body.laudoHistclinico,
            laudo_metacurto : req.body.laudoMetacurto,
            laudo_metamedio : req.body.laudoMetamedio,
            laudo_metalongo : req.body.laudoMetalongo,
            laudo_objetivo : req.body.laudoObjetivo,
            laudo_datacad : dataAtual.toISOString()
            
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