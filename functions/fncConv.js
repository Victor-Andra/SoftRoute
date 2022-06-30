//Exports
const mongoose = require("mongoose")

//convenio
const convClass = require("../models/conv")
const Conv = mongoose.model("tb_conv")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
const Usuario = mongoose.model("tb_usuario")
const Estado = mongoose.model("tb_estado")


module.exports = {
    carregaConv(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("convenio/conv/convCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })
    },

    cadastraConv(req,res){
        let cadastro = convClass.convAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            res.render('convenio/conv/convCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    deletaConv(req, res){
        Conv.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv) =>{
                req.flash("success_message", "Conv deletada!")
                res.render('convenio/conv/convLis', {convs: conv})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Convs")
                res.render('admin/erro')
            })
        })
    },

    atualizaConv(req, res){
        let resposta;
        try{
            convClass.convEditar(req,res).then((res)=>{
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
                    //Volta para a conv de listagem
                    Conv.find().then((conv) =>{
                        console.log("Listagem Realizada!")
                        res.render('convenio/conv/convLis', {convs: conv})
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

    carregaConvEdi(req, res){
        Conv.findById(req.params.id).then((conv) =>{
            console.log(conv)
            res.render('convenio/conv/convEdi', conv)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaConv(req, res){
        console.log('listando convs')
        let qtregs;
        Conv.find().then((conv) =>{
            console.log("Listagem Realizada!")
            convClass.qtregs(req,res).then((res)=>{
                qtregs = res;
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Convs")
                res.redirect('admin/erro')
            }).finally(()=>{
                res.render('convenio/conv/convLis', {convs: conv, qtregs})
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })     
      
    }
}