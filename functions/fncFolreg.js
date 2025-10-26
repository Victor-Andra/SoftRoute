//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Folregamento 
const folregClass = require("../models/folreg")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const progClass = require("../models/prog")
const progsetClass = require("../models/progset")
const progdicaClass = require("../models/progdica")
const progtipoClass = require("../models/progtipo")
const prognivelClass = require("../models/prognivel")

//Tabela Plano de Folregamento 
var Folreg = getModel("SoftRoute", 'tb_folreg', folregClass.FolregSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Prog = getModel("SoftRoute", 'tb_prog', progClass.ProgSchema)
var Progv = getModel("SoftRoute", 'tb_prog', progClass.ProgSchema)
var Progset = getModel("SoftRoute", 'tb_progset', progsetClass.ProgsetSchema)
var Progdica = getModel("SoftRoute", 'tb_progdica', progdicaClass.ProgdicaSchema)
var Progtipo = getModel("SoftRoute", 'tb_progtipo', progtipoClass.ProgtipoSchema)
var Prognivel = getModel("SoftRoute", 'tb_prognivel', prognivelClass.PrognivelSchema)

//Funções auxiliares
const fncProg = require("../functions/fncProg")
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaFolreg(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)

        let convs = new Array();
        console.log('listando Diários de Folreg')
        Folreg.find().then((folreg) =>{
            console.log("Listagem Realizada dos Diários de Folreg!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    console.log("Listagem Realizada bene!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        console.log("Listagem Realizada Usuário!")
            res.render('area/aba/folreg/folregLis', {Folregs: folreg, terapeutas: terapeuta, Benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Folhas de registro do ABA")
            res.redirect('admin/erro')
        })
    },

    carregaFolreg(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progv = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)

        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Convenios")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Progv.find().then((progv)=>{    
                    Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                            //console.log("Listagem Realizada de Terapia")
                            Prog.find().then((prog)=>{
                                Progset.find().then((progset)=>{
                                res.render("area/aba/folreg/folregCad", {benes: bene, convs: conv, terapeutas: terapeuta, progvs: progv ,progs: prog, progsets: progset})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Folhas de registro do ABA")
            res.redirect('admin/erro')
        })
    },

    preCarregaFolreg(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progv = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)

        let usuarioAtualId = req.cookies['idUsu'];
        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        Progv.find().then((progv)=>{    
                            Prog.findOne({_id: req.params.idProg}).then((prog)=>{
                                Progset.findOne({_id: req.params.id}).then((progset)=>{
                                    Progdica.find().then((progdica)=>{
                                        Progtipo.find().then((progtipo)=>{
                                            Prognivel.find().then((prognivel)=>{
                                                Usuario.findOne({_id: usuarioAtualId}).then((usuarioAtual)=>{
                                                    res.render("area/aba/folreg/folregPreCad", {benes: bene, convs: conv, terapeutas: terapeuta, progvs: progv, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, progset, prog, bene, usuarioAtual})
        })})})})})})})})})})}).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao listar Folhas de registro do ABA");
            res.redirect('admin/erro');
        })
    },

    carregaFolregEdi(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progv = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)

        let usuarioAtual = req.cookies['idUsu'];
        Folreg.findById(req.params.id).then((folreg) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                            Progv.find().then((progv)=>{
                                console.log(" req.params.idProg: "+ req.params.idProg)
                                Prog.findOne({_id: req.params.idProg}).then((prog)=>{
                                    console.log(" req.params.idProgset: "+ req.params.idProgset)
                                    Progset.findOne({_id: req.params.id}).then((progset)=>{
                                        Progdica.find().then((progdica)=>{
                                            Progtipo.find().then((progtipo)=>{
                                                Prognivel.find().then((prognivel)=>{
                                                    res.render("area/aba/folreg/folregPreEdi", {folreg, benes: bene, convs: conv, terapeutas: terapeuta, progvs: progv, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, progset, prog, bene, usuarioAtual})
        })})})})})})})})})})}).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao listar Folhas de registro do ABA");
            res.redirect('admin/erro');
        })
    },

    

    cadastraFolreg(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = folregClass.folregAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                fncProg.listaProg(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
 
    atualizaFolreg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            folregClass.folregEditar(req,res).then((res)=>{
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
                    fncProg.listaProg(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    fncProg.listaProg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaFolreg(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Folreg.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            req.flash("success_message", "folha de registro ABA deletada!")
                            res.render('area/aba/folreg/folregLis', {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, flash})
            })})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Folhas de registro do ABA")
                res.render('admin/erro')
            })
        })
    }
}