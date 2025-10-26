const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

// Importa a classe
const perfilClass = require("../models/perfil");

// ✅ FIX: Usar SEMPRE PortalDoUsuario — NÃO "SoftRoute"
const Perfil = getModel("PortalDoUsuario", 'tb_perfil', perfilClass.PerfilSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaPerfil(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando perfis do PortalDoUsuario');
        Perfil.find()
            .sort({ perfil_nome: 1 })
            .then((perfils) => {
                console.log("Listagem realizada!");
                res.render('ferramentas/perfil/perfilLis', { perfils });
            })
            .catch((err) => {
                console.error("Erro ao listar perfis:", err);
                req.flash("error_message", "Houve um erro ao listar perfis");
                res.redirect('/admin/erro');
            });
    },

    carregaPerfil(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Perfil.find()
            .then((perfils) => {
                console.log("Listagem de perfis realizada!");
                res.render("ferramentas/perfil/perfilCad", { perfils });
            })
            .catch((err) => {
                console.error("Erro ao carregar perfis:", err);
                req.flash("error_message", "Houve um erro ao listar perfis");
                res.redirect('/admin/erro');
            });
    },

    carregaPerfilEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Perfil.findById(req.params.id)
            .then((perfil) => {
                if (!perfil) {
                    req.flash("error_message", "Perfil não encontrado");
                    return res.redirect('/admin/erro');
                }
                res.render('ferramentas/perfil/perfilEdi', { perfil });
            })
            .catch((err) => {
                console.error("Erro ao carregar perfil para edição:", err);
                req.flash("error_message", "Erro ao carregar perfil");
                res.render('admin/erro');
            });
    },

    cadastraPerfil(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        perfilClass.perfilAdicionar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    req.flash("success_message", "Perfil cadastrado com sucesso!");
                    this.listaPerfil(req, res);
                } else {
                    req.flash("error_message", resultado);
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro de perfil:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar perfil");
                res.render('admin/erro');
            });
    },

    atualizaPerfil(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        perfilClass.perfilEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    req.flash("success_message", "Perfil atualizado com sucesso!");
                    this.listaPerfil(req, res);
                } else {
                    req.flash("error_message", resultado);
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização de perfil:", err);
                req.flash("error_message", "Erro inesperado ao atualizar perfil");
                res.render('admin/erro');
            });
    },

    deletaPerfil(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Perfil.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Perfil não encontrado para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Perfil deletado com sucesso!");
                this.listaPerfil(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar perfil:", err);
                req.flash("error_message", "Erro ao deletar perfil");
                res.render('admin/erro');
            });
    }
};