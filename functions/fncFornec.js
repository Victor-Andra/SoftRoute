//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//Fornecedor
const fornecClass = require("../models/fornec")
var Fornec = getModel("SoftRoute", 'tb_fornec', fornecClass.FornecSchema)


//Classes Extrangeiras
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    carregaFornecCad(req,res){
        let db = req.cookies['preferredDb'];
        

        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("financeiro/fornecedor/fornecCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })
    },

    cadastraFornec(req,res){
        let cadastro = fornecClass.fornecAdicionar(req,res);//variavel para armazenar a função que armazena o async
        let resposta;
        cadastro.then((cad)=>{
            console.log(cad)
            resposta = true
        }).catch((err)=>{
            console.log(resposta+"-"+err)
            res.render('admin/erro');
        }).finally(()=>{
            if(resposta == true){
                console.log("verdadeiro")
                this.listaFornec(req, res);
            } else {
                console.log(resposta)
                res.render('admin/erro');
            }
        })
    },

    deletaFornec(req, res){
        let db = req.cookies['preferredDb'];
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        Fornec.deleteOne({_id: req.params.id}).then(() =>{
            Fornec.find().then((fornec) =>{
                req.flash("success_message", "Fornec deletada!")
                res.render('financeiro/fornecedor/fornecLis', {fornecs: fornec})
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },

    atualizaFornec(req, res){
        let db = req.cookies['preferredDb'];
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        let resposta;
        try{
            fornecClass.fornecEditar(req,res).then((res)=>{
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
                    //Volta para a fornec de listagem
                    Fornec.find().then((fornec) =>{
                        console.log("Listagem Realizada!")
                        res.render('financeiro/fornecedor/fornecLis', {fornecs: fornec})
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

    carregaFornecEdi(req, res){
        let db = req.cookies['preferredDb'];
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        Fornec.findById(req.params.id).then((fornec) =>{
            res.render('financeiro/fornecedor/fornecEdi', fornec)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaFornec(req, res){
        let db = req.cookies['preferredDb'];
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        Fornec.find().then((fornec) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/fornecedor/fornecLis', {fornecs: fornec})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Fornecs")
            res.redirect('admin/erro')
        })
    }
}