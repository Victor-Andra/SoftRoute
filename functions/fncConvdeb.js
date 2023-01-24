//Exports
const mongoose = require("mongoose")

//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const convdebClass = require("../models/convDeb")
const Convdeb = mongoose.model("tb_convdeb")

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
    listaConvdeb(req,res){
        let convdebs = new Array();
        Convdeb.find().then((convdeb) =>{
        console.log("Listagem Realizada ConvDeb!")
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                console.log("Listagem Realizada Terapia!")
                        Conv.find().then((conv)=>{
                            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                            console.log("Listagem Convênios!") 
            res.render('convenio/convdeb/convDebLis', {convdebs: convdeb, terapias: terapia, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            //req.flash("error_message", "houve um erro ao listar Convdebs")
            res.redirect('admin/erro')
        })
    },
    carregaConvdeb(req,res){
        Conv.find().then((conv)=>{
            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
            console.log("Listagem Realizada de Convênios")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                        console.log("Listagem Realizada de Terapias")
            res.render("convenio/convdeb/convDebCad", {convs: conv, terapias: terapia})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaConvdebEdi(req,res){
        Convdeb.findById(req.params.id).then((convdeb) =>{
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                    Conv.find().then((conv)=>{
                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                            res.render('convenio/convdeb/convDebEdi', {convdeb, terapias: terapia, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraConvdeb(req,res){
        let cadastro = convdebClass.convdebAdicionar(req,res);//variavel para armazenar a função que armazena o async
        if(cadastro){
            console.log('verdadeiro')
            this.carregaConvdeb(req,res)
        } else {
            console.log("error")
            console.log(cadastro)
            res.render('admin/erro');
        }
    },
    editarConvdev(req,res){
        let resposta;
        convdebClass.convdebEditar(req,res).then((res)=>{
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
                this.carregaConvdeb(req,res);
            }else{
                //passar classe de erro
                console.log("error")
                console.log(resposta)
                res.render('admin/erro')
            }
        })
    },
    deletaConvdeb(req,res){
        Convdeb.deleteOne({_id: req.params.id}).then(() =>{
            console.log("Convdeb deletada!");
            this.listaConvdeb(req,res);
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaTodosConvdeb(req,res){
        
    }
}