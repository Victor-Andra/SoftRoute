const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const GuiaSchema = mongoose.Schema({
    guia_num :{ type: String, required: false },// Número Guia Pré Autorização Convênio
    guia_numdatacad :{ type: Date, required: false },
    guia_senha :{ type: String, required: false },// Senha Autorização Convênio para Pagamento
    guia_senhadatacad :{ type: Date, required: false },// Data da Senha de Autorizacao
    guia_log :{ type: String, required: false },// Guia Log
    guia_usucad :{ type: ObjectId, required: false },
    guia_datacad :{ type: Date, required: false },
    guia_usuedi :{ type: String, required: false },
    guia_dataedi :{ type: String, required: false }
})

// Construtor Guia
// Criado por: Victor Cintra
// Criado em: 2026/01/08
class Guia{
    constructor(
        guia_num,// Número Guia Pré Autorização Convênio
        guia_numdatacad,
        guia_senha,// Senha Autorização Convênio para Pagamento
        guia_senhadatacad,// Data da Senha de Autorizacao
        guia_log,// Guia Log
        guia_usucad,
        guia_datacad,
        guia_usuedi,
        guia_dataedi
        ){
        this.guia_num = guia_num,
        this.guia_numdatacad = guia_numdatacad,
        this.guia_senha = guia_senha,
        this.guia_senhadatacad = guia_senhadatacad,
        this.guia_log = guia_log,
        this.guia_usucad = guia_usucad,
        this.guia_datacad = guia_datacad,
        this.guia_usuedi = guia_usuedi,
        this.guia_dataedi = guia_dataedi
    }
}

GuiaSchema.loadClass(Guia);
var GuiaModel = getModel("softroute", 'tb_guia', GuiaSchema)
module.exports = {
    GuiaSchema,GuiaModel
}