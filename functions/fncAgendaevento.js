//Exports
const mongoose = require("mongoose");
const { getModel } = require('./fncGeral');

//Classes
const agendaEventoClass = require("../models/agendaEvento");
const usuarioClass = require("../models/usuario");

// Tabelas — SEMPRE do PortalDoUsuario
const AgendaEvento = getModel("PortalDoUsuario", 'tb_agendaEvento', agendaEventoClass.AgendaEventoSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
listaAgendaEvento(req, res) {
    console.log('listando agendaEventos do PortalDoUsuario');
    
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
            const agendaEventos = await AgendaEvento.find({ agendaEvento_lixo: "false" });
            
            if (!agendaEventos.length) {
                return res.render('ferramentas/agendaEvento/agendaEventoLis', {
                    agendaEventos: [],
                    usuarios: []
                });
            }

            // Mapeia usuários para acesso rápido
            const usuarioMap = usuarios.reduce((acc, u) => {
                acc[u._id.toString()] = u;
                return acc;
            }, {});

            // Processa cada agendaEvento
            agendaEventos.forEach(agendaEvento => {
                agendaEvento.datacad = agendaEvento.agendaEvento_datacad 
                    ? formatDateToBR(agendaEvento.agendaEvento_datacad) 
                    : "--/--/---- h--:--";
                
                agendaEvento.dataedi = agendaEvento.agendaEvento_dataedi 
                    ? formatDateToBR(agendaEvento.agendaEvento_dataedi) 
                    : "--/--/---- h--:--";

                const usuarioCad = usuarioMap[agendaEvento.agendaEvento_usuidcad?.toString()];
                const usuarioEdi = usuarioMap[agendaEvento.agendaEvento_usuidedi?.toString()];

                agendaEvento.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                agendaEvento.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
            });

            // Ordena por nome
            agendaEventos.sort((a, b) => {
                const nomeA = a.agendaEvento_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = b.agendaEvento_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });

            console.log("Listagem Realizada!");
            res.render('ferramentas/agendaEvento/agendaEventoLis', { 
                agendaEventos, 
                usuarios 
            });

        } catch (err) {
            console.error("Erro ao processar agendaEventos:", err.message);
            req.flash("error_message", "Houve um erro ao processar AgendaEventos");
            res.redirect('/admin/erro');
        }

    }).catch((err) => {
        console.error(err);
        req.flash("error_message", "Houve um erro ao listar AgendaEventos");
        res.redirect('/admin/erro');
    });
},
    carregaAgendaEvento(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        AgendaEvento.find({ agendaEvento_lixo: "false" }).then((agendaEventos) => {
            console.log("Listagem Realizada de AgendaEventos de Uso!");
            res.render("ferramentas/agendaEvento/agendaEventoCad", { agendaEventos });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar AgendaEventos");
            res.redirect('/admin/erro');
        });
    },

    carregaAgendaEventoEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        AgendaEvento.findById(req.params.id).then((agendaEvento) => {
            if (!agendaEvento) {
                req.flash("error_message", "AgendaEvento não encontrado");
                return res.redirect('/admin/erro');
            }
            console.log("ID:", agendaEvento._id);
            res.render('ferramentas/agendaEvento/agendaEventoEdi', { agendaEventos: agendaEvento });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar o agendaEvento para edição");
            res.render('admin/erro');
        });
    },

    cadastraAgendaEvento(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        agendaEventoClass.agendaEventoAdicionar(req, res)
            .then((result) => {
                if (result === true) {
                    req.flash("success_message", "Cadastro realizado com sucesso!");
                    this.listaAgendaEvento(req, res);
                } else {
                    // Se retornar uma string de erro
                    req.flash("error_message", result || "Erro desconhecido ao cadastrar agendaEvento");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro no cadastro:", err);
                req.flash("error_message", "Erro ao cadastrar agendaEvento");
                res.render('admin/erro');
            });
    },

    atualizaAgendaEvento(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        agendaEventoClass.agendaEventoEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    console.log("Atualização Realizada!");
                    req.flash("success_message", "AgendaEvento atualizado com sucesso!");
                    this.listaAgendaEvento(req, res);
                } else {
                    console.error("Erro na atualização:", resultado);
                    req.flash("error_message", "Erro ao atualizar agendaEvento");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em atualizaAgendaEvento:", err);
                req.flash("error_message", "Erro ao atualizar agendaEvento");
                res.render('admin/erro');
            });
    },

    deletaAgendaEvento: async (agendaEventoId, req, res) => {
        console.log("ID recebido na função deletaAgendaEvento:", agendaEventoId);
        try {
            const resultado = await agendaEventoClass.agendaEventoDeletar(agendaEventoId, req, res);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaAgendaEvento:", err);
            throw err;
        }
    }
};