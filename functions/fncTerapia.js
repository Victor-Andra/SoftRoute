//Exports
const mongoose = require("mongoose")


//Base Terapia
const terapiaClass = require("../models/terapia")
const Terapia = mongoose.model("tb_terapia")

module.exports = {
    listaTerapia(req,res){
        console.log('listando terapias')
        Terapia.find().then((terapia) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Terapias")
            res.redirect('admin/erro')
        })

    },

    carregaTerapia(req,res){
        res.render("ferramentas/terapia/terapiaCad")

    },


    carregaTerapiaEdi(req,res){
        Terapia.findById(req.params.id).then((terapia) =>{
            console.log(terapia)
            res.render('ferramentas/terapia/terapiaEdi', {terapia})
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    cadastraTerapia(req,res){
        let cadastro = terapiaClass.terapiaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/terapia/terapiaCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }

    },

    editarTerapia(req,res){
        let resposta;
        try{
            terapiaClass.terapiaEditar(req,res).then((res)=>{
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
                    //Volta para a terapia de listagem
                    Terapia.find().then((terapia) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
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


    deletaTerapia(req,res){
        Terapia.deleteOne({_id: req.params.id}).then(() =>{
            Terapia.find().then((terapia) =>{
                req.flash("success_message", "Terapia deletada!")
                res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Terapias")
                res.render('admin/erro')
            })
        })

    },

    atualizaTerapia(req, res){
        let resposta;
        try{
            terapiaClass.terapiaEditar(req,res).then((res)=>{
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
                    //Volta para a Terapiaese de listagem
                    Terapia.find().then((terapia) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
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



}