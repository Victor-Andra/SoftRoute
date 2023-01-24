const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EvolSchema = mongoose.Schema({
    evol_beneid :{
        type: ObjectId,
        required: false
    },
    evol_usuid :{
        type: ObjectId,
        required: false
    },
    evol_tipo :{
        type: String,
        required: false
    },   
    evol_medico :{
        type: String,
        required: false
    },
    evol_evoldata :{
        type: Date,
        required: false
    },
    evol_datacad :{
        type: Date,
        required: false
    },
    evol_dataedi :{
        type: Date,
        required: false
    }
})

class Evol{
    constructor(
        evol_beneid,
        evol_usuid,
        evol_tipo,   
        evol_medico,
        evol_evoldata,
        evol_datacad,
        evol_dataedi
        ){
        this.evol_beneid = evol_beneid,
        this.evol_usuid = evol_usuid,
        this.evol_tipo = evol_tipo,   
        this.evol_medico = evol_medico,
        this.evol_evoldata = evol_evoldata,
        this.evol_datacad = evol_datacad,
        this.evol_dataedi = evol_dataedi       
    }
}

EvolSchema.loadClass(Evol)
const EvolModel = mongoose.model('tb_evol', EvolSchema)
module.exports = {EvolModel,EvolSchema,
    evolEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EvolModel.findByIdAndUpdate(req.body.evolId, 
            {$set: {
                evol_beneid : req.body.evolBeneid,
                evol_usuid: req.body.evolUsuid,
                evol_tipo: req.body.evolTipo,   
                evol_medico: req.body.evolMedico,
                evol_evoldata: req.body.evolEvoldata,
                evol_dataedi : dataAtual.toISOString()
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
    evolAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("evolmodel");
        console.log("req.body.evoldata:")
        console.log(req.body.evoldata)
        const newEvol = new EvolModel({
            evol_beneid : req.body.evolBeneid,
            evol_usuid: req.body.evolUsuid,
            evol_tipo: req.body.evolTipo,   
            evol_medico: req.body.evolMedico,
            evol_evoldata: req.body.evolEvoldata,
            evol_datacad : dataAtual.toISOString()
        });
        console.log("newEvol save");
        await newEvol.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};