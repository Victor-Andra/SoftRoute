//Exports
const mongoose = require("mongoose")
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Laudoamento 
const laudoClass = require("../models/laudo")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")

//Tabela Plano de Laudoamento 
const Laudo = mongoose.model("tb_laudo")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Escola = mongoose.model("tb_escola")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaLaudo(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Laudoeses')
            let laudo;
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find().then((usuario)=>{
                    res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaLaudo(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    res.render("area/laudo/laudoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Laudo")
            res.redirect('admin/erro')
        })
    },
    carregaLaudoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Laudo.findById(req.params.id).then((laudo) =>{console.log("ID: "+laudo._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: laudo.laudo_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("area/laudo/laudoEdi", {laudo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    filtraLaudo(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Laudoeses')
        Laudo.find({laudo_beneid: req.body.laudoBeneid}).then((laudo) =>{
            laudo.sort((a,b) => (a.laudo_benenome > b.laudo_benenome) ? 1 : ((b.laudo_benenome > a.laudo_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista laudoese 
            laudo.forEach((c)=>{
               //console.log("c.datacad"+c.laudo_datacad)
               let datacad = new Date(c.laudo_data)
               let mes = (datacad.getMonth()+1).toString();
               let dia = (datacad.getUTCDate()).toString();
               if (mes.length == 1){
                   mes = "0"+mes;
               }
               if (dia.length == 1){
                   dia = "0"+dia;
               }
               let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
               c.laudo_data=fulldate;
                

            })

            Bene.find().then((bene)=>{
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
                    res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaLaudo(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    res.render("area/laudo/laudoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Laudo")
            res.redirect('admin/erro')
        })

    },
    carregaLaudoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Laudo.findById(req.params.id).then((laudo) =>{console.log("ID: "+laudo._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: laudo.laudo_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("area/laudo/laudoEdi", {laudo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraLaudo(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        laudoClass.laudoAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Laudo cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaLaudo(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaLaudo(req,res){
        let resultado
        let flash = new Resposta()
        try{
            laudoClass.laudoEditar(req,res).then((res)=>{
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
                    this.listaLaudo(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaLaudo(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaLaudo(req,res){
        let resposta;
        let flash = new Resposta()
        Laudo.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log("Err:"+err)
            req.flash("error_message", "houve um erro ao listar os Laudo")
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Laudo deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Laudo";
                flash.sucesso = "false";
            }
            this.listaLaudo(req,res, flash)
        })
    }
}