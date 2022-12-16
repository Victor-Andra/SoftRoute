//Exports
const mongoose = require("mongoose")

//Créditos de planos de saúde e particular
const convcreClass = require("../models/convCre")
const Convcre = mongoose.model("tb_convcre")

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
    listaConvcre(req,res){
        let convcres = new Array();
        Convcre.find().then((convcre) =>{
        console.log("Listagem Crédito de Convênios!")
            Terapia.find().then((terapia)=>{
            console.log("Listagem Terapias!")      
                Conv.find().then((conv)=>{
                console.log("Listagem Convênios!")      
                res.render('convenio/convcre/convCreLis', {convcres: convcre, terapias: terapia, convs: conv})
            })})}).catch((err) =>{
            console.log(err)
            //req.flash("error_message", "houve um erro ao listar Convcres")
            res.redirect('admin/erro')
        })
    },
    carregaConvcre(req,res){
        Conv.find().then((conv)=>{
            console.log("Listagem Realizada de Convênios")
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de Terapias")
                    res.render("convenio/convcre/convCreCad", {convs: conv, terapias: terapia})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaConvcreEdi(req,res){
        Convcre.findById(req.params.id).then((convcre) =>{
            Conv.find().then((conv)=>{
                console.log("Listagem Realizada de Convênios")
                    Terapia.find().then((terapia)=>{
                        console.log("Listagem Realizada de Terapias")
                        res.render('convenio/convcre/convCreEdi', {convcre, convs: conv, terapias: terapia})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraConvcre(req,res){
        let retorno
        let cadastro = convcreClass.convcreAdicionar(req,res);//variavel para armazenar a função que armazena o async
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            if(retorno == true){
                console.log('verdadeiro')
                this.listaConvcre(req,res)
            } else {
                console.log(cadastro)
                res.render('admin/erro');
            }
        })
    },
    editaConvcre(req,res){
        let resposta;
        convcreClass.convcreEditar(req,res).then((res)=>{
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
                //Volta para a convcre de listagem
                console.log("Abrir Lista")
                this.listaConvcre(req,res);
            }else{
                //passar classe de erro
                console.log("error")
                console.log(resposta)
                res.render('admin/erro')
            }
        })
    },
    deletaConvcre(req,res){
        Convcre.deleteOne({_id: req.params.id}).then(() =>{
            this.listaConvcre(req,res);
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}