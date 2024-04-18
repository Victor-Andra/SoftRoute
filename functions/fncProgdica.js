//Exports
const mongoose = require("mongoose")

//progdicas
const progdicaClass = require("../models/progdica")
const respostaClass = require("../models/resposta")

//progdica, tipos de progdica 
const Progdica = mongoose.model("tb_progdica")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaProgdica(req,res,resposta){
        let flash = new Resposta()
        console.log('listando progdicas')
        Progdica.find().then((progdica) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/progdica/progdicaLis', {progdicas: progdica, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Progdicas")
            res.redirect('admin/erro')
        })

    },

    carregaProgdica(req,res){
        res.render("ferramentas/progdica/progdicaCad")
    },

    carregaProgdicaEdi(req,res){
        Progdica.findById(req.params.id).then((progdica) =>{
            console.log(progdica)
            res.render('ferramentas/progdica/progdicaEdi', {progdica})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProgdica(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = progdicaClass.progdicaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaProgdica(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaProgdica(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progdicaClass.progdicaEditar(req,res).then((res)=>{
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
                    this.listaProgdica(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProgdica(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProgdica(req,res){
        Progdica.deleteOne({_id: req.params.id}).then(() =>{
            Progdica.find().then((progdica) =>{
                req.flash("success_message", "Método deletado!")
                res.render('ferramentas/progdica/progdicaLis', {progdicas: progdica})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}