const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const FolregSchema = mongoose.Schema({
    folreg_planotipo :{
        type: String,
        required: true
    },
    folreg_beneid :{
        type: ObjectId,
        required: true
    },
    folreg_beneidade :{
        type: String,
        required: false
    },
    folreg_convid :{
        type: ObjectId,
        required: true
    },
    folreg_usuid :{
        type: String,
        required: true
    },
    folreg_folregdata :{
        type: Date,
        required: true
    },
    folreg_terapeutaid :{
        type: ObjectId,
        required: true
    },
    folreg_terapiaid :{
        type: ObjectId,
        required: false
    },
     folreg_num :{
        type: Number,
        required: true
    },
    folreg_diagnostico :{
        type: String,
        required: false
    },
    folreg_histclinico:{
        type: String,
        required: false
    },
    folreg_metacurto :{
        type: String,
        required: false
    },
    folreg_metamedio :{
        type: String,
        required: false
    },
    folreg_metalongo :{
        type: String,
        required: false
    },
    folreg_objetivo :{
        type: String,
        required: false
    },
    folreg_datacad :{
        type: Date,
        required: false
    },
    folreg_dataedi :{
        type: Date,
        required: false
    }
})

class Folreg{
    constructor(
        folreg_planotipo,
        folreg_beneidade,
        folreg_beneid,
        folreg_convid,
        folreg_usuid,
        folreg_folregdata,
        folreg_terapeutaid,
        folreg_terapiaid,
        folreg_num,
        folreg_diagnostico,
        folreg_histclinico,
        folreg_metacurto,
        folreg_metamedio,
        folreg_metalongo,
        folreg_objetivo,
        folreg_datacad,
        folreg_dataedi
        ){
        this.folreg_planotipo = folreg_planotipo,
        this.folreg_beneidade = folreg_beneidade,
        this.folreg_beneid = folreg_beneid,
        this.folreg_convid = folreg_convid,
        this.folreg_usuid = folreg_usuid,
        this.folreg_folregdata = folreg_folregdata,
        this.folreg_terapeutaid = folreg_terapeutaid,
        this.folreg_terapiaid = folreg_terapiaid,
        this.folreg_num = folreg_num,
        this.folreg_diagnostico = diagnostico,
        this.folreg_histclinico = folreg_histclinico,
        this.folreg_metacurto = folreg_metacurto,
        this.folreg_metamedio = folreg_metamedio,
        this.folreg_metalongo = folreg_metalongo,
        this.folreg_objetivo = folreg_objetivo,
        this.folreg_datacad = folreg_datacad,
        this.folreg_dataedi = folreg_dataedi       
    }
}

FolregSchema.loadClass(Folreg)
const FolregModel = mongoose.model('tb_folreg', FolregSchema)
module.exports = {FolregModel,FolregSchema,
    folregEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await FolregModel.findByIdAndUpdate(req.body.folregId, 
            {$set: {
                folreg_planotipo : req.body.folregPlanotipo,
                folreg_beneidade : req.body.folregIdade,
                folreg_beneid : req.body.folregBeneid,
                folreg_convid : req.body.folregConvid,
                folreg_usuid : req.body.folregUsuid,
                folreg_folregdata : req.body.folregdata,
                folreg_terapeutaid : req.body.folregTerapeutaid,
                folreg_terapiaid : req.body.folregTerapiaid,
                folreg_diagnostico : req.body.folregDiagnostico,
                folreg_histclinico : req.body.folregHistclinico,
                folreg_metacurto : req.body.folregMetacurto,
                folreg_metamedio : req.body.folregMetamedio,
                folreg_metalongo : req.body.folregMetalongo,
                folreg_objetivo : req.body.folregObjetivo,
                folreg_dataedi : dataAtual.toISOString()
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
    folregAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("folregmodel");
        console.log("req.body.folregdata:")
        console.log(req.body.folregdata)
        const NewFolreg = new FolregModel({
            folreg_planotipo : req.body.folregPlanotipo,
            folreg_beneidade : req.body.folregBeneidade,
            folreg_beneid : req.body.folregBeneid,
            folreg_convid : req.body.folregConvid,
            folreg_usuid : req.body.folregUsuid,
            folreg_folregdata : req.body.folregdata,
            folreg_terapeutaid : req.body.folregTerapeutaid,
            folreg_terapiaid : req.body.folregTerapiaid,
            folreg_num : req.body.nextNum,
            folreg_diagnostico : req.body.folregDiagnostico,
            folreg_histclinico : req.body.folregHistclinico,
            folreg_metacurto : req.body.folregMetacurto,
            folreg_metamedio : req.body.folregMetamedio,
            folreg_metalongo : req.body.folregMetalongo,
            folreg_objetivo : req.body.folregObjetivo,
            folreg_datacad : dataAtual.toISOString()
            
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