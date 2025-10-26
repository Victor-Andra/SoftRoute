const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// Esquema Agenda Arquivo
// Criado por: Wagner Cintra
// Criado em: 2022/03/20
// Editado em: 2025/10/03
const AgendaArquivoSchema = mongoose.Schema({
    agenda_data :{ type: Date, required: false },
    agenda_hora :{ type: String, required: false },
    agenda_data_semana :{ type: String, required: false },
    agenda_data_dia :{ type: String, required: false },
    agenda_beneid :{ type: ObjectId, required: false },
    agenda_convid :{ type: ObjectId, required: false },
    agenda_salaid :{ type: ObjectId, required: false },
    agenda_terapiaid :{ type: ObjectId, required: false },
    agenda_usuid :{ type: ObjectId, required: false }, //Id do terapeuta
    agenda_mergeterapeutaid :{type: ObjectId, required: false }, 
    agenda_mergeterapiaid :{type: ObjectId, required: false }, 
    agenda_migrado :{ type: Boolean, required: false }, //Status se o agendamento gerou agendamento
    agenda_datacad :{ type: String, required: false },
    agenda_dataedi :{ type: String, required: false },
    agenda_categoria :{ type: String, required: false },
    agenda_org :{ type: String, required: false },
    agenda_obs :{ type: String, required: false },
    agenda_aux :{ type: String, required: false },
    agenda_temp :{ type: Boolean, required: false },
    agenda_tempId :{ type: ObjectId, required: false },
    agenda_tempmotivo :{ type: String, required: false },
    agenda_extra :{ type: Boolean, required: false},
    agenda_cobrarextra :{ type: Boolean, required: false},
    agenda_evolucao :{ type: String, require: false },
    agenda_copia :{ type: Boolean, require: false }, //Status de copia, para cria gerenciamento anti-copia duplicada
    agenda_selo :{ type: Boolean, require: false },
    agenda_dataSelo :{ type: String, require: false },
    agenda_atrazo :{ type: Boolean, require: false },
    agenda_rel :{ type: String, require: false }, //{'-':'todos', 'Beneficiario':'apenas_beneficiario', 'Terapeuta':'apenas_Terapeuta', 'Nenhum':'nenhum'}
    agenda_turnoFalta :{ type: String, require: false },
    agenda_faltaId :{ type: ObjectId, require: false },
    agenda_falta :{ type: String, require: false },
    agenda_usuedi :{ type: String, require: false }, //Usuário adm que alterou
    agenda_log :{ type: String, require: false }, //Log das alterações
    agenda_usucad :{ type: String, require: false }
    
})

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