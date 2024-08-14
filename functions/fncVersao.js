//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Analise funcional do comportamento
const versaoClass = require("../models/versao")


//Classes Extrangeiras
const usuarioClass = require("../models/usuario")


//Tabela Versao
const Versao = mongoose.model("tb_versao")

//Tabelas Extrangeiras
const Resposta = mongoose.model("tb_resposta")
const Usuario = mongoose.model("tb_usuario")



//Funções auxiliares


module.exports = {
    listaVersao(req, res, resposta){
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Versao.find().then((versao) =>{

            versao.forEach((b)=>{
                let datacad = new Date(b.versao_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                dataedi = new Date(b.ata_dataedi)
                mes = (dataedi.getMonth()+1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(dataedi.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;

                
            })
           
           
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        
                        res.render('area/escalas/versao/versaoLis', {versaos: versao, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },



    carregaVersao(req,res){
        
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    
                            res.render("area/escalas/versao/versaoCad", {Benes: bene, Terapeutas: terapeuta})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },

  
    
    carregaVersaoEdi(req,res){
        Versao.findOne({_id : req.params.id}).then((versao)=>{
           
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                  
                                res.render("area/escalas/versao/versaoEdi", {versao, Terapias: terapia, Terapeutas: terapeuta, Benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraVersao(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        versaoClass.versaoAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Versão cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaVersao(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaVersao(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            versaoClass.versaoEditar(req,res).then((res)=>{
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
                    this.listaVersao(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaVersao(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaVersao(req,res){
        let resposta;
        let flash = new Resposta()
        Versao.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os ATEC's")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "ATEC deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar a ATEC";
                flash.sucesso = "false";
            }
            this.listaVersao(req,res, resposta)
        })
    }

}