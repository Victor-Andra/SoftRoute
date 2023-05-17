const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AtaSchema = mongoose.Schema({
    ata_planotipo :{
        type: String,
        required: true
    },
    ata_beneid :{
        type: ObjectId,
        required: true
    },
    ata_beneidade :{
        type: String,
        required: false
    },
    ata_convid :{
        type: ObjectId,
        required: true
    },
    ata_usuid :{
        type: String,
        required: true
    },
    ata_atadata :{
        type: Date,
        required: true
    },
    ata_terapeutaid :{
        type: ObjectId,
        required: true
    },
    ata_terapiaid :{
        type: ObjectId,
        required: false
    },
     ata_num :{
        type: Number,
        required: true
    },
    ata_diagnostico :{
        type: String,
        required: false
    },
    ata_histclinico:{
        type: String,
        required: false
    },
    ata_metacurto :{
        type: String,
        required: false
    },
    ata_metamedio :{
        type: String,
        required: false
    },
    ata_metalongo :{
        type: String,
        required: false
    },
    ata_objetivo :{
        type: String,
        required: false
    },
    ata_datacad :{
        type: Date,
        required: false
    },
    ata_dataedi :{
        type: Date,
        required: false
    }
})

class Ata{
    constructor(
        ata_planotipo,
        ata_beneidade,
        ata_beneid,
        ata_convid,
        ata_usuid,
        ata_atadata,
        ata_terapeutaid,
        ata_terapiaid,
        ata_num,
        ata_diagnostico,
        ata_histclinico,
        ata_metacurto,
        ata_metamedio,
        ata_metalongo,
        ata_objetivo,
        ata_datacad,
        ata_dataedi
        ){
        this.ata_planotipo = ata_planotipo,
        this.ata_beneidade = ata_beneidade,
        this.ata_beneid = ata_beneid,
        this.ata_convid = ata_convid,
        this.ata_usuid = ata_usuid,
        this.ata_atadata = ata_atadata,
        this.ata_terapeutaid = ata_terapeutaid,
        this.ata_terapiaid = ata_terapiaid,
        this.ata_num = ata_num,
        this.ata_diagnostico = diagnostico,
        this.ata_histclinico = ata_histclinico,
        this.ata_metacurto = ata_metacurto,
        this.ata_metamedio = ata_metamedio,
        this.ata_metalongo = ata_metalongo,
        this.ata_objetivo = ata_objetivo,
        this.ata_datacad = ata_datacad,
        this.ata_dataedi = ata_dataedi       
    }
}

AtaSchema.loadClass(Ata)
const AtaModel = mongoose.model('tb_ata', AtaSchema)
module.exports = {AtaModel,AtaSchema,
    ataEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AtaModel.findByIdAndUpdate(req.body.ataId, 
            {$ata: {
                ata_planotipo : req.body.ataPlanotipo,
                ata_beneidade : req.body.ataIdade,
                ata_beneid : req.body.ataBeneid,
                ata_convid : req.body.ataConvid,
                ata_usuid : req.body.ataUsuid,
                ata_atadata : req.body.atadata,
                ata_terapeutaid : req.body.ataTerapeutaid,
                ata_terapiaid : req.body.ataTerapiaid,
                ata_diagnostico : req.body.ataDiagnostico,
                ata_histclinico : req.body.ataHistclinico,
                ata_metacurto : req.body.ataMetacurto,
                ata_metamedio : req.body.ataMetamedio,
                ata_metalongo : req.body.ataMetalongo,
                ata_objetivo : req.body.ataObjetivo,
                ata_dataedi : dataAtual.toISOString()
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
    ataAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("atamodel");
        console.log("req.body.atadata:")
        console.log(req.body.atadata)
        const NewAta = new AtaModel({
            ata_planotipo : req.body.ataPlanotipo,
            ata_beneidade : req.body.ataBeneidade,
            ata_beneid : req.body.ataBeneid,
            ata_convid : req.body.ataConvid,
            ata_usuid : req.body.ataUsuid,
            ata_atadata : req.body.atadata,
            ata_terapeutaid : req.body.ataTerapeutaid,
            ata_terapiaid : req.body.ataTerapiaid,
            ata_num : req.body.nextNum,
            ata_diagnostico : req.body.ataDiagnostico,
            ata_histclinico : req.body.ataHistclinico,
            ata_metacurto : req.body.ataMetacurto,
            ata_metamedio : req.body.ataMetamedio,
            ata_metalongo : req.body.ataMetalongo,
            ata_objetivo : req.body.ataObjetivo,
            ata_datacad : dataAtual.toISOString()
            
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