const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const MappSchema = mongoose.Schema({
    mapp_planotipo :{
        type: String,
        required: true
    },
    mapp_beneid :{
        type: ObjectId,
        required: true
    },
    mapp_beneidade :{
        type: String,
        required: false
    },
    mapp_convid :{
        type: ObjectId,
        required: true
    },
    mapp_usuid :{
        type: String,
        required: true
    },
    mapp_mappdata :{
        type: Date,
        required: true
    },
    mapp_terapeutaid :{
        type: ObjectId,
        required: true
    },
    mapp_terapiaid :{
        type: ObjectId,
        required: false
    },
     mapp_num :{
        type: Number,
        required: true
    },
    mapp_diagnostico :{
        type: String,
        required: false
    },
    mapp_histclinico:{
        type: String,
        required: false
    },
    mapp_metacurto :{
        type: String,
        required: false
    },
    mapp_metamedio :{
        type: String,
        required: false
    },
    mapp_metalongo :{
        type: String,
        required: false
    },
    mapp_objetivo :{
        type: String,
        required: false
    },
    mapp_datacad :{
        type: Date,
        required: false
    },
    mapp_dataedi :{
        type: Date,
        required: false
    }
})

class Mapp{
    constructor(
        mapp_planotipo,
        mapp_beneidade,
        mapp_beneid,
        mapp_convid,
        mapp_usuid,
        mapp_mappdata,
        mapp_terapeutaid,
        mapp_terapiaid,
        mapp_num,
        mapp_diagnostico,
        mapp_histclinico,
        mapp_metacurto,
        mapp_metamedio,
        mapp_metalongo,
        mapp_objetivo,
        mapp_datacad,
        mapp_dataedi
        ){
        this.mapp_planotipo = mapp_planotipo,
        this.mapp_beneidade = mapp_beneidade,
        this.mapp_beneid = mapp_beneid,
        this.mapp_convid = mapp_convid,
        this.mapp_usuid = mapp_usuid,
        this.mapp_mappdata = mapp_mappdata,
        this.mapp_terapeutaid = mapp_terapeutaid,
        this.mapp_terapiaid = mapp_terapiaid,
        this.mapp_num = mapp_num,
        this.mapp_diagnostico = diagnostico,
        this.mapp_histclinico = mapp_histclinico,
        this.mapp_metacurto = mapp_metacurto,
        this.mapp_metamedio = mapp_metamedio,
        this.mapp_metalongo = mapp_metalongo,
        this.mapp_objetivo = mapp_objetivo,
        this.mapp_datacad = mapp_datacad,
        this.mapp_dataedi = mapp_dataedi       
    }
}

MappSchema.loadClass(Mapp)
const MappModel = mongoose.model('tb_mapp', MappSchema)
module.exports = {MappModel,MappSchema,
    mappEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await MappModel.findByIdAndUpdate(req.body.mappId, 
            {$set: {
                mapp_planotipo : req.body.mappPlanotipo,
                mapp_beneidade : req.body.mappIdade,
                mapp_beneid : req.body.mappBeneid,
                mapp_convid : req.body.mappConvid,
                mapp_usuid : req.body.mappUsuid,
                mapp_mappdata : req.body.mappdata,
                mapp_terapeutaid : req.body.mappTerapeutaid,
                mapp_terapiaid : req.body.mappTerapiaid,
                mapp_diagnostico : req.body.mappDiagnostico,
                mapp_histclinico : req.body.mappHistclinico,
                mapp_metacurto : req.body.mappMetacurto,
                mapp_metamedio : req.body.mappMetamedio,
                mapp_metalongo : req.body.mappMetalongo,
                mapp_objetivo : req.body.mappObjetivo,
                mapp_dataedi : dataAtual.toISOString()
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
    mappAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("mappmodel");
        console.log("req.body.mappdata:")
        console.log(req.body.mappdata)
        const NewMapp = new MappModel({
            mapp_planotipo : req.body.mappPlanotipo,
            mapp_beneidade : req.body.mappBeneidade,
            mapp_beneid : req.body.mappBeneid,
            mapp_convid : req.body.mappConvid,
            mapp_usuid : req.body.mappUsuid,
            mapp_mappdata : req.body.mappdata,
            mapp_terapeutaid : req.body.mappTerapeutaid,
            mapp_terapiaid : req.body.mappTerapiaid,
            mapp_num : req.body.nextNum,
            mapp_diagnostico : req.body.mappDiagnostico,
            mapp_histclinico : req.body.mappHistclinico,
            mapp_metacurto : req.body.mappMetacurto,
            mapp_metamedio : req.body.mappMetamedio,
            mapp_metalongo : req.body.mappMetalongo,
            mapp_objetivo : req.body.mappObjetivo,
            mapp_datacad : dataAtual.toISOString()
            
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