// Imports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');


// Modelos
const beneClass = require("../models/bene");
const convClass = require("../models/conv");
const terapiaClass = require("../models/terapia");
const usuarioClass = require("../models/usuario");
const agendaClass = require("../models/agenda");
const sessaoClass = require("../models/sessao");

var Agenda = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema);
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema);
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema);
var Sessao = getModel("SoftRoute", 'tb_sessao', sessaoClass.SessaoSchema);
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema);
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

// Exportação das funções
module.exports = {
    // Carrega a tela de cadastro de sessão
    carregaSessao(req, res) {
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('listando Sessao');
        Sessao.find().then((sessao) => {
            console.log("Listagem Realizada Sessao!");
            Bene.find().then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));
                console.log("Listagem Realizada Bene!");
                Conv.find().then((conv) => {
                    console.log("Listagem Realizada Convênio!");
                    Terapia.find({ terapia_status: "Ativo" }).then((terapia) => {
                        terapia.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome));
                        console.log("Listagem Realizada Terapia!");
                        Usuario.find().then((usuario) => {
                            console.log("Listagem Realizada Usuário!");
                            res.render("beneficiario/sessao/sessaoCad", {
                                sessaos: sessao,
                                usuarios: usuario,
                                terapias: terapia,
                                convs: conv,
                                benes: bene
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log("Erro ao listar sessões:", err);
            req.flash("error_message", "Houve um erro ao listar Sessão");
            res.redirect('/admin/erro');
        });
    },
    // Cadastra uma nova sessão
    cadastraSessao(req, res) {
        sessaoClass.sessaoAdicionar(req, res).then(() => {
            console.log('Sessão cadastrada com sucesso');
            this.carregaSessao(req, res);
        }).catch((err) => {
            console.log("Erro ao cadastrar sessão:", err);
            req.flash("error_message", "Houve um erro ao cadastrar a Sessão");
            res.redirect('/admin/erro');
        });
    },
    // Deleta uma sessão
    deletaSessao(req, res) {
        let db = req.cookies['preferredDb'];
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);

        Sessao.deleteOne({ _id: req.params.id }).then(() => {
            req.flash("success_message", "Sessão deletada!");
            res.redirect('/sessao/lista');
        }).catch((err) => {
            console.log("Erro ao deletar sessão:", err);
            req.flash("error_message", "Houve um erro ao deletar a Sessão");
            res.redirect('/admin/erro');
        });
    },

    // Atualiza uma sessão existente
    atualizaSessao(req, res) {
        sessaoClass.sessaoEditar(req, res).then(() => {
            req.flash("success_message", "Sessão atualizada!");
            res.redirect('/sessao/lista');
        }).catch((err) => {
            console.log("Erro ao atualizar sessão:", err);
            req.flash("error_message", "Houve um erro ao atualizar a Sessão");
            res.redirect('/admin/erro');
        });
    },

    // Carrega sessão para edição
    carregaSessaoEdi(req, res) {
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        Sessao.findOne({ sessao_beneid: req.params.id }).then((sessao) => {
            Bene.find().then((bene) => {
                Conv.find().then((conv) => {
                    Terapia.find({ terapia_status: "Ativo" }).then((terapia) => {
                        terapia.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome));
                        Usuario.find().then((usuario) => {
                            res.render("beneficiario/sessao/sessaoEdi", {
                                sessao,
                                usuarios: usuario,
                                terapias: terapia,
                                convs: conv,
                                benes: bene
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log("Erro ao carregar sessão para edição:", err);
            req.flash("error_message", "Houve um erro ao carregar a Sessão");
            res.redirect('/admin/erro');
        });
    },

    // Lista todas as sessões da semana atual
    async listaSessao(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('listando Sessao');

        function getInicioFimSemana(data) {
            const dia = data.getDay();
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia);
            inicioSemana.setHours(0, 0, 0, 0);
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);
            return { inicio: inicioSemana, fim: fimSemana };
        }

        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToBR(inicio);
        const datafimSemana = formatDateToBR(fim);

        try {
            const sessaoList = await Sessao.find({
                sessao_data: { $gte: inicio, $lte: fim }
            });

            if (sessaoList.length === 0) {
                return res.render("beneficiario/sessao/sessaoLis", {
                    sessaos: [],
                    usuarios: [],
                    terapias: [],
                    convs: [],
                    benes: [],
                    datainiSemana,
                    datafimSemana
                });
            }

            const beneIds = [...new Set(sessaoList.map(s => s.sessao_beneid.toString()))];

            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ _id: { $in: beneIds }, bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            const agendasPromises = sessaoList.map(sessao =>
                Agenda.find({
                    agenda_beneid: sessao.sessao_beneid,
                    agenda_data: { $gte: inicio, $lte: fim },
                    agenda_extra: false  // ✅ Filtro adicionado aqui
                })
            );
            const agendasList = await Promise.all(agendasPromises);

            for (let i = 0; i < sessaoList.length; i++) {
                const sessao = sessaoList[i];
                const agendas = agendasList[i];

                // Formata datas
                sessao.datacad = sessao.sessao_datacad
                    ? new Date(sessao.sessao_datacad).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : "--/--/---- h--:--";

                sessao.dataedi = sessao.sessao_dataedi
                    ? new Date(sessao.sessao_dataedi).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                    : "--/--/---- h--:--";

                sessao.datainiSemana = datainiSemana;
                sessao.datafimSemana = datafimSemana;

                // Processa terapias
                for (let j = 1; j <= 25; j++) {
                    const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                    const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;
                    const idTerapia = sessao[fieldTerapiaId];
                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                    if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                        sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                        continue;
                    }

                    const qtAgenda = agendas.filter(a => a.agenda_terapiaid?.toString() === idTerapia.toString()).length;
                    const saldo = qtPrev - qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldo > 0 ? `+${saldo}` : saldo.toString();
                    sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "";
                }
            }

            // Adiciona contagem de sessões ao beneficiário
            beneList.forEach(b => {
                b.countSessaos = sessaoList.filter(s => s.sessao_beneid.toString() === b._id.toString()).length;
            });

            beneList.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            res.render("beneficiario/sessao/sessaoLis", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana
            });

        } catch (err) {
            console.error("Erro ao listar sessões:", err);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        }
    },

    // Pesquisa individual (sem filtro)
    async pesquisaind(req, res) {
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('Carregando view de filtro');

        function getInicioFimSemana(data) {
            const dia = data.getDay();
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia);
            inicioSemana.setHours(0, 0, 0, 0);
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);
            return { inicio: inicioSemana, fim: fimSemana };
        }

        function formatDateToISO(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToISO(inicio);
        const datafimSemana = formatDateToISO(fim);

        try {
            const beneList = await Bene.find({ bene_status: "Ativo" });
            beneList.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            const [convList, terapiaList, usuarioList] = await Promise.all([
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            let sessaos = [];
            let sessoesNaoEncontradas = false;

            if (req.body && req.body.bene_id && req.body.bene_id !== "-") {
                const bene_id = req.body.bene_id;
                sessaos = await Sessao.find({ sessao_beneid: bene_id }).sort({ sessao_data: 1 });

                if (sessaos.length === 0) {
                    sessoesNaoEncontradas = true;
                    console.log(`⚠️ Nenhuma sessão encontrada para o beneficiário ID: ${bene_id}`);
                } else {
                    console.log(`✅ Foram encontradas ${sessaos.length} sessões`);
                }
            }

            res.render("beneficiario/sessao/sessaoLisind", {
                sessaos,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana,
                sessoesNaoEncontradas
            });

        } catch (err) {
            console.error("❌ Erro ao carregar sessões:", err.message);
            req.flash("error_message", "Houve um erro ao carregar a tela");
            res.redirect('/admin/erro');
        }
    },

    // Filtro com data e beneficiário
    async pesquisaindfil(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('Carregando view com filtro aplicado');

        const { bene_id, data_inicio } = req.body;

        function getInicioFimSemana(data) {
            const dia = data.getDay();
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia);
            inicioSemana.setHours(0, 0, 0, 0);
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);
            return { inicio: inicioSemana, fim: fimSemana };
        }

        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        let inicioPeriodo, fimPeriodo;
        if (data_inicio) {
            const dataSelecionada = new Date(data_inicio);
            const periodoAtual = getInicioFimSemana(dataSelecionada);
            inicioPeriodo = periodoAtual.inicio;
            fimPeriodo = periodoAtual.fim;
        } else {
            const hoje = new Date();
            const periodoAtual = getInicioFimSemana(hoje);
            inicioPeriodo = periodoAtual.inicio;
            fimPeriodo = periodoAtual.fim;
        }

        const datainiSemana = formatDateToBR(inicioPeriodo);
        const datafimSemana = formatDateToBR(fimPeriodo);

        try {
            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            beneList.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            if (!bene_id || bene_id === "-") {
                return res.render("beneficiario/sessao/sessaoLisindfil", {
                    sessao: null,
                    datacad: "--/--/---- h--:--",
                    dataedi: "--/--/---- h--:--",
                    usuario_nome_cad: "--",
                    usuario_nome_edi: "--",
                    datainiSemana,
                    datafimSemana,
                    bene_id: "",
                    benes: beneList,
                    convs: convList,
                    terapias: terapiaList,
                    usuarios: usuarioList,
                    sessoesNaoEncontradas: false
                });
            }

            const sessao = await Sessao.findOne({
                sessao_beneid: bene_id,
                sessao_data: { $gte: inicioPeriodo, $lte: fimPeriodo }
            });

            if (!sessao) {
                console.log(`⚠️ Nenhuma sessão encontrada para o beneficiário ID: ${bene_id}`);
                return res.render("beneficiario/sessao/sessaoLisindfil", {
                    sessao: null,
                    datacad: "--/--/---- h--:--",
                    dataedi: "--/--/---- h--:--",
                    usuario_nome_cad: "--",
                    usuario_nome_edi: "--",
                    datainiSemana,
                    datafimSemana,
                    bene_id,
                    benes: beneList,
                    convs: convList,
                    terapias: terapiaList,
                    usuarios: usuarioList,
                    sessoesNaoEncontradas: true
                });
            }

            // Formatação de datas
            const formatDateTime = (date) => date
                ? new Date(date).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                : "--/--/---- h--:--";

            const datacad = formatDateTime(sessao.sessao_datacad);
            const dataedi = formatDateTime(sessao.sessao_dataedi);

            const usuarioCad = usuarioList.find(u => u._id.toString() === sessao.sessao_usuidcad?.toString());
            const usuarioEdi = usuarioList.find(u => u._id.toString() === sessao.sessao_usuidedi?.toString());

            const usuario_nome_cad = usuarioCad ? usuarioCad.usuario_nome : "--";
            const usuario_nome_edi = usuarioEdi ? usuarioEdi.usuario_nome : "--";

            const agendas = await Agenda.find({
                agenda_beneid: sessao.sessao_beneid,
                agenda_data: { $gte: inicioPeriodo, $lte: fimPeriodo },
                agenda_extra: false  // ✅ Filtro adicionado aqui
            });

            for (let j = 1; j <= 25; j++) {
                const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;
                const idTerapia = sessao[fieldTerapiaId];
                const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = "";
                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = "";
                    sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                    continue;
                }

                const qtAgenda = agendas.filter(a => a.agenda_terapiaid?.toString() === idTerapia.toString()).length;
                const saldo = qtPrev - qtAgenda;
                sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldo > 0 ? `+${saldo}` : saldo.toString();
                sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "";
            }

            console.log(`✅ Sessão encontrada para o beneficiário ID: ${bene_id}`);
            res.render("beneficiario/sessao/sessaoLisindfil", {
                sessao,
                datacad,
                dataedi,
                usuario_nome_cad,
                usuario_nome_edi,
                datainiSemana,
                datafimSemana,
                bene_id,
                benes: beneList,
                convs: convList,
                terapias: terapiaList,
                usuarios: usuarioList,
                sessoesNaoEncontradas: false
            });

        } catch (err) {
            console.error("❌ Erro interno:", err.message);
            req.flash("error_message", "Houve um erro ao carregar os dados");
            res.redirect('/admin/erro');
        }
    },

    // Lista sessões filtradas por data
    async listaSessaofilOLD(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('listando Sessao Filtrada pela data');

        function getInicioFimSemana(data) {
            const dia = data.getDay();
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia);
            inicioSemana.setHours(0, 0, 0, 0);
            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);
            return { inicio: inicioSemana, fim: fimSemana };
        }

        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        try {
            let dataSelecionada = req.query.dataFil || req.body.dataFil;
            const data = new Date(dataSelecionada || new Date());
            if (isNaN(data.getTime())) return res.status(400).send("Data inválida.");

            const { inicio, fim } = getInicioFimSemana(data);
            const datainiSemana = formatDateToBR(inicio);
            const datafimSemana = formatDateToBR(fim);

            const sessaoList = await Sessao.find({
                sessao_data: { $gte: inicio, $lte: fim }
            });

            if (sessaosList.length === 0) {
                return res.render("beneficiario/sessao/sessaoLisfil", {
                    sessaos: [],
                    usuarios: [],
                    terapias: [],
                    convs: [],
                    benes: [],
                    datainiSemana,
                    datafimSemana
                });
            }

            const beneIds = [...new Set(sessaosList.map(s => s.sessao_beneid.toString()))];
            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ _id: { $in: beneIds }, bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            beneList.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            const agendasList = await Promise.all(sessaosList.map(s =>
                Agenda.find({
                    agenda_beneid: s.sessao_beneid,
                    agenda_data: { $gte: inicio, $lte: fim },
                    agenda_extra: false  // ✅ Filtro adicionado aqui
                })
            ));

            sessaosList.forEach((sessao, i) => {
                sessao.datacad = sessao.sessao_datacad ? new Date(sessao.sessao_datacad).toLocaleString('pt-BR') : "--/--/---- h--:--";
                sessao.dataedi = sessao.sessao_dataedi ? new Date(sessao.sessao_dataedi).toLocaleString('pt-BR') : "--/--/---- h--:--";
                sessao.datainiSemana = datainiSemana;
                sessao.datafimSemana = datafimSemana;

                for (let j = 1; j <= 25; j++) {
                    const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                    const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;
                    const idTerapia = sessao[fieldTerapiaId];
                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                    if (!idTerapia) continue;

                    const qtAgenda = (agendasList[i] || []).filter(a => a.agenda_terapiaid?.toString() === idTerapia.toString()).length;
                    const saldo = qtPrev - qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldo > 0 ? `+${saldo}` : saldo.toString();
                }
            });

            res.render("beneficiario/sessao/sessaoLisfil", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana
            });

        } catch (err) {
            console.error("Erro ao listar sessões:", err.message);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        }
    },

    async listaSessaofil(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        console.log('listando Sessao Filtrada pela data');

        // Função para calcular início e fim da semana (domingo a sábado)
        function getInicioFimSemana(data) {
            const dia = data.getDay(); // 0 = domingo
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia);
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        // Formata data para exibição: dd/mm/aaaa
        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        try {
            // Recebe a data do formulário (query ou body), ou usa a data atual
            let dataSelecionada = req.query.dataFil || req.body.dataFil;
            const data = new Date(dataSelecionada || new Date());

            // Valida se a data é válida
            if (isNaN(data.getTime())) {
                console.error("Data inválida recebida no filtro:", dataSelecionada);
                return res.status(400).send("Data inválida.");
            }

            // Define o intervalo da semana (domingo a sábado)
            const { inicio, fim } = getInicioFimSemana(data);
            const datainiSemana = formatDateToBR(inicio);
            const datafimSemana = formatDateToBR(fim);

            console.log(`Buscando sessões no período: ${datainiSemana} até ${datafimSemana}`);

            // Passo 1: Buscar todas as sessões no período
            const sessaoList = await Sessao.find({
                sessao_data: { $gte: inicio, $lte: fim }
            });

            // Se não houver sessões
            if (!sessaoList || sessaoList.length === 0) {
                console.log("Nenhuma sessão encontrada para o período.");
                return res.render("beneficiario/sessao/sessaoLisfil", {
                    sessaos: [],
                    usuarios: [],
                    terapias: [],
                    convs: [],
                    benes: [],
                    datainiSemana,
                    datafimSemana
                });
            }

            // Extrair IDs dos beneficiários envolvidos
            const beneIds = [...new Set(sessaoList.map(s => s.sessao_beneid.toString()))];

            // Carregar dados relacionados em paralelo
            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ _id: { $in: beneIds }, bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            // Ordenar beneficiários por nome
            beneList.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            // Passo 2: Buscar AGENDAS com filtro: agenda_extra = false
            const agendasList = await Promise.all(
                sessaoList.map(s =>
                    Agenda.find({
                        agenda_beneid: s.sessao_beneid,
                        agenda_data: { $gte: inicio, $lte: fim },
                        agenda_extra: false  // ✅ Filtro adicionado aqui
                    })
                )
            );

            // Passo 3: Processar cada sessão e calcular quantidades e saldos
            sessaoList.forEach((sessao, i) => {
                // Formatar datas de cadastro e edição
                sessao.datacad = sessao.sessao_datacad
                    ? new Date(sessao.sessao_datacad).toLocaleString('pt-BR')
                    : "--/--/---- h--:--";

                sessao.dataedi = sessao.sessao_dataedi
                    ? new Date(sessao.sessao_dataedi).toLocaleString('pt-BR')
                    : "--/--/---- h--:--";

                // Adicionar datas da semana para exibição
                sessao.datainiSemana = datainiSemana;
                sessao.datafimSemana = datafimSemana;

                // Processar cada terapia (1 a 25)
                for (let j = 1; j <= 25; j++) {
                    const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                    const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;
                    const idTerapia = sessao[fieldTerapiaId];
                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                    // Ignorar se não houver terapia cadastrada
                    if (!idTerapia) continue;

                    // Contar quantas agendas válidas (não extras) existem para essa terapia
                    const qtAgenda = (agendasList[i] || []).filter(
                        a => a.agenda_terapiaid?.toString() === idTerapia.toString()
                    ).length;

                    // Calcular saldo
                    const saldo = qtPrev - qtAgenda;

                    // Atribuir valores dinâmicos à sessão
                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldo > 0 ? `+${saldo}` : saldo.toString();
                }
            });

            // Renderizar a view com os dados
            res.render("beneficiario/sessao/sessaoLisfil", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana
            });

        } catch (err) {
            console.error("Erro ao listar sessões:", err.message);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        }
    }
};