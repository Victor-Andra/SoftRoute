//Exports
const mongoose = require("mongoose")

//estados e unidades federativas    
const Estado = mongoose.model("tb_estado")
const estadoClass = require("../models/estado")
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")




module.exports = {
    listaEstado(req,res){
        console.log('listando estados')
        Estado.find().then((estado) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/estado/estadoLis', {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Estados")
            res.render('admin/erro')
        })

    },
    carregaEstado(req,res){
        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/estado/estadoCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Estados")
            res.render('admin/erro')
        })

    },
    carregaEstadoEdi(req, res){
        let base64Image
        Estado.findOne({_id: req.params.id}).then((estado) =>{
            //console.log(estado)
            if (estado.estado_bandeira != 'undefined' && estado.estado_bandeira != undefined){
            base64Image = new Buffer.from(estado.estado_bandeira, 'binary').toString('base64');
            }
            res.render("ferramentas/estado/estadoEdi", {estado, base64Image})
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },
    async cadastraEstado(req, res) {
        console.log("chegou");
        let resposta = new Resposta();
    
        try {
            const result = await estadoClass.estadoAdicionar(req, res);
            console.log("Cadastro Realizado!!!");
    
            if (result == "true"){}
            resposta.texto = "Cadastrado com sucesso!";
            resposta.sucesso = "true";
            req.flash("success_message", "Cadastro realizado com sucesso!");
            this.listaEstado(req, res);
        } catch (err) {
            console.log("ERRO:");
            console.log(err);
    
            resposta.texto = err;
            resposta.sucesso = "false";
            req.flash("error_message", "Houve um erro ao abrir o cadastro!");
            res.render("admin/erro", resposta);
        }
    },
    
    
   
    atualizaEstado(req,res){
        let resposta;
        try{
            estadoClass.estadoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta == 'true'){
                    //Volta para a estado de listagem
                    Estado.find().then((estado) =>{
                        res.render('ferramentas/estado/estadoLis', {estados: estado})
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


    deletaEstado(req,res){
        Estado.deleteOne({_id: req.params.id}).then(() =>{
            Estado.find().then((estado) =>{
                req.flash("success_message", "Estado deletada!")
                this.listaEstado(req,res)
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Estados")
                res.render('admin/erro')
            })
        })
    }


}