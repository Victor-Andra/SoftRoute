//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//Agenda
const agendaClass = require("../models/agenda")
var Agenda = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia") 
const horaageClass = require("../models/horaAge")
const salaClass = require("../models/sala")
const especialidadeClass = require("../models/especialidade")
const especializacaoClass = require("../models/especializacao")

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Horaage = getModel("SoftRoute", 'tb_horaage', horaageClass.HoraageSchema)
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)
var Especialidade = getModel("SoftRoute", 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
var Especializacao = getModel("SoftRoute", 'tb_especializacao', especializacaoClass.EspecializacaoSchema)

//Funções Auxiliares
const Resposta = require("./fncGeral").Resposta;

module.exports = {
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("usu.usuario_obs:"+usu.usuario_obs)
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
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
                                    console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            console.log("Listagem Realizada de Especializacao")
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
                                            console.log("benenomeconv:"+usunomefnc)
                                            res.render("agenda/area/magenda/agendaTecDia", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaTecSem(req,res){
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("usu.usuario_obs:"+usu.usuario_obs)
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
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
                                    console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            console.log("Listagem Realizada de Especializacao")
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
                                            console.log("benenomeconv:"+usunomefnc)
                                            res.render("agenda/area/magenda/agendaTecSem", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    }
}
/*
let atualizar = agendaClass.agendaAddNovosCampos(req,res);
atualizar.then((res) =>{
    console.log(res)
    resultado = true;
}).catch((err) =>{
    console.log(err)
    resultado = false;
}).finally(() =>{
    console.log("resultado")
    console.log(resultado);
})

let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{
    a.forEach(a=>{Atend.deleteOne({_id: a._id}).then(()=>{console.log("DELETED!");})})
})
*/