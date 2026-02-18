const mongoose = require('mongoose')
const { getModel } = require('../functions/fncGeral');

const GuialoteSchema = mongoose.Schema({
    guialote_num: { type: String, required: false },
    guialote_numdatacad: { type: Date, required: false },
    guialote_dataenvio: { type: Date, required: false },
    
    guialote_qtatend: { type: Number, required: true, default: 0 },
    guialote_guialotevalor: { type: Number, required: false, default: 0 },
    
    guialote_agendas: [{ type: mongoose.Schema.Types.ObjectId, ref: 'tb_agenda' }],
    
    guialote_status: { type: String, default: 'Aberto' },
    guialote_log: { type: String, required: false },
    guialote_usucad: { type: mongoose.Schema.Types.ObjectId, required: false },
    guialote_datacad: { type: Date, default: Date.now },
    guialote_usuedi: { type: mongoose.Schema.Types.ObjectId, required: false },
    guialote_dataedi: { type: Date, required: false }
})

class Guialote {
    constructor(
        guialote_num,
        guialote_numdatacad,
        guialote_dataenvio,
        guialote_guialotevalor,
        guialote_status,
        guialote_usucad
    ){
        this.guialote_num = guialote_num
        this.guialote_numdatacad = guialote_numdatacad
        this.guialote_dataenvio = guialote_dataenvio
        this.guialote_guialotevalor = guialote_guialotevalor
        this.guialote_usucad = guialote_usucad
        this.guialote_status = guialote_status || 'Aberto'
        this.guialote_qtatend = 0
        this.guialote_agendas = []
    }
}

GuialoteSchema.loadClass(Guialote);
var GuialoteModel = getModel("softroute", 'tb_guialote', GuialoteSchema)

module.exports = { GuialoteSchema, GuialoteModel }