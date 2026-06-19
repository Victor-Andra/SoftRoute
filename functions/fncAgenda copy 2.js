const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

// Classes
const agendaClass = require("../models/agenda")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const creClass = require("../models/credit")
const debClass = require("../models/debit")
const convcreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
//const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia") 
const horaageClass = require("../models/horaAge")
const salaClass = require("../models/sala")
//const estadoClass = require("../models/estado")
const atendClass = require("../models/atend")
const especialidadeClass = require("../models/especialidade")
const especializacaoClass = require("../models/especializacao")
const extraClass = require("../models/extra")
const sessaoClass = require("../models/sessao")
const excecaoClass = require("../models/excecao")
const evolucaoconfClass = require("../models/evolucaoconf")

// Models
var Agenda = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Cre = getModel("SoftRoute", 'tb_credit', creClass.CreditSchema)
var Deb = getModel("SoftRoute", 'tb_debit', debClass.DebitSchema)
//var Convcre = getModel("SoftRoute", 'tb_convcre', convcreClass.ConvcreSchema)
//var Convdeb = getModel("SoftRoute", 'tb_convdeb', convdebClass.ConvdebSchema)
//var Tabil = getModel("SoftRoute", 'tb_tabil', tabilClass.TabilSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Horaage = getModel("SoftRoute", 'tb_horaage', horaageClass.HoraageSchema)
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)
//var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)
var Especialidade = getModel("SoftRoute", 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
var Especializacao = getModel("SoftRoute", 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
var Extra = getModel("SoftRoute", 'tb_extra', extraClass.ExtraSchema)
var Sessao = getModel("SoftRoute", 'tb_sessao', sessaoClass.SessaoSchema)
var Excecao = getModel("SoftRoute", 'tb_excecao', excecaoClass.ExcecaoSchema)
var Evolucaoconf = getModel("SoftRoute", 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

//Funções Auxiliares
//const atendFnc = require("../functions/fncAtend")

//const fncEvoatend = require("../functions/fncEvoatend")
//const terapia = require("../models/terapia")
const ObjectId = require('mongodb').ObjectId;
//Gambiarras
const AgendaArquivoClass = require("../models/agendaArquivo")
var AgendaArquivo = getModel("SoftRoute", 'tb_agendaArquivo', AgendaArquivoClass)
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

class FiltroAtend{
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

module.exports = {
    getData(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dia+'/'+mes+'/'+dt.getFullYear()).toString();
    },
    getDataDiaMes(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        let semana;

        switch (dt.getUTCDay()){
            case 1:
                semana = "Segunda";
                break;
            case 2:
                semana = "Terça";
                break;
            case 3:
                semana = "Quarta";
                break;
            case 4:
                semana = "Quinta";
                break;
            case 5:
                semana = "Sexta";
                break;
            default:
                semana = "Dom";
                break;
        }
        
        return (semana+" - "+dia+'/'+mes).toString();
    },
    getDataFMT(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
    },
    formataData(data){
        let dia = data.toString().substring(0,2);
        let mes = data.toString().substring(3,5);
        let prs = parseInt(mes,10);
        prs=prs-1;
        //console.log("prs:"+prs)
        let mesformat
        if(prs<=9){
            mesformat = "0"+prs+""
        } else {
            mesformat = ""+prs+""
        }
        let ano = data.toString().substring(6,10);
        let dt = new Date(ano,mesformat,dia,0,0,0,0)
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
        return dt;
    },
    getDiaSemana(dt){
        let dat = new Date(dt);
        switch (dat.getUTCDay()){
            case 0:
                return "dom"
            case 1:
                return "seg"
            case 2:
                return "ter"
            case 3:
                return "qua"
            case 4:
                return "qui"
            case 5:
                return "sex"
            case 6:
                return "sab"
            default:
                return "dom"
        }
    },
    carregaAgendaGAntiga(req,res){//AbreAgendaFiltro
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dtFill;
        let seg = new Date();
        let sex = new Date();
        //seg.setUTCDate(seg.getUTCDate() - 15);
        //sex.setUTCDate(sex.getUTCDate() - 15);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        //console.log("seg::")
        //console.log(seg)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

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
                        e.agenda_data_semana = "dom"
                        //console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaG(req,res){//AbreAgendaGeralAntiga
        let db = req.cookies['preferredDb'];
       
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let seg = new Date();
        let sex = new Date();
        //seg.setUTCDate(seg.getUTCDate() - 22);
        //sex.setUTCDate(sex.getUTCDate() - 22);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
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
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                Sala.find().then((sala)=>{
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilG(req,res){//FiltraAgendaGeral
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
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
            agenda.sort(function(a, b) {
                let h1 = a.agenda_hora.substring(0,2);
                let m1 = a.agenda_hora.substring(3,5);
                let h2 = b.agenda_hora.substring(0,2);
                let m2 = b.agenda_hora.substring(3,5);
                if(h1 == h2){
                    if(m1 < m2) {
                        return -1;
                    } else {
                        return true;
                    }
                } else {
                    if(h1 < h2) {
                        return -1;
                    } else {
                        return true;
                    }
                }
            });
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    carregaAgendaT(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let dtFill;
        let is = false;
        let usunomefnc;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeFisio;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu)=>{//Apenas 1
            //console.log("usu.usuario_obs:"+usu.usuario_obs)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
                nomeUsu = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
                nomeUsu = usu.usuario_nomecompleto;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: usu._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            //console.log("benenomeconv:"+usunomefnc)
                                            res.render("agenda/agendaTerapeuta", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilT(req,res){//FiltraAgendaFiltro
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let usunomefnc;
        let usuObs;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({_id:req.body.agendaTeraid, usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu) =>{
            //console.log("usu:"+usu)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: req.body.agendaTeraid, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem Realizada de Terapia")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                            let segASex = ["seg","ter","qua","qui","sex"];

                            segASex.forEach((diaDaSemana)=>{
                                haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                //console.log("Tem "+z+"?"+haddia)
                                this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                            })

                            agenda.sort(function(a, b) {
                                let h1 = a.agenda_hora.substring(0,2);
                                let m1 = a.agenda_hora.substring(3,5);
                                let h2 = b.agenda_hora.substring(0,2);
                                let m2 = b.agenda_hora.substring(3,5);
                                if(h1 == h2){
                                    if(m1 < m2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    if(h1 < h2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });

                            Sala.find().then((sala)=>{
                                sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                //console.log("Listagem Realizada de Terapia")
                                Especialidade.find().then((especialidade)=>{
                                    especialidade.forEach((e)=>{//graduação
                                        //console.log("Listagem Realizada de Especialidade")
                                        //console.log("TESTE:"+e._id+"/"+idFnc)
                                        if(e._id == idFnc){
                                            nomeFnc = e.especialidade_nome;
                                        }
                                    })

                                    Especializacao.find().then((especializacao)=>{//Terapia
                                        //console.log("Listagem Realizada de Especializacao")
                                        especializacao.forEach((ez)=>{//especializacao
                                            //console.log("TESTE:"+ez._id+"/"+idEsp)
                                            if(ez._id == idEsp){
                                                nomeEsp = ez.especializacao_nome;
                                            }
                                        })
                                        if(!(typeof nomeFnc === "undefined")){
                                            usunomefnc += " / " + nomeFnc
                                        }
                                        if(!(typeof nomeEsp === "undefined")){
                                            usunomefnc += " ("+nomeEsp+")"
                                        }
                                        //console.log("usunomefnc:"+usunomefnc)
                                        res.render("agenda/agendaTerapeuta", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu, usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find({bene_status: "Ativo"}).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiario", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let soFixo = req.body.soFixo;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("req.body.dataFinal:"+req.body.dataFinal);
        //console.log("sex1:"+sex);
        //console.log("seg1:"+seg);
        //console.log("sex1:"+sex);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        let busca;
        //console.log("req.body.soFixo:"+req.body.soFixo)
        if (soFixo == "true"){
            busca = { "agenda_data": { $gte : agora, $lte:  depois }, "agenda_beneid": req.body.agendaBeneid, "agenda_temp": false, "agenda_categoria": "SubstitutoFixo" };
        } else {
            busca = { "agenda_data": { $gte : agora, $lte:  depois }, "agenda_beneid": req.body.agendaBeneid, "agenda_temp": false };
        }
        Bene.find({_id:req.body.agendaBeneid}).then((b) =>{
            Agenda.find(busca).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            
            Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Bene.find({_id: req.body.agendaBeneid}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                
                                agenda.forEach((a)=>{
                                    if (soFixo == "true"){
                                        //console.log("agenda: "+a)
                                        let terapeutaAgendaSubF;
                                        let terapiaAgendaSubF;
                                        //let terapeutaAgendaSubF = terapeuta.filter((t)=>{(""+t._id+"") == (""+a.agenda_mergeterapeutaid+"")});
                                        //let terapiaAgendaSubF = terapia.filter((t)=>{(""+t._id+"") == (""+a.agenda_mergeterapiaid+"")});
                                        //console.log("a._id: "+a._id);
                                        //console.log("a.agenda_mergeterapeutaid: "+a.agenda_mergeterapeutaid)
                                        terapeuta.forEach((t)=>{
                                            if ((""+t._id+"") == (""+a.agenda_mergeterapeutaid+"")){
                                                terapeutaAgendaSubF = t.usuario_nome;
                                            }
                                        })
                                        terapia.forEach((t)=>{
                                            if ((""+t._id+"") == (""+a.agenda_mergeterapiaid+"")){
                                                terapiaAgendaSubF = t.terapia_nome;
                                            }
                                        })
                                        if (terapeutaAgendaSubF != undefined && terapeutaAgendaSubF != "undefined" && terapiaAgendaSubF != undefined && terapiaAgendaSubF != "undefined"){
                                            a.agenda_obs="SubFix: "+terapeutaAgendaSubF +"/"+terapiaAgendaSubF;
                                        } else {
                                            a.agenda_obs="Erro";
                                        }
                                    }
                                })
                                b.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    benenomeconv = nomeBene+" / "+nomeConv;
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiario", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, soFixo, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

carregaTabdimAgendaMes(req, res) {
    let db = req.cookies['preferredDb'];
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
    Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

    // 🗓️ Define a data base (usa data do form ou data atual)
    let dataBase = new Date(req.body.dataFinal || new Date());
    
    // ✅ Calcula INÍCIO do mês: dia 1, 00:00:00
    let inicioMes = new Date(Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth(), 1, 0, 0, 0, 0));
    
    // ✅ Calcula FIM do mês: último dia, 23:59:59.999
    let fimMes = new Date(Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    let agora = inicioMes.toISOString();
    let depois = fimMes.toISOString();

    // 🔍 Query base: só agendamentos "PAI" (não temporários)
    let busca = { 
        "agenda_data": { $gte: agora, $lte: depois }, 
        "agenda_temp": false 
    };
    
    // Filtro por beneficiário
    if (req.body.agendaBeneid && req.body.agendaBeneid !== 'TODOS') {
        busca.agenda_beneid = req.body.agendaBeneid;
    }
    
    // Filtro Substitutos Fixos
    if (req.body.soFixo === 'true') {
        busca.agenda_categoria = "SubstitutoFixo";
    }

    // 📦 Busca paralela de todos os dados
    Promise.all([
        Bene.find({ bene_status: "Ativo", bene_nome: { $not: /\./ } }).sort({ bene_nome: 1 }),
        Bene.find(req.body.agendaBeneid && req.body.agendaBeneid !== 'TODOS' ? { _id: req.body.agendaBeneid } : {}),
        Conv.find().sort({ conv_nome: 1 }),
        Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).sort({ usuario_nome: 1 }),
        Terapia.find().sort({ terapia_nome: 1 }),
        Sala.find().sort({ sala_nome: 1 }),
        Agenda.find(busca).sort({ agenda_data: 1, agenda_hora: 1 })
    ])
    .then(([benefAtivos, beneSelecionado, convs, terapeutas, terapias, salas, agendaRaw]) => {
        
        // 🗂️ Maps para busca rápida por ID
        const mapTerapeutas = {};
        terapeutas.forEach(t => { mapTerapeutas[t._id.toString()] = t.usuario_nome; });
        
        const mapTerapias = {};
        terapias.forEach(t => { mapTerapias[t._id.toString()] = t.terapia_nome; });
        
        const mapConvenios = {};
        convs.forEach(c => { mapConvenios[c._id.toString()] = c.conv_nome; });
        
        const mapSalas = {};
        salas.forEach(s => { mapSalas[s._id.toString()] = s.sala_nome; });

        // 🔄 Processa cada agendamento
        let agenda = agendaRaw.map(e => {
            let dat = new Date(e.agenda_data);
            let hora = String(dat.getUTCHours()).padStart(2,'0');
            let min = String(dat.getMinutes()).padStart(2,'0');
            
            // Dados ORIGINAIS
            let beneOrig = beneSelecionado.find(b => b._id.toString() === e.agenda_beneid?.toString());
            let terapeutaOrig = mapTerapeutas[e.agenda_usuid?.toString()] || '-';
            let terapiaOrig = mapTerapias[e.agenda_terapiaid?.toString()] || '-';
            let salaOrig = mapSalas[e.agenda_salaid?.toString()] || e.agenda_sala || '-';
            let beneNome = beneOrig?.bene_nome || 'Não identificado';
            let convNome = beneOrig?.bene_convid ? mapConvenios[beneOrig.bene_convid.toString()] : '';

            // Dados da SUBSTITUIÇÃO
            let terapeutaSub = '-';
            let terapiaSub = '-';
            let isSubFix = (e.agenda_categoria === "SubstitutoFixo");
            
            if (e.agenda_mergeterapeutaid || e.agenda_mergeterapiaid) {
                terapeutaSub = mapTerapeutas[e.agenda_mergeterapeutaid?.toString()] || '-';
                terapiaSub = mapTerapias[e.agenda_mergeterapiaid?.toString()] || '-';
            }

            return {
                _id: e._id,
                agenda_data_dia: this.getDataFMT(dat),
                agenda_hora: `${hora}:${min}`,
                beneNome,
                convNome,
                salaOrig,
                terapeutaOrig,
                terapiaOrig,
                terapeutaSub,
                terapiaSub,
                isSubFix,
                temSubstituicao: (terapeutaSub !== '-' || terapiaSub !== '-')
            };
        });

        // 🧩 Agrupa por beneficiário + calcula TOTAL GERAL
        let agrupadoPorBene = {};
        let totalGeralSessoes = 0; // 👈 contador global
        
        agenda.forEach(item => {
            // Filtro: só mostra se tiver substituição OU se o filtro soFixo não estiver ativo
            if (req.body.soFixo === 'true' || item.temSubstituicao || item.isSubFix) {
                
                if (!agrupadoPorBene[item.beneNome]) {
                    agrupadoPorBene[item.beneNome] = {
                        beneNome: item.beneNome,
                        convNome: item.convNome,
                        sessoes: 0,
                        itens: []
                    };
                }
                agrupadoPorBene[item.beneNome].sessoes++;
                agrupadoPorBene[item.beneNome].itens.push(item);
                
                totalGeralSessoes++; // 👈 incrementa o total global
            }
        });

        // 📋 Ordena por nome do beneficiário
        let listaFinal = Object.values(agrupadoPorBene).sort((a,b) => 
            (a.beneNome || '').localeCompare(b.beneNome || '', 'pt-BR', { sensitivity: 'base' })
        );

        // 🗓️ Formata período para exibição (dd/mm/yyyy)
        let periodoDe = this.getDataFMT(inicioMes);
        let periodoAte = this.getDataFMT(fimMes);
        let mesAno = inicioMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        res.render("agenda/TabdimAgendaMensalBene", {
            agendas: listaFinal,
            benes: benefAtivos,
            periodoDe,
            periodoAte,
            mesAno,
            totalGeralSessoes, // 👈 envia o total pra view
            soFixo: req.body.soFixo || 'false',
            filtro: {
                dataIni: req.body.dataFinal || '',
                beneid: req.body.agendaBeneid || 'TODOS',
                soFixo: req.body.soFixo || 'false'
            }
        });
    })
    .catch(err => {
        console.log(err);
        req.flash("error_message", "Houve um erro ao carregar a agenda mensal!");
        res.redirect('admin/erro');
    });
},

carregaAgendaMesFixo(req, res) {
    let db = req.cookies['preferredDb'];
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
    Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

    // 🗓️ Define a data base (usa data do form ou data atual)
    let dataBase = new Date(req.body.dataFinal || new Date());
    
    // ✅ Calcula INÍCIO do mês: dia 1, 00:00:00 UTC
    let inicioMes = new Date(Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth(), 1, 0, 0, 0, 0));
    
    // ✅ Calcula FIM do mês: último dia, 23:59:59.999 UTC
    let fimMes = new Date(Date.UTC(dataBase.getUTCFullYear(), dataBase.getUTCMonth() + 1, 0, 23, 59, 59, 999));

    let agora = inicioMes.toISOString();
    let depois = fimMes.toISOString();

    // 🔍 Query base: SÓ Substitutos Fixos (filtro fixo, sem opção de mudar)
    let busca = { 
        "agenda_data": { $gte: agora, $lte: depois }, 
        "agenda_temp": false,
        "agenda_categoria": "SubstitutoFixo"  // 👈 FIXO: só SubFix
    };
    
    // Filtro opcional por beneficiário
    if (req.body.agendaBeneid && req.body.agendaBeneid !== 'TODOS') {
        busca.agenda_beneid = req.body.agendaBeneid;
    }

    // 📦 Busca paralela
    Promise.all([
        Bene.find({ bene_status: "Ativo", bene_nome: { $not: /\./ } }).sort({ bene_nome: 1 }),
        Bene.find(req.body.agendaBeneid && req.body.agendaBeneid !== 'TODOS' ? { _id: req.body.agendaBeneid } : {}),
        Conv.find().sort({ conv_nome: 1 }),
        Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).sort({ usuario_nome: 1 }),
        Terapia.find().sort({ terapia_nome: 1 }),
        Agenda.find(busca).sort({ agenda_hora: 1, agenda_hora: 1 })
    ])
    .then(([benefAtivos, beneSelecionado, convs, terapeutas, terapias, agendaRaw]) => {
        
        // 🗂️ Maps para busca rápida
        const mapTerapeutas = {};
        terapeutas.forEach(t => { mapTerapeutas[t._id.toString()] = t.usuario_nome; });
        
        const mapTerapias = {};
        terapias.forEach(t => { mapTerapias[t._id.toString()] = t.terapia_nome; });
        
        const mapConvenios = {};
        convs.forEach(c => { mapConvenios[c._id.toString()] = c.conv_nome; });

        // 🔄 Processa cada agendamento SubFix
        let agenda = agendaRaw.map(e => {
            let dat = new Date(e.agenda_data);
            
            // Dados ORIGINAIS (do agendamento PAI)
            let beneOrig = beneSelecionado.find(b => b._id.toString() === e.agenda_beneid?.toString());
            let terapeutaOrig = mapTerapeutas[e.agenda_usuid?.toString()] || '-';
            let terapiaOrig = mapTerapias[e.agenda_terapiaid?.toString()] || '-';
            let beneNome = beneOrig?.bene_nome || 'Não identificado';
            let convNome = beneOrig?.bene_convid ? mapConvenios[beneOrig.bene_convid.toString()] : '';

            // Dados da SUBSTITUIÇÃO FIXA (merge)
            let terapeutaSub = mapTerapeutas[e.agenda_mergeterapeutaid?.toString()] || '-';
            let terapiaSub = mapTerapias[e.agenda_mergeterapiaid?.toString()] || '-';

            return {
                beneNome,
                convNome,
                terapiaOrig,
                terapeutaOrig,
                terapiaSub,
                terapeutaSub,
                // Chave única para agrupamento: bene + terapia original
                chaveAgrupamento: `${beneNome}||${terapiaOrig}`
            };
        });

        // 🧩 Agrupa por BENEFICIÁRIO + TERAPIA ORIGINAL (consolidado)
        let agrupado = {};
        let totalGeral = 0;
        
        agenda.forEach(item => {
            let chave = item.chaveAgrupamento;
            
            if (!agrupado[chave]) {
                agrupado[chave] = {
                    beneNome: item.beneNome,
                    convNome: item.convNome,
                    terapiaOrig: item.terapiaOrig,
                    terapeutaOrig: item.terapeutaOrig,
                    terapiaSub: item.terapiaSub,
                    terapeutaSub: item.terapeutaSub,
                    qtPorTerapia: 0
                };
            }
            agrupado[chave].qtPorTerapia++;
            totalGeral++;
        });

        // 📊 Agora agrupa por BENEFICIÁRIO para calcular o total por bene
        let porBeneficiario = {};
        Object.values(agrupado).forEach(item => {
            if (!porBeneficiario[item.beneNome]) {
                porBeneficiario[item.beneNome] = {
                    beneNome: item.beneNome,
                    convNome: item.convNome,
                    totalFixos: 0,
                    terapias: []
                };
            }
            porBeneficiario[item.beneNome].totalFixos += item.qtPorTerapia;
            porBeneficiario[item.beneNome].terapias.push(item);
        });

        // 📋 Ordena: beneficiário por nome, terapias por nome
        let listaFinal = Object.values(porBeneficiario).sort((a,b) => 
            (a.beneNome || '').localeCompare(b.beneNome || '', 'pt-BR', { sensitivity: 'base' })
        );
        
        listaFinal.forEach(bene => {
            bene.terapias.sort((a,b) => 
                (a.terapiaOrig || '').localeCompare(b.terapiaOrig || '', 'pt-BR', { sensitivity: 'base' })
            );
        });

        // 🗓️ Formata período
        let periodoDe = this.getDataFMT(inicioMes);
        let periodoAte = this.getDataFMT(fimMes);
        let mesAno = inicioMes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });

        res.render("agenda/RelAgendaMesFixo", {
            agendas: listaFinal,
            benes: benefAtivos,
            periodoDe,
            periodoAte,
            mesAno,
            totalGeral,
            filtro: {
                dataIni: req.body.dataFinal || '',
                beneid: req.body.agendaBeneid || 'TODOS'
            }
        });
    })
    .catch(err => {
        console.log(err);
        req.flash("error_message", "Houve um erro ao carregar o relatório de fixos!");
        res.redirect('admin/erro');
    });
},
    carregaAgendaResp(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaResp", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilResp(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.find({_id:req.body.agendaBeneid}).then((b) =>{
            b.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Bene.find({_id: req.body.agendaBeneid}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaResp", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaS(req,res){
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM 
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }

        let diaSemana = seg;
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        /*
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    */
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {segunda, terca, quarta, quinta, sexta})//, {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
                                    /*
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
            */
    },

    carregaAgendaSB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

         Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find({bene_status: "Ativo"}).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiarioSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let agendaTempArr = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne({_id:req.body.agendaBeneid}).then((bene) =>{
            nomeBene = bene.bene_nome
            beneConvid = bene.bene_convid
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid }).sort({ agenda_data: -1 }).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                //console.log("agenda.length:"+agenda.length)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
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
                        idsAgendasEx.push(a);
                    }
                })

                Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((benef) => {
                    benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    Conv.find({_id: beneConvid}).then((conv)=>{
                                        conv.forEach(e => {
                                            nomeConv = e.conv_nome
                                        });
                                        benenomeconv = nomeBene+" / "+nomeConv;
                                        res.render("agenda/agendaBeneficiarioSemanal", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
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

    carregaAgendaSBFixo(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

         Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find({bene_status: "Ativo"}).then((benef) => {
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiarioSemanalFixo", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSBFixo(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let agendaTempArr = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne({_id:req.body.agendaBeneid}).then((bene) =>{
            nomeBene = bene.bene_nome
            beneConvid = bene.bene_convid
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid }).sort({ agenda_data: -1 }).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                //console.log("agenda.length:"+agenda.length)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
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
                        idsAgendasEx.push(a);
                    }
                })

                Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((benef) => {
                    benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    Conv.find({_id: beneConvid}).then((conv)=>{
                                        conv.forEach(e => {
                                            nomeConv = e.conv_nome
                                        });
                                        benenomeconv = nomeBene+" / "+nomeConv;
                                        res.render("agenda/agendaBeneficiarioSemanalFixo", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
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

    carregaAgendaSBMinhaage(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).then((agenda) =>{
            agenda = agenda.filter(a => (""+a.atend_categoria) !== "Feriado");
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBSMinha", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSBMinhaage(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let agendaTempArr = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne({_id:req.body.agendaBeneid}).then((bene) =>{
            nomeBene = bene.bene_nome
            beneConvid = bene.bene_convid
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid }).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                //console.log("agenda.length:"+agenda.length)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
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
                        idsAgendasEx.push(a);
                    }
                })

                Bene.find().then((benef)=>{
                    benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    Conv.find({_id: beneConvid}).then((conv)=>{
                                        conv.forEach(e => {
                                            nomeConv = e.conv_nome
                                        });
                                        benenomeconv = nomeBene+" / "+nomeConv;
                                        res.render("agenda/agendaBSMinha", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
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

    carregaAgendaST(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((t) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: t._id}).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Sala.find().then((sala)=>{
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    //console.log("Listagem Realizada de Horario")
                                    let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                    let segASex = ["seg","ter","qua","qui","sex"];
                                    
                                    segASex.forEach((diaDaSemana)=>{
                                        haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                        //console.log("Tem "+z+"?"+haddia)
                                        this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                    })

                                    agenda.sort(function(a, b) {
                                        let h1 = a.agenda_hora.substring(0,2);
                                        let m1 = a.agenda_hora.substring(3,5);
                                        let h2 = b.agenda_hora.substring(0,2);
                                        let m2 = b.agenda_hora.substring(3,5);
                                        if(h1 == h2){
                                            if(m1 < m2) {
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        } else {
                                            if(h1 < h2) {
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilST(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let nomeUsu;
        let nomeFnc;
        let nomeEsp;
        let idEsp;
        let usunomefnc;
        let agendaTempArr = [];
        let idsAgendasEx = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        //Pensar em como carregar quando for merge
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: req.body.agendaTerapeutaid }).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
                    idsAgendasEx.push(a);
                }
            })

            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem Realizada de Terapia")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            //console.log("Listagem Realizada de Horario")
                            let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                            let segASex = ["seg","ter","qua","qui","sex"];
                            
                            segASex.forEach((diaDaSemana)=>{
                                haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                //console.log("Tem "+z+"?"+haddia)
                                this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                            })

                            agenda.sort(function(a, b) {
                                let h1 = a.agenda_hora.substring(0,2);
                                let m1 = a.agenda_hora.substring(3,5);
                                let h2 = b.agenda_hora.substring(0,2);
                                let m2 = b.agenda_hora.substring(3,5);
                                if(h1 == h2){
                                    if(m1 < m2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    if(h1 < h2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });
                            Sala.find().then((sala)=>{
                                Usuario.findOne({_id:req.body.agendaTerapeutaid}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                    //console.log("usuario:"+usuario.usuario_nome);
                                    nomeUsu = ""+usuario.usuario_nome;
                                    //console.log("nomeUsu:"+nomeUsu);
                                    //console.log("usuario:"+usuario)
                                    
                                    if(typeof usuario.usuario_nome === undefined){
                                        usunomefnc = usuario.usuario_nomecompleto;
                                    } else {
                                        usunomefnc = usuario.usuario_nome;
                                    }
                                    if(!(typeof usuario.usuario_graduacao === undefined)){
                                        idFnc = usuario.usuario_graduacao;
                                    }
                                    if(!(typeof usuario.usuario_especializacao === undefined)){
                                        idEsp = usuario.usuario_especializacao;
                                    }
                                    if(!(typeof usuario.usuario_obs === undefined)){
                                        usuObs = usuario.usuario_obs;
                                    } else {
                                        usuObs = " - "
                                    }
                                    Especialidade.find().then((especialidade)=>{
                                
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, usunomefnc})
                                        })
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
    carregaAgendaTB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }}).then((agenda) =>{
            //console.log(agenda)
            Bene.find().then((bene)=>{
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    //let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilTB(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("req.body.dataFinal:"+req.body.dataFinal);
        //console.log("sex1:"+sex);
        //console.log("seg1:"+seg);
        //console.log("sex1:"+sex);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.find({_id:req.body.agendaBeneid}).then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid}).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                //console.log(agenda)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
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
                    idsAgendasEx.push(mongoose.Types.ObjectId(e._id));
                })
                //console.log(agenda)
                Agenda.find({'_id': { $in: idsAgendasEx}}).then((agendaS)=>{
                    Bene.find().then((benef)=>{
                        benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Beneficiários!")
                        Conv.find({_id: beneConvid}).then((conv)=>{
                            conv.forEach(e => {
                                nomeConv = e.conv_nome
                            });
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                                    //console.log("Listagem Realizada de Terapia")
                                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                        //console.log("Listagem Realizada de Horario")
                                        let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                        let segASex = ["seg","ter","qua","qui","sex"];
                                        
                                        segASex.forEach((diaDaSemana)=>{
                                            haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                            //console.log("Tem "+z+"?"+haddia)
                                            this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                        })

                                        agenda.sort(function(a, b) {
                                            let h1 = a.agenda_hora.substring(0,2);
                                            let m1 = a.agenda_hora.substring(3,5);
                                            let h2 = b.agenda_hora.substring(0,2);
                                            let m2 = b.agenda_hora.substring(3,5);
                                            if(h1 == h2){
                                                if(m1 < m2) {
                                                    return -1;
                                                } else {
                                                    return true;
                                                }
                                            } else {
                                                if(h1 < h2) {
                                                    return -1;
                                                } else {
                                                    return true;
                                                }
                                            }
                                        });
                                        Sala.find().then((sala)=>{
                                            //console.log("Listagem Realizada de Terapia")
                                            benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                            //console.log("benenomeconv:"+benenomeconv)
                                            res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta, agendaSemanais: agendaS})
                                        })
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
    carregaAgendaFilS(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        let idsAgendasEx = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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

                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => (""+a.id+"") != (""+i+""));
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            //console.log(idsAgendasEx)
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    //carrega Agenda Semanal com Fixos
    carregaAgendaSFixo(req,res){
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM 
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }

        let diaSemana = seg;
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
       
            res.render("agenda/agendaSemanalFixo", {segunda, terca, quarta, quinta, sexta})//, {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
    },
    //carrega Agenda Semanal com Fixos Filtrada
    carregaAgendaFilSFixo_oLD(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        let idsAgendasEx = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).sort({ agenda_data: -1 }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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

                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => (""+a.id+"") != (""+i+""));
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            //console.log(idsAgendasEx)
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanalFixo", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
carregaAgendaFilSFixo(req,res){
    let db = req.cookies['preferredDb'];
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
    Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
    Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
    Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

    let aux = 1;
    let segunda;
    let terca;
    let quarta;
    let quinta;
    let sexta;
    let dtFill = new Date(req.body.dataFinal);
    let seg = new Date(req.body.dataFinal);
    let sex = new Date(req.body.dataFinal);
    let idsAgendasEx = [];
    seg.setHours(0);
    seg.setMinutes(0);
    seg.setSeconds(0);
    sex.setHours(23);
    sex.setMinutes(59);
    sex.setSeconds(59);
    switch (seg.getUTCDay()){
        case 0://DOM
            seg.setUTCDate(seg.getUTCDate() + 1);
            dtFill = {dia: "seg"};
            sex.setUTCDate(sex.getUTCDate() + 5);
            break;
        case 1://SEG
            dtFill = {dia: "seg"};
            sex.setUTCDate(sex.getUTCDate() + 4);
            break;
        case 2://TER
            dtFill = {dia: this.getDiaSemana(seg)};
            seg.setUTCDate(seg.getUTCDate() - 1);
            sex.setUTCDate(sex.getUTCDate() + 3);
            break;
        case 3://QUA
            dtFill = {dia: this.getDiaSemana(seg)};
            seg.setUTCDate(seg.getUTCDate() - 2);
            sex.setUTCDate(sex.getUTCDate() + 2);
            break;
        case 4://QUI
            dtFill = {dia: this.getDiaSemana(seg)};
            seg.setUTCDate(seg.getUTCDate() - 3);
            sex.setUTCDate(sex.getUTCDate() + 1);
            break;
        case 5://SEX
            dtFill = {dia: this.getDiaSemana(seg)};
            seg.setUTCDate(seg.getUTCDate() - 4);
            break;
        case 6://SAB
            seg.setUTCDate(seg.getUTCDate() - 5);
            dtFill = {dia: "seg"};
            sex.setUTCDate(sex.getUTCDate() - 1);
            break;
        default:
            seg.setUTCDate(seg.getUTCDate() + 1);
            dtFill = {dia: "seg"};
            sex.setUTCDate(sex.getUTCDate() + 5);
            break;
    }
    let agora = seg.toISOString();
    let depois = sex.toISOString();
    let diaSemana = seg;
    let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
    {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
    
    segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
    terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
    quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
    quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
    sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

    // Buscar TODAS as agendas (sem filtro de SubstitutoFixo)
    Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).sort({ agenda_data: -1 }).then((agenda) =>{
        agenda.forEach((e)=>{
            let dat = new Date(e.agenda_data);
            e.agenda_data_dia = this.getDataFMT(dat);
            let hora = ""+dat.getUTCHours();
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
                    break;
            }

            if(e.agenda_temp){
                idsAgendasEx.push(e.agenda_tempId.toString());
            }
        })
        
        idsAgendasEx.forEach((i)=>{
            agenda = agenda.filter(a => (""+a.id+"") != (""+i+""));
        })
        
        // Carregar todos os dados necessários
        Promise.all([
            Bene.find().sort({bene_nome: 1}),
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).sort({usuario_nome: 1}),
            Terapia.find().sort({terapia_nome: 1}),
            Horaage.find().sort({horaage_turno: 1, horaage_ordem: 1}),
            Sala.find().sort({sala_nome: 1})
        ]).then(([bene, terapeuta, terapia, horaage, sala]) => {
            
            // Processar agendas SubstitutoFixo
            agenda.forEach((a) => {
                if (a.agenda_categoria === "SubstitutoFixo") {
                    let terapeutaAgendaSubF = "";
                    let terapiaAgendaSubF = "";
                    
                    // Buscar nome do terapeuta de merge
                    terapeuta.forEach((t) => {
                        if (""+t._id+"" === ""+a.agenda_mergeterapeutaid+"") {
                            terapeutaAgendaSubF = t.usuario_nome;
                        }
                    });
                    
                    // Buscar nome da terapia de merge
                    terapia.forEach((t) => {
                        if (""+t._id+"" === ""+a.agenda_mergeterapiaid+"") {
                            terapiaAgendaSubF = t.terapia_nome;
                        }
                    });
                    
                    // Montar observação com dados de SubFix
                    if (terapeutaAgendaSubF && terapiaAgendaSubF) {
                        a.agenda_obs = "SubFix: " + terapeutaAgendaSubF + " / " + terapiaAgendaSubF;
                    } else {
                        a.agenda_obs = "Erro ao carregar SubFix";
                    }
                }
            });
            
            // Ordenar agenda por hora
            agenda.sort(function(a, b) {
                let h1 = a.agenda_hora.substring(0,2);
                let m1 = a.agenda_hora.substring(3,5);
                let h2 = b.agenda_hora.substring(0,2);
                let m2 = b.agenda_hora.substring(3,5);
                if(h1 == h2){
                    return m1 < m2 ? -1 : 1;
                } else {
                    return h1 < h2 ? -1 : 1;
                }
            });
            
            // Renderizar view
            res.render("agenda/agendaSemanalFixo", {
                salas: sala, 
                horaages: horaage, 
                agendas: agenda, 
                benes: bene, 
                terapeutas: terapeuta, 
                semanas: semana, 
                dtFill, 
                segunda, 
                terca, 
                quarta, 
                quinta, 
                sexta
            });
        });
    }).catch((err) =>{
        console.log(err);
        req.flash("error_message", "houve um erro ao Realizar as listas!");
        res.redirect('admin/erro');
    });
},
    carregaAgendaDTerapeuta(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("area/magenda/agendaTecSem", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaSTerapeuta(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("area/magenda/agendaTecSem", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaPessoalOriginal(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let isSemanal = "false";
        let agendaTempArr =  [];
        let idsAgendasEx = [];
        let idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let hoje;
        let seg = new Date();
        seg.setSeconds(0);
        seg.setMinutes(0);
        seg.setHours(0);

        let sex = new Date();
        sex.setSeconds(59);
        sex.setMinutes(59);
        sex.setHours(23);

        let diaSemana = new Date();//segunda
        diaSemana.setSeconds(0);
        diaSemana.setMinutes(0);
        diaSemana.setHours(0);

        switch (seg.getUTCDay()){
            case 0://DOM
                hoje = "dom";
                diaSemana.setUTCDate(diaSemana.getUTCDate() + 1);
                break;
            case 1://SEG
                hoje = "seg";
                diaSemana.setUTCDate(diaSemana.getUTCDate());
                break;
            case 2://TER
                hoje = "ter";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 1);
                break;
            case 3://QUA
                hoje = "qua";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 2);
                break;
            case 4://QUI
                hoje = "qui";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 3);
                break;
            case 5://SEX
                hoje = "sex";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 4);
                break;
            case 6://SAB
                hoje = "sab";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 5);
                break;
            default:
                hoje = "dom";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 6);
                break;
        }
        let diaDeHoje = diaSemana;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];

        segunda = this.getDataDiaMes(diaDeHoje.setDate(diaDeHoje.getDate()-4));
        terca = this.getDataDiaMes(diaDeHoje.setDate(diaDeHoje.getDate()+1));
        quarta = this.getDataDiaMes(diaDeHoje.setDate(diaDeHoje.getDate()+1));
        quinta = this.getDataDiaMes(diaDeHoje.setDate(diaDeHoje.getDate()+1));
        sexta = this.getDataDiaMes(diaDeHoje.setDate(diaDeHoje.getDate()+1));
        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);

        Agenda.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idFiltro }).then((agenda) =>{
            agenda = agenda.filter(a => (""+a.atend_categoria) !== "Feriado");
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda.length)
            //console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
                    idsAgendasEx.push(a);
                }
            })
           
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                idsAgendasEx.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoal", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },//fim carregaAgendaPessoal
    
    carregaAgendaPessoalOLD3_OK(req, res) {//detecta campos filhos e remove os pais sumindo da agenda OK
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
        arrayIds.forEach((id) => { if (id == lvlUsu) isAgendaTerapeuta = true; });

        let isSemanal = "false";
        let idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta, hoje;

        // 🔹 Período: HOJE (00:00:00 até 23:59:59)
        let seg = new Date(); seg.setHours(0,0,0,0);
        let sex = new Date(); sex.setHours(23,59,59,999);
        let diaSemana = new Date(seg);

        switch (seg.getUTCDay()) {
            case 0: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() + 1); break;
            case 1: hoje = "seg"; break;
            case 2: hoje = "ter"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 1); break;
            case 3: hoje = "qua"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 2); break;
            case 4: hoje = "qui"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 3); break;
            case 5: hoje = "sex"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 4); break;
            case 6: hoje = "sab"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 5); break;
            default: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 6); break;
        }

        let diaDeHoje = new Date(diaSemana);
        let semana = [
            {dia: "seg", data: this.getData(diaSemana)},
            {dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}
        ];
        let diaBase = new Date(diaDeHoje);
        segunda = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        terca = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quarta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quinta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        sexta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));

        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        let dataIsoSeg = fncGeral.getDateToIsostring(seg);
        let dataIsoSex = fncGeral.getDateToIsostring(sex);

        console.log("=".repeat(80));
        console.log("🔍 [CARREGA AGENDA - GET] INÍCIO");
        console.log("👤 Terapeuta Logado:", idTerapeuta);
        console.log("📅 Data:", dataIsoSeg);
        console.log("=".repeat(80));

        // 🔹 FASE 1: Buscar registros do terapeuta (HOJE) e ORDENAR POR HORA
        Agenda.find({
            agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex },
            agenda_usuid: idFiltro
        }).then((agenda) => {
            
            // 👉 ORDENAR POR HORA IMEDIATAMENTE
            agenda.sort((a, b) => {
                let datA = new Date(a.agenda_data);
                let datB = new Date(b.agenda_data);
                return datA - datB;
            });

            console.log("\n📦 [FASE 1] Registros do terapeuta logado (ORDENADOS POR HORA) | Total:", agenda.length);
            agenda.forEach((a, i) => {
                let dat = new Date(a.agenda_data);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                console.log(`   [${i+1}] ${h}:${m} | ${a._id} | cat: ${a.agenda_categoria} | temp: ${a.agenda_temp} | tempId: ${a.agenda_tempId}`);
            });

            // 🔹 FASE 2: Remover "Falta Absoluta" e "Feriado" (APENAS O PAI, mantém o FILHO)
            console.log("\n🗑️ [FASE 2] Remover Feriado / Falta Absoluta (APENAS PAI, mantém FILHO)");
            let antes2 = agenda.length;
            let idsPaisParaRemover = new Set();
            
            agenda.forEach(reg => {
                let cat = "" + reg.agenda_categoria;
                if (cat === "Feriado" || cat === "Falta Absoluta") {
                    if (reg.agenda_temp === true && reg.agenda_tempId) {
                        idsPaisParaRemover.add("" + reg.agenda_tempId);
                        console.log(`   🔄 Filho Falta/Feriado: ${reg._id} → Pai a remover: ${reg.agenda_tempId}`);
                    }
                    else if (reg.agenda_temp === false || !reg.agenda_temp) {
                        idsPaisParaRemover.add("" + reg._id);
                        console.log(`   🔄 Pai Falta/Feriado: ${reg._id} → Remove ele mesmo`);
                    }
                }
            });
            
            agenda = agenda.filter(reg => !idsPaisParaRemover.has("" + reg._id));
            let depois2 = agenda.length;
            
            console.log(`   IDs de pais para remover: ${idsPaisParaRemover.size}`);
            console.log(`   Antes: ${antes2} | Depois: ${depois2} | Removidos: ${antes2 - depois2}`);
            console.log(`   Restam: ${agenda.length}`);
            agenda.forEach((a, i) => {
                let dat = new Date(a.agenda_data);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                console.log(`   [${i+1}] ${h}:${m} | ${a._id} | cat: ${a.agenda_categoria} | temp: ${a.agenda_temp} | tempId: ${a.agenda_tempId}`);
            });

            // 🔹 FASE 3: Formatação dos campos
            console.log("\n📝 [FASE 3] Formatação");
            agenda.forEach((e) => {
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                e.agenda_hora = `${h}:${m}`;
                e.agenda_aux = aux++;
                const dias = ["dom","seg","ter","qua","qui","sex","sab"];
                e.agenda_data_semana = dias[dat.getUTCDay()];
            });
            console.log(`   Formatados: ${agenda.length}`);
            agenda.forEach((a, i) => {
                console.log(`   [${i+1}] ${a.agenda_hora} | ${a._id} | cat: ${a.agenda_categoria} | temp: ${a.agenda_temp} | tempId: ${a.agenda_tempId}`);
            });

            // 🔹 FASE 4: Verificação final (dados crus da Fase 3)
            console.log("\n🔍 [FASE 4] Verificação Final (antes da filtragem de substituição)");
            console.log(`   Total antes da filtragem de substituição: ${agenda.length}`);
            agenda.forEach((a, i) => {
                console.log(`   [${i+1}] ${a.agenda_hora} | ${a._id} | cat: ${a.agenda_categoria} | temp: ${a.agenda_temp} | tempId: ${a.agenda_tempId}`);
            });

            // 🔹 FASE 5: Filtrar substituições de terapeutas (CÓDIGO FUNDAMENTAL)
            console.log("\n🔄 [FASE 5] Filtrar substituições de terapeutas");
            let arrIdsAgendas = agenda.map(a => a._id);
            console.log(`   Buscando filhos que apontam para ${arrIdsAgendas.length} registros...`);

            return Agenda.find({agenda_tempId: {$in: arrIdsAgendas}}).then((agendaSemanal) => {
                console.log(`   Filhos encontrados no banco: ${agendaSemanal.length}`);
                
                let antesFase5 = agenda.length;
                let agendasFiltradas = agenda.filter(a => {
                    let match = agendaSemanal.find(s => 
                        s.agenda_tempId?.toString() === a._id.toString()
                    );

                    if (!match) return true;
                    
                    let mesmoTerapeuta = a.agenda_usuid.toString() === match.agenda_usuid.toString();
                    console.log(`   🎯 ${a.agenda_hora} | Pai: ${a.agenda_usuid} | Filho: ${match.agenda_usuid} | Mantém? ${mesmoTerapeuta}`);
                    return mesmoTerapeuta;
                });
                let depoisFase5 = agendasFiltradas.length;
                console.log(`   Antes: ${antesFase5} | Depois: ${depoisFase5} | Removidos (substituídos): ${antesFase5 - depoisFase5}`);

                // 🔹 FASE 6: Carregar dados auxiliares
                console.log("\n📅 [FASE 6] Carregar dados auxiliares");
                return Promise.all([
                    Bene.find(),
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}),
                    Horaage.find().sort({horaage_turno: 1, horaage_ordem: 1}),
                    Sala.find()
                ]).then(([bene, terapeutas, horaage, sala]) => {
                    
                    bene.sort((a,b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));
                    terapeutas.sort((a,b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));
                    sala.sort((a,b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));

                    // 👉 Cópia profunda pra temDia não modificar o original
                    let agendasParaTemDia = JSON.parse(JSON.stringify(agendasFiltradas));
                    let segASex = ["seg","ter","qua","qui","sex"];
                    segASex.forEach(dia => {
                        let tem = agendasParaTemDia.some(a => a.agenda_data_semana === dia);
                        this.temDia(tem, horaage, agendasParaTemDia, semana, dia);
                    });

                    // 🔹 FASE 7: Log final e render
                    console.log("\n🎬 [FASE 7] Renderizar view");
                    console.log(`✅ [LOG FINAL] Enviando ${agendasFiltradas.length} agendamentos para a view:`);
                    agendasFiltradas.forEach(a => {
                        console.log(`   📋 ${a.agenda_hora} | ${a.agenda_categoria} | Bene: ${a.agenda_beneid}`);
                    });
                    
                    res.render("agenda/agendaPessoal", {
                        salas: sala,
                        horaages: horaage,
                        agendas: agendasFiltradas,
                        benes: bene,
                        terapeutas: terapeutas,
                        semanas: semana,
                        dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal
                    });
                });
            });
        }).catch((err) => {
            console.log("❌ [ERRO] carregaAgendaPessoal:", err);
            req.flash("error_message", "Erro ao carregar agenda");
            res.redirect('admin/erro');
        });
    },
    carregaAgendaPessoalErr(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        

        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
        arrayIds.forEach((id) => { if (id == lvlUsu) isAgendaTerapeuta = true; });

        let isSemanal = "false";
        let idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta, hoje;

        // 🔹 Período: HOJE (00:00:00 até 23:59:59)
        let seg = new Date(); seg.setHours(0,0,0,0);
        let sex = new Date(); sex.setHours(23,59,59,999);
        let diaSemana = new Date(seg);

        switch (seg.getUTCDay()) {
            case 0: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() + 1); break;
            case 1: hoje = "seg"; break;
            case 2: hoje = "ter"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 1); break;
            case 3: hoje = "qua"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 2); break;
            case 4: hoje = "qui"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 3); break;
            case 5: hoje = "sex"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 4); break;
            case 6: hoje = "sab"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 5); break;
            default: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 6); break;
        }

        let diaDeHoje = new Date(diaSemana);
        let semana = [
            {dia: "seg", data: this.getData(diaSemana)},
            {dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}
        ];
        let diaBase = new Date(diaDeHoje);
        segunda = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        terca = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quarta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quinta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        sexta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));

        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        let dataIsoSeg = fncGeral.getDateToIsostring(seg);
        let dataIsoSex = fncGeral.getDateToIsostring(sex);

        console.log("=".repeat(80));
        console.log("🔍 [CARREGA AGENDA - GET] INÍCIO");
        console.log("👤 Terapeuta Logado:", idTerapeuta);
        console.log("📅 Data:", dataIsoSeg);
        console.log("=".repeat(80));

        // 🔹 FASE 1: Buscar registros do terapeuta (HOJE) e ORDENAR POR HORA
        return Agenda.find({
            agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex },
            agenda_usuid: idFiltro
        }).then((agenda) => {
            
            // 👉 ORDENAR POR HORA IMEDIATAMENTE
            agenda.sort((a, b) => {
                let datA = new Date(a.agenda_data);
                let datB = new Date(b.agenda_data);
                return datA - datB;
            });

            console.log("\n📦 [FASE 1] Registros do terapeuta logado (ORDENADOS POR HORA) | Total:", agenda.length);
            agenda.forEach((a, i) => {
                let dat = new Date(a.agenda_data);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                console.log(`   [${i+1}] ${h}:${m} | ${a._id} | cat: ${a.agenda_categoria} | temp: ${a.agenda_temp} | tempId: ${a.agenda_tempId}`);
            });

            // 🔹 FASE 2: Remover "Falta Absoluta" e "Feriado" (APENAS O PAI, mantém o FILHO)
            console.log("\n🗑️ [FASE 2] Remover Feriado / Falta Absoluta (APENAS PAI, mantém FILHO)");
            let antes2 = agenda.length;
            let idsPaisParaRemover = new Set();
            
            agenda.forEach(reg => {
                let cat = "" + reg.agenda_categoria;
                if (cat === "Feriado" || "cat" || cat === "Falta Absoluta") {
                    if (reg.agenda_temp === true && reg.agenda_tempId) {
                        // É filho, não remove (mantém para cadeia)
                        console.log(`   🔄 Filho Falta/Feriado: ${reg._id} → Mantém (cadeia)`);
                    }
                    else if (reg.agenda_temp === false || !reg.agenda_temp) {
                        // É pai, marca para remover
                        idsPaisParaRemover.add("" + reg._id);
                        console.log(`   🗑️ Pai Falta/Feriado: ${reg._id} → Remove ele mesmo`);
                    }
                }
            });
            
            agenda = agenda.filter(reg => !idsPaisParaRemover.has("" + reg._id));
            let depois2 = agenda.length;
            
            console.log(`   IDs de pais para remover: ${idsPaisParaRemover.size}`);
            console.log(`   Antes: ${antes2} | Depois: ${depois2} | Removidos: ${antes2 - depois2}`);
            console.log(`   Restam: ${agenda.length}`);

            // 🔹 FASE 3: Formatação dos campos
            console.log("\n📝 [FASE 3] Formatação");
            agenda.forEach((e) => {
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                e.agenda_hora = `${h}:${m}`;
                e.agenda_aux = aux++;
                const dias = ["dom","seg","ter","qua","qui","sex","sab"];
                e.agenda_data_semana = dias[dat.getUTCDay()];
            });
            console.log(`   Formatados: ${agenda.length}`);

            // 🔹 FASE 4: Verificação final (dados crus antes da cadeia)
            console.log("\n🔍 [FASE 4] Verificação Final (antes da resolução de cadeia)");
            console.log(`   Total antes da cadeia: ${agenda.length}`);

            // 🔹 FASE 5: Buscar filhos para resolução de cadeia
            console.log("\n🔄 [FASE 5] Buscar registros filhos para cadeia de substituição");
            let arrIdsAgendas = agenda.map(a => a._id);
            console.log(`   IDs únicos para busca: ${arrIdsAgendas.length}`);

            return Agenda.find({agenda_tempId: {$in: arrIdsAgendas}}).then((filhosEncontrados) => {
                console.log(`   📦 Filhos encontrados no banco: ${filhosEncontrados.length}`);
                
                // 🔹 FASE 6: Resolução de Cadeia (Pai → Filho → Neto)
                console.log("\n🔗 [FASE 6] Resolução de Cadeia de Substituição");
                
                // Mapa rápido para acessar filhos por tempId
                let mapaFilhos = new Map();
                filhosEncontrados.forEach(f => {
                    let tempId = "" + f.agenda_tempId;
                    if (!mapaFilhos.has(tempId)) {
                        mapaFilhos.set(tempId, []);
                    }
                    mapaFilhos.get(tempId).push(f);
                });
                
                // Função para seguir a cadeia (máx 3 níveis)
                function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                    let cadeia = [registroInicial];
                    let idAtual = "" + registroInicial._id;
                    
                    // Verifica loop
                    if (visitados.has(idAtual)) {
                        console.log(`   ⚠️ Loop detectado em ${idAtual}, interrompendo cadeia`);
                        return cadeia;
                    }
                    visitados.add(idAtual);
                    
                    // Limite de 3 níveis
                    if (nivel >= 2) {
                        return cadeia;
                    }
                    
                    // Verifica se é "Falta" ou "Feriado" (encerra cadeia)
                    let cat = "" + registroInicial.agenda_categoria;
                    if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") {
                        return cadeia;
                    }
                    
                    // Procura próximo nível
                    let proximos = mapaFilhos.get(idAtual) || [];
                    if (proximos.length > 0) {
                        // Pega o primeiro filho válido (normalmente só tem 1)
                        let proximo = proximos[0];
                        let subCadeia = resolverCadeia(proximo, nivel + 1, visitados);
                        cadeia = cadeia.concat(subCadeia);
                    }
                    
                    return cadeia;
                }
                
                // Cores por categoria (mantendo as originais + roxo para substituição)
                function definirVisual(catFinal, ehUltimo, mesmoTerapeuta) {
                    let corBorda = "lightgreen";
                    let corFundo = "transparent";
                    let mostrarBotao = false;
                    let icone = "fa-pencil";
                    
                    switch(catFinal) {
                        case "Falta":
                        case "Falta Justificada":
                            corBorda = "orange";
                            corFundo = "#fff3e0";
                            icone = "fa-ban";
                            break;
                        case "Falta Absoluta":
                            corBorda = "orange";
                            corFundo = "#ffe0b2";
                            icone = "fa-ban";
                            break;
                        case "Feriado":
                            corBorda = "orange";
                            corFundo = "#ffe0b2";
                            icone = "fa-ban";
                            break;
                        case "Substituição":
                            corBorda = "#9b59b6"; // roxo
                            corFundo = "#f8f4fc";
                            icone = "fa-exchange";
                            break;
                        default:
                            corBorda = "lightgreen";
                            corFundo = "transparent";
                            icone = "fa-pencil";
                    }
                    
                    // Botão só aparece se: é o último da cadeia E é do terapeuta logado E não é falta/feriado
                    if (ehUltimo && mesmoTerapeuta && 
                        catFinal !== "Falta" && catFinal !== "Falta Justificada" && 
                        catFinal !== "Falta Absoluta" && catFinal !== "Feriado") {
                        mostrarBotao = true;
                    }
                    
                    return { corBorda, corFundo, mostrarBotao, icone };
                }
                
                // Processa cada registro
                agenda.forEach((reg, idx) => {
                    let cadeia = resolverCadeia(reg);
                    let ultimo = cadeia[cadeia.length - 1];
                    
                    // Monta histórico para auditoria
                    let historico = cadeia.map((c, i) => ({
                        nivel: i,
                        id: c._id,
                        terapeutaId: c.agenda_usuid,
                        categoria: c.agenda_categoria,
                        data: c.agenda_data
                    }));
                    
                    // Define visual baseado no ÚLTIMO da cadeia
                    let catFinal = "" + ultimo.agenda_categoria;
                    let ehUltimo = ultimo._id.toString() === reg._id.toString();
                    let mesmoTerapeuta = ultimo.agenda_usuid.toString() === idTerapeuta;
                    
                    // Decide se aparece para quem logou
                    let deveAparecer = reg.agenda_usuid.toString() === idTerapeuta;
                    
                    // Define visual
                    let visual = definirVisual(catFinal, ehUltimo, mesmoTerapeuta);
                    
                    // Monta tooltip com cadeia completa
                    let tooltip = "";
                    if (cadeia.length > 1) {
                        tooltip = cadeia.map((c, i) => {
                            let nivelTxt = i === 0 ? "Original" : (i === 1 ? "Subst.1" : "Subst.2");
                            return `${nivelTxt}: ${c.agenda_usuid} (${c.agenda_categoria})`;
                        }).join(" → ");
                    } else {
                        tooltip = `${reg.agenda_categoria} (Sem substituição)`;
                    }
                    
                    // Anexa campos ao registro
                    reg.cadeia = {
                        nivel: cadeia.indexOf(reg),
                        tamanho: cadeia.length,
                        ultimoId: ultimo._id,
                        ultimoTerapeutaId: ultimo.agenda_usuid,
                        ultimoCategoria: catFinal,
                        historico: historico
                    };
                    
                    reg.visual = {
                        corBorda: visual.corBorda,
                        corFundo: visual.corFundo,
                        mostrarBotao: visual.mostrarBotao,
                        tooltip: tooltip,
                        icone: visual.icone,
                        ehUltimo: ehUltimo,
                        mesmoTerapeuta: mesmoTerapeuta
                    };
                    
                    reg.contexto = {
                        cadeiaCompleta: historico,
                        totalSubstituicoes: cadeia.length - 1
                    };
                    
                    reg.deveAparecer = deveAparecer;
                    
                    console.log(`   [${idx+1}] ${reg.agenda_hora} | Nível: ${reg.cadeia.nivel} | Cadeia: ${cadeia.length} | Aparece: ${deveAparecer} | Botão: ${visual.mostrarBotao} | Cor: ${visual.corBorda}`);
                });
                
                // Filtra apenas o que deve aparecer para quem logou
                let antesFase6 = agenda.length;
                agenda = agenda.filter(r => r.deveAparecer === true);
                let depoisFase6 = agenda.length;
                
                console.log(`   📊 Antes: ${antesFase6} | Depois: ${depoisFase6} | Ocultos (não são deste terapeuta): ${antesFase6 - depoisFase6}`);
                console.log(`   ✅ Agendamentos que aparecerão na view: ${agenda.length}`);

                // 🔹 FASE 7: Carregar dados auxiliares
                console.log("\n📅 [FASE 7] Carregar dados auxiliares");
                return Promise.all([
                    Bene.find(),
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}),
                    Horaage.find().sort({horaage_turno: 1, horaage_ordem: 1}),
                    Sala.find()
                ]).then(([bene, terapeutas, horaage, sala]) => {
                    
                    bene.sort((a,b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));
                    terapeutas.sort((a,b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));
                    sala.sort((a,b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));

                    // 👉 Cópia profunda pra temDia não modificar o original
                    let agendasParaTemDia = JSON.parse(JSON.stringify(agenda));
                    let segASex = ["seg","ter","qua","qui","sex"];
                    segASex.forEach(dia => {
                        let tem = agendasParaTemDia.some(a => a.agenda_data_semana === dia);
                        this.temDia(tem, horaage, agendasParaTemDia, semana, dia);
                    });

                    // 🔹 FASE 8: Log final e render
                    console.log("\n🎬 [FASE 8] Renderizar view");
                    console.log(`✅ [LOG FINAL] Enviando ${agenda.length} agendamentos para a view:`);
                    agenda.forEach(a => {
                        console.log(`   📋 ${a.agenda_hora} | ${a.agenda_categoria} | Cadeia: ${a.cadeia.tamanho} | Botão: ${a.visual.mostrarBotao} | Cor: ${a.visual.corBorda}`);
                    });
                    
                    res.render("agenda/agendaPessoal", {
                        salas: sala,
                        horaages: horaage,
                        agendas: agenda,
                        benes: bene,
                        terapeutas: terapeutas,
                        semanas: semana,
                        dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal
                    });
                });
            });
        }).catch((err) => {
            console.log("❌ [ERRO] carregaAgendaPessoal:", err);
            req.flash("error_message", "Erro ao carregar agenda");
            res.redirect('admin/erro');
        });
    },
    carregaAgendaPessoal_ok(req, res) {
        // ========================================================================
        // 📦 FASE 0: Inicialização de Modelos e Variáveis
        // ========================================================================
        console.log("=".repeat(80));
        console.log("🔍 [CARREGA AGENDA PESSOAL] INÍCIO");
        console.log("👤 Terapeuta Logado:", req.cookies['idUsu']);
        console.log("📅 Data da Requisição:", new Date().toISOString());
        console.log("=".repeat(80));

        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        

        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
        arrayIds.forEach((id) => { if (id == lvlUsu) isAgendaTerapeuta = true; });

        let isSemanal = "false";
        let idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta, hoje;

        // ========================================================================
        // 📅 FASE 1: Definir Período da Semana (Segunda a Sexta)
        // ========================================================================
        console.log("\n📅 [FASE 1] Definindo período da semana");
        
        let seg = new Date(); seg.setHours(0,0,0,0);
        let sex = new Date(); sex.setHours(23,59,59,999);
        let diaSemana = new Date(seg);

        switch (seg.getUTCDay()) {
            case 0: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() + 1); break;
            case 1: hoje = "seg"; break;
            case 2: hoje = "ter"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 1); break;
            case 3: hoje = "qua"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 2); break;
            case 4: hoje = "qui"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 3); break;
            case 5: hoje = "sex"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 4); break;
            case 6: hoje = "sab"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 5); break;
            default: hoje = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 6); break;
        }

        let diaDeHoje = new Date(diaSemana);
        let semana = [
            {dia: "seg", data: this.getData(diaSemana)},
            {dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}
        ];
        
        let diaBase = new Date(diaDeHoje);
        segunda = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        terca = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quarta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quinta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        sexta = this.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));

        console.log(`   📆 Período: ${seg.toISOString()} até ${sex.toISOString()}`);
        console.log(`   📍 Dia de hoje na semana: ${hoje}`);

        // ========================================================================
        // 🔍 FASE 2: Buscar Registros do Terapeuta Logado (Query Otimizada)
        // ========================================================================
        console.log("\n🔍 [FASE 2] Buscando registros do terapeuta logado");
        
        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        let dataIsoSeg = fncGeral.getDateToIsostring(seg);
        let dataIsoSex = fncGeral.getDateToIsostring(sex);

        return Agenda.find({
            agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex },
            agenda_usuid: idFiltro
        }).then((agenda) => {
            
            console.log(`   📦 Registros brutos encontrados: ${agenda.length}`);
            
            // 👉 ORDENAR POR HORA IMEDIATAMENTE (mantém consistência)
            agenda.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

            // ========================================================================
            // 📝 FASE 3: Formatação dos Campos (Data, Hora, Dia da Semana)
            // ========================================================================
            console.log("\n📝 [FASE 3] Formatando campos dos registros");
            
            agenda.forEach((e) => {
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                e.agenda_hora = `${h}:${m}`;
                
                e.agenda_aux = aux++;
                
                const dias = ["dom","seg","ter","qua","qui","sex","sab"];
                e.agenda_data_semana = dias[dat.getUTCDay()];
            });
            
            console.log(`   ✅ Formatados: ${agenda.length} registros`);

            // ========================================================================
            // 🔗 FASE 4: Detectar Filhos e Netos (Construir Mapa de Cadeia)
            // ========================================================================
            console.log("\n🔗 [FASE 4] Detectando filhos e netos para resolução de cadeia");
            
            // Coletar todos os IDs para busca em massa (1 query só)
            let idsAtuais = agenda.map(a => a._id);
            console.log(`   🔎 Buscando filhos que apontam para ${idsAtuais.length} registros...`);

            return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).then((filhosEncontrados) => {
                
                console.log(`   📦 Filhos encontrados no banco: ${filhosEncontrados.length}`);
                
                // 👉 Criar mapa rápido: tempId → [filhos]
                let mapaFilhos = new Map();
                filhosEncontrados.forEach(f => {
                    let tempId = "" + f.agenda_tempId;
                    if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                    mapaFilhos.get(tempId).push(f);
                });

                // ========================================================================
    // 🧠 FASE 5: Resolver Cadeia para Cada Registro (Pai → Filho → Neto)
    // ========================================================================
    console.log("\n🧠 [FASE 5] Resolvendo cadeia de substituição para cada registro");

    // Função recursiva para seguir a cadeia (máx 3 níveis, sem loop)
    function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
        let cadeia = [registroInicial];
        let idAtual = "" + registroInicial._id;
        
        // 🔒 Proteção contra loop infinito
        if (visitados.has(idAtual)) {
            console.log(`   ⚠️ Loop detectado em ${idAtual}, interrompendo`);
            return cadeia;
        }
        visitados.add(idAtual);
        
        // 🛑 Limite de 3 níveis (Pai → Filho → Neto)
        if (nivel >= 2) return cadeia;
        
        // 🛑 Categorias que encerram a cadeia (Falta/Feriado)
        let cat = "" + registroInicial.agenda_categoria;
        if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") {
            return cadeia;
        }
        
        // 🔍 Procura próximo nível no mapa
        let proximos = mapaFilhos.get(idAtual) || [];
        if (proximos.length > 0) {
            let proximo = proximos[0]; // Normalmente só tem 1 filho por pai
            let subCadeia = resolverCadeia(proximo, nivel + 1, visitados);
            cadeia = cadeia.concat(subCadeia);
        }
        
        return cadeia;
    }

    // Função para definir visual baseado na categoria final
    function definirVisual(catFinal) {
        switch(catFinal) {
            case "Falta":
            case "Falta Justificada":
                return { corBorda: "orange", corFundo: "#fff3e0", icone: "fa-ban" };
            case "Falta Absoluta":
                return { corBorda: "orange", corFundo: "#ffe0b2", icone: "fa-ban" };
            case "Feriado":
                return { corBorda: "orange", corFundo: "#ffe0b2", icone: "fa-ban" };
            case "Substituição":
                return { corBorda: "#9b59b6", corFundo: "#f8f4fc", icone: "fa-exchange" };
            default:
                return { corBorda: "lightgreen", corFundo: "transparent", icone: "fa-pencil" };
        }
    }

    // Processa CADA registro da agenda
    agenda.forEach((reg, idx) => {
        
        // 👉 a) Detectar se tem filhos/netos
        let temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
        
        // 👉 a.1) Se NÃO tiver filhos/netos → exibe normalmente
        if (!temFilhos) {
            reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: reg.agenda_categoria };
            reg.visual = { ...definirVisual(reg.agenda_categoria), mostrarBotao: true, tooltip: "Agendamento normal" };
            reg.deveAparecer = true; // Sempre aparece se é do terapeuta logado
            
            // 👉 Preparar UI simples para a view (DENTRO do forEach!)
            reg.ui = {
                icone: "pencil",
                tooltipTitulo: reg.agenda_categoria,
                tooltipTexto: "Clique para evoluir",
                temLink: true
            };
            
            console.log(`   [${idx+1}] ${reg.agenda_hora} | 🟢 Sem cadeia | Categoria: ${reg.agenda_categoria} | Aparece: SIM`);
            return;
        }
        
        // 👉 a.2) Se TIVER filhos/netos → resolver cadeia completa
        let cadeia = resolverCadeia(reg);
        let ultimo = cadeia[cadeia.length - 1]; // Último prevalece
        let catFinal = "" + ultimo.agenda_categoria;
        
        // Monta histórico para auditoria/tooltip
        let historico = cadeia.map((c, i) => {
            let nivelTxt = i === 0 ? "Original" : (i === 1 ? "Subst.1" : "Subst.2");
            return `${nivelTxt}: ${c.agenda_usuid} (${c.agenda_categoria})`;
        });
        
        // 👉 Substitui categoria do pai pela categoria do último (neto prevalece)
        reg.cadeia = {
            nivel: cadeia.indexOf(reg),
            tamanho: cadeia.length,
            ultimoId: ultimo._id,
            ultimoTerapeutaId: ultimo.agenda_usuid,
            ultimoCategoria: catFinal,
            historico: historico
        };
        
        // Define visual baseado no ÚLTIMO da cadeia
        let visualBase = definirVisual(catFinal);
        let ehUltimo = ultimo._id.toString() === reg._id.toString();
        let mesmoTerapeuta = ultimo.agenda_usuid.toString() === idTerapeuta;
        
        // Botão: só aparece se for o último DA CADEIA + for do terapeuta logado + não for falta/feriado
        let mostrarBotao = ehUltimo && mesmoTerapeuta && 
                        catFinal !== "Falta" && catFinal !== "Falta Justificada" && 
                        catFinal !== "Falta Absoluta" && catFinal !== "Feriado";
        
        reg.visual = {
            ...visualBase,
            mostrarBotao: mostrarBotao,
            tooltip: historico.join(" → "),
            ehUltimo: ehUltimo,
            mesmoTerapeuta: mesmoTerapeuta,
            temCadeia: cadeia.length > 1
        };
        
        // 👉 Decidir se aparece: cada terapeuta vê APENAS seu registro na cadeia
        reg.deveAparecer = reg.agenda_usuid.toString() === idTerapeuta;
        
        // 👉 Preparar UI simples para a view (DENTRO do forEach!)
        // Garante que Falta/Feriado SEMPRE usem "ban", independente de cadeia
        let iconeTipo = "pencil"; // padrão
        if (catFinal === "Falta Absoluta" || catFinal === "Feriado") {
            iconeTipo = "ban";
        } else if (catFinal === "Substituição" && reg.visual.temCadeia) {
            iconeTipo = "ban";
        }

        reg.ui = {
            icone: iconeTipo,
            tooltipTitulo: reg.visual.temCadeia ? "🔗 Cadeia" : reg.agenda_categoria,
            tooltipTexto: reg.visual.temCadeia ? reg.visual.tooltip : 
                        (catFinal === "Falta Absoluta" ? "Sem evolução possível" :
                        catFinal === "Feriado" ? "Agenda fechada" :
                        catFinal === "Falta Justificada" ? "Aguardando confirmação" :
                        catFinal === "Falta" ? "Aguardando justificativa" :
                        "Clique para evoluir"),
            temLink: mostrarBotao
        };
        
        // Log detalhado para debug
        let status = cadeia.length > 1 ? `🔗 Cadeia(${cadeia.length})` : "🟢 Normal";
        let botaoTxt = mostrarBotao ? "✅ Botão" : "❌ Sem botão";
        console.log(`   [${idx+1}] ${reg.agenda_hora} | ${status} | Cat.Final: ${catFinal} | ${botaoTxt} | Aparece: ${reg.deveAparecer} | UI: ${reg.ui.icone}`);
    });
                // ========================================================================
                // 🧹 FASE 5.5: Remover duplicados (Pai quando existe Filho no mesmo slot)
                // ========================================================================
                console.log("\n🧹 [FASE 5.5] Removendo duplicados: Pai vs Filho (mesmo slot, sem substituição)");

                // Agrupar registros por: data + hora + sala + beneficiário
                let grupos = new Map();
                agenda.forEach(reg => {
                    // Chave única do slot: dia+hora+sala+beneficiário
                    let chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                    
                    if (!grupos.has(chave)) {
                        grupos.set(chave, []);
                    }
                    grupos.get(chave).push(reg);
                });

                // Processar cada grupo
                let idsParaRemover = new Set();
                grupos.forEach((registros, chave) => {
                    // Só interessa se tiver mais de 1 registro no mesmo slot
                    if (registros.length < 2) return;
                    
                    // Separar pais e filhos
                    let pais = registros.filter(r => !r.agenda_temp);
                    let filhos = registros.filter(r => r.agenda_temp);
                    
                    // Se tem filho E não é substituição → remover o pai
                    if (filhos.length > 0 && pais.length > 0) {
                        // Verificar se algum é substituição (se for, NÃO remove, trata na cadeia)
                        let temSubstituicao = registros.some(r => r.agenda_categoria === "Substituição");
                        
                        if (!temSubstituicao) {
                            // 👉 Remover todos os pais deste grupo
                            pais.forEach(pai => {
                                idsParaRemover.add("" + pai._id);
                                console.log(`   🗑️ Removendo PAI duplicado: ${pai._id} | Slot: ${chave}`);
                            });
                            // 👉 Manter os filhos (já estão corretos)
                            console.log(`   ✅ Mantendo FILHO(s): ${filhos.map(f => f._id).join(', ')} | Slot: ${chave}`);
                        }
                    }
                });

                // Filtrar agenda removendo os pais marcados
                let antesDedup = agenda.length;
                agenda = agenda.filter(reg => !idsParaRemover.has("" + reg._id));
                let depoisDedup = agenda.length;

                console.log(`   📊 Duplicados removidos: ${antesDedup - depoisDedup}`);
                console.log(`   ✅ Registros após deduplicação: ${agenda.length}`);
                // ========================================================================
                // 🎯 FASE 6: Filtrar Apenas o que Deve Aparecer para Quem Logou
                // ========================================================================
                console.log("\n🎯 [FASE 6] Filtrando registros para exibição");
                
                let antesFiltro = agenda.length;
                let agendasParaView = agenda.filter(r => r.deveAparecer === true);
                let depoisFiltro = agendasParaView.length;
                
                console.log(`   📊 Antes: ${antesFiltro} | Depois: ${depoisFiltro} | Ocultos: ${antesFiltro - depoisFiltro}`);
                console.log(`   ✅ Registros que aparecerão na view: ${agendasParaView.length}`);

                // ========================================================================
                // 📋 FASE 7: Log Final dos Registros que Serão Enviados
                // ========================================================================
                console.log("\n📋 [FASE 7] Resumo dos registros para a view");
                agendasParaView.forEach((a, i) => {
                    let tipo = a.agenda_temp ? "FILHO" : "PAI";
                    let cadeiaTxt = a.visual.temCadeia ? `🔗${a.cadeia.tamanho}` : "🟢";
                    let botaoTxt = a.visual.mostrarBotao ? "✅" : "❌";
                    console.log(`   [${i+1}] ${tipo} | ${a.agenda_hora} | ${cadeiaTxt} | ${a.agenda_categoria}→${a.cadeia.ultimoCategoria} | ${botaoTxt} | 🎨${a.visual.corBorda}`);
                });

                // ========================================================================
                // 📦 FASE 8: Carregar Dados Auxiliares e Renderizar View
                // ========================================================================
                console.log("\n📦 [FASE 8] Carregando dados auxiliares e renderizando");
                
                return Promise.all([
                    Bene.find(),
                    Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }),
                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
                    Sala.find()
                ]).then(([bene, terapeutas, horaage, sala]) => {
                    
                    // Ordenações para exibição
                    bene.sort((a,b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));
                    terapeutas.sort((a,b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));
                    sala.sort((a,b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));

                    // 👉 Cópia profunda para temDia não modificar o original
                    let agendasParaTemDia = JSON.parse(JSON.stringify(agendasParaView));
                    let segASex = ["seg","ter","qua","qui","sex"];
                    
                    segASex.forEach(dia => {
                        let tem = agendasParaTemDia.some(a => a.agenda_data_semana === dia);
                        this.temDia(tem, horaage, agendasParaTemDia, semana, dia);
                    });

                    // ========================================================================
                    // 🎬 FASE 9: Renderizar View
                    // ========================================================================
                    console.log("\n🎬 [FASE 9] Renderizando view agendaPessoal");
                    console.log(`✅ [SUCESSO] Enviando ${agendasParaView.length} agendamentos para a view`);
                    console.log("=".repeat(80));
                    
                    res.render("agenda/agendaPessoal", {
                        salas: sala,
                        horaages: horaage,
                        agendas: agendasParaView, // 👉 Lista filtrada e enriquecida
                        benes: bene,
                        terapeutas: terapeutas,
                        semanas: semana,
                        dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal
                    });
                });
            });
        }).catch((err) => {
            console.log("❌ [ERRO CRÍTICO] carregaAgendaPessoal:", err);
            req.flash("error_message", "Erro ao carregar agenda pessoal");
            res.redirect('admin/erro');
        });
    }, // fim carregaAgendaPessoal
    // ============================================================================
    // 📅 CARREGA AGENDA PESSOAL - Versão corrigida (tooltip + cores)
    // ============================================================================
carregaAgendaPessoalquasela(req, res) {
    console.log("=".repeat(80));
    console.log("🔍 [CARREGA AGENDA PESSOAL] INÍCIO");
    console.log("👤 Terapeuta Logado:", req.cookies['idUsu']);
    console.log("=".repeat(80));

    let db = req.cookies['preferredDb'];
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
    
    Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);

    const idTerapeuta = req.cookies['idUsu'];
    let aux = 1;

    // ========================================================================
    // 📅 FASE 1: Período da Semana
    // ========================================================================
    let seg = new Date(); seg.setHours(0,0,0,0);
    let sex = new Date(); sex.setHours(23,59,59,999);
    let diaSemana = new Date(seg);
    let hojeNome = ["dom","seg","ter","qua","qui","sex","sab"][seg.getUTCDay()] || "seg";
    if (seg.getUTCDay() !== 1) {
        diaSemana.setUTCDate(diaSemana.getUTCDate() - (seg.getUTCDay() === 0 ? -1 : seg.getUTCDay() - 1));
    }

    let semana = [
        {dia: "seg", data: fncGeral.getData(diaSemana)},
        {dia: "ter", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qui", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "sex", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))}
    ];
    
    let diaBase = new Date(diaSemana);
    const segunda = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
    const terca = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
    const quarta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
    const quinta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
    const sexta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
    const dataFiltro = seg.toISOString().slice(0, 10);

    const idFiltro = mongoose.Types.ObjectId(idTerapeuta);
    const dataIsoSeg = fncGeral.getDateToIsostring(seg);
    const dataIsoSex = fncGeral.getDateToIsostring(sex);

    // ========================================================================
    // 🔍 FASE 2: Buscar Registros
    // ========================================================================
    return Agenda.find({
        agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex }, // ✅ CORRIGIDO
        agenda_usuid: idFiltro
    }, 'agenda_data agenda_usuid agenda_categoria agenda_temp agenda_tempId agenda_salaid agenda_beneid agenda_obs agenda_terapiaid agenda_selo')
    .then((agenda) => {
        // 🔥 CONVERSÃO IMEDIATA PARA OBJETOS SIMPLES
        let agendaObj = JSON.parse(JSON.stringify(agenda));
        console.log(`📦 Registros brutos: ${agendaObj.length}`);
        agendaObj.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

        // 📝 Formatação
        agendaObj.forEach((e) => {
            const dat = new Date(e.agenda_data);
            e.agenda_data_dia = fncGeral.getDataFMT(dat);
            e.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getMinutes()).padStart(2, '0')}`;
            e.agenda_aux = aux++;
            e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()];
        });

        // 🔗 FASE 4: Detectar Filhos
        const idsAtuais = agendaObj.map(a => a._id);
        return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).lean().then((filhosEncontrados) => {
            const filhosObj = JSON.parse(JSON.stringify(filhosEncontrados));
            const mapaFilhos = new Map();
            filhosObj.forEach(f => {
                const tempId = (f.agenda_tempId || "").toString();
                if (tempId) {
                    if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                    mapaFilhos.get(tempId).push(f);
                }
            });

            // 🧠 FASE 5: Buscar Nomes
            const idsTerapeutas = new Set();
            agendaObj.forEach(r => idsTerapeutas.add(r.agenda_usuid?.toString()));
            filhosObj.forEach(f => idsTerapeutas.add(f.agenda_usuid?.toString()));

            return Usuario.find({ _id: { $in: Array.from(idsTerapeutas) } }, 'usuario_nome').lean().then((terapeutasNomes) => {
                const mapaNomes = {};
                terapeutasNomes.forEach(t => { mapaNomes[t._id.toString()] = t.usuario_nome; });

                // Função recursiva da cadeia
                function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                    let cadeia = [registroInicial];
                    const idAtual = "" + registroInicial._id;
                    if (visitados.has(idAtual) || nivel >= 2) return cadeia;
                    visitados.add(idAtual);
                    const cat = "" + registroInicial.agenda_categoria;
                    if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") return cadeia;
                    const proximos = mapaFilhos.get(idAtual) || [];
                    if (proximos.length > 0) {
                        cadeia = cadeia.concat(resolverCadeia(proximos[0], nivel + 1, visitados));
                    }
                    return cadeia;
                }

                // 🎨 Helper badgeStyle
                function getBadgeStyle(cat) {
                    const map = {
                        "Falta": "yellow",
                        "Falta Justificada": "orange", // ✅ LARANJA
                        "Falta Absoluta": "orange",
                        "Substituição": "cyan",
                        "SubstitutoFixo": "transparent",
                        "Feriado": "orange",
                        "default": "transparent"
                    };
                    const bg = map[cat] || map.default;
                    return `background-color: ${bg} !important; border: 1px solid transparent; color: #212529; display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 500; border-radius: 3px; white-space: nowrap; line-height: 1.3;`;
                }

                // 🔄 Processar Registros
                agendaObj.forEach((reg, idx) => {
                    const temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
                    
                    if (!temFilhos) {
                        // CASO 1: Sem cadeia
                        const cat = reg.agenda_categoria || "";
                        reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: cat };
                        reg.badgeStyle = getBadgeStyle(cat);
                        reg.deveAparecer = true;
                        
                        const isSubstFixo = (cat === "SubstitutoFixo");
                        const bloqueado = (cat === "Falta Absoluta" || cat === "Feriado");
                        
                        reg.ui = {
                            icone: bloqueado ? "ban" : "pencil",
                            tooltipTitulo: isSubstFixo ? "Padrão" : cat,
                            tooltipTexto: isSubstFixo ? "Clique para evoluir" : (
                                {
                                    "Falta Absoluta": "Sem evolução possível",
                                    "Feriado": "Agenda fechada",
                                    "Falta Justificada": "Aguardando confirmação",
                                    "Falta": "Aguardando justificativa"
                                }[cat] || "Clique para evoluir"
                            ),
                            temLink: !bloqueado
                        };
                        return;
                    }
                    
                    // CASO 2: Com cadeia
                    const cadeia = resolverCadeia(reg);
                    const ultimo = cadeia[cadeia.length - 1];
                    const catFinal = (ultimo.agenda_categoria || "").toString().trim() || reg.agenda_categoria;
                    
                    reg.cadeia = {
                        nivel: cadeia.indexOf(reg),
                        tamanho: cadeia.length,
                        ultimoCategoria: catFinal,
                        historico: cadeia.map((c, i) => {
                            const nome = mapaNomes[c.agenda_usuid?.toString()] || "Desconhecido";
                            return `${i===0?"Original":`Subst.${i}`}: ${nome} (${c.agenda_categoria})`;
                        })
                    };
                    
                    reg.badgeStyle = getBadgeStyle(catFinal);
                    
                    // 🟢 DETECÇÃO ESTRITA: APENAS "Substituição" dispara lógica especial
                    const temSubstituicao = cadeia.some(c => c.agenda_categoria === "Substituição");
                    const isPaiOriginal = (cadeia[0]._id.toString() === reg._id.toString());

                    // 🟢 TOOLTIP: IDÊNTICO PARA PAI E FILHO (SE FOR SUBSTITUIÇÃO)
                    let tooltipTexto = "";
                    let tooltipTitulo = cadeia.length > 1 ? "🔗 Cadeia" : catFinal;

                    if (temSubstituicao) {
                        const nomeOrig = mapaNomes[cadeia[0].agenda_usuid?.toString()] || "Terapeuta A";
                        const regSubst = cadeia.find(c => c.agenda_categoria === "Substituição");
                        const nomeSubst = mapaNomes[regSubst?.agenda_usuid?.toString()] || "Terapeuta B";
                        tooltipTexto = `Substituição\n${nomeOrig} por ${nomeSubst}`;
                        tooltipTitulo = "🔁 Substituição";
                    } else {
                        const isSubstFixo = (catFinal === "SubstitutoFixo");
                        tooltipTitulo = isSubstFixo ? "Padrão" : tooltipTitulo;
                        tooltipTexto = isSubstFixo ? "Clique para evoluir" : (
                            catFinal === "Falta Absoluta" ? "Sem evolução possível" :
                            catFinal === "Feriado" ? "Agenda fechada" :
                            catFinal === "Falta Justificada" ? "Aguardando confirmação" :
                            catFinal === "Falta" ? "Aguardando justificativa" :
                            "Clique para evoluir"
                        );
                    }

                    // 🟢 ÍCONE E LINK
                    let iconeTipo = "pencil";
                    let podeEditar = true;

                    if (temSubstituicao) {
                        if (isPaiOriginal) {
                            iconeTipo = "ban";       
                            podeEditar = false;
                        } else {
                            iconeTipo = "pencil";    
                            podeEditar = true;
                        }
                    } else if (catFinal === "Falta Absoluta" || catFinal === "Feriado") {
                        iconeTipo = "ban";
                        podeEditar = false;
                    }

                    reg.deveAparecer = reg.agenda_usuid?.toString() === idTerapeuta;
                    reg.ui = {
                        icone: iconeTipo,
                        tooltipTitulo: tooltipTitulo,
                        tooltipTexto: tooltipTexto,
                        temLink: podeEditar
                    };
                    
                    console.log(`[${idx+1}] 🔗 Cadeia(${cadeia.length}) | Pos: ${isPaiOriginal ? 'PAI' : 'FILHO'} | CatFinal: ${catFinal} | Sub? ${temSubstituicao} | Icone: ${iconeTipo}`);
                });

                // 🧹 Remover duplicados
                const grupos = new Map();
                agendaObj.forEach(reg => {
                    const chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                    if (!grupos.has(chave)) grupos.set(chave, []);
                    grupos.get(chave).push(reg);
                });
                const idsParaRemover = new Set();
                grupos.forEach(regs => {
                    if (regs.length < 2) return;
                    const pais = regs.filter(r => !r.agenda_temp);
                    const filhos = regs.filter(r => r.agenda_temp);
                    if (filhos.length > 0 && pais.length > 0 && !regs.some(r => r.agenda_categoria === "Substituição")) {
                        pais.forEach(p => idsParaRemover.add("" + p._id));
                    }
                });
                agendaObj = agendaObj.filter(reg => !idsParaRemover.has("" + reg._id));

                // 🎯 Filtrar e enriquecer
                let agendasParaView = agendaObj.filter(r => r.deveAparecer === true);
                
                return Bene.find().lean().then((benesFull) => {
                    const benesObj = JSON.parse(JSON.stringify(benesFull));
                    agendasParaView.forEach(reg => {
                        const bene = benesObj.find(b => b._id === reg.agenda_beneid);
                        reg.beneNome = bene?.bene_nome || 'Sem beneficiário';
                        reg.beneApelido = bene?.bene_apelido || reg.beneNome;
                        
                        if (reg.agenda_selo === true || reg.agenda_selo === "true") {
                            reg.ui.temLink = false; reg.ui.icone = "check"; reg.ui.tooltipTexto = "Já evoluído";
                        }
                        if (reg.cadeia?.tamanho > 1 && reg.agenda_usuid?.toString() !== idTerapeuta) {
                            reg.ui.temLink = false; reg.ui.icone = "ban";
                        }
                    });

                    // 📦 Carregar auxiliares e renderizar
                    return Promise.all([
                        Bene.find({ bene_status: "Ativo" }).lean(),
                        Usuario.find({ usuario_status: "Ativo", $or: [{ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }, { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }] }).lean(),
                        Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).lean(),
                        Sala.find().lean(),
                        Terapia.find().lean()
                    ]).then(([bene, terapeutas, horaage, sala, terapias]) => {
                        bene.sort((a,b) => a.bene_nome?.localeCompare(b.bene_nome, 'pt-BR')||0);
                        terapeutas.sort((a,b) => a.usuario_nome?.localeCompare(b.usuario_nome, 'pt-BR')||0);
                        sala.sort((a,b) => a.sala_nome?.localeCompare(b.sala_nome, 'pt-BR')||0);
                        terapias.sort((a,b) => a.terapia_nome?.localeCompare(b.terapia_nome, 'pt-BR')||0);

                        console.log("\n✅ [SUCESSO] Enviando para view");
                        res.render("agenda/agendaPessoal", {
                            salas: sala,
                            horaages: horaage,
                            agendas: agendasParaView,
                            benes: bene,
                            terapeutas: terapeutas,
                            terapias: terapias,
                            semanas: semana,
                            segunda, terca, quarta, quinta, sexta, hoje: hojeNome,
                            dataFiltro: dataFiltro
                        });
                    });
                });
            });
        });
    })
    .catch((err) => {
        console.error("❌ [ERRO] carregaAgendaPessoal:", err);
        req.flash("error_message", "Erro ao carregar agenda pessoal");
        res.redirect('/admin/erro');
    });
},

    carregaAgendaPessoal(req, res) {
        console.log("=".repeat(80));
        console.log("🔍 [CARREGA AGENDA PESSOAL] INÍCIO");
        console.log("👤 Terapeuta Logado:", req.cookies['idUsu']);
        console.log("=".repeat(80));

        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);

        const idTerapeuta = req.cookies['idUsu'];
        let aux = 1;

        // ========================================================================
        // 📅 FASE 1: Período da Semana
        // ========================================================================
        let seg = new Date(); seg.setHours(0,0,0,0);
        let sex = new Date(); sex.setHours(23,59,59,999);
        let diaSemana = new Date(seg);
        let hojeNome = ["dom","seg","ter","qua","qui","sex","sab"][seg.getUTCDay()] || "seg";
        if (seg.getUTCDay() !== 1) {
            diaSemana.setUTCDate(diaSemana.getUTCDate() - (seg.getUTCDay() === 0 ? -1 : seg.getUTCDay() - 1));
        }

        let semana = [
            {dia: "seg", data: fncGeral.getData(diaSemana)},
            {dia: "ter", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qua", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qui", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "sex", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))}
        ];
        
        let diaBase = new Date(diaSemana);
        const segunda = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        const terca = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        const quarta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        const quinta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        const sexta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        const dataFiltro = seg.toISOString().slice(0, 10);

        const idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        const dataIsoSeg = fncGeral.getDateToIsostring(seg);
        const dataIsoSex = fncGeral.getDateToIsostring(sex);

        // ========================================================================
        // 🔍 FASE 2: Buscar Registros
        // ========================================================================
        return Agenda.find({
            agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex }, // ✅ CORRIGIDO
            agenda_usuid: idFiltro
        }, 'agenda_data agenda_usuid agenda_categoria agenda_temp agenda_tempId agenda_salaid agenda_beneid agenda_obs agenda_terapiaid agenda_selo agenda_evolucao')
        .then((agenda) => {
            // 🔥 CONVERSÃO IMEDIATA PARA OBJETOS SIMPLES
            let agendaObj = JSON.parse(JSON.stringify(agenda));
            console.log(`📦 Registros brutos: ${agendaObj.length}`);
            agendaObj.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

            // 📝 Formatação
            agendaObj.forEach((e) => {
                const dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                e.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getMinutes()).padStart(2, '0')}`;
                e.agenda_aux = aux++;
                e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()];
            });

            // 🔗 FASE 4: Detectar Filhos
            const idsAtuais = agendaObj.map(a => a._id);
            return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).lean().then((filhosEncontrados) => {
                const filhosObj = JSON.parse(JSON.stringify(filhosEncontrados));
                const mapaFilhos = new Map();
                filhosObj.forEach(f => {
                    const tempId = (f.agenda_tempId || "").toString();
                    if (tempId) {
                        if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                        mapaFilhos.get(tempId).push(f);
                    }
                });

                // 🧠 FASE 5: Buscar Nomes
                const idsTerapeutas = new Set();
                agendaObj.forEach(r => idsTerapeutas.add(r.agenda_usuid?.toString()));
                filhosObj.forEach(f => idsTerapeutas.add(f.agenda_usuid?.toString()));

                return Usuario.find({ _id: { $in: Array.from(idsTerapeutas) } }, 'usuario_nome').lean().then((terapeutasNomes) => {
                    const mapaNomes = {};
                    terapeutasNomes.forEach(t => { mapaNomes[t._id.toString()] = t.usuario_nome; });

                    // Função recursiva da cadeia
                    function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                        let cadeia = [registroInicial];
                        const idAtual = "" + registroInicial._id;
                        if (visitados.has(idAtual) || nivel >= 2) return cadeia;
                        visitados.add(idAtual);
                        const cat = "" + registroInicial.agenda_categoria;
                        if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") return cadeia;
                        const proximos = mapaFilhos.get(idAtual) || [];
                        if (proximos.length > 0) {
                            cadeia = cadeia.concat(resolverCadeia(proximos[0], nivel + 1, visitados));
                        }
                        return cadeia;
                    }

                    // 🎨 Helper badgeStyle
                    function getBadgeStyle(cat) {
                        const map = {
                            "Falta": "yellow",
                            "Falta Justificada": "orange", // ✅ LARANJA
                            "Falta Absoluta": "orange",
                            "Substituição": "cyan",
                            "SubstitutoFixo": "transparent",
                            "Feriado": "orange",
                            "default": "transparent"
                        };
                        const bg = map[cat] || map.default;
                        return `background-color: ${bg} !important; border: 1px solid transparent; color: #212529; display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 500; border-radius: 3px; white-space: nowrap; line-height: 1.3;`;
                    }

                    // 🔄 Processar Registros
                    agendaObj.forEach((reg, idx) => {
                        const temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
                        
                        if (!temFilhos) {
                            // CASO 1: Sem cadeia
                            const cat = reg.agenda_categoria || "";
                            reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: cat };
                            reg.badgeStyle = getBadgeStyle(cat);
                            reg.deveAparecer = true;
                            
                            const isSubstFixo = (cat === "SubstitutoFixo");
                            const bloqueado = (cat === "Falta Absoluta" || cat === "Feriado");
                            
                            reg.ui = {
                                icone: bloqueado ? "ban" : "pencil",
                                tooltipTitulo: isSubstFixo ? "Padrão" : cat,
                                tooltipTexto: isSubstFixo ? "Clique para evoluir" : (
                                    {
                                        "Falta Absoluta": "Sem evolução possível",
                                        "Feriado": "Agenda fechada",
                                        "Falta Justificada": "Aguardando confirmação",
                                        "Falta": "Aguardando justificativa"
                                    }[cat] || "Clique para evoluir"
                                ),
                                temLink: !bloqueado
                            };
                            return;
                        }
                        
                        // CASO 2: Com cadeia
                        const cadeia = resolverCadeia(reg);
                        const ultimo = cadeia[cadeia.length - 1];
                        const catFinal = (ultimo.agenda_categoria || "").toString().trim() || reg.agenda_categoria;
                        
                        reg.cadeia = {
                            nivel: cadeia.indexOf(reg),
                            tamanho: cadeia.length,
                            ultimoCategoria: catFinal,
                            historico: cadeia.map((c, i) => {
                                const nome = mapaNomes[c.agenda_usuid?.toString()] || "Desconhecido";
                                return `${i===0?"Original":`Subst.${i}`}: ${nome} (${c.agenda_categoria})`;
                            })
                        };
                        
                        reg.badgeStyle = getBadgeStyle(catFinal);
                        
                        // 🟢 DETECÇÃO ESTRITA: APENAS "Substituição" dispara lógica especial
                        const temSubstituicao = cadeia.some(c => c.agenda_categoria === "Substituição");
                        const isPaiOriginal = (cadeia[0]._id.toString() === reg._id.toString());

                        // 🟢 TOOLTIP: IDÊNTICO PARA PAI E FILHO (SE FOR SUBSTITUIÇÃO)
                        let tooltipTexto = "";
                        let tooltipTitulo = cadeia.length > 1 ? "🔗 Cadeia" : catFinal;

                        if (temSubstituicao) {
                            const nomeOrig = mapaNomes[cadeia[0].agenda_usuid?.toString()] || "Terapeuta A";
                            const regSubst = cadeia.find(c => c.agenda_categoria === "Substituição");
                            const nomeSubst = mapaNomes[regSubst?.agenda_usuid?.toString()] || "Terapeuta B";
                            tooltipTexto = `Substituição\n${nomeOrig} por ${nomeSubst}`;
                            tooltipTitulo = "🔁 Substituição";
                        } else {
                            const isSubstFixo = (catFinal === "SubstitutoFixo");
                            tooltipTitulo = isSubstFixo ? "Padrão" : tooltipTitulo;
                            tooltipTexto = isSubstFixo ? "Clique para evoluir" : (
                                catFinal === "Falta Absoluta" ? "Sem evolução possível" :
                                catFinal === "Feriado" ? "Agenda fechada" :
                                catFinal === "Falta Justificada" ? "Aguardando confirmação" :
                                catFinal === "Falta" ? "Aguardando justificativa" :
                                "Clique para evoluir"
                            );
                        }

                        // 🟢 ÍCONE E LINK
                        let iconeTipo = "pencil";
                        let podeEditar = true;

                        if (temSubstituicao) {
                            if (isPaiOriginal) {
                                iconeTipo = "ban";       
                                podeEditar = false;
                            } else {
                                iconeTipo = "pencil";    
                                podeEditar = true;
                            }
                        } else if (catFinal === "Falta Absoluta" || catFinal === "Feriado") {
                            iconeTipo = "ban";
                            podeEditar = false;
                        }

                        reg.deveAparecer = reg.agenda_usuid?.toString() === idTerapeuta;
                        reg.ui = {
                            icone: iconeTipo,
                            tooltipTitulo: tooltipTitulo,
                            tooltipTexto: tooltipTexto,
                            temLink: podeEditar
                        };
                        
                        console.log(`[${idx+1}] 🔗 Cadeia(${cadeia.length}) | Pos: ${isPaiOriginal ? 'PAI' : 'FILHO'} | CatFinal: ${catFinal} | Sub? ${temSubstituicao} | Icone: ${iconeTipo}`);
                    });

                    // 🧹 Remover duplicados
                    const grupos = new Map();
                    agendaObj.forEach(reg => {
                        const chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                        if (!grupos.has(chave)) grupos.set(chave, []);
                        grupos.get(chave).push(reg);
                    });
                    const idsParaRemover = new Set();
                    grupos.forEach(regs => {
                        if (regs.length < 2) return;
                        const pais = regs.filter(r => !r.agenda_temp);
                        const filhos = regs.filter(r => r.agenda_temp);
                        if (filhos.length > 0 && pais.length > 0 && !regs.some(r => r.agenda_categoria === "Substituição")) {
                            pais.forEach(p => idsParaRemover.add("" + p._id));
                        }
                    });
                    agendaObj = agendaObj.filter(reg => !idsParaRemover.has("" + reg._id));

                    // 🎯 Filtrar e enriquecer
                    let agendasParaView = agendaObj.filter(r => r.deveAparecer === true);
                    
                    return Bene.find().lean().then((benesFull) => {
                        const benesObj = JSON.parse(JSON.stringify(benesFull));
                        agendasParaView.forEach(reg => {
                            const bene = benesObj.find(b => b._id === reg.agenda_beneid);
                            reg.beneNome = bene?.bene_nome || 'Sem beneficiário';
                            reg.beneApelido = bene?.bene_apelido || reg.beneNome;
                            
                        const temEvolucao =
                                reg.agenda_selo === true ||
                                reg.agenda_selo === "true" ||
                                (reg.agenda_evolucao && reg.agenda_evolucao.toString().trim() !== "");

                            if (temEvolucao) {
                                reg.ui = {
                                    icone: "check",
                                    tooltipTitulo: "Evoluído",
                                    tooltipTexto: "Atendimento já realizado",
                                    temLink: false
                                };

                                // 👉 força visual do beneficiário (verde pastel)
                                reg.badgeStyle = `
                                    background-color: #c8e6c9 !important;
                                    color: #2e7d32 !important;
                                    border: 1px solid #a5d6a7;
                                    font-weight: 600;
                                `;
                            }
                            if (reg.cadeia?.tamanho > 1 && reg.agenda_usuid?.toString() !== idTerapeuta) {
                                reg.ui.temLink = false; reg.ui.icone = "ban";
                            }
                        });

                        // 📦 Carregar auxiliares e renderizar
                        return Promise.all([
                            Bene.find({ bene_status: "Ativo" }).lean(),
                            Usuario.find({ usuario_status: "Ativo", $or: [{ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }, { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }] }).lean(),
                            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).lean(),
                            Sala.find().lean(),
                            Terapia.find().lean()
                        ]).then(([bene, terapeutas, horaage, sala, terapias]) => {
                            bene.sort((a,b) => a.bene_nome?.localeCompare(b.bene_nome, 'pt-BR')||0);
                            terapeutas.sort((a,b) => a.usuario_nome?.localeCompare(b.usuario_nome, 'pt-BR')||0);
                            sala.sort((a,b) => a.sala_nome?.localeCompare(b.sala_nome, 'pt-BR')||0);
                            terapias.sort((a,b) => a.terapia_nome?.localeCompare(b.terapia_nome, 'pt-BR')||0);

                            console.log("\n✅ [SUCESSO] Enviando para view");
                            res.render("agenda/agendaPessoal", {
                                salas: sala,
                                horaages: horaage,
                                agendas: agendasParaView,
                                benes: bene,
                                terapeutas: terapeutas,
                                terapias: terapias,
                                semanas: semana,
                                segunda, terca, quarta, quinta, sexta, hoje: hojeNome,
                                dataFiltro: dataFiltro
                            });
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.error("❌ [ERRO] carregaAgendaPessoal:", err);
            req.flash("error_message", "Erro ao carregar agenda pessoal");
            res.redirect('/admin/erro');
        });
    },

    filtraAgendaPessoalDia(req, res) {
        console.log("=".repeat(80));
        console.log("🔍 [FILTRA AGENDA PESSOAL DIA] INÍCIO");
        console.log("👤 Terapeuta:", req.cookies['idUsu']);
        console.log("📅 Data Recebida:", req.body.dataFinal);
        console.log("=".repeat(80));

        // 👉 VALIDAÇÃO: Data em branco ou inválida
        if (!req.body.dataFinal || req.body.dataFinal.trim() === "" || req.body.dataFinal === "undefined") {
            console.warn("⚠️ Data em branco - redirecionando");
            req.flash("warning_message", "Por favor, selecione uma data para filtrar.");
            return res.redirect('/menu/agenda/lisPessoal');
        }

        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);

        const idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta, hoje, hojeCompleto;

        // ========================================================================
        // 📅 FASE 1: Definir Data Exata do Filtro
        // ========================================================================
        console.log("\n📅 [FASE 1] Definindo data exata");
        
        let dataFiltro = new Date(req.body.dataFinal + "T00:00:00.000Z");
        if (isNaN(dataFiltro.getTime())) {
            console.error("❌ Data inválida:", req.body.dataFinal);
            req.flash("error_message", "Data inválida. Tente novamente.");
            return res.redirect('/menu/agenda/lisPessoal');
        }
        
        dataFiltro.setUTCHours(0,0,0,0);
        let inicioDia = new Date(dataFiltro);
        let fimDia = new Date(dataFiltro);
        fimDia.setUTCHours(23,59,59,999);
        
        const diasSemana = ["dom","seg","ter","qua","qui","sex","sab"];
        const diasSemanaCompleto = ["DOMINGO","SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO"];
        
        hoje = diasSemana[dataFiltro.getUTCDay()];
        hojeCompleto = diasSemanaCompleto[dataFiltro.getUTCDay()];
        
        let diaBase = new Date(dataFiltro);
        segunda = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        terca = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quarta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quinta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        sexta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        
        const dataFiltroInput = dataFiltro.toISOString().slice(0, 10);
        const dataFiltroFormatada = `${fncGeral.getDataFMT(dataFiltro)} - ${hojeCompleto}`;
        
        console.log(`📆 Filtrando: ${inicioDia.toISOString()} até ${fimDia.toISOString()}`);
        console.log(`📍 Dia: ${dataFiltroFormatada}`);

        // ========================================================================
        // 🔍 FASE 2: Buscar Registros APENAS do Dia Filtrado
        // ========================================================================
        console.log("\n🔍 [FASE 2] Buscando registros do dia");
        
        const idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        const dataIsoInicio = fncGeral.getDateToIsostring(inicioDia);
        const dataIsoFim = fncGeral.getDateToIsostring(fimDia);

        // 👉 CORREÇÃO: campo CORRETO é agenda_data
        return Agenda.find({
            agenda_data: { $gte: dataIsoInicio, $lte: dataIsoFim },
            agenda_usuid: idFiltro
        }, 'agenda_data agenda_usuid agenda_categoria agenda_temp agenda_tempId agenda_salaid agenda_beneid agenda_obs agenda_terapiaid agenda_selo')
        .then((agenda) => {
            // 🔥 CONVERSÃO IMEDIATA PARA OBJETOS SIMPLES
            let agendaObj = JSON.parse(JSON.stringify(agenda));
            console.log(`📦 Registros brutos: ${agendaObj.length}`);
            agendaObj.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

            // 📝 Formatação
            agendaObj.forEach((e) => {
                const dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                e.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getMinutes()).padStart(2, '0')}`;
                e.agenda_aux = aux++;
                e.agenda_data_semana = diasSemana[dat.getUTCDay()];
            });

            // 🔗 Detectar Filhos
            const idsAtuais = agendaObj.map(a => a._id);
            return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).lean().then((filhosEncontrados) => {
                const filhosObj = JSON.parse(JSON.stringify(filhosEncontrados));
                const mapaFilhos = new Map();
                filhosObj.forEach(f => {
                    const tempId = (f.agenda_tempId || "").toString();
                    if (tempId) {
                        if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                        mapaFilhos.get(tempId).push(f);
                    }
                });

                // 🧠 Buscar Nomes
                const idsTerapeutas = new Set();
                agendaObj.forEach(r => idsTerapeutas.add(r.agenda_usuid?.toString()));
                filhosObj.forEach(f => idsTerapeutas.add(f.agenda_usuid?.toString()));

                return Usuario.find({ _id: { $in: Array.from(idsTerapeutas) } }, 'usuario_nome').lean().then((terapeutasNomes) => {
                    const mapaNomes = {};
                    terapeutasNomes.forEach(t => { mapaNomes[t._id.toString()] = t.usuario_nome; });

                    // Função recursiva da cadeia
                    function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                        let cadeia = [registroInicial];
                        const idAtual = "" + registroInicial._id;
                        if (visitados.has(idAtual) || nivel >= 2) return cadeia;
                        visitados.add(idAtual);
                        const cat = "" + registroInicial.agenda_categoria;
                        if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") return cadeia;
                        const proximos = mapaFilhos.get(idAtual) || [];
                        if (proximos.length > 0) {
                            cadeia = cadeia.concat(resolverCadeia(proximos[0], nivel + 1, visitados));
                        }
                        return cadeia;
                    }

                    // 🎨 Helper badgeStyle (LARANJA PARA FALTA JUSTIFICADA)
                    function getBadgeStyle(cat) {
                        const map = {
                            "Falta": "yellow",
                            "Falta Justificada": "orange",  // ✅ CORRIGIDO: LARANJA
                            "Falta Absoluta": "orange",
                            "Substituição": "cyan",
                            "SubstitutoFixo": "transparent", // ✅ Tratado como padrão
                            "Feriado": "orange",
                            "default": "transparent"
                        };
                        const bg = map[cat] || map.default;
                        return `background-color: ${bg} !important; border: 1px solid transparent; color: #212529; display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 500; border-radius: 3px; white-space: nowrap; line-height: 1.3;`;
                    }

                    // 📅 Data de referência para bloquear futuras
                    const hojeReferencia = new Date();
                    hojeReferencia.setHours(23, 59, 59, 999);

                    // 🔄 Processar Registros
                    agendaObj.forEach((reg, idx) => {
                        const temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
                        const dataAgenda = new Date(reg.agenda_data);
                        const ehDataFutura = dataAgenda > hojeReferencia;
                        
                        if (!temFilhos) {
                            // CASO 1: Sem cadeia
                            const cat = reg.agenda_categoria || "";
                            reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: cat };
                            reg.badgeStyle = getBadgeStyle(cat);
                            reg.deveAparecer = true;
                            
                            const isSubstFixo = (cat === "SubstitutoFixo");
                            const bloqueadoPorCategoria = (cat === "Falta Absoluta" || cat === "Feriado");
                            const iconeTipo = ehDataFutura ? "ban" : (bloqueadoPorCategoria ? "ban" : "pencil");
                            const podeEditar = !ehDataFutura && !bloqueadoPorCategoria;
                            
                            reg.ui = {
                                icone: iconeTipo,
                                tooltipTitulo: isSubstFixo ? "Padrão" : cat,
                                tooltipTexto: ehDataFutura ? "Agenda futura - edição bloqueada" : 
                                            (isSubstFixo ? "Clique para evoluir" : (
                                                {
                                                    "Falta Absoluta": "Sem evolução possível",
                                                    "Feriado": "Agenda fechada",
                                                    "Falta Justificada": "Aguardando confirmação",
                                                    "Falta": "Aguardando justificativa"
                                                }[cat] || "Clique para evoluir"
                                            )),
                                temLink: podeEditar
                            };
                            return;
                        }
                        
                        // CASO 2: Com cadeia
                        const cadeia = resolverCadeia(reg);
                        const ultimo = cadeia[cadeia.length - 1];
                        const catFinal = (ultimo.agenda_categoria || "").toString().trim() || reg.agenda_categoria;
                        
                        reg.cadeia = {
                            nivel: cadeia.indexOf(reg),
                            tamanho: cadeia.length,
                            ultimoCategoria: catFinal,
                            historico: cadeia.map((c, i) => {
                                const nome = mapaNomes[c.agenda_usuid?.toString()] || "Desconhecido";
                                return `${i===0?"Original":`Subst.${i}`}: ${nome} (${c.agenda_categoria})`;
                            })
                        };
                        
                        reg.badgeStyle = getBadgeStyle(catFinal);
                        
                        // 🟢 DETECÇÃO ESTRITA: APENAS "Substituição" dispara lógica especial
                        const temSubstituicao = cadeia.some(c => c.agenda_categoria === "Substituição");
                        const isPaiOriginal = (cadeia[0]._id.toString() === reg._id.toString());

                        // 🟢 TOOLTIP: IDÊNTICO PARA PAI E FILHO (SE FOR SUBSTITUIÇÃO)
                        let tooltipTexto = "";
                        let tooltipTitulo = cadeia.length > 1 ? "🔗 Cadeia" : catFinal;

                        if (temSubstituicao) {
                            const nomeOrig = mapaNomes[cadeia[0].agenda_usuid?.toString()] || "Terapeuta A";
                            const regSubst = cadeia.find(c => c.agenda_categoria === "Substituição");
                            const nomeSubst = mapaNomes[regSubst?.agenda_usuid?.toString()] || "Terapeuta B";
                            tooltipTexto = `Substituição\n${nomeOrig} por ${nomeSubst}`;
                            tooltipTitulo = "🔁 Substituição";
                        } else {
                            const isSubstFixo = (catFinal === "SubstitutoFixo");
                            tooltipTitulo = isSubstFixo ? "Padrão" : tooltipTitulo;
                            tooltipTexto = isSubstFixo ? "Clique para evoluir" : (
                                catFinal === "Falta Absoluta" ? "Sem evolução possível" :
                                catFinal === "Feriado" ? "Agenda fechada" :
                                catFinal === "Falta Justificada" ? "Aguardando confirmação" :
                                catFinal === "Falta" ? "Aguardando justificativa" :
                                "Clique para evoluir"
                            );
                        }

                        // 🟢 ÍCONE E LINK
                        let iconeTipo = "pencil";
                        let podeEditar = true;

                        if (temSubstituicao) {
                            if (isPaiOriginal) {
                                iconeTipo = "ban";       
                                podeEditar = false;
                            } else {
                                iconeTipo = "pencil";    
                                podeEditar = true;
                            }
                        } else if (catFinal === "Falta Absoluta" || catFinal === "Feriado") {
                            iconeTipo = "ban";
                            podeEditar = false;
                        }

                        // 🚫 BLOQUEIO POR DATA FUTURA (sobrescreve qualquer outro estado)
                        if (ehDataFutura) {
                            iconeTipo = "ban";
                            podeEditar = false;
                            tooltipTexto = "Agenda futura - edição bloqueada";
                            tooltipTitulo = catFinal;
                        }

                        reg.deveAparecer = reg.agenda_usuid?.toString() === idTerapeuta;
                        reg.ui = {
                            icone: iconeTipo,
                            tooltipTitulo: tooltipTitulo,
                            tooltipTexto: tooltipTexto,
                            temLink: podeEditar
                        };
                        
                        console.log(`[${idx+1}] 🔗 Cadeia(${cadeia.length}) | Pos: ${isPaiOriginal ? 'PAI' : 'FILHO'} | CatFinal: ${catFinal} | Sub? ${temSubstituicao} | Futura? ${ehDataFutura} | Icone: ${iconeTipo}`);
                    });

                    // 🧹 Remover duplicados
                    const grupos = new Map();
                    agendaObj.forEach(reg => {
                        const chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                        if (!grupos.has(chave)) grupos.set(chave, []);
                        grupos.get(chave).push(reg);
                    });
                    const idsParaRemover = new Set();
                    grupos.forEach(regs => {
                        if (regs.length < 2) return;
                        const pais = regs.filter(r => !r.agenda_temp);
                        const filhos = regs.filter(r => r.agenda_temp);
                        if (filhos.length > 0 && pais.length > 0 && !regs.some(r => r.agenda_categoria === "Substituição")) {
                            pais.forEach(p => idsParaRemover.add("" + p._id));
                        }
                    });
                    agendaObj = agendaObj.filter(reg => !idsParaRemover.has("" + reg._id));

                    // 🎯 Filtrar e enriquecer
                    let agendasParaView = agendaObj.filter(r => r.deveAparecer === true);
                    
                    return Bene.find().lean().then((benesFull) => {
                        const benesObj = JSON.parse(JSON.stringify(benesFull));
                        agendasParaView.forEach(reg => {
                            const bene = benesObj.find(b => b._id === reg.agenda_beneid);
                            reg.beneNome = bene?.bene_nome || 'Sem beneficiário';
                            reg.beneApelido = bene?.bene_apelido || reg.beneNome;
                            
                            if (reg.agenda_selo === true || reg.agenda_selo === "true") {
                                reg.ui.temLink = false; reg.ui.icone = "check"; reg.ui.tooltipTexto = "Já evoluído";
                            }
                            if (reg.cadeia?.tamanho > 1 && reg.agenda_usuid?.toString() !== idTerapeuta) {
                                reg.ui.temLink = false; reg.ui.icone = "ban";
                            }
                        });

                        // 📦 Carregar auxiliares e renderizar
                        return Promise.all([
                            Bene.find({ bene_status: "Ativo" }).lean(),
                            Usuario.find({ usuario_status: "Ativo", $or: [{ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }, { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }] }).lean(),
                            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).lean(),
                            Sala.find().lean(),
                            Terapia.find().lean()
                        ]).then(([bene, terapeutas, horaage, sala, terapias]) => {
                            bene.sort((a,b) => a.bene_nome?.localeCompare(b.bene_nome, 'pt-BR')||0);
                            terapeutas.sort((a,b) => a.usuario_nome?.localeCompare(b.usuario_nome, 'pt-BR')||0);
                            sala.sort((a,b) => a.sala_nome?.localeCompare(b.sala_nome, 'pt-BR')||0);
                            terapias.sort((a,b) => a.terapia_nome?.localeCompare(b.terapia_nome, 'pt-BR')||0);

                            console.log("\n✅ [SUCESSO] Renderizando view agendaPessoal (modo dia filtrado)");
                            
                            res.render("agenda/agendaPessoal", {
                                salas: sala,
                                horaages: horaage,
                                agendas: agendasParaView,
                                benes: bene,
                                terapeutas: terapeutas,
                                terapias: terapias,
                                
                                // 👉 CORREÇÃO CRÍTICA: sintaxe EXATA {dia: "x",  valor}
                                semanas: [{dia: hoje, data: fncGeral.getDataFMT(dataFiltro)}],
                                
                                dtFill, 
                                segunda: fncGeral.getDataFMT(dataFiltro),
                                terca: fncGeral.getDataFMT(dataFiltro),
                                quarta: fncGeral.getDataFMT(dataFiltro),
                                quinta: fncGeral.getDataFMT(dataFiltro),
                                sexta: fncGeral.getDataFMT(dataFiltro),
                                hoje: hoje,
                                hojeCompleto: hojeCompleto,
                                isSemanal: "false",
                                dataFiltro: dataFiltroInput,
                                dataFiltroFormatada: dataFiltroFormatada
                            });
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.error("❌ [ERRO] filtraAgendaPessoalDia:", err);
            req.flash("error_message", "Erro ao filtrar agenda pessoal");
            res.redirect('/admin/erro');
        });
    },

    carregaAgendaPessoalSemanal(req, res) {
        // ========================================================================
        // 📦 FASE 0: Inicialização
        // ========================================================================
        console.log("=".repeat(80));
        console.log("🔍 [CARREGA AGENDA PESSOAL SEMANAL] INÍCIO");
        console.log("👤 Terapeuta:", req.cookies['idUsu']);
        console.log("=".repeat(80));

        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        

        let idTerapeuta = req.cookies['idUsu'];
        let isSemanal = "true";
        let aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta;

        // ========================================================================
        // 📅 FASE 1: Definir Semana a partir da data atual
        // ========================================================================
        console.log("\n📅 [FASE 1] Definindo período da semana");
        
        let dataBase = new Date();
        let seg = new Date(dataBase); seg.setHours(0,0,0,0);
        let sex = new Date(dataBase); sex.setHours(23,59,59,999);
        
        switch (seg.getUTCDay()) {
            case 0: seg.setUTCDate(seg.getUTCDate() + 1); break;
            case 2: seg.setUTCDate(seg.getUTCDate() - 1); break;
            case 3: seg.setUTCDate(seg.getUTCDate() - 2); break;
            case 4: seg.setUTCDate(seg.getUTCDate() - 3); break;
            case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
            case 6: seg.setUTCDate(seg.getUTCDate() - 5); break;
        }
        sex = new Date(seg); sex.setUTCDate(sex.getUTCDate() + 4);

        let agora = fncGeral.getDateToIsostring(seg);
        let depois = fncGeral.getDateToIsostring(sex);
        
        const diasSemana = ["dom","seg","ter","qua","qui","sex","sab"];
        const diasSemanaCompleto = ["DOMINGO","SEGUNDA","TERÇA","QUARTA","QUINTA","SEXTA","SÁBADO"];
        let diaSemana = new Date(seg);
        let semana = [];
        for (let i = 0; i < 5; i++) {
            semana.push({
                dia: diasSemana[diaSemana.getUTCDay()],
                data: this.getData(diaSemana)
            });
            diaSemana.setUTCDate(diaSemana.getUTCDate() + 1);
        }
        
        let baseFmt = new Date(seg);
        segunda = this.getDataDiaMes(baseFmt);
        terca = this.getDataDiaMes(baseFmt.setDate(baseFmt.getDate()+1));
        quarta = this.getDataDiaMes(baseFmt.setDate(baseFmt.getDate()+1));
        quinta = this.getDataDiaMes(baseFmt.setDate(baseFmt.getDate()+1));
        sexta = this.getDataDiaMes(baseFmt.setDate(baseFmt.getDate()+1));
        
        const hoje = diasSemana[new Date().getUTCDay()];
        const DataTexto = `~${this.getDataFMT(seg)}~`;
        
        console.log(`📆 Semana: ${agora} até ${depois} | DataTexto: ${DataTexto}`);

        // ========================================================================
        // 🔍 FASE 2: Buscar Registros da Semana
        // ========================================================================
        console.log("\n🔍 [FASE 2] Buscando registros da semana");
        
        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);

        return Agenda.find({
            agenda_data: { $gte: agora, $lte: depois },
            agenda_usuid: idFiltro
        }, 'agenda_data agenda_usuid agenda_categoria agenda_temp agenda_tempId agenda_salaid agenda_beneid agenda_obs agenda_terapiaid').then((agenda) => {
            
            console.log(`📦 Registros brutos: ${agenda.length}`);
            agenda = agenda.filter(a => (""+a.agenda_categoria) !== "Feriado");
            agenda.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

            // ========================================================================
            // 📝 FASE 3: Formatação
            // ========================================================================
            agenda.forEach((e) => {
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                e.agenda_hora = `${String(dat.getUTCHours()).padStart(2,'0')}:${String(dat.getMinutes()).padStart(2,'0')}`;
                e.agenda_aux = aux++;
                e.agenda_data_semana = diasSemana[dat.getUTCDay()];
            });

            // ========================================================================
            // 🔗 FASE 4: Detectar Filhos (Cadeia)
            // ========================================================================
            console.log("\n🔗 [FASE 4] Detectando cadeia");
            let idsAtuais = agenda.map(a => a._id);
            
            return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).then((filhosEncontrados) => {
                
                let mapaFilhos = new Map();
                filhosEncontrados.forEach(f => {
                    let tempId = "" + f.agenda_tempId;
                    if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                    mapaFilhos.get(tempId).push(f);
                });

                // ========================================================================
                // 🧠 FASE 5: Resolver Cadeia + Correção de Categoria
                // ========================================================================
                console.log("\n🧠 [FASE 5] Resolvendo cadeia");

                let idsTerapeutas = new Set();
                agenda.forEach(r => { if (r.agenda_usuid) idsTerapeutas.add(r.agenda_usuid.toString().toLowerCase()); });
                filhosEncontrados.forEach(f => { if (f.agenda_usuid) idsTerapeutas.add(f.agenda_usuid.toString().toLowerCase()); });

                return Usuario.find({ _id: { $in: Array.from(idsTerapeutas) } }, 'usuario_nome').then((terapeutasNomes) => {
                    
                    let mapaNomes = {};
                    terapeutasNomes.forEach(t => { mapaNomes[t._id.toString().toLowerCase()] = t.usuario_nome; });

                    function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                        let cadeia = [registroInicial];
                        let idAtual = "" + registroInicial._id;
                        if (visitados.has(idAtual)) return cadeia;
                        visitados.add(idAtual);
                        if (nivel >= 2) return cadeia;
                        let cat = "" + registroInicial.agenda_categoria;
                        if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") return cadeia;
                        let proximos = mapaFilhos.get(idAtual) || [];
                        if (proximos.length > 0) {
                            let subCadeia = resolverCadeia(proximos[0], nivel + 1, visitados);
                            cadeia = cadeia.concat(subCadeia);
                        }
                        return cadeia;
                    }

                    function definirVisual(catFinal) {
                        switch(catFinal) {
                            case "Falta": case "Falta Justificada": return { corBorda: "transparent", corFundo: "#fff3e0" };
                            case "Falta Absoluta": case "Feriado": return { corBorda: "transparent", corFundo: "#ffe0b2" };
                            case "Substituição": return { corBorda: "transparent", corFundo: "#f8f4fc" };
                            default: return { corBorda: "transparent", corFundo: "transparent" };
                        }
                    }

                    // 👉 PROCESSAR CADA REGISTRO
                    agenda.forEach((reg, idx) => {
                        let temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
                        
                        if (!temFilhos) {
                            reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: reg.agenda_categoria || "Nenhuma Observação" };
                            reg.visual = { ...definirVisual(reg.agenda_categoria || "Nenhuma Observação"), temCadeia: false };
                            reg.deveAparecer = true;
                        } else {
                            let cadeia = resolverCadeia(reg);
                            let ultimo = cadeia[cadeia.length - 1];
                            let catFinal = "" + ultimo.agenda_categoria;
                            reg.cadeia = { nivel: cadeia.indexOf(reg), tamanho: cadeia.length, ultimoCategoria: catFinal || "Nenhuma Observação" };
                            reg.visual = { ...definirVisual(catFinal || "Nenhuma Observação"), temCadeia: cadeia.length > 1 };
                            let usuid = reg.agenda_usuid?.toString?.().toLowerCase() || "";
                            reg.deveAparecer = usuid === idTerapeuta.toString().toLowerCase();
                        }
                        
                        // 🔥 CORREÇÃO CRÍTICA: Sobrescrever agenda_categoria com a categoria RESOLVIDA
                        if (reg.cadeia?.ultimoCategoria) {
                            reg.agenda_categoria = reg.cadeia.ultimoCategoria;
                            console.log(`🔄 [${idx+1}] ${reg.agenda_hora}: "${reg.agenda_categoria}" (resolvido)`);
                        }
                        reg.agenda_categoria = reg.agenda_categoria || "Nenhuma Observação";
                    });

                    // ========================================================================
                    // 🧹 FASE 5.5: Remover duplicados (CORRIGIDO)
                    // ========================================================================
                    console.log("\n🧹 [FASE 5.5] Removendo duplicados");

                    let grupos = new Map();
                    agenda.forEach(reg => {
                        let chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                        if (!grupos.has(chave)) grupos.set(chave, []);
                        grupos.get(chave).push(reg);
                    });

                    let idsParaRemover = new Set();
                    grupos.forEach((regs, chave) => {
                        if (regs.length < 2) return;
                        let pais = regs.filter(r => !r.agenda_temp);
                        let filhos = regs.filter(r => r.agenda_temp);
                        
                        if (filhos.length > 0 && pais.length > 0) {
                            let temSubstituicao = regs.some(r => r.agenda_categoria === "Substituição");
                            if (!temSubstituicao) {
                                // ✅ CORREÇÃO: console.log DENTRO do forEach
                                pais.forEach(p => {
                                    idsParaRemover.add("" + p._id);
                                    console.log(`🗑️ Removendo pai: ${p._id} | Slot: ${chave}`);
                                });
                            }
                        }
                    });

                    agenda = agenda.filter(reg => !idsParaRemover.has("" + reg._id));
                    console.log(`📊 Restam: ${agenda.length} registros`);

                    // ========================================================================
                    // 🎯 FASE 6: Filtrar para exibição + FASE 7: Log
                    // ========================================================================
                    let agendasParaView = agenda.filter(r => r.deveAparecer === true);
                    console.log(`✅ Para view: ${agendasParaView.length} registros`);

                    console.log("\n📋 [FASE 7] Resumo para view (DEBUG)");
                    agendasParaView.forEach((a, i) => {
                        let tipo = a.agenda_temp ? "FILHO" : "PAI";
                        let cadeiaTxt = a.visual?.temCadeia ? `🔗${a.cadeia?.tamanho}` : "🟢";
                        console.log(`[${i+1}] ${tipo} | ${a.agenda_data_semana} ${a.agenda_hora} | ${cadeiaTxt} | cat: "${a.agenda_categoria}"`);
                    });

                    // ========================================================================
                    // 📦 FASE 8: Renderizar
                    // ========================================================================
                    return Promise.all([
                        Bene.find(),
                        Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }),
                        Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
                        Sala.find()
                    ]).then(([bene, terapeutas, horaage, sala]) => {
                        
                        bene.sort((a,b) => a.bene_nome.localeCompare(b.bene_nome, 'pt-BR'));
                        terapeutas.sort((a,b) => a.usuario_nome.localeCompare(b.usuario_nome, 'pt-BR'));
                        sala.sort((a,b) => a.sala_nome.localeCompare(b.sala_nome, 'pt-BR'));

                        console.log("\n🎬 Renderizando view agendaPessoalSemanal");
                        
                        res.render("agenda/agendaPessoalSemanal", {
                            salas: sala, horaages: horaage, agendas: agendasParaView, benes: bene,
                            terapeutas: terapeutas, semanas: semana,
                            dtFill, segunda, terca, quarta, quinta, sexta,
                            isSemanal: isSemanal, hoje: hoje, DataTexto: DataTexto
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log("❌ [ERRO] carregaAgendaPessoalSemanal:", err);
            req.flash("error_message", "Erro ao carregar agenda semanal");
            res.redirect('admin/erro');
        });
    },
    filtraAgendaPessoalSemanal(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let idTerapeuta = req.cookies['idUsu'];
        let idsAgendasEx = [];
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let idsSubs = [];
        let isSemanal = "true";
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg: "+seg)
        //console.log("sex: "+sex)
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        console.log("seg: "+seg)
        console.log("sex: "+sex)
        let agora = fncGeral.getDateToIsostring(seg);
        let depois = fncGeral.getDateToIsostring(sex);
        console.log("agora: "+agora)
        console.log("depois: "+depois)
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        //console.log("agora:"+agora);
        //console.log("depois:"+depois);
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid : idTerapeuta }).then((agenda) =>{
            agenda = agenda.filter(a => (""+a.atend_categoria) !== "Feriado");
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => a.id != i);
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoalSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaF(req,res){
        //this.atualizaValores(req,res);
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        dtFill = seg.toISOString();
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        res.render("agenda/agendaFixa", {semanas: semana, segunda, terca, quarta, quinta, sexta})
    },
    listaAgendaExtra(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // Definir início e fim da semana (segunda à sexta)
        let seg = new Date();
        let sex = new Date();

        seg.setHours(0, 0, 0, 0);
        sex.setHours(23, 59, 59, 999);

        switch (seg.getUTCDay()) {
            case 0: // DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1: // SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2: // TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3: // QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4: // QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5: // SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6: // SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }

        const dataIni = seg.toISOString();
        const dataFim = sex.toISOString();

        // Aplicando filtro agenda_extra = true e agenda_cobrarextra = true
        Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).then((agendas) => {
            agendas.forEach((a) => {
                const data = new Date(a.agenda_data);
                let hor = data.getUTCHours().toString().padStart(2, '0');
                let min = data.getUTCMinutes().toString().padStart(2, '0');
                a.extra_hora = `${hor}:${min}`;
                a.extra_data_dia = fncGeral.getDataFMT(data); // Formata data como string legível
            });

            Bene.find().then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                }).then((terapeuta) => {
                    terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome));

                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).then((horaage) => {
                        Sala.find().then((salas) => {
                            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome));

                            Terapia.find().then((terapias) => {
                                Conv.find().then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome));
                                    res.render('atendimento/extra/extraLis', {
                                        extras: agendas, // Agora estamos passando agendas como extras
                                        benes: bene,
                                        terapeutas: terapeuta,
                                        horaages: horaage,
                                        salas: salas,
                                        terapias: terapias,
                                        convs: convs,
                                        flash
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    carregaAgendaFilF(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill;
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        console.log("req.body.dataFinal: "+req.body.dataFinal)
        console.log("seg dtf: "+seg);
        //console.log("sex dtf: "+sex);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg aft: "+seg)
        //console.log("sex aft: "+sex)
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
                //console.log("seg: "+seg)
                //console.log("sex: "+sex)
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
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        dtFill = seg.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        let idxtestecunt = 0;
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).then((agenda2) =>{
            //console.log("agenda2.length => "+agenda2.length)
            
        })
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false, agenda_extra: false }).sort({agenda_data: -1}).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaFixa", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaSala(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSala", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSala(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                agenda.forEach((e)=>{
                                    if (e.agenda_temp) {

                                    }
                                })
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSala", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaLRefatorado(req,res){//AbreAgendaFiltroRefatorado
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dtFill;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaLRefatorado(req,res){//FiltraAgendaFiltroRefatorado
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dtTemp = new Date(req.body.dataFinal);
        dtTemp.setHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        //console.log("req.body.dataFinal:"+req.body.dataFinal)
        //console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        //console.log("dtFill")
        //console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
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
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        let filtro;
        switch (req.body.tipoFil){
            case "bene":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_beneid: req.body.agendaBeneid, agenda_temp: false }
                break;
            case "sala":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_salaid: req.body.agendaSalaid, agenda_temp: false }
                break;
            case "tera":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.agendaTerapeutaid, agenda_temp: false }
                break;
        }
        Agenda.find(filtro).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

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
                        e.agenda_data_semana = "dom"
                        //console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaL(req,res){//AbreAgendaFiltro
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dtFill;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

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
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaL(req,res){//FiltraAgendaFiltro
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dtTemp = new Date(req.body.dataFinal);
        dtTemp.setHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        //console.log("req.body.dataFinal:"+req.body.dataFinal)
        //console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        //console.log("dtFill")
        //console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
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
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        let filtro;
        switch (req.body.tipoFil){
            case "bene":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_beneid: req.body.agendaBeneid, agenda_temp: false }
                break;
            case "sala":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_salaid: req.body.agendaSalaid, agenda_temp: false }
                break;
            case "tera":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.agendaTerapeutaid, agenda_temp: false }
                break;
        }
        Agenda.find(filtro).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

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
                        e.agenda_data_semana = "dom"
                        //console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    cadastraAgenda(req,res){//AdicionaAgenda
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let flash = new Resposta()
        let resultado;
        //console.log(req.body.dataAg)
        //console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionar(req,res);
        cadastro.then((res) =>{
            //console.log(res)
            resultado = true;
        }).catch((err) =>{
            console.log(err)
            resultado = false;
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        }).finally(() =>{
            //console.log("resultado")
            //console.log(resultado);
            if (resultado == true){
                flash.texto = "Cadastrado com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.carregaAgendaCadastro(req,res,flash);
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                //console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', flash);
            }
        })
    },
    carregaCadFaltas(req,res,resposta){//Carrega o cadastro de faltas pontuais
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        let flash = new Resposta()
        let resultado;
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                    //console.log("Listagem terapeutas!")
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        if(resposta.sucesso == ""){
                            //console.log(' objeto vazio');
                            flash.texto = "";
                            flash.sucesso = "";
                        } else {
                            //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                            flash.texto = resposta.texto;
                            flash.sucesso = resposta.sucesso;
                        }
                        res.render('agenda/agendaCadFaltas', {benes: bene, convs: conv, terapeutas: terapeuta, flash})
        })})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaSubterapia(req,res){//Carrega as Substituição de Categoria lançada errada
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapeutas!")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            res.render('agenda/agendaSubTerapia', {benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia})
    })})})})}).catch((err) =>{
        console.log(err)
        res.render('admin/erro')
    })
},
    carregaAgendaTemp(req, res){//CarregaEdiçãoAgenda
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Excecao = getModel(db, 'tb_excecao', excecaoClass.ExcecaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema)

        let agenda_tempId = req.params.id;
        Agenda.findById(req.params.id).then((agenda) =>{
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                                console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    console.log("Abre Edição Agenda Semanal")
                                    Sessao.find().then((sessao)=>{
                                        Excecao.find().then((excecao)=>{
        res.render('agenda/agendaCadTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, agenda_tempId, sessaos: sessao, excecaos: excecao})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraAgendaTemp(req,res){//AdicionaAgenda
        let flash = new Resposta()
        let resultado;
        //console.log(req.body.dataAg)
        //console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionarTemp(req,res);
        cadastro.then((res) =>{
            //console.log(res)
            flash.sucesso = "true";
            flash.texto = "Cadastro Agenda Diária realizado com sucesso!";
        }).catch((err) =>{
            console.log(err)
            flash.sucesso = "false"
            flash.texto = "houve um erro ao Realizar as listas!"
        }).finally(() =>{
            //console.log("resultado")
            //console.log(resultado);
            if (flash.sucesso == "true"){
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            } else {
                //console.log('ERRO')
                res.render('admin/erro', {flash});
            }
        })
    },
    carregaAgendaEdiTemp(req, res){//CarregaEdiçãoAgenda
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        let isAgendaTerapeuta = false;
        let selo = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        let id;
        if(req.params.id){
            id = req.params.id;
        } else {
            id = req.body.agendaId;
        }
        
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //As terapias abaixo são filtradas apenas aquelas que estao ativas no momento da alteração da agenda    
                            Terapia.find({terapia_status:"Ativo",terapia_lixo: false}).then((terapianovo)=>{ 
                                    terapianovo.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                                        //console.log("Listagem terapia!")
                                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                                            //console.log("Listagem terapeutas!")

                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaEdiTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapianovos: terapianovo, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizaAgendaTemp(req, res){//EditaAgenda
        let flash = new Resposta()
        let resposta;
        try{
            agendaClass.agendaEditarTemp(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log(res)
                resposta = true;
            }).catch((err) =>{
                //console.log("error")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta== true){
                    //Volta para a agenda de listagem
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //console.log('verdadeiro')
                    this.carregaAgendaEdiTemp(req,res,flash);
                }else{
                    //passar classe de erro
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.carregaAgendaEdiTemp(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    deletaAgenda(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        let flash = new Resposta();
        Agenda.find({_id:req.params.id}).then((agenda)=>{
            if (agenda.length > 0){
                agenda.forEach((a)=>{
                    Agenda.deleteOne({_id: a._id}).then(() =>{
                        //this.carregaAgendaF(req,res);
                        //console.log("Deletado:"+req.params.id);
                        flash.sucesso = "true";
                        flash.texto = "Agenda deletada!";
                        res.render("admin/branco",{flash});
                    }).catch((err)=>{
                        console.log(err)
                        flash.sucesso = "false"
                        flash.texto = "Houve um erro ao deletar a Agenda Semanal!"
                        res.render("admin/branco",{flash});
                    })
                })
            } else {
                Agenda.find({agenda_tempId:req.params.id}).then((agenda)=>{
                    if (agenda.length > 0){
                        agenda.forEach((a)=>{
                            Agenda.deleteOne({_id: a._id}).then(() =>{
                                //this.carregaAgendaF(req,res);
                                //console.log("Deletado:"+req.params.id);
                                flash.sucesso = "true";
                                flash.texto = "Agenda deletada!";
                                res.render("admin/branco",{flash});
                            }).catch((err)=>{
                                console.log(err)
                                flash.sucesso = "false"
                                flash.texto = "Houve um erro ao deletar a Agenda Semanal!"
                                res.render("admin/branco",{flash});
                            })
                        })
                    } else {
                        //console.log("Não achou pelo id")
                        flash.sucesso = "false"
                        flash.texto = "A agenda não foi encontrada!"
                        res.render("admin/branco",{flash});
                    }
                })
            }
        })
    },
    atualizaAgenda(req, res){//EditaAgenda
        let flash = new Resposta()
        let resultado;
        try{
            agendaClass.agendaEditar(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log("res")
                resultado = true;
            }).catch((err) =>{
                //console.log("error")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                //console.log("Finally")
                if(resultado == true){
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    this.carregaAgendaEdi(req,res,flash);
                    //this.carregaAgendaCadastro(req,res,flash);//como tava antes
                }else{
                    //console.log("Erro ao editar agenda!")
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.carregaAgendaCadastro(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    carregaEvolucao(req, res, atrazo, resposta){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

        let selo;
        let isAgendaTerapeuta = false;
        let isAgendaSuperCoo = false;
        // 62421801a12aa557219a0fb9 = root; 62421857a12aa557219a0fc1 = socios; 644742e378166939169f82a1 = coordenador; 644743aa78166939169f8486 = supervisor
        
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['677e72110967e75764876577', '677e72270967e757648765a0', '677ed0df257b6578c4f433fa', '62421903a12aa557219a0fd3', '6578ab5248bfdf9fe1b2c8d8','6242191fa12aa557219a0fd9'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
                isAgendaSuperCoo = false;
            }
        })
        let arrayidsSup = ['62421801a12aa557219a0fb9','62421857a12aa557219a0fc1','644742e378166939169f82a1','644743aa78166939169f8486'];
        arrayidsSup.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
                isAgendaSuperCoo = true;
            }
        })
        let flash = new Resposta()
        if (resposta.sucesso == "true" || resposta.sucesso == "false"){
            flash.sucesso = resposta.sucesso;
            flash.texto = resposta.texto;
        }
        let id = req.params.id;
        if (id == '' || id == undefined || id == 'undefined' || id == null){
            id = req.body.id
        }
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    Evolucaoconf.find().then((evolucaoconf) =>{
                                        evolucaoconf.sort((a,b) => ((a.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                                            res.render('agenda/agendaEvolucao', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, isAgendaSuperCoo, selo, atrazo, flash, evolucaoconfs: evolucaoconf})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },

    carregaAgendaListaGeral(req, res, atrazo, resposta){//Agenda em formato de lista para facilitar Inspecao
         let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        //console.log("cookie: "+req.cookies['idUsu'])//idUsu - lvlUsu
        let idTerapeuta = req.cookies['idUsu'];
        let dataFinal = fncGeral.getDataContra(new Date());
        let idsAgendasEx = [];
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let agendaTempArr = [];
        let isSemanal = "true";
        let seg = fncGeral.getDateFromString(dataFinal, "ini");
        let sex = fncGeral.getDateFromString(dataFinal, "fim");
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = fncGeral.getDateToIsostring(seg);
        let depois = fncGeral.getDateToIsostring(sex);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        //console.log("agora:"+agora);
        //console.log("depois:"+depois);
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid : idTerapeuta }).then((agenda) =>{
            agenda = agenda.filter(a => (""+a.atend_categoria) !== "Feriado");
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            //console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
                    idsAgendasEx.push(a);
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaListaGeral", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    carregaEvolucaosup(req, res, atrazo, resposta){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)


        filtroTela = new FiltroAtend();
        filtroTela.tipoData = req.body.tipoData;
        filtroTela.dataFinal = req.body.dataFinal;
        filtroTela.anoAtend = req.body.anoAtend;
        filtroTela.mesAtend = req.body.mesAtend;
        filtroTela.tipoPessoa = req.body.atendTipoPessoa;
        filtroTela.atendTerapeuta = req.body.atendTerapeuta;
        filtroTela.atendBeneficiario = req.body.atendBeneficiario;
        let selo;
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['677e72110967e75764876577', '677e72270967e757648765a0', '677ed0df257b6578c4f433fa', '62421903a12aa557219a0fd3', '6578ab5248bfdf9fe1b2c8d8' ];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let flash = new Resposta()
        if (resposta.sucesso == "true" || resposta.sucesso == "false"){
            flash.sucesso = resposta.sucesso;
            flash.texto = resposta.texto;
        }
        let id = req.body.idEdi;
        if (id == '' || id == undefined || id == 'undefined' || id == null){
            id = req.body.id
        }
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    res.render('agenda/agendaEvolucaosup', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo, atrazo,flash,filtroTela})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    removeEvolucaoA(req,res,resposta){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

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
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    res.render('area/evol/evoatendabertoLis', { terapeutas: usuario, benes: bene, flash})
                })
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar!")
                res.redirect('admin/erro')
            })
        })
    },
    carregaEvolucaoTemp(req, res, atrazo, resposta){//CarregaEdiçãoAgenda
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

        /*
        if (atrazo == undefined || atrazo == "undefined"){
            Agenda.findOne({_id: req.params.id}).then((agenda) =>{
                atrazo = agenda.agenda_atrazo;
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        }
        */
        let isAgendaTerapeuta = false;
        //677e72110967e75764876577 tec ABA; 677e72270967e757648765a0 Técnico Especialista Estagiário; 677ed0df257b6578c4f433fa Técnico Especialista ABA Estagiário; 62421903a12aa557219a0fd3 Técnico Especialista; 6578ab5248bfdf9fe1b2c8d8 Hibrido (Terapeuta e Administrativo)
        let isAgendaSuperCoo = false;
        // 62421801a12aa557219a0fb9 = root; 62421857a12aa557219a0fc1 = socios; 644742e378166939169f82a1 = coordenador; 644743aa78166939169f8486 = supervisor
        
        let selo = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['677e72110967e75764876577', '677e72270967e757648765a0', '677ed0df257b6578c4f433fa', '62421903a12aa557219a0fd3', '6578ab5248bfdf9fe1b2c8d8' ];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
                isAgendaSuperCoo = false;
            }
        })
        let arrayidsSup = ['62421801a12aa557219a0fb9','62421857a12aa557219a0fc1','644742e378166939169f82a1','644743aa78166939169f8486'];
        arrayidsSup.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
                isAgendaSuperCoo = true;
            }
        })
        let flash = new Resposta()
        if (resposta.sucesso == "true" || resposta.sucesso == "false"){
            flash.sucesso = resposta.sucesso;
            flash.texto = resposta.texto;
        }
        let id;
        if(req.params.id){
            id = req.params.id;
        } else {
            id = req.body.id;
        }
        
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                     Evolucaoconf.find().then((evolucaoconf) =>{
                                        evolucaoconf.sort((a,b) => ((a.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.evolucaoconf_titulo.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
        res.render('agenda/agendaEvolucaoTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, isAgendaSuperCoo, evolucaoconfs: evolucaoconf, selo, atrazo}) //flash deu erro foi removido
        })})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaEdi(req, res, resposta){//CarregaEdiçãoAgenda
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Excecao = getModel(db, 'tb_excecao', excecaoClass.ExcecaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema)

        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['677e72110967e75764876577', '677e72270967e757648765a0', '677ed0df257b6578c4f433fa', '62421903a12aa557219a0fd3', '6578ab5248bfdf9fe1b2c8d8' ];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        //console.log("isAgendaTerapeuta:"+isAgendaTerapeuta);
        let flash = new Resposta();
        let resultado;
        let id = req.params.id;
        if (id == '' || id == undefined || id == 'undefined' || id == null){
            id = req.body.id
        }
        Agenda.findById(id).then((agenda) =>{
            let selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    console.log("Abre Edição Agenda Fixa")
                                    Sessao.find().then((sessao)=>{
                                        Excecao.find().then((excecao)=>{
                                    res.render('agenda/agendaEdi', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo, sessaos: sessao, excecaos: excecao})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaEdiF(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let dat = new Date(req.params.mes+"/"+req.params.dia+"/"+req.params.ano);
        //console.log("dat:"+dat)
        //console.log("hora:"+req.params.hora)
        let agenda_hora = req.params.hora;
        let agenda_data_dia = {"dia":req.params.dia,"mes":req.params.mes,"ano":req.params.ano};
        let agenda = {"data":agenda_data_dia,"hora":agenda_hora}
        //console.log(agenda.data)
        //console.log(agenda.hora)
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{
                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                    //console.log("Listagem salas!")
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                            //console.log("Listagem terapeutas!")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaCadF', {agenda,benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaCadE(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        Agenda.find({_id: req.params.id}).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia
                                //console.log("Listagem Realizada de Terapia")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                        //console.log("Listagem Realizada de Terapia")
                                res.render("agenda/agendaCadE", {salas: sala, agenda, benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaCadastro(req,res,resposta){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema)

        let flash = new Resposta()
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{
                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                    //console.log("Listagem salas!")
                   Terapia.find({ terapia_status: "Ativo", terapia_lixo: { $ne: "true" }}).then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b", usuario_status:"Ativo"}).then((terapeuta)=>{
                            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                            //console.log("Listagem terapeutas!")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                Sessao.find().then((sessao)=>{
                                    if(resposta.sucesso == ""){
                                        //console.log(' objeto vazio');
                                        flash.texto = ""
                                        flash.sucesso = ""
                                    } else {
                                        //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                                        flash.texto = resposta.texto
                                        flash.sucesso = resposta.sucesso
                                    }
                                    Excecao.find().then((excecao)=>{
                                    res.render('agenda/agendaCadT', {benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, sessaos: sessao, excecaos: excecao, flash})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaTecDia(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)
        Sessao = getModel(db, 'tb_sessao', sessaoClass.SessaoSchema)

        let aux = 1;
        let dtFill;
        let is = false;
        let usunomefnc;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeFisio;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu)=>{//Apenas 1
            //console.log("usu.usuario_obs:"+usu.usuario_obs)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
                nomeUsu = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
                nomeUsu = usu.usuario_nomecompleto;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: usu._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                let haddia;//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            //console.log("benenomeconv:"+usunomefnc)
                                            res.render("area/magenda/agendaTecDia", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    async converteAgendaEmAtend(req, res) {
  try {
    const db = req.cookies['preferredDb'];
    const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);

    const idUsu = req.cookies['idUsu'];
    const dataAtual = new Date();

    // período de busca: transforma dataFil em semana (segunda..sexta) como no código original
    const baseDate = new Date(req.body.dataFil);
    
    let dataIni = new Date(baseDate.getFullYear(), (baseDate.getUTCMonth()), 1, 0, 0, 0, 0);
    let dataFim = new Date(baseDate.getFullYear(), (baseDate.getUTCMonth()+1), 1, 23, 59, 59, 0);
    dataFim.setDate(dataFim.getDate()-1);
    console.log("dataIni: "+dataIni);
    console.log("dataFim: "+dataFim);
    
    // carrega convcre e convdeb via as promessas existentes
    var convcre = await convcreClass.convcreCarregarTodos(req, res); // array
    var convdeb = await convdebClass.convdebCarregarTodos(req, res); // array

    // mapeia convs para lookup rápido com chave `${convid}${terapiaid}`
    var mapConvCre = new Map();
    convcre.forEach(c => mapConvCre.set(`${String(c.convcre_convid)}${String(c.convcre_terapiaid)}`, c.convcre_valor));
    var mapConvDeb = new Map();
    convdeb.forEach(d => mapConvDeb.set(`${String(d.convdeb_convid)}${String(d.convdeb_terapiaid)}`, d.convdeb_valor));

    
    // carrega agendas fixa e semanal no período
    var agendaFixa = await Agenda.find({
      agenda_data: { $gte: dataIni, $lte: dataFim },
      agenda_temp: false,
      agenda_migrado : false, 
      $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } }]
    }).lean();
    console.log("agendaFixa.length: "+agendaFixa.length)

    var agendaSemanal = await Agenda.find({
      agenda_data: { $gte: dataIni, $lte: dataFim },
      agenda_temp: true,
      agenda_migrado : false, 
      $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } }]
    }).lean();
    console.log("agendaSemanal.length: "+agendaSemanal.length)

    // índice de semanais por agenda_tempId (pode haver múltiplos por fixa)
    var semanaisPorTemp = new Map();
    for (var s of agendaSemanal) {
      var key = String(s.agenda_tempId);
      if (!semanaisPorTemp.has(key)) semanaisPorTemp.set(key, []);
      semanaisPorTemp.get(key).push(s);
    }

    // pega último atend_num
    var ultimo = await Atend.findOne().sort({ atend_num: -1 }).lean();
    let nextNum = ultimo ? (Number(ultimo.atend_num) + 1) : 1;

    // resultados/resumo
    let totalGerados = 0;
    let totalMesclados = 0;
    var erros = [];

    // helper: formata hora HH:MM a partir de Date ou string
    var getHoraString = (agenda) => {
      if (agenda.agenda_hora) return String(agenda.agenda_hora).padStart(5, '0'); // já formatada
      var d = new Date(agenda.agenda_data);
      var hh = String(d.getUTCHours()).padStart(2, '0');
      var mm = String(d.getUTCMinutes()).padStart(2, '0');
      return `${hh}:${mm}`;
    };

    // helper: pega valor conv (conv id + terapia id) do mapa
    var getConvCreVal = (convid, terapiaid) => mapConvCre.get(`${String(convid)}${String(terapiaid)}`) || "0,00";
    var getConvDebVal = (convid, terapiaid) => mapConvDeb.get(`${String(convid)}${String(terapiaid)}`) || "0,00";

    // processa cada agenda fixa; se existir uma semanal vinculada, mescla
    for (var fixa of agendaFixa) {
      try {
        // Se já migrado, pula
        //if (fixa.agenda_migrado) continue;
        // Se é glosa, pula
        if (fixa.agenda_categoria == "Glosa") continue;

        // pega semanais vinculadas (pode ser undefined)
        var beneficiarioF = await Bene.find({
            _id: fixa.agenda_beneid
        }).lean();
        var semanais = semanaisPorTemp.get(String(fixa._id)) || [];

        // se existir mais de 1 semanal para a mesma fixa na semana, cada semanal resulta em um atendimento
        if (semanais.length > 0) {
          for (var s of semanais) {
            var beneficiarioS = await Bene.find({
                _id: s.agenda_beneid
            }).lean();
            // varrói atendimento mesclado: os campos "precedem" da semanal:
            // Campos não separáveis (prevalecem da semanal): usuario, data, hora, origem, categoria, beneficiário, convênio, sala
            // Base (fixa) fornece outros dados; merge (semanal) sobrescreve alguns (merge fields)
            var atendData = new Date(s.agenda_data); // usa data/hora da semanal
            var atendHora = getHoraString(s);
            var origem = s.agenda_origem || fixa.agenda_origem || "Agenda";
            var categoria = s.agenda_categoria || fixa.agenda_categoria;
            var beneid = s.agenda_beneid || fixa.agenda_beneid;
            var convid = s.agenda_convid || fixa.agenda_convid || beneficiarioS.bene_convid || beneficiarioF.bene_convid;
            var salaid = s.agenda_salaid || fixa.agenda_salaid;
            // terapeuta principal: se semanal tem usuário diferente, manter usuário da semanal (precede)
            var terapeutaid = s.agenda_usuid || fixa.agenda_usuid;
            // terapia escolhida: semanal prevails for therapy where applicable
            var terapiaid = s.agenda_terapiaid || fixa.agenda_terapiaid;

            // valores convênios:
            // convcre/de padrão: usa fixa.convid + fixa.terapiaid (base) para valores de cre/de
            // para merge (semanal) usa s.agenda_convid + s.agenda_terapiaid
            var convcreval = getConvCreVal(fixa.agenda_convid, fixa.agenda_terapiaid);
            var convdebval = getConvDebVal(fixa.agenda_convid, fixa.agenda_terapiaid);
            var convcrevalSub = getConvCreVal(s.agenda_convid, s.agenda_terapiaid);
            var convdebvalSub = getConvDebVal(s.agenda_convid, s.agenda_terapiaid);

            // valores de fixo (substituto fixo vem da fixa)
            var convcrevalFixo = getConvCreVal(fixa.agenda_convid, fixa.agenda_mergeterapiaid);
            var convdebvalFixo = getConvDebVal(fixa.agenda_convid, fixa.agenda_mergeterapiaid);

            // monta objeto Atend respeitando campos do schema
            var newAtend = new Atend({
              atend_org: s.agenda_org || fixa.agenda_org || "Administrativo",
              atend_categoria: categoria,
              atend_beneid: beneid,
              atend_convid: convid,
              atend_usuid: idUsu,
              atend_atenddata: atendData,
              atend_atendhora: atendHora,
              atend_terapeutaid: fixa.agenda_usuid, // terapeuta de origem (fixa) permanece em seu campo principal
              atend_terapiaid: fixa.agenda_terapiaid,
              atend_salaid: salaid,
              atend_valorcre: convcreval,
              atend_valordeb: convdebval,
              // merge fields (semanais)
              atend_mergeterapeutaid: s.agenda_usuid,
              atend_mergeterapiaid: s.agenda_terapiaid,
              atend_mergevalorcre: convcrevalSub,
              atend_mergevalordeb: convdebvalSub,
              // origem tracking
              atend_agenda_f_id_orig: fixa._id,
              atend_agenda_s_id_orig: s._id,
              atend_fixo: "false",
              atend_num: nextNum++,
              atend_datacad: dataAtual.toISOString()
            });

            // se a fixa tinha substituto fixo, copia os campos fixos para o atendimento
            if (fixa.agenda_categoria === "SubstitutoFixo" && fixa.agenda_mergeterapeutaid) {
              newAtend.atend_fixoterapeutaid = fixa.agenda_mergeterapeutaid;
              newAtend.atend_fixoterapiaid = fixa.agenda_mergeterapiaid;
              newAtend.atend_fixovalorcre = convcrevalFixo;
              newAtend.atend_fixovalordeb = convdebvalFixo;
              newAtend.atend_fixo = "true";
            }

            // salva e marca agenda fixa como migrada (após sucesso)
            await newAtend.save();
            await Agenda.findByIdAndUpdate(fixa._id, { $set: { agenda_migrado: true } });
            await Agenda.findByIdAndUpdate(semanaisPorTemp._id, { $set: { agenda_migrado: true } });
            totalGerados++;
            totalMesclados++;
          }
        } else {
          // não há semanal vinculada: gerar atendimento apenas com dados da fixa (caminho feliz)
          var atendData = new Date(fixa.agenda_data);
          var atendHora = getHoraString(fixa);

          var convcreval = getConvCreVal(fixa.agenda_convid, fixa.agenda_terapiaid);
          var convdebval = getConvDebVal(fixa.agenda_convid, fixa.agenda_terapiaid);
          var convcrevalFixo = getConvCreVal(fixa.agenda_convid, fixa.agenda_mergeterapiaid);
          var convdebvalFixo = getConvDebVal(fixa.agenda_convid, fixa.agenda_mergeterapiaid);

          var newAtend = new Atend({
            atend_org: fixa.agenda_org || "Administrativo",
            atend_categoria: fixa.agenda_categoria,
            atend_beneid: fixa.agenda_beneid,
            atend_convid: fixa.agenda_convid,
            atend_usuid: idUsu,
            atend_atenddata: atendData,
            atend_atendhora: atendHora,
            atend_terapeutaid: fixa.agenda_usuid,
            atend_terapiaid: fixa.agenda_terapiaid,
            atend_salaid: fixa.agenda_salaid,
            atend_valorcre: convcreval,
            atend_valordeb: convdebval,
            atend_agenda_f_id_orig: fixa._id,
            atend_agenda_s_id_orig: new mongoose.mongo.ObjectId('766f69643132333435366964'),
            atend_fixo: "false",
            atend_num: nextNum++,
            atend_datacad: dataAtual.toISOString()
          });

          // caso fixa seja SubstitutoFixo aplica campos de fixo
          if (fixa.agenda_categoria === "SubstitutoFixo" && fixa.agenda_mergeterapeutaid) {
            newAtend.atend_fixoterapeutaid = fixa.agenda_mergeterapeutaid;
            newAtend.atend_fixoterapiaid = fixa.agenda_mergeterapiaid;
            newAtend.atend_fixovalorcre = convcrevalFixo;
            newAtend.atend_fixovalordeb = convdebvalFixo;
            newAtend.atend_fixo = "true";
          }

          await newAtend.save();
          await Agenda.findByIdAndUpdate(fixa._id, { $set: { agenda_migrado: true } });
          totalGerados++;
        }
      } catch (errInner) {
        console.error("Erro processando fixa", fixa._id, errInner);
        erros.push({ fixa: fixa._id, error: String(errInner) });
      }
    }

    // resumo e finalização
    console.log(`Convertidos: ${totalGerados} atendimentos (mesclados: ${totalMesclados})`);
    if (erros.length) console.warn("Erros:", erros, convid);

    // recarrega view ou envia sucesso
    //this.carregaAgendaF(req, res); // mantém a chamada final do teu fluxo
  } catch (err) {
    console.error("Erro converteAgendaEmAtend:", err);
    //res.render('admin/erro');
  } finally {
    console.log("converteAgendaEmAtend finalizado");
  }
},
 
    copiaExtraordinario(req,res){//Converte a Extraordinarios em Extra
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);

        let idUsu = req.cookies['idUsu'];
        let convcreval;
        let convdebval;
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaSub;
        let newExtra;
        let convcreTes;
        let convdebTes;
        let nextNum;
        let teraContrato;
        let roberta;
        let agendacreTes;
        let agendadebTes;
        let hora;
        let data;
        let hor;
        let min;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        //console.log("START CONVERT");
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
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        //console.log("dataIni: "+dataIni);
        //console.log("dataFim: "+dataFim);
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
                Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, agenda_extra: true}).then((agendaFixa)=>{
                    Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: true, agenda_extra: true}).then((agendaSemanal)=>{
                    //-------------------------
                    //console.log(agenda)
                    
                        //console.log("validação caso seja o primeiro registro")
                        nextNum = 1;
                        agendaFixa.forEach((a)=>{
                            agendaSub = '';
                            convcreval = "0,00";
                            convdebval = "0,00";
                            /*
                            if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            }
                            */
                            //console.log("a.agenda_categoria:"+a.agenda_categoria);

                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                agendaSemanal.forEach((s)=>{
                                    if (""+a._id === ""+s.agenda_tempId){
                                        agendaSub = s;
                                    }
                                })

                                if (agendaSub != ''){
                                    data = agendaSub.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    //console.log("agendaSub.agenda_categoria: "+agendaSub.agenda_categoria)
                                    switch (agendaSub.agenda_categoria){
                                        case "Apoio"://ANALISE
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Apoio",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data : a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Extra":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Extra",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                //extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                //extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Falta":

                                            agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })
                                            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : a.agenda_usuid,//mesmo terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : convcreval,//recebe pelo plano pois não foi avisado previamente
                                                extra_mergevalordeb : "0,00",//Não paga pois o terapeuita não atende ninguem
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                extra_terapiaid : agendaSub.agenda_usuid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                extra_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                extra_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                extra_mergeterapiaid : a.agenda_usuid,
                                                extra_mergevalorcre : convcreval,//recebe pelo novo bene
                                                extra_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Falta Absoluta":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Falta Absoluta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                extra_terapiaid : agendaSub.agenda_usuid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                extra_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                extra_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                extra_mergeterapiaid : a.agenda_usuid,
                                                extra_mergevalorcre : convcreval,//recebe pelo novo bene
                                                extra_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Glosa":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Glosa",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                //extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                //extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Pais":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Pais",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : convdebval,//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "SubstitutoFixo":
                                            //console.log("SUBFIX1");
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            //console.log("convdebval:"+convdebval)
                                            //console.log("convcreval:"+convcreval)
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                extra_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Supervisão":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Supervisão",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Recebe pelo atendimento
                                                extra_valordeb : convdebval,//Paga ao terapeuta
                                                extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Não recebe pela supervisão
                                                extra_mergevalordeb : convdebval,//Paga a supervsão
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : roberta._id,
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : "0,00",
                                                extra_mergevalordeb : "0,00",
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":
                                            if(a.agenda_beneid+"" === "62d17a1eea444f5b7a02323c"){
                                                //console.log("ESSE DAQUI Ó:")
                                                //console.log("a:"+a)
                                                //console.log("agendaSub:"+agendaSub)
                                            }
                                            
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
                                            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : agendaSub.agenda_beneid,//
                                                extra_convid : agendaSub.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : a.agenda_usuid,
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : convcreval,
                                                extra_mergevalordeb : convdebval,
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        default:

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
                                            
                                            newExtra = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : idUsu,
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//
                                                extra_terapiaid : a.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//
                                                extra_valordeb : convdebval,//
                                                extra_categoria : "Padrão",
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                    }
                                } else {
                                    
                                    data = a.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    
                                    if (a.agenda_categoria == "SubstitutoFixo") {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                            if( convcreTes == agendacreTes){
                                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                convcreval = ccre.convcre_valor;
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                        convdeb.forEach((cdeb)=>{
                                            if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                convdebval = "0,00";
                                            } else {
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                            }
                                        })

                                        Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                            if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                convdebval = "0,00";
                                            }
                                        })
                                        
                                        newExtra = new Extra({
                                            extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                            extra_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                            extra_beneid : a.agenda_beneid,//
                                            extra_convid : a.agenda_convid,//
                                            extra_usuid : idUsu,
                                            extra_data : a.agenda_data,//
                                            extra_hora : hora,//
                                            extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                            extra_terapiaid : a.agenda_terapiaid,//Musica
                                            extra_salaid : a.agenda_salaid,//
                                            extra_valorcre : convcreval,//Convenio não paga
                                            extra_valordeb : convdebval,//Paga ao musico
                                            extra_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                            extra_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                            extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                            extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                            extra_num : nextNum,
                                            extra_datacad : dataAtual.toISOString()
                                        });

                                        newCre = "";
                                        newDeb = "";
                                    } else {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                        if( convcreTes == agendacreTes){
                                            //console.log("if ("+convcreTes+" == "+agendacreTes)
                                            convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                            convcreval = ccre.convcre_valor;
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convdeb.forEach((cdeb)=>{
                                        if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                            convdebval = "0,00";
                                        } else {
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                        }
                                    })

                                    Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                        if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                            convdebval = "0,00";
                                        }
                                    })
    
                                    newExtra = new Extra({
                                        extra_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                        extra_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                        extra_beneid : a.agenda_beneid,//
                                        extra_convid : a.agenda_convid,//
                                        extra_usuid : idUsu,
                                        extra_data : a.agenda_data,//
                                        extra_hora : hora,//
                                        extra_terapeutaid : a.agenda_usuid,//
                                        extra_terapiaid : a.agenda_terapiaid,//
                                        extra_salaid : a.agenda_salaid,//
                                        extra_valorcre : convcreval,//
                                        extra_valordeb : convdebval,//
                                        extra_num : nextNum,
                                        extra_datacad : dataAtual.toISOString()
                                    });

                                    
                                    }
                                }
                                //console.log("newExtra save");
                                this.geraExtra(newExtra);
                            }
                        })
                    })
                })
            //})
            })
            //console.log("END CONVERT");
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    geraAtend: async (newAtend,res) => {
        //console.log("newAtend save");
        //console.log(newAtend.atend_num)
        await newAtend.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    geraExtra: async (newExtra,res) => {
        //console.log("newExtra save");
        //console.log(newExtra)
        await newExtra.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    GeraCre: async (newCre,res) => {
        //console.log("newCre save");
        await newCre.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    GeraDeb: async (newDeb,res) => {
        //console.log("newDeb save");
        await newDeb.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    copiaDiaAgendaFill(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        //console.log("----------CÓPIA----------")
        //console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(this.formataData(req.body.data));
        
        dataIni.setHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(this.formataData(req.body.data));
        
        dataFim.setHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        //console.log("dataIni"+dataIni);
        //console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false }).then((agenda)=>{
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setUTCDate(dataaux.getUTCDate()+7);
                //console.log("date")
                //console.log(dataaux)
                a.agenda_data = dataaux.toISOString();
                const newAgenda = new Agenda({
                    agenda_data : a.agenda_data,//
                    agenda_beneid : a.agenda_beneid,//
                    agenda_convid : a.agenda_convid,//
                    agenda_salaid : a.agenda_salaid,//
                    agenda_terapiaid : a.agenda_terapiaid,//
                    agenda_usuid : a.agenda_usuid,//
                    agenda_datacad: dataAtual//
                });
                this.salvaAgenda(newAgenda);
            })
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaL(req,res);
        })
    },
    copiaSemanaAgendaGeral(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        //console.log("-------------------------")
        //console.log("----------CÓPIA----------")
        //console.log("-------------------------")
        //console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(req.body.dataFinal);//deve retornar uma segunda-feira
        dataIni.setHours(dataIni.getHours()+3);
        dataIni.setHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = (fncGeral.getDataFMT(dataIni)+"T00:00:00.000Z");
        let dataFim = new Date(req.body.dataFinal);
        dataFim.setDate(dataFim.getDate()+5);
        dataFim.setHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        //+4 dias na segunda-feira para chegar a sexta
        //dataFim = dataFim.toISOString();
        dataFim = (fncGeral.getDataFMT(dataFim)+"T23:59:59.000Z");
        let dataAtual = new Date();
        let nextNum;
        let idsDeletar = [];
        console.log("dataIni"+dataIni);
        console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, agenda_extra: false}).then((agenda)=>{
            //console.log("agenda:"+agenda.length)
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setDate(dataaux.getDate()+7);
                a.agenda_data = dataaux.toISOString();
                var newAgenda;
                if (a.agenda_categoria == "SubstitutoFixo"){
                    newAgenda = new Agenda({
                        agenda_data : a.agenda_data,//
                        agenda_beneid : a.agenda_beneid,//
                        agenda_convid : a.agenda_convid,//
                        agenda_salaid : a.agenda_salaid,//
                        agenda_terapiaid : a.agenda_terapiaid,//
                        agenda_usuid : a.agenda_usuid,//
                        agenda_categoria : a.agenda_categoria,//
                        agenda_org : a.agenda_org,//
                        agenda_obs : a.agenda_obs,//
                        agenda_temp : a.agenda_temp,//
                        agenda_extra : a.agenda_extra,//
                        agenda_datacad: dataAtual,//
                        agenda_mergeterapiaid: a.agenda_mergeterapiaid,//
                        agenda_mergeterapeutaid: a.agenda_mergeterapeutaid//
                    });
                } else {
                    newAgenda = new Agenda({
                        agenda_data : a.agenda_data,//
                        agenda_beneid : a.agenda_beneid,//
                        agenda_convid : a.agenda_convid,//
                        agenda_salaid : a.agenda_salaid,//
                        agenda_terapiaid : a.agenda_terapiaid,//
                        agenda_usuid : a.agenda_usuid,//
                        agenda_categoria : a.agenda_categoria,//
                        agenda_org : a.agenda_org,//
                        agenda_obs : a.agenda_obs,//
                        agenda_temp : a.agenda_temp,//
                        agenda_extra : a.agenda_extra,//
                        agenda_datacad: dataAtual//
                    });
                }
                
                this.salvaAgenda(newAgenda);
            })
            //console.log(agenda)
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro');
        }).finally(()=>{
            //console.log("-------------------------")
            //console.log("-----------FIM-----------")
            //console.log("-------------------------")
            this.carregaAgendaF(req,res);
        })
    },
    salvaAgenda: async (newAgenda,res) => {
        //console.log("newAgenda save");
        await newAgenda.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    agendaAtualizaTerapia(req,res){
        switch (req.body.agendaAbra){
            case "-":
                //NADA
                res.render("admin/branco");
                break;
            case "agenda":
                agendaClass.agendaUpdateCampos(req,res);
                res.render("admin/branco");
                break;
            case "atend":
                atendClass.atendUpdateCampos(req,res);
                res.render("admin/branco");
                break;
            case "ambos":
                agendaClass.agendaUpdateCampos(req,res);
                atendClass.atendUpdateCampos(req,res);
                res.render("admin/branco");
                break;
        }
    },
    agendaFaltaDiaFill(req,res){
        let flash = new Resposta();
        let resultado;
        console.log("req.body.agendaCateg: "+req.body.agendaCateg)
        if (req.body.agendaCateg == "Feriado"){
            resultado = agendaClass.agendaFeriado(req,res);
        } else if (req.body.agendaCateg == "Falta Absoluta"){
            resultado = agendaClass.agendaFaltaDia(req,res);
            resultado = atendClass.atendFaltaDia(req,res);
        } else {
            resultado = agendaClass.agendaFaltaDia(req,res);
        }
        
        if (resultado = "true") {
            flash.sucesso = "true"
            flash.texto = "Cadastro de faltas realizados!"
            this.carregaCadFaltas(req,res,flash);
        } else {
            flash.sucesso = "false"
            flash.texto = "Erro ao realizar faltas: "+res.retorno
            this.carregaCadFaltas(req,res,flash);
        }
        
    },
    listaPlansubsfixoVictor(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("beneficiario/plansubsfixo", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    listaPlansubsfixoOld(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        console.log("Iniciando listaPlansubsfixo com dados do formulário:", req.body); // <--- Log para ver os dados recebidos

        // --- 1. Extrair e Validar Dados do Filtro ---
        let dataFiltroStr = req.body.dataFil; // Espera formato 'YYYY-MM-DD'
        let tipoFiltro = req.body.atendTipoPessoa; // 'Geral', 'Beneficiario', 'Terapeuta'
        let idBeneFiltro = req.body.agendaBeneid; // ObjectId como string, se tipoFiltro for 'Beneficiario'
        let idTeraFiltro = req.body.agendaUsuid;   // ObjectId como string, se tipoFiltro for 'Terapeuta'
        // soFixo é sempre true, então não precisa verificar

        if (!dataFiltroStr) {
            console.error("Data de filtro não fornecida.");
            req.flash("error_message", "Data de filtro é obrigatória!");
            return res.redirect('admin/erro'); // Ou uma página de erro apropriada
            // Alternativa: usar data atual se não for fornecida
            // dataFiltroStr = new Date().toISOString().split('T')[0];
        }

        let dataFiltro;
        try {
            // Cria um objeto Date a partir da string YYYY-MM-DD
            dataFiltro = new Date(dataFiltroStr);
            // Verifica se a data é válida
            if (isNaN(dataFiltro.getTime())) {
                throw new Error("Data inválida");
            }
            // Normaliza para o início do dia local (opcional, depende da sua lógica de data/hora)
            dataFiltro.setHours(0, 0, 0, 0);
        } catch (err) {
            console.error("Erro ao processar data do filtro:", dataFiltroStr, err);
            req.flash("error_message", "Data de filtro inválida!");
            return res.redirect('admin/erro');
        }


        // --- 2. Calcular Período da Semana com Base na Data do Filtro ---
        // Assumindo que semana vai de Domingo a Sábado
        let diaSemana = dataFiltro.getDay(); // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
        let inicioSemana = new Date(dataFiltro);
        inicioSemana.setDate(dataFiltro.getDate() - diaSemana); // Volta para o Domingo
        inicioSemana.setHours(0, 0, 0, 0); // Início do dia

        let fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6); // Vai para o Sábado
        fimSemana.setHours(23, 59, 59, 999); // Fim do dia

        let agoraISO = inicioSemana.toISOString();
        let depoisISO = fimSemana.toISOString();

        console.log(`Filtro: Data=${dataFiltroStr}, Tipo=${tipoFiltro}`);
        console.log(`Período da Semana Calculado: ${agoraISO} até ${depoisISO}`);

        // --- 3. Determinar o ID do Beneficiário para a Busca de Agenda ---
        let idBeneParaAgenda = null;
        if (tipoFiltro === "Beneficiario" && idBeneFiltro) {
            idBeneParaAgenda = idBeneFiltro; // Usar o beneficiário selecionado
        } else if (tipoFiltro === "Terapeuta" && idTeraFiltro) {
            // Se o filtro for por terapeuta, você pode querer buscar agendas para *todos* os beneficiários
            // ou talvez tenha outra lógica. Por enquanto, deixaremos idBeneParaAgenda como null
            // e filtraremos por terapeuta na query de Agenda, se aplicável.
            // OU, você pode ter uma lógica para encontrar beneficiários associados ao terapeuta.
            // Vamos assumir que você quer *todos* os beneficiários para um terapeuta específico.
            // Nesse caso, não filtramos por agenda_beneid, ou filtramos depois.
            // Para simplificar, vamos manter a lógica de pegar um bene inicial.
            // MAS, o ideal seria adaptar a lógica aqui.
            // Por enquanto, vamos manter a busca inicial, mas adaptar a query de agenda.
        }
        // Se tipoFiltro for "Geral", idBeneParaAgenda permanece null.

        // --- 4. Iniciar Buscas Assíncronas ---
        // Vamos usar Promise.all para buscar dados que não dependem uns dos outros
        // e encadear os que dependem.

        // Buscar listas gerais primeiro (elas não dependem de filtros específicos de agenda)
        const promessasListas = [
            Bene.find().lean(), // benes para o dropdown
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).lean(), // terapeutas para o dropdown
            Terapia.find().lean(), // terapias
            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).lean(), // horários
            Sala.find().lean(), // salas
            Conv.find().lean() // convênios (se necessário em outra parte)
        ];

        Promise.all(promessasListas).then(([benefTodos, terapeutasTodos, terapias, horaages, salas, convsTodos]) => {
            console.log("Listas gerais carregadas.");

            // Ordenar listas
            benefTodos.sort((a,b) => {
                const nomeA = (a.bene_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = (b.bene_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });

            terapeutasTodos.sort((a,b) => {
                const nomeA = (a.usuario_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = (b.usuario_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });

            terapias.sort((a, b) => {
                 const nomeA = (a.terapia_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                 const nomeB = (b.terapia_nome || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                 return nomeA.localeCompare(nomeB);
            });

            // --- 5. Determinar o Beneficiário Principal (para detalhes do cabeçalho) ---
            let promessaBenePrincipal;
            if (tipoFiltro === "Beneficiario" && idBeneFiltro) {
                promessaBenePrincipal = Bene.findById(idBeneFiltro).lean();
            } else {
                // Se não for filtro por beneficiário, pega o primeiro da lista ou um padrão
                // Ou talvez não precise mostrar detalhes de um bene específico se for Geral/Terapeuta
                // Vamos pegar o primeiro para manter compatibilidade com o código original
                promessaBenePrincipal = Promise.resolve(benefTodos.length > 0 ? benefTodos[0] : null);
                // Alternativa: Promise.resolve(null); // Se não houver bene principal
            }

            return promessaBenePrincipal.then(benePrincipal => {
                if (!benePrincipal) {
                     console.warn("Nenhum beneficiário principal encontrado.");
                     // Decidir como proceder. Pode ser um erro ou renderizar com dados mínimos.
                     // Vamos continuar por enquanto.
                }

                let nomeBenePrincipal = benePrincipal ? benePrincipal.bene_apelido : "N/A";
                let nomeSupPrincipal = benePrincipal ? benePrincipal.bene_supervisor : "N/A";
                let idConvPrincipal = benePrincipal ? benePrincipal.bene_convid : null;

                // --- 6. Buscar Convênio do Beneficiário Principal ---
                let promessaConvPrincipal = Promise.resolve(null);
                if (idConvPrincipal) {
                    // Encontra o convênio na lista já carregada
                    const convPrincipal = convsTodos.find(c => c._id.toString() === idConvPrincipal.toString());
                    if (convPrincipal) {
                         promessaConvPrincipal = Promise.resolve(convPrincipal);
                    } else {
                        // Se não estiver na lista, busca no banco
                        console.warn("Convênio do beneficiário principal não encontrado na lista geral, buscando individualmente.");
                        promessaConvPrincipal = Conv.findById(idConvPrincipal).lean();
                    }
                }

                return promessaConvPrincipal.then(convPrincipal => {
                    let nomeConvPrincipal = convPrincipal ? convPrincipal.conv_nome : "N/A";

                    // --- 7. Buscar Agendas ---
                    let queryAgenda = {
                        agenda_data: { $gte: agoraISO, $lte: depoisISO },
                        agenda_temp: false
                        // agenda_beneid será adicionado condicionalmente
                    };

                    if (tipoFiltro === "Beneficiario" && idBeneFiltro) {
                        queryAgenda.agenda_beneid = idBeneFiltro;
                    }
                    // Se tipoFiltro === "Terapeuta", você pode querer filtrar por agenda_usuid
                    // Isso depende da estrutura do seu modelo Agenda.
                    // Exemplo (se seu modelo Agenda tiver agenda_usuid):
                    // else if (tipoFiltro === "Terapeuta" && idTeraFiltro) {
                    //     queryAgenda.agenda_usuid = idTeraFiltro;
                    // }
                    // Se for "Geral", não adiciona filtro de bene ou tera, buscando todas.

                    console.log("Buscando agendas com query:", queryAgenda);
                    return Agenda.find(queryAgenda).lean().then(agendas => {
                        console.log("Agendas encontradas:", agendas.length);

                        // --- 8. Processar Agendas ---
                        let aux = 1;
                        agendas.forEach((e) => {
                             // ... (seu código de formatação de agenda - mantém como está) ...
                             // Certifique-se de usar 'e' em vez de 'agenda'
                             let dat = new Date(e.agenda_data);
                             e.agenda_data_dia = this.getDataFMT(dat);
                             let hora = ""+dat.getUTCHours();
                             let min = ""+dat.getMinutes();
                             if (hora.length == 1){hora = "0" + hora + "";}
                             if (min.length == 1){min = "0" + min + "";}
                             e.agenda_hora = hora+":"+min;
                             e.agenda_aux = aux;
                             aux++;

                             switch (dat.getUTCDay()){
                                 case 0: e.agenda_data_semana = "dom"; break;
                                 case 1: e.agenda_data_semana = "seg"; break;
                                 case 2: e.agenda_data_semana = "ter"; break;
                                 case 3: e.agenda_data_semana = "qua"; break;
                                 case 4: e.agenda_data_semana = "qui"; break;
                                 case 5: e.agenda_data_semana = "sex"; break;
                                 case 6: e.agenda_data_semana = "sab"; break;
                                 default: e.agenda_data_semana = "desconhecido"; break;
                             }
                        });

                        // Ordenar agendas (mantém sua lógica)
                        agendas.sort(function(a, b) {
                            // ... (sua lógica de ordenação - mantém como está) ...
                             let h1 = a.agenda_hora.substring(0,2);
                             let m1 = a.agenda_hora.substring(3,5);
                             let h2 = b.agenda_hora.substring(0,2);
                             let m2 = b.agenda_hora.substring(3,5);
                             if(h1 == h2){
                                 return m1.localeCompare(m2);
                             } else {
                                 return h1.localeCompare(h2);
                             }
                        });

                        // --- 9. Preparar Dados para a View ---
                        let semanaParaView = [
                             {dia: "dom", data: this.getData(inicioSemana)},
                             {dia: "seg", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))},
                             {dia: "ter", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))},
                             {dia: "qua", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))},
                             {dia: "qui", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))},
                             {dia: "sex", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))},
                             {dia: "sab", data: this.getData(new Date(inicioSemana.setDate(inicioSemana.getDate()+1)))}
                        ];
                        // Resetar inicioSemana para calcular datas individuais
                        let inicioSemanaAux = new Date(inicioSemana);
                        inicioSemanaAux.setDate(inicioSemana.getDate() - 6); // Volta para domingo

                        let segunda = this.getDataDiaMes(new Date(inicioSemanaAux.setDate(inicioSemanaAux.getDate()+1)));
                        let terca = this.getDataDiaMes(new Date(inicioSemanaAux.setDate(inicioSemanaAux.getDate()+1)));
                        let quarta = this.getDataDiaMes(new Date(inicioSemanaAux.setDate(inicioSemanaAux.getDate()+1)));
                        let quinta = this.getDataDiaMes(new Date(inicioSemanaAux.setDate(inicioSemanaAux.getDate()+1)));
                        let sexta = this.getDataDiaMes(new Date(inicioSemanaAux.setDate(inicioSemanaAux.getDate()+1)));

                        let dtFill = {dia: this.getDiaSemana(dataFiltro)};

                        let benenomeconv = `${nomeBenePrincipal} / ${nomeConvPrincipal} (${nomeSupPrincipal})`;

                        // --- 10. Renderizar View ---
                        console.log("Preparando para renderizar view com dados processados.");
                        res.render("beneficiario/plansubsfixo", {
                             salas: salas,
                             horaages: horaages,
                             agendas: agendas,
                             benes: benefTodos, // Passa a lista completa para o dropdown
                             convs: convsTodos, // Passa a lista completa
                             terapeutas: terapeutasTodos, // Passa a lista completa para o dropdown
                             terapias: terapias,
                             semanas: semanaParaView,
                             dtFill: dtFill,
                             benenomeconv: benenomeconv,
                             segunda: segunda, terca: terca, quarta: quarta, quinta: quinta, sexta: sexta
                        });
                        console.log("View renderizada com sucesso.");

                    }); // Fim Agenda.find
                }); // Fim promessaConvPrincipal.then
            }); // Fim promessaBenePrincipal.then
        }) // Fim Promise.all.then
        .catch((err) => {
            console.error("Erro ao carregar dados para plansubsfixo:", err);
            req.flash("error_message", "Houve um erro ao carregar os dados!");
            // res.redirect('admin/erro'); // Descomente se quiser redirecionar
            // Ou envie uma resposta de erro mais específica
            res.status(500).send("Erro interno do servidor ao carregar a página.");
        });
    },
    listaPlansubsfixoold2(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        console.log("=== Iniciando listaPlansubsfixo ===");
        console.log("Dados recebidos no req.body:", req.body);

        // --- 1. Extrair Dados do Filtro do Formulário ---
        // Assume que o campo hidden soFixo sempre envia "true"
        const dataFilStr = req.body.dataFil;       // Formato esperado: 'YYYY-MM-DD'
        const tipoFiltro = req.body.atendTipoPessoa; // 'Geral', 'Beneficiario', 'Terapeuta'
        const idBeneFiltro = req.body.agendaBeneid; // String do ObjectId, se tipoFiltro for 'Beneficiario'
        const idTeraFiltro = req.body.agendaUsuid;  // String do ObjectId, se tipoFiltro for 'Terapeuta'

        // --- 2. Validar e Processar Data ---
        if (!dataFilStr) {
            console.error("Erro: dataFil não foi fornecida pelo formulário.");
            return res.status(400).send("Data de filtro é obrigatória.");
        }

        let dataFiltro;
        try {
            dataFiltro = new Date(dataFilStr);
            if (isNaN(dataFiltro.getTime())) {
                throw new Error("Data inválida");
            }
            dataFiltro.setHours(0, 0, 0, 0); // Normaliza para o início do dia
        } catch (err) {
            console.error("Erro ao processar dataFil:", dataFilStr, err);
            return res.status(400).send("Data de filtro inválida.");
        }

        // --- 3. Calcular Período da Semana (Domingo a Sábado) ---
        const diaSemana = dataFiltro.getDay(); // 0 = Domingo
        const inicioSemana = new Date(dataFiltro);
        inicioSemana.setDate(dataFiltro.getDate() - diaSemana);
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        console.log(`Data do Filtro: ${dataFiltro.toISOString().split('T')[0]}`);
        console.log(`Período da Semana: ${inicioSemana.toISOString()} até ${fimSemana.toISOString()}`);

        // --- 4. Construir Filtro para a Agenda ---
        let filtroAgenda = {
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_categoria: "SubstitutoFixo", // Filtro fixo conforme solicitado
            agenda_temp: false // Assumindo que você não quer agendas temporárias
        };

        // Aplicar filtro condicional por Beneficiário ou Terapeuta
        if (tipoFiltro === "Beneficiario" && mongoose.Types.ObjectId.isValid(idBeneFiltro)) {
            filtroAgenda.agenda_beneid = new mongoose.Types.ObjectId(idBeneFiltro);
            console.log("Filtro aplicado: agenda_beneid =", idBeneFiltro);
        } else if (tipoFiltro === "Terapeuta" && mongoose.Types.ObjectId.isValid(idTeraFiltro)) {
            // Filtra se o terapeuta estiver em agenda_usuid OU agenda_mergeterapeutaid
            filtroAgenda.$or = [
                { agenda_usuid: new mongoose.Types.ObjectId(idTeraFiltro) },
                { agenda_mergeterapeutaid: new mongoose.Types.ObjectId(idTeraFiltro) }
            ];
            console.log("Filtro aplicado: agenda_usuid OU agenda_mergeterapeutaid =", idTeraFiltro);
        } else {
            console.log("Nenhum filtro adicional de Bene ou Tera aplicado (Geral ou ID inválido).");
            // Se for 'Geral' ou IDs inválidos, não adiciona mais filtros
        }

        console.log("Query final para Agenda.find:", JSON.stringify(filtroAgenda, null, 2));

        // --- 5. Buscar Dados Necessários em Paralelo ---
        Promise.allSettled([
            // a) Buscar agendas filtradas
            Agenda.find(filtroAgenda).lean(), 
            
            // b) Buscar listas para dropdowns e associações
            Bene.find().select('_id bene_nome bene_apelido bene_convid').lean(), // Seleciona campos relevantes
            Usuario.find().select('_id usuario_nome').lean(),
            Terapia.find().select('_id terapia_nome').lean(),
            Sala.find().select('_id sala_nome').lean(),
            Conv.find().select('_id conv_nome').lean()
        ])
        .then(([resultadoAgendas, resultadoBenes, resultadoUsuarios, resultadoTerapias, resultadoSalas, resultadoConvs]) => {
            
            if (resultadoAgendas.status === 'rejected') {
                throw new Error(`Falha ao buscar agendas: ${resultadoAgendas.reason}`);
            }
            const agendasFiltradas = resultadoAgendas.value;
            console.log(`Agendas encontradas: ${agendasFiltradas.length}`);

            // Converter arrays em mapas para acesso rápido por ID
            const mapaBenes = {};
            (resultadoBenes.status === 'fulfilled' ? resultadoBenes.value : []).forEach(b => mapaBenes[b._id.toString()] = b);

            const mapaUsuarios = {};
            (resultadoUsuarios.status === 'fulfilled' ? resultadoUsuarios.value : []).forEach(u => mapaUsuarios[u._id.toString()] = u);

            const mapaTerapias = {};
            (resultadoTerapias.status === 'fulfilled' ? resultadoTerapias.value : []).forEach(t => mapaTerapias[t._id.toString()] = t);

            const mapaSalas = {};
            (resultadoSalas.status === 'fulfilled' ? resultadoSalas.value : []).forEach(s => mapaSalas[s._id.toString()] = s);

            const mapaConvs = {};
            (resultadoConvs.status === 'fulfilled' ? resultadoConvs.value : []).forEach(c => mapaConvs[c._id.toString()] = c);

            // --- 6. Preparar dados para a view ---
            // Vamos apenas passar as agendas filtradas e os mapas para a view
            // A view fará as associações.

            // Preparar dados para exibição do período
            const semanaParaView = [];
            for (let i = 0; i < 7; i++) {
                const dataDia = new Date(inicioSemana);
                dataDia.setDate(inicioSemana.getDate() + i);
                const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
                semanaParaView.push({
                    dia: diasSemana[i],
                    data: `${String(dataDia.getDate()).padStart(2, '0')}/${String(dataDia.getMonth() + 1).padStart(2, '0')}`
                });
            }

            // --- 7. Renderizar View ---
            console.log("=== Renderizando view ===");
            res.render("beneficiario/plansubsfixo", {
                // Dados principais
                agendas: agendasFiltradas, // Array de objetos agenda brutos
                // Mapas para associação na view
                mapaBenes: mapaBenes,
                mapaUsuarios: mapaUsuarios,
                mapaTerapias: mapaTerapias,
                mapaSalas: mapaSalas,
                mapaConvs: mapaConvs,
                // Dados auxiliares
                semanas: semanaParaView,
                // Dados do filtro para exibição/reuso (opcional)
                filtroAplicado: {
                    dataFil: dataFilStr,
                    tipo: tipoFiltro,
                    beneId: idBeneFiltro,
                    teraId: idTeraFiltro
                }
                // Removemos benes, terapeutas, etc. do envio principal pois estão nos mapas
                // Se precisar das listas completas para dropdowns, pode adicioná-las de volta.
            });

        })
        .catch((err) => {
            console.error("Erro crítico em listaPlansubsfixo:", err);
            req.flash("error_message", "Houve um erro ao carregar os dados da agenda.");
            res.redirect('/admin/erro'); // Ou outra página de erro apropriada
        });
    },
    // Função para processar o formulário de filtro (POST /menu/beneficiario/plansubsfixoFill)
    listaPlansubsfixo(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        console.log("=== Iniciando listaPlansubsfixo (processar filtro) ===");
        console.log("Dados recebidos no req.body:", req.body);

        // --- 1. Extrair Dados do Filtro do Formulário ---
        const dataFilStr = req.body.dataFil;           // Formato esperado: 'YYYY-MM-DD'
        const tipoFiltro = req.body.atendTipoPessoa;   // 'Geral', 'Beneficiario', 'Terapeuta'
        const idBeneFiltro = req.body.agendaBeneid;    // String do ObjectId, se tipoFiltro for 'Beneficiario'
        const idTeraFiltro = req.body.agendaUsuid;     // String do ObjectId, se tipoFiltro for 'Terapeuta'
        const soFixo = req.body.soFixo;                // Esperado: "true"

        // --- 2. Validar Dados Obrigatórios ---
        if (!dataFilStr) {
            console.error("Erro: dataFil não foi fornecida pelo formulário.");
            req.flash("error_message", "Data de filtro é obrigatória.");
            return res.redirect('back'); // Ou uma rota específica
        }

        if (soFixo !== "true") {
            console.warn("Aviso: Filtro 'soFixo' não é 'true'. O comportamento pode ser inesperado. Usando 'true' implicitamente.");
            // Ou você pode retornar um erro se isso for estritamente obrigatório.
        }

        // --- 3. Validar e Processar Data ---
        let dataFiltro;
        try {
            dataFiltro = new Date(dataFilStr);
            if (isNaN(dataFiltro.getTime())) {
                throw new Error("Data inválida");
            }
            dataFiltro.setHours(0, 0, 0, 0); // Normaliza para o início do dia
        } catch (err) {
            console.error("Erro ao processar dataFil:", dataFilStr, err);
            req.flash("error_message", "Data de filtro inválida.");
            return res.redirect('back');
        }

        // --- 4. Calcular Período da Semana (Domingo a Sábado) ---
        const diaSemana = dataFiltro.getDay(); // 0 = Domingo
        const inicioSemana = new Date(dataFiltro);
        inicioSemana.setDate(dataFiltro.getDate() - diaSemana);
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        console.log(`Data do Filtro: ${dataFiltro.toISOString().split('T')[0]}`);
        console.log(`Período da Semana: ${inicioSemana.toISOString()} até ${fimSemana.toISOString()}`);

        // --- 5. Construir Filtro para a Agenda ---
        // Filtros base fixos
        let filtroAgenda = {
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_categoria: "SubstitutoFixo",
            agenda_temp: false
        };

        // Aplicar filtro condicional por Beneficiário ou Terapeuta
        if (tipoFiltro === "Beneficiario" && mongoose.Types.ObjectId.isValid(idBeneFiltro)) {
            filtroAgenda.agenda_beneid = new mongoose.Types.ObjectId(idBeneFiltro);
            console.log("Filtro aplicado: agenda_beneid =", idBeneFiltro);
        } else if (tipoFiltro === "Terapeuta" && mongoose.Types.ObjectId.isValid(idTeraFiltro)) {
            // Filtra se o terapeuta estiver em agenda_usuid OU agenda_mergeterapeutaid
            filtroAgenda.$or = [
                { agenda_usuid: new mongoose.Types.ObjectId(idTeraFiltro) },
                { agenda_mergeterapeutaid: new mongoose.Types.ObjectId(idTeraFiltro) }
            ];
            console.log("Filtro aplicado: agenda_usuid OU agenda_mergeterapeutaid =", idTeraFiltro);
        } else {
            console.log(`Nenhum filtro adicional de Bene ou Tera aplicado. Tipo: ${tipoFiltro}, ID Bene válido: ${mongoose.Types.ObjectId.isValid(idBeneFiltro)}, ID Tera válido: ${mongoose.Types.ObjectId.isValid(idTeraFiltro)}`);
            // Se for 'Geral' ou IDs inválidos, continua com os filtros base
        }

        console.log("Query final para Agenda.find:", JSON.stringify(filtroAgenda, null, 2));

        // --- 6. Buscar Dados Necessários em Paralelo ---
        Promise.allSettled([
            // a) Buscar agendas filtradas
            Agenda.find(filtroAgenda).lean(),
            
            // b) Buscar listas para dropdowns, associações e exibição geral
            Bene.find().select('_id bene_nome bene_apelido bene_convid').lean(),
            Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).select('_id usuario_nome').lean(), // Terapeutas
            Terapia.find().select('_id terapia_nome').lean(),
            Sala.find().select('_id sala_nome').lean(),
            Conv.find().select('_id conv_nome').lean()
            // Adicione outras coleções se forem necessárias na view (ex: Horaage)
        ])
        .then(([resultadoAgendas, resultadoBenes, resultadoTerapeutas, resultadoTerapias, resultadoSalas, resultadoConvs]) => {
            
            // --- 7. Processar Resultados das Promises ---
            
            // --- Agendas Filtradas ---
            if (resultadoAgendas.status === 'rejected') {
                throw new Error(`Falha ao buscar agendas: ${resultadoAgendas.reason}`);
            }
            const agendasFiltradas = resultadoAgendas.value;
            console.log(`Agendas encontradas após filtro: ${agendasFiltradas.length}`);

            // --- Função Auxiliar para Processar Listas ---
            const processarLista = (resultadoPromise, nomeLista) => {
                if (resultadoPromise.status === 'fulfilled') {
                    console.log(`${nomeLista} carregados: ${resultadoPromise.value.length} itens`);
                    return resultadoPromise.value;
                } else {
                    console.error(`Falha ao carregar ${nomeLista}:`, resultadoPromise.reason);
                    return []; // Retorna array vazio em caso de erro
                }
            };

            // --- Processar todas as listas ---
            const listaBenes = processarLista(resultadoBenes, 'Beneficiários');
            const listaTerapeutas = processarLista(resultadoTerapeutas, 'Terapeutas');
            const listaTerapias = processarLista(resultadoTerapias, 'Terapias');
            const listaSalas = processarLista(resultadoSalas, 'Salas');
            const listaConvs = processarLista(resultadoConvs, 'Convênios');

            // --- 8. Criar Mapas para Associações Rápidas na View ---
            const criarMapa = (lista, chave = '_id') => {
                const mapa = {};
                lista.forEach(item => {
                    if (item && item[chave]) {
                        // Usar toString() é crucial para comparação com strings de ID vindas do req.body
                        mapa[item[chave].toString()] = item; 
                    }
                });
                return mapa;
            };

            const mapaBenes = criarMapa(listaBenes);
            const mapaUsuarios = criarMapa(listaTerapeutas); // Usuarios são Terapeutas aqui
            const mapaTerapias = criarMapa(listaTerapias);
            const mapaSalas = criarMapa(listaSalas);
            const mapaConvs = criarMapa(listaConvs);

            // --- 9. Preparar Dados Auxiliares para a View ---
            
            // Preparar dados para exibição do período da semana
            const semanaParaView = [];
            const diasSemanaPtBr = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
            for (let i = 0; i < 7; i++) {
                const dataDia = new Date(inicioSemana);
                dataDia.setDate(inicioSemana.getDate() + i);
                semanaParaView.push({
                    dia: diasSemanaPtBr[i],
                    data: `${String(dataDia.getDate()).padStart(2, '0')}/${String(dataDia.getMonth() + 1).padStart(2, '0')}`
                });
            }

            // Preparar datas individuais para o cabeçalho (Seg a Sex)
            const datasIndividuais = [];
            for (let i = 1; i <= 5; i++) { // Começa de 1 (Segunda) até 5 (Sexta)
                const data = new Date(inicioSemana);
                data.setDate(inicioSemana.getDate() + i);
                datasIndividuais.push(`${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`);
            }
            const [segunda, terca, quarta, quinta, sexta] = datasIndividuais;

            // Determinar o nome do beneficiário/convênio para o cabeçalho, se aplicável
            let benenomeconv = "Filtro Aplicado";
            if (tipoFiltro === "Beneficiario" && idBeneFiltro && mapaBenes[idBeneFiltro]) {
                const beneSelecionado = mapaBenes[idBeneFiltro];
                const convDoBene = beneSelecionado.bene_convid ? mapaConvs[beneSelecionado.bene_convid.toString()] : null;
                const nomeConv = convDoBene ? convDoBene.conv_nome : 'Convênio não encontrado';
                benenomeconv = `${beneSelecionado.bene_apelido || beneSelecionado.bene_nome} / ${nomeConv}`;
            } else if (tipoFiltro === "Terapeuta" && idTeraFiltro && mapaUsuarios[idTeraFiltro]) {
                const teraSelecionado = mapaUsuarios[idTeraFiltro];
                benenomeconv = `Filtro por Terapeuta: ${teraSelecionado.usuario_nome}`;
            }

            const dtFill = { dia: diasSemanaPtBr[dataFiltro.getDay()] };

            // --- 10. Renderizar View ---
            console.log("=== Renderizando view plansubsfixo (com filtros) ===");
            res.render("beneficiario/plansubsfixo", {
                // --- Dados Principais ---
                agendas: agendasFiltradas, // Array de objetos agenda filtrados

                // --- Mapas para Associação Rápida na View (usados pelas linhas da tabela) ---
                mapaBenes: mapaBenes,
                mapaUsuarios: mapaUsuarios, // Usuarios são Terapeutas
                mapaTerapias: mapaTerapias,
                mapaSalas: mapaSalas,
                mapaConvs: mapaConvs,

                // --- Listas COMPLETAS para os Dropdowns no Formulário - CRUCIAL ---
                benes: listaBenes,        // Para o dropdown de beneficiários
                terapeutas: listaTerapeutas, // Para o dropdown de terapeutas
                convs: listaConvs,
                terapias: listaTerapias,
                salas: listaSalas,
                // horaages: [], // Adicione se necessário

                // --- Dados Auxiliares para Exibição ---
                semanas: semanaParaView,
                dtFill: dtFill,
                benenomeconv: benenomeconv,
                segunda: segunda, terca: terca, quarta: quarta, quinta: quinta, sexta: sexta,

                // --- Dados do Filtro Aplicado (para manter estado ou debug) ---
                filtroAplicado: {
                    dataFil: dataFilStr,
                    tipo: tipoFiltro,
                    beneId: idBeneFiltro,
                    teraId: idTeraFiltro
                    // soFixo: soFixo // Se quiser passar
                },
                
                // Indicar que não é o carregamento inicial (opcional)
                carregamentoInicial: false 
            });

        })
        .catch((err) => {
            console.error("Erro crítico em listaPlansubsfixo (POST):", err);
            req.flash("error_message", "Houve um erro ao aplicar o filtro.");
            // Em vez de redirect('/admin/erro'), considere voltar ou recarregar a página inicial
            // res.redirect('back'); 
            // Ou redirecionar para a página inicial da funcionalidade
            res.redirect('/menu/beneficiario/plansubsfixo'); // Redireciona para o GET
        });
    },
    plansubsfixoVictor(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
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
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("beneficiario/plansubsfixo", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    // Função para carregar a página inicial (GET /menu/beneficiario/plansubsfixo)
    plansubsfixo(req, res) {
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        console.log("=== Iniciando plansubsfixo (carregar página inicial) ===");

        // --- 1. Calcular Período da Semana Atual (Domingo a Sábado) ---
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const diaSemanaHoje = hoje.getDay(); // 0 = Domingo
        const inicioSemanaAtual = new Date(hoje);
        inicioSemanaAtual.setDate(hoje.getDate() - diaSemanaHoje); // Volta para o Domingo
        inicioSemanaAtual.setHours(0, 0, 0, 0);

        const fimSemanaAtual = new Date(inicioSemanaAtual);
        fimSemanaAtual.setDate(inicioSemanaAtual.getDate() + 6); // Vai para o Sábado
        fimSemanaAtual.setHours(23, 59, 59, 999);

        console.log(`Período da Semana Atual: ${inicioSemanaAtual.toISOString()} até ${fimSemanaAtual.toISOString()}`);

        // --- 2. Preparar dados para exibição do período na view ---
        const semanaParaView = [];
        const diasSemana = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];
        for (let i = 0; i < 7; i++) {
            const dataDia = new Date(inicioSemanaAtual);
            dataDia.setDate(inicioSemanaAtual.getDate() + i);
            semanaParaView.push({
                dia: diasSemana[i],
                data: `${String(dataDia.getDate()).padStart(2, '0')}/${String(dataDia.getMonth() + 1).padStart(2, '0')}`
            });
        }

        // --- 3. Buscar Listas Necessárias para Dropdowns e Dados Iniciais ---
        // Usamos Promise.allSettled para garantir que mesmo se uma falhe, tentamos continuar
        Promise.allSettled([
            // a) Buscar agendas da semana ATUAL para o beneficiário padrão (opcional, pode ser vazio inicialmente)
            // Para simplificar e evitar depender de um Bene.findOne(), podemos buscar todas ou passar array vazio.
            // Vamos passar um array vazio inicialmente, pois o filtro real acontece no POST.
            Promise.resolve([]), // Placeholder para agendas iniciais

            // b) Buscar listas para dropdowns e associações
            Bene.find().select('_id bene_nome bene_apelido bene_convid').lean(),
            Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).select('_id usuario_nome').lean(), // Terapeutas
            Terapia.find().select('_id terapia_nome').lean(),
            Sala.find().select('_id sala_nome').lean(),
            Conv.find().select('_id conv_nome').lean()
        ])
        .then(([resultadoAgendasIniciais, resultadoBenes, resultadoTerapeutas, resultadoTerapias, resultadoSalas, resultadoConvs]) => {
            
            // --- 4. Processar Resultados ---
            let agendasIniciais = [];
            if (resultadoAgendasIniciais.status === 'fulfilled') {
                agendasIniciais = resultadoAgendasIniciais.value;
                console.log(`Agendas iniciais carregadas: ${agendasIniciais.length} itens`);
            } else {
                console.warn("Falha ao carregar agendas iniciais (continuando):", resultadoAgendasIniciais.reason);
                agendasIniciais = []; // Fallback para array vazio
            }

            // Função auxiliar para processar resultados de listas
            const processarResultadoLista = (resultado, nomeLista) => {
                if (resultado.status === 'fulfilled') {
                    console.log(`${nomeLista} carregados: ${resultado.value.length} itens`);
                    return resultado.value;
                } else {
                    console.error(`Falha ao carregar ${nomeLista}:`, resultado.reason);
                    return []; // Fallback para array vazio
                }
            };

            const listaBenes = processarResultadoLista(resultadoBenes, 'Beneficiários');
            const listaTerapeutas = processarResultadoLista(resultadoTerapeutas, 'Terapeutas');
            const listaTerapias = processarResultadoLista(resultadoTerapias, 'Terapias');
            const listaSalas = processarResultadoLista(resultadoSalas, 'Salas');
            const listaConvs = processarResultadoLista(resultadoConvs, 'Convênios');

            // --- 5. Criar Mapas para Associações na View (opcional para a página inicial, mas bom ter) ---
            const criarMapa = (lista, chave = '_id') => {
                const mapa = {};
                lista.forEach(item => {
                    if (item && item[chave]) {
                        mapa[item[chave].toString()] = item;
                    }
                });
                return mapa;
            };

            const mapaBenes = criarMapa(listaBenes);
            const mapaTerapeutas = criarMapa(listaTerapeutas);
            const mapaTerapias = criarMapa(listaTerapias);
            const mapaSalas = criarMapa(listaSalas);
            const mapaConvs = criarMapa(listaConvs);

            // --- 6. Dados Auxiliares Iniciais (valores padrão ou vazios) ---
            // Como não temos um beneficiário específico inicialmente, podemos usar valores padrão
            // ou deixar campos vazios na view. Aqui, vamos deixar alguns dados genéricos.
            const dtFill = { dia: diasSemana[inicioSemanaAtual.getDay()] }; // Dia da semana de hoje
            const benenomeconv = "Selecione um filtro"; // Mensagem padrão
            // Datas individuais da semana
            const datasIndividuais = [];
            for (let i = 0; i < 5; i++) { // Seg a Sex
                const data = new Date(inicioSemanaAtual);
                data.setDate(inicioSemanaAtual.getDate() + 1 + i); // +1 para pular domingo
                datasIndividuais.push(`${String(data.getDate()).padStart(2, '0')}/${String(data.getMonth() + 1).padStart(2, '0')}`);
            }
            const [segunda, terca, quarta, quinta, sexta] = datasIndividuais;

            // --- 7. Renderizar View ---
            console.log("=== Renderizando view plansubsfixo (inicial) ===");
            res.render("beneficiario/plansubsfixo", {
                // Dados principais
                agendas: agendasIniciais, // Array de agendas (pode estar vazio inicialmente)

                // Mapas para associação na view (se usados na tabela inicial)
                mapaBenes: mapaBenes,
                mapaUsuarios: mapaTerapeutas, // Usuários são terapeutas aqui
                mapaTerapias: mapaTerapias,
                mapaSalas: mapaSalas,
                mapaConvs: mapaConvs,

                // Listas COMPLETAS para os dropdowns no formulário - CRUCIAL
                benes: listaBenes,
                terapeutas: listaTerapeutas,
                convs: listaConvs,
                terapias: listaTerapias,
                salas: listaSalas,
                // horaages: [] // Se necessário

                // Dados auxiliares para o cabeçalho/rodapé da view
                semanas: semanaParaView,
                dtFill: dtFill,
                benenomeconv: benenomeconv,
                segunda: segunda, terca: terca, quarta: quarta, quinta: quinta, sexta: sexta,

                // Indicar que é o carregamento inicial (opcional, para lógica na view)
                carregamentoInicial: true
            });

        })
        .catch((err) => {
            console.error("Erro crítico em plansubsfixo (GET):", err);
            req.flash("error_message", "Houve um erro ao carregar a página inicial.");
            // Redireciona para uma página de erro genérica ou a página inicial do menu
            res.redirect('/'); // Ou '/admin/erro'
        });
    },
   
    /*
    deletaAgendaAtend(req, res){
        let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{
            a.forEach(a=>{
                Cre.find({credit_atendnum: a.atend_num}).then((cr)=>{
                    cr.forEach((c)=>{
                        Cre.deleteOne({_id: c._id}).catch((err) =>{
                            console.log(err)
                        })
                    })
                    Deb.find({debit_atendnum: a.atend_num}).then((de)=>{
                        de.forEach((d)=>{
                            Deb.deleteOne({_id: d._id}).catch((err) =>{
                                console.log(err)
                            })
                        })
                        Tabil.find({tabil_atendnum: a.atend_num}).then((tab)=>{
                            tab.forEach((t)=>{
                                Tabil.deleteOne({_id: t._id}).catch((err) =>{
                                    console.log(err)
                                })
                            })
                            Atend.deleteOne({_id: a._id}).then(()=>{
                                //console.log("DELETED!");
                            })
                        })
                    })
                })
            })
        })
    },
    */
    temDia(haddia,horaage,agenda,semana,aux,diaDaSemana){
        let voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
        if(haddia){
            horaage.forEach((h)=>{
                let is = true;
                
                agenda.forEach((e)=>{
                    if(e.agenda_data_semana == diaDaSemana){
                        if (h.horaage_hora == e.agenda_hora){
                            is = false
                        }
                    }
                });
                // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                
                if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                    let daty;
                    semana.forEach((y)=>{
                        if(y.dia == diaDaSemana){
                            daty = y.data
                        }
                    });

                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                    
                    agendaVoid = new Agenda({
                        agenda_hora : h.horaage_hora,
                        agenda_data_semana : diaDaSemana,
                        agenda_data_dia : dty,
                        agenda_aux : aux,
                        agenda_salaid : voidId,
                        agenda_beneid : voidId,
                        agenda_convid : voidId,
                        agenda_terapiaid : voidId,
                        agenda_usuid : voidId,
                        agenda_mergeterapeutaid : voidId,
                        agenda_mergeterapiaid : voidId 
                    });
                    agenda.push(agendaVoid);
                    aux++;
                }
            })
        } else {
            horaage.forEach((h)=>{
                let daty;
                semana.forEach((y)=>{
                    if(y.dia == diaDaSemana){
                        daty = y.data
                    }
                });

                let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                
                agendaVoid = new Agenda({
                    agenda_hora : h.horaage_hora,
                    agenda_data_semana : diaDaSemana,
                    agenda_data_dia : dty,
                    agenda_aux : aux,
                    agenda_salaid : voidId,
                    agenda_beneid : voidId,
                    agenda_convid : voidId,
                    agenda_terapiaid : voidId,
                    agenda_usuid : voidId,
                    agenda_mergeterapeutaid : voidId,
                    agenda_mergeterapiaid : voidId 
                });
                agenda.push(agendaVoid);
                aux++;
            })
        }
    }
    ,
    atualizaValores(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        console.log("atualizaValores")
        let tipoPessoa = req.body.atendTipoPessoa;
        let tipoData = req.body.tipoData;
        let dataIni;
        let dataFim;
        let seg;
        let sex;
        let busca;
        let data;
        let ano;
        let mes;
        let dia;
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);
        let convcreTes;
        let agendacreTes;
        let agendacreTesSub;
        let agendacreTesFixo;
        let convcreval;
        let convcrevalSub;
        let convcrevalFixo;
        let convdebTes;
        let agendadebTes;
        let agendadebTesSub;
        let agendadebTesFixo;
        let convdebval;
        let convdebvalSub;
        let convdebvalFixo;

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
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
            case "Beneficiario":
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } , atend_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } , atend_terapeutaid: req.body.atendTerapeuta };
                console.log("req.body.atendTerapeuta:"+req.body.atendTerapeuta);
                break;
            default:
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }

        Atend.find(busca).then((atendimentos)=>{
            cc.then((convcre)=>{
                convcre.forEach((c)=>{
                    Conv.findOne({_id: c.convcre_convid,convcre_status: { $ne: "Inativo" },convcre_lixo: { $ne: "true" }}).then((conv)=>{
                        c.convcre_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convcre)
                cd.then((convdeb)=>{
                    convdeb.forEach((d)=>{
                        Conv.findOne({_id: d.convdeb_convid,convdeb_status: { $ne: "Inativo" },convdeb_lixo: { $ne: "true" }}).then((conv)=>{
                            d.convdeb_convCpfCnpj = conv.conv_cnpj;
                        })
                    })
                    //console.log("atendimentos: "+atendimentos.length)

                    atendimentos.forEach((a)=>{
                        agendacreTes = ""+a.atend_convid + a.atend_terapiaid+""
                        agendacreTesSub = ""+a.atend_convid + a.atend_mergeterapiaid+""
                        agendacreTesFixo = ""+a.atend_convid + a.atend_fixoterapiaid+""
                        convcre.forEach((ccre)=>{
                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                            if( convcreTes == agendacreTes){
                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                convcreval = ccre.convcre_valor;
                                //console.log("convcreval: "+convcreval)
                            }
                            if( convcreTes == agendacreTesSub){
                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                convcrevalSub = ccre.convcre_valor;
                                //console.log("convcrevalSub: "+convcrevalSub)
                            }
                            if (a.atend_fixo == "true"){
                                if( convcreTes == agendacreTesFixo){
                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                    convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                    convcrevalFixo = ccre.convcre_valor;
                                    //console.log("convcrevalFixo: "+convcrevalFixo)
                                }
                            }
                        })

                        agendadebTes = ""+a.atend_convid + a.atend_terapiaid+"";//padrão
                        agendadebTesSub = ""+a.atend_convid + a.atend_mergeterapiaid+"";//Semanal
                        agendadebTesFixo = ""+a.atend_convid + a.atend_fixoterapiaid+"";//SubFixa
                        convdeb.forEach((cdeb)=>{
                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                            if(convdebTes == agendadebTes){
                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                convdebval = cdeb.convdeb_valor;
                            }
                            if(convdebTes == agendadebTesSub){
                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                convdebvalSub = cdeb.convdeb_valor;
                            }
                            if (a.atend_fixo == "true"){
                                if(convdebTes == agendadebTesFixo){
                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                    convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                    convdebvalFixo = cdeb.convdeb_valor;
                                }
                            }
                        })
                        if (a.atend_mergeterapiaid == undefined){
                            if (a.agenda_categoria == "SubstitutoFixo"){
                                Atend.findByIdAndUpdate(a._id, { $set: { 
                                    atend_valorcre : convcreval,//Convenio não paga
                                    atend_valordeb : convdebval,//Paga ao musico
                                    atend_fixovalorcre : convcrevalFixo,
                                    atend_fixovalordeb : convdebvalFixo 
                                }}).then(() =>{
                                    console.log("TRUE")
                                }).catch((err) =>{
                                    console.log(err)
                                })
                            } else {
                                Atend.findByIdAndUpdate(a._id, { $set: { 
                                    atend_valorcre : convcreval,//Convenio não paga
                                    atend_valordeb : convdebval//Paga ao musico 
                                }}).then(() =>{
                                    console.log("TRUE")
                                }).catch((err) =>{
                                    console.log(err)
                                })
                            }
                        } else {
                            if (a.atend_fixo == "true"){
                                Atend.findByIdAndUpdate(a._id, { $set: { 
                                    atend_valorcre : convcreval,//Convenio não paga
                                    atend_valordeb : convdebval,//Paga ao musico
                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                    atend_fixovalorcre : convcrevalFixo,
                                    atend_fixovalordeb : convdebvalFixo
                                }}).then((ue)=>{
                                    console.log("FEZ")
                                }).then(() =>{
                                    console.log("TRUE")
                                }).catch((err) =>{
                                    console.log(err)
                                })
                            } else {
                                Atend.findByIdAndUpdate(a._id, { $set: { 
                                    atend_valorcre : convcreval,//Convenio não paga
                                    atend_valordeb : convdebval,//Paga ao musico
                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                }}).then(() =>{
                                    console.log("TRUE")
                                }).catch((err) =>{
                                    console.log(err)
                                })
                            }
                        }
                    })
                })
            })
        })
            
    },
    arquivarAgendasAntigas : async(req,res) => {
        try {
            let db = req.cookies['preferredDb'];
            Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
            AgendaArquivo = getModel(db, 'tb_agendaArquivo', AgendaArquivoClass)
            console.log("🔎 Buscando agendas anteriores a 2025...");

            // Definindo a data limite: 1º de janeiro de 2025
            const limite = new Date("2025-01-01T00:00:00.000Z");

            // Busca todos os registros anteriores a 2025
            const antigas = await Agenda.find({ agenda_data: { $lt: limite } });

            if (antigas.length === 0) {
            console.log("✅ Nenhum registro anterior a 2025 encontrado.");
            return;
            }

            console.log(`📦 Encontradas ${antigas.length} agendas antigas.`);

            // Insere todas na coleção de arquivo
            const inseridas = await AgendaArquivo.insertMany(antigas);
            console.log(`✅ Inseridas ${inseridas.length} agendas em tb_agendaarquivos.`);

            // Remove as antigas da coleção original
            const removidas = await Agenda.deleteMany({ agenda_data: { $lt: limite } });
            console.log(`🗑️ Removidas ${removidas.deletedCount} agendas de tb_agendas.`);

            console.log("🎉 Processo de arquivamento concluído com sucesso!");
        } catch (err) {
            console.error("❌ Erro ao arquivar agendas:", err);
        }
    }
}
/*
let atualizar = agendaClass.agendaAddNovosCampos(req,res);
atualizar.then((res) =>{
    //console.log(res)
    resultado = true;
}).catch((err) =>{
    console.log(err)
    resultado = false;
}).finally(() =>{
    //console.log("resultado")
    //console.log(resultado);
})

    a.forEach(a=>{Atend.deleteOne({_id: a._id}).then(()=>{//console.log("DELETED!");})})
*/
/*
converteAgendaEmAtend2(req,res){//Converte a Agenda em Atendimento
        //console.log("----------CÓPIA----------")
        //console.log("dia:"+req.body.dataFil)
        let convcreval;
        let convdebval;
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaFinal;
        let idSubstituidas = [];
        let agendaSubstituida = [];
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convCreCpfCnpj;
        let convDebCpfCnpj;
        let convcreTes;
        let convdebTes;
        let newTabil;
        let nextNum;
        let temp;
        let aux;
        let auxId;
        let teraContrato;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let temAgendaSub;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
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
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        //console.log("dataIni: "+dataIni);
        //console.log("dataFim: "+dataFim);
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}}).then((agenda)=>{
            //-------------------------
            //console.log(agenda)
            Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                //console.log("validação caso seja o primeiro registro")
                atendimento.forEach(e => {atend = e});
                nextNum = atend.atend_num;
                //this.sleep(10000).then(() => {
                    
                        //let tamanho = agenda.length;
                        agenda.forEach((agendaFull)=>{
                            if(agendaFull){
                                Usuario.findOne({_id: agendaFull.agenda_usuid}).then((terapeuta)=>{
                                    teraContrato = terapeuta.usuario_contrato;
                                })
                                temp = agendaFull.agenda_tempId;
                                
                                if (temp != undefined){

                                    idSubstituidas.push(temp);
                                    
                                }
                            } else {
                                //console.log("undefined")
                            }
                        })

                        idSubstituidas.forEach((a)=>{
                            auxId = ""+a+"";
                            agenda.some((g)=>{
                                aux = ""+g._id+"";
                                if(auxId===auxId){
                                    agendaSubstituida.push(g);
                                    agenda.splice(agenda.findIndex(agenda => agenda._id == a), 1);
                                    return true;
                                }
                                return false;
                            })
                        })
                        //agendaSubstituida.forEach((s)=>{//console.log("aSub:"+s)})
                        let hora;
                        let data;
                        agenda.forEach((a)=>{
                            if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            }
                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                temp = a.agenda_tempId;
                                //console.log("nextNum: "+nextNum)
                                convcreval = "0,00";
                                convdebval = "0,00";
                                if (temp != undefined){
                                    //agendaSub = agendaSubstituida.filter(as => as._id == temp)
                                    
                                    agendaSubstituida.some((s)=>{
                                        aux = s._id
                                        if((""+aux) === (""+temp)){
                                            agendaSub = s;
                                            temAgendaSub = true;
                                            //console.log("HORA:"+agendaSub)
                                            //console.log("achou!!!")
                                            return true;
                                        }
                                        return false;
                                    })

                                    if(!temAgendaSub){
                                        data = new Date(a.agenda_data)
                                        let hora = ""+data.getHours();
                                        let min = ""+data.getMinutes();

                                        if (hora.length == 1){
                                            hora = "0"+hora;
                                        }

                                        if (min.length == 1){
                                            min = "0"+min;
                                        }

                                        let horaAgenda = hor+":"+min;
                                        //console.log("HORA:"+horaAgenda);
                                        hora = horaAgenda;
                                        //console.log("AGENDA1 ERRO:"+a)
                                    } else {
                                        data = new Date(agendaSub.agenda_data);
                                        let hora = data.getHours();
                                        let min = data.getMinutes();

                                        if (hora.length = 1){
                                            hora = "0"+hora;
                                        }

                                        if (min.length = 1){
                                            min = "0"+min;
                                        }
                                        let horaAgenda = data.getHours()+":"+data.getMinutes();
                                        //console.log("HORA:"+horaAgenda);
                                        hora = horaAgenda;
                                        //console.log("AGENDA2 ERRO:"+agendaSub)
                                    }

                                    switch (a.agenda_tempmotivo){
                                        case "Falta":

                                            agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })
                                            //console.log("a:"+a)
                                            //console.log("agendaSub:"+agendaSub)
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : idUsu,
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,//mesmo terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,//recebe pelo plano pois não foi avisado previamente
                                                atend_mergevalordeb : "0,00",//Não paga pois o terapeuita não atende ninguem
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                atend_terapiaid : agendaSub.agenda_usuid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                atend_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                atend_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                atend_mergeterapiaid : a.agenda_usuid,
                                                atend_mergevalorcre : convcreval,//recebe pelo novo bene
                                                atend_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : agendaSub.agenda_terapiaid ,
                                                credit_terapeutaid : agendaSub.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : roberta._id,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : "0,00",
                                                atend_mergevalordeb : "0,00",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Nenhuma Observação",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,
                                                atend_mergevalordeb : convdebval,
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        default:

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//
                                                atend_terapiaid : a.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//
                                                atend_valordeb : convdebval,//
                                                atend_categoria : "Nenhuma Observação",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                convcre_atendnum : nextNum ,
                                                convcre_categoria : "Falta Justificada" ,
                                                convcre_terapiaid : a.agenda_terapiaid ,
                                                convcre_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                convcre_nome : "Atendimento Auto" ,
                                                convcre_cpfcnpj : convCreCpfCnpj ,
                                                convcre_dataevento : a.agenda_data ,
                                                convcre_datavenci : dataVenci ,
                                                convcre_valorprev : convcreval ,
                                                convcre_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                    }
                                } else {

                                    agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                        if( convcreTes == agendacreTes){
                                            //console.log("if ("+convcreTes+" == "+agendacreTes)
                                            convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                            convcreval = ccre.convcre_valor;
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convdeb.forEach((cdeb)=>{
                                        if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                            convdebval = "0,00";
                                        } else {
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                        }
                                    })
    
                                    newAtend = new Atend({
                                        atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                        atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                        atend_beneid : a.agenda_beneid,//
                                        atend_convid : a.agenda_convid,//
                                        atend_usuid : "Usuario Atual",
                                        atend_atenddata : new Date(a.agenda_data),//
                                        atend_atendhora : a.agenda_hora,
                                        atend_terapeutaid : a.agenda_usuid,//
                                        atend_terapiaid : a.agenda_terapiaid,//
                                        atend_salaid : a.agenda_salaid,//
                                        atend_valorcre : convcreval,//
                                        atend_valordeb : convdebval,//
                                        atend_num : nextNum,
                                        atend_datacad : dataAtual.toISOString()
                                    });

                                    newCre = new Cre({
                                        credit_atendnum : nextNum ,
                                        credit_categoria : "Falta Justificada" ,
                                        credit_terapiaid : a.agenda_terapiaid ,
                                        credit_terapeutaid : a.agenda_usuid ,
                                        //credit_convid : req.body.creditConvid ,
                                        credit_nome : "Atendimento "+nextNum ,
                                        credit_cpfcnpj : convCreCpfCnpj ,
                                        credit_dataevento : a.agenda_data ,
                                        credit_datavenci : dataVenci ,
                                        credit_valorprev : convcreval ,
                                        credit_datacad : dataAtual
                                    })

                                    newDeb = new Deb({
                                        credit_atendnum : nextNum ,
                                        credit_categoria : "Falta Justificada" ,
                                        credit_terapiaid : a.agenda_terapiaid ,
                                        credit_terapeutaid : a.agenda_usuid ,
                                        //credit_convid : req.body.creditConvid ,
                                        credit_nome : "Atendimento "+nextNum ,
                                        credit_cpfcnpj : convCreCpfCnpj ,
                                        credit_dataevento : a.agenda_data ,
                                        credit_datavenci : dataVenci ,
                                        credit_valorprev : convdebval ,
                                        credit_datacad : dataAtual
                                    })
                                }
                                //console.log("newAtend:"+newAtend)
                                nextNum = nextNum ++;
                                //console.log("newAtend save");
                                this.geraAtend(newAtend);
                                if(newCre != ""){
                                    this.GeraCre(newCre);
                                    newCre == "";
                                }
                                if(newDeb != ""){
                                    this.GeraDeb(newDeb);
                                    newDeb == "";
                                }
                                //console.log("Setar migrado")
                                Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: true }})
                                //Agenda.findById(a._id)
                                //console.log("setou migrado")
                            }
                            })
                        })
                    })
                //})
            })
            //console.log("END COPIA")
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    */
   /*
        let aaa = new Date();
        aaa.setDate(aaa.getDate()-4);
        //console.log("AAA:"+aaa);
        let bbb = new Date();
        bbb.setDate(bbb.getDate()+2);
        //console.log("BBB:"+bbb);
        Agenda.find({agenda_data: { $gte : aaa, $lte:  bbb }}).then((del)=>{
            //console.log("del.length"+del.length);
            del.forEach((item)=>{
                Agenda.findByIdAndDelete(item._id, function (err, docs) {
                    if (err){
                        console.log(err)
                    }else{
                        //console.log("DETETED!");
                    }
                });
            })
        })
   */
         /* 
        let opIni = new Date();
        let opFim = new Date();
        opIni.setFullYear(2024);
        opFim.setFullYear(2024);
        opIni.setMonth(11);
        opFim.setMonth(11);
        opIni.setDate(15);
        opFim.setDate(21);
        opIni.setHours(0);
        opIni.setMinutes(0);
        opIni.setSeconds(0);
        opFim.setHours(23);
        opFim.setMinutes(59);
        opFim.setSeconds(59);
        opFim.setHours(opFim.getHours()-3);
        opIni.setHours(opIni.getHours()-3);
        console.log("opIni: "+opIni);
        console.log("opFim: "+opFim);
        opIni = opIni.toISOString();
        opFim = opFim.toISOString();
        console.log("opIni: "+opIni);
        console.log("opFim: "+opFim);
        
        Agenda.find({ agenda_data: { $gte : opIni, $lte:  opFim } }).then((agenda) =>{
            console.log("agenda.length: "+agenda.length);
            //pt1
            
            //pt2
        })
*/
  /*

  Agenda.find({ agenda_data: { $gte : opIni, $lte:  opFim } }).then((agenda) =>{
            console.log("agenda.length: "+agenda.length);
            //pt1
            
            //pt2
        })
  */

        /* 
            //pt1
            AgendaArquivo.insertMany(agenda).then(()=>{
                console.log("Then...");
            }).finally(()=>{
                console.log("FinishInsert");
                AgendaArquivo.find({ agenda_data: { $gte : opIni, $lte:  opFim } }).then((arquivos) =>{
                    console.log("arquivos.length: "+arquivos.length);
                })
            });
            */

           /*
           //pt2
            Agenda.deleteMany({ agenda_data: { $gte : opIni, $lte:  opFim } }).then(()=>{
                console.log("Then...");
            }).finally(()=>{
                console.log("FinishDelete");
                Agenda.find({ agenda_data: { $gte : opIni, $lte:  opFim } }).then((arquivos) =>{
                    console.log("agenda.length: "+arquivos.length);
                })
            });
            */
           /*
            //pt3
            Agenda.deleteMany({ _id: { $in: idsDeletar } }).then(result => {
                console.log(`Foram deletados ${result.deletedCount} agendamentos.`);
            })
            .catch(err => {
                console.error("Erro ao deletar agendamentos:", err);
            });
            */

            /*
            converteAgendaEmAtendOldOld(req,res){//Converte a Agenda em Atendimento
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        //console.log("dia:"+req.body.dataFil)
        let idUsu = req.cookies['idUsu'];
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convcreval;
        let convdebval;
        let convcrevalSub;
        let convdebvalSub;
        let convcrevalFixo;
        let convdebvalFixo;
        let convCreCpfCnpj;
        let convDebCpfCnpj;
        let convCreCpfCnpjSub;
        let convDebCpfCnpjSub;
        let convCreCpfCnpjFixo;
        let convDebCpfCnpjFixo;
        let convcreTes;
        let convdebTes;
        let convcreTesSub;
        let convdebTesSub;
        let convcreTesFixo;
        let convdebTesFixo;
        let nextNum;
        let teraContrato;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let agendacreTesSub;
        let agendadebTesSub;
        let agendacreTesFixo;
        let agendadebTesFixo;
        let hora;
        let data;
        let hor;
        let min;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        //console.log("START CONVERT");
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
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        console.log("dataIni: "+dataIni);
        console.log("dataFim: "+dataFim);
        
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } } ]}).then((agendaFixa)=>{
            Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: true, $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } } ]}).then((agendaSemanal)=>{
            //-------------------------
            console.log("agendaSemanal.length: "+agendaSemanal.length);
            Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                //console.log("validação caso seja o primeiro registro")
                atendimento.forEach(e => {atend = e});
                nextNum = atend.atend_num;
                        agendaFixa.forEach((a)=>{
                            agendaSub = '';
                            convcreval = "0,00";
                            convdebval = "0,00";
                            //if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            //}
                            //console.log("a.agenda_categoria:"+a.agenda_categoria);

                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                agendaSemanal.forEach((s)=>{
                                    if (""+a._id === ""+s.agenda_tempId){
                                        agendaSub = s;
                                    }
                                })

                                if (agendaSub != ''){
                                    data = agendaSub.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;

                                    switch (agendaSub.agenda_categoria){
                                        case "Apoio"://ANALISE
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Apoio",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agendaMergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Apoio",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }
                                            

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Apoio" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Apoio" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : req.body.debitConvid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Extra":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Extra",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,
                                                    atend_mergevalordeb : convdebvalSub,
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Extra",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Extra" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Extra" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : arguments.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Falta":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//
                                                    atend_valordeb : convdebval,//
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//mesmo terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//recebe pelo plano pois não foi avisado previamente
                                                    atend_mergevalordeb : convdebvalSub,//Não paga pois o terapeuita não atende ninguem
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//
                                                    atend_valordeb : convdebval,//
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//mesmo terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//recebe pelo plano pois não foi avisado previamente
                                                    atend_mergevalordeb : convdebvalSub,//Não paga pois o terapeuita não atende ninguem
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//recebe pelo novo bene
                                                    atend_mergevalordeb : convdebvalSub,//paga pelo atendimento do novo bene
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Falta Justificada" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convcreval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Falta Absoluta":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta Absoluta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//recebe pelo novo bene
                                                    atend_mergevalordeb : convdebvalSub,//paga pelo atendimento do novo bene
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Falta Absoluta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Absoluta" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Falta Absoluta" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convcreval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Feriado":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Feriado",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : agendaSub.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Feriado",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                                    atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Feriado" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Feriado" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convcreval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Glosa":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Glosa",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Glosa",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Glosa" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Glosa" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : a.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Pais":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Pais",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Pais",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Pais" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Substituição" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Substituição" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "SubstitutoFixo":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_mergeterapeutaid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_mergeterapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Convenio não paga
                                                    atend_valordeb : convdebval,//Paga ao musico
                                                    atend_mergeterapeutaid : agendaSub.agenda_mergeterapeutaid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_mergeterapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                    atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "SubstitutoFixo" ,
                                                credit_terapiaid : a.agenda_mergeterapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "SubstitutoFixo" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Supervisão":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Supervisão",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Recebe pelo atendimento
                                                    atend_valordeb : convdebval,//Paga ao terapeuta
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Não recebe pela supervisão
                                                    atend_mergevalordeb : convdebvalSub,//Paga a supervsão
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Supervisão",//Para quando o convenio não paga o que deve
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                    atend_terapiaid : a.agenda_terapiaid,//Musica
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//Recebe pelo atendimento
                                                    atend_valordeb : convdebval,//Paga ao terapeuta
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                    atend_mergevalorcre : convcrevalSub,//Não recebe pela supervisão
                                                    atend_mergevalordeb : convdebvalSub,//Paga a supervsão
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Supervisão" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Supervisão" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : agendaSub.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : agendaSub.agenda_usuid,//
                                                    atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : "0,00",//
                                                    atend_valordeb : "0,00",//
                                                    atend_mergeterapeutaid : roberta._id,
                                                    atend_mergeterapiaid : a.agenda_terapiaid,
                                                    atend_mergevalorcre : "0,00",
                                                    atend_mergevalordeb : "0,00",
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : "0,00",
                                                    atend_fixovalordeb : "0,00",
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : agendaSub.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : agendaSub.agenda_usuid,//
                                                    atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : "0,00",//
                                                    atend_valordeb : "0,00",//
                                                    atend_mergeterapeutaid : roberta._id,
                                                    atend_mergeterapiaid : a.agenda_terapiaid,
                                                    atend_mergevalorcre : "0,00",
                                                    atend_mergevalordeb : "0,00",
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if( convcreTes == agendacreTesSub){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjSub = ccre.convcre_convCpfCnpj;
                                                    convcrevalSub = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if(convdebTes == agendadebTesSub){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjSub = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalSub = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : a.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//
                                                    atend_valordeb : convdebval,//
                                                    atend_mergeterapeutaid : agendaSub.agenda_usuid,
                                                    atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                                    atend_mergevalorcre : convcreval,
                                                    atend_mergevalordeb : convdebval,
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcrevalFixo,
                                                    atend_fixovalordeb : convdebvalFixo,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : agendaSub.agenda_beneid,//
                                                    atend_convid : agendaSub.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : agendaSub.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : agendaSub.agenda_usuid,//
                                                    atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : "0,00",//
                                                    atend_valordeb : "0,00",//
                                                    atend_mergeterapeutaid : a.agenda_usuid,
                                                    atend_mergeterapiaid : a.agenda_terapiaid,
                                                    atend_mergevalorcre : convcreval,
                                                    atend_mergevalordeb : convdebval,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Padrão" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Padrão" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        default:
                                            agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                            agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if( convcreTes == agendacreTesFixo){
                                                        //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                        convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                        convcrevalFixo = ccre.convcre_valor;
                                                    }
                                                }
                                            })

                                            agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                            agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                            convdeb.forEach((cdeb)=>{
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                                if (a.agenda_categoria == "SubstitutoFixo"){
                                                    if(convdebTes == agendadebTesFixo){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                        convdebvalFixo = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
                                            
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : agendaSub.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//
                                                    atend_valordeb : convdebval,//
                                                    atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                    atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                    atend_fixovalorcre : convcreval,
                                                    atend_fixovalordeb : convdebval,
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "true",
                                                    atend_categoria : "Padrão",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            } else {
                                                newAtend = new Atend({
                                                    atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                    atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                    atend_beneid : a.agenda_beneid,//
                                                    atend_convid : a.agenda_convid,//
                                                    atend_usuid : idUsu,
                                                    atend_atenddata : agendaSub.agenda_data,//
                                                    atend_atendhora : hora,//
                                                    atend_terapeutaid : a.agenda_usuid,//
                                                    atend_terapiaid : a.agenda_terapiaid,//
                                                    atend_salaid : a.agenda_salaid,//
                                                    atend_valorcre : convcreval,//
                                                    atend_valordeb : convdebval,//
                                                    atend_agenda_f_id_orig : a._id,
                                                    atend_agenda_s_id_orig : agendaSub._id,
                                                    atend_fixo : "false",
                                                    atend_categoria : "Padrão",
                                                    atend_num : nextNum,
                                                    atend_datacad : dataAtual.toISOString()
                                                });
                                            }

                                            newCre = new Cre({
                                                convcre_atendnum : nextNum ,
                                                convcre_categoria : "Padrão" ,
                                                convcre_terapiaid : a.agenda_terapiaid ,
                                                convcre_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                convcre_nome : "Atendimento Auto" ,
                                                convcre_cpfcnpj : convCreCpfCnpj ,
                                                convcre_dataevento : agendaSub.agenda_data,
                                                convcre_datavenci : dataVenci ,
                                                convcre_valorprev : convcreval ,
                                                convcre_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Padrão" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                    }
                                    
                                    if (a.atend_rel != undefined && a.atend_rel != "undefined"){
                                        newAtend.atend_rel = a.atend_rel
                                    }
                                } else {
                                    data = a.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    
                                    if (a.agenda_categoria == "SubstitutoFixo") {
                                        agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                        agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                            if( convcreTes == agendacreTes){
                                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                convcreval = ccre.convcre_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if( convcreTes == agendacreTesFixo){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                    convcrevalFixo = ccre.convcre_valor;
                                                }
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                        agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                        convdeb.forEach((cdeb)=>{
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if(convdebTes == agendadebTesFixo){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalFixo = cdeb.convdeb_valor;
                                                }
                                            }
                                        })
                                        
                                        if (a.agenda_categoria == "SubstitutoFixo"){
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : idUsu,
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : new mongoose.mongo.ObjectId('766f69643132333435366964'),//voidid
                                                atend_mergeterapiaid : new mongoose.mongo.ObjectId('766f69643132333435366964'),//voidid
                                                atend_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                atend_fixovalorcre : convcrevalFixo,
                                                atend_fixovalordeb : convdebvalFixo,
                                                atend_agenda_f_id_orig : a._id,
                                                atend_fixo : "true",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });
                                        } else {
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : idUsu,
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                                atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                                atend_mergevalordeb : convdebvalSub,//Não paga ao outro Terapeuta
                                                atend_agenda_f_id_orig : a._id,
                                                atend_fixo : "false",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });
                                        }

                                        newCre = new Cre({
                                            credit_atendnum : nextNum ,
                                            credit_categoria : "SubstitutoFixo" ,
                                            credit_terapiaid : a.agenda_mergeterapiaid ,
                                            credit_terapeutaid : a.agenda_usuid ,
                                            credit_convid : a.agenda_convid ,
                                            credit_nome : "Atendimento "+nextNum ,
                                            credit_cpfcnpj : convCreCpfCnpj ,
                                            credit_dataevento : a.agenda_data,
                                            credit_datavenci : dataVenci ,
                                            credit_valorprev : convcreval ,
                                            credit_datacad : dataAtual
                                        })

                                        newDeb = new Deb({
                                            debit_atendnum : nextNum ,
                                            debit_categoria : "SubstitutoFixo" ,
                                            debit_terapiaid : a.agenda_terapiaid ,
                                            debit_terapeutaid : a.agenda_usuid ,
                                            debit_convid : a.agenda_convid ,
                                            debit_nome : "Atendimento "+nextNum ,
                                            debit_cpfcnpj : convCreCpfCnpj ,
                                            debit_dataevento : a.agenda_data,
                                            debit_datavenci : dataVenci ,
                                            debit_valorprev : convdebval ,
                                            debit_datacad : dataAtual
                                        })
                                    } else {
                                        agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                            if( convcreTes == agendacreTes){
                                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                convcreval = ccre.convcre_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if( convcreTes == agendacreTesFixo){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpjFixo = ccre.convcre_convCpfCnpj;
                                                    convcrevalFixo = ccre.convcre_valor;
                                                }
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                        agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                        convdeb.forEach((cdeb)=>{
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if(convdebTes == agendadebTesFixo){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpjFixo = cdeb.convdeb_convCpfCnpj;
                                                    convdebvalFixo = cdeb.convdeb_valor;
                                                }
                                            }
                                        })
    
                                        if (a.agenda_categoria == "SubstitutoFixo"){
                                            newAtend = new Atend({
                                                atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : idUsu,
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//
                                                atend_terapiaid : a.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//
                                                atend_valordeb : convdebval,//
                                                atend_fixoterapeutaid : a.agenda_mergeterapeutaid,
                                                atend_fixoterapiaid : a.agenda_mergeterapiaid,
                                                atend_fixovalorcre : convcrevalFixo,
                                                atend_fixovalordeb : convdebvalFixo,
                                                atend_agenda_f_id_orig : a._id,
                                                atend_fixo : "true",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });
                                        } else {
                                            newAtend = new Atend({
                                                atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : idUsu,
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//
                                                atend_terapiaid : a.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//
                                                atend_valordeb : convdebval,//
                                                atend_agenda_f_id_orig : a._id,
                                                atend_fixo : "false",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });
                                        }

                                        newCre = new Cre({
                                            credit_atendnum : nextNum ,
                                            credit_categoria : "Padrão" ,
                                            credit_terapiaid : a.agenda_terapiaid ,
                                            credit_terapeutaid : a.agenda_usuid ,
                                            credit_convid : agendaSub.agenda_convid ,
                                            credit_nome : "Atendimento "+nextNum ,
                                            credit_cpfcnpj : convCreCpfCnpj ,
                                            credit_dataevento : a.agenda_data ,
                                            credit_datavenci : dataVenci ,
                                            credit_valorprev : convcreval ,
                                            credit_datacad : dataAtual
                                        })

                                        newDeb = new Deb({
                                            debit_atendnum : nextNum ,
                                            debit_categoria : "Padrão" ,
                                            debit_terapiaid : a.agenda_terapiaid ,
                                            debit_terapeutaid : a.agenda_usuid ,
                                            debit_convid : agendaSub.agenda_convid ,
                                            debit_nome : "Atendimento "+nextNum ,
                                            debit_cpfcnpj : convCreCpfCnpj ,
                                            debit_dataevento : a.agenda_data ,
                                            debit_datavenci : dataVenci ,
                                            debit_valorprev : convdebval ,
                                            debit_datacad : dataAtual
                                        })
                                    }

                                    if (a.atend_rel != undefined && a.atend_rel != "undefined"){
                                        newAtend.atend_rel = a.atend_rel
                                    }
                                }
                                //console.log("newAtend:"+newAtend)
                                nextNum = nextNum ++;
                                //console.log("newAtend save");
                                this.geraAtend(newAtend);
                                if(newCre != ""){
                                    this.GeraCre(newCre);
                                    newCre == "";
                                }
                                if(newDeb != ""){
                                    this.GeraDeb(newDeb);
                                    newDeb == "";
                                }
                                //console.log("Setar migrado")
                                Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: true }}).then(()=>{
                                    console.log("Feito");
                                });
                                //Agenda.findById(a._id)
                                //console.log("setou migrado")
                            }
                            })
                        })
                    })
                //})
                })
            })
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            console.log("Finish!")
            this.carregaAgendaF(req,res);
        })
    }, 
            */

    /*
    // DANGER!!!!!!!!!! >-=>> REMOVER DUPLICATAS!!!
    const inicio = new Date(2025,3,1,0,0,0,0);
  const fim = new Date(2025,8,1,23,59,59,0);

  console.log(`🔍 Buscando duplicatas entre ${inicio.toISOString()} e ${fim.toISOString()}...`);
let totalRemovidos = 0;
  // 1️⃣ Agrupa pelos campos que definem duplicidade
  Atend.aggregate([
    {
      $match: {
        atend_atenddata: { $gte: inicio, $lte: fim }
      }
    },
    {
      $group: {
        _id: {
          atend_org: "$atend_org",
          atend_categoria: "$atend_categoria",
          atend_beneid: "$atend_beneid",
          atend_convid: "$atend_convid",
          atend_usuid: "$atend_usuid",
          atend_atenddata: "$atend_atenddata",
          atend_atendhora: "$atend_atendhora",
          atend_terapeutaid: "$atend_terapeutaid",
          atend_terapiaid: "$atend_terapiaid",
          atend_salaid: "$atend_salaid"
        },
        count: { $sum: 1 },
        registros: {
          $push: {
            _id: "$_id",
            atend_datacad: "$atend_datacad",
            atend_num: "$atend_num"
          }
        }
      }
    },
    { $match: { count: { $gt: 1 } } }
  ]).then((duplicados )=>{

  console.log(`🔎 Encontrados ${duplicados.length} grupos com duplicatas.`);

  

  // 2️⃣ Para cada grupo duplicado, decidir qual deletar
  for (const grupo of duplicados) {
    const { registros } = grupo;

    // Ordena por:
    // - atend_datacad DESC (mais recente primeiro)
    // - atend_num DESC (maior primeiro)
    registros.sort((a, b) => {
  const dataA = a.atend_datacad ? new Date(a.atend_datacad) : new Date(0);
  const dataB = b.atend_datacad ? new Date(b.atend_datacad) : new Date(0);

  // Primeiro, compara as datas
  if (dataA > dataB) return 1; // mais recente primeiro
  if (dataA < dataB) return -1;

  // Só compara atend_num se as datas forem iguais
  if (a.atend_num > b.atend_num) return 1; // maior num primeiro
  if (a.atend_num < b.atend_num) return -1;

  return 0;
});

    // Mantém o primeiro (mais antigo), remove o resto
    const [manter, ...remover] = registros;
    const idsParaExcluir = remover.map(r => r._id);

    if (idsParaExcluir.length > 0) {
      Atend.deleteMany({ _id: { $in: idsParaExcluir } }).then((resultado)=>{
totalRemovidos += resultado.deletedCount;
      console.log(`🗑️ Grupo removido: ${resultado.deletedCount} duplicata(s). Mantido _id=${manter._id}`);
      })
      
    }
    
  }
  }).catch((err)=>{
    console.log(err);
  })

  console.log(`✅ Remoção concluída! Total de registros excluídos: ${totalRemovidos}`);
    */
   /*
   converteAgendaEmAtendOld(req,res){//Converte a Agenda em Atendimento
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        //console.log("dia:"+req.body.dataFil)
        let idUsu = req.cookies['idUsu'];
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convcreval;
        let convdebval;
        let convcrevalSub;
        let convdebvalSub;
        let convcrevalFixo;
        let convdebvalFixo;
        let convCreCpfCnpj;
        let convDebCpfCnpj;
        let convcreTes;
        let convdebTes;
        let nextNum;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let agendacreTesSub;
        let agendadebTesSub;
        let agendacreTesFixo;
        let agendadebTesFixo;
        let hora;
        let data;
        let hor;
        let min;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        //console.log("START CONVERT");
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
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        console.log("dataIni: "+dataIni);
        console.log("dataFim: "+dataFim);
        
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
                Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } } ]}).then((agendaFixa)=>{
                    Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: true, $or: [{ agenda_extra: false }, { agenda_extra: { $exists: false } } ]}).then((agendaSemanal)=>{
                    //-------------------------
                    console.log("agendaSemanal.length: "+agendaSemanal.length);
                    Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                        //console.log("validação caso seja o primeiro registro")
                        atendimento.forEach(e => {atend = e});
                        nextNum = atend.atend_num;
                        agendaFixa.forEach((a)=>{
                            agendaSub = '';
                            convcreval = "0,00";
                            convdebval = "0,00";
                            convcrevalSub = "0,00";
                            convdebvalSub = "0,00";
                            convcrevalFixo = "0,00";
                            convdebvalFixo = "0,00";
                            //if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            //}
                            //console.log("a.agenda_categoria:"+a.agenda_categoria);

                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                agendaSemanal.forEach((s)=>{
                                    if (""+a._id === ""+s.agenda_tempId){
                                        agendaSub = s;
                                    }
                                })

                                if (agendaSub != ''){
                                    data = agendaSub.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;

                                    agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                    agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                    agendacreTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                        if( convcreTes == agendacreTes){
                                            convcreval = ccre.convcre_valor;
                                        }
                                        if( convcreTes == agendacreTesSub){
                                            convcrevalSub = ccre.convcre_valor;
                                        }
                                        if (a.agenda_categoria == "SubstitutoFixo"){
                                            if( convcreTes == agendacreTesFixo){
                                                convcrevalFixo = ccre.convcre_valor;
                                            }
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                    agendadebTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";//Semanal
                                    agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                    convdeb.forEach((cdeb)=>{
                                        convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                        if(convdebTes == agendadebTes){
                                            convdebval = cdeb.convdeb_valor;
                                        }
                                        if(convdebTes == agendadebTesSub){
                                            convdebvalSub = cdeb.convdeb_valor;
                                        }
                                        if (a.agenda_categoria == "SubstitutoFixo"){
                                            if(convdebTes == agendadebTesFixo){
                                                convdebvalFixo = cdeb.convdeb_valor;
                                            }
                                        }
                                    })

                                    newAtend = new Atend({
                                        atend_org : "Administrativo",//depende do lançamento na agenda semanal
                                        atend_categoria : agendaSub.agenda_categoria,//depende do lançamento na agenda semanal
                                        atend_beneid : a.agenda_beneid,//
                                        atend_convid : a.agenda_convid,//
                                        atend_usuid : idUsu,//
                                        atend_atenddata : a.agenda_data,//
                                        atend_atendhora : hora,//
                                        atend_terapeutaid : a.agenda_usuid,//Atenderá o outro bene pelo merge
                                        atend_terapiaid : a.agenda_terapiaid,//
                                        atend_salaid : a.agenda_salaid,//
                                        atend_valorcre : convcreval,//não recebe pois foi avisado previamente
                                        atend_valordeb : convdebval,//não paga porque não atendeu ao bene em questão
                                        atend_mergeterapeutaid : agendaSub.agenda_usuid,//Atendendo outro bene
                                        atend_mergeterapiaid : agendaSub.agenda_terapiaid,
                                        atend_mergevalorcre : convcrevalSub,//Recebe pela terapia ABA
                                        atend_mergevalordeb : convdebvalSub,//
                                        atend_agenda_f_id_orig : a._id,//
                                        atend_agenda_s_id_orig : agendaSub._id,//
                                        atend_fixo : "false",//
                                        atend_num : nextNum,//
                                        atend_datacad : dataAtual.toISOString()//
                                    });

                                    if (a.agenda_categoria == "SubstitutoFixo"){
                                        newAtend.atend_fixoterapeutaid = a.agenda_mergeterapeutaid;
                                        newAtend.atend_fixoterapiaid = a.agenda_mergeterapiaid;
                                        newAtend.atend_fixovalorcre = convcrevalFixo;
                                        newAtend.atend_fixovalordeb = convdebvalFixo;
                                        newAtend.atend_fixo = "true";
                                        newAtend.atend_num = nextNum;
                                    }
                                } else {
                                    data = a.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    
                                    if (a.agenda_categoria == "SubstitutoFixo") {
                                        agendacreTes = ""+agendaSub.agenda_convid + a.agenda_terapiaid+""
                                        agendacreTesSub = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                            if( convcreTes == agendacreTes){
                                                convcreval = ccre.convcre_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if( convcreTes == agendacreTesFixo){
                                                    convcrevalFixo = ccre.convcre_valor;
                                                }
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";//padrão
                                        agendadebTesFixo = ""+a.agenda_convid + a.agenda_mergeterapiaid+"";//SubFixa
                                        convdeb.forEach((cdeb)=>{
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                            if (a.agenda_categoria == "SubstitutoFixo"){
                                                if(convdebTes == agendadebTesFixo){
                                                    convdebvalFixo = cdeb.convdeb_valor;
                                                }
                                            }
                                        })

                                        newAtend = new Atend({
                                            atend_org : a.agenda_org,//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                            atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                            atend_beneid : a.agenda_beneid,//
                                            atend_convid : a.agenda_convid,//
                                            atend_usuid : idUsu,
                                            atend_atenddata : a.agenda_data,//
                                            atend_atendhora : hora,//
                                            atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                            atend_terapiaid : a.agenda_terapiaid,//Musica
                                            atend_salaid : a.agenda_salaid,//
                                            atend_valorcre : convcreval,//Convenio não paga
                                            atend_valordeb : convdebval,//Paga ao musico
                                            atend_mergeterapeutaid : new mongoose.mongo.ObjectId('766f69643132333435366964'),//voidid
                                            atend_mergeterapiaid : new mongoose.mongo.ObjectId('766f69643132333435366964'),//voidid
                                            atend_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                            atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                            atend_agenda_f_id_orig : a._id,
                                            atend_fixo : "false",
                                            atend_num : nextNum,
                                            atend_datacad : dataAtual.toISOString()
                                        });
                                        
                                        if (a.agenda_categoria == "SubstitutoFixo"){
                                            newAtend.atend_categoria = "SubstitutoFixo";
                                            newAtend.atend_fixoterapeutaid = a.agenda_mergeterapeutaid;
                                            newAtend.atend_fixoterapiaid = a.agenda_mergeterapiaid;
                                            newAtend.atend_fixovalorcre = convcrevalFixo;
                                            newAtend.atend_fixovalordeb = convdebvalFixo;
                                            newAtend.atend_fixo = "true";
                                        }
                                    }
                                }
                                //console.log("newAtend:"+newAtend)
                                nextNum = nextNum ++;
                                //console.log("newAtend save");
                                this.geraAtend(newAtend);
                                if(newCre != ""){
                                    this.GeraCre(newCre);
                                    newCre == "";
                                }
                                if(newDeb != ""){
                                    this.GeraDeb(newDeb);
                                    newDeb == "";
                                }
                                //console.log("Setar migrado")
                                Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: true }}).then(()=>{
                                    console.log("Feito");
                                });
                                //Agenda.findById(a._id)
                                //console.log("setou migrado")
                            }
                            })
                        })
                    })
                })
            })
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            console.log("Finish!")
            this.carregaAgendaF(req,res);
        })
    }, 

    //caso de convid indefinido ou nulo

    async atualizarAgendaConvid(req,res) {
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    console.log("CATAPIMBAS")
    const db = req.cookies['preferredDb'];
  const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);

  // período
  var dataInicio = new Date(2026,1,1,0,0,0,0);
  var dataFim = new Date(2026,5,1,0,0,0,0);

  // 1. Buscar agendamentos sem convid
  var agendamentos = await Agenda.find({
    $or: [
      { agenda_convid: { $exists: false } },
      { agenda_convid: null }
    ],
    agenda_data: {
      $gte: dataInicio,
      $lte: dataFim
    }
  }).lean();

  if (!agendamentos.length) return;

  // 2. Coletar IDs válidos
  const beneIds = [
    ...new Set(
      agendamentos
        .map(a => a.agenda_beneid)
        .filter(id => ObjectId.isValid(id))
        .map(id => id.toString())
    )
  ];

  if (!beneIds.length) return;

  // 3. Buscar benes
  const benes = await Bene.find({
    _id: { $in: beneIds }
  })
    .select("_id bene_convid")
    .lean();

  // 4. Mapear bene_convid
  const beneMap = {};
  for (const b of benes) {
    if (b.bene_convid && ObjectId.isValid(b.bene_convid)) {
      beneMap[b._id.toString()] = b.bene_convid;
    }
  }

  // 5. Preparar updates
  const bulkOps = [];

  for (const ag of agendamentos) {
    const beneId = ag.agenda_beneid?.toString();

    if (!beneId) continue;

    const beneConvid = beneMap[beneId];

    if (!beneConvid) continue;

    bulkOps.push({
      updateOne: {
        filter: { _id: ag._id },
        update: {
          $set: {
            agenda_convid: new ObjectId(beneConvid)
          }
        }
      }
    });
  }

  // 6. Executar em lote
  if (bulkOps.length > 0) {
    await Agenda.bulkWrite(bulkOps);
  }
},
   */