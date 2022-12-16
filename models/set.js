const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SetSchema = mongoose.Schema({
    set_planotipo :{
        type: String,
        required: true
    },
    set_beneid :{
        type: ObjectId,
        required: true
    },
    set_beneidade :{
        type: String,
        required: false
    },
    set_convid :{
        type: ObjectId,
        required: true
    },
    set_usuid :{
        type: String,
        required: true
    },
    set_setdata :{
        type: Date,
        required: true
    },
    set_terapeutaid :{
        type: ObjectId,
        required: true
    },
    set_terapiaid :{
        type: ObjectId,
        required: false
    },
     set_num :{
        type: Number,
        required: true
    },
    set_diagnostico :{
        type: String,
        required: false
    },
    set_histclinico:{
        type: String,
        required: false
    },
    set_metacurto :{
        type: String,
        required: false
    },
    set_metamedio :{
        type: String,
        required: false
    },
    set_metalongo :{
        type: String,
        required: false
    },
    set_objetivo :{
        type: String,
        required: false
    },
    set_datacad :{
        type: Date,
        required: false
    },
    set_dataedi :{
        type: Date,
        required: false
    }
})

class Set{
    constructor(
        set_planotipo,
        set_beneidade,
        set_beneid,
        set_convid,
        set_usuid,
        set_setdata,
        set_terapeutaid,
        set_terapiaid,
        set_num,
        set_diagnostico,
        set_histclinico,
        set_metacurto,
        set_metamedio,
        set_metalongo,
        set_objetivo,
        set_datacad,
        set_dataedi
        ){
        this.set_planotipo = set_planotipo,
        this.set_beneidade = set_beneidade,
        this.set_beneid = set_beneid,
        this.set_convid = set_convid,
        this.set_usuid = set_usuid,
        this.set_setdata = set_setdata,
        this.set_terapeutaid = set_terapeutaid,
        this.set_terapiaid = set_terapiaid,
        this.set_num = set_num,
        this.set_diagnostico = diagnostico,
        this.set_histclinico = set_histclinico,
        this.set_metacurto = set_metacurto,
        this.set_metamedio = set_metamedio,
        this.set_metalongo = set_metalongo,
        this.set_objetivo = set_objetivo,
        this.set_datacad = set_datacad,
        this.set_dataedi = set_dataedi       
    }
}

SetSchema.loadClass(Set)
const SetModel = mongoose.model('tb_set', SetSchema)
module.exports = {SetModel,SetSchema,
    setEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await SetModel.findByIdAndUpdate(req.body.setId, 
            {$set: {
                set_planotipo : req.body.setPlanotipo,
                set_beneidade : req.body.setIdade,
                set_beneid : req.body.setBeneid,
                set_convid : req.body.setConvid,
                set_usuid : req.body.setUsuid,
                set_setdata : req.body.setdata,
                set_terapeutaid : req.body.setTerapeutaid,
                set_terapiaid : req.body.setTerapiaid,
                set_diagnostico : req.body.setDiagnostico,
                set_histclinico : req.body.setHistclinico,
                set_metacurto : req.body.setMetacurto,
                set_metamedio : req.body.setMetamedio,
                set_metalongo : req.body.setMetalongo,
                set_objetivo : req.body.setObjetivo,
                set_dataedi : dataAtual.toISOString()
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
    setAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("setmodel");
        console.log("req.body.setdata:")
        console.log(req.body.setdata)
        const NewSet = new SetModel({
            set_planotipo : req.body.setPlanotipo,
            set_beneidade : req.body.setBeneidade,
            set_beneid : req.body.setBeneid,
            set_convid : req.body.setConvid,
            set_usuid : req.body.setUsuid,
            set_setdata : req.body.setdata,
            set_terapeutaid : req.body.setTerapeutaid,
            set_terapiaid : req.body.setTerapiaid,
            set_num : req.body.nextNum,
            set_diagnostico : req.body.setDiagnostico,
            set_histclinico : req.body.setHistclinico,
            set_metacurto : req.body.setMetacurto,
            set_metamedio : req.body.setMetamedio,
            set_metalongo : req.body.setMetalongo,
            set_objetivo : req.body.setObjetivo,
            set_datacad : dataAtual.toISOString()
            
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