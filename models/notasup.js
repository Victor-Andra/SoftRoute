const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const notaSupObsClass = require("./notasupobs")
const { getModel } = require('../functions/fncGeral');
const { Resposta } = require('../functions/fncGeral');

const NotasupSchema = mongoose.Schema({
    notasup_tiposup :{ type: String, required: false },
    notasup_datanotasup :{ type: String, required: false },
    notasup_horanotasup :{ type: String, required: false },
    notasup_terapeutaid :{ type: ObjectId, required: false },
    notasup_beneid :{ type: ObjectId, required: false },
    notasup_beneidade :{ type: String, required: false },
    notasup_benedatanasc :{ type: String, required: false },
    notasup_supid :{ type: ObjectId, required: false },
    //observações comportamentais
    //topografia comportamental
    notasup_topocomp :{ type: String, required: false },
    //funções comportamentais
    notasup_fugaevit :{ type: String, required: false },
    notasup_atencao :{ type: String, required: false },
    notasup_tangivel :{ type: String, required: false },
    notasup_automatico :{ type: String, required: false },
    notasup_notanarratfunc :{ type: String, required: false },
    //metodos de gravação
    notasup_abc :{ type: String, required: false },
    notasup_duracao :{ type: String, required: false },
    notasup_taxa :{ type: String, required: false },
    notasup_gravevento :{ type: String, required: false },
    notasup_prodper :{ type: String, required: false },
    notasup_mandsfreq :{ type: String, required: false },
    notasup_notanarratgrav :{ type: String, required: false },
    //mudanças de programação
    notasup_alvosdominados :{ type: String, required: false },
    notasup_notasdicas :{ type: String, required: false },
    notasup_notasprog :{ type: String, required: false },
    //informação terapeuta
    notasup_infteracoment :{ type: String, required: false },
    notasup_infteraduvid :{ type: String, required: false },
    //informação direta
    notasup_infdircoment :{ type: String, required: false },
    notasup_infdirduvid :{ type: String, required: false },
    //acompanhamento de ações
    notasup_acompprog :{ type: String, required: false },
    notasup_acompgeral :{ type: String, required: false },
    notasup_obsIds :{ type: String, required: false },
    notasup_obs: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
            notaSupObs_beneid :{ type: ObjectId, required: true },
            notaSupObs_progid :{ type: ObjectId, required: true },
            notaSupObs_analise :{ type: String, required: false },
            notaSupObs_sugestao :{ type: String, required: false }
        }
    ],
    //Atributos de controle
    notasup_usuidcad :{ type: ObjectId, required: false },
    notasup_usuidedi :{ type: ObjectId, required: false },
    notasup_datacad :{ type: String, required: false },
    notasup_dataedi :{ type: String, required: false },
    notasup_lixo :{ type: String, required: false }
    
})

class Notasup{
    constructor(
        notasup_tiposup,
        notasup_datanotasup,
        notasup_horanotasup,
        notasup_terapeutaid,
        notasup_beneid,
        notasup_beneidade,
        notasup_benedatanasc,
        notasup_supid,
        //observações comportamentais
        //topografia comportamental
        notasup_topocomp,
        //funções comportamentais
        notasup_fugaevit,
        notasup_atencao,
        notasup_tangivel,
        notasup_automatico,
        notasup_notanarratfunc,
        //metodos de gravação
        notasup_abc,
        notasup_duracao,
        notasup_taxa,
        notasup_gravevento,
        notasup_prodper,
        notasup_mandsfreq,
        notasup_notanarratgrav,
        //mudanças de programação
        notasup_alvosdominados,
        notasup_notasdicas,
        notasup_notasprog,
        //informação terapeuta
        notasup_infteracoment,
        notasup_infteraduvid,
        //informação direta
        notasup_infdircoment,
        notasup_infdirduvid,
        //acompanhamento de ações
        notasup_acompprog,
        notasup_acompgeral,
        notasup_obsIds,
        notasup_obs,
        //Atributos de controle
        notasup_usuidcad,
        notasup_usuidedi,
        notasup_datacad,
        notasup_dataedi,
        notasup_lixo
        
        ){
            this.notasup_tiposup = notasup_tiposup,
            this.notasup_datanotasup = notasup_datanotasup,
            this.notasup_horanotasup = notasup_horanotasup,
            this.notasup_terapeutaid = notasup_terapeutaid,
            this.notasup_beneid = notasup_beneid,
            this.notasup_beneidade = notasup_beneidade,
            this.notasup_benedatanasc = notasup_benedatanasc,
            this.notasup_supid = notasup_supid,
            //observações comportamentais
            //topografia comportamental
            this.notasup_topocomp = notasup_topocomp,
            //funções comportamentais
            this.notasup_fugaevit = notasup_fugaevit,
            this.notasup_atencao = notasup_atencao,
            this.notasup_tangivel = notasup_tangivel,
            this.notasup_automatico = notasup_automatico,
            this.notasup_notanarratfunc = notasup_notanarratfunc,
            //metodos de gravação
            this.notasup_abc = notasup_abc,
            this.notasup_duracao = notasup_duracao,
            this.notasup_taxa = notasup_taxa,
            this.notasup_gravevento = notasup_gravevento,
            this.notasup_prodper = notasup_prodper,
            this.notasup_mandsfreq = notasup_mandsfreq,
            this.notasup_notanarratgrav = notasup_notanarratgrav,
            //mudanças de programação
            this.notasup_alvosdominados = notasup_alvosdominados,
            this.notasup_notasdicas = notasup_notasdicas,
            this.notasup_notasprog = notasup_notasprog,
            //informação terapeuta
            this.notasup_infteracoment = notasup_infteracoment,
            this.notasup_infteraduvid = notasup_infteraduvid,
            //informação direta
            this.notasup_infdircoment = notasup_infdircoment,
            this.notasup_infdirduvid = notasup_infdirduvid,
            //acompanhamento de ações
            this.notasup_acompprog = notasup_acompprog,
            this.notasup_acompgeral = notasup_acompgeral,
            this.notasup_obsIds = notasup_obsIds,
            this.notasup_obs = notasup_obs,
            //Atributos de controle
            this.notasup_usuidcad = notasup_usuidcad,
            this.notasup_usuidedi = notasup_usuidedi,
            this.notasup_datacad = notasup_datacad,
            this.notasup_dataedi = notasup_dataedi,
            this.notasup_lixo = notasup_lixo
                   
    }
}

NotasupSchema.loadClass(Notasup)
var Notasupobs = getModel("softroute", 'tb_notasupobs', notaSupObsClass.notasupobsSchema)
var NotasupModel = getModel("softroute", 'tb_notasup', NotasupSchema)
module.exports = {
    NotasupModel,
    NotasupSchema,

    notasupEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        NotasupModel = getModel(db, 'tb_notasup', NotasupSchema)
        //;

         //Pega data atual
        let dataAtual = new Date();
        let resultado;
        //Informação do Usuario
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })

        let observacoes = [];
        if (req.body.observacoes) {
            Object.values(req.body.observacoes).forEach(obs => {
                if (obs.programa || obs.analise || obs.sugestao) {
                    observacoes.push({
                        notaSupObs_beneid: req.body.notasupBeneid,
                        notaSupObs_progid: new ObjectId(obs.programa),
                        notaSupObs_analise: (""+obs.analise+""),
                        notaSupObs_sugestao: (""+obs.sugestao+"")
                    });
                }
            });
        }
        console.log("req.body.notasupId: "+req.body.notasupId)
        //Realiza Atualização
        await NotasupModel.findByIdAndUpdate(req.body.notasupId, 
            {$set: {
                notasup_tiposup : req.body.notasupTiposup,
                notasup_datanotasup : req.body.notasupDatanotasup,
                notasup_horanotasup : req.body.notasupHoranotasup,
                notasup_terapeutaid : req.body.notasupTerapeutaid,
                notasup_beneid : req.body.notasupBeneid,
                notasup_beneidade : req.body.notasupBeneidade,
                notasup_benedatanasc : req.body.notasupBenedatanasc,
                notasup_supid : req.body.notasupSupid,
                //observações comportamentais
                //topografia comportamental
                notasup_topocomp : req.body.notasupTopocomp,
                //funções comportamentais
                notasup_fugaevit : req.body.notasupFugaevit,
                notasup_atencao : req.body.notasupAtencao,
                notasup_tangivel : req.body.notasupTangivel,
                notasup_automatico : req.body.notasupAutomatico,
                notasup_notanarratfunc : req.body.notasupNotanarratfunc,
                //metodos de gravação
                notasup_abc : req.body.notasupAbc,
                notasup_duracao : req.body.notasupDuracao,
                notasup_taxa : req.body.notasupTaxa,
                notasup_gravevento : req.body.notasupGravevento,
                notasup_prodper : req.body.notasupProdper,
                notasup_mandsfreq : req.body.notasupMandsfreq,
                notasup_notanarratgrav : req.body.notasupNotanarratgrav,
                //mudanças de programação
                notasup_alvosdominados : req.body.notasupAlvosdominados,
                notasup_notasdicas : req.body.notasupNotasdicas,
                notasup_notasprog : req.body.notasupNotasprog,
                //informação terapeuta
                notasup_infteracoment : req.body.notasupInfteracoment,
                notasup_infteraduvid : req.body.notasupInfteraduvid,
                //informação direta
                notasup_infdircoment : req.body.notasupInfdircoment,
                notasup_infdirduvid : req.body.notasupInfdirduvid,
                //acompanhamento de ações
                notasup_acompprog : req.body.notasupAcompprog,
                notasup_acompgeral : req.body.notasupAcompgeral,
                //notasupobs
                notasup_obs : observacoes,
                //Atributos de controle
                notasup_usuidedi : idUsu,
                notasup_dataedi : dataAtual.toISOString(),
                notasup_lixo : "false"
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
    notasupAdicionar: async (req,res) => {

         //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        NotasupModel = getModel(db, 'tb_notasup', NotasupSchema)
        //;

        //Pega data atual
        let dataAtual = new Date();
        let resultado;
        //Informação do Usuario
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const NewNotasup = new NotasupModel({
            notasup_tiposup : req.body.notasupTiposup,
            notasup_datanotasup : req.body.notasupDatanotasup,
            notasup_horanotasup : req.body.notasupHoranotasup,
            notasup_terapeutaid : req.body.notasupTerapeutaid,
            notasup_beneid : req.body.notasupBeneid,
            notasup_beneidade : req.body.notasupBeneidade,
            notasup_benedatanasc : req.body.notasupBenedatanasc,
            notasup_supid : req.body.notasupSupid,
            //observações comportamentais
            //topografia comportamental
            notasup_topocomp : req.body.notasupTopocomp,
            //funções comportamentais
            notasup_fugaevit : req.body.notasupFugaevit,
            notasup_atencao : req.body.notasupAtencao,
            notasup_tangivel : req.body.notasupTangivel,
            notasup_automatico : req.body.notasupAutomatico,
            notasup_notanarratfunc : req.body.notasupNotanarratfunc,
            //metodos de gravação
            notasup_abc : req.body.notasupAbc,
            notasup_duracao : req.body.notasupDuracao,
            notasup_taxa : req.body.notasupTaxa,
            notasup_gravevento : req.body.notasupGravevento,
            notasup_prodper : req.body.notasupProdper,
            notasup_mandsfreq : req.body.notasupMandsfreq,
            notasup_notanarratgrav : req.body.notasupNotanarratgrav,
            //mudanças de programação
            notasup_alvosdominados : req.body.notasupAlvosdominados,
            notasup_notasdicas : req.body.notasupNotasdicas,
            notasup_notasprog : req.body.notasupNotasprog,
            //informação terapeuta
            notasup_infteracoment : req.body.notasupInfteracoment,
            notasup_infteraduvid : req.body.notasupInfteraduvid,
            //informação direta
            notasup_infdircoment : req.body.notasupInfdircoment,
            notasup_infdirduvid : req.body.notasupInfdirduvid,
            //acompanhamento de ações
            notasup_acompprog : req.body.notasupAcompprog,
            notasup_acompgeral : req.body.notasupAcompgeral,
            //notasupobs
            notasup_obs : observacoes,
            //Atributos de controle
            notasup_usuidcad : idUsu,
            notasup_dataedi : dataAtual.toISOString(),
            notasup_lixo : "false"
            
        });
        console.log("NewNotasup save");
        await NewNotasup.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    notaSupEObsAdicionar: async (req, res) => {

         //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        NotasupModel = getModel(db, 'tb_notasup', NotasupSchema)
        //;

        let resultado;
        let resposta = new Resposta();
        let dataAtual = new Date();
        
        // Informações do Usuário
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9', '62421903a12aa557219a0fd3'];
        
        arrayIds.forEach((id) => {
            if (id == lvlUsu) {
                idUsu = id;
            }
        });

        let observacoes = [];
        if (req.body.observacoes) {
            Object.values(req.body.observacoes).forEach(obs => {
                if (obs.programa || obs.analise || obs.sugestao) {
                    observacoes.push({
                        notaSupObs_beneid: req.body.notasupBeneid,
                        notaSupObs_progid: new ObjectId(obs.programa),
                        notaSupObs_analise: (""+obs.analise+""),
                        notaSupObs_sugestao: (""+obs.sugestao+"")
                    });
                }
            });
        }
        // Adiciona um novo objeto Notasup com os dados recebidos do formulário
        const NewNotasup = new NotasupModel({
            notasup_tiposup: req.body.notasupTiposup, // Tipo de supervisão
            notasup_datanotasup: req.body.notasupDatanotasup, // Data da supervisão
            notasup_horanotasup: req.body.notasupHoranotasup, // Hora da supervisão
            notasup_terapeutaid: req.body.notasupTerapeutaid, // ID do terapeuta
            notasup_beneid: req.body.notasupBeneid, // ID do beneficiário
            notasup_beneidade: req.body.notasupBeneidade, // Idade do beneficiário
            notasup_benedatanasc: req.body.notasupBenedatanasc, // Data de nascimento do beneficiário
            notasup_supid: req.body.notasupSupid, // ID do supervisor
            // Observações comportamentais
            notasup_topocomp: req.body.notasupTopocomp, // Topografia comportamental
            notasup_fugaevit: req.body.notasupFugaevit, // Fuga evitada
            notasup_atencao: req.body.notasupAtencao, // Atenção
            notasup_tangivel: req.body.notasupTangivel, // Comportamento tangível
            notasup_automatico: req.body.notasupAutomatico, // Comportamento automático
            notasup_notanarratfunc: req.body.notasupNotanarratfunc, // Narrativa funcional
            // Métodos de gravação
            notasup_abc: req.body.notasupAbc, // ABC (antecedente, comportamento, consequência)
            notasup_duracao: req.body.notasupDuracao, // Duração do evento
            notasup_taxa: req.body.notasupTaxa, // Taxa de ocorrência
            notasup_gravevento: req.body.notasupGravevento, // Evento grave
            notasup_prodper: req.body.notasupProdper, // Produção pessoal
            notasup_mandsfreq: req.body.notasupMandsfreq, // Frequência de mands
            notasup_notanarratgrav: req.body.notasupNotanarratgrav, // Narrativa de evento grave
            // Mudanças de programação
            notasup_alvosdominados: req.body.notasupAlvosdominados, // Alvos dominados
            notasup_notasdicas: req.body.notasupNotasdicas, // Notas de dicas
            notasup_notasprog: req.body.notasupNotasprog, // Notas de programação
            // Informações do terapeuta
            notasup_infteracoment: req.body.notasupInfteracoment, // Comentários do terapeuta
            notasup_infteraduvid: req.body.notasupInfteraduvid, // Dúvidas do terapeuta
            // Informações diretas
            notasup_infdircoment: req.body.notasupInfdircoment, // Comentários diretos
            notasup_infdirduvid: req.body.notasupInfdirduvid, // Dúvidas diretas
            // Acompanhamento de ações
            notasup_acompprog: req.body.notasupAcompprog, // Acompanhamento de programação
            notasup_acompgeral: req.body.notasupAcompgeral, // Acompanhamento geral
            //notasupobs
            notasup_obs : observacoes,
            // ID do usuário que cadastrou
            notasup_usuidcad: idUsu,
            notasup_dataedi: dataAtual.toISOString(), // Data da edição
            notasup_lixo: "false" // Status do item
        });

        console.log("Novo Notasup sendo salvo");
        try {
            // Salva a nota de supervisão
            await NewNotasup.save().then(doc => {
                console.log("Cadastro realizado com sucesso!");
                resultado = "true";
            }).catch((err) => {
                resultado = err;
                console.log("Erro ao salvar a nota de supervisão: " + err);
            });
    
        } catch (err) {
            resultado = err;
            console.log("Erro inesperado: " + err);
        }

        return resultado;
    }
};