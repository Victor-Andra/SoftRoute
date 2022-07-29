//Exports
const mongoose = require("mongoose")

//Subcategorias
const debitsubcategClass = require("../models/debitSubcateg")
const Debitsubcateg = mongoose.model("tb_debitsubcateg")

//Categorias
const debitcategClass = require("../models/debitCateg")
const Debitcateg = mongoose.model("tb_debitcateg")

//Classes Extrangeiras

//Tabelas Extrangeiras

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaDebitsubcateg(req,res,resposta){
        let flash = new Resposta()
        console.log('listando debitsubcategs')
        Debitsubcateg.find().then((subcategoria) =>{
            console.log("Listagem Realizada!")
            Debitcateg.find().then((categoria)=>{

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('financeiro/despesa/debitsubcateg/debitsubcategLis',{subcategorias: subcategoria, categorias: categoria, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategsubs")
            res.redirect('admin/erro')
        })
    },
    carregaDebitsubcateg(req,res){
        Debitcateg.find().then((categoria)=>{
            res.render("financeiro/despesa/debitsubcateg/debitsubcategCad",{categorias: categoria})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    carregaDebitsubcategEdi(req,res){
        Debitsubcateg.findById(req.params.id).then((subcategoria) =>{
            console.log(subcategoria)
            Debitcateg.find().then((categoria)=>{
            res.render('financeiro/despesa/debitsubcateg/debitsubcategEdi', {subcategoria, categorias: categoria})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraDebitsubcateg(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = debitsubcategClass.debitsubcategAdicionar(req,res)
        
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
                this.listaDebitsubcateg(req,res,resposta)
            } else {
                resposta.texto = err
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
    atualizaDebitsubcateg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            debitsubcategClass.debitsubcategEditar(req,res).then((res)=>{
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
                    this.listaDebitsubcateg(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaDebitsubcateg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaDebitsubcateg(req,res){
        Debitsubcateg.deleteOne({_id: req.params.id}).then(() =>{
            Debitsubcateg.find().then((debitsubcateg) =>{
                req.flash("success_message", "Debitsubcateg deletada!")
                res.render('financeiro/despesa/debitsubcateg/debitsubcategLis', {debitsubcategs: debitsubcateg})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Debitsubcategs")
                res.render('admin/erro')
            })
        })
    }
}