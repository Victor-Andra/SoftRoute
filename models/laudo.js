const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const LaudoSchema = mongoose.Schema({
    laudo_id:{ 
        type: ObjectId, 
        required: false 
    },
    laudo_beneid :{
        type: ObjectId,
        required: true
    },
    laudo_medico :{
        type: String,
        required: false
    },
    laudo_medicoesp :{
        type: String,
        required: false
    },
    laudo_diag :{
        type: String,
        required: false
    },
    laudo_data :{
        type: Date,
        required: false
    },
    laudo_usuid :{
        type: ObjectId,
        required: false
    },
    laudo_datacad :{
        type: Date,
        required: false
    },
    laudo_usuidedi :{
        type: ObjectId,
        required: false
    },
    laudo_dataedi :{
        type: Date,
        required: false
    }
})

class Laudo{
    constructor(
        laudo_id,
        laudo_beneid,
        laudo_diag,   
        laudo_medico,
        laudo_medicoesp,
        laudo_data,
        laudo_usuid,
        laudo_datacad,
        laudo_usuidedi,
        laudo_dataedi
        ){
        this.laudo_id = laudo_id,
        this.laudo_beneid = laudo_beneid,
        this.laudo_diag = laudo_diag,   
        this.laudo_medico = laudo_medico,
        this.laudo_medicoesp = laudo_medicoesp,
        this.laudo_data = laudo_data,
        this.laudo_usuid = laudo_usuid,
        this.laudo_datacad = laudo_datacad,
        this.laudo_usuidedi = laudo_usuidedi,
        this.laudo_dataedi = laudo_dataedi       
    }
}

LaudoSchema.loadClass(Laudo)
const LaudoModel = mongoose.model('tb_laudo', LaudoSchema)
module.exports = {LaudoModel,LaudoSchema,
    laudoEditar: async (req, res) => {
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
        let laudoId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("laudoId:"+laudoId)
        //Realiza Atualização
        await LaudoModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                
                laudo_beneid : req.body.laudoBeneid,
                laudo_diag : req.body.laudoDiag,   
                laudo_medico : req.body.laudoMedico,
                laudo_medicoesp : req.body.laudoMedicoesp,
                laudo_data : req.body.laudoData,
                
                laudo_usuid : req.body.laudoUsuid,
                laudo_datacad : req.body.laudoDatacad,
                laudo_usuidedi : idUsu,
                laudo_dataedi : dataAtual
                
                
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
        //Validar se a Laudoese existe
        console.log("laudomodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newLaudo = new LaudoModel({
                laudo_id: req.body.laudoId,
                laudo_beneid : req.body.laudoBeneid,
                laudo_diag : req.body.laudoDiag,   
                laudo_medico : req.body.laudoMedico,
                laudo_medicoesp : req.body.laudoMedicoesp,
                laudo_data : req.body.laudoData,
                
                laudo_usuid : idUsu,
                laudo_datacad : dataAtual,
                
                
                
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