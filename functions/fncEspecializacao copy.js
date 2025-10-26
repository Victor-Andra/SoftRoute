//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//especializacaos
const especializacaoClass = require("../models/especializacao")

//especializacao, tipos de especializacao 
var Especializacao = getModel("SoftRoute", 'tb_especializacao', especializacaoClass.EspecializacaoSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaEspecializacao(req,res,resposta){
        let db = req.cookies['preferredDb'];
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)

        let flash = new Resposta()
        console.log('listando especializacaos')
        Especializacao.find().then((especializacao) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/especializacao/especializacaoLis', {especializacaos: especializacao, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Especializacaos")
            res.redirect('admin/erro')
        })

    },

    carregaEspecializacao(req,res){
        res.render("ferramentas/especializacao/especializacaoCad")
    },


    carregaEspecializacaoEdi(req,res){
        let db = req.cookies['preferredDb'];
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)

        Especializacao.findById(req.params.id).then((especializacao) =>{
            console.log(especializacao)
            res.render('ferramentas/especializacao/especializacaoEdi', {especializacao})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEspecializacao(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = especializacaoClass.especializacaoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                this.listaEspecializacao(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaEspecializacao(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            especializacaoClass.especializacaoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    this.listaEspecializacao(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaEspecializacao(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },


    deletaEspecializacao(req,res){
        let db = req.cookies['preferredDb'];
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)

        Especializacao.deleteOne({_id: req.params.id}).then(() =>{
            Especializacao.find().then((especializacao) =>{
                req.flash("success_message", "Especializacao deletada!")
                res.render('ferramentas/especializacao/especializacaoLis', {especializacaos: especializacao})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Especializacaos")
                res.render('admin/erro')
            })
        })
    }
}