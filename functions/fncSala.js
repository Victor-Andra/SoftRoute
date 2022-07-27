//Exports
const mongoose = require("mongoose")

//salas
const salaClass = require("../models/sala")
const Sala = mongoose.model("tb_sala")

//Classes Extrangeiras
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
const Estado = mongoose.model("tb_estado")


module.exports = {
    listaSala(req,res){
        console.log('listando salas')
        Sala.find().then((sala) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/sala/salaLis', {salas: sala})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Salas")
            res.redirect('admin/erro')
        })

    },

    carregaSala(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/sala/salaCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Salas")
            res.redirect('admin/erro')
        })

    },


    carregaSalaEdi(req,res){
        Sala.findById(req.params.id).then((sala) =>{
            console.log(sala)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
            res.render('ferramentas/sala/salaEdi', {sala, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraSala(req,res){
        let resposta
        let cadastro = salaClass.salaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaSala(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    atualizaSala(req,res){
        let resposta;
        try{
            salaClass.salaEditar(req,res).then((res)=>{
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
                    //Volta para a sala de listagem
                    console.log('verdadeiro')
                    this.listaSala(req,res)
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


    deletaSala(req,res){
        Sala.deleteOne({_id: req.params.id}).then(() =>{
            Sala.find().then((sala) =>{
                req.flash("success_message", "Sala deletada!")
                res.render('ferramentas/sala/salaLis', {salas: sala})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Salas")
                res.render('admin/erro')
            })
        })
    }


}