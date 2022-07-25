//Exports
const mongoose = require("mongoose")

//Fornecedor
const fornecClass = require("../models/fornec")
const Fornec = mongoose.model("tb_fornec")


//Classes Extrangeiras
const atendClass = require("../models/atend")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const horaageClass = require("../models/horaAge")
const estadoClass = require("../models/estado")
const agendaClass = require("../models/agenda")

//Tabelas Extrangeiras
const Atend = mongoose.model("tb_atend")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Horaage = mongoose.model("tb_horaage")
const Estado = mongoose.model("tb_estado")
const Agenda = mongoose.model("tb_agenda")


module.exports = {
    carregaFornecCad(req,res){
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
        cadastro.then((res)=>{
            resposta = res
        }).catch((err)=>{
            console.log(cadastro)
            res.render('admin/erro');
        }).finally(()=>{
            if(resposta == true){
                console.log('verdadeiro')
                this.listaFornec(req, res);
            } else {
                console.log(cadastro)
                res.render('admin/erro');
            }
        })
    },

    deletaFornec(req, res){
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
        Fornec.findById(req.params.id).then((fornec) =>{
            res.render('financeiro/fornecedor/fornecEdi', fornec)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaFornec(req, res){
            
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