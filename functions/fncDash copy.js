//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classes Extrangeiras
const ObjectId = require('mongodb').ObjectId;
const usuarioClass = require("../models/usuario")
const convClass = require("../models/conv")//convenio
const beneClass = require("../models/bene")
const atendClass = require("../models/atend")
const terapiaClass = require("../models/terapia")

const anoClass = require("../models/ano");
const agendaClass = require("../models/agenda");

//Tabelas Extrangeiras
var Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Ano  = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
var Agenda  = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)



//Funções auxiliares
const fncGeral = require("../functions/fncGeral")
const Resposta = fncGeral.Resposta;

class RelObjvalor{
    constructor(
        idlocal,
        campo,
        valor,
        total
        ){
        this.idlocal = idlocal,
        this.campo = campo,
        this.valor = valor,
        this.total = total
    }
}
    
module.exports = {
    //carregaDashfinan(req,res){
    carregaDashfinan(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        // Variável para habilitar/desabilitar logs
        const habilitarConsoleLog = true;
    
        // Função auxiliar para log
        function log(message) {
            if (habilitarConsoleLog) console.log(message);
        }
    
        // Função auxiliar para formatar datas
        function formatarData(data, formato = "dd-mm-yyyy") {
            if (!data) return ""; // Retorna vazio se a data for nula ou indefinida
    
            const ano = data.slice(0, 4);
            const mes = data.slice(5, 7);
            const dia = data.slice(8, 10);
    
            if (formato === "yyyy-mm-dd") {
                return `${ano}-${mes}-${dia}`;
            } else if (formato === "dd-mm-yyyy") {
                return `${dia}-${mes}-${ano}`;
            } else {
                throw new Error("Formato de data inválido. Use 'yyyy-mm-dd' ou 'dd-mm-yyyy'.");
            }
        }
    
        // Funções auxiliares
        function calcularTotais(relatorio) {
            log("Calculando totais...");
            let sessaoTot = 0;
            let valTot = 0;
    
            relatorio.forEach((item) => {
                const valorTotal = parseInt(item.valor.toString().replace(",", "").replace(".", ""));
                item.total = mascaraValores((valorTotal * item.sessoes).toString());
                sessaoTot += item.sessoes;
                valTot += parseInt(item.total.toString().replace(",", "").replace(".", ""));
            });
    
            return { sessoes: sessaoTot, valor: mascaraValores(valTot.toString()), total: mascaraValores(valTot.toString()) };
        }
    
        function filtrarAtendimentosPorTerapia(atendimentos, terapiaId, categoria) {
            log(`Filtrando atendimentos para a terapia ID: ${terapiaId}`);
            return atendimentos.filter((atend) => {
                const terapiaAtend = obterTerapiaAtend(atend, categoria);
                return ("" + terapiaAtend) === ("" + terapiaId);
            });
        }
    
        function obterTerapiaAtend(atendimento, categoria) {
            switch (categoria) {
                case "Apoio":
                case "Extra":
                case "Falta":
                case "Glosa":
                case "Padrão":
                case "Pais":
                case "Supervisão":
                    return atendimento.atend_terapiaid;
                case "Falta Justificada":
                case "Feriado":
                case "Substituição":
                case "SubstitutoFixo":
                    return atendimento.atend_mergeterapiaid;
                default:
                    return atendimento.atend_terapiaid;
            }
        }
    
        function mascaraValores(valor) {
            return valor.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    
        // Inicialização de variáveis
        let rel = [];
        let total;
        let conv_nome = "Todos os Convênios";
        let periodoDe;
        let periodoAte;
    
        // Tratamento de datas padrão
        let seg =
            req.body.dataIni ?
            formatarData(fncGeral.getDateFromString(req.body.dataIni, "ini"), "yyyy-mm-dd") :
            formatarData(new Date().toISOString().slice(0, 10), "yyyy-mm-dd");
        let sex =
            req.body.dataFim ?
            formatarData(fncGeral.getDateFromString(req.body.dataFim, "fim"), "yyyy-mm-dd") :
            formatarData(new Date().toISOString().slice(0, 10), "yyyy-mm-dd");
    
        periodoDe = formatarData(seg, "dd-mm-yyyy"); // yyyy-mm-dd -> dd-mm-yyyy
        periodoAte = formatarData(sex, "dd-mm-yyyy"); // yyyy-mm-dd -> dd-mm-yyyy
    
        log(`Período selecionado: De ${periodoDe} até ${periodoAte}`);
    
        // Consulta principal ao banco de dados
        Atend.find({
            atend_convid: req.body.relConvid || null,
            atend_atenddata: { $gte: seg, $lte: sex },
        })
            .then((atendimentos) => {
                log(`Foram encontrados ${atendimentos.length} atendimentos no período.`);
    
                // Filtra atendimentos excluindo categorias "Feriado"
                const atendimentosFiltrados = atendimentos.filter((a) => ("" + a.atend_categoria) !== "Feriado");
    
                // Consulta todos os convênios e terapias
                Conv.find({ _id: req.body.relConvid || { $exists: true } }).then((convenios) => {
                    log(`Foram encontrados ${convenios.length} convênios.`);
    
                    if (req.body.relConvid) {
                        conv_nome = convenios[0]?.conv_nome || "Convênio não encontrado";
                    }
    
                    Terapia.find().then((terapias) => {
                        log(`Foram encontradas ${terapias.length} terapias.`);
    
                        // Ordena terapias alfabeticamente
                        terapias.sort((a, b) => (a.terapia_nome > b.terapia_nome ? 1 : -1));
    
                        // Processa cada terapia
                        terapias.forEach((terapia) => {
                            const atendimentosDaTerapia = filtrarAtendimentosPorTerapia(
                                atendimentosFiltrados,
                                terapia._id,
                                terapia.atend_categoria
                            );
    
                            if (atendimentosDaTerapia.length > 0) {
                                const qtdIds = atendimentosDaTerapia.length;
                                const creVal = atendimentosDaTerapia[0].atend_valorcre;
    
                                rel.push({
                                    nomecid: terapia._id,
                                    sessoes: qtdIds,
                                    valor: creVal,
                                });
                            }
                        });
    
                        // Calcula totais
                        total = calcularTotais(rel);
    
                        // Renderiza a view
                        res.render("dash/dashFinan", {
                            terapias: terapias,
                            convs: convenios,
                            rels: rel,
                            total: total,
                            periodoDe: periodoDe,
                            periodoAte: periodoAte,
                            conv_nome: conv_nome,
                        });
    
                        log("Relatório renderizado com sucesso!");
                    });
                });
            })
            .catch((err) => {
                log("Erro ao carregar atendimentos:", err);
                req.flash("error_message", "Houve um erro ao carregar os atendimentos.");
                res.redirect("/admin/erro");
            });
    },
    //carregaDashfinan res.render("dash/dashFinan"
    carregaDashadminin_Primeira(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        let qtregsbene;
        let arrayRelQtValor = [];
        let totalBene;
        let array = [];
        Usuario.find().then((usuario)=>{
              Conv.find().then((conv) =>{
                convClass.qtregsconvativos(req,res).then((qtTotReg)=>{
                qtregs = qtTotReg;//somente Convênios ativos
                Bene.find({bene_status: "Ativo"}).then((bene) =>{
                    totalBene = bene.length;
                    beneClass.qtregsbeneativos(req,res).then((qtTotRegbene)=>{
                        beneClass.qtregsbeneFiltrados(req,res).then((qtregsbenefiltrado)=>{
                            array = qtregsbenefiltrado;
                        qtregsbene = qtTotRegbene;//somente beneficiários ativos
                        conv.forEach((c)=>{
                            let obj = new RelObjvalor();
                            let qt = 0;
                            bene.forEach((b)=>{
                                if ((""+c._id+"") == (""+b.bene_convid+"")){
                                    
                                    qt++;
                                }
                            })
                            obj.campo = "qtBenepconv";
                            obj.idlocal = (""+c._id+"");
                            obj.valor = qt;
                            arrayRelQtValor.push(obj);
                        })
            res.render("dash/dashAdminin", {usuarios: usuario, convs: conv, qtregs, benes:bene, qtregsbene, arrayRelQtValors: arrayRelQtValor, totalBene, qtregsbenefiltrados:qtregsbenefiltrado, arrays: array})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Administrativo!")
            res.redirect('admin/erro')
        })
    },
    carregaDashadminin_Segunda(req, res) {
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        let qtregsbene;
        let arrayRelQtValor = [];
        let totalBene;
        let array = [];
    
        console.log("Iniciando carregamento do dashboard administrativo...");
    
        Usuario.find().then((usuario) => {
            console.log("Usuários carregados:", usuario.length);
    
            Conv.find().then((conv) => {
                console.log("Convênios carregados:", conv.length);
    
                convClass.qtregsconvativos(req, res).then((qtTotReg) => {
                    qtregs = qtTotReg; // Somente Convênios ativos
                    console.log("Quantidade de convênios ativos:", qtregs);
    
                    Bene.find({ bene_status: "Ativo" }).then((bene) => {
                        totalBene = bene.length;
                        console.log("Beneficiários ativos carregados:", totalBene);
    
                        beneClass.qtregsbeneativos(req, res).then((qtTotRegbene) => {
                            console.log("Quantidade de beneficiários ativos:", qtTotRegbene);
    
                            beneClass.qtregsbeneFiltrados(req, res).then((qtregsbenefiltrado) => {
                                console.log("Dados filtrados de beneficiários:", qtregsbenefiltrado);
                                array = qtregsbenefiltrado;
    
                                qtregsbene = qtTotRegbene; // Somente beneficiários ativos
    
                                conv.forEach((c) => {
                                    let obj = new RelObjvalor();
                                    let qt = 0;
                                    bene.forEach((b) => {
                                        if (("" + c._id + "") == ("" + b.bene_convid + "")) {
                                            qt++;
                                        }
                                    });
                                    obj.campo = "qtBenepconv";
                                    obj.idlocal = ("" + c._id + "");
                                    obj.valor = qt;
                                    arrayRelQtValor.push(obj);
                                });
    
                                console.log("Array de relação de beneficiários por convênio:", arrayRelQtValor);
    
                                // Renderiza a view com os dados
                                res.render("dash/dashAdminin", {
                                    usuarios: usuario,
                                    convs: conv,
                                    qtregs,
                                    benes: bene,
                                    qtregsbene,
                                    arrayRelQtValors: arrayRelQtValor,
                                    totalBene,
                                    qtregsbenefiltrados: qtregsbenefiltrado,
                                    arrays: array
                                });
    
                                console.log("Dashboard administrativo renderizado com sucesso!");
                            }).catch((err) => {
                                console.error("Erro ao carregar dados filtrados de beneficiários:", err);
                                req.flash("error_message", "Houve um erro ao carregar dados filtrados de beneficiários!");
                                res.redirect('admin/erro');
                            });
                        }).catch((err) => {
                            console.error("Erro ao carregar quantidade de beneficiários ativos:", err);
                            req.flash("error_message", "Houve um erro ao carregar quantidade de beneficiários ativos!");
                            res.redirect('admin/erro');
                        });
                    }).catch((err) => {
                        console.error("Erro ao carregar beneficiários ativos:", err);
                        req.flash("error_message", "Houve um erro ao carregar beneficiários ativos!");
                        res.redirect('admin/erro');
                    });
                }).catch((err) => {
                    console.error("Erro ao carregar quantidade de convênios ativos:", err);
                    req.flash("error_message", "Houve um erro ao carregar quantidade de convênios ativos!");
                    res.redirect('admin/erro');
                });
            }).catch((err) => {
                console.error("Erro ao carregar convênios:", err);
                req.flash("error_message", "Houve um erro ao carregar convênios!");
                res.redirect('admin/erro');
            });
        }).catch((err) => {
            console.error("Erro ao carregar usuários:", err);
            req.flash("error_message", "Houve um erro ao carregar usuários!");
            res.redirect('admin/erro');
        });
    },

   
    carregaDashadmininOLD2(req, res) {
        let db = req.cookies['preferredDb'];
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema);

        // === Definir período: mês atual ou via query string ===
        let seg, sex;
        if (req.query.dataIni && req.query.dataFim) {
            seg = fncGeral.getDateFromString(req.query.dataIni, "ini");
            sex = fncGeral.getDateFromString(req.query.dataFim, "fim");
        } else {
            const agora = new Date();
            seg = new Date(agora.getFullYear(), agora.getMonth(), 1);
            sex = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
        }
        seg.setHours(0, 0, 0, 0);
        sex.setHours(23, 59, 59, 999);

        console.log(`[DashAdmin] Período: ${fncGeral.getDataFMT(seg)} até ${fncGeral.getDataFMT(sex)}`);

        // === Carregar terapeutas ===
        Usuario.find({
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((todosTerapeutas) => {

            // Ordenar terapeutas alfabeticamente (com normalização)
            todosTerapeutas.sort((a, b) =>
                a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    .localeCompare(b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            );

            const listaTerapeutaIds = todosTerapeutas.map(t => t._id.toString());

            // === Carregar terapias ===
            Terapia.find().then((terapias) => {

                terapias.sort((a, b) =>
                    a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                        .localeCompare(b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                );

                // === Carregar agendas no período ===
                Agenda.find({
                    agenda_data: { $gte: seg, $lte: sex },
                    agenda_usuid: { $in: listaTerapeutaIds }
                }).then((todasAgendas) => {

                    // Filtrar categorias inválidas
                    const categoriasExcluidas = ["Extra", "Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"];
                    const agendaFiltrada = todasAgendas.filter(a =>
                        !categoriasExcluidas.includes(a.agenda_categoria)
                    );

                    // === Carregar convênios e beneficiários ativos ===
                    Conv.find().then((convs) => {
                        Bene.find({ bene_status: "Ativo" }).then((beneAtivos) => {
                            Usuario.find().then((todosUsuarios) => {

                                // === 🔑 NOVA LÓGICA: Classificar beneficiários ===
                                const ID_PARTICULAR = "62477742e416141415ff7a88";
                                let qtParticular = 0;
                                let qtLiminar = 0;
                                let qtConvenio = 0;

                                beneAtivos.forEach(b => {
                                    const convid = String(b.bene_convid);
                                    if (convid === ID_PARTICULAR) {
                                        qtParticular++;
                                    } else {
                                        if (b.bene_liminar === "Sim" ) {
                                            qtLiminar++;
                                        } else {
                                            qtConvenio++;
                                        }
                                    }
                                });

                                const qtregsbenefiltrado = [
                                    { campo: 'qtConvEspecifico', valor: qtParticular },   // Particular
                                    { campo: 'qtLiminarSim', valor: qtLiminar },          // Liminar
                                    { campo: 'qtLiminarNao', valor: qtConvenio },         // Convênio
                                    { campo: 'qtAtivos', valor: beneAtivos.length }       // Total (não entra no gráfico)
                                ];

                                // === Montar os 4 resumos de terapia ===
                                const contagemPorTerapia = {};
                                const contagemPorTerapiaNomecid = {};
                                const contagemPorTerapeuta = {};
                                const terapiasDistintasPorTerapeuta = {};

                                agendaFiltrada.forEach(item => {
                                    const tid = String(item.agenda_terapiaid);
                                    const cid = terapias.find(t => String(t._id) === tid)?.terapia_nomecid;
                                    const uid = String(item.agenda_usuid);

                                    contagemPorTerapia[tid] = (contagemPorTerapia[tid] || 0) + 1;
                                    if (cid) contagemPorTerapiaNomecid[cid] = (contagemPorTerapiaNomecid[cid] || 0) + 1;

                                    contagemPorTerapeuta[uid] = (contagemPorTerapeuta[uid] || 0) + 1;
                                    if (!terapiasDistintasPorTerapeuta[uid]) terapiasDistintasPorTerapeuta[uid] = new Set();
                                    terapiasDistintasPorTerapeuta[uid].add(tid);
                                });

                                // Resumo 1: por nome da terapia (ordenado)
                                const resumoTerapia = Object.entries(contagemPorTerapia).map(([id, total]) => {
                                    const nome = terapias.find(t => String(t._id) === id)?.terapia_nome || 'Desconhecida';
                                    return { terapiaNome: nome, total };
                                }).sort((a, b) =>
                                    a.terapiaNome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                        .localeCompare(b.terapiaNome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                                );

                                // Resumo 2: por terapia_nomecid
                                const resumoTerapiaNomecid = Object.entries(contagemPorTerapiaNomecid)
                                    .map(([cid, total]) => ({ terapiaNomecid: cid, total }))
                                    .sort((a, b) => a.terapiaNomecid.localeCompare(b.terapiaNomecid));

                                // Resumo 3: por terapeuta
                                const resumoTerapeuta = todosTerapeutas
                                    .filter(t => contagemPorTerapeuta[String(t._id)])
                                    .map(t => ({ nome: t.usuario_nome, total: contagemPorTerapeuta[String(t._id)] }))
                                    .sort((a, b) => a.nome.localeCompare(b.nome));

                                // Resumo 4: detalhado
                                const resumoDetalhado = todosTerapeutas
                                    .filter(t => contagemPorTerapeuta[String(t._id)])
                                    .map(t => {
                                        const id = String(t._id);
                                        return {
                                            nome: t.usuario_nome,
                                            totalAtendimentos: contagemPorTerapeuta[id],
                                            totalTerapias: terapiasDistintasPorTerapeuta[id]?.size || 0
                                        };
                                    })
                                    .sort((a, b) => a.nome.localeCompare(b.nome));

                                // === Relacionar beneficiários por convênio (para gráfico de barras) ===
                                const arrayRelQtValor = convs.map(c => {
                                    const qt = beneAtivos.filter(b => String(b.bene_convid) === String(c._id)).length;
                                    return { campo: "qtBenepconv", idlocal: String(c._id), valor: qt };
                                });
                                // === 🔹 GRÁFICO: Sessões por Tipo de Beneficiário ===
                                console.log("[DashAdmin] Calculando sessões por tipo de beneficiário...");

                                // Criar um mapa rápido de bene_id → tipo
                                const mapaBeneTipo = {};
                                beneAtivos.forEach(b => {
                                    const convid = String(b.bene_convid);
                                    let tipo = 'convenio'; // padrão
                                    if (convid === ID_PARTICULAR) {
                                        tipo = 'particular';
                                    } else if (b.bene_liminar === "Sim") {
                                        tipo = 'liminar';
                                    }
                                    mapaBeneTipo[String(b._id)] = tipo;
                                });

                                // Contar sessões por tipo
                                let sessoesParticular = 0;
                                let sessoesConvenio = 0;
                                let sessoesLiminar = 0;

                                agendaFiltrada.forEach(agenda => {
                                    const beneId = String(agenda.agenda_beneid);
                                    const tipo = mapaBeneTipo[beneId];
                                    if (tipo === 'particular') {
                                        sessoesParticular++;
                                    } else if (tipo === 'liminar') {
                                        sessoesLiminar++;
                                    } else if (tipo === 'convenio') {
                                        sessoesConvenio++;
                                    }
                                });

                                // Preparar dados para o gráfico (ordem fixa para legibilidade)
                                const resumoSessoesPorTipo = [
                                    { tipo: 'Particular', total: sessoesParticular, cor: '#2ecc71' },
                                    { tipo: 'Convênio', total: sessoesConvenio, cor: '#3498db' },
                                    { tipo: 'Liminar', total: sessoesLiminar, cor: '#e74c3c' }
                                ];
                                const totalSessoes = sessoesParticular + sessoesConvenio + sessoesLiminar;

                                console.log("[DashAdmin] Sessões por tipo:", resumoSessoesPorTipo);
                                // === Renderizar view ===
                                res.render("dash/dashAdminin", {
                                    usuarios: todosUsuarios,
                                    convs,
                                    benes: beneAtivos,
                                    qtregs: convs.filter(c => c.conv_status === "Ativo").length,
                                    qtregsbene: beneAtivos.length,
                                    arrayRelQtValors: arrayRelQtValor,
                                    totalBene: beneAtivos.length,
                                    qtregsbenefiltrados: qtregsbenefiltrado,
                                    arrays: qtregsbenefiltrado,

                                    // === Dados para aba Terapias ===
                                    resumoTerapia,
                                    resumoTerapiaNomecid,
                                    resumoTerapeuta,
                                    resumoDetalhado,
                                    dataIniFiltro: fncGeral.getDataFMT(seg).split(' ')[0],
                                    dataFimFiltro: fncGeral.getDataFMT(sex).split(' ')[0],
                                    // === Dados para aba Sessões ===
                                    resumoSessoesPorTipo,
                                    totalSessoes, // 👈 adicionado

                                    // === Dados para aba Terapias ===
                                    resumoTerapia,
                                    resumoTerapiaNomecid,
                                    resumoTerapeuta,
                                    resumoDetalhado,
                                    dataIniFiltro: fncGeral.getDataFMT(seg).split(' ')[0],
                                    dataFimFiltro: fncGeral.getDataFMT(sex).split(' ')[0]
                                    
                                });

                            }).catch(err => {
                                console.error("[DashAdmin] Erro ao carregar usuários:", err);
                                res.status(500).send("Erro ao carregar usuários");
                            });
                        }).catch(err => {
                            console.error("[DashAdmin] Erro ao carregar beneficiários:", err);
                            res.status(500).send("Erro ao carregar beneficiários");
                        });
                    }).catch(err => {
                        console.error("[DashAdmin] Erro ao carregar convênios:", err);
                        res.status(500).send("Erro ao carregar convênios");
                    });

                }).catch(err => {
                    console.error("[DashAdmin] Erro ao carregar agendas:", err);
                    res.status(500).send("Erro ao carregar agendas");
                });

            }).catch(err => {
                console.error("[DashAdmin] Erro ao carregar terapias:", err);
                res.status(500).send("Erro ao carregar terapias");
            });

        }).catch(err => {
            console.error("[DashAdmin] Erro ao carregar terapeutas:", err);
            res.status(500).send("Erro ao carregar terapeutas");
        });
    },
    carregaDashadmininOLD1(req, res) {
        let db = req.cookies['preferredDb'];
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);

        // === Definir período: mês atual ou via query string ===
        let seg, sex;
        if (req.query.dataIni && req.query.dataFim) {
            seg = fncGeral.getDateFromString(req.query.dataIni, "ini");
            sex = fncGeral.getDateFromString(req.query.dataFim, "fim");
        } else {
            const agora = new Date();
            seg = new Date(agora.getFullYear(), agora.getMonth(), 1);
            sex = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
        }
        seg.setHours(0, 0, 0, 0);
        sex.setHours(23, 59, 59, 999);

        console.log(`[DashAdmin] Período: ${fncGeral.getDataFMT(seg)} até ${fncGeral.getDataFMT(sex)}`);

        // === Carregar terapeutas ===
        Usuario.find({
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((todosTerapeutas) => {

            // Ordenar terapeutas alfabeticamente (com normalização)
            todosTerapeutas.sort((a, b) =>
                a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    .localeCompare(b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            );

            const listaTerapeutaIds = todosTerapeutas.map(t => t._id.toString());

            // === Carregar terapias ===
            Terapia.find().then((terapias) => {

                terapias.sort((a, b) =>
                    a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                        .localeCompare(b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                );

                // === Carregar agendas no período ===
                Agenda.find({
                    agenda_data: { $gte: seg, $lte: sex },
                    agenda_usuid: { $in: listaTerapeutaIds }
                }).then((todasAgendas) => {

                    // Filtrar categorias inválidas
                    const categoriasExcluidas = ["Extra", "Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"];
                    const agendaFiltrada = todasAgendas.filter(a =>
                        !categoriasExcluidas.includes(a.agenda_categoria)
                    );

                    // === Carregar convênios e beneficiários ativos ===
                    Conv.find().then((convs) => {
                        Bene.find({ bene_status: "Ativo" }).then((beneAtivos) => {
                            Usuario.find().then((todosUsuarios) => {

                                // === 🔑 NOVA LÓGICA: Classificar beneficiários ===
                                const ID_PARTICULAR = "62477742e416141415ff7a88";
                                let qtParticular = 0;
                                let qtLiminar = 0;
                                let qtConvenio = 0;

                                beneAtivos.forEach(b => {
                                    const convid = String(b.bene_convid);
                                    if (convid === ID_PARTICULAR) {
                                        qtParticular++;
                                    } else {
                                        if (b.bene_liminar === "Sim") {
                                            qtLiminar++;
                                        } else {
                                            qtConvenio++;
                                        }
                                    }
                                });

                                const qtregsbenefiltrado = [
                                    { campo: 'qtConvEspecifico', valor: qtParticular },   // Particular
                                    { campo: 'qtLiminarSim', valor: qtLiminar },          // Liminar
                                    { campo: 'qtLiminarNao', valor: qtConvenio },         // Convênio
                                    { campo: 'qtAtivos', valor: beneAtivos.length }       // Total (não entra no gráfico)
                                ];

                                // === Montar os 4 resumos de terapia ===
                                const contagemPorTerapia = {};
                                const contagemPorTerapiaNomecid = {};
                                const contagemPorTerapeuta = {};
                                const terapiasDistintasPorTerapeuta = {};

                                agendaFiltrada.forEach(item => {
                                    const tid = String(item.agenda_terapiaid);
                                    const cid = terapias.find(t => String(t._id) === tid)?.terapia_nomecid;
                                    const uid = String(item.agenda_usuid);

                                    contagemPorTerapia[tid] = (contagemPorTerapia[tid] || 0) + 1;
                                    if (cid) contagemPorTerapiaNomecid[cid] = (contagemPorTerapiaNomecid[cid] || 0) + 1;

                                    contagemPorTerapeuta[uid] = (contagemPorTerapeuta[uid] || 0) + 1;
                                    if (!terapiasDistintasPorTerapeuta[uid]) terapiasDistintasPorTerapeuta[uid] = new Set();
                                    terapiasDistintasPorTerapeuta[uid].add(tid);
                                });

                                // Resumo 1: por nome da terapia (ordenado)
                                const resumoTerapia = Object.entries(contagemPorTerapia).map(([id, total]) => {
                                    const nome = terapias.find(t => String(t._id) === id)?.terapia_nome || 'Desconhecida';
                                    return { terapiaNome: nome, total };
                                }).sort((a, b) =>
                                    a.terapiaNome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                        .localeCompare(b.terapiaNome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                                );

                                // Resumo 2: por terapia_nomecid
                                const resumoTerapiaNomecid = Object.entries(contagemPorTerapiaNomecid)
                                    .map(([cid, total]) => ({ terapiaNomecid: cid, total }))
                                    .sort((a, b) => a.terapiaNomecid.localeCompare(b.terapiaNomecid));

                                // Resumo 3: por terapeuta
                                const resumoTerapeuta = todosTerapeutas
                                    .filter(t => contagemPorTerapeuta[String(t._id)])
                                    .map(t => ({ nome: t.usuario_nome, total: contagemPorTerapeuta[String(t._id)] }))
                                    .sort((a, b) => a.nome.localeCompare(b.nome));

                                // Resumo 4: detalhado
                                const resumoDetalhado = todosTerapeutas
                                    .filter(t => contagemPorTerapeuta[String(t._id)])
                                    .map(t => {
                                        const id = String(t._id);
                                        return {
                                            nome: t.usuario_nome,
                                            totalAtendimentos: contagemPorTerapeuta[id],
                                            totalTerapias: terapiasDistintasPorTerapeuta[id]?.size || 0
                                        };
                                    })
                                    .sort((a, b) => a.nome.localeCompare(b.nome));

                                // === Relacionar beneficiários por convênio (para gráfico de barras) ===
                                const arrayRelQtValor = convs.map(c => {
                                    const qt = beneAtivos.filter(b => String(b.bene_convid) === String(c._id)).length;
                                    return { campo: "qtBenepconv", idlocal: String(c._id), valor: qt };
                                });

                                // === 🔹 GRÁFICO: Sessões por Tipo de Beneficiário ===
                                console.log("[DashAdmin] Calculando sessões por tipo de beneficiário...");
                                const mapaBeneTipo = {};
                                beneAtivos.forEach(b => {
                                    const convid = String(b.bene_convid);
                                    let tipo = 'convenio';
                                    if (convid === ID_PARTICULAR) tipo = 'particular';
                                    else if (b.bene_liminar === "Sim") tipo = 'liminar';
                                    mapaBeneTipo[String(b._id)] = tipo;
                                });

                                let sessoesParticular = 0, sessoesConvenio = 0, sessoesLiminar = 0;
                                agendaFiltrada.forEach(agenda => {
                                    const beneId = String(agenda.agenda_beneid);
                                    const tipo = mapaBeneTipo[beneId];
                                    if (tipo === 'particular') sessoesParticular++;
                                    else if (tipo === 'liminar') sessoesLiminar++;
                                    else sessoesConvenio++;
                                });

                                const resumoSessoesPorTipo = [
                                    { tipo: 'Particular', total: sessoesParticular, cor: '#2ecc71' },
                                    { tipo: 'Convênio', total: sessoesConvenio, cor: '#3498db' },
                                    { tipo: 'Liminar', total: sessoesLiminar, cor: '#e74c3c' }
                                ];
                                const totalSessoes = sessoesParticular + sessoesConvenio + sessoesLiminar;

                               // === 🔹 NOVA CONSULTA SEPARADA: Evolução de Beneficiários ===
Bene.find().then((todosBeneEvolucao) => {
    // === Garantir período do mês atual se não vier do filtro ===
    let agora = new Date();
    if (!seg || !sex || isNaN(seg) || isNaN(sex)) {
        seg = new Date(agora.getFullYear(), agora.getMonth(), 1);
        sex = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    seg.setHours(0, 0, 0, 0);
    sex.setHours(23, 59, 59, 999);

    const year = seg.getFullYear();
    const lastMonth = sex.getMonth();
    const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
    const labelsEvol = monthNames.slice(0, lastMonth + 1);

    // Arrays base
    const basePrevios = new Array(lastMonth + 1).fill(0);
    const novosMes = new Array(lastMonth + 1).fill(0);
    const descontinuadosMes = new Array(lastMonth + 1).fill(0);
    const totalEvolucao = new Array(lastMonth + 1).fill(0);

    const parseDateSafe = (val) => {
        if (!val) return null;
        const d = new Date(val);
        return isNaN(d.getTime()) ? null : d;
    };

    // Pré-processar
    const benesProcessados = todosBeneEvolucao.map(b => {
        const reg = parseDateSafe(b.bene_dtaini) || parseDateSafe(b.bene_datacad) || null;
        const fim = parseDateSafe(b.bene_dtafim) || null; // 👈 corrigido campo
        const status = (b.bene_status || '').trim();
        return { regDate: reg, endDate: fim, status };
    });

    // === Cálculo do total fixo de base anterior ===
    let totalBaseAnterior = benesProcessados.filter(b => {
        return b.regDate && b.regDate.getFullYear() < year && b.status === "Ativo";
    }).length;

    // 👇 Ajuste administrativo (provisões cadastradas indevidas)
    totalBaseAnterior = Math.max(totalBaseAnterior - 2, 0);

    // === Preenche a base fixa (constante para todos os meses)
    for (let m = 0; m <= lastMonth; m++) {
        basePrevios[m] = totalBaseAnterior;
    }

    // === Contagem mês a mês (novos e descontinuados)
    for (let m = 0; m <= lastMonth; m++) {
        const monthStart = new Date(year, m, 1, 0, 0, 0, 0);
        const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);

        benesProcessados.forEach(b => {
            const { regDate: reg, endDate: fim, status } = b;

            // --- Novos cadastrados no mês
            if (reg && reg >= monthStart && reg <= monthEnd) {
                novosMes[m]++;
            }

            // --- Descontinuados no mês
            if (fim && fim >= monthStart && fim <= monthEnd && status === "Inativo") {
                descontinuadosMes[m]++;
            }
        });
    }

    // === Calcular acumulados e total projetado
    const acumuladoNovos = [];
    const acumuladoDescontinuados = [];
    for (let m = 0; m <= lastMonth; m++) {
        acumuladoNovos[m] = (m === 0 ? novosMes[m] : acumuladoNovos[m - 1] + novosMes[m]);
        acumuladoDescontinuados[m] = (m === 0 ? descontinuadosMes[m] : acumuladoDescontinuados[m - 1] + descontinuadosMes[m]);
        totalEvolucao[m] = totalBaseAnterior + acumuladoNovos[m] - acumuladoDescontinuados[m];
        if (totalEvolucao[m] < 0) totalEvolucao[m] = 0;
    }

    // === Log de auditoria no console
    const tabelaEvolucao = labelsEvol.map((mes, i) => ({
        Mês: mes,
        "Base Anterior (Fixa)": totalBaseAnterior,
        "Novos Cadastrados": novosMes[i],
        "Descontinuados": descontinuadosMes[i],
        "Total Acumulado": totalEvolucao[i]
    }));
    console.log(`📊 [DashAdmin] Evolução Mensal de Beneficiários - Ano ${year}`);
    console.table(tabelaEvolucao);

    // === Envio para view
    const evolucaoBene = {
        year,
        lastMonth,
        labels: labelsEvol,
        seriesBase: basePrevios,
        seriesNovos: novosMes,
        seriesDescontinuados: descontinuadosMes,
        totals: totalEvolucao
    };
    
    res.render("dash/dashAdminin", {
        usuarios: todosUsuarios,
        convs,
        benes: beneAtivos,
        qtregs: convs.filter(c => c.conv_status === "Ativo").length,
        qtregsbene: beneAtivos.length,
        arrayRelQtValors: arrayRelQtValor,
        totalBene: beneAtivos.length,
        qtregsbenefiltrados: qtregsbenefiltrado,
        arrays: qtregsbenefiltrado,
        resumoTerapia,
        resumoTerapiaNomecid,
        resumoTerapeuta,
        resumoDetalhado,
        dataIniFiltro: fncGeral.getDataFMT(seg).split(' ')[0],
        dataFimFiltro: fncGeral.getDataFMT(sex).split(' ')[0],
        resumoSessoesPorTipo,
        totalSessoes,
        evolucaoBene
    });

}).catch(err => {
    console.error("[DashAdmin] Erro ao calcular evolução de beneficiários:", err);
    res.status(500).send("Erro ao calcular evolução de beneficiários");
});




                            }).catch(err => {
                                console.error("[DashAdmin] Erro ao carregar usuários:", err);
                                res.status(500).send("Erro ao carregar usuários");
                            });
                        }).catch(err => {
                            console.error("[DashAdmin] Erro ao carregar beneficiários:", err);
                            res.status(500).send("Erro ao carregar beneficiários");
                        });
                    }).catch(err => {
                        console.error("[DashAdmin] Erro ao carregar convênios:", err);
                        res.status(500).send("Erro ao carregar convênios");
                    });

                }).catch(err => {
                    console.error("[DashAdmin] Erro ao carregar agendas:", err);
                    res.status(500).send("Erro ao carregar agendas");
                });

            }).catch(err => {
                console.error("[DashAdmin] Erro ao carregar terapias:", err);
                res.status(500).send("Erro ao carregar terapias");
            });

        }).catch(err => {
            console.error("[DashAdmin] Erro ao carregar terapeutas:", err);
            res.status(500).send("Erro ao carregar terapeutas");
        });
    },
    carregaDashadmininOLDError(req, res) {
    let db = req.cookies['preferredDb'];
    const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    const Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema);
    const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);

    // === Definir período: mês atual ou via query string ===
    let seg, sex;
    if (req.query.dataIni && req.query.dataFim) {
        seg = fncGeral.getDateFromString(req.query.dataIni, "ini");
        sex = fncGeral.getDateFromString(req.query.dataFim, "fim");
    } else {
        const agora = new Date();
        seg = new Date(agora.getFullYear(), agora.getMonth(), 1);
        sex = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    seg.setHours(0, 0, 0, 0);
    sex.setHours(23, 59, 59, 999);

    console.log(`[DashAdmin] Período: ${fncGeral.getDataFMT(seg)} até ${fncGeral.getDataFMT(sex)}`);

    Usuario.find({
        $or: [
            { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
            { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
        ]
    }).then((todosTerapeutas) => {

        todosTerapeutas.sort((a, b) =>
            a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .localeCompare(b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        );

        const listaTerapeutaIds = todosTerapeutas.map(t => t._id.toString());

        Terapia.find().then((terapias) => {

            terapias.sort((a, b) =>
                a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    .localeCompare(b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            );

            Agenda.find({
                agenda_data: { $gte: seg, $lte: sex },
                agenda_usuid: { $in: listaTerapeutaIds }
            }).then((todasAgendas) => {

                const categoriasExcluidas = ["Extra", "Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"];
                const agendaFiltrada = todasAgendas.filter(a =>
                    !categoriasExcluidas.includes(a.agenda_categoria)
                );

                Conv.find().then((convs) => {
                    Bene.find({ bene_status: "Ativo" }).then((beneAtivos) => {
                        Usuario.find().then((todosUsuarios) => {

                            const ID_PARTICULAR = "62477742e416141415ff7a88";
                            let qtParticular = 0, qtLiminar = 0, qtConvenio = 0;

                            beneAtivos.forEach(b => {
                                const convid = String(b.bene_convid);
                                if (convid === ID_PARTICULAR) qtParticular++;
                                else if (b.bene_liminar === "Sim") qtLiminar++;
                                else qtConvenio++;
                            });

                            const qtregsbenefiltrado = [
                                { campo: 'qtConvEspecifico', valor: qtParticular },
                                { campo: 'qtLiminarSim', valor: qtLiminar },
                                { campo: 'qtLiminarNao', valor: qtConvenio },
                                { campo: 'qtAtivos', valor: beneAtivos.length }
                            ];

                            // === Relacionar beneficiários por convênio (para gráfico de barras)
                            const arrayRelQtValor = convs.map(c => {
                                const qt = beneAtivos.filter(b => String(b.bene_convid) === String(c._id)).length;
                                return { campo: "qtBenepconv", idlocal: String(c._id), valor: qt };
                            });

                            // === 🔹 CONSULTA 1: Evolução de Beneficiários ===
                            Bene.find().then((todosBeneEvolucao) => {
                                const agora = new Date();
                                const year = seg.getFullYear() || agora.getFullYear();
                                const lastMonth = sex.getMonth();
                                const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                                const labelsEvol = monthNames.slice(0, lastMonth + 1);

                                const basePrevios = new Array(lastMonth + 1).fill(0);
                                const novosMes = new Array(lastMonth + 1).fill(0);
                                const descontinuadosMes = new Array(lastMonth + 1).fill(0);
                                const totalEvolucao = new Array(lastMonth + 1).fill(0);

                                const parseDateSafe = (val) => {
                                    if (!val) return null;
                                    const d = new Date(val);
                                    return isNaN(d.getTime()) ? null : d;
                                };

                                const benesProcessados = todosBeneEvolucao.map(b => {
                                    const reg = parseDateSafe(b.bene_dtaini) || parseDateSafe(b.bene_datacad) || null;
                                    const fim = parseDateSafe(b.bene_dtafim) || null;
                                    const status = (b.bene_status || '').trim();
                                    return { regDate: reg, endDate: fim, status };
                                });

                                let totalBaseAnterior = benesProcessados.filter(b => {
                                    return b.regDate && b.regDate.getFullYear() < year && b.status === "Ativo";
                                }).length;
                                totalBaseAnterior = Math.max(totalBaseAnterior - 2, 0);

                                for (let m = 0; m <= lastMonth; m++) basePrevios[m] = totalBaseAnterior;

                                for (let m = 0; m <= lastMonth; m++) {
                                    const monthStart = new Date(year, m, 1, 0, 0, 0, 0);
                                    const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
                                    benesProcessados.forEach(b => {
                                        const { regDate: reg, endDate: fim, status } = b;
                                        if (reg && reg >= monthStart && reg <= monthEnd) novosMes[m]++;
                                        if (fim && fim >= monthStart && fim <= monthEnd && status === "Inativo") descontinuadosMes[m]++;
                                    });
                                }

                                const acumuladoNovos = [], acumuladoDescontinuados = [];
                                for (let m = 0; m <= lastMonth; m++) {
                                    acumuladoNovos[m] = (m === 0 ? novosMes[m] : acumuladoNovos[m - 1] + novosMes[m]);
                                    acumuladoDescontinuados[m] = (m === 0 ? descontinuadosMes[m] : acumuladoDescontinuados[m - 1] + descontinuadosMes[m]);
                                    totalEvolucao[m] = totalBaseAnterior + acumuladoNovos[m] - acumuladoDescontinuados[m];
                                    if (totalEvolucao[m] < 0) totalEvolucao[m] = 0;
                                }

                                const tabelaEvolucao = labelsEvol.map((mes, i) => ({
                                    Mês: mes,
                                    "Base Anterior (Fixa)": totalBaseAnterior,
                                    "Novos": novosMes[i],
                                    "Descontinuados": descontinuadosMes[i],
                                    "Total": totalEvolucao[i]
                                }));
                                console.log(`📊 [DashAdmin] Evolução Mensal de Beneficiários - ${year}`);
                                console.table(tabelaEvolucao);

                                const evolucaoBene = {
                                    year, lastMonth, labels: labelsEvol,
                                    seriesBase: basePrevios,
                                    seriesNovos: novosMes,
                                    seriesDescontinuados: descontinuadosMes,
                                    totals: totalEvolucao
                                };

                                // === 🔹 CONSULTA 2: Evolução de Atendimentos por Convênio ===
                                const categoriasInvalidas = ["Falta Absoluta", "Glosa", "Feriado", "Falta Justificada"];
                                const anoAtual = year;
                                const inicioAno = new Date(anoAtual, 0, 1);
                                const fimAno = new Date(anoAtual, 11, 31, 23, 59, 59, 999);

                                Atend.find({
                                    atend_atenddata: { $gte: inicioAno, $lte: fimAno },
                                    atend_categoria: { $nin: categoriasInvalidas }
                                }).then((atendimentos) => {
                                    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                                    const totaisMensais = new Array(12).fill(0);
                                    const porConvenio = {};

                                    atendimentos.forEach(a => {
                                        const convId = String(a.atend_convid);
                                        const mes = new Date(a.atend_atenddata).getMonth();
                                        totaisMensais[mes]++;
                                        porConvenio[convId] = porConvenio[convId] || new Array(12).fill(0);
                                        porConvenio[convId][mes]++;
                                    });

                                    const seriesConvenio = convs.map(c => ({
                                        nome: c.conv_nome,
                                        data: porConvenio[String(c._id)] || new Array(12).fill(0)
                                    }));

                                    const tabelaAtend = meses.map((m, i) => {
                                        const linha = { Mês: m, Total: totaisMensais[i] };
                                        convs.forEach(c => {
                                            const arr = porConvenio[String(c._id)] || [];
                                            linha[c.conv_nome] = arr[i] || 0;
                                        });
                                        return linha;
                                    });
                                    console.log(`📈 [DashAdmin] Evolução de Atendimentos por Convênio - ${anoAtual}`);
                                    console.table(tabelaAtend);

                                    const evolucaoAtendConv = {
                                        ano: anoAtual,
                                        labels: meses,
                                        totalMensal: totaisMensais,
                                        series: seriesConvenio
                                    };

                                    res.render("dash/dashAdminin", {
                                        usuarios: todosUsuarios,
                                        convs,
                                        benes: beneAtivos,
                                        qtregs: convs.filter(c => c.conv_status === "Ativo").length,
                                        qtregsbene: beneAtivos.length,
                                        arrayRelQtValors: arrayRelQtValor,
                                        totalBene: beneAtivos.length,
                                        qtregsbenefiltrados: qtregsbenefiltrado,
                                        arrays: qtregsbenefiltrado,
                                        resumoTerapiaNomecid: [],
                                        resumoTerapeuta: [],
                                        resumoDetalhado: [],
                                        dataIniFiltro: fncGeral.getDataFMT(seg).split(' ')[0],
                                        dataFimFiltro: fncGeral.getDataFMT(sex).split(' ')[0],
                                        resumoSessoesPorTipo: [],
                                        totalSessoes: 0,
                                        evolucaoBene,
                                        evolucaoAtendConv
                                    });
                                }).catch(err => {
                                    console.error("[DashAdmin] Erro ao calcular evolução de atendimentos:", err);
                                    res.status(500).send("Erro ao calcular evolução de atendimentos");
                                });
                            }).catch(err => {
                                console.error("[DashAdmin] Erro ao calcular evolução de beneficiários:", err);
                                res.status(500).send("Erro ao calcular evolução de beneficiários");
                            });
                        }).catch(err => {
                            console.error("[DashAdmin] Erro ao carregar usuários:", err);
                            res.status(500).send("Erro ao carregar usuários");
                        });
                    }).catch(err => {
                        console.error("[DashAdmin] Erro ao carregar beneficiários:", err);
                        res.status(500).send("Erro ao carregar beneficiários");
                    });
                }).catch(err => {
                    console.error("[DashAdmin] Erro ao carregar convênios:", err);
                    res.status(500).send("Erro ao carregar convênios");
                });
            }).catch(err => {
                console.error("[DashAdmin] Erro ao carregar agendas:", err);
                res.status(500).send("Erro ao carregar agendas");
            });
        }).catch(err => {
            console.error("[DashAdmin] Erro ao carregar terapias:", err);
            res.status(500).send("Erro ao carregar terapias");
        });
    }).catch(err => {
        console.error("[DashAdmin] Erro ao carregar terapeutas:", err);
        res.status(500).send("Erro ao carregar terapeutas");
    });
},
carregaDashadminin(req, res) {
    let db = req.cookies['preferredDb'];
    const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    const Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema);
    const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);

    // === Definir período (filtro ou mês atual) ===
    let seg, sex;
    if (req.query.dataIni && req.query.dataFim) {
        seg = fncGeral.getDateFromString(req.query.dataIni, "ini");
        sex = fncGeral.getDateFromString(req.query.dataFim, "fim");
    } else {
        const agora = new Date();
        seg = new Date(agora.getFullYear(), agora.getMonth(), 1);
        sex = new Date(agora.getFullYear(), agora.getMonth() + 1, 0, 23, 59, 59, 999);
    }
    seg.setHours(0, 0, 0, 0);
    sex.setHours(23, 59, 59, 999);
    console.log(`[DashAdmin] Período: ${fncGeral.getDataFMT(seg)} até ${fncGeral.getDataFMT(sex)}`);

    // === Carregar terapeutas ===
    Usuario.find({
        $or: [
            { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
            { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
        ]
    }).then((todosTerapeutas) => {

        todosTerapeutas.sort((a, b) =>
            a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .localeCompare(b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        );

        const listaTerapeutaIds = todosTerapeutas.map(t => t._id.toString());

        // === Carregar terapias ===
        Terapia.find().then((terapias) => {

            terapias.sort((a, b) =>
                a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                    .localeCompare(b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
            );

            // === Carregar agendas no período ===
            Agenda.find({
                agenda_data: { $gte: seg, $lte: sex },
                agenda_usuid: { $in: listaTerapeutaIds }
            }).then((todasAgendas) => {

                const categoriasExcluidas = ["Extra", "Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"];
                const agendaFiltrada = todasAgendas.filter(a =>
                    !categoriasExcluidas.includes(a.agenda_categoria)
                );

                // === Carregar convênios e beneficiários ===
                Conv.find().then((convs) => {
                    Bene.find({ bene_status: "Ativo" }).then((beneAtivos) => {
                        Usuario.find().then((todosUsuarios) => {

                            // === Beneficiários por tipo ===
                            const ID_PARTICULAR = "62477742e416141415ff7a88";
                            let qtParticular = 0, qtLiminar = 0, qtConvenio = 0;

                            beneAtivos.forEach(b => {
                                const convid = String(b.bene_convid);
                                if (convid === ID_PARTICULAR) qtParticular++;
                                else if (b.bene_liminar === "Sim") qtLiminar++;
                                else qtConvenio++;
                            });

                            const qtregsbenefiltrado = [
                                { campo: 'qtConvEspecifico', valor: qtParticular },
                                { campo: 'qtLiminarSim', valor: qtLiminar },
                                { campo: 'qtLiminarNao', valor: qtConvenio },
                                { campo: 'qtAtivos', valor: beneAtivos.length }
                            ];

                            // === Beneficiários por convênio ===
                            const arrayRelQtValor = convs.map(c => {
                                const qt = beneAtivos.filter(b => String(b.bene_convid) === String(c._id)).length;
                                return { campo: "qtBenepconv", idlocal: String(c._id), valor: qt };
                            });

                            // === 🔹 CONSULTA 1: Evolução de Beneficiários ===
                            Bene.find().then((todosBeneEvolucao) => {
                                const agora = new Date();
                                const year = seg.getFullYear() || agora.getFullYear();
                                const lastMonth = sex.getMonth();
                                const monthNames = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                                const labelsEvol = monthNames.slice(0, lastMonth + 1);

                                const basePrevios = new Array(lastMonth + 1).fill(0);
                                const novosMes = new Array(lastMonth + 1).fill(0);
                                const descontinuadosMes = new Array(lastMonth + 1).fill(0);
                                const totalEvolucao = new Array(lastMonth + 1).fill(0);

                                const parseDateSafe = (val) => {
                                    if (!val) return null;
                                    const d = new Date(val);
                                    return isNaN(d.getTime()) ? null : d;
                                };

                                const benesProcessados = todosBeneEvolucao.map(b => {
                                    const reg = parseDateSafe(b.bene_dtaini) || parseDateSafe(b.bene_datacad) || null;
                                    const fim = parseDateSafe(b.bene_dtafim) || null;
                                    const status = (b.bene_status || '').trim();
                                    return { regDate: reg, endDate: fim, status };
                                });

                                let totalBaseAnterior = benesProcessados.filter(b => {
                                    return b.regDate && b.regDate.getFullYear() < year && b.status === "Ativo";
                                }).length;

                                totalBaseAnterior = Math.max(totalBaseAnterior - 2, 0);
                                for (let m = 0; m <= lastMonth; m++) basePrevios[m] = totalBaseAnterior;

                                for (let m = 0; m <= lastMonth; m++) {
                                    const monthStart = new Date(year, m, 1, 0, 0, 0, 0);
                                    const monthEnd = new Date(year, m + 1, 0, 23, 59, 59, 999);
                                    benesProcessados.forEach(b => {
                                        const { regDate: reg, endDate: fim, status } = b;
                                        if (reg && reg >= monthStart && reg <= monthEnd) novosMes[m]++;
                                        if (fim && fim >= monthStart && fim <= monthEnd && status === "Inativo") descontinuadosMes[m]++;
                                    });
                                }

                                const acumuladoNovos = [], acumuladoDescontinuados = [];
                                for (let m = 0; m <= lastMonth; m++) {
                                    acumuladoNovos[m] = (m === 0 ? novosMes[m] : acumuladoNovos[m - 1] + novosMes[m]);
                                    acumuladoDescontinuados[m] = (m === 0 ? descontinuadosMes[m] : acumuladoDescontinuados[m - 1] + descontinuadosMes[m]);
                                    totalEvolucao[m] = totalBaseAnterior + acumuladoNovos[m] - acumuladoDescontinuados[m];
                                    if (totalEvolucao[m] < 0) totalEvolucao[m] = 0;
                                }

                                const tabelaEvolucao = labelsEvol.map((mes, i) => ({
                                    Mês: mes,
                                    "Base Fixa": totalBaseAnterior,
                                    "Novos": novosMes[i],
                                    "Descontinuados": descontinuadosMes[i],
                                    "Total": totalEvolucao[i]
                                }));
                                console.log(`📊 [DashAdmin] Evolução Mensal de Beneficiários - ${year}`);
                                console.table(tabelaEvolucao);

                                const evolucaoBene = {
                                    year, lastMonth, labels: labelsEvol,
                                    seriesBase: basePrevios,
                                    seriesNovos: novosMes,
                                    seriesDescontinuados: descontinuadosMes,
                                    totals: totalEvolucao
                                };

                                // === 🔹 Sessões por Tipo de Beneficiário (RESTORED)
                                console.log("[DashAdmin] Calculando sessões por tipo de beneficiário...");
                                const mapaBeneTipo = {};
                                beneAtivos.forEach(b => {
                                    const convid = String(b.bene_convid);
                                    let tipo = 'convenio';
                                    if (convid === ID_PARTICULAR) tipo = 'particular';
                                    else if (b.bene_liminar === "Sim") tipo = 'liminar';
                                    mapaBeneTipo[String(b._id)] = tipo;
                                });

                                let sessoesParticular = 0, sessoesConvenio = 0, sessoesLiminar = 0;
                                agendaFiltrada.forEach(agenda => {
                                    const beneId = String(agenda.agenda_beneid);
                                    const tipo = mapaBeneTipo[beneId];
                                    if (tipo === 'particular') sessoesParticular++;
                                    else if (tipo === 'liminar') sessoesLiminar++;
                                    else sessoesConvenio++;
                                });

                                const resumoSessoesPorTipo = [
                                    { tipo: 'Particular', total: sessoesParticular, cor: '#2ecc71' },
                                    { tipo: 'Convênio', total: sessoesConvenio, cor: '#3498db' },
                                    { tipo: 'Liminar', total: sessoesLiminar, cor: '#e74c3c' }
                                ];
                                const totalSessoes = sessoesParticular + sessoesConvenio + sessoesLiminar;

                                console.table(resumoSessoesPorTipo);

                                // === 🔹 CONSULTA 2: Evolução de Atendimentos por Convênio ===
                                const categoriasInvalidas = ["Falta Absoluta", "Glosa", "Feriado", "Falta Justificada"];
                                const anoAtual = year;
                                const inicioAno = new Date(anoAtual, 0, 1);
                                const fimAno = new Date(anoAtual, 11, 31, 23, 59, 59, 999);

                                Atend.find({
                                    atend_atenddata: { $gte: inicioAno, $lte: fimAno },
                                    atend_categoria: { $nin: categoriasInvalidas }
                                }).then((atendimentos) => {
                                    const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
                                    const totaisMensais = new Array(12).fill(0);
                                    const porConvenio = {};

                                    atendimentos.forEach(a => {
                                        const convId = String(a.atend_convid);
                                        const mes = new Date(a.atend_atenddata).getMonth();
                                        totaisMensais[mes]++;
                                        porConvenio[convId] = porConvenio[convId] || new Array(12).fill(0);
                                        porConvenio[convId][mes]++;
                                    });

                                    const seriesConvenio = convs.map(c => ({
                                        nome: c.conv_nome,
                                        data: porConvenio[String(c._id)] || new Array(12).fill(0)
                                    }));

                                    const tabelaAtend = meses.map((m, i) => {
                                        const linha = { Mês: m, Total: totaisMensais[i] };
                                        convs.forEach(c => {
                                            const arr = porConvenio[String(c._id)] || [];
                                            linha[c.conv_nome] = arr[i] || 0;
                                        });
                                        return linha;
                                    });
                                    console.log(`📈 [DashAdmin] Evolução de Atendimentos por Convênio - ${anoAtual}`);
                                    console.table(tabelaAtend);

                                    const evolucaoAtendConv = {
                                        ano: anoAtual,
                                        labels: meses,
                                        totalMensal: totaisMensais,
                                        series: seriesConvenio
                                    };

                                    // === Renderização final ===
                                    res.render("dash/dashAdminin", {
                                        usuarios: todosUsuarios,
                                        convs,
                                        benes: beneAtivos,
                                        qtregs: convs.filter(c => c.conv_status === "Ativo").length,
                                        qtregsbene: beneAtivos.length,
                                        arrayRelQtValors: arrayRelQtValor,
                                        totalBene: beneAtivos.length,
                                        qtregsbenefiltrados: qtregsbenefiltrado,
                                        arrays: qtregsbenefiltrado,
                                        resumoSessoesPorTipo,
                                        totalSessoes,
                                        evolucaoBene,
                                        evolucaoAtendConv,
                                        dataIniFiltro: fncGeral.getDataFMT(seg).split(' ')[0],
                                        dataFimFiltro: fncGeral.getDataFMT(sex).split(' ')[0],
                                        resumoTerapiaNomecid: [],
                                        resumoTerapeuta: [],
                                        resumoDetalhado: []
                                    });

                                }).catch(err => {
                                    console.error("[DashAdmin] Erro ao calcular evolução de atendimentos:", err);
                                    res.status(500).send("Erro ao calcular evolução de atendimentos");
                                });

                            }).catch(err => {
                                console.error("[DashAdmin] Erro ao calcular evolução de beneficiários:", err);
                                res.status(500).send("Erro ao calcular evolução de beneficiários");
                            });

                        }).catch(err => {
                            console.error("[DashAdmin] Erro ao carregar usuários:", err);
                            res.status(500).send("Erro ao carregar usuários");
                        });
                    }).catch(err => {
                        console.error("[DashAdmin] Erro ao carregar beneficiários:", err);
                        res.status(500).send("Erro ao carregar beneficiários");
                    });
                }).catch(err => {
                    console.error("[DashAdmin] Erro ao carregar convênios:", err);
                    res.status(500).send("Erro ao carregar convênios");
                });
            }).catch(err => {
                console.error("[DashAdmin] Erro ao carregar agendas:", err);
                res.status(500).send("Erro ao carregar agendas");
            });
        }).catch(err => {
            console.error("[DashAdmin] Erro ao carregar terapias:", err);
            res.status(500).send("Erro ao carregar terapias");
        });
    }).catch(err => {
        console.error("[DashAdmin] Erro ao carregar terapeutas:", err);
        res.status(500).send("Erro ao carregar terapeutas");
    });
},



    carregaDashestatis(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Estatístico!")
            res.render("dash/dashEstatis", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Estatístico!")
            res.redirect('admin/erro')
        })

    }
}
