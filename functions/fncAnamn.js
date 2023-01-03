//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Anamnese e Beneficiários
const anamnClass = require("../models/anamn")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela Anamnese
const Anamn = mongoose.model("tb_anamn")

//Tabelas Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")


module.exports = {
    carregaAnamn(req, res){
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/anamn/anamnCad", {usuarios: usuario, benes: bene})
                })}).catch((err) =>{
                    console.log(err)
                    req.flash("error_message", "houve um erro ao listar escolas")
                    res.redirect('admin/erro')
                })
            
        },
    
        cadastraAnamn(req,res){
            console.log("chegou")
            let resultado
            let resposta = new Resposta()
            
            laudoClass.cadastraAnamn(req,res).then((result)=>{
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
                    this.listaAnamn(req,res,resposta)
                } else {
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    console.log('falso')
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    res.render('admin/erro', resposta);
                }
            })
        },



    deletaAnamn(req,res){
        Anamn.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    console.log("Listagem Realizada de beneficiarios")
                req.flash("success_message", "Laudoamento Fisioterapêutico deletado!")
                res.render('area/laudo/laudoLis', {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, flash})
            })})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    },
    
    


    atualizaAnamn(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            anamnClass.anamnEditar(req,res).then((res)=>{
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
                    this.listaAnamn(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaAnamn(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    carregaAnamnEdi(req, res){
            Anamn.findById(req.params.id).then((anamnEdi) =>{
            res.render('area/anamn/anamnEdi')
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    listaAnamn(req, res){
        let anamn = new Array();
        console.log('listando Anamneses')
        Anamn.find().then((anamn) =>{
            console.log("Listagem Realizada das Anamneses!")
                Bene.findById(req.params.id).then((bene) =>{
                    console.log("Listagem Realizada bene!")
                        Usuario.find().then((usuario)=>{
                        console.log("Listagem Realizada Usuário!")
            res.render('area/anamn/anamnLis', {Anamns: anamn, Usuarios: usuario, Benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar as Anamneses")
            res.redirect('admin/erro')
        })
    },

    listaAnamnImp(req, res){
        Anamn.findById(req.params.id).then((anamn) =>{
            console.log(anamn)
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/anamn/anamnLis', {Anamns: anamn, Benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}