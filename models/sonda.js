const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SondaSchema = mongoose.Schema({
    sonda_id:{ type: ObjectId, required: false },
    sonda_terapeutaid:{type: ObjectId, required: true},
    sonda_beneid:{type: ObjectId, required: true},
    sonda_data: { type: String, required: false },
    sonda_mes: { type: String, required: false },
    sonda_tipo: { type: String, required: false },
    sonda_fase: { type: String, required: false },
    sonda_andamento: { type: String, required: false },
    //controle
    sonda_datacad: { type: Date, required: false },
    sonda_usuidcad: { type: ObjectId, required: false },
    sonda_dataedi: { type: Date, required: false },
    sonda_usuidedi: { type: ObjectId, required: false },
    
})

class Sonda{
    constructor(
        sonda_id,
        sonda_terapeutaid,
        sonda_beneid,
        sonda_data, 
        sonda_mes, 
        sonda_tipo,
        sonda_fase, 
        sonda_andamento, 
        sonda_datacad, 
        sonda_usuidcad, 
        sonda_dataedi, 
        sonda_usuidedi 
   
         ){
            this.sonda_id = sonda_id,
            this.sonda_terapeutaid = sonda_terapeutaid, 
            this.sonda_beneid = sonda_beneid, //Ok
            this.sonda_data = sonda_data, //Ok
            this.sonda_mes = sonda_mes,
            this.sonda_tipo = sonda_tipo,
            this.sonda_fase = sonda_fase,
            this.sonda_andamento = sonda_andamento,
            this.sonda_datacad = sonda_datacad,
            this.sonda_usuidcad = sonda_usuidcad,
            this.sonda_dataedi = sonda_dataedi,
            this.sonda_usuidedi = sonda_usuidedi

    }
}

SondaSchema.loadClass(Sonda)
const SondaModel = mongoose.model('tb_sonda', SondaSchema)
module.exports = {SondaModel,SondaSchema,
    sondaEditar: async (req, res) => {
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
        let sondaId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("sondaId:"+sondaId)
        //Realiza Atualização
        await SondaModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                sonda_terapeutaid : req.body.sondaTerapeutaid,
                sonda_beneid : req.body.sondaBeneid,
                sonda_data : req.body.sondaData,
                sonda_mes : req.body.sondaMes,
                sonda_tipo : req.body.sondaTipo,
                sonda_fase : req.body.sondaFase,
                sonda_andamento : req.body.sondaAndamento,
                
                sonda_dataedi : dataAtual, 
                sonda_usuidedi : idUsu
                
                
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
    sondaAdicionar: async (req,res) => {
        //Validar se a Sondaese existe
        console.log("sondamodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newSonda = new SondaModel({
                sonda_id: req.body.sondaId,
                sonda_terapeutaid : req.body.sondaTerapeutaid,
                sonda_beneid : req.body.sondaBeneid,
                sonda_data : req.body.sondaData,
                sonda_mes : req.body.sondaMes,
                sonda_tipo : req.body.sondaTipo,
                sonda_fase : req.body.sondaFase,
                sonda_andamento : req.body.sondaAndamento,
                sonda_datacad : dataAtual, 
                sonda_usuidcad : idUsu
                
        });
        console.log("newSonda save");
        await newSonda.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};