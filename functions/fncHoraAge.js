//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//horaages
const horaageClass = require("../models/horaAge")
var Horaage = getModel("SoftRoute", 'tb_horaage', horaageClass.HoraageSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaHoraage(req,res){//ok
        let db = req.cookies['preferredDb'];
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        console.log('listando horaages')
        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/horaage/horarioLis', {horaages: horaage})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Horaages")
            res.redirect('admin/erro')
        })

    },
    carregaHoraage(req,res){
        res.render('ferramentas/horaage/horarioCad')
    },

    
    carregaHoraageEdi(req,res){//ok
        let db = req.cookies['preferredDb'];
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        Horaage.findById(req.params.id).then((horaage) =>{
            console.log(horaage)
            res.render("ferramentas/horaage/horarioEdi", {horaage})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao chamr o formulário de edição!")
            res.render('admin/erro')
        })
    },
    cadastraHoraage(req,res){
        let cadastro = horaageClass.horaageAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/horaage/horarioCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },
    atualizaHoraage(req,res){
        let db = req.cookies['preferredDb'];
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        let resposta;
        try{
            horaageClass.horaageEditar(req,res).then((res)=>{
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
                    //Volta para a horaage de listagem
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/horaage/horarioLis', {horaages: horaage})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
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
    deletaHoraage(req,res){
        let db = req.cookies['preferredDb'];
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)

        Horaage.deleteOne({_id: req.params.id}).then(() =>{
            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage) =>{
                req.flash("success_message", "Horaage deletada!")
                res.render('ferramentas/horaage/horarioLis', {horaages: horaage})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Horaages")
                res.render('admin/erro')
            })
        })
    }
}