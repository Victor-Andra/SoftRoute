//Exports
const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

//Classes
const anoClass = require("../models/ano");
const usuarioClass = require("../models/usuario");

// Tabelas — SEMPRE do PortalDoUsuario
const Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAno(req, res) {
        console.log('listando anos do PortalDoUsuario');
        
        // Busca usuários do PortalDoUsuario (não do softroute!)
        Usuario.find({
            "usuario_status": { $in: ["Ativo", "Inativo"] },
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((usuarios) => {
            // Busca anos do PortalDoUsuario
            Ano.find({ ano_lixo: "false" })
                .sort({ ano_nome: 1 }) // Ordena por nome do ano
                .then((anos) => {
                    // Formata data de edição
                    anos.forEach((ano) => {
                        if (ano.ano_dataedi) {
                            const dataedi = new Date(ano.ano_dataedi);
                            const mes = String(dataedi.getMonth() + 1).padStart(2, '0');
                            const dia = String(dataedi.getUTCDate()).padStart(2, '0');
                            ano.dataedi = `${dataedi.getFullYear()}-${mes}-${dia}`;
                        } else {
                            ano.dataedi = '';
                        }
                    });
                    console.log("Listagem Realizada!");
                    res.render('ferramentas/ano/anoLis', { anos, usuarios });
                });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Anos");
            res.redirect('/admin/erro');
        });
    },

    carregaAno(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ano.find({ ano_lixo: "false" }).then((anos) => {
            console.log("Listagem Realizada de Anos de Uso!");
            res.render("ferramentas/ano/anoCad", { anos });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Anos");
            res.redirect('/admin/erro');
        });
    },

    carregaAnoEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ano.findById(req.params.id).then((ano) => {
            if (!ano) {
                req.flash("error_message", "Ano não encontrado");
                return res.redirect('/admin/erro');
            }
            console.log("ID:", ano._id);
            res.render('ferramentas/ano/anoEdi', { anos: ano });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar o ano para edição");
            res.render('admin/erro');
        });
    },

    cadastraAno(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        anoClass.anoAdicionar(req, res)
            .then((result) => {
                if (result === true) {
                    req.flash("success_message", "Cadastro realizado com sucesso!");
                    this.listaAno(req, res);
                } else {
                    // Se retornar uma string de erro
                    req.flash("error_message", result || "Erro desconhecido ao cadastrar ano");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro no cadastro:", err);
                req.flash("error_message", "Erro ao cadastrar ano");
                res.render('admin/erro');
            });
    },

    atualizaAno(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        anoClass.anoEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    console.log("Atualização Realizada!");
                    req.flash("success_message", "Ano atualizado com sucesso!");
                    this.listaAno(req, res);
                } else {
                    console.error("Erro na atualização:", resultado);
                    req.flash("error_message", "Erro ao atualizar ano");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em atualizaAno:", err);
                req.flash("error_message", "Erro ao atualizar ano");
                res.render('admin/erro');
            });
    },

    deletaAno: async (anoId, req, res) => {
        console.log("ID recebido na função deletaAno:", anoId);
        try {
            const resultado = await anoClass.anoDeletar(anoId, req, res);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaAno:", err);
            throw err;
        }
    }
};