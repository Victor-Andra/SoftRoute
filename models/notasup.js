const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const NotasupSchema = mongoose.Schema({
    notasup_planotipo :{
        type: String,
        required: true
    },
    notasup_beneid :{
        type: ObjectId,
        required: true
    },
    notasup_beneidade :{
        type: String,
        required: false
    },
    notasup_convid :{
        type: ObjectId,
        required: true
    },
    notasup_usuid :{
        type: String,
        required: true
    },
    notasup_notasupdata :{
        type: Date,
        required: true
    },
    notasup_terapeutaid :{
        type: ObjectId,
        required: true
    },
    notasup_terapiaid :{
        type: ObjectId,
        required: false
    },
     notasup_num :{
        type: Number,
        required: true
    },
    notasup_diagnostico :{
        type: String,
        required: false
    },
    notasup_histclinico:{
        type: String,
        required: false
    },
    notasup_metacurto :{
        type: String,
        required: false
    },
    notasup_metamedio :{
        type: String,
        required: false
    },
    notasup_metalongo :{
        type: String,
        required: false
    },
    notasup_objetivo :{
        type: String,
        required: false
    },
    notasup_datacad :{
        type: Date,
        required: false
    },
    notasup_dataedi :{
        type: Date,
        required: false
    }
})

class Notasup{
    constructor(
        notasup_planotipo,
        notasup_beneidade,
        notasup_beneid,
        notasup_convid,
        notasup_usuid,
        notasup_notasupdata,
        notasup_terapeutaid,
        notasup_terapiaid,
        notasup_num,
        notasup_diagnostico,
        notasup_histclinico,
        notasup_metacurto,
        notasup_metamedio,
        notasup_metalongo,
        notasup_objetivo,
        notasup_datacad,
        notasup_dataedi
        ){
        this.notasup_planotipo = notasup_planotipo,
        this.notasup_beneidade = notasup_beneidade,
        this.notasup_beneid = notasup_beneid,
        this.notasup_convid = notasup_convid,
        this.notasup_usuid = notasup_usuid,
        this.notasup_notasupdata = notasup_notasupdata,
        this.notasup_terapeutaid = notasup_terapeutaid,
        this.notasup_terapiaid = notasup_terapiaid,
        this.notasup_num = notasup_num,
        this.notasup_diagnostico = diagnostico,
        this.notasup_histclinico = notasup_histclinico,
        this.notasup_metacurto = notasup_metacurto,
        this.notasup_metamedio = notasup_metamedio,
        this.notasup_metalongo = notasup_metalongo,
        this.notasup_objetivo = notasup_objetivo,
        this.notasup_datacad = notasup_datacad,
        this.notasup_dataedi = notasup_dataedi       
    }
}

NotasupSchema.loadClass(Notasup)
const NotasupModel = mongoose.model('tb_notasup', NotasupSchema)
module.exports = {NotasupModel,NotasupSchema,
    notasupEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await NotasupModel.findByIdAndUpdate(req.body.notasupId, 
            {$set: {
                notasup_planotipo : req.body.notasupPlanotipo,
                notasup_beneidade : req.body.notasupIdade,
                notasup_beneid : req.body.notasupBeneid,
                notasup_convid : req.body.notasupConvid,
                notasup_usuid : req.body.notasupUsuid,
                notasup_notasupdata : req.body.notasupdata,
                notasup_terapeutaid : req.body.notasupTerapeutaid,
                notasup_terapiaid : req.body.notasupTerapiaid,
                notasup_diagnostico : req.body.notasupDiagnostico,
                notasup_histclinico : req.body.notasupHistclinico,
                notasup_metacurto : req.body.notasupMetacurto,
                notasup_metamedio : req.body.notasupMetamedio,
                notasup_metalongo : req.body.notasupMetalongo,
                notasup_objetivo : req.body.notasupObjetivo,
                notasup_dataedi : dataAtual.toISOString()
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
    notasupAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("notasupmodel");
        console.log("req.body.notasupdata:")
        console.log(req.body.notasupdata)
        const NewNotasup = new NotasupModel({
            notasup_planotipo : req.body.notasupPlanotipo,
            notasup_beneidade : req.body.notasupBeneidade,
            notasup_beneid : req.body.notasupBeneid,
            notasup_convid : req.body.notasupConvid,
            notasup_usuid : req.body.notasupUsuid,
            notasup_notasupdata : req.body.notasupdata,
            notasup_terapeutaid : req.body.notasupTerapeutaid,
            notasup_terapiaid : req.body.notasupTerapiaid,
            notasup_num : req.body.nextNum,
            notasup_diagnostico : req.body.notasupDiagnostico,
            notasup_histclinico : req.body.notasupHistclinico,
            notasup_metacurto : req.body.notasupMetacurto,
            notasup_metamedio : req.body.notasupMetamedio,
            notasup_metalongo : req.body.notasupMetalongo,
            notasup_objetivo : req.body.notasupObjetivo,
            notasup_datacad : dataAtual.toISOString()
            
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