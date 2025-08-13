//Exports
const mongoose = require("mongoose")

//usupermiss
const usupermisClass = require("../models/usupermis")
const Usupermis = mongoose.model("tb_usupermis")

//Classes Extrangeiras
const estadoClass = require("../models/estado")

//Tabelas Extrangeiras
const Estado = mongoose.model("tb_estado")


module.exports = {
    listaUsupermis(req,res){
        console.log('listando usupermiss')
        Usupermis.find().then((usupermis) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/usupermis/usupermisLis', {usupermiss: usupermis})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usupermiss")
            res.redirect('admin/erro')
        })

    },

    carregaUsupermis(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/usupermis/usupermisCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usupermiss")
            res.redirect('admin/erro')
        })

    },


    carregaUsupermisEdi(req,res){
        Usupermis.findById(req.params.id).then((usupermis) =>{
            console.log(usupermis)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
            res.render('ferramentas/usupermis/usupermisEdi', {usupermis, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraUsupermis(req,res){
        let resposta
        let cadastro = usupermisClass.usupermisAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaUsupermis(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    atualizaUsupermis(req,res){
        let resposta;
        try{
            usupermisClass.usupermisEditar(req,res).then((res)=>{
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
                    //Volta para a usupermis de listagem
                    console.log('verdadeiro')
                    this.listaUsupermis(req,res)
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


    deletaUsupermis(req,res){
        Usupermis.deleteOne({_id: req.params.id}).then(() =>{
            Usupermis.find().then((usupermis) =>{
                req.flash("success_message", "Usupermis deletada!")
                res.render('ferramentas/usupermis/usupermisLis', {usupermiss: usupermis})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Usupermiss")
                res.render('admin/erro')
            })
        })
    }


}