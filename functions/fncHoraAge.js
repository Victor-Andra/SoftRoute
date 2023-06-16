//Exports
const mongoose = require("mongoose")

//horaages
const Horaage = mongoose.model("tb_horaage")
const horaageClass = require("../models/horaAge")

module.exports = {
    listaHoraage(req,res){//ok
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