const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const BordoSchema = mongoose.Schema({
    bordo_beneid :{type: ObjectId, required: true},
    bordo_terapeutaid :{type: ObjectId, required: true},
    bordo_escolaid :{type: ObjectId, required: true},
    bordo_datacad :{type: Date, required: false},
    
    bordo_seguerotina :{type: String, required: false},
    bordo_estereotipas :{type: String, required: false},
    bordo_foco :{type: String, required: false},
    bordo_autocuidado :{type: String, required: false},
    bardo_aliindepende :{type: String, required: false},
    bordo_escolalia :{type: String, required: false},
    bordo_participa :{type: String, required: false},
    bordo_segue :{type: String, required: false},
    bordo_repertorio :{type: String, required: false},
    
    bordo_autoagressao :{type: String, required: false},
    bordo_agrideadulto :{type: String, required: false},
    bordo_agridepares :{type: String, required: false},
    bordo_destruir :{type: String, required: false},
    bordo_gritos :{type: String, required: false},
    bordo_choros :{type: String, required: false},
    bordo_birras :{type: String, required: false},
    
    bordo_mandosadulto :{type: String, required: false},
    bordo_mandospares :{type: String, required: false},
    bordo_pergunta :{type: String, required: false},
    bordo_responde :{type: String, required: false},
    bordo_imita :{type: String, required: false},
    bordo_interacaoverbal :{type: String, required: false},
    
    bordo_colab :{type: String, required: false},
    
    bordo_ativsucedido :{type: String, required: false},
    bordo_ativnaosucedido :{type: String, required: false},
    bordo_adequadodificil :{type: String, required: false},
    bordo_adequadodifacil :{type: String, required: false},
    bordo_semativ :{type: String, required: false},
    bordo_mediacao :{type: String, required: false},
    bordo_adaptacao :{type: String, required: false},
    
    bordo_brincousolonge :{type: String, required: false},
    bordo_brincousoperto :{type: String, required: false},
    bordo_tentoubrincar :{type: String, required: false},
    bordo_brincouparesindep :{type: String, required: false},
    bordo_naobrincar :{type: String, required: false},
    
    bordo_foranormal :{type: String, required: false},
    bordo_habilnova :{type: String, required: false},
    bordo_incidente :{type: String, required: false},
    bordo_obs :{type: String, required: false},
   
    bordo_dataedi :{type: Date, required: false}
})

class Bordo{
    constructor(
        //Dados básicos do Diário de Bordo
        bordo_beneid,
        bordo_terapeutaid,
        bordo_escolaid,
        bordo_datacad,
        //Rotinas
        bordo_seguerotina,
        bordo_estereotipas,
        bordo_foco,
        bordo_autocuidado,
        bardo_aliindepende,
        bordo_escolalia,
        bordo_participa,
        bordo_segue,
        bordo_repertorio,
        //Comportamento
        bordo_autoagressao,
        bordo_agrideadulto,
        bordo_agridepares,
        bordo_destruir,
        bordo_gritos,
        bordo_choros,
        bordo_birras,
        //Interação Verbal
        bordo_mandosadulto,
        bordo_mandospares,
        bordo_pergunta,
        bordo_responde,
        bordo_imita,
        bordo_interacaoverbal,
        //Colaboração
        bordo_colab,
        //Atividade
        bordo_ativsucedido,
        bordo_ativnaosucedido,
        bordo_adequadodificil,
        bordo_adequadodifacil,
        bordo_semativ,
        bordo_mediacao,
        bordo_adaptacao,
        //Atividade livre
        bordo_brincousolonge,
        bordo_brincousoperto,
        bordo_tentoubrincar,
        bordo_brincouparesindep,
        bordo_naobrincar,
        //Obseravções adicionais
        bordo_foranormal,
        bordo_habilnova,
        bordo_incidente,
        bordo_obs,
        //Edição
        bordo_dataedi
        
        ){
       
        //Dados básicos do Diário de Bordo
        this.bordo_beneid = bordo_beneid,
        this.bordo_terapeutaid = bordo_terapeutaid,
        this.bordo_escolaid = bordo_escolaid,
        this.bordo_datacad = bordo_datacad,
        //Rotinas
        this.bordo_seguerotina = bordo_seguerotina,
        this.bordo_estereotipas = bordo_estereotipas,
        this.bordo_foco = bordo_foco,
        this.bordo_autocuidado = bordo_autocuidado,
        this.bardo_aliindepende = bardo_aliindepende,
        this.bordo_escolalia = bordo_escolalia,
        this.bordo_participa = bordo_participa,
        this.bordo_segue = bordo_segue,
        this.bordo_repertorio = bordo_repertorio,
        //Comportamento
        this.bordo_autoagressao = bordo_autoagressao,
        this.bordo_agrideadulto = bordo_agrideadulto,
        this.bordo_agridepares = bordo_agridepares,
        this.bordo_destruir = bordo_destruir,
        this.bordo_gritos = bordo_gritos,
        this.bordo_choros = bordo_choros,
        this.bordo_birras = bordo_birras,
        //Interação Verbal
        this.bordo_mandosadulto = bordo_mandosadulto,
        this.bordo_mandospares = bordo_mandospares,
        this.bordo_pergunta = bordo_pergunta,
        this.bordo_responde = bordo_respond,
        this.bordo_imita = bordo_imita,
        this.bordo_interacaoverbal = bordo_interacaoverbal,
        //Colaboração
        this.bordo_colab = bordo_colab,
        //Atividade
        this.bordo_ativsucedido = bordo_ativsucedido,
        this.bordo_ativnaosucedido = bordo_ativnaosucedido,
        this.bordo_adequadodificil = bordo_adequadodificil,
        this.bordo_adequadodifacil = bordo_adequadodifacil,
        this.bordo_semativ = bordo_semativ,
        this.bordo_mediacao = bordo_mediacao,
        this.bordo_adaptacao = bordo_adaptacao,
        //Atividade livre
        this.bordo_brincousolonge = bordo_brincousolonge,
        this.bordo_brincousoperto = bordo_brincousoperto,
        this.bordo_tentoubrincar = bordo_tentoubrincar,
        this.bordo_brincouparesindep = bordo_brincouparesindep,
        this.bordo_naobrincar = bordo_naobrincar,
        //Obseravções adicionais
        this.bordo_foranormal = bordo_foranormal ,
        this.bordo_habilnova = bordo_habilnova,
        this.bordo_incidente = bordo_incidente,
        this.bordo_obs = bordo_obs,
        //Edição
        this.bordo_dataedi  = bordo_dataedi     
    }
}

BordoSchema.loadClass(Bordo)
const BordoModel = mongoose.model('tb_bordo', BordoSchema)
module.exports = {BordoModel,BordoSchema,
    bordoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await BordoModel.findByIdAndUpdate(req.body.bordoId, 
            {$set: {
                bordo_beneid : req.body.bordoBeneid,
                bordo_terapeutaid : req.body.bordoTerapeutaid,
                bordo_escolaid : req.body.bordoEscolaid,
                bordo_datacad : req.body.bordoDatacad,
                //Rotinas
                bordo_seguerotina : req.body.bordoSeguerotina,
                bordo_estereotipas : req.body.bordoEstereotipas,
                bordo_foco : req.body.bordoFoco,
                bordo_autocuidado : req.body.bordoAutocuidado,
                bardo_aliindepende : req.body.bardoAliindepende,
                bordo_escolalia : req.body.bordoEscolalia,
                bordo_participa : req.body.bordoParticipa,
                bordo_segue : req.body.bordoSegue,
                bordo_repertorio : req.body.bordoRepertorio,
                //Comportamento
                bordo_autoagressao : req.body.bordoAutoagressao,
                bordo_agrideadulto : req.body.bordoAgrideadulto,
                bordo_agridepares : req.body.bordoAgridepares,
                bordo_destruir : req.body.bordoDestruir,
                bordo_gritos : req.body.bordoGritos,
                bordo_choros : req.body.bordoChoros,
                bordo_birras : req.body.bordoBirras,
                //Interação Verbal
                bordo_mandosadulto : req.body.bordoMandosadulto,
                bordo_mandospares : req.body.bordoMandospares,
                bordo_pergunta : req.body.bordoPergunta,
                bordo_responde : req.body.bordoRespond,
                bordo_imita : req.body.bordoImita,
                bordo_interacaoverbal : req.body.bordoInteracaoverbal,
                //Colaboração
                bordo_colab : req.body.bordoColab,
                //Atividade
                bordo_ativsucedido : req.body.bordoAtivsucedido,
                bordo_ativnaosucedido : req.body.bordoAtivnaosucedido,
                bordo_adequadodificil : req.body.bordoAdequadodificil,
                bordo_adequadodifacil : req.body.bordoAdequadodifacil,
                bordo_semativ : req.body.bordoSemativ,
                bordo_mediacao : req.body.bordoMediacao,
                bordo_adaptacao : req.body.bordoAdaptacao,
                //Atividade livre
                bordo_brincousolonge : req.body.bordoBrincousolonge,
                bordo_brincousoperto : req.body.bordoBrincousoperto,
                bordo_tentoubrincar : req.body.bordoTentoubrincar,
                bordo_brincouparesindep : req.body.bordoBrincouparesindep,
                bordo_naobrincar : req.body.bordoNaobrincar,
                //Obseravções adicionais
                bordo_foranormal : req.body.bordoForanormal ,
                bordo_habilnova : req.body.bordoHabilnova,
                bordo_incidente : req.body.bordoIncidente,
                bordo_obs : req.body.bordoObs,
        //Edição
         
                bordo_dataedi :req.body.bordoDataAtual.toISOString()
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
    bordoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("bordomodel");
        console.log("req.body.bordodata:")
        console.log(req.body.bordodata)
        const NewBordo = new BordoModel({
            bordo_beneid : req.body.bordoBeneid,
                bordo_terapeutaid : req.body.bordoTerapeutaid,
                bordo_escolaid : req.body.bordoEscolaid,
                //Rotinas
                bordo_seguerotina : req.body.bordoSeguerotina,
                bordo_estereotipas : req.body.bordoEstereotipas,
                bordo_foco : req.body.bordoFoco,
                bordo_autocuidado : req.body.bordoAutocuidado,
                bardo_aliindepende : req.body.bardoAliindepende,
                bordo_escolalia : req.body.bordoEscolalia,
                bordo_participa : req.body.bordoParticipa,
                bordo_segue : req.body.bordoSegue,
                bordo_repertorio : req.body.bordoRepertorio,
                //Comportamento
                bordo_autoagressao : req.body.bordoAutoagressao,
                bordo_agrideadulto : req.body.bordoAgrideadulto,
                bordo_agridepares : req.body.bordoAgridepares,
                bordo_destruir : req.body.bordoDestruir,
                bordo_gritos : req.body.bordoGritos,
                bordo_choros : req.body.bordoChoros,
                bordo_birras : req.body.bordoBirras,
                //Interação Verbal
                bordo_mandosadulto : req.body.bordoMandosadulto,
                bordo_mandospares : req.body.bordoMandospares,
                bordo_pergunta : req.body.bordoPergunta,
                bordo_responde : req.body.bordoRespond,
                bordo_imita : req.body.bordoImita,
                bordo_interacaoverbal : req.body.bordoInteracaoverbal,
                //Colaboração
                bordo_colab : req.body.bordoColab,
                //Atividade
                bordo_ativsucedido : req.body.bordoAtivsucedido,
                bordo_ativnaosucedido : req.body.bordoAtivnaosucedido,
                bordo_adequadodificil : req.body.bordoAdequadodificil,
                bordo_adequadodifacil : req.body.bordoAdequadodifacil,
                bordo_semativ : req.body.bordoSemativ,
                bordo_mediacao : req.body.bordoMediacao,
                bordo_adaptacao : req.body.bordoAdaptacao,
                //Atividade livre
                bordo_brincousolonge : req.body.bordoBrincousolonge,
                bordo_brincousoperto : req.body.bordoBrincousoperto,
                bordo_tentoubrincar : req.body.bordoTentoubrincar,
                bordo_brincouparesindep : req.body.bordoBrincouparesindep,
                bordo_naobrincar : req.body.bordoNaobrincar,
                //Obseravções adicionais
                bordo_foranormal : req.body.bordoForanormal ,
                bordo_habilnova : req.body.bordoHabilnova,
                bordo_incidente : req.body.bordoIncidente,
                bordo_obs : req.body.bordoObs,
                 //Edição
                bordo_datacad : dataAtual.toISOString()
            
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