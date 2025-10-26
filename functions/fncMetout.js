const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

// Importa o modelo
const metoutClass = require("../models/metout");

// ✅ FIX: Usar SEMPRE PortalDoUsuario — NÃO usar cookie
const Metout = getModel("PortalDoUsuario", 'tb_metout', metoutClass.MetoutSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaMetout(req, res, resposta = {}) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando metouts do PortalDoUsuario');
        
        const flash = new Resposta();
        
        Metout.find()
            .sort({ metout_ordem: 1 })
            .then((metouts) => {
                console.log("Listagem de Metouts realizada!");

                if (!resposta.sucesso) {
                    flash.texto = "";
                    flash.sucesso = "";
                } else {
                    flash.texto = resposta.texto;
                    flash.sucesso = resposta.sucesso;
                }

                res.render('ferramentas/metout/metoutLis', { metouts, resposta: flash });
            })
            .catch((err) => {
                console.error("Erro ao listar Metouts:", err);
                req.flash("error_message", "Houve um erro ao listar Metouts");
                res.redirect('/admin/erro');
            });
    },

    carregaMetout(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        res.render("ferramentas/metout/metoutCad");
    },

    carregaMetoutEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Metout.findById(req.params.id)
            .then((metout) => {
                if (!metout) {
                    req.flash("error_message", "Metout não encontrado");
                    return res.redirect('/admin/erro');
                }
                res.render('ferramentas/metout/metoutEdi', { metout });
            })
            .catch((err) => {
                console.error("Erro ao carregar Metout:", err);
                req.flash("error_message", "Erro ao carregar Metout para edição");
                res.render('admin/erro');
            });
    },

    cadastraMetout(req, res) {
       // Usa o modelo já configurado para PortalDoUsuario
        metoutClass.metoutAdicionar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Metout cadastrado com sucesso!");
                    resposta.texto = "Cadastrado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaMetout(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    res.render('admin/erro', { resposta });
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro de Metout:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar Metout");
                res.render('admin/erro');
            });
    },

    atualizaMetout(req, res) {
        metoutClass.metoutEditar(req, res)
                // Usa o modelo já configurado para PortalDoUsuario
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Metout atualizado com sucesso!");
                    resposta.texto = "Atualizado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaMetout(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    this.listaMetout(req, res, resposta);
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização de Metout:", err);
                req.flash("error_message", "Erro inesperado ao atualizar Metout");
                res.render('admin/erro');
            });
    },

    deletaMetout(req, res) {
        
        Metout.deleteOne({ _id: req.params.id })
                // Usa o modelo já configurado para PortalDoUsuario
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Metout não encontrado para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Metout deletado com sucesso!");
                this.listaMetout(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar Metout:", err);
                req.flash("error_message", "Erro ao deletar Metout");
                res.render('admin/erro');
            });
    }
};