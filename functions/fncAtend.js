//Exports
const mongoose = require("mongoose")

//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
const Atend = mongoose.model("tb_atend")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convecreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const convimpClass = require("../models/convImp")//Modelo dos Impostos por convênio
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const creditClass = require("../models/credit")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")

//Tabelas Extrangeiras
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
const fncCredit = require("../functions/fncCredit")
const fncGeral = require("../functions/fncGeral")
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")
const agenda = require("../models/agenda")
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
        valor,
        total
        ){
        this.nomecid = nomecid,
        this.sessoes = sessoes,
        this.valor = valor,
        this.total = total
    }
}

class RelAtendBene{
    constructor(
        dt,
        especialidade,
        profissional,
        beneficiario,
        hora
        ){
        this.dt = dt,
        this.especialidade = especialidade,
        this.profissional = profissional,
        this.beneficiario = beneficiario,
        this.hora = hora
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
    mascaraValores(val){
        //Esta mascara só vai até Milhões
        let t = val.toString();
        if(val == "0" || val == "0,00"){
            t = "0,00";
        } else {
            if (t.length >= 9){
                t = t.substring(0,t.length-8)+"."+t.substring(t.length-8,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else if (t.length >= 6){
                t = t.substring(0,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else {
                t = t.substring(0,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            }
        }

        return t;
    },
    carregaAtend(req,res){
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
                                        res.render("atendimento/atendCad", {atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala
                                        })
        })})})})})})})}).catch((err) =>{
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
    deletaAtend(req, res){
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
                                         res.render('atendimento/atendEdi', { atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, salas: sala})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    listaAtend(req, res){
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
        
        Atend.find({atend_atenddata: { $gte : agora, $lte:  depois }}).then((atend) =>{
            atend.forEach((b)=>{
                if(b.atend_atenddata){
                } else {
                    b.atend_atenddata=new Date();
                }
                    
                let data = new Date(b.atend_atenddata)
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
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends, carregaFiltro})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAtend(req, res){
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
            default:
                busca = { atend_atenddata: { $gte : new Date(dataIni), $lte:  new Date(dataFim) } }
                break;
        }

        Atend.find(busca).then((atend) =>{
            atend.forEach((b)=>{
                let data;
                if(b.atend_atenddata){
                    data = new Date(b.atend_atenddata)
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
                                
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends, carregaFiltro, tipoData, tipoPessoa, dataIni, dataFim, dataFinal, mesAtend, anoAtend, atendTerapeuta, atendBeneficiario})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAtendIndBene(req, res){
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
                                    res.render("atendimento/relatendInd", {atendimentos: atendimento, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, convcres: convcre, convdebs: convdeb, data})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    relAtendimentoVal(req,res){
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
                        res.render("atendimento/relatendval", {terapias: terapia, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValFiltro(req,res){
        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let existe = 0;//verifica se existe a terapia no rel
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let aux;//auxiliar
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let teraID;
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let conv_nome;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        console.log("relAtendimentoBeneConsFiltro");

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;

        Atend.find({atend_convid: req.body.relConvid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            Conv.find().then((conv)=>{
                Conv.find({_id: req.body.relConvid}).then((c)=>{
                    conv_nome = c.conv_nome;
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

                                //console.log("qtdIds: "+qtdIds+" - t._id: "+t._id+" - creVal: "+creVal)
                            }
                            
                            if(qtdIds != 0){
                                console.log("ALO")
                                rel.push(a);
                                a = new RelAtend();
                            }
                        })
                        rel.forEach((r)=>{
                            val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                            val = this.mascaraValores(val);
                            r.total = val;

                            valTot = this.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                            sessaoTot += r.sessoes;
                            //console.log("r.sessoes: " + r.sessoes)
                            //console.log("r.nomecid: " + r.nomecid)
                            //console.log("r.valor: " + r.valor)
                        })
                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                        res.render("atendimento/relatendval", {terapias: terapia, convs: conv, rels: rel, total, periodoDe, periodoAte, conv_nome})
                    })
                })
            })
        })
    },
    relAtendimentoBene(req,res){
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
                        res.render("atendimento/relatendvalBene", {terapeutas: terapeuta, terapias: terapia, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneFiltro(req,res){
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
        console.log("req.body.dataIni: "+req.body.dataIni)
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        console.log("periodoDe:? "+periodoDe)
        console.log("periodoAte:? "+periodoAte)
        let date = new Date();
        let porHoras = req.body.porHoras;
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
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
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
                                if (req.body.porHoras == "sim"){
                                    let horaFim = parseInt(atend.atend_atendhora.substring(0,2));
                                    let minutoFim = atend.atend_atendhora.substring(3,5);
                                    console.log("minutoFim: "+minutoFim)
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
                                } else {
                                    console.log("atend.atend_atenddata: "+atend.atend_atenddata)
                                    rab.dt = (fncGeral.getData(atend.atend_atenddata));
                                    console.log("rab.dt: "+rab.dt)
                                }
                                categorias = atend.atend_categoria
                                //console.log("categorias:"+categorias)
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
                                        terapeutaAtend = atend.atend_mergeterapeutaid;;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
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
                                    case "SubstitutoFixo":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        terapeutaAtend = atend.atend_mergeterapeutaid;
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
                            res.render("atendimento/relatendvalBene", {benes: bene, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome, porHoras})
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneCons(req,res){
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
                    res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneConsFiltro(req,res){
        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let existe = 0;//verifica se existe a terapia no rel
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let aux;//auxiliar
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let teraID;
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

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
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
                                        terapiaAtend = ats.atend_terapiaid;
                                        break;
                                    case "Falta Justificada":
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
                            val = this.mascaraValores(val);
                            r.total = val;

                            valTot = this.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                            sessaoTot += r.sessoes;
                            //console.log("r.sessoes: " + r.sessoes)
                            //console.log("r.nomecid: " + r.nomecid)
                            //console.log("r.valor: " + r.valor)
                        })
                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                        res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                    })
                })
            })
        })
    },

    relAtendimentoBeneConsFiltro2(req,res){
        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let existe = 0;//verifica se existe a terapia no rel
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let aux;//auxiliar
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let teraID;
        let qtdIds;
        let creVal;
        let categorias;
        let terapiaAtend;
        let creValFinal;
        let atends;
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        console.log("relAtendimentoBeneConsFiltro");

        //console.log("SEG:"+seg);
        //console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;
        let convid;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);
            Convcre.find().then((cre)=>{
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
                                            terapiaAtend = ats.atend_terapiaid;
                                            break;
                                        case "Falta Justificada":
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
                                    if (creVal != "0,00"){console.log("FUCK YOU3:"+creVal)}
                                    if (creVal == "0,00"){
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
                                    if (creVal == "0,00"){console.log("FUCK YOU2")}
                                    a.valor = creVal;
                                }
                                
                                if(qtdIds != 0){
                                    rel.push(a);
                                    a = new RelAtend();
                                }
                            })
                            rel.forEach((r)=>{
                                //console.log("valorconv:"+r.valor)
                                if (!r.valor){console.log("FUCK YOU")}
                                val = (parseInt(r.valor.toString().replace(",","").replace(".",""))*parseInt(r.sessoes)).toString();
                                console.log("val:"+val)
                                val = this.mascaraValores(val);
                                r.total = val;

                                valTot = this.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                                sessaoTot += r.sessoes;
                                //console.log("r.sessoes: " + r.sessoes)
                                //console.log("r.nomecid: " + r.nomecid)
                                //console.log("r.valor: " + r.valor)
                            })
                            total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                            res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                        })
                    })
                })
            })
        })
    },
    relAtendimentoValNf(req,res){//relatório emissão de NF
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
                        res.render("atendimento/relatendvalnf", {terapias: terapia, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValNfFiltro(req,res){
        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let existe = 0;//verifica se existe a terapia no rel
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let aux;//auxiliar
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let teraID;
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
        let bene_retem;
        let bene_doc;
        let bene_tomador;
        let conv_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);

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
                            val = this.mascaraValores(val);
                            r.total = val;

                            valTot = this.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
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
                        res.render("atendimento/relatendvalnf", {terapias: terapia, convimps: convimp, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, bene_retem, bene_doc, bene_tomador, conv_nome/*, retornoStrings: retornoString*/})
                    })
                })
            })
        })
         })//conv
        })//convimp
    },
    backup_relAtendimentoValNfFiltro(req,res){
        let a = new RelAtend();//objeto para fazer push em relatendimento
        let val;//objeto para formatar valor do cre
        let existe = 0;//verifica se existe a terapia no rel
        let valTot = 0;//calcular valor total
        let sessaoTot = 0;//calcular total de sessoes
        let aux;//auxiliar
        let rel = [];//relatorio
        let total;//objeto valor total cre
        let teraID;
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
        let bene_retem;
        let bene_doc;
        let bene_tomador;
        let conv_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("at:length: "+at.length);

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
                            val = this.mascaraValores(val);
                            r.total = val;

                            valTot = this.mascaraValores((parseInt(valTot.toString().replace(",","").replace(".","")) + parseInt(val.toString().replace(",","").replace(".",""))));
                            sessaoTot += r.sessoes;
                            //console.log("r.sessoes: " + r.sessoes)
                            //console.log("r.nomecid: " + r.nomecid)
                            //console.log("r.valor: " + r.valor)
                        })
                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};
                        Conv.findOne({_id: bene_convid}).then((conv)=>{
                            conv_nome = conv.conv_nome;
                        
                        //res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                        res.render("atendimento/relatendvalnf", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, bene_retem, bene_doc, bene_tomador, conv_nome/*, retornoStrings: retornoString*/})
                    })
                })
            })
        })
         })//conv
    },
    copiarAtends(req,res){
        let arrayAtends =[];
        let dadosCopia = new AtendCopia();
        let arrIds = req.body.idsCopia;
        let arrayIds = arrIds.split(",");
        let datas = req.body.dtCopia;
        let arrayData = datas.split(",");
        let quantidades = req.body.qtdCopia;
        console.log("quantidades:"+quantidades);
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

        console.log("Começando Copia!");
        arrayQuantidade.forEach((aq)=>{
            console.log("quantidade!"+aq);
        })
        console.log("arrayQuantidade[0]:"+arrayQuantidade[0]);
        console.log("arrayQuantidade[1]:"+arrayQuantidade[1]);
        console.log("arrayQuantidade[2]:"+arrayQuantidade[2]);
        if (arrayIds.length == arrayData.length && arrayData.length == arrayQuantidade.length){
            //let i = 0;
            Atend.find().sort({atend_num : -1}).limit(1).then((ultimoAtend) =>{
                ultimoAtend.forEach((ua)=>{
                    nextNum = ua.atend_num;
                })
                //arrayIds.forEach((a)=>{
                    console.log("arrayIds.length:"+arrayIds.length);
                    let tamanho = parseInt(arrayIds.length);
                    console.log("tamanho:"+tamanho);
                for (var i = 0; i < tamanho;i++){
                    console.log("i:"+i);
                    qtd = parseInt(arrayQuantidade[i]);
                    dataAtendData = arrayData[i];
                    nextNumAtendCopiar = parseInt(arrayIds[i]);
                    console.log("qtd:"+qtd);
                    console.log("dataAtendData:"+dataAtendData);
                    console.log("nextNumAtendCopiar:"+nextNumAtendCopiar);

                    if (qtd != undefined && dataAtendData != undefined && nextNumAtendCopiar != undefined){
                        let j = 0;
//testar com o nextNumAtendCopiar string e int
                        console.log("arrayIds[i]:"+arrayIds[i]);
                        let idAtend = new ObjectId(arrayIds[i]);
                        console.log("idAtend:"+idAtend);
                        Atend.findOne({_id: idAtend}).then((a)=>{
                            console.log("AAAAAAAAAA:"+a);
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
                                console.log("dataAtendData"+i+":"+dataAtendData);
                                atendimentoNovo.atend_atenddata = dataAtendData;
                                console.log("atendCopia:"+atendCopia);
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
                                atendimentoNovo.atend_num = atendCopia.atend_num;
                                if (atendCopia.atend_datacad != undefined){atendimentoNovo.atend_datacad = dataAtual.toISOString();}
                                atendimentoNovo.atend_num = nextNum;
                                console.log("atendimentoNovo:"+atendimentoNovo);

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
        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
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
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        filtroAgendaFixo = {agenda_data: { $gte: seg, $lte: sex }, agenda_temp: false}
        pesquisa.dataIni = req.body.dataIni;
        pesquisa.dataFim = req.body.dataFim;
        pesquisa.terapeuta = req.body.relTeraid;

        Agenda.find(filtroAgendaFixo).then((agendaFixa)=>{
            console.log("agendaFixa: "+agendaFixa.length)
            let idsTemp =[];
            agendaFixa.forEach((af)=>{
                idsTemp.push(af._id);
            })
            filtroAgendaSemanal = { $or: [ {agenda_tempId: { $in: idsTemp }},{agenda_data: { $gte: seg, $lte: sex },agenda_temp: true} ] };
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
                                                    if ((""+temp._id) == (""+terapiaAtend)){
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
                                            rab.total =  this.mascaraValores(parseInt(rab.valor.toString().replace(",","").replace(".","")) * rab.sessoes);

                                            rel.push(rab);
                                        }
                                        idsToRemove.forEach((itr)=>{
                                            agendaFinal = agendaFinal.filter(af => (""+af._id) !== (""+itr));
                                        })
                                    })
                                    res.render("atendimento/atendreltera/relatendterapiacons", {terapeutas: terapeuta, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa})
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
    relAtendteraana(req,res){
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
            Terapia.find().then((terapia)=>{
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    res.render("atendimento/atendreltera/relatendteraana", {Rels: rel, terapeutas: terapeuta, terapias: terapia, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendteraanaFiltro(req,res){
        let u;
        let teraID;
        let usuId;
        let rel = [];
        let agendaFinal = [];
        let dt;
        let conv_cnpj;
        let conv_nome;
        let conv_id;
        let bene_nome;
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
                                            continuar = "false";
                                        }
                                        break;
                                    case "Falta":
                                        if (agenda.agenda_usuid == req.body.relTeraid){
                                            terapiaAtend = agenda.agenda_terapiaid;
                                            terapeutaAtend = agenda.agenda_usuid;
                                        } else {
                                            continuar = "false";
                                        }
                                        break;
                                    case "Falta Justificada":
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
                        res.render("atendimento/atendreltera/relatendteraana", {terapeutas: terapeuta, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa})
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },

    relAtendteraanaFiltro2(req,res){
        let u;
        let teraID;
        let usuId;
        let rel = [];
        let dt;
        let conv_cnpj;
        let conv_nome;
        let terapeuta_nome;
        let terapiaAtend;
        let terapeutaAtend;
        let filtroAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new RelAtendBene();//objeto para fazer push em relatendimento
        let relatorio = new RelAtendTerapeuta();
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
                                    terapeutaAtend = atend.atend_mergeterapeutaid;;
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
                        res.render("atendimento/atendreltera/relatendteraana", {benes: bene, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, terapeuta_nome})
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
                        res.render("atendimento/atendreltera/relatendteracons", {terapias: terapia, terapeutas: terapeuta, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendteraconsFiltro(req,res){
        let rel = [];
        let agendaFinal = [];
        let terapiaAtend;
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
                                                    console.log("DEFAAAAAAAAAAAAAAAAULT");
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
                                                    }
                                                })
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
                                            rab.total =  this.mascaraValores(parseInt(rab.valor.toString().replace(",","").replace(".","")) * rab.sessoes);

                                            rel.push(rab);
                                        }
                                        idsToRemove.forEach((itr)=>{
                                            agendaFinal = agendaFinal.filter(af => (""+af._id) !== (""+itr));
                                        })
                                    })
                                    res.render("atendimento/atendreltera/relatendteracons", {terapeutas: terapeuta, terapias: terapia, benes: bene, rels: rel, periodoDe, periodoAte, terapeuta_nome, pesquisa})
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
atend.forEach(a=>{
    Atend.deleteOne({//_id: a._id}).then(()=>{//console.log("DELETED!");})
})
*/