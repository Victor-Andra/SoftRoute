//Exports
const mongoose = require("mongoose")

//estados e unidades federativas    
const Estado = mongoose.model("tb_estado")
const estadoClass = require("../models/estado")


module.exports = {
    listaEstado(req,res){
        console.log('listando estados')
        Estado.find().then((estado) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/estado/estadoLis', {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Estados")
            res.redirect('admin/erro')
        })

    },

    carregaEstado(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/estado/estadoCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Estados")
            res.redirect('admin/erro')
        })

    },


    carregaEstadoEdi(req,res){
        Estado.findOne({_id:req.params.id}).then((estado) =>{
            console.log(estado)
              
            res.render('ferramentas/estado/estadoEdi', { estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEstado(req,res){
        let cadastro = estadoClass.estadoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/estado/estadoCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaEstado(req,res){
        let resposta;
        try{
            estadoClass.estadoEditar(req,res).then((res)=>{
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
                    //Volta para a estado de listagem
                    Estado.find().then((estado) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/estado/estadoLis', {estados: estado})
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


    deletaEstado(req,res){
        Estado.deleteOne({_id: req.params.id}).then(() =>{
            Estado.find().then((estado) =>{
                req.flash("success_message", "Estado deletada!")
                res.render('ferramentas/estado/estadoLis', {estados: estado})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Estados")
                res.render('admin/erro')
            })
        })
    }


}