//Exports
const mongoose = require("mongoose")

//prognivels
const prognivelClass = require("../models/prognivel")
const respostaClass = require("../models/resposta")

//prognivel, tipos de prognivel 
const Prognivel = mongoose.model("tb_prognivel")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaPrognivel(req,res,resposta){
        let flash = new Resposta()
        console.log('listando prognivels')
        Prognivel.find().then((prognivel) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/prognivel/prognivelLis', {prognivels: prognivel, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Prognivels")
            res.redirect('admin/erro')
        })

    },

    carregaPrognivel(req,res){
        res.render("ferramentas/prognivel/prognivelCad")
    },

    carregaPrognivelEdi(req,res){
        Prognivel.findById(req.params.id).then((prognivel) =>{
            console.log(prognivel)
            res.render('ferramentas/prognivel/prognivelEdi', {prognivel})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraPrognivel(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = prognivelClass.prognivelAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaPrognivel(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaPrognivel(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            prognivelClass.prognivelEditar(req,res).then((res)=>{
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
                    this.listaPrognivel(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaPrognivel(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaPrognivel(req,res){
        Prognivel.deleteOne({_id: req.params.id}).then(() =>{
            Prognivel.find().then((prognivel) =>{
                req.flash("success_message", "Método deletado!")
                res.render('ferramentas/prognivel/prognivelLis', {prognivels: prognivel})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}