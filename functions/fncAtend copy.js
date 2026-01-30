//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
var Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)
//const atendArquivoClass = require("../models/atendArquivo")//Manter para uso futuro
//const AtendArquivo = getModel("SoftRoute", 'tb_atendarquivo', atendArquivoClass.AtendArquivoSchema)//Manter para uso futuro

//Classes Extrangeiras
const agendaClass = require("../models/agenda")
const anoClass = require("../models/ano")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convcreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const convimpClass = require("../models/convImp")//Modelo dos Impostos por convênio
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const creditClass = require("../models/credit")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")

const perfilClass = require("../models/perfil")
const funcaoClass = require("../models/funcao")


//Tabelas Extrangeiras
var Agenda = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)
var Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Convcre = getModel("SoftRoute", 'tb_convcre', convcreClass.ConvcreSchema)
var Convdeb = getModel("SoftRoute", 'tb_convdeb', convdebClass.ConvdebSchema)
var Convimp = getModel("SoftRoute", 'tb_convimp', convimpClass.ConvimpSchema)//Tabela dos Impostos vinvulados ao convênio, a quantidade de impostos e alíquotas variam para cada convênio.
var Credit = getModel("SoftRoute", 'tb_credit', creditClass.CreditSchema)
var Debit = getModel("SoftRoute", 'tb_debit', debitClass.DebitSchema)
var Tabil = getModel("SoftRoute", 'tb_tabil', tabilClass.TabilSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)

var Perfil = getModel("PortalDoUsuario", 'tb_perfil', perfilClass.PerfilSchema)
var Funcao = getModel("PortalDoUsuario", 'tb_funcao', funcaoClass.FuncaoSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")
const ObjectId = require('mongodb').ObjectId;

class Pesquisa{
    constructor(
        dataIni,
        dataFim,
        terapeuta
        ){
        this.dataIni = dataIni,
        this.dataFim = dataFim,
        this.terapeuta = terapeuta
    }
}

class RelAtend{
    constructor(
        nomecid,
        sessoes,
        convid,
        valor,
        total
        ){
        this.nomecid = nomecid,
        this.sessoes = sessoes,
        this.convid = convid,
        this.valor = valor,
        this.total = total
    }
}

class RelAtendBene{
    constructor(
        dt,
        dataDia,
        especialidade,
        profissional,
        beneficiario,
        sala,
        hora,
        horaIni,
        horaFim
        ){
        this.dt = dt,
        this.dataDia = dataDia,
        this.especialidade = especialidade,
        this.profissional = profissional,
        this.beneficiario = beneficiario,
        this.sala = sala,
        this.hora = hora,
        this.horaIni = horaIni,
        this.horaFim = horaFim
    }
}

class RelAtendTerapeuta{
    constructor(
        dt,
        especialidade,
        profissional,
        quantidade
        ){
        this.dt = dt,
        this.especialidade = especialidade,
        this.profissional = profissional,
        this.quantidade = quantidade
    }
}

class AtendCopia{
    constructor(
        nextNum,
        quantidade,
        dataAtend
        ){
        this.nextNum = nextNum,
        this.quantidade = quantidade,
        this.dataAtend = dataAtend
    }
}

module.exports = {
    carregaAtend(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let atend;
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            //console.log(atend.atend_num)
            atend.atend_num = atend.atend_num+1;
            //console.log(atend.atend_num)
            //console.log("Listagem Realizada de NextNum")
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        //console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                        res.render("atendimento/atendCad", {atend, benes: bene, anos: ano, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala
                                        })
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    cadastraAtend(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = creditClass.creditAdicionar(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionar(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{//console.log(res)
            console.log("retorno = true")
            retorno = true;
        }).catch((err) => {console.log(err)
            console.log("retorno = err")
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{//console.log(res)
                console.log("retornoCre = true")
                retornoCre = true;
            }).catch((err) => {console.log(err)
                console.log("retornoCre = err")
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{//console.log(res)
                    console.log("retornoDeb = true")
                    retornoDeb = true;
                }).catch((err) => {console.log(err)
                    console.log("retornoDeb = err")
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{//console.log(res)
                        console.log("retornoTab = true")
                        retornoTab = true;
                    }).catch((err) => {console.log(err)
                        console.log("retornoTab = err")
                        retornoTab = err;
                    }).finally(() => {
                        //console.log(retorno)
                        //console.log(retornoCre)
                        //console.log(retornoDeb)
                        //console.log(retornoTab)
                    })
                })
            })
        })
        if (retorno && retornoCre && retornoDeb && retornoTab){
            fncAtendAdm.carregaAtendAdm(req,res);//atendcad
        } else {
            res.render('admin/branco');
        }
    },
    cadastraAtendExtra(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = creditClass.creditAdicionar(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionar(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{//console.log(res)
            console.log("retorno = true")
            retorno = true;
        }).catch((err) => {console.log(err)
            console.log("retorno = err")
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{//console.log(res)
                console.log("retornoCre = true")
                retornoCre = true;
            }).catch((err) => {console.log(err)
                console.log("retornoCre = err")
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{//console.log(res)
                    console.log("retornoDeb = true")
                    retornoDeb = true;
                }).catch((err) => {console.log(err)
                    console.log("retornoDeb = err")
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{//console.log(res)
                        console.log("retornoTab = true")
                        retornoTab = true;
                    }).catch((err) => {console.log(err)
                        console.log("retornoTab = err")
                        retornoTab = err;
                    }).finally(() => {
                        //console.log(retorno)
                        //console.log(retornoCre)
                        //console.log(retornoDeb)
                        //console.log(retornoTab)
                    })
                })
            })
        })
        if (retorno && retornoCre && retornoDeb && retornoTab){
            fncAtendAdm.carregaAtendAdm(req,res);//atendcad
        } else {
            res.render('admin/branco');
        }
    },
    deletaAtend(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Credit = getModel(db, 'tb_credit', creditClass.CreditSchema)
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)
        Tabil = getModel(db, 'tb_tabil', tabilClass.TabilSchema)

        Atend.findOne({_id: req.params.id}).then((a)=>{
            Credit.find({credit_atendnum: a.atend_num}).then((cre)=>{
                cre.forEach((c)=>{
                    Credit.deleteOne({_id: c._id}).catch((err) =>{
                        console.log(err)
                        res.render('admin/erro')
                    })
                })
                Debit.find({debit_atendnum: a.atend_num}).then((deb)=>{
                    deb.forEach((d)=>{
                        Debit.deleteOne({_id: d._id}).catch((err) =>{
                            console.log(err)
                            res.render('admin/erro')
                        })
                    })
                    Tabil.find({tabil_atendnum: a.atend_num}).then((tab)=>{
                        tab.forEach((t)=>{
                            Tabil.deleteOne({_id: t._id}).catch((err) =>{
                                console.log(err)
                                res.render('admin/erro')
                            })
                        })
                        Atend.deleteOne({_id: req.params.id}).then((a) =>{
                            this.listaAtend(req,res)
                        }).catch((err) =>{
                            console.log(err)
                            res.render('admin/erro')
                        })
                    })
                })
            })
        })
    },
    deletaVariosAtends(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Credit = getModel(db, 'tb_credit', creditClass.CreditSchema)
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)
        Tabil = getModel(db, 'tb_tabil', tabilClass.TabilSchema)

        let arrayIdString = req.body.idsDeletar;
        let arrayId = arrayIdString.split(",");
        let tamanho = arrayId.length;
        let aux = 1;
        arrayId.forEach((id)=>{
            console.log("id:"+id);
            console.log("aux:"+aux);
            Atend.findOne({_id: id}).then((a)=>{
                Credit.find({credit_atendnum: a.atend_num}).then((cre)=>{
                    if (cre.length > 0){
                        cre.forEach((c)=>{
                            Credit.deleteOne({_id: c._id}).catch((err) =>{
                                console.log(err)
                                res.render('admin/erro')
                            })
                        })
                    }
                    Debit.find({debit_atendnum: a.atend_num}).then((deb)=>{
                        if (deb.length > 0){
                            deb.forEach((d)=>{
                                Debit.deleteOne({_id: d._id}).catch((err) =>{
                                    console.log(err)
                                    res.render('admin/erro')
                                })
                            })
                        }
                        Tabil.find({tabil_atendnum: a.atend_num}).then((tab)=>{
                            if (tab.length > 0){
                                tab.forEach((t)=>{
                                    Tabil.deleteOne({_id: t._id}).catch((err) =>{
                                        console.log(err)
                                        res.render('admin/erro')
                                    })
                                })
                            }
                            Atend.deleteOne({_id: id}).then((a) =>{
                                console.log("DELETED")
                            }).catch((err) =>{
                                console.log(err)
                                res.render('admin/erro')
                            })
                        })
                    })
                })
            })
        })
        console.log("TERMINOU? tamanho:"+tamanho);
        this.listaAtend(req,res)
    },
    atualizaAtend(req, res){
        let resposta;
        try{
            atendClass.atendEditar(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log(res)
                resposta = res;
            }).catch((err) =>{
                //console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a atend de listagem
                    //console.log("Listagem Realizada!")
                    this.listaAtend(req,res);
                }else{
                    //passar classe de erro
                    //console.log("error")
                    //console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    carregaAtendEdi(req, res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                Sala.find().then((sala)=>{
                    Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                            Atend.findById(req.params.id).then((atend) =>{
                                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                    res.render('atendimento/atendEdi', { atend, benes: bene, anos: ano, convs: conv, usuarios: usuario, terapias: terapia, salas: sala})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    listaAtend(req, res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let carregaFiltro = "false";
        let fulldate;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let atend = [];
        let qtdAtends = 0;
        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
           Usuario.find().then((usuario)=>{//achar quem alterou o atendimento dentro da lista 19/05/2025
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Convenios")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                            //console.log("Listagem Realizada de Terapia")
                            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, anos: ano, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends, usuarios: usuario, carregaFiltro})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAtendOLD(req, res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        if (req.body.atualizaValores == "true"){
            //console.log("START!")
            fncAgenda.atualizaValores(req,res);
        }
        let fulldate;
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
        let carregaFiltro = "true";
        let atendTerapeuta = req.body.atendTerapeuta;
        let atendBeneficiario = req.body.atendBeneficiario;
        let atendConv = req.body.atendConv; // ← adicione logo após os outros 'let'
        let dataFinal = req.body.dataFinal;
        let mesAtend = req.body.mesAtend;
        let anoAtend = req.body.anoAtend;

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
            case "Convenio": // ← novo caso — note o acento no valor, pois vem da view como "Convenio" Wagner cintra 25/11/2025
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, atend_convid: req.body.atendConv };
                console.log("req.body.atendConv:"+req.body.atendConv);
                break;
            default:
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }

        Atend.find(busca).then((atend) =>{
            atend.forEach((b)=>{
                let data;
                if(b.atend_atenddata){
                    data = new Date(b.atend_atenddata);
                } else {
                    data = new Date();
                }
                
                let mes = (data.getMonth()+1).toString();
                let dia = (data.getUTCDate()).toString();

                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }

                let hora = (data.getHours()).toString();
                let minuto = (data.getMinutes()).toString();

                if (hora.length == 1){
                    hora = "0"+hora;
                }
                if (minuto.length == 1){
                    minuto = "0"+minuto;
                }

                fulldate=(data.getFullYear()+"-"+mes+"-"+dia).toString();
                b.data=fulldate;
                b.hora = hora + ":" + minuto;
                if(b.atend_org == "Administrativo"){
                    b.atend_org = "ADM";
                }
            })
            var tamanho = atend.length;
            var qtdAtends = {qtd: tamanho}
            //console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                    res.render("atendimento/atendLis", {
                                        atends: atend, benes: bene, anos: ano, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends,
                                        carregaFiltro, tipoData, tipoPessoa, dataIni, dataFim, dataFinal, mesAtend, anoAtend,
                                        atendTerapeuta, atendBeneficiario, atendConv  // ← adicionado
                                    });
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
     filtraAtend(req, res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        if (req.body.atualizaValores == "true"){
            //console.log("START!")
            fncAgenda.atualizaValores(req,res);
        }
        let fulldate;
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
        let carregaFiltro = "true";
        let atendTerapeuta = req.body.atendTerapeuta;
        let atendBeneficiario = req.body.atendBeneficiario;
        let atendConv = req.body.atendConv; // ← adicione logo após os outros 'let'
        let dataFinal = req.body.dataFinal;
        let mesAtend = req.body.mesAtend;
        let anoAtend = req.body.anoAtend;

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
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } ,  $or: [{ atend_terapeutaid: req.body.atendTerapeuta },{ atend_mergeterapeutaid: req.body.atendTerapeuta }] };
                //console.log("req.body.atendTerapeuta:"+req.body.atendTerapeuta);
                break;
            case "Convenio": // ← novo caso — note o acento no valor, pois vem da view como "Convenio" Wagner cintra 25/11/2025
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) }, atend_convid: req.body.atendConv };
                //console.log("req.body.atendConv:"+req.body.atendConv);
                break;
            default:
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }

        Atend.find(busca).then((atend) =>{
            atend.forEach((b)=>{
                let data;
                if(b.atend_atenddata){
                    data = new Date(b.atend_atenddata);
                } else {
                    data = new Date();
                }
                
                let mes = (data.getMonth()+1).toString();
                let dia = (data.getUTCDate()).toString();

                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }

                let hora = (data.getHours()).toString();
                let minuto = (data.getMinutes()).toString();

                if (hora.length == 1){
                    hora = "0"+hora;
                }
                if (minuto.length == 1){
                    minuto = "0"+minuto;
                }

                fulldate=(data.getFullYear()+"-"+mes+"-"+dia).toString();
                b.data=fulldate;
                b.hora = hora + ":" + minuto;
                if(b.atend_org == "Administrativo"){
                    b.atend_org = "ADM";
                }
            })
            var tamanho = atend.length;
            var qtdAtends = {qtd: tamanho}
            //console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                  // Após Ano.find(), faça uma busca adicional por TODOS os usuários (só para tooltip)
                                    Ano.find().sort({ ano_nome: 1 }).then((ano) => {
                                        // Busca todos os usuários (independente de função)
                                        Usuario.find().then((usuarios) => {
                                            res.render("atendimento/atendLis", {
                                                atends: atend,
                                                benes: bene,
                                                anos: ano,
                                                convs: conv,
                                                terapeutas: terapeuta,   // ← mantém a lista de terapeutas como antes
                                                terapias: terapia,
                                                qtdAtends,
                                                usuarios: usuarios,      // ✅ novo: todos os usuários
                                                carregaFiltro,
                                                tipoData,
                                                tipoPessoa,
                                                dataIni,
                                                dataFim,
                                                dataFinal,
                                                mesAtend,
                                                anoAtend,
                                                atendTerapeuta,
                                                atendBeneficiario,
                                                atendConv
                                            });
                                        });
                                    })})})})})}).catch((err) => {
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    carregaAtendIndBene(req, res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let dataAtual = new Date();
        let data = {atual: dataAtual}
        let atend;
        Bene.findById(req.params.id).then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
            Atend.find({atend_beneid:req.params.id}).sort({atend_num : -1}).then((atendimento) =>{
                //validação caso seja o primeiro registro
                atendimento.forEach(e => {atend = e});
                //console.log(atend.atend_num)
                atend.atend_num = atend.atend_num+1;
                //console.log(atend.atend_num)
                //console.log("Listagem Realizada de NextNum")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        //console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena em Ordem Alfabética 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                    //console.log("Listagem Realizada de Convenios")
                                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                                        res.render("atendimento/relatendInd", {atendimentos: atendimento, bene, anos: ano, convs: conv, terapeutas: terapeuta, terapias: terapia, convcres: convcre, convdebs: convdeb, data})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    relAtendimentoVal(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Conv.findOne().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Conv.find().then((conv)=>{
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/relatendval", {terapias: terapia, convs: conv, anos: ano})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let conv_nome;
        // === 🔒 Proteção contra undefined/null/vazio ===
        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        // Fallback: hoje no formato esperado pela função antiga: "YYYY-MM-DD 00:00:00.000Z"
        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z'; // "2025-11-20 00:00:00.000Z"

        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        // Agora é seguro chamar getDateFromString
        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");

            // Validação extra: se getDateFromString retornar undefined/Invalid Date
            if (!seg || isNaN(seg.getTime())) {
                throw new Error('seg é inválido');
            }
            if (!sex || isNaN(sex.getTime())) {
                throw new Error('sex é inválido');
            }
        } catch (err) {
            console.error('[ERRO conversão data]', { rawIni, rawFim, safeDataIni, safeDataFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro ao processar as datas. Por favor, selecione novamente o período.");
                    history.back();
                </script>
            `);
        }

        // Filtro persistente — no formato que a view antiga espera (com Z)
        let filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convId: rawConv || '766f69643132333435366964' // ID do "—"
        };

        console.log("✅ Filtro seguro:", { dataIni: safeDataIni, dataFim: safeDataFim, relConvid: rawConv });
        console.log("req.body.dataIni:"+req.body.dataIni);
        console.log("req.body.dataFim:"+req.body.dataFim);
        console.log("req.body.relConvid:"+req.body.relConvid);

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;

        Atend.find({atend_convid: req.body.relConvid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            at = at.filter(a => (""+a.atend_categoria) !== "Feriado");
            console.log("at:length: "+at.length);
            Conv.find().then((conv)=>{
                Conv.find({_id: req.body.relConvid}).then((c)=>{
                    conv_nome = c.conv_nome;
                    Terapia.find().then((terapia)=>{
                        //INICIO REGRA
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                        terapia.forEach((t)=>{
                            //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                            qtdIds = 0;
                            creValFinal = 0;
                            atends = [];
                            at.forEach((ats)=>{
                                categorias = ats.atend_categoria
                                //console.log("categorias: "+categorias);
                                switch (categorias){
                                    case "Apoio":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Extra":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Falta":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Falta Justificada":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Feriado":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Falta Absoluta":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Pais":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Substituição":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    default:
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                }
                                if((""+terapiaAtend) === (""+t._id)){
                                    atends.push(ats);
                                }
                            })
                            
                            atends.forEach((atend)=>{
                                categorias = atend.atend_categoria
                                switch (categorias){
                                    case "Apoio":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Extra":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Falta":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Falta Justificada":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Feriado":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Falta Absoluta":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Pais":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Substituição":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    default:
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                }

                                if ((""+t._id) === (""+terapiaAtend) && categorias != "Falta Absoluta"){
                                    qtdIds++;
                                    creValFinal = creVal;
                                    //console.log("TERAPIA OK")
                                }
                            })

                            if(qtdIds != 0){
                                a.sessoes = qtdIds;
                                a.nomecid = t._id;
                                a.valor = creVal;

                                //console.log("qtdIds: "+qtdIds+" - t._id: "+t._id+" - creVal: "+creVal)
                            }
                            
                            if(qtdIds != 0){
                                rel.push(a);
                                a = new RelAtend();
                            }
                        })
                        //FIM REGRA
                        rel.forEach((r)=>{
                            val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                            val = fncGeral.mascaraValores(val);
                            r.total = val;

                            valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                            sessaoTot += r.sessoes;
                            //console.log("r.sessoes: " + r.sessoes)
                            //console.log("r.nomecid: " + r.nomecid)
                            //console.log("r.valor: " + r.valor)
                        })
                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            res.render("atendimento/relatendval", {terapias: terapia, anos: ano, convs: conv, rels: rel, total, periodoDe, periodoAte, conv_nome, filtro})
                        })
                    })
                })
            })
        })
    },
    tabdimAtendval(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Conv.findOne().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Conv.find().then((conv)=>{
                   conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/tabdimatendval", {terapias: terapia, convs: conv, anos: ano})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },

    tabdimAtendimentoValFiltro_OLD(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convId: rawConv || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_convid: rawConv,
                atend_atenddata: { $gte: seg, $lte: sex }  // ✅ CORRIGIDO: nome do campo + ":"
            }).exec(),
            Conv.find().exec(),
            Conv.findById(rawConv).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find().exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, convSelecionado, terapias, anos, usuarios, benes]) => {
            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            usuarios.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Filtra Feriado e Falta Absoluta aqui (garante que não entrem)
            const atFiltrado = atRaw.filter(a => 
                a.atend_categoria !== "Feriado" && 
                a.atend_categoria !== "Falta Absoluta" && 
                a.atend_categoria !== "Falta Justificada"
            );

            const conv_nome = lookupConv[rawConv] || "(nenhum)";
            terapias.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome));

            const rel = [];
            let sessaoTot = 0;
            let valTotCentavos = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atFiltrado
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            terapias.forEach(t => {
                const detalhes = [];
                let qtd = 0;
                let valorCentavos = 0;

                atOrdenado.forEach(at => {
                    let terapiaId;
                    switch (at.atend_categoria) {
                        case "Substituição":
                            terapiaId = at.atend_mergeterapiaid;
                            break;
                        case "SubstitutoFixo":
                            terapiaId = at.atend_fixoterapiaid;
                            break;
                        default:
                            terapiaId = at.atend_terapiaid;
                            break;
                    }

                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    if (!idIgual(terapiaId, t._id)) return;

                    const vCent = toCentavos(at.atend_valorcre || "0");
                    if (qtd === 0 && vCent > 0) valorCentavos = vCent;
                    qtd++;

                    let dataFmt ='-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt ='-';
                        }
                    }

                   const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">—</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c ||'-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                   const formatValor = (v) => {
                        // Trata: null, undefined, vazio, só espaços, ou "0,00"
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v; // Retorna o valor normal (ex: "80,00")
                    };
                    const beneNome = lookupBene[at.atend_beneid] ||'-';
                    const convNome = lookupConv[at.atend_convid] ||'-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] ||'-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] ||'-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] ||'-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] ||'-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] ||'-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] ||'-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora ||'-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        permiteEdicao: true // já filtramos Falta Absoluta acima
                    });
                });

                if (qtd === 0) return;

                if (valorCentavos === 0 && detalhes.length > 0) {
                    const soma = detalhes.reduce((s, d) => {
                        const clean = d.credOrig.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorCentavos = Math.round(soma / detalhes.length);
                }

                const totalCentavos = valorCentavos * qtd;

                rel.push({
                    terapiaId: t._id,
                    terapiaNome: t.terapia_nome,
                    sessoes: qtd,
                    valorUnitario: fncGeral.formatarReal(valorCentavos),
                    valorTotal: fncGeral.formatarReal(totalCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCentavos += totalCentavos;
            });

            const total = {
                sessoes: sessaoTot,
                valor: fncGeral.formatarReal(valTotCentavos),
                total: fncGeral.formatarReal(valTotCentavos)
            };

            res.render("atendimento/tabdimatendval", {
                terapias,
                anos,
                convs,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimAtendimentoValFiltro(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convId: rawConv || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_convid: rawConv,
                atend_atenddata: { $gte: seg, $lte: sex }
            }).exec(),
            Conv.find().exec(),
            Conv.findById(rawConv).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find().exec(), // ✅ Adicionado
            Bene.find().exec()
        ])
        .then(([atRaw, convs, convSelecionado, terapias, anos, usuarios, benes]) => {
            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            usuarios.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Filtra categorias indesejadas
            const atFiltrado = atRaw.filter(a => 
                a.atend_categoria !== "Feriado" && 
                a.atend_categoria !== "Falta Absoluta" && 
                a.atend_categoria !== "Falta Justificada"
            );

            // ✅ Função para determinar quais valores usar baseado em atend_org
            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    // Usa valores padrão
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        // Substituto Fixo - usa valores fixos
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        // Substituição - usa valores de merge
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        // Outros casos administrativos - usa valores padrão
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    // Default - valores padrão
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const conv_nome = lookupConv[rawConv] || "(nenhum)";
            terapias.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome));

            const rel = [];
            let sessaoTot = 0;
            let valTotCentavos = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atFiltrado
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            terapias.forEach(t => {
                const detalhes = [];
                let qtd = 0;
                let valorCentavos = 0;

                atOrdenado.forEach(at => {
                    let terapiaId;
                    switch (at.atend_categoria) {
                        case "Substituição":
                            terapiaId = at.atend_mergeterapiaid;
                            break;
                        case "SubstitutoFixo":
                            terapiaId = at.atend_fixoterapiaid;
                            break;
                        default:
                            terapiaId = at.atend_terapiaid;
                            break;
                    }

                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    if (!idIgual(terapiaId, t._id)) return;

                    // ✅ Determina quais valores usar
                    const valores = getValoresAtendimento(at);
                    
                    const vCent = toCentavos(valores.cred);
                    if (qtd === 0 && vCent > 0) valorCentavos = vCent;
                    qtd++;

                    let dataFmt = '-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt = '-';
                        }
                    }

                    const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">-</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c || '-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                    const formatValor = (v) => {
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v;
                    };

                    const beneNome = lookupBene[at.atend_beneid] || '-';
                    const convNome = lookupConv[at.atend_convid] || '-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora || '-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        credUsado: formatValor(valores.cred),  // ✅ Novo campo
                        debUsado: formatValor(valores.deb),    // ✅ Novo campo
                        tipoCalculo: valores.tipo,             // ✅ Novo campo
                        permiteEdicao: true
                    });
                });

                if (qtd === 0) return;

                if (valorCentavos === 0 && detalhes.length > 0) {
                    const soma = detalhes.reduce((s, d) => {
                        const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorCentavos = Math.round(soma / detalhes.length);
                }

                const totalCentavos = valorCentavos * qtd;

                rel.push({
                    terapiaId: t._id,
                    terapiaNome: t.terapia_nome,
                    sessoes: qtd,
                    valorUnitario: fncGeral.formatarReal(valorCentavos),
                    valorTotal: fncGeral.formatarReal(totalCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCentavos += totalCentavos;
            });

            const total = {
                sessoes: sessaoTot,
                valor: fncGeral.formatarReal(valTotCentavos),
                total: fncGeral.formatarReal(valTotCentavos)
            };

            res.render("atendimento/tabdimatendval", {
                terapias,
                anos,
                convs,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimBeneTeraAtendval(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        Bene.find().then((bene)=>{
            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            res.render("atendimento/tabdimatendbeneteraval", {benes:bene, terapias: terapia, convs: conv, anos: ano})
           })})})}).catch((err) =>{
            console.log(err)
        })
    },
    tabdimAtendimentoBeneTeraValFiltro(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawBene = req.body.relBeneid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            beneId: rawBene || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_beneid: rawBene,
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { 
                    $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
                }
            }).exec(),
            Conv.find().exec(),
            Bene.findById(rawBene).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find().exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, beneSelecionado, terapias, anos, usuarios, benes]) => {
            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            usuarios.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Função para determinar quais valores usar baseado em atend_org
            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    // Usa valores padrão
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        // Substituto Fixo - usa valores fixos
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        // Substituição - usa valores de merge
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        // Outros casos administrativos - usa valores padrão
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    // Default - valores padrão
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const bene_nome = lookupBene[rawBene] || "(nenhum)";
            usuarios.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome));

            const rel = [];
            let sessaoTot = 0;
            let valTotCredCentavos = 0;
            let valTotDebCentavos = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atRaw
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            usuarios.forEach(u => {
                const detalhes = [];
                let qtd = 0;
                let valorCredCentavos = 0;
                let valorDebCentavos = 0;

                atOrdenado.forEach(at => {
                    let terapeutaId;
                    switch (at.atend_categoria) {
                        case "Substituição":
                            terapeutaId = at.atend_mergeterapeutaid;
                            break;
                        case "SubstitutoFixo":
                            terapeutaId = at.atend_fixoterapeutaid;
                            break;
                        default:
                            terapeutaId = at.atend_terapeutaid;
                            break;
                    }

                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    if (!idIgual(terapeutaId, u._id)) return;

                    // ✅ Determina quais valores usar
                    const valores = getValoresAtendimento(at);
                    
                    const vCredCent = toCentavos(valores.cred);
                    const vDebCent = toCentavos(valores.deb);
                    
                    if (qtd === 0 && vCredCent > 0) valorCredCentavos = vCredCent;
                    if (qtd === 0 && vDebCent > 0) valorDebCentavos = vDebCent;
                    
                    qtd++;

                    let dataFmt = '-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt = '-';
                        }
                    }

                    const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">-</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c || '-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                    const formatValor = (v) => {
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v;
                    };

                    const beneNome = lookupBene[at.atend_beneid] || '-';
                    const convNome = lookupConv[at.atend_convid] || '-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora || '-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        credUsado: formatValor(valores.cred),  // ✅ Valor realmente usado no cálculo
                        debUsado: formatValor(valores.deb),    // ✅ Valor realmente usado no cálculo
                        tipoCalculo: valores.tipo,             // ✅ Tipo de cálculo aplicado
                        permiteEdicao: true
                    });
                });

                if (qtd === 0) return;

                // ✅ Cálculo do valor unitário baseado nos valores usados
                if (valorCredCentavos === 0 && detalhes.length > 0) {
                    const somaCred = detalhes.reduce((s, d) => {
                        const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorCredCentavos = Math.round(somaCred / detalhes.length);
                }

                if (valorDebCentavos === 0 && detalhes.length > 0) {
                    const somaDeb = detalhes.reduce((s, d) => {
                        const clean = d.debUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorDebCentavos = Math.round(somaDeb / detalhes.length);
                }

                const totalCredCentavos = valorCredCentavos * qtd;
                const totalDebCentavos = valorDebCentavos * qtd;

                rel.push({
                    terapeutaId: u._id,
                    terapeutaNome: u.usuario_nome,
                    sessoes: qtd,
                    valorUnitarioCred: fncGeral.formatarReal(valorCredCentavos),
                    valorUnitarioDeb: fncGeral.formatarReal(valorDebCentavos),
                    valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                    valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCredCentavos += totalCredCentavos;
                valTotDebCentavos += totalDebCentavos;
            });

            const total = {
                sessoes: sessaoTot,
                valorCred: fncGeral.formatarReal(valTotCredCentavos),
                valorDeb: fncGeral.formatarReal(valTotDebCentavos),
                totalCred: fncGeral.formatarReal(valTotCredCentavos),
                totalDeb: fncGeral.formatarReal(valTotDebCentavos)
            };

            res.render("atendimento/tabdimatendbeneteraval", {
                usuarios,
                anos,
                benes,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                bene_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoBeneTeraValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimTeraBeneAtendval(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o terapeuta por nome
        Bene.find().then((bene)=>{
            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            res.render("atendimento/tabdimatendterabeneval", {terapeutas:terapeuta, benes:bene, terapias: terapia, convs: conv, anos: ano})
        })})})})}).catch((err) =>{
        console.log(err)
        })
    },
    tabdimAtendimentoTeraBeneValFiltro(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        // ✅ Correção: Usar o banco PortalDoUsuario para terapeutas

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawTera = req.body.relTerapeutaid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            terapeutaid: rawTera || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        // ✅ Correção: Buscar terapeutas do PortalDoUsuario com filtro
        Promise.all([
            Atend.find({
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { 
                    $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
                }
            }).exec(),
            Conv.find().exec(),
            Usuario.findById(rawTera).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            // ✅ Correção: Buscar apenas terapeutas do PortalDoUsuario
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, terapeutaSelecionado, terapias, anos, terapeutas, benes]) => {
            console.log('[DEBUG] rawTera:', rawTera);
            console.log('[DEBUG] terapeutaSelecionado:', terapeutaSelecionado);
            console.log('[DEBUG] Total de atendimentos encontrados:', atRaw.length);
            
            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            terapeutas.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const terapeuta_nome = lookupUsuario[rawTera] || "(nenhum)";
            console.log('[DEBUG] terapeuta_nome:', terapeuta_nome);
            
            benes.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            const rel = [];
            let sessaoTot = 0;
            let valTotCredCentavos = 0;
            let valTotDebCentavos = 0;

            const atOrdenado = atRaw
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            console.log('[DEBUG] Total de atendimentos após ordenação:', atOrdenado.length);
            
            let totalAtendimentosProcessados = 0;
            let totalAtendimentosDoTerapeuta = 0;

            benes.forEach(b => {
                const detalhes = [];
                let qtd = 0;
                let valorCredCentavos = 0;
                let valorDebCentavos = 0;

                atOrdenado.forEach(at => {
                    totalAtendimentosProcessados++;
                    
                    let terapeutaId;
                    switch (at.atend_categoria) {
                        case "Substituição":
                            terapeutaId = at.atend_mergeterapeutaid;
                            break;
                        case "SubstitutoFixo":
                            terapeutaId = at.atend_fixoterapeutaid;
                            break;
                        default:
                            terapeutaId = at.atend_terapeutaid;
                            break;
                    }

                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    
                    // ✅ Debug: Verificar se está comparando corretamente
                    if (!idIgual(terapeutaId, rawTera)) {
                        return;
                    }
                    
                    totalAtendimentosDoTerapeuta++;
                    
                    if (!idIgual(at.atend_beneid, b._id)) return;

                    const valores = getValoresAtendimento(at);
                    const vCredCent = toCentavos(valores.cred);
                    const vDebCent = toCentavos(valores.deb);
                    
                    if (qtd === 0 && vCredCent > 0) valorCredCentavos = vCredCent;
                    if (qtd === 0 && vDebCent > 0) valorDebCentavos = vDebCent;
                    
                    qtd++;

                    let dataFmt = '-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt = '-';
                        }
                    }

                    const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">-</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c || '-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                    const formatValor = (v) => {
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v;
                    };

                    const beneNome = lookupBene[at.atend_beneid] || '-';
                    const convNome = lookupConv[at.atend_convid] || '-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora || '-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        credUsado: formatValor(valores.cred),
                        debUsado: formatValor(valores.deb),
                        tipoCalculo: valores.tipo,
                        permiteEdicao: true
                    });
                });

                if (qtd === 0) return;

                if (valorCredCentavos === 0 && detalhes.length > 0) {
                    const somaCred = detalhes.reduce((s, d) => {
                        const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorCredCentavos = Math.round(somaCred / detalhes.length);
                }

                if (valorDebCentavos === 0 && detalhes.length > 0) {
                    const somaDeb = detalhes.reduce((s, d) => {
                        const clean = d.debUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorDebCentavos = Math.round(somaDeb / detalhes.length);
                }

                const totalCredCentavos = valorCredCentavos * qtd;
                const totalDebCentavos = valorDebCentavos * qtd;

                rel.push({
                    beneId: b._id,
                    beneNome: b.bene_nome,
                    sessoes: qtd,
                    valorUnitarioCred: fncGeral.formatarReal(valorCredCentavos),
                    valorUnitarioDeb: fncGeral.formatarReal(valorDebCentavos),
                    valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                    valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCredCentavos += totalCredCentavos;
                valTotDebCentavos += totalDebCentavos;
            });

            console.log('[DEBUG] Resumo:');
            console.log('  - Total atendimentos processados:', totalAtendimentosProcessados);
            console.log('  - Total atendimentos do terapeuta:', totalAtendimentosDoTerapeuta);
            console.log('  - Total beneficiários com atendimentos:', rel.length);
            console.log('  - Sessões totais:', sessaoTot);

            const total = {
                sessoes: sessaoTot,
                valorCred: fncGeral.formatarReal(valTotCredCentavos),
                valorDeb: fncGeral.formatarReal(valTotDebCentavos),
                totalCred: fncGeral.formatarReal(valTotCredCentavos),
                totalDeb: fncGeral.formatarReal(valTotDebCentavos)
            };

            res.render("atendimento/tabdimatendterabeneval", {
                terapeutas,  // ✅ Correção: usar terapeutas ao invés de usuarios
                anos,
                benes,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                terapeuta_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoTeraBeneValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimConvBeneAtendval(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Conv.findOne().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Conv.find().then((conv)=>{
                   conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/tabdimatendconvbeneval", {terapias: terapia, convs: conv, anos: ano})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    tabdimAtendimentoConvBeneValFiltro_ErroSoma(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convid: rawConv || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { 
                    $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
                }
            }).exec(),
            Conv.find().exec(),
            Conv.findById(rawConv).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, convSelecionado, terapias, anos, terapeutas, benes]) => {
            console.log('[DEBUG Convênio] rawConv:', rawConv);
            console.log('[DEBUG Convênio] convSelecionado:', convSelecionado);
            console.log('[DEBUG Convênio] Total de atendimentos encontrados:', atRaw.length);

            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            terapeutas.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Função para determinar quais valores usar baseado em atend_org
            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const conv_nome = lookupConv[rawConv] || "(nenhum)";
            benes.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

            const rel = [];
            let sessaoTot = 0;
            let valTotCredCentavos = 0;
            let valTotDebCentavos = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atRaw
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            console.log('[DEBUG Convênio] Total de atendimentos após ordenação:', atOrdenado.length);

            let totalAtendimentosProcessados = 0;
            let totalAtendimentosDoConvenio = 0;

            benes.forEach(b => {
                const detalhes = [];
                let qtd = 0;
                let valorCredCentavos = 0;
                let valorDebCentavos = 0;

                atOrdenado.forEach(at => {
                    totalAtendimentosProcessados++;

                    // ✅ Verifica se o atendimento pertence ao convênio selecionado
                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    if (!idIgual(at.atend_convid, rawConv)) return;

                    totalAtendimentosDoConvenio++;

                    // ✅ Verifica se o atendimento pertence ao beneficiário atual
                    if (!idIgual(at.atend_beneid, b._id)) return;

                    // ✅ Determina quais valores usar
                    const valores = getValoresAtendimento(at);
                    
                    const vCredCent = toCentavos(valores.cred);
                    const vDebCent = toCentavos(valores.deb);
                    
                    if (qtd === 0 && vCredCent > 0) valorCredCentavos = vCredCent;
                    if (qtd === 0 && vDebCent > 0) valorDebCentavos = vDebCent;
                    
                    qtd++;

                    let dataFmt = '-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt = '-';
                        }
                    }

                    const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">-</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c || '-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                    const formatValor = (v) => {
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v;
                    };

                    const beneNome = lookupBene[at.atend_beneid] || '-';
                    const convNome = lookupConv[at.atend_convid] || '-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora || '-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        credUsado: formatValor(valores.cred),
                        debUsado: formatValor(valores.deb),
                        tipoCalculo: valores.tipo,
                        permiteEdicao: true
                    });
                });

                if (qtd === 0) return;

                // ✅ Cálculo do valor unitário baseado nos valores usados
                if (valorCredCentavos === 0 && detalhes.length > 0) {
                    const somaCred = detalhes.reduce((s, d) => {
                        const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorCredCentavos = Math.round(somaCred / detalhes.length);
                }

                if (valorDebCentavos === 0 && detalhes.length > 0) {
                    const somaDeb = detalhes.reduce((s, d) => {
                        const clean = d.debUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                        return s + (clean ? parseInt(clean, 10) : 0);
                    }, 0);
                    valorDebCentavos = Math.round(somaDeb / detalhes.length);
                }

                const totalCredCentavos = valorCredCentavos * qtd;
                const totalDebCentavos = valorDebCentavos * qtd;

                rel.push({
                    beneId: b._id,
                    beneNome: b.bene_nome,
                    sessoes: qtd,
                    valorUnitarioCred: fncGeral.formatarReal(valorCredCentavos),
                    valorUnitarioDeb: fncGeral.formatarReal(valorDebCentavos),
                    valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                    valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCredCentavos += totalCredCentavos;
                valTotDebCentavos += totalDebCentavos;
            });

            console.log('[DEBUG Convênio] Resumo:');
            console.log('  - Total atendimentos processados:', totalAtendimentosProcessados);
            console.log('  - Total atendimentos do convênio:', totalAtendimentosDoConvenio);
            console.log('  - Total beneficiários com atendimentos:', rel.length);
            console.log('  - Sessões totais:', sessaoTot);

            const total = {
                sessoes: sessaoTot,
                valorCred: fncGeral.formatarReal(valTotCredCentavos),
                valorDeb: fncGeral.formatarReal(valTotDebCentavos),
                totalCred: fncGeral.formatarReal(valTotCredCentavos),
                totalDeb: fncGeral.formatarReal(valTotDebCentavos)
            };

            res.render("atendimento/tabdimatendconvbeneval", {
                convs,
                anos,
                benes,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoConvBeneValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimAtendimentoConvBeneValFiltro_semOA(req, res) {
    const db = req.cookies['preferredDb'];
    const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
    const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

    const rawIni = req.body.dataIni;
    const rawFim = req.body.dataFim;
    const rawConv = req.body.relConvid;

    const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
    const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
    const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

    let seg, sex;
    try {
        seg = fncGeral.getDateFromString(safeDataIni, "ini");
        sex = fncGeral.getDateFromString(safeDataFim, "fim");
        if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
        if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
    } catch (err) {
        console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
        return res.status(400).send(`
            <script>
                alert("Erro nas datas. Verifique o período selecionado.");
                history.back();
            </script>
        `);
    }

    const filtro = {
        dataIni: safeDataIni,
        dataFim: safeDataFim,
        convid: rawConv || '766f69643132333435366964'
    };

    const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
    const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

    Promise.all([
        Atend.find({
            atend_atenddata: { $gte: seg, $lte: sex },
            atend_categoria: { 
                $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
            }
        }).exec(),
        Conv.find().exec(),
        Conv.findById(rawConv).exec(),
        Terapia.find().exec(),
        Ano.find().exec(),
        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).exec(),
        Bene.find().exec()
    ])
    .then(([atRaw, convs, convSelecionado, terapias, anos, terapeutas, benes]) => {
        console.log('[DEBUG Convênio] rawConv:', rawConv);
        console.log('[DEBUG Convênio] convSelecionado:', convSelecionado);
        console.log('[DEBUG Convênio] Total de atendimentos encontrados:', atRaw.length);

        const lookupTerapia = {};
        terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

        const lookupUsuario = {};
        terapeutas.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

        const lookupBene = {};
        benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

        const lookupConv = {};
        convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

        const toCentavos = (str) => {
            if (!str || typeof str !== 'string') return 0;
            const clean = str.replace(/\D/g, '');
            return clean.length >= 2
                ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                : parseInt(clean.padStart(2, '0'), 10);
        };

        // ✅ Função para determinar quais valores usar baseado em atend_org
        const getValoresAtendimento = (at) => {
            const origem = (at.atend_org || '').trim();
            const fixo = at.atend_fixo === "true";
            const categoria = at.atend_categoria;

            if (origem === "Padrão") {
                return {
                    cred: at.atend_valorcre || "0,00",
                    deb: at.atend_valordeb || "0,00",
                    tipo: "Padrão"
                };
            } else if (origem === "Administrativo") {
                if (fixo) {
                    return {
                        cred: at.atend_fixovalorcre || "0,00",
                        deb: at.atend_fixovalordeb || "0,00",
                        tipo: "Fixo"
                    };
                } else if (categoria === "Substituição") {
                    return {
                        cred: at.atend_mergevalorcre || "0,00",
                        deb: at.atend_mergevalordeb || "0,00",
                        tipo: "Substituição"
                    };
                } else {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Administrativo"
                    };
                }
            } else {
                return {
                    cred: at.atend_valorcre || "0,00",
                    deb: at.atend_valordeb || "0,00",
                    tipo: "Outro"
                };
            }
        };

        const conv_nome = lookupConv[rawConv] || "(nenhum)";
        benes.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

        const rel = [];
        let sessaoTot = 0;
        let valTotCredCentavos = 0;
        let valTotDebCentavos = 0;

        // ✅ Ordena globalmente ANTES do agrupamento
        const atOrdenado = atRaw
            .filter(a => a.atend_atenddata)
            .sort((a, b) => {
                const d1 = new Date(a.atend_atenddata).getTime();
                const d2 = new Date(b.atend_atenddata).getTime();
                if (d1 !== d2) return d1 - d2;
                return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
            });

        console.log('[DEBUG Convênio] Total de atendimentos após ordenação:', atOrdenado.length);

        let totalAtendimentosProcessados = 0;
        let totalAtendimentosDoConvenio = 0;

        benes.forEach(b => {
            const detalhes = [];
            let qtd = 0;
            let valorCredCentavos = 0;
            let valorDebCentavos = 0;
            
            // ✅ ACUMULADORES para soma real dos valores
            let somaCredIndividual = 0;
            let somaDebIndividual = 0;

            atOrdenado.forEach(at => {
                totalAtendimentosProcessados++;

                // ✅ Verifica se o atendimento pertence ao convênio selecionado
                const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                if (!idIgual(at.atend_convid, rawConv)) return;

                totalAtendimentosDoConvenio++;

                // ✅ Verifica se o atendimento pertence ao beneficiário atual
                if (!idIgual(at.atend_beneid, b._id)) return;

                // ✅ Determina quais valores usar
                const valores = getValoresAtendimento(at);
                
                const vCredCent = toCentavos(valores.cred);
                const vDebCent = toCentavos(valores.deb);
                
                if (qtd === 0 && vCredCent > 0) valorCredCentavos = vCredCent;
                if (qtd === 0 && vDebCent > 0) valorDebCentavos = vDebCent;
                
                qtd++;

                // ✅ ACUMULA os valores individuais para o total correto
                somaCredIndividual += vCredCent;
                somaDebIndividual += vDebCent;

                let dataFmt = '-';
                if (at.atend_atenddata) {
                    try {
                        const d = new Date(at.atend_atenddata);
                        if (!isNaN(d.getTime())) {
                            dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                        }
                    } catch (e) {
                        dataFmt = '-';
                    }
                }

                const origemLabel = (() => {
                    const valor = (at.atend_org || '').trim();
                    if (valor === "Administrativo") {
                        return '<span class="label label-sm label-warning">ADM</span>';
                    } else if (valor === "Padrão") {
                        return '<span class="label label-sm label-info">PAD</span>';
                    } else {
                        return '<span class="label label-sm label-default">-</span>';
                    }
                })();

                const categoriaLabel = (() => {
                    const c = at.atend_categoria;
                    if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                    if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                    if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                    if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                    if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                    return c || '-';
                })();

                const eventoLabel = at.atend_fixo === "true"
                    ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                    : '<span class="label label-sm label-success">Padrão</span>';

                const formatValor = (v) => {
                    if (!v || v.trim() === '' || v === '0,00') {
                        return '-';
                    }
                    return v;
                };

                const beneNome = lookupBene[at.atend_beneid] || '-';
                const convNome = lookupConv[at.atend_convid] || '-';
                const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                    ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                    : '-';

                const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                    ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                    : '-';

                const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                    ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                    : '-';

                const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                    ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                    : '-';

                detalhes.push({
                    ordem: (detalhes.length + 1).toString(),
                    _id: at._id,
                    data: dataFmt,
                    hora: at.atend_atendhora || '-',
                    beneNome,
                    convNome,
                    origemLabel,
                    categoriaLabel,
                    eventoLabel,
                    terapiaOrig,
                    terapeutaOrig,
                    credOrig: formatValor(at.atend_valorcre || "0,00"),
                    debOrig: formatValor(at.atend_valordeb || "0,00"),
                    terapiaFixa,
                    terapeutaFixo,
                    credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                    debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                    terapiaSubst,
                    terapeutaSubst,
                    credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                    debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                    credUsado: formatValor(valores.cred),
                    debUsado: formatValor(valores.deb),
                    tipoCalculo: valores.tipo,
                    permiteEdicao: true
                });
            });

            if (qtd === 0) return;

            // ✅ Cálculo do valor unitário baseado nos valores usados
            if (valorCredCentavos === 0 && detalhes.length > 0) {
                const somaCred = detalhes.reduce((s, d) => {
                    const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                    return s + (clean ? parseInt(clean, 10) : 0);
                }, 0);
                valorCredCentavos = Math.round(somaCred / detalhes.length);
            }

            if (valorDebCentavos === 0 && detalhes.length > 0) {
                const somaDeb = detalhes.reduce((s, d) => {
                    const clean = d.debUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                    return s + (clean ? parseInt(clean, 10) : 0);
                }, 0);
                valorDebCentavos = Math.round(somaDeb / detalhes.length);
            }

            // ✅ CORREÇÃO: Usa a soma individual em vez de multiplicar!
            const totalCredCentavos = somaCredIndividual;
            const totalDebCentavos = somaDebIndividual;

            rel.push({
                beneId: b._id,
                beneNome: b.bene_nome,
                sessoes: qtd,
                valorUnitarioCred: fncGeral.formatarReal(valorCredCentavos),
                valorUnitarioDeb: fncGeral.formatarReal(valorDebCentavos),
                valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                atendimentos: detalhes
            });

            sessaoTot += qtd;
            valTotCredCentavos += totalCredCentavos;
            valTotDebCentavos += totalDebCentavos;
        });

        console.log('[DEBUG Convênio] Resumo:');
        console.log('  - Total atendimentos processados:', totalAtendimentosProcessados);
        console.log('  - Total atendimentos do convênio:', totalAtendimentosDoConvenio);
        console.log('  - Total beneficiários com atendimentos:', rel.length);
        console.log('  - Sessões totais:', sessaoTot);

        const total = {
            sessoes: sessaoTot,
            valorCred: fncGeral.formatarReal(valTotCredCentavos),
            valorDeb: fncGeral.formatarReal(valTotDebCentavos),
            totalCred: fncGeral.formatarReal(valTotCredCentavos),
            totalDeb: fncGeral.formatarReal(valTotDebCentavos)
        };

        res.render("atendimento/tabdimatendconvbeneval", {
            convs,
            anos,
            benes,
            rels: rel,
            total,
            periodoDe,
            periodoAte,
            conv_nome,
            filtro
        });
    })
    .catch(err => {
        console.error('[ERRO tabdimAtendimentoConvBeneValFiltro]', err);
        res.status(500).send(`
            <script>
                alert("Erro ao carregar relatório. Tente novamente.");
                history.back();
            </script>
        `);
    });
},
    tabdimAtendimentoConvBeneValFiltro(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convid: rawConv || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { 
                    $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
                }
            }).exec(),
            Conv.find().exec(),
            Conv.findById(rawConv).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, convSelecionado, terapias, anos, terapeutas, benes]) => {
            // ✅ ORDENAÇÃO ALFABÉTICA COM REMOÇÃO DE ACENTOS
            
            // Ordena Convênios (para dropdown)
            convs.sort((a, b) => {
                const nomeA = a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomeB = b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });
            
            // Ordena Beneficiários (para processamento e tabela)
            benes.sort((a, b) => {
                const nomeA = a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomeB = b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });
            
            // Ordena Terapias (para lookup e dropdowns)
            terapias.sort((a, b) => {
                const nomeA = a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomeB = b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });
            
            // Ordena Terapeutas (para lookup)
            terapeutas.sort((a, b) => {
                const nomeA = a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomeB = b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });

            console.log('[DEBUG Convênio] rawConv:', rawConv);
            console.log('[DEBUG Convênio] convSelecionado:', convSelecionado);
            console.log('[DEBUG Convênio] Total de atendimentos encontrados:', atRaw.length);

            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            terapeutas.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Função para determinar quais valores usar baseado em atend_org
            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const conv_nome = lookupConv[rawConv] || "(nenhum)";

            const rel = [];
            let sessaoTot = 0;
            let valTotCredCentavos = 0;
            let valTotDebCentavos = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atRaw
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            console.log('[DEBUG Convênio] Total de atendimentos após ordenação:', atOrdenado.length);

            benes.forEach(b => {
                const detalhes = [];
                let qtd = 0;

                // ✅ ACUMULADORES para SOMA REAL dos valores individuais
                let somaCredIndividual = 0;
                let somaDebIndividual = 0;

                atOrdenado.forEach(at => {
                    // ✅ Verifica se o atendimento pertence ao convênio selecionado
                    const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                    if (!idIgual(at.atend_convid, rawConv)) return;

                    // ✅ Verifica se o atendimento pertence ao beneficiário atual
                    if (!idIgual(at.atend_beneid, b._id)) return;

                    // ✅ Determina quais valores usar
                    const valores = getValoresAtendimento(at);
                    
                    const vCredCent = toCentavos(valores.cred);
                    const vDebCent = toCentavos(valores.deb);

                    qtd++;

                    // ✅ ACUMULA os valores individuais para o total correto
                    somaCredIndividual += vCredCent;
                    somaDebIndividual += vDebCent;

                    let dataFmt = '-';
                    if (at.atend_atenddata) {
                        try {
                            const d = new Date(at.atend_atenddata);
                            if (!isNaN(d.getTime())) {
                                dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                            }
                        } catch (e) {
                            dataFmt = '-';
                        }
                    }

                    const origemLabel = (() => {
                        const valor = (at.atend_org || '').trim();
                        if (valor === "Administrativo") {
                            return '<span class="label label-sm label-warning">ADM</span>';
                        } else if (valor === "Padrão") {
                            return '<span class="label label-sm label-info">PAD</span>';
                        } else {
                            return '<span class="label label-sm label-default">-</span>';
                        }
                    })();

                    const categoriaLabel = (() => {
                        const c = at.atend_categoria;
                        if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                        if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                        if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                        if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                        if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                        return c || '-';
                    })();

                    const eventoLabel = at.atend_fixo === "true"
                        ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                        : '<span class="label label-sm label-success">Padrão</span>';

                    const formatValor = (v) => {
                        if (!v || v.trim() === '' || v === '0,00') {
                            return '-';
                        }
                        return v;
                    };

                    const beneNome = lookupBene[at.atend_beneid] || '-';
                    const convNome = lookupConv[at.atend_convid] || '-';
                    const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                    const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                    const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                        : '-';

                    const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                        : '-';

                    const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                        ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                        : '-';

                    const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                        ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                        : '-';

                    detalhes.push({
                        ordem: (detalhes.length + 1).toString(),
                        _id: at._id,
                        data: dataFmt,
                        hora: at.atend_atendhora || '-',
                        beneNome,
                        convNome,
                        origemLabel,
                        categoriaLabel,
                        eventoLabel,
                        terapiaOrig,
                        terapeutaOrig,
                        credOrig: formatValor(at.atend_valorcre || "0,00"),
                        debOrig: formatValor(at.atend_valordeb || "0,00"),
                        terapiaFixa,
                        terapeutaFixo,
                        credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                        debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                        terapiaSubst,
                        terapeutaSubst,
                        credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                        debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                        credUsado: formatValor(valores.cred),
                        debUsado: formatValor(valores.deb),
                        tipoCalculo: valores.tipo,
                        permiteEdicao: true
                    });
                });

                if (qtd === 0) return;

                // ✅ Cálculo do valor UNITÁRIO MÉDIO (apenas para exibição)
                let valorUnitarioCredCentavos = 0;
                let valorUnitarioDebCentavos = 0;

                if (detalhes.length > 0) {
                    valorUnitarioCredCentavos = Math.round(somaCredIndividual / detalhes.length);
                    valorUnitarioDebCentavos = Math.round(somaDebIndividual / detalhes.length);
                }

                // ✅ TOTAIS CORRETOS: SOMA DIRETA DOS VALORES INDIVIDUAIS (NÃO MULTIPLICA!)
                const totalCredCentavos = somaCredIndividual;
                const totalDebCentavos = somaDebIndividual;

                rel.push({
                    beneId: b._id,
                    beneNome: b.bene_nome,
                    sessoes: qtd,
                    valorUnitarioCred: fncGeral.formatarReal(valorUnitarioCredCentavos),
                    valorUnitarioDeb: fncGeral.formatarReal(valorUnitarioDebCentavos),
                    valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                    valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                    atendimentos: detalhes
                });

                sessaoTot += qtd;
                valTotCredCentavos += totalCredCentavos;
                valTotDebCentavos += totalDebCentavos;
            });

            console.log('[DEBUG Convênio] Resumo:');
            console.log('  - Total beneficiários com atendimentos:', rel.length);
            console.log('  - Sessões totais:', sessaoTot);

            // ✅ Ordena resultado final por nome do beneficiário
            rel.sort((a, b) => {
                const nomeA = a.beneNome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                const nomeB = b.beneNome.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
                if (nomeA < nomeB) return -1;
                if (nomeA > nomeB) return 1;
                return 0;
            });

            const total = {
                sessoes: sessaoTot,
                valorCred: fncGeral.formatarReal(valTotCredCentavos),
                valorDeb: fncGeral.formatarReal(valTotDebCentavos),
                totalCred: fncGeral.formatarReal(valTotCredCentavos),
                totalDeb: fncGeral.formatarReal(valTotDebCentavos)
            };

            res.render("atendimento/tabdimatendconvbeneval", {
                convs,
                anos,
                benes,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoConvBeneValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    tabdimConvBeneTeraAtendval(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Conv.findOne().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Conv.find().then((conv)=>{
                   conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/tabdimatendconvbeneteraval", {terapias: terapia, convs: conv, anos: ano})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    tabdimAtendimentoConvBeneTeraValFiltro(req, res) {
        const db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        const rawIni = req.body.dataIni;
        const rawFim = req.body.dataFim;
        const rawConv = req.body.relConvid;

        const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
        const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
        const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

        let seg, sex;
        try {
            seg = fncGeral.getDateFromString(safeDataIni, "ini");
            sex = fncGeral.getDateFromString(safeDataFim, "fim");
            if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
            if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
        } catch (err) {
            console.error('[ERRO data]', { rawIni, rawFim, error: err.message });
            return res.status(400).send(`
                <script>
                    alert("Erro nas datas. Verifique o período selecionado.");
                    history.back();
                </script>
            `);
        }

        const filtro = {
            dataIni: safeDataIni,
            dataFim: safeDataFim,
            convid: rawConv || '766f69643132333435366964'
        };

        const periodoDe = fncGeral.getDataInvert(safeDataIni.split(' ')[0]);
        const periodoAte = fncGeral.getDataInvert(safeDataFim.split(' ')[0]);

        Promise.all([
            Atend.find({
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { 
                    $nin: ["Feriado", "Falta Absoluta", "Falta Justificada"] 
                }
            }).exec(),
            Conv.find().exec(),
            Conv.findById(rawConv).exec(),
            Terapia.find().exec(),
            Ano.find().exec(),
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).exec(),
            Bene.find().exec()
        ])
        .then(([atRaw, convs, convSelecionado, terapias, anos, terapeutas, benes]) => {
            console.log('[DEBUG Convênio 3Níveis] rawConv:', rawConv);
            console.log('[DEBUG Convênio 3Níveis] convSelecionado:', convSelecionado);
            console.log('[DEBUG Convênio 3Níveis] Total de atendimentos encontrados:', atRaw.length);

            const lookupTerapia = {};
            terapias.forEach(t => { lookupTerapia[t._id] = t.terapia_nome; });

            const lookupUsuario = {};
            terapeutas.forEach(u => { lookupUsuario[u._id] = u.usuario_nome; });

            const lookupBene = {};
            benes.forEach(b => { lookupBene[b._id] = b.bene_nome; });

            const lookupConv = {};
            convs.forEach(c => { lookupConv[c._id] = c.conv_nome; });

            const toCentavos = (str) => {
                if (!str || typeof str !== 'string') return 0;
                const clean = str.replace(/\D/g, '');
                return clean.length >= 2
                    ? parseInt(clean.slice(0, -2) + clean.slice(-2), 10)
                    : parseInt(clean.padStart(2, '0'), 10);
            };

            // ✅ Função para determinar quais valores usar baseado em atend_org
            const getValoresAtendimento = (at) => {
                const origem = (at.atend_org || '').trim();
                const fixo = at.atend_fixo === "true";
                const categoria = at.atend_categoria;

                if (origem === "Padrão") {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Padrão"
                    };
                } else if (origem === "Administrativo") {
                    if (fixo) {
                        return {
                            cred: at.atend_fixovalorcre || "0,00",
                            deb: at.atend_fixovalordeb || "0,00",
                            tipo: "Fixo"
                        };
                    } else if (categoria === "Substituição") {
                        return {
                            cred: at.atend_mergevalorcre || "0,00",
                            deb: at.atend_mergevalordeb || "0,00",
                            tipo: "Substituição"
                        };
                    } else {
                        return {
                            cred: at.atend_valorcre || "0,00",
                            deb: at.atend_valordeb || "0,00",
                            tipo: "Administrativo"
                        };
                    }
                } else {
                    return {
                        cred: at.atend_valorcre || "0,00",
                        deb: at.atend_valordeb || "0,00",
                        tipo: "Outro"
                    };
                }
            };

            const conv_nome = lookupConv[rawConv] || "(nenhum)";
            
            // ✅ Ordenar beneficiários e terapeutas
            benes.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));
            terapeutas.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome));

            const rel = [];
            let sessaoTotGeral = 0;
            let valTotCredCentavosGeral = 0;
            let valTotDebCentavosGeral = 0;

            // ✅ Ordena globalmente ANTES do agrupamento
            const atOrdenado = atRaw
                .filter(a => a.atend_atenddata)
                .sort((a, b) => {
                    const d1 = new Date(a.atend_atenddata).getTime();
                    const d2 = new Date(b.atend_atenddata).getTime();
                    if (d1 !== d2) return d1 - d2;
                    return (a.atend_atendhora || '').localeCompare(b.atend_atendhora || '');
                });

            console.log('[DEBUG Convênio 3Níveis] Total de atendimentos após ordenação:', atOrdenado.length);

            let totalAtendimentosProcessados = 0;
            let totalAtendimentosDoConvenio = 0;

            // ✅ NÍVEL 1: Agrupar por Beneficiário
            benes.forEach(b => {
                const beneDetalhes = [];
                let sessaoTotBene = 0;
                let valTotCredCentavosBene = 0;
                let valTotDebCentavosBene = 0;

                // ✅ NÍVEL 2: Dentro de cada Beneficiário, agrupar por Terapeuta
                terapeutas.forEach(t => {
                    const detalhes = [];
                    let qtd = 0;
                    let valorCredCentavos = 0;
                    let valorDebCentavos = 0;

                    atOrdenado.forEach(at => {
                        totalAtendimentosProcessados++;

                        // ✅ Verifica se o atendimento pertence ao convênio selecionado
                        const idIgual = (a, b) => ("" + (a || '')).trim() === ("" + (b || '')).trim();
                        if (!idIgual(at.atend_convid, rawConv)) return;

                        totalAtendimentosDoConvenio++;

                        // ✅ Verifica se o atendimento pertence ao beneficiário atual
                        if (!idIgual(at.atend_beneid, b._id)) return;

                        // ✅ Verifica se o atendimento pertence ao terapeuta atual
                        let terapeutaId;
                        switch (at.atend_categoria) {
                            case "Substituição":
                                terapeutaId = at.atend_mergeterapeutaid;
                                break;
                            case "SubstitutoFixo":
                                terapeutaId = at.atend_fixoterapeutaid;
                                break;
                            default:
                                terapeutaId = at.atend_terapeutaid;
                                break;
                        }

                        if (!idIgual(terapeutaId, t._id)) return;

                        // ✅ Determina quais valores usar
                        const valores = getValoresAtendimento(at);
                        
                        const vCredCent = toCentavos(valores.cred);
                        const vDebCent = toCentavos(valores.deb);
                        
                        if (qtd === 0 && vCredCent > 0) valorCredCentavos = vCredCent;
                        if (qtd === 0 && vDebCent > 0) valorDebCentavos = vDebCent;
                        
                        qtd++;

                        let dataFmt = '-';
                        if (at.atend_atenddata) {
                            try {
                                const d = new Date(at.atend_atenddata);
                                if (!isNaN(d.getTime())) {
                                    dataFmt = fncGeral.getDataInvert(d.toISOString().split('T')[0]);
                                }
                            } catch (e) {
                                dataFmt = '-';
                            }
                        }

                        const origemLabel = (() => {
                            const valor = (at.atend_org || '').trim();
                            if (valor === "Administrativo") {
                                return '<span class="label label-sm label-warning">ADM</span>';
                            } else if (valor === "Padrão") {
                                return '<span class="label label-sm label-info">PAD</span>';
                            } else {
                                return '<span class="label label-sm label-default">-</span>';
                            }
                        })();

                        const categoriaLabel = (() => {
                            const c = at.atend_categoria;
                            if (c === "Nenhuma Observação") return '<span class="label label-sm label-warning">Sem Evento</span>';
                            if (c === "Substituição" || c === "Substituto") return '<span class="label label-sm label-pink">Substituição</span>';
                            if (c === "Extra") return '<span class="label label-sm label-purple">Extra</span>';
                            if (c === "Falta") return '<span class="label label-sm label-yellow">Falta</span>';
                            if (c === "Padrão" || c === "SubstitutoFixo") return '<span class="label label-sm label-success">Sem Evento</span>';
                            return c || '-';
                        })();

                        const eventoLabel = at.atend_fixo === "true"
                            ? '<span class="label label-sm label-danger">Substituto Fixo</span>'
                            : '<span class="label label-sm label-success">Padrão</span>';

                        const formatValor = (v) => {
                            if (!v || v.trim() === '' || v === '0,00') {
                                return '-';
                            }
                            return v;
                        };

                        const beneNome = lookupBene[at.atend_beneid] || '-';
                        const convNome = lookupConv[at.atend_convid] || '-';
                        const terapiaOrig = lookupTerapia[at.atend_terapiaid] || '-';
                        const terapeutaOrig = lookupUsuario[at.atend_terapeutaid] || '-';

                        const terapiaFixa = at.atend_fixoterapiaid && at.atend_fixoterapiaid !== '766f69643132333435366964'
                            ? lookupTerapia[at.atend_fixoterapiaid] || '-'
                            : '-';

                        const terapeutaFixo = at.atend_fixoterapeutaid && at.atend_fixoterapeutaid !== '766f69643132333435366964'
                            ? lookupUsuario[at.atend_fixoterapeutaid] || '-'
                            : '-';

                        const terapiaSubst = at.atend_mergeterapiaid && at.atend_mergeterapiaid !== '766f69643132333435366964'
                            ? lookupTerapia[at.atend_mergeterapiaid] || '-'
                            : '-';

                        const terapeutaSubst = at.atend_mergeterapeutaid && at.atend_mergeterapeutaid !== '766f69643132333435366964'
                            ? lookupUsuario[at.atend_mergeterapeutaid] || '-'
                            : '-';

                        detalhes.push({
                            ordem: (detalhes.length + 1).toString(),
                            _id: at._id,
                            data: dataFmt,
                            hora: at.atend_atendhora || '-',
                            beneNome,
                            convNome,
                            origemLabel,
                            categoriaLabel,
                            eventoLabel,
                            terapiaOrig,
                            terapeutaOrig,
                            credOrig: formatValor(at.atend_valorcre || "0,00"),
                            debOrig: formatValor(at.atend_valordeb || "0,00"),
                            terapiaFixa,
                            terapeutaFixo,
                            credFixo: at.atend_fixovalorcre ? formatValor(at.atend_fixovalorcre) : '-',
                            debFixo: at.atend_fixovalordeb ? formatValor(at.atend_fixovalordeb) : '-',
                            terapiaSubst,
                            terapeutaSubst,
                            credSubst: at.atend_mergevalorcre ? formatValor(at.atend_mergevalorcre) : '-',
                            debSubst: at.atend_mergevalordeb ? formatValor(at.atend_mergevalordeb) : '-',
                            credUsado: formatValor(valores.cred),
                            debUsado: formatValor(valores.deb),
                            tipoCalculo: valores.tipo,
                            permiteEdicao: true
                        });
                    });

                    if (qtd === 0) return;

                    // ✅ Cálculo do valor unitário baseado nos valores usados
                    if (valorCredCentavos === 0 && detalhes.length > 0) {
                        const somaCred = detalhes.reduce((s, d) => {
                            const clean = d.credUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                            return s + (clean ? parseInt(clean, 10) : 0);
                        }, 0);
                        valorCredCentavos = Math.round(somaCred / detalhes.length);
                    }

                    if (valorDebCentavos === 0 && detalhes.length > 0) {
                        const somaDeb = detalhes.reduce((s, d) => {
                            const clean = d.debUsado.replace(/<.*?>/g, '').replace(/\D/g, '');
                            return s + (clean ? parseInt(clean, 10) : 0);
                        }, 0);
                        valorDebCentavos = Math.round(somaDeb / detalhes.length);
                    }

                    const totalCredCentavos = valorCredCentavos * qtd;
                    const totalDebCentavos = valorDebCentavos * qtd;

                    beneDetalhes.push({
                        terapeutaId: t._id,
                        terapeutaNome: t.usuario_nome,
                        sessoes: qtd,
                        valorUnitarioCred: fncGeral.formatarReal(valorCredCentavos),
                        valorUnitarioDeb: fncGeral.formatarReal(valorDebCentavos),
                        valorTotalCred: fncGeral.formatarReal(totalCredCentavos),
                        valorTotalDeb: fncGeral.formatarReal(totalDebCentavos),
                        atendimentos: detalhes
                    });

                    sessaoTotBene += qtd;
                    valTotCredCentavosBene += totalCredCentavos;
                    valTotDebCentavosBene += totalDebCentavos;
                });

                if (beneDetalhes.length === 0) return;

                rel.push({
                    beneId: b._id,
                    beneNome: b.bene_nome,
                    sessoes: sessaoTotBene,
                    valorTotalCred: fncGeral.formatarReal(valTotCredCentavosBene),
                    valorTotalDeb: fncGeral.formatarReal(valTotDebCentavosBene),
                    terapeutas: beneDetalhes
                });

                sessaoTotGeral += sessaoTotBene;
                valTotCredCentavosGeral += valTotCredCentavosBene;
                valTotDebCentavosGeral += valTotDebCentavosBene;
            });

            console.log('[DEBUG Convênio 3Níveis] Resumo:');
            console.log('  - Total atendimentos processados:', totalAtendimentosProcessados);
            console.log('  - Total atendimentos do convênio:', totalAtendimentosDoConvenio);
            console.log('  - Total beneficiários com atendimentos:', rel.length);
            console.log('  - Sessões totais:', sessaoTotGeral);

            const total = {
                sessoes: sessaoTotGeral,
                valorCred: fncGeral.formatarReal(valTotCredCentavosGeral),
                valorDeb: fncGeral.formatarReal(valTotDebCentavosGeral),
                totalCred: fncGeral.formatarReal(valTotCredCentavosGeral),
                totalDeb: fncGeral.formatarReal(valTotDebCentavosGeral)
            };

            res.render("atendimento/tabdimatendconvbeneteraval", {
                convs,
                anos,
                benes,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro
            });
        })
        .catch(err => {
            console.error('[ERRO tabdimAtendimentoConvBeneTeraValFiltro]', err);
            res.status(500).send(`
                <script>
                    alert("Erro ao carregar relatório. Tente novamente.");
                    history.back();
                </script>
            `);
        });
    },
    relAtendimentoBene(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        let rel = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Bene.find().then((bene)=>{
            Bene.findOne().then((b)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Terapia.find().then((terapia)=>{
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/relatendvalBene", {terapeutas: terapeuta, terapias: terapia, benes: bene, anos: ano})
        })})})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let rel = [];
        let conv_nome;
        let conv_id;
        let bene_nome;
        let terapiaAtend;
        let terapeutaAtend;
        
        //Filtro persistente
        let filtro = {
            dataIni: req.body.dataIni || '',
            dataFim: req.body.dataFim || '',
            convId: req.body.relConvid || ''
        };
        console.log("req.body.dataIni: "+req.body.dataIni)
        
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        console.log("periodoDe:? "+periodoDe)
        console.log("periodoAte:? "+periodoAte)

        let porHoras;
        console.log("req.body.porHoras: "+req.body.porHoras)
        if (req.body.porHoras == "sim"){
            porHoras = "sim";
        } else {
            porHoras = "nao";
        }
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        console.log("seg: "+seg)
        console.log("sex: "+sex)
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}

        Atend.find(filtroAtend).then((at)=>{console.log("at>"+at.length)
            at = at.filter(a => (""+a.atend_categoria) !== "Feriado");
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            bene.some((b)=>{
                                if((""+b._id) === (""+req.body.relBeneid)){
                                    bene_nome = b.bene_nome;
                                    conv_id = b.bene_convid;
                                    return true;
                                }
                                return false;
                            })
                            Conv.findOne({_id: conv_id}).then((conv)=>{
                                conv_nome = conv.conv_nome;
                                at.sort(function(a, b) {
                                    let d1 = new Date(a.atend_atenddata);
                                    let d2 = new Date(b.atend_atenddata);
                                    //d1.setHours(0);
                                    //d1.setMinutes(0);
                                    //d1.setSeconds(0);
                                    //d2.setHours(0);
                                    //d2.setMinutes(0);
                                    //d2.setSeconds(0);
                                    if(d1 == d2){
                                        return true;
                                    } else {
                                        if(d1 < d2){
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                at.forEach((atend) => {
                                    // ▼▼▼ (1) Formatação de data/hora — mantida como estava ▼▼▼
                                    if (porHoras === "sim") {
                                        let horaFim = parseInt(atend.atend_atendhora.substring(0,2));
                                        let minutoFim = atend.atend_atendhora.substring(3,5);
                                        switch (minutoFim) {
                                            case "00":
                                                horaFim = ("" + horaFim).length === 1 ? "0" + horaFim : "" + horaFim;
                                                minutoFim = "40";
                                                break;
                                            case "20":
                                                minutoFim = "00";
                                                horaFim = ("" + (horaFim + 1)).length === 1 ? "0" + (horaFim + 1) : "" + (horaFim + 1);
                                                break;
                                            case "40":
                                                horaFim = ("" + (horaFim + 1)).length === 1 ? "0" + (horaFim + 1) : "" + (horaFim + 1);
                                                minutoFim = "20";
                                                break;
                                            default:
                                                break;
                                        }
                                        rab.dt = fncGeral.getData(atend.atend_atenddata) + " - " + atend.atend_atendhora + "/" + horaFim + ":" + minutoFim;
                                        rab.hora = horaFim + ":" + minutoFim;
                                        rab.horaIni = atend.atend_atendhora;
                                        rab.horaFim = horaFim + ":" + minutoFim;
                                    } else {
                                        rab.dt = fncGeral.getData(atend.atend_atenddata);
                                    }
                                    rab.dataDia = fncGeral.getData(atend.atend_atenddata);

                                    // ▼▼▼ (2) Normaliza categoria (opcional, mas evita bugs) ▼▼▼
                                    const categorias = (atend.atend_categoria || "")
                                        .trim()
                                        .normalize("NFD")
                                        .replace(/[\u0300-\u036f]/g, ""); // remove acentos

                                    // ▼▼▼ (3) DETECÇÃO CORRETA: só "true" ou "false" ▼▼▼
                                    const ehFixo = atend.atend_fixo === true || atend.atend_fixo === "true"; // ✅ exatamente "true" ou true

                                    // ▼▼▼ (4) LÓGICA PRINCIPAL — prioridade para FIXO ▼▼▼
                                    let terapiaAtend, terapeutaAtend;

                                    if (ehFixo) {
                                        // ✅ PRIORIDADE MÁXIMA: se for fixo, usa fixo* SEMPRE
                                        terapiaAtend = atend.atend_fixoterapiaid;
                                        terapeutaAtend = atend.atend_fixoterapeutaid;
                                        switch (categorias) {
                                           /* case "Falta":
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapiaid;
                                                break;
                                            */
                                            case "SubstitutoFixo":
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = atend.atend_fixoterapiaid || atend.atend_mergeterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid || atend.atend_mergeterapeutaid;
                                                break;
                                            case "Substituicao": // sem acento (depois da normalização)
                                                terapiaAtend = atend.atend_fixoterapiaid || atend.atend_mergeterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid || atend.atend_mergeterapeutaid;
                                                break;
                                            
                                            case "Feriado":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            /*case "FaltaAbsoluta":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            */
                                            default:
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid;
                                                break;
                                        }
                                    } else {
                                        console.log("categorias: "+categorias);
                                        // ❌ Não é fixo: aplica switch (mantendo sua estrutura original)
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        switch (categorias) {
                                            /* case "Falta":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            */
                                            case "Feriado":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            /*case "FaltaAbsoluta":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            */
                                            case "Substituição":
                                            case "Substituicao":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                terapeutaAtend = atend.atend_mergeterapeutaid;
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid;
                                                break;
                                            /*case "Substituicao": // sem acento (depois da normalização)
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid;
                                                break;
                                            */
                                            default:
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                        }
                                    }

                                    // ▼▼▼ (5) Inclusão no relatório ▼▼▼
                                    if (categorias !== "Feriado" && categorias !== "Falta Absoluta" && terapiaAtend !== "break") {
                                        rab.especialidade = terapiaAtend;
                                        rab.profissional = terapeutaAtend;

                                        rel.push(rab);
                                        rab = new RelAtendBene();
                                    }
                                });
                                rel.sort(function(a, b){
                                    let dataODiaA = "";
                                    let dataODiaB = "";
                                    if (a.dataDia == undefined || a.dataDia == "undefined" || a.dataDia == null){
                                        dataODiaA = fncGeral.getData(a.dt);
                                    } else {
                                        dataODiaA = a.dataDia;
                                    }
                                    if (b.dataDia == undefined || b.dataDia == "undefined" || b.dataDia == null){
                                        dataODiaB = fncGeral.getData(b.dt);
                                    } else {
                                        dataODiaB = b.dataDia;
                                    }
                                    let provHourA = a.hora+":0:0";
                                    let provHourB = b.hora+":0:0";
                                    const [diaA, mesA, anoA] = dataODiaA.split('/').map(Number);
                                    const [diaB, mesB, anoB] = dataODiaB.split('/').map(Number);
                                    const [horaA, minA, segA, mSegA] = provHourA.split(':');
                                    const [horaB, minB, segB, mSegB] = provHourB.split(':');
                                    const dataA = new Date(anoA, mesA - 1, diaA, horaA, minA, segA, mSegA);
                                    const dataB = new Date(anoB, mesB - 1, diaB, horaB, minB, segB, mSegB);

                                    return dataA - dataB;
                                })
                                
                                res.render("atendimento/relatendvalBene", {benes: bene, anos: ano, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome, porHoras, filtro})
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },

    relAtendimentoBeneassin(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        let rel = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Bene.find().then((bene)=>{
            Bene.findOne().then((b)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Terapia.find().then((terapia)=>{
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            res.render("atendimento/relatendvalBeneassin", {terapeutas: terapeuta, anos: ano, terapias: terapia, benes: bene})
        })})})})}).catch((err) =>{
            console.log(err)
        })
    },

    relAtendimentoBeneassinFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let u;
        let teraID;
        let usuId;
        let rel = [];
        let dt;
        let conv_cnpj;
        let conv_nome;
        let conv_id;
        let bene_nome;
        let terapiaAtend;
        let terapeutaAtend;
        let porSala;
        
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        
        let filtro = {
            dataIni: req.body.dataIni || '',
            dataFim: req.body.dataFim || '',
            beneId: req.body.relBeneid || ''
        };
        
        let date = new Date();
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        console.log("seg: "+seg)
        console.log("sex: "+sex)
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}
        if (req.body.porSala == "sim"){
            porSala = "sim";
        } else {
            porSala = "nao";
        }
        if (req.body.porHoras == "sim"){
            porHoras = "sim";
        } else {
            porHoras = "nao";
        }
        Atend.find(filtroAtend).then((at)=>{console.log("at>"+at.length)
            at = at.filter(a => (""+a.atend_categoria) !== "Feriado");
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        Sala.find().then((sala)=>{
                            Bene.find().then((bene)=>{
                                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                bene.some((b)=>{
                                    if((""+b._id) === (""+req.body.relBeneid)){
                                        bene_nome = b.bene_nome;
                                        conv_id = b.bene_convid;
                                        return true;
                                    }
                                    return false;
                                })
                                Conv.findOne({_id: conv_id}).then((conv)=>{
                                    conv_nome = conv.conv_nome;
                                    at.sort(function(a, b) {
                                        let d1 = new Date(a.atend_atenddata);
                                        let d2 = new Date(b.atend_atenddata);
                                        //d1.setHours(0);
                                        //d1.setMinutes(0);
                                        //d1.setSeconds(0);
                                        //d2.setHours(0);
                                        //d2.setMinutes(0);
                                        //d2.setSeconds(0);
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    at.forEach((atend)=>{
                                        if (porHoras == "sim"){
                                            let horaFim = parseInt(atend.atend_atendhora.substring(0,2));
                                            let minutoFim = atend.atend_atendhora.substring(3,5);
                                            //console.log("minutoFim: "+minutoFim)
                                            switch (minutoFim) {
                                                case "00":
                                                    horaFim = ((""+(horaFim)+"").length == 1 ? ("0"+(horaFim)+""):(""+(horaFim)+""));
                                                    minutoFim = "40";
                                                    break;
                                                case "20":
                                                    minutoFim = "00";
                                                    horaFim = ((""+(horaFim+1)+"").length == 1 ? ("0"+(horaFim+1)+""):(""+(horaFim+1)+""));
                                                    break;
                                                case "40":
                                                    horaFim = ((""+(horaFim+1)+"").length == 1 ? ("0"+(horaFim+1)+""):(""+(horaFim+1)+""));
                                                    minutoFim = "20";
                                                    break;
                                                default:
                                                    break;
                                            }
                                            rab.dt = (fncGeral.getData(atend.atend_atenddata)) + " - " + atend.atend_atendhora + "/" + horaFim + ":" + minutoFim;
                                            //rab.dt = (fncGeral.getData(atend.atend_atenddata)) + " - " + atend.atend_atendhora + "/" + horaFim + ":" + minutoFim;
                                            rab.dt = (fncGeral.getData(atend.atend_atenddata));
                                            rab.horaIni = atend.atend_atendhora;
                                            rab.horaFim = (horaFim + ":" + minutoFim);
                                        } else {
                                            //console.log("atend.atend_atenddata: "+atend.atend_atenddata)
                                            rab.dt = (fncGeral.getData(atend.atend_atenddata));
                                            //console.log("rab.dt: "+rab.dt)
                                        }
                                        categorias = atend.atend_categoria;
                                        if (atend.atend_fixo == "true"){
                                            terapiaAtend = atend.atend_fixoterapiaid;
                                            terapeutaAtend = atend.atend_fixoterapeutaid;
                                        }
                                        switch (categorias){
                                            /*
                                            case "Apoio":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Extra":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Falta":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Glosa":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Padrão":
                                                console.log("WTF?")
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                console.log("PADRAO: "+atend)
                                                break;
                                            case "Pais":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                terapeutaAtend = atend.atend_mergeterapeutaid;
                                                break;
                                            case "Supervisão":
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                            case "Falta Justificada":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                                */
                                            case "Feriado":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            case "Falta Absoluta":
                                                terapiaAtend = "break";
                                                terapeutaAtend = "break";
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = atend.atend_fixoterapiaid;
                                                terapeutaAtend = atend.atend_fixoterapeutaid;
                                                break;
                                            default:
                                                terapiaAtend = atend.atend_terapiaid;
                                                terapeutaAtend = atend.atend_terapeutaid;
                                                break;
                                        }
                                        if (porSala == "sim"){
                                            sala.forEach((s)=>{
                                                if ((""+atend.atend_salaid+"") == (""+s._id+"")){
                                                    if ((""+s.sala_nome+"").includes("Escola")){
                                                        rab.sala = "Escola ou Domicílio";
                                                    } else {
                                                        rab.sala = "Clínica";
                                                    }
                                                }
                                            })
                                        }
                                        rab.especialidade = terapiaAtend;
                                        rab.profissional = terapeutaAtend;

                                        if (terapiaAtend != "break" && terapeutaAtend != "break"){
                                            rel.push(rab);
                                        }
                                        rab = new RelAtendBene();
                                    });
                                    rel.sort(function(a, b) {
                                        let d1 = new Date(fncGeral.getDataRevert(a.dt));
                                        let d2 = new Date(fncGeral.getDataRevert(b.dt));
                                        d1.setHours(d1.getHours() + 3);
                                        d2.setHours(d2.getHours() + 3);
                                        if (porHoras == "sim"){
                                            let h1 = a.horaFim;
                                            let h2 = b.horaFim;
                                            d1.setHours(parseInt(h1.substring(0,2)));
                                            d2.setHours(parseInt(h2.substring(0,2)));
                                            d1.setMinutes(parseInt(h1.substring(3,5)));
                                            d2.setMinutes(parseInt(h2.substring(3,5)));
                                        }
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    res.render("atendimento/relatendvalBeneassin", {benes: bene, anos: ano, terapeutas: terapeuta, salas:sala, terapias: terapia, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome, porHoras, porSala, filtro})
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    
    relAtendimentoBeneCons(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Bene.findOne().then((bene)=>{
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            Conv.find().then((conv)=>{
                    res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, anos: ano, convs: conv})
        })})})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneConsFiltroLegado(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let convid;

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let conv_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            Conv.find().then((conv)=>{
                conv_nome = conv.conv_nome;
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                        bene_nome = b.bene_nome;
                        convid = b.bene_convid;
                        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                terapia.forEach((t)=>{
                                    //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                    qtdIds = 0;
                                    creValFinal = 0;
                                    atends = [];
                                    at.forEach((ats)=>{
                                        categorias = ats.atend_categoria
                                            //console.log("categorias: "+categorias);
                                        switch (categorias){
                                            case "Apoio":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Extra":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Falta":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Falta Justificada":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Falta Absoluta":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Feriado":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Glosa":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Padrão":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Pais":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Supervisão":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            default:
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                        }
                                        if((""+terapiaAtend) === (""+t._id)){
                                            atends.push(ats);
                                        }
                                    })
                                    
                                    atends.forEach((atend)=>{
                                        categorias = atend.atend_categoria
                                        switch (categorias){
                                            case "Apoio":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Extra":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Falta":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Falta Justificada":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Falta Absoluta":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Feriado":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Glosa":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Padrão":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Pais":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Supervisão":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            default:
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                        }

                                        if ((""+t._id) === (""+terapiaAtend)){
                                            qtdIds++;
                                            creValFinal = creVal;
                                            //console.log("TERAPIA OK")
                                        }
                                    })

                                    if(qtdIds != 0){
                                        a.sessoes = qtdIds;
                                        a.nomecid = t._id;
                                        a.valor = creVal;
                                        /*
                                        if (creVal == "0,00" || creVal == "undefined"){
                                            cre.forEach((c)=>{
                                                if (c.convcre_convid === convid && c.convcre_terapiaid == t._id){
                                                    a.valor = c.convcre_valor;
                                                    console.log("a.valor: "+a.valor)
                                                }
                                            });
                                        } else {
                                            a.valor = creVal;
                                        }
                                        */

                                        //console.log("qtdIds: "+qtdIds+" - t._id: "+t._id+" - creVal: "+creVal)
                                    }
                                    
                                    if(qtdIds != 0){
                                        rel.push(a);
                                        a = new RelAtend();
                                    }
                                })
                                rel.forEach((r)=>{
                                    val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                    val = fncGeral.mascaraValores(val);
                                    r.total = val;

                                    valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                    sessaoTot += r.sessoes;
                                    //console.log("r.sessoes: " + r.sessoes)
                                    //console.log("r.nomecid: " + r.nomecid)
                                    //console.log("r.valor: " + r.valor)
                                })
                                total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                            res.render("atendimento/relatendvalcons", {terapias: terapia, anos: ano, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, conv_nome, convs: conv})
                        })})
                    })
                })
            })
        })
    },

    //
    relAtendimentoBeneConsFiltroOLD(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let arrayconvid = [];
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let conv_nome;

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            at.forEach((aa)=>{
                if (!arrayconvid.includes((""+aa.atend_convid+""))){
                    arrayconvid.push((""+aa.atend_convid+""));
                }
            })
            Conv.find().then((c)=>{
                conv_nome = c.conv_nome;
                console.log("nome convênio: "+conv_nome);
                Convcre.find().then((cre)=>{
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                                bene_nome = b.bene_nome;
                                cc.then((convcre)=>{
                                    /*
                                    convcre.forEach((c)=>{
                                        Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                                            c.convcre_convCpfCnpj = conv.conv_cnpj;
                                        })
                                    })
                                        */
                                    Terapia.find().then((terapia)=>{
                                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                        at.forEach((aaaar)=>{
                                            if (aaaar.atend_categoria == "Substituição"){
                                                //console.log("aaaarcategoria: "+aaaar.atend_categoria);
                                                //console.log("aaaaratend_fixo: "+aaaar.atend_fixo);
                                                /*
                                                terapia.forEach((tera)=>{
                                                    if ((""+aaaar.atend_terapiaid) === (""+tera._id)){
                                                        console.log("TERA: "+tera.terapia_nome)
                                                    }
                                                    if ((""+aaaar.atend_mergeterapiaid) === (""+tera._id)){
                                                        console.log("TERAsub: "+tera.terapia_nome)
                                                    }
                                                })
                                                    */
                                                //console.log("aaaaratend_terapiaid: "+aaaar.atend_terapiaid);
                                                //console.log("aaaaratend_mergeterapiaid: "+aaaar.atend_mergeterapiaid);
                                            }
                                        })
                                        arrayconvid.forEach((convid)=>{
                                        terapia.forEach((t)=>{
                                            //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                            qtdIds = 0;
                                            creValFinal = 0;
                                            atends = [];
                                            at.forEach((ats)=>{
                                                if ((""+ats.atend_convid+"") == (""+convid+"")){
                                                    categorias = ats.atend_categoria
                                                    if (ats.atend_fixo == "true" && categorias != "Feriado" && categorias != "Falta Absoluta"){
                                                        terapiaAtend = ats.atend_fixoterapiaid;
                                                        //console.log("ats.atend_fixoterapiaid: "+ats.atend_fixoterapiaid)
                                                    } else {
                                                        
                                                        //console.log("categorias: "+categorias);
                                                        switch (categorias){
                                                            case "Feriado":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "Falta Absoluta":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "SubstitutoFixo":
                                                                terapiaAtend = ats.atend_fixoterapiaid;
                                                                break;
                                                            default:
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                        }
                                                    }
                                                    if((""+terapiaAtend) === (""+t._id)){
                                                        atends.push(ats);
                                                    }
                                                }
                                            })
                                            
                                            atends.forEach((atend)=>{
                                                if ((""+atend.atend_convid+"") == (""+convid+"")){
                                                categorias = atend.atend_categoria
                                                
                                                if (atend.atend_fixo == "true" && categorias != "Feriado" && categorias != "Falta Absoluta"){
                                                    terapiaAtend = atend.atend_fixoterapiaid;
                                                    creVal = atend.atend_fixovalorcre;
                                                } else {
                                                    switch (categorias){
                                                        case "Feriado":
                                                            terapiaAtend = "break";
                                                            break;
                                                        case "Feriado":
                                                            terapiaAtend = "break";
                                                            break;
                                                        case "SubstitutoFixo":
                                                            terapiaAtend = atend.atend_fixoterapiaid;
                                                            creVal = atend.atend_fixovalorcre;
                                                            break;
                                                        default:
                                                            terapiaAtend = atend.atend_terapiaid;
                                                            creVal = atend.atend_valorcre;
                                                            break;
                                                    }
                                                }
                                                console.log("atend: "+atend)
                //Abrir comentar aqui
                                                //Atencao Analise 0 acima
                                                if (categorias != "Feriado" && categorias != "Falta Absoluta" && categorias != "Falta Justificada" && atend.atend_fixo == "true" && (creVal == undefined || creVal == "undefined" || creVal == "0,00")){
                                                    let convcreval;
                                                    let convcreTes;
                                                    let agendacreTes;
                                                    terapiaAtend = atend.atend_fixoterapiaid;
                                                    agendacreTes = ""+atend.atend_convid + atend.atend_fixoterapiaid+"";
                                                    convcre.forEach((ccre)=>{
                                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                        if( convcreTes == agendacreTes){
                                                            convcreval = ccre.convcre_valor;
                                                        }
                                                    })
                                                    creVal = convcreval;
                                                }
                //Fechar Comentar aqui
                                                if ((""+t._id) === (""+terapiaAtend)){
                                                    qtdIds++;
                                                    creValFinal = creVal;
                                                    console.log("creVal: "+creVal)
                                                }
                                                }
                                            })

                                            if(qtdIds != 0){
                                                if ((""+t._id+"") == "625597a973ddf46dc778a576"){
                                                    console.log("terapia_nomecid"+t.terapia_nomecid)
                                                }
                                                a.valor = creValFinal;
                                                a.sessoes = qtdIds;
                                                a.nomecid = t._id;
                                                a.convid = convid;

                                                console.log("a: "+a.valor);
                                                rel.push(a);
                                                a = new RelAtend();
                                            }
                                        })
                                        })
                                        rel.forEach((r)=>{
                                            console.log("r: "+r.nomecid);
                                            console.log("r: "+r.valor);
                                            console.log("r: "+r.sessoes);
                                            console.log("r: "+r.convid);
                                            if (r.valor == "0,00" || r.valor == undefined || r.valor == "undefined"){
                                                console.log("ENTROU!!!!!!!!!!!!!!!!")
                                                cre.forEach((c)=>{
                                                    if ((""+c.convcre_convid) == (""+r.convid) && (""+c.convcre_terapiaid) == (""+r.nomecid)){
                                                        r.valor = c.convcre_valor;
                                                    }
                                                });
                                                if (r.valor == undefined || r.valor == "undefined" || r.valor == "N,aN"){
                                                    r.valor = "0,00";
                                                }
                                            }
                                            console.log("r.valor|: "+r.valor)
                                            val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                            val = fncGeral.mascaraValores(val);
                                            console.log("VAL: "+val)
                                            r.total = val;

                                            valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                            sessaoTot += r.sessoes;
                                            //console.log("r.sessoes: " + r.sessoes)
                                            //console.log("r.nomecid: " + r.nomecid)
                                            //console.log("r.valor: " + r.valor)
                                        })
                                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                                        res.render("atendimento/relatendvalcons", {terapias: terapia, anos: ano, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, conv_nome})
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    //
    relAtendimentoBeneConsFiltro(req, res) {// adicionado nome do convenio vinculado ao beneficiário 2025/08/29 wagner
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();
        let val;
        let valTot = 0;
        let sessaoTot = 0;
        let rel = [];
        let total;
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        console.log("req.body.dataIni: "+req.body.dataIni)
        console.log("req.body.dataFim: "+req.body.dataFim)
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");

        console.log("seg: "+seg)
        console.log("sex: "+sex)
        let arrayconvid = [];
        let bene_nome;
        let conv_nome = "Convênio não encontrado"; // Valor padrão
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);

        //Filtro persistente
        let filtro = {
            dataIni: req.body.dataIni || '',
            dataFim: req.body.dataFim || '',
            convId: req.body.relConvid || ''
        };

        Atend.find({
            atend_beneid: req.body.relBeneid,
            atend_atenddata: { $gte: seg, $lte: sex }
        }).then(async (at) => {
            console.log("at:length: " + at.length);

            // Coletar convênios dos atendimentos (para uso no relatório)
            at.forEach((aa) => {
                if (!arrayconvid.includes("" + aa.atend_convid)) {
                    arrayconvid.push("" + aa.atend_convid);
                }
            });

            // === BUSCAR BENEFICIÁRIO ===
            const b = await Bene.findOne({ _id: req.body.relBeneid });
            if (!b) {
                return res.status(404).send("Beneficiário não encontrado");
            }
            bene_nome = b.bene_nome;

            // === BUSCAR CONVÊNIO DO BENEFICIÁRIO (bene_convid) ===
            if (b.bene_convid) {
                const conv = await Conv.findOne({ _id: b.bene_convid });
                if (conv) {
                    conv_nome = conv.conv_nome;
                } else {
                    conv_nome = "Convênio não cadastrado";
                }
            } else {
                conv_nome = "Sem convênio vinculado";
            }

            // === CARREGAR DADOS RESTANTES ===
            const cre = await Convcre.find();
            const ano = await Ano.find();
            const bene = await Bene.find();
            const terapia = await Terapia.find();
            bene.sort((a, b) =>
                (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
                    ? 1 : -1
            );
            terapia.sort((a, b) => (a.terapia_nome > b.terapia_nome ? 1 : (b.terapia_nome > a.terapia_nome ? -1 : 0)));

            // === PROCESSAR RELATÓRIO DE ATENDIMENTOS ===
            arrayconvid.forEach((convid) => {
                terapia.forEach((t) => {
                    qtdIds = 0;
                    creValFinal = 0;
                    atends = [];

                    at.forEach((ats) => {
                        if ("" + ats.atend_convid === "" + convid) {
                            categorias = ats.atend_categoria;
                            if (ats.atend_fixo === "true" && categorias !== "Feriado" && categorias !== "Falta Absoluta") {
                                terapiaAtend = ats.atend_fixoterapiaid;
                            } else {
                                switch (categorias) {
                                    case "Feriado":
                                    case "Falta Absoluta":
                                        terapiaAtend = "break";
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = ats.atend_fixoterapiaid;
                                        break;
                                    default:
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                }
                            }
                            if ("" + terapiaAtend === "" + t._id) {
                                atends.push(ats);
                            }
                        }
                    });

                    atends.forEach((atend) => {
                        if ("" + atend.atend_convid === "" + convid) {
                            categorias = atend.atend_categoria;
                            if (atend.atend_fixo === "true" && categorias !== "Feriado" && categorias !== "Falta Absoluta") {
                                terapiaAtend = atend.atend_fixoterapiaid;
                                creVal = atend.atend_fixovalorcre;
                            } else {
                                switch (categorias) {
                                    case "Feriado":
                                    case "Falta Absoluta":
                                        terapiaAtend = "break";
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = atend.atend_fixoterapiaid;
                                        creVal = atend.atend_fixovalorcre;
                                        break;
                                    default:
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                }
                            }

                            // Corrigir valor CRE se necessário
                            if (
                                categorias !== "Feriado" &&
                                categorias !== "Falta Absoluta" &&
                                categorias !== "Falta Justificada" &&
                                atend.atend_fixo === "true" &&
                                (!creVal || creVal === "undefined" || creVal === "0,00")
                            ) {
                                let agendacreTes = "" + atend.atend_convid + atend.atend_fixoterapiaid;
                                const ccreEncontrado = cre.find(ccre =>
                                    "" + ccre.convcre_convid + ccre.convcre_terapiaid === agendacreTes
                                );
                                creVal = ccreEncontrado ? ccreEncontrado.convcre_valor : "0,00";
                            }

                            if ("" + t._id === "" + terapiaAtend) {
                                qtdIds++;
                                creValFinal = creVal;
                            }
                        }
                    });

                    if (qtdIds !== 0) {
                        a.valor = creValFinal;
                        a.sessoes = qtdIds;
                        a.nomecid = t._id;
                        a.convid = convid;
                        rel.push(a);
                        a = new RelAtend();
                    }
                });
            });

            // === CALCULAR TOTAIS ===
            rel.forEach((r) => {
                if (!r.valor || r.valor === "undefined" || r.valor === "N,aN") {
                    const ccre = cre.find(c =>
                        "" + c.convcre_convid === "" + r.convid &&
                        "" + c.convcre_terapiaid === "" + r.nomecid
                    );
                    r.valor = ccre ? ccre.convcre_valor : "0,00";
                }

                val = (parseInt(r.valor.toString().replace(",", "").replace(".", "")) * r.sessoes).toString();
                val = fncGeral.mascaraValores(val);
                r.total = val;

                valTot = fncGeral.mascaraValores(
                    parseInt(valTot.toString().replace(",", "").replace(".", "")) +
                    parseInt(val.toString().replace(",", "").replace(".", ""))
                );
                sessaoTot += r.sessoes;
            });

            total = { sessoes: sessaoTot, valor: valTot, total: valTot };

            // === RENDERIZAR COM O NOME DO CONVÊNIO DO BENEFICIÁRIO ===
            res.render("atendimento/relatendvalcons", {
                terapias: terapia,
                anos: ano,
                benes: bene,
                rels: rel,
                total,
                filtro,
                periodoDe,
                periodoAte,
                bene_nome,
                conv_nome  // <-- Agora é o nome do convênio do beneficiário!
            });

        }).catch(err => {
            console.error("Erro ao gerar relatório:", err);
            res.status(500).send("Erro interno ao gerar relatório.");
        });
    },
    relAtendimentoBeneConsFiltro2(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        console.log("relAtendimentoBeneConsFiltro");

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let convid;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            Convcre.find().then((cre)=>{
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                            bene_nome = b.bene_nome;
                            convid = b.bene_convid;
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                terapia.forEach((t)=>{
                                    //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                    qtdIds = 0;
                                    creValFinal = 0;
                                    atends = [];
                                    at.forEach((ats)=>{
                                        categorias = ats.atend_categoria
                                        //console.log("categorias: "+categorias);
                                        switch (categorias){
                                            case "Apoio":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Extra":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Falta":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Falta Justificada":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Falta Absoluta":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Feriado":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Glosa":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Padrão":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Pais":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                break;
                                            case "Supervisão":
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                            default:
                                                terapiaAtend = ats.atend_terapiaid;
                                                break;
                                        }
                                        if((""+terapiaAtend) === (""+t._id)){
                                            atends.push(ats);
                                        }
                                    })
                                    
                                    atends.forEach((atend)=>{
                                        categorias = atend.atend_categoria
                                        switch (categorias){
                                            case "Apoio":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Extra":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Falta":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Falta Justificada":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Falta Absoluta":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Feriado":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "Glosa":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Padrão":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Pais":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Substituição":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_mergevalorcre;
                                                break;
                                            case "SubstitutoFixo":
                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            case "Supervisão":
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                            default:
                                                terapiaAtend = atend.atend_terapiaid;
                                                creVal = atend.atend_valorcre;
                                                break;
                                        }

                                        if ((""+t._id) === (""+terapiaAtend)){
                                            qtdIds++;
                                        }
                                    })

                                    if(qtdIds != 0){
                                        a.sessoes = qtdIds;
                                        a.nomecid = t._id;
                                        if (creVal == "0,00"){
                                            cre.forEach((c)=>{
                                                if (c.convcre_convid === convid && c.convcre_terapiaid == t._id){
                                                    a.valor = c.convcre_valor;
                                                    console.log("a.valor: "+a.valor)
                                                }
                                            });
                                        } else {
                                            a.valor = creVal;
                                        }
                                        
                                        a.valor = creVal;
                                    }
                                    
                                    if(qtdIds != 0){
                                        rel.push(a);
                                        a = new RelAtend();
                                    }
                                })
                                rel.forEach((r)=>{
                                    //console.log("valorconv:"+r.valor)
                                    val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                    console.log("val:"+val)
                                    val = fncGeral.mascaraValores(val);
                                    r.total = val;

                                    valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                    sessaoTot += r.sessoes;
                                    //console.log("r.sessoes: " + r.sessoes)
                                    //console.log("r.nomecid: " + r.nomecid)
                                    //console.log("r.valor: " + r.valor)
                                })
                                total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                                res.render("atendimento/relatendvalcons", {terapias: terapia, anos: ano, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                            })
                        })
                    })
                })
            })
        })
    },
    relAtendimentoValNf(req,res){//relatório emissão de NF
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Bene.findOne().then((bene)=>{
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/relatendvalnf", {terapias: terapia, benes: bene, anos: ano})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValNfFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convimp = getModel(db, 'tb_convimp', convimpClass.ConvimpSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let arrayconvid = [];
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let bene_retem;
        let bene_doc;
        let bene_tomador;
        let conv_nome;
        let bene_convid;
        let convid;

        //Filtro persistente
        let filtro = {
            dataIni: req.body.dataIni || '',
            dataFim: req.body.dataFim || '',
        };
        console.log("req.body.dataIni:"+req.body.dataIni);
        console.log("req.body.dataFim:"+req.body.dataFim);

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            //console.log("at:length: "+at.length);
            at.forEach((aa)=>{
                if (!arrayconvid.includes((""+aa.atend_convid+""))){
                    arrayconvid.push((""+aa.atend_convid+""));
                }
            })
            Convimp.find({convimp_convid: bene_convid}).then((convimp)=>{
                Convcre.find().then((cre)=>{
                    Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                                bene_nome = b.bene_nome;
                                bene_retem = b.bene_ordemretem,
                                bene_doc = b.bene_ordemdoc,
                                bene_tomador = b.bene_ordemnome,
                                conv_nome =b.conv_nome,
                                bene_convid = b.bene_convid;
                                convid = b.bene_convid;
                                cc.then((convcre)=>{
                                    Terapia.find().then((terapia)=>{
                                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                        arrayconvid.forEach((convid)=>{
                                            terapia.forEach((t)=>{
                                                //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                                qtdIds = 0;
                                                creValFinal = 0;
                                                atends = [];
                                                at.forEach((ats)=>{
                                                    if ((""+ats.atend_convid+"") == (""+convid+"")){
                                                    if (ats.atend_fixo == "true"){
                                                        terapiaAtend = ats.atend_fixoterapiaid;
                                                        //console.log("ats.atend_fixoterapiaid: "+ats.atend_fixoterapiaid)
                                                    } else {
                                                        categorias = ats.atend_categoria
                                                        //console.log("categorias: "+categorias);
                                                        switch (categorias){
                                                            case "Feriado":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "Falta Absoluta":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "SubstitutoFixo":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            default:
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                        }
                                                    }
                                                    if((""+terapiaAtend) === (""+t._id)){
                                                        atends.push(ats);
                                                    }
                                                    }
                                                })
                                                
                                                atends.forEach((atend)=>{
                                                    if ((""+atend.atend_convid+"") == (""+convid+"")){
                                                    categorias = atend.atend_categoria
                                                    if (atend.atend_fixo == "true" && categorias != "Feriado"){
                                                        terapiaAtend = atend.atend_fixoterapiaid;
                                                        creVal = atend.atend_fixovalorcre;
                                                        //console.log("ats.atend_fixoterapiaid: "+ats.atend_fixoterapiaid)
                                                    } else {
                                                        switch (categorias){
                                                            case "Feriado":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "Falta Absoluta":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "SubstitutoFixo":
                                                                terapiaAtend = atend.atend_mergeterapiaid;
                                                                creVal = atend.atend_fixovalorcre;
                                                                break;
                                                            default:
                                                                terapiaAtend = atend.atend_terapiaid;
                                                                creVal = atend.atend_valorcre;
                                                                break;
                                                        }
                                                    }
                                                    if (categorias != "Feriado" && categorias != "Falta Absoluta" && categorias != "Falta Justificada" && atend.atend_fixo == "true" && (creVal == "0,00" || creVal == undefined || creVal == "undefined")){
                                                        let convcreval;
                                                        let convcreTes;
                                                        let agendacreTes;
                                                        terapiaAtend = atend.atend_fixoterapiaid;
                                                        agendacreTes = ""+atend.atend_convid + atend.atend_fixoterapiaid+"";
                                                        convcre.forEach((ccre)=>{
                                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                            if( convcreTes == agendacreTes){
                                                                convcreval = ccre.convcre_valor;
                                                            }
                                                        })
                                                        creVal = convcreval;
                                                    }

                                                    if ((""+t._id) === (""+terapiaAtend)){
                                                        qtdIds++;
                                                        creValFinal = creVal;
                                                        //console.log("TERAPIA OK")
                                                    }
                                                    }
                                                })

                                                if(qtdIds != 0){
                                                    a.valor = creValFinal;
                                                    a.sessoes = qtdIds;
                                                    a.nomecid = t._id;
                                                    a.convid = convid;
                                                }
                                                
                                                if(qtdIds != 0){
                                                    rel.push(a);
                                                    a = new RelAtend();
                                                }
                                            })
                                        })
                                        rel.forEach((r)=>{
                                            cre.forEach((c)=>{
                                                if ((""+c.convcre_convid) == (""+r.convid) && (""+c.convcre_terapiaid) == (""+r.nomecid)){
                                                    r.valor = c.convcre_valor;
                                                }
                                            });
                                            val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                            val = fncGeral.mascaraValores(val);
                                            r.total = val;

                                            valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                            sessaoTot += r.sessoes;
                                            //console.log("r.sessoes: " + r.sessoes)
                                            //console.log("r.nomecid: " + r.nomecid)
                                            //console.log("r.valor: " + r.valor)
                                        })
                                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                                        res.render("atendimento/relatendvalnf", {terapias: terapia, anos: ano, convimps: convimp, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, bene_retem, bene_doc, bene_tomador, conv_nome, filtro})
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
    },
    relAtendimentoValNfFiltro2(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convimp = getModel(db, 'tb_convimp', convimpClass.ConvimpSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let arrayconvid = [];
        let convid;
        let cc = convcreClass.convcreCarregarTodos(req,res);
        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let bene_retem;
        let bene_doc;
        let bene_tomador;
        let conv_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            at.forEach((aa)=>{
                if (!arrayconvid.includes((""+aa.atend_convid+""))){
                    arrayconvid.push((""+aa.atend_convid+""));
                }
            })
            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                        bene_nome = b.bene_nome;
                        bene_retem = b.bene_ordemretem,
                        bene_doc = b.bene_ordemdoc,
                        bene_tomador = b.bene_ordemnome,
                        conv_nome =b.conv_nome,
                        bene_convid = b.bene_convid;
                        convid = b.bene_convid;
                        cc.then((convcre)=>{
                            Convcre.find().then((cre)=>{
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                                    at.forEach((aaaar)=>{
                                        if (aaaar.atend_categoria == "Substituição"){
                                            //console.log("aaaarcategoria: "+aaaar.atend_categoria);
                                            //console.log("aaaaratend_fixo: "+aaaar.atend_fixo);
                                            /*
                                            terapia.forEach((tera)=>{
                                                if ((""+aaaar.atend_terapiaid) === (""+tera._id)){
                                                    console.log("TERA: "+tera.terapia_nome)
                                                }
                                                if ((""+aaaar.atend_mergeterapiaid) === (""+tera._id)){
                                                    console.log("TERAsub: "+tera.terapia_nome)
                                                }
                                            })
                                                */
                                            //console.log("aaaaratend_terapiaid: "+aaaar.atend_terapiaid);
                                            //console.log("aaaaratend_mergeterapiaid: "+aaaar.atend_mergeterapiaid);
                                        }
                                    })
                                    arrayconvid.forEach((convid)=>{
                                        terapia.forEach((t)=>{
                                            //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                            qtdIds = 0;
                                            creValFinal = 0;
                                            atends = [];
                                            at.forEach((ats)=>{
                                                if ((""+ats.atend_convid+"") == (""+convid+"")){
                                                    if (ats.atend_fixo == "true"){
                                                        terapiaAtend = ats.atend_fixoterapiaid;
                                                        //console.log("ats.atend_fixoterapiaid: "+ats.atend_fixoterapiaid)
                                                    } else {
                                                        categorias = ats.atend_categoria
                                                        //console.log("categorias: "+categorias);
                                                        switch (categorias){
                                                            case "Apoio":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Extra":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Falta":
                                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                                //terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Falta Justificada":
                                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                                break;
                                                            case "Falta Absoluta":
                                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                                break;
                                                            case "Feriado":
                                                                terapiaAtend = "break";
                                                                break;
                                                            case "Glosa":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Padrão":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Pais":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            case "Substituição":
                                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                                break;
                                                            case "SubstitutoFixo":
                                                                terapiaAtend = ats.atend_mergeterapiaid;
                                                                break;
                                                            case "Supervisão":
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                            default:
                                                                terapiaAtend = ats.atend_terapiaid;
                                                                break;
                                                        }
                                                    }
                                                    if((""+terapiaAtend) === (""+t._id)){
                                                        atends.push(ats);
                                                    }
                                                }
                                            })
                                            
                                            atends.forEach((atend)=>{
                                                if ((""+atend.atend_convid+"") == (""+convid+"")){
                                                categorias = atend.atend_categoria
                                                
                                                switch (categorias){
                                                    case "Apoio":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                    case "Extra":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                    case "Falta":
                                                        //console.log("atend.atend_mergeterapiaid"+atend.atend_mergeterapiaid)
                                                        //if (atend.atend_mergeterapiaid){
                                                            terapiaAtend = atend.atend_mergeterapiaid;
                                                            creVal = atend.atend_mergevalorcre;
                                                        //} else {
                                                        //    terapiaAtend = atend.atend_terapiaid;
                                                        //}
                                                        //terapiaAtend = atend.atend_terapiaid;
                                                        break;
                                                    case "Falta Justificada":
                                                        terapiaAtend = atend.atend_mergeterapiaid;
                                                        creVal = atend.atend_mergevalorcre;
                                                        break;
                                                    case "Falta Absoluta":
                                                        terapiaAtend = atend.atend_mergeterapiaid;
                                                        creVal = atend.atend_mergevalorcre;
                                                        break;
                                                    case "Feriado":
                                                        terapiaAtend = "break";
                                                        break;
                                                    case "Glosa":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        break;
                                                    case "Padrão":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                    case "Pais":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                    case "Substituição":
                                                        terapiaAtend = atend.atend_mergeterapiaid;
                                                        creVal = atend.atend_mergevalorcre;
                                                        break;
                                                    case "SubstitutoFixo":
                                                        terapiaAtend = atend.atend_mergeterapiaid;
                                                        creVal = atend.atend_mergevalorcre;
                                                        break;
                                                    case "Supervisão":
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                    default:
                                                        terapiaAtend = atend.atend_terapiaid;
                                                        creVal = atend.atend_valorcre;
                                                        break;
                                                }
                                                if (categorias != "Feriado" && atend.atend_fixo == "true"){
                                                    let convcreval;
                                                    let convcreTes;
                                                    let agendacreTes;
                                                    terapiaAtend = atend.atend_fixoterapiaid;
                                                    agendacreTes = ""+atend.atend_convid + atend.atend_fixoterapiaid+"";
                                                    convcre.forEach((ccre)=>{
                                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                        if( convcreTes == agendacreTes){
                                                            convcreval = ccre.convcre_valor;
                                                        }
                                                    })
                                                    creVal = convcreval;
                                                }

                                                if ((""+t._id) === (""+terapiaAtend)){
                                                    qtdIds++;
                                                    creValFinal = creVal;
                                                    //console.log("TERAPIA OK")
                                                }
                                            }
                                        })

                                        if(qtdIds != 0){
                                            a.valor = creValFinal;
                                            a.sessoes = qtdIds;
                                            a.nomecid = t._id;
                                            a.convid = convid;
                                        }
                                        
                                        if(qtdIds != 0){
                                            rel.push(a);
                                            a = new RelAtend();
                                        }
                                    })
                                })
                                rel.forEach((r)=>{
                                    cre.forEach((c)=>{
                                        if ((""+c.convcre_convid) == (""+r.convid) && (""+c.convcre_terapiaid) == (""+r.nomecid)){
                                            r.valor = c.convcre_valor;
                                        }
                                    });
                                    val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                    val = fncGeral.mascaraValores(val);
                                    r.total = val;

                                    valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                    sessaoTot += r.sessoes;
                                    //console.log("r.sessoes: " + r.sessoes)
                                    //console.log("r.nomecid: " + r.nomecid)
                                    //console.log("r.valor: " + r.valor)
                                })
                                total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};
                                Conv.findOne({_id: bene_convid}).then((conv)=>{
                                    console.log("conv:"+conv)
                                    conv_nome = conv.conv_nome;
                                    Convimp.find({convimp_convid: bene_convid}).then((convimp)=>{
                                        console.log("convimp:"+convimp)
                                        //calculo dos impostos sobre o valor total da NF
                                        //res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                                        res.render("atendimento/relatendvalnf", {terapias: terapia, convimps: convimp, anos: ano, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, bene_retem, bene_doc, bene_tomador, conv_nome/*, retornoStrings: retornoString*/})
                                        })
                                    })
                                })//Terapia
                            })//Convcre
                        })//cc
                    })//BeneOne
                })//Bene
            })//Ano
        })//Atend
    },
    backup_relAtendimentoValNfFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let convid;

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let bene_retem;
        let bene_doc;
        let bene_tomador;
        let conv_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                    bene_nome = b.bene_nome;
                    bene_retem = b.bene_ordemretem,
                    bene_doc = b.bene_ordemdoc,
                    bene_tomador = b.bene_ordemnome,
                    conv_nome =b.conv_nome,
                    bene_convid = b.bene_convid;
                    convid = b.bene_convid;
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                        terapia.forEach((t)=>{
                            //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                            qtdIds = 0;
                            creValFinal = 0;
                            atends = [];
                            at.forEach((ats)=>{
                                categorias = ats.atend_categoria
                                    //console.log("categorias: "+categorias);
                                switch (categorias){
                                    case "Apoio":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Extra":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Falta":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Falta Justificada":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Falta Absoluta":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Feriado":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Pais":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Substituição":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = ats.atend_mergeterapiaid;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    default:
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                }
                                if((""+terapiaAtend) === (""+t._id)){
                                    atends.push(ats);
                                }
                            })
                            
                            atends.forEach((atend)=>{
                                categorias = atend.atend_categoria
                                switch (categorias){
                                    case "Apoio":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Extra":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Falta":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Falta Justificada":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Falta Absoluta":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Feriado":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Pais":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    case "Substituição":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        creVal = atend.atend_mergevalorcre;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                    default:
                                        terapiaAtend = atend.atend_terapiaid;
                                        creVal = atend.atend_valorcre;
                                        break;
                                }

                                if ((""+t._id) === (""+terapiaAtend)){
                                    qtdIds++;
                                    creValFinal = creVal;
                                    //console.log("TERAPIA OK")
                                }
                            })

                            if(qtdIds != 0){
                                a.sessoes = qtdIds;
                                a.nomecid = t._id;
                                a.valor = creVal;
                                /*
                                if (creVal == "0,00" || creVal == "undefined"){
                                    console.log("VAI TOMA NO CU")
                                    cre.forEach((c)=>{
                                        if (c.convcre_convid === convid && c.convcre_terapiaid == t._id){
                                            a.valor = c.convcre_valor;
                                            console.log("a.valor: "+a.valor)
                                        }
                                    });
                                } else {
                                    a.valor = creVal;
                                }
                                */

                                //console.log("qtdIds: "+qtdIds+" - t._id: "+t._id+" - creVal: "+creVal)
                            }
                            
                            if(qtdIds != 0){
                                rel.push(a);
                                a = new RelAtend();
                            }
                        })
                        rel.forEach((r)=>{
                            val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                            val = fncGeral.mascaraValores(val);
                            r.total = val;

                            valTot = fncGeral.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                            sessaoTot += r.sessoes;
                            //console.log("r.sessoes: " + r.sessoes)
                            //console.log("r.nomecid: " + r.nomecid)
                            //console.log("r.valor: " + r.valor)
                        })
                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};
                        Conv.findOne({_id: bene_convid}).then((conv)=>{
                            conv_nome = conv.conv_nome;
                        
                        //res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                        res.render("atendimento/relatendvalnf", {terapias: terapia, anos: ano, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, bene_retem, bene_doc, bene_tomador, conv_nome/*, retornoStrings: retornoString*/})
                        })
                    })
                })
            })
        })
         })//conv
    },
    copiarAtends(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)

        let arrayAtends =[];
        let arrIds = req.body.idsCopia;
        let arrayIds = arrIds.split(",");
        let datas = req.body.dtCopia;
        let arrayData = datas.split(",");
        let quantidades = req.body.qtdCopia;
        let arrayQuantidade = quantidades.split(",");
        //let arrCategs = req.body.categoriaCopia;
        //let arrayCategs = arrCategs.split(",");
        let dataAtual = new Date();
        var atendCopia;
        let qtd;
        let nextNumAtendCopiar;
        let nextNum;
        let dataAtendData;
        let horaAtendHora;

        arrayQuantidade.forEach((aq)=>{
            console.log("quantidade!"+aq);
        })
        if (arrayIds.length == arrayData.length && arrayData.length == arrayQuantidade.length){
            //let i = 0;
            Atend.find().sort({atend_num : -1}).limit(1).then((ultimoAtend) =>{
                ultimoAtend.forEach((ua)=>{
                    nextNum = ua.atend_num;
                })
                //arrayIds.forEach((a)=>{
                console.log("arrayIds.length:"+arrayIds.length);
                let tamanho = parseInt(arrayIds.length);
                for (var i = 0; i < tamanho;i++){
                    qtd = parseInt(arrayQuantidade[i]);
                    dataAtendData = arrayData[i];
                    nextNumAtendCopiar = parseInt(arrayIds[i]);

                    if (qtd != undefined && dataAtendData != undefined && nextNumAtendCopiar != undefined){
                        let j = 0;
//testar com o nextNumAtendCopiar string e int
                        let idAtend = new ObjectId(arrayIds[i]);
                        Atend.findOne({_id: idAtend}).then((a)=>{
                            atendCopia = a;
                            
                            /*
                            a.forEach((atendCopiar)=>{
                                if (atendCopiar.atend_atendhora.length == 5){
                                    
                                    horaAtendHora = atendCopiar.atend_atendhora
                                    console.log("atendCopiar:"+atendCopiar);
                                } else {
                                    if (atendCopia == undefined){
                                        atendCopia = atendCopiar;
                                    }
                                    console.log("não bateu:"+atendCopiar);
                                }
                            })
                            */
                        }).catch((error)=>{
                            console.log("ERRO ao obter nextNum");console.log(error);
                        }).finally(()=>{
                            console.log("qtd:"+qtd);
                            for (var k = 0;k < qtd; k++){
                                nextNum = nextNum + 1;
                                console.log("atendCopia:"+atendCopia);

                                let atendimentoNovo = new Atend();

                                atendimentoNovo.atend_org = atendCopia.atend_org;
                                //atendimentoNovo.atend_categoria = arrayCategs[i];
                                atendimentoNovo.atend_categoria = atendCopia.atend_categoria;
                                atendimentoNovo.atend_atendhora = atendCopia.atend_atendhora;
                                if (atendCopia.atend_beneid != undefined){atendimentoNovo.atend_beneid = atendCopia.atend_beneid;}
                                if (atendCopia.atend_convid != undefined){atendimentoNovo.atend_convid = atendCopia.atend_convid;}
                                if (atendCopia.atend_usuid != undefined){atendimentoNovo.atend_usuid = atendCopia.atend_usuid;}
                                //console.log("dataAtendData"+i+":"+dataAtendData);
                                atendimentoNovo.atend_atenddata = dataAtendData;
                                //console.log("atendCopia:"+atendCopia);
                                if (atendCopia.atend_atendhora != undefined){atendimentoNovo.atend_atendhora = atendCopia.atend_atendhora;} else {atendimentoNovo.atend_atendhora = "08:00"}
                                if (atendCopia.atend_terapeutaid != undefined){atendimentoNovo.atend_terapeutaid = atendCopia.atend_terapeutaid;}
                                if (atendCopia.atend_terapiaid != undefined){atendimentoNovo.atend_terapiaid = atendCopia.atend_terapiaid;}
                                if (atendCopia.atend_salaid != undefined){atendimentoNovo.atend_salaid = atendCopia.atend_salaid;}
                                if (atendCopia.atend_valorcre != undefined){atendimentoNovo.atend_valorcre = atendCopia.atend_valorcre;}
                                if (atendCopia.atend_valordeb != undefined){atendimentoNovo.atend_valordeb = atendCopia.atend_valordeb;}
                                if (atendCopia.atend_mergeterapeutaid != undefined){atendimentoNovo.atend_mergeterapeutaid = atendCopia.atend_mergeterapeutaid;}
                                if (atendCopia.atend_mergeterapiaid != undefined){atendimentoNovo.atend_mergeterapiaid = atendCopia.atend_mergeterapiaid;}
                                if (atendCopia.atend_mergevalorcre != undefined){atendimentoNovo.atend_mergevalorcre = atendCopia.atend_mergevalorcre;}
                                if (atendCopia.atend_mergevalordeb != undefined){atendimentoNovo.atend_mergevalordeb = atendCopia.atend_mergevalordeb;}
                                if (atendCopia.atend_fixoterapeutaid != undefined){atendimentoNovo.atend_fixoterapeutaid = atendCopia.atend_fixoterapeutaid;}
                                if (atendCopia.atend_fixoterapiaid != undefined){atendimentoNovo.atend_fixoterapiaid = atendCopia.atend_fixoterapiaid;}
                                if (atendCopia.atend_fixovalorcre != undefined){atendimentoNovo.atend_fixovalorcre = atendCopia.atend_fixovalorcre;}
                                if (atendCopia.atend_fixovalordeb != undefined){atendimentoNovo.atend_fixovalordeb = atendCopia.atend_fixovalordeb;}
                                if (atendCopia.atend_datacad != undefined){atendimentoNovo.atend_datacad = dataAtual.toISOString();}
                                atendimentoNovo.atend_num = nextNum;
                                //console.log("atendimentoNovo:"+atendimentoNovo);

                                Atend.find({_id: atendimentoNovo._id}).then((atendimentoExitente)=>{
                                    if (atendimentoExitente.length > 0){
                                        atendimentoExitente.forEach((at)=>{
                                            console.log("at:"+at);
                                        })
                                        var id = new mongoose.Types.ObjectId();
                                        atendimentoNovo._id = id;
                                    }
                                })
                                atendimentoNovo.save();
                                arrayAtends.push(atendimentoNovo);
                            }
                            /*
                            console.log("arrayAtends.length:"+arrayAtends.length);
                            if (arrayAtends.length > 0){
                                console.log("GERAR!");
                                Atend.insertMany(arrayAtends, function(error, docs) {
                                    if (error){
                                        console.log("error:"+error);
                                    } else {
                                        console.log("TUDO LIMPO!");
                                    }
                                });
                                //arrayAtends.forEach((atend) => {atend.save();});
                            }
                            */
                        })
                    }
                }
            }).catch((error)=>{console.log("ERRO ao obter atendimento");console.log(error);})
        }
        this.filtraAtend(req,res);
    },
    /* Relatório por Terapeuta*/
      /* Consolidado Por Terapia*/
    relAtendterapiacons(req,res){
        res.render("atendimento/atendreltera/relatendterapiacons")
    },
   
    relAtendterapiaconsFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema)
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)
        Perfil = getModel(db, 'tb_perfil', perfilClass.PerfilSchema)

        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
        let beneAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let count;
        let continuar = false;
       
        let idsToRemove = [];
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAgendaFixo = {agenda_data: { $gte: seg, $lte: sex }, agenda_temp: false}
       

        //Filtro persistente
        let filtro = {
            dataIni: req.body.dataIni || '',
            dataFim: req.body.dataFim || '',
        };

        console.log("req.body.dataIni:"+req.body.dataIni);
        console.log("req.body.dataFim:"+req.body.dataFim);

        Agenda.find(filtroAgendaFixo).then((agendaFixa)=>{
            console.log("agendaFixa: "+agendaFixa.length)
            let idsTemp =[];
            agendaFixa.forEach((af)=>{
                idsTemp.push(af._id);
            })
            filtroAgendaSemanal = { $or: [ {agenda_tempId: { $in: idsTemp }},{agenda_data: { $gte: seg, $lte: sex },agenda_temp: true} ] };
            Agenda.find(filtroAgendaSemanal).then((agendaSemanal)=>{
                console.log("agendaSemanal: "+agendaSemanal.length)
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                               
                                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                                    terapeuta.some((t)=>{
                                        if((""+t._id) === (""+req.body.relTeraid)){
                                            terapeuta_nome = t.usuario_nome;
                                            return true;
                                        }
                                        return false;
                                    })
                                    agendaFinal = agendaSemanal;
                                    agendaFixa.forEach((af)=>{
                                        continuar = "true";
                                        agendaSemanal.forEach((as)=>{
                                            if ((""+af._id) == (""+as.agenda_tempId)){
                                                continuar = "false";
                                            }
                                        })

                                        if (continuar == "true"){
                                            agendaFinal.push(af);
                                        }
                                    })
                                    
                                    Terapia.find().then((terapia)=>{
                                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        //console.log("at.length:"+at.length)
                                        agendaFinal.sort(function(a, b) {
                                            let d1 = new Date(a.agenda_data);
                                            let d2 = new Date(b.agenda_data);
                                            d1.setHours(0);
                                            d1.setMinutes(0);
                                            d1.setSeconds(0);
                                            d2.setHours(0);
                                            d2.setMinutes(0);
                                            d2.setSeconds(0);
                                            if(d1 == d2){
                                                return true;
                                            } else {
                                                if(d1 < d2){
                                                    return -1;
                                                } else {
                                                    return true;
                                                }
                                            }
                                        });

                                        terapia.forEach((t)=>{
                                            let rab = new RelAtend();
                                            count = 0;
                                        
                                            agendaFinal.forEach((agenda)=>{
                                                continuar = "true";
                                                if (agenda.agenda_data.getTimezoneOffset() == 180){
                                                    agenda.agenda_data.setHours(agenda.agenda_data.getHours()+3);
                                                }
                                                rab.dt = agenda.agenda_data;

                                                let hours = (""+agenda.agenda_data.getHours());
                                                let mins = (""+agenda.agenda_data.getMinutes());
                                                if (hours.length == 1){
                                                    hours = "0"+hours;
                                                }
                                                if (mins.length == 1){
                                                    mins = "0"+mins;
                                                }

                                                rab.hora = (hours+":"+mins);
                                                categorias = agenda.agenda_categoria;
                                                //console.log("categorias: "+categorias)
                                                switch (categorias){
                                                    case "Apoio":// aparece nos 2
                                                        if (agenda.agenda_usuid == req.body.relTeraid){
                                                            terapiaAtend = agenda.agenda_terapiaid;
                                                            terapeutaAtend = agenda.agenda_usuid;
                                                        } else {
                                                            terapiaAtend = agenda.agenda_terapiaid;
                                                            terapeutaAtend = agenda.agenda_usuid;
                                                        }
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "Extra":
                                                        if (agenda.agenda_usuid == req.body.relTeraid){
                                                            terapiaAtend = agenda.agenda_terapiaid;
                                                            terapeutaAtend = agenda.agenda_usuid;
                                                        } else {
                                                            continuar = "false";
                                                        }
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "Falta":
                                                        if (agenda.agenda_usuid == req.body.relTeraid){
                                                            terapiaAtend = agenda.agenda_terapiaid;
                                                            terapeutaAtend = agenda.agenda_usuid;
                                                        } else {
                                                            continuar = "false";
                                                        }
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "Falta Justificada":
                                                        continuar = "false";
                                                        //terapiaAtend = agenda.agenda_terapiaid;
                                                        //terapeutaAtend = agenda.agenda_usuid;
                                                        break;
                                                    case "Falta Absoluta":
                                                        continuar = "false";
                                                        //terapiaAtend = agenda.agenda_terapiaid;
                                                        //terapeutaAtend = agenda.agenda_usuid;
                                                        break;
                                                    case "Feriado":
                                                        continuar = "false";
                                                        //terapiaAtend = agenda.agenda_terapiaid;
                                                        //terapeutaAtend = agenda.agenda_usuid;
                                                        break;
                                                    case "Padrão":
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "Substituição":// so sub
                                                        if (agenda.agenda_usuid == req.body.relTeraid){
                                                            terapiaAtend = agenda.agenda_terapiaid;
                                                            terapeutaAtend = agenda.agenda_usuid;
                                                        } else {
                                                            continuar = "false";
                                                        }
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "SubstitutoFixo":
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    case "Supervisão":
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                    default:
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                        beneAtend = agenda.agenda_beneid;
                                                        break;
                                                }
                                                let teraTemp;
                                                if (continuar == "true"){
                                                    terapia.some((temp)=>{
                                                        if ((""+temp._id+"") == (""+terapiaAtend+"")){
                                                            teraTemp = temp;
                                                        }
                                                    })
                                                    console.log("t: "+t)
                                                    console.log("teraTemp: "+teraTemp)
                                                    if ((""+t.terapia_nomecid) == (""+teraTemp.terapia_nomecid)){
                                                        count++;
                                                        if (count == 1){
                                                            //conv_bene + terapia = valor cre e deb
                                                            let benetemp;
                                                            let valdeb;

                                                            bene.some((b)=>{
                                                                if((""+b._id) === (""+beneAtend)){
                                                                    bene_nome = b.bene_nome;
                                                                    benetemp = b.bene_convid;
            
                                                                    return true;
                                                                }
                                                                return false;
                                                            })
        
                                                            convdeb.forEach((cdeb)=>{
                                                                if ((""+cdeb.convdeb_convid) == (""+benetemp) && (""+cdeb.convdeb_terapiaid)  == (""+terapiaAtend)){
                                                                    valdeb = cdeb.convdeb_valor;
                                                                }
                                                            })
                                                            rab.nomecid = terapiaAtend;
                                                            rab.valor = valdeb;
                                                        }
                                                        rab.sessoes = count;
                                                        idsToRemove.push(agenda._id);
                                                    }
                                                }
                                            })
                                            if (count > 0){
                                                rab.total =  fncGeral.mascaraValores(parseInt(rab.valor.toString().replace(",","").replace(".","")) * rab.sessoes);

                                                rel.push(rab);
                                            }
                                            idsToRemove.forEach((itr)=>{
                                                agendaFinal = agendaFinal.filter(af => (""+af._id) !== (""+itr));
                                            })
                                            
                                        })
                                        
                                        res.render("atendimento/atendreltera/relatendterapiacons", {terapeutas: terapeuta, terapeutalistas: terapeutalista, anos: ano, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, filtro})
                                    })
                                    })
                               
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
      /* Analitico*/
    relAtendteraana: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
            const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
            const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);

            // Verifica se há filtro (via POST ou query)
            const hasFilter = req.body.relTeraid || (req.query && req.query.dataIni);

            if (!hasFilter) {
                // Renderiza formulário vazio
                const [anos, benes, terapeutas, terapias] = await Promise.all([
                    Ano.find().exec(),
                    Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }).exec(),
                    Usuario.find({
                        usuario_status: "Ativo",
                        $or: [
                            { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                            { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).sort({ usuario_nome: 1 }).exec(),
                    Terapia.find().sort({ terapia_nome: 1 }).exec()
                ]);

                return res.render("atendimento/atendreltera/relatendteraana", {
                    rels: [],
                    anos,
                    benes,
                    terapeutas,
                    terapias,
                    periodoDe: '',
                    periodoAte: '',
                    terapeuta_nome: '',
                    pesquisa: { dataIni: '', dataFim: '', terapeuta: '' }
                });
            }

            // === Com filtro ===
            const dataIni = fncGeral.getDateFromString(req.body.dataIni || req.query.dataIni, "ini");
            const dataFim = fncGeral.getDateFromString(req.body.dataFim || req.query.dataFim, "fim");
            const terapeutaId = req.body.relTeraid || req.query.relTeraid;

            dataIni.setHours(0, 0, 0, 0);
            dataFim.setHours(23, 59, 59, 999);

            const filtroAgendaFixo = {
                agenda_data: { $gte: dataIni, $lte: dataFim },
                agenda_temp: false,
                agenda_usuid: terapeutaId
            };

            const agendaFixa = await Agenda.find(filtroAgendaFixo).exec();
            const idsTemp = agendaFixa.map(af => af._id);

            const filtroAgendaSemanal = {
                $or: [
                    { agenda_tempId: { $in: idsTemp } },
                    { agenda_data: { $gte: dataIni, $lte: dataFim }, agenda_temp: true, agenda_usuid: terapeutaId }
                ]
            };

            const agendaSemanal = await Agenda.find(filtroAgendaSemanal).exec();
            console.log("agendaFixa:", agendaFixa.length);
            console.log("agendaSemanal:", agendaSemanal.length);

            let agendaFinal = [...agendaSemanal];
            agendaFixa.forEach(af => {
                const exists = agendaSemanal.some(as => String(as.agenda_tempId) === String(af._id));
                if (!exists) agendaFinal.push(af);
            });

            // Carregar dados auxiliares
            const [anos, benes, terapeutas, terapias] = await Promise.all([
                Ano.find().exec(),
                Bene.find({ bene_status: "Ativo" }).sort({ bene_nome: 1 }).exec(),
                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                }).sort({ usuario_nome: 1 }).exec(),
                Terapia.find().sort({ terapia_nome: 1 }).exec()
            ]);

            // Obter nome do terapeuta
            const terapeutaSelecionado = terapeutas.find(t => String(t._id) === String(terapeutaId));
            const terapeuta_nome = terapeutaSelecionado ? terapeutaSelecionado.usuario_nome : '';

            // Processar relatório
            const rel = [];
            agendaFinal.forEach(agenda => {
                const categorias = agenda.agenda_categoria;
                const isRelevante = [
                    "Apoio", "Extra", "Falta", "Padrão", "Substituição",
                    "SubstitutoFixo", "Supervisão"
                ].includes(categorias);

                if (!isRelevante) return;

                const dt = new Date(agenda.agenda_data);
                if (dt.getTimezoneOffset() === 180) dt.setHours(dt.getHours() + 3);

                const hours = String(dt.getHours()).padStart(2, '0');
                const mins = String(dt.getMinutes()).padStart(2, '0');

                rel.push({
                    dt: fncGeral.getDataInvert(fncGeral.getDataFMT(dt)),
                    hora: `${hours}:${mins}`,
                    especialidade: agenda.agenda_terapiaid,
                    profissional: agenda.agenda_usuid,
                    beneficiario: agenda.agenda_beneid
                });
            });

            rel.sort((a, b) => new Date(fncGeral.getDataRevert(a.dt)) - new Date(fncGeral.getDataRevert(b.dt)));

            const periodoDe = fncGeral.getDataInvert(req.body.dataIni || req.query.dataIni);
            const periodoAte = fncGeral.getDataInvert(req.body.dataFim || req.query.dataFim);

            res.render("atendimento/atendreltera/relatendteraana", {
                rels: rel,
                anos,
                benes,
                terapeutas,
                terapias,
                periodoDe,
                periodoAte,
                terapeuta_nome,
                pesquisa: {
                    dataIni: req.body.dataIni || req.query.dataIni || '',
                    dataFim: req.body.dataFim || req.query.dataFim || '',
                    terapeuta: terapeutaId
                }
            });

        } catch (err) {
            console.error("Erro em relAtendteraana:", err);
            res.status(500).send("Erro ao carregar o relatório.");
        }
    },
    relAtendteraanaFiltroOLD(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        //Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let continuar = false;
        let pesquisa = new Pesquisa();
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAgendaFixo = {agenda_data: { $gte: seg, $lte: sex }, agenda_temp: false, agenda_usuid: req.body.relTeraid}
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Agenda.find(filtroAgendaFixo).then((agendaFixa)=>{
                console.log("agendaFixa: "+agendaFixa.length)
                let idsTemp =[];
                agendaFixa.forEach((af)=>{
                    idsTemp.push(af._id);
                })
                filtroAgendaSemanal = { $or: [ {agenda_tempId: { $in: idsTemp }},{agenda_data: { $gte: seg, $lte: sex },agenda_temp: true,agenda_usuid: req.body.relTeraid} ] };
                Agenda.find(filtroAgendaSemanal).then((agendaSemanal)=>{
                    console.log("agendaSemanal: "+agendaSemanal.length)
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Usuario.find({
                            "usuario_status": "Ativo",
                            $or: [
                                {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                                {"usuario_perfilid":{$in:["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                            ]
                            }).then((terapeuta)=>{
                        
                            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                            terapeuta.some((t)=>{
                                if((""+t._id) === (""+req.body.relTeraid)){
                                    terapeuta_nome = t.usuario_nome;
                                    return true;
                                }
                                return false;
                            })

                            agendaFinal = agendaSemanal;
                            agendaFixa.forEach((af)=>{
                                continuar = "true";
                                agendaSemanal.forEach((as)=>{
                                    if ((""+af._id) == (""+as.agenda_tempId)){
                                        continuar = "false";
                                    }
                                })

                                if (continuar == "true"){
                                    agendaFinal.push(af);
                                }
                            })
                            
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("at.length:"+at.length)
                                agendaFinal.sort(function(a, b) {
                                    let d1 = new Date(a.agenda_data);
                                    let d2 = new Date(b.agenda_data);
                                    d1.setHours(0);
                                    d1.setMinutes(0);
                                    d1.setSeconds(0);
                                    d2.setHours(0);
                                    d2.setMinutes(0);
                                    d2.setSeconds(0);
                                    if(d1 == d2){
                                        return true;
                                    } else {
                                        if(d1 < d2){
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                agendaFinal.forEach((agenda)=>{
                                    continuar = "true";
                                    if (agenda.agenda_data.getTimezoneOffset() == 180){
                                        agenda.agenda_data.setHours(agenda.agenda_data.getHours()+3);
                                    }
                                    rab.dt = agenda.agenda_data;

                                    let hours = (""+agenda.agenda_data.getHours());
                                    let mins = (""+agenda.agenda_data.getMinutes());
                                    if (hours.length == 1){
                                        hours = "0"+hours;
                                    }
                                    if (mins.length == 1){
                                        mins = "0"+mins;
                                    }

                                    rab.hora = (hours+":"+mins);
                                    categorias = agenda.agenda_categoria;
                                    //console.log("categorias: "+categorias)
                                    switch (categorias){
                                        case "Apoio":// aparece nos 2
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            }
                                            break;
                                        case "Extra":
                                            
                                                continuar = "false";
                                            
                                            break;
                                        case "Falta":
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            }
                                            break;
                                        case "Falta Justificada":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Falta Absoluta":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Feriado":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Glosa":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Padrão":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Substituição":// so sub
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                continuar = "false";
                                            }
                                            break;
                                        case "SubstitutoFixo":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Supervisão":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        default:
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                    }
                                    if (continuar == "true"){
                                        rab.especialidade = terapiaAtend;
                                        rab.profissional = terapeutaAtend;
                                        rab.beneficiario = agenda.agenda_beneid

                                        rel.push(rab);
                                        rab = new RelAtendBene();
                                    }
                                });

                                rel.sort(function(a, b) {
                                    let d1 = a.dt;
                                    let d2 = b.dt;

                                    if(d1 == d2){
                                        return true;//a.especialidade > b.especialidade ? 1 : -1;
                                    } else {
                                        return d1 > d2 ? 1 : -1;
                                    }
                                });
                                rel.forEach((r)=>{
                                    r.dt = fncGeral.getDataInvert(fncGeral.getDataFMT(r.dt));
                                })
                                res.render("atendimento/atendreltera/relatendteraana", {terapeutas: terapeuta, anos: ano, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa})
                            })    
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },

    relAtendteraanaFiltro2(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        //Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let continuar = false;
        let pesquisa = new Pesquisa();
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAtend = {atend_atenddata: { $gte: seg, $lte: sex }, $or: [{ atend_terapeutaid: req.body.relTeraid },{ atend_mergeterapeutaid: req.body.relTeraid }]}
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Atend.find(filtroAtend).then((atend)=>{
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Usuario.find({
                        "usuario_status": "Ativo",
                        $or: [
                            {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                            {"usuario_perfilid":{$in:["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                        ]
                        }).then((terapeuta)=>{
                    
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                        terapeuta.some((t)=>{
                            if((""+t._id) === (""+req.body.relTeraid)){
                                terapeuta_nome = t.usuario_nome;
                                return true;
                            }
                            return false;
                        })

                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                            //console.log("at.length:"+at.length)
                            atend.sort(function(a, b) {
                                let d1 = new Date(a.atend_atenddata);
                                let d2 = new Date(b.atend_atenddata);
                                d1.setHours(0);
                                d1.setMinutes(0);
                                d1.setSeconds(0);
                                d2.setHours(0);
                                d2.setMinutes(0);
                                d2.setSeconds(0);
                                if(d1 == d2){
                                    return true;
                                } else {
                                    if(d1 < d2){
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });

                            atend.forEach((a)=>{
                                continuar = "true";
                                if (a.atend_atenddata.getTimezoneOffset() == 180){
                                    a.atend_atenddata.setHours(a.atend_atenddata.getHours()+3);
                                }
                                rab.dt = a.atend_atenddata;

                                let hours = (""+a.atend_atenddata.getHours());
                                let mins = (""+a.atend_atenddata.getMinutes());
                                if (hours.length == 1){
                                    hours = "0"+hours;
                                }
                                if (mins.length == 1){
                                    mins = "0"+mins;
                                }

                                rab.hora = (hours+":"+mins);
                                categorias = a.agenda_categoria;
                                //console.log("categorias: "+categorias)
                                switch (categorias){
                                    case "Apoio":// aparece nos 2
                                        if (a.atend_terapeutaid == req.body.relTeraid){
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        } else {
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        }
                                        break;
                                    case "Extra":
                                        if (a.atend_terapeutaid == req.body.relTeraid){
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        } else {
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        }
                                        break;
                                    case "Falta":
                                        if (a.atend_terapeutaid == req.body.relTeraid){
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        } else {
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        }
                                        break;
                                    case "Falta Justificada":
                                        continuar = "false";
                                        //terapiaAtend = a.atend_terapiaid;
                                        //terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Falta Absoluta":
                                        continuar = "false";
                                        //terapiaAtend = a.atend_terapiaid;
                                        //terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Feriado":
                                        continuar = "false";
                                        //terapiaAtend = a.atend_terapiaid;
                                        //terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Glosa":
                                        continuar = "false";
                                        //terapiaAtend = a.atend_terapiaid;
                                        //terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = a.atend_terapiaid;
                                        terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Substituição":// so sub
                                        if (a.atend_terapeutaid == req.body.relTeraid){
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        } else {
                                            continuar = "false";
                                        }
                                        break;
                                    case "SubstitutoFixo":
                                        terapiaAtend = a.atend_terapiaid;
                                        terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = a.atend_terapiaid;
                                        terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                    default:
                                        terapiaAtend = a.atend_terapiaid;
                                        terapeutaAtend = a.atend_terapeutaid;
                                        break;
                                }
                                if (continuar == "true"){
                                    rab.especialidade = terapiaAtend;
                                    rab.profissional = terapeutaAtend;
                                    rab.beneficiario = a.atend_beneid

                                    rel.push(rab);
                                    rab = new RelAtendBene();
                                }
                            });

                            rel.sort(function(a, b) {
                                let d1 = a.dt;
                                let d2 = b.dt;

                                if(d1 == d2){
                                    return true;//a.especialidade > b.especialidade ? 1 : -1;
                                } else {
                                    return d1 > d2 ? 1 : -1;
                                }
                            });
                            rel.forEach((r)=>{
                                r.dt = fncGeral.getDataInvert(fncGeral.getDataFMT(r.dt));
                            })

                            // === INÍCIO: LÓGICA DE SOMA POR TERAPIA (inserida sem alterar o existente) ===
                            let somaPorTerapia = {};
                            rel.forEach((item) => {
                                let terapiaId = String(item.especialidade);
                                if (somaPorTerapia[terapiaId]) {
                                    somaPorTerapia[terapiaId]++;
                                } else {
                                    somaPorTerapia[terapiaId] = 1;
                                }
                            });

                            let totaisTerapia = [];
                            for (let id in somaPorTerapia) {
                                let terapiaNome = 'Desconhecida';
                                for (let t of terapia) {
                                    if (String(t._id) === id) {
                                        terapiaNome = t.terapia_nome;
                                        break;
                                    }
                                }
                                totaisTerapia.push({ terapiaId: id, terapiaNome: terapiaNome, total: somaPorTerapia[id] });
                            }
                            // === FIM: LÓGICA DE SOMA POR TERAPIA ===
                            let totalGeral = totaisTerapia.reduce((soma, item) => soma + item.total, 0);

                            res.render("atendimento/atendreltera/relatendteraana", {terapeutas: terapeuta, anos: ano, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa, totaisTerapia, totalGeral})
                        })    
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    relAtendteraanaFiltroOLD3(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        //Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let continuar = false;
        let pesquisa = new Pesquisa();
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAgendaFixo = {agenda_data: { $gte: seg, $lte: sex }, agenda_temp: false, agenda_usuid: req.body.relTeraid}
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Agenda.find(filtroAgendaFixo).then((agendaFixa)=>{
                console.log("agendaFixa: "+agendaFixa.length)
                let idsTemp =[];
                agendaFixa.forEach((af)=>{
                    idsTemp.push(af._id);
                })
                filtroAgendaSemanal = { $or: [ {agenda_tempId: { $in: idsTemp }},{agenda_data: { $gte: seg, $lte: sex },agenda_temp: true,agenda_usuid: req.body.relTeraid} ] };
                Agenda.find(filtroAgendaSemanal).then((agendaSemanal)=>{
                    console.log("agendaSemanal: "+agendaSemanal.length)
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Usuario.find({
                            "usuario_status": "Ativo",
                            $or: [
                                {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                                {"usuario_perfilid":{$in:["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                            ]
                            }).then((terapeuta)=>{
                        
                            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                            terapeuta.some((t)=>{
                                if((""+t._id) === (""+req.body.relTeraid)){
                                    terapeuta_nome = t.usuario_nome;
                                    return true;
                                }
                                return false;
                            })

                            agendaFinal = agendaSemanal;
                            agendaFixa.forEach((af)=>{
                                continuar = "true";
                                agendaSemanal.forEach((as)=>{
                                    if ((""+af._id) == (""+as.agenda_tempId)){
                                        continuar = "false";
                                    }
                                })

                                if (continuar == "true"){
                                    agendaFinal.push(af);
                                }
                            })
                            
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("at.length:"+at.length)
                                agendaFinal.sort(function(a, b) {
                                    let d1 = new Date(a.agenda_data);
                                    let d2 = new Date(b.agenda_data);
                                    d1.setHours(0);
                                    d1.setMinutes(0);
                                    d1.setSeconds(0);
                                    d2.setHours(0);
                                    d2.setMinutes(0);
                                    d2.setSeconds(0);
                                    if(d1 == d2){
                                        return true;
                                    } else {
                                        if(d1 < d2){
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                agendaFinal.forEach((agenda)=>{
                                    continuar = "true";
                                    if (agenda.agenda_data.getTimezoneOffset() == 180){
                                        agenda.agenda_data.setHours(agenda.agenda_data.getHours()+3);
                                    }
                                    rab.dt = agenda.agenda_data;

                                    let hours = (""+agenda.agenda_data.getHours());
                                    let mins = (""+agenda.agenda_data.getMinutes());
                                    if (hours.length == 1){
                                        hours = "0"+hours;
                                    }
                                    if (mins.length == 1){
                                        mins = "0"+mins;
                                    }

                                    rab.hora = (hours+":"+mins);
                                    categorias = agenda.agenda_categoria;
                                    //console.log("categorias: "+categorias)
                                    switch (categorias){
                                        case "Apoio":// aparece nos 2
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            }
                                            break;
                                        case "Extra":
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            }
                                            break;
                                        case "Falta":
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            }
                                            break;
                                        case "Falta Justificada":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Falta Absoluta":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Feriado":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Glosa":
                                            continuar = "false";
                                            //terapiaAtend = agenda.agenda_terapiaid;
                                            //terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Padrão":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Substituição":// so sub
                                            if (agenda.agenda_usuid == req.body.relTeraid){
                                                terapiaAtend = agenda.agenda_terapiaid;
                                                terapeutaAtend = agenda.agenda_usuid;
                                            } else {
                                                continuar = "false";
                                            }
                                            break;
                                        case "SubstitutoFixo":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        case "Supervisão":
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                        default:
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                            break;
                                    }
                                    if (continuar == "true"){
                                        rab.especialidade = terapiaAtend;
                                        rab.profissional = terapeutaAtend;
                                        rab.beneficiario = agenda.agenda_beneid

                                        rel.push(rab);
                                        rab = new RelAtendBene();
                                    }
                                });

                                rel.sort(function(a, b) {
                                    let d1 = a.dt;
                                    let d2 = b.dt;

                                    if(d1 == d2){
                                        return true;//a.especialidade > b.especialidade ? 1 : -1;
                                    } else {
                                        return d1 > d2 ? 1 : -1;
                                    }
                                });
                                rel.forEach((r)=>{
                                    r.dt = fncGeral.getDataInvert(fncGeral.getDataFMT(r.dt));
                                })

                                // === INÍCIO: LÓGICA DE SOMA POR TERAPIA (inserida sem alterar o existente) ===
                                let somaPorTerapia = {};
                                rel.forEach((item) => {
                                    let terapiaId = String(item.especialidade);
                                    if (somaPorTerapia[terapiaId]) {
                                        somaPorTerapia[terapiaId]++;
                                    } else {
                                        somaPorTerapia[terapiaId] = 1;
                                    }
                                });

                                let totaisTerapia = [];
                                for (let id in somaPorTerapia) {
                                    let terapiaNome = 'Desconhecida';
                                    for (let t of terapia) {
                                        if (String(t._id) === id) {
                                            terapiaNome = t.terapia_nome;
                                            break;
                                        }
                                    }
                                    totaisTerapia.push({ terapiaId: id, terapiaNome: terapiaNome, total: somaPorTerapia[id] });
                                }
                                // === FIM: LÓGICA DE SOMA POR TERAPIA ===
                                let totalGeral = totaisTerapia.reduce((soma, item) => soma + item.total, 0);

                                res.render("atendimento/atendreltera/relatendteraana", {terapeutas: terapeuta, anos: ano, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa, totaisTerapia, totalGeral})
                            })    
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },

    relAtendteraanaFiltro: function (req, res) {
        let db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        let rel = [];
        let agendaFinal = [];
        let terapeuta_nome = "Desconhecido";
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni); // yyyy-mm-dd → dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);
        let pesquisa = {
            dataIni: req.body.dataIni,
            dataFim: req.body.dataFim,
            terapeuta: req.body.relTeraid
        };

        // --- Ajuste das datas ---
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setUTCHours(0, 0, 0, 0);
        sex.setUTCHours(23, 59, 59, 999);

        // --- Busca anos ---
        Ano.find().exec(function (err, todosAnos) {
            if (err) return res.status(500).send("Erro ao buscar anos.");

            // --- Busca agendas fixas ---
            let filtroFixo = {
                agenda_data: { $gte: seg, $lte: sex },
                agenda_temp: false,
                agenda_usuid: req.body.relTeraid
            };

            Agenda.find(filtroFixo).exec(function (err, agendaFixa) {
                if (err) return res.status(500).send("Erro ao buscar agendas fixas.");

                let idsFixos = agendaFixa.map(af => af._id);

                // --- Busca agendas semanais/temporárias ---
                let filtroSemanal = {
                    $or: [
                        { agenda_tempId: { $in: idsFixos } },
                        {
                            agenda_data: { $gte: seg, $lte: sex },
                            agenda_temp: true,
                            agenda_usuid: req.body.relTeraid
                        }
                    ]
                };

                Agenda.find(filtroSemanal).exec(function (err, agendaSemanal) {
                    // --- Monta agendaFinal (fixas + não substituídas) ---
                    agendaFinal = [...agendaSemanal];

                    agendaFixa.forEach(af => {
                        // procura a semanal ligada a essa fixa
                        const semanal = agendaSemanal.find(
                            as => String(as.agenda_tempId) === String(af._id)
                        );

                        // se existe semanal E o terapeuta é diferente → exclui ambos
                        if (
                            semanal &&
                            String(semanal.agenda_usuid) !== String(af.agenda_usuid)
                        ) {
                            // remove a semanal da agendaFinal
                            agendaFinal = agendaFinal.filter(
                                a => String(a._id) !== String(semanal._id)
                            );
                            return; // não adiciona a fixa
                        }

                        // se não existe semanal → adiciona a fixa
                        if (!semanal) {
                            agendaFinal.push(af);
                        }
                    });

                    // --- Ordena por data ---
                    agendaFinal.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));

                    // --- Busca beneficiários ---
                    Bene.find().exec(function (err, todosBenes) {
                        if (err) return res.status(500).send("Erro ao buscar beneficiários.");

                        todosBenes.sort((a, b) =>
                            a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(
                                b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                            )
                        );

                        // --- Busca terapeutas ---
                        Usuario.find({
                            "usuario_status": "Ativo",
                            $or: [
                                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                            ]
                        }).exec(function (err, todosTerapeutas) {
                            if (err) return res.status(500).send("Erro ao buscar terapeutas.");

                            todosTerapeutas.sort((a, b) =>
                                a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(
                                    b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                                )
                            );

                            // Identifica nome do terapeuta solicitado
                            for (let t of todosTerapeutas) {
                                if (String(t._id) === String(req.body.relTeraid)) {
                                    terapeuta_nome = t.usuario_nome;
                                    break;
                                }
                            }

                            // --- Busca terapias ---
                            Terapia.find().exec(function (err, todasTerapias) {
                                if (err) return res.status(500).send("Erro ao buscar terapias.");

                                todasTerapias.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome));

                                // --- Processa agendas e filtra categorias indesejadas ---
                                const categoriasExcluidas = ["Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"];

                                agendaFinal.forEach(agenda => {
                                    // Ajuste de timezone (caso necessário)
                                    if (agenda.agenda_data.getTimezoneOffset() === 180) {
                                        agenda.agenda_data.setHours(agenda.agenda_data.getHours() + 3);
                                    }

                                    let categoria = agenda.agenda_categoria;
                                    if (categoriasExcluidas.includes(categoria)) {
                                        return; // pula este item
                                    }

                                    // Horário formatado
                                    let h = String(agenda.agenda_data.getHours()).padStart(2, '0');
                                    let m = String(agenda.agenda_data.getMinutes()).padStart(2, '0');
                                    let hora = `${h}:${m}`;

                                    // Define terapia e terapeuta
                                    let terapiaAtend = agenda.agenda_terapiaid;
                                    let terapeutaAtend = agenda.agenda_usuid;

                                    // Caso "Substituição": só inclui se for o terapeuta alvo
                                    if (categoria === "Substituição" && String(agenda.agenda_usuid) !== String(req.body.relTeraid)) {
                                        return;
                                    }

                                    // Adiciona ao relatório
                                    rel.push({
                                        dt: new Date(agenda.agenda_data),
                                        hora: hora,
                                        especialidade: terapiaAtend,
                                        profissional: terapeutaAtend,
                                        beneficiario: agenda.agenda_beneid
                                    });
                                });

                                // Formata data para exibição (dd/mm/yyyy)
                                rel.forEach(r => {
                                    r.dt = fncGeral.getDataInvert(fncGeral.getDataFMT(r.dt));
                                });

                                // --- Agrupamento por terapia ---
                                let somaPorTerapia = {};
                                rel.forEach(item => {
                                    let id = String(item.especialidade);
                                    somaPorTerapia[id] = (somaPorTerapia[id] || 0) + 1;
                                });

                                let totaisTerapia = [];
                                for (let id in somaPorTerapia) {
                                    let terapia = todasTerapias.find(t => String(t._id) === id);
                                    totaisTerapia.push({
                                        terapiaId: id,
                                        terapiaNome: terapia ? terapia.terapia_nome : "Desconhecida",
                                        total: somaPorTerapia[id]
                                    });
                                }

                                let totalGeral = totaisTerapia.reduce((soma, t) => soma + t.total, 0);

                                // --- Renderiza view ---
                                res.render("atendimento/atendreltera/relatendteraana", {
                                    terapeutas: todosTerapeutas,
                                    anos: todosAnos,
                                    terapias: todasTerapias,
                                    benes: todosBenes,
                                    rels: rel,
                                    periodoDe: periodoDe,
                                    periodoAte: periodoAte,
                                    terapeuta_nome: terapeuta_nome,
                                    pesquisa: pesquisa,
                                    totaisTerapia: totaisTerapia,
                                    totalGeral: totalGeral
                                });
                            });
                        });
                    });
                });
            });
        });
    },
    //novo relatendteraanafiltroAtend?
    relAtendteraanaFiltroAtend: async function (req, res) {
        let flash = {}

        try {
            let db = req.cookies['preferredDb']

            const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
            const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
            const Atend = getModel(db, 'tb_atends', atendClass.AtendSchema)

            let periodoDe = fncGeral.getDataInvert(req.body.dataIni)
            let periodoAte = fncGeral.getDataInvert(req.body.dataFim)

            let seg = fncGeral.getDateFromString(req.body.dataIni, "ini")
            let sex = fncGeral.getDateFromString(req.body.dataFim, "fim")
            seg.setUTCHours(0, 0, 0, 0)
            sex.setUTCHours(23, 59, 59, 999)

            const [
            todosAnos,
            todosBenes,
            todasTerapias,
            todosTerapeutas,
            atendimentos
            ] = await Promise.all([

            Ano.find(),

            Bene.find().sort({
                bene_nome: 1
            }),

            Terapia.find().sort({
                terapia_nome: 1
            }),

            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            }).sort({ usuario_nome: 1 }),

            Atend.find({
                atend_atenddata: { $gte: seg, $lte: sex },
                $or: [
                { atend_terapeutaid: req.body.relTeraid },
                { atend_mergeterapeutaid: req.body.relTeraid },
                { atend_fixoterapeutaid: req.body.relTeraid }
                ]
            })

            ])

            // --- nome terapeuta ---
            let terapeuta_nome = "Desconhecido"
            const terapeuta = todosTerapeutas.find(
            t => String(t._id) === String(req.body.relTeraid)
            )
            if (terapeuta) terapeuta_nome = terapeuta.usuario_nome

            // --- processa atendimentos ---
            let rel = []
            const categoriasExcluidas = ["Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"]

            atendimentos.forEach(atend => {

            if (categoriasExcluidas.includes(atend.atend_categoria)) return

            let terapia = atend.atend_terapiaid
            let profissional = atend.atend_terapeutaid

            if (
                atend.atend_categoria === "Substituição" &&
                atend.atend_mergeterapeutaid &&
                String(atend.atend_mergeterapeutaid) === String(req.body.relTeraid)
            ) {
                terapia = atend.atend_mergeterapiaid
                profissional = atend.atend_mergeterapeutaid
            }

            rel.push({
                dt: fncGeral.getDataInvert(fncGeral.getDataFMT(atend.atend_atenddata)),
                hora: atend.atend_atendhora || "00:00",
                especialidade: terapia,
                profissional: profissional,
                beneficiario: atend.atend_beneid
            })
            })

            // --- totais ---
            let somaPorTerapia = {}
            rel.forEach(r => {
            somaPorTerapia[r.especialidade] =
                (somaPorTerapia[r.especialidade] || 0) + 1
            })

            let totaisTerapia = Object.keys(somaPorTerapia).map(id => {
            const t = todasTerapias.find(tt => String(tt._id) === String(id))
            return {
                terapiaId: id,
                terapiaNome: t ? t.terapia_nome : "Desconhecida",
                total: somaPorTerapia[id]
            }
            })

            let totalGeral = totaisTerapia.reduce((s, t) => s + t.total, 0)

            terapeuta.sort((a, b) =>
            a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            > b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ? 1 : -1
            );

            // --- identifica terapeuta_nome
            terapeuta.some(t => {
            if (String(t._id) === String(req.body.relTeraid)) {
                terapeuta_nome = t.usuario_nome;
                return true;
            }
            return false;
            });

            // --- terapias
            const terapiaLis = await Terapia.find();
            terapiaLis.sort((a, b) =>
            a.terapia_nome > b.terapia_nome ? 1 : -1
            );

            // --- ordenação dos atendimentos (IGUAL)
            atend.sort((a, b) => {
            let d1 = new Date(a.atend_atenddata);
            let d2 = new Date(b.atend_atenddata);
            d1.setHours(0,0,0,0);
            d2.setHours(0,0,0,0);
            return d1 - d2;
            });

            atend.sort((a, b) =>
            a.atend_categoria.localeCompare(b.atend_categoria)
            );

            // --- processamento final
            const resultado = [];
            let totalFinal = 0;
            let totalSessoes = 0;

            for (const a of atend) {

            let continuar = true;
            let valdeb = "0,00";
            let terapiaA;
            let teranome;

            if (listaPadrao.includes(a.atend_categoria)) {

                valdeb = a.atend_valordeb || "0,00";
                terapiaA = terapiaLis.find(t => String(t._id) === String(a.atend_terapiaid));
                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";

            } else if (
                a.atend_categoria === "Substituição" &&
                String(a.atend_mergeterapeutaid) !== String(req.body.relTeraid) &&
                String(a.atend_terapeutaid) === String(req.body.relTeraid)
            ) {

                continuar = false;

            } else if (
                a.atend_categoria === "Substituição" &&
                String(a.atend_mergeterapeutaid) === String(req.body.relTeraid)
            ) {

                terapiaA = terapiaLis.find(t => String(t._id) === String(a.atend_mergeterapiaid));
                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                valdeb = a.atend_mergevalordeb || "0,00";

            } else if (listaExcecoes.includes(a.atend_categoria)) {

                if (String(a.atend_mergeterapeutaid) === String(req.body.relTeraid)) {
                terapiaA = terapiaLis.find(t => String(t._id) === String(a.atend_mergeterapiaid));
                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                valdeb = a.atend_mergevalordeb || "0,00";
                } else if (String(a.atend_terapeutaid) === String(req.body.relTeraid)) {
                terapiaA = terapiaLis.find(t => String(t._id) === String(a.atend_terapiaid));
                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                valdeb = a.atend_valordeb || "0,00";
                }

            } else {

                terapiaA = terapiaLis.find(t => String(t._id) === String(a.atend_terapiaid));
                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                valdeb = a.atend_valordeb || "0,00";
            }

            if (continuar) {

                const valorNum = parseFloat(valdeb.replace(",", "."));

                const existente = resultado.find(r =>
                r.nomecid === teranome &&
                r.valor === valdeb
                );

                if (existente) {
                existente.sessoes += 1;
                existente.total = (valorNum * existente.sessoes).toFixed(2);
                } else {
                const novoRel = new RelAtend(
                    teranome,
                    1,
                    "",
                    valdeb,
                    valorNum.toFixed(2)
                );
                novoRel.terapeuta = a.atend_terapeutaid;
                resultado.push(novoRel);
                }
            }
            }

            // --- totais finais
            for (const r of resultado) {
            totalFinal += parseInt(r.total.replace(",", "").replace(".", ""));
            totalSessoes += r.sessoes;
            }

            totalFinal = fncGeral.mascaraValores(totalFinal);

            // --- render FINAL (mesmo destino)
            res.render("atendimento/atendreltera/relatendteracons", {
            anos: ano,
            terapeutas: terapeuta,
            terapias: terapiaLis,
            benes: bene,
            rels: resultado,
            periodoDe,
            periodoAte,
            terapeuta_nome,
            totalFinal,
            pesquisa,
            totalSessoes
            });

            // --- render ---
            //res.render("atendimento/atendreltera/relatendteracons", {anos: ano, terapeutas: terapeuta, terapias: terapiaLis, benes: bene, rels: resultado, periodoDe, periodoAte, terapeuta_nome, totalFinal, pesquisa, totalSessoes})
            res.render("atendimento/atendreltera/relatendteraana", {
            anos: todosAnos,
            terapias: todasTerapias,
            benes: todosBenes,
            terapeutas: todosTerapeutas,
            rels: rel,
            periodoDe,
            periodoAte,
            terapeuta_nome,
            pesquisa: req.body,
            totaisTerapia,
            totalGeral
            });
        } catch (err) {
            flash.texto = "Ocorreu um erro ao gerar o relatório: " + err.message
            flash.sucesso = "false"
            res.render('branco', { flash })
        }
    },
    // Função chamada pela rota GET: carrega a view SEM relatório
    relAtendteraanatodos(req, res) {
        // Define período padrão: mês atual
        const hoje = new Date();
        const primeiroDia = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
        const ultimoDia = new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);

        // Formato para exibição (dd/mm/yyyy)
        const periodoDe = fncGeral.getDataInvert(fncGeral.getDataFMT(primeiroDia));
        const periodoAte = fncGeral.getDataInvert(fncGeral.getDataFMT(ultimoDia));

        // Formato ISO para o campo <input type="date"> (yyyy-mm-dd)
        const dataIniISO = fncGeral.getDataFMT(primeiroDia).substring(0, 10);
        const dataFimISO = fncGeral.getDataFMT(ultimoDia).substring(0, 10);

        // Renderiza a view SEM dados do relatório
        res.render("atendimento/atendreltera/relatendteraanatodos", {
            periodoDe: periodoDe,
            periodoAte: periodoAte,
            pesquisa: {
                dataIni: dataIniISO,
                dataFim: dataFimISO
            },
            // Dados vazios para evitar erro no Handlebars
            rels: [],
            terapeutas: [],
            terapias: [],
            benes: [],
            anos: [],
            totaisTerapia: [],
            totalGeral: 0,
            contagemPorTerapeuta: {}
        });
    },
   
    async relAtendteraanafiltrotodos(req, res) {
    try {
        let db = req.cookies['preferredDb'];
        const Ano = getModel(db, 'tb_ano', anoClass.AnoSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        

        const periodoDe = fncGeral.getDataInvert(req.body.dataIni);
        const periodoAte = fncGeral.getDataInvert(req.body.dataFim);
        const pesquisa = { dataIni: req.body.dataIni, dataFim: req.body.dataFim };

        const seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        const sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0, 0, 0, 0);
        sex.setHours(23, 59, 59, 999);

        // === Buscar terapeutas (ativos ou não) ===
        const todosTerapeutas = await Usuario.find({
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        });

        // Ordenar terapeutas por nome (alfabeticamente)
        todosTerapeutas.sort((a, b) =>
            a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .localeCompare(b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        );

        const listaTerapeutaIds = todosTerapeutas.map(t => t._id);

        // === Buscar agendas ===
        const filtroAgendaFixo = {
            agenda_data: { $gte: seg, $lte: sex },
            agenda_temp: false,
            agenda_usuid: { $in: listaTerapeutaIds }
        };

        const agendaFixa = await Agenda.find(filtroAgendaFixo);
        const idsTemp = agendaFixa.map(af => af._id);

        const filtroAgendaSemanal = {
            $or: [
                { agenda_tempId: { $in: idsTemp } },
                {
                    agenda_data: { $gte: seg, $lte: sex },
                    agenda_temp: true,
                    agenda_usuid: { $in: listaTerapeutaIds }
                }
            ]
        };

        const agendaSemanal = await Agenda.find(filtroAgendaSemanal);

        let agendaFinal = [...agendaSemanal];
        agendaFixa.forEach((af) => {
            const existeNaSemanal = agendaSemanal.some(as => String(as.agenda_tempId) === String(af._id));
            if (!existeNaSemanal) {
                agendaFinal.push(af);
            }
        });

        // === Buscar benes e terapias (ordenados alfabeticamente) ===
        let bene = await Bene.find();
        bene.sort((a, b) =>
            a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .localeCompare(b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        );

        let terapias = await Terapia.find();
        terapias.sort((a, b) =>
            a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                .localeCompare(b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))
        );

        // === Montar relatório bruto ===
        const rel = [];
        const categoriasExcluidas = new Set(["Extra", "Falta Justificada", "Falta Absoluta", "Feriado", "Glosa"]);

        for (const agenda of agendaFinal) {
            if (categoriasExcluidas.has(agenda.agenda_categoria)) continue;

            const rab = new RelAtendBene();
            rab.dt = new Date(agenda.agenda_data);
            const hours = String(agenda.agenda_data.getHours()).padStart(2, '0');
            const mins = String(agenda.agenda_data.getMinutes()).padStart(2, '0');
            rab.hora = `${hours}:${mins}`;
            rab.especialidade = agenda.agenda_terapiaid;
            rab.profissional = agenda.agenda_usuid;
            rab.beneficiario = agenda.agenda_beneid;
            rel.push(rab);
        }

        // Formatar datas para exibição
        rel.forEach(r => {
            r.dt = fncGeral.getDataInvert(fncGeral.getDataFMT(r.dt));
        });

        // === Ordenar relatório por terapeuta (nome) depois por data ===
        rel.sort((a, b) => {
            const nomeA = todosTerapeutas.find(t => String(t._id) === String(a.profissional))?.usuario_nome || '';
            const nomeB = todosTerapeutas.find(t => String(t._id) === String(b.profissional))?.usuario_nome || '';
            if (nomeA !== nomeB) {
                return nomeA.localeCompare(nomeB);
            }
            return new Date(fncGeral.getDataFMT(a.dt)) - new Date(fncGeral.getDataFMT(b.dt));
        });

        // === 1. Consolidado por terapia (ID) – já existia ===
        const somaPorTerapia = {};
        rel.forEach(item => {
            const tid = String(item.especialidade);
            somaPorTerapia[tid] = (somaPorTerapia[tid] || 0) + 1;
        });

        const totaisTerapia = Object.entries(somaPorTerapia).map(([id, total]) => {
            const nome = terapias.find(t => String(t._id) === id)?.terapia_nome || 'Desconhecida';
            return { terapiaId: id, terapiaNome: nome, total };
        });

        const totalGeral = totaisTerapia.reduce((s, i) => s + i.total, 0);

        // === 2. Resumo por terapeuta (total de atendimentos) ===
        const contagemPorTerapeuta = {};
        const terapiasPorTerapeuta = {};

        rel.forEach(item => {
            const tid = String(item.profissional);
            const terapiaId = String(item.especialidade);
            contagemPorTerapeuta[tid] = (contagemPorTerapeuta[tid] || 0) + 1;
            if (!terapiasPorTerapeuta[tid]) terapiasPorTerapeuta[tid] = new Set();
            terapiasPorTerapeuta[tid].add(terapiaId);
        });

        const resumoPorTerapeuta = todosTerapeutas
            .filter(t => contagemPorTerapeuta[String(t._id)])
            .map(t => ({
                nome: t.usuario_nome,
                total: contagemPorTerapeuta[String(t._id)]
            }))
            .sort((a, b) => a.nome.localeCompare(b.nome));

        // === 3. Resumo detalhado (atendimentos + terapias distintas) ===
        const resumoDetalhado = todosTerapeutas
            .filter(t => contagemPorTerapeuta[String(t._id)])
            .map(t => {
                const id = String(t._id);
                return {
                    nome: t.usuario_nome,
                    totalAtendimentos: contagemPorTerapeuta[id],
                    totalTerapias: terapiasPorTerapeuta[id]?.size || 0
                };
            })
            .sort((a, b) => a.nome.localeCompare(b.nome));

        // === 4. NOVO: Consolidado por terapia_nomecid (chave única da terapia) ===
        const consolidadoPorTerapiaNomecid = {};

        rel.forEach(item => {
            const terapia = terapias.find(t => String(t._id) === String(item.especialidade));
            if (!terapia || !terapia.terapia_nomecid) return;

            const chave = terapia.terapia_nomecid;
            consolidadoPorTerapiaNomecid[chave] = (consolidadoPorTerapiaNomecid[chave] || 0) + 1;
        });

        // Converter em array ordenado alfabeticamente por terapia_nomecid
        const resumoPorTerapiaNomecid = Object.entries(consolidadoPorTerapiaNomecid)
            .map(([nomecid, total]) => ({ terapiaNomecid: nomecid, total }))
            .sort((a, b) => a.terapiaNomecid.localeCompare(b.terapiaNomecid));

        // === Renderizar view ===
        const anos = await Ano.find();

        res.render("atendimento/atendreltera/relatendteraanatodos", {
            terapeutas: todosTerapeutas,
            anos,
            terapias,
            benes: bene,
            rels: rel,
            periodoDe,
            periodoAte,
            pesquisa,
            totaisTerapia,
            totalGeral,
            resumoPorTerapeuta,
            resumoDetalhado,
            resumoPorTerapiaNomecid // <-- Nova tabela de resumo
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Erro ao gerar relatório");
    }
},
    relAtendteraanaFiltro2(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let rel = [];
        let terapeuta_nome;
        let terapiaAtend;
        let terapeutaAtend;
        let filtroAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        if (req.body.relTeraid == "todos"){
            if ((seg.getMonth()-sex.getMonth()) > 4 || (seg.getMonth()-sex.getMonth()) < 0){
                res.render("admin/branco");
                return false;
            }
            filtroAtend = {atend_atenddata: { $gte: seg, $lte: sex}, atend_categoria: {$ne: "Glosa"}}
        } else {
            filtroAtend = {atend_terapeutaid: req.body.relTeraid, atend_atenddata: { $gte: seg, $lte: sex}, atend_categoria: {$ne: "Glosa"}}
        }
        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
        Atend.find(filtroAtend).then((at)=>{
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                terapeuta.some((t)=>{
                    if((""+t._id) === (""+req.body.relTeraid)){
                        terapeuta_nome = t.usuario_nome;
                        return true;
                    }
                    return false;
                })
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        at.sort(function(a, b) {
                            let d1 = new Date(a.atend_atenddata);
                            let d2 = new Date(b.atend_atenddata);
                            d1.setHours(0);
                            d1.setMinutes(0);
                            d1.setSeconds(0);
                            d2.setHours(0);
                            d2.setMinutes(0);
                            d2.setSeconds(0);
                            if(d1 == d2){
                                return true;
                            } else {
                                if(d1 < d2){
                                    return -1;
                                } else {
                                    return true;
                                }
                            }
                        });

                        at.forEach((atend)=>{
                            rab.dt = (fncGeral.getData(atend.atend_atenddata));
                            categorias = atend.atend_categoria
                            switch (categorias){
                                case "Apoio":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                case "Extra":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                case "Falta":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                case "Falta Justificada":
                                    terapiaAtend = atend.atend_mergeterapiaid
                                    terapeutaAtend = atend.atend_mergeterapeutaid;
                                    break;
                                case "Falta Absoluta":
                                    terapiaAtend = atend.atend_mergeterapiaid
                                    terapeutaAtend = atend.atend_mergeterapeutaid;
                                    break;
                                case "Feriado":
                                    terapiaAtend = atend.atend_mergeterapiaid
                                    terapeutaAtend = atend.atend_mergeterapeutaid;
                                    break;
                                case "Padrão":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                case "Pais":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                case "Substituição":
                                    terapiaAtend = atend.atend_mergeterapiaid;
                                    terapeutaAtend = atend.atend_mergeterapeutaid;
                                    break;
                                case "Supervisão":
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                                default:
                                    terapiaAtend = atend.atend_terapiaid;
                                    terapeutaAtend = atend.atend_terapeutaid;
                                    break;
                            }
                            rab.especialidade = terapiaAtend;
                            rab.profissional = terapeutaAtend;

                            rel.push(rab);
                            rab = new RelAtendBene();
                        });

//NEW START
                        function filtraData(objeto, campo) {
                            var comparativo = campo;
                            return new Date(objeto.dt).setHours(0, 0, 0, 0) === campo;
                        }
                        function filtraTerapeuta(objeto, campo) {
                            var comparativo = campo;
                            return objeto.campo === campo;
                        }
                        function filtraTerapia(objeto, campo) {
                            var comparativo = campo;
                            return objeto.campo === campo;
                        }

                        let arrayExclusao = [];
                        let relTempData = [];
                        let relTempTerapeuta = [];
                        let relTempTerapia = [];

                        rel.forEach((r)=>{
                            if (relTempData.length == 0){
                                relTempData.push(new Date(r.dt).setHours(0, 0, 0, 0));
                            } else {
                                if (!relTempData.includes(new Date(r.dt).setHours(0, 0, 0, 0))){
                                    relTempData.push(new Date(r.dt).setHours(0, 0, 0, 0));
                                }
                            }
                        })

                        //arrayExclusao.push(new Date(r.dt).setHours(0, 0, 0, 0));
                        //let relTempData = rel.filter(filtraData);
                        //let relTempTerapeuta = relTempData.filter(filtraTerapeuta);
                        //let relTempTerapia = relTempTerapeuta.filter(filtraTerapia);
//NEW END

                        if (req.body.relTeraid == "todos"){
                            rel.sort(function(a, b) {
                                let d1 = new Date(a.dt).setHours(0, 0, 0, 0);
                                let d2 = new Date(b.dt).setHours(0, 0, 0, 0);

                                if(d1 == d2){
                                    if(a.profissional == b.profissional){
                                        if(a.especialidade == b.especialidade){
                                            return true;
                                        } else {
                                            return a.especialidade > b.especialidade ? 1 : -1;
                                        }
                                    } else {
                                        return a.profissional > b.profissional ? 1: -1;
                                    }
                                } else {
                                    return d1 > d2 ? 1 : -1;
                                }
                            });
                        } else {
                            rel.sort(function(a, b) {
                                let d1 = new Date(a.dt).setHours(0, 0, 0, 0);
                                let d2 = new Date(b.dt).setHours(0, 0, 0, 0);

                                if(d1 == d2){
                                    if(a.especialidade == b.especialidade){
                                        return true;
                                    } else {
                                        return a.especialidade > b.especialidade ? 1 : -1;
                                    }
                                } else {
                                    return d1 > d2 ? 1 : -1;
                                }
                            }); 
                        }

                        /*
                        if (a.city === b.city) {
                            // Price is only important when cities are the same
                            return b.price - a.price;
                        }
                        return a.city > b.city ? 1 : -1;

                        */

                        //rel.sort((a, b) => new Date(a.dt).setHours(0, 0, 0, 0) - new Date(b.dt).setHours(0, 0, 0, 0))
                        /*
                        rel.sort((a,b) => (a.especialidade > b.especialidade) ? 1 : ((b.especialidade > a.especialidade) ? -1 : 0));//Ordena por ordem alfabética     
                        if (req.body.relTeraid == "todos"){
                            rel.sort((a,b) => (a.profissional > b.profissional) ? 1 : ((b.profissional > a.profissional) ? -1 : 0));//Ordena por ordem alfabética     
                        }
                        */

                        /*
                        obter array por data
                        buscar por usuario
                        filtrar terapias realizadas pelo usuario
                        contar terapias realizadas
                        */
                        res.render("atendimento/atendreltera/relatendteraana", {benes: bene, anos: ano, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, terapeuta_nome})
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
      /* consolidado por Valor*/
    relAtendteracons(req,res){
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Bene.findOne().then((bene)=>{
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                        res.render("atendimento/atendreltera/relatendteracons", {terapias: terapia, anos: ano, terapeutas: terapeuta, benes: bene})
        })})})})}).catch((err) =>{
            console.log(err)
        })
    },

    relatendgestaoana: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
            const Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);

            // Extrai datas (pode vir de query ou body)
            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            // Se não houver filtro, renderiza view em branco
            if (!dataIniStr || !dataFimStr) {
                const terapeutas = await Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).sort({ usuario_nome: 1 });
                return res.render("atendimento/atendreltera/gestao/relatendgestaoana", {
                    rels: [],
                    terapeutas,
                    periodoDe: '',
                    periodoAte: '',
                    pesquisa: {
                        dataIni: '',
                        dataFim: ''
                    }
                });
            }

            // Converte strings para Date
            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);

            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }

            // Ajusta dataFim para incluir todo o dia
            dataFim.setUTCHours(23, 59, 59, 999);

            // Validação: intervalo máximo de 1 mês
            const diffMeses = (dataFim.getFullYear() - dataIni.getFullYear()) * 12 + (dataFim.getMonth() - dataIni.getMonth());
            if (diffMeses > 1 || diffMeses < 0) {
                return res.status(400).send("O intervalo deve ser de no máximo 1 mês.");
            }

            // Pipeline de agregação
            const pipeline = [
                { $match: { atend_atenddata: { $gte: dataIni, $lte: dataFim } } },

                // Converter campos de valor de string para número (com segurança)
                {
                    $addFields: {
                        // Função auxiliar: limpa e garante valor seguro para conversão
                        _valorcre: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_valorcre", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        },
                        _valordeb: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_valordeb", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        },
                        _mergevalorcre: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        },
                        _mergevalordeb: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_mergevalordeb", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        },
                        _fixovalorcre: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_fixovalorcre", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        },
                        _fixovalordeb: {
                            $let: {
                                vars: { val: { $ifNull: ["$atend_fixovalordeb", "0"] } },
                                in: {
                                    $toDouble: {
                                        $replaceAll: {
                                            input: { $cond: { if: { $eq: ["$$val", ""] }, then: "0", else: "$$val" } },
                                            find: ",",
                                            replacement: "."
                                        }
                                    }
                                }
                            }
                        }
                    }
                },

                // Lookup: Beneficiário
                { $lookup: { from: Bene.collection.name, localField: "atend_beneid", foreignField: "_id", as: "bene" } },
                { $unwind: { path: "$bene", preserveNullAndEmptyArrays: true } },

                // Lookup: Convênio
                { $lookup: { from: Conv.collection.name, localField: "atend_convid", foreignField: "_id", as: "conv" } },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // Lookup: Terapeuta principal
                { $lookup: { from: Usuario.collection.name, localField: "atend_terapeutaid", foreignField: "_id", as: "terapeuta" } },
                { $unwind: { path: "$terapeuta", preserveNullAndEmptyArrays: true } },

                // Lookup: Terapia principal
                { $lookup: { from: Terapia.collection.name, localField: "atend_terapiaid", foreignField: "_id", as: "terapia" } },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // Lookup: Sala
                { $lookup: { from: Sala.collection.name, localField: "atend_salaid", foreignField: "_id", as: "sala" } },
                { $unwind: { path: "$sala", preserveNullAndEmptyArrays: true } },

                // Lookup: Merge Terapeuta
                { $lookup: { from: Usuario.collection.name, localField: "atend_mergeterapeutaid", foreignField: "_id", as: "mergeterapeuta" } },
                { $unwind: { path: "$mergeterapeuta", preserveNullAndEmptyArrays: true } },

                // Lookup: Merge Terapia
                { $lookup: { from: Terapia.collection.name, localField: "atend_mergeterapiaid", foreignField: "_id", as: "mergeterapia" } },
                { $unwind: { path: "$mergeterapia", preserveNullAndEmptyArrays: true } },

                // Lookup: Fixo Terapeuta
                { $lookup: { from: Usuario.collection.name, localField: "atend_fixoterapeutaid", foreignField: "_id", as: "fixoterapeuta" } },
                { $unwind: { path: "$fixoterapeuta", preserveNullAndEmptyArrays: true } },

                // Lookup: Fixo Terapia
                { $lookup: { from: Terapia.collection.name, localField: "atend_fixoterapiaid", foreignField: "_id", as: "fixoterapia" } },
                { $unwind: { path: "$fixoterapia", preserveNullAndEmptyArrays: true } },

                // Projeto final
                {
                    $project: {
                        _id: 0,
                        atend_atenddata: 1,
                        atend_atendhora: 1,
                        atend_categoria: 1,
                        atend_fixo: 1,

                        // Valores em centavos (para usar com mascaraValores)
                        atend_valorcre_num: { $multiply: ["$_valorcre", 100] },
                        atend_valordeb_num: { $multiply: ["$_valordeb", 100] },
                        atend_mergevalorcre_num: { $multiply: ["$_mergevalorcre", 100] },
                        atend_mergevalordeb_num: { $multiply: ["$_mergevalordeb", 100] },
                        atend_fixovalorcre_num: { $multiply: ["$_fixovalorcre", 100] },
                        atend_fixovalordeb_num: { $multiply: ["$_fixovalordeb", 100] },

                        // Substituições por nomes
                        bene_nome: "$bene.bene_nome",
                        bene_liminar: "$bene.bene_liminar",
                        conv_nome: "$conv.conv_nome",
                        terapeuta_nome: "$terapeuta.usuario_nome",
                        terapia_nomecid: "$terapia.terapia_nomecid",
                        sala_nome: "$sala.sala_nome",
                        mergeterapeuta_nome: "$mergeterapeuta.usuario_nome",
                        mergeterapia_nomecid: "$mergeterapia.terapia_nomecid",
                        fixoterapeuta_nome: "$fixoterapeuta.usuario_nome",
                        fixoterapia_nomecid: "$fixoterapia.terapia_nomecid"
                    }
                },
                { $sort: { atend_atenddata: 1 } }
            ];

            const rels = await Atend.aggregate(pipeline).exec();

            // Formata os valores usando sua função existente
            const relsFormatado = rels.map(r => {
                const formatar = (valorNum) => {
                    if (valorNum == null || valorNum === undefined || isNaN(valorNum)) return "0,00";
                    const centavos = Math.round(valorNum).toString();
                    return fncGeral.mascaraValores(centavos);
                };

                return {
                    ...r,
                    dt: fncGeral.getData(r.atend_atenddata),
                    hora: r.atend_atendhora || '',
                    atend_valorcre_num: formatar(r.atend_valorcre_num),
                    atend_valordeb_num: formatar(r.atend_valordeb_num),
                    atend_mergevalorcre_num: formatar(r.atend_mergevalorcre_num),
                    atend_mergevalordeb_num: formatar(r.atend_mergevalordeb_num),
                    atend_fixovalorcre_num: formatar(r.atend_fixovalorcre_num),
                    atend_fixovalordeb_num: formatar(r.atend_fixovalordeb_num)
                };
            });

            // Carrega terapeutas para o filtro
            const terapeutas = await Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" }).sort({ usuario_nome: 1 });

            // Renderiza com datas no formato YYYY-MM-DD para o input type="date"
            res.render("atendimento/atendreltera/gestao/relatendgestaoana", {
                rels: relsFormatado,
                terapeutas,
                periodoDe: fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10)),
                periodoAte: fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10)),
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("Erro no relatório analítico:", err);
            res.status(500).send("Erro ao gerar relatório analítico.");
        }
    },
   
    relatendgestaocons: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [],
                    periodoDe: '',
                    periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            const pipeline = [
                { $match: { atend_atenddata: { $gte: dataIni, $lte: dataFim } } },

                // Determinar valor CRE/DEB correto por categoria
                {
                    $addFields: {
                        // Verifica se é fixo (por categoria ou flag)
                        isFixo: {
                            $or: [
                                { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                { $eq: ["$atend_fixo", "true"] }
                            ]
                        },
                        isMerge: {
                            $in: [
                                "$atend_categoria",
                                ["Substituição", "Falta Justificada", "Feriado", "Falta Absoluta"]
                            ]
                        }
                    }
                },
                {
                    $addFields: {
                        valorcre_correto: {
                            $cond: {
                                if: "$isFixo",
                                then: { $ifNull: ["$atend_fixovalorcre", "0"] },
                                else: {
                                    $cond: {
                                        if: "$isMerge",
                                        then: { $ifNull: ["$atend_mergevalorcre", "0"] },
                                        else: { $ifNull: ["$atend_valorcre", "0"] }
                                    }
                                }
                            }
                        },
                        valordeb_correto: {
                            $cond: {
                                if: "$isFixo",
                                then: { $ifNull: ["$atend_fixovalordeb", "0"] },
                                else: {
                                    $cond: {
                                        if: "$isMerge",
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] },
                                        else: { $ifNull: ["$atend_valordeb", "0"] }
                                    }
                                }
                            }
                        }
                    }
                },

                // Tratar strings vazias e converter para número
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: { $toDouble: { $replaceAll: { input: "$valorcre_correto", find: ",", replacement: "." } } }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: { $toDouble: { $replaceAll: { input: "$valordeb_correto", find: ",", replacement: "." } } }
                            }
                        }
                    }
                },

                // Lookup: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // Lookup: Terapia
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "atend_terapiaid",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // Agrupar por Convênio + Terapia
                {
                    $group: {
                        _id: {
                            conv_nome: "$conv.conv_nome",
                            terapia_nomecid: "$terapia.terapia_nomecid"
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" }
                    }
                },

                // Ordenar: convênio (A-Z), depois terapia (A-Z)
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nomecid": 1 } }
            ];

            const rels = await Atend.aggregate(pipeline).exec();

            const relsFormatado = rels.map(r => ({
                conv_nome: r._id.conv_nome || "Sem convênio",
                terapia_nomecid: r._id.terapia_nomecid || "Sem terapia",
                qtd: r.qtd,
                tempo: "40 min",
                total_valorcre: fncGeral.mascaraValores(Math.round(r.total_valorcre * 100).toString()),
                total_valordeb: fncGeral.mascaraValores(Math.round(r.total_valordeb * 100).toString())
            }));

            res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                rels: relsFormatado,
                periodoDe: fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10)),
                periodoAte: fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10)),
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("Erro no relatório consolidado:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relatendgestaoconsfechadoOLD: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                console.log("[relatendgestaoconsfechado] Datas não fornecidas. Renderizando formulário vazio.");
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [],
                    periodoDe: '',
                    periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                console.error("[relatendgestaoconsfechado] Datas inválidas:", { dataIniStr, dataFimStr });
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                console.warn("[relatendgestaoconsfechado] Intervalo de datas excede 31 dias ou é inválido:", diffDays);
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            console.log(`[relatendgestaoconsfechado] Período válido: ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

            const pipeline = [
                // Etapa 1: Filtrar por data e EXCLUIR "Falta Absoluta"
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim },
                        atend_categoria: { $ne: "Falta Absoluta" }
                    }
                },

                // Etapa 2: Determinar valor CRE correto por regra de categoria
                {
                    $addFields: {
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$atend_categoria", "Falta Justificada"] }, then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "Feriado"] },           then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "Substituição"] },      then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },    then: { $ifNull: ["$atend_mergevalorcre", "0"] } }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        },
                        // ⚠️ Débito ainda com lógica antiga (será atualizada depois)
                        valordeb_correto: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        { $eq: ["$atend_fixo", "true"] }
                                    ]
                                },
                                then: { $ifNull: ["$atend_fixovalordeb", "0"] },
                                else: {
                                    $cond: {
                                        if: {
                                            $in: [
                                                "$atend_categoria",
                                                ["Substituição", "Falta Justificada", "Feriado", "Falta Absoluta"]
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] },
                                        else: { $ifNull: ["$atend_valordeb", "0"] }
                                    }
                                }
                            }
                        }
                    }
                },

                // Etapa 3: Converter valores para número (tratando vírgulas e strings vazias)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: "$valorcre_correto", find: ",", replacement: "." }
                                    }
                                }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: "$valordeb_correto", find: ",", replacement: "." }
                                    }
                                }
                            }
                        }
                    }
                },

                // Etapa 4: Lookup Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // Etapa 5: Lookup Terapia
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "atend_terapiaid",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // Etapa 6: Agrupar por Convênio + Terapia
                {
                    $group: {
                        _id: {
                            conv_nome: "$conv.conv_nome",
                            terapia_nomecid: "$terapia.terapia_nomecid"
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" }
                    }
                },

                // Etapa 7: Ordenar
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nomecid": 1 } }
            ];

            console.log("[relatendgestaoconsfechado] Executando pipeline de agregação...");
            const rels = await Atend.aggregate(pipeline).exec();
            console.log(`[relatendgestaoconsfechado] Total de grupos retornados: ${rels.length}`);

            // Formatação final
            const relsFormatado = rels.map(r => {
                const formatted = {
                    conv_nome: r._id.conv_nome || "Sem convênio",
                    terapia_nomecid: r._id.terapia_nomecid || "Sem terapia",
                    qtd: r.qtd,
                    tempo: "40 min",
                    total_valorcre: fncGeral.mascaraValores(Math.round(r.total_valorcre * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(r.total_valordeb * 100).toString())
                };
                console.log("[relatendgestaoconsfechado] Grupo formatado:", formatted);
                return formatted;
            });

            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            console.log(`[relatendgestaoconsfechado] Renderizando relatório: ${relsFormatado.length} registros`);
            res.render("atendimento/atendreltera/gestao/relatendgestaoconsfec", {
                rels: relsFormatado,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relatendgestaoconsfechado] Erro no relatório consolidado:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relatendgestaoconsfechadoNEO: async (req, res) => {
        a;
    },
    relatendgestaoconsfechadoOLD_ErroSubsfixo: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                console.log("[relatendgestaoconsfechado] Datas não fornecidas. Renderizando formulário vazio.");
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [],
                    subtotaisPorConvenio: [],
                    periodoDe: '',
                    periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                console.error("[relatendgestaoconsfechado] Datas inválidas:", { dataIniStr, dataFimStr });
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                console.warn("[relatendgestaoconsfechado] Intervalo inválido:", diffDays, "dias");
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            console.log(`[relatendgestaoconsfechado] Período: ${dataIni.toISOString()} → ${dataFim.toISOString()}`);

            // === PIPELINE DE AGREGAÇÃO ===
            const pipeline = [
                // 1. Filtrar por data e EXCLUIR "Falta Absoluta"
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim }, // ✅ CORRIGIDO: estava faltando "data" no final
                        atend_categoria: { $ne: "Falta Absoluta" }
                    }
                },

                // 2. Definir valor CRE com regras por categoria
                {
                    $addFields: {
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    { case: { $eq: ["$atend_categoria", "Falta Justificada"] }, then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "Feriado"] },           then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "Substituição"] },      then: { $ifNull: ["$atend_mergevalorcre", "0"] } },
                                    { case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },    then: { $ifNull: ["$atend_mergevalorcre", "0"] } }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        },
                        // 3. Débito: mantendo lógica antiga por enquanto (será atualizada depois)
                        valordeb_correto: {
                            $cond: {
                                if: {
                                    $or: [
                                        { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        { $eq: ["$atend_fixo", "true"] }
                                    ]
                                },
                                then: { $ifNull: ["$atend_fixovalordeb", "0"] },
                                else: {
                                    $cond: {
                                        if: {
                                            $in: [
                                                "$atend_categoria",
                                                ["Substituição", "Falta Justificada", "Feriado", "Falta Absoluta"]
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] },
                                        else: { $ifNull: ["$atend_valordeb", "0"] }
                                    }
                                }
                            }
                        }
                    }
                },

                // 4. Converter valores para número (tratar vírgulas)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: { $toDouble: { $replaceAll: { input: "$valorcre_correto", find: ",", replacement: "." } } }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: { $toDouble: { $replaceAll: { input: "$valordeb_correto", find: ",", replacement: "." } } }
                            }
                        }
                    }
                },

                // 5. Lookup: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // 6. Lookup: Terapia
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "atend_terapiaid",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // 7. Agrupar por Convênio + Terapia
                {
                    $group: {
                        _id: {
                            conv_nome: "$conv.conv_nome",
                            terapia_nomecid: "$terapia.terapia_nomecid"
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" }
                    }
                },
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nomecid": 1 } }
            ];

            console.log("[relatendgestaoconsfechado] Executando pipeline...");
            const rels = await Atend.aggregate(pipeline).exec();
            console.log(`[relatendgestaoconsfechado] Grupos retornados: ${rels.length}`);

            // === FORMATAR DETALHES POR TERAPIA ===
            const relsFormatado = rels.map(r => ({
                conv_nome: r._id.conv_nome || "Sem convênio",
                terapia_nomecid: r._id.terapia_nomecid || "Sem terapia",
                qtd: r.qtd,
                tempo: "40 min",
                total_valorcre: fncGeral.mascaraValores(Math.round(r.total_valorcre * 100).toString()),
                total_valordeb: fncGeral.mascaraValores(Math.round(r.total_valordeb * 100).toString()),
                // Valores numéricos para cálculo de subtotais
                _valorcre_num: r.total_valorcre,
                _valordeb_num: r.total_valordeb
            }));

            // === CALCULAR SUBTOTAIS POR CONVÊNIO ===
            const subtotaisMap = {};
            relsFormatado.forEach(item => {
                const key = item.conv_nome;
                if (!subtotaisMap[key]) {
                    subtotaisMap[key] = {
                        conv_nome: item.conv_nome,
                        qtd: 0,
                        total_valorcre: 0,
                        total_valordeb: 0
                    };
                }
                subtotaisMap[key].qtd += item.qtd;
                subtotaisMap[key].total_valorcre += item._valorcre_num;
                subtotaisMap[key].total_valordeb += item._valordeb_num;
            });

            const subtotaisPorConvenio = Object.values(subtotaisMap).map(sub => ({
                conv_nome: sub.conv_nome,
                qtd: sub.qtd,
                total_valorcre: fncGeral.mascaraValores(Math.round(sub.total_valorcre * 100).toString()),
                total_valordeb: fncGeral.mascaraValores(Math.round(sub.total_valordeb * 100).toString())
            }));

            console.log("[relatendgestaoconsfechado] Subtotais calculados:", subtotaisPorConvenio);
            // === CALCULAR GRAND TOTAL (todos os convênios) ===
            let grandTotalQtd = 0;
            let grandTotalCre = 0;
            let grandTotalDeb = 0;

            relsFormatado.forEach(item => {
                grandTotalQtd += item.qtd;
                grandTotalCre += item._valorcre_num;
                grandTotalDeb += item._valordeb_num;
            });

            const grandTotal = {
                qtd: grandTotalQtd,
                total_valorcre: fncGeral.mascaraValores(Math.round(grandTotalCre * 100).toString()),
                total_valordeb: fncGeral.mascaraValores(Math.round(grandTotalDeb * 100).toString())
            };

            console.log("[relatendgestaoconsfechado] Grand total:", grandTotal);

            // === RENDERIZAR ===
            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            res.render("atendimento/atendreltera/gestao/relatendgestaoconsfec", {
                rels: relsFormatado,
                subtotaisPorConvenio, // ainda usado para ordenar os convênios
                grandTotal,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relatendgestaoconsfechado] Erro crítico:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relatendgestaoconsfechadoOLD_ErroSemDebs: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            // --- Normalização das datas (aceita query ou body, array ou string) ---
            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [], subtotaisPorConvenio: [], periodoDe: '', periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            // --- PIPELINE DE AGREGAÇÃO CORRIGIDA ---
            const pipeline = [
                // 1. FILTRO INICIAL: período + EXCLUIR categorias indesejadas
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim },
                        atend_categoria: { $nin: ["Falta Absoluta", "Feriado"] } // ✅ exclui ambos
                    }
                },

                // 2. DEFINIR TERAPIA EFETIVA e VALOR CRE EFETIVO
                {
                    $addFields: {
                        // 🔑 TERAPIA EFETIVA (para agrupamento correto)
                        terapia_efetiva_id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta"]] } }
                                            ]
                                        },
                                        then: "$atend_fixoterapiaid"
                                    },
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: "$atend_fixoterapiaid"  // ✅ usa terapia do fixo
                                    }
                                ],
                                default: "$atend_terapiaid" // terapia padrão
                            }
                        },

                        // 💰 VALOR CRE EFETIVO (prioriza fixo quando aplicável)
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalorcre", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        }
                    }
                },

                // 3. CONVERTER VALORES PARA NÚMERO (substitui vírgula por ponto)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valorcre_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        }
                    }
                },

                // 4. LOOKUP: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // 5. LOOKUP: Terapia EFETIVA (não mais atend_terapiaid!)
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "terapia_efetiva_id",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // 6. AGRUPAR por Convênio + Terapia EFETIVA
                {
                    $group: {
                        _id: {
                            conv_nome: { $ifNull: ["$conv.conv_nome", "Sem convênio"] },
                            terapia_nomecid: { $ifNull: ["$terapia.terapia_nomecid", "Sem terapia"] }
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" }
                    }
                },
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nomecid": 1 } }
            ];

            // --- EXECUÇÃO ---
            const rels = await Atend.aggregate(pipeline).exec();

            // --- FORMATAR RESULTADOS ---
            const relsFormatado = rels.map(r => {
                const valorcreNum = r.total_valorcre;
                return {
                    conv_nome: r._id.conv_nome,
                    terapia_nomecid: r._id.terapia_nomecid,
                    qtd: r.qtd,
                    tempo: "40 min", // mantido conforme original
                    total_valorcre: fncGeral.mascaraValores(Math.round(valorcreNum * 100).toString()),
                    _valorcre_num: valorcreNum // auxiliar para cálculos
                };
            });

            // --- SUBTOTAIS POR CONVÊNIO ---
            const subtotaisMap = {};
            relsFormatado.forEach(item => {
                const key = item.conv_nome;
                if (!subtotaisMap[key]) {
                    subtotaisMap[key] = { conv_nome: key, qtd: 0, total_valorcre: 0 };
                }
                subtotaisMap[key].qtd += item.qtd;
                subtotaisMap[key].total_valorcre += item._valorcre_num;
            });

            const subtotaisPorConvenio = Object.values(subtotaisMap).map(sub => ({
                conv_nome: sub.conv_nome,
                qtd: sub.qtd,
                total_valorcre: fncGeral.mascaraValores(Math.round(sub.total_valorcre * 100).toString())
            }));

            // --- GRAND TOTAL ---
            const grandTotal = relsFormatado.reduce((acc, item) => {
                acc.qtd += item.qtd;
                acc.total_valorcre += item._valorcre_num;
                return acc;
            }, { qtd: 0, total_valorcre: 0 });

            grandTotal.total_valorcre = fncGeral.mascaraValores(Math.round(grandTotal.total_valorcre * 100).toString());

            // --- RENDER ---
            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            res.render("atendimento/atendreltera/gestao/relatendgestaoconsfec", {
                rels: relsFormatado,
                subtotaisPorConvenio,
                grandTotal,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relatendgestaoconsfechado] Erro:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relatendgestaoconsfechado: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            // --- Normalização das datas (aceita query ou body, array ou string) ---
            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [], subtotaisPorConvenio: [], periodoDe: '', periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            // --- PIPELINE DE AGREGAÇÃO ---
            const pipeline = [
                // 1. FILTRO INICIAL: período + EXCLUIR categorias indesejadas
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim },
                        atend_categoria: { $nin: ["Falta Absoluta", "Feriado"] } // ✅ mantém exclusão
                    }
                },

                // 2. DEFINIR TERAPIA EFETIVA + VALORES EFETIVOS (CRE e DEB)
                {
                    $addFields: {
                        // 🔑 TERAPIA EFETIVA (para agrupamento correto)
                        terapia_efetiva_id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta"]] } }
                                            ]
                                        },
                                        then: "$atend_fixoterapiaid"
                                    },
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: "$atend_fixoterapiaid"  // ✅ usa terapia do fixo
                                    }
                                ],
                                default: "$atend_terapiaid"
                            }
                        },

                        // 💰 VALOR CRE EFETIVO
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalorcre", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        },

                        // 💳 VALOR DEB EFETIVO (espelhado do CRE, mesma lógica)
                        valordeb_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valordeb", "0"] }
                            }
                        }
                    }
                },

                // 3. CONVERTER VALORES PARA NÚMERO (substitui vírgula por ponto)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valorcre_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valordeb_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        }
                    }
                },

                // 4. LOOKUP: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // 5. LOOKUP: Terapia EFETIVA
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "terapia_efetiva_id",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // 6. AGRUPAR por Convênio + Terapia EFETIVA (inclui débito)
                {
                    $group: {
                        _id: {
                            conv_nome: { $ifNull: ["$conv.conv_nome", "Sem convênio"] },
                            terapia_nomecid: { $ifNull: ["$terapia.terapia_nomecid", "Sem terapia"] }
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" } // ✅ débito incluído
                    }
                },
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nomecid": 1 } }
            ];

            // --- EXECUÇÃO ---
            const rels = await Atend.aggregate(pipeline).exec();

            // --- FORMATAR RESULTADOS ---
            const relsFormatado = rels.map(r => {
                const valorcreNum = r.total_valorcre;
                const valordebNum = r.total_valordeb;

                return {
                    conv_nome: r._id.conv_nome,
                    terapia_nomecid: r._id.terapia_nomecid,
                    qtd: r.qtd,
                    tempo: "40 min", // mantido conforme original
                    total_valorcre: fncGeral.mascaraValores(Math.round(valorcreNum * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(valordebNum * 100).toString()), // ✅
                    _valorcre_num: valorcreNum,
                    _valordeb_num: valordebNum // para cálculos posteriores
                };
            });

            // --- SUBTOTAIS POR CONVÊNIO ---
            const subtotaisMap = {};
            relsFormatado.forEach(item => {
                const key = item.conv_nome;
                if (!subtotaisMap[key]) {
                    subtotaisMap[key] = {
                        conv_nome: key,
                        qtd: 0,
                        total_valorcre: 0,
                        total_valordeb: 0 // ✅
                    };
                }
                subtotaisMap[key].qtd += item.qtd;
                subtotaisMap[key].total_valorcre += item._valorcre_num;
                subtotaisMap[key].total_valordeb += item._valordeb_num; // ✅
            });

            const subtotaisPorConvenio = Object.values(subtotaisMap).map(sub => ({
                conv_nome: sub.conv_nome,
                qtd: sub.qtd,
                total_valorcre: fncGeral.mascaraValores(Math.round(sub.total_valorcre * 100).toString()),
                total_valordeb: fncGeral.mascaraValores(Math.round(sub.total_valordeb * 100).toString()) // ✅
            }));

            // --- GRAND TOTAL ---
            const grandTotal = relsFormatado.reduce((acc, item) => {
                acc.qtd += item.qtd;
                acc.total_valorcre += item._valorcre_num;
                acc.total_valordeb += item._valordeb_num; // ✅
                return acc;
            }, { qtd: 0, total_valorcre: 0, total_valordeb: 0 }); // ✅

            grandTotal.total_valorcre = fncGeral.mascaraValores(Math.round(grandTotal.total_valorcre * 100).toString());
            grandTotal.total_valordeb = fncGeral.mascaraValores(Math.round(grandTotal.total_valordeb * 100).toString()); // ✅

            // --- RENDER ---
            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            res.render("atendimento/atendreltera/gestao/relatendgestaoconsfec", {
                rels: relsFormatado,
                subtotaisPorConvenio,
                grandTotal,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relatendgestaoconsfechado] Erro:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relterapiaconvfecOLD: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            // --- Normalização das datas (aceita query ou body, array ou string) ---
            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [], subtotaisPorConvenio: [], periodoDe: '', periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            // --- PIPELINE DE AGREGAÇÃO ---
            const pipeline = [
                // 1. FILTRO INICIAL: período + EXCLUIR categorias indesejadas
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim },
                        atend_categoria: { $nin: ["Falta Absoluta", "Feriado"] } // ✅ mantém exclusão
                    }
                },

                // 2. DEFINIR TERAPIA EFETIVA + VALORES EFETIVOS (CRE e DEB)
                {
                    $addFields: {
                        // 🔑 TERAPIA EFETIVA (para agrupamento correto)
                        terapia_efetiva_id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta"]] } }
                                            ]
                                        },
                                        then: "$atend_fixoterapiaid"
                                    },
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: "$atend_fixoterapiaid"  // ✅ usa terapia do fixo
                                    }
                                ],
                                default: "$atend_terapiaid"
                            }
                        },

                        // 💰 VALOR CRE EFETIVO
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalorcre", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        },

                        // 💳 VALOR DEB EFETIVO
                        valordeb_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valordeb", "0"] }
                            }
                        }
                    }
                },

                // 3. CONVERTER VALORES PARA NÚMERO (substitui vírgula por ponto)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valorcre_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valordeb_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        }
                    }
                },

                // 4. LOOKUP: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // 5. LOOKUP: Terapia EFETIVA — agora pegamos `terapia_nome` (não mais `terapia_nomecid`)
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "terapia_efetiva_id",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // 6. AGRUPAR por Convênio + terapia_nome (agora é terapia_nome, não nomecid)
                {
                    $group: {
                        _id: {
                            conv_nome: { $ifNull: ["$conv.conv_nome", "Sem convênio"] },
                            terapia_nome: { $ifNull: ["$terapia.terapia_nome", "Sem terapia"] } // ✅ AQUI MUDA
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" }
                    }
                },
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nome": 1 } }
            ];

            // --- EXECUÇÃO ---
            const rels = await Atend.aggregate(pipeline).exec();

            // --- FORMATAR RESULTADOS (com tempo dinâmico) ---
           const relsFormatado = rels.map(r => {
                const valorcreNum = r.total_valorcre;
                const valordebNum = r.total_valordeb;
                const saldoNum = valorcreNum - valordebNum; // ✅ cálculo do saldo

                const nomeTerapia = (r._id.terapia_nome || "").trim();
                const isABA_AT = /aba\s+at/i.test(nomeTerapia);

                return {
                    conv_nome: r._id.conv_nome,
                    terapia_nome: nomeTerapia,
                    qtd: r.qtd,
                    tempo: isABA_AT ? "60 min" : "40 min",
                    total_valorcre: fncGeral.mascaraValores(Math.round(valorcreNum * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(valordebNum * 100).toString()),
                    total_saldo: fncGeral.mascaraValores(Math.round(saldoNum * 100).toString()), // ✅ saldo formatado
                    _valorcre_num: valorcreNum,
                    _valordeb_num: valordebNum,
                    _saldo_num: saldoNum // opcional, se precisar reutilizar depois
                };
            });

            // --- SUBTOTAIS POR CONVÊNIO ---
            const subtotaisMap = {};
            relsFormatado.forEach(item => {
                const key = item.conv_nome;
                if (!subtotaisMap[key]) {
                    subtotaisMap[key] = {
                        conv_nome: key,
                        qtd: 0,
                        total_valorcre: 0,
                        total_valordeb: 0
                    };
                }
                subtotaisMap[key].qtd += item.qtd;
                subtotaisMap[key].total_valorcre += item._valorcre_num;
                subtotaisMap[key].total_valordeb += item._valordeb_num;
            });

           const subtotaisPorConvenio = Object.values(subtotaisMap).map(sub => {
                const saldoNum = sub.total_valorcre - sub.total_valordeb; // ✅ saldo por convênio
                return {
                    conv_nome: sub.conv_nome,
                    qtd: sub.qtd,
                    total_valorcre: fncGeral.mascaraValores(Math.round(sub.total_valorcre * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(sub.total_valordeb * 100).toString()),
                    total_saldo: fncGeral.mascaraValores(Math.round(saldoNum * 100).toString()) // ✅
                };
            });

            // --- GRAND TOTAL ---
           const grandTotal = relsFormatado.reduce((acc, item) => {
                acc.qtd += item.qtd;
                acc.total_valorcre += item._valorcre_num;
                acc.total_valordeb += item._valordeb_num;
                return acc;
            }, { qtd: 0, total_valorcre: 0, total_valordeb: 0 });

            const grandSaldo = grandTotal.total_valorcre - grandTotal.total_valordeb;

            grandTotal.total_valorcre = fncGeral.mascaraValores(Math.round(grandTotal.total_valorcre * 100).toString());
            grandTotal.total_valordeb = fncGeral.mascaraValores(Math.round(grandTotal.total_valordeb * 100).toString());
            grandTotal.total_saldo = fncGeral.mascaraValores(Math.round(grandSaldo * 100).toString()); // ✅
            
            // --- RENDER ---
            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            res.render("atendimento/atendreltera/gestao/relterapiaconvfec", {
                rels: relsFormatado,
                subtotaisPorConvenio,
                grandTotal,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relterapiaconvfec] Erro:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },
    relterapiaconvfec: async (req, res) => {
        try {
            const db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            // --- Normalização das datas (aceita query ou body, array ou string) ---
            const dataIniStr = Array.isArray(req.query.dataIni) ? req.query.dataIni[0] : (req.query.dataIni || req.body.dataIni);
            const dataFimStr = Array.isArray(req.query.dataFim) ? req.query.dataFim[0] : (req.query.dataFim || req.body.dataFim);

            if (!dataIniStr || !dataFimStr) {
                return res.render("atendimento/atendreltera/gestao/relatendgestaocons", {
                    rels: [], subtotaisPorConvenio: [], periodoDe: '', periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            if (isNaN(dataIni.getTime()) || isNaN(dataFim.getTime())) {
                return res.status(400).send("Datas inválidas.");
            }
            dataFim.setUTCHours(23, 59, 59, 999);

            const diffDays = Math.ceil((dataFim - dataIni) / (1000 * 60 * 60 * 24));
            if (diffDays > 31 || diffDays < 0) {
                return res.status(400).send("O intervalo máximo permitido é de 31 dias.");
            }

            // --- PIPELINE DE AGREGAÇÃO ---
            const pipeline = [
                // 1. FILTRO INICIAL: período + EXCLUIR categorias indesejadas
                {
                    $match: {
                        atend_atenddata: { $gte: dataIni, $lte: dataFim },
                        atend_categoria: { $nin: ["Falta Absoluta", "Feriado"] } // ✅ mantém exclusão
                    }
                },

                // 2. DEFINIR TERAPIA EFETIVA + VALORES EFETIVOS (CRE e DEB)
                {
                    $addFields: {
                        // 🔑 TERAPIA EFETIVA (para agrupamento correto)
                        terapia_efetiva_id: {
                            $switch: {
                                branches: [
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta"]] } }
                                            ]
                                        },
                                        then: "$atend_fixoterapiaid"
                                    },
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: "$atend_fixoterapiaid"  // ✅ usa terapia do fixo
                                    }
                                ],
                                default: "$atend_terapiaid"
                            }
                        },

                        // 💰 VALOR CRE EFETIVO
                        valorcre_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalorcre", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalorcre", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valorcre", "0"] }
                            }
                        },

                        // 💳 VALOR DEB EFETIVO
                        valordeb_correto: {
                            $switch: {
                                branches: [
                                    {
                                        case: { $eq: ["$atend_categoria", "SubstitutoFixo"] },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: {
                                            $and: [
                                                { $eq: ["$atend_fixo", "true"] },
                                                { $not: { $in: ["$atend_categoria", ["Feriado", "Falta Absoluta", "Falta Justificada"]] } }
                                            ]
                                        },
                                        then: { $ifNull: ["$atend_fixovalordeb", "0"] }
                                    },
                                    {
                                        case: { $in: ["$atend_categoria", ["Falta Justificada"]] },
                                        then: { $ifNull: ["$atend_mergevalordeb", "0"] }
                                    }
                                ],
                                default: { $ifNull: ["$atend_valordeb", "0"] }
                            }
                        }
                    }
                },

                // 3. CONVERTER VALORES PARA NÚMERO (substitui vírgula por ponto)
                {
                    $addFields: {
                        _valorcre: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valorcre_correto", ""] }, { $eq: ["$valorcre_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valorcre_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        },
                        _valordeb: {
                            $cond: {
                                if: { $or: [{ $eq: ["$valordeb_correto", ""] }, { $eq: ["$valordeb_correto", null] }] },
                                then: 0,
                                else: {
                                    $toDouble: {
                                        $replaceAll: { input: { $toString: "$valordeb_correto" }, find: ",", replacement: "." }
                                    }
                                }
                            }
                        }
                    }
                },

                // 4. LOOKUP: Convênio
                {
                    $lookup: {
                        from: Conv.collection.name,
                        localField: "atend_convid",
                        foreignField: "_id",
                        as: "conv"
                    }
                },
                { $unwind: { path: "$conv", preserveNullAndEmptyArrays: true } },

                // 5. LOOKUP: Terapia EFETIVA — agora pegamos `terapia_nome` (não mais `terapia_nomecid`)
                {
                    $lookup: {
                        from: Terapia.collection.name,
                        localField: "terapia_efetiva_id",
                        foreignField: "_id",
                        as: "terapia"
                    }
                },
                { $unwind: { path: "$terapia", preserveNullAndEmptyArrays: true } },

                // 6. AGRUPAR por Convênio + terapia_nome (agora é terapia_nome, não nomecid)
                {
                    $group: {
                        _id: {
                            conv_nome: { $ifNull: ["$conv.conv_nome", "Sem convênio"] },
                            terapia_nome: { $ifNull: ["$terapia.terapia_nome", "Sem terapia"] } // ✅ AQUI MUDA
                        },
                        qtd: { $sum: 1 },
                        total_valorcre: { $sum: "$_valorcre" },
                        total_valordeb: { $sum: "$_valordeb" }
                    }
                },
                { $sort: { "_id.conv_nome": 1, "_id.terapia_nome": 1 } }
            ];

            // --- EXECUÇÃO ---
            const rels = await Atend.aggregate(pipeline).exec();

            // --- FORMATAR RESULTADOS (com tempo dinâmico) ---
           const relsFormatado = rels.map(r => {
                const valorcreNum = r.total_valorcre;
                const valordebNum = r.total_valordeb;
                const saldoNum = valorcreNum - valordebNum; // ✅ cálculo do saldo

                const nomeTerapia = (r._id.terapia_nome || "").trim();
                const isABA_AT = /aba\s+at/i.test(nomeTerapia);

                return {
                    conv_nome: r._id.conv_nome,
                    terapia_nome: nomeTerapia,
                    qtd: r.qtd,
                    tempo: isABA_AT ? "60 min" : "40 min",
                    total_valorcre: fncGeral.mascaraValores(Math.round(valorcreNum * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(valordebNum * 100).toString()),
                    total_saldo: fncGeral.mascaraValores(Math.round(saldoNum * 100).toString()), // ✅ saldo formatado
                    _valorcre_num: valorcreNum,
                    _valordeb_num: valordebNum,
                    _saldo_num: saldoNum // opcional, se precisar reutilizar depois
                };
            });

            // --- SUBTOTAIS POR CONVÊNIO ---
            const subtotaisMap = {};
            relsFormatado.forEach(item => {
                const key = item.conv_nome;
                if (!subtotaisMap[key]) {
                    subtotaisMap[key] = {
                        conv_nome: key,
                        qtd: 0,
                        total_valorcre: 0,
                        total_valordeb: 0
                    };
                }
                subtotaisMap[key].qtd += item.qtd;
                subtotaisMap[key].total_valorcre += item._valorcre_num;
                subtotaisMap[key].total_valordeb += item._valordeb_num;
            });

           const subtotaisPorConvenio = Object.values(subtotaisMap).map(sub => {
                const saldoNum = sub.total_valorcre - sub.total_valordeb; // ✅ saldo por convênio
                return {
                    conv_nome: sub.conv_nome,
                    qtd: sub.qtd,
                    total_valorcre: fncGeral.mascaraValores(Math.round(sub.total_valorcre * 100).toString()),
                    total_valordeb: fncGeral.mascaraValores(Math.round(sub.total_valordeb * 100).toString()),
                    total_saldo: fncGeral.mascaraValores(Math.round(saldoNum * 100).toString()) // ✅
                };
            });

            // --- GRAND TOTAL ---
           const grandTotal = relsFormatado.reduce((acc, item) => {
                acc.qtd += item.qtd;
                acc.total_valorcre += item._valorcre_num;
                acc.total_valordeb += item._valordeb_num;
                return acc;
            }, { qtd: 0, total_valorcre: 0, total_valordeb: 0 });

            const grandSaldo = grandTotal.total_valorcre - grandTotal.total_valordeb;

            grandTotal.total_valorcre = fncGeral.mascaraValores(Math.round(grandTotal.total_valorcre * 100).toString());
            grandTotal.total_valordeb = fncGeral.mascaraValores(Math.round(grandTotal.total_valordeb * 100).toString());
            grandTotal.total_saldo = fncGeral.mascaraValores(Math.round(grandSaldo * 100).toString()); // ✅
            
            // --- RENDER ---
            const periodoDe = fncGeral.getDataInvert(dataIni.toISOString().substring(0, 10));
            const periodoAte = fncGeral.getDataInvert(dataFim.toISOString().substring(0, 10));

            res.render("atendimento/atendreltera/gestao/relterapiaconvfec", {
                rels: relsFormatado,
                subtotaisPorConvenio,
                grandTotal,
                periodoDe,
                periodoAte,
                pesquisa: {
                    dataIni: dataIni.toISOString().substring(0, 10),
                    dataFim: dataFim.toISOString().substring(0, 10)
                }
            });

        } catch (err) {
            console.error("[relterapiaconvfec] Erro:", err);
            res.status(500).send("Erro ao gerar relatório consolidado.");
        }
    },

   relfaltasbene: async (req, res) => {
        try {
            console.log("\n======================");
            console.log("🔍 INICIANDO relfaltasbene");
            console.log("======================");

            const db = req.cookies['preferredDb'];
            if (!db) return res.status(400).send("Banco de dados não selecionado.");
            console.log("📌 Banco selecionado:", db);

            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Bene  = getModel(db, 'tb_bene', beneClass.BeneSchema);
            const Conv  = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            // ------------------------ DATAS ------------------------
            const dataIniStr = req.query.dataIni || req.body.dataIni;
            const dataFimStr = req.query.dataFim || req.body.dataFim;

            console.log("📅 Datas recebidas:", dataIniStr, "→", dataFimStr);

            if (!dataIniStr || !dataFimStr) {
                console.log("⚠️ Datas não enviadas.");
                return res.render("atendimento/atendreltera/gestao/relfaltasbene", {
                    rels: [],
                    periodoDe: '',
                    periodoAte: '',
                    pesquisa: { dataIni: '', dataFim: '' }
                });
            }

            const dataIni = new Date(dataIniStr);
            const dataFim = new Date(dataFimStr);
            dataFim.setUTCHours(23, 59, 59, 999);

            // ---------------------- BUSCA ATEND ----------------------
            console.log("\n📥 Buscando atendimentos...");
            const atendimentos = await Atend.find(
                {
                    atend_atenddata: { $gte: dataIni, $lte: dataFim },
                    atend_beneid: { $ne: null },
                    atend_convid: { $ne: null }
                },
                'atend_beneid atend_convid atend_categoria atend_atenddata atend_atendhora atend_terapia atend_terapeuta atend_terapiaid'
            ).lean();

            console.log("   → Encontrados:", atendimentos.length);

            if (atendimentos.length === 0) {
                console.log("⚠️ Nenhum registro encontrado.");
                return res.render("atendimento/atendreltera/gestao/relfaltasbene", {
                    rels: [],
                    periodoDe: dataIniStr,
                    periodoAte: dataFimStr,
                    pesquisa: { dataIni: dataIniStr, dataFim: dataFimStr }
                });
            }

            // ---------------------- BUSCAR NOMES ----------------------
            const beneIds = [...new Set(atendimentos.map(a => String(a.atend_beneid)))];
            const convIds = [...new Set(atendimentos.map(a => String(a.atend_convid)))];
            const terapiaIds = [...new Set(atendimentos.map(a => String(a.atend_terapiaid)))];

            console.log("\n📥 Buscando nomes dos beneficiários...");
            const benes = await Bene.find({ _id: { $in: beneIds } }, 'bene_nome').lean();

            console.log("📥 Buscando nomes dos convênios...");
            const convs = await Conv.find({ _id: { $in: convIds } }, 'conv_nome').lean();

            console.log("📥 Buscando nomes das terapias CID...");
            const terapias = await Terapia.find({ _id: { $in: terapiaIds } }, 'terapia_cid').lean();

            const beneMap = Object.fromEntries(benes.map(b => [String(b._id), b.bene_nome]));
            const convMap = Object.fromEntries(convs.map(c => [String(c._id), c.conv_nome]));
            const terapiaMap = Object.fromEntries(terapias.map(c => [String(c._id), c.terapia_cid]));

            // ---------------------- AGRUPAMENTO ----------------------
            console.log("\n📊 AGRUPANDO registros...");
            const mapa = {};

            for (const at of atendimentos) {
                const beneId = String(at.atend_beneid);
                const convId = String(at.atend_convid);

                if (!mapa[beneId]) {
                    mapa[beneId] = {
                        bene_id: beneId,
                        bene_nome: beneMap[beneId] || "—",
                        convenio: convMap[convId] || "—",   // 👈 agora sempre aplica
                        total_registros: 0,
                        qt_falta: 0,
                        qt_falta_abs: 0,
                        qt_falta_jus: 0,
                        qt_feriado: 0,
                        detalhes: []
                    };
                }

                const item = mapa[beneId];
                item.total_registros++;

                // ----------- CONTAGEM DE CATEGORIAS -----------
                switch (at.atend_categoria) {
                    case "Falta":
                        item.qt_falta++;
                        break;
                    case "Falta Absoluta":
                        item.qt_falta_abs++;
                        break;
                    case "Falta Justificada":
                        item.qt_falta_jus++;
                        break;
                    case "Feriado":
                        item.qt_feriado++;
                        break;
                }

                // ----------- DETALHES -----------
                const dataBr = at.atend_atenddata
                    ? new Date(at.atend_atenddata).toISOString().slice(0, 10).split("-").reverse().join("/")
                    : "—";

                item.detalhes.push({
                    data: dataBr,
                    hora: at.atend_atendhora || "—",
                    terapia: at.atend_terapia || "—",
                    terapeuta: at.atend_terapeuta || "—",
                    categoria: at.atend_categoria || "—"
                });
            }

            // ------------------------ RESULTADOS ------------------------
            console.log("\n📌 RESULTADOS POR BENEFICIÁRIO:");
            console.log("----------------------------------------------------");

            let rels = Object.values(mapa).map(r => {
                const totalFaltas = r.qt_falta + r.qt_falta_abs + r.qt_falta_jus;

                const indice = r.total_registros > 0
                    ? parseFloat((totalFaltas / r.total_registros).toFixed(4))
                    : 0;

                console.log(`
    👤 BENEFICIÁRIO: ${r.bene_nome}
    🏥 CONVÊNIO: ${r.convenio}
    📌 Total registros: ${r.total_registros}
    ❌ Falta: ${r.qt_falta}
    ❌ Falta Absoluta: ${r.qt_falta_abs}
    ❌ Falta Justificada: ${r.qt_falta_jus}
    🟦 Feriado: ${r.qt_feriado}
    📉 Índice: ${indice}
    ----------------------------------------------------
                `);

                return {
                    ...r,
                    indice_faltas: (indice * 100).toFixed(2) // converte para porcentagem
                };
            });

            // ------------------------ ORDENAR ------------------------
            rels.sort((a, b) =>
                a.bene_nome.localeCompare(b.bene_nome, "pt", { sensitivity: "base" })
            );

            // ------------------------ RENDER ------------------------
            return res.render("atendimento/atendreltera/gestao/relfaltasbene", {
                rels,
                periodoDe: dataIniStr.split("-").reverse().join("/"),
                periodoAte: dataFimStr.split("-").reverse().join("/"),
                pesquisa: { dataIni: dataIniStr, dataFim: dataFimStr }
            });

        } catch (err) {
            console.error("💥 Erro em relfaltasbene:", err);
            return res.status(500).send("Erro ao gerar relatório de faltas.");
        }
    },
    relAtendteraconsFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let listaPadrao = ["Padrao","SubstitutoFixo","Supervisão"];//Dados Básicos
        let listaCasoAParte = ["Substituição"];//Apenas se ele substituiu, caso foi substituido NÃO sai na frequência
        let listaExcecoes = ["Extra","Apoio", "Falta"]//Vai sair ou dados basicos ou merge dependendo da onde estiver o terapeuta
        let listaNaoSai = ["Falta Justificada","Feriado","Falta Absoluta","Glosa","Pais"];//NÃO sai na frequência 
        let rel = [];
        let terapiaAtend;
        let convidAtend;
        let beneAtend;
        let terapeutaAtend;
        let count;
        let continuar = false;
        let pesquisa = new Pesquisa();
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let periodoDe = fncGeral.getData(seg);//date -> dd/mm/yyyy
        let periodoAte = fncGeral.getData(sex);//date -> dd/mm/yyyy
        let totalFinal = 0;
        let totalSessoes = 0
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let filtroAtend = {atend_atenddata: { $gte: seg, $lte: sex }, $or: [{atend_terapeutaid: req.body.relTeraid},{atend_mergeterapeutaid: req.body.relTeraid}]}

        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Atend.find(filtroAtend).then((atend)=>{
                console.log("Atend: "+atend.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                                terapeuta.some((t)=>{
                                    if((""+t._id) === (""+req.body.relTeraid)){
                                        terapeuta_nome = t.usuario_nome;
                                        return true;
                                    }
                                    return false;
                                })
                                
                                Terapia.find().then((terapiaLis)=>{
                                    terapiaLis.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("at.length:"+at.length)
                                    atend.sort(function(a, b) {
                                        let d1 = new Date(a.atend_atenddata);
                                        let d2 = new Date(b.atend_atenddata);
                                        d1.setHours(0);
                                        d1.setMinutes(0);
                                        d1.setSeconds(0);
                                        d2.setHours(0);
                                        d2.setMinutes(0);
                                        d2.setSeconds(0);
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    atend.sort((a, b) => a.atend_categoria.localeCompare(b.atend_categoria));
                                    count = 0;

                                    // objeto que armazenará o agrupamento final
                                    const resultado = [];

                                    for (const a of atend) {

                                    }

                                    for (const a of atend) {
                                        continuar = true;
                                        const terapiaAtend = String(a.atend_terapiaid);

                                        // busca nome da terapia
                                        var terapiaA;
                                        var teranome;

                                        // determina qual valor usar de acordo com categoria
                                        let valdeb = "0,00";
                                        if (listaPadrao.includes(a.atend_categoria)) {
                                            valdeb = a.atend_valordeb || "0,00";
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                        } else if ((a.atend_categoria === "Substituição" && (""+a.atend_mergeterapeutaid+"") != (""+req.body.relTeraid+"") && (""+a.atend_terapeutaid+"") == (""+req.body.relTeraid+"")) || listaNaoSai.includes(a.atend_categoria)) {
                                            continuar = false;
                                        } else if (a.atend_categoria == "Substituição" && (""+a.atend_mergeterapeutaid+"") == (""+req.body.relTeraid+"")){
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_mergeterapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                            valdeb = a.atend_mergevalordeb || "0,00";
                                        } else if (listaExcecoes.includes(a.atend_categoria)){
                                            if ((""+a.atend_mergeterapeutaid+"") == (""+req.body.relTeraid+"")){
                                                terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_mergeterapiaid));
                                                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                                valdeb = a.atend_mergevalordeb || "0,00";
                                            } else if ((""+a.atend_terapeutaid+"") == (""+req.body.relTeraid+"")) {
                                                terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                                valdeb = a.atend_valordeb || "0,00";
                                            }
                                            if (teranome == "MUSICOTERAPIA"){
                                                console.log("A: "+a);
                                            }
                                        } else {
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                            valdeb = a.atend_valordeb || "0,00";
                                        }

                                        if (continuar){
                                            // normaliza o valor para número
                                            const valorNum = parseFloat(valdeb.toString().replace(",", "."));
                                            
                                            // procura se já existe o mesmo terapeuta + terapia + valor
                                            const existente = resultado.find(r =>
                                                r.nomecid === teranome &&
                                                r.valor === valdeb
                                            );

                                            if (existente) {
                                                // incrementa sessões e recalcula total
                                                existente.sessoes += 1;
                                                existente.total = (valorNum * existente.sessoes).toFixed(2);
                                            } else {
                                                // cria novo objeto RelAtend
                                                const novoRel = new RelAtend(
                                                    teranome,   // nomecid
                                                    1,          // sessoes
                                                    "",         // convid
                                                    valdeb,     // valor
                                                    valorNum.toFixed(2) // total (1 sessão * valor)
                                                );
                                                novoRel.terapeuta = a.atend_terapeutaid;
                                                resultado.push(novoRel);
                                            }
                                        }
                                    }
                                    // após o loop, soma o total geral
                                    for (const r of resultado) {
                                        totalFinal += parseInt(r.total.replace(",","").replace(".",""));
                                        totalSessoes += r.sessoes;
                                    }
                                    totalFinal = fncGeral.mascaraValores(totalFinal);
                                    res.render("atendimento/atendreltera/relatendteracons", {anos: ano, terapeutas: terapeuta, terapias: terapiaLis, benes: bene, rels: resultado, periodoDe, periodoAte, terapeuta_nome, totalFinal, pesquisa, totalSessoes})
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    relAtendteraconsFiltroV(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let listaPadrao = ["Padrão","SubstitutoFixo","Supervisão"];//Dados Básicos
        let listaCasoAParte = ["Substituição"];//Apenas se ele substituiu, caso foi substituido NÃO sai na frequência
        let listaExcecoes = ["Apoio", "Falta"]//Vai sair ou dados basicos ou merge dependendo da onde estiver o terapeuta
        let listaNaoSai = ["Extra","Falta Justificada","Feriado","Falta Absoluta","Glosa","Pais"];//NÃO sai na frequência 
        let rel = [];
        let terapiaAtend;
        let convidAtend;
        let beneAtend;
        let terapeutaAtend;
        let count;
        let continuar = false;
        let pesquisa = new Pesquisa();
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let periodoDe = fncGeral.getData(seg);//date -> dd/mm/yyyy
        let periodoAte = fncGeral.getData(sex);//date -> dd/mm/yyyy
        let totalFinal = 0;
        let totalSessoes = 0
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let filtroAtend = {atend_atenddata: { $gte: seg, $lte: sex }, $or: [{atend_terapeutaid: req.body.relTeraid},{atend_mergeterapeutaid: req.body.relTeraid}]}

        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Atend.find(filtroAtend).then((atend)=>{
                console.log("Atend: "+atend.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                                terapeuta.some((t)=>{
                                    if((""+t._id) === (""+req.body.relTeraid)){
                                        terapeuta_nome = t.usuario_nome;
                                        return true;
                                    }
                                    return false;
                                })
                                
                                Terapia.find().then((terapiaLis)=>{
                                    terapiaLis.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("at.length:"+at.length)
                                    atend.sort(function(a, b) {
                                        let d1 = new Date(a.atend_atenddata);
                                        let d2 = new Date(b.atend_atenddata);
                                        d1.setHours(0);
                                        d1.setMinutes(0);
                                        d1.setSeconds(0);
                                        d2.setHours(0);
                                        d2.setMinutes(0);
                                        d2.setSeconds(0);
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    atend.sort((a, b) => a.atend_categoria.localeCompare(b.atend_categoria));
                                    count = 0;

                                    // objeto que armazenará o agrupamento final
                                    const resultado = [];
const relArrData = [];
                                    for (const a of atend) {

                                    }

                                    for (const a of atend) {
                                        continuar = true;
                                        const terapiaAtend = String(a.atend_terapiaid);
const id = a._id;
                                        // busca nome da terapia
                                        var terapiaA;
                                        var teranome;

                                        // determina qual valor usar de acordo com categoria
                                        let valdeb = "0,00";
                                        if (listaPadrao.includes(a.atend_categoria)) {
                                            valdeb = a.atend_valordeb || "0,00";
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                            console.log("base")
                                        } else if ((a.atend_categoria === "Substituição" && (""+a.atend_mergeterapeutaid+"") != (""+req.body.relTeraid+"") && (""+a.atend_terapeutaid+"") == (""+req.body.relTeraid+"")) || listaNaoSai.includes(a.atend_categoria)) {
                                            continuar = false;
                                            console.log("PARE!"+a)
                                        } else if (a.atend_categoria == "Substituição" && (""+a.atend_mergeterapeutaid+"") == (""+req.body.relTeraid+"")){
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_mergeterapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                            valdeb = a.atend_mergevalordeb || "0,00";
                                            console.log("Substituição?"+a._id)
                                        } else if (a.atend_categoria == "Apoio"){
                                            if ((""+a.atend_mergeterapeutaid+"") == (""+req.body.relTeraid+"")){
                                                terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_mergeterapiaid));
                                                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                                valdeb = a.atend_mergevalordeb || "0,00";
                                                console.log("apoio1"+a._id)
                                            } else if ((""+a.atend_terapeutaid+"") == (""+req.body.relTeraid+"")) {
                                                terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                                valdeb = a.atend_valordeb || "0,00";
                                                console.log("apoio2"+a._id)
                                            }
                                        } else if (a.atend_categoria == "Falta") {
                                            const temMerge = !!a.atend_mergeterapiaid;
                                            const terapeutaEhMerge = String(a.atend_mergeterapeutaid) === String(req.body.relTeraid);
                                            const terapeutaEhBase = String(a.atend_terapeutaid) === String(req.body.relTeraid);

                                            // Mostrar falta apenas se atender a regra
                                            if ((!temMerge && terapeutaEhBase) || (temMerge && terapeutaEhMerge)) {
                                                terapiaA = terapiaLis.find(temp => 
                                                    String(temp._id) === String(temMerge ? a.atend_mergeterapiaid : a.atend_terapiaid)
                                                );
                                                teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                                valdeb = temMerge ? (a.atend_mergevalordeb || "0,00") : (a.atend_valordeb || "0,00");
                                                console.log("Falta válida: " + a._id);
                                            } else {
                                                continuar = false; // <-- bloqueia o push
                                                console.log("Falta ignorada: " + a._id);
                                            }
                                        } else {
                                            terapiaA = terapiaLis.find(temp => String(temp._id) === String(a.atend_terapiaid));
                                            teranome = terapiaA ? terapiaA.terapia_nomecid : "Terapia Desconhecida";
                                            valdeb = a.atend_valordeb || "0,00";
                                        }

                                        if (!continuar) continue;
                                        // normaliza o valor para número
                                        const valorNum = parseFloat(valdeb.toString().replace(",", "."));
                                        
                                        // procura se já existe o mesmo terapeuta + terapia + valor
                                        const existente = resultado.find(r =>
                                            r.nomecid === teranome &&
                                            r.valor === valdeb
                                        );

                                        if (existente) {
                                            // incrementa sessões e recalcula total
                                            existente.sessoes += 1;
                                            existente.total = (valorNum * existente.sessoes).toFixed(2);
                                        } else {
                                            // cria novo objeto RelAtend
                                            const novoRel = new RelAtend(
                                                teranome,   // nomecid
                                                1,          // sessoes
                                                "",         // convid
                                                valdeb,     // valor
                                                valorNum.toFixed(2) // total (1 sessão * valor)
                                            );
                                            novoRel.terapeuta = a.atend_terapeutaid;
                                            resultado.push(novoRel);
                                        }
                                    }
                                    // após o loop, soma o total geral
                                    for (const r of resultado) {
                                        totalFinal += parseInt(r.total.replace(",","").replace(".",""));
                                        totalSessoes += r.sessoes;
                                    }
                                    totalSessoes = fncGeral.mascaraValores(totalSessoes);
                                    res.render("atendimento/atendreltera/relatendteracons", {anos: ano, terapeutas: terapeuta, terapias: terapiaLis, benes: bene, rels: resultado, periodoDe, periodoAte, terapeuta_nome, totalFinal, pesquisa, totalSessoes})
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    relAtendteraconsFiltroOld(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let listaPadrao = ["Padrao","Extra","Falta","SubstitutoFixo"];//Dados Básicos
        let listaExcecoes = ["Substituição"];//Apenas se ele substituiu, caso foi substituido NÃO sai na frequência
        let listaNaoSai = ["Falta Justificada","Feriado","Falta Absoluta","Glosa","Pais","Supervisão"];//NÃO sai na frequência 
        let rel = [];
        let terapiaAtend;
        let convidAtend;
        let beneAtend;
        let terapeutaAtend;
        let count;
        let continuar = false;
        let pesquisa = new Pesquisa();
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let periodoDe = fncGeral.getData(seg);//date -> dd/mm/yyyy
        let periodoAte = fncGeral.getData(sex);//date -> dd/mm/yyyy
        let totalFinal = 0;
        let totalSessoes = 0
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let filtroAtend = {atend_atenddata: { $gte: seg, $lte: sex }, $or: [{atend_terapeutaid: req.body.relTeraid},{atend_mergeterapeutaid: req.body.relTeraid}]}

        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
            Atend.find(filtroAtend).then((atend)=>{
                console.log("Atend: "+atend.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                                terapeuta.some((t)=>{
                                    if((""+t._id) === (""+req.body.relTeraid)){
                                        terapeuta_nome = t.usuario_nome;
                                        return true;
                                    }
                                    return false;
                                })
                                
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("at.length:"+at.length)
                                    atend.sort(function(a, b) {
                                        let d1 = new Date(a.atend_atenddata);
                                        let d2 = new Date(b.atend_atenddata);
                                        d1.setHours(0);
                                        d1.setMinutes(0);
                                        d1.setSeconds(0);
                                        d2.setHours(0);
                                        d2.setMinutes(0);
                                        d2.setSeconds(0);
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });

                                    let rab = new RelAtend();
                                    count = 0;
                                
                                    atend.forEach((a)=>{
                                        continuar = "true";
                                        if (a.atend_atenddata.getTimezoneOffset() == 180){
                                            a.atend_atenddata.setHours(a.atend_atenddata.getHours()+3);
                                        }
                                        rab.dt = a.atend_atenddata;

                                        let hours = (""+a.atend_atenddata.getHours());
                                        let mins = (""+a.atend_atenddata.getMinutes());
                                        if (hours.length == 1){
                                            hours = "0"+hours;
                                        }
                                        if (mins.length == 1){
                                            mins = "0"+mins;
                                        }

                                        rab.hora = (hours+":"+mins);
                                        categorias = a.atend_categoria;
                                        //console.log("categorias: "+categorias)
                                        
                                        if (listaPadrao.includes(categorias)){
                                            terapiaAtend = a.atend_terapiaid;
                                            terapeutaAtend = a.atend_terapeutaid;
                                        } else if (categorias == "Apoio"){
                                            if (a.atend_terapeutaid == req.body.relTeraid){
                                                terapiaAtend = a.atend_terapiaid;
                                                terapeutaAtend = a.atend_terapeutaid;
                                            } else {
                                                terapiaAtend = a.atend_mergeterapiaid;
                                                terapeutaAtend = a.atend_mergeterapeutaid;
                                            }
                                        } else if (categorias == "Substituição"){
                                            if (a.atend_mergeterapeutaid == req.body.relTeraid){
                                                terapiaAtend = a.atend_mergeterapiaid;
                                                terapeutaAtend = a.atend_mergeterapeutaid;
                                            }
                                        } else {
                                            continuar = "false";
                                        }

                                        if (continuar == "true"){
                                            let teraTemp;
                                            terapia.some((temp)=>{
                                                if ((""+temp._id) == (""+terapiaAtend)){
                                                    teraTemp = temp;
                                                    teranome = temp.terapia_nomecid;
                                                }
                                            })
                                            count++;
                                            let benetemp;
                                            let valdeb;

                                            bene.some((b)=>{
                                                if((""+b._id) === (""+beneAtend)){
                                                    bene_nome = b.bene_nome;
                                                    benetemp = b.bene_convid;

                                                    return true;
                                                }
                                                return false;
                                            })

                                            convdeb.forEach((cdeb)=>{
                                                if ((""+cdeb.convdeb_convid) == (""+benetemp) && (""+cdeb.convdeb_terapiaid)  == (""+terapiaAtend)){
                                                    valdeb = cdeb.convdeb_valor;
                                                }
                                            })

                                            rab.nomecid = teranome;
                                            rab.valor = valdeb;
                                            let existe = rel.find(r => (""+r.nomecid+"") === (""+teranome+"") && r.valor === valdeb);
                                            
                                            if (existe) {
                                                existe.sessoes += 1;
                                            } else {
                                                rel.push({
                                                    nomecid: teranome,
                                                    valor: valdeb,
                                                    sessoes: 1,
                                                    convid: a.atend_convid
                                                });
                                            }
                                            
                                            //rab.sessoes = count;
                                        }
                                    })
                                    rel.forEach((r)=>{
                                        if (!r.valor || r.valor === "undefined" || r.valor === "N,aN") {
                                            const ccre = convcre.find(c =>
                                                "" + c.convcre_convid === "" + r.convid &&
                                                "" + c.convcre_terapiaid === "" + r.nomecid
                                            );
                                            console.log("convid: "+r.convid)
                                            console.log("nomecid: "+r.nomecid)
                                            r.valor = ccre ? ccre.convcre_valor : "0,00";
                                        }
                                        terapia.some((t)=>{
                                            if (t.terapia_nomecid == r.nomecid){
                                                r.nomecid = t._id;
                                            }
                                        })
                                        r.total = fncGeral.mascaraValores(parseInt(r.valor.toString().replace(",","").replace(".","")) * r.sessoes);
                                        totalFinal += parseInt(r.valor.toString().replace(",","").replace(".","")) * r.sessoes;
                                        totalSessoes += r.sessoes;
                                    })
                                    totalFinal = fncGeral.mascaraValores(totalFinal);
                                    res.render("atendimento/atendreltera/relatendteracons", {anos: ano, terapeutas: terapeuta, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, totalFinal, pesquisa, totalSessoes})
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    }
}
/*
let ig = 0
atend.forEach(a=>{
    ig++;
    Atend.deleteOne({//_id: a._id}).then(()=>{//console.log("DELETED!"+ig)})
})
*/
/*
let dataIni2 = dataIni;
        let dataFim2 = dataFim;
        //dataIni2;
        //dataFim2.setUTCMonth(6);
        dataIni2.setUTCMonth(6);
        dataFim2.setUTCMonth(12);
        console.log("dataIni2? "+dataIni2);
        console.log("dataFim2? "+dataFim2);
        let busca2 = { atend_atenddata: { $gte : new Date(dataIni2), $lte:  new Date(dataFim2) } };
        
        Atend.find(busca2).then((atend2) =>{
            console.log("atendlength: "+atend2.length)
            let i=0;
            /*
            AtendArquivo.insertMany(atend2).then(()=>{
                console.log("FOI!");
            }).finally(()=>{
                console.log("Finally");
            });
            */
            /*
            atend2.forEach((ate)=>{
                i++;
                let arquivo = atendArquivoClass;
                
                Atend.findByIdAndDelete(ate._id).then(()=>{
                    console.log("deleted! "+i);
                }).finally(()=>{
                    console.log("Finally");
                });
            })
            */
           /*
           relAtendteraconsFiltro(req,res){
        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
        let convidAtend;
        let beneAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtend();//objeto para fazer push em relatendimento
        let count;
        let continuar = false;
        let pesquisa = new Pesquisa();
        let idsToRemove = [];
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        let totalFinal = 0;
        let totalSessoes = 0
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAgendaFixo = {agenda_data: { $gte: seg, $lte: sex }, agenda_temp: false, agenda_usuid: req.body.relTeraid}
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;

        Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
        Agenda.find(filtroAgendaFixo).then((agendaFixa)=>{
            console.log("agendaFixa: "+agendaFixa.length)
            let idsTemp =[];
            agendaFixa.forEach((af)=>{
                idsTemp.push(af._id);
            })
            filtroAgendaSemanal = { $or: [ {agenda_tempId: { $in: idsTemp }},{agenda_data: { $gte: seg, $lte: sex },agenda_temp: true,agenda_usuid: req.body.relTeraid} ] };
            Agenda.find(filtroAgendaSemanal).then((agendaSemanal)=>{
                console.log("agendaSemanal: "+agendaSemanal.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                                terapeuta.some((t)=>{
                                    if((""+t._id) === (""+req.body.relTeraid)){
                                        terapeuta_nome = t.usuario_nome;
                                        return true;
                                    }
                                    return false;
                                })
                                agendaFinal = agendaSemanal;
                                agendaFixa.forEach((af)=>{
                                    continuar = "true";
                                    agendaSemanal.forEach((as)=>{
                                        if ((""+af._id) == (""+as.agenda_tempId)){
                                            continuar = "false";
                                        }
                                    })

                                    if (continuar == "true"){
                                        agendaFinal.push(af);
                                    }
                                })
                                
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("at.length:"+at.length)
                                    agendaFinal.sort(function(a, b) {
                                        let d1 = new Date(a.agenda_data);
                                        let d2 = new Date(b.agenda_data);
                                        d1.setHours(0);
                                        d1.setMinutes(0);
                                        d1.setSeconds(0);
                                        d2.setHours(0);
                                        d2.setMinutes(0);
                                        d2.setSeconds(0);
                                        if(d1 == d2){
                                            return true;
                                        } else {
                                            if(d1 < d2){
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });

                                    terapia.forEach((t)=>{
                                        let rab = new RelAtend();
                                        count = 0;
                                    
                                        agendaFinal.forEach((agenda)=>{
                                            continuar = "true";
                                            if (agenda.agenda_data.getTimezoneOffset() == 180){
                                                agenda.agenda_data.setHours(agenda.agenda_data.getHours()+3);
                                            }
                                            rab.dt = agenda.agenda_data;

                                            let hours = (""+agenda.agenda_data.getHours());
                                            let mins = (""+agenda.agenda_data.getMinutes());
                                            if (hours.length == 1){
                                                hours = "0"+hours;
                                            }
                                            if (mins.length == 1){
                                                mins = "0"+mins;
                                            }

                                            rab.hora = (hours+":"+mins);
                                            categorias = agenda.agenda_categoria;
                                            //console.log("categorias: "+categorias)
                                            switch (categorias){
                                                case "Apoio":// aparece nos 2
                                                    if (agenda.agenda_usuid == req.body.relTeraid){
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                    } else {
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                    }
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "Extra":
                                                    if (agenda.agenda_usuid == req.body.relTeraid){
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                    } else {
                                                        continuar = "false";
                                                    }
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "Falta":
                                                    if (agenda.agenda_usuid == req.body.relTeraid){
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                    } else {
                                                        continuar = "false";
                                                    }
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "Falta Justificada":
                                                    continuar = "false";
                                                    //terapiaAtend = agenda.agenda_terapiaid;
                                                    //terapeutaAtend = agenda.agenda_usuid;
                                                    break;
                                                case "Falta Absoluta":
                                                    continuar = "false";
                                                    //terapiaAtend = agenda.agenda_terapiaid;
                                                    //terapeutaAtend = agenda.agenda_usuid;
                                                    break;
                                                case "Feriado":
                                                    continuar = "false";
                                                    //terapiaAtend = agenda.agenda_terapiaid;
                                                    //terapeutaAtend = agenda.agenda_usuid;
                                                    break;
                                                case "Glosa":
                                                    continuar = "false";
                                                    break;
                                                case "Padrão":
                                                    terapiaAtend = agenda.agenda_terapiaid;
                                                    terapeutaAtend = agenda.agenda_usuid;
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "Substituição":// so sub
                                                    if (agenda.agenda_usuid == req.body.relTeraid){
                                                        terapiaAtend = agenda.agenda_terapiaid;
                                                        terapeutaAtend = agenda.agenda_usuid;
                                                    } else {
                                                        continuar = "false";
                                                    }
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "SubstitutoFixo":
                                                    terapiaAtend = agenda.agenda_terapiaid;
                                                    terapeutaAtend = agenda.agenda_usuid;
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                case "Supervisão":
                                                    terapiaAtend = agenda.agenda_terapiaid;
                                                    terapeutaAtend = agenda.agenda_usuid;
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                                default:
                                                    terapiaAtend = agenda.agenda_terapiaid;
                                                    terapeutaAtend = agenda.agenda_usuid;
                                                    beneAtend = agenda.agenda_beneid;
                                                    break;
                                            }

                                            if (continuar == "true"){
                                                let teraTemp;
                                                terapia.some((temp)=>{
                                                    if ((""+temp._id) == (""+terapiaAtend)){
                                                        teraTemp = temp;
                                                        teranome = temp.terapia_nomecid;
                                                    }
                                                })
                                                if ((""+t.terapia_nomecid) == (""+teraTemp.terapia_nomecid)){
                                                    count++;
                                                    //if (count == 1){
                                                        //conv_bene + terapia = valor cre e deb
                                                        let benetemp;
                                                        let valdeb;

                                                        bene.some((b)=>{
                                                            if((""+b._id) === (""+beneAtend)){
                                                                bene_nome = b.bene_nome;
                                                                benetemp = b.bene_convid;
        
                                                                return true;
                                                            }
                                                            return false;
                                                        })
    
                                                        convdeb.forEach((cdeb)=>{
                                                            if ((""+cdeb.convdeb_convid) == (""+benetemp) && (""+cdeb.convdeb_terapiaid)  == (""+terapiaAtend)){
                                                                valdeb = cdeb.convdeb_valor;
                                                            }
                                                        })

                                                        rab.nomecid = teranome;
                                                        rab.valor = valdeb;
                                                    //}
                                                    let existe = rel.find(r => (""+r.nomecid+"") === (""+teranome+"") && r.valor === valdeb);
                                                    
                                                    if (existe) {
                                                        existe.sessoes += 1;
                                                    } else {
                                                        rel.push({
                                                            nomecid: teranome,
                                                            valor: valdeb,
                                                            sessoes: 1,
                                                        });
                                                    }
                                                    
                                                    //rab.sessoes = count;
                                                    idsToRemove.push(agenda._id);
                                                }
                                            }
                                        })
                                        
                                        idsToRemove.forEach((itr)=>{
                                            agendaFinal = agendaFinal.filter(af => (""+af._id) !== (""+itr));
                                        })
                                    })
                                    rel.forEach((r)=>{
                                        if (!r.valor || r.valor === "undefined" || r.valor === "N,aN") {
                                            const ccre = convcre.find(c =>
                                                "" + c.convcre_convid === "" + r.convid &&
                                                "" + c.convcre_terapiaid === "" + r.nomecid
                                            );
                                            console.log("convid: "+r.convid)
                                            console.log("nomecid: "+r.nomecid)
                                            r.valor = ccre ? ccre.convcre_valor : "0,00";
                                        }
                                        terapia.some((t)=>{
                                            if (t.terapia_nomecid == r.nomecid){
                                                r.nomecid = t._id;
                                            }
                                        })
                                        r.total = fncGeral.mascaraValores(parseInt(r.valor.toString().replace(",","").replace(".","")) * r.sessoes);
                                        totalFinal += parseInt(r.valor.toString().replace(",","").replace(".","")) * r.sessoes;
                                        totalSessoes += r.sessoes;
                                    })
                                    totalFinal = fncGeral.mascaraValores(totalFinal);
                                    res.render("atendimento/atendreltera/relatendteracons", {anos: ano, terapeutas: terapeuta, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, totalFinal, pesquisa, totalSessoes})
                                })
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    }
}
           */
          /*
          Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        const ini = (new Date("2000-01-01T00:00:00.000Z")).toISOString();
        const fim = (new Date("2000-01-02T23:59:59.999Z")).toISOString();
       
        let updates = [
        { teraId: "68b88a29a741852d6f4653fb", beneId: "68a3795873ff2bb80b0a4605", piaId: "6915879621d8779aa12a7251", valorCre: "140,00", valorDeb: "52,42" },
        ...
        ];

        updates.forEach(u => {
            //let u = updates[0];

            Atend.updateMany({
                atend_atenddata: {$gte: ini,$lte: fim},
                atend_terapeutaid: new ObjectId(u.teraId),
                atend_beneid: new ObjectId(u.beneId)
            },
            {
                $set: {
                    atend_terapiaid: new ObjectId(u.piaId),
                    atend_valorcre: u.valorCre,
                    atend_valordeb: u.valorDeb
                }
            }).then((res) =>{
                //console.log("Salvo")
                resultado = true;
            }).catch((err) =>{
                console.log("erro mongo:")
                console.log(err)
                resultado = err;
                //res.redirect('admin/branco')
            }).finally(()=>{
                console.log("FINISH");
            });
            Agenda.updateMany({
                agenda_data: {$gte: ini,$lte: fim},
                agenda_usuid: new ObjectId(u.teraId),
                agenda_beneid: new ObjectId(u.beneId),
            }, {$set: {
                agenda_terapiaid: new ObjectId(u.piaId)
            }}).then((res) =>{
                //console.log("Salvo")
                resultado = true;
            }).catch((err) =>{
                console.log("erro mongo:")
                console.log(err)
                resultado = err;
                //res.redirect('admin/branco')
            }).finally(()=>{
                console.log("FINISH");
            });
        });
          */
         /*

         // PRE ERRO antes das duplicatas

         Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);

        let inicioDia = new Date(2025, 7, 1, 0, 0, 0, 0);   // 29/09/2025
        let fimDia    = new Date(2025, 9, 31, 23, 59, 59, 999); // 03/10/2025

        console.log("inicioDia: " + inicioDia);
        console.log("fimDia: " + fimDia);

        Atend.find({
            atend_atenddata: { $gte: inicioDia, $lte: fimDia },
            atend_agenda_f_id_orig: { $ne: null }
        })
        .then((atendimentos) => {
            console.log("atendimentos? " + atendimentos.length);

            // Agrupar por atend_agenda_f_id_orig
            let mapa = {};
            atendimentos.forEach(at => {
                var chave = at.atend_agenda_f_id_orig ? at.atend_agenda_f_id_orig.toString() : null;
                if (!chave) return; // evita null
                if (!mapa[chave]) mapa[chave] = [];
                mapa[chave].push(at);
            });

            // Processar cada grupo
            for (var chave in mapa) {
                let grupo = mapa[chave];

                if (grupo.length > 1) {

                    // Separar corretos x defeituosos
                    var corretos     = grupo.filter(a => a.atend_agenda_s_id_orig); // tem s_id_orig → válido
                    var defeituosos  = grupo.filter(a => !a.atend_agenda_s_id_orig); // NÃO tem → defeituoso

                    console.log(`\n📌 Grupo ${chave}: ${grupo.length} registros`);
                    console.log(`✔ Correto(s):    ${corretos.map(a => a._id).join(", ")}`);
                    console.log(`❌ Defeituoso(s): ${defeituosos.map(a => a._id).join(", ")}`);

                    // Garantir que sempre fique apenas 1 registro VÁLIDO
                    if (corretos.length > 1) {
                        // Ordenar para deixar apenas o mais antigo
                        corretos.sort((a, b) => new Date(a.atend_datacad) - new Date(b.atend_datacad));
                        var manter = corretos[0];
                        var removerCorretos = corretos.slice(1); // descartar os excedentes

                        console.log(`Mantendo apenas o mais antigo: ${manter._id}`);
                        for (var item of removerCorretos) {
                            Atend.deleteOne({ _id: item._id });
                            console.log("🗑️ Duplicata válida removida:", item._id);
                        }
                    }

                    // Remover todos os defeituosos SEMPRE
                    for (var item of defeituosos) {
                        Atend.deleteOne({ _id: item._id }).then((del) => {
                            console.log("🗑️ Defeituoso removido:", item._id);
                        }).catch(err => {
                            console.log("❌ Erro: " + err);
                        });;
                    }
                }
            }

            console.log("\n✔ Finalizado com sucesso!");
        })
        .catch(err => {
            console.log("❌ Erro: " + err);
        });
         */
        /*
    
            // POS ERRO para as duplicatas

         Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);

        let inicioDia = new Date(2025, 7, 1, 0, 0, 0, 0);   // 29/09/2025
        let fimDia    = new Date(2025, 9, 31, 23, 59, 59, 999); // 03/10/2025

        console.log("inicioDia: " + inicioDia);
        console.log("fimDia: " + fimDia);

        Atend.find({
            atend_atenddata: { $gte: inicioDia, $lte: fimDia },
            atend_agenda_f_id_orig: { $ne: null }
        })
        .then((atendimentos) => {
            console.log("atendimentos? " + atendimentos.length);

            // Agrupar por atend_agenda_f_id_orig
            let mapa = {};
            atendimentos.forEach(at => {
                var chave = at.atend_agenda_f_id_orig ? at.atend_agenda_f_id_orig.toString() : null;
                if (!chave) return; // evita null
                if (!mapa[chave]) mapa[chave] = [];
                mapa[chave].push(at);
            });

            // Processar cada grupo
            for (var chave in mapa) {
                let grupo = mapa[chave];

                if (grupo.length > 1) {

                    // Separar corretos x defeituosos
                    var corretos     = grupo.filter(a => a.atend_agenda_s_id_orig); // tem s_id_orig → válido

                    console.log(`\n📌 Grupo ${chave}: ${grupo.length} registros`);
                    console.log(`✔ Correto(s):    ${corretos.map(a => a._id).join(", ")}`);

                    // Garantir que sempre fique apenas 1 registro VÁLIDO
                    if (corretos.length > 1) {
                        // Ordenar para deixar apenas o mais antigo
                        corretos.sort((a, b) => a.atend_num - b.atend_num);
                        var manter = corretos[0];
                        var removerCorretos = corretos.slice(1); // descartar os excedentes

                        console.log(`Mantendo apenas o mais antigo: ${manter._id}`);
                        for (var item of removerCorretos) {
                            Atend.deleteOne({ _id: item._id }).then((del) => {
                                console.log("🗑️ Defeituoso removido:", item._id);
                            }).catch(err => {
                                console.log("❌ Erro: " + err);
                            });;
                            console.log("🗑️ Duplicata válida removida:", item._id);
                        }
                    }
                }
            }

            console.log("\n✔ Finalizado com sucesso!");
        })
        .catch(err => {
            console.log("❌ Erro: " + err);
        });
        */
       /*
       //DESTRUIÇÃO
        let inicioDia = new Date(2024, 0, 1, 0, 0, 0, 0); // 29/09/2025
        let fimDia    = new Date(2025, 11, 31, 23, 59, 59, 999); // 03/10/2025

        console.log("inicioDia: " + inicioDia);
        console.log("fimDia: " + fimDia);

        Atend.aggregate([{
    $match: {
      atend_atenddata: { $gte: inicioDia, $lte: fimDia }
    }
  },{
            $group: {
            _id: {
                atend_categoria: "$atend_categoria",
                atend_org: "$atend_org",
                atend_beneid: "$atend_beneid",
                atend_convid: "$atend_convid",
                atend_agenda_s_id_orig: "$atend_agenda_s_id_orig",
                atend_atenddata: "$atend_atenddata",
                atend_atendhora: "$atend_atendhora",
                atend_terapeutaid: "$atend_terapeutaid",
                atend_terapiaid: "$atend_terapiaid",
                atend_salaid: "$atend_salaid"
            },
            count: { $sum: 1 },
            docs: { $push: "$_id" }
            }
        },
        { $match: { count: { $gt: 1 } } }
        ])
.then(async (dups) => {
  console.log("TOTAL DE GRUPOS DUPLICADOS:", dups.length);

  // PROCESSAR CADA GRUPO DE DUPLICADOS
  for (const grupo of dups) {
    // ordenar os documentos por data (mais antigo primeiro)
    const ordenados = grupo.docs.sort((a, b) => new Date(a.atend_datacad) - new Date(b.atend_datacad));

    const manter = ordenados[0]._id; // Mantém o mais antigo
    const deletar = ordenados.slice(1).map(d => d._id); // apaga os demais

    if (deletar.length > 0) {
      await Atend.deleteMany({ _id: { $in: deletar } });
      console.log(`Grupo removido -> manteve ${manter}, deletou:`, deletar);
    }
  }

  console.log("FINALIZADO ✔");
}).catch(err => {
  console.error("ERRO:", err);
});

       */