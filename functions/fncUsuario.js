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
            console.log(usuario)
            Funcao.find().then((funcao) =>{
                res.render('ferramentas/usuario/usuarioLis', {usuarios: usuario, funcaos: funcao})
            })}).catch((err) =>{
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
                                                Especializacao.then((especializacao)=>{
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
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Ufs!")
                        Perfil.find().then((perfil)=>{
                            console.log("Listagem Realizada de Ufs!")
                                Funcao.find().then((funcao)=>{
                                    console.log("Listagem Realizada de Ufs!")
                                        Especialidade.find().then((especialidade)=>{
                                            console.log("Listagem Realizada de Ufs!")
                                            Especializacao.then((especializacao)=>{
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
    }


}