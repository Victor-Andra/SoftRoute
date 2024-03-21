//Exports
const mongoose = require("mongoose")

//Excecaotera
//As classe tem que ser declaradas antes das tabelas
const excecaoteraClass = require("../models/excecaotera")
const Excecaotera = mongoose.model("tb_excecaotera")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const respostaClass = require("../models/resposta")

//Tabelas Extrangeiras

const Resposta = mongoose.model("tb_resposta")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")


//Funções auxiliares


module.exports = {
    listaExcecaotera(req, res, resposta){
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Excecaotera.find().then((excecaotera) =>{
            excecaotera.forEach((b)=>{
                //Formatação da Exibição da Data de cadastro
                let datacad = new Date(b.excecaotera_datacad)
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
                
                dataedi = new Date(b.excecaotera_dataedi)
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
           
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                // Adicionando a propriedade countSessaos a cada bene
                
                bene.forEach((b) => {
                    b.countExcecaoteras = excecaotera.filter((s) => s.excecaotera_beneid.toString() === b._id.toString()).length;
                });

                excecaotera.forEach((s) => {
                    console.log("s: " + s);
                    bene.forEach((b) => {
                        if (("" + b._id + "") == ("" + s.excecaotera_beneid + "")) {
                            console.log("b.bene_nome: " + b.bene_nome);
                        }
                    });
                });
                    Usuario.find().then((usuario)=>{
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                            Conv.find().sort({conv_nome: 1}).then((conv)=>{
                                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                                res.render('beneficiario/excecaotera/excecaoteraLis', {excecaoteras: excecaotera, usuarios: usuario, terapias: terapia, convs: conv, benes: bene, perfilAtual, flash})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    carregaExcecaotera(req,res){
        let excecaotera = new Array();
        Excecaotera.find().then((excecaotera) =>{
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Conv.find().then((conv)=>{
                                Terapia.find({terapia_status:"Ativo"}).then((terapia)=>{
                                    terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                                        Usuario.find().then((usuario)=>{
                                            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b", usuario_status:"Ativo"}).then((terapeuta)=>{
                                                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                res.render("beneficiario/excecaotera/excecaoteraCad", {excecaoteras: excecaotera, usuarios: usuario, terapias: terapia, terapeutas: terapeuta, convs: conv, benes: bene})
        })})})})})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar exceção")
        res.redirect('admin/erro')
        })
    },
   
    carregaExcecaoteraEdi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        //let excecaotera = new Array();
        Excecaotera.findOne({_id : req.params.id}).then((excecaotera)=>{
            console.log(excecaotera);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Conv.find().then((conv)=>{
                        Terapia.find({terapia_status:"Ativo"}).then((terapia)=>{
                            terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                                Usuario.find().then((usuario)=>{
                                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b", usuario_status:"Ativo"}).then((terapeuta)=>{
                                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome 
                                        res.render("beneficiario/excecaotera/excecaoteraEdi", {excecaotera, usuarios: usuario, terapias: terapia, terapeutas: terapeuta, convs: conv, benes: bene,usuarioAtual, perfilAtual})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar exceção")
            res.redirect('admin/erro')
        })
    },

    cadastraExcecaotera(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        excecaoteraClass.excecaoteraAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "ATA cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaExcecaotera(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaExcecaotera(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            excecaoteraClass.excecaoteraEditar(req,res).then((res)=>{
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
                    this.listaExcecaotera(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaExcecaotera(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaExcecaotera(req,res){
        let resposta;
        let flash = new Resposta()
        Excecaotera.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar as Exceções")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Exceção deletada!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar a ATA";
                flash.sucesso = "false";
            }
            this.listaExcecaotera(req,res, Exceção)
        })
    }


}