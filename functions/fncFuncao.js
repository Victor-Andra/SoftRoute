//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//funcaos
const funcaoClass = require("../models/funcao")
var Funcao = getModel("SoftRoute", 'tb_funcao', funcaoClass.FuncaoSchema)


//Classes Extrangeiras
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaFuncao(req,res){
        let db = req.cookies['preferredDb'];
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)

        console.log('listando funcaos')
        Funcao.find().then((funcao) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcaos")
            res.redirect('admin/erro')
        })
    },
    carregaFuncao(req,res){
        let db = req.cookies['preferredDb'];
        

        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/funcao/funcaoCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcaos")
            res.redirect('admin/erro')
        })

    },
    carregaFuncaoEdi(req,res){
        let db = req.cookies['preferredDb'];
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)
        

        Funcao.findById(req.params.id).then((funcao) =>{
            console.log(funcao)
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Estados")
                res.render('ferramentas/funcao/funcaoEdi', {funcaos: funcao, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraFuncao(req,res){
        let cadastro = funcaoClass.funcaoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/funcao/funcaoCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },
    atualizaFuncao(req,res){
        let db = req.cookies['preferredDb'];
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)

        let resposta;
        try{
            funcaoClass.funcaoEditar(req,res).then((res)=>{
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
                    //Volta para a funcao de listagem
                    Funcao.find().then((funcao) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
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
    deletaFuncao(req,res){
        let db = req.cookies['preferredDb'];
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)

        Funcao.deleteOne({_id: req.params.id}).then(() =>{
            Funcao.find().then((funcao) =>{
                req.flash("success_message", "Funcao deletada!")
                res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Funcaos")
                res.render('admin/erro')
            })
        })
    }
}