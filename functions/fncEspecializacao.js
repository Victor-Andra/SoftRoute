const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

const especializacaoClass = require("../models/especializacao");

// ✅ FIX: Usar SEMPRE PortalDoUsuario
const Especializacao = getModel("PortalDoUsuario", 'tb_especializacao', especializacaoClass.EspecializacaoSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaEspecializacao(req, res, resposta = {}) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando especializações do PortalDoUsuario');

        const flash = new Resposta();

        Especializacao.find()
            .sort({ especializacao_ordem: 1 })
            .then((especializacaos) => {
                console.log("Listagem realizada!");

                if (!resposta.sucesso) {
                    flash.texto = "";
                    flash.sucesso = "";
                } else {
                    flash.texto = resposta.texto;
                    flash.sucesso = resposta.sucesso;
                }

                res.render('ferramentas/especializacao/especializacaoLis', { especializacaos, flash });
            })
            .catch((err) => {
                console.error("Erro ao listar especializações:", err);
                req.flash("error_message", "Houve um erro ao listar especializações");
                res.redirect('/admin/erro');
            });
    },

    carregaEspecializacao(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        res.render("ferramentas/especializacao/especializacaoCad");
    },

    carregaEspecializacaoEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Especializacao.findById(req.params.id)
            .then((especializacao) => {
                if (!especializacao) {
                    req.flash("error_message", "Especialização não encontrada");
                    return res.redirect('/admin/erro');
                }
                res.render('ferramentas/especializacao/especializacaoEdi', { especializacao });
            })
            .catch((err) => {
                console.error("Erro ao carregar especialização:", err);
                req.flash("error_message", "Erro ao carregar especialização para edição");
                res.render('admin/erro');
            });
    },

    cadastraEspecializacao(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        especializacaoClass.especializacaoAdicionar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Especialização cadastrada com sucesso!");
                    resposta.texto = "Cadastrado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaEspecializacao(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    res.render('admin/erro', { resposta });
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar especialização");
                res.render('admin/erro');
            });
    },

    atualizaEspecializacao(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        especializacaoClass.especializacaoEditar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Especialização atualizada com sucesso!");
                    resposta.texto = "Atualizado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaEspecializacao(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    this.listaEspecializacao(req, res, resposta);
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização:", err);
                req.flash("error_message", "Erro inesperado ao atualizar especialização");
                res.render('admin/erro');
            });
    },

    deletaEspecializacao(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Especializacao.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Especialização não encontrada para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Especialização deletada com sucesso!");
                this.listaEspecializacao(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar especialização:", err);
                req.flash("error_message", "Erro ao deletar especialização");
                res.render('admin/erro');
            });
    }
};