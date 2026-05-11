//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Analise funcional do comportamento
const carsClass = require("../models/cars")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

//Tabela NAT
var Cars = getModel("SoftRoute", 'tb_cars', carsClass.CarsSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    listaCars(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Cars = getModel(db, 'tb_cars', carsClass.CarsSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Cars.find().then((cars) =>{

            cars.forEach((b)=>{
                let dataConcluido = new Date(b.cars_carsdata)
                let mes = (dataConcluido.getMonth()+1).toString();
                let dia = (dataConcluido.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(dataConcluido.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataConcluido=fulldate;
                
            })
           
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        
                        res.render('area/escalas/cars/carsLis', {carss: cars, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaCars(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ }}).then((bene) => {
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                            res.render("area/escalas/cars/carsCad", {Benes: bene, Terapeutas: terapeuta})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },
    carregaCarsEdi(req,res){
        let db = req.cookies['preferredDb'];
        Cars = getModel(db, 'tb_cars', carsClass.CarsSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        Cars.findOne({_id : req.params.id}).then((cars)=>{
            console.log("abrir o cadastro para visualização ou edição realizada com sucesso")
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                Bene.find({bene_nome: { $not: /\./ } }).then((bene) => {
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    res.render("area/escalas/cars/carsEdi", {cars, Terapeutas: terapeuta, Benes: bene, usuarioAtual, perfilAtual})
            })})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao Realizar as listas!")
                res.render('admin/erro')
            })
        },

    cadastraCars(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        carsClass.carsAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "ATA cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaCars(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },   

    atualizaCars(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            carsClass.carsEditar(req,res).then((res)=>{
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
                    this.listaCars(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaCars(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaCarsold(req,res){
        let db = req.cookies['preferredDb'];
        Cars = getModel(db, 'tb_cars', carsClass.CarsSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let flash = new Resposta();
        Cars.deleteOne({_id: req.params.id}).then(() =>{
            Cars.find().then((cars)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({ bene_nome: { $not: /\./ } }).then((bene) => {
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                            res.render('area/escalas/cars/carsLis', {carss: cars, terapias: terapia, usuarios: usuario, benes: bene, flash})
            })})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    },

    deletaCars(req,res){
        let db = req.cookies['preferredDb'];
        Cars = getModel(db, 'tb_cars', carsClass.CarsSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let resposta;
        let flash = new Resposta()
        Cars.findByIdAndUpdate(req.params.id,{$set: {'cars_lixo': 'true', 'cars_usuidedi': usuarioAtual}}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os formulários CARS")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Formulário CARS foi deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar o formulário CARS";
                flash.sucesso = "false";
            }
            this.listaCars(req,res, resposta)
        })
    }
}