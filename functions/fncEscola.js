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

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")


module.exports = {
    listaEscola(req,res,resposta){
        let flash = new Resposta()
        Escola.find().then((escola)=>{
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Ufs")
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    console.log("Listagem Realizada de beneficiarios")
                        if(resposta.sucesso == ""){
                            console.log(' objeto vazio');
                            flash.texto = ""
                            flash.sucesso = ""
                        } else {
                            console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                            flash.texto = resposta.texto
                            flash.sucesso = resposta.sucesso
                        }
                        res.render("beneficiario/escola/escolaLis", {escolas: escola, estados: estado, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    carregaEscola(req,res){
        Escola.find().then((escola)=>{
            console.log("Listagem Realizada de escolas!")
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    console.log("Listagem Realizada de beneficiarios")
                        res.render("beneficiario/escola/escolaCad", {escolas: escola, benes: bene})
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
            res.render('beneficiario/escola/escolaEdi', {escola, estados: estado, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEscola(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        //let cadastro = escolaClass.escolaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        escolaClass.escolaAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEscola(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaEscola(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            escolaClass.escolaEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaEscola(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaEscola(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
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