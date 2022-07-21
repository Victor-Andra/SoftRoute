//Exports
const mongoose = require("mongoose")

//Escola
const escolaClass = require("../models/escola")
const Escola = mongoose.model("tb_escola")

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const beneClass = require("../models/bene")

//tabelas Extrangeira
const Estado = mongoose.model("tb_estado")
const Bene = mongoose.model("tb_bene")




module.exports = {
    listaEscola(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs")
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                console.log("Listagem Realizada de beneficiarios")
                    res.render("beneficiario/escola/escolaLis", {estados: estado, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    carregaEscola(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de escolas!")
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    console.log("Listagem Realizada de beneficiarios")
                        res.render("beneficiario/escola/escolaCad", {estados: estado, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },


    carregaEscolaEdi(req,res){
        Escola.findById(req.params.id).then((escola) =>{
            console.log(escola)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
            res.render('beneficiario/escola/escolaEdi', {escolas: escola, estados: estado, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEscola(req,res){
        let cadastro = escolaClass.escolaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('beneficiario/escola/escolaCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaEscola(req,res){
        let resposta;
        try{
            escolaClass.escolaEditar(req,res).then((res)=>{
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
                    //Volta para a escola de listagem
                    Escola.find().then((escola) =>{
                        console.log("Listagem Realizada!")
                        res.render('beneficiario/escola/escolaLis', {escolas: escola})
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


    deletaEscola(req,res){
        Escola.deleteOne({_id: req.params.id}).then(() =>{
            Escola.find().then((escola) =>{
                req.flash("success_message", "Escola deletada!")
                res.render('beneficiario/escola/escolaLis', {escolas: escola})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Escolas")
                res.render('admin/erro')
            })
        })
    }


}