const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

// Importa a classe
const metodoClass = require("../models/metodo");

// ✅ FIX: Usar SEMPRE PortalDoUsuario
const Metodo = getModel("PortalDoUsuario", 'tb_metodo', metodoClass.MetodoSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaMetodo(req, res, resposta = {}) {
        // Usa o modelo já configurado para PortalDoUsuario
        console.log('Listando métodos do PortalDoUsuario');
        
        const flash = new Resposta();
        
        Metodo.find()
            .sort({ metodo_ordem: 1 })
            .then((metodos) => {
                console.log("Listagem realizada!");

                if (!resposta.sucesso) {
                    flash.texto = "";
                    flash.sucesso = "";
                } else {
                    flash.texto = resposta.texto;
                    flash.sucesso = resposta.sucesso;
                }

                res.render('ferramentas/metodo/metodoLis', { metodos, resposta: flash });
            })
            .catch((err) => {
                console.error(err);
                req.flash("error_message", "Houve um erro ao listar Métodos");
                res.redirect('/admin/erro');
            });
    },

    carregaMetodo(req, res) {
        res.render("ferramentas/metodo/metodoCad");
        // Usa o modelo já configurado para PortalDoUsuario
    },

    carregaMetodoEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Metodo.findById(req.params.id)
            .then((metodo) => {
                if (!metodo) {
                    req.flash("error_message", "Método não encontrado");
                    return res.redirect('/admin/erro');
                }
                res.render('ferramentas/metodo/metodoEdi', { metodo });
            })
            .catch((err) => {
                console.error(err);
                req.flash("error_message", "Erro ao carregar método para edição");
                res.render('admin/erro');
            });
    },

    cadastraMetodo(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        metodoClass.metodoAdicionar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Método cadastrado com sucesso!");
                    resposta.texto = "Cadastrado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaMetodo(req, res, resposta);
                } else {
                    // resultado é uma string de erro
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    res.render('admin/erro', { resposta });
                }
            })
            .catch((err) => {
                console.error("Erro inesperado no cadastro:", err);
                req.flash("error_message", "Erro inesperado ao cadastrar método");
                res.render('admin/erro');
            });
    },

    atualizaMetodo(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        metodoClass.metodoEditar(req, res)
            .then((resultado) => {
                const resposta = new Resposta();
                if (resultado === true) {
                    req.flash("success_message", "Método atualizado com sucesso!");
                    resposta.texto = "Atualizado com sucesso!";
                    resposta.sucesso = "true";
                    this.listaMetodo(req, res, resposta);
                } else {
                    req.flash("error_message", resultado);
                    resposta.texto = resultado;
                    resposta.sucesso = "false";
                    this.listaMetodo(req, res, resposta);
                }
            })
            .catch((err) => {
                console.error("Erro inesperado na atualização:", err);
                req.flash("error_message", "Erro inesperado ao atualizar método");
                res.render('admin/erro');
            });
    },

    deletaMetodo(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Metodo.deleteOne({ _id: req.params.id })
            .then((result) => {
                if (result.deletedCount === 0) {
                    req.flash("error_message", "Método não encontrado para exclusão");
                    return res.redirect('/admin/erro');
                }
                req.flash("success_message", "Método deletado com sucesso!");
                this.listaMetodo(req, res);
            })
            .catch((err) => {
                console.error("Erro ao deletar método:", err);
                req.flash("error_message", "Erro ao deletar método");
                res.render('admin/erro');
            });
    }
};