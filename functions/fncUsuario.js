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

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

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
    carregaMudarsenha(req,res){
       Usuario.find().then((usuario)=>{
            res.render("ferramentas/usuario/mudarSenha", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o mudar senha")
            res.redirect('admin/erro')
        })  
    },
    carregaEsqueciMinhasenha(req,res){
        Usuario.find().then((usuario)=>{
                usuario.sort((a,b) => ((a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena  por nome
             res.render("ferramentas/usuario/esqueciMinhaSenha", {usuarios: usuario})
        }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o mudar senha")
             res.redirect('admin/erro')
        })  
    },
    definirSenha(req,res){
        let flash = new Resposta();
        let resposta = false;
        usuarioClass.usuarioDefinirSenha(req,res).then((retorno)=>{
            if (retorno == "true"){
                resposta = true;
            } else {
                resposta = retorno;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Alterar Senha")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Senha alterada com sucesso!";
                flash.sucesso = "true";
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Erro ao alterar senha! "+resposta;
                flash.sucesso = "false";
                res.render('admin/branco', {flash});
            }
        })
    },
    mudarSenha(req,res){
        let flash = new Resposta();
        let resposta = false;
        usuarioClass.usuarioMudarSenha(req,res).then((ok)=>{
            if (ok == "true"){
                resposta = true;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Alterar Senha")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Senha alterada com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                res.clearCookie('lvlUsu', { path: '/' })
                res.clearCookie('idUsu', { path: '/' })
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Erro ao alterar senha!"
                flash.sucesso = "false"
                res.render('admin/branco', {flash});
            }
        })
    },
    carregaResetarchave(req,res){
        Usuario.find().then((usuario)=>{
            usuario.sort((a,b) => ((a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena  por nome
            res.render("ferramentas/usuario/resetarChave", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o resetar chave")
            res.redirect('admin/erro')
        })
    },
    resetarChave(req,res){
        let flash = new Resposta();
        let resposta = false;
        usuarioClass.usuarioDeletarPalavraChave(req,res).then((ok)=>{
            if (ok == "true"){
                resposta = true;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o remover chave")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Chave removida com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Chave removida com sucesso!";
                flash.sucesso = "false"
                res.render('admin/branco', {flash});
                //CORRIGIR ERRO BIZONHO QUE TA RETORNANDO FALSE MEMSMO TENDO SALVO. MENSAGEM ERRADA!!!!!!!!!
                /*
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                */
            }
        })
    },
    carregaCadastrarchave(req,res){
        Usuario.find().then((usuario)=>{
            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o Usuário por nome 
            res.render("ferramentas/usuario/cadastrarChave", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Cadastrar chave")
            res.redirect('admin/erro')
        })
    },

    cadastrarchave(req,res){
        let flash = new Resposta();
        let resposta = false;
        usuarioClass.usuarioCadastrarPalavraChave(req,res).then((ok)=>{
            if (ok == "true"){
                resposta = true;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Cadastrar chave")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Palavra Chave cadastrada com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Erro ao cadastrar chave!"
                flash.sucesso = "false"
                res.render('admin/branco', {flash});
            }
        })
    },

    /*mudarsenha(req,res){
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
    */
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
    },
    carregaMudarNomeTerapeuta(req,res){
        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
            usuario.sort((a,b) => ((a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            res.render('ferramentas/usuario/mudarNomeTerapeuta', {usuarios: usuario})
        })
    },
    mudarNomeTerapeuta(req,res){
        let flash = new Resposta();
        usuarioClass.mudarNome(req,res).then((res)=>{
            console.log("res")
        });
        let resultado = "true"
        console.log("resultado:"+resultado)
        if (resultado == "true"){
            flash.texto = "Nome alterado com sucesso";
            flash.sucesso = "true";
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
                    usuario.sort((a,b) => ((a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    res.render('ferramentas/usuario/mudarNomeTerapeuta', {usuarios: usuario, flash})
            })})
        } else {
            console.log(resultado)
            flash.texto = resultado;
            flash.sucesso = "false";
            req.flash("error_message", "Houve um erro ao mudar o nome")
            res.render('admin/erro', {flash})
        }
    }
}