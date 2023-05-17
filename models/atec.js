const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AtecSchema = mongoose.Schema({
    atec_planotipo :{
        type: String,
        required: true
    },
    atec_beneid :{
        type: ObjectId,
        required: true
    },
    atec_beneidade :{
        type: String,
        required: false
    },
    atec_convid :{
        type: ObjectId,
        required: true
    },
    atec_usuid :{
        type: String,
        required: true
    },
    atec_atecdata :{
        type: Date,
        required: true
    },
    atec_terapeutaid :{
        type: ObjectId,
        required: true
    },
    atec_terapiaid :{
        type: ObjectId,
        required: false
    },
     atec_num :{
        type: Number,
        required: true
    },
    atec_diagnostico :{
        type: String,
        required: false
    },
    atec_histclinico:{
        type: String,
        required: false
    },
    atec_metacurto :{
        type: String,
        required: false
    },
    atec_metamedio :{
        type: String,
        required: false
    },
    atec_metalongo :{
        type: String,
        required: false
    },
    atec_objetivo :{
        type: String,
        required: false
    },
    atec_datacad :{
        type: Date,
        required: false
    },
    atec_dataedi :{
        type: Date,
        required: false
    }
})

class Atec{
    constructor(
        atec_planotipo,
        atec_beneidade,
        atec_beneid,
        atec_convid,
        atec_usuid,
        atec_atecdata,
        atec_terapeutaid,
        atec_terapiaid,
        atec_num,
        atec_diagnostico,
        atec_histclinico,
        atec_metacurto,
        atec_metamedio,
        atec_metalongo,
        atec_objetivo,
        atec_datacad,
        atec_dataedi
        ){
        this.atec_planotipo = atec_planotipo,
        this.atec_beneidade = atec_beneidade,
        this.atec_beneid = atec_beneid,
        this.atec_convid = atec_convid,
        this.atec_usuid = atec_usuid,
        this.atec_atecdata = atec_atecdata,
        this.atec_terapeutaid = atec_terapeutaid,
        this.atec_terapiaid = atec_terapiaid,
        this.atec_num = atec_num,
        this.atec_diagnostico = diagnostico,
        this.atec_histclinico = atec_histclinico,
        this.atec_metacurto = atec_metacurto,
        this.atec_metamedio = atec_metamedio,
        this.atec_metalongo = atec_metalongo,
        this.atec_objetivo = atec_objetivo,
        this.atec_datacad = atec_datacad,
        this.atec_dataedi = atec_dataedi       
    }
}

AtecSchema.loadClass(Atec)
const AtecModel = mongoose.model('tb_atec', AtecSchema)
module.exports = {AtecModel,AtecSchema,
    atecEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AtecModel.findByIdAndUpdate(req.body.atecId, 
            {$atec: {
                atec_planotipo : req.body.atecPlanotipo,
                atec_beneidade : req.body.atecIdade,
                atec_beneid : req.body.atecBeneid,
                atec_convid : req.body.atecConvid,
                atec_usuid : req.body.atecUsuid,
                atec_atecdata : req.body.atecdata,
                atec_terapeutaid : req.body.atecTerapeutaid,
                atec_terapiaid : req.body.atecTerapiaid,
                atec_diagnostico : req.body.atecDiagnostico,
                atec_histclinico : req.body.atecHistclinico,
                atec_metacurto : req.body.atecMetacurto,
                atec_metamedio : req.body.atecMetamedio,
                atec_metalongo : req.body.atecMetalongo,
                atec_objetivo : req.body.atecObjetivo,
                atec_dataedi : dataAtual.toISOString()
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
    atecAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("atecmodel");
        console.log("req.body.atecdata:")
        console.log(req.body.atecdata)
        const NewAtec = new AtecModel({
            atec_planotipo : req.body.atecPlanotipo,
            atec_beneidade : req.body.atecBeneidade,
            atec_beneid : req.body.atecBeneid,
            atec_convid : req.body.atecConvid,
            atec_usuid : req.body.atecUsuid,
            atec_atecdata : req.body.atecdata,
            atec_terapeutaid : req.body.atecTerapeutaid,
            atec_terapiaid : req.body.atecTerapiaid,
            atec_num : req.body.nextNum,
            atec_diagnostico : req.body.atecDiagnostico,
            atec_histclinico : req.body.atecHistclinico,
            atec_metacurto : req.body.atecMetacurto,
            atec_metamedio : req.body.atecMetamedio,
            atec_metalongo : req.body.atecMetalongo,
            atec_objetivo : req.body.atecObjetivo,
            atec_datacad : dataAtual.toISOString()
            
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