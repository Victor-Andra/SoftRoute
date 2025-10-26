//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

const debitClass = require("../models/debit")
const creditClass = require("../models/credit")
const funcaoClass = require("../models/funcao")
var Credit = getModel("SoftRoute", 'tb_credit', creditClass.CreditSchema)
var Debit = getModel("SoftRoute", 'tb_debit', debitClass.DebitSchema)
var Funcao = getModel("SoftRoute", 'tb_funcao', funcaoClass.FuncaoSchema)

//funcaos
const fs = require('fs');
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaFuncao(req,res){
        let db = req.cookies['preferredDb'];
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)

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
    listaRelContasAPagar(req,res){
        let db = req.cookies['preferredDb'];
        Credit = getModel(db, 'tb_credit', creditClass.CreditSchema)
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let agora = new Date();
        agora.setUTCFullYear(agora.getUTCFullYear(),0,1);//1/1/2022
        agora.setUTCHours(0);
        agora.setMinutes(0);
        agora.setSeconds(0);

        let depois = new Date();
        depois.setUTCFullYear((depois.getUTCFullYear() + 1),0,0);//31/12/2022  -  Se dia 0 volta 1 dia
        depois.setUTCHours(23);
        depois.setMinutes(59);
        depois.setSeconds(59);

        Credit.find({credit_dataevento: { $gte : agora, $lte:  depois }}).then((cre) =>{
            console.log("Credit")
            console.log(cre)
            Debit.find({debit_dataevento: { $gte : agora, $lte:  depois }}).then((deb) =>{
                console.log("Debit")
                console.log(deb)
                res.render('financeiro/despesa/debitGes', {cres:cre, debs:deb})
            })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usuarios")
            res.redirect('admin/erro')
        })
    },
    imprimir(req,res){
        const data = 'Testando a criação de arquivos';
        fs.writeFile('arquivo.txt', data, (err) => {
            if (err) throw err;
            console.log('O arquivo foi criado!');
        });
    }
}