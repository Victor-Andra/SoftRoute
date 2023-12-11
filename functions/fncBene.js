//Exports
const mongoose = require("mongoose")

//beneficiario, clientes
const Bene = mongoose.model("tb_bene")
const beneClass = require("../models/bene")

//Classes Extrangeiras
const convClass = require("../models/conv")
const { EscolaModel } = require("../models/escola")
const estadoClass = require("../models/estado")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const escolaClass = require("../models/escola")

//Tabelas Extrangeiras
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Estado = mongoose.model("tb_estado")
const Escola = mongoose.model("tb_escola")

module.exports = {
    carregaBene(req,res){
        Escola.find().then((escola)=>{
            escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena Escola por nome 
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Ufs")
                Conv.find().sort({conv_nome: 1}).then((conv)=>{
                console.log("Listagem Realizada de Convenios")
                res.render("beneficiario/beneCad", {escolas: escola, estados: estado, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },


    cadastraBene(req,res){
        let cadastro = beneClass.beneAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            res.render('beneficiario/beneCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    deletaBene(req, res){
        Bene.deleteOne({_id: req.params.id}).then(() =>{
            Bene.find().then((bene) =>{
                req.flash("success_message", "Bene deletada!")
                res.render('beneficiario/beneLis', {usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Benes")
                res.render('admin/erro')
            })
        })
    },
    atualizaBene(req, res){
        let resposta;
        try{
            beneClass.beneEditar(req,res).then((res)=>{
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
                    //Volta para a bene de listagem
                    this.listaBene(req,res);
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
    atualizaBenesup(req, res){
        let resposta;
        try{
            beneClass.benesupEditar(req,res).then((res)=>{
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
                    //Volta para a bene de listagem
                    this.listaBene(req,res);
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
    carregaBeneEdi(req, res){
        Escola.find().then((escola)=>{
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Ufs")
                    Conv.find().sort({conv_nome: 1}).then((conv)=>{
                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                        console.log("Listagem Realizada de Convenios")
                        Bene.findById(req.params.id).then((beneEdi) =>{
                            res.render("beneficiario/beneEdi", {escolas: escola, estados: estado, convs: conv, beneEdi})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaBenesupEdi(req, res){
        Escola.find().then((escola)=>{
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Ufs")
                    Conv.find().sort({conv_nome: 1}).then((conv)=>{
                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                        console.log("Listagem Realizada de Convenios")
                        Bene.findById(req.params.id).then((beneEdi) =>{
                            res.render("beneficiario/benesupEdi", {escolas: escola, estados: estado, convs: conv, beneEdi})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    listaBene(req, res){
        console.log('listando beneficiários')
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            bene.forEach((b)=>{
                //console.log("b.datanasc"+b.bene_datanasc)
                let datanasc = new Date(b.bene_datanasc)
                let mes = (datanasc.getMonth()+1).toString();
                let dia = (datanasc.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datanasc=fulldate;
            })

        console.log("Listagem Realizada Bene!")
                Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                console.log("Listagem Realizada Convênio!")
                        Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        console.log("Listagem Realizada Terapia!")
                                Usuario.find().then((usuario)=>{
                                console.log("Listagem Realizada Usuário!")
            res.render('beneficiario/beneLis', {usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Benes")
            res.redirect('admin/erro')
        })
    },
    listaBenesup(req, res){
        let convs = new Array();
        console.log('listando benes')
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            bene.forEach((b)=>{
                //console.log("b.datanasc"+b.bene_datanasc)
                let datanasc = new Date(b.bene_datanasc)
                let mes = (datanasc.getMonth()+1).toString();
                let dia = (datanasc.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datanasc=fulldate;
            })

        console.log("Listagem Realizada Bene!")
                Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                console.log("Listagem Realizada Convênio!")
                        Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        console.log("Listagem Realizada Terapia!")
                                Usuario.find().then((usuario)=>{
                                console.log("Listagem Realizada Usuário!")
            res.render('beneficiario/benesupLis', {usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Benes")
            res.redirect('admin/erro')
        })
    },
    listaBeneImp(req, res){
        Bene.findById(req.params.id).then((bene) =>{
            console.log(bene)
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Ufs")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                        res.render('beneficiario/beneLis', {benes: bene, estados: estado, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    listaResp(req, res){
        let convs = new Array();
        console.log('listando Resp')
        Bene.find().then((bene) =>{
            
            bene.forEach((b)=>{
                //console.log("b.datanasc"+b.bene_datanasc)
                let datanasc = new Date(b.bene_datanasc)
                let mes = (datanasc.getMonth()+1).toString();
                let dia = (datanasc.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datanasc=fulldate;
            })

        console.log("Listagem Realizada Resp!")
                Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                console.log("Listagem Realizada Convênio!")
                        Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        console.log("Listagem Realizada Terapia!")
                                Usuario.find().then((usuario)=>{
                                console.log("Listagem Realizada Usuário!")
            res.render('beneficiario/benerespLis', {usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Benes")
            res.redirect('admin/erro')
        })
    }
}