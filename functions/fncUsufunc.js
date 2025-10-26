const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

// Usufunc
const usufuncClass = require("../models/usufunc");
const Usufunc = getModel("PortalDoUsuario", 'tb_usufunc', usufuncClass.UsufuncSchema);

// Classes Estrangeiras
const estadoClass = require("../models/estado");
const usuarioClass = require("../models/usuario");

// Tabelas Estrangeiras — já fixadas no PortalDoUsuario
const Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaUsufunc(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando usufuncs do PortalDoUsuario');
        Usuario.find()
            .then((usuarios) => {
                return Usufunc.find().then((usufuncs) => {
                    console.log("Listagem realizada!");
                    res.render('ferramentas/usufunc/usufuncLis', { usufuncs, usuarios });
                });
            })
            .catch((err) => {
                console.error("Erro ao listar Usufuncs:", err);
                req.flash("error_message", "Houve um erro ao listar Usufuncs");
                res.redirect('/admin/erro');
            });
    },

    carregaUsufunc(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Estado.find()
            .then((estados) => {
                console.log("Listagem de UFs realizada!");
                res.render("ferramentas/usufunc/usufuncCad", { estados });
            })
            .catch((err) => {
                console.error("Erro ao carregar Estados:", err);
                req.flash("error_message", "Houve um erro ao listar Estados");
                res.redirect('/admin/erro');
            });
    },

    carregaUsufuncEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Usufunc.findById(req.params.id)
            .then((usufunc) => {
                if (!usufunc) {
                    req.flash("error_message", "Função de usuário não encontrada");
                    return res.redirect('/admin/erro');
                }
                console.log("Função de usuário carregada para edição");
                res.render('ferramentas/usufunc/usufuncEdi', { usufunc });
            })
            .catch((err) => {
                console.error("Erro ao carregar Usufunc para edição:", err);
                req.flash("error_message", "Erro ao carregar função de usuário");
                res.render('admin/erro');
            });
    },

    cadastraUsufunc(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        usufuncClass.usufuncAdicionar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    req.flash("success_message", "Função de usuário cadastrada com sucesso!");
                    this.listaUsufunc(req, res);
                } else {
                    req.flash("error_message", resultado);
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro de Usufunc:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar função de usuário");
                res.render('admin/erro');
            });
    },

    atualizaUsufunc(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        usufuncClass.usufuncEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    req.flash("success_message", "Função de usuário atualizada com sucesso!");
                    this.listaUsufunc(req, res);
                } else {
                    req.flash("error_message", resultado);
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização de Usufunc:", err);
                req.flash("error_message", "Erro inesperado ao atualizar função de usuário");
                res.render('admin/erro');
            });
    },

    deletaUsufunc(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Usufunc.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Função de usuário não encontrada para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Função de usuário deletada com sucesso!");
                this.listaUsufunc(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar Usufunc:", err);
                req.flash("error_message", "Erro ao deletar função de usuário");
                res.render('admin/erro');
            });
    }
};