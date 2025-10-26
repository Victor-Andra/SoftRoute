const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getModel } = require('../functions/fncGeral');

const MetodoSchema = mongoose.Schema({
    metodo_nome: { type: String, unique: true, required: true },
    metodo_ordem: { type: String },
    metodo_descricao: { type: String },
    metodo_vis: { type: String },
    metodo_datacad: { type: Date },
    metodo_dataedi: { type: Date }
});

class Metodo {
    constructor(
        metodo_nome,
        metodo_ordem,
        metodo_descricao,
        metodo_vis,
        metodo_datacad,
        metodo_dataedi
    ) {
        this.metodo_nome = metodo_nome;
        this.metodo_ordem = metodo_ordem;
        this.metodo_descricao = metodo_descricao;
        this.metodo_vis = metodo_vis;
        this.metodo_datacad = metodo_datacad;
        this.metodo_dataedi = metodo_dataedi;
    }
}

MetodoSchema.loadClass(Metodo);

// ✅ FIX: Usar SEMPRE PortalDoUsuario
const MetodoModel = getModel("PortalDoUsuario", 'tb_metodo', MetodoSchema);

module.exports = {
    MetodoModel,
    MetodoSchema,

    metodoAdicionar: async (req, res) => {
        // Usa o modelo já configurado para PortalDoUsuario

        const dataAtual = new Date();
        try {
            const newMetodo = new MetodoModel({
                metodo_nome: req.body.metodoNome,
                metodo_ordem: req.body.metodoOrdem,
                metodo_descricao: req.body.metodoDescricao,
                metodo_vis: req.body.metodovis,
                metodo_datacad: dataAtual
            });

            await newMetodo.save();
            console.log("Cadastro realizado!");
            return true;
        } catch (err) {
            console.error("Erro ao cadastrar método:", err);
            return "Erro ao salvar método: " + err.message;
        }
    },

    metodoEditar: async (req, res) => {
        // Usa o modelo já configurado para PortalDoUsuario

        const dataAtual = new Date();
        try {
            const resultado = await MetodoModel.findByIdAndUpdate(
                req.body.metodoId,
                {
                    $set: {
                        metodo_nome: req.body.metodoNome,
                        metodo_ordem: req.body.metodoOrdem,
                        metodo_descricao: req.body.metodoDescricao,
                        metodo_vis: req.body.metodovis,
                        metodo_dataedi: dataAtual // ⚠️ Corrigido: era "metodo_edi"
                    }
                },
                { new: true }
            );

            if (resultado) {
                console.log("Método atualizado!");
                return true;
            } else {
                return "Método não encontrado para atualização.";
            }
        } catch (err) {
            console.error("Erro ao editar método:", err);
            return "Erro ao atualizar método: " + err.message;
        }
    }
};