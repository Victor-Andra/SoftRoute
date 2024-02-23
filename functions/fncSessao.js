//Exports
const mongoose = require("mongoose")

//Sessao
const sessaoClass = require("../models/sessao")
const Sessao = mongoose.model("tb_sessao")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")

//tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Terapia = mongoose.model("tb_terapia")
const Usuario = mongoose.model("tb_usuario")



module.exports = {
    carregaSessao(req,res){
        let sessao = new Array();
        console.log('listando Sessao')
        Sessao.find().then((sessao) =>{
        console.log("Listagem Realizada Sessao!")
            Bene.find().then((bene) =>{
                console.log("Listagem Realizada Bene!")
                        Conv.find().then((conv)=>{
                        console.log("Listagem Realizada Convênio!")
                                Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada Terapia!")
                                    Usuario.find().then((usuario)=>{
                                    console.log("Listagem Realizada Usuário!")
                                res.render("beneficiario/sessao/sessaoCad", {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar Sessão")
        res.redirect('admin/erro')
        })
    },

    cadastraSessao(req,res){
        let cadastro = sessaoClass.sessaoAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            let sessao = new Array();
            console.log('listando Sessao')
            Sessao.find().then((sessao) =>{
            console.log("Listagem Realizada Sessao!")
                Bene.find().then((bene) =>{
                    console.log("Listagem Realizada Bene!")
                            Conv.find().then((conv)=>{
                            console.log("Listagem Realizada Convênio!")
                                    Terapia.find().then((terapia)=>{
                                    console.log("Listagem Realizada Terapia!")
                                        Usuario.find().then((usuario)=>{
                                        console.log("Listagem Realizada Usuário!")
                                            res.render('beneficiario/sessao/sessaoCad' , {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene});
            })})})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Sessão")
                res.redirect('admin/erro')
                })
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    deletaSessao(req, res){
        Sessao.deleteOne({_id: req.params.id}).then(() =>{
            Sessao.find().then((sessao) =>{
                req.flash("success_message", "Sessão deletada!")
                res.render('beneficiario/sessao/sessaoLis', {sessaos: sessao})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Sessões")
                res.render('admin/erro')
            })
        })

    },

    atualizaSessao(req, res){
        let resposta;
        try{
            sessaoClass.sessaoEditar(req,res).then((res)=>{
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
                    //Volta para a Sessaoese de listagem
                    Sessao.find().then((sessao) =>{
                        console.log("Listagem Realizada!")
                        res.render('beneficiario/sessao/sessaoLisTab', {sessaos: sessao})
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

    carregaSessaoEdi(req, res){
        Sessao.find({_id: req.params.id}).then((sessao) =>{
            console.log(sessao)
                Bene.find().then((bene) =>{
                console.log("Listagem Realizada Bene!")
                        Conv.find().then((conv)=>{
                        console.log("Listagem Realizada Convênio!")
                                Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada Terapia!")
                                    Usuario.find().then((usuario)=>{
                                    console.log("Listagem Realizada Usuário!")
                                        res.render("beneficiario/sessao/sessaoEdi", {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao gerar o editar Sessões")
            res.redirect('admin/erro')
        })
    },
    listaSessao(req, res){
        let sessao = new Array();
        console.log('listando Sessao')
        Sessao.find().then((sessao) =>{
            console.log("Listagem Realizada Sessão!")
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada Bene!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada Convênio!")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada Terapia!")
                            Usuario.find().then((usuario)=>{
                                console.log("Listagem Realizada Usuário!")
                                sessao.forEach((s)=>{
                                    console.log("s: "+s);
                                    bene.forEach((b)=>{
                                        if ((""+b._id+"") == (""+s.sessao_beneid+"")){
                                            console.log("b.bene_nome: "+b.bene_nome);
                                        }
                                    })
                                })
                                res.render("beneficiario/sessao/sessaoLis", {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
        console.log(err);
        req.flash("error_message", "houve um erro ao listar Sessões");
        res.redirect('admin/erro');
        })
    },

    listaSessaoTab(req, res){
        console.log('listando Sessao')
        Sessao.find({sessao_beneid: req.params.id}).then((sessao) =>{
            console.log("Listagem Realizada Sessão!")
        Bene.find().then((bene) =>{
            console.log("Listagem Realizada Bene!")
                    Conv.find().then((conv)=>{
                    console.log("Listagem Realizada Convênio!")
                            Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada Terapia!")
                                Usuario.find().then((usuario)=>{
                                console.log("Listagem Realizada Usuário!")
                                res.render("beneficiario/sessao/sessaoLisTab", {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar Sessões")
        res.redirect('admin/erro')
        })

    }




}