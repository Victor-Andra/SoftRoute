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
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const creditClass = require("../models/credit")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")

//Tabelas Extrangeiras
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

//Funções auxiliares
const fncCredit = require("../functions/fncCredit")
const fncGeral = require("../functions/fncGeral")
const fncAtendAdm = require("./fncAtendAdm")

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
        profissional
        ){
        this.dt = dt,
        this.especialidade = especialidade,
        this.profissional = profissional
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        //console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
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
            retorno = true;
        }).catch((err) => {console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{//console.log(res)
                retornoCre = true;
            }).catch((err) => {console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{//console.log(res)
                    retornoDeb = true;
                }).catch((err) => {console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{//console.log(res)
                        retornoTab = true;
                    }).catch((err) => {console.log(err)
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
                            Atend.find().then((atend) =>{
                                this.listaAtend(req,res)
                            })
                        }).catch((err) =>{
                            console.log(err)
                            res.render('admin/erro')
                        })
                    })
                })
            })
        })
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
                    Atend.find().then((atend) =>{
                        //console.log("Listagem Realizada!")
                        this.listaAtend(req,res);
                    }).catch((err) =>{
                        //console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Sala.find().then((sala)=>{
                        Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética     
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends})
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
                break;
        }

        Atend.find(busca).then((atend) =>{
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
                if(b.atend_org == "Administrativo"){
                    b.atend_org = "ADM";
                }
            })
            var tamanho = atend.length;
            var qtdAtends = {qtd: tamanho}
            //console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends})
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
            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
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
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena em Ordem Alfabética 
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
        let creArray = [];
        let exclusaoCreVal = [];
        let u;
        let relAtendConv = new RelAtend();
        let seg = new Date(req.body.dataIni);
        let sex = new Date(req.body.dataFim);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let filtroAtend = {atend_convid: req.body.relConvid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let conv_nome;
        let continuando = "true";

        relAtendConv.sessoes = 0;
        relAtendConv.valor = "";
        relAtendConv.nomecid = "";

        Atend.find(filtroAtend).then((at)=>{
            at.forEach((a)=>{
                atendIds.push(a.atend_num);
            })
            Credit.find({credit_atendnum: {$in: atendIds}}).then((cre)=>{
                console.log("cre:"+cre.length);
                Conv.find().then((conv)=>{
                    Conv.findOne({_id: req.body.relConvid}).then((c)=>{
                        conv_nome = c.conv_nome;
                        Terapia.find().then((terapia)=>{
                            terapia.forEach((t)=>{
                                qtdIds = 0;
                                continuando = "true";

                                cre.forEach((ct)=>{
                                    if ((""+t._id) === (""+ct.credit_terapiaid)){
                                        creArray.push(ct);
                                    }
                                })

                                if (creArray.length > 0){
                                    //console.log("TERAPIA: "+t.terapia_nome)
                                    //console.log("creArray.length:"+creArray.length)
                                    while (continuando == "true"){
                                        //console.log("continuando")
                                        creArray.forEach((ca)=>{
                                            //console.log("foreach CA")
                                            //console.log("exclusaoCreVal:"+exclusaoCreVal)
                                            //console.log("exclusaoCreVal.length:"+exclusaoCreVal.length)
                                            if(relAtendConv.sessoes == 0){
                                                if(exclusaoCreVal.length == 0){
                                                    relAtendConv.sessoes = 1;
                                                    relAtendConv.valor = ca.credit_valorprev;
                                                    relAtendConv.nomecid = ca.credit_terapiaid;
                                                    //console.log("primeiro!!!!!")
                                                    //console.log("ca.credit_valorprev:"+ca.credit_valorprev)
                                                    //console.log("ca.credit_terapiaid:"+ca.credit_terapiaid)
                                                    qtdIds++;
                                                } else {
                                                    if(!fncGeral.verificarExistencia(exclusaoCreVal, ca.credit_valorprev)){
                                                        relAtendConv.sessoes = 1;
                                                        relAtendConv.valor = ca.credit_valorprev;
                                                        relAtendConv.nomecid = ca.credit_terapiaid;
                                                        //console.log("novo!!!")
                                                        //console.log("ca.credit_valorprev:"+ca.credit_valorprev)
                                                        //console.log("ca.credit_terapiaid:"+ca.credit_terapiaid)
                                                        qtdIds++;
                                                    }
                                                }
                                            } else {
                                                if(relAtendConv.valor == ca.credit_valorprev){
                                                    relAtendConv.sessoes = relAtendConv.sessoes + 1;
                                                    //console.log("ja tinha")
                                                    qtdIds++;
                                                }
                                            }
                                        })
                                        exclusaoCreVal.push(relAtendConv.valor);
                                        relAtendConv.total = (parseInt(relAtendConv.valor.replace(",",""))*relAtendConv.sessoes);
                                        sessaoTot += relAtendConv.sessoes;
                                        valTot += (parseInt(relAtendConv.valor.replace(",",""))*relAtendConv.sessoes);
                                        relAtendConv.total = this.mascaraValores(relAtendConv.total);
                                        rel.push(relAtendConv);
                                        //console.log("relAtendConv:"+relAtendConv.nomecid+"-"+relAtendConv.sessoes+"-"+relAtendConv.valor);
                                        //console.log("qtdIds: "+qtdIds)
                                        //console.log("creArray.length: "+creArray.length)
                                        if (qtdIds == creArray.length){
                                            continuando = "false";
                                            //console.log("qtdIds == cre.length");
                                        }
                                    }
                                    relAtendConv = new RelAtend();
                                    relAtendConv.sessoes = 0;
                                    exclusaoCreVal = [];
                                    creArray = [];
                                }
                            })

                            valTot = this.mascaraValores(valTot)
                            total = {"sessoes": sessaoTot, "valor": "-", "total": valTot};

                            res.render("atendimento/relatendval", {cres: cre, terapias: terapia, convs: conv, rels: rel, total, periodoDe, periodoAte, conv_nome})
                        })
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                Terapia.find().then((terapia)=>{
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        res.render("atendimento/relatendvalBene", {Rels: rel, terapeutas: terapeuta, terapias: terapia, benes: bene})
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
        let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}

        Atend.find(filtroAtend).then((at)=>{
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética     
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
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
                                categorias = atend.atend_cartegoria
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
                                        terapeutaAtend = atend.atend_merdeterapeutaid;;
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
                            res.render("atendimento/relatendvalBene", {benes: bene, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome})
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValFiltro2(req,res){
        let seg = new Date(req.body.dataIni);
        let sex = new Date(req.body.dataFim);
        let a = new RelAtend();
        let existe = false;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let rel = [];
        let filtroAtend = {atend_convid: req.body.relConvid}
        Conv.findOne().then((conv)=>{
            Convcre.find({convcre_convid: conv._id}).then((convcre)=>{
                Terapia.find().then((terapia)=>{
                    Atend.find(filtroAtend).then((atend) =>{
                        atend.forEach((e)=>{
                            existe = false;
                            if(rel.length == 0){
                                a.nomecid = e.atend_terapiaid;
                                a.sessoes = 1;
                                let val;
                                convcre.forEach((c)=>{
                                    if(c.convcre_terapiaid.toString() === e.atend_terapiaid.toString()){
                                        val = c.convcre_valor;
                                    } else {
                                    }
                                });
                                a.valor = val;

                                rel.push(a);
                                rel.forEach((r)=>{
                                    let v = "{nomecid:"+r.nomecid+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                                })
                            } else {
                                rel.forEach((r)=>{
                                    if(r.nomecid.toString() === e.atend_terapiaid.toString()){
                                        r.sessoes = r.sessoes+1;
                                        existe = true;
                                    }
                                })
                                if(!existe){
                                    a.nomecid = e.atend_terapiaid;
                                    a.sessoes = 1;
                                    let val;
                                convcre.forEach((c)=>{
                                    if(c.convcre_terapiaid.toString() === e.atend_terapiaid.toString()){
                                        val = c.convcre_valor;
                                    } else {
                                    }
                                });
                                a.valor = val;
                                    rel.push(a);
                                }
                            }
                        })
                        rel.forEach((r)=>{
                            let t = (parseInt(r.valor.toString().replace(",",""))*parseInt(r.sessoes)).toString();
                            
                            t = this.mascaraValores(t);
                            
                            if(t % 1 === 0) {
                            } else {
                            }
                            r.total = t;
                        })
                        rel.forEach((r)=>{
                            let v = "{nomecid:"+r.nomecid+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                        })

                        res.render("atendimento/relatendval", {convcres: convcre, terapias: terapia, convs: conv, rels: rel})
        })})})}).catch((err) =>{
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
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                        res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoBeneConsFiltro(req,res){
        //NÃO ESTA GERANDO O CRE CORRETAMENTE AO CONVERTER AGENDA EM ATEND
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

        console.log("SEG:"+seg);
        console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("{atend_beneid:"+ req.body.relBeneid+", atend_atenddata: { $gte: "+seg+", $lte:"+ sex+"}}")
            console.log("tamanho:"+at.length);
            //Credit.find({credit_atendnum: {$in: atendIds}}).then((cre)=>{
                //console.log("cre.length: "+cre.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                    Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                        bene_nome = b.bene_nome;
                        Terapia.find().then((terapia)=>{
                            terapia.forEach((t)=>{
                                //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                qtdIds = 0;
                                creValFinal = 0;
                                atends = [];

                                at.forEach((ats)=>{
                                    if((""+ats.atend_terapiaid) === (""+t._id)){
                                        atends.push(ats);
                                    }
                                })
                                
                                atends.forEach((atend)=>{
                                    categorias = atend.atend_cartegoria
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
                                        console.log("TERAPIA OK")
                                    }
                                })

                                if(qtdIds != 0){
                                    a.sessoes = qtdIds;
                                    a.nomecid = t._id;
                                    a.valor = creVal;

                                    console.log("qtdIds: "+qtdIds+" - t._id: "+t._id+" - creVal: "+creVal)
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
                                console.log("r.sessoes: " + r.sessoes)
                                console.log("r.nomecid: " + r.nomecid)
                                console.log("r.valor: " + r.valor)
                            })
                            total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                            res.render("atendimento/relatendvalcons", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome})
                        })
                    })
                })
            //})
        })
    },
    relAtendimentoValNf(req,res){    //relatório emissão de NF
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
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                        res.render("atendimento/relatendvalnf", {terapias: terapia, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValNfFiltro(req,res){
        //NÃO ESTA GERANDO O CRE CORRETAMENTE AO CONVERTER AGENDA EM ATEND
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
        let retornoString = [];
        let linha = "";
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");

        console.log("SEG:"+seg);
        console.log("SEX:"+sex);

        //let filtroAtend = {atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}//procurar por atend com conv
        let atendIds = [];
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let bene_nome;

        Atend.find({atend_beneid: req.body.relBeneid, atend_atenddata: { $gte: seg, $lte: sex}}).then((at)=>{
            console.log("tamanho:"+at.length);
            //Credit.find({credit_atendnum: {$in: atendIds}}).then((cre)=>{
                //console.log("cre.length: "+cre.length)
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                    Bene.findOne({_id: req.body.relBeneid}).then((b)=>{
                        bene_nome = b.bene_nome;
                        Terapia.find().then((terapia)=>{
                            terapia.forEach((t)=>{
                                //console.log("ID-nome: "+t._id + "-" + t.terapia_nome);
                                qtdIds = 0;
                                creValFinal = 0;
                                atends = [];

                                at.forEach((ats)=>{
                                    if((""+ats.atend_terapiaid) === (""+t._id)){
                                        atends.push(ats);
                                    }
                                })
                                
                                atends.forEach((atend)=>{
                                    categorias = atend.atend_cartegoria
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
                                console.log("r.sessoes: " + r.sessoes)
                                console.log("r.nomecid: " + r.nomecid)
                                console.log("r.valor: " + r.valor)
                            })
                            total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                            res.render("atendimento/relatendvalnf", {terapias: terapia, benes: bene, rels: rel, total, periodoDe, periodoAte, bene_nome, retornoStrings: retornoString})
                        })
                    })
                })
            //})
        })
    }
}
    /*
    Atend.find({atend_num: {$gte: 2}}).then((a)=>{
        a.forEach(a=>{
        Atend.deleteOne({_id: a._id}).then(()=>{//console.log("DELETED!");})})
    })
    */
   /*
   relAtendimentoValFiltro(req,res){
        //console.log("INI:"+req.body.dataIni)
        //console.log("FIM:"+req.body.dataFim)
        let seg = new Date(req.body.dataIni);
        let sex = new Date(req.body.dataFim);
        let a = new RelAtend();
        let t = new RelAtend();
        let val;
        let existe = false;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        let rel = [];
        let total = [];
        let filtroCredit = {credit_convid: req.body.convid, credit_dataevento: { $gte: seg, $lte: sex}}
        Credit.find(filtroCredit).then((cre) =>{
            //console.log("cre:")
            //console.log(cre)
            Conv.find().then((conv)=>{
                //console.log("conv:")
                //console.log(conv)
                Terapia.find().then((terapia)=>{
                        //console.log(cre)
                        cre.forEach((e)=>{
                            //console.log("passando aqui")
                            existe = false;
                            if(rel.length == 0){
                                //console.log("tamanho == 0")
                                a.especialidade = e.credit_terapiaid;
                                a.sessoes = 1;
                                a.valor = e.credit_valorprev;
                                //console.log("a:"+a)
                                rel.push(a);
                                //rel.forEach((r)=>{
                                //    let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                                //    //console.log("rel:"+v)
                                //})
                                t =  a.sessoes;
                                t = a.valor;
                                total.push(t);
                            } else {
                                //console.log("tamanho < 0")
                                rel.forEach((r)=>{
                                    //console.log("r.especialidade:"+r.especialidade)
                                    if(r.especialidade.toString() === e.credit_terapiaid.toString()){
                                        //console.log("existe")
                                        r.sessoes = r.sessoes+1;
                                        existe = true;
                                    }
                                })
                                if(!existe){
                                    //console.log("não existe")
                                    a.especialidade = e.credit_terapiaid;
                                    a.sessoes = 1;
                                    a.valor = e.credit_valorprev;
                                    rel.push(a);
                                    //console.log(a.toString())
                                    t =  t.sessoes + a.sessoes;
                                    t = t.valor + a.valor;
                                    total.push(t);
                                }
                            }
                        })
                        rel.forEach((r)=>{
                            val = (parseInt(r.valor.toString().replace(",",""))*parseInt(r.sessoes)).toString();
                            //console.log("t:"+t)
                            
                            val = this.mascaraValores(val);
                            
                            //console.log(t)
                            //if(t % 1 === 0) {
                            //    //console.log("É inteiro");
                            //} else {
                            //    //console.log("É float");
                            //}
                            
                            r.total = val;
                        })
                        
                        //rel.forEach((r)=>{
                        //    let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                        //   //console.log("rel:"+v)
                        //})
                        
                        //console.log("TAMANHO:"+rel.length)
                        res.render("atendimento/relatendval", {cres: cre, terapias: terapia, convs: conv, rels: rel})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
   */


                        /*
                        //1*e2f
                        cre.forEach((e)=>{
                            existe = 0;
                            if(rel.length == 0){
                                //console.log("tamanho == 0")
                                a.nomecid = e.credit_terapiaid.toString();
                                a.sessoes = 1;
                                a.valor = e.credit_valorprev;
                                //console.log("a:"+a)
                                rel.push(a);
                                //console.log("Primeiro")
                            } else {
                                //console.log("TAMANHODECORRER"+rel.length)
                                rel.some(function(r, index, relArray) {
                                    if(existe == 1){
                                    } else {
                                        if(r.nomecid && e.credit_terapiaid){
                                            if((""+r.nomecid) === (""+e.credit_terapiaid)){
                                                //console.log("existe: "+r.nomecid.toString() +"="+ e.credit_terapiaid.toString())
                                                existe = 1;
                                                //console.log("INDEX:"+index)
                                                //console.log("relArray[index].sessoes:"+relArray[index].sessoes)
                                                aux = relArray[index].sessoes;
                                                aux = aux + 1;
                                                //console.log("aux:"+aux)
                                                relArray[index].sessoes = aux;
                                                //console.log("relArray[index].sessoes: "+relArray[index].sessoes)
                                                return true;
                                            }
                                        }
                                    }
                                    return false;
                                })

                                //console.log("existe:"+existe)
                                if(existe == 0){
                                }else{
                                    //console.log("não existe")
                                    a.nomecid = e.credit_terapiaid;
                                    a.sessoes = 1;
                                    a.valor = e.credit_valorprev;
                                    rel.push(a);
                                }
                            }
                        })
                        */
                       /*
                       relAtendimentoValFiltro(req,res){
                        //console.log("INI:"+req.body.dataIni)
                        //console.log("FIM:"+req.body.dataFim)
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
                        let u;
                        let seg = new Date(req.body.dataIni);
                        let sex = new Date(req.body.dataFim);
                        seg.setHours(0);
                        seg.setMinutes(0);
                        seg.setSeconds(0);
                        sex.setHours(23);
                        sex.setMinutes(59);
                        sex.setSeconds(59);
                        let filtroCredit = {credit_convid: req.body.convid, credit_dataevento: { $gte: seg, $lte: sex}}
                        //procurar por atend com conv
                        let filtroAtend = {atend_convid: req.body.convid, atend_atenddata: { $gte: seg, $lte: sex}}
                        Atend.find(filtroAtend).then((at)=>{})
                        //console.log("seg:"+seg)
                        //console.log("sex:"+sex)
                        Credit.find(filtroCredit).then((cre) =>{
                            //console.log("cre:")
                            //console.log(cre)
                            Conv.find().then((conv)=>{
                                //console.log("conv:")
                                //console.log(conv)
                                Terapia.find().then((terapia)=>{
                                        terapia.forEach((t)=>{
                                            //console.log("TERA: "+t.terapia_nome + "-" + t.terapia_nomecid)
                                            qtdIds = 0;
                                            function comparaIDS(cre){
                                                if ((""+t._id) === (""+cre.credit_terapiaid)){
                                                    qtdIds++;
                                                    creVal = cre.credit_valorprev;
                                                    teraID = cre.credit_terapiaid;
                                                    return cre;
                                                }
                                            }

                                            u = cre.filter((c)=>{comparaIDS(c)})

                                            if(qtdIds != 0){
                                                a.sessoes = qtdIds;
                                                a.nomecid = teraID;
                                                a.valor = creVal;
                                            }
                                            //separado do if anterior pq o codigo n quer q fique junto... da BUG
                                            if(a.sessoes){
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
                                        })
                                        total = {"sessoes": sessaoTot, "valor": valTot, "total": valTot};

                                        res.render("atendimento/relatendval", {cres: cre, terapias: terapia, convs: conv, rels: rel, total})
                        })})}).catch((err) =>{
                            console.log(err)
                        })
                    },
                       */


                    /*
                    //deleta mes atend
                    let segr = new Date();
        let sexr = new Date();
        segr.setHours(0);
        segr.setMinutes(0);
        segr.setSeconds(0);
        sexr.setHours(23);
        sexr.setMinutes(59);
        sexr.setSeconds(59);
        segr.setUTCDate(1);
        sexr.setUTCDate(31);
        console.log("segr"+segr)
        console.log("sexr"+sexr)
        Atend.find({atend_atenddata: { $gte : segr.toISOString(), $lte: sexr.toISOString() }}).then((a)=>{
            a.forEach((at)=>{
                Atend.findByIdAndDelete(at._id, function (err, docs) {
                    if (err){
                        console.log(err)
                    }else{
                        console.log("DETETED!");
                    }
                });
            })
            console.log("END!!!!!!!!!!!!!!!!!!");
        })
                    */

        /*
        recarregaAtendCad(req, res){
        let atend = Atend.montaAtend(req,res);
        console.log("Atend: ");
        console.log(atend);
        console.log("END Atend");
        Bene.find().then((bene)=>{
            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                Sala.find().then((sala)=>{
                    Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética     
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    Atend.findById(req.params.id).then((atend) =>{
                                        res.render('atendimento/atendEdi', { atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, salas: sala})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
        */