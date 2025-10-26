//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//Empresa
const empresaClass = require("../models/empresa")
var Empresa = getModel("PortalDoUsuario", 'tb_empresa', empresaClass.EmpresaSchema)

//Classes Extrangeiras
const estadoClass = require("../models/estado")

//tabelas Extrangeira
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaEmpresa(req,res){
        console.log('listando empresas')
        Empresa.find().then((empresa) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/empresa/empresaLis', {empresas: empresa})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Empresas")
            res.redirect('admin/erro')
        })
    },

    carregaEmpresa(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/empresa/empresaCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })

    },
    carregaEmpresaEdi(req,res){
        let db = req.cookies['preferredDb'];
        Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)

        Empresa.findById(req.params.id).then((empresa) =>{
            console.log(empresa)
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Estados")
                res.render('ferramentas/empresa/empresaEdi', {empresa, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEmpresa(req,res){
        let cadastro = empresaClass.empresaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/empresa/empresaCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaEmpresa(req,res){
        let resposta;
        try{
            empresaClass.empresaEditar(req,res).then((res)=>{
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
                    //Volta para a empresa de listagem
                    Empresa.find().then((empresa) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/empresa/empresaLis', {empresas: empresa})
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
    deletaEmpresa(req,res){
        Empresa.deleteOne({_id: req.params.id}).then(() =>{
            Empresa.find().then((empresa) =>{
                req.flash("success_message", "Empresa deletada!")
                res.render('ferramentas/empresa/empresaLis', {empresas: empresa})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Empresas")
                res.render('admin/erro')
            })
        })
    }
}