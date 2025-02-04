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
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaSaudecolab(req,res, resposta){
        let flash = Resposta();
        flash = resposta;
        console.log('listando saudecolabs')
        let filtraUsuario;
        let usuarioAtual = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        if ("62421801a12aa557219a0fb9,62421857a12aa557219a0fc1,6242190fa12aa557219a0fd6,644742e378166939169f82a1,644743aa78166939169f8486".includes(lvlUsu)){
            filtraUsuario = {};
        } else {
            filtraUsuario = {saudecolab_saudecolabusuid : usuarioAtual};
        }
        Saudecolab.find().then((saudecolab) =>{
            Usuario.find(filtraUsuario).then((usuario)=>{
                console.log("Listagem Realizada!")
                res.render('ferramentas/saudecolab/saudecolabLis', {saudecolabs: saudecolab, usuarios: usuario, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })

    },

    carregaSaudecolab(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Saudecolab.find().then((saudecolab)=>{
            Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            console.log("Listagem Realizada!")
            res.render("ferramentas/saudecolab/saudecolabCad", {saudecolabs: saudecolab, usuarios: usuario, usuarioAtual})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })

    },


    carregaSaudecolabEdi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Saudecolab.findById(req.params.id).then((saudecolab) =>{
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
        let flash = Resposta();
        let existe;
        
        Saudecolab.find({saudecolab_saudecolabusuid: req.body.saudecolabSaudecolabusuid}).then((resultado)=>{
            if (resultado.length == 0){
                existe = "false";
            } else {
                existe = "true";
            }
            console.log("existe: "+existe);
            console.log("resultado.length: "+resultado.length);
            if (existe == "true"){
                console.log("WHAT?")
                flash.texto = "Já existe um registro para esse colaborador!";
                flash.sucesso = "false";
                this.listaSaudecolab(req,res, flash);
            } else {
                console.log("SHIT?")
                let cadastro = saudecolabClass.saudecolabAdicionar(req,res);//variavel para armazenar a função que armazena o async
            
                cadastro.then((result)=>{
                    resposta = true;
                }).catch((err)=>{
                    resposta = err
                    console.log("ERRO:"+err)
                }).finally(()=>{
                    if (resposta == true){
                        console.log('verdadeiro')
                        flash.texto = "Cadastro realizado com sucesso!";
                        flash.sucesso = "true";
                        this.listaSaudecolab(req,res, flash);
                    } else {
                        console.log('falso')
                        flash.texto = resposta;
                        flash.sucesso = "false";
                        this.listaSaudecolab(req,res, flash);
                    }
                })
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