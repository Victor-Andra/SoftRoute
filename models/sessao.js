const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SessaoSchema = mongoose.Schema({
sessao_beneid :{ type: ObjectId, required: true },
sessao_convid :{ type: ObjectId, required: true },
sessao_terapiaid :{ type: ObjectId, required: true },
sessao_qtterapiaprev :{ type: String, required: true },
sessao_qtterapiacon :{ type: String, required: false },
sessao_qtterapiasaldo :{ type: String, required: false },
sessao_datacad :{ type: String, required: false },
sessao_dataedi :{ type: String, required: false }



    
})

class Sessao{
    constructor(
       
                sessao_beneid,
                sessao_convid,
                sessao_terapiaid,
                sessao_qtterapiaprev,
                sessao_qtterapiacon,
                sessao_qtterapiasaldo,
                sessao_datacad,
                sessao_dataedi


        ){
            this.sessao_beneid = sessao_beneid,
            this.sessao_convid = sessao_convid,
            this.sessao_terapiaid = sessao_terapiaid,
            this.sessao_qtterapiaprev = sessao_qtterapiaprev,
            this.sessao_qtterapiacon = sessao_qtterapiacon,
            this.sessao_qtterapiasaldo = sessao_qtterapiasaldo,
            this.sessao_datacad = sessao_datacad,
            this.sessao_dataedi = sessao_dataedi

    }
}

SessaoSchema.loadClass(Sessao)
const SessaoModel = mongoose.model('tb_sessao', SessaoSchema)
module.exports = {SessaoModel,SessaoSchema,
    sessaoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await SessaoModel.findByIdAndUpdate(req.body.sessaoId, 
            {$set: {
                sessao_beneid : req.body.sessaoBeneid ,
                sessao_convid : req.body.sessaoConvid ,
                sessao_terapiaid : req.body.sessaoTerapiaid ,
                sessao_qtterapiaprev : req.body.sessaoQtterapiaprev ,
                sessao_qtterapiacon : req.body.sessaoQtterapiacon ,
                sessao_qtterapiasaldo : req.body.sessaoQtterapiasaldo,
                sessao_dataedi : dataAtual, 


                
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





    sessaoAdicionar: async (req,res) => {
        //Não Pode haver um Beneficiário com mesma terapia cadastrada Mais de uma Vez.
        //O campo de Integridade verifica se há mais de uma terapia igual para um mesmo beneficiário é impede o cadastro
        let sessaoExiste =  await SessaoModel.findOne({sessao_beneid: req.body.sessaoBeneid , sessao_terapiaid: req.body.sessaoTerapiaid});//quando não acha fica null
        let dataAtual = new Date();
        
        if(sessaoExiste){//se tiver null cai no else
            return "O nome da sessao já existe";
            //programar alert
        } else {
            console.log("sessaomodel");
            const newSessao = new SessaoModel({
                sessao_beneid : req.body.sessaoBeneid ,
                sessao_convid : req.body.sessaoConvid ,
                sessao_terapiaid : req.body.sessaoTerapiaid ,
                sessao_qtterapiaprev : req.body.sessaoQtterapiaprev ,
                sessao_qtterapiacon : req.body.sessaoQtterapiacon ,
                sessao_qtterapiasaldo : req.body.sessaoQtterapiasaldo,
                sessao_datacad : dataAtual



                
            });
            console.log("newSessao save");
            await newSessao.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};