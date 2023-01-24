const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const LaudoSchema = mongoose.Schema({
    laudo_beneid :{
        type: ObjectId,
        required: false
    },
    laudo_usuid :{
        type: ObjectId,
        required: false
    },
    laudo_tipo :{
        type: String,
        required: false
    },   
    laudo_medico :{
        type: String,
        required: false
    },
    laudo_laudodata :{
        type: Date,
        required: false
    },
    laudo_datacad :{
        type: Date,
        required: false
    },
    laudo_dataedi :{
        type: Date,
        required: false
    }
})

class Laudo{
    constructor(
        laudo_beneid,
        laudo_usuid,
        laudo_tipo,   
        laudo_medico,
        laudo_laudodata,
        laudo_datacad,
        laudo_dataedi
        ){
        this.laudo_beneid = laudo_beneid,
        this.laudo_usuid = laudo_usuid,
        this.laudo_tipo = laudo_tipo,   
        this.laudo_medico = laudo_medico,
        this.laudo_laudodata = laudo_laudodata,
        this.laudo_datacad = laudo_datacad,
        this.laudo_dataedi = laudo_dataedi       
    }
}

LaudoSchema.loadClass(Laudo)
const LaudoModel = mongoose.model('tb_laudo', LaudoSchema)
module.exports = {LaudoModel,LaudoSchema,
    laudoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await LaudoModel.findByIdAndUpdate(req.body.laudoId, 
            {$set: {
                laudo_beneid : req.body.laudoBeneid,
                laudo_usuid: req.body.laudoUsuid,
                laudo_tipo: req.body.laudoTipo,   
                laudo_medico: req.body.laudoMedico,
                laudo_laudodata: req.body.laudoLaudodata,
                laudo_dataedi : dataAtual.toISOString()
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
    laudoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("laudomodel");
        console.log("req.body.laudodata:")
        console.log(req.body.laudodata)
        const newLaudo = new LaudoModel({
            laudo_beneid : req.body.laudoBeneid,
            laudo_usuid: req.body.laudoUsuid,
            laudo_tipo: req.body.laudoTipo,   
            laudo_medico: req.body.laudoMedico,
            laudo_laudodata: req.body.laudoLaudodata,
            laudo_datacad : dataAtual.toISOString()
        });
        console.log("newLaudo save");
        await newLaudo.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};