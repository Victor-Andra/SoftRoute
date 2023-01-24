//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Laudoamento 
const laudoClass = require("../models/laudo")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

//Tabela Plano de Laudoamento 
const Laudo = mongoose.model("tb_laudo")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")



//Funções auxiliares
const respostaClass = require("../models/resposta")
const bene = require("../models/bene")
const usuario = require("../models/usuario")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaLaudo(req, res){
        let laudos = new Array();
        console.log('listando Diários de Laudo')
        Laudo.find().then((laudo) =>{
            console.log("Listagem Realizada dos Diários de Laudo!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada Usuário!")
            res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Laudo")
            res.redirect('admin/erro')
        })
    },

    carregaLaudo(req,res){
        let laudos = new Array();
        console.log('listando Diários de Laudo')
        Laudo.find().then((laudo) =>{
            console.log("Listagem Realizada dos Diários de Laudo!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena os Usuarios por nome 
                        console.log("Listagem Realizada Usuário!")
                                res.render("area/laudo/laudoCad", {laudos: laudo, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar")
            res.redirect('admin/erro')
        })
    },

    carregaLaudoedi(req,res){
        let laudos = new Array();
        console.log('listando Diários de Laudo')
        Laudo.find().then((laudo) =>{
            console.log("Listagem Realizada dos Diários de Laudo!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena os Usuarios por nome 
                            console.log("Listagem Realizada Usuário!")
                                res.render("area/laudo/laudoEdi", {laudos: laudo, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraLaudo(req,res){
        let resposta
        let cadastro = laudoClass.laudoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaLaudo(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    

    atualizaLaudo(req,res){
        let resultado
        let resposta = new resposta()
        try{
            laudoClass.laudoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
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
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaLaudo(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaLaudo(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaLaudo(req,res){
        Laudo.deleteOne({_id: req.params.id}).then(() =>{
            console.log("Listagem Realizada de Laudos")
                req.flash("success_message", "Laudoamento Fisioterapêutico deletado!")
                res.render('area/laudo/laudoLis', {Laudo, flash})
            .catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }

}