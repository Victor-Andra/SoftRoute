const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const MappSchema = mongoose.Schema({
    mapp_beneid :{
        type: ObjectId,
        required: false
    },
    mapp_usuid :{
        type: ObjectId,
        required: false
    },
    mapp_tipo :{
        type: String,
        required: false
    },   
    mapp_medico :{
        type: String,
        required: false
    },
    mapp_mappdata :{
        type: Date,
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
        mapp_beneid,
        mapp_usuid,
        mapp_tipo,   
        mapp_medico,
        mapp_mappdata,
        mapp_datacad,
        mapp_dataedi
        ){
        this.mapp_beneid = mapp_beneid,
        this.mapp_usuid = mapp_usuid,
        this.mapp_tipo = mapp_tipo,   
        this.mapp_medico = mapp_medico,
        this.mapp_mappdata = mapp_mappdata,
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
                mapp_beneid : req.body.mappBeneid,
                mapp_usuid: req.body.mappUsuid,
                mapp_tipo: req.body.mappTipo,   
                mapp_medico: req.body.mappMedico,
                mapp_mappdata: req.body.mappMappdata,
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
        const newMapp = new MappModel({
            mapp_beneid : req.body.mappBeneid,
            mapp_usuid: req.body.mappUsuid,
            mapp_tipo: req.body.mappTipo,   
            mapp_medico: req.body.mappMedico,
            mapp_mappdata: req.body.mappMappdata,
            mapp_datacad : dataAtual.toISOString()
        });
        console.log("newMapp save");
        await newMapp.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};