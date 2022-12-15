const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const BordoSchema = mongoose.Schema({
    bordo_planotipo :{
        type: String,
        required: true
    },
    bordo_beneid :{
        type: ObjectId,
        required: true
    },
    bordo_beneidade :{
        type: String,
        required: false
    },
    bordo_convid :{
        type: ObjectId,
        required: true
    },
    bordo_usuid :{
        type: String,
        required: true
    },
    bordo_bordodata :{
        type: Date,
        required: true
    },
    bordo_terapeutaid :{
        type: ObjectId,
        required: true
    },
    bordo_terapiaid :{
        type: ObjectId,
        required: false
    },
     bordo_num :{
        type: Number,
        required: true
    },
    bordo_diagnostico :{
        type: String,
        required: false
    },
    bordo_histclinico:{
        type: String,
        required: false
    },
    bordo_metacurto :{
        type: String,
        required: false
    },
    bordo_metamedio :{
        type: String,
        required: false
    },
    bordo_metalongo :{
        type: String,
        required: false
    },
    bordo_objetivo :{
        type: String,
        required: false
    },
    bordo_datacad :{
        type: Date,
        required: false
    },
    bordo_dataedi :{
        type: Date,
        required: false
    }
})

class Bordo{
    constructor(
        bordo_planotipo,
        bordo_beneidade,
        bordo_beneid,
        bordo_convid,
        bordo_usuid,
        bordo_bordodata,
        bordo_terapeutaid,
        bordo_terapiaid,
        bordo_num,
        bordo_diagnostico,
        bordo_histclinico,
        bordo_metacurto,
        bordo_metamedio,
        bordo_metalongo,
        bordo_objetivo,
        bordo_datacad,
        bordo_dataedi
        ){
        this.bordo_planotipo = bordo_planotipo,
        this.bordo_beneidade = bordo_beneidade,
        this.bordo_beneid = bordo_beneid,
        this.bordo_convid = bordo_convid,
        this.bordo_usuid = bordo_usuid,
        this.bordo_bordodata = bordo_bordodata,
        this.bordo_terapeutaid = bordo_terapeutaid,
        this.bordo_terapiaid = bordo_terapiaid,
        this.bordo_num = bordo_num,
        this.bordo_diagnostico = diagnostico,
        this.bordo_histclinico = bordo_histclinico,
        this.bordo_metacurto = bordo_metacurto,
        this.bordo_metamedio = bordo_metamedio,
        this.bordo_metalongo = bordo_metalongo,
        this.bordo_objetivo = bordo_objetivo,
        this.bordo_datacad = bordo_datacad,
        this.bordo_dataedi = bordo_dataedi       
    }
}

BordoSchema.loadClass(Bordo)
const BordoModel = mongoose.model('tb_bordo', BordoSchema)
module.exports = {BordoModel,BordoSchema,
    bordoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await BordoModel.findByIdAndUpdate(req.body.bordoId, 
            {$set: {
                bordo_planotipo : req.body.bordoPlanotipo,
                bordo_beneidade : req.body.bordoIdade,
                bordo_beneid : req.body.bordoBeneid,
                bordo_convid : req.body.bordoConvid,
                bordo_usuid : req.body.bordoUsuid,
                bordo_bordodata : req.body.bordodata,
                bordo_terapeutaid : req.body.bordoTerapeutaid,
                bordo_terapiaid : req.body.bordoTerapiaid,
                bordo_diagnostico : req.body.bordoDiagnostico,
                bordo_histclinico : req.body.bordoHistclinico,
                bordo_metacurto : req.body.bordoMetacurto,
                bordo_metamedio : req.body.bordoMetamedio,
                bordo_metalongo : req.body.bordoMetalongo,
                bordo_objetivo : req.body.bordoObjetivo,
                bordo_dataedi : dataAtual.toISOString()
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
    bordoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("bordomodel");
        console.log("req.body.bordodata:")
        console.log(req.body.bordodata)
        const NewBordo = new BordoModel({
            bordo_planotipo : req.body.bordoPlanotipo,
            bordo_beneidade : req.body.bordoBeneidade,
            bordo_beneid : req.body.bordoBeneid,
            bordo_convid : req.body.bordoConvid,
            bordo_usuid : req.body.bordoUsuid,
            bordo_bordodata : req.body.bordodata,
            bordo_terapeutaid : req.body.bordoTerapeutaid,
            bordo_terapiaid : req.body.bordoTerapiaid,
            bordo_num : req.body.nextNum,
            bordo_diagnostico : req.body.bordoDiagnostico,
            bordo_histclinico : req.body.bordoHistclinico,
            bordo_metacurto : req.body.bordoMetacurto,
            bordo_metamedio : req.body.bordoMetamedio,
            bordo_metalongo : req.body.bordoMetalongo,
            bordo_objetivo : req.body.bordoObjetivo,
            bordo_datacad : dataAtual.toISOString()
            
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