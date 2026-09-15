const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');
const agendaClass = require("../models/agenda")

// Esquema Agenda Arquivo
// Criado por: Wagner Cintra
// Criado em: 2022/03/20
// Editado em: 2025/10/03
const AgendaArquivoSchema = agendaClass.AgendaSchema;

// Construtor Agenda Arquivo
// Criado por: Wagner Cintra
// Criado em: 2022/03/20
// Editado em: 2025/10/03
class AgendaArquivo{
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
        agenda_mergeterapeutaid,
        agenda_mergeterapiaid,
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
        agenda_cobrarextra,
        agenda_evolucao,
        agenda_copia,
        agenda_selo,
        agenda_dataSelo,
        agenda_atrazo,
        agenda_rel,
        agenda_turnoFalta,
        agenda_faltaId,
        agenda_falta,
        agenda_usuedi, //Usuário adm que alterou
        agenda_log, //Log das alterações
        agenda_usucad,
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
        this.agenda_mergeterapeutaid = agenda_mergeterapeutaid,
        this.agenda_mergeterapiaid = agenda_mergeterapiaid,
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
        this.agenda_cobrarextra = agenda_cobrarextra,
        this.agenda_evolucao = agenda_evolucao,
        this.agenda_copia = agenda_copia,
        this.agenda_selo = agenda_selo,
        this.agenda_dataSelo = agenda_dataSelo,
        this.agenda_atrazo = agenda_atrazo,
        this.agenda_rel = agenda_rel,
        this.agenda_turnoFalta = agenda_turnoFalta,
        this.agenda_faltaId = agenda_faltaId,
        this.agenda_falta = agenda_falta,
        this.agenda_usuedi = agenda_usuedi, //Usuário adm que alterou
        this.agenda_log = agenda_log, //Log das alterações
        this.agenda_usucad = agenda_usucad
    }
}

AgendaArquivoSchema.loadClass(AgendaArquivo);
var AgendaArquivoModel = getModel("softroute", 'tb_agendaArquivo', AgendaArquivoSchema)