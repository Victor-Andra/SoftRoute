//Exports
const mongoose = require("mongoose")

//debitcategs
const debitcategClass = require("../models/debitcateg")
const Debitcateg = mongoose.model("tb_debitcateg")

//Classes Extrangeiras


//Tabelas Extrangeiras


module.exports = {
    listaDebitcateg(req,res){
        console.log('listando debitcategs')
        Debitcateg.find().then((debitcateg) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/debitcateg/debitcategLis', {debitcategs: debitcateg})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategs")
            res.redirect('admin/erro')
        })

    },

    carregaDebitcateg(req,res){
            res.render("ferramentas/debitcateg/debitcategCad")
        .catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategs")
            res.redirect('admin/erro')
        })

    },


    carregaDebitcategEdi(req,res){
        Debitcateg.findById(req.params.id).then((debitcateg) =>{
            console.log(debitcateg)
               
            res.render('ferramentas/debitcateg/debitcategEdi', {debitcateg, estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraDebitcateg(req,res){
        let cadastro = debitcategClass.debitcategAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/debitcateg/debitcategCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaDebitcateg(req,res){
        let resposta;
        try{
            debitcategClass.debitcategEditar(req,res).then((res)=>{
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
                    //Volta para a debitcateg de listagem
                    Debitcateg.find().then((debitcateg) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/debitcateg/debitcategLis', {debitcategs: debitcateg})
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


    deletaDebitcateg(req,res){
        Debitcateg.deleteOne({_id: req.params.id}).then(() =>{
            Debitcateg.find().then((debitcateg) =>{
                req.flash("success_message", "Debitcateg deletada!")
                res.render('ferramentas/debitcateg/debitcategLis', {debitcategs: debitcateg})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Debitcategs")
                res.render('admin/erro')
            })
        })
    }


}