const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SondaSchema = mongoose.Schema({
    sonda_planotipo :{
        type: String,
        required: true
    },
    sonda_beneid :{
        type: ObjectId,
        required: true
    },
    sonda_beneidade :{
        type: String,
        required: false
    },
    sonda_convid :{
        type: ObjectId,
        required: true
    },
    sonda_usuid :{
        type: String,
        required: true
    },
    sonda_sondadata :{
        type: Date,
        required: true
    },
    sonda_terapeutaid :{
        type: ObjectId,
        required: true
    },
    sonda_terapiaid :{
        type: ObjectId,
        required: false
    },
     sonda_num :{
        type: Number,
        required: true
    },
    sonda_diagnostico :{
        type: String,
        required: false
    },
    sonda_histclinico:{
        type: String,
        required: false
    },
    sonda_metacurto :{
        type: String,
        required: false
    },
    sonda_metamedio :{
        type: String,
        required: false
    },
    sonda_metalongo :{
        type: String,
        required: false
    },
    sonda_objetivo :{
        type: String,
        required: false
    },
    sonda_datacad :{
        type: Date,
        required: false
    },
    sonda_dataedi :{
        type: Date,
        required: false
    }
})

class Sonda{
    constructor(
        sonda_planotipo,
        sonda_beneidade,
        sonda_beneid,
        sonda_convid,
        sonda_usuid,
        sonda_sondadata,
        sonda_terapeutaid,
        sonda_terapiaid,
        sonda_num,
        sonda_diagnostico,
        sonda_histclinico,
        sonda_metacurto,
        sonda_metamedio,
        sonda_metalongo,
        sonda_objetivo,
        sonda_datacad,
        sonda_dataedi
        ){
        this.sonda_planotipo = sonda_planotipo,
        this.sonda_beneidade = sonda_beneidade,
        this.sonda_beneid = sonda_beneid,
        this.sonda_convid = sonda_convid,
        this.sonda_usuid = sonda_usuid,
        this.sonda_sondadata = sonda_sondadata,
        this.sonda_terapeutaid = sonda_terapeutaid,
        this.sonda_terapiaid = sonda_terapiaid,
        this.sonda_num = sonda_num,
        this.sonda_diagnostico = diagnostico,
        this.sonda_histclinico = sonda_histclinico,
        this.sonda_metacurto = sonda_metacurto,
        this.sonda_metamedio = sonda_metamedio,
        this.sonda_metalongo = sonda_metalongo,
        this.sonda_objetivo = sonda_objetivo,
        this.sonda_datacad = sonda_datacad,
        this.sonda_dataedi = sonda_dataedi       
    }
}

SondaSchema.loadClass(Sonda)
const SondaModel = mongoose.model('tb_sonda', SondaSchema)
module.exports = {SondaModel,SondaSchema,
    sondaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await SondaModel.findByIdAndUpdate(req.body.sondaId, 
            {$set: {
                sonda_planotipo : req.body.sondaPlanotipo,
                sonda_beneidade : req.body.sondaIdade,
                sonda_beneid : req.body.sondaBeneid,
                sonda_convid : req.body.sondaConvid,
                sonda_usuid : req.body.sondaUsuid,
                sonda_sondadata : req.body.sondadata,
                sonda_terapeutaid : req.body.sondaTerapeutaid,
                sonda_terapiaid : req.body.sondaTerapiaid,
                sonda_diagnostico : req.body.sondaDiagnostico,
                sonda_histclinico : req.body.sondaHistclinico,
                sonda_metacurto : req.body.sondaMetacurto,
                sonda_metamedio : req.body.sondaMetamedio,
                sonda_metalongo : req.body.sondaMetalongo,
                sonda_objetivo : req.body.sondaObjetivo,
                sonda_dataedi : dataAtual.toISOString()
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
    sondaAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("sondamodel");
        console.log("req.body.sondadata:")
        console.log(req.body.sondadata)
        const NewSonda = new SondaModel({
            sonda_planotipo : req.body.sondaPlanotipo,
            sonda_beneidade : req.body.sondaBeneidade,
            sonda_beneid : req.body.sondaBeneid,
            sonda_convid : req.body.sondaConvid,
            sonda_usuid : req.body.sondaUsuid,
            sonda_sondadata : req.body.sondadata,
            sonda_terapeutaid : req.body.sondaTerapeutaid,
            sonda_terapiaid : req.body.sondaTerapiaid,
            sonda_num : req.body.nextNum,
            sonda_diagnostico : req.body.sondaDiagnostico,
            sonda_histclinico : req.body.sondaHistclinico,
            sonda_metacurto : req.body.sondaMetacurto,
            sonda_metamedio : req.body.sondaMetamedio,
            sonda_metalongo : req.body.sondaMetalongo,
            sonda_objetivo : req.body.sondaObjetivo,
            sonda_datacad : dataAtual.toISOString()
            
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