const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const EbaiSchema = mongoose.Schema({
    // --- Campos originais (SEM ACENTOS) ---
    ebai_terapeutaid: { type: ObjectId, required: true },
    ebai_beneid: { type: ObjectId, required: true },
    ebai_dataaplica: { type: Date, required: false },
    ebai_momentosrefeicao: { type: String, required: false },
    ebai_preocupacao: { type: String, required: false },
    ebai_apetite: { type: String, required: false },
    ebai_recusacomer: { type: String, required: false },
    ebai_temporefeicao: { type: String, required: false },
    ebai_comportamento: { type: String, required: false },
    ebai_nauseavomita: { type: String, required: false },
    ebai_comidaparada: { type: String, required: false },
    ebai_distracoes: { type: String, required: false },       // SEM ACENTO
    ebai_forcarcomer: { type: String, required: false },      // SEM ACENTO
    ebai_mastigacao: { type: String, required: false },
    ebai_crescimento: { type: String, required: false },
    ebai_relacaocrianca: { type: String, required: false },
    ebai_relacaofamiliar: { type: String, required: false },
    ebai_comentarios: { type: String, required: false },
    ebai_datacad: { type: Date, required: false },
    ebai_dataedi: { type: Date, required: false },
    ebai_usuidcad: { type: ObjectId, required: false },
    ebai_usuidedi: { type: ObjectId, required: false },
    ebai_datalixo: { type: Date, required: false },
    ebai_usuidlixo: { type: ObjectId, required: false },
    ebai_lixo: { type: String, required: false },

    // --- Campos de INVERSÃO (Boolean) ---
    ebai_inv_momentosrefeicao: { type: Boolean, default: true },
    ebai_inv_preocupacao: { type: Boolean, default: false },
    ebai_inv_apetite: { type: Boolean, default: true },
    ebai_inv_recusacomer: { type: Boolean, default: true },
    ebai_inv_temporefeicao: { type: Boolean, default: false },
    ebai_inv_comportamento: { type: Boolean, default: false },
    ebai_inv_nauseavomita: { type: Boolean, default: false },
    ebai_inv_comidaparada: { type: Boolean, default: true },
    ebai_inv_distracoes: { type: Boolean, default: false },       // SEM ACENTO
    ebai_inv_forcarcomer: { type: Boolean, default: true },       // SEM ACENTO
    ebai_inv_mastigacao: { type: Boolean, default: false },
    ebai_inv_crescimento: { type: Boolean, default: true },
    ebai_inv_relacaocrianca: { type: Boolean, default: true },
    ebai_inv_relacaofamiliar: { type: Boolean, default: false },

    // --- Campos de CÁLCULO (Number) ---
    ebai_cal_momentosrefeicao: { type: Number, default: 0 },
    ebai_cal_preocupacao: { type: Number, default: 0 },
    ebai_cal_apetite: { type: Number, default: 0 },
    ebai_cal_recusacomer: { type: Number, default: 0 },
    ebai_cal_temporefeicao: { type: Number, default: 0 },
    ebai_cal_comportamento: { type: Number, default: 0 },
    ebai_cal_nauseavomita: { type: Number, default: 0 },
    ebai_cal_comidaparada: { type: Number, default: 0 },
    ebai_cal_distracoes: { type: Number, default: 0 },            // SEM ACENTO
    ebai_cal_forcarcomer: { type: Number, default: 0 },           // SEM ACENTO
    ebai_cal_mastigacao: { type: Number, default: 0 },
    ebai_cal_crescimento: { type: Number, default: 0 },
    ebai_cal_relacaocrianca: { type: Number, default: 0 },
    ebai_cal_relacaofamiliar: { type: Number, default: 0 },

    // --- Campos de TOTAIS ---
    ebai_escore_bruto: { type: Number, default: 0 },
    ebai_escore_t: { type: Number, default: 0 },
    ebai_interpretacao: { type: String, default: '' }
})

class Ebai {
    constructor(
        ebai_terapeutaid, ebai_beneid, ebai_dataaplica,
        ebai_momentosrefeicao, ebai_preocupacao, ebai_apetite,
        ebai_recusacomer, ebai_temporefeicao, ebai_comportamento,
        ebai_nauseavomita, ebai_comidaparada, ebai_distracoes, ebai_forcarcomer,
        ebai_mastigacao, ebai_crescimento, ebai_relacaocrianca, ebai_relacaofamiliar,
        ebai_comentarios, ebai_datacad, ebai_dataedi, ebai_usuidcad, ebai_usuidedi,
        ebai_usuidlixo, ebai_datalixo, ebai_lixo,
        ebai_inv_momentosrefeicao, ebai_inv_preocupacao, ebai_inv_apetite,
        ebai_inv_recusacomer, ebai_inv_temporefeicao, ebai_inv_comportamento,
        ebai_inv_nauseavomita, ebai_inv_comidaparada, ebai_inv_distracoes, ebai_inv_forcarcomer,
        ebai_inv_mastigacao, ebai_inv_crescimento, ebai_inv_relacaocrianca, ebai_inv_relacaofamiliar,
        ebai_cal_momentosrefeicao, ebai_cal_preocupacao, ebai_cal_apetite,
        ebai_cal_recusacomer, ebai_cal_temporefeicao, ebai_cal_comportamento,
        ebai_cal_nauseavomita, ebai_cal_comidaparada, ebai_cal_distracoes, ebai_cal_forcarcomer,
        ebai_cal_mastigacao, ebai_cal_crescimento, ebai_cal_relacaocrianca, ebai_cal_relacaofamiliar,
        ebai_escore_bruto, ebai_escore_t, ebai_interpretacao
    ) {
        this.ebai_terapeutaid = ebai_terapeutaid; this.ebai_beneid = ebai_beneid; this.ebai_dataaplica = ebai_dataaplica;
        this.ebai_momentosrefeicao = ebai_momentosrefeicao; this.ebai_preocupacao = ebai_preocupacao; this.ebai_apetite = ebai_apetite;
        this.ebai_recusacomer = ebai_recusacomer; this.ebai_temporefeicao = ebai_temporefeicao; this.ebai_comportamento = ebai_comportamento;
        this.ebai_nauseavomita = ebai_nauseavomita; this.ebai_comidaparada = ebai_comidaparada; this.ebai_distracoes = ebai_distracoes; this.ebai_forcarcomer = ebai_forcarcomer;
        this.ebai_mastigacao = ebai_mastigacao; this.ebai_crescimento = ebai_crescimento; this.ebai_relacaocrianca = ebai_relacaocrianca; this.ebai_relacaofamiliar = ebai_relacaofamiliar;
        this.ebai_comentarios = ebai_comentarios; this.ebai_datacad = ebai_datacad; this.ebai_dataedi = ebai_dataedi;
        this.ebai_usuidcad = ebai_usuidcad; this.ebai_usuidedi = ebai_usuidedi; this.ebai_usuidlixo = ebai_usuidlixo; this.ebai_datalixo = ebai_datalixo; this.ebai_lixo = ebai_lixo;
        this.ebai_inv_momentosrefeicao = ebai_inv_momentosrefeicao; this.ebai_inv_preocupacao = ebai_inv_preocupacao; this.ebai_inv_apetite = ebai_inv_apetite;
        this.ebai_inv_recusacomer = ebai_inv_recusacomer; this.ebai_inv_temporefeicao = ebai_inv_temporefeicao; this.ebai_inv_comportamento = ebai_inv_comportamento;
        this.ebai_inv_nauseavomita = ebai_inv_nauseavomita; this.ebai_inv_comidaparada = ebai_inv_comidaparada; this.ebai_inv_distracoes = ebai_inv_distracoes; this.ebai_inv_forcarcomer = ebai_inv_forcarcomer;
        this.ebai_inv_mastigacao = ebai_inv_mastigacao; this.ebai_inv_crescimento = ebai_inv_crescimento; this.ebai_inv_relacaocrianca = ebai_inv_relacaocrianca; this.ebai_inv_relacaofamiliar = ebai_inv_relacaofamiliar;
        this.ebai_cal_momentosrefeicao = ebai_cal_momentosrefeicao; this.ebai_cal_preocupacao = ebai_cal_preocupacao; this.ebai_cal_apetite = ebai_cal_apetite;
        this.ebai_cal_recusacomer = ebai_cal_recusacomer; this.ebai_cal_temporefeicao = ebai_cal_temporefeicao; this.ebai_cal_comportamento = ebai_cal_comportamento;
        this.ebai_cal_nauseavomita = ebai_cal_nauseavomita; this.ebai_cal_comidaparada = ebai_cal_comidaparada; this.ebai_cal_distracoes = ebai_cal_distracoes; this.ebai_cal_forcarcomer = ebai_cal_forcarcomer;
        this.ebai_cal_mastigacao = ebai_cal_mastigacao; this.ebai_cal_crescimento = ebai_cal_crescimento; this.ebai_cal_relacaocrianca = ebai_cal_relacaocrianca; this.ebai_cal_relacaofamiliar = ebai_cal_relacaofamiliar;
        this.ebai_escore_bruto = ebai_escore_bruto; this.ebai_escore_t = ebai_escore_t; this.ebai_interpretacao = ebai_interpretacao;
    }
}

EbaiSchema.loadClass(Ebai)
var EbaiModel = getModel("softroute", 'tb_ebai', EbaiSchema)

function calcularEbai(valoresOriginais, inversoes) {
    const campos = [
        'momentosrefeicao','preocupacao','apetite','recusacomer',
        'temporefeicao','comportamento','nauseavomita','comidaparada',
        'distracoes','forcarcomer','mastigacao','crescimento',
        'relacaocrianca','relacaofamiliar'
    ];
    
    const calculados = {};
    let escoreBruto = 0;
    
    campos.forEach(campo => {
        const original = parseInt(valoresOriginais[campo]) || 0;
        const invertido = inversoes[campo] === true || inversoes[campo] === 'true';
        let final = 0;
        if (original > 0) {
            final = invertido ? (8 - original) : original;
        }
        calculados[campo] = final;
        escoreBruto += final;
    });
    
    const tabelaT = {
        14:35,15:36,16:37,17:38,18:39,19:39,20:40,21:41,22:42,23:43,24:43,25:44,26:45,27:46,28:46,29:47,30:48,31:49,32:50,33:50,
        34:51,35:52,36:53,37:54,38:54,39:55,40:56,41:57,42:57,43:58,44:59,45:60,46:60,47:61,48:61,49:62,50:63,51:63,52:64,53:65,
        54:65,55:66,56:66,57:67,58:68,59:68,60:69,61:70,62:70,63:71,64:72,65:72,66:73,67:74,68:75,69:76,70:76,71:77,72:78,73:79,
        74:80,75:80,76:81,77:82,78:83,79:83,80:84,81:85,82:86,83:87,84:87,85:88,86:89,87:90,88:91,89:91,90:92,91:93,92:94,93:94,
        94:95,95:96,96:97,97:98,98:98
    };
    
    const escoreT = tabelaT[escoreBruto] || 0;
    let interpretacao = '';
    if (escoreT === 0) interpretacao = '';
    else if (escoreT <= 60) interpretacao = 'Sem dificuldades';
    else if (escoreT <= 65) interpretacao = 'Dificuldades leves';
    else if (escoreT <= 70) interpretacao = 'Dificuldades moderadas';
    else interpretacao = 'Dificuldades severas';
    
    return { calculados, escoreBruto, escoreT, interpretacao };
}

module.exports = {
    EbaiModel, EbaiSchema, calcularEbai,
    
    ebaiEditar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        let dataAtual = new Date();
        let resultado;
        
        const valoresOriginais = {
            momentosrefeicao: req.body.ebaiMomentosrefeicao, preocupacao: req.body.ebaiPreocupacao, apetite: req.body.ebaiApetite,
            recusacomer: req.body.ebaiRecusacomer, temporefeicao: req.body.ebaiTemporefeicao, comportamento: req.body.ebaiComportamento,
            nauseavomita: req.body.ebaiNauseavomita, comidaparada: req.body.ebaiComidaparada, distracoes: req.body.ebaiDistracoes,
            forcarcomer: req.body.ebaiForcarcomer, mastigacao: req.body.ebaiMastigacao, crescimento: req.body.ebaiCrescimento,
            relacaocrianca: req.body.ebaiRelacaocrianca, relacaofamiliar: req.body.ebaiRelacaofamiliar
        };
        
        const inversoes = {
            momentosrefeicao: req.body.ebaiInvMomentosrefeicao, preocupacao: req.body.ebaiInvPreocupacao, apetite: req.body.ebaiInvApetite,
            recusacomer: req.body.ebaiInvRecusacomer, temporefeicao: req.body.ebaiInvTemporefeicao, comportamento: req.body.ebaiInvComportamento,
            nauseavomita: req.body.ebaiInvNauseavomita, comidaparada: req.body.ebaiInvComidaparada, distracoes: req.body.ebaiInvDistracoes,
            forcarcomer: req.body.ebaiInvForcarcomer, mastigacao: req.body.ebaiInvMastigacao, crescimento: req.body.ebaiInvCrescimento,
            relacaocrianca: req.body.ebaiInvRelacaocrianca, relacaofamiliar: req.body.ebaiInvRelacaofamiliar
        };
        
        const calc = calcularEbai(valoresOriginais, inversoes);
        
        const setObj = {
            ebai_terapeutaid: req.body.ebaiTerapeutaid, ebai_beneid: req.body.ebaiBeneid, ebai_dataaplica: req.body.ebaiDataaplica,
            ebai_momentosrefeicao: req.body.ebaiMomentosrefeicao, ebai_preocupacao: req.body.ebaiPreocupacao, ebai_apetite: req.body.ebaiApetite,
            ebai_recusacomer: req.body.ebaiRecusacomer, ebai_temporefeicao: req.body.ebaiTemporefeicao, ebai_comportamento: req.body.ebaiComportamento,
            ebai_nauseavomita: req.body.ebaiNauseavomita, ebai_comidaparada: req.body.ebaiComidaparada, ebai_distracoes: req.body.ebaiDistracoes,
            ebai_forcarcomer: req.body.ebaiForcarcomer, ebai_mastigacao: req.body.ebaiMastigacao, ebai_crescimento: req.body.ebaiCrescimento,
            ebai_relacaocrianca: req.body.ebaiRelacaocrianca, ebai_relacaofamiliar: req.body.ebaiRelacaofamiliar, ebai_comentarios: req.body.ebaiComentarios,
            ebai_dataedi: dataAtual, ebai_usuidedi: req.cookies['idUsu'], ebai_lixo: "false",
            ebai_inv_momentosrefeicao: inversoes.momentosrefeicao, ebai_inv_preocupacao: inversoes.preocupacao, ebai_inv_apetite: inversoes.apetite,
            ebai_inv_recusacomer: inversoes.recusacomer, ebai_inv_temporefeicao: inversoes.temporefeicao, ebai_inv_comportamento: inversoes.comportamento,
            ebai_inv_nauseavomita: inversoes.nauseavomita, ebai_inv_comidaparada: inversoes.comidaparada, ebai_inv_distracoes: inversoes.distracoes,
            ebai_inv_forcarcomer: inversoes.forcarcomer, ebai_inv_mastigacao: inversoes.mastigacao, ebai_inv_crescimento: inversoes.crescimento,
            ebai_inv_relacaocrianca: inversoes.relacaocrianca, ebai_inv_relacaofamiliar: inversoes.relacaofamiliar,
            ebai_cal_momentosrefeicao: calc.calculados.momentosrefeicao, ebai_cal_preocupacao: calc.calculados.preocupacao, ebai_cal_apetite: calc.calculados.apetite,
            ebai_cal_recusacomer: calc.calculados.recusacomer, ebai_cal_temporefeicao: calc.calculados.temporefeicao, ebai_cal_comportamento: calc.calculados.comportamento,
            ebai_cal_nauseavomita: calc.calculados.nauseavomita, ebai_cal_comidaparada: calc.calculados.comidaparada, ebai_cal_distracoes: calc.calculados.distracoes,
            ebai_cal_forcarcomer: calc.calculados.forcarcomer, ebai_cal_mastigacao: calc.calculados.mastigacao, ebai_cal_crescimento: calc.calculados.crescimento,
            ebai_cal_relacaocrianca: calc.calculados.relacaocrianca, ebai_cal_relacaofamiliar: calc.calculados.relacaofamiliar,
            ebai_escore_bruto: calc.escoreBruto, ebai_escore_t: calc.escoreT, ebai_interpretacao: calc.interpretacao
        };
        
        await EbaiModel.findByIdAndUpdate(req.body.ebaiId, { $set: setObj })
            .then(() => { resultado = true; })
            .catch((err) => { console.log(err); resultado = err; });
        return resultado;
    },
    
    ebaiAdicionar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        const valoresOriginais = {
            momentosrefeicao: req.body.ebaiMomentosrefeicao, preocupacao: req.body.ebaiPreocupacao, apetite: req.body.ebaiApetite,
            recusacomer: req.body.ebaiRecusacomer, temporefeicao: req.body.ebaiTemporefeicao, comportamento: req.body.ebaiComportamento,
            nauseavomita: req.body.ebaiNauseavomita, comidaparada: req.body.ebaiComidaparada, distracoes: req.body.ebaiDistracoes,
            forcarcomer: req.body.ebaiForcarcomer, mastigacao: req.body.ebaiMastigacao, crescimento: req.body.ebaiCrescimento,
            relacaocrianca: req.body.ebaiRelacaocrianca, relacaofamiliar: req.body.ebaiRelacaofamiliar
        };
        
        const inversoes = {
            momentosrefeicao: req.body.ebaiInvMomentosrefeicao, preocupacao: req.body.ebaiInvPreocupacao, apetite: req.body.ebaiInvApetite,
            recusacomer: req.body.ebaiInvRecusacomer, temporefeicao: req.body.ebaiInvTemporefeicao, comportamento: req.body.ebaiInvComportamento,
            nauseavomita: req.body.ebaiInvNauseavomita, comidaparada: req.body.ebaiInvComidaparada, distracoes: req.body.ebaiInvDistracoes,
            forcarcomer: req.body.ebaiInvForcarcomer, mastigacao: req.body.ebaiInvMastigacao, crescimento: req.body.ebaiInvCrescimento,
            relacaocrianca: req.body.ebaiInvRelacaocrianca, relacaofamiliar: req.body.ebaiInvRelacaofamiliar
        };
        
        const calc = calcularEbai(valoresOriginais, inversoes);
        
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
            ebai_distracoes: req.body.ebaiDistracoes,
            ebai_forcarcomer: req.body.ebaiForcarcomer, 
            ebai_mastigacao: req.body.ebaiMastigacao, 
            ebai_crescimento: req.body.ebaiCrescimento,
            ebai_relacaocrianca: req.body.ebaiRelacaocrianca, 
            ebai_relacaofamiliar: req.body.ebaiRelacaofamiliar, 
            ebai_comentarios: req.body.ebaiComentarios,
            ebai_datacad: dataAtual, ebai_usuidcad: usuarioAtual,
            ebai_lixo: "false",
            ebai_inv_momentosrefeicao: inversoes.momentosrefeicao, 
            ebai_inv_preocupacao: inversoes.preocupacao, 
            ebai_inv_apetite: inversoes.apetite,
            ebai_inv_recusacomer: inversoes.recusacomer, 
            ebai_inv_temporefeicao: inversoes.temporefeicao, 
            ebai_inv_comportamento: inversoes.comportamento,
            ebai_inv_nauseavomita: inversoes.nauseavomita, 
            ebai_inv_comidaparada: inversoes.comidaparada, 
            ebai_inv_distracoes: inversoes.distracoes,
            ebai_inv_forcarcomer: inversoes.forcarcomer, 
            ebai_inv_mastigacao: inversoes.mastigacao, 
            ebai_inv_crescimento: inversoes.crescimento,
            ebai_inv_relacaocrianca: inversoes.relacaocrianca, 
            ebai_inv_relacaofamiliar: inversoes.relacaofamiliar,
            ebai_cal_momentosrefeicao: calc.calculados.momentosrefeicao, 
            ebai_cal_preocupacao: calc.calculados.preocupacao, 
            ebai_cal_apetite: calc.calculados.apetite,
            ebai_cal_recusacomer: calc.calculados.recusacomer, 
            ebai_cal_temporefeicao: calc.calculados.temporefeicao, 
            ebai_cal_comportamento: calc.calculados.comportamento,
            ebai_cal_nauseavomita: calc.calculados.nauseavomita, 
            ebai_cal_comidaparada: calc.calculados.comidaparada, 
            ebai_cal_distracoes: calc.calculados.distracoes,
            ebai_cal_forcarcomer: calc.calculados.forcarcomer, 
            ebai_cal_mastigacao: calc.calculados.mastigacao, 
            ebai_cal_crescimento: calc.calculados.crescimento,
            ebai_cal_relacaocrianca: calc.calculados.relacaocrianca, 
            ebai_cal_relacaofamiliar: calc.calculados.relacaofamiliar,
            ebai_escore_bruto: calc.escoreBruto, 
            ebai_escore_t: calc.escoreT, 
            ebai_interpretacao: calc.interpretacao
        });
        
        try {
            await newEbai.save();
            return true;
        } catch (err) {
            console.log(err);
            return false;
        }
    },
    
    qtregs: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        return await EbaiModel.countDocuments({ ebai_lixo: { $ne: "true" } }).catch(() => 0);
    },
    
    ebaiDeletar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        EbaiModel = getModel(db, 'tb_ebai', EbaiSchema)
        return await EbaiModel.findByIdAndUpdate(req.params.id, {
            $set: { ebai_lixo: "true", ebai_datalixo: new Date(), ebai_usuidlixo: req.cookies['idUsu'] }
        }).then(() => true).catch(() => false);
    }
};