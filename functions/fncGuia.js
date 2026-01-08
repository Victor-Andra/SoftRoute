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
    filtraGuialis(req, res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
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
                Agenda.find(busca).then((agendaSubs)=>{

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
                    if (!(s.agenda_categoria == "Falta Justificada")){
                        if (!(s.agenda_categoria == "Feriado")){
                            if ((""+s.agenda_usuid+"") == (""+idTerapeuta+"")){
                                agendaFinal.push(s);
                            }
                        }
                    }
                });

                agendaSubs.forEach((s)=>{
                    if (!(s.agenda_categoria == "Falta Justificada")){
                        if (!(s.agenda_categoria == "Feriado")){
                            agendaFinal.push(s);
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
                    console.log("Listagem Guias Realizada!")
                     Ano.find().then((ano)=>{
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("guia/guiaLis", {agendas: agendaFinal, anos: ano, terapias: terapia,usuarios: usuario, benes: bene, flash, filtros})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    listaGuia(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
    
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
            console.log("tamanho"+usuario.length)
             Ano.find().then((ano)=>{
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
                res.render('guia/guiaLis', { terapeutas: usuario, anos: ano, benes: bene, flash });
            })})}).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    }
}