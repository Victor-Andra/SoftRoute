//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');

// ✅ IMPORTAÇÃO ADICIONADA - CRÍTICO PARA FUNCIONAR
const guialoteClass = require("../models/guialote")

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

    // ============================================
    // FILTRAR LISTA DE AGENDAMENTOS PARA LOTE
    // ============================================
    filtraGuialotelis_OLD_Velho(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        
        // ✅ Models com classes corretas (horaageClass, não horaClass!)
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema); // ✅ CORRETO
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema); // ✅ Não esquecer

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body (NÃO ALTERAR NOMES)
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;

        const filtroTela = {
            tipoData: req.body.tipoData || "Ano/Mes",
            // ✅ Corrige a prioridade dos campos de data
            dataFinal: req.body.dataFinal || "",
            dataFil: req.body.dataFil || "",
            anoAtend: req.body.anoAtend || "",
            mesAtend: req.body.mesAtend || "",
            tipoPessoa: req.body.atendTipoPessoa || "Geral",
            atendTerapeuta: req.body.atendTerapeuta || "",
            atendBeneficiario: req.body.atendBeneficiario || "",
            // ✅ Verifica se o campo existe na view antes de usar
            atendConcluido: req.body.AtendConcluido || "Todos", 
            atendSelo: req.body.atendSelo || "Todos"
        };

        let dataIni, dataFim;
                console.log(filtroTela.dataFinal);

        switch (filtroTela.tipoData){
            case "Ano/Mes":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(filtroTela.anoAtend, filtroTela.mesAtend));

                break;
            case "Semana":
                ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(filtroTela.dataFinal));
                
                break;
            case "Dia":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(filtroTela.dataFinal));

                break;
            default:
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia('2000-01-01'));
                break;
        }

        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim }
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
        }

        if (atendTipoPessoa === "Terapeuta" && filtroTela.atendTerapeuta) {
            agendaQuery.agenda_usuid = filtroTela.atendTerapeuta;
        }

        // ✅ QUERY PRINCIPAL COM POPULATE ANINHADO CORRETO (encadeado com .then)
        Agenda.find(agendaQuery)
            .populate({
                path: 'agenda_loteid',
                // ✅ TODOS OS CAMPOS DO SCHEMA - nenhum faltando:
                select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                strictPopulate: false,
                // ✅ POPULATE ANINHADO PARA BUSCAR usuario_nome (não ObjectId):
                populate: [
                    {
                        path: 'guialote_usucad',
                        model: Usuario,
                        select: 'usuario_nome'
                    },
                    {
                        path: 'guialote_usuedi',
                        model: Usuario,
                        select: 'usuario_nome'
                    }
                ]
            })
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                
                // ✅ CÁLCULO DAS ESTATÍSTICAS COM MÉTRICAS DE LOTE - NOVO!
                const estatisticas = {
                    qa: 0,    // Total de Agendamentos
                    qt: 0,    // Atendimentos Válidos
                    qac: 0,   // Cancelados
                    qtv: 0,   // Validados (c/ evolução)
                    qtse: 0,  // Sem Evolução
                    qace: 0,  // Cancelados c/ Evolução
                    atvo: 0,  // Órfãos de Guia/Senha
                    qtva: 0,  // Completos (Guia + Senha)
                    qtvL: 0,  // Com Lote vinculado ✅ NOVO
                    qtvLo: 0  // Órfãos de Lote ✅ NOVO
                };

                agendas.forEach(a => {
                    estatisticas.qa++;
                    
                    const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                    const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                    const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                    const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                    const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                    
                    if (ehCancelado) {
                        estatisticas.qac++;
                        if (temEvolucao) estatisticas.qace++;
                    } else {
                        estatisticas.qt++;
                        if (temEvolucao) {
                            estatisticas.qtv++;
                            
                            // Verificar status de guia/senha
                            if (!temGuia || !temSenha) {
                                estatisticas.atvo++; // Órfão de guia/senha
                            } else {
                                estatisticas.qtva++; // Completo com guia+senha
                                
                                // ✅ NOVAS MÉTRICAS DE LOTE
                                if (temLote) {
                                    estatisticas.qtvL++; // Com lote vinculado
                                } else {
                                    estatisticas.qtvLo++; // Órfão de lote (tem guia+senha mas sem lote)
                                }
                            }
                        } else {
                            estatisticas.qtse++; // Sem evolução
                        }
                    }
                });

                // ✅ DEBUG DAS ESTATÍSTICAS COM LOTES
                console.log("📊 [ESTATÍSTICAS CALCULADAS COM LOTES]");
                console.log("→ QA (Total):", estatisticas.qa);
                console.log("→ QT (Válidos):", estatisticas.qt);
                console.log("→ QAC (Cancelados):", estatisticas.qac);
                console.log("→ QTV (Validados):", estatisticas.qtv);
                console.log("→ QTSE (Sem Evolução):", estatisticas.qtse);
                console.log("→ QACE (Cancel c/ Evol):", estatisticas.qace);
                console.log("→ ATVO (Órfãos Guia/Senha):", estatisticas.atvo);
                console.log("→ QTVA (Completos Guia+Senha):", estatisticas.qtva);
                console.log("→ QTVL (Com Lote):", estatisticas.qtvL);      // ✅ NOVO
                console.log("→ QTVLO (Órfãos de Lote):", estatisticas.qtvLo); // ✅ NOVO

                return Bene.find().then((bene) => {
                    bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                    return Usuario.find({
                        usuario_status: "Ativo",
                        $or: [
                            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).then((terapeuta) => {
                        terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                        // Mapa para fallback caso populate falhe
                        const usuarioMap = {};
                        terapeuta.forEach(u => {
                            usuarioMap[u._id.toString()] = u.usuario_nome;
                        });

                        // Enriquecer cada agenda
                        agendas.forEach(a => {
                            const dataAgenda = new Date(a.agenda_data);
                            const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                            const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                            a.agenda_hora = `${hor}:${min}`;
                            a.agenda_data_dia = fncGeral.getDataFMT(dataAgenda);
                            a.evolucaoSimNao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '') ? 'Sim' : 'Não';
                            a.datacad = a.agenda_datacad ? fncGeral.getDataFMT(new Date(a.agenda_datacad)) : null;
                            a.usuarioCadNome = usuarioMap[a.agenda_usucad] || 'Desconhecido';
                            a.dataedi = a.agenda_dataedi ? fncGeral.getDataFMT(new Date(a.agenda_dataedi)) : null;
                            a.usuarioEdiNome = usuarioMap[a.agenda_usuedi] || 'Desconhecido';

                            const temGuia = a.agenda_guia && a.agenda_guia.guia_num && a.agenda_guia.guia_num.trim() !== '';
                            const temSenha = a.agenda_guia && a.agenda_guia.guia_senha && a.agenda_guia.guia_senha.trim() !== '';
                            const jaTemLote = a.agenda_loteid != null && a.agenda_loteid != undefined;
                            
                            a.podeLotear = (temGuia && temSenha && !jaTemLote);
                            a.jaTemLote = jaTemLote;

                            // ✅ EXTRAÇÃO COM TODOS OS CAMPOS + NOMES DOS USUÁRIOS
                            if (a.agenda_loteid && typeof a.agenda_loteid === 'object' && a.agenda_loteid._id) {
                                // Helper para extrair nome do usuário (populado ou fallback)
                                const getUserName = (userField) => {
                                    if (!userField) return null;
                                    // Se foi populado, é objeto com usuario_nome
                                    if (typeof userField === 'object' && userField.usuario_nome) {
                                        return userField.usuario_nome;
                                    }
                                    // Fallback: se for ObjectId, buscar no mapa
                                    const idStr = typeof userField === 'string' ? userField : (userField._id?.toString?.() || null);
                                    return idStr ? usuarioMap[idStr] || null : null;
                                };

                                a.lote = {
                                    // ✅ Todos os campos do schema, na ordem:
                                    guialoteNum: a.agenda_loteid.guialote_num || null,
                                    guialoteNumdatacad: a.agenda_loteid.guialote_numdatacad || null,
                                    guialoteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || null,  // ✅ Protocolo
                                    guialoteDataenvio: a.agenda_loteid.guialote_dataenvio || null,       // ✅ Data envio
                                    guialoteGuialotevalor: a.agenda_loteid.guialote_guialotevalor || null,
                                    guialoteStatus: a.agenda_loteid.guialote_status || null,
                                    guialoteLog: a.agenda_loteid.guialote_log || null,                   // ✅ Log
                                    guialoteUsucad: a.agenda_loteid.guialote_usucad || null,
                                    guialoteUsucadNome: getUserName(a.agenda_loteid.guialote_usucad),   // ✅ NOME (não ID)
                                    guialoteDatacad: a.agenda_loteid.guialote_datacad || null,
                                    guialoteUsuedi: a.agenda_loteid.guialote_usuedi || null,
                                    guialoteUsuediNome: getUserName(a.agenda_loteid.guialote_usuedi),   // ✅ NOME (não ID)
                                    guialoteDataedi: a.agenda_loteid.guialote_dataedi || null,           // ✅ Data edição
                                    guialoteQtatend: a.agenda_loteid.guialote_qtatend || null,
                                    guialoteAgendas: a.agenda_loteid.guialote_agendas || []
                                };
                            } else {
                                a.lote = null;
                            }

                            a.agenda_guia_numdatacad_input = a.agenda_guia?.guia_numdatacad
                                ? new Date(a.agenda_guia.guia_numdatacad).toISOString().split('T')[0] : '';
                            a.agenda_guia_senhadatacad_input = a.agenda_guia?.guia_senhadatacad
                                ? new Date(a.agenda_guia.guia_senhadatacad).toISOString().split('T')[0] : '';
                        });

                        // ✅ LOG DE DEBUG COM NOMES DOS USUÁRIOS
                        if (agendas.length > 0) {
                            const primeiraAgendaComLote = agendas.find(a => a.lote !== null);
                            if (primeiraAgendaComLote) {
                                console.log("🔍 [DEBUG] Campos do lote enviados para a view:");
                                console.log("→ guialoteNum:", primeiraAgendaComLote.lote.guialoteNum);
                                console.log("→ guialoteNumprotocolo:", primeiraAgendaComLote.lote.guialoteNumprotocolo);
                                console.log("→ guialoteDataenvio:", primeiraAgendaComLote.lote.guialoteDataenvio);
                                console.log("→ guialoteGuialotevalor:", primeiraAgendaComLote.lote.guialoteGuialotevalor);
                                console.log("→ guialoteStatus:", primeiraAgendaComLote.lote.guialoteStatus);
                                console.log("→ guialoteUsucadNome:", primeiraAgendaComLote.lote.guialoteUsucadNome); // ✅ NOME
                                console.log("→ guialoteUsuediNome:", primeiraAgendaComLote.lote.guialoteUsuediNome); // ✅ NOME
                                console.log("→ guialoteDataedi:", primeiraAgendaComLote.lote.guialoteDataedi);
                                console.log("→ guialoteQtatend:", primeiraAgendaComLote.lote.guialoteQtatend);
                            } else {
                                console.log("⚠️ [DEBUG] Nenhuma agenda com lote encontrado nesta lista");
                            }
                        }

                        // ✅ CHAIN CORRETA - sem código solto!
                        return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                            .then((horaage) => Sala.find().then((salas) => {
                                salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                                return Terapia.find().then((terapias) => Conv.find().then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                    return Ano.find().then((anos) => {
                                        console.log("📤 [RENDERIZANDO VIEW]");
                                        
                                        // ✅ RENDER COM NOMES EXATOS (não alterar!)
                                        res.render('guia/lote/guialoteLis', {
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
                                        filtroBeneficiario: atendBeneficiario,
                                        // ✅ ADICIONAR ESTATÍSTICAS NO RENDER
                                        estatisticas: estatisticas,
                                        filtroTela: filtroTela
                                        });
                                    });
                                }));
                            }));
                    });
                });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialotelis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    filtraGuialotelis_OLD_ComConv(req, res, resposta) {
        console.log("🚨🚨🚨 ENTROU NA FUNÇÃO filtraGuialotelis 🚨🚨🚨");
        console.log("📦 req.body completo:", req.body);
        
        let db = req.cookies['preferredDb'];
        
        // ✅ Models com classes corretas (horaageClass, não horaClass!)
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema); // ✅ CORRETO
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema); // ✅ Não esquecer

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body (NÃO ALTERAR NOMES)
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;
        const atendTerapeuta = req.body.atendTerapeuta;  // ✅ ADICIONADO
        const atendConvenio = req.body.atendConvenio;    // ✅ ADICIONADO

        // ✅ LOGS DE DEBUG
        console.log("🔍 [DADOS RECEBIDOS DO FORMULÁRIO]");
        console.log("→ atendTipoPessoa:", atendTipoPessoa);
        console.log("→ atendBeneficiario:", atendBeneficiario);
        console.log("→ atendTerapeuta:", atendTerapeuta);
        console.log("→ atendConvenio:", atendConvenio);
        console.log("→ Tipo de atendTipoPessoa:", typeof atendTipoPessoa);
        console.log("→ atendTipoPessoa === 'Convênio':", atendTipoPessoa === "Convênio");

        const filtroTela = {
            tipoData: req.body.tipoData || "Ano/Mes",
            // ✅ Corrige a prioridade dos campos de data
            dataFinal: req.body.dataFinal || "",
            dataFil: req.body.dataFil || "",
            anoAtend: req.body.anoAtend || "",
            mesAtend: req.body.mesAtend || "",
            tipoPessoa: req.body.atendTipoPessoa || "Geral",
            atendTerapeuta: req.body.atendTerapeuta || "",
            atendBeneficiario: req.body.atendBeneficiario || "",
            atendConvenio: req.body.atendConvenio || "",  // ✅ ADICIONADO
            // ✅ Verifica se o campo existe na view antes de usar
            atendConcluido: req.body.AtendConcluido || "Todos", 
            atendSelo: req.body.atendSelo || "Todos"
        };

        let dataIni, dataFim;
        console.log(filtroTela.dataFinal);

        switch (filtroTela.tipoData){
            case "Ano/Mes":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(filtroTela.anoAtend, filtroTela.mesAtend));
                break;
            case "Semana":
                ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(filtroTela.dataFinal));
                break;
            case "Dia":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(filtroTela.dataFinal));
                break;
            default:
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia('2000-01-01'));
                break;
        }

        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim }
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
            console.log("👤 Aplicando filtro por beneficiário ID:", atendBeneficiario);
        }
        else if (atendTipoPessoa === "Terapeuta" && atendTerapeuta) {  // ✅ CORRIGIDO
            agendaQuery.agenda_usuid = atendTerapeuta;
            console.log("👨‍⚕️ Aplicando filtro por terapeuta ID:", atendTerapeuta);
        }
        else if (atendTipoPessoa === "Convênio" && atendConvenio) {  // ✅ ADICIONADO
            agendaQuery.agenda_convid = atendConvenio;
            console.log("🏥 Aplicando filtro por convênio ID:", atendConvenio);
        }

        console.log("🔎 [QUERY FINAL PARA AGENDA]");
        console.log("→ agendaQuery:", JSON.stringify(agendaQuery, null, 2));

        // ✅ QUERY PRINCIPAL COM POPULATE ANINHADO CORRETO (encadeado com .then)
        Agenda.find(agendaQuery)
            .populate({
                path: 'agenda_loteid',
                // ✅ TODOS OS CAMPOS DO SCHEMA - nenhum faltando:
                select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                strictPopulate: false,
                // ✅ POPULATE ANINHADO PARA BUSCAR usuario_nome (não ObjectId):
                populate: [
                    {
                        path: 'guialote_usucad',
                        model: Usuario,
                        select: 'usuario_nome'
                    },
                    {
                        path: 'guialote_usuedi',
                        model: Usuario,
                        select: 'usuario_nome'
                    }
                ]
            })
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                
                // ✅ CÁLCULO DAS ESTATÍSTICAS COM MÉTRICAS DE LOTE - NOVO!
                const estatisticas = {
                    qa: 0,    // Total de Agendamentos
                    qt: 0,    // Atendimentos Válidos
                    qac: 0,   // Cancelados
                    qtv: 0,   // Validados (c/ evolução)
                    qtse: 0,  // Sem Evolução
                    qace: 0,  // Cancelados c/ Evolução
                    atvo: 0,  // Órfãos de Guia/Senha
                    qtva: 0,  // Completos (Guia + Senha)
                    qtvL: 0,  // Com Lote vinculado ✅ NOVO
                    qtvLo: 0  // Órfãos de Lote ✅ NOVO
                };

                agendas.forEach(a => {
                    estatisticas.qa++;
                    
                    const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                    const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                    const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                    const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                    const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                    
                    if (ehCancelado) {
                        estatisticas.qac++;
                        if (temEvolucao) estatisticas.qace++;
                    } else {
                        estatisticas.qt++;
                        if (temEvolucao) {
                            estatisticas.qtv++;
                            
                            // Verificar status de guia/senha
                            if (!temGuia || !temSenha) {
                                estatisticas.atvo++; // Órfão de guia/senha
                            } else {
                                estatisticas.qtva++; // Completo com guia+senha
                                
                                // ✅ NOVAS MÉTRICAS DE LOTE
                                if (temLote) {
                                    estatisticas.qtvL++; // Com lote vinculado
                                } else {
                                    estatisticas.qtvLo++; // Órfão de lote (tem guia+senha mas sem lote)
                                }
                            }
                        } else {
                            estatisticas.qtse++; // Sem evolução
                        }
                    }
                });

                // ✅ DEBUG DAS ESTATÍSTICAS COM LOTES
                console.log("📊 [ESTATÍSTICAS CALCULADAS COM LOTES]");
                console.log("→ QA (Total):", estatisticas.qa);
                console.log("→ QT (Válidos):", estatisticas.qt);
                console.log("→ QAC (Cancelados):", estatisticas.qac);
                console.log("→ QTV (Validados):", estatisticas.qtv);
                console.log("→ QTSE (Sem Evolução):", estatisticas.qtse);
                console.log("→ QACE (Cancel c/ Evol):", estatisticas.qace);
                console.log("→ ATVO (Órfãos Guia/Senha):", estatisticas.atvo);
                console.log("→ QTVA (Completos Guia+Senha):", estatisticas.qtva);
                console.log("→ QTVL (Com Lote):", estatisticas.qtvL);      // ✅ NOVO
                console.log("→ QTVLO (Órfãos de Lote):", estatisticas.qtvLo); // ✅ NOVO

                return Bene.find().then((bene) => {
                    bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                    return Usuario.find({
                        usuario_status: "Ativo",
                        $or: [
                            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).then((terapeuta) => {
                        terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                        // Mapa para fallback caso populate falhe
                        const usuarioMap = {};
                        terapeuta.forEach(u => {
                            usuarioMap[u._id.toString()] = u.usuario_nome;
                        });

                        // Enriquecer cada agenda
                        agendas.forEach(a => {
                            const dataAgenda = new Date(a.agenda_data);
                            const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                            const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                            a.agenda_hora = `${hor}:${min}`;
                            a.agenda_data_dia = fncGeral.getDataFMT(dataAgenda);
                            a.evolucaoSimNao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '') ? 'Sim' : 'Não';
                            a.datacad = a.agenda_datacad ? fncGeral.getDataFMT(new Date(a.agenda_datacad)) : null;
                            a.usuarioCadNome = usuarioMap[a.agenda_usucad] || 'Desconhecido';
                            a.dataedi = a.agenda_dataedi ? fncGeral.getDataFMT(new Date(a.agenda_dataedi)) : null;
                            a.usuarioEdiNome = usuarioMap[a.agenda_usuedi] || 'Desconhecido';

                            const temGuia = a.agenda_guia && a.agenda_guia.guia_num && a.agenda_guia.guia_num.trim() !== '';
                            const temSenha = a.agenda_guia && a.agenda_guia.guia_senha && a.agenda_guia.guia_senha.trim() !== '';
                            const jaTemLote = a.agenda_loteid != null && a.agenda_loteid != undefined;
                            
                            a.podeLotear = (temGuia && temSenha && !jaTemLote);
                            a.jaTemLote = jaTemLote;

                            // ✅ EXTRAÇÃO COM TODOS OS CAMPOS + NOMES DOS USUÁRIOS
                            if (a.agenda_loteid && typeof a.agenda_loteid === 'object' && a.agenda_loteid._id) {
                                // Helper para extrair nome do usuário (populado ou fallback)
                                const getUserName = (userField) => {
                                    if (!userField) return null;
                                    // Se foi populado, é objeto com usuario_nome
                                    if (typeof userField === 'object' && userField.usuario_nome) {
                                        return userField.usuario_nome;
                                    }
                                    // Fallback: se for ObjectId, buscar no mapa
                                    const idStr = typeof userField === 'string' ? userField : (userField._id?.toString?.() || null);
                                    return idStr ? usuarioMap[idStr] || null : null;
                                };

                                a.lote = {
                                    // ✅ Todos os campos do schema, na ordem:
                                    guialoteNum: a.agenda_loteid.guialote_num || null,
                                    guialoteNumdatacad: a.agenda_loteid.guialote_numdatacad || null,
                                    guialoteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || null,  // ✅ Protocolo
                                    guialoteDataenvio: a.agenda_loteid.guialote_dataenvio || null,       // ✅ Data envio
                                    guialoteGuialotevalor: a.agenda_loteid.guialote_guialotevalor || null,
                                    guialoteStatus: a.agenda_loteid.guialote_status || null,
                                    guialoteLog: a.agenda_loteid.guialote_log || null,                   // ✅ Log
                                    guialoteUsucad: a.agenda_loteid.guialote_usucad || null,
                                    guialoteUsucadNome: getUserName(a.agenda_loteid.guialote_usucad),   // ✅ NOME (não ID)
                                    guialoteDatacad: a.agenda_loteid.guialote_datacad || null,
                                    guialoteUsuedi: a.agenda_loteid.guialote_usuedi || null,
                                    guialoteUsuediNome: getUserName(a.agenda_loteid.guialote_usuedi),   // ✅ NOME (não ID)
                                    guialoteDataedi: a.agenda_loteid.guialote_dataedi || null,           // ✅ Data edição
                                    guialoteQtatend: a.agenda_loteid.guialote_qtatend || null,
                                    guialoteAgendas: a.agenda_loteid.guialote_agendas || []
                                };
                            } else {
                                a.lote = null;
                            }

                            a.agenda_guia_numdatacad_input = a.agenda_guia?.guia_numdatacad
                                ? new Date(a.agenda_guia.guia_numdatacad).toISOString().split('T')[0] : '';
                            a.agenda_guia_senhadatacad_input = a.agenda_guia?.guia_senhadatacad
                                ? new Date(a.agenda_guia.guia_senhadatacad).toISOString().split('T')[0] : '';
                        });

                        // ✅ LOG DE DEBUG COM NOMES DOS USUÁRIOS
                        if (agendas.length > 0) {
                            const primeiraAgendaComLote = agendas.find(a => a.lote !== null);
                            if (primeiraAgendaComLote) {
                                console.log("🔍 [DEBUG] Campos do lote enviados para a view:");
                                console.log("→ guialoteNum:", primeiraAgendaComLote.lote.guialoteNum);
                                console.log("→ guialoteNumprotocolo:", primeiraAgendaComLote.lote.guialoteNumprotocolo);
                                console.log("→ guialoteDataenvio:", primeiraAgendaComLote.lote.guialoteDataenvio);
                                console.log("→ guialoteGuialotevalor:", primeiraAgendaComLote.lote.guialoteGuialotevalor);
                                console.log("→ guialoteStatus:", primeiraAgendaComLote.lote.guialoteStatus);
                                console.log("→ guialoteUsucadNome:", primeiraAgendaComLote.lote.guialoteUsucadNome); // ✅ NOME
                                console.log("→ guialoteUsuediNome:", primeiraAgendaComLote.lote.guialoteUsuediNome); // ✅ NOME
                                console.log("→ guialoteDataedi:", primeiraAgendaComLote.lote.guialoteDataedi);
                                console.log("→ guialoteQtatend:", primeiraAgendaComLote.lote.guialoteQtatend);
                            } else {
                                console.log("⚠️ [DEBUG] Nenhuma agenda com lote encontrado nesta lista");
                            }
                        }

                        // ✅ CHAIN CORRETA - sem código solto!
                        return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                            .then((horaage) => Sala.find().then((salas) => {
                                salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                                return Terapia.find().then((terapias) => Conv.find().then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                    return Ano.find().then((anos) => {
                                        console.log("📤 [RENDERIZANDO VIEW]");
                                        
                                        // ✅ RENDER COM NOMES EXATOS (não alterar!)
                                        res.render('guia/lote/guialoteLis', {
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
                                            filtroBeneficiario: atendBeneficiario,
                                            filtroConvenio: atendConvenio,  // ✅ ADICIONADO
                                            // ✅ ADICIONAR ESTATÍSTICAS NO RENDER
                                            estatisticas: estatisticas,
                                            filtroTela: filtroTela
                                        });
                                    });
                                }));
                            }));
                    });
                });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialotelis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    filtraGuialotelis_OLD_ComConv_qtGuia(req, res, resposta) {
        console.log("🚨🚨🚨 ENTROU NA FUNÇÃO filtraGuialotelis 🚨🚨🚨");
        console.log("📦 req.body completo:", req.body);
        
        let db = req.cookies['preferredDb'];
        
        // ✅ Models com classes corretas
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;
        const atendTerapeuta = req.body.atendTerapeuta;
        const atendConvenio = req.body.atendConvenio;

        // ✅ LOGS DE DEBUG
        console.log("🔍 [DADOS RECEBIDOS DO FORMULÁRIO]");
        console.log("→ atendTipoPessoa:", atendTipoPessoa);
        console.log("→ atendBeneficiario:", atendBeneficiario);
        console.log("→ atendTerapeuta:", atendTerapeuta);
        console.log("→ atendConvenio:", atendConvenio);

        const filtroTela = {
            tipoData: req.body.tipoData || "Ano/Mes",
            dataFinal: req.body.dataFinal || "",
            dataFil: req.body.dataFil || "",
            anoAtend: req.body.anoAtend || "",
            mesAtend: req.body.mesAtend || "",
            tipoPessoa: req.body.atendTipoPessoa || "Geral",
            atendTerapeuta: req.body.atendTerapeuta || "",
            atendBeneficiario: req.body.atendBeneficiario || "",
            atendConvenio: req.body.atendConvenio || "",
            atendConcluido: req.body.AtendConcluido || "Todos", 
            atendSelo: req.body.atendSelo || "Todos"
        };

        let dataIni, dataFim;
        console.log(filtroTela.dataFinal);

        switch (filtroTela.tipoData){
            case "Ano/Mes":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(filtroTela.anoAtend, filtroTela.mesAtend));
                break;
            case "Semana":
                ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(filtroTela.dataFinal));
                break;
            case "Dia":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(filtroTela.dataFinal));
                break;
            default:
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia('2000-01-01'));
                break;
        }

        // ✅ QUERY BASE COM FILTROS (IGUAL À filtraGuialis)
        let agendaQuery = { 
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_categoria: { $nin: ["Extra", "Reuniao", "Pais", "Glosa"] }  // ✅ ADICIONADO
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
            console.log("👤 Aplicando filtro por beneficiário ID:", atendBeneficiario);
        }
        else if (atendTipoPessoa === "Terapeuta" && atendTerapeuta) {
            agendaQuery.agenda_usuid = atendTerapeuta;
            console.log("👨‍⚕️ Aplicando filtro por terapeuta ID:", atendTerapeuta);
        }
        else if (atendTipoPessoa === "Convênio" && atendConvenio) {
            agendaQuery.agenda_convid = atendConvenio;
            console.log("🏥 Aplicando filtro por convênio ID:", atendConvenio);
        }

        console.log("🔎 [QUERY FINAL PARA AGENDA]");
        console.log("→ agendaQuery:", JSON.stringify(agendaQuery, null, 2));

        // ✅ QUERY PRINCIPAL COM POPULATE ANINHADO
        Agenda.find(agendaQuery)
            .populate({
                path: 'agenda_loteid',
                select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                strictPopulate: false,
                populate: [
                    {
                        path: 'guialote_usucad',
                        model: Usuario,
                        select: 'usuario_nome'
                    },
                    {
                        path: 'guialote_usuedi',
                        model: Usuario,
                        select: 'usuario_nome'
                    }
                ]
            })
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                
                // 🔥 REGRAS DE NEGÓCIO: FILTRAGEM (IGUAL À filtraGuialis)
                
                // 1. Remover agendas temporárias
                let idsAgendasEx = [];
                agendas.forEach(e => {
                    if (e.agenda_temp) {
                        idsAgendasEx.push(e.agenda_tempId.toString());
                    }
                });
                agendas = agendas.filter(a => !idsAgendasEx.includes(a._id.toString()));
                console.log("🗑️ [FILTRO TEMPORÁRIAS] Removidas:", idsAgendasEx.length);
                
                // 2. Remover cancelados (Feriado e Falta Absoluta)
                agendas = agendas.filter(a => {
                    const cat = a.agenda_categoria;
                    return cat !== "Falta Absoluta" && cat !== "Feriado";
                });
                console.log("🗑️ [FILTRO CANCELADOS] Total após filtro:", agendas.length);

                // 📊 ESTATÍSTICAS COMPLETAS (COM NOVA MÉTRICA qtdGuias)
                const estatisticas = {
                    qa: 0,        // Total de Agendamentos
                    qt: 0,        // Atendimentos Válidos
                    qac: 0,       // Cancelados
                    qtv: 0,       // Validados (c/ evolução)
                    qtse: 0,      // Sem Evolução
                    qace: 0,      // Cancelados c/ Evolução
                    atvo: 0,      // Órfãos de Guia/Senha
                    qtva: 0,      // Completos (Guia + Senha)
                    qtvL: 0,      // Com Lote vinculado
                    qtvLo: 0,     // Órfãos de Lote
                    qtdGuias: 0   // ✅ NOVA: Quantidade de Guias Únicas
                };

                // ✅ SET PARA CONTAR GUIAS ÚNICAS
                const guiasSet = new Set();

                agendas.forEach(a => {
                    estatisticas.qa++;
                    
                    const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                    const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                    const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                    const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                    const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                    
                    // ✅ ADICIONAR GUIA AO SET (SE EXISTIR)
                    if (temGuia) {
                        guiasSet.add(a.agenda_guia?.guia_num?.trim());  // ✅ USAR OPTIONAL CHAINING
                    }
                    
                    if (ehCancelado) {
                        estatisticas.qac++;
                        if (temEvolucao) estatisticas.qace++;
                    } else {
                        estatisticas.qt++;
                        if (temEvolucao) {
                            estatisticas.qtv++;
                            
                            if (!temGuia || !temSenha) {
                                estatisticas.atvo++;
                            } else {
                                estatisticas.qtva++;
                                
                                if (temLote) {
                                    estatisticas.qtvL++;
                                } else {
                                    estatisticas.qtvLo++;
                                }
                            }
                        } else {
                            estatisticas.qtse++;
                        }
                    }
                });

                // ✅ DEFINIR QUANTIDADE DE GUIAS ÚNICAS
                estatisticas.qtdGuias = guiasSet.size;

                // ✅ DEBUG DAS ESTATÍSTICAS COM LOTES E GUIAS
                console.log("📊 [ESTATÍSTICAS CALCULADAS COM LOTES]");
                console.log("→ QA (Total):", estatisticas.qa);
                console.log("→ QT (Válidos):", estatisticas.qt);
                console.log("→ QAC (Cancelados):", estatisticas.qac);
                console.log("→ QTV (Validados):", estatisticas.qtv);
                console.log("→ QTSE (Sem Evolução):", estatisticas.qtse);
                console.log("→ QACE (Cancel c/ Evol):", estatisticas.qace);
                console.log("→ ATVO (Órfãos Guia/Senha):", estatisticas.atvo);
                console.log("→ QTVA (Completos Guia+Senha):", estatisticas.qtva);
                console.log("→ QTVL (Com Lote):", estatisticas.qtvL);
                console.log("→ QTVLO (Órfãos de Lote):", estatisticas.qtvLo);
                console.log("→ QTDGUIAS (Guias Únicas):", estatisticas.qtdGuias);  // ✅ NOVO LOG

                return Bene.find().then((bene) => {
                    bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                    return Usuario.find({
                        usuario_status: "Ativo",
                        $or: [
                            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).then((terapeuta) => {
                        terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                        const usuarioMap = {};
                        terapeuta.forEach(u => {
                            usuarioMap[u._id.toString()] = u.usuario_nome;
                        });

                        // Enriquecer cada agenda
                        agendas.forEach(a => {
                            const dataAgenda = new Date(a.agenda_data);
                            const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                            const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                            a.agenda_hora = `${hor}:${min}`;
                            a.agenda_data_dia = fncGeral.getDataFMT(dataAgenda);
                            a.evolucaoSimNao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '') ? 'Sim' : 'Não';
                            a.datacad = a.agenda_datacad ? fncGeral.getDataFMT(new Date(a.agenda_datacad)) : null;
                            a.usuarioCadNome = usuarioMap[a.agenda_usucad] || 'Desconhecido';
                            a.dataedi = a.agenda_dataedi ? fncGeral.getDataFMT(new Date(a.agenda_dataedi)) : null;
                            a.usuarioEdiNome = usuarioMap[a.agenda_usuedi] || 'Desconhecido';

                            const temGuia = a.agenda_guia && a.agenda_guia.guia_num && a.agenda_guia.guia_num.trim() !== '';
                            const temSenha = a.agenda_guia && a.agenda_guia.guia_senha && a.agenda_guia.guia_senha.trim() !== '';
                            const jaTemLote = a.agenda_loteid != null && a.agenda_loteid != undefined;
                            
                            a.podeLotear = (temGuia && temSenha && !jaTemLote);
                            a.jaTemLote = jaTemLote;

                            // ✅ EXTRAÇÃO COM TODOS OS CAMPOS + NOMES DOS USUÁRIOS
                            if (a.agenda_loteid && typeof a.agenda_loteid === 'object' && a.agenda_loteid._id) {
                                const getUserName = (userField) => {
                                    if (!userField) return null;
                                    if (typeof userField === 'object' && userField.usuario_nome) {
                                        return userField.usuario_nome;
                                    }
                                    const idStr = typeof userField === 'string' ? userField : (userField._id?.toString?.() || null);
                                    return idStr ? usuarioMap[idStr] || null : null;
                                };

                                a.lote = {
                                    guialoteNum: a.agenda_loteid.guialote_num || null,
                                    guialoteNumdatacad: a.agenda_loteid.guialote_numdatacad || null,
                                    guialoteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || null,
                                    guialoteDataenvio: a.agenda_loteid.guialote_dataenvio || null,
                                    guialoteGuialotevalor: a.agenda_loteid.guialote_guialotevalor || null,
                                    guialoteStatus: a.agenda_loteid.guialote_status || null,
                                    guialoteLog: a.agenda_loteid.guialote_log || null,
                                    guialoteUsucad: a.agenda_loteid.guialote_usucad || null,
                                    guialoteUsucadNome: getUserName(a.agenda_loteid.guialote_usucad),
                                    guialoteDatacad: a.agenda_loteid.guialote_datacad || null,
                                    guialoteUsuedi: a.agenda_loteid.guialote_usuedi || null,
                                    guialoteUsuediNome: getUserName(a.agenda_loteid.guialote_usuedi),
                                    guialoteDataedi: a.agenda_loteid.guialote_dataedi || null,
                                    guialoteQtatend: a.agenda_loteid.guialote_qtatend || null,
                                    guialoteAgendas: a.agenda_loteid.guialote_agendas || []
                                };
                            } else {
                                a.lote = null;
                            }

                            a.agenda_guia_numdatacad_input = a.agenda_guia?.guia_numdatacad
                                ? new Date(a.agenda_guia.guia_numdatacad).toISOString().split('T')[0] : '';
                            a.agenda_guia_senhadatacad_input = a.agenda_guia?.guia_senhadatacad
                                ? new Date(a.agenda_guia.guia_senhadatacad).toISOString().split('T')[0] : '';
                        });

                        // ✅ LOG DE DEBUG COM NOMES DOS USUÁRIOS
                        if (agendas.length > 0) {
                            const primeiraAgendaComLote = agendas.find(a => a.lote !== null);
                            if (primeiraAgendaComLote) {
                                console.log("🔍 [DEBUG] Campos do lote enviados para a view:");
                                console.log("→ guialoteNum:", primeiraAgendaComLote.lote.guialoteNum);
                                console.log("→ guialoteNumprotocolo:", primeiraAgendaComLote.lote.guialoteNumprotocolo);
                                console.log("→ guialoteDataenvio:", primeiraAgendaComLote.lote.guialoteDataenvio);
                                console.log("→ guialoteGuialotevalor:", primeiraAgendaComLote.lote.guialoteGuialotevalor);
                                console.log("→ guialoteStatus:", primeiraAgendaComLote.lote.guialoteStatus);
                                console.log("→ guialoteUsucadNome:", primeiraAgendaComLote.lote.guialoteUsucadNome);
                                console.log("→ guialoteUsuediNome:", primeiraAgendaComLote.lote.guialoteUsuediNome);
                                console.log("→ guialoteDataedi:", primeiraAgendaComLote.lote.guialoteDataedi);
                                console.log("→ guialoteQtatend:", primeiraAgendaComLote.lote.guialoteQtatend);
                            } else {
                                console.log("⚠️ [DEBUG] Nenhuma agenda com lote encontrado nesta lista");
                            }
                        }

                        return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                            .then((horaage) => Sala.find().then((salas) => {
                                salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                                return Terapia.find().then((terapias) => Conv.find().then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                    return Ano.find().then((anos) => {
                                        console.log("📤 [RENDERIZANDO VIEW]");
                                        
                                        res.render('guia/lote/guialoteLis', {
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
                                            filtroBeneficiario: atendBeneficiario,
                                            filtroConvenio: atendConvenio,
                                            estatisticas: estatisticas,
                                            filtroTela: filtroTela
                                        });
                                    });
                                }));
                            }));
                    });
                });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialotelis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    filtraGuialotelis(req, res, resposta) {
        console.log("🚨🚨🚨 ENTROU NA FUNÇÃO filtraGuialotelis 🚨🚨🚨");
        console.log("📦 req.body completo:", req.body);
        
        let db = req.cookies['preferredDb'];
        
        // ✅ Models com classes corretas
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;
        const atendTerapeuta = req.body.atendTerapeuta;
        const atendConvenio = req.body.atendConvenio;

        // ✅ LOGS DE DEBUG
        console.log("🔍 [DADOS RECEBIDOS DO FORMULÁRIO]");
        console.log("→ atendTipoPessoa:", atendTipoPessoa);
        console.log("→ atendBeneficiario:", atendBeneficiario);
        console.log("→ atendTerapeuta:", atendTerapeuta);
        console.log("→ atendConvenio:", atendConvenio);

        const filtroTela = {
            tipoData: req.body.tipoData || "Ano/Mes",
            dataFinal: req.body.dataFinal || "",
            dataFil: req.body.dataFil || "",
            anoAtend: req.body.anoAtend || "",
            mesAtend: req.body.mesAtend || "",
            tipoPessoa: req.body.atendTipoPessoa || "Geral",
            atendTerapeuta: req.body.atendTerapeuta || "",
            atendBeneficiario: req.body.atendBeneficiario || "",
            atendConvenio: req.body.atendConvenio || "",
            atendConcluido: req.body.AtendConcluido || "Todos", 
            atendSelo: req.body.atendSelo || "Todos"
        };

        let dataIni, dataFim;
        console.log(filtroTela.dataFinal);

        switch (filtroTela.tipoData){
            case "Ano/Mes":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(filtroTela.anoAtend, filtroTela.mesAtend));
                break;
            case "Semana":
                ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(filtroTela.dataFinal));
                break;
            case "Dia":
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(filtroTela.dataFinal));
                break;
            default:
                ({ dataIni, dataFim } = fncGeral.obterPeriodoDia('2000-01-01'));
                break;
        }

        // ✅ QUERY BASE COM FILTROS (IGUAL À filtraGuialis)
        let agendaQuery = { 
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_categoria: { $nin: ["Extra", "Reuniao", "Pais", "Glosa"] }  // ✅ ADICIONADO
        };

        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario) {
            agendaQuery.agenda_beneid = atendBeneficiario;
            console.log("👤 Aplicando filtro por beneficiário ID:", atendBeneficiario);
        }
        else if (atendTipoPessoa === "Terapeuta" && atendTerapeuta) {
            agendaQuery.agenda_usuid = atendTerapeuta;
            console.log("👨‍⚕️ Aplicando filtro por terapeuta ID:", atendTerapeuta);
        }
        else if (atendTipoPessoa === "Convênio" && atendConvenio) {
            agendaQuery.agenda_convid = atendConvenio;
            console.log("🏥 Aplicando filtro por convênio ID:", atendConvenio);
        }

        console.log("🔎 [QUERY FINAL PARA AGENDA]");
        console.log("→ agendaQuery:", JSON.stringify(agendaQuery, null, 2));

        // ✅ QUERY PRINCIPAL COM POPULATE ANINHADO
        Agenda.find(agendaQuery)
            .populate({
                path: 'agenda_loteid',
                select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                strictPopulate: false,
                populate: [
                    {
                        path: 'guialote_usucad',
                        model: Usuario,
                        select: 'usuario_nome'
                    },
                    {
                        path: 'guialote_usuedi',
                        model: Usuario,
                        select: 'usuario_nome'
                    }
                ]
            })
            .then((agendas) => {
                console.log("✅ [RESULTADO DA AGENDA]");
                console.log("→ Total de registros encontrados:", agendas.length);
                
                // 🔥 REGRAS DE NEGÓCIO: FILTRAGEM (IGUAL À filtraGuialis)
                
                // 1. Remover agendas temporárias
                let idsAgendasEx = [];
                agendas.forEach(e => {
                    if (e.agenda_temp) {
                        idsAgendasEx.push(e.agenda_tempId.toString());
                    }
                });
                agendas = agendas.filter(a => !idsAgendasEx.includes(a._id.toString()));
                console.log("🗑️ [FILTRO TEMPORÁRIAS] Removidas:", idsAgendasEx.length);
                
                // 2. Remover cancelados (Feriado e Falta Absoluta)
                agendas = agendas.filter(a => {
                    const cat = a.agenda_categoria;
                    return cat !== "Falta Absoluta" && cat !== "Feriado";
                });
                console.log("🗑️ [FILTRO CANCELADOS] Total após filtro:", agendas.length);

                // 📊 ESTATÍSTICAS COMPLETAS (COM NOVAS MÉTRICAS)
                const estatisticas = {
                    qa: 0,        // Total de Agendamentos
                    qt: 0,        // Atendimentos Válidos
                    qac: 0,       // Cancelados
                    qtv: 0,       // Validados (c/ evolução)
                    qtse: 0,      // Sem Evolução
                    qace: 0,      // Cancelados c/ Evolução
                    atvo: 0,      // Órfãos de Guia/Senha
                    qtva: 0,      // Completos (Guia + Senha)
                    qtvL: 0,      // Com Lote vinculado
                    qtvLo: 0,     // Órfãos de Lote
                    qtdGuias: 0,  // ✅ Quantidade de Guias Únicas
                    qtdLotes: 0,  // ✅ NOVO: Quantidade de Lotes Únicos
                    vlrTotalLotes: 0  // ✅ NOVO: Valor Total dos Lotes Únicos
                };

                // ✅ SET PARA CONTAR GUIAS ÚNICAS
                const guiasSet = new Set();
                
                // ✅ NOVO: SET E MAP PARA CONTAR LOTES ÚNICOS
                const lotesSet = new Set();
                const lotesValores = new Map();

                agendas.forEach(a => {
                    estatisticas.qa++;
                    
                    const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                    const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                    const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                    const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                    const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                    
                    // ✅ ADICIONAR GUIA AO SET (SE EXISTIR)
                    if (temGuia) {
                        guiasSet.add(a.agenda_guia?.guia_num?.trim());
                    }
                    
                    // ✅ NOVO: PROCESSAR LOTES ÚNICOS
                    if (temLote && a.agenda_loteid && typeof a.agenda_loteid === 'object' && a.agenda_loteid._id) {
                        const loteId = a.agenda_loteid._id.toString();
                        const loteValor = parseFloat(a.agenda_loteid.guialote_guialotevalor) || 0;
                        
                        // Adicionar ID ao Set (ignora duplicatas automaticamente)
                        lotesSet.add(loteId);
                        
                        // Armazenar valor no Map (só se ainda não existe)
                        if (!lotesValores.has(loteId)) {
                            lotesValores.set(loteId, loteValor);
                        }
                    }
                    
                    if (ehCancelado) {
                        estatisticas.qac++;
                        if (temEvolucao) estatisticas.qace++;
                    } else {
                        estatisticas.qt++;
                        if (temEvolucao) {
                            estatisticas.qtv++;
                            
                            if (!temGuia || !temSenha) {
                                estatisticas.atvo++;
                            } else {
                                estatisticas.qtva++;
                                
                                if (temLote) {
                                    estatisticas.qtvL++;
                                } else {
                                    estatisticas.qtvLo++;
                                }
                            }
                        } else {
                            estatisticas.qtse++;
                        }
                    }
                });

                // ✅ DEFINIR QUANTIDADE DE GUIAS ÚNICAS
                estatisticas.qtdGuias = guiasSet.size;
                
                // ✅ NOVO: CALCULAR QUANTIDADE E VALOR TOTAL DE LOTES ÚNICOS
                estatisticas.qtdLotes = lotesSet.size;
                estatisticas.vlrTotalLotes = 0;
                lotesValores.forEach(valor => {
                    estatisticas.vlrTotalLotes += valor;
                });

                // ✅ DEBUG DAS ESTATÍSTICAS COMPLETAS
                console.log("📊 [ESTATÍSTICAS CALCULADAS COM LOTES]");
                console.log("→ QA (Total):", estatisticas.qa);
                console.log("→ QT (Válidos):", estatisticas.qt);
                console.log("→ QAC (Cancelados):", estatisticas.qac);
                console.log("→ QTV (Validados):", estatisticas.qtv);
                console.log("→ QTSE (Sem Evolução):", estatisticas.qtse);
                console.log("→ QACE (Cancel c/ Evol):", estatisticas.qace);
                console.log("→ ATVO (Órfãos Guia/Senha):", estatisticas.atvo);
                console.log("→ QTVA (Completos Guia+Senha):", estatisticas.qtva);
                console.log("→ QTVL (Com Lote):", estatisticas.qtvL);
                console.log("→ QTVLO (Órfãos de Lote):", estatisticas.qtvLo);
                console.log("→ QTDGUIAS (Guias Únicas):", estatisticas.qtdGuias);
                console.log("→ QTDLOTES (Lotes Únicos):", estatisticas.qtdLotes);  // ✅ NOVO LOG
                console.log("→ VLRTOTALLOTES (Valor Total):", estatisticas.vlrTotalLotes);  // ✅ NOVO LOG

                return Bene.find().then((bene) => {
                    bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));

                    return Usuario.find({
                        
                        $or: [
                            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).then((terapeuta) => {
                        terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));

                        const usuarioMap = {};
                        terapeuta.forEach(u => {
                            usuarioMap[u._id.toString()] = u.usuario_nome;
                        });

                        // Enriquecer cada agenda
                        agendas.forEach(a => {
                            const dataAgenda = new Date(a.agenda_data);
                            const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                            const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                            a.agenda_hora = `${hor}:${min}`;
                            a.agenda_data_dia = fncGeral.getDataFMT(dataAgenda);
                            a.evolucaoSimNao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '') ? 'Sim' : 'Não';
                            a.datacad = a.agenda_datacad ? fncGeral.getDataFMT(new Date(a.agenda_datacad)) : null;
                            a.usuarioCadNome = usuarioMap[a.agenda_usucad] || 'Desconhecido';
                            a.dataedi = a.agenda_dataedi ? fncGeral.getDataFMT(new Date(a.agenda_dataedi)) : null;
                            a.usuarioEdiNome = usuarioMap[a.agenda_usuedi] || 'Desconhecido';

                            const temGuia = a.agenda_guia && a.agenda_guia.guia_num && a.agenda_guia.guia_num.trim() !== '';
                            const temSenha = a.agenda_guia && a.agenda_guia.guia_senha && a.agenda_guia.guia_senha.trim() !== '';
                            const jaTemLote = a.agenda_loteid != null && a.agenda_loteid != undefined;
                            
                            a.podeLotear = (temGuia && temSenha && !jaTemLote);
                            a.jaTemLote = jaTemLote;

                            // ✅ EXTRAÇÃO COM TODOS OS CAMPOS + NOMES DOS USUÁRIOS
                            if (a.agenda_loteid && typeof a.agenda_loteid === 'object' && a.agenda_loteid._id) {
                                const getUserName = (userField) => {
                                    if (!userField) return null;
                                    if (typeof userField === 'object' && userField.usuario_nome) {
                                        return userField.usuario_nome;
                                    }
                                    const idStr = typeof userField === 'string' ? userField : (userField._id?.toString?.() || null);
                                    return idStr ? usuarioMap[idStr] || null : null;
                                };

                                a.lote = {
                                    guialoteNum: a.agenda_loteid.guialote_num || null,
                                    guialoteNumdatacad: a.agenda_loteid.guialote_numdatacad || null,
                                    guialoteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || null,
                                    guialoteDataenvio: a.agenda_loteid.guialote_dataenvio || null,
                                    guialoteGuialotevalor: a.agenda_loteid.guialote_guialotevalor || null,
                                    guialoteStatus: a.agenda_loteid.guialote_status || null,
                                    guialoteLog: a.agenda_loteid.guialote_log || null,
                                    guialoteUsucad: a.agenda_loteid.guialote_usucad || null,
                                    guialoteUsucadNome: getUserName(a.agenda_loteid.guialote_usucad),
                                    guialoteDatacad: a.agenda_loteid.guialote_datacad || null,
                                    guialoteUsuedi: a.agenda_loteid.guialote_usuedi || null,
                                    guialoteUsuediNome: getUserName(a.agenda_loteid.guialote_usuedi),
                                    guialoteDataedi: a.agenda_loteid.guialote_dataedi || null,
                                    guialoteQtatend: a.agenda_loteid.guialote_qtatend || null,
                                    guialoteAgendas: a.agenda_loteid.guialote_agendas || []
                                };
                            } else {
                                a.lote = null;
                            }

                            a.agenda_guia_numdatacad_input = a.agenda_guia?.guia_numdatacad
                                ? new Date(a.agenda_guia.guia_numdatacad).toISOString().split('T')[0] : '';
                            a.agenda_guia_senhadatacad_input = a.agenda_guia?.guia_senhadatacad
                                ? new Date(a.agenda_guia.guia_senhadatacad).toISOString().split('T')[0] : '';
                        });

                        // ✅ LOG DE DEBUG COM NOMES DOS USUÁRIOS
                        if (agendas.length > 0) {
                            const primeiraAgendaComLote = agendas.find(a => a.lote !== null);
                            if (primeiraAgendaComLote) {
                                console.log("🔍 [DEBUG] Campos do lote enviados para a view:");
                                console.log("→ guialoteNum:", primeiraAgendaComLote.lote.guialoteNum);
                                console.log("→ guialoteNumprotocolo:", primeiraAgendaComLote.lote.guialoteNumprotocolo);
                                console.log("→ guialoteDataenvio:", primeiraAgendaComLote.lote.guialoteDataenvio);
                                console.log("→ guialoteGuialotevalor:", primeiraAgendaComLote.lote.guialoteGuialotevalor);
                                console.log("→ guialoteStatus:", primeiraAgendaComLote.lote.guialoteStatus);
                                console.log("→ guialoteUsucadNome:", primeiraAgendaComLote.lote.guialoteUsucadNome);
                                console.log("→ guialoteUsuediNome:", primeiraAgendaComLote.lote.guialoteUsuediNome);
                                console.log("→ guialoteDataedi:", primeiraAgendaComLote.lote.guialoteDataedi);
                                console.log("→ guialoteQtatend:", primeiraAgendaComLote.lote.guialoteQtatend);
                            } else {
                                console.log("⚠️ [DEBUG] Nenhuma agenda com lote encontrado nesta lista");
                            }
                        }

                        return Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                            .then((horaage) => Sala.find().then((salas) => {
                                salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));
                                return Terapia.find().then((terapias) => Conv.find().then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt-BR'));
                                    return Ano.find().then((anos) => {
                                        console.log("📤 [RENDERIZANDO VIEW]");
                                        
                                        res.render('guia/lote/guialoteLis', {
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
                                            filtroBeneficiario: atendBeneficiario,
                                            filtroConvenio: atendConvenio,
                                            estatisticas: estatisticas,
                                            filtroTela: filtroTela
                                        });
                                    });
                                }));
                            }));
                    });
                });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtraGuialotelis:", err);
                req.flash("error_message", "Houve um erro ao listar os agendamentos.");
                res.redirect('/admin/erro');
            });
    },
    // ============================================
    // LISTA INICIAL DE GUIALOTE (SEM FILTRO)
    // ============================================
    listaGuialote(req, res, resposta) {
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
        const mesAtual = hoje.getMonth().toString();

        console.log("→ Carregando lista inicial de guialotes (sem filtro aplicado)");
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
                                    res.render('guia/lote/guialoteLis', {
                                        extras: [],
                                        benes: benes,
                                        terapeutas: terapeutas,
                                        horaages: horaages,
                                        salas: salas,
                                        terapias: terapias,
                                        convs: convs,
                                        anos: anos,
                                        atends: [],
                                        flash,

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
            console.error("Erro em listaGuialote:", err);
            req.flash("error_message", "Houve um erro ao carregar o formulário.");
            res.redirect('/admin/erro');
        });
    },

    // ============================================
    // FILTRAR GESTÃO DOS LOTES (CORRIGIDA)
    // ============================================

    filtragestaoGuialote_OLD(req, res, resposta) {
        let db = req.cookies['preferredDb'];

        // ✅ Models locais
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;
        const atendTerapeuta = req.body.atendTerapeuta || '766f69643132333435366964';
        const atendConvenio = req.body.atendConvenio;

        let dataIni, dataFim;

        // ✅ Lógica de filtro de data
        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            if (isNaN(ano) || isNaN(mes)) {
                return res.render('admin/erro', { message: "Ano ou mês inválido." });
            }
            dataIni = new Date(Date.UTC(ano, mes, 1)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999)).toISOString();
        } else if (tipoData === "Dia") {
            if (!dataFil) {
                return res.render('admin/erro', { message: "Data não informada." });
            }
            const [ano, mes, dia] = dataFil.split('-').map(Number);
            dataIni = new Date(Date.UTC(ano, mes - 1, dia)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999)).toISOString();
        } else {
            return res.render('admin/erro', { message: "Tipo de filtro inválido." });
        }

        // ✅ Query base
        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim }
        };

        // ✅ Aplicar filtros de pessoa
        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario && atendBeneficiario !== '766f69643132333435366964') {
            agendaQuery.agenda_beneid = atendBeneficiario;
        } else if (atendTipoPessoa === "Terapeuta" && atendTerapeuta && atendTerapeuta !== '766f69643132333435366964') {
            agendaQuery.agenda_usuid = atendTerapeuta;
        } else if (atendTipoPessoa === "Convênio" && atendConvenio) {
            agendaQuery.agenda_convid = atendConvenio;
        }

        // ✅ PASSO 1: Buscar TODOS os usuários (SEM filtro de função/perfil)
        // Isso garante que TODOS os usuários estejam no mapa, incluindo desligados
        Usuario.find({})
        .then((todosUsuarios) => {
            // ✅ Criar mapa de fallback (ID → nome)
            const usuarioMap = {};
            todosUsuarios.forEach(u => {
                usuarioMap[u._id.toString()] = u.usuario_nome;
            });
            
            console.log("📋 [MAPA DE USUÁRIOS CRIADO]");
            console.log("→ Total de usuários carregados:", todosUsuarios.length);
            console.log("→ Usuários com status Ativo:", todosUsuarios.filter(u => u.usuario_status === "Ativo").length);
            console.log("→ Usuários com status Inativo:", todosUsuarios.filter(u => u.usuario_status !== "Ativo").length);

            // ✅ PASSO 2: Buscar agendas SEM populate de usuário (usa mapa depois)
            // ✅ Mantém populate apenas para lote (que precisa dos dados do lote)
            return Agenda.find(agendaQuery)
                .populate([
                    {
                        path: 'agenda_loteid',
                        select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                        strictPopulate: false,
                        populate: [
                            { path: 'guialote_usucad', model: Usuario, select: 'usuario_nome' },
                            { path: 'guialote_usuedi', model: Usuario, select: 'usuario_nome' }
                        ]
                    }
                ])
                .then((agendas) => {
                    console.log("✅ [RESULTADO DA AGENDA]");
                    console.log("→ Total de registros encontrados:", agendas.length);
                    
                    // ✅ CÁLCULO DAS ESTATÍSTICAS
                    const estatisticas = {
                        qa: 0, qt: 0, qac: 0, qtv: 0, qtse: 0, qace: 0, atvo: 0, qtva: 0, qtvL: 0, qtvLo: 0
                    };

                    agendas.forEach(a => {
                        estatisticas.qa++;
                        
                        const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                        const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                        const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                        const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                        const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                        
                        if (ehCancelado) {
                            estatisticas.qac++;
                            if (temEvolucao) estatisticas.qace++;
                        } else {
                            estatisticas.qt++;
                            if (temEvolucao) {
                                estatisticas.qtv++;
                                if (!temGuia || !temSenha) {
                                    estatisticas.atvo++;
                                } else {
                                    estatisticas.qtva++;
                                    if (temLote) estatisticas.qtvL++;
                                    else estatisticas.qtvLo++;
                                }
                            } else {
                                estatisticas.qtse++;
                            }
                        }
                    });

                    // ✅ PASSO 3: Buscar dados complementares (benes, convs, etc)
                    return Promise.all([
                        Bene.find().sort({ bene_nome: 1 }),
                        Conv.find().sort({ conv_nome: 1 }),
                        Terapia.find().sort({ terapia_nome: 1 }),
                        Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
                        Sala.find().sort({ sala_nome: 1 }),
                        Ano.find().sort({ ano_nome: -1 })
                    ])
                    .then(([benes, convs, terapias, horaages, salas, anos]) => {
                        
                        // ✅ Criar mapas de todos os dados complementares
                        const beneMap = {};
                        const convMap = {};
                        const terapiaMap = {};
                        
                        benes.forEach(b => { beneMap[b._id.toString()] = b.bene_nome; });
                        convs.forEach(c => { convMap[c._id.toString()] = c.conv_nome; });
                        terapias.forEach(t => { terapiaMap[t._id.toString()] = t.terapia_nomecid; });
                        
                        // ✅ AGRUPAR POR LOTE usando os mapas (mesmo padrão da filtraGuialis)
                        const lotesMap = {};
                        const atendimentosOrfaos = [];

                        agendas.forEach(a => {
                            const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                            const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                            const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                            const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                            const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);
                            
                            // ✅ RESOLVER NOMES USANDO OS MAPAS (mesmo padrão da filtraGuialis)
                            const nomeTerapeuta = usuarioMap[a.agenda_usuid?.toString()] || 'Terapeuta não encontrado';
                            const nomeBeneficiario = beneMap[a.agenda_beneid?.toString()] || 'Sem nome';
                            const nomeConvenio = convMap[a.agenda_convid?.toString()] || 'Sem convênio';
                            const nomeTerapia = terapiaMap[a.agenda_terapiaid?.toString()] || 'Sem terapia';
                            
                            const ehValidoParaLote = !ehCancelado && temEvolucao && temGuia && temSenha;
                            
                            if (ehValidoParaLote && temLote) {
                                const loteId = a.agenda_loteid?._id?.toString();
                                if (!loteId) return;
                                
                                if (!lotesMap[loteId]) {
                                    lotesMap[loteId] = {
                                        loteId: loteId,
                                        loteNum: a.agenda_loteid.guialote_num || '-',
                                        loteStatus: a.agenda_loteid.guialote_status || 'Aberto',
                                        loteValor: a.agenda_loteid.guialote_guialotevalor || 0,
                                        loteDataCad: a.agenda_loteid.guialote_datacad,
                                        loteUsucadNome: a.agenda_loteid.guialote_usucad?.usuario_nome || 'Desconhecido',
                                        beneNome: nomeBeneficiario,
                                        convNome: nomeConvenio,
                                        qtAtendimentos: 0,
                                        agendas: []
                                    };
                                }
                                
                                const dataAgenda = new Date(a.agenda_data);
                                const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                                
                                lotesMap[loteId].agendas.push({
                                    _id: a._id,
                                    data: fncGeral.getDataFMT(dataAgenda),
                                    hora: `${hor}:${min}`,
                                    beneNome: nomeBeneficiario,
                                    terapeutaNome: nomeTerapeuta,
                                    terapiaNome: nomeTerapia,
                                    evolucao: temEvolucao ? 'Sim' : 'Não',
                                    guia: a.agenda_guia?.guia_num || '-',
                                    senha: a.agenda_guia?.guia_senha || '-',
                                    categoria: a.agenda_categoria || '-'
                                });
                                
                                lotesMap[loteId].qtAtendimentos++;
                                
                            } else if (ehValidoParaLote && !temLote) {
                                const dataAgenda = new Date(a.agenda_data);
                                const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                                
                                atendimentosOrfaos.push({
                                    _id: a._id,
                                    data: fncGeral.getDataFMT(dataAgenda),
                                    hora: `${hor}:${min}`,
                                    beneNome: nomeBeneficiario,
                                    terapeutaNome: nomeTerapeuta,
                                    terapiaNome: nomeTerapia,
                                    evolucao: temEvolucao ? 'Sim' : 'Não',
                                    guia: a.agenda_guia?.guia_num || '-',
                                    senha: a.agenda_guia?.guia_senha || '-',
                                    categoria: a.agenda_categoria || '-'
                                });
                            }
                        });

                        const lotesConsolidados = Object.values(lotesMap).sort((a, b) => {
                            return new Date(b.loteDataCad) - new Date(a.loteDataCad);
                        });

                        const consolidado = {
                            qtAtendimentos: lotesConsolidados.reduce((total, lote) => total + lote.qtAtendimentos, 0),
                            qtLotes: lotesConsolidados.length,
                            valorTotal: lotesConsolidados.reduce((soma, l) => soma + (l.loteValor || 0), 0)
                        };

                        console.log("📤 [RENDERIZANDO VIEW DE GESTÃO DE LOTES]");
                        console.log("→ Lotes consolidados:", lotesConsolidados.length);
                        console.log("→ Atendimentos órfãos de lote:", atendimentosOrfaos.length);
                        console.log("→ Consolidado:", consolidado);
                        
                        res.render('guia/lote/guialoteGes', {
                            lotesConsolidados: lotesConsolidados,
                            atendimentosOrfaos: atendimentosOrfaos,
                            benes: benes,
                            terapeutas: todosUsuarios,  // ✅ Usa os usuários já buscados (todos)
                            horaages: horaages,
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
                            filtroBeneficiario: atendBeneficiario,
                            filtroTerapeuta: atendTerapeuta,
                            filtroConvenio: atendConvenio,
                            consolidado: {
                                qtAtendimentos: consolidado.qtAtendimentos,
                                qtLotes: consolidado.qtLotes,
                                valorTotal: fncGeral.formatarReal(Math.round(consolidado.valorTotal * 100))
                            },
                            estatisticas: estatisticas
                        });
                    });
                });
        })
        .catch((err) => {
            console.error("💥 ERRO EM filtragestaoGuialote:", err);
            req.flash("error_message", "Houve um erro ao listar os lotes.");
            res.redirect('/admin/erro');
        });
    },

    filtragestaoGuialote(req, res, resposta) {
        let db = req.cookies['preferredDb'];

        // ✅ Models locais
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);

        if (!resposta || typeof resposta !== 'object') {
            resposta = { texto: '', sucesso: false };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // ✅ Capturar filtros do body
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend;
        const dataFil = req.body.dataFil;
        const atendTipoPessoa = req.body.atendTipoPessoa || 'Geral';
        const atendBeneficiario = req.body.atendBeneficiario;
        const atendTerapeuta = req.body.atendTerapeuta || '766f69643132333435366964';
        const atendConvenio = req.body.atendConvenio;

        let dataIni, dataFim;

        // ✅ Lógica de filtro de data
        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            if (isNaN(ano) || isNaN(mes)) {
                return res.render('admin/erro', { message: "Ano ou mês inválido." });
            }
            dataIni = new Date(Date.UTC(ano, mes, 1)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999)).toISOString();
        } else if (tipoData === "Dia") {
            if (!dataFil) {
                return res.render('admin/erro', { message: "Data não informada." });
            }
            const [ano, mes, dia] = dataFil.split('-').map(Number);
            dataIni = new Date(Date.UTC(ano, mes - 1, dia)).toISOString();
            dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999)).toISOString();
        } else {
            return res.render('admin/erro', { message: "Tipo de filtro inválido." });
        }

        // ✅ QUERY BASE COM FILTROS (IGUAL À filtraGuialotelis)
        let agendaQuery = {
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_categoria: { $nin: ["Extra", "Reuniao", "Pais", "Glosa"] }
        };

        // ✅ Aplicar filtros de pessoa
        if (atendTipoPessoa === "Beneficiario" && atendBeneficiario && atendBeneficiario !== '766f69643132333435366964') {
            agendaQuery.agenda_beneid = atendBeneficiario;
        } else if (atendTipoPessoa === "Terapeuta" && atendTerapeuta && atendTerapeuta !== '766f69643132333435366964') {
            agendaQuery.agenda_usuid = atendTerapeuta;
        } else if (atendTipoPessoa === "Convênio" && atendConvenio) {
            agendaQuery.agenda_convid = atendConvenio;
        }

        // ✅ PASSO 1: Buscar TODOS os usuários
        Usuario.find({})
            .then((todosUsuarios) => {
                const usuarioMap = {};
                todosUsuarios.forEach(u => {
                    usuarioMap[u._id.toString()] = u.usuario_nome;
                });

                console.log("📋 [MAPA DE USUÁRIOS CRIADO]");
                console.log("→ Total de usuários carregados:", todosUsuarios.length);

                // ✅ PASSO 2: Buscar agendas
                return Agenda.find(agendaQuery)
                    .populate([
                        {
                            path: 'agenda_loteid',
                            select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                            strictPopulate: false,
                            populate: [
                                { path: 'guialote_usucad', model: Usuario, select: 'usuario_nome' },
                                { path: 'guialote_usuedi', model: Usuario, select: 'usuario_nome' }
                            ]
                        }
                    ])
                    .then((agendas) => {
                        console.log("✅ [RESULTADO DA AGENDA]");
                        console.log("→ Total de registros encontrados:", agendas.length);

                        // 🔥 REGRAS DE NEGÓCIO: FILTRAGEM

                        // 1. Remover agendas temporárias
                        let idsAgendasEx = [];
                        agendas.forEach(e => {
                            if (e.agenda_temp) {
                                idsAgendasEx.push(e.agenda_tempId.toString());
                            }
                        });
                        agendas = agendas.filter(a => !idsAgendasEx.includes(a._id.toString()));
                        console.log("🗑️ [FILTRO TEMPORÁRIAS] Removidas:", idsAgendasEx.length);

                        // 2. Remover cancelados (Feriado e Falta Absoluta)
                        agendas = agendas.filter(a => {
                            const cat = a.agenda_categoria;
                            return cat !== "Falta Absoluta" && cat !== "Feriado";
                        });
                        console.log("🗑️ [FILTRO CANCELADOS] Total após filtro:", agendas.length);

                        // ✅ CÁLCULO DAS ESTATÍSTICAS GLOBAIS
                        const estatisticas = {
                            qa: 0, qt: 0, qac: 0, qtv: 0, qtse: 0, qace: 0,
                            atvo: 0, qtva: 0, qtvL: 0, qtvLo: 0,
                            qtdGuias: 0
                        };

                        // ✅ Set para contar guias únicas GLOBALMENTE (APENAS COM LOTE)
                        const guiasSetGlobal = new Set();

                        // Loop 1: Estatísticas globais
                        agendas.forEach(a => {
                            estatisticas.qa++;

                            const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                            const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                            const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                            const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                            const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);

                            // ✅ CORRIGIDO: Adicionar guia ao Set global APENAS SE TIVER LOTE
                            if (temGuia && temLote) {
                                guiasSetGlobal.add(a.agenda_guia?.guia_num?.trim());
                            }

                            if (ehCancelado) {
                                estatisticas.qac++;
                                if (temEvolucao) estatisticas.qace++;
                            } else {
                                estatisticas.qt++;
                                if (temEvolucao) {
                                    estatisticas.qtv++;
                                    if (!temGuia || !temSenha) {
                                        estatisticas.atvo++;
                                    } else {
                                        estatisticas.qtva++;
                                        if (temLote) estatisticas.qtvL++;
                                        else estatisticas.qtvLo++;
                                    }
                                } else {
                                    estatisticas.qtse++;
                                }
                            }
                        });

                        // ✅ Definir total global de guias únicas (APENAS COM LOTE)
                        estatisticas.qtdGuias = guiasSetGlobal.size;

                        console.log("📊 [ESTATÍSTICAS GLOBAIS]");
                        console.log("→ QA (Total):", estatisticas.qa);
                        console.log("→ QT (Válidos):", estatisticas.qt);
                        console.log("→ QTDGUIAS (Guias Únicas COM LOTE):", estatisticas.qtdGuias);

                        // ✅ PASSO 3: Buscar dados complementares
                        return Promise.all([
                            Bene.find().sort({ bene_nome: 1 }),
                            Conv.find().sort({ conv_nome: 1 }),
                            Terapia.find().sort({ terapia_nome: 1 }),
                            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
                            Sala.find().sort({ sala_nome: 1 }),
                            Ano.find().sort({ ano_nome: -1 })
                        ])
                            .then(([benes, convs, terapias, horaages, salas, anos]) => {

                                const beneMap = {};
                                const convMap = {};
                                const terapiaMap = {};

                                benes.forEach(b => { beneMap[b._id.toString()] = b.bene_nome; });
                                convs.forEach(c => { convMap[c._id.toString()] = c.conv_nome; });
                                terapias.forEach(t => { terapiaMap[t._id.toString()] = t.terapia_nomecid; });

                                // ✅ AGRUPAR POR LOTE
                                const lotesMap = {};
                                const atendimentosOrfaos = [];

                                // Loop 2: Agrupar por lote e contar guias por lote
                                agendas.forEach(a => {
                                    const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                                    const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                                    const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                                    const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                                    const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);

                                    const nomeTerapeuta = usuarioMap[a.agenda_usuid?.toString()] || 'Terapeuta não encontrado';
                                    const nomeBeneficiario = beneMap[a.agenda_beneid?.toString()] || 'Sem nome';
                                    const nomeConvenio = convMap[a.agenda_convid?.toString()] || 'Sem convênio';
                                    const nomeTerapia = terapiaMap[a.agenda_terapiaid?.toString()] || 'Sem terapia';

                                    const ehValidoParaLote = !ehCancelado && temEvolucao && temGuia && temSenha;

                                    if (ehValidoParaLote && temLote) {
                                        const loteId = a.agenda_loteid?._id?.toString();
                                        if (!loteId) return;

                                        if (!lotesMap[loteId]) {
                                            lotesMap[loteId] = {
                                                loteId: loteId,
                                                loteNum: a.agenda_loteid.guialote_num || '-',
                                                loteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || '-',  // ✅ ADICIONE
                                                loteDataenvio: a.agenda_loteid.guialote_dataenvio || '-',         // ✅ ADICIONE
                                                loteStatus: a.agenda_loteid.guialote_status || 'Aberto',
                                                loteValor: a.agenda_loteid.guialote_guialotevalor || 0,
                                                loteDataCad: a.agenda_loteid.guialote_datacad,
                                                loteUsucadNome: a.agenda_loteid.guialote_usucad?.usuario_nome || 'Desconhecido',
                                                beneNome: nomeBeneficiario,
                                                convNome: nomeConvenio,
                                                qtAtendimentos: 0,
                                                qtGuias: 0,
                                                guiasSet: new Set(),
                                                agendas: []
                                            };
                                        }

                                        // ✅ Adicionar guia ao Set do lote (já está garantido que temGuia é true aqui)
                                        lotesMap[loteId].guiasSet.add(a.agenda_guia.guia_num.trim());

                                        const dataAgenda = new Date(a.agenda_data);
                                        const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                        const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');

                                        lotesMap[loteId].agendas.push({
                                            _id: a._id,
                                            data: fncGeral.getDataFMT(dataAgenda),
                                            hora: `${hor}:${min}`,
                                            beneNome: nomeBeneficiario,
                                            terapeutaNome: nomeTerapeuta,
                                            terapiaNome: nomeTerapia,
                                            evolucao: temEvolucao ? 'Sim' : 'Não',
                                            guia: a.agenda_guia?.guia_num || '-',
                                            senha: a.agenda_guia?.guia_senha || '-',
                                            categoria: a.agenda_categoria || '-'
                                        });

                                        lotesMap[loteId].qtAtendimentos++;

                                    } else if (ehValidoParaLote && !temLote) {
                                        const dataAgenda = new Date(a.agenda_data);
                                        const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                        const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');

                                        atendimentosOrfaos.push({
                                            _id: a._id,
                                            data: fncGeral.getDataFMT(dataAgenda),
                                            hora: `${hor}:${min}`,
                                            beneNome: nomeBeneficiario,
                                            terapeutaNome: nomeTerapeuta,
                                            terapiaNome: nomeTerapia,
                                            evolucao: temEvolucao ? 'Sim' : 'Não',
                                            guia: a.agenda_guia?.guia_num || '-',
                                            senha: a.agenda_guia?.guia_senha || '-',
                                            categoria: a.agenda_categoria || '-'
                                        });
                                    }
                                });

                                // ✅ Converter Set em qtGuias e limpar antes de enviar para view
                                Object.values(lotesMap).forEach(lote => {
                                    lote.qtGuias = lote.guiasSet.size;
                                    delete lote.guiasSet;
                                });

                                const lotesConsolidados = Object.values(lotesMap).sort((a, b) => {
                                    return new Date(b.loteDataCad) - new Date(a.loteDataCad);
                                });

                                const consolidado = {
                                    qtAtendimentos: lotesConsolidados.reduce((total, lote) => total + lote.qtAtendimentos, 0),
                                    qtLotes: lotesConsolidados.length,
                                    valorTotal: lotesConsolidados.reduce((soma, l) => soma + (l.loteValor || 0), 0)
                                };

                                console.log("📤 [RENDERIZANDO VIEW DE GESTÃO DE LOTES]");
                                console.log("→ Lotes consolidados:", lotesConsolidados.length);
                                console.log("→ Atendimentos órfãos de lote:", atendimentosOrfaos.length);
                                console.log("→ Consolidado:", consolidado);
                                console.log("→ Estatísticas globais qtdGuias:", estatisticas.qtdGuias);

                                // ✅ DEBUG: Mostrar qtGuias de cada lote
                                if (lotesConsolidados.length > 0) {
                                    console.log("🔍 [DEBUG] qtGuias por lote:");
                                    lotesConsolidados.slice(0, 3).forEach(lote => {
                                        console.log(`→ Lote ${lote.loteNum}: ${lote.qtGuias} guias`);
                                    });
                                }

                                res.render('guia/lote/guialoteGes', {
                                    lotesConsolidados: lotesConsolidados,
                                    atendimentosOrfaos: atendimentosOrfaos,
                                    benes: benes,
                                    terapeutas: todosUsuarios,
                                    horaages: horaages,
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
                                    filtroBeneficiario: atendBeneficiario,
                                    filtroTerapeuta: atendTerapeuta,
                                    filtroConvenio: atendConvenio,
                                    consolidado: {
                                        qtAtendimentos: consolidado.qtAtendimentos,
                                        qtLotes: consolidado.qtLotes,
                                        valorTotal: fncGeral.formatarReal(Math.round(consolidado.valorTotal * 100))
                                    },
                                    estatisticas: estatisticas
                                });
                            });
                    });
            })
            .catch((err) => {
                console.error("💥 ERRO EM filtragestaoGuialote:", err);
                req.flash("error_message", "Houve um erro ao listar os lotes.");
                res.redirect('/admin/erro');
            });
    },
    // ============================================
    // GESTÃO DOS LOTES 
    // ============================================
    gestaoGuialote(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        const Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);

        let flash = new Resposta();
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }

        // Valores padrão para os filtros na primeira abertura
        const hoje = new Date();
        const anoAtual = hoje.getFullYear().toString();
        const mesAtual = hoje.getMonth().toString();

        console.log("→ Carregando lista inicial de gestão de lotes (sem filtro aplicado)");
        console.log("→ Filtro padrão: Ano =", anoAtual, ", Mês =", mesAtual);

        Promise.all([
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            }).sort({ usuario_nome: 1 }),
            Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }),
            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
            Sala.find().sort({ sala_nome: 1 }),
            Terapia.find().sort({ terapia_nome: 1 }),
            Conv.find().sort({ conv_nome: 1 }),
            Ano.find().sort({ ano_nome: -1 })
        ])
        .then(([terapeutas, benes, horaages, salas, terapias, convs, anos]) => {
            // Renderiza o formulário em branco (sem lotes)
            res.render('guia/lote/guialoteGes', {
                lotesConsolidados: [],  // ✅ Array vazio de lotes consolidados
                benes: benes,
                terapeutas: terapeutas,
                horaages: horaages,
                salas: salas,
                terapias: terapias,
                convs: convs,
                anos: anos,
                flash,
                filtroTipo: "Ano/Mes",
                filtroAno: anoAtual,
                filtroMes: mesAtual,
                filtroData: "",
                filtroTipoPessoa: "Geral",
                filtroBeneficiario: "",
                consolidado: {  // ✅ Consolidado vazio
                    qtAtendimentos: 0,
                    qtLotes: 0,
                    valorTotal: "0,00"
                },
                estatisticas: {  // ✅ Estatísticas vazias
                    qa: 0, qt: 0, qac: 0, qtv: 0, qtse: 0, qace: 0, atvo: 0, qtva: 0, qtvL: 0, qtvLo: 0
                }
            });
        })
        .catch((err) => {
            console.error("Erro em guialoteCons:", err);
            req.flash("error_message", "Houve um erro ao carregar o formulário.");
            res.redirect('/admin/erro');
        });
    },

    // ============================================
    // CONSOLIDADO DOS LOTES
    // ============================================
// ============================================
// CONSOLIDADO DOS LOTES - AGRUPADO POR CONVENIO
// ============================================
filtraconsolidadoGuialote(req, res, resposta) {
    let db = req.cookies['preferredDb'];

    // Models locais
    const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
    const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
    const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
    const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);

    if (!resposta || typeof resposta !== 'object') {
        resposta = { texto: '', sucesso: false };
    }
    let flash = new Resposta();
    flash.texto = resposta.texto;
    flash.sucesso = resposta.sucesso;

    // Capturar filtros do body (APENAS DATA)
    const tipoData = req.body.tipoData;
    const anoAtend = req.body.anoAtend;
    const mesAtend = req.body.mesAtend;
    const dataFil = req.body.dataFil;

    let dataIni, dataFim;

    // Lógica de filtro de data (com SEMANA incluída)
    if (tipoData === "Ano/Mes") {
        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);
        if (isNaN(ano) || isNaN(mes)) {
            return res.render('admin/erro', { message: "Ano ou mês inválido." });
        }
        dataIni = new Date(Date.UTC(ano, mes, 1)).toISOString();
        dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999)).toISOString();
    } else if (tipoData === "Dia") {
        if (!dataFil) {
            return res.render('admin/erro', { message: "Data não informada." });
        }
        const [ano, mes, dia] = dataFil.split('-').map(Number);
        dataIni = new Date(Date.UTC(ano, mes - 1, dia)).toISOString();
        dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59, 999)).toISOString();
    } else if (tipoData === "Semana") {
        if (!dataFil) {
            return res.render('admin/erro', { message: "Data não informada." });
        }
        const [ano, mes, dia] = dataFil.split('-').map(Number);
        const dataBase = new Date(Date.UTC(ano, mes - 1, dia));
        const diaSemana = dataBase.getUTCDay(); // 0=Dom, 1=Seg...6=Sab
        const diffParaSegunda = diaSemana === 0 ? -6 : 1 - diaSemana;
        
        const segunda = new Date(dataBase);
        segunda.setUTCDate(dataBase.getUTCDate() + diffParaSegunda);
        segunda.setUTCHours(0, 0, 0, 0);
        
        const domingo = new Date(segunda);
        domingo.setUTCDate(segunda.getUTCDate() + 6);
        domingo.setUTCHours(23, 59, 59, 999);
        
        dataIni = segunda.toISOString();
        dataFim = domingo.toISOString();
    } else {
        return res.render('admin/erro', { message: "Tipo de filtro inválido." });
    }

    // QUERY BASE COM FILTROS (sem filtros de pessoa)
    let agendaQuery = {
        agenda_data: { $gte: dataIni, $lte: dataFim },
        agenda_categoria: { $nin: ["Extra", "Reuniao", "Pais", "Glosa"] }
    };

    // PASSO 1: Buscar TODOS os usuários
    Usuario.find({})
        .then((todosUsuarios) => {
            const usuarioMap = {};
            todosUsuarios.forEach(u => {
                usuarioMap[u._id.toString()] = u.usuario_nome;
            });

            console.log("[MAPA DE USUARIOS CRIADO]");
            console.log("Total de usuários carregados:", todosUsuarios.length);

            // PASSO 2: Buscar agendas
            return Agenda.find(agendaQuery)
                .populate([
                    {
                        path: 'agenda_loteid',
                        select: 'guialote_num guialote_numdatacad guialote_numprotocolo guialote_dataenvio guialote_guialotevalor guialote_status guialote_log guialote_usucad guialote_datacad guialote_usuedi guialote_dataedi guialote_qtatend guialote_agendas',
                        strictPopulate: false,
                        populate: [
                            { path: 'guialote_usucad', model: Usuario, select: 'usuario_nome' },
                            { path: 'guialote_usuedi', model: Usuario, select: 'usuario_nome' }
                        ]
                    },
                    {
                        path: 'agenda_convid',
                        select: 'conv_nome'
                    }
                ])
                .then((agendas) => {
                    console.log("[RESULTADO DA AGENDA]");
                    console.log("Total de registros encontrados:", agendas.length);

                    // REGRAS DE NEGOCIO: FILTRAGEM

                    // 1. Remover agendas temporárias
                    let idsAgendasEx = [];
                    agendas.forEach(e => {
                        if (e.agenda_temp) {
                            idsAgendasEx.push(e.agenda_tempId.toString());
                        }
                    });
                    agendas = agendas.filter(a => !idsAgendasEx.includes(a._id.toString()));
                    console.log("[FILTRO TEMPORARIAS] Removidas:", idsAgendasEx.length);

                    // 2. Remover cancelados (Feriado e Falta Absoluta)
                    agendas = agendas.filter(a => {
                        const cat = a.agenda_categoria;
                        return cat !== "Falta Absoluta" && cat !== "Feriado";
                    });
                    console.log("[FILTRO CANCELADOS] Total após filtro:", agendas.length);

                    // CALCULO DAS ESTATISTICAS GLOBAIS
                    const estatisticas = {
                        qa: 0, qt: 0, qac: 0, qtv: 0, qtse: 0, qace: 0,
                        atvo: 0, qtva: 0, qtvL: 0, qtvLo: 0,
                        qtdGuias: 0
                    };

                    // Set para contar guias únicas GLOBALMENTE (APENAS COM LOTE)
                    const guiasSetGlobal = new Set();

                    // Loop 1: Estatísticas globais
                    agendas.forEach(a => {
                        estatisticas.qa++;

                        const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                        const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                        const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                        const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                        const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);

                        // Adicionar guia ao Set global APENAS SE TIVER LOTE
                        if (temGuia && temLote) {
                            guiasSetGlobal.add(a.agenda_guia?.guia_num?.trim());
                        }

                        if (ehCancelado) {
                            estatisticas.qac++;
                            if (temEvolucao) estatisticas.qace++;
                        } else {
                            estatisticas.qt++;
                            if (temEvolucao) {
                                estatisticas.qtv++;
                                if (!temGuia || !temSenha) {
                                    estatisticas.atvo++;
                                } else {
                                    estatisticas.qtva++;
                                    if (temLote) estatisticas.qtvL++;
                                    else estatisticas.qtvLo++;
                                }
                            } else {
                                estatisticas.qtse++;
                            }
                        }
                    });

                    // Definir total global de guias únicas (APENAS COM LOTE)
                    estatisticas.qtdGuias = guiasSetGlobal.size;

                    console.log("[ESTATISTICAS GLOBAIS]");
                    console.log("QA (Total):", estatisticas.qa);
                    console.log("QT (Validos):", estatisticas.qt);
                    console.log("QTDGUIAS (Guias Unicas COM LOTE):", estatisticas.qtdGuias);

                    // PASSO 3: Buscar dados complementares
                    return Promise.all([
                        Bene.find().sort({ bene_nome: 1 }),
                        Conv.find().sort({ conv_nome: 1 }),
                        Terapia.find().sort({ terapia_nome: 1 }),
                        Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
                        Sala.find().sort({ sala_nome: 1 }),
                        Ano.find().sort({ ano_nome: -1 })
                    ])
                        .then(([benes, convs, terapias, horaages, salas, anos]) => {

                            const beneMap = {};
                            const convMap = {};
                            const terapiaMap = {};

                            benes.forEach(b => { beneMap[b._id.toString()] = b.bene_nome; });
                            convs.forEach(c => { convMap[c._id.toString()] = c.conv_nome; });
                            terapias.forEach(t => { terapiaMap[t._id.toString()] = t.terapia_nomecid; });

                            // AGRUPAR POR CONVENIO (NOVA LOGICA)
                            const conveniosMap = {};
                            const atendimentosOrfaosPorConvenio = {};

                            // Loop 2: Agrupar por convenio
                            agendas.forEach(a => {
                                const ehCancelado = (a.agenda_categoria === "Feriado" || a.agenda_categoria === "Falta Absoluta");
                                const temEvolucao = (a.agenda_evolucao && a.agenda_evolucao.trim() !== '');
                                const temGuia = (a.agenda_guia?.guia_num?.trim() !== '');
                                const temSenha = (a.agenda_guia?.guia_senha?.trim() !== '');
                                const temLote = (a.agenda_loteid != null && a.agenda_loteid != undefined);

                                const nomeTerapeuta = usuarioMap[a.agenda_usuid?.toString()] || 'Terapeuta não encontrado';
                                const nomeBeneficiario = beneMap[a.agenda_beneid?.toString()] || 'Sem nome';
                                const nomeConvenio = a.agenda_convid?.conv_nome || convMap[a.agenda_convid?.toString()] || 'Sem convenio';
                                const nomeTerapia = terapiaMap[a.agenda_terapiaid?.toString()] || 'Sem terapia';
                                const convId = a.agenda_convid?._id?.toString() || a.agenda_convid?.toString() || 'sem_convenio';

                                const ehValidoParaLote = !ehCancelado && temEvolucao && temGuia && temSenha;

                                if (ehValidoParaLote && temLote) {
                                    const loteId = a.agenda_loteid?._id?.toString();
                                    if (!loteId) return;

                                    // Inicializar convenio se não existir
                                    if (!conveniosMap[convId]) {
                                        conveniosMap[convId] = {
                                            convId: convId,
                                            convNome: nomeConvenio,
                                            qtLotes: 0,
                                            qtGuias: 0,
                                            valorTotal: 0,
                                            todosEnviados: true,
                                            guiasSet: new Set(),
                                            lotesMap: {}
                                        };
                                    }

                                    const convenio = conveniosMap[convId];

                                    // Inicializar lote se não existir no convenio
                                    if (!convenio.lotesMap[loteId]) {
                                        convenio.lotesMap[loteId] = {
                                            loteId: loteId,
                                            loteNum: a.agenda_loteid.guialote_num || '-',
                                            loteNumprotocolo: a.agenda_loteid.guialote_numprotocolo || '-',
                                            loteDataenvio: a.agenda_loteid.guialote_dataenvio || '-',
                                            loteStatus: a.agenda_loteid.guialote_status || 'Aberto',
                                            loteValor: a.agenda_loteid.guialote_guialotevalor || 0,
                                            loteDataCad: a.agenda_loteid.guialote_datacad,
                                            loteUsucadNome: a.agenda_loteid.guialote_usucad?.usuario_nome || 'Desconhecido',
                                            qtAtendimentos: 0,
                                            qtGuias: 0,
                                            guiasSet: new Set(),
                                            agendas: []
                                        };
                                        convenio.qtLotes++;
                                        convenio.valorTotal += convenio.lotesMap[loteId].loteValor || 0;
                                    }

                                    const lote = convenio.lotesMap[loteId];

                                    // Adicionar guia ao Set do lote
                                    lote.guiasSet.add(a.agenda_guia.guia_num.trim());
                                    convenio.guiasSet.add(a.agenda_guia.guia_num.trim());

                                    const dataAgenda = new Date(a.agenda_data);
                                    const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                    const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');

                                    lote.agendas.push({
                                        _id: a._id,
                                        data: fncGeral.getDataFMT(dataAgenda),
                                        hora: `${hor}:${min}`,
                                        beneNome: nomeBeneficiario,
                                        terapeutaNome: nomeTerapeuta,
                                        terapiaNome: nomeTerapia,
                                        evolucao: temEvolucao ? 'Sim' : 'Não',
                                        guia: a.agenda_guia?.guia_num || '-',
                                        senha: a.agenda_guia?.guia_senha || '-',
                                        categoria: a.agenda_categoria || '-'
                                    });

                                    lote.qtAtendimentos++;

                                } else if (ehValidoParaLote && !temLote) {
                                    // Atendimento orfao - agrupar por convenio
                                    if (!atendimentosOrfaosPorConvenio[convId]) {
                                        atendimentosOrfaosPorConvenio[convId] = {
                                            convId: convId,
                                            convNome: nomeConvenio,
                                            atendimentos: []
                                        };
                                    }

                                    const dataAgenda = new Date(a.agenda_data);
                                    const hor = dataAgenda.getUTCHours().toString().padStart(2, '0');
                                    const min = dataAgenda.getUTCMinutes().toString().padStart(2, '0');

                                    atendimentosOrfaosPorConvenio[convId].atendimentos.push({
                                        _id: a._id,
                                        data: fncGeral.getDataFMT(dataAgenda),
                                        hora: `${hor}:${min}`,
                                        beneNome: nomeBeneficiario,
                                        terapeutaNome: nomeTerapeuta,
                                        terapiaNome: nomeTerapia,
                                        evolucao: temEvolucao ? 'Sim' : 'Não',
                                        guia: a.agenda_guia?.guia_num || '-',
                                        senha: a.agenda_guia?.guia_senha || '-',
                                        categoria: a.agenda_categoria || '-'
                                    });
                                }
                            });

                            // Converter Sets em contagens e arrays, calcular todosEnviados
                            const conveniosConsolidados = Object.values(conveniosMap).map(convenio => {
                                // Converter lotesMap em array
                                const lotesArray = Object.values(convenio.lotesMap).map(lote => {
                                    lote.qtGuias = lote.guiasSet.size;
                                    delete lote.guiasSet;
                                    return lote;
                                });

                                // Calcular se todos os lotes estao enviados
                                const todosEnviados = lotesArray.every(l => l.loteStatus === "Enviado");

                                return {
                                    convId: convenio.convId,
                                    convNome: convenio.convNome,
                                    qtLotes: convenio.qtLotes,
                                    qtGuias: convenio.guiasSet.size,
                                    valorTotal: convenio.valorTotal,
                                    todosEnviados: todosEnviados,
                                    lotes: lotesArray.sort((a, b) => new Date(b.loteDataCad) - new Date(a.loteDataCad))
                                };
                            }).sort((a, b) => a.convNome.localeCompare(b.convNome)); // Ordenar por nome

                            // Processar atendimentos orfaos por convenio
                            const atendimentosOrfaos = Object.values(atendimentosOrfaosPorConvenio)
                                .sort((a, b) => a.convNome.localeCompare(b.convNome));

                            const consolidado = {
                                qtAtendimentos: conveniosConsolidados.reduce((total, conv) => 
                                    total + conv.lotes.reduce((t, l) => t + l.qtAtendimentos, 0), 0),
                                qtConvenios: conveniosConsolidados.length,
                                qtLotes: conveniosConsolidados.reduce((total, conv) => total + conv.qtLotes, 0),
                                valorTotal: conveniosConsolidados.reduce((soma, c) => soma + (c.valorTotal || 0), 0)
                            };

                            console.log("[RENDERIZANDO VIEW DE GESTAO DE LOTES POR CONVENIO]");
                            console.log("Convenios consolidados:", conveniosConsolidados.length);
                            console.log("Atendimentos orfaos de lote:", atendimentosOrfaos.length);
                            console.log("Consolidado:", consolidado);
                            console.log("Estatisticas globais qtdGuias:", estatisticas.qtdGuias);

                            res.render('guia/lote/guialoteCons', {
                                conveniosConsolidados: conveniosConsolidados,
                                atendimentosOrfaos: atendimentosOrfaos,
                                benes: benes,
                                terapeutas: todosUsuarios,
                                horaages: horaages,
                                salas: salas,
                                terapias: terapias,
                                convs: convs,
                                anos: anos,
                                flash,
                                filtroTipo: tipoData,
                                filtroAno: anoAtend,
                                filtroMes: mesAtend,
                                filtroData: dataFil,
                                consolidado: {
                                    qtAtendimentos: consolidado.qtAtendimentos,
                                    qtConvenios: consolidado.qtConvenios,
                                    qtLotes: consolidado.qtLotes,
                                    valorTotal: fncGeral.formatarReal(Math.round(consolidado.valorTotal * 100))
                                },
                                estatisticas: estatisticas
                            });
                        });
                });
        })
        .catch((err) => {
            console.error("ERRO EM filtragestaoGuialote:", err);
            req.flash("error_message", "Houve um erro ao listar os lotes.");
            res.redirect('/admin/erro');
        });
},
   
   consolidadoGuialote(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        const Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);

        let flash = new Resposta();
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }

        // Valores padrão para os filtros na primeira abertura
        const hoje = new Date();
        const anoAtual = hoje.getFullYear().toString();
        const mesAtual = hoje.getMonth().toString();

        console.log("→ Carregando lista inicial de gestão de lotes (sem filtro aplicado)");
        console.log("→ Filtro padrão: Ano =", anoAtual, ", Mês =", mesAtual);

        Promise.all([
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            }).sort({ usuario_nome: 1 }),
            Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }),
            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
            Sala.find().sort({ sala_nome: 1 }),
            Terapia.find().sort({ terapia_nome: 1 }),
            Conv.find().sort({ conv_nome: 1 }),
            Ano.find().sort({ ano_nome: -1 })
        ])
        .then(([terapeutas, benes, horaages, salas, terapias, convs, anos]) => {
            // Renderiza o formulário em branco (sem lotes)
            res.render('guia/lote/guialoteCons', {
                lotesConsolidados: [],  // ✅ Array vazio de lotes consolidados
                benes: benes,
                terapeutas: terapeutas,
                horaages: horaages,
                salas: salas,
                terapias: terapias,
                convs: convs,
                anos: anos,
                flash,
                filtroTipo: "Ano/Mes",
                filtroAno: anoAtual,
                filtroMes: mesAtual,
                filtroData: "",
                filtroTipoPessoa: "Geral",
                filtroBeneficiario: "",
                consolidado: {  // ✅ Consolidado vazio
                    qtAtendimentos: 0,
                    qtLotes: 0,
                    valorTotal: "0,00"
                },
                estatisticas: {  // ✅ Estatísticas vazias
                    qa: 0, qt: 0, qac: 0, qtv: 0, qtse: 0, qace: 0, atvo: 0, qtva: 0, qtvL: 0, qtvLo: 0
                }
            });
        })
        .catch((err) => {
            console.error("Erro em gestaoGuialote:", err);
            req.flash("error_message", "Houve um erro ao carregar o formulário.");
            res.redirect('/admin/erro');
        });
    },


    // ============================================
    // SALVAR GUIA INDIVIDUAL (TEMPO REAL)
    // ============================================
    adicionarGuialote: async (req, res, resposta) => {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        
        try {
            const {
                agendaId,
                guialote_num,
                guialote_numdatacad,
                guialote_numprotocolo, // Alguns convênios emitem protocolo quando o lote é enviado
                guialote_dataenvio, // Alguns convênios emitem protocolo quando o lote é enviado e a data sempre diferete da criação do lote no sistema deles
                guialote_guialotevalor,
                guialote_status,
                guialote_senha,
                guialote_senhadatacad
            } = req.body;

            const agenda = await Agenda.findById(agendaId).lean();

            const agora = new Date().toISOString();
            const idUsu = String(req.cookies['idUsu']);

            // ✅ CORREÇÃO: Usar agenda_guia.guia_* em vez de agenda_guialote.guialote_*
            const setObj = {
                'agenda_guia.guia_num': guialote_num,
                'agenda_guia.guia_numdatacad': guialote_numdatacad || null,
                'agenda_guia.guia_senha': guialote_senha,
                'agenda_guia.guia_senhadatacad': guialote_senhadatacad || null
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
                { upsert: true }
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
    adicionarGuialoteMassa: async (req, res) => {
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
                const { agendaId, guialote_num, guialote_numdatacad, guialote_senha, guialote_senhadatacad } = update;

                try {
                    const agenda = await Agenda.findById(agendaId).lean();

                    if (!agenda) {
                        resultados.erros.push({
                            agendaId,
                            motivo: 'Agenda não encontrada'
                        });
                        continue;
                    }

                    const guiaAtual = agenda.agenda_guia || {};
                    
                    const camposComDados = [];
                    const camposParaAtualizar = {};

                    if (guialote_num && guialote_num.trim() !== '') {
                        if (guiaAtual.guia_num && guiaAtual.guia_num.trim() !== '') {
                            camposComDados.push('guia_num');
                        } else {
                            camposParaAtualizar['agenda_guia.guia_num'] = guialote_num;
                        }
                    }

                    if (guialote_numdatacad) {
                        if (guiaAtual.guia_numdatacad) {
                            camposComDados.push('guia_numdatacad');
                        } else {
                            camposParaAtualizar['agenda_guia.guia_numdatacad'] = guialote_numdatacad;
                        }
                    }

                    if (guialote_senha && guialote_senha.trim() !== '') {
                        if (guiaAtual.guia_senha && guiaAtual.guia_senha.trim() !== '') {
                            camposComDados.push('guia_senha');
                        } else {
                            camposParaAtualizar['agenda_guia.guia_senha'] = guialote_senha;
                        }
                    }

                    if (guialote_senhadatacad) {
                        if (guiaAtual.guia_senhadatacad) {
                            camposComDados.push('guia_senhadatacad');
                        } else {
                            camposParaAtualizar['agenda_guia.guia_senhadatacad'] = guialote_senhadatacad;
                        }
                    }

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

                    if (Object.keys(camposParaAtualizar).length > 0) {
                        const setObj = { ...camposParaAtualizar };

                        if (!guiaAtual.guia_datacad) {
                            setObj['agenda_guia.guia_usucad'] = idUsu;
                            setObj['agenda_guia.guia_datacad'] = agora;
                        } else {
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
            console.error('[ERRO adicionarGuialoteMassa]', err);
            return res.status(500).json({ 
                ok: false, 
                message: 'Erro ao processar atualização em massa',
                error: err.message 
            });
        }
    },
    // ============================================
    // BUSCAR LOTE POR ID (para edição)
    // ============================================
    buscarGuialotePorId: async (req, res) => {
        let db = req.cookies['preferredDb'];
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        
        try {
            const loteId = req.params.id;
            if (!loteId) {
                return res.status(400).json({ ok: false, message: 'ID do lote não informado' });
            }
            
            const lote = await Guialote.findById(loteId)
                .populate('guialote_usucad', 'usuario_nome')
                .populate('guialote_usuedi', 'usuario_nome')
                .lean();
            
            if (!lote) {
                return res.status(404).json({ ok: false, message: 'Lote não encontrado' });
            }
            
            // ✅ Formatar para resposta JSON
            const loteFormatado = {
                _id: lote._id,
                guialote_num: lote.guialote_num,
                guialote_numdatacad: lote.guialote_numdatacad,
                guialote_numprotocolo: lote.guialote_numprotocolo,
                guialote_dataenvio: lote.guialote_dataenvio,
                guialote_guialotevalor: lote.guialote_guialotevalor,
                guialote_status: lote.guialote_status,
                guialote_log: lote.guialote_log,
                guialote_qtatend: lote.guialote_qtatend,
                guialote_usucad: lote.guialote_usucad?._id,
                guialote_usucadNome: lote.guialote_usucad?.usuario_nome || 'Desconhecido',
                guialote_datacad: lote.guialote_datacad,
                guialote_usuedi: lote.guialote_usuedi?._id,
                guialote_usuediNome: lote.guialote_usuedi?.usuario_nome || 'Nunca editado',
                guialote_dataedi: lote.guialote_dataedi
            };
            
            return res.json({ ok: true, lote: loteFormatado });
            
        } catch (err) {
            console.error('[ERRO buscarGuialotePorId]', err);
            return res.status(500).json({ ok: false, message: 'Erro ao buscar lote' });
        }
    },

    // ============================================
    // EDITAR LOTE
    // ============================================
    editarGuialote: async (req, res) => {
        let db = req.cookies['preferredDb'];
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        
        try {
            const {
                loteId,
                guialote_num,
                guialote_numdatacad,
                guialote_numprotocolo,
                guialote_dataenvio,
                guialote_guialotevalor,
                guialote_status,
                guialote_log
            } = req.body;
            
            if (!loteId) {
                return res.status(400).json({ ok: false, message: 'ID do lote não informado' });
            }
            
            const idUsu = req.cookies['idUsu'];
            const agora = new Date();
            
            // ✅ Montar objeto de atualização com todos os campos editáveis
            const update = {
                guialote_num: guialote_num || null,
                guialote_numdatacad: guialote_numdatacad ? new Date(guialote_numdatacad) : null,
                guialote_numprotocolo: guialote_numprotocolo || null,
                guialote_dataenvio: guialote_dataenvio ? new Date(guialote_dataenvio) : null,
                guialote_guialotevalor: parseFloat(guialote_guialotevalor) || 0,
                guialote_status: guialote_status || 'Aberto',
                guialote_log: guialote_log || null,
                guialote_usuedi: idUsu,
                guialote_dataedi: agora
            };
            
            // ✅ Remover campos vazios para não sobrescrever dados existentes desnecessariamente
            Object.keys(update).forEach(key => {
                if (update[key] === undefined || update[key] === '') {
                    delete update[key];
                }
            });
            
            const lote = await Guialote.findByIdAndUpdate(
                loteId,
                { $set: update },
                { new: true, runValidators: true }
            );
            
            if (!lote) {
                return res.status(404).json({ ok: false, message: 'Lote não encontrado' });
            }
            
            // ✅ Buscar nome do usuário para feedback
            const usuario = await Usuario.findById(idUsu).select('usuario_nome').lean();
            
            return res.json({ 
                ok: true, 
                message: 'Lote atualizado com sucesso',
                usuario: usuario?.usuario_nome || 'Usuário desconhecido',
                dataEdicao: agora.toLocaleString('pt-BR')
            });
            
        } catch (err) {
            console.error('[ERRO editarGuialote]', err);
            return res.status(500).json({ 
                ok: false, 
                message: 'Erro ao atualizar lote: ' + (err.message || 'Erro desconhecido') 
            });
        }
    },
    criarLote: async (req, res) => {
        console.log('[BACKEND] >>> Recebida requisição criarLote');
        
        let db = req.cookies['preferredDb'];
        
        if (!db) {
            return res.status(400).json({ ok: false, message: "Database não identificada nos cookies." });
        }
        
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Guialote = getModel(db, 'tb_guialote', guialoteClass.GuialoteSchema);
        
        try {
            // ✅ DESISTRUTURAÇÃO COM TODOS OS CAMPOS
            const { 
                listaAgendaIds, 
                guialote_valor, 
                guialote_num_externo,
                guialote_numprotocolo,    // ✅
                guialote_dataenvio,       // ✅
                guialote_status           // ✅
            } = req.body;
            
            const idUsu = req.cookies['idUsu'];
            const agora = new Date();

            if (!listaAgendaIds?.length) {
                throw new Error("Nenhum agendamento selecionado.");
            }

            // Validação
            const agendasCandidatas = await Agenda.find({ _id: { $in: listaAgendaIds } });

            const idsValidos = [];
            for (const agenda of agendasCandidatas) {
                const temGuia = agenda.agenda_guia?.guia_num?.trim();
                const temSenha = agenda.agenda_guia?.guia_senha?.trim();
                const jaTemLote = agenda.agenda_loteid != null;

                if (!temGuia || !temSenha) {
                    throw new Error(`Agenda ${agenda._id}: Falta Guia ou Senha.`);
                }
                if (jaTemLote) {
                    throw new Error(`Agenda ${agenda._id}: Já pertence a outro lote.`);
                }
                idsValidos.push(agenda._id);
            }

            // Criar Lote
            const novoLote = new Guialote({
                guialote_num: guialote_num_externo || null,
                guialote_numdatacad: guialote_num_externo ? agora : null,
                
                // ✅ CAMPOS NOVOS
                guialote_numprotocolo: guialote_numprotocolo || null,
                guialote_dataenvio: guialote_dataenvio ? new Date(guialote_dataenvio) : null,
                
                guialote_guialotevalor: guialote_valor || 0,
                guialote_qtatend: idsValidos.length,
                guialote_agendas: idsValidos,
                guialote_usucad: idUsu,
                guialote_datacad: agora,
                
                // ✅ USAR STATUS DO REQ.BODY
                guialote_status: guialote_status || 'Aberto',
                
                // ✅ EDIÇÃO (inicialmente null, será preenchido na edição)
                guialote_usuedi: null,
                guialote_dataedi: null
            });

            await novoLote.save();
            console.log(`[BACKEND] Lote salvo: ${novoLote._id}`);

            // Atualizar agendas
            await Agenda.updateMany(
                { _id: { $in: idsValidos } },
                { $set: { agenda_loteid: novoLote._id, agenda_dataedi: agora, agenda_usuedi: idUsu } }
            );

            return res.json({ 
                ok: true, 
                message: `Lote criado! ${idsValidos.length} agendamentos vinculados.`,
                loteId: novoLote._id 
            });

        } catch (err) {
            console.error("❌ [BACKEND] ERRO:", err);
            return res.status(400).json({ ok: false, message: err.message });
        }
    }
}