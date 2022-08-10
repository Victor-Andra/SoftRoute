//Exports
const mongoose = require("mongoose")

//debitcategs
const debitcategClass = require("../models/debitCateg")
const Debitcateg = mongoose.model("tb_debitcateg")

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaDebitcateg(req,res,resposta){
        let flash = new Resposta()
        console.log('listando debitcategs')
        Debitcateg.find().then((categoria) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('financeiro/despesa/debitcateg/debitcategLis',{categorias: categoria, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategs")
            res.redirect('admin/erro')
        })
    },
    carregaDebitcateg(req,res){
        res.render("financeiro/despesa/debitcateg/debitcategCad")
    },
    carregaDebitcategEdi(req,res){
        Debitcateg.findById(req.params.id).then((categoria) =>{
            console.log(categoria)
               
            res.render('financeiro/despesa/debitcateg/debitcategEdi', {categoria})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraDebitcateg(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = debitcategClass.debitcategAdicionar(req,res)
        
        cadastro.then((result)=>{
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
                this.listaDebitcateg(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
    atualizaDebitcateg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            debitcategClass.debitcategEditar(req,res).then((res)=>{
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
                    //Volta para a debitcateg de listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaDebitcateg(req,res,resposta)
                } else {
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaDebitcateg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            resposta.texto = err1
            resposta.sucesso = "false"
            res.render('admin/erro', resposta)
        }
    },
    deletaDebitcateg(req,res){
        Debitcateg.deleteOne({_id: req.params.id}).then(() =>{
            Debitcateg.find().then((categoria) =>{
                req.flash("success_message", "Debitcateg deletada!")
                res.render('financeiro/despesa/debitcateg/debitcategLis', {categorias: categoria})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Debitcategs")
                res.render('admin/erro')
            })
        })
    }
}