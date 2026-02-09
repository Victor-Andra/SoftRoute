const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const GuialoteSchema = mongoose.Schema({
    guialote_num :{ type: String, required: false },// Número Guialote Pré Autorização Convênio
    guialote_numdatacad :{ type: Date, required: false },
    guialote_senha :{ type: String, required: false },// Senha Autorização Convênio para Pagamento
    guialote_senhadatacad :{ type: Date, required: false },// Data da Senha de Autorizacao
    guialote_log :{ type: String, required: false },// Guialote Log
    guialote_usucad :{ type: ObjectId, required: false },
    guialote_datacad :{ type: Date, required: false },
    guialote_usuedi :{ type: String, required: false },
    guialote_dataedi :{ type: String, required: false }
})

// Construtor Guialote
// Criado por: Victor Cintra
// Criado em: 2026/01/08
class Guialote{
    constructor(
        guialote_num,// Número Guialote Pré Autorização Convênio
        guialote_numdatacad,
        guialote_senha,// Senha Autorização Convênio para Pagamento
        guialote_senhadatacad,// Data da Senha de Autorizacao
        guialote_log,// Guialote Log
        guialote_usucad,
        guialote_datacad,
        guialote_usuedi,
        guialote_dataedi
        ){
        this.guialote_num = guialote_num,
        this.guialote_numdatacad = guialote_numdatacad,
        this.guialote_senha = guialote_senha,
        this.guialote_senhadatacad = guialote_senhadatacad,
        this.guialote_log = guialote_log,
        this.guialote_usucad = guialote_usucad,
        this.guialote_datacad = guialote_datacad,
        this.guialote_usuedi = guialote_usuedi,
        this.guialote_dataedi = guialote_dataedi
    }
}

GuialoteSchema.loadClass(Guialote);
var GuialoteModel = getModel("softroute", 'tb_guialote', GuialoteSchema)
module.exports = {
    GuialoteSchema,GuialoteModel
}