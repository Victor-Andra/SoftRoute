const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgSchema = mongoose.Schema({
    prog_planotipo :{
        type: String,
        required: true
    },
    prog_beneid :{
        type: ObjectId,
        required: true
    },
    prog_beneidade :{
        type: String,
        required: false
    },
    prog_convid :{
        type: ObjectId,
        required: true
    },
    prog_usuid :{
        type: String,
        required: true
    },
    prog_progdata :{
        type: Date,
        required: true
    },
    prog_terapeutaid :{
        type: ObjectId,
        required: true
    },
    prog_terapiaid :{
        type: ObjectId,
        required: false
    },
     prog_num :{
        type: Number,
        required: true
    },
    prog_diagnostico :{
        type: String,
        required: false
    },
    prog_histclinico:{
        type: String,
        required: false
    },
    prog_metacurto :{
        type: String,
        required: false
    },
    prog_metamedio :{
        type: String,
        required: false
    },
    prog_metalongo :{
        type: String,
        required: false
    },
    prog_objetivo :{
        type: String,
        required: false
    },
    prog_datacad :{
        type: Date,
        required: false
    },
    prog_dataedi :{
        type: Date,
        required: false
    }
})

class Prog{
    constructor(
        prog_planotipo,
        prog_beneidade,
        prog_beneid,
        prog_convid,
        prog_usuid,
        prog_progdata,
        prog_terapeutaid,
        prog_terapiaid,
        prog_num,
        prog_diagnostico,
        prog_histclinico,
        prog_metacurto,
        prog_metamedio,
        prog_metalongo,
        prog_objetivo,
        prog_datacad,
        prog_dataedi
        ){
        this.prog_planotipo = prog_planotipo,
        this.prog_beneidade = prog_beneidade,
        this.prog_beneid = prog_beneid,
        this.prog_convid = prog_convid,
        this.prog_usuid = prog_usuid,
        this.prog_progdata = prog_progdata,
        this.prog_terapeutaid = prog_terapeutaid,
        this.prog_terapiaid = prog_terapiaid,
        this.prog_num = prog_num,
        this.prog_diagnostico = diagnostico,
        this.prog_histclinico = prog_histclinico,
        this.prog_metacurto = prog_metacurto,
        this.prog_metamedio = prog_metamedio,
        this.prog_metalongo = prog_metalongo,
        this.prog_objetivo = prog_objetivo,
        this.prog_datacad = prog_datacad,
        this.prog_dataedi = prog_dataedi       
    }
}

ProgSchema.loadClass(Prog)
const ProgModel = mongoose.model('tb_prog', ProgSchema)
module.exports = {ProgModel,ProgSchema,
    progEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ProgModel.findByIdAndUpdate(req.body.progId, 
            {$set: {
                prog_planotipo : req.body.progPlanotipo,
                prog_beneidade : req.body.progIdade,
                prog_beneid : req.body.progBeneid,
                prog_convid : req.body.progConvid,
                prog_usuid : req.body.progUsuid,
                prog_progdata : req.body.progdata,
                prog_terapeutaid : req.body.progTerapeutaid,
                prog_terapiaid : req.body.progTerapiaid,
                prog_diagnostico : req.body.progDiagnostico,
                prog_histclinico : req.body.progHistclinico,
                prog_metacurto : req.body.progMetacurto,
                prog_metamedio : req.body.progMetamedio,
                prog_metalongo : req.body.progMetalongo,
                prog_objetivo : req.body.progObjetivo,
                prog_dataedi : dataAtual.toISOString()
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
    progAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("progmodel");
        console.log("req.body.progdata:")
        console.log(req.body.progdata)
        const NewProg = new ProgModel({
            prog_planotipo : req.body.progPlanotipo,
            prog_beneidade : req.body.progBeneidade,
            prog_beneid : req.body.progBeneid,
            prog_convid : req.body.progConvid,
            prog_usuid : req.body.progUsuid,
            prog_progdata : req.body.progdata,
            prog_terapeutaid : req.body.progTerapeutaid,
            prog_terapiaid : req.body.progTerapiaid,
            prog_num : req.body.nextNum,
            prog_diagnostico : req.body.progDiagnostico,
            prog_histclinico : req.body.progHistclinico,
            prog_metacurto : req.body.progMetacurto,
            prog_metamedio : req.body.progMetamedio,
            prog_metalongo : req.body.progMetalongo,
            prog_objetivo : req.body.progObjetivo,
            prog_datacad : dataAtual.toISOString()
            
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