//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Relsemamento 
const relsemClass = require("../models/relsem")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")
const laudoClass = require("../models/laudo")

//Tabela Plano de Relsemamento 
const Relsem = mongoose.model("tb_relsem")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Escola = mongoose.model("tb_escola")
const Laudo = mongoose.model("tb_laudo")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaRelsem(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Relsemeses')
            let relsem;

            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find().then((usuario)=>{
                    res.render('area/relsem/relsemLis', {relsems: relsem, usuarios: usuario, benes: bene, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraRelsem(req, res, resposta){
        let flash = new Resposta();
        let dataIni;
        let dataFim;
        //console.log('listando Relsemeses')
        dataIni = new Date();
        dataIni.setDate(01);
        dataIni.setFullYear(parseInt(anoIni)-1);
        dataIni.setUTCMonth(1);
        dataIni.setHours(0, 0, 0, 0);

        dataFim = new Date();
        dataFim.setDate(01);
        dataFim.setFullYear(parseInt(anoIni)+1);
        dataFim.setUTCMonth(1);
        dataFim.setHours(0, 0, 0, 0);

        Relsem.find({relsem_beneid: req.body.relsemBeneid, relsem_data: { $gte :new Date(dataIni), $lte:  new Date(dataFim) }}).then((relsem) =>{
            relsem.sort((a,b) => (a.relsem_benenome > b.relsem_benenome) ? 1 : ((b.relsem_benenome > a.relsem_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista relsemese 
            relsem.forEach((c)=>{
               //console.log("c.datacad"+c.relsem_datacad)
               let datacad = new Date(c.relsem_data)
               let mes = (datacad.getMonth()+1).toString();
               let dia = (datacad.getUTCDate()).toString();
               if (mes.length == 1){
                   mes = "0"+mes;
               }
               if (dia.length == 1){
                   dia = "0"+dia;
               }
               let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
               c.relsem_data=fulldate;
                

            })

            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
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
                    res.render('area/relsem/relsemLis', {relsems: relsem, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaRelsem(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find({bene_status: "Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Laudo.find().then((laudo)=>{
                    Escola.find().sort({escola_nome: 1}).then((escola)=>{
                        escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                        res.render("area/relsem/relsemCad", {escolas: escola, laudos: laudo, terapeutas: terapeuta, benes: bene, usuarioAtual})
                })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Relsem")
            res.redirect('admin/erro')
        })
    },
    carregaRelsemedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({bene_status: "Ativo"}).then((beneficiario)=>{
                            beneficiario.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    Laudo.find().then((laudo)=>{
                                        res.render("area/relsem/relsemEdi", {relsem, laudos: laudo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes: beneficiario})
        })})})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraRelsem(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        relsemClass.relsemAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Relsem cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaRelsem(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaRelsem(req,res){
        let resultado
        let flash = new Resposta()
        try{
            relsemClass.relsemEditar(req,res).then((res)=>{
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
                    this.listaRelsem(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaRelsem(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaRelsem(req,res){
        let resposta;
        let flash = new Resposta()
        Relsem.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Relsem")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Relsem deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Relsem";
                flash.sucesso = "false";
            }
            this.listaRelsem(req,res, resposta)
        })
    },
    
    relsemImp(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let base64Image0; //Carimbo padrão de Roberta
        let base64Image1; //Carimbo terapeuta padrão
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                        //Busca nos usuários os carimbos dos Terapeutas identificados dentro do Plano de Tratamento incluindo o carimbo da Route
                                        Usuario.findOne({_id : '62e008adea444f5b7a02c04f'}).then((carRobertaRoute)=>{
                                            if (carRobertaRoute.usuario_carimbo != 'undefined' && carRobertaRoute.usuario_carimbo != undefined){
                                                base64Image0 = new Buffer.from(carRobertaRoute.usuario_carimbo, 'binary').toString('base64');
                                                }
                                                Usuario.findOne({_id: relsem.relsem_terapeutaid}).then((carTeraPad)=>{
                                                        if (carTeraPad.usuario_carimbo != 'undefined' && carTeraPad.usuario_carimbo != undefined){
                                                            base64Image1 = new Buffer.from(carTeraPad.usuario_carimbo, 'binary').toString('base64');
                                                            }
                                                        console.log(carTeraPad)
                                    res.render("area/relsem/relsemImp", {relsem, base64Image0, base64Image1, carTeraPad, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao abrir a impressão!")
            res.render('admin/erro')
        })
    },

    relsemImpcapa(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("area/relsem/relsemImpcapa", {relsem, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao abrir a impressão da capa!")
            res.render('admin/erro')
        })
    },

    relsemImpFiltro(req,res){
        Relsem.find({relsem_beneid: req.body.relsemBeneid}).then((relsem) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                res.render('area/relsem/relsemImp', {relsems: relsem, benes: bene})
        })})
    }
}