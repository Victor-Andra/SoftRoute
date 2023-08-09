//Exports
const mongoose = require("mongoose")


//usuarios
const usuarioClass = require("../models/usuario")
const Usuario = mongoose.model("tb_usuario")

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const perfilClass = require("../models/perfil")
const funcaoClass = require("../models/funcao")
const especializacaoClass = require("../models/especializacao")


//Tabelas extrangeiras   
const Estado = mongoose.model("tb_estado")
const Perfil = mongoose.model("tb_perfil")
const Funcao = mongoose.model("tb_funcao")
const Especialidade = mongoose.model("tb_especialidade")
const Especializacao = mongoose.model("tb_especializacao")

module.exports = {
    listaUsuario(req,res){
        Usuario.find().then((usuario) =>{
            //console.log(usuario)
            Perfil.find().then((perfil)=>{
                Funcao.find().then((funcao) =>{
                    res.render('ferramentas/usuario/usuarioLis', {usuarios: usuario, funcaos: funcao, perfils: perfil,})
                })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usuarios")
            res.redirect('admin/erro')
        })
    },
    carregaUsuario(req,res){
        Usuario.find().then((usuario) =>{
            console.log("Listagem Realizada!")
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Ufs!")
                        Perfil.find().then((perfil)=>{
                            console.log("Listagem Realizada de Ufs!")
                                Funcao.find().then((funcao)=>{
                                    console.log("Listagem Realizada de Ufs!")
                                        Especialidade.find().then((especialidade)=>{
                                            console.log("Listagem Realizada de Especialidade!")
                                                Especializacao.find().then((especializacao)=>{
                                                    console.log("Listagem Realizada de Especializacao!")
            res.render("ferramentas/usuario/usuarioCad", {usuarios: usuario, estados: estado, perfils: perfil, especialidades: especialidade, especializacaos: especializacao, funcaos: funcao})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usuarios")
            res.redirect('admin/erro')
        })
    },
    carregaUsuarioEdi(req,res){
        Usuario.findById(req.params.id).then((usuario) =>{
            console.log("Listagem Realizada!")
            console.log("usuario:")
            console.log(usuario)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Ufs!")
                        Perfil.find().then((perfil)=>{
                            console.log("Listagem Realizada de Ufs!")
                                Funcao.find().then((funcao)=>{
                                    console.log("Listagem Realizada de Ufs!")
                                        Especialidade.find().then((especialidade)=>{//Graduação
                                            console.log("Listagem Realizada de Ufs!")
                                            Especializacao.find().then((especializacao)=>{
                                                console.log("Listagem Realizada de Especializacao!")
            res.render('ferramentas/usuario/usuarioEdi', {usuario, estados: estado, perfils: perfil, especialidades: especialidade, especializacaos: especializacao, funcaos: funcao})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraUsuario(req,res){
        let cadastro = usuarioClass.usuarioAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            this.listaUsuario(req,res)
        } else {
            res.render('admin/erro')
        }
    },
    atualizaUsuario(req,res){
        let resposta;
        try{
            usuarioClass.usuarioEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a usuario de listagem
                    this.listaUsuario(req,res);
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
    carregaMudarsenha(req,res){/*
        Usuario.findById(req.params.id).then((usuario) =>{
                        Perfil.find().then((perfil)=>{
            res.render('ferramentas/usuario/mudarSenha', {usuario, perfils: perfil})
        })}.catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")*/
            res.render('admin/erro')
        //})
    },
    carregaResetarchave(req,res){
        Usuario.findById(req.params.id).then((usuario) =>{
                        Perfil.find().then((perfil)=>{
                                Funcao.find().then((funcao)=>{
            res.render('ferramentas/usuario/resetarChave', {usuario, perfils: perfil, funcoes: funcao})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao carregar o formulário para resetar a chave!")
            res.render('admin/erro')
        })
    },

    carregaCadastrarchave(req,res){
        Usuario.findById(req.params.id).then((usuario) =>{
            Perfil.find().then((perfil)=>{
                    Funcao.find().then((funcao)=>{
        res.render('ferramentas/usuario/cadastrarChave', {usuario, perfils: perfil, funcoes: funcao})
        })})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao carregar o formulário para resetar a chave!")
        res.render('admin/erro')
        })
    },

    mudarsenha(req,res){
        let resposta;
        try{
            usuarioClass.usuarioEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a usuario de listagem
                    this.listaUsuario(req,res);
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
    deletaUsuario(req, res){
        Usuario.deleteOne({_id: req.params.id}).then(() =>{
            Usuario.find().then((usuario) =>{
                req.flash("success_message", "Usuario deletada!")
                res.render('ferramentas/usuario/usuarioLis', {usuarios: usuario})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Usuarios")
                res.render('admin/erro')
            })
        })
    },
    getNivelUsuario(req,res){
        let usuPerfil;
        let lvl;
        Usuario.findOne({usuario_email: req.body.email, usuario_senha: req.body.senha}).then((usu)=>{
            usuPerfil = usu.usuario_perfilid
            switch (usuPerfil){
                case "62421801a12aa557219a0fb9":
                    lvl = 0;
                    break;
                case "62421857a12aa557219a0fc1":
                    lvl = 1;
                    break;
                case "624218f5a12aa557219a0fd0":
                    lvl = 2;
                    break;
                case "62421903a12aa557219a0fd3":
                    lvl = 3;
                    break;
                case "6242190fa12aa557219a0fd6":
                    lvl = 4;
                    break;
                //case "6242191fa12aa557219a0fd9":
                //    break;
            }
            console.log("LVL: "+lvl)

            return lvl;
        }).catch((err) =>{
            console.log(err)
        })
    }
}