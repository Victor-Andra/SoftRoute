//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const convClass = require("../models/conv")//convenio
const beneClass = require("../models/bene")
const atendClass = require("../models/atend")
const fncCredit = require("../functions/fncCredit")
const fncGeral = require("../functions/fncGeral")
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")
const agenda = require("../models/agenda")
const ObjectId = require('mongodb').ObjectId;

//Tabelas Extrangeiras
const Atend = mongoose.model("tb_atend")
const Agenda = mongoose.model("tb_agenda")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Convimp = mongoose.model("tb_convimp")//Tabela dos Impostos vinvulados ao convênio, a quantidade de impostos e alíquotas variam para cada convênio.
const Credit = mongoose.model("tb_credit")
const Debit = mongoose.model("tb_debit")
const Tabil = mongoose.model("tb_tabil")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Sala = mongoose.model("tb_sala")

//Funções auxiliares
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
//carregaDashfinan(req,res){
module.exports = {
    carregaDashfinan(req,res){
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

        //res.render("dash/dashFinan"
    carregaDashadminin_Primeira(req,res){
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
    carregaDashadminin(req, res) {
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
