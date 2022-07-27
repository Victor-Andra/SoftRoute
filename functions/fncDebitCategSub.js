//Exports
const mongoose = require("mongoose")

//debitcategsubs
const debitcategsubClass = require("../models/debitcategsub")
const Debitcategsub = mongoose.model("tb_debitcategsub")

//Classes Extrangeiras

//Tabelas Extrangeiras


module.exports = {
    listaDebitcategsub(req,res){
        console.log('listando debitcategsubs')
        Debitcategsub.find().then((debitcategsub) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/debitcategsub/debitcategsubLis', {debitcategsubs: debitcategsub})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategsubs")
            res.redirect('admin/erro')
        })

    },

    carregaDebitcategsub(req,res){

            res.render("ferramentas/debitcategsub/debitcategsubCad")
        .catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debitcategsubs")
            res.redirect('admin/erro')
        })

    },


    carregaDebitcategsubEdi(req,res){
        Debitcategsub.findById(req.params.id).then((debitcategsub) =>{
            console.log(debitcategsub)
            res.render('ferramentas/debitcategsub/debitcategsubEdi', {debitcategsub})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraDebitcategsub(req,res){
        let cadastro = debitcategsubClass.debitcategsubAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/debitcategsub/debitcategsubCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaDebitcategsub(req,res){
        let resposta;
        try{
            debitcategsubClass.debitcategsubEditar(req,res).then((res)=>{
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
                    //Volta para a debitcategsub de listagem
                    Debitcategsub.find().then((debitcategsub) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/debitcategsub/debitcategsubLis', {debitcategsubs: debitcategsub})
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


    deletaDebitcategsub(req,res){
        Debitcategsub.deleteOne({_id: req.params.id}).then(() =>{
            Debitcategsub.find().then((debitcategsub) =>{
                req.flash("success_message", "Debitcategsub deletada!")
                res.render('ferramentas/debitcategsub/debitcategsubLis', {debitcategsubs: debitcategsub})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Debitcategsubs")
                res.render('admin/erro')
            })
        })
    }


}