//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Ajuda
const ajudaClass = require("../models/ajuda")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabela Ajuda
const Ajuda = mongoose.model("tb_ajuda")

//Tabelas Extrangeiras
const Usuario = mongoose.model("tb_usuario")



//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaAjuda(req, res, resposta){
        let flash = new Resposta()
        let resultado;
        let ajuda = [];
        console.log('listando Ajuda')
        Ajuda.find().then((ajuda) =>{
            ajuda.sort((a,b) => ((a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena pela pergunta
                Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    if(resposta.sucesso == ""){
                        //console.log(' objeto vazio');
                        flash.texto = "";
                        flash.sucesso = "";
                    } else {
                        //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                        flash.texto = resposta.texto;
                        flash.sucesso = resposta.sucesso;
                    }
                    res.render('area/ajuda/ajudaLis', {ajudas: ajuda, usuarios: usuario, flash})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Ajuda")
            res.redirect('admin/erro')
        })
    },
   
    carregaAjudacad(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Ajuda.find().then((ajuda) =>{
            ajuda.sort((a,b) => ((a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena pela pergunta
                Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    res.render("area/ajuda/ajudaCad", {usuarios: usuario, ajudas: ajuda, usuarioAtual})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Ajuda")
            res.redirect('admin/erro')
        })

    },
 
    carregaAjudaedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Ajuda.findById(req.params.id).then((ajuda) =>{console.log("ID: "+ajuda._id)
            ajuda.sort((a,b) => ((a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.ajuda_pergunta.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena pela pergunta
                Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    res.render("area/ajuda/ajudaEdi", {ajudas: ajuda, usuarios: usuario, usuarioAtual})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraAjuda(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        ajudaClass.ajudaAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Ajuda cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaAjuda(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaAjuda(req,res){
        let resultado
        let flash = new Resposta()
        try{
            ajudaClass.ajudaEditar(req,res).then((res)=>{
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
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaAjuda(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaAjuda(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaAjuda(req,res){
        let resposta;
        let flash = new Resposta()
        Ajuda.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar as Ajudas")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Ajuda deletada!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar ajuda";
                flash.sucesso = "false";
            }
            this.listaAjuda(req,res, resposta)
        })
    }
}