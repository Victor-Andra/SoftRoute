//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Bordoamento 
const bordoClass = require("../models/bordo")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

//Tabela Plano de Bordoamento 
const Bordo = mongoose.model("tb_bordo")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")


//Funções auxiliares


module.exports = {
    listaBordo(req, res){
        let convs = new Array();
        console.log('listando Diários de Bordo')
        Bordo.find().then((bordo) =>{
            console.log("Listagem Realizada dos Diários de Bordo!")
                Bene.findById(req.params.id).then((bene) =>{
                    console.log("Listagem Realizada bene!")
                        Usuario.find().then((usuario)=>{
                        console.log("Listagem Realizada Usuário!")
            res.render('area/bordo/bordoLis', {Bordos: bordo, Usuarios: usuario, Benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Bordo")
            res.redirect('admin/erro')
        })
    },

    carregaBordo(req,res){
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/bordo/bordoCad", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },

    carregaBordoEdi(req,res){
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/bordo/bordoEdi", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraBordo(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        
        bordoClass.cadastraBordoFisio(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaBordo(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaBordo(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            bordoClass.escolaEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaBordo(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaBordo(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaBordo(req,res){
        Bordofisio.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    console.log("Listagem Realizada de beneficiarios")
                req.flash("success_message", "Bordoamento Fisioterapêutico deletado!")
                res.render('area/bordo/bordoLis', {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, flash})
            })})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }


}