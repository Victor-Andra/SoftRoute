const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const ConfSchema = mongoose.Schema({
    // Atributos básicos
    conf_persistirAgenda: { type: Boolean, required: false },
    conf_persistirAtend:  { type: Boolean, required: false },
    conf_usuidcad:        { type: ObjectId, required: false },
    conf_usuidedi:        { type: [ObjectId], required: false },
    conf_datacad:         { type: Date, required: false },
    conf_dataedi:         { type: Date, required: false }
})

class Conf {
    constructor(
        // Atributos básicos
        conf_persistirAgenda,
        conf_persistirAtend,
        conf_usuidcad,
        conf_usuidedi,
        conf_datacad,
        conf_dataedi
    ){
        this.conf_persistirAgenda = conf_persistirAgenda;
        this.conf_persistirAtend = conf_persistirAtend;
        this.conf_usuidcad = conf_usuidcad;
        this.conf_usuidedi = conf_usuidedi;
        this.conf_datacad = conf_datacad;
        this.conf_dataedi = conf_dataedi;
    }
}

ConfSchema.loadClass(Conf);
const ConfModel = getModel("softroute", 'tb_conf', ConfSchema);

module.exports = {
    ConfModel,
    ConfSchema,

    confEditar: async (req, res) => {
        try {
            // Estrutura multiempresa
            const db = req.cookies['preferredDb'];
            const ConfModelDB = getModel(db, 'tb_conf', ConfSchema);
            
            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            
            // Monta o objeto de atualização apenas com os campos que fazem sentido editar
            const updateData = {};
            
            if (req.body.confPersistirAgenda !== undefined) {
                updateData.conf_persistirAgenda = req.body.confPersistirAgenda;
            }
            if (req.body.confPersistirAtend !== undefined) {
                updateData.conf_persistirAtend = req.body.confPersistirAtend;
            }
            
            // Atualiza os campos de auditoria
            updateData.conf_usuidedi = usuarioAtual;
            updateData.conf_dataedi = dataAtual;
            
            // Executa a atualização
            const resultado = await ConfModelDB.findByIdAndUpdate(
                req.body.confId, 
                { $set: updateData },
                { new: true, runValidators: true }
            );
            
            console.log("Configuração salva:", resultado ? "OK" : "Nada encontrado");
            return !!resultado;
            
        } catch (err) {
            console.log("Erro ao editar configuração:", err);
            return err;
        }
    },

    confAdicionar: async (req, res) => {
        try {
            // Estrutura multiempresa
            const db = req.cookies['preferredDb'];
            const ConfModelDB = getModel(db, 'tb_conf', ConfSchema);
            
            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            
            // Cria nova instância com os dados do body
            const newConf = new ConfModelDB({
                conf_persistirAgenda: req.body.confPersistirAgenda,
                conf_persistirAtend:  req.body.confPersistirAtend,
                conf_usuidcad:        usuarioAtual,
                conf_usuidedi:        [], // Inicia vazio, pode ser populado depois
                conf_datacad:         dataAtual,
                conf_dataedi:         null
            });
            
            const saved = await newConf.save();
            console.log("Configuração cadastrada com ID:", saved._id);
            return true;
            
        } catch (err) {
            console.log("Erro ao cadastrar configuração:", err);
            return err;
        }
    }
};