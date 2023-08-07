//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabela NAT

//Tabelas Extrangeiras
const Usuario = mongoose.model("tb_usuario")



//Funções auxiliares

module.exports = {
    carregaDashfinan(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Financeiro!")
            res.render("dash/dashFinan", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Financeiro!")
            res.redirect('admin/erro')
        })

    },

    carregaDashadminin(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Administrativo!")
            res.render("dash/dashAdminin", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Administrativo!")
            res.redirect('admin/erro')
        })

    },
    carregaDashestatis(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Estatístico!")
            res.render("dash/dashEstatis", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Estatístico!")
            res.redirect('admin/erro')
        })

    }

      

    


}
