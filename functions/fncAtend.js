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
const { carregaAtendAdmEdi } = require("./fncAtendAdm")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Credit = mongoose.model("tb_credit")
const Tabil = mongoose.model("tb_tabil")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Sala = mongoose.model("tb_sala")

//Funções auxiliares
const fncCredit = require("../functions/fncCredit")

class RelAtend{
    constructor(
        especialidade,
        sessoes,
        valor,
        total
        ){
        this.especialidade = especialidade,
        this.sessoes = sessoes,
        this.valor = valor,
        this.total = total
    }
}

module.exports = {
    mascaraValores(val){
        //Esta mascara só vai até Milhões
        let t = val
        
        if (t.length >= 9){
            t = t.substring(0,t.length-8)+"."+t.substring(t.length-8,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
        } else if (t.length >= 6){
            t = t.substring(0,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
        } else {
            t = t.substring(0,(t.length - 2))+","+t.substring((t.length - 2),t.length)
        }
        return t;
    },
    carregaAtend(req,res){
        let atend;
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            console.log(atend.atend_num)
            atend.atend_num = atend.atend_num+1;
            console.log(atend.atend_num)
            console.log("Listagem Realizada de NextNum")
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
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
        
        cadastro.then((res)=>{console.log(res)
            retorno = true;
        }).catch((err) => {console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{console.log(res)
                retornoCre = true;
            }).catch((err) => {console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{console.log(res)
                    retornoDeb = true;
                }).catch((err) => {console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{console.log(res)
                        retornoTab = true;
                    }).catch((err) => {console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtend(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    deletaAtend(req, res){
        Atend.deleteOne({_id: req.params.id}).then(() =>{
            Atend.find().then((atend) =>{
                this.listaAtend(req,res)
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },
    atualizaAtend(req, res){
        let resposta;
        try{
            atendClass.atendEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a atend de listagem
                    Atend.find().then((atend) =>{
                        console.log("Listagem Realizada!")
                        this.listaAtend(req,res);
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
        }

    },
    carregaAtendEdi(req, res){
            Bene.find().then((bene)=>{
                Conv.find().then((conv)=>{
                    Sala.find().then((sala)=>{
                        Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                Terapia.find().then((terapia)=>{
                                    Atend.findById(req.params.id).then((atend) =>{
                                         res.render('atendimento/atendEdi', { atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, salas: sala})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    listaAtend(req, res){
        let fulldate;
        Atend.find().then((atend) =>{
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
            console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada de Terapia")
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAtend(req, res){
        let fulldate;
        let tipoFiltro = req.body.tipoFiltro;
        let tipoData = req.body.tipoData;
        let dataIni;
        let dataFim;
        let idFiltro;
        let busca = {};
        switch (tipoFiltro){
            case "Ano/Mes":
                dataIni = new Date(req.body.ano+"/"+req.body.mes+"/"+"01");
                dataFim = new Date(req.body.ano+"/"+req.body.mes+"/"+"01");
                dataFim.setMonth(dataFim.getMonth()+1)
                dataFim = dataFim - 1;
                break;
            case "Dia":
                dataIni = new Date(req.body.data)
                dataFim = new Date(req.body.data)
                dataFim.setMonth(dataFim.getMonth()+1)
                dataFim = dataFim - 1;
                break;
            default:
                break;
        }
        switch (tipoData){
            case "Geral":
                break;
            case "Beneficiário":
                busca["atend_beneid"] = req.body.atendBeneId;
                break;
            case "Terapeuta":
                busca["atend_terapeutaid"] = req.body.atendTerapeutaId;
                break;
            default:
                break;
        }
        Atend.find().then((atend) =>{
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
            console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                        console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada de Terapia")
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
            console.log("Listagem Realizada de Beneficiários!")
            Atend.find({atend_beneid:req.params.id}).sort({atend_num : -1}).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            console.log(atend.atend_num)
            atend.atend_num = atend.atend_num+1;
            console.log(atend.atend_num)
            console.log("Listagem Realizada de NextNum")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    console.log("Listagem Realizada de Convenios")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        
        Conv.findOne().then((conv)=>{
            let filtroCredit = {credit_convid: conv._id, credit_dataevento: { $gte: seg}, credit_dataevento: { $lte: sex}}
            console.log(conv)
            Credit.find(filtroCredit).then((cre) =>{
                Terapia.find().then((terapia)=>{
                    Conv.find().then((conv)=>{
                        res.render("atendimento/relatendval", {cres: cre, terapias: terapia, convs: conv})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValFiltro(req,res){
        let seg = new Date(req.body.dataIni);
        let sex = new Date(req.body.dataFin);
        let a = new RelAtend();
        let t = new RelAtend();
        let existe = false;
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let rel = [];
        let total = [];
        let filtroCredit = {credit_convid: req.body.convid, credit_dataevento: { $gte: seg}, credit_dataevento: { $lte: sex}}
        Credit.find(filtroCredit).then((cre) =>{
            console.log("cre:")
            console.log(cre)
            Conv.find().then((conv)=>{
                console.log("conv:")
                console.log(conv)
                Terapia.find().then((terapia)=>{
                        console.log(cre)
                        cre.forEach((e)=>{
                            console.log("passando aqui")
                            existe = false;
                            if(rel.length == 0){
                                console.log("tamanho == 0")
                                a.especialidade = e.credit_terapiaid;
                                a.sessoes = 1;
                                a.valor = e.credit_valorprev;
                                console.log("a:"+a)
                                rel.push(a);
                                rel.forEach((r)=>{
                                    let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                                    console.log("rel:"+v)
                                })
                                t =  a.sessoes;
                                t = a.valor;
                                total.push(t);
                            } else {
                                console.log("tamanho < 0")
                                rel.forEach((r)=>{
                                    console.log("r.especialidade:"+r.especialidade)
                                    if(r.especialidade.toString() === e.credit_terapiaid.toString()){
                                        console.log("existe")
                                        r.sessoes = r.sessoes+1;
                                        existe = true;
                                    }
                                })
                                if(!existe){
                                    console.log("não existe")
                                    a.especialidade = e.credit_terapiaid;
                                    a.sessoes = 1;
                                    a.valor = e.credit_valorprev;
                                    rel.push(a);
                                    console.log(a.toString())
                                    t =  t.sessoes + a.sessoes;
                                    t = t.valor + a.valor;
                                    total.push(t);
                                }
                            }
                        })
                        rel.forEach((r)=>{
                            let t = (parseInt(r.valor.toString().replace(",",""))*parseInt(r.sessoes)).toString();
                            console.log("t:"+t)
                            
                            t = this.mascaraValores(t);
                            
                            console.log(t)
                            if(t % 1 === 0) {
                                console.log("É inteiro");
                            } else {
                                console.log("É float");
                            }
                            r.total = t;
                        })
                        rel.forEach((r)=>{
                            let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                            console.log("rel:"+v)
                        })

                        res.render("atendimento/relatendval", {cres: cre, terapias: terapia, convs: conv, rels: rel})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    relAtendimentoValFiltro2(req,res){
        let seg = new Date(req.body.dataIni);
        let sex = new Date(req.body.dataFin);
        let a = new RelAtend();
        let existe = false;
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
        let rel = [];
        let filtroAtend = {atend_convid: req.body.relConvid}
        Conv.findOne().then((conv)=>{
            Convcre.find({convcre_convid: conv._id}).then((convcre)=>{
                Terapia.find().then((terapia)=>{
                    Atend.find(filtroAtend).then((atend) =>{
                        console.log(atend)
                        atend.forEach((e)=>{
                            existe = false;
                            if(rel.length == 0){
                                console.log("tamanho == 0")
                                a.especialidade = e.atend_terapiaid;
                                a.sessoes = 1;
                                let val;
                                convcre.forEach((c)=>{
                                    console.log("c.terapiaid:"+c.convcre_terapiaid+"=="+e.atend_terapiaid);
                                    if(c.convcre_terapiaid.toString() === e.atend_terapiaid.toString()){
                                        console.log("true")
                                        val = c.convcre_valor;
                                    } else {
                                        console.log("false")
                                    }
                                });
                                console.log("val:"+val)
                                a.valor = val;

                                rel.push(a);
                                rel.forEach((r)=>{
                                    let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                                    console.log("rel:"+v)
                                })
                            } else {
                                console.log("tamanho < 0")
                                rel.forEach((r)=>{
                                    console.log("r.especialidade:"+r.especialidade)
                                    if(r.especialidade.toString() === e.atend_terapiaid.toString()){
                                        console.log("existe")
                                        r.sessoes = r.sessoes+1;
                                        existe = true;
                                    }
                                })
                                if(!existe){
                                    console.log("não existe")
                                    a.especialidade = e.atend_terapiaid;
                                    a.sessoes = 1;
                                    let val;
                                convcre.forEach((c)=>{
                                    console.log("c.terapiaid:"+c.convcre_terapiaid+"=="+e.atend_terapiaid);
                                    if(c.convcre_terapiaid.toString() === e.atend_terapiaid.toString()){
                                        console.log("true")
                                        val = c.convcre_valor;
                                    } else {
                                        console.log("false")
                                    }
                                });
                                console.log("val:"+val)
                                a.valor = val;
                                    rel.push(a);
                                    console.log(a.toString())
                                }
                            }
                        })
                        rel.forEach((r)=>{
                            let t = (parseInt(r.valor.toString().replace(",",""))*parseInt(r.sessoes)).toString();
                            console.log("t:"+t)
                            
                            t = this.mascaraValores(t);
                            
                            console.log(t)
                            if(t % 1 === 0) {
                                console.log("É inteiro");
                            } else {
                                console.log("É float");
                            }
                            r.total = t;
                        })
                        rel.forEach((r)=>{
                            let v = "{especialidade:"+r.especialidade+",sessoes:"+r.sessoes+",valor:"+r.valor+"}";
                            console.log("rel:"+v)
                        })

                        res.render("atendimento/relatendval", {convcres: convcre, terapias: terapia, convs: conv, rels: rel})
        })})})}).catch((err) =>{
            console.log(err)
        })
    }
}