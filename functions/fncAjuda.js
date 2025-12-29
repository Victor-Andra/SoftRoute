//Exports
const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

//Classes
const ajudaClass = require("../models/ajuda");
const usuarioClass = require("../models/usuario");
const manualClass = require("../models/manual")

// Tabelas — SEMPRE do PortalDoUsuario
const Ajuda = getModel("PortalDoUsuario", 'tb_ajuda', ajudaClass.AjudaSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
const Manual = getModel("PortalDoUsuario",'tb_manual',manualClass.ManualSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAjuda(req, res) {
        console.log('listando ajudas do PortalDoUsuario');
        
        // Busca usuários do PortalDoUsuario (não do softroute!)
        Usuario.find({
            "usuario_status": { $in: ["Ativo", "Inativo"] },
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((usuarios) => {
            // Busca ajudas do PortalDoUsuario
            Ajuda.find({ ajuda_lixo: "false" })
                .sort({ ajuda_nome: 1 }) // Ordena por nome do ajuda
                .then((ajudas) => {
                    // Formata data de edição
                    ajudas.forEach((ajuda) => {
                        if (ajuda.ajuda_dataedi) {
                            const dataedi = new Date(ajuda.ajuda_dataedi);
                            const mes = String(dataedi.getMonth() + 1).padStart(2, '0');
                            const dia = String(dataedi.getUTCDate()).padStart(2, '0');
                            ajuda.dataedi = `${dataedi.getFullYear()}-${mes}-${dia}`;
                        } else {
                            ajuda.dataedi = '';
                        }
                    });
                    Manual.find().then((manual)=>{
                        manual.sort((a,b) => ((a.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o manual por nome
                        //console.log("Listagem Realizada bene!")
                       
                    console.log("Listagem Realizada!");
                    res.render('ferramentas/ajuda', { ajudas, usuarios, manuals: manual  });
                })});
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Ajudas");
            res.redirect('/admin/erro');
        });
    },

    carregaAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ajuda.find({ ajuda_lixo: "false" }).then((ajudas) => {
            console.log("Listagem Realizada de Ajudas de Uso!");
            res.render("ferramentas/ajuda/ajudaCad", { ajudas });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Ajudas");
            res.redirect('/admin/erro');
        });
    },

    carregaAjudaEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ajuda.findById(req.params.id).then((ajuda) => {
            if (!ajuda) {
                req.flash("error_message", "Ajuda não encontrado");
                return res.redirect('/admin/erro');
            }
            console.log("ID:", ajuda._id);
            res.render('ferramentas/ajuda/ajudaEdi', { ajudas: ajuda });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar o ajuda para edição");
            res.render('admin/erro');
        });
    },

    cadastraAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        ajudaClass.ajudaAdicionar(req, res)
            .then((result) => {
                if (result === true) {
                    req.flash("success_message", "Cadastro realizado com sucesso!");
                    this.listaAjuda(req, res);
                } else {
                    // Se retornar uma string de erro
                    req.flash("error_message", result || "Erro desconhecido ao cadastrar ajuda");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro no cadastro:", err);
                req.flash("error_message", "Erro ao cadastrar ajuda");
                res.render('admin/erro');
            });
    },

    atualizaAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        ajudaClass.ajudaEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    console.log("Atualização Realizada!");
                    req.flash("success_message", "Ajuda atualizado com sucesso!");
                    this.listaAjuda(req, res);
                } else {
                    console.error("Erro na atualização:", resultado);
                    req.flash("error_message", "Erro ao atualizar ajuda");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em atualizaAjuda:", err);
                req.flash("error_message", "Erro ao atualizar ajuda");
                res.render('admin/erro');
            });
    },

    deletaAjuda: async (ajudaId, req, res) => {
        console.log("ID recebido na função deletaAjuda:", ajudaId);
        try {
            const resultado = await ajudaClass.ajudaDeletar(ajudaId, req, res);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaAjuda:", err);
            throw err;
        }
    }
};