//Exports
const mongoose = require("mongoose")

//metouts
const metoutClass = require("../models/metout")
const respostaClass = require("../models/resposta")

//metout, tipos de metout 
const Metout = mongoose.model("tb_metout")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaMetout(req,res,resposta){
        let flash = new Resposta()
        console.log('listando metouts')
        Metout.find().then((metout) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('ferramentas/metout/metoutLis', {metouts: metout, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Metouts")
            res.redirect('admin/erro')
        })

    },

    carregaMetout(req,res){
        res.render("ferramentas/metout/metoutCad")
    },

    carregaMetoutEdi(req,res){
        Metout.findById(req.params.id).then((metout) =>{
            console.log(metout)
            res.render('ferramentas/metout/metoutEdi', {metout})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraMetout(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = metoutClass.metoutAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaMetout(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaMetout(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            metoutClass.metoutEditar(req,res).then((res)=>{
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
                    this.listaMetout(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaMetout(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaMetout(req,res){
        Metout.deleteOne({_id: req.params.id}).then(() =>{
            Metout.find().then((metout) =>{
                req.flash("success_message", "Método deletado!")
                res.render('ferramentas/metout/metoutLis', {metouts: metout})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}