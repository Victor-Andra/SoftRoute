const mongoose = require('mongoose');
const { getModel } = require('../functions/fncGeral');

const PerfilSchema = mongoose.Schema({
    perfil_nome: { type: String, unique: true, required: true },
    perfil_descricao: { type: String, required: true },
    perfil_datacad: { type: Date },
    perfil_dataedi: { type: Date }
});

class Perfil {
    constructor(perfil_nome, perfil_descricao, perfil_datacad, perfil_dataedi) {
        this.perfil_nome = perfil_nome;
        this.perfil_descricao = perfil_descricao;
        this.perfil_datacad = perfil_datacad;
        this.perfil_dataedi = perfil_dataedi;
    }
}

PerfilSchema.loadClass(Perfil);

// ✅ Fixado para PortalDoUsuario
const PerfilModel = getModel("PortalDoUsuario", 'tb_perfil', PerfilSchema);

module.exports = {
    PerfilModel,
    PerfilSchema,

    perfilAdicionar: async (req, res) => {
        const perfilExiste = await PerfilModel.findOne({ perfil_nome: req.body.perfilNome });
        const dataAtual = new Date();

        if (perfilExiste) {
            return "O nome do perfil já existe.";
        } else {
            try {
                const newPerfil = new PerfilModel({
                    perfil_nome: req.body.perfilNome,
                    perfil_descricao: req.body.perfilDescricao,
                    perfil_datacad: dataAtual
                });
                await newPerfil.save();
                console.log("Perfil cadastrado com sucesso!");
                return true;
            } catch (err) {
                console.error("Erro ao salvar perfil:", err);
                return "Erro ao cadastrar perfil: " + (err.message || 'Erro desconhecido');
            }
        }
    },

    perfilEditar: async (req, res) => {
        const dataAtual = new Date();
        try {
            const resultado = await PerfilModel.findByIdAndUpdate(
                req.body.id,
                {
                    $set: {
                        perfil_nome: req.body.perfilNome,
                        perfil_descricao: req.body.perfilDescricao,
                        perfil_dataedi: dataAtual
                    }
                },
                { new: true }
            );

            if (resultado) {
                console.log("Perfil atualizado com sucesso!");
                return true;
            } else {
                return "Perfil não encontrado.";
            }
        } catch (err) {
            console.error("Erro ao editar perfil:", err);
            return "Erro na atualização: " + (err.message || 'Erro desconhecido');
        }
    }
};