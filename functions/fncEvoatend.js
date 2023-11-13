//Exports
const mongoose = require("mongoose")

//Houve alteração na Estrutura e Banco da evolução de atendimentos, eles agora são vinculados à Agenda e Não ao Atendimento.
//Classes Extrangeiras
const evoatendClass = require("../models/agenda")


//As classe tem que ser declaradas antes das tabelas
//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convecreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const creditClass = require("../models/credit")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")
const horaageClass = require("../models/horaAge")
const agendaClass = require("../models/agenda")



//Tabelas Extrangeiras
const Agenda = mongoose.model("tb_agenda")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Credit = mongoose.model("tb_credit")
const Debit = mongoose.model("tb_debit")
const Tabil = mongoose.model("tb_tabil")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Sala = mongoose.model("tb_sala")
const Horaage = mongoose.model("tb_horaage")

//Funções auxiliares

const fncCredit = require("../functions/fncCredit")
const fncDebit = require("../functions/fncDebit")
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")

//Funções Extrangeiras
const fncGeral = require("./fncGeral")

//Funções auxiliares
const ObjectId = require('mongodb').ObjectId;
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaEvoatend(req, res){
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let carregaFiltro = "false";
        let idsAgendasEx = [];
        let aux = 1;
        let agendaTemp =  [];
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg);
        console.log("sex:"+sex);
        //let agora = seg.toISOString();
        //let depois = sex.toISOString();
        //console.log("Listagem Realizada de Atendimentos!")
        Evoatend.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idTerapeuta }).then((evoatend)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Terapia")
                        let agendamentos = evoatend;
                        console.log(agendamentos.length);
                        agendamentos.forEach((e)=>{
                            e.agenda_data_dia = fncGeral.getData(e.agenda_data);
                            console.log("HORA: "+e.agenda_hora);

                            if (e.agenda_temp){
                                agendaTemp.push(e.agenda_tempId);
                            }
                            
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
                            if(e.agenda_temp){
                                idsAgendasEx.push(e.agenda_tempId.toString());
                            }
                        })
                        if (idsAgendasEx > 0){
                            idsAgendasEx.forEach((i)=>{
                                agenda = agenda.filter(a => a.id != i);
                                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                            })
                        }
                        res.render("area/evol/evoatendlis", { evoatends: evoatend, benes: bene, terapeutas: terapeuta, terapias: terapia, carregaFiltro})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend(req, res){
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let idBeneficiario = new ObjectId(req.body.atendBeneficiario);
        let carregaFiltro = "false";
        let idsAgendasEx = [];
        let aux = 1;
        let agendaTemp =  [];
        let seg = fncGeral.getDateFromString(req.body.dataFinal);
        let sex = fncGeral.getDateFromString(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg);
        console.log("sex:"+sex);
        //let agora = seg.toISOString();
        //let depois = sex.toISOString();
        //console.log("Listagem Realizada de Atendimentos!")
        Evoatend.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idTerapeuta, agenda_beneid : idBeneficiario }).then((evoatend)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Terapia")
                        let agendamentos = evoatend;
                        console.log(agendamentos.length);
                        agendamentos.forEach((e)=>{
                            e.agenda_data_dia = fncGeral.getData(e.agenda_data);
                            console.log("HORA: "+e.agenda_hora);

                            if (e.agenda_temp){
                                agendaTemp.push(e.agenda_tempId);
                            }
                            
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
                            if(e.agenda_temp){
                                idsAgendasEx.push(e.agenda_tempId.toString());
                            }
                        })
                        if (idsAgendasEx > 0){
                            idsAgendasEx.forEach((i)=>{
                                agenda = agenda.filter(a => a.id != i);
                                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                            })
                        }
                        res.render("area/evol/evoatendlis", { evoatends: evoatend, benes: bene, terapeutas: terapeuta, terapias: terapia, carregaFiltro})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaEvoatend(req,res){
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/evoatendCad", {terapias: terapia, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },

    carregaEvoatendEdi(req,res){
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
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
    listaEvoatendaberto(req, res, resposta){ //Lista evoluções Agendadas em aberto ou seja evolução não realizada
        let flash = new Resposta();
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
            res.render('area/evol/evoatendabertolis', { usuarios: usuario, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatendaberto(req, res, resposta){ //Lista evoluções Agendadas em aberto ou seja evolução não realizada
        let flash = new Resposta();
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
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
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
        console.log("PORRA!")
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.tratTerapeuta, agenda_selo: false }).then((agenda) =>{
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
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        Sala.find().then((sala)=>{
                            sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                            Terapia.find().then((terapia)=>{
                                Conv.find().then((conv)=>{
                                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    res.render('area/evol/evoatendabertolis', {agendas: agenda, benes: bene, usuarios: usuario, salas: sala, terapias: terapia, convs: conv, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendfechado(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        let flash = new Resposta();
        //console.log('listando Extraeses')
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{
            res.render('area/evol/evoatendfechadolis', {usuarios: usuario, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatendfechado(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        let flash = new Resposta();
        //console.log('listando Extraeses')
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("PORRA!")
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
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: fncGeral.getDiaSemana(seg)};
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
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.tratTerapeuta, agenda_selo: true}).then((agenda) =>{
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
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{
                    res.render('area/evol/evoatendfechadolis', {usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    }
}