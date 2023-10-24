//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Extraamento 
const extraClass = require("../models/extra")


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

//Tabela Plano de Extra 
const Extra = mongoose.model("tb_extra")

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
const Horaage = mongoose.model("tb_horaage")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncCredit = require("../functions/fncCredit")
const fncDebit = require("../functions/fncDebit")
const fncGeral = require("../functions/fncGeral")
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")
const ObjectId = require('mongodb').ObjectId;




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
    listaExtra(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Extraeses')
            let extra;

            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find().then((usuario)=>{
                    //console.log("Listagem Realizada Usuário!")
                    /*if(resposta.sucesso == ""){
                        console.log(' objeto vazio');
                        flash.texto = ""
                        flash.sucesso = ""
                    } else {
                        console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                        flash.texto = resposta.texto
                        flash.sucesso = resposta.sucesso
                    }*/
                    res.render('atendimento/extra/extraLis', {extras: extra, usuarios: usuario, benes: bene, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaExtra(req,res){
        let atend;
        Extra.find().then((atend)=>{
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
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                        res.render("atendimento/extra/extraCad", {horaages: horaage, atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala
                                        })
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    filtraExtra(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Extraeses')
        Extra.find({extra_beneid: req.body.extraBeneid}).then((extra) =>{
            extra.sort((a,b) => (a.extra_benenome > b.extra_benenome) ? 1 : ((b.extra_benenome > a.extra_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
            extra.forEach((c)=>{
               //console.log("c.datacad"+c.extra_datacad)
               let datacad = new Date(c.extra_data)
               let mes = (datacad.getMonth()+1).toString();
               let dia = (datacad.getUTCDate()).toString();
               if (mes.length == 1){
                   mes = "0"+mes;
               }
               if (dia.length == 1){
                   dia = "0"+dia;
               }
               let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
               c.extra_data=fulldate;
                

            })

            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find().then((usuario)=>{
                    //console.log("Listagem Realizada Usuário!")
                    /*if(resposta.sucesso == ""){
                        console.log(' objeto vazio');
                        flash.texto = ""
                        flash.sucesso = ""
                    } else {
                        console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                        flash.texto = resposta.texto
                        flash.sucesso = resposta.sucesso
                    }*/
                    res.render('atendimento/extra/extraLis', {extras: extra, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
   
    carregaExtraedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Extra.findById(req.params.id).then((extra) =>{console.log("ID: "+extra._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({bene_status:"Ativo"}).then((beneficiarios)=>{
                            Bene.findOne({_id: extra.extra_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    res.render("atendimento/extra/extraEdi", {horaages: horaege, extra, convs: conv, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraExtra(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        extraClass.extraAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Extra cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaExtra(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaExtra(req,res){
        let resultado
        let flash = new Resposta()
        try{
            extraClass.extraEditar(req,res).then((res)=>{
                console.log("Atualização realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaExtra(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaExtra(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaExtra(req,res){
        let resposta;
        let flash = new Resposta()
        Extra.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Extra")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Extra deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Extra";
                flash.sucesso = "false";
            }
            this.listaExtra(req,res, resposta)
        })
    }
}