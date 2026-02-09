//Exports
const mongoose = require("mongoose");
const { getModel } = require('./fncGeral');

//Classes
const anotaAdmClass = require("../models/anotaAdm");
const usuarioClass = require("../models/usuario");

// Tabelas — SEMPRE do PortalDoUsuario
const AnotaAdm = getModel("PortalDoUsuario", 'tb_anotaAdm', anotaAdmClass.AnotaAdmSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
listaAnotaAdm(req, res) {
    console.log('listando anotaAdms do PortalDoUsuario');
    
    function formatDateToBR(date) {
        const d = new Date(date);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const minuto = String(d.getMinutes()).padStart(2, '0');

        return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
    }

    // Busca todos os usuários do PortalDoUsuario
    Usuario.find({}).then(async (usuarios) => {
        
        try {
            const anotaAdms = await AnotaAdm.find({ anotaAdm_lixo: "false" });
            
            if (!anotaAdms.length) {
                return res.render('ferramentas/anotaAdm/anotaAdmLis', {
                    anotaAdms: [],
                    usuarios: []
                });
            }

            // Mapeia usuários para acesso rápido
            const usuarioMap = usuarios.reduce((acc, u) => {
                acc[u._id.toString()] = u;
                return acc;
            }, {});

            // Processa cada anotaAdm
            anotaAdms.forEach(anotaAdm => {
                anotaAdm.datacad = anotaAdm.anotaAdm_datacad 
                    ? formatDateToBR(anotaAdm.anotaAdm_datacad) 
                    : "--/--/---- h--:--";
                
                anotaAdm.dataedi = anotaAdm.anotaAdm_dataedi 
                    ? formatDateToBR(anotaAdm.anotaAdm_dataedi) 
                    : "--/--/---- h--:--";

                const usuarioCad = usuarioMap[anotaAdm.anotaAdm_usuidcad?.toString()];
                const usuarioEdi = usuarioMap[anotaAdm.anotaAdm_usuidedi?.toString()];

                anotaAdm.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                anotaAdm.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
            });

            // Ordena por nome
            anotaAdms.sort((a, b) => {
                const nomeA = a.anotaAdm_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = b.anotaAdm_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });

            console.log("Listagem Realizada!");
            res.render('ferramentas/anotaAdm/anotaAdmLis', { 
                anotaAdms, 
                usuarios 
            });

        } catch (err) {
            console.error("Erro ao processar anotaAdms:", err.message);
            req.flash("error_message", "Houve um erro ao processar AnotaAdms");
            res.redirect('/admin/erro');
        }

    }).catch((err) => {
        console.error(err);
        req.flash("error_message", "Houve um erro ao listar AnotaAdms");
        res.redirect('/admin/erro');
    });
},
    carregaAnotaAdm(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        AnotaAdm.find({ anotaAdm_lixo: "false" }).then((anotaAdms) => {
            console.log("Listagem Realizada de AnotaAdms de Uso!");
            res.render("ferramentas/anotaAdm/anotaAdmCad", { anotaAdms });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar AnotaAdms");
            res.redirect('/admin/erro');
        });
    },

    carregaAnotaAdmEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        AnotaAdm.findById(req.params.id).then((anotaAdm) => {
            if (!anotaAdm) {
                req.flash("error_message", "AnotaAdm não encontrado");
                return res.redirect('/admin/erro');
            }
            console.log("ID:", anotaAdm._id);
            res.render('ferramentas/anotaAdm/anotaAdmEdi', { anotaAdms: anotaAdm });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar o anotaAdm para edição");
            res.render('admin/erro');
        });
    },

    cadastraAnotaAdm(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        anotaAdmClass.anotaAdmAdicionar(req, res)
            .then((result) => {
                if (result === true) {
                    req.flash("success_message", "Cadastro realizado com sucesso!");
                    this.listaAnotaAdm(req, res);
                } else {
                    // Se retornar uma string de erro
                    req.flash("error_message", result || "Erro desconhecido ao cadastrar anotaAdm");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro no cadastro:", err);
                req.flash("error_message", "Erro ao cadastrar anotaAdm");
                res.render('admin/erro');
            });
    },

    atualizaAnotaAdm(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        anotaAdmClass.anotaAdmEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    console.log("Atualização Realizada!");
                    req.flash("success_message", "AnotaAdm atualizado com sucesso!");
                    this.listaAnotaAdm(req, res);
                } else {
                    console.error("Erro na atualização:", resultado);
                    req.flash("error_message", "Erro ao atualizar anotaAdm");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em atualizaAnotaAdm:", err);
                req.flash("error_message", "Erro ao atualizar anotaAdm");
                res.render('admin/erro');
            });
    },

    deletaAnotaAdm: async (anotaAdmId, req, res) => {
        console.log("ID recebido na função deletaAnotaAdm:", anotaAdmId);
        try {
            const resultado = await anotaAdmClass.anotaAdmDeletar(anotaAdmId, req, res);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaAnotaAdm:", err);
            throw err;
        }
    }
};