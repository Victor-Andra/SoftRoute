//Exports
const mongoose = require("mongoose")

//estados e unidades federativas
const Estado = mongoose.model("tb_estado")

//especializacaos
const especializacaoClass = require("../models/especializacao")

//especializacao, tipos de especializacao 
const Especializacao = mongoose.model("tb_especializacao")

module.exports = {
    listaEspecializacao(req,res){
        console.log('listando especializacaos')
        Especializacao.find().then((especializacao) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/especializacao/especializacaoLis', {especializacaos: especializacao})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Especializacaos")
            res.redirect('admin/erro')
        })

    },

    carregaEspecializacao(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/especializacao/especializacaoCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Especializacaos")
            res.redirect('admin/erro')
        })

    },


    carregaEspecializacaoEdi(req,res){
        Especializacao.findById(req.params.id).then((especializacao) =>{
            console.log(especializacao)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
            res.render('ferramentas/especializacao/especializacaoEdi', {especializacao, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEspecializacao(req,res){
        let cadastro = especializacaoClass.especializacaoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/especializacao/especializacaoCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaEspecializacao(req,res){
        let resposta;
        try{
            especializacaoClass.especializacaoEditar(req,res).then((res)=>{
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
                    //Volta para a especializacao de listagem
                    Especializacao.find().then((especializacao) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/especializacao/especializacaoLis', {especializacaos: especializacao})
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


    deletaEspecializacao(req,res){
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