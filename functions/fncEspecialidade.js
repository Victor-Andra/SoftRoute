const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

const especialidadeClass = require("../models/especialidade");

// ✅ FIX: Usar SEMPRE PortalDoUsuario — NÃO redefinir dentro das funções
const Especialidade = getModel("PortalDoUsuario", 'tb_especialidade', especialidadeClass.EspecialidadeSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaEspecialidade(req, res, resposta = {}) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando especialidades do PortalDoUsuario');

        const flash = new Resposta();

        Especialidade.find()
            .sort({ especialidade_nome: 1 })
            .then((especialidades) => {
                console.log("Listagem realizada!");

                if (!resposta.sucesso) {
                    flash.texto = "";
                    flash.sucesso = "";
                } else {
                    flash.texto = resposta.texto;
                    flash.sucesso = resposta.sucesso;
                }

                res.render('ferramentas/especialidade/especialidadeLis', { especialidades, flash });
            })
            .catch((err) => {
                console.error("Erro ao listar especialidades:", err);
                req.flash("error_message", "Houve um erro ao listar especialidades");
                res.redirect('/admin/erro');
            });
    },

    carregaEspecialidade(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        res.render("ferramentas/especialidade/especialidadeCad");
    },

    carregaEspecialidadeEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Especialidade.findById(req.params.id)
            .then((especialidade) => {
                if (!especialidade) {
                    req.flash("error_message", "Especialidade não encontrada");
                    return res.redirect('/admin/erro');
                }
                console.log("Especialidade carregada para edição");
                res.render('ferramentas/especialidade/especialidadeEdi', { especialidade });
            })
            .catch((err) => {
                console.error("Erro ao carregar especialidade:", err);
                req.flash("error_message", "Erro ao carregar especialidade");
                res.render('admin/erro');
            });
    },

    cadastraEspecialidade(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        especialidadeClass.especialidadeAdicionar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Especialidade cadastrada com sucesso!");
                    resposta.texto = "Cadastrado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaEspecialidade(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    res.render('admin/erro', { resposta });
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar especialidade");
                res.render('admin/erro');
            });
    },

    atualizaEspecialidade(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        especialidadeClass.especialidadeEditar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Especialidade atualizada com sucesso!");
                    resposta.texto = "Atualizado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaEspecialidade(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    this.listaEspecialidade(req, res, resposta);
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização:", err);
                req.flash("error_message", "Erro inesperado ao atualizar especialidade");
                res.render('admin/erro');
            });
    },

    deletaEspecialidade(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Especialidade.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Especialidade não encontrada para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Especialidade deletada com sucesso!");
                this.listaEspecialidade(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar especialidade:", err);
                req.flash("error_message", "Erro ao deletar especialidade");
                res.render('admin/erro');
            });
    }
};