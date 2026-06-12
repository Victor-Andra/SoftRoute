const { data } = require('jquery')
const mongoose = require('mongoose')
const usuario = require('./usuario')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const EbaiSchema = mongoose.Schema({
    ebai_terapeutaid:{type: ObjectId, required: true},
    ebai_beneid:{type: ObjectId, required: true},
    ebai_dataaplica :{type: Date, required: false},
    ebai_momentosrefeicao :{type: String, required: false},
    ebai_preocupacao :{type: String, required: false},
    ebai_apetite :{type: String, required: false},
    ebai_recusacomer :{type: String, required: false},
    ebai_temporefeicao :{type: String, required: false},
    ebai_comportamento :{type: String, required: false},
    ebai_nauseavomita :{type: String, required: false},
    ebai_comidaparada :{type: String, required: false},
    ebai_distrações :{type: String, required: false},
    ebai_forçarcomer :{type: String, required: false},
    ebai_mastigacao :{type: String, required: false},
    ebai_crescimento :{type: String, required: false},
    ebai_relacaocrianca :{type: String, required: false},
    ebai_relacaofamiliar :{type: String, required: false},
    ebai_comentarios :{type: String, required: false},
    ebai_datacad :{type: Date, required: false},
    ebai_dataedi :{type: Date, required: false},
    ebai_usuidcad :{type: ObjectId, required: false},
    ebai_usuidedi :{type: ObjectId, required: false},
    ebai_datalixo :{type: Date, required: false},
    ebai_usuidlixo :{type: ObjectId, required: false},
    ebai_lixo: {type: String, required: false}
})

class Ebai{
    constructor(
        ebai_terapeutaid,
        ebai_beneid,
        ebai_dataaplica,
        ebai_momentosrefeicao,
        ebai_preocupacao,
        ebai_apetite,
        ebai_recusacomer,
        ebai_temporefeicao,
        ebai_comportamento,
        ebai_nauseavomita,
        ebai_comidaparada,
        ebai_distrações,
        ebai_forçarcomer,
        ebai_mastigacao,
        ebai_crescimento,
        ebai_relacaocrianca,
        ebai_relacaofamiliar,
        ebai_comentarios,
        ebai_datacad,
        ebai_dataedi,
        ebai_usuidcad,
        ebai_usuidedi,
        ebai_usuidlixo,
        ebai_datalixo,
        ebai_lixo
    ){
        this.ebai_terapeutaid = ebai_terapeutaid,
        this.ebai_beneid = ebai_beneid,
        this.ebai_dataaplica = ebai_dataaplica,
        this.ebai_momentosrefeicao = ebai_momentosrefeicao,
        this.ebai_preocupacao = ebai_preocupacao,
        this.ebai_apetite = ebai_apetite,
        this.ebai_recusacomer = ebai_recusacomer,
        this.ebai_temporefeicao = ebai_temporefeicao,
        this.ebai_comportamento = ebai_comportamento,
        this.ebai_nauseavomita = ebai_nauseavomita,
        this.ebai_comidaparada = ebai_comidaparada,
        this.ebai_distrações = ebai_distrações,
        this.ebai_forçarcomer = ebai_forçarcomer,
        this.ebai_mastigacao = ebai_mastigacao,
        this.ebai_crescimento = ebai_crescimento,
        this.ebai_relacaocrianca = ebai_relacaocrianca,
        this.ebai_relacaofamiliar = ebai_relacaofamiliar,
        this.ebai_comentarios = ebai_comentarios,
        this.ebai_datacad = ebai_datacad,
        this.ebai_dataedi = ebai_dataedi,
        this.ebai_usuidcad = ebai_usuidcad,
        this.ebai_usuidedi = ebai_usuidedi,
        this.ebai_usuidlixo = ebai_usuidlixo,
        this.ebai_datalixo = ebai_datalixo,
        this.ebai_lixo = ebai_lixo
    }
}

EbaiSchema.loadClass(Ebai)
var EbaiModel = getModel("softroute", 'tb_ebai', EbaiSchema)
module.exports = {EbaiModel,EbaiSchema,
    ebaiEditar: async (req, res) => {

        //Estrutura multiempresa
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EbaiModel.findByIdAndUpdate(req.body.ebaiId, 
            {$set: {
                ebai_terapeutaid: req.body.ebaiTerapeutaid,
                ebai_beneid: req.body.ebaiBeneid,
                ebai_dataaplica: req.body.ebaiDataaplica,
                ebai_momentosrefeicao: req.body.ebaiMomentosrefeicao,
                ebai_preocupacao: req.body.ebaiPreocupacao,
                ebai_apetite: req.body.ebaiApetite,
                ebai_recusacomer: req.body.ebaiRecusacomer,
                ebai_temporefeicao: req.body.ebaiTemporefeicao,
                ebai_comportamento: req.body.ebaiComportamento,
                ebai_nauseavomita: req.body.ebaiNauseavomita,
                ebai_comidaparada: req.body.ebaiComidaparada,
                ebai_distrações: req.body.ebaiDistrações,
                ebai_forçarcomer: req.body.ebaiForçarcomer,
                ebai_mastigacao: req.body.ebaiMastigacao,
                ebai_crescimento: req.body.ebaiCrescimento,
                ebai_relacaocrianca: req.body.ebaiRelacaocrianca,
                ebai_relacaofamiliar: req.body.ebaiRelacaofamiliar,
                ebai_comentarios: req.body.ebaiComentarios,
                ebai_dataedi : dataAtual,
                ebai_usuidedi: req.cookies['idUsu'],
                ebai_lixo: "false"
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
    ebaiAdicionar: async (req,res) => {

        //Estrutura multiempresa
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        //;

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        console.log("ebaimodel");
        console.log("req.body.ebaiDatacad:")
        console.log(req.body.ebaiDatacad)
        const newEbai = new EbaiModel({
            ebai_terapeutaid: usuarioAtual,
            ebai_beneid: req.body.ebaiBeneid,
            ebai_dataaplica: req.body.ebaiDataaplica,
            ebai_momentosrefeicao: req.body.ebaiMomentosrefeicao,
            ebai_preocupacao: req.body.ebaiPreocupacao,
            ebai_apetite: req.body.ebaiApetite,
            ebai_recusacomer: req.body.ebaiRecusacomer,
            ebai_temporefeicao: req.body.ebaiTemporefeicao,
            ebai_comportamento: req.body.ebaiComportamento,
            ebai_nauseavomita: req.body.ebaiNauseavomita,
            ebai_comidaparada: req.body.ebaiComidaparada,
            ebai_distrações: req.body.ebaiDistrações,
            ebai_forçarcomer: req.body.ebaiForçarcomer,
            ebai_mastigacao: req.body.ebaiMastigacao,
            ebai_crescimento: req.body.ebaiCrescimento,
            ebai_relacaocrianca: req.body.ebaiRelacaocrianca,
            ebai_relacaofamiliar: req.body.ebaiRelacaofamiliar,
            ebai_comentarios: req.body.ebaiComentarios,
            ebai_datacad: dataAtual,
            ebai_usuidcad: usuarioAtual,
            ebai_lixo: "false"
        });
        console.log("newEbai save");
        await newEbai.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    // Função para contar registros
    qtregs: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        
        return await EbaiModel.countDocuments({ ebai_lixo: { $ne: "true" } })
            .then((count) => {
                return count;
            })
            .catch((err) => {
                console.log(err)
                return 0;
            });
    },

    // Função para deleção lógica
    ebaiDeletar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        
        let dataAtual = new Date();
        
        return await EbaiModel.findByIdAndUpdate(req.params.id, {
            $set: {
                ebai_lixo: "true",
                ebai_datalixo: dataAtual,
                ebai_usuidlixo: req.cookies['idUsu']
            }
        }).then(() => {
            return true;
        }).catch((err) => {
            console.log(err)
            return false;
        });
    }
};