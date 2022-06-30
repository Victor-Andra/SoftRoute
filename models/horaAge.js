const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const HoraageSchema = mongoose.Schema({
    horaage_hora: {
        type: String,
        required: true
    },
    horaage_ordem: {
        type: String,
        required: true
    },
    horaage_turno: {
        type: String,
        required: true
    },
    horaage_status: {
        type: String,
        required: true
    },  
    horaage_datacad: {
        type: Date
    },
    horaage_dataedi: {
        type: Date
    }
    
})

class Horaage{
    constructor(horaage_hora, horaage_ordem, horaage_turno, horaage_status, horaage_datacad, horaage_dataedi){
        this.horaage_hora = horaage_hora,
        this.horaage_ordem = horaage_ordem,
        this.horaage_turno = horaage_turno,
        this.horaage_status = horaage_status,
        this.horaage_datacad = horaage_datacad,
        this.horaage_dataedi = horaage_dataedi
    }
}

HoraageSchema.loadClass(Horaage)
const HoraageModel = mongoose.model('tb_horaage', HoraageSchema)
module.exports = {HoraageModel,HoraageSchema,
    horaageEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await HoraageModel.findByIdAndUpdate(req.body.horaageId, 
            {$set: {
                horaage_hora: req.body.horaageHora,
                horaage_ordem: req.body.horaageOrdem,
                horaage_turno: req.body.horaageTurno,
                horaage_status: req.body.horaageStatus,
                horaage_dataedi: dataAtual
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },






    horaageAdicionar: async (req,res) => {
        let horaageExiste =  await HoraageModel.findOne({horaage_hora: req.body.horaageHora});//quando não acha fica null
        let dataAtual = new Date();
        if(horaageExiste){//se tiver null cai no else
            return "O nome da horaage já existe";
        } else {
            console.log("horaagemodel");
            const newHoraage = new HoraageModel({
                horaage_hora: req.body.horaageHora,
                horaage_ordem: req.body.horaageOrdem,
                horaage_turno: req.body.horaageTurno,
                horaage_status: req.body.horaageStatus,
                horaage_datacad: dataAtual
            });
            console.log("newHoraage save");
            await newHoraage.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};