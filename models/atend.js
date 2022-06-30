const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AtendSchema = mongoose.Schema({
    atend_org :{
        type: String,
        required: true
    },
    atend_categoria :{
        type: String,
        required: true
    },
    atend_beneid :{
        type: ObjectId,
        required: false
    },
    atend_convid :{
        type: ObjectId,
        required: true
    },
    atend_usuid :{
        type: String,
        required: true
    },
    atend_atenddata :{
        type: Date,
        required: true
    },
    atend_terapeutaid :{
        type: ObjectId,
        required: true
    },
    atend_terapiaid :{
        type: ObjectId,
        required: true
    },
    atend_salaid :{
        type: ObjectId,
        required: true
    },
    atend_valorcre :{
        type: String,
        required: true
    },
    atend_valordeb :{
        type: String,
        required: true
    },
    atend_mergeterapeutaid :{
        type: ObjectId,
        required: false
    },
    atend_mergeterapiaid :{
        type: ObjectId,
        required: false
    },
    atend_mergevalorcre :{
        type: String,
        required: false
    },
    atend_mergevalordeb :{
        type: String,
        required: false
    },
    atend_evolucao :{
        type: String,
        required: false
    },
    atend_num :{
        type: Number,
        required: true
    },
    atend_datacad :{
        type: Date,
        required: false
    },
    atend_dataedi :{
        type: Date,
        required: false
    }
})

class Atend{
    constructor(
        atend_org,
        atend_categoria,
        atend_beneid,
        atend_convid,
        atend_usuid,
        atend_atenddata,
        atend_terapeutaid,
        atend_terapiaid,
        atend_salaid,
        atend_valorcre,
        atend_valordeb,
        atend_mergeterapeutaid,
        atend_mergeterapiaid,
        atend_mergevalorcre,
        atend_mergevalordeb,
        atend_evolucao,
        atend_num,
        atend_datacad,
        atend_dataedi
        ){
        this.atend_org = atend_org,
        this.atend_categoria = atend_categoria,
        this.atend_beneid = atend_beneid,
        this.atend_convid = atend_convid,
        this.atend_usuid = atend_usuid,
        this.atend_atenddata = atend_atenddata,
        this.atend_terapeutaid = atend_terapeutaid,
        this.atend_terapiaid = atend_terapiaid,
        this.atend_salaid = atend_salaid,
        this.atend_valorcre = atend_valorcre,
        this.atend_valordeb = atend_valordeb,
        this.atend_mergeterapeutaid = atend_mergeterapeutaid,
        this.atend_mergeterapiaid = atend_mergeterapiaid,
        this.atend_mergevalorcre = atend_mergevalorcre,
        this.atend_mergevalordeb = atend_mergevalordeb,
        this.atend_evolucao = atend_evolucao,
        this.atend_num = atend_num,
        this.atend_datacad = atend_datacad,
        this.atend_dataedi = atend_dataedi       
    }
}

AtendSchema.loadClass(Atend)
const AtendModel = mongoose.model('tb_atend', AtendSchema)
module.exports = {AtendModel,AtendSchema,
    atendEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AtendModel.findByIdAndUpdate(req.body.atendId, 
            {$set: {
                atend_org : req.body.atendOrg,
                atend_categoria : req.body.atendCategoria,
                atend_beneid : req.body.atendBeneid,
                atend_convid : req.body.atendConvid,
                atend_usuid : req.body.atendUsuid,
                atend_atenddata : req.body.atendAtenddata,
                atend_terapeutaid : req.body.atendTerapeutaid,
                atend_terapiaid : req.body.atendTerapiaid,
                atend_salaid : req.body.atendSalaid,
                atend_valorcre : req.body.atendValorcre,
                atend_valordeb : req.body.atendValordeb,
                atend_mergeterapeutaid : req.body.atendMergeTerapeutaid,
                atend_mergeterapiaid : req.body.atendMergeterapiaid,
                atend_mergevalorcre : req.body.atendMergevalorcre,
                atend_mergevalordeb : req.body.atendMergevalordeb,
                atend_evolucao : req.body.atendEvolucao,
                atend_dataedi : dataAtual.toISOString()
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
    atendAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("atendmodel");
        console.log("req.body.atendAtenddata:")
        console.log(req.body.atendAtenddata)
        const newAtend = new AtendModel({
            atend_org : req.body.atendOrg,
            atend_categoria : req.body.atendCategoria,
            atend_beneid : req.body.atendBeneid,
            atend_convid : req.body.atendConvid,
            atend_usuid : req.body.atendUsuid,
            atend_atenddata : req.body.atendAtenddata,
            atend_terapeutaid : req.body.atendTerapeutaid,
            atend_terapiaid : req.body.atendTerapiaid,
            atend_salaid : req.body.atendSalaid,
            atend_valorcre : req.body.atendValorcre,
            atend_valordeb : req.body.atendValordeb,
            atend_mergeterapeutaid : req.body.atendMergeTerapeutaid,
            atend_mergeterapiaid : req.body.atendMergeTerapiaid,
            atend_mergevalorcre : req.body.atendMergevalorcre,
            atend_mergevalordeb : req.body.atendMergevalordeb,
            atend_evolucao : req.body.atendEvolucao,
            atend_num : req.body.nextNum,
            atend_datacad : dataAtual.toISOString()
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};