//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//saudecolabs - CARREGA DIRETAMENTE DO SCHEMA QUE JÁ USA PORTALDOUSUARIO
const saudecolabClass = require("../models/saudecolab")
const SaudecolabModel = saudecolabClass.SaudecolabModel  // ✅ Usa o modelo já configurado para PortalDoUsuario

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras - PortalDoUsuario
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaSaudecolabOLD(req,res, resposta){
        let flash = new Resposta();
        flash = resposta;
        console.log('listando saudecolabs do PortalDoUsuario')
        let filtraUsuario;
        let usuarioAtual = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        if ("62421801a12aa557219a0fb9,62421857a12aa557219a0fc1,6242190fa12aa557219a0fd6,644742e378166939169f82a1,644743aa78166939169f8486".includes(lvlUsu)){
            filtraUsuario = {};
        } else {
            filtraUsuario = {saudecolab_saudecolabusuid : usuarioAtual};
        }
        SaudecolabModel.find(filtraUsuario).then((saudecolab) =>{
            Usuario.find().then((usuario)=>{
                console.log("Listagem Realizada! - PortalDoUsuario")
                res.render('ferramentas/saudecolab/saudecolabLis', {saudecolabs: saudecolab, usuarios: usuario,  idUsu: usuarioAtual, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })
    },

listaSaudecolab(req,res, resposta){
    let flash = new Resposta();
    flash = resposta;
    let usuarioAtual = req.cookies['idUsu'];
    let lvlUsu = req.cookies['lvlUsu'];
    
    // IDs dos 3 usuários "super" que podem ver lupa em TUDO
    const idsSuper = [
        "681ba2369a565e1f979b7e10", 
        "62d95222ea444f5b7a0276bc", 
        "62e008adea444f5b7a02c04f"
    ];
    
    // IDs de nível admin (que veem todos os registros, mas só os "super" veem a lupa)
    const idsAdm = [
        "62421801a12aa557219a0fb9",
        "62421857a12aa557219a0fc1", 
        "6242190fa12aa557219a0fd6", 
        "644742e378166939169f82a1", 
        "644743aa78166939169f8486"
    ];

    let podeVerLupa = false;
    let filtraUsuario;

    // 🔹 REGRA SIMPLIFICADA:
    if (idsAdm.includes(lvlUsu)) {
        // É admin → vê TODOS os registros
        filtraUsuario = {};
        // Mas só vê a lupa se for um dos 3 "super"
        podeVerLupa = idsSuper.includes(usuarioAtual);
    } else {
        // Usuário comum → vê SÓ OS PRÓPRIOS registros
        filtraUsuario = { saudecolab_saudecolabusuid: usuarioAtual };
        // Como a lista só tem fichas dele, libera a lupa
        podeVerLupa = true;
    }

    SaudecolabModel.find(filtraUsuario).then((saudecolab) =>{
        Usuario.find().then((usuario)=>{
            res.render('ferramentas/saudecolab/saudecolabLis', {
                saudecolabs: saudecolab,
                usuarios: usuario,
                flash,
                idUsu: usuarioAtual,
                // ✅ Passar como STRING para evitar conflito de tipo no Handlebars
                podeVerLupa: String(podeVerLupa) // "true" ou "false"
            });
        });
    }).catch((err) =>{
        console.error('💥 ERRO:', err);
        req.flash("error_message", "houve um erro ao listar Saudecolabs");
        res.redirect('admin/erro');
    });
},
    carregaSaudecolab(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        SaudecolabModel.find().then((saudecolab)=>{
            Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            console.log("Listagem Realizada! - PortalDoUsuario")
            res.render("ferramentas/saudecolab/saudecolabCad", {saudecolabs: saudecolab, usuarios: usuario, usuarioAtual})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })
    },
    
    carregaSaudecolabEdi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        SaudecolabModel.findById(req.params.id).then((saudecolab) =>{
            console.log(saudecolab)
                Estado.find().then((estado)=>{
                    Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            res.render('ferramentas/saudecolab/saudecolabEdi', {saudecolab, estados: estado, usuarios: usuario, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    
    cadastraSaudecolab(req,res){
        let resposta;
        let flash = new Resposta();
        let existe;
        let usuarioAtual = req.cookies['idUsu'];
        if ((""+usuarioAtual+"") == (""+req.body.saudecolabSaudecolabusuid+"")){
            SaudecolabModel.find({saudecolab_saudecolabusuid: req.body.saudecolabSaudecolabusuid}).then((resultado)=>{
                if (resultado.length == 0){
                    existe = "false";
                } else {
                    existe = "true";
                }
                if (existe == "true"){
                    flash.texto = "Já existe um registro para esse colaborador!";
                    flash.sucesso = "false";
                    this.listaSaudecolab(req,res, flash);
                } else {
                    let cadastro = saudecolabClass.saudecolabAdicionar(req,res);//variavel para armazenar a função que armazena o async
                
                    cadastro.then((result)=>{
                        resposta = true;
                    }).catch((err)=>{
                        resposta = err
                        console.log("ERRO:"+err)
                    }).finally(()=>{
                        if (resposta == true){
                            flash.texto = "Cadastro realizado com sucesso!";
                            flash.sucesso = "true";
                            this.listaSaudecolab(req,res, flash);
                        } else {
                            flash.texto = resposta;
                            flash.sucesso = "false";
                            this.listaSaudecolab(req,res, flash);
                        }
                    })
                }
            })
        }
    },
    
    atualizaSaudecolab(req,res){
        let resposta;
        try{
            saudecolabClass.saudecolabEditar(req,res).then((res)=>{
                console.log("Atualização Realizada! - PortalDoUsuario")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a saudecolab de listagem
                    console.log('verdadeiro')
                    this.listaSaudecolab(req,res)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
        }
    },
    
    deletaSaudecolab(req,res){
        SaudecolabModel.deleteOne({_id: req.params.id}).then(() =>{
            SaudecolabModel.find().then((saudecolab) =>{
                req.flash("success_message", "Saudecolab deletada!")
                res.render('ferramentas/saudecolab/saudecolabLis', {saudecolabs: saudecolab})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Saudecolabs")
                res.render('admin/erro')
            })
        })
    }
}