//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Relatório Semestral 
const evolClass = require("../models/evol")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

//Tabela Relatório Semestral 
const Evol = mongoose.model("tb_evol")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")



//Funções auxiliares
const respostaClass = require("../models/resposta")
const bene = require("../models/bene")
const usuario = require("../models/usuario")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaEvol(req, res){
        let evols = new Array();
        console.log('listando Diários de Evol')
        Evol.find().then((evol) =>{
            console.log("Listagem Realizada dos Diários de Evol!")
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada Usuário!")
            res.render('area/evol/evolLis', {evols: evol, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Evol")
            res.redirect('admin/erro')
        })
    },

    carregaEvol(req,res){
        let evols = new Array();
        console.log('listando Diários de Evol')
        Evol.find().then((evol) =>{
            console.log("Listagem Realizada dos Diários de Evol!")
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena os Usuarios por nome 
                        console.log("Listagem Realizada Usuário!")
                                res.render("area/evol/evolCad", {evols: evol, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar")
            res.redirect('admin/erro')
        })
    },

    carregaEvoledi(req,res){
        let evols = new Array();
        console.log('listando Diários de Evol')
        Evol.find().then((evol) =>{
            console.log("Listagem Realizada dos Diários de Evol!")
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Beneficiarios por nome 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena os Usuarios por nome 
                            console.log("Listagem Realizada Usuário!")
                                res.render("area/evol/evolEdi", {evols: evol, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEvol(req,res){
        let resposta
        let cadastro = evolClass.evolAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEvol(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    

    atualizaEvol(req,res){
        let resultado
        let resposta = new resposta()
        try{
            evolClass.evolEditar(req,res).then((res)=>{
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
                    this.listaEvol(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaEvol(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaEvol(req,res){
        Evol.deleteOne({_id: req.params.id}).then(() =>{
            console.log("Listagem Realizada de Evols")
                req.flash("success_message", "Evolamento Fisioterapêutico deletado!")
                res.render('area/evol/evolLis', {Evol, flash})
            .catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }

}