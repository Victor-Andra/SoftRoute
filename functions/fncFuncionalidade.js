//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe
const funcionalidadeClass = require("../models/funcionalidade")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabelas
//funcionalidades
const Funcionalidade = mongoose.model("tb_funcionalidade")

//Tabelas Extrangeiras
const Usuario = mongoose.model("tb_usuario")

module.exports = {
    listaFuncionalidade(req,res){
        console.log('listando funcionalidades')
        Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
        Funcionalidade.find({ funcionalidade_lixo: "false" }) // Filtra pelo campo
        .sort({ funcionalidade: 1 }) // Ordena por funcionalidade crescente (opcional)
        .then((funcionalidade) => {
            funcionalidade.forEach((b)=>{
            dataedi = new Date(b.funcionalidade_dataedi)
                mes = (dataedi.getMonth()+1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(dataedi.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;
            })
            console.log("Listagem Realizada!")
            res.render('ferramentas/funcionalidade/funcionalidadeLis', {funcionalidades: funcionalidade, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcionalidades")
            res.redirect('admin/erro')
        })

    },

    carregaFuncionalidade(req,res){
        Funcionalidade.find().then((funcionalidade)=>{
            console.log("Listagem Realizada de Funcionalidades de Uso!")
            res.render("ferramentas/funcionalidade/funcionalidadeCad", {funcionalidades: funcionalidade})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Funcionalidades")
            res.redirect('admin/erro')
        })

    },


    carregaFuncionalidadeEdi(req,res){
        Funcionalidade.findById(req.params.id).then((funcionalidade) =>{console.log("ID: "+funcionalidade._id)
            console.log(funcionalidade)
            res.render('ferramentas/funcionalidade/funcionalidadeEdi', {funcionalidades: funcionalidade})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as lista!")
            res.render('admin/erro')
        })
    },

    cadastraFuncionalidade(req,res){
        let resposta
        let cadastro = funcionalidadeClass.funcionalidadeAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaFuncionalidade(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    atualizaFuncionalidade(req,res){
        let resposta;
        try{
            funcionalidadeClass.funcionalidadeEditar(req,res).then((res)=>{
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
                    //Volta para a funcionalidade de listagem
                    console.log('verdadeiro')
                    this.listaFuncionalidade(req,res)
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

    deletaFuncionalidade: async (funcionalidadeId, req, res) => { // Recebe o ID como parâmetro
        console.log("ID recebido na função deletaFuncionalidade:", funcionalidadeId); // Verificação
      
        try {
          // Chama a classe de deleção passando o ID
          const resultado = await funcionalidadeClass.funcionalidadeDeletar(funcionalidadeId, req, res);
          console.log("Resultado da deleção:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro em deletaFuncionalidade:", err);
          throw err;
        }
      }
   
}