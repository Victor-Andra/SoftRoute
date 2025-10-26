//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//progsets
const progsetClass = require("../models/progset")

const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

const progClass = require("../models/prog")
const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")
const folregClass = require("../models/folreg")
const fncProg = require("../functions/fncProg")

//progset, tipos de progset 
var Progset = getModel("SoftRoute", 'tb_progset', progsetClass.ProgsetSchema)

var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

var Prog = getModel("SoftRoute", 'tb_prog', progClass.ProgSchema)
var Progdica = getModel("SoftRoute", 'tb_progdica', progdicaClass.ProgdicaSchema)
var Prognivel = getModel("SoftRoute", 'tb_prognivel', prognivelClass.PrognivelSchema)
var Progtipo = getModel("SoftRoute", 'tb_progtipo', progtipoClass.ProgtipoSchema)
var Folreg = getModel("SoftRoute", 'tb_folreg', folregClass.FolregSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaProgset(req,res,resposta){
        let db = req.cookies['preferredDb'];
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)

        let flash = new Resposta()
        console.log('listando progsets')
        Progset.find().then((progset) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == "" || !resposta){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('area/aba/progset/progsetLis', {progsets: progset, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Progsets")
            res.redirect('admin/erro')
        })

    },

    carregaProgset(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)

        let idProg;
        if (req.params.id){
            idProg = req.params.id;
        } else {
            idProg = "766f69643132333435366964";
        }
        let idBene;
        if (req.params.id){
            idBene = req.params.id;
        } else {
            idBene = "766f69643132333435366964";
        }
        let idProgtipo;
        if (req.params.id){
            idProgtipo = req.params.id;
        } else {
            idProgtipo = "766f69643132333435366964";
        }
        let idPrognivel;
        if (req.params.id){
            idPrognivel = req.params.id;
        } else {
            idPrognivel = "766f69643132333435366964";
        }
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")    
                            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    console.log("Listagem Realizada de beneficiarios")
                                    Progdica.find().then((progdica)=>{
                                        Progtipo.find().then((progtipo)=>{
                                            Prognivel.find().then((prognivel)=>{
                                                Prog.find().then((prog)=>{
                                res.render("area/aba/progset/progsetCad", {usuarios: usuario, benes: bene, idProg, idBene, idProgtipo, idPrognivel, progs: prog, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },

    preCarregaProgset(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuário por nome
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuário por nome
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        console.log("Listagem Realizada de beneficiarios")
                        Prog.findOne({_id: req.params.id}).then((prog)=>{
                            Progdica.find().then((progdica)=>{
                                Progtipo.find().then((progtipo)=>{
                                    Prognivel.find().then((prognivel)=>{
                                res.render("area/aba/progset/progsetPreCad", {usuarios: usuario, benes: bene, prog, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta, usuarioAtual, perfilAtual})
        })})})})})})}).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao listar escolas");
            res.redirect('admin/erro');
        })
    },

    carregaProgsetEdi(req,res){
        let db = req.cookies['preferredDb'];
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)

        let perfilAtual = req.cookies['lvlUsu'];
        Progset.findById(req.params.id).then((progset) =>{
            console.log("ID: "+progset._id)
            let idProg;
            if (req.params.id){
                idProg = req.params.id;
            } else {
                idProg = "766f69643132333435366964";
            }
            let idBene;
            if (req.params.id){
                idBene = req.params.id;
            } else {
                idBene = "766f69643132333435366964";
            }
            let idProgtipo;
            if (req.params.id){
                idProgtipo = req.params.id;
            } else {
                idProgtipo = "766f69643132333435366964";
            }
            let idPrognivel;
            if (req.params.id){
                idPrognivel = req.params.id;
            } else {
                idPrognivel = "766f69643132333435366964";
            }
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")    
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                        console.log("Listagem Realizada de beneficiarios")
                                        Progdica.find().then((progdica)=>{
                                            Progtipo.find().then((progtipo)=>{
                                                Prognivel.find().then((prognivel)=>{
                                                    Prog.find().then((prog)=>{
                                                        Folreg.find().then((folreg)=>{
                                    res.render("area/aba/progset/progsetEdi", {usuarios: usuario, benes: bene, idProg, idBene, idProgtipo, idPrognivel, progset, progs: prog, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta, folregs: folreg, perfilAtual})
            })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProgset(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = progsetClass.progsetAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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

    atualizaProgset(req, res) {
        let resultado;
        let resposta = new Resposta();
        try {
            progsetClass.progsetEditar(req, res).then((res) => {
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) => {
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() => {
                if (resultado == true) {
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    fncProg.listaProg(req, res, resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    fncProg.listaProg(req, res, resposta)
                }
            })
        } catch (err1) {
            console.log("Erro TryCatch:" + err1)
            res.render('admin/erro');
        }
    },

    deletaProgset(req,res){
        let db = req.cookies['preferredDb'];
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)

        Progset.deleteOne({_id: req.params.id}).then(() =>{
            Progset.find().then((progset) =>{
                req.flash("success_message", "Método deletado!")
                res.render('area/aba/progset/progsetLis', {progsets: progset})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }
}