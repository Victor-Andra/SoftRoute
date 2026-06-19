//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
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
// ============================================
// FUNÇÕES AUXILIARES DO DASHBOARD (FORA do module.exports)
// ============================================

/**
 * Função auxiliar: Calcula as semanas (5 dias úteis) dentro de um período
 */
function calcularSemanas(dataIni, dataFim) {
    const semanas = [];
    if (!dataIni || !dataFim) return semanas;
    
    const inicio = new Date(dataIni);
    const fim = new Date(dataFim);
    
    // Avança até a próxima segunda-feira (getUTCDay: 0=dom, 1=seg, 2=ter...)
    while (inicio.getUTCDay() !== 1 && inicio <= fim) {
        inicio.setUTCDate(inicio.getUTCDate() + 1);
    }
    
    let atual = new Date(inicio);
    let numSemana = 1;
    
    while (atual <= fim) {
        const inicioSemana = new Date(atual);
        const fimSemana = new Date(atual);
        fimSemana.setUTCDate(fimSemana.getUTCDate() + 4); // sexta-feira
        
        // Se o fim da semana passar do período, ajusta para o dataFim
        if (fimSemana > fim) {
            fimSemana.setTime(fim.getTime());
        }
        
        semanas.push({
            numero: numSemana,
            inicio: new Date(inicioSemana),
            fim: new Date(fimSemana),
            label: `${formatarData(inicioSemana)} a ${formatarData(fimSemana)}`
        });
        
        // Próxima semana (+7 dias)
        atual.setUTCDate(atual.getUTCDate() + 7);
        numSemana++;
    }
    
    return semanas;
}

/**
 * Função auxiliar: Formata data para dd/mm
 */
function formatarData(data) {
    if (!data) return "";
    const d = new Date(data);
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}`;
}

/**
 * Função auxiliar: Formata data completa para exibição
 */
function formatarDataCompleta(data) {
    if (!data) return "";
    const d = new Date(data);
    const dia = String(d.getUTCDate()).padStart(2, '0');
    const mes = String(d.getUTCMonth() + 1).padStart(2, '0');
    const ano = d.getUTCFullYear();
    return `${dia}/${mes}/${ano}`;
}

/**
 * Função auxiliar: Formata o período selecionado para exibição no header
 */
function formatarPeriodo(filtroTela, dataIni, dataFim) {
    if (filtroTela.tipoData === "Ano/Mes" && filtroTela.anoAtend && filtroTela.mesAtend) {
        const meses = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
        return `${meses[filtroTela.mesAtend]}/${filtroTela.anoAtend}`;
    } else if (filtroTela.tipoData === "Dia" && filtroTela.dataFinal) {
        return formatarDataCompleta(new Date(filtroTela.dataFinal));
    } else if (filtroTela.tipoData === "Semana" && dataIni && dataFim) {
        return `${formatarDataCompleta(dataIni)} a ${formatarDataCompleta(dataFim)}`;
    } else if (filtroTela.tipoData === "Ano/Mes" && dataIni && dataFim) {
        return `${formatarDataCompleta(dataIni)} a ${formatarDataCompleta(dataFim)}`;
    }
    return "Período não definido";
}

/**
 * Função auxiliar: Busca terapeutas válidos (exclui perfil de diário de bordo)
 */
async function buscarTerapeutasValidos(db) {
    return await Usuario.find({
        usuario_status: "Ativo",
        // ✅ EXCLUSÃO CRÍTICA: Remove perfil de Diário de Bordo
        usuario_perfilid: { $ne: "6242191fa12aa557219a0fd9" },
        $or: [
            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
        ]
    }).sort({ usuario_nome: 1 }).lean();
}

/**
 * Função auxiliar: Processa agenda e calcula dados por terapeuta/semana
 */
function processarDadosAgenda(agenda, todosTerapeutas, semanas) {
    // 1. Identificar agendamentos PAI substituídos
    const idsPaisSubstituidos = new Set();
    agenda.forEach(a => {
        if (a.agenda_temp === true && a.agenda_tempId) {
            idsPaisSubstituidos.add(String(a.agenda_tempId));
        }
    });
    
    // 2. Filtrar agenda válida
    const agendaValida = agenda.filter(a => {
        // Excluir pai substituído
        if (idsPaisSubstituidos.has(String(a._id))) return false;
        // Excluir Falta Absoluta e Feriado
        if (a.agenda_categoria === "Falta Absoluta" || a.agenda_categoria === "Feriado") return false;
        return true;
    });
    
    // 3. Para cada terapeuta, calcular métricas por semana
    const dadosTerapeutas = todosTerapeutas.map(tera => {
        const dadosSemanais = semanas.map(semana => {
            const agendaTera = agendaValida.filter(a => {
                const dataAgenda = new Date(a.agenda_data);
                return String(a.agenda_usuid) === String(tera._id) &&
                       dataAgenda >= semana.inicio &&
                       dataAgenda <= semana.fim;
            });
            
            const atendimentos = agendaTera.length;
            const evolucoes = agendaTera.filter(a => a.agenda_selo === true || a.agenda_selo === "true").length;
            const percentual = atendimentos > 0 ? Math.round((evolucoes / atendimentos) * 100) : 0;
            
            return {
                atendimentos,
                evolucoes,
                percentual
            };
        });
        
        // Totais gerais do terapeuta
        const totalAtendimentos = dadosSemanais.reduce((sum, s) => sum + s.atendimentos, 0);
        const totalEvolucoes = dadosSemanais.reduce((sum, s) => sum + s.evolucoes, 0);
        const percentualTotal = totalAtendimentos > 0 ? Math.round((totalEvolucoes / totalAtendimentos) * 100) : 0;
        
        return {
            id: tera._id,
            nome: tera.usuario_nome,
            semanas: dadosSemanais,
            totalAtendimentos,
            totalEvolucoes,
            percentualTotal
        };
    });
    
    // 4. Totais gerais (cabeçalho)
    const totalAtendimentosGeral = dadosTerapeutas.reduce((sum, t) => sum + t.totalAtendimentos, 0);
    const totalEvolucoesGeral = dadosTerapeutas.reduce((sum, t) => sum + t.totalEvolucoes, 0);
    const percentualGeral = totalAtendimentosGeral > 0 ? Math.round((totalEvolucoesGeral / totalAtendimentosGeral) * 100) : 0;
    
    return { dadosTerapeutas, totalAtendimentosGeral, totalEvolucoesGeral, percentualGeral };
}


module.exports = {FiltroEvoatend,
    listaEvoatend2(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let flash = new Resposta();
        let agendaTempArr = [];
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let idsAgendasEx = [];
        let aux = 1;
        let seg = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);

        let sex = new Date();
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        dataIni = seg.toISOString();
        dataFim = sex.toISOString();
        //let agora = seg.toISOString();
        //let depois = sex.toISOString();
        //console.log("Listagem Realizada de Atendimentos!")
        Agenda.find({ agenda_data: { $gte : new Date(dataIni), $lte: new Date(dataFim) }, agenda_usuid : idTerapeuta }).then((agenda)=>{
            console.log("agenda: "+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })

            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }
            })
            
            agenda.forEach((a)=>{
                manter = "true";
                agendaTempArr.forEach((atr)=>{
                    if ((""+atr+"") == (""+a._id+"")){
                        manter = "false";
                    }
                })
                if (manter == "true"){
                    if (!(a.agenda_categoria == "Falta Justificada")){
                        idsAgendasEx.push(a);
                    }
                }
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            Terapia.find().then((terapia)=>{
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                console.log("Listagem Realizada de terapias")
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("area/evol/evoatendLis", {agendas: idsAgendasEx, anos: ano, terapias: terapia,usuarios: usuario, benes: bene, flash})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatend(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let flash = new Resposta();
        let agendaTempArr = [];
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
        let isAgendaTerapeuta = false; // 👉 Declarar variável
        
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        
        let idTerapeuta = req.cookies['idUsu'];
        let idsAgendasEx = [];
        let aux = 1;
        
        // 📅 Definir período da semana
        let seg = new Date();
        seg.setHours(0,0,0,0);
        let sex = new Date();
        sex.setHours(23,59,59,999);

        switch (seg.getUTCDay()){
            case 0: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
            case 1: sex.setUTCDate(sex.getUTCDate() + 4); break;
            case 2: seg.setUTCDate(seg.getUTCDate() - 1); sex.setUTCDate(sex.getUTCDate() + 3); break;
            case 3: seg.setUTCDate(seg.getUTCDate() - 2); sex.setUTCDate(sex.getUTCDate() + 2); break;
            case 4: seg.setUTCDate(seg.getUTCDate() - 3); sex.setUTCDate(sex.getUTCDate() + 1); break;
            case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
            case 6: seg.setUTCDate(seg.getUTCDate() - 5); sex.setUTCDate(sex.getUTCDate() - 1); break;
            default: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
        }
        
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();

        // 🔍 Buscar agendas da semana (apenas pais)
        Agenda.find({ 
            agenda_data: { $gte : new Date(dataIni), $lte: new Date(dataFim) }, 
            agenda_usuid : idTerapeuta, 
            agenda_temp: false 
        }).then((agenda)=>{
            
            // 📝 Formatação dos campos
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = String(dat.getUTCHours()).padStart(2, '0');
                let min = String(dat.getMinutes()).padStart(2, '0');
                e.agenda_hora = hora + ":" + min;
                e.agenda_aux = aux++;
                e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()];
            })

            // 🔗 Coletar IDs para buscar filhos
            let agendaTempIds = agenda.map(a => a._id);
            
            Agenda.find({ agenda_tempId: {$in: agendaTempIds} }).then((agendaS)=>{
                
                // 📝 Formatação dos filhos
                agendaS.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = fncGeral.getDataFMT(dat);
                    let hora = String(dat.getUTCHours()).padStart(2, '0');
                    let min = String(dat.getMinutes()).padStart(2, '0');
                    e.agenda_hora = hora + ":" + min;
                    e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()];
                })

                // 🧹 Montar lista final: pais sem filhos + filhos válidos
                let agendaFinal = [];
                
                // Adicionar pais que NÃO têm filhos
                agenda.forEach((a)=>{
                    let temFilho = agendaS.some(s => s.agenda_tempId?.toString() === a._id.toString());
                    if (!temFilho) {
                        agendaFinal.push(a);
                    }
                })

                // Adicionar filhos válidos (não é falta justificada/feriado e é do terapeuta)
                agendaS.forEach((s)=>{
                    if (s.agenda_categoria !== "Falta Justificada" && 
                        s.agenda_categoria !== "Feriado" && 
                        s.agenda_usuid?.toString() === idTerapeuta?.toString()) {
                        agendaFinal.push(s);
                    }
                });

                // 🎯 ORDENAÇÃO: DATA E HORA EM ORDEM DECRESCENTE (mais recente primeiro)
                agendaFinal.sort((a, b) => {
                    const dataA = new Date(a.agenda_data);
                    const dataB = new Date(b.agenda_data);
                    return dataA - dataB;  // ✅ Crescente: A - B
                });

                // 📦 Carregar dados auxiliares e renderizar
                Terapia.find().then((terapia)=>{
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        Bene.find().then((bene)=>{
                            // Ordenar beneficiários alfabeticamente (para o select/filtro)
                            bene.sort((a,b) => 
                                a.bene_nome?.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                .localeCompare(
                                    b.bene_nome?.normalize('NFD').replace(/[\u0300-\u036f]/g, ""), 
                                    'pt-BR'
                                )
                            );
                            bene.forEach((b)=>{ b.bene_nome = b.bene_nome?.replace(".","") });
                            
                            Usuario.find({
                                "usuario_status":"Ativo", 
                                $or: [
                                    {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                                    {"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                                ]
                            }).then((usuario)=>{
                                
                                res.render("area/evol/evoatendLis", {
                                    agendas: agendaFinal,  // ✅ Ordenado por data/hora decrescente
                                    anos: ano, 
                                    terapias: terapia,
                                    usuarios: usuario, 
                                    benes: bene, 
                                    flash
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log("❌ [ERRO] listaEvoatend:", err)
            req.flash("error_message", "Houve um erro ao realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend4(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let filtros = new fncGeral.Filtros();
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        let agendaTempArr = [];
        let agendaFinal = [];
        let agendaPadraoIds = [];
        let aux = 1;

        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_beneid: req.body.atendBeneficiario };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta }
                break;
        }

        Agenda.find(busca).then((agenda) =>{
            agenda = agenda.filter(a => (""+a.atend_categoria) !== "Feriado");
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        //console.log("erro");
                        break;
                }
            })

            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }  else {
                    agendaPadraoIds.push(as._id);
                }
            })

            agenda.forEach((as)=>{
                agendaTempIds.push(as._id);
            })

            Agenda.find({ agenda_tempId: {$in: agendaTempIds} }).then((agendaS)=>{
            
                agenda.forEach((a)=>{
                    manter = "true";
                    agendaTempArr.forEach((atr)=>{
                        if ((""+atr+"") == (""+a._id+"")){
                            manter = "false";
                        }
                    })
                    if (manter == "true"){
                        agendaFinal.push(a);
                    }
                })

                //agendaFinal.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                     Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("area/evol/evoatendLis", {agendas: agendaFinal, anos: ano, terapias: terapia,usuarios: usuario, benes: bene, flash, filtros})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend_OLD(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let filtros = new fncGeral.Filtros();
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;

        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false, agenda_beneid: req.body.atendBeneficiario };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
                break;
        }
        console.log("new Date(dataIni): "+new Date(dataIni))
        console.log("new Date(dataFim): "+new Date(dataFim))
        Agenda.find(busca).then((agenda) =>{
            //console.log("agenda: "+agenda.length)
            let agendaTempIds = [];
            let agendaFinal = [];
            agenda.forEach((as)=>{
                agendaTempIds.push(as._id);
            })

            Agenda.find({ agenda_tempId: {$in: agendaTempIds} }).then((agendaS)=>{
                let arrayExclusao = [];
                agendaS.forEach((as)=>{
                    arrayExclusao.push(as._id);
                })
                switch (tipoPessoa){
                    case "Geral":
                        busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } }
                        break;
                    case "Beneficiario":
                        busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } };
                        break;
                    default:
                        busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } }
                        break;
                }
                Agenda.find(busca).then((agendaFixa)=>{

                agenda.forEach((a)=>{
                    let ok = "true";
                    agendaS.forEach((s)=>{
                        if (("-"+s.agenda_tempId+"-") == ("-"+a._id+"-")) {
                            ok = "false";
                        }
                    })
                    if (ok == "true"){
                        agendaFinal.push(a);
                    }
                })

                agendaS.forEach((s)=>{
                    if (!(s.agenda_categoria == "Falta Absoluta")){
                        if (!(s.agenda_categoria == "Falta Justificada")){
                            if (!(s.agenda_categoria == "Feriado")){
                                if ((""+s.agenda_usuid+"") == (""+idTerapeuta+"")){
                                    agendaFinal.push(s);
                                }
                            }
                        }
                    }
                });

                agendaFixa.forEach((s)=>{
                    if (!(s.agenda_categoria == "Falta Absoluta")){
                        if (!(s.agenda_categoria == "Falta Justificada")){
                            if (!(s.agenda_categoria == "Feriado")){
                                agendaFinal.push(s);
                            }
                        }
                    }
                });
                agendaFinal.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = fncGeral.getDataFMT(dat);
                    let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                    let min = ""+dat.getMinutes();
                    if (hora.length == 1){hora = "0" + hora + "";}
                    if (min.length == 1){min = "0" + min + "";}
                    e.agenda_hora = hora+":"+min;
                    //console.log("aux:"+aux)
                    switch (dat.getUTCDay()){
                        case 0:
                            e.agenda_data_semana = "dom"
                            break;
                        case 1:
                            e.agenda_data_semana = "seg"
                            break;
                        case 2:
                            e.agenda_data_semana = "ter"
                            break;
                        case 3:
                            e.agenda_data_semana = "qua"
                            break;
                        case 4:
                            e.agenda_data_semana = "qui"
                            break;
                        case 5:
                            e.agenda_data_semana = "sex"
                            break;
                        case 6:
                            e.agenda_data_semana = "sab"
                            break;
                        default:
                            console.log("erro");
                            break;
                    }
                })
                agendaFinal.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                     Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("area/evol/evoatendLis", {agendas: agendaFinal, anos: ano, terapias: terapia,usuarios: usuario, benes: bene, flash, filtros})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend(req, res){
    let db = req.cookies['preferredDb'];
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
    Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

    let filtros = new fncGeral.Filtros();
    let lvlUsu = req.cookies['lvlUsu'];
    let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
    arrayIds.forEach((id)=>{
        if(id == lvlUsu){
            isAgendaTerapeuta = true;
        }
    })
    let idTerapeuta = req.cookies['idUsu'];
    let flash = new Resposta();
    let seg = new Date(req.body.dataFinal);
    let sex = new Date(req.body.dataFinal);
    seg.setHours(0);
    seg.setMinutes(0);
    seg.setSeconds(0);
    sex.setHours(23);
    sex.setMinutes(59);
    sex.setSeconds(59);
    let tipoPessoa = req.body.atendTipoPessoa;
    let tipoData = req.body.tipoData;

    switch (tipoData){
        case "Ano/Mes":
            dataIni = new Date();
            let mesIni = parseInt(req.body.mesAtend);
            let anoIni = parseInt(req.body.anoAtend);
            
            dataIni.setDate(01);
            dataIni.setFullYear(anoIni);
            dataIni.setUTCMonth(mesIni);
            dataIni.setSeconds(00);
            dataIni.setMinutes(00);
            dataIni.setHours(00);
            
            dataFim = new Date();
            dataFim.setFullYear(anoIni);
            dataFim.setUTCMonth(mesIni+1);
            dataFim.setDate(01);
            dataFim.setDate(dataFim.getDate()-1);
            dataFim.setHours(23);
            dataFim.setMinutes(59);
            dataFim.setSeconds(59);
            break;
        case "Semana":
            data = req.body.dataFinal;
            ano = data.substring(0,4);
            mes = data.substring(5,7);
            dia = data.substring(8,10);

            seg = new Date();
            seg.setFullYear(ano);
            seg.setUTCMonth(mes);
            seg.setUTCDate(dia);
            seg.setHours(0);
            seg.setMinutes(0);
            seg.setSeconds(0);

            sex = new Date();
            sex.setFullYear(ano);
            sex.setUTCMonth(mes);
            sex.setUTCDate(dia);
            sex.setHours(23);
            sex.setMinutes(59);
            sex.setSeconds(59);

            switch (seg.getUTCDay()){
                case 0: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                case 1: sex.setUTCDate(sex.getUTCDate() + 4); break;
                case 2: seg.setUTCDate(seg.getUTCDate() - 1); sex.setUTCDate(sex.getUTCDate() + 3); break;
                case 3: seg.setUTCDate(seg.getUTCDate() - 2); sex.setUTCDate(sex.getUTCDate() + 2); break;
                case 4: seg.setUTCDate(seg.getUTCDate() - 3); sex.setUTCDate(sex.getUTCDate() + 1); break;
                case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
                case 6: seg.setUTCDate(seg.getUTCDate() - 5); sex.setUTCDate(sex.getUTCDate() - 1); break;
                default: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
            }
            dataIni = seg.toISOString();
            dataFim = sex.toISOString();
            break;
        case "Dia":
            data = req.body.dataFinal;
            ano = data.substring(0,4);
            mes = data.substring(5,7);
            dia = data.substring(8,10);

            dataIni = new Date();
            dataIni.setFullYear(ano);
            dataIni.setUTCMonth(mes);
            dataIni.setUTCDate(dia);
            dataIni.setHours(0);
            dataIni.setMinutes(0);
            dataIni.setSeconds(0);

            dataFim = new Date();
            dataFim.setFullYear(ano);
            dataFim.setUTCMonth(mes);
            dataFim.setUTCDate(dia);
            dataFim.setHours(23);
            dataFim.setMinutes(59);
            dataFim.setSeconds(59);
            break;
        default:
            data = req.body.dataFinal;
            ano = data.substring(0,4);
            mes = data.substring(5,7);
            dia = data.substring(8,10);

            dataIni = new Date();
            dataIni.setFullYear(ano);
            dataIni.setUTCMonth(mes);
            dataIni.setUTCDate(dia);
            dataIni.setHours(0);
            dataIni.setMinutes(0);
            dataIni.setSeconds(0);

            dataFim = new Date();
            dataFim.setFullYear(ano);
            dataFim.setUTCMonth(mes);
            dataFim.setUTCDate(dia);
            dataFim.setHours(23);
            dataFim.setMinutes(59);
            dataFim.setSeconds(59);
            break;
    }

    switch (tipoPessoa){
        case "Geral":
            busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
            break;
        case "Beneficiario":
            busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false, agenda_beneid: req.body.atendBeneficiario };
            break;
        default:
            busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
            break;
    }

    Agenda.find(busca).then((agenda) =>{
        let agendaTempIds = [];
        let agendaFinal = [];
        agenda.forEach((as)=>{
            agendaTempIds.push(as._id);
        })

        Agenda.find({ agenda_tempId: {$in: agendaTempIds} }).then((agendaS)=>{
            let arrayExclusao = [];
            agendaS.forEach((as)=>{
                arrayExclusao.push(as._id);
            })
            switch (tipoPessoa){
                case "Geral":
                    busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } }
                    break;
                case "Beneficiario":
                    busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } };
                    break;
                default:
                    busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: true, _id: { $nin: arrayExclusao } }
                    break;
            }
            Agenda.find(busca).then((agendaFixa)=>{

                agenda.forEach((a)=>{
                    let ok = "true";
                    agendaS.forEach((s)=>{
                        if (("-"+s.agenda_tempId+"-") == ("-"+a._id+"-")) {
                            ok = "false";
                        }
                    })
                    if (ok == "true"){
                        agendaFinal.push(a);
                    }
                })

                agendaS.forEach((s)=>{
                    if (!(s.agenda_categoria == "Falta Absoluta")){
                        if (!(s.agenda_categoria == "Falta Justificada")){
                            if (!(s.agenda_categoria == "Feriado")){
                                if ((""+s.agenda_usuid+"") == (""+idTerapeuta+"")){
                                    agendaFinal.push(s);
                                }
                            }
                        }
                    }
                });

                agendaFixa.forEach((s)=>{
                    if (!(s.agenda_categoria == "Falta Absoluta")){
                        if (!(s.agenda_categoria == "Falta Justificada")){
                            if (!(s.agenda_categoria == "Feriado")){
                                agendaFinal.push(s);
                            }
                        }
                    }
                });

                // ========================================================================
                // 🎨 NOVO: Formatação + Detecção de Evolução Indevida
                // ========================================================================
                function getBadgeStyle(cat) {
                    const map = {
                        "Falta": "yellow",
                        "Falta Justificada": "orange",
                        "Falta Absoluta": "orange",
                        "Substituição": "cyan",
                        "SubstitutoFixo": "transparent",
                        "Feriado": "orange",
                        "default": "transparent"
                    };
                    const bg = map[cat] || map.default;
                    return `background-color: ${bg} !important; border: 1px solid transparent; color: #212529; display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 500; border-radius: 3px; white-space: nowrap; line-height: 1.3;`;
                }

                agendaFinal.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = fncGeral.getDataFMT(dat);
                    let hora = ""+dat.getUTCHours();
                    let min = ""+dat.getMinutes();
                    if (hora.length == 1){hora = "0" + hora + "";}
                    if (min.length == 1){min = "0" + min + "";}
                    e.agenda_hora = hora+":"+min;
                    
                    switch (dat.getUTCDay()){
                        case 0: e.agenda_data_semana = "dom"; break;
                        case 1: e.agenda_data_semana = "seg"; break;
                        case 2: e.agenda_data_semana = "ter"; break;
                        case 3: e.agenda_data_semana = "qua"; break;
                        case 4: e.agenda_data_semana = "qui"; break;
                        case 5: e.agenda_data_semana = "sex"; break;
                        case 6: e.agenda_data_semana = "sab"; break;
                        default: e.agenda_data_semana = "dom"; break;
                    }

                    // 🎨 BADGE STYLE baseado na categoria
                    const cat = e.agenda_categoria || "";
                    e.badgeStyle = getBadgeStyle(cat);

                    // 🚨 DETECÇÃO DE EVOLUÇÃO INDEVIDA (Falta Absoluta + evolução preenchida)
                    e.temEvolucaoIndevida = false;
                    if (cat === "Falta Absoluta" && 
                        e.agenda_evolucao && 
                        e.agenda_evolucao.toString().trim() !== "") {
                        
                        e.temEvolucaoIndevida = true;
                        e.simboloAlerta = "⚠️";
                        e.tooltipAlerta = "O atendimento virou Falta Absoluta. Você deve limpar a evolução clicando no ícone da borracha.";
                        
                        // Sobrescrever badgeStyle para laranja forte
                        e.badgeStyle = `
                            background-color: orange !important;
                            color: #212529 !important;
                            border: 1px solid transparent;
                            display: inline-block;
                            padding: 2px 6px;
                            font-size: 9px;
                            font-weight: 500;
                            border-radius: 3px;
                            white-space: nowrap;
                            line-height: 1.3;
                        `;
                    } else {
                        e.simboloAlerta = "";
                        e.tooltipAlerta = "";
                    }
                })

                agendaFinal.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));
                
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                            bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                                res.render("area/evol/evoatendLis", {
                                    agendas: agendaFinal, 
                                    anos: ano, 
                                    terapias: terapia,
                                    usuarios: usuario, 
                                    benes: bene, 
                                    flash, 
                                    filtros
                                })
                            })
                        })
                    })
                })
            })
        })
    }).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao Realizar as listas!")
        res.redirect('admin/erro')
    })
},
// ========================================================================
// 🧹 APAGAR EVOLUÇÃO INDEVIDA - VIEW EVOATEND
// ========================================================================
async apagarEvolucaoIndevidaevoatend(req, res) {
    try {
        const idAgenda = req.params.id;
        const idUsuario = req.cookies['idUsu'];
        const db = req.cookies['preferredDb'];
        
        if (!idUsuario || !db) {
            req.flash("error_message", "Sessão expirada. Faça login novamente.");
            return res.redirect('/menu/login');
        }
        
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const registro = await Agenda.findById(idAgenda);
        
        if (!registro) {
            req.flash("error_message", "Registro não encontrado.");
            return res.redirect('back');
        }
        
        if (registro.agenda_usuid.toString() !== idUsuario) {
            req.flash("error_message", "Você só pode apagar evoluções dos seus próprios registros.");
            return res.redirect('back');
        }
        
        if (registro.agenda_categoria !== "Falta Absoluta") {
            req.flash("error_message", "Esta ação só é permitida para registros de Falta Absoluta.");
            return res.redirect('back');
        }
        
        if (!registro.agenda_evolucao || registro.agenda_evolucao.toString().trim() === "") {
            req.flash("error_message", "Este registro não possui evolução para apagar.");
            return res.redirect('back');
        }
        
        registro.agenda_usuedi = idUsuario;
        registro.agenda_dataedi = new Date();
        registro.agenda_evolucao = "";
        registro.agenda_selo = false;
        
        await registro.save();
        
        console.log(`✅ [APAGAR EVOLUÇÃO EVOATEND] Registro ${idAgenda} | Usuário: ${idUsuario} | Data: ${registro.agenda_dataedi}`);
        
        req.flash("success_message", "Evolução apagada com sucesso!");
        return res.redirect('back');
        
    } catch (err) {
        console.error("❌ Erro ao apagar evolução (evoatend):", err);
        req.flash("error_message", "Erro ao apagar evolução. Tente novamente.");
        return res.redirect('back');
    }
},
    filtraEvoatend2(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let filtros = new fncGeral.Filtros();
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        let idsAgendasEx = [];
        let idsAgendasFixa = [];
        let agendaFinal;
        let buscaSemanal;
        
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false, agenda_beneid: req.body.atendBeneficiario };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_temp: false }
                break;
        }
        console.log("new Date(dataIni): "+new Date(dataIni))
        console.log("new Date(dataFim): "+new Date(dataFim))
        Agenda.find(busca).then((agenda) =>{
            console.log("agenda: "+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
                
                /*
                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
                */
                idsAgendasFixa.push(e._id)
            })

            buscaSemanal = { agenda_tempId: { $in : idsAgendasFixa } }
            Agenda.find(buscaSemanal).then((agendaSemanal) =>{
                agendaFinal = agenda.concat(agendaSemanal);

                agendaFinal.forEach((a)=>{
                    if (a.agendaTemp == true){
                        agendaFinal = agendaFinal.filter(i => (""+i._id+"") != (""+a.agenda_tempId+""));
                        
                        if (a.agenda_categoria == "Falta Justificada" || (a.agenda_categoria == "Substituicao" && (""+a.agenda_usuid+"") != idTerapeuta)){
                            agendaFinal = agendaFinal.filter(i => ((""+i._id+"") != (""+a.agenda_tempId+"") && (""+i._id+"") != (""+a._id+"")));
                        }
                        if (a.agenda_categoria == "Glosa" ){
                            agendaFinal = agendaFinal.filter(i => (""+i._id+"") != (""+a._id+""));
                        }
                    }
                    //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                })
                /* // caso seja para remover os agendamentos de falta e falta justificada da evolução da agenda 
                agenda.forEach((a)=>{
                    if (a.agenda_categoria == "Falta Justificada") {
                        agenda = agenda.filter(af => (""+af.agenda_tempId+"") != (""+a._id+""));
                        agenda = agenda.filter(af => (""+af.id+"") != (""+a.id+""));
                    }
                    if (a.agenda_categoria == "Substituição") {
                        agenda = agenda.filter(af => (""+af.agenda_tempId+"") != (""+a._id+""));
                        agenda = agenda.filter(af => (""+af.id+"") != (""+a.id+""));
                    }
                })
                */
                agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
                Terapia.find().then((terapia)=>{
                     Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    console.log("Listagem Realizada de terapias")
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                                res.render("area/evol/evoatendLis", {agendas: agenda, anos: ano, terapias: terapia,usuarios: usuario, benes: bene, flash, filtros})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaEvoatend(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Terapia.find().then((terapia)=>{
            console.log("Listagem Realizada de terapias")
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        console.log("Listagem Realizada de beneficiarios")
                        res.render("area/evoatendCad", {terapias: terapia, anos: ano, usuarios: usuario, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },
    carregaEvoatendEdi(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Terapia.find().then((terapia)=>{
            console.log("Listagem Realizada de terapias")
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada de beneficiarios")
                    res.render("area/evoatendEdi", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraEvoatend(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        
        evoatendClass.cadastraEvoatendFisio(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEvoatend(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
    listaEvoatendabertoOld(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
        
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            if (usuario) {
                
                usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
                Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }).then((bene) => {
                    if (bene) {
                        bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
                        res.render('area/evol/evoatendabertoLis', { terapeutas: usuario, benes: bene, flash });
                    } else {
                        console.log("Bene is undefined");
                        req.flash("error_message", "Houve um erro ao listar!");
                        res.redirect('admin/erro');
                    }
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_message", "Houve um erro ao listar!");
                    res.redirect('admin/erro');
                });
            } else {
                console.log("Usuario is undefined");
                req.flash("error_message", "Houve um erro ao listar!");
                res.redirect('admin/erro');
            }
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    listaEvoatendaberto(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();

        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }

        Usuario.find({
            "usuario_status": "Ativo",
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((usuario) => {
            if (usuario) {

                usuario.sort((a, b) => 
                    (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                    b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? 1 : 
                    (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                    a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? -1 : 0);

                Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }).then((bene) => {
                    if (bene) {

                        bene.sort((a, b) => 
                            (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                            b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? 1 : 
                            (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                            a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? -1 : 0);

                        // 🔥 Nova consulta adicionada: Ano.find()
                        Ano.find().sort({ ano_nome: 1 }).then((anos) => {
                            // Renderiza a view com os dados de usuario, bene e anos
                            res.render('area/evol/evoatendabertoLis', { 
                                terapeutas: usuario, 
                                benes: bene, 
                                anos: anos, // <-- Dados da tabela Ano
                                flash 
                            });
                        }).catch((err) => {
                            console.log("Erro ao buscar anos:", err);
                            req.flash("error_message", "Houve um erro ao listar os anos!");
                            res.redirect('admin/erro');
                        });

                    } else {
                        console.log("Bene is undefined");
                        req.flash("error_message", "Houve um erro ao listar!");
                        res.redirect('admin/erro');
                    }
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_message", "Houve um erro ao listar os beneficiários!");
                    res.redirect('admin/erro');
                });
            } else {
                console.log("Usuario is undefined");
                req.flash("error_message", "Houve um erro ao listar!");
                res.redirect('admin/erro');
            }
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar os usuários!");
            res.redirect('admin/erro');
        });
    },
    filtraEvoatendaberto(req, res, resposta){ //Lista evoluções Agendadas em aberto ou seja evolução não realizada
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let flash = new Resposta();
        let agendaTempArr = [];
        let idsAgendasEx = [];
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_selo: false }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_beneid: req.body.atendBeneficiario, agenda_selo: false };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: req.body.atendTerapeuta, agenda_selo: false };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_selo: false }
                break;
        }
        Agenda.find(busca).then((agenda) =>{
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }
            })
            
            agenda.forEach((a)=>{
                manter = "true";
                agendaTempArr.forEach((atr)=>{
                    if ((""+atr+"") == (""+a._id+"")){
                        manter = "false";
                    }
                })
                if (manter == "true"){
                    if (!(a.agenda_categoria == "Falta Justificada")){
                        idsAgendasEx.push(a);
                    }
                }
            })
             Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        Sala.find().then((sala)=>{
                            sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                            Terapia.find().then((terapia)=>{
                                Conv.find().then((conv)=>{
                                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    res.render('area/evol/evoatendabertoLis', {agendas: idsAgendasEx, anos: ano, benes: bene, terapeutas: usuario, salas: sala, terapias: terapia, convs: conv, flash})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendfechado(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
                     Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                res.render('area/evol/evoatendfechadoLis', { terapeutas: usuario, anos: ano, benes: bene, flash, anos: ano});
            })})}).catch((err) => {
                console.log(err);
                req.flash("error_message", "Houve um erro ao listar!");
                res.redirect('admin/erro');
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    filtraEvoatendfechado(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        filtroTela = new FiltroEvoatend();
        let agendaTempArr = [];
        let idsAgendasEx = [];
        filtroTela.tipoData = req.body.tipoData;
        filtroTela.dataFinal = req.body.dataFinal;
        filtroTela.anoAtend = req.body.anoAtend;
        filtroTela.mesAtend = req.body.mesAtend;
        filtroTela.tipoPessoa = req.body.atendTipoPessoa;
        filtroTela.atendTerapeuta = req.body.atendTerapeuta;
        filtroTela.atendBeneficiario = req.body.atendBeneficiario;
        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_selo: true }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_beneid: req.body.atendBeneficiario, agenda_selo: true };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: req.body.atendTerapeuta, agenda_selo: true };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_selo: true }
                break;
        }
        
        Agenda.find(busca).then((agenda) =>{
            console.log("agenda: "+agenda.length)
            agenda.forEach((e)=>{
                console.log("agendaselo:"+e.agenda_selo)
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }
            })
            
            agenda.forEach((a)=>{
                manter = "true";
                agendaTempArr.forEach((atr)=>{
                    if ((""+atr+"") == (""+a._id+"")){
                        manter = "false";
                    }
                })
                if (manter == "true"){
                    if (!(a.agenda_categoria == "Falta Justificada")){
                        idsAgendasEx.push(a);
                    }
                }
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
             Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        Sala.find().then((sala)=>{
                            sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                            Terapia.find().then((terapia)=>{
                                Conv.find().then((conv)=>{
                                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    res.render('area/evol/evoatendfechadoLis', {anos: ano, agendas: idsAgendasEx,terapeutas: usuario, benes: bene, salas: sala, terapias: terapia, convs: conv, horaages: horaage, filtroTela, flash})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendgeral(req, res, resposta) {
        const db = req.cookies['preferredDb'];
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

       // Na captura dos filtros:
        const filtroTela = {
            tipoData: req.body.tipoData || "Ano/Mes",
            // ✅ Corrige a prioridade dos campos de data
            dataFinal: req.body.dataFinal || req.body.dataFinal || "",
            anoAtend: req.body.anoAtend || "",
            mesAtend: req.body.mesAtend || "",
            tipoPessoa: req.body.atendTipoPessoa || "Geral",
            atendTerapeuta: req.body.atendTerapeuta || "",
            atendBeneficiario: req.body.atendBeneficiario || "",
            // ✅ Verifica se o campo existe na view antes de usar
            atendConcluido: req.body.AtendConcluido || "Todos", 
            atendSelo: req.body.atendSelo || "Todos"
        };

        // ===== LOG DE DEBUG (ajuda a identificar o problema) =====
        console.log('🔍 [DEBUG] Filtros recebidos:', JSON.stringify(filtroTela, null, 2));

        let dataIni = null;
        let dataFim = null;
        const flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
    
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
            console.log("tamanho"+usuario.length)
             Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
                res.render('area/evol/evoatendgeralLis', { terapeutas: usuario, anos: ano, benes: bene, flash });
            })})}).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    filtraEvoatendgeralOLD(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        filtroTela = new FiltroEvoatend();
        let agendaTempArr = [];
        let idsAgendasEx = [];
        filtroTela.tipoData = req.body.tipoData;
        filtroTela.dataFinal = req.body.dataFinal;
        filtroTela.anoAtend = req.body.anoAtend;
        filtroTela.mesAtend = req.body.mesAtend;
        filtroTela.tipoPessoa = req.body.atendTipoPessoa;
        filtroTela.atendTerapeuta = req.body.atendTerapeuta;
        filtroTela.atendBeneficiario = req.body.atendBeneficiario;
        let atendConcluido = req.body.AtendConcluido;

        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(00);
                dataIni.setMinutes(00);
                dataIni.setHours(00);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }}
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: req.body.atendTerapeuta };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }
        
        Agenda.find(busca).then((agenda) =>{
            console.log("agenda: "+agenda.length)
            agenda.forEach((e)=>{
                console.log("agendaselo:"+e.agenda_selo)
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }
            })
            
            agenda.forEach((a)=>{
                manter = "true";
                agendaTempArr.forEach((atr)=>{
                    if ((""+atr+"") == (""+a._id+"")){
                        manter = "false";
                    }
                })
                if (manter == "true"){
                    //if (!(a.agenda_categoria == "Falta Justificada")){//Passivel a revert
                        idsAgendasEx.push(a);
                    //}
                }
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        Sala.find().then((sala)=>{
                            sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                            Terapia.find().then((terapia)=>{
                                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                    Conv.find().then((conv)=>{
                                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        res.render('area/evol/evoatendgeralLis', {agendas: idsAgendasEx, anos: ano, terapeutas: usuario, benes: bene, salas: sala, terapias: terapia, convs: conv, horaages: horaage, filtroTela, flash})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    async filtraEvoatendgeral_140526(req, res) {
        try {
            // ===== CONFIGURAÇÃO =====
            const db = req.cookies['preferredDb'];
            const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
            const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
            const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

            // ===== CAPTURA DOS FILTROS COM PERSISTÊNCIA =====
            const filtroTela = {
                tipoData: req.body.tipoData || "",
                dataFinal: req.body.dataFinal || "",
                anoAtend: req.body.anoAtend || "",
                mesAtend: req.body.mesAtend || "",
                tipoPessoa: req.body.atendTipoPessoa || "",
                atendTerapeuta: req.body.atendTerapeuta || "",
                atendBeneficiario: req.body.atendBeneficiario || "",
                atendConcluido: req.body.AtendConcluido || "Todos",
                atendSelo: req.body.atendSelo || "Todos" // <-- NOVO: filtro de selo
            };

        // ===== CÁLCULO DO PERÍODO (UTC para evitar timezone) =====
            let dataIni = null;
            let dataFim = null;

            switch (filtroTela.tipoData) {
                case "Ano/Mes": {
                    const mes = parseInt(filtroTela.mesAtend);   // 0-11 do select
                    const ano = parseInt(filtroTela.anoAtend);
                    if (!isNaN(mes) && !isNaN(ano)) {
                        dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0));
                        dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59));
                    }
                    break;
                }
                
                case "Semana":
                case "Dia": {
                    // ✅ Usa dataFil direto do form (formato: YYYY-MM-DD)
                    const dataStr = req.body.dataFil || filtroTela.dataFinal;
                    if (dataStr && dataStr.length >= 10) {
                        const [ano, mes, dia] = dataStr.substring(0, 10).split('-').map(Number);
                        
                        // input date retorna mês 1-12, Date.UTC espera 0-11 → subtrai 1
                        const dataBase = new Date(Date.UTC(ano, mes - 1, dia, 12, 0, 0));
                        
                        if (filtroTela.tipoData === "Dia") {
                            dataIni = new Date(Date.UTC(ano, mes - 1, dia, 0, 0, 0));
                            dataFim = new Date(Date.UTC(ano, mes - 1, dia, 23, 59, 59));
                        } else {
                            // ===== Lógica da semana (segunda a sexta) =====
                            const diaSemana = dataBase.getUTCDay(); // 0=dom, 1=seg, ..., 6=sab
                            const diffs = { 0: -6, 1: 0, 2: -1, 3: -2, 4: -3, 5: -4, 6: -5 }; // ajuste pra segunda
                            const diffSeg = diffs[diaSemana] ?? 0;
                            
                            dataIni = new Date(Date.UTC(ano, mes - 1, dia + diffSeg, 0, 0, 0));
                            dataFim = new Date(Date.UTC(ano, mes - 1, dia + diffSeg + 4, 23, 59, 59)); // +4 = sexta
                        }
                    }
                    break;
                }
            }
            

            // ===== MONTAGEM DA QUERY =====
            const busca = {};

            // Filtro de data
            if (dataIni && dataFim) {
                busca.agenda_data = { $gte: dataIni, $lte: dataFim };
            }

            // Filtro por tipo de pessoa
            if (filtroTela.tipoPessoa === "Beneficiario" && filtroTela.atendBeneficiario) {
                busca.agenda_beneid = filtroTela.atendBeneficiario;
            } else if (filtroTela.tipoPessoa === "Terapeuta" && filtroTela.atendTerapeuta) {
                busca.agenda_usuid = filtroTela.atendTerapeuta;
            }

            // Filtro "Concluído" (mantido - legacy)
            if (filtroTela.atendConcluido === "Sim") {
                busca.agenda_selo = { $in: [true, "true", 1, "1"] };
            } else if (filtroTela.atendConcluido === "Não") {
                busca.agenda_selo = { $in: [false, "false", 0, "0", null, undefined] };
            }

            // <-- NOVO FILTRO: atendSelo (independente do Concluído)
            if (filtroTela.atendSelo && filtroTela.atendSelo !== "Todos") {
                // Se ambos os filtros estiverem ativos, o atendSelo sobrescreve para maior controle
                busca.agenda_selo = (filtroTela.atendSelo === "Sim");
            }

            // ===== CONSULTA PRINCIPAL =====
            let agenda = await Agenda.find(busca).lean();

            // ===== PROCESSAMENTO DOS DADOS =====
            const agendaTempIds = new Set();
            
            agenda.forEach(e => {
                const dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                e.agenda_hora = `${String(dat.getUTCHours()).padStart(2,'0')}:${String(dat.getMinutes()).padStart(2,'0')}`;
                e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()] || "";
                
                if (String(e.agenda_temp) === "true") {
                    agendaTempIds.add(String(e.agenda_tempId));
                }
            });

            // Remove agendas temporárias e ordena
            const agendasFiltradas = agenda
                .filter(a => !agendaTempIds.has(String(a._id)))
                .sort((a, b) => (a.agenda_benenome || "").localeCompare(b.agenda_benenome || "", 'pt-BR'));

            // ===== BUSCAS AUXILIARES EM PARALELO =====
            const [bene, usuario, horaage, sala, terapia, ano, conv] = await Promise.all([
                Bene.find().lean(),
                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"] }}
                    ]
                }).lean(),
                Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).lean(),
                Sala.find().lean(),
                Terapia.find().lean(),
                Ano.find().sort({ ano_nome: 1 }).lean(),
                Conv.find().lean()
            ]);

            // Ordenações auxiliares
            const sortPtBr = (a, b, field) => (a[field]||"").localeCompare(b[field]||"", 'pt-BR');
            bene.sort((a,b) => sortPtBr(a,b,'bene_nome'));
            usuario.sort((a,b) => sortPtBr(a,b,'usuario_nome'));
            sala.sort((a,b) => sortPtBr(a,b,'sala_nome'));
            conv.sort((a,b) => sortPtBr(a,b,'conv_nome'));

            // ===== RENDER COM PERSISTÊNCIA GARANTIDA =====
            res.render('area/evol/evoatendgeralLis', {
                agendas: agendasFiltradas,
                anos: ano,
                terapeutas: usuario,
                benes: bene,
                salas: sala,
                terapias: terapia,
                convs: conv,
                horaages: horaage,
                filtroTela, // <-- Contém TODOS os filtros, incluindo atendSelo
                flash,
                carregaFiltro: { carregaFiltro: "true" } // <-- Garante que o JS da view recarregue os filtros
            });

        } catch (err) {
            console.error('Erro em filtraEvoatendgeral:', err);
            req.flash("error_message", "Houve um erro ao listar as evoluções!");
            res.redirect('/admin/erro');
        }
    },
    async filtraEvoatendgeral(req, res) {
        try {
            // ===== CONFIGURAÇÃO =====
            const db = req.cookies['preferredDb'];
            const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
            const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
            const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

        // Na captura dos filtros:
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

            // console.log('🔍 [DEBUG] Filtros recebidos:', JSON.stringify(filtroTela, null, 2));

            let dataIni = null;
            let dataFim = null;
            let seg;
            let sex;
            let anoAtend;
            let mes;
            let dia;
            const flash = new Resposta();

            switch (filtroTela.tipoData){
                case "Ano/Mes":
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(req.body.anoAtend, req.body.mesAtend));

                    break;
                case "Semana":
                    ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(new Date(req.body.dataFinal)));
                    
                    break;
                case "Dia":
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(req.body.dataFinal));

                    break;
                default:
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoDia('2000-01-01'));
                    break;
            }

            const busca = {};

            // Filtro de data (só aplica se as datas forem válidas)
            if (dataIni && dataFim && !isNaN(dataIni.getTime()) && !isNaN(dataFim.getTime())) {
                busca.agenda_data = { $gte: dataIni, $lte: dataFim };
            } else {
                console.warn('⚠️ Datas inválidas - query sem filtro de data!');
            }

            // Filtro por tipo de pessoa
            if (filtroTela.tipoPessoa === "Beneficiario" && filtroTela.atendBeneficiario) {
                busca.agenda_beneid = filtroTela.atendBeneficiario;
            } else if (filtroTela.tipoPessoa === "Terapeuta" && filtroTela.atendTerapeuta) {
                busca.agenda_usuid = filtroTela.atendTerapeuta;
            }

            // Filtro "Concluído" (legacy - mantido por compatibilidade)
            if (filtroTela.atendConcluido === "Sim") {
                busca.agenda_selo = { $in: [true, "true", 1, "1"] };
            } else if (filtroTela.atendConcluido === "Não") {
                busca.agenda_selo = { $in: [false, "false", 0, "0", null, undefined] };
            }

            busca.agenda_temp = false;

            // Filtro atendSelo (sobrescreve o Concluído se estiver ativo)
            if (filtroTela.atendSelo && filtroTela.atendSelo !== "Todos") {
                busca.agenda_selo = (filtroTela.atendSelo === "Sim");
                console.log(`🏷️ Filtro Selo aplicado: ${filtroTela.atendSelo}`);
            }

            console.log('🔎 [DEBUG] Query MongoDB:', JSON.stringify(busca, null, 2));

            // ===== CONSULTA PRINCIPAL (com timeout pra evitar travamento) =====
            let agenda = [];
            try {
                agenda = await Agenda.find(busca)
                    .lean()
                    .maxTimeMS(60000); // Timeout de 60 segundos
                console.log(`✅ Encontrados ${agenda.length} registros`);
            } catch (queryErr) {
                console.error('❌ Erro na query do Agenda:', queryErr);
                throw new Error('Erro ao buscar agendamentos. Verifique os filtros ou contate o suporte.');
            }

            let agendaTempIds = [];
            agenda.forEach(e => {
                agendaTempIds.push(e._id);
            })

            const buscaS = {};

            // Filtro de data (só aplica se as datas forem válidas)
            if (dataIni && dataFim && !isNaN(dataIni.getTime()) && !isNaN(dataFim.getTime())) {
                buscaS.agenda_data = { $gte: dataIni, $lte: dataFim };
            } else {
                console.warn('⚠️ Datas inválidas - query sem filtro de data!');
            }

            // Filtro por tipo de pessoa
            if (filtroTela.tipoPessoa === "Beneficiario" && filtroTela.atendBeneficiario) {
                buscaS.agenda_beneid = filtroTela.atendBeneficiario;
            } else if (filtroTela.tipoPessoa === "Terapeuta" && filtroTela.atendTerapeuta) {
                buscaS.agenda_usuid = filtroTela.atendTerapeuta;
            }

            // Filtro "Concluído" (legacy - mantido por compatibilidade)
            if (filtroTela.atendConcluido === "Sim") {
                buscaS.agenda_selo = { $in: [true, "true", 1, "1"] };
            } else if (filtroTela.atendConcluido === "Não") {
                buscaS.agenda_selo = { $in: [false, "false", 0, "0", null, undefined] };
            }

            buscaS.agenda_temp = true;

            // Filtro atendSelo (sobrescreve o Concluído se estiver ativo)
            if (filtroTela.atendSelo && filtroTela.atendSelo !== "Todos") {
                buscaS.agenda_selo = (filtroTela.atendSelo === "Sim");
                console.log(`🏷️ Filtro Selo aplicado: ${filtroTela.atendSelo}`);
            }

            let agendaS = [];
            agendaTempIds.forEach((sss)=>{
                console.log("9ds? "+sss)
            })
            try {
                agendaS = await Agenda.find({
                    $or: [
                        {
                            ...buscaS,
                            agenda_tempId: {
                                $nin: agendaTempIds
                            }
                        },
                        {
                            agenda_tempId: {
                                $in: agendaTempIds
                            }
                        }
                    ]
                }).lean().maxTimeMS(60000);
                console.log(`✅ Encontrados ${agendaS.length} registros`);
            } catch (queryErr) {
                console.error('❌ Erro na query do AgendaS:', queryErr);
                throw new Error('Erro ao buscar agendamentos. Verifique os filtros ou contate o suporte.');
            }
            agenda.forEach(eee => {
                console.log("agenda? "+eee)
            })
            agendaS.forEach(aaa => {
                console.log("agendaS? "+aaa)
            })

            // ===== PROCESSAMENTO DOS DADOS =====
            const idsAgendasEx = new Set(agendaS.filter(a => a.agenda_tempId).map(a => String(a.agenda_tempId)));

            agenda = agenda.filter(
                a => !idsAgendasEx.has(String(a._id))
            );

            agendaS = agendaS.filter(a => String(a.agenda_usuid) === String(filtroTela.atendTerapeuta));

            agenda.push(...agendaS);

            agenda.forEach(e => {
                try {
                    const dat = new Date(e.agenda_data);
                    if (!isNaN(dat.getTime())) {
                        e.agenda_data_dia = fncGeral.getDataFMT(dat);
                        e.agenda_hora = `${String(dat.getUTCHours()).padStart(2,'0')}:${String(dat.getMinutes()).padStart(2,'0')}`;
                        e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()] || "";
                    }
                    
                } catch (procErr) {
                    console.warn('⚠️ Erro ao processar registro:', e._id, procErr.message);
                }
            });

            // Remove agendas temporárias e ordena
            var agendasFiltradas = agenda.sort((a, b) => (a.agenda_benenome || "").localeCompare(b.agenda_benenome || "", 'pt-BR'));

            

            // ===== BUSCAS AUXILIARES EM PARALELO =====
            const [bene, usuario, horaage, sala, terapia, ano, conv] = await Promise.all([
                Bene.find().lean(),
                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"] }}
                    ]
                }).lean(),
                Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).lean(),
                Sala.find().lean(),
                Terapia.find().lean(),
                Ano.find().sort({ ano_nome: 1 }).lean(),
                Conv.find().lean()
            ]);

            // Ordenações auxiliares
            const sortPtBr = (a, b, field) => (a[field]||"").localeCompare(b[field]||"", 'pt-BR');
            bene.sort((a,b) => sortPtBr(a,b,'bene_nome'));
            usuario.sort((a,b) => sortPtBr(a,b,'usuario_nome'));
            sala.sort((a,b) => sortPtBr(a,b,'sala_nome'));
            conv.sort((a,b) => sortPtBr(a,b,'conv_nome'));

            // ===== PREPARA FILTROS FORMATADOS PARA EXIBIÇÃO NO HEADER =====
            const filtrosDisplay = {
                periodo: "",
                pessoa: "",
                nome: ""
            };
            
            if (filtroTela.tipoData === "Ano/Mes" && filtroTela.anoAtend && filtroTela.mesAtend) {
                const meses = ["Jan","Fev","Mar","Abr","Mai","Jun","Jul","Ago","Set","Out","Nov","Dez"];
                filtrosDisplay.periodo = `${meses[filtroTela.mesAtend]}/${filtroTela.anoAtend}`;
            } else if (filtroTela.tipoData === "Dia" && filtroTela.dataFinal) {
                filtrosDisplay.periodo = fncGeral.getDataFMT(new Date(filtroTela.dataFinal));
            } else if (filtroTela.tipoData === "Semana" && dataIni && dataFim) {
                const ini = fncGeral.getDataFMT(dataIni);
                const fim = fncGeral.getDataFMT(dataFim);
                filtrosDisplay.periodo = `${ini} a ${fim}`;
            }
            
            if (filtroTela.tipoPessoa === "Beneficiario" && filtroTela.atendBeneficiario) {
                const beneSel = bene.find(b => String(b._id) === filtroTela.atendBeneficiario);
                filtrosDisplay.pessoa = "Beneficiário";
                filtrosDisplay.nome = beneSel?.bene_nome || "Selecionado";
            } else if (filtroTela.tipoPessoa === "Terapeuta" && filtroTela.atendTerapeuta) {
                const teraSel = usuario.find(u => String(u._id) === filtroTela.atendTerapeuta);
                filtrosDisplay.pessoa = "Terapeuta";
                filtrosDisplay.nome = teraSel?.usuario_nome || "Selecionado";
            } else {
                filtrosDisplay.pessoa = "Geral";
                filtrosDisplay.nome = "";
            }

            // ===== RENDER COM PERSISTÊNCIA GARANTIDA =====
            res.render('area/evol/evoatendgeralLis', {
                agendas: agendasFiltradas,
                anos: ano,
                terapeutas: usuario,
                benes: bene,
                salas: sala,
                terapias: terapia,
                convs: conv,
                horaages: horaage,
                filtroTela: filtroTela,              // ✅ Persistência dos valores brutos
                filtrosDisplay,          // ✅ Dados formatados pra exibir no header
                flash,
                carregaFiltro: { carregaFiltro: "true" }
            });

        } catch (err) {
            console.error('❌ Erro CRÍTICO em filtraEvoatendgeral:', err);
            req.flash("error_message", "Houve um erro ao listar as evoluções: " + err.message);
            res.redirect('/admin/erro');
        }
    },

    listaEvoatendranking_OLD(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();

        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }

        Usuario.find({
            "usuario_status": "Ativo",
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((usuario) => {
            if (usuario && usuario.length > 0) {
                usuario.sort((a, b) => 
                    (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                    b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? 1 : 
                    (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                    a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? -1 : 0);

                Bene.find({ bene_status: "Ativo" }).then((bene) => {
                    if (bene && bene.length > 0) {
                        bene.sort((a, b) => 
                            (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                            b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? 1 : 
                            (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                            a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) ? -1 : 0);

                        // 🔥 Nova consulta adicionada: Ano.find()
                        Ano.find().sort({ ano_nome: 1 }).then((anos) => {
                            res.render('area/evol/evoatendrankingLis', {
                                terapeutas: usuario,
                                benes: bene,
                                anos: anos, // <-- Dados da tabela/modelo Ano
                                flash
                            });
                        }).catch((err) => {
                            console.log("Erro ao buscar anos:", err);
                            req.flash("error_message", "Houve um erro ao carregar os anos!");
                            res.redirect('admin/erro');
                        });

                    } else {
                        console.log("Bene is undefined or empty");
                        req.flash("error_message", "Nenhum beneficiário encontrado!");
                        res.redirect('admin/erro');
                    }
                }).catch((err) => {
                    console.log("Erro ao buscar beneficiários:", err);
                    req.flash("error_message", "Houve um erro ao listar os beneficiários!");
                    res.redirect('admin/erro');
                });

            } else {
                console.log("Usuario is undefined or empty");
                req.flash("error_message", "Nenhum usuário encontrado!");
                res.redirect('admin/erro');
            }
        }).catch((err) => {
            console.log("Erro ao buscar usuários:", err);
            req.flash("error_message", "Houve um erro ao listar os usuários!");
            res.redirect('admin/erro');
        });
    },
    xfiltraEvoatendranking(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(0o1);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(0o0);
                dataIni.setMinutes(0o0);
                dataIni.setHours(0o0);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(0o1);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }}
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: req.body.atendTerapeuta };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }
        
        Agenda.find(busca).then((agenda) =>{
            console.log("agenda: "+agenda.length)
            agenda.forEach((e)=>{
                console.log("agendaselo:"+e.agenda_selo)
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        Sala.find().then((sala)=>{
                            sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                            Terapia.find().then((terapia)=>{
                                Conv.find().then((conv)=>{
                                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    res.render('area/evol/evoatendrankingLis', {agendas: agenda,terapeutas: usuario, benes: bene, salas: sala, terapias: terapia, convs: conv, horaages: horaage, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatendranking_OLD(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        let flash = new Resposta();
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        switch (tipoData){
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoAtend);
                
                dataIni.setDate(0o1);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setSeconds(0o0);
                dataIni.setMinutes(0o0);
                dataIni.setHours(0o0);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(0o1);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setUTCDate(dia);
                seg.setHours(0);
                seg.setMinutes(0);
                seg.setSeconds(0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setUTCDate(dia);
                sex.setHours(23);
                sex.setMinutes(59);
                sex.setSeconds(59);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                //console.log("req.body.dataFinal:"+req.body.dataFinal)
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                
                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setUTCDate(dia);
                dataIni.setHours(0);
                dataIni.setMinutes(0);
                dataIni.setSeconds(0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setUTCDate(dia);
                dataFim.setHours(23);
                dataFim.setMinutes(59);
                dataFim.setSeconds(59);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }}
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: req.body.atendTerapeuta };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }
        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        Agenda.find(busca).then((agendas) => {
          console.log("at:length: " + agendas.length);
          agenda.forEach((e)=>{
            console.log("agendaselo:"+e.agenda_selo)
            let dat = new Date(e.agenda_data);
            e.agenda_data_dia = fncGeral.getDataFMT(dat);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            e.agenda_hora = hora+":"+min;
            //console.log("aux:"+aux)
            switch (dat.getUTCDay()){
                case 0:
                    e.agenda_data_semana = "dom"
                    break;
                case 1:
                    e.agenda_data_semana = "seg"
                    break;
                case 2:
                    e.agenda_data_semana = "ter"
                    break;
                case 3:
                    e.agenda_data_semana = "qua"
                    break;
                case 4:
                    e.agenda_data_semana = "qui"
                    break;
                case 5:
                    e.agenda_data_semana = "sex"
                    break;
                case 6:
                    e.agenda_data_semana = "sab"
                    break;
                default:
                    
                    console.log("erro");
                    break;
            }
        })
          const contagemPorUsuario = agendas.reduce((acc, agenda) => {
            acc[agenda.agenda_usuid] = (acc[agenda.agenda_usuid] || 0) + 1;
            return acc;
          }, {});
      
          // Contagem de agendamentos com bene_selo true
          const contagemBeneSeloTrue = agendas.reduce((acc, agenda) => {
            if (agenda.agenda_selo === true) {
              acc++;
            }
            return acc;
          }, 0);
      
          // Contagem de agendamentos com bene_selo false, null ou indefinido
          const contagemBeneSeloFalseOrNullUndefined = agendas.reduce((acc, agenda) => {
            if (agenda.agenda_selo === false || agenda.agenda_selo == null) {
              acc++;
            }
            return acc;
          }, 0);
      
          // Criar campo com a divisão entre a contagem por bene_selo true e a contagem de bene_usuid
          const divisaoBeneSeloTrue = Object.keys(contagemPorUsuario).reduce((acc, key) => {
            acc[key] = contagemBeneSeloTrue / (contagemPorUsuario[key] || 1);
            return acc;
          }, {});
      
          // Criar campo com a divisão entre a contagem por bene_selo false ou null ou indefinido e a contagem de bene_usuid
          const divisaoBeneSeloFalseOrNullUndefined = Object.keys(contagemPorUsuario).reduce((acc, key) => {
            acc[key] = contagemBeneSeloFalseOrNullUndefined / (contagemPorUsuario[key] || 1);
            return acc;
          }, {});
      
          console.log("Contagem por bene_usuid:", contagemPorUsuario);
          console.log("Contagem bene_selo true:", contagemBeneSeloTrue);
          console.log("Contagem bene_selo false, null ou indefinido:", contagemBeneSeloFalseOrNullUndefined);
          console.log("Divisão bene_selo true:", divisaoBeneSeloTrue);
          console.log("Divisão bene_selo false, null ou indefinido:", divisaoBeneSeloFalseOrNullUndefined);
      
          //res.render("atendimento/relatendvalcons", {agendas: agenda, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
          res.render("area/evol/evoatendrankingLis", {
            agendas,
            contagemPorUsuario,
            contagemBeneSeloTrue,
            contagemBeneSeloFalseOrNullUndefined,
            divisaoBeneSeloTrue,
            divisaoBeneSeloFalseOrNullUndefined,
          });
        });
      },
    removeEvolucaoF(req,res,resposta){
        let resultado;
        let flash = new Resposta()
        if (resposta.sucesso == "true" || resposta.sucesso == "false"){
            flash.sucesso = resposta.sucesso;
            flash.texto = resposta.texto;
        }
        agendaClass.removeEvolucao(req,res).then((retorno)=>{
            resultado = retorno;
        }).catch((err) => {
            console.log(err)
            resultado = err;
        }).finally(() => {
            if(resultado == "true"){
                flash.texto = "Removido com sucesso!"
                flash.sucesso = "true"
            }else{
                flash.texto = "Erro ao remover evolução!"
                flash.sucesso = "false"
            }
            //console.log('listando Extraeses')
            this.filtraEvoatendfechado(req,res,flash)
        })
    },
    removeEvolucaoFinal(req,res,resposta){
        let resultado;
        let flash = new Resposta()
        if (resposta.sucesso == "true" || resposta.sucesso == "false"){
            flash.sucesso = resposta.sucesso;
            flash.texto = resposta.texto;
        }
        agendaClass.removeEvolucao(req,res).then((retorno)=>{
            resultado = retorno;
        }).catch((err) => {
            console.log(err)
            resultado = err;
        }).finally(() => {
            if(resultado == "true"){
                flash.texto = "Removido com sucesso!"
                flash.sucesso = "true"
            }else{
                flash.texto = "Erro ao remover evolução!"
                flash.sucesso = "false"
            }
            //console.log('listando Extraeses')
            this.filtraEvoatendgeral(req,res,flash)
        })
    },
    atualizaEvolucao(req, res){//EditaAgenda
        let flash = new Resposta()
        let resultado;
        let atrazo = req.body.agendaAtrazo;
        try{
            agendaClass.evolucao(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log("res")
                console.log("res:"+res)
                resultado = res;
                console.log("resultado:"+resultado)
            }).catch((err) =>{
                console.log("error")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                //console.log("Finally")
                if(resultado == true){
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    
                    //Substituido por filtraEvoatendgeral, caso queira voltar a evolução descomentar ou alterar.
                    if (req.body.agendaTemp == "true"){
                        fncAgenda.carregaEvolucaoTemp(req,res,atrazo,flash);
                    } else {
                        fncAgenda.carregaEvolucao(req,res,atrazo,flash);
                    }
                    
                    //this.filtraEvoatendgeral(req,res,flash)//comentado porque terapeutas usam essa função
                    //this.carregaAgendaCadastro(req,res,flash);//como tava antes de tudo
                }else{
                    //console.log("Erro ao editar agenda!")
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.filtraEvoatendgeral(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    async listaEvoatendranking(req, res) {
        try {
            const db = req.cookies['preferredDb'];
            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
            
            // 1. Buscar todos os terapeutas válidos
            const todosTerapeutas = await buscarTerapeutasValidos(db);
            
            // 2. Buscar anos para o filtro
            const anos = await Ano.find().sort({ ano_nome: 1 }).lean();
            
            // 3. Estrutura vazia (dashboard em branco)
            const terapeutasVazios = todosTerapeutas.map(tera => ({
                id: tera._id,
                nome: tera.usuario_nome,
                semanas: [],
                totalAtendimentos: 0,
                totalEvolucoes: 0,
                percentualTotal: 0
            }));
            
            // 4. Renderizar view em branco
            res.render('area/evol/evoatendrankingLis', {
                totalAtendimentosGeral: 0,
                totalEvolucoesGeral: 0,
                percentualGeral: 0,
                semanas: [],
                terapeutas: terapeutasVazios,
                anos: anos,
                filtroTela: {
                    tipoData: "Ano/Mes",
                    anoAtend: "",
                    mesAtend: "",
                    dataFinal: ""
                },
                filtrosDisplay: {
                    periodo: "Selecione um período para visualizar o ranking"
                },
                carregaFiltro: { carregaFiltro: "false" }
            });
            
        } catch (err) {
            console.error('❌ Erro em listaEvoatendranking:', err);
            req.flash("error_message", "Erro ao carregar dashboard: " + err.message);
            res.redirect('/admin/erro');
        }
    },
    async filtraEvoatendranking(req, res) {
        try {
            const db = req.cookies['preferredDb'];
            const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
            
            // 1. Capturar filtros
            const filtroTela = {
                tipoData: req.body.tipoData || "Ano/Mes",
                dataFinal: req.body.dataFinal || "",
                anoAtend: req.body.anoAtend || "",
                mesAtend: req.body.mesAtend || ""
            };
            
            // 2. Calcular período
            let dataIni = null;
            let dataFim = null;
            
            switch (filtroTela.tipoData) {
                case "Ano/Mes":
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoMes(filtroTela.anoAtend, filtroTela.mesAtend));
                    break;
                case "Semana":
                    ({ dataIni, dataFim } = fncGeral.obterSemanaUtil(new Date(filtroTela.dataFinal)));
                    break;
                case "Dia":
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(filtroTela.dataFinal));
                    break;
                default:
                    ({ dataIni, dataFim } = fncGeral.obterPeriodoDia(new Date()));
                    break;
            }
            
            console.log(`📅 Período calculado: ${dataIni} a ${dataFim}`);
            
            // 3. Buscar todos os terapeutas válidos
            const todosTerapeutas = await buscarTerapeutasValidos(db);
            
            // 4. Buscar todos os agendamentos do período
            const agenda = await Agenda.find({
                agenda_data: { $gte: dataIni, $lte: dataFim }
            }).lean().maxTimeMS(60000);
            
            console.log(`✅ Encontrados ${agenda.length} agendamentos no período`);
            
            // 5. Calcular semanas no período
            const semanas = calcularSemanas(dataIni, dataFim);
            console.log(`📊 ${semanas.length} semanas identificadas no período`);
            
            // 6. Processar dados da agenda
            const { dadosTerapeutas, totalAtendimentosGeral, totalEvolucoesGeral, percentualGeral } = 
                processarDadosAgenda(agenda, todosTerapeutas, semanas);
            
            // 7. Buscar anos para o filtro
            const anos = await Ano.find().sort({ ano_nome: 1 }).lean();
            
            // 8. Formatar período para exibição
            const filtrosDisplay = {
                periodo: formatarPeriodo(filtroTela, dataIni, dataFim)
            };
            
            // 9. Renderizar view com dados
            res.render('area/evol/evoatendrankingLis', {
                totalAtendimentosGeral,
                totalEvolucoesGeral,
                percentualGeral,
                semanas,
                terapeutas: dadosTerapeutas,
                anos,
                filtroTela,
                filtrosDisplay,
                carregaFiltro: { carregaFiltro: "true" }
            });
            
        } catch (err) {
            console.error('❌ Erro em filtraEvoatendranking:', err);
            req.flash("error_message", "Erro ao filtrar dashboard: " + err.message);
            res.redirect('/admin/erro');
        }
    }
}