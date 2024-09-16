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
    listaEvoatend(req, res){
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
                console.log("Listagem Realizada de terapias")
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("area/evol/evoatendLis", {agendas: idsAgendasEx, terapias: terapia,usuarios: usuario, benes: bene, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend(req, res){
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
                console.log("req.body.idTerapeuta:"+idTerapeuta)
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta, agenda_beneid: req.body.atendBeneficiario };
                break;
            default:
                busca = { agenda_data: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, agenda_usuid: idTerapeuta }
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
                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => (""+a.id+"") != (""+i+""));
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            agenda.sort((a,b) => (a.agenda_benenome > b.agenda_benenome) ? 1 : ((b.agenda_benenome > a.agenda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    bene.forEach((b)=>{b.bene_nome = b.bene_nome.replace(".","")});
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                            res.render("area/evol/evoatendLis", {agendas: agenda, terapias: terapia,usuarios: usuario, benes: bene, flash, filtros})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaEvoatend(req,res){
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
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
    listaEvoatendaberto(req, res, resposta) {
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
                                    res.render('area/evol/evoatendabertoLis', {agendas: agenda, benes: bene, terapeutas: usuario, salas: sala, terapias: terapia, convs: conv, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendfechado(req, res, resposta) {
        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
    
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
                res.render('area/evol/evoatendfechadoLis', { terapeutas: usuario, benes: bene, flash });
            }).catch((err) => {
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
        filtroTela = new FiltroEvoatend();
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
                                    res.render('area/evol/evoatendfechadoLis', {agendas: agenda,terapeutas: usuario, benes: bene, salas: sala, terapias: terapia, convs: conv, horaages: horaage, filtroTela, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendgeral(req, res, resposta) {
        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
    
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
            console.log("tamanho"+usuario.length)
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
                res.render('area/evol/evoatendgeralLis', { terapeutas: usuario, benes: bene, flash });
            })}).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    filtraEvoatendgeral(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
        filtroTela = new FiltroEvoatend();
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
                                    res.render('area/evol/evoatendgeralLis', {agendas: agenda,terapeutas: usuario, benes: bene, salas: sala, terapias: terapia, convs: conv, horaages: horaage, filtroTela, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaEvoatendranking(req, res, resposta) {
        let flash = new Resposta();
    
        if (resposta && (resposta.sucesso === "true" || resposta.sucesso === "false")) {
            flash.texto = resposta.texto;
            flash.sucesso = resposta.sucesso;
        }
    
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario) => {
            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o bene por nome
    
                res.render('area/evol/evoatendrankingLis', { terapeutas: usuario, benes: bene, flash });
            }).catch((err) => {
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
    xfiltraEvoatendranking(req, res, resposta){ //Lista evoluções Agendadas Fechada ou seja evolução realizada!
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
    filtraEvoatendranking(req, res) {
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
        agendaClass.removeEvolucao((req.body.idDeletar),res).then((retorno)=>{
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
        agendaClass.removeEvolucao((req.body.idDeletar),res).then((retorno)=>{
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
    }
}