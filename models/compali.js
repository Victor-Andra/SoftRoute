const { data } = require('jquery')
const mongoose = require('mongoose')
const usuario = require('./usuario')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const CompaliSchema = mongoose.Schema({
    compali_terapeutaid:{type: ObjectId, required: true},
    compali_beneid:{type: ObjectId, required: true},
    compali_dataaplica :{type: Date, required: false},
    compali_mastigar :{type: String, required: false},
    compali_engolesem :{type: String, required: false},
    compali_levaalimento :{type: String, required: false},
    compali_bocaaberta :{type: String, required: false},
    compali_evitavegetais :{type: String, required: false},
    compali_retiratempero :{type: String, required: false},
    compali_evitafrutas :{type: String, required: false},
    compali_inquietacao :{type: String, required: false},
    compali_sentarmesa :{type: String, required: false},
    compali_talheres :{type: String, required: false},
    compali_derramacomida :{type: String, required: false},
    compali_objetosestranhos :{type: String, required: false},
    compali_vomita :{type: String, required: false},
    compali_golfa :{type: String, required: false},
    compali_mesmosutens :{type: String, required: false},
    compali_mesmolugar :{type: String, required: false},
    compali_mesmosalim :{type: String, required: false},
    compali_coresemel :{type: String, required: false},
    compali_mesmamarca :{type: String, required: false},
    compali_ritualcomer :{type: String, required: false},
    compali_pegaforahor :{type: String, required: false},
    compali_pegaoutros :{type: String, required: false},
    compali_grandequant :{type: String, required: false},
    compali_intolgluten :{type: String, required: false},
    compali_alergia :{type: String, required: false},
    compali_intollactose :{type: String, required: false},
    compali_comentarios :{type: String, required: false},
    compali_datacad :{type: Date, required: false},
    compali_dataedi :{type: Date, required: false},
    compali_usuidcad :{type: ObjectId, required: false},
    compali_usuidedi :{type: ObjectId, required: false},
    compali_datalixo :{type: Date, required: false},
    compali_usuidlixo :{type: ObjectId, required: false},
    compali_lixo: {type: String, required: false}
})

class Compali{
    constructor(
        compali_terapeutaid,
        compali_beneid,
        compali_dataaplica,
        compali_mastigar,
        compali_engolesem,
        compali_levaalimento,
        compali_bocaaberta,
        compali_evitavegetais,
        compali_retiratempero,
        compali_evitafrutas,
        compali_inquietacao,
        compali_sentarmesa,
        compali_talheres,
        compali_derramacomida,
        compali_objetosestranhos,
        compali_vomita,
        compali_golfa,
        compali_mesmosutens,
        compali_mesmolugar,
        compali_mesmosalim,
        compali_coresemel,
        compali_mesmamarca,
        compali_ritualcomer,
        compali_pegaforahor,
        compali_pegaoutros,
        compali_grandequant,
        compali_intolgluten,
        compali_alergia,
        compali_intollactose,
        compali_comentarios,
        compali_datacad,
        compali_dataedi,
        compali_usuidcad,
        compali_usuidedi,
        compali_datalixo,
        compali_usuidlixo,
        compali_lixo
    ){
        this.compali_terapeutaid = compali_terapeutaid,
        this.compali_beneid = compali_beneid,
        this.compali_dataaplica = compali_dataaplica,
        this.compali_mastigar = compali_mastigar,
        this.compali_engolesem = compali_engolesem,
        this.compali_levaalimento = compali_levaalimento,
        this.compali_bocaaberta = compali_bocaaberta,
        this.compali_evitavegetais = compali_evitavegetais,
        this.compali_retiratempero = compali_retiratempero,
        this.compali_evitafrutas = compali_evitafrutas,
        this.compali_inquietacao = compali_inquietacao,
        this.compali_sentarmesa = compali_sentarmesa,
        this.compali_talheres = compali_talheres,
        this.compali_derramacomida = compali_derramacomida,
        this.compali_objetosestranhos = compali_objetosestranhos,
        this.compali_vomita = compali_vomita,
        this.compali_golfa = compali_golfa,
        this.compali_mesmosutens = compali_mesmosutens,
        this.compali_mesmolugar = compali_mesmolugar,
        this.compali_mesmosalim = compali_mesmosalim,
        this.compali_coresemel = compali_coresemel,
        this.compali_mesmamarca = compali_mesmamarca,
        this.compali_ritualcomer = compali_ritualcomer,
        this.compali_pegaforahor = compali_pegaforahor,
        this.compali_pegaoutros = compali_pegaoutros,
        this.compali_grandequant = compali_grandequant,
        this.compali_intolgluten = compali_intolgluten,
        this.compali_alergia = compali_alergia,
        this.compali_intollactose = compali_intollactose,
        this.compali_comentarios = compali_comentarios,
        this.compali_datacad = compali_datacad,
        this.compali_dataedi = compali_dataedi,
        this.compali_usuidcad = compali_usuidcad,
        this.compali_usuidedi = compali_usuidedi,
        this.compali_datalixo = compali_datalixo,
        this.compali_usuidlixo = compali_usuidlixo,
        this.compali_lixo = compali_lixo
    }
}

CompaliSchema.loadClass(Compali)
var CompaliModel = getModel("softroute", 'tb_compali', CompaliSchema)
module.exports = {CompaliModel,CompaliSchema,
    compaliEditar: async (req, res) => {

        //Estrutura multiempresa
        let db = req.cookies['preferredDb'];
        CompaliModel = getModel(db, 'tb_compali', CompaliSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await CompaliModel.findByIdAndUpdate(req.body.compaliId, 
            {$set: {
                compali_terapeutaid: req.body.compaliTerapeutaid,
                compali_beneid: req.body.compaliBeneid,
                compali_dataaplica: req.body.compaliDataaplica,
                compali_mastigar: req.body.compaliMastigar,
                compali_engolesem: req.body.compaliEngolesem,
                compali_levaalimento: req.body.compaliLevaalimento,
                compali_bocaaberta: req.body.compaliBocaaberta,
                compali_evitavegetais: req.body.compaliEvitavegetais,
                compali_retiratempero: req.body.compaliRetiratempero,
                compali_evitafrutas: req.body.compaliEvitafrutas,
                compali_inquietacao: req.body.compaliInquietacao,
                compali_sentarmesa: req.body.compaliSentarmesa,
                compali_talheres: req.body.compaliTalheres,
                compali_derramacomida: req.body.compaliDerramacomida,
                compali_objetosestranhos: req.body.compaliObjetosestranhos,
                compali_vomita: req.body.compaliVomita,
                compali_golfa: req.body.compaliGolfa,
                compali_mesmosutens: req.body.compaliMesmosutens,
                compali_mesmolugar: req.body.compaliMesmolugar,
                compali_mesmosalim: req.body.compaliMesmosalim,
                compali_coresemel: req.body.compaliCoresemel,
                compali_mesmamarca: req.body.compaliMesmamarca,
                compali_ritualcomer: req.body.compaliRitualcomer,
                compali_pegaforahor: req.body.compaliPegaforahor,
                compali_pegaoutros: req.body.compaliPegaoutros,
                compali_grandequant: req.body.compaliGrandequant,
                compali_intolgluten: req.body.compaliIntolgluten,
                compali_alergia: req.body.compaliAlergia,
                compali_intollactose: req.body.compaliIntollactose,
                compali_comentarios: req.body.compaliComentarios,
                compali_dataedi: dataAtual,
                compali_usuidedi: req.cookies['idUsu'],
                compali_lixo: "false"
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
    compaliAdicionar: async (req,res) => {

        //Estrutura multiempresa
        let db = req.cookies['preferredDb'];
        CompaliModel = getModel(db, 'tb_compali', CompaliSchema)
        //;

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        //let 
        console.log("compalimodel");
        console.log("req.body.compalidatacad:")
        console.log(req.body.compalidatacad)
        const newCompali = new CompaliModel({
            compali_terapeutaid: req.body.compaliTerapeutaid,
            compali_beneid: req.body.compaliBeneid,
            compali_dataaplica: req.body.compaliDataaplica,
            compali_mastigar: req.body.compaliMastigar,
            compali_engolesem: req.body.compaliEngolesem,
            compali_levaalimento: req.body.compaliLevaalimento,
            compali_bocaaberta: req.body.compaliBocaaberta,
            compali_evitavegetais: req.body.compaliEvitavegetais,
            compali_retiratempero: req.body.compaliRetiratempero,
            compali_evitafrutas: req.body.compaliEvitafrutas,
            compali_inquietacao: req.body.compaliInquietacao,
            compali_sentarmesa: req.body.compaliSentarmesa,
            compali_talheres: req.body.compaliTalheres,
            compali_derramacomida: req.body.compaliDerramacomida,
            compali_objetosestranhos: req.body.compaliObjetosestranhos,
            compali_vomita: req.body.compaliVomita,
            compali_golfa: req.body.compaliGolfa,
            compali_mesmosutens: req.body.compaliMesmosutens,
            compali_mesmolugar: req.body.compaliMesmolugar,
            compali_mesmosalim: req.body.compaliMesmosalim,
            compali_coresemel: req.body.compaliCoresemel,
            compali_mesmamarca: req.body.compaliMesmamarca,
            compali_ritualcomer: req.body.compaliRitualcomer,
            compali_pegaforahor: req.body.compaliPegaforahor,
            compali_pegaoutros: req.body.compaliPegaoutros,
            compali_grandequant: req.body.compaliGrandequant,
            compali_intolgluten: req.body.compaliIntolgluten,
            compali_alergia: req.body.compaliAlergia,
            compali_intollactose: req.body.compaliIntollactose,
            compali_comentarios: req.body.compaliComentarios,
            compali_datacad: dataAtual,
            compali_usuidcad: usuarioAtual,
            compali_lixo: "false"
        });
        console.log("newCompali save");
        await newCompali.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    // Função para contar registros (necessária para listagem)
    qtregs: async (req, res) => {
        let db = req.cookies['preferredDb'];
        CompaliModel = getModel(db, 'tb_compali', CompaliSchema)
        
        return await CompaliModel.countDocuments({ compali_lixo: { $ne: "true" } })
            .then((count) => {
                return count;
            })
            .catch((err) => {
                console.log(err)
                return 0;
            });
    },

    // Função para deleção lógica
    compaliDeletar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        CompaliModel = getModel(db, 'tb_compali', CompaliSchema)
        
        let dataAtual = new Date();
        
        return await CompaliModel.findByIdAndUpdate(req.params.id, {
            $set: {
                compali_lixo: "true",
                compali_datalixo: dataAtual,
                compali_usuidlixo: req.cookies['idUsu']
            }
        }).then(() => {
            return true;
        }).catch((err) => {
            console.log(err)
            return false;
        });
    }
};