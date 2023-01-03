const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EvoatendSchema = mongoose.Schema({
    evoatend_planotipo :{
        type: String,
        required: true
    },
    evoatend_beneid :{
        type: ObjectId,
        required: true
    },
    evoatend_beneidade :{
        type: String,
        required: false
    },
    evoatend_convid :{
        type: ObjectId,
        required: true
    },
    evoatend_usuid :{
        type: String,
        required: true
    },
    evoatend_evoatenddata :{
        type: Date,
        required: true
    },
    evoatend_terapeutaid :{
        type: ObjectId,
        required: true
    },
    evoatend_terapiaid :{
        type: ObjectId,
        required: false
    },
     evoatend_num :{
        type: Number,
        required: true
    },
    evoatend_diagnostico :{
        type: String,
        required: false
    },
    evoatend_histclinico:{
        type: String,
        required: false
    },
    evoatend_metacurto :{
        type: String,
        required: false
    },
    evoatend_metamedio :{
        type: String,
        required: false
    },
    evoatend_metalongo :{
        type: String,
        required: false
    },
    evoatend_objetivo :{
        type: String,
        required: false
    },
    evoatend_datacad :{
        type: Date,
        required: false
    },
    evoatend_dataedi :{
        type: Date,
        required: false
    }
})

class Evoatend{
    constructor(
        evoatend_planotipo,
        evoatend_beneidade,
        evoatend_beneid,
        evoatend_convid,
        evoatend_usuid,
        evoatend_evoatenddata,
        evoatend_terapeutaid,
        evoatend_terapiaid,
        evoatend_num,
        evoatend_diagnostico,
        evoatend_histclinico,
        evoatend_metacurto,
        evoatend_metamedio,
        evoatend_metalongo,
        evoatend_objetivo,
        evoatend_datacad,
        evoatend_dataedi
        ){
        this.evoatend_planotipo = evoatend_planotipo,
        this.evoatend_beneidade = evoatend_beneidade,
        this.evoatend_beneid = evoatend_beneid,
        this.evoatend_convid = evoatend_convid,
        this.evoatend_usuid = evoatend_usuid,
        this.evoatend_evoatenddata = evoatend_evoatenddata,
        this.evoatend_terapeutaid = evoatend_terapeutaid,
        this.evoatend_terapiaid = evoatend_terapiaid,
        this.evoatend_num = evoatend_num,
        this.evoatend_diagnostico = diagnostico,
        this.evoatend_histclinico = evoatend_histclinico,
        this.evoatend_metacurto = evoatend_metacurto,
        this.evoatend_metamedio = evoatend_metamedio,
        this.evoatend_metalongo = evoatend_metalongo,
        this.evoatend_objetivo = evoatend_objetivo,
        this.evoatend_datacad = evoatend_datacad,
        this.evoatend_dataedi = evoatend_dataedi       
    }
}

EvoatendSchema.loadClass(Evoatend)
const EvoatendModel = mongoose.model('tb_evoatend', EvoatendSchema)
module.exports = {EvoatendModel,EvoatendSchema,
    evoatendEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EvoatendModel.findByIdAndUpdate(req.body.evoatendId, 
            {$set: {
                evoatend_planotipo : req.body.evoatendPlanotipo,
                evoatend_beneidade : req.body.evoatendIdade,
                evoatend_beneid : req.body.evoatendBeneid,
                evoatend_convid : req.body.evoatendConvid,
                evoatend_usuid : req.body.evoatendUsuid,
                evoatend_evoatenddata : req.body.evoatenddata,
                evoatend_terapeutaid : req.body.evoatendTerapeutaid,
                evoatend_terapiaid : req.body.evoatendTerapiaid,
                evoatend_diagnostico : req.body.evoatendDiagnostico,
                evoatend_histclinico : req.body.evoatendHistclinico,
                evoatend_metacurto : req.body.evoatendMetacurto,
                evoatend_metamedio : req.body.evoatendMetamedio,
                evoatend_metalongo : req.body.evoatendMetalongo,
                evoatend_objetivo : req.body.evoatendObjetivo,
                evoatend_dataedi : dataAtual.toISOString()
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
    evoatendAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("evoatendmodel");
        console.log("req.body.evoatenddata:")
        console.log(req.body.evoatenddata)
        const NewEvoatend = new EvoatendModel({
            evoatend_planotipo : req.body.evoatendPlanotipo,
            evoatend_beneidade : req.body.evoatendBeneidade,
            evoatend_beneid : req.body.evoatendBeneid,
            evoatend_convid : req.body.evoatendConvid,
            evoatend_usuid : req.body.evoatendUsuid,
            evoatend_evoatenddata : req.body.evoatenddata,
            evoatend_terapeutaid : req.body.evoatendTerapeutaid,
            evoatend_terapiaid : req.body.evoatendTerapiaid,
            evoatend_num : req.body.nextNum,
            evoatend_diagnostico : req.body.evoatendDiagnostico,
            evoatend_histclinico : req.body.evoatendHistclinico,
            evoatend_metacurto : req.body.evoatendMetacurto,
            evoatend_metamedio : req.body.evoatendMetamedio,
            evoatend_metalongo : req.body.evoatendMetalongo,
            evoatend_objetivo : req.body.evoatendObjetivo,
            evoatend_datacad : dataAtual.toISOString()
            
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