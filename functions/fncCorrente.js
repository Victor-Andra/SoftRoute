//Exports
//Constante do Mongo Db
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//Corrente 
const correnteClass = require("../models/corrente")
var Corrente = getModel("SoftRoute", 'tb_corrente', correnteClass.CorrenteSchema)

//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const convClass = require("../models/conv")

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)

const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {

    listaCorrente(req, res){
        let db = req.cookies['preferredDb'];
        Corrente = getModel(db, 'tb_corrente', correnteClass.CorrenteSchema)

        Corrente.findOne().then((corrente) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/corrente/correnteLis', {correntes: corrente})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    },

    carregaCorrente(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Bene.find().then((bene)=>{
            console.log("Listagem Realizada de Ufs")
            Conv.find().then((conv)=>{
                console.log("Listagem Realizada de Convenios")
                Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        console.log("Listagem Realizada de Convenios")
                        res.render("financeiro/corrente/correnteCad", {benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    cadastraCorrente(req,res){
        let cadastro = correnteClass.correnteAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro == true){
            console.log('verdadeiro')
            res.render('financeiro/corrente/correnteCad');
        } else {
            console.log(cadastro)
            res.render('admin/erro');
        }
    },

    deletaCorrente(req, res){
        let db = req.cookies['preferredDb'];
        Corrente = getModel(db, 'tb_corrente', correnteClass.CorrenteSchema)

        Corrente.deleteOne({_id: req.params.id}).then(() =>{
            Corrente.findOne().then((corrente) =>{
                req.flash("success_message", "Corrente deletada!")
                res.render('financeiro/corrente/correnteLis', {correntes: corrente})
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },


    atualizaCorrente(req, res){
        let db = req.cookies['preferredDb'];
        Corrente = getModel(db, 'tb_corrente', correnteClass.CorrenteSchema)

        let resposta;
        try{
            correnteClass.correnteEditar(req,res).then((res)=>{
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
                    //Volta para a corrente de listagem
                    Corrente.findOne().then((corrente) =>{
                        console.log("Listagem Realizada!")
                        res.render('financeiro/corrente/correnteLis', {correntes: corrente})
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

    carregaCorrenteEdi(req, res){
        let db = req.cookies['preferredDb'];
        Corrente = getModel(db, 'tb_corrente', correnteClass.CorrenteSchema)

        Corrente.findById(req.params.id).then((corrente) =>{
            res.render('financeiro/corrente/correntEdi', corrente)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }


}