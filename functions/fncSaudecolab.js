//Exports
const mongoose = require("mongoose")

//saudecolabs
const saudecolabClass = require("../models/saudecolab")
const Saudecolab = mongoose.model("tb_saudecolab")


//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
const Estado = mongoose.model("tb_estado")
const Usuario = mongoose.model("tb_usuario")


module.exports = {
    listaSaudecolab(req,res){
        console.log('listando saudecolabs')
        Saudecolab.find().then((saudecolab) =>{
            Usuario.find().then((usuario)=>{
                console.log("Listagem Realizada!")
                res.render('ferramentas/saudecolab/saudecolabLis', {saudecolabs: saudecolab, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })

    },

    carregaSaudecolab(req,res){
        Saudecolab.find().then((saudecolab)=>{
            Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            console.log("Listagem Realizada!")
            res.render("ferramentas/saudecolab/saudecolabCad", {saudecolabs: saudecolab, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })

    },


    carregaSaudecolabEdi(req,res){
        Saudecolab.findById(req.params.id).then((saudecolab) =>{
            console.log(saudecolab)
                Estado.find().then((estado)=>{
                    Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            res.render('ferramentas/saudecolab/saudecolabEdi', {saudecolab, estados: estado, usuarios: usuario})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraSaudecolab(req,res){
        let resposta
        let cadastro = saudecolabClass.saudecolabAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaSaudecolab(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    atualizaSaudecolab(req,res){
        let resposta;
        try{
            saudecolabClass.saudecolabEditar(req,res).then((res)=>{
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
        Saudecolab.deleteOne({_id: req.params.id}).then(() =>{
            Saudecolab.find().then((saudecolab) =>{
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