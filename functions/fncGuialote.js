//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//Houve alteração na Estrutura e Banco da evolução de atendimentos, eles agora são vinculados à Agenda e Não ao Atendimento.
//Classes Extrangeiras
const evoatendClass = require("../models/agenda")

//As classe tem que ser declaradas antes das tabelas
//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const salaClass = require("../models/sala")
const horaageClass = require("../models/horaAge")
const agendaClass = require("../models/agenda")
const anoClass = require("../models/ano")


//Tabelas Extrangeiras
var Agenda = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)
var Horaage = getModel("SoftRoute", 'tb_horaage', horaageClass.HoraageSchema)
var Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
//Funções auxiliares

const fncAgenda = require("./fncAgenda")

//Funções auxiliares
const ObjectId = require('mongodb').ObjectId;
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

class FiltroEvoatend{
    constructor(
        tipoData,
        dataFinal,
        anoAtend,
        mesAtend,
        tipoPessoa,
        atendTerapeuta,
        atendBeneficiario
        ){
        this.tipoData = tipoData,
        this.dataFinal = dataFinal,
        this.anoAtend = anoAtend,
        this.mesAtend = mesAtend,
        this.tipoPessoa = tipoPessoa,
        this.atendTerapeuta = atendTerapeuta,
        this.atendBeneficiario = atendBeneficiario
    }
}

module.exports = {FiltroEvoatend,

    filtraGuialisOLD(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        // Certifique-se de que Usuario e Ano estão importados no topo do arquivo
        // Ex: const Usuario = require('../models/Usuario'); const Ano = require('../models/Ano');

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // Receber dados do formulário
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;

        console.log("🔍 [INPUTS DO FORMULÁRIO]");
        console.log("→ tipoData:", tipoData);
        console.log("→ anoAtend:", anoAtend);
        console.log("→ mesAtend:", mesAtend);
        console.log("→ dataFil:", dataFil);
        console.log("→ atendTipoPessoa:", atendTipoPessoa);
        console.log("→ atendBeneficiario:", atendBeneficiario);

        let dataIni, dataFim;

        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            if (isNaN(ano) || isNaN(mes)) {
                console.log("❌ Ano ou mês inválido");
                return res.render('admin/erro', { message: "Ano ou mês inválido." });
            }
            dataIni = new Date(Date.UTC(ano, mes, 1)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999)).toISOString();

        } else if (tipoData === "Dia") {
            if (!dataFil) {
                console.log("❌ Data não informada para filtro 'Dia'");
                return res.render('admin/erro', { message: "Data não informada." });
            }
            const [ano, mes, dia] = dataFil.split('-').map(Number);
            dataIni = new Date(Date.UTC(ano, mes - 1, dia)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999)).toISOString();

        } else if (tipoData === "Semana") {
            console.log("❌ Filtro 'Semana' não implementado");
            return res.render('admin/erro', { message: "Filtro por semana ainda não implementado." });
        } else {
            console.log("❌ Tipo de filtro desconhecido:", tipoData);
            return res.render('admin/erro', { message: "Tipo de filtro inválido." });
        }

        console.log("📅 [INTERVALO DE DATAS GERADO]");
        console.log("→ dataIni (ISO):", dataIni);
        console.log("→ dataFim (ISO):", dataFim);

        // Montar critérios de busca na Agenda
        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim }
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
            console.log("👤 Aplicando filtro por beneficiário ID:", atendBeneficiario);
        }

        console.log("🔎 [QUERY FINAL PARA AGENDA]");
        console.log(agendaQuery);

        // Buscar agendas
        Agenda.find(agendaQuery)
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                if (agendas.length > 0) {
                    console.log("→ Exemplo do primeiro registro:", agendas[0]);
                }

                const extraIds = agendas.map(a => a._id);
                console.log("→ IDs coletados (extraIds):", extraIds);

                // Formatar campos de exibição
                agendas.forEach((a) => {
                    const data = new Date(a.agenda_data);
                    let hor = data.getUTCHours().toString().padStart(2, '0');
                    let min = data.getUTCMinutes().toString().padStart(2, '0');
                    a.agenda_hora = `${hor}:${min}`;
                    a.agenda_data_dia = fncGeral.getDataFMT(data);
                });

                // Carregar beneficiários
                return Bene.find()
                    .then((bene) => {
                        bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                        // Carregar terapeutas
                        return Usuario.find({
                            usuario_status: "Ativo",
                            $or: [
                                { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                                { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                            ]
                        })
                        .then((terapeuta) => {
                            terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                            // Carregar horários
                            return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                                .then((horaage) => {

                                    // Carregar salas
                                    return Sala.find()
                                        .then((salas) => {
                                            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));

                                            // Carregar terapias
                                            return Terapia.find()
                                                .then((terapias) => {

                                                    // Carregar convênios
                                                    return Conv.find()
                                                        .then((convs) => {
                                                            convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));

                                                            // Carregar anos
                                                            return Ano.find()
                                                                .then((anos) => {
                                                                    // ✅ Tudo carregado — renderizar view SEM atendimentos
                                                                    console.log("📤 [RENDERIZANDO VIEW]");
                                                                    console.log("→ extras.length:", agendas.length);
                                                                    console.log("→ benes.length:", bene.length);
                                                                    console.log("→ terapeutas.length:", terapeuta.length);

                                                                    res.render('guia/guiaLis', {
                                                                        extras: agendas,
                                                                        benes: bene,
                                                                        terapeutas: terapeuta,
                                                                        horaages: horaage,
                                                                        salas: salas,
                                                                        terapias: terapias,
                                                                        convs: convs,
                                                                        anos: anos,
                                                                        atends: [], // opcional: remova se não usado na view
                                                                        flash,

                                                                        filtroTipo: tipoData,
                                                                        filtroAno: anoAtend,
                                                                        filtroMes: mesAtend,
                                                                        filtroData: dataFil,
                                                                        filtroTipoPessoa: atendTipoPessoa,
                                                                        filtroBeneficiario: atendBeneficiario
                                                                    });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                    });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    filtraGuialis(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        // Garanta que estas importações existem no topo do arquivo:
        // const Usuario = require('../models/Usuario');
        // const Ano = require('../models/Ano');

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // Receber dados do formulário
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;

        console.log("🔍 [INPUTS DO FORMULÁRIO]");
        console.log("→ tipoData:", tipoData);
        console.log("→ anoAtend:", anoAtend);
        console.log("→ mesAtend:", mesAtend);
        console.log("→ dataFil:", dataFil);
        console.log("→ atendTipoPessoa:", atendTipoPessoa);
        console.log("→ atendBeneficiario:", atendBeneficiario);

        let dataIni, dataFim;

        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            if (isNaN(ano) || isNaN(mes)) {
                console.log("❌ Ano ou mês inválido");
                return res.render('admin/erro', { message: "Ano ou mês inválido." });
            }
            dataIni = new Date(Date.UTC(ano, mes, 1)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999)).toISOString();

        } else if (tipoData === "Dia") {
            if (!dataFil) {
                console.log("❌ Data não informada para filtro 'Dia'");
                return res.render('admin/erro', { message: "Data não informada." });
            }
            const [ano, mes, dia] = dataFil.split('-').map(Number);
            dataIni = new Date(Date.UTC(ano, mes - 1, dia)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999)).toISOString();

        } else if (tipoData === "Semana") {
            console.log("❌ Filtro 'Semana' não implementado");
            return res.render('admin/erro', { message: "Filtro por semana ainda não implementado." });
        } else {
            console.log("❌ Tipo de filtro desconhecido:", tipoData);
            return res.render('admin/erro', { message: "Tipo de filtro inválido." });
        }

        console.log("📅 [INTERVALO DE DATAS GERADO]");
        console.log("→ dataIni (ISO):", dataIni);
        console.log("→ dataFim (ISO):", dataFim);

        // Montar critérios de busca na Agenda
        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim }
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
            console.log("👤 Aplicando filtro por beneficiário ID:", atendBeneficiario);
        }

        console.log("🔎 [QUERY FINAL PARA AGENDA]");
        console.log(agendaQuery);

        // Buscar agendas
        Agenda.find(agendaQuery)
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                // Carregar beneficiários
                return Bene.find()
                    .then((bene) => {
                        bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                        // Carregar terapeutas (usuários)
                        return Usuario.find({
                            usuario_status: "Ativo",
                            $or: [
                                { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                                { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                            ]
                        })
                        .then((terapeuta) => {
                            terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                            // Criar mapa de usuários por ID (para cadastro/edição)
                            const usuarioMap = {};
                            terapeuta.forEach(u => {
                                usuarioMap[u._id.toString()] = u.usuario_nome;
                            });

                            // Enriquecer cada agenda com dados formatados
                            agendas.forEach(a => {
                                // Formatar data e hora da agenda
                                const dataAgenda = new Date(a.agenda_data);
                                const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                                a.agenda_hora = `${hor}:${min}`;
                                a.agenda_data_dia = fncGeral.getDataFMT(dataAgenda);

                                // Evolução: Sim / Não
                                a.evolucaoSimNao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '') ? 'Sim' : 'Não';

                                // Dados de cadastro
                                a.datacad = a.agenda_datacad ? fncGeral.getDataFMT(new Date(a.agenda_datacad)) : null;
                                a.usuarioCadNome = usuarioMap[a.agenda_usucad] || 'Desconhecido';

                                // Dados de edição
                                a.dataedi = a.agenda_dataedi ? fncGeral.getDataFMT(new Date(a.agenda_dataedi)) : null;
                                a.usuarioEdiNome = usuarioMap[a.agenda_usuedi] || 'Desconhecido';

                                // Data da senha no formato YYYY-MM-DD (para input date)
                                a.agenda_datasenha_input = a.agenda_datasenha
                                    ? new Date(a.agenda_datasenha).toISOString().split('T')[0]
                                    : '';
                            });

                            // Carregar demais dados complementares
                            return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                                .then((horaage) => {
                                    return Sala.find()
                                        .then((salas) => {
                                            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                                            return Terapia.find()
                                                .then((terapias) => {
                                                    return Conv.find()
                                                        .then((convs) => {
                                                            convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                                            return Ano.find()
                                                                .then((anos) => {
                                                                    // ✅ Renderizar view com todos os dados
                                                                    console.log("📤 [RENDERIZANDO VIEW]");
                                                                    console.log("→ extras.length:", agendas.length);
                                                                    console.log("→ benes.length:", bene.length);
                                                                    console.log("→ terapeutas.length:", terapeuta.length);

                                                                    res.render('guia/guiaLis', {
                                                                        extras: agendas,
                                                                        benes: bene,
                                                                        terapeutas: terapeuta,
                                                                        horaages: horaage,
                                                                        salas: salas,
                                                                        terapias: terapias,
                                                                        convs: convs,
                                                                        anos: anos,
                                                                        flash,

                                                                        filtroTipo: tipoData,
                                                                        filtroAno: anoAtend,
                                                                        filtroMes: mesAtend,
                                                                        filtroData: dataFil,
                                                                        filtroTipoPessoa: atendTipoPessoa,
                                                                        filtroBeneficiario: atendBeneficiario
                                                                    });
                                                                });
                                                        });
                                                });
                                        });
                                });
                        });
                    });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    listaGuia(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        let flash = new Resposta();
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }

        // Valores padrão para os filtros na primeira abertura
        const hoje = new Date();
        const anoAtual = hoje.getFullYear().toString();
        const mesAtual = hoje.getMonth().toString(); // string, como no select

        console.log("→ Carregando lista inicial de guias (sem filtro aplicado)");
        console.log("→ Filtro padrão: Ano =", anoAtual, ", Mês =", mesAtual);

        Usuario.find({
            usuario_status: "Ativo",
            $or: [
                { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        })
        .then((terapeutas) => {
            terapeutas.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

            Bene.find({ bene_status: "Ativo" })
            .then((benes) => {
                benes.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                .then((horaages) => {
                    Sala.find()
                    .then((salas) => {
                        salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                        Terapia.find()
                        .then((terapias) => {
                            Conv.find()
                            .then((convs) => {
                                convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                Ano.find()
                                .then((anos) => {
                                    // Renderiza o formulário em branco (sem agendas)
                                    res.render('guia/guiaLis', {
                                        extras: [], // ← lista vazia de agendamentos
                                        benes: benes,
                                        terapeutas: terapeutas,
                                        horaages: horaages,
                                        salas: salas,
                                        terapias: terapias,
                                        convs: convs,
                                        anos: anos,
                                        atends: [],
                                        flash,

                                        // Valores iniciais dos filtros
                                        filtroTipo: "Ano/Mes",
                                        filtroAno: anoAtual,
                                        filtroMes: mesAtual,
                                        filtroData: "",
                                        filtroTipoPessoa: "Geral",
                                        filtroBeneficiario: ""
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.error("Erro em listaGuia:", err);
            req.flash("error_message", "Houve um erro ao carregar o formulário.");
            res.redirect('/admin/erro');
        });
    },
    adicionarGuia: async (req, res, resposta) => {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        /*
        await AgendaModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_copia : req.body.agendaCopia,
                agenda_usuedi: usuarioAtual , //Usuário adm que alterou
                agenda_log: req.body.agendaLog , //Log das alterações
                agenda_dataedi : dataAtual
                }}
        ).then((res) =>{
            //console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        }).finally(()=>{
            this.filtraGuialis(req, res);
        })
        */
        try {
            const {
                agendaId,
                guia_num,
                guia_numdatacad,
                guia_senha,
                guia_senhadatacad
            } = req.body;

            const agenda = await Agenda.findById(
                agendaId,
                {
                    'agenda_guia.guia_datacad': 1,
                    'agenda_guia.guia_usuedi': 1,
                    'agenda_guia.guia_dataedi': 1
                }
            ).lean(); // só leitura

            const agora = new Date().toISOString();
            const idUsu = String(req.cookies['idUsu']);

            const setObj = {
                'agenda_guia.guia_num': guia_num,
                'agenda_guia.guia_numdatacad': guia_numdatacad || null,
                'agenda_guia.guia_senha': guia_senha,
                'agenda_guia.guia_senhadatacad': guia_senhadatacad || null
            };

            if (!agenda || !agenda.agenda_guia?.guia_datacad) {
                setObj['agenda_guia.guia_usucad'] = idUsu;
                setObj['agenda_guia.guia_datacad'] = agora;
            } else {
                const usuediAtual = agenda.agenda_guia?.guia_usuedi || '';
                const dataediAtual = agenda.agenda_guia?.guia_dataedi || '';

                setObj['agenda_guia.guia_usuedi'] = usuediAtual ? `${usuediAtual},${idUsu}` : idUsu;
                setObj['agenda_guia.guia_dataedi'] = dataediAtual ? `${dataediAtual},${agora}` : agora;
            }

            await Agenda.updateOne(
                { _id: agendaId },
                { $set: setObj },
                { upsert: true } // 🔥 garante que não pare a operação
            );

            res.json({ ok: true });

        } catch (err) {
            console.error(err);
            res.status(500).json({ ok: false, message: 'Erro ao salvar guia' });
        }
    },
    // ============================================
// SALVAR GUIA EM MASSA - COM SEGURANÇA
// ============================================
adicionarGuiaMassa: async (req, res) => {
    let db = req.cookies['preferredDb'];
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    
    try {
        const { updates } = req.body;
        
        if (!Array.isArray(updates) || updates.length === 0) {
            return res.json({ 
                ok: false, 
                message: 'Nenhum registro para atualizar' 
            });
        }

        const agora = new Date().toISOString();
        const idUsu = String(req.cookies['idUsu']);

        const resultados = {
            atualizados: [],
            ignorados: [],
            erros: []
        };

        for (const update of updates) {
            const { agendaId, guia_num, guia_numdatacad, guia_senha, guia_senhadatacad } = update;

            try {
                // ✅ BUSCAR AGENDA ATUAL PARA VERIFICAR DADOS EXISTENTES
                const agenda = await Agenda.findById(agendaId).lean();

                if (!agenda) {
                    resultados.erros.push({
                        agendaId,
                        motivo: 'Agenda não encontrada'
                    });
                    continue;
                }

                const guiaAtual = agenda.agenda_guia || {};
                
                // ✅ VERIFICAR SE JÁ EXISTEM DADOS NOS CAMPOS
                const camposComDados = [];
                const camposParaAtualizar = {};

                // Verificar Guia Número
                if (guia_num && guia_num.trim() !== '') {
                    if (guiaAtual.guia_num && guiaAtual.guia_num.trim() !== '') {
                        camposComDados.push('guia_num');
                    } else {
                        camposParaAtualizar['agenda_guia.guia_num'] = guia_num;
                    }
                }

                // Verificar Data Guia
                if (guia_numdatacad) {
                    if (guiaAtual.guia_numdatacad) {
                        camposComDados.push('guia_numdatacad');
                    } else {
                        camposParaAtualizar['agenda_guia.guia_numdatacad'] = guia_numdatacad;
                    }
                }

                // Verificar Senha
                if (guia_senha && guia_senha.trim() !== '') {
                    if (guiaAtual.guia_senha && guiaAtual.guia_senha.trim() !== '') {
                        camposComDados.push('guia_senha');
                    } else {
                        camposParaAtualizar['agenda_guia.guia_senha'] = guia_senha;
                    }
                }

                // Verificar Data Senha
                if (guia_senhadatacad) {
                    if (guiaAtual.guia_senhadatacad) {
                        camposComDados.push('guia_senhadatacad');
                    } else {
                        camposParaAtualizar['agenda_guia.guia_senhadatacad'] = guia_senhadatacad;
                    }
                }

                // ✅ SE HOUVER CAMPOS COM DADOS EXISTENTES, IGNORAR ESTE REGISTRO
                if (camposComDados.length > 0) {
                    resultados.ignorados.push({
                        agendaId,
                        camposComDados,
                        dadosExistentes: {
                            guia_num: guiaAtual.guia_num,
                            guia_numdatacad: guiaAtual.guia_numdatacad,
                            guia_senha: guiaAtual.guia_senha,
                            guia_senhadatacad: guiaAtual.guia_senhadatacad
                        }
                    });
                    continue;
                }

                // ✅ SE NÃO HOUVER DADOS EXISTENTES, PROSSEGUIR COM A ATUALIZAÇÃO
                if (Object.keys(camposParaAtualizar).length > 0) {
                    // Verificar se é primeiro cadastro ou edição
                    const setObj = { ...camposParaAtualizar };

                    if (!guiaAtual.guia_datacad) {
                        // Primeiro cadastro
                        setObj['agenda_guia.guia_usucad'] = idUsu;
                        setObj['agenda_guia.guia_datacad'] = agora;
                    } else {
                        // Edição - adicionar ao log
                        const usuediAtual = guiaAtual.guia_usuedi || '';
                        const dataediAtual = guiaAtual.guia_dataedi || '';

                        setObj['agenda_guia.guia_usuedi'] = usuediAtual ? `${usuediAtual},${idUsu}` : idUsu;
                        setObj['agenda_guia.guia_dataedi'] = dataediAtual ? `${dataediAtual},${agora}` : agora;
                    }

                    await Agenda.updateOne(
                        { _id: agendaId },
                        { $set: setObj }
                    );

                    resultados.atualizados.push({
                        agendaId,
                        camposAtualizados: Object.keys(camposParaAtualizar)
                    });
                }

            } catch (err) {
                console.error(`[ERRO ao processar agenda ${agendaId}]`, err);
                resultados.erros.push({
                    agendaId,
                    motivo: err.message || 'Erro desconhecido'
                });
            }
        }

        // ✅ RETORNAR RESULTADOS DETALHADOS
        return res.json({
            ok: true,
            count: resultados.atualizados.length,
            atualizados: resultados.atualizados,
            ignorados: resultados.ignorados,
            erros: resultados.erros,
            resumo: {
                total: updates.length,
                atualizados: resultados.atualizados.length,
                ignorados: resultados.ignorados.length,
                erros: resultados.erros.length
            }
        });

    } catch (err) {
        console.error('[ERRO adicionarGuiaMassa]', err);
        return res.status(500).json({ 
            ok: false, 
            message: 'Erro ao processar atualização em massa',
            error: err.message 
        });
    }
},

}