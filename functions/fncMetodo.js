//Exports
const mongoose = require("mongoose")

//metodos
const metodoClass = require("../models/metodo")
const respostaClass = require("../models/resposta")

//metodo, tipos de metodo 
const Metodo = mongoose.model("tb_metodo")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaMetodo(req,res,resposta){
        let flash = new Resposta()
        console.log('listando metodos')
        Metodo.find().then((metodo) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/metodo/metodoLis', {metodos: metodo, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Metodos")
            res.redirect('admin/erro')
        })

    },

    carregaMetodo(req,res){
        res.render("ferramentas/metodo/metodoCad")
    },

    carregaMetodoEdi(req,res){
        Metodo.findById(req.params.id).then((metodo) =>{
            console.log(metodo)
            res.render('ferramentas/metodo/metodoEdi', {metodo})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraMetodo(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = metodoClass.metodoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaMetodo(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaMetodo(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            metodoClass.metodoEditar(req,res).then((res)=>{
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
                    this.listaMetodo(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaMetodo(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaMetodo(req,res){
        Metodo.deleteOne({_id: req.params.id}).then(() =>{
            Metodo.find().then((metodo) =>{
                req.flash("success_message", "Método deletado!")
                res.render('ferramentas/metodo/metodoLis', {metodos: metodo})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}