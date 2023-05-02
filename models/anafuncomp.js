const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AnafuncompSchema = mongoose.Schema({
    anafuncomp_planotipo :{
        type: String,
        required: true
    },
    anafuncomp_beneid :{
        type: ObjectId,
        required: true
    },
    anafuncomp_beneidade :{
        type: String,
        required: false
    },
    anafuncomp_convid :{
        type: ObjectId,
        required: true
    },
    anafuncomp_usuid :{
        type: String,
        required: true
    },
    anafuncomp_anafuncompdata :{
        type: Date,
        required: true
    },
    anafuncomp_terapeutaid :{
        type: ObjectId,
        required: true
    },
    anafuncomp_terapiaid :{
        type: ObjectId,
        required: false
    },
     anafuncomp_num :{
        type: Number,
        required: true
    },
    anafuncomp_diagnostico :{
        type: String,
        required: false
    },
    anafuncomp_histclinico:{
        type: String,
        required: false
    },
    anafuncomp_metacurto :{
        type: String,
        required: false
    },
    anafuncomp_metamedio :{
        type: String,
        required: false
    },
    anafuncomp_metalongo :{
        type: String,
        required: false
    },
    anafuncomp_objetivo :{
        type: String,
        required: false
    },
    anafuncomp_datacad :{
        type: Date,
        required: false
    },
    anafuncomp_dataedi :{
        type: Date,
        required: false
    }
})

class Anafuncomp{
    constructor(
        anafuncomp_planotipo,
        anafuncomp_beneidade,
        anafuncomp_beneid,
        anafuncomp_convid,
        anafuncomp_usuid,
        anafuncomp_anafuncompdata,
        anafuncomp_terapeutaid,
        anafuncomp_terapiaid,
        anafuncomp_num,
        anafuncomp_diagnostico,
        anafuncomp_histclinico,
        anafuncomp_metacurto,
        anafuncomp_metamedio,
        anafuncomp_metalongo,
        anafuncomp_objetivo,
        anafuncomp_datacad,
        anafuncomp_dataedi
        ){
        this.anafuncomp_planotipo = anafuncomp_planotipo,
        this.anafuncomp_beneidade = anafuncomp_beneidade,
        this.anafuncomp_beneid = anafuncomp_beneid,
        this.anafuncomp_convid = anafuncomp_convid,
        this.anafuncomp_usuid = anafuncomp_usuid,
        this.anafuncomp_anafuncompdata = anafuncomp_anafuncompdata,
        this.anafuncomp_terapeutaid = anafuncomp_terapeutaid,
        this.anafuncomp_terapiaid = anafuncomp_terapiaid,
        this.anafuncomp_num = anafuncomp_num,
        this.anafuncomp_diagnostico = diagnostico,
        this.anafuncomp_histclinico = anafuncomp_histclinico,
        this.anafuncomp_metacurto = anafuncomp_metacurto,
        this.anafuncomp_metamedio = anafuncomp_metamedio,
        this.anafuncomp_metalongo = anafuncomp_metalongo,
        this.anafuncomp_objetivo = anafuncomp_objetivo,
        this.anafuncomp_datacad = anafuncomp_datacad,
        this.anafuncomp_dataedi = anafuncomp_dataedi       
    }
}

AnafuncompSchema.loadClass(Anafuncomp)
const AnafuncompModel = mongoose.model('tb_anafuncomp', AnafuncompSchema)
module.exports = {AnafuncompModel,AnafuncompSchema,
    anafuncompEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AnafuncompModel.findByIdAndUpdate(req.body.anafuncompId, 
            {$set: {
                anafuncomp_planotipo : req.body.anafuncompPlanotipo,
                anafuncomp_beneidade : req.body.anafuncompIdade,
                anafuncomp_beneid : req.body.anafuncompBeneid,
                anafuncomp_convid : req.body.anafuncompConvid,
                anafuncomp_usuid : req.body.anafuncompUsuid,
                anafuncomp_anafuncompdata : req.body.anafuncompdata,
                anafuncomp_terapeutaid : req.body.anafuncompTerapeutaid,
                anafuncomp_terapiaid : req.body.anafuncompTerapiaid,
                anafuncomp_diagnostico : req.body.anafuncompDiagnostico,
                anafuncomp_histclinico : req.body.anafuncompHistclinico,
                anafuncomp_metacurto : req.body.anafuncompMetacurto,
                anafuncomp_metamedio : req.body.anafuncompMetamedio,
                anafuncomp_metalongo : req.body.anafuncompMetalongo,
                anafuncomp_objetivo : req.body.anafuncompObjetivo,
                anafuncomp_dataedi : dataAtual.toISOString()
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
    anafuncompAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("anafuncompmodel");
        console.log("req.body.anafuncompdata:")
        console.log(req.body.anafuncompdata)
        const NewAnafuncomp = new AnafuncompModel({
            anafuncomp_planotipo : req.body.anafuncompPlanotipo,
            anafuncomp_beneidade : req.body.anafuncompBeneidade,
            anafuncomp_beneid : req.body.anafuncompBeneid,
            anafuncomp_convid : req.body.anafuncompConvid,
            anafuncomp_usuid : req.body.anafuncompUsuid,
            anafuncomp_anafuncompdata : req.body.anafuncompdata,
            anafuncomp_terapeutaid : req.body.anafuncompTerapeutaid,
            anafuncomp_terapiaid : req.body.anafuncompTerapiaid,
            anafuncomp_num : req.body.nextNum,
            anafuncomp_diagnostico : req.body.anafuncompDiagnostico,
            anafuncomp_histclinico : req.body.anafuncompHistclinico,
            anafuncomp_metacurto : req.body.anafuncompMetacurto,
            anafuncomp_metamedio : req.body.anafuncompMetamedio,
            anafuncomp_metalongo : req.body.anafuncompMetalongo,
            anafuncomp_objetivo : req.body.anafuncompObjetivo,
            anafuncomp_datacad : dataAtual.toISOString()
            
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