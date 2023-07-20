const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AgendaSchema = mongoose.Schema({
    agenda_data :{ type: Date, required: false },
    agenda_hora :{ type: String, required: false },
    agenda_data_semana :{ type: String, required: false },
    agenda_data_dia :{ type: String, required: false },
    agenda_beneid :{ type: ObjectId, required: false },
    agenda_convid :{ type: ObjectId, required: false },
    agenda_salaid :{ type: ObjectId, required: false },
    agenda_terapiaid :{ type: ObjectId, required: false },
    agenda_usuid :{ type: ObjectId, required: false }, //Id do terapeuta
    agenda_mergeterapeutaid :{type: ObjectId, required: false }, //Id do terapeuta merge (para Substituto Fixo)
    agenda_mergeterapiaid :{type: ObjectId, required: false }, //Id do terapia merge (para Substituto Fixo)
    agenda_migrado :{ type: Boolean, required: false }, //Status se o agendamento gerou agendamento
    agenda_datacad :{ type: String, required: false },
    agenda_dataedi :{ type: String, required: false },
    agenda_categoria :{ type: String, required: true },
    agenda_org :{ type: String, required: true },
    agenda_obs :{ type: String, required: false },
    agenda_aux :{ type: String, required: false },
    agenda_temp :{ type: Boolean, required: false },
    agenda_tempId :{ type: ObjectId, required: false },
    agenda_tempmotivo :{ type: String, required: false },
    agenda_extra :{ type: Boolean, required: false},
    agenda_evolucao :{ type: String, require: false },
    agenda_copia :{ type: Boolean, require: false }, //Status de copia, para cria gerenciamento anti-copia duplicada
    agenda_selo :{ type: Boolean, require: false }
})

class Agenda{
    constructor(
        agenda_data,
        agenda_hora,
        agenda_data_semana,
        agenda_data_dia,
        agenda_beneid,
        agenda_convid,
        agenda_salaid,
        agenda_terapiaid,
        agenda_usuid,
        agenda_mergeterapeutaid,//Id do terapeuta merge (para Substituto Fixo)
        agenda_mergeterapiaid,//Id do terapia merge (para Substituto Fixo)
        agenda_migrado,
        agenda_datacad,
        agenda_dataedi,
        agenda_categoria,
        agenda_org,
        agenda_obs,
        agenda_aux,
        agenda_temp,
        agenda_tempId,
        agenda_tempmotivo,
        agenda_extra,
        agenda_evolucao,
        agenda_copia,
        agenda_selo
        ){
        this.agenda_data = agenda_data,
        this.agenda_hora = agenda_hora,
        this.agenda_data_semana = agenda_data_semana,
        this.agenda_data_dia = agenda_data_dia,
        this.agenda_beneid = agenda_beneid,
        this.agenda_convid = agenda_convid,
        this.agenda_salaid = agenda_salaid,
        this.agenda_terapiaid = agenda_terapiaid,
        this.agenda_usuid = agenda_usuid,
        this.agenda_mergeterapeutaid = agenda_mergeterapeutaid,//Id do terapeuta merge (para Substituto Fixo)
        this.agenda_mergeterapiaid = mergeterapiaid,//Id do terapia merge (para Substituto Fixo)
        this.agenda_migrado = agenda_migrado,
        this.agenda_datacad = agenda_datacad,
        this.agenda_dataedi = agenda_dataedi,
        this.agenda_categoria = agenda_categoria
        this.agenda_org = agenda_org,
        this.agenda_obs = agenda_obs,
        this.agenda_aux = agenda_aux, 
        this.agenda_temp = agenda_temp, 
        this.agenda_tempId = agenda_tempId,
        this.agenda_tempmotivo = agenda_tempmotivo,
        this.agenda_extra = agenda_extra,
        this.agenda_evolucao = agenda_evolucao,
        this.agenda_copia = agenda_copia,
        this.agenda_selo = agenda_selo
    }
}

AgendaSchema.loadClass(Agenda)
const AgendaModel = mongoose.model('tb_agenda', AgendaSchema)
module.exports = {AgendaModel,AgendaSchema,
    agendaEditar: async (req, res) => {
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        console.log(dataAgenda);
        let resultado;
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,//Id do terapeuta merge (para Substituto Fixo)
                agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,//Id do terapia merge (para Substituto Fixo)
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_copia : req.body.agendaCopia,
                agenda_dataedi : dataAtual
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
    agendaAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let agenda_temp = false;
        let extra = false;
        console.log("req.body.agendaData:"+req.body.agendaData)
        console.log("req.body.agendaExtra:"+req.body.agendaExtra);
        if (req.body.agendaExtra == true || req.body.agendaExtra == "true"){
            extra = true;
        }

        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        //console.log(dataAgenda);
        console.log("data:"+data);
        console.log("dataAgenda:"+dataAgenda);
        console.log("agendamodel");
        const newAgenda = new AgendaModel({
            agenda_data : dataAgenda ,
            agenda_beneid : req.body.agendaBeneid ,
            agenda_convid : req.body.agendaConvid ,
            agenda_salaid : req.body.agendaSalaid ,
            agenda_terapiaid : req.body.agendaTerapiaid ,
            agenda_usuid : req.body.agendaUsuid ,
            agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,//Id do terapeuta merge (para Substituto Fixo)
            agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,//Id do terapia merge (para Substituto Fixo)
            agenda_migrado : false ,
            agenda_categoria : req.body.agendaCateg ,
            agenda_org : req.body.agendaOrg ,
            agenda_obs : req.body.agendaObs ,
            agenda_temp : false ,
            agenda_extra: extra ,
            agenda_selo : false ,
            agenda_copia: false ,
            agenda_datacad : dataAtual
        });
        console.log("newAgenda save");
        await newAgenda.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    agendaAdicionarTemp: async (req,res) => {
        let dataAtual = new Date();
        let agendaTempId = new mongoose.mongo.ObjectId(req.body.agendaIdTemp);
        console.log("agendaTempId:"+agendaTempId)
        console.log("req.body.agendaData:"+req.body.agendaData)
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        //console.log(dataAgenda);
        console.log("data:"+data);
        console.log("dataAgenda:"+dataAgenda);
        console.log("agendamodel");
        const newAgenda = new AgendaModel({
            agenda_data : dataAgenda ,
            agenda_beneid : req.body.agendaBeneid ,
            agenda_convid : req.body.agendaConvid ,
            agenda_salaid : req.body.agendaSalaid ,
            agenda_terapiaid : req.body.agendaTerapiaid ,
            agenda_usuid : req.body.agendaUsuid ,
            agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,//Id do terapeuta merge (para Substituto Fixo)
            agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,//Id do terapia merge (para Substituto Fixo)
            agenda_migrado : false ,
            agenda_categoria : req.body.agendaCateg ,
            agenda_org : req.body.agendaOrg ,
            agenda_obs : req.body.agendaObs ,
            agenda_temp : true ,
            agenda_tempId : agendaTempId ,
            agenda_tempmotivo : req.body.agendaTempMotivo ,
            agenda_selo : false ,
            agenda_copia : false,
            agenda_datacad : dataAtual
        });
        console.log("newAgenda save");
        await newAgenda.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    agendaEditarTemp: async (req, res) => {
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        console.log(dataAgenda);
        let resultado;
        //Pega data atual
        
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(req.body.agendaId, 
            {$set: {
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,//Id do terapeuta merge (para Substituto Fixo)
                agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,//Id do terapia merge (para Substituto Fixo)
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_temp : true ,
                agenda_tempmotivo : req.body.agendaTempMotivo ,
                agenda_copia : req.body.agendaCopia ,
                agenda_dataedi : dataAtual
                
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
    agendaFindOne: async (id, res) => {
        let resultado;
        //Pega data atual
        
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findOne({_id: id}).then((res) =>{
            console.log("Salvo")
            resultado = res;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = undefined;
            //res.redirect('admin/branco')
        })
        return resultado;
    },
    evolucao: async (req, res) => {
        var resultado;
        let selo;
        let selamento;
        await AgendaModel.find({_id: req.body.id}).then((a)=>{
            selo = a.agendaSelo;
            console.log("req.body.agendaId:"+req.body.id)
        })
        console.log("req.body.agendaSelamento:"+req.body.agendaSelamento)
        if (req.body.agendaSelamento == "true"){
            selamento = true;
        } else {
            selamento = false;
        }
        console.log("req.body.agendaEvolucao:"+req.body.agendaEvolucao)
        if(selo){
            resultado = "A Evolução já foi finalizada, não é possível editar as informações sem autorização administrativa!";
            console.log(resultado);
        } else {
            console.log("SALVANDO!")
            await AgendaModel.findByIdAndUpdate(req.body.id, 
                {$set: {
                    agenda_evolucao : req.body.agendaEvolucao ,
                    agenda_selo : selamento
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
        }
        await AgendaModel.find({_id: req.body.id}).then((a)=>{
            console.log("agenda:"+a)
        })
        return resultado;
    }
    /*
    ,kaskopstusagenda: async (id) => {
        console.log("id:"+id)
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(id, 
            {$set: {
                agenda_extra : false
                }}
        ).then(() =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    }
    */
    /*    
    ,agendaAddNovosCampos: async (req,res) => {
        let resultado;
        await AgendaModel.updateMany(
            {agenda_extra: undefined},
            {$set: {'agenda_extra': false}}
        ).then((res) =>{
            console.log("XABLAU")
            resultado = "OK"
        }).catch((err) =>{
            resultado = err
            console.log("erro mongo:")
            console.log(err)
        });
        return resultado;
    }
    */
    /*
    ,agendaUpdateCampos: async (req,res) => {
        let resultado;
        let diaumjun = new Date(req.body.dataFinal);
        let diaumjul = new Date(req.body.dataFinal);
        diaumjun.setUTCDate(1);
        diaumjul.setUTCDate(1);
        diaumjun.setUTCMonth(6);//0-11
        diaumjul.setUTCMonth(7);//0-11
        console.log("diaumjun: "+diaumjun.toISOString());
        console.log("diaumjul: "+diaumjul.toISOString());
        let beneidx = new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let tpiaidx = new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        //let novateraidx = new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil

        await AgendaModel.updateMany(
            { agenda_data: { $gte : diaumjun.toISOString(), $lte:  diaumjul.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_terapiaid: tpiaidx, agenda_usuid: teraidx , agenda_beneid: beneidx, agenda_convid: convidx  },
            {$set: {'agenda_convid': novaconvidx}}
        ).then((res) =>{
            console.log("XABLAU")
            resultado = "OK"
        }).catch((err) =>{
            resultado = err
            console.log("erro mongo:")
            console.log(err)
        });
        return resultado;
    }
    */
   /*
    ,agendaFaltaDia: async (req,res) => {
        let resultado;
        let diaini = new Date(req.body.dataFinal);
        let diafim = new Date(req.body.dataFinal);
        diaini.setUTCDate(1);
        diafim.setUTCDate(1);
        diaini.setUTCMonth(6);//0-11
        diafim.setUTCMonth(7);//0-11
        console.log("diaini: "+diaini.toISOString());
        console.log("diafim: "+diafim.toISOString());
        
        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } , agenda_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } , agenda_usuid: req.body.atendTerapeuta };
                console.log("req.body.atendTerapeuta:"+req.body.atendTerapeuta);
                break;
            default:
                break;
        }
        let beneidx = new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let tpiaidx = new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        //let novateraidx = new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil

        await AgendaModel.updateMany(
            busca,
            {$set: {'agenda_convid': novaconvidx}}
        ).then((res) =>{
            console.log("XABLAU")
            resultado = "OK"
        }).catch((err) =>{
            resultado = err
            console.log("erro mongo:")
            console.log(err)
        });
        return resultado;
    }
    */
};