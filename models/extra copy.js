const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const ExtraSchema = mongoose.Schema({
    //campos exclusivos do controle de extra
    extra_tipo :{ type: String, required: false },
    extra_auditado :{ type: String, required: false },
    extra_auditadoObs :{ type: String, required: false },
    extra_exportado :{ type: String, required: false },
    extra_dtaExportado :{ type: String, required: false },
    extra_horaExportado :{ type: String, required: false },
    extra_usuidExportou :{type: ObjectId, required: false },
    extra_cobrarextra :{ type: Boolean, required: false},
    extra_extraStatus :{ type: String, required: false},
    extra_extraStatusPg :{ type: String, required: false},
    //campos de agendamento 
    extra_data :{ type: Date, required: false },
    extra_hora :{ type: String, required: false },
    extra_data_semana :{ type: String, required: false },
    extra_data_dia :{ type: String, required: false },
    extra_beneid :{ type: ObjectId, required: false },
    extra_convid :{ type: ObjectId, required: false },
    extra_salaid :{ type: ObjectId, required: false },
    extra_terapiaid :{ type: ObjectId, required: false },
    extra_usuid :{ type: ObjectId, required: false }, //Id do terapeuta
    extra_mergeterapeutaid :{type: ObjectId, required: false }, 
    extra_mergeterapiaid :{type: ObjectId, required: false }, 
    extra_migrado :{ type: Boolean, required: false }, //Status se o agendamento gerou agendamento
    extra_datacad :{ type: String, required: false },
    extra_dataedi :{ type: String, required: false },
    extra_categoria :{ type: String, required: true },
    extra_org :{ type: String, required: true },
    extra_obs :{ type: String, required: false },
    extra_aux :{ type: String, required: false },
    extra_temp :{ type: Boolean, required: false },
    extra_tempId :{ type: ObjectId, required: false },
    extra_tempmotivo :{ type: String, required: false },
    extra_extra :{ type: Boolean, required: false},
    extra_cobrarextra :{ type: Boolean, required: false},
    extra_evolucao :{ type: String, require: false },
    extra_copia :{ type: Boolean, require: false }, //Status de copia, para cria gerenciamento anti-copia duplicada
    extra_selo :{ type: Boolean, require: false },
    extra_dataSelo :{ type: String, require: false },
    extra_atrazo :{ type: Boolean, require: false },
    extra_rel :{ type: String, require: false }, //{'-':'todos', 'Beneficiario':'apenas_beneficiario', 'Terapeuta':'apenas_Terapeuta', 'Nenhum':'nenhum'}
    extra_turnoFalta :{ type: String, require: false },
    extra_faltaId :{ type: ObjectId, require: false },
    extra_falta :{ type: String, require: false },
    extra_usuedi :{ type: String, require: false }, //Usuário adm que alterou
    extra_log :{ type: String, require: false }, //Log das alterações
    extra_usucad :{ type: String, require: false }
})

class Extra{
    constructor(
        //campos exclusivos extra
        extra_tipo,
        extra_auditado,
        extra_auditadoObs,
        extra_exportado,
        extra_dtaExportado,
        extra_horaExportado,
        extra_usuidExportou,
        extra_extraStatus,
        extra_extraStatusPg,
        //campos agendamento
         extra_data,
        extra_hora,
        extra_data_semana,
        extra_data_dia,
        extra_beneid,
        extra_convid,
        extra_salaid,
        extra_terapiaid,
        extra_usuid,
        extra_mergeterapeutaid,
        extra_mergeterapiaid,
        extra_migrado,
        extra_datacad,
        extra_dataedi,
        extra_categoria,
        extra_org,
        extra_obs,
        extra_aux,
        extra_temp,
        extra_tempId,
        extra_tempmotivo,
        extra_extra,
        extra_cobrarextra,
        extra_evolucao,
        extra_copia,
        extra_selo,
        extra_dataSelo,
        extra_atrazo,
        extra_rel,
        extra_turnoFalta,
        extra_faltaId,
        extra_falta,
        extra_usuedi, //Usuário adm que alterou
        extra_log, //Log das alterações
        extra_usucad,

        ){
            //campos exclusivos extra
            this.extra_tipo = extra_tipo,
            this.extra_auditado = extra_auditado,
            this.extra_auditadoObs = extra_auditadoObs,
            this.extra_exportado = extra_exportado,
            this.extra_dtaExportado = extra_dtaExportado,
            this.extra_horaExportado = extra_horaExportado,
            this.extra_usuidExportou = extra_usuidExportou,
            this.extra_extraStatus = extra_extraStatus,
            this.extra_extraStatusPg = extra_extraStatusPg,
            //campos agendamento
            this.extra_data = extra_data,
            this.extra_hora = extra_hora,
            this.extra_data_semana = extra_data_semana,
            this.extra_data_dia = extra_data_dia,
            this.extra_beneid = extra_beneid,
            this.extra_convid = extra_convid,
            this.extra_salaid = extra_salaid,
            this.extra_terapiaid = extra_terapiaid,
            this.extra_usuid = extra_usuid,
            this.extra_mergeterapeutaid = extra_mergeterapeutaid,
            this.extra_mergeterapiaid = extra_mergeterapiaid,
            this.extra_migrado = extra_migrado,
            this.extra_datacad = extra_datacad,
            this.extra_dataedi = extra_dataedi,
            this.extra_categoria = extra_categoria,
            this.extra_org = extra_org,
            this.extra_obs = extra_obs,
            this.extra_aux = extra_aux, 
            this.extra_temp = extra_temp, 
            this.extra_tempId = extra_tempId,
            this.extra_tempmotivo = extra_tempmotivo,
            this.extra_extra = extra_extra,
            this.extra_cobrarextra = extra_cobrarextra,
            this.extra_evolucao = extra_evolucao,
            this.extra_copia = extra_copia,
            this.extra_selo = extra_selo,
            this.extra_dataSelo = extra_dataSelo,
            this.extra_atrazo = extra_atrazo,
            this.extra_rel = extra_rel,
            this.extra_turnoFalta = extra_turnoFalta,
            this.extra_faltaId = extra_faltaId,
            this.extra_falta = extra_falta,
            this.extra_usuedi = extra_usuedi, //Usuário adm que alterou
            this.extra_log = extra_log, //Log das alterações
            this.extra_usucad = extra_usucad

    }
}

ExtraSchema.loadClass(Extra)
var ExtraModel = getModel("softroute", 'tb_extra', ExtraSchema)
module.exports = {
    ExtraModel,
    ExtraSchema,

    extraEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        ExtraModel = getModel(db, 'tb_extra', ExtraSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let extraId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("extraId:"+extraId)
        //Realiza Atualização
        await ExtraModel.findByIdAndUpdate(new ObjectId(req.body.id), 
            {$set: {
               //campos exclusivos extra
                extra_tipo : req.body.extraTipo,
                extra_auditado : req.body.extraAuditado,
                extra_auditadoObs : req.body.extraAuditadoObs,
                extra_exportado : req.body.extraExportado,
                extra_dtaExportado : req.body.extraDtaExportado,
                extra_horaExportado : req.body.extraHoraExportado,
                extra_usuidExportou : req.body.extraUsuidExportou,
                extra_extraStatus : req.body.extraExtraStatus,
                extra_extraStatusPg : req.body.extraExtraStatusPg,
                //campos agendamento
                extra_data : req.body.extraData,
                extra_hora : req.body.extraHora,
                extra_data_semana : req.body.extraDatasemana,
                extra_data_dia : req.body.extraDatadia,
                extra_beneid : req.body.extraBeneid,
                extra_convid : req.body.extraConvid,
                extra_salaid : req.body.extraSalaid,
                extra_terapiaid : req.body.extraTerapiaid,
                extra_usuid : req.body.extraUsuid,
                extra_mergeterapeutaid : req.body.extraMergeterapeutaid,
                extra_mergeterapiaid : req.body.extraMergeterapiaid,
                extra_migrado : req.body.extraMigrado,
                extra_datacad : req.body.extraDatacad,
                extra_dataedi : req.body.extraDataedi,
                extra_categoria : req.body.extraCategoria,
                extra_org : req.body.extraOrg,
                extra_obs : req.body.extraObs,
                extra_aux : req.body.extraAux, 
                extra_temp : req.body.extraTemp, 
                extra_tempId : req.body.extraTempId,
                extra_tempmotivo : req.body.extraTempmotivo,
                extra_extra : req.body.extraExtra,
                extra_cobrarextra : req.body.extraCobrarextra,
                extra_evolucao : req.body.extraEvolucao,
                extra_copia : req.body.extraCopia,
                extra_selo : req.body.extraSelo,
                extra_dataSelo : req.body.extraDataSelo,
                extra_atrazo : req.body.extraAtrazo,
                extra_rel : req.body.extraRel,
                extra_turnoFalta : req.body.extraTurnoFalta,
                extra_faltaId : req.body.extraFaltaId,
                extra_falta : req.body.extraFalta,
                extra_usuedi : req.body.extraUsuedi, //Usuário adm que alterou
                extra_log : req.body.extraLog, //Log das alterações
                extra_usucad : req.body.extraUsucad
                
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
    extraAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        ExtraModel = getModel(db, 'tb_extra', ExtraSchema)
        //;

        //Validar se a Extraese existe
        console.log("extramodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newExtra = new ExtraModel({
            //campos exclusivos extra
            extra_tipo : req.body.extraTipo,
            extra_auditado : req.body.extraAuditado,
            extra_auditadoObs : req.body.extraAuditadoObs,
            extra_exportado : req.body.extraExportado,
            extra_dtaExportado : req.body.extraDtaExportado,
            extra_horaExportado : req.body.extraHoraExportado,
            extra_usuidExportou : req.body.extraUsuidExportou,
            extra_extraStatus : req.body.extraExtraStatus,
            extra_extraStatusPg : req.body.extraExtraStatusPg,
           //campos agendamento
            extra_data : req.body.extraData,
            extra_hora : req.body.extraHora,
            extra_data_semana : req.body.extraDatasemana,
            extra_data_dia : req.body.extraDatadia,
            extra_beneid : req.body.extraBeneid,
            extra_convid : req.body.extraConvid,
            extra_salaid : req.body.extraSalaid,
            extra_terapiaid : req.body.extraTerapiaid,
            extra_usuid : req.body.extraUsuid,
            extra_mergeterapeutaid : req.body.extraMergeterapeutaid,
            extra_mergeterapiaid : req.body.extraMergeterapiaid,
            extra_migrado : req.body.extraMigrado,
            extra_datacad : req.body.extraDatacad,
            extra_dataedi : req.body.extraDataedi,
            extra_categoria : req.body.extraCategoria,
            extra_org : req.body.extraOrg,
            extra_obs : req.body.extraObs,
            extra_aux : req.body.extraAux, 
            extra_temp : req.body.extraTemp, 
            extra_tempId : req.body.extraTempId,
            extra_tempmotivo : req.body.extraTempmotivo,
            extra_extra : req.body.extraExtra,
            extra_cobrarextra : req.body.extraCobrarextra,
            extra_evolucao : req.body.extraEvolucao,
            extra_copia : req.body.extraCopia,
            extra_selo : req.body.extraSelo,
            extra_dataSelo : req.body.extraDataSelo,
            extra_atrazo : req.body.extraAtrazo,
            extra_rel : req.body.extraRel,
            extra_turnoFalta : req.body.extraTurnoFalta,
            extra_faltaId : req.body.extraFaltaId,
            extra_falta : req.body.extraFalta,
            extra_usuedi : req.body.extraUsuedi, //Usuário adm que alterou
            extra_log : req.body.extraLog, //Log das alterações
            extra_usucad : req.body.extraUsucad
        });
        console.log("newExtra save");
        await newExtra.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },

    montaExtra(req,res){

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        ExtraModel = getModel(db, 'tb_extra', ExtraSchema)
        //;

        const newExtra = new ExtraModel({
            //campos exclusivos extra
            extra_tipo : req.body.extraTipo,
            extra_auditado : req.body.extraAuditado,
            extra_auditadoObs : req.body.extraAuditadoObs,
            extra_exportado : req.body.extraExportado,
            extra_dtaExportado : req.body.extraDtaExportado,
            extra_horaExportado : req.body.extraHoraExportado,
            extra_usuidExportou : req.body.extraUsuidExportou,
            extra_extraStatus : req.body.extraExtraStatus,
            extra_extraStatusPg : req.body.extraExtraStatusPg,
            //campos agendamento
            extra_data : req.body.extraData,
            extra_hora : req.body.extraHora,
            extra_data_semana : req.body.extraDatasemana,
            extra_data_dia : req.body.extraDatadia,
            extra_beneid : req.body.extraBeneid,
            extra_convid : req.body.extraConvid,
            extra_salaid : req.body.extraSalaid,
            extra_terapiaid : req.body.extraTerapiaid,
            extra_usuid : req.body.extraUsuid,
            extra_mergeterapeutaid : req.body.extraMergeterapeutaid,
            extra_mergeterapiaid : req.body.extraMergeterapiaid,
            extra_migrado : req.body.extraMigrado,
            extra_datacad : req.body.extraDatacad,
            extra_dataedi : req.body.extraDataedi,
            extra_categoria : req.body.extraCategoria,
            extra_org : req.body.extraOrg,
            extra_obs : req.body.extraObs,
            extra_aux : req.body.extraAux, 
            extra_temp : req.body.extraTemp, 
            extra_tempId : req.body.extraTempId,
            extra_tempmotivo : req.body.extraTempmotivo,
            extra_extra : req.body.extraExtra,
            extra_cobrarextra : req.body.extraCobrarextra,
            extra_evolucao : req.body.extraEvolucao,
            extra_copia : req.body.extraCopia,
            extra_selo : req.body.extraSelo,
            extra_dataSelo : req.body.extraDataSelo,
            extra_atrazo : req.body.extraAtrazo,
            extra_rel : req.body.extraRel,
            extra_turnoFalta : req.body.extraTurnoFalta,
            extra_faltaId : req.body.extraFaltaId,
            extra_falta : req.body.extraFalta,
            extra_usuedi : req.body.extraUsuedi, //Usuário adm que alterou
            extra_log : req.body.extraLog, //Log das alterações
            extra_usucad : req.body.extraUsucad
        });

        return newExtra;
    },
    gerarExtra: async (extra) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        ExtraModel = getModel(db, 'tb_extra', ExtraSchema)
        //;

        console.log("cadastrando novo extra!");
        console.log("extra: "+extra);
        await extra.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    
    extraUpdateCampos: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        ExtraModel = getModel(db, 'tb_extra', ExtraSchema)
        //;

        let resultado;
        let busca;
        let troca;
        let ini;
        let fim;
        //-dataini
        let dt = new Date(req.body.agendaDataIni);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }

        let data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        let ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        let formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(0);
        formatData.setMinutes(0);
        formatData.setSeconds(0);
        ini = formatData;
        //-dataini
        //-datafim
        dt = new Date(req.body.agendaDataFim);
        
        mes = (dt.getUTCMonth()+1).toString();
        dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(23);
        formatData.setMinutes(59);
        formatData.setSeconds(59);
        fim = formatData;
        //-datafim
        
        console.log("ini: "+ini.toISOString());
        console.log("fim: "+fim.toISOString());
        //Ta com o nome de agenda pq vem da agenda, mas o id é esse
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let terapeutaidx = req.body.agendaTerapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let terapiaidx = req.body.agendaTeraFindid;//new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = req.body.agendaConvid;//new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        let novoterapeutaidx = req.body.agendaTerapeutaSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novaterapiaidx = req.body.agendaTpiaSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novoconvidx = req.body.agendaConvSubsid;//new ObjectId("62477742e416141415ff7a88");//particular
        let novomergeteraidx = req.body.agendaTerapeutaMergeSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novamergetpiaidx = req.body.agendaTerapiaMergeSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let categoriaidx = req.body.agendaCategoria;
        //let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil

        if (beneidx != "-") {
            let novavalorcrex = req.body.extraValorcre;
            let novavalordebx = req.body.extraValordeb;
            
            if (categoriaidx != "-"){
                busca = { extra_extradata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, extra_terapiaid: terapiaidx, extra_beneid: beneidx, extra_terapeutaid: terapeutaidx };
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                busca = { extra_extradata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, extra_terapiaid: terapiaidx, extra_beneid: beneidx, extra_terapeutaid: terapeutaidx };
            } else if (terapeutaidx != "-" && terapiaidx != "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapiaid: terapiaidx, extra_terapeutaid: terapeutaidx , extra_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx != "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapiaid: terapiaidx, extra_beneid: beneidx };
            } else if (terapeutaidx != "-" && terapiaidx == "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapeutaid: terapeutaidx , extra_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx == "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_beneid: beneidx };
            }

            if (categoriaidx != "-") {
                if (categoriaidx == "Padrão") {
                    troca = {'extra_categoria': categoriaidx, 'extra_org': 'Padrão'};
                } else {
                    troca = {'extra_categoria': categoriaidx, 'extra_org': 'Administrativo'};
                }
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                troca = {'extra_mergeterapeutaid': novomergeteraidx, 'extra_mergeterapiaid': novamergetpiaidx, 'extra_mergevalorcre': novavalorcrex, 'extra_valordeb': novavalordebx, 'extra_categoria': 'SubstitutoFixo', 'extra_org': 'Administrativo', 'extra_mergevalordeb': novavalordebx, 'extra_valorcre': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-"){//convenio
                troca = {'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-"){//convenio
                troca = {'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalordebx != "-"){//convenio
                troca = {'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-"){//convenio
                troca = {'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'extra_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'extra_valorcre': novavalorcrex};
            }

            await ExtraModel.updateMany(
                busca,{$set: troca}
            ).then((res) =>{
                console.log("Trocado")
                resultado = "OK"
            }).catch((err) =>{
                resultado = err
                console.log("erro mongo:")
                console.log(err)
            });
            return resultado;
        } else {
            resultado = "Campos de busca vazios!"
        }
    }
};