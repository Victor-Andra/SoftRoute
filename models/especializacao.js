const mongoose = require('mongoose');
const { getModel } = require('../functions/fncGeral');

const EspecializacaoSchema = mongoose.Schema({
    especializacao_nome: { type: String, unique: true, required: true },
    especializacao_ordem: { type: String },
    especializacao_descricao: { type: String },
    especializacao_vis: { type: String },
    especializacao_datacad: { type: Date },
    especializacao_dataedi: { type: Date } // ✅ campo correto
});

class Especializacao {
    constructor(
        especializacao_nome,
        especializacao_ordem,
        especializacao_descricao,
        especializacao_vis,
        especializacao_datacad,
        especializacao_dataedi
    ) {
        this.especializacao_nome = especializacao_nome;
        this.especializacao_ordem = especializacao_ordem;
        this.especializacao_descricao = especializacao_descricao;
        this.especializacao_vis = especializacao_vis;
        this.especializacao_datacad = especializacao_datacad;
        this.especializacao_dataedi = especializacao_dataedi;
    }
}

EspecializacaoSchema.loadClass(Especializacao);

// ✅ FIX: Banco fixo como PortalDoUsuario

const EspecializacaoModel = getModel("PortalDoUsuario", 'tb_especializacao', EspecializacaoSchema);

module.exports = {
    EspecializacaoModel,
    EspecializacaoSchema,

    especializacaoAdicionar: async (req, res) => {
        const dataAtual = new Date();
        try {
            const newEspecializacao = new EspecializacaoModel({
                especializacao_nome: req.body.especializacaoNome,
                especializacao_ordem: req.body.especializacaoOrdem,
                especializacao_descricao: req.body.especializacaoDescricao,
                especializacao_vis: req.body.especializacaoVis,
                especializacao_datacad: dataAtual
            });

            await newEspecializacao.save();
            console.log("Especialização cadastrada com sucesso!");
            return true;
        } catch (err) {
            console.error("Erro ao cadastrar especialização:", err);
            return "Erro ao salvar: " + (err.message || 'Erro desconhecido');
        }
    },

    especializacaoEditar: async (req, res) => {
        const dataAtual = new Date();
        try {
            const resultado = await EspecializacaoModel.findByIdAndUpdate(
                req.body.especializacaoId,
                {
                    $set: {
                        especializacao_nome: req.body.especializacaoNome,
                        especializacao_ordem: req.body.especializacaoOrdem,
                        especializacao_descricao: req.body.especializacaoDescricao,
                        especializacao_vis: req.body.especializacaoVis,
                        especializacao_dataedi: dataAtual // ✅ Corrigido!
                    }
                },
                { new: true }
            );

            if (resultado) {
                console.log("Especialização atualizada!");
                return true;
            } else {
                return "Especialização não encontrada.";
            }
        } catch (err) {
            console.error("Erro ao editar especialização:", err);
            return "Erro na atualização: " + (err.message || 'Erro desconhecido');
        }
    }
};