const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const RespostaSchema = mongoose.Schema({
    texto: {
        type: String,
        unique: true,
        required: true
    },
    sucesso: {
        type: String,
        required: true
    }    
})

class Resposta{
    constructor(
        texto,
        sucesso
        ){
        this.texto = texto,
        this.sucesso = sucesso
    }
}

RespostaSchema.loadClass(Resposta)
var RespostaModel = getModel("softroute", 'tb_resposta', RespostaSchema)
module.exports = {
    RespostaModel,
    RespostaSchema

};