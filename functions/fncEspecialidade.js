//Exports
const mongoose = require("mongoose")

//estados e unidades federativas
const Estado = mongoose.model("tb_estado")

//especialidades
const especialidadeClass = require("../models/especialidade")
const respostaClass = require("../models/resposta")

//especialidade, tipos de especialidade 
const Especialidade = mongoose.model("tb_especialidade")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    listaEspecialidade(req,res,resposta){
        let flash = new Resposta()
        console.log('listando especialidades')
        Especialidade.find().then((especialidade) =>{
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
            
            res.render('ferramentas/especialidade/especialidadeLis', {especialidades: especialidade, flash})
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
        let resultado
        let resposta = new Resposta()
        let cadastro = especialidadeClass.especialidadeAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
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
                this.listaEspecialidade(req,res,resposta)
            } else {
                resposta.texto = err
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaEspecialidade(req,res){
        let resposta = new Resposta();
        let resultado;
        try{
            especialidadeClass.especialidadeEditar(req,res).then((res)=>{
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
                    //Volta para a especialidade de listagem
                    console.log('verdadeiro')
                    this.listaEspecialidade(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = err
                    resposta.sucesso = "false"
                    //Volta para a especialidade de listagem
                    console.log('false')
                    this.listaEspecialidade(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
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