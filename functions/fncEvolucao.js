//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
const Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    /*
    //Não é utilizado mais, as evoluções pertencem a agenda
    atualizaEvolucao(req, res){
        let resposta;
        try{
            atendClass.atendEditar(req,res).then((res)=>{
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
                    //Volta para a atend de listagem
                    Atend.findOne().then((atend) =>{
                        console.log("Listagem Realizada!")
                        this.listaAtend(req,res);
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
    */
    carregaEvolucaoEdi(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)

        Atend.findById(req.params.id).then((atend) =>{
            res.render('beneficiario/evolucao/evolucaoEdi', atend)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    listaEvolucao(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Atend.findOne().then((atend) =>{
            var tamanho = atend.length;
            var qtdAtends = {qtd: tamanho}
            console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find().then((usuario)=>{
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            res.render('beneficiario/evolucao/evolucaoLis', {atends: atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, qtdAtends})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    }
}