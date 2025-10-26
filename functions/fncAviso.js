//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Avisoamento 
const avisoClass = require("../models/aviso")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabela Plano de Avisoamento 
var Aviso = getModel("SoftRoute", 'tb_aviso', avisoClass.AvisoSchema)

//Tabelas Extrangeiras
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAviso(req, res){
        let db = req.cookies['preferredDb'];
        Aviso = getModel(db, 'tb_aviso', avisoClass.AvisoSchema)

        let convs = new Array();
        console.log('listando Diários de Aviso')
        Aviso.find().then((aviso) =>{
            console.log("Listagem Realizada dos Diários de Aviso!")
            Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
            res.render('dash/avisoLis', {avisos: aviso, Usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Aviso")
            res.redirect('admin/erro')
        })
    },
    carregaAviso(req,res){
        let db = req.cookies['preferredDb'];
        Aviso = getModel(db, 'tb_aviso', avisoClass.AvisoSchema)

        Aviso.find().then((aviso)=>{
            Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    res.render("dash/avisoCad", {avisos: aviso, usuarios: usuario })
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAvisoEdi(req,res){
        let db = req.cookies['preferredDb'];
        Aviso = getModel(db, 'tb_aviso', avisoClass.AvisoSchema)

        Aviso.find().then((aviso) =>{
            Usuario.find().then((usuario)=>{
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                                res.render("dash/avisoEdi", {avisos: aviso, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraAviso(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        
        avisoClass.cadastraAviso(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaAviso(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
    atualizaAviso(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            avisoClass.avisoEditar(req,res).then((res)=>{
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
                    this.listaAviso(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaAviso(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaAviso(req,res){
        let db = req.cookies['preferredDb'];
        Aviso = getModel(db, 'tb_aviso', avisoClass.AvisoSchema)

        Aviso.deleteOne({_id: req.params.id}).then(() =>{
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
                               
                req.flash("success_message", "Avisoamento Fisioterapêutico deletado!")
                res.render('dash/avisoLis', {avisos: aviso, usuarios: usuario})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }
}