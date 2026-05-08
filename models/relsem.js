const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// models/relsem.js
const RelsemSchema = mongoose.Schema({
    relsem_id: { type: ObjectId, required: false },
    
    // ✅ COM REF (mesmo banco - preferredDb)
    relsem_beneid: { 
        type: ObjectId, 
        ref: 'tb_bene',  // ← Nome exato usado no getModel(db, 'tb_bene', ...)
        required: true 
    },
    relsem_convid: { 
        type: ObjectId, 
        ref: 'tb_conv',
        required: false 
    },
    
    // ❌ SEM REF (banco diferente - PortalDoUsuario)
    // Mantém como ObjectId puro, resolve manualmente depois
    relsem_terapeutaid: { type: ObjectId, required: true },
    
    // controle
    relsem_datacad: { type: Date, required: false },
    relsem_usuidcad: { type: ObjectId, required: false },  // ← também cross-db
    relsem_dataedi: { type: Date, required: false },
    relsem_usuidedi: { type: ObjectId, required: false },  // ← também cross-db
    
    relsem_data: { type: String, required: false },
    relsem_mes: { type: String, required: false },
    relsem_conselho: { type: String, required: false },
    relsem_terapia: { type: String, required: false },
    relsem_desc: { type: String, required: false },
})


var RelsemModel = getModel("softroute", 'tb_relsem', RelsemSchema)
module.exports = {
    RelsemModel,
    RelsemSchema,

    relsemEditar: async (req, res) => {
        
        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        RelsemModel = getModel(db, 'tb_relsem', RelsemSchema)
        //;

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
        
        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        RelsemModel = getModel(db, 'tb_relsem', RelsemSchema)
        //;

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