//Exports
const mongoose = require("mongoose")

//estados e unidades federativas
const Estado = mongoose.model("tb_estado")

//especialidades
const especialidadeClass = require("../models/especialidade")

//especialidade, tipos de especialidade 
const Especialidade = mongoose.model("tb_especialidade")

module.exports = {
    listaEspecialidade(req,res){
        console.log('listando especialidades')
        Especialidade.find().then((especialidade) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/especialidade/especialidadeLis', {especialidades: especialidade})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Especialidades")
            res.redirect('admin/erro')
        })

    },

    carregaEspecialidade(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/especialidade/especialidadeCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Especialidades")
            res.redirect('admin/erro')
        })

    },


    carregaEspecialidadeEdi(req,res){
        Especialidade.findById(req.params.id).then((especialidade) =>{
            console.log(especialidade)
                Estado.find().then((estado)=>{
                    console.log("Listagem Realizada de Estados")
            res.render('ferramentas/especialidade/especialidadeEdi', {especialidade, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEspecialidade(req,res){
        let cadastro = especialidadeClass.especialidadeAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/especialidade/especialidadeCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    atualizaEspecialidade(req,res){
        let resposta;
        try{
            especialidadeClass.especialidadeEditar(req,res).then((res)=>{
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
                    //Volta para a especialidade de listagem
                    Especialidade.find().then((especialidade) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/especialidade/especialidadeLis', {especialidades: especialidade})
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


    deletaEspecialidade(req,res){
        Especialidade.deleteOne({_id: req.params.id}).then(() =>{
            Especialidade.find().then((especialidade) =>{
                req.flash("success_message", "Especialidade deletada!")
                res.render('ferramentas/especialidade/especialidadeLis', {especialidades: especialidade})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Especialidades")
                res.render('admin/erro')
            })
        })
    }


}