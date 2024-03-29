//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Impostoamento 
const impostoClass = require("../models/imposto")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")

//Tabela Plano de Impostoamento 
const Imposto = mongoose.model("tb_imposto")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Escola = mongoose.model("tb_escola")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaImposto(req, res, resposta){
        let flash = new Resposta();
            Imposto.find().then((imposto)=>{
                    res.render('financeiro/imposto/impostoLis', {impostos: imposto, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaImposto(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    res.render("financeiro/imposto/impostoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Imposto")
            res.redirect('admin/erro')
        })

    },
    carregaImpostoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Imposto.findById(req.params.id).then((imposto) =>{console.log("ID: "+imposto._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: imposto.imposto_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("financeiro/imposto/impostoEdi", {imposto, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    filtraImposto(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Impostoeses')
        Imposto.find({imposto_beneid: req.body.impostoBeneid}).then((imposto) =>{
            imposto.sort((a,b) => (a.imposto_benenome > b.imposto_benenome) ? 1 : ((b.imposto_benenome > a.imposto_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista impostoese 
            imposto.forEach((c)=>{
               //console.log("c.datacad"+c.imposto_datacad)
               let datacad = new Date(c.imposto_data)
               let mes = (datacad.getMonth()+1).toString();
               let dia = (datacad.getUTCDate()).toString();
               if (mes.length == 1){
                   mes = "0"+mes;
               }
               if (dia.length == 1){
                   dia = "0"+dia;
               }
               let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
               c.imposto_data=fulldate;
                

            })

            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find().then((usuario)=>{
                    //console.log("Listagem Realizada Usuário!")
                    /*if(resposta.sucesso == ""){
                        console.log(' objeto vazio');
                        flash.texto = ""
                        flash.sucesso = ""
                    } else {
                        console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                        flash.texto = resposta.texto
                        flash.sucesso = resposta.sucesso
                    }*/
                    res.render('financeiro/imposto/impostoLis', {impostos: imposto, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaImposto(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    res.render("financeiro/imposto/impostoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Imposto")
            res.redirect('admin/erro')
        })

    },
    carregaImpostoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Imposto.findById(req.params.id).then((imposto) =>{console.log("ID: "+imposto._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: imposto.imposto_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("financeiro/imposto/impostoEdi", {imposto, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraImposto(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        impostoClass.impostoAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Imposto cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaImposto(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaImposto(req,res){
        let resultado
        let flash = new Resposta()
        try{
            impostoClass.impostoEditar(req,res).then((res)=>{
                console.log("Atualização realizada!")
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
                    console.log("Listagem realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaImposto(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaImposto(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaImposto(req, res) {
        let flash = new Resposta();
    
        Imposto.deleteOne({ _id: req.params.id })
            .then(result => {
                if (result.deletedCount > 0) {
                    // A exclusão foi bem-sucedida
                    flash.texto = "Imposto deletado com sucesso!";
                    flash.sucesso = "true";
                } else {
                    // Não foi possível encontrar o imposto com o ID fornecido
                    flash.texto = "Imposto não encontrado";
                    flash.sucesso = "false";
                }
            })
            .catch(err => {
                // Ocorreu um erro durante a exclusão
                console.error('Erro ao deletar o imposto:', err);
                flash.texto = "Erro ao deletar o Imposto";
                flash.sucesso = "false";
            })
            .finally(() => {
                // Independentemente do resultado, redirecione para a lista de impostos
                this.listaImposto(req, res, flash);
            });
    }
}