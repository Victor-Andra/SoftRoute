//Exports
const mongoose = require("mongoose")

//especialidadePlanos
const especialidadePlanoClass = require("../models/especialidadePlano")
const respostaClass = require("../models/resposta")

//especialidadePlano, tipos de especialidadePlano 
const EspecialidadePlano = mongoose.model("tb_especialidadePlano")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaEspecialidadePlano(req,res,resposta){
        let flash = new Resposta()
        console.log('listando especialidadePlanos')
        EspecialidadePlano.find().then((especialidadePlano) =>{
            console.log("Listagem Realizada!")
            
            if(resposta.sucesso == ""){
                console.log(' objeto vazio');
                flash.texto = ""
                flash.sucesso = ""
            } else {
                console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                flash.texto = resposta.texto
                flash.sucesso = resposta.sucesso
            }
            
            res.render('ferramentas/especialidadePlano/especialidadePlanoLis', {especialidadePlanos: especialidadePlano, flash})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar EspecialidadePlanos")
            res.redirect('admin/erro')
        })
    },
    carregaEspecialidadePlano(req,res){
        res.render("ferramentas/especialidadePlano/especialidadePlanoCad")
    },
    carregaEspecialidadePlanoEdi(req,res){
        EspecialidadePlano.findById(req.params.id).then((especialidadePlano) =>{
            console.log(especialidadePlano)
                console.log("Listagem Realizada de Estados")
                res.render('ferramentas/especialidadePlano/especialidadePlanoEdi', {especialidadePlano})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraEspecialidadePlano(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = especialidadePlanoClass.especialidadePlanoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEspecialidadePlano(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
    atualizaEspecialidadePlano(req,res){
        let resposta = new Resposta();
        let resultado;
        try{
            especialidadePlanoClass.especialidadePlanoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = true;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    //Volta para a especialidadePlano de listagem
                    console.log('verdadeiro')
                    this.listaEspecialidadePlano(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    //Volta para a especialidadePlano de listagem
                    console.log('false')
                    this.listaEspecialidadePlano(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaEspecialidadePlano(req,res){
        EspecialidadePlano.deleteOne({_id: req.params.id}).then(() =>{
            EspecialidadePlano.find().then((especialidadePlano) =>{
                req.flash("success_message", "EspecialidadePlano deletada!")
                res.render('ferramentas/especialidadePlano/especialidadePlanoLis', {especialidadePlanos: especialidadePlano})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar EspecialidadePlanos")
                res.render('admin/erro')
            })
        })
    }
}