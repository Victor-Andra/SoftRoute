//Exports
const mongoose = require("mongoose")

//progtipos
const progtipoClass = require("../models/progtipo")
const respostaClass = require("../models/resposta")

//progtipo, tipos de progtipo 
const Progtipo = mongoose.model("tb_progtipo")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaProgtipo(req,res,resposta){
        let flash = new Resposta()
        console.log('listando progtipos')
        Progtipo.find().then((progtipo) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/progtipo/progtipoLis', {progtipos: progtipo, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Progtipos")
            res.redirect('admin/erro')
        })

    },

    carregaProgtipo(req,res){
        res.render("ferramentas/progtipo/progtipoCad")
    },

    carregaProgtipoEdi(req,res){
        Progtipo.findById(req.params.id).then((progtipo) =>{
            console.log(progtipo)
            res.render('ferramentas/progtipo/progtipoEdi', {progtipo})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProgtipo(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = progtipoClass.progtipoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaProgtipo(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaProgtipo(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progtipoClass.progtipoEditar(req,res).then((res)=>{
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
                    this.listaProgtipo(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProgtipo(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProgtipo(req,res){
        Progtipo.deleteOne({_id: req.params.id}).then(() =>{
            Progtipo.find().then((progtipo) =>{
                req.flash("success_message", "Método deletado!")
                res.render('ferramentas/progtipo/progtipoLis', {progtipos: progtipo})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}