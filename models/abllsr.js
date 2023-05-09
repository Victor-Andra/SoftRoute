const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AbllsrSchema = mongoose.Schema({
    abllsr_beneid :{
        type: ObjectId,
        required: false
    },
    abllsr_usuid :{
        type: ObjectId,
        required: false
    },
    abllsr_tipo :{
        type: String,
        required: false
    },   
    abllsr_medico :{
        type: String,
        required: false
    },
    abllsr_abllsrdata :{
        type: Date,
        required: false
    },
    abllsr_datacad :{
        type: Date,
        required: false
    },
    abllsr_dataedi :{
        type: Date,
        required: false
    }
})

class Abllsr{
    constructor(
        abllsr_beneid,
        abllsr_usuid,
        abllsr_tipo,   
        abllsr_medico,
        abllsr_abllsrdata,
        abllsr_datacad,
        abllsr_dataedi
        ){
        this.abllsr_beneid = abllsr_beneid,
        this.abllsr_usuid = abllsr_usuid,
        this.abllsr_tipo = abllsr_tipo,   
        this.abllsr_medico = abllsr_medico,
        this.abllsr_abllsrdata = abllsr_abllsrdata,
        this.abllsr_datacad = abllsr_datacad,
        this.abllsr_dataedi = abllsr_dataedi       
    }
}

AbllsrSchema.loadClass(Abllsr)
const AbllsrModel = mongoose.model('tb_abllsr', AbllsrSchema)
module.exports = {AbllsrModel,AbllsrSchema,
    abllsrEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AbllsrModel.findByIdAndUpdate(req.body.abllsrId, 
            {$set: {
                abllsr_beneid : req.body.abllsrBeneid,
                abllsr_usuid: req.body.abllsrUsuid,
                abllsr_tipo: req.body.abllsrTipo,   
                abllsr_medico: req.body.abllsrMedico,
                abllsr_abllsrdata: req.body.abllsrAbllsrdata,
                abllsr_dataedi : dataAtual.toISOString()
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
    abllsrAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("abllsrmodel");
        console.log("req.body.abllsrdata:")
        console.log(req.body.abllsrdata)
        const newAbllsr = new AbllsrModel({
            abllsr_beneid : req.body.abllsrBeneid,
            abllsr_usuid: req.body.abllsrUsuid,
            abllsr_tipo: req.body.abllsrTipo,   
            abllsr_medico: req.body.abllsrMedico,
            abllsr_abllsrdata: req.body.abllsrAbllsrdata,
            abllsr_datacad : dataAtual.toISOString()
        });
        console.log("newAbllsr save");
        await newAbllsr.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};