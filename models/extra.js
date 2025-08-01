const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExtraSchema = mongoose.Schema({
// Definição do Schema do Mongoose para a coleção "extra"
    extra_data: { type: Date, required: false },
    extra_hora: { type: String, required: false },
    extra_data_semana: { type: String, required: false },
    extra_data_dia: { type: String, required: false },
    extra_beneid: { type: ObjectId, required: false },
    extra_convid: { type: ObjectId, required: false },
    extra_salaid: { type: ObjectId, required: false },
    extra_terapiaid: { type: ObjectId, required: false },
    extra_usuid: { type: ObjectId, required: false }, // Id do terapeuta
    extra_mergeterapeutaid: { type: ObjectId, required: false },
    extra_mergeterapiaid: { type: ObjectId, required: false },
    extra_migrado: { type: Boolean, required: false }, // Status se o agendamento gerou agendamento
    extra_datacad: { type: String, required: false },
    extra_dataedi: { type: String, required: false },
    extra_categoria: { type: String, required: true },
    extra_org: { type: String, required: true },
    extra_obs: { type: String, required: false },
    extra_aux: { type: String, required: false },
    extra_temp: { type: Boolean, required: false },
    extra_tempId: { type: ObjectId, required: false },
    extra_tempmotivo: { type: String, required: false },
    extra_extra: { type: Boolean, required: false },
    extra_cobrarextra: { type: Boolean, required: false },
    extra_evolucao: { type: String, require: false },
    extra_copia: { type: Boolean, require: false }, // Status de cópia, evita duplicação
    extra_selo: { type: Boolean, require: false },
    extra_dataSelo: { type: String, require: false },
    extra_atrazo: { type: Boolean, require: false },
    extra_rel: { type: String, require: false }, // {'-':'todos', 'Beneficiario':'apenas_beneficiario', 'Terapeuta':'apenas_Terapeuta', 'Nenhum':'nenhum'}
    extra_turnoFalta: { type: String, require: false },
    extra_faltaId: { type: ObjectId, require: false },
    extra_falta: { type: String, require: false },
    extra_usuedi: { type: String, require: false }, // Usuário adm que alterou
    extra_log: { type: String, require: false }, // Log das alterações
    extra_usucad: { type: String, require: false },

    // Campos exclusivos para Extra
    extra_tipo: { type: String, required: false },
    extra_auditado: { type: Boolean, required: false },
    extra_auditadoObs: { type: String, required: false },
    extra_copiado: { type: String, required: true }, // Campo único: extra_data + extra_hora + extra_beneid
    extra_dtaExportado: { type: String, required: false }, // Data da cópia
    extra_horaExportado: { type: String, required: false }, // Hora da cópia
    extra_usuidExportou: { type: ObjectId, required: false }, // Quem copiou (usuário atual)
    extra_extraStatus: { type: String, required: false, default: "Aguardando" }, // ("Aguardando", "Gerado", "Em cobrança")
    extra_extraStatusPg: { type: Boolean, required: false }
});

// Classe Extra com base no Schema acima
class Extra {
    constructor(
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
        extra_usuedi,
        extra_log,
        extra_usucad,

        // Campos exclusivos para Extra
        extra_tipo,
        extra_auditado,
        extra_auditadoObs,
        extra_copiado,
        extra_dtaExportado,
        extra_horaExportado,
        extra_usuidExportou,
        extra_extraStatus,
        extra_extraStatusPg
    ) {
        this.extra_data = extra_data;
        this.extra_hora = extra_hora;
        this.extra_data_semana = extra_data_semana;
        this.extra_data_dia = extra_data_dia;
        this.extra_beneid = extra_beneid;
        this.extra_convid = extra_convid;
        this.extra_salaid = extra_salaid;
        this.extra_terapiaid = extra_terapiaid;
        this.extra_usuid = extra_usuid;
        this.extra_mergeterapeutaid = extra_mergeterapeutaid;
        this.extra_mergeterapiaid = extra_mergeterapiaid;
        this.extra_migrado = extra_migrado;
        this.extra_datacad = extra_datacad;
        this.extra_dataedi = extra_dataedi;
        this.extra_categoria = extra_categoria;
        this.extra_org = extra_org;
        this.extra_obs = extra_obs;
        this.extra_aux = extra_aux;
        this.extra_temp = extra_temp;
        this.extra_tempId = extra_tempId;
        this.extra_tempmotivo = extra_tempmotivo;
        this.extra_extra = extra_extra;
        this.extra_cobrarextra = extra_cobrarextra;
        this.extra_evolucao = extra_evolucao;
        this.extra_copia = extra_copia;
        this.extra_selo = extra_selo;
        this.extra_dataSelo = extra_dataSelo;
        this.extra_atrazo = extra_atrazo;
        this.extra_rel = extra_rel;
        this.extra_turnoFalta = extra_turnoFalta;
        this.extra_faltaId = extra_faltaId;
        this.extra_falta = extra_falta;
        this.extra_usuedi = extra_usuedi;
        this.extra_log = extra_log;
        this.extra_usucad = extra_usucad;

        this.extra_tipo = extra_tipo;
        this.extra_auditado = extra_auditado;
        this.extra_auditadoObs = extra_auditadoObs;
        this.extra_copiado = extra_copiado;
        this.extra_dtaExportado = extra_dtaExportado;
        this.extra_horaExportado = extra_horaExportado;
        this.extra_usuidExportou = extra_usuidExportou;
        this.extra_extraStatus = extra_extraStatus;
        this.extra_extraStatusPg = extra_extraStatusPg;
    }
}

ExtraSchema.loadClass(Extra)
const ExtraModel = mongoose.model('tb_extra', ExtraSchema)
module.exports = {ExtraModel,ExtraSchema,
    extraEditar: async (req, res) => {
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
        let extraId = new ObjectId(req.body.extraId);
       
        //Realiza Atualização
        await ExtraModel.findByIdAndUpdate(new ObjectId(req.body.extraId), 
            {$set: {
               //campos exclusivos extra
              
                extra_auditado : req.body.extraAuditado,
                extra_auditadoObs : req.body.extraAuditadoObs,
                
                extra_extraStatus : req.body.extraExtraStatus,
                extra_extraStatusPg : req.body.extraExtraStatusPg,
                //campos agendamento
                
                extra_dataedi : dataAtual,
                
                extra_usuedi : idUsu, //Usuário adm que alterou
                extra_log : req.body.extraLog //Log das alterações
                
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
    extraAdicionar: async (req, res) => {
        try {
            let dataAtual = new Date();
            let usuarioAtual = req.cookies['idUsu'];
            let lvlUsu = req.cookies['lvlUsu'];
            let idUsu;

            let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
            arrayIds.forEach((id) => {
                if (id === lvlUsu) {
                    idUsu = id;
                }
            });

            // Gera a hora atual para o campo extra_horaExportado
            const agora = new Date();
            const horaAtual = agora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

            const newExtra = new ExtraModel({
                //campos exclusivos extra
                extra_tipo : req.body.extraTipo,
                extra_auditado : false,//Boleano false como padrão
                extra_auditadoObs : req.body.extraAuditadoObs,
                extra_exportado : req.body.extraExportado,
                extra_dtaExportado : dataAtual,//Data definida automaticamente
                extra_horaExportado : horaAtual,//Hora definida automaticamente
                extra_usuidExportou : usuarioAtual,//Id do usuário definida automaticamente
                extra_extraStatus : "Aguardando",
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
                extra_usuedi : req.body.extraUsuedi,
                extra_log : req.body.extraLog,
                extra_usucad : req.body.extraUsucad
            });

            await newExtra.save();
            console.log("Cadastro realizado!");
            return res.status(200).json({ success: true });
        } catch (err) {
            console.error(err);
            return res.status(500).json({ error: err.message });
        }
    },

    montaExtra(req,res){
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