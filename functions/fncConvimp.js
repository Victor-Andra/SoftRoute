//Exports
const mongoose = require("mongoose")

//Créditos de planos de saúde e particular
const convimpClass = require("../models/convImp")
const Convimp = mongoose.model("tb_convimp")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const convClass = require("../models/conv")
const impostoClass = require("../models/imposto")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")
const Conv = mongoose.model("tb_conv")
const Imposto = mongoose.model("tb_imposto")


module.exports = {
    listaConvimp(req,res){
        let convimps = new Array();
        Convimp.find().then((convimp) =>{
        console.log("Listagem Crédito de Convênios!")
                console.log("Listagem Terapias!")      
                    Conv.find().then((conv)=>{
                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                        console.log("Listagem Convênios!")
                                Imposto.find().then((imposto)=>{
                                    imposto.sort((a,b) => (a.imposto_nome > b.imposto_nome) ? 1 : ((b.imposto_nome > a.imposto_nome) ? -1 : 0));//Ordena os impostos por nome .        
                                    console.log("Listagem Realizada de impostos")  
                                        res.render('convenio/convimp/convImpLis', {convimps: convimp, impostos: imposto, convs: conv})
            })})}).catch((err) =>{
            console.log(err)
            //req.flash("error_message", "houve um erro ao listar Convimps")
            res.redirect('admin/erro')
        })
    },
    carregaConvimp(req,res){
        Conv.find().then((conv)=>{
            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
            console.log("Listagem Realizada de Convênios")
                Imposto.find().then((imposto)=>{
                    imposto.sort((a,b) => (a.imposto_nome > b.imposto_nome) ? 1 : ((b.imposto_nome > a.imposto_nome) ? -1 : 0));//Ordena os impostos por nome .        
                    console.log("Listagem Realizada de impostos")
                            res.render("convenio/convimp/convImpCad", {convs: conv, impostos: imposto})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaConvimpEdi(req,res){
        Convimp.findById(req.params.id).then((convimp) =>{
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome .
                Imposto.find().then((imposto)=>{
                    imposto.sort((a,b) => (a.imposto_nome > b.imposto_nome) ? 1 : ((b.imposto_nome > a.imposto_nome) ? -1 : 0));//Ordena os impostos por nome .
                        console.log("Listagem Realizada de impostos")
                                res.render('convenio/convimp/convImpEdi', {convimp, convs: conv, impostos: imposto})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraConvimp(req,res){
        let retorno
        let cadastro = convimpClass.convimpAdicionar(req,res);//variavel para armazenar a função que armazena o async
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            if(retorno == true){
                console.log('verdadeiro')
                this.listaConvimp(req,res)
            } else {
                console.log(cadastro)
                res.render('admin/erro');
            }
        })
    },
    editarConvimp(req,res){
        let resposta;
        convimpClass.convimpEditar(req,res).then((res)=>{
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
                //Volta para a convimp de listagem
                console.log("Abrir Lista")
                this.listaConvimp(req,res);
            }else{
                //passar classe de erro
                console.log("error")
                console.log(resposta)
                res.render('admin/erro')
            }
        })
    },
    deletaConvimp(req,res){
        Convimp.deleteOne({_id: req.params.id}).then(() =>{
            this.listaConvimp(req,res);
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}