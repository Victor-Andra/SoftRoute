//Exports
const mongoose = require("mongoose")

//progsets
const progsetClass = require("../models/progset")
const respostaClass = require("../models/resposta")

const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

const progClass = require("../models/prog")
const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")


//progset, tipos de progset 
const Progset = mongoose.model("tb_progset")
const Resposta = mongoose.model("tb_resposta")

const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")

const Prog = mongoose.model("tb_prog")
const Progdica = mongoose.model("tb_progdica")
const Prognivel = mongoose.model("tb_prognivel")
const Progtipo = mongoose.model("tb_progtipo")


module.exports = {
    listaProgset(req,res,resposta){
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
        let usuarioAtual = req.cookies['idUsu'];
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            console.log("Listagem Realizada de Usuário")
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        console.log("Listagem Realizada de beneficiarios")
                        Prog.findOne({_id: req.params.id}).then((prog)=>{
                            Progdica.find().then((progdica)=>{
                                Progtipo.find().then((progtipo)=>{
                                    Prognivel.find().then((prognivel)=>{
                                res.render("area/aba/progset/progsetPreCad", {usuarios: usuario, benes: bene, prog, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta, usuarioAtual})
        })})})})})})}).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao listar escolas");
            res.redirect('admin/erro');
        })
    },

    carregaProgsetEdi(req,res){
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
                                    res.render("area/aba/progset/progsetEdi", {usuarios: usuario, benes: bene, idProg, idBene, idProgtipo, idPrognivel, progset, progs: prog, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
            })})})})})})})}).catch((err) =>{
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
                //res.render('area/aba/prog/progLis')
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaProgset(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progsetClass.progsetEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    this.listaProgset(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProgset(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProgset(req,res){
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