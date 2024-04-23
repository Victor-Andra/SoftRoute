//Exports
const mongoose = require("mongoose")

//progs
const progClass = require("../models/prog")
const respostaClass = require("../models/resposta")

const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")

//prog, tipos de prog 
const Prog = mongoose.model("tb_prog")
const Resposta = mongoose.model("tb_resposta")

const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")

const Progdica = mongoose.model("tb_progdica")
const Prognivel = mongoose.model("tb_prognivel")
const Progtipo = mongoose.model("tb_progtipo")

module.exports = {
    listaProg(req,res,resposta){
        let flash = new Resposta()
        console.log('listando progs')
        Prog.find().then((prog) =>{
            console.log("Listagem Realizada!")

            if(resposta.sucesso == "" || !resposta){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }

            res.render('area/aba/prog/progLis', {progs: prog, resposta, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Progs")
            res.redirect('admin/erro')
        })

    },

    carregaProg(req,res){
        res.render("area/aba/prog/progCad")
    },

    carregaProgEdi(req,res){
        Prog.findById(req.params.id).then((prog) =>{
            console.log(prog)
            res.render('area/aba/prog/progEdi', {prog})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProg(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = progClass.progAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                this.listaProg(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaProg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progClass.progEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    this.listaProg(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProg(req,res){
        Prog.deleteOne({_id: req.params.id}).then(() =>{
            Prog.find().then((prog) =>{
                req.flash("success_message", "Método deletado!")
                res.render('area/aba/prog/progLis', {progs: prog})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}