//Exports
const mongoose = require("mongoose")

//Perfil
const perfilClass = require("../models/perfil")
const Perfil = mongoose.model("tb_perfil")




module.exports = {
    listaPerfil(req,res){
        console.log('listando perfils')
        Perfil.find().then((perfil) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/perfil/perfilLis', {perfils: perfil})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Perfils")
            res.redirect('admin/erro')
        })

    },

    carregaPerfil(req,res){
        Perfil.find().then((perfil)=>{
            console.log("Listagem de perfis realizada!")
            res.render("ferramentas/perfil/perfilCad", {perfils: perfil})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Perfils")
            res.redirect('admin/erro')
        })

    },


    carregaPerfilEdi(req,res){
        Perfil.findById(req.params.id).then((perfil) =>{
            console.log(perfil)
                 res.render('ferramentas/perfil/perfilEdi', {perfil})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraPerfil(req,res){
        let cadastro = perfilClass.perfilAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/perfil/perfilCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaPerfil(req,res){
        let resposta;
        try{
            perfilClass.perfilEditar(req,res).then((res)=>{
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
                    //Volta para a perfil de listagem
                    Perfil.find().then((perfil) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/perfil/perfilLis', {perfils: perfil})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
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


    deletaPerfil(req,res){
        Perfil.deleteOne({_id: req.params.id}).then(() =>{
            Perfil.find().then((perfil) =>{
                req.flash("success_message", "Perfil deletada!")
                res.render('ferramentas/perfil/perfilLis', {perfils: perfil})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Perfils")
                res.render('admin/erro')
            })
        })
    }


}