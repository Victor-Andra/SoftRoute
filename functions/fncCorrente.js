//Exports
//Constante do Mongo Db
const mongoose = require("mongoose")

//Corrente 
const correnteClass = require("../models/corrente")
const Corrente = mongoose.model("tb_corrente")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const convClass = require("../models/conv")


//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Conv = mongoose.model("tb_conv")




module.exports = {

    listaCorrente(req, res){
        corrente.find().then((corrente) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/corrente/correnteLis', {correntes: corrente})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    },

    carregaCorrente(req,res){
        Bene.find().then((bene)=>{
            console.log("Listagem Realizada de Ufs")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                        Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                                        Terapia.find().then((terapia)=>{
                                            console.log("Listagem Realizada de Convenios")
                                        
                    res.render("financeiro/corrente/correnteCad", {benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },


    cadastraCorrente(req,res){
        let cadastro = correnteClass.correnteAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro == true){
            console.log('verdadeiro')
            res.render('financeiro/corrente/correnteCad');
        } else {
            console.log(cadastro)
            res.render('admin/erro');
        }
    },

    deletaCorrente(req, res){
        Corrente.deleteOne({_id: req.params.id}).then(() =>{
            Corrente.find().then((corrente) =>{
                req.flash("success_message", "Corrente deletada!")
                res.render('financeiro/corrente/correnteLis', {correntes: corrente})
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },


    atualizaCorrente(req, res){
        let resposta;
        try{
            correnteClass.correnteEditar(req,res).then((res)=>{
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
                    //Volta para a corrente de listagem
                    Corrente.find().then((corrente) =>{
                        console.log("Listagem Realizada!")
                        res.render('financeiro/corrente/correnteLis', {correntes: corrente})
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

    carregaCorrenteEdi(req, res){
        Corrente.findById(req.params.id).then((corrente) =>{
            res.render('financeiro/corrente/correntEdi', corrente)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }


}