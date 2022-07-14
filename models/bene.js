const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const BeneSchema = mongoose.Schema({

    bene_nome:{
        type: String,
        required: true 
    },
    bene_apelido:{
        type: String,
        required: false
    },
    bene_idade:{
        type: String, 
        required: false
    },
    bene_datanasc:{
        type: Date, 
        required: true 
    },
    bene_nacionalidade:{
        type: String,
        required: true 
    },
    bene_end:{
        type: String,
        required: true 
    },
    bene_endcompl:{
        type: String,
        required: false 
    },
    bene_endbairro:{
        type: String,
        required: true 
    },
    bene_endcidade:{
        type: String,
        required: true
    },
    bene_enduf:{
         type: String, 
         required: true 
        },
    bene_endcep:{
         type: String, 
         required: true 
        },
    bene_ident:{
         type: String, 
         required: false 
        },
    bene_cpf:{
         type: String, 
         required: false 
        },
    bene_status:{
         type: String, 
         required: true 
        },
    bene_convid:{
         type: ObjectId, 
         required: true 
        },
    bene_out:{
         type: String, 
         required: true 
        },
    bene_graupar:{
         type: String, 
         required: true 
        },
    bene_outprof:{
         type: String, 
         required: true 
        },
    bene_outident:{
         type: String, 
         required: true 
        },
    bene_outcpf:{
         type: String, 
         required: true 
        },
    bene_outend:{
         type: String, 
         required: true 
        },
    bene_outendcompl:{
         type: String, 
         required: false 
        },
    bene_outendbairro:{
         type: String,
          required: true 
        },
    bene_outendcidade:{
         type: String,
          required: true 
        },
    bene_outenduf:{
         type: String, 
         required: true 
        },
    bene_outendcep:{
         type: String, 
         required: true 
        },
    bene_outcel:{
         type: String, 
         required: true 
        },
    bene_outcel2:{
         type: String, 
         required: false 
        },
    bene_outemail:{
         type: String, 
         required: false 
        },
    bene_pai:{
         type: String, 
         required: false 
        },
    bene_paiprof:{
         type: String, 
         required: false 
        },
    bene_paiident:{
         type: String, 
         required: false 
        },
    bene_paicpf:{
         type: String, 
         required: false 
        },
    bene_paiend:{
         type: String, 
         required: false 
        },
    bene_paiendcompl:{
         type: String, 
         required: false 
        },
    bene_paiendbairro:{
         type: String, 
         required: false 
        },
    bene_paiendcidade:{
         type: String, 
         required: false 
        },
    bene_paienduf:{
         type: String, 
         required: false 
        },
    bene_paiendcep:{
         type: String, 
         required: false 
        },
    bene_paicel:{
         type: String, 
         required: false 
        },
    bene_paicel2:{
         type: String, 
         required: false 
        },
    bene_paiemail:{
         type: String, 
         required: false 
        },
    bene_mae:{
         type: String, 
         required: true 
        },
    bene_maeprof:{
         type: String, 
         required: true 
        },
    bene_maeident:{
         type: String, 
         required: true 
        },
    bene_maecpf:{
         type: String, 
         required: true 
        },
    bene_maeend:{
         type: String, 
         required: true 
        },
    bene_maeendcompl:{
         type: String, 
         required: false 
        },
    bene_maeendbairro:{
         type: String, 
         required: true 
        },
    bene_maeendcidade:{
         type: String, 
         required: true 
        },
    bene_maeenduf:{
         type: String, 
         required: true 
        },
    bene_maeendcep:{
         type: String, 
         required: true 
        },
    bene_maecel:{
         type: String, 
         required: true 
        },
    bene_maecel2:{
         type: String, 
         required: false 
        },
    bene_maeemail:{
         type: String, 
         required: false 
        },
    bene_datacad:{
         type: Date, 
         required: false 
        },
    bene_dataedi:{
        type: Date, 
        required: false 
    }
    
    
})

class Bene{
    constructor(
        bene_nome, bene_apelido, bene_idade, bene_datanasc, bene_nacionalidade, bene_end, bene_endcompl, bene_endbairro,
        bene_endcidade, bene_enduf,	bene_endcep, bene_ident, bene_cpf, bene_status, bene_convid, bene_out, bene_graupar,
        bene_outprof, bene_outident, bene_outcpf, bene_outend, bene_outendcompl, bene_outendbairro, bene_outendcidade,
        bene_outenduf, bene_outendcep,	bene_outcel, bene_outcel2, bene_outemail, bene_pai, bene_paiprof, bene_paiident,
        bene_paicpf, bene_paiend, bene_paiendcompl, bene_paiendbairro, bene_paiendcidade, bene_paienduf, bene_paiendcep,
        bene_paicel, bene_paicel2, bene_paiemail, bene_mae, bene_maeprof, bene_maeident, bene_maecpf, bene_maeend,
        bene_maeendcompl, bene_maeendbairro, bene_maeendcidade, bene_maeenduf, bene_maeendcep, bene_maecel,bene_maecel2,
        bene_maeemail, bene_datacad, bene_dataedi
         ){
            this.bene_nome = bene_nome,
            this.bene_apelido = bene_apelido,
            this.bene_idade = bene_idade,
            this.bene_datanasc = bene_datanasc,
            this.bene_nacionalidade = bene_nacionalidade,
            this.bene_end = bene_end,
            this.bene_endcompl = bene_endcompl,
            this.bene_endbairro = bene_endbairro,
            this.bene_endcidade = bene_endcidade,
            this.bene_enduf = bene_enduf,
            this.bene_endcep = bene_endcep,
            this.bene_ident = bene_ident,
            this.bene_cpf = bene_cpf,
            this.bene_status = bene_status,
            this.bene_convid = bene_convid,
            this.bene_out = bene_out,
            this.bene_graupar = bene_graupar,
            this.bene_outprof = bene_outprof,
            this.bene_outident = bene_outident,
            this.bene_outcpf = bene_outcpf,
            this.bene_outend = bene_outend,
            this.bene_outendcompl = bene_outendcompl,
            this.bene_outendbairro = bene_outendbairro,
            this.bene_outendcidade = bene_outendcidade,
            this.bene_outenduf = bene_outenduf,
            this.bene_outendcep = bene_outendcep,
            this.bene_outcel = bene_outcel,
            this.bene_outcel2 = bene_outcel2,
            this.bene_outemail = bene_outemail,
            this.bene_pai = bene_pai,
            this.bene_paiprof = bene_paiprof,
            this.bene_paiident = bene_paiident,
            this.bene_paicpf = bene_paicpf,
            this.bene_paiend = bene_paiend,
            this.bene_paiendcompl = bene_paiendcompl,
            this.bene_paiendbairro = bene_paiendbairro,
            this.bene_paiendcidade = bene_paiendcidade,
            this.bene_paienduf = bene_paienduf,
            this.bene_paiendcep = bene_paiendcep,
            this.bene_paicel = bene_paicel,
            this.bene_paicel2 = bene_paicel2,
            this.bene_paiemail = bene_paiemail,
            this.bene_mae = bene_mae,
            this.bene_maeprof = bene_maeprof,
            this.bene_maeident = bene_maeident,
            this.bene_maecpf = bene_maecpf,
            this.bene_maeend = bene_maeend,
            this.bene_maeendcompl = bene_maeendcompl,
            this.bene_maeendbairro = bene_maeendbairro,
            this.bene_maeendcidade = bene_maeendcidade,
            this.bene_maeenduf = bene_maeenduf,
            this.bene_maeendcep = bene_maeendcep,
            this.bene_maecel = bene_maecel,
            this.bene_maecel2 = bene_maecel2,
            this.bene_maeemail = bene_maeemail,
            this.bene_datacad = bene_datacad,
            this.bene_dataedi = bene_dataedi
            
            
    }
}

BeneSchema.loadClass(Bene)
const BeneModel = mongoose.model('tb_bene', BeneSchema)
module.exports = {BeneModel,BeneSchema,
    beneEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await BeneModel.findByIdAndUpdate(req.body.beneId, 
            {$set: {
                bene_nome: req.body.beneNome,
                bene_apelido: req.body.beneApelido,               
                bene_idade: req.body.beneIdade,
                bene_datanasc: (req.body.beneDatanasc+"T00:00:00.000Z"),
                bene_nacionalidade: req.body.beneNacionalidade,
                bene_end: req.body.beneEnd,
                bene_endcompl: req.body.beneEndcompl,
                bene_endbairro: req.body.beneEndbairro,
                bene_endcidade: req.body.beneEndcidade,
                bene_enduf: req.body.beneEnduf,
                bene_endcep: req.body.beneEndcep,
                bene_ident: req.body.beneIdent,
                bene_cpf: req.body.beneCpf,
                bene_status: req.body.beneStatus,
                bene_convid: req.body.beneConvid,
                bene_out: req.body.beneOut,
                bene_graupar: req.body.beneGraupar,
                bene_outprof: req.body.beneOutprof,
                bene_outident: req.body.beneOutident,
                bene_outcpf: req.body.beneOutcpf,
                bene_outend: req.body.beneOutend,
                bene_outendcompl: req.body.beneOutendcompl,
                bene_outendbairro: req.body.beneOutendbairro,
                bene_outendcidade: req.body.beneOutendcidade,
                bene_outenduf: req.body.beneOutenduf,
                bene_outendcep: req.body.beneOutendcep,
                bene_outcel: req.body.beneOutcel,
                bene_outcel2: req.body.beneOutcel2,
                bene_outemail: req.body.beneOutemail,
                bene_pai: req.body.benePai,
                bene_paiprof: req.body.benePaiprof,
                bene_paiident: req.body.benePaiident,
                bene_paicpf: req.body.benePaicpf,
                bene_paiend: req.body.benePaiend,
                bene_paiendcompl: req.body.benePaiendcompl,
                bene_paiendbairro: req.body.benePaiendbairro,
                bene_paiendcidade: req.body.benePaiendcidade,
                bene_paienduf: req.body.benePaienduf,
                bene_paiendcep: req.body.benePaiendcep,
                bene_paicel: req.body.benePaicel,
                bene_paicel2: req.body.benePaicel2,
                bene_paiemail: req.body.benePaiemail,
                bene_mae: req.body.beneMae,
                bene_maeprof: req.body.beneMaeprof,
                bene_maeident: req.body.beneMaeident,
                bene_maecpf: req.body.beneMaecpf,
                bene_maeend: req.body.beneMaeend,
                bene_maeendcompl: req.body.beneMaeendcompl,
                bene_maeendbairro: req.body.beneMaeendbairro,
                bene_maeendcidade: req.body.beneMaeendcidade,
                bene_maeenduf: req.body.beneMaeenduf,
                bene_maeendcep: req.body.beneMaeendcep,
                bene_maecel: req.body.beneMaecel,
                bene_maecel2: req.body.beneMaecel2,
                bene_maeemail: req.body.beneMaeemail,
                bene_dataedi: dataAtual
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






    
    beneAdicionar: async (req,res) => {
        let beneExiste =  await BeneModel.findOne({bene_nome: req.body.beneNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(beneExiste){//se tiver null cai no else
            return "O nome da bene já existe";
        } else {
            console.log("benemodel");
            const newBene = new BeneModel({
                bene_nome: req.body.beneNome,
                bene_apelido: req.body.beneApelido,
                bene_idade: req.body.beneIdade,
                bene_datanasc: req.body.beneDatanasc,
                bene_nacionalidade: req.body.beneNacionalidade,
                bene_end: req.body.beneEnd,
                bene_endcompl: req.body.beneEndcompl,
                bene_endbairro: req.body.beneEndbairro,
                bene_endcidade: req.body.beneEndcidade,
                bene_enduf: req.body.beneEnduf,
                bene_endcep: req.body.beneEndcep,
                bene_ident: req.body.beneIdent,
                bene_cpf: req.body.beneCpf,
                bene_status: req.body.beneStatus,
                bene_convid: req.body.beneConvid,
                bene_out: req.body.beneOut,
                bene_graupar: req.body.beneGraupar,
                bene_outprof: req.body.beneOutprof,
                bene_outident: req.body.beneOutident,
                bene_outcpf: req.body.beneOutcpf,
                bene_outend: req.body.beneOutend,
                bene_outendcompl: req.body.beneOutendcompl,
                bene_outendbairro: req.body.beneOutendbairro,
                bene_outendcidade: req.body.beneOutendcidade,
                bene_outenduf: req.body.beneOutenduf,
                bene_outendcep: req.body.beneOutendcep,
                bene_outcel: req.body.beneOutcel,
                bene_outcel2: req.body.beneOutcel2,
                bene_outemail: req.body.beneOutemail,
                bene_pai: req.body.benePai,
                bene_paiprof: req.body.benePaiprof,
                bene_paiident: req.body.benePaiident,
                bene_paicpf: req.body.benePaicpf,
                bene_paiend: req.body.benePaiend,
                bene_paiendcompl: req.body.benePaiendcompl,
                bene_paiendbairro: req.body.benePaiendbairro,
                bene_paiendcidade: req.body.benePaiendcidade,
                bene_paienduf: req.body.benePaienduf,
                bene_paiendcep: req.body.benePaiendcep,
                bene_paicel: req.body.benePaicel,
                bene_paicel2: req.body.benePaicel2,
                bene_paiemail: req.body.benePaiemail,
                bene_mae: req.body.beneMae,
                bene_maeprof: req.body.beneMaeprof,
                bene_maeident: req.body.beneMaeident,
                bene_maecpf: req.body.beneMaecpf,
                bene_maeend: req.body.beneMaeend,
                bene_maeendcompl: req.body.beneMaeendcompl,
                bene_maeendbairro: req.body.beneMaeendbairro,
                bene_maeendcidade: req.body.beneMaeendcidade,
                bene_maeenduf: req.body.beneMaeenduf,
                bene_maeendcep: req.body.beneMaeendcep,
                bene_maecel: req.body.beneMaecel,
                bene_maecel2: req.body.beneMaecel2,
                bene_maeemail: req.body.beneMaeemail,
                bene_datacad: dataAtual
,
                
            });
            console.log("newBene save");
            await newBene.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};