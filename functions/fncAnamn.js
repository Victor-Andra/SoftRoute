//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Anamnese e Beneficiários
const anamnClass = require("../models/anamn")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela Anamnese
const Anamn = mongoose.model("tb_anamn")

//Tabelas Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")


module.exports = {
    carregaAnamn(req, res){
            res.render('area/anamn/anamnCad')
       
        },
    


    cadastraAnamn(req,res){
        let cadastro = anamnClass.anamnAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            res.render('area/anamn/anamnCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    deletaAnamn(req, res){
        Anamn.deleteOne({_id: req.params.id}).then(() =>{
            Anamn.find().then((anamn) =>{
                req.flash("success_message", "Anamnese deletada!")
                res.render('area/anamn/anamnLis', {anamns: anamn})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar as anamneses")
                res.render('admin/erro')
            })
        })
    },
    atualizaAnamn(req, res){
        let resposta;
        try{
            anamnClass.anamnEditar(req,res).then((res)=>{
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
                    //Volta para a Anamn de listagem
                    this.listaAnamn(req,res);
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
    carregaAnamnEdi(req, res){
            Anamn.findById(req.params.id).then((anamnEdi) =>{
            res.render('area/anamn/anamnEdi')
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },

    listaAnamn(req, res){
        let convs = new Array();
        console.log('listando Anamneses')
        Anamn.find().then((anamn) =>{
            console.log("Listagem Realizada das Anamneses!")
                Bene.findById(req.params.id).then((bene) =>{
                    console.log("Listagem Realizada bene!")
                        Usuario.find().then((usuario)=>{
                        console.log("Listagem Realizada Usuário!")
            res.render('area/anamn/anamnLis', {Anamns: anamn, Usuarios: usuario, Benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Anamnses")
            res.redirect('admin/erro')
        })
    },

    listaAnamnImp(req, res){
        Anamn.findById(req.params.id).then((anamn) =>{
            console.log(anamn)
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('beneficiario/beneLis', {Anamns: anamn, Benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}