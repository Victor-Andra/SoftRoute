//Exports
const mongoose = require("mongoose")

//anos
const anoClass = require("../models/ano")
const Ano = mongoose.model("tb_ano")

module.exports = {
    listaAno(req,res){
        console.log('listando anos')
        Ano.find({ ano_lixo: "false" }) // Filtra pelo campo
        .sort({ ano: 1 }) // Ordena por ano crescente (opcional)
        .then((ano) => {
            console.log("Listagem Realizada!")
            res.render('ferramentas/ano/anoLis', {anos: ano})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Anos")
            res.redirect('admin/erro')
        })

    },

    carregaAno(req,res){
        Ano.find().then((ano)=>{
            console.log("Listagem Realizada de Anos de Uso!")
            res.render("ferramentas/ano/anoCad", {anos: ano})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Anos")
            res.redirect('admin/erro')
        })

    },


    carregaAnoEdi(req,res){
        Ano.findById(req.params.id).then((ano) =>{console.log("ID: "+ano._id)
            console.log(ano)
            res.render('ferramentas/ano/anoEdi', {anos: ano})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as lista!")
            res.render('admin/erro')
        })
    },

    cadastraAno(req,res){
        let resposta
        let cadastro = anoClass.anoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaAno(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    atualizaAno(req,res){
        let resposta;
        try{
            anoClass.anoEditar(req,res).then((res)=>{
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
                    //Volta para a ano de listagem
                    console.log('verdadeiro')
                    this.listaAno(req,res)
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

    deletaAno: async (anoId, req, res) => { // Recebe o ID como parâmetro
        console.log("ID recebido na função deletaAno:", anoId); // Verificação
      
        try {
          // Chama a classe de deleção passando o ID
          const resultado = await anoClass.anoDeletar(anoId, req, res);
          console.log("Resultado da deleção:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro em deletaAno:", err);
          throw err;
        }
      }
   
}