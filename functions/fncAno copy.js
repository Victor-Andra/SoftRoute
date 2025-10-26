//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe
const anoClass = require("../models/ano")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabelas
//anos
const Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)

//Tabelas Extrangeiras
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAno(req,res){
        let db = "req.cookies['preferredDb']";
        Ano = getModel(PortalDoUsuario, 'tb_ano', anoClass.AnoSchema)

        console.log('listando anos')
        Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
        Ano.find({ ano_lixo: "false" }) // Filtra pelo campo
        .sort({ ano: 1 }) // Ordena por ano crescente (opcional)
        .then((ano) => {
            ano.forEach((b)=>{
            dataedi = new Date(b.ano_dataedi)
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
            res.render('ferramentas/ano/anoLis', {anos: ano, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Anos")
            res.redirect('admin/erro')
        })

    },

    carregaAno(req,res){
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)

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
        let db = req.cookies['preferredDb'];
        Ano = getModel(db, 'tb_ano', anoClass.AnoSchema)

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