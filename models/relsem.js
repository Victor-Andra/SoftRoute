const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const RelsemSchema = mongoose.Schema({
    relsem_id:{ type: ObjectId, required: false },
    relsem_terapeutaid:{type: ObjectId, required: true},
    relsem_beneid:{type: ObjectId, required: true},
    relsem_data: { type: String, required: false },
    relsem_mes: { type: String, required: false },
    relsem_conselho: { type: String, required: false },
    relsem_terapia: { type: String, required: false },
    relsem_desc: { type: String, required: false },
    //controle
    relsem_datacad: { type: Date, required: false },
    relsem_usuidcad: { type: ObjectId, required: false },
    relsem_dataedi: { type: Date, required: false },
    relsem_usuidedi: { type: ObjectId, required: false },
    
})

class Relsem{
    constructor(
        relsem_id,
        relsem_terapeutaid,
        relsem_beneid,
        relsem_data, 
        relsem_mes, 
        relsem_conselho,
        relsem_terapia, 
        relsem_desc, 
        relsem_datacad, 
        relsem_usuidcad, 
        relsem_dataedi, 
        relsem_usuidedi 
   
         ){
            this.relsem_id = relsem_id,
            this.relsem_terapeutaid = relsem_terapeutaid, 
            this.relsem_beneid = relsem_beneid, //Ok
            this.relsem_data = relsem_data, //Ok
            this.relsem_mes = relsem_mes,
            this.relsem_conselho = relsem_conselho,
            this.relsem_terapia = relsem_terapia,
            this.relsem_desc = relsem_desc,
            this.relsem_datacad = relsem_datacad,
            this.relsem_usuidcad = relsem_usuidcad,
            this.relsem_dataedi = relsem_dataedi,
            this.relsem_usuidedi = relsem_usuidedi

    }
}

RelsemSchema.loadClass(Relsem)
const RelsemModel = mongoose.model('tb_relsem', RelsemSchema)
module.exports = {RelsemModel,RelsemSchema,
    relsemEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let usuarioAtual = req.cookies['idUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let relsemId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("relsemId:"+relsemId)
        //Realiza Atualização
        await RelsemModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                relsem_data : req.body.relsemData,
                relsem_mes : req.body.relsemMes,
                relsem_conselho : req.body.relsemConselho,
                relsem_terapia : req.body.relsemTerapia,
                relsem_desc : req.body.relsemDesc,
                relsem_dataedi : dataAtual, 
                relsem_usuidedi : usuarioAtual
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
    relsemAdicionar: async (req,res) => {
        //Validar se a Relsemese existe
        console.log("relsemmodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let usuarioAtual = req.cookies['idUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newRelsem = new RelsemModel({
            relsem_id: req.body.relsemId,
            relsem_terapeutaid : usuarioAtual,
            relsem_beneid : req.body.relsemBeneid,
            relsem_data : req.body.relsemData,
            relsem_mes : req.body.relsemMes,
            relsem_conselho : req.body.relsemConselho,
            relsem_terapia : req.body.relsemTerapia,
            relsem_desc : req.body.relsemDesc,
            relsem_datacad : dataAtual, 
            relsem_usuidcad : usuarioAtual
                
        });
        console.log("newRelsem save");
        await newRelsem.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};