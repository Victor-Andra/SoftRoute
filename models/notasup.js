const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const notaSupObsClass = require("../models/NotaSupObs")
const Resposta = mongoose.model("tb_resposta")

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
            //Atributos de controle
            this.notasup_usuidcad = notasup_usuidcad,
            this.notasup_usuidedi = notasup_usuidedi,
            this.notasup_datacad = notasup_datacad,
            this.notasup_dataedi = notasup_dataedi,
            this.notasup_lixo = notasup_lixo
                   
    }
}

NotasupSchema.loadClass(Notasup)
const NotasupModel = mongoose.model('tb_notasup', NotasupSchema)
module.exports = {NotasupModel,NotasupSchema,
    notasupEditar: async (req, res) => {
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
        //Realiza Atualização
        await NotasupModel.findByIdAndUpdate(req.body.notasupSupid, 
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
    notaSupEObsAdicionar: async (req,res) =>{
        let resultado;
        let resposta = new Resposta();
        let resultadoNotasup;
        let dataAtual = new Date();
        //Informação do Usuario
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })

        await notaSupObsClass.notaSupObsAdicionarMuitos(req,res).then((result)=>{
            resultadoNotasup = result;
            
            
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
            //array de ids das observacoes
            notasup_obsIds : resultadoNotasup,
            //Atributos de controle
            notasup_usuidcad : idUsu,
            notasup_dataedi : dataAtual.toISOString(),
            notasup_lixo : "false"
        });

        console.log("NewNotasupeobs save");
        await NewNotasup.save().then(()=>{
            console.log("Cadastro realizado!");
            console.log("RETORNANDOP VERDADEWIRO");
            resultado = "true";
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        })

        return resultado;
    }
};