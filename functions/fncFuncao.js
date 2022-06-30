//Exports
const mongoose = require("mongoose")

//funcaos
const funcaoClass = require("../models/funcao")
const Funcao = mongoose.model("tb_funcao")


//Classes Extrangeiras
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
const Estado = mongoose.model("tb_estado")

module.exports = {
    listaFuncao(req,res){
        console.log('listando funcaos')
        Funcao.find().then((funcao) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcaos")
            res.redirect('admin/erro')
        })

    },

    carregaFuncao(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/funcao/funcaoCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcaos")
            res.redirect('admin/erro')
        })

    },


    carregaFuncaoEdi(req,res){
        Funcao.findById(req.params.id).then((funcao) =>{
            console.log(funcao)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
            res.render('ferramentas/funcao/funcaoEdi', {funcaos: funcao, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraFuncao(req,res){
        let cadastro = funcaoClass.funcaoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/funcao/funcaoCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaFuncao(req,res){
        let resposta;
        try{
            funcaoClass.funcaoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a funcao de listagem
                    Funcao.find().then((funcao) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
        }
    },


    deletaFuncao(req,res){
        Funcao.deleteOne({_id: req.params.id}).then(() =>{
            Funcao.find().then((funcao) =>{
                req.flash("success_message", "Funcao deletada!")
                res.render('ferramentas/funcao/funcaoLis', {funcaos: funcao})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Funcaos")
                res.render('admin/erro')
            })
        })
    }


}