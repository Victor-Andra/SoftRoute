//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  VB-Mapabll 
const mapabllClass = require("../models/mapabll")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

//Tabela Plano de Mapabllamento 
var Mapabll = getModel("SoftRoute", 'tb_mapabll', mapabllClass.MapabllSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaMapabll(req, res){
        let db = req.cookies['preferredDb'];
        Mapabll = getModel(db, 'tb_mapabll', mapabllClass.MapabllSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let mapablls = new Array();
        console.log('listando Diários de Mapabll')
        Mapabll.find().then((mapabll) =>{
            console.log("Listagem Realizada dos Diários de Mapabll!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada bene!")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada Usuário!")
                    res.render('area/mapabll/mapabllLis', {mapablls: mapabll, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Mapabll")
            res.redirect('admin/erro')
        })
    },

    carregaMapabll(req,res){
        let db = req.cookies['preferredDb'];
        Mapabll = getModel(db, 'tb_mapabll', mapabllClass.MapabllSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let mapablls = new Array();
        console.log('listando Diários de Mapabll')
        Mapabll.find().then((mapabll) =>{
            console.log("Listagem Realizada dos Diários de Mapabll!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena os Usuarios por nome 
                        console.log("Listagem Realizada Usuário!")
                        res.render("area/mapabll/mapabllCad", {mapablls: mapabll, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar")
            res.redirect('admin/erro')
        })
    },

    carregaMapablledi(req,res){
        let db = req.cookies['preferredDb'];
        Mapabll = getModel(db, 'tb_mapabll', mapabllClass.MapabllSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let mapablls = new Array();
        console.log('listando Diários de Mapabll')
        Mapabll.find().then((mapabll) =>{
            console.log("Listagem Realizada dos Diários de Mapabll!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena os Usuarios por nome 
                        console.log("Listagem Realizada Usuário!")
                        res.render("area/mapabll/mapabllEdi", {mapablls: mapabll, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraMapabll(req,res){
        let resposta
        let cadastro = mapabllClass.mapabllAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaMapabll(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    

    atualizaMapabll(req,res){
        let resultado
        let resposta = new resposta()
        try{
            mapabllClass.mapabllEditar(req,res).then((res)=>{
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
                    this.listaMapabll(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaMapabll(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaMapabll(req,res){
        let db = req.cookies['preferredDb'];
        Mapabll = getModel(db, 'tb_mapabll', mapabllClass.MapabllSchema)

        Mapabll.deleteOne({_id: req.params.id}).then(() =>{
            console.log("Listagem Realizada de Mapablls")
                req.flash("success_message", "Mapabllamento Fisioterapêutico deletado!")
                res.render('area/mapabll/mapabllLis', {Mapabll, flash})
            .catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }
}