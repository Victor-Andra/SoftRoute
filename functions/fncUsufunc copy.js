//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//usufuncs
const usufuncClass = require("../models/usufunc")
var Usufunc = getModel("PortalDoUsuario", 'tb_usufunc', usufuncClass.UsufuncSchema)

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaUsufunc(req,res){
        console.log('listando usufuncs')
        Usuario.find().then((usuario) =>{
            Usufunc.find().then((usufunc) =>{
                console.log("Listagem Realizada!")
                res.render('ferramentas/usufunc/usufuncLis', {usufuncs: usufunc, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usufuncs")
            res.redirect('admin/erro')
        })

    },
    carregaUsufunc(req,res){
        let db = req.cookies['preferredDb'];
        

        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/usufunc/usufuncCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usufuncs")
            res.redirect('admin/erro')
        })

    },
    carregaUsufuncEdi(req,res){
        Usufunc.findById(req.params.id).then((usufunc) =>{
            console.log("Listagem Realizada de Estados")
            res.render('ferramentas/usufunc/usufuncEdi', {usufunc})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraUsufunc(req,res){
        let resposta
        let cadastro = usufuncClass.usufuncAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaUsufunc(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    atualizaUsufunc(req,res){
        let resposta;
        try{
            usufuncClass.usufuncEditar(req,res).then((res)=>{
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
                    //Volta para a usufunc de listagem
                    console.log('verdadeiro')
                    this.listaUsufunc(req,res)
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
    deletaUsufunc(req,res){
        Usufunc.deleteOne({_id: req.params.id}).then(() =>{
            Usufunc.find().then((usufunc) =>{
                req.flash("success_message", "Usufunc deletada!")
                res.render('ferramentas/usufunc/usufuncLis', {usufuncs: usufunc})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Usufuncs")
                res.render('admin/erro')
            })
        })
    }
}