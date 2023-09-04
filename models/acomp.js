const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AcompSchema = mongoose.Schema({
    acomp_id:{ type: ObjectId, required: false },
    acomp_terapeutaid:{type: ObjectId, required: true},
    acomp_beneid:{type: ObjectId, required: true},
    acomp_data: { type: String, required: false },
    acomp_mes: { type: String, required: false },
    acomp_tipo: { type: String, required: false },
    acomp_resp: { type: String, required: false },
    acomp_andamento: { type: String, required: false },
    //controle
    acomp_datacad: { type: Date, required: false },
    acomp_usuidcad: { type: ObjectId, required: false },
    acomp_dataedi: { type: Date, required: false },
    acomp_usuidedi: { type: ObjectId, required: false },
    
})

class Acomp{
    constructor(
        acomp_id,
        acomp_terapeutaid,
        acomp_beneid,
        acomp_data, 
        acomp_mes, 
        acomp_tipo,
        acomp_resp, 
        acomp_andamento, 
        acomp_datacad, 
        acomp_usuidcad, 
        acomp_dataedi, 
        acomp_usuidedi 
   
         ){
            this.acomp_id = acomp_id,
            this.acomp_terapeutaid = acomp_terapeutaid, 
            this.acomp_beneid = acomp_beneid, //Ok
            this.acomp_data = acomp_data, //Ok
            this.acomp_mes = acomp_mes,
            this.acomp_tipo = acomp_tipo,
            this.acomp_resp = acomp_resp,
            this.acomp_andamento = acomp_andamento,
            this.acomp_datacad = acomp_datacad,
            this.acomp_usuidcad = acomp_usuidcad,
            this.acomp_dataedi = acomp_dataedi,
            this.acomp_usuidedi = acomp_usuidedi

    }
}

AcompSchema.loadClass(Acomp)
const AcompModel = mongoose.model('tb_acomp', AcompSchema)
module.exports = {AcompModel,AcompSchema,
    acompEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let acompId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("acompId:"+acompId)
        //Realiza Atualização
        await AcompModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                acomp_terapeutaid : req.body.acompTerapeutaid,
                acomp_beneid : req.body.acompBeneid,
                acomp_data : req.body.acompData,
                acomp_mes : req.body.acompMes,
                acomp_tipo : req.body.acompTipo,
                acomp_resp : req.body.acompResp,
                acomp_andamento : req.body.acompAndamento,
                
                acomp_dataedi : dataAtual, 
                acomp_usuidedi : idUsu
                
                
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
    acompAdicionar: async (req,res) => {
        //Validar se a Acompese existe
        console.log("acompmodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newAcomp = new AcompModel({
                acomp_id: req.body.acompId,
                acomp_terapeutaid : req.body.acompTerapeutaid,
                acomp_beneid : req.body.acompBeneid,
                acomp_data : req.body.acompData,
                acomp_mes : req.body.acompMes,
                acomp_tipo : req.body.acompTipo,
                acomp_resp : req.body.acompResp,
                acomp_andamento : req.body.acompAndamento,
                acomp_datacad : dataAtual, 
                acomp_usuidcad : idUsu
                
        });
        console.log("newAcomp save");
        await newAcomp.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};