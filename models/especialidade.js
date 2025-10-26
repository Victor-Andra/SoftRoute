const mongoose = require('mongoose');
const { getModel } = require('../functions/fncGeral');

const EspecialidadeSchema = mongoose.Schema({
    especialidade_nome: { type: String, unique: true, required: true },
    especialidade_descricao: { type: String },
    especialidade_vis: { type: String },
    especialidade_datacad: { type: Date },
    especialidade_dataedi: { type: Date } // ✅ campo correto
});

class Especialidade {
    constructor(
        especialidade_nome,
        especialidade_descricao,
        especialidade_vis,
        especialidade_datacad,
        especialidade_dataedi
    ) {
        this.especialidade_nome = especialidade_nome;
        this.especialidade_descricao = especialidade_descricao;
        this.especialidade_vis = especialidade_vis;
        this.especialidade_datacad = especialidade_datacad;
        this.especialidade_dataedi = especialidade_dataedi;
    }
}

EspecialidadeSchema.loadClass(Especialidade);

// ✅ Fixado para PortalDoUsuario
const EspecialidadeModel = getModel("PortalDoUsuario", 'tb_especialidade', EspecialidadeSchema);

module.exports = {
    EspecialidadeModel,
    EspecialidadeSchema,

    especialidadeAdicionar: async (req, res) => {
        const dataAtual = new Date();
        try {
            const newEspecialidade = new EspecialidadeModel({
                especialidade_nome: req.body.especialidadeNome,
                especialidade_descricao: req.body.especialidadeDescricao,
                especialidade_vis: req.body.especialidadeVis,
                especialidade_datacad: dataAtual
            });

            await newEspecialidade.save();
            console.log("Especialidade cadastrada com sucesso!");
            return true;
        } catch (err) {
            console.error("Erro ao cadastrar especialidade:", err);
            return "Erro ao salvar especialidade: " + (err.message || 'Erro desconhecido');
        }
    },

    especialidadeEditar: async (req, res) => {
        const dataAtual = new Date();
        try {
            const resultado = await EspecialidadeModel.findByIdAndUpdate(
                req.body.especialidadeId,
                {
                    $set: {
                        especialidade_nome: req.body.especialidadeNome,
                        especialidade_descricao: req.body.especialidadeDescricao,
                        especialidade_vis: req.body.especialidadeVis,
                        especialidade_dataedi: dataAtual // ✅ Corrigido!
                    }
                },
                { new: true }
            );

            if (resultado) {
                console.log("Especialidade atualizada!");
                return true;
            } else {
                return "Especialidade não encontrada.";
            }
        } catch (err) {
            console.error("Erro ao editar especialidade:", err);
            return "Erro na atualização: " + (err.message || 'Erro desconhecido');
        }
    }
};