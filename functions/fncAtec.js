//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Analise funcional do comportamento
const atecClass = require("../models/atec")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

//Tabela Atec
var Atec = getModel("SoftRoute", 'tb_atec', atecClass.AtecSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAtec(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Atec = getModel(db, 'tb_atec', atecClass.AtecSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Atec.find().then((atec) =>{

            atec.forEach((b)=>{
                let datacad = new Date(b.atec_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                dataedi = new Date(b.ata_dataedi)
                mes = (dataedi.getMonth()+1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(dataedi.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;

                
            })
           
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        
                        res.render('area/escalas/atec/atecLis', {atecs: atec, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaAtec(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((bene) => {
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Usuário")
                res.render("area/escalas/atec/atecCad", {Benes: bene, Terapeutas: terapeuta})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },
    carregaAtecEdi(req,res){
        let db = req.cookies['preferredDb'];
        Atec = getModel(db, 'tb_atec', atecClass.AtecSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Atec.findOne({_id : req.params.id}).then((atec)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ }}).then((bene) => {
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Beneficiários!")
                        res.render("area/escalas/atec/atecEdi", {atec, Terapias: terapia, Terapeutas: terapeuta, Benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraAtec(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        atecClass.atecAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "ATEC cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaAtec(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaAtec(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            atecClass.atecEditar(req,res).then((res)=>{
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
                    this.listaAtec(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaAtec(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaAtecold(req,res){
        let db = req.cookies['preferredDb'];
        Atec = getModel(db, 'tb_atec', atecClass.AtecSchema)

        let resposta;
        let flash = new Resposta()
        Atec.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os ATEC's")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "ATEC deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar a ATEC";
                flash.sucesso = "false";
            }
            this.listaAtec(req,res, resposta)
        })
    },

    deletaAtac(req,res){
        let db = req.cookies['preferredDb'];
        Atec = getModel(db, 'tb_atec', atecClass.AtecSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let resposta;
        let flash = new Resposta()
        Atec.findByIdAndUpdate(req.params.id,{$set: {'atec_lixo': 'true', 'atec_usuidedi': usuarioAtual}}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os formulários ATEC")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Formulário ATEC deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar o formulário ATEC";
                flash.sucesso = "false";
            }
            this.listaAtec(req,res, resposta)
        })
    }

}