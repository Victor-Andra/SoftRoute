const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const PecsSchema = mongoose.Schema({
    pecs_id:{ type: ObjectId, required: false },
    pecs_terapeutaid:{type: ObjectId, required: true},
    pecs_beneid:{type: ObjectId, required: true},
    pecs_data: { type: String, required: false },
    pecs_mes: { type: String, required: false },
    pecs_tipo: { type: String, required: false },
    pecs_fase: { type: String, required: false },
    pecs_andamento: { type: String, required: false },
    //controle
    pecs_datacad: { type: Date, required: false },
    pecs_usuidcad: { type: ObjectId, required: false },
    pecs_dataedi: { type: Date, required: false },
    pecs_usuidedi: { type: ObjectId, required: false },
    
})

class Pecs{
    constructor(
        pecs_id,
        pecs_terapeutaid,
        pecs_beneid,
        pecs_data, 
        pecs_mes, 
        pecs_tipo,
        pecs_fase, 
        pecs_andamento, 
        pecs_datacad, 
        pecs_usuidcad, 
        pecs_dataedi, 
        pecs_usuidedi 
   
         ){
            this.pecs_id = pecs_id,
            this.pecs_terapeutaid = pecs_terapeutaid, 
            this.pecs_beneid = pecs_beneid, //Ok
            this.pecs_data = pecs_data, //Ok
            this.pecs_mes = pecs_mes,
            this.pecs_tipo = pecs_tipo,
            this.pecs_fase = pecs_fase,
            this.pecs_andamento = pecs_andamento,
            this.pecs_datacad = pecs_datacad,
            this.pecs_usuidcad = pecs_usuidcad,
            this.pecs_dataedi = pecs_dataedi,
            this.pecs_usuidedi = pecs_usuidedi

    }
}

PecsSchema.loadClass(Pecs)
const PecsModel = mongoose.model('tb_pecs', PecsSchema)
module.exports = {PecsModel,PecsSchema,
    pecsEditar: async (req, res) => {
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
        let pecsId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("pecsId:"+pecsId)
        //Realiza Atualização
        await PecsModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                pecs_terapeutaid : req.body.pecsTerapeutaid,
                pecs_beneid : req.body.pecsBeneid,
                pecs_data : req.body.pecsData,
                pecs_mes : req.body.pecsMes,
                pecs_tipo : req.body.pecsTipo,
                pecs_fase : req.body.pecsFase,
                pecs_andamento : req.body.pecsAndamento,
                
                pecs_dataedi : dataAtual, 
                pecs_usuidedi : idUsu
                
                
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
    pecsAdicionar: async (req,res) => {
        //Validar se a Pecsese existe
        console.log("pecsmodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newPecs = new PecsModel({
                pecs_id: req.body.pecsId,
                pecs_terapeutaid : req.body.pecsTerapeutaid,
                pecs_beneid : req.body.pecsBeneid,
                pecs_data : req.body.pecsData,
                pecs_mes : req.body.pecsMes,
                pecs_tipo : req.body.pecsTipo,
                pecs_fase : req.body.pecsFase,
                pecs_andamento : req.body.pecsAndamento,
                pecs_datacad : dataAtual, 
                pecs_usuidcad : idUsu
                
        });
        console.log("newPecs save");
        await newPecs.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};