const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getModel } = require('../functions/fncGeral');

const MetoutSchema = mongoose.Schema({
    metout_nome: { type: String, unique: true, required: true },
    metout_ordem: { type: String },
    metout_descricao: { type: String },
    metout_vis: { type: String },
    metout_datacad: { type: Date },
    metout_dataedi: { type: Date } // ✅ campo correto
});

class Metout {
    constructor(
        metout_nome,
        metout_ordem,
        metout_descricao,
        metout_vis,
        metout_datacad,
        metout_dataedi
    ) {
        this.metout_nome = metout_nome;
        this.metout_ordem = metout_ordem;
        this.metout_descricao = metout_descricao;
        this.metout_vis = metout_vis;
        this.metout_datacad = metout_datacad;
        this.metout_dataedi = metout_dataedi;
    }
}

MetoutSchema.loadClass(Metout);

// ✅ FIX: Usar SEMPRE PortalDoUsuario
const MetoutModel = getModel("PortalDoUsuario", 'tb_metout', MetoutSchema);

module.exports = {
    MetoutModel,
    MetoutSchema,

    metoutAdicionar: async (req, res) => {
        // Usa o modelo já configurado para PortalDoUsuario
        const dataAtual = new Date();
        try {
            const newMetout = new MetoutModel({
                metout_nome: req.body.metoutNome,
                metout_ordem: req.body.metoutOrdem,
                metout_descricao: req.body.metoutDescricao,
                metout_vis: req.body.metoutvis,
                metout_datacad: dataAtual
            });

            await newMetout.save();
            console.log("Cadastro de Metout realizado!");
            return true;
        } catch (err) {
            console.error("Erro ao cadastrar Metout:", err);
            return "Erro ao salvar: " + (err.message || err);
        }
    },

    metoutEditar: async (req, res) => {
        // Usa o modelo já configurado para PortalDoUsuario
        const dataAtual = new Date();
        try {
            const resultado = await MetoutModel.findByIdAndUpdate(
                req.body.metoutId,
                {
                    $set: {
                        metout_nome: req.body.metoutNome,
                        metout_ordem: req.body.metoutOrdem,
                        metout_descricao: req.body.metoutDescricao,
                        metout_vis: req.body.metoutvis,
                        metout_dataedi: dataAtual // ✅ Corrigido: era "metout_edi"
                    }
                },
                { new: true }
            );

            if (resultado) {
                console.log("Metout atualizado!");
                return true;
            } else {
                return "Metout não encontrado.";
            }
        } catch (err) {
            console.error("Erro ao editar Metout:", err);
            return "Erro na atualização: " + (err.message || err);
        }
    }
};