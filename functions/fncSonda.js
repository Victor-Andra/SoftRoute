//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Controle de PECS
const sondaClass = require("../models/sonda")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela PECS
const Sonda = mongoose.model("tb_sonda")

//Tabelas Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const bene = require("../models/bene")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    carregaSonda(req,res){
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                       res.render("area/aba/sonda/sondaCad", {terapeutas: terapeuta, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.redirect('admin/erro')
        })

    },
    
        cadastraSonda(req,res){
            console.log("chegou")
            let resultado
            let resposta = new Resposta()
            
            sondaClass.sondaAdicionar(req,res).then((result)=>{
                console.log("Cadastro Realizado!!!")
                //console.log(res)
                resultado = true;
            }).catch((err)=>{
                console.log("ERRO:");
                console.log(err);
                resultado = err
            }).finally(()=>{
                if (resultado == true){
                    resposta.texto = "Cadastrado com sucesso!"
                    resposta.sucesso = "true"
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    this.listaSonda(req,res,resposta)
                } else {
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    console.log('falso')
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    res.render('admin/erro', resposta);
                }
            })
        },

    deletaSonda(req,res){
        Sonda.deleteOne({_id: req.params.id}).then(() =>{
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                req.flash("success_message", "Sondaese deletada!")
                this.listaSonda(req,res);
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar a sondaese")
                res.render('admin/erro')
            })
        })
    },

    atualizaSonda(req,res){
        let resposta;
        try{
            sondaClass.sondaEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
            }).finally(() =>{
                if(resposta){
                    //Volta para a Sonda de listagem
                    this.listaSonda(req,res);
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

    carregaSondaedi(req, res){
        Sonda.findById(req.params.id).then((sonda) =>{console.log("ID: "+sonda._id)
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            res.render('area/aba/sonda/sondaEdi', {sonda, terapeutas: terapeuta, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaSonda(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Sondaeses')
        Sonda.find().then((sonda) =>{
            sonda.sort((a,b) => (a.sonda_benenome > b.sonda_benenome) ? 1 : ((b.sonda_benenome > a.sonda_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista sondaese 
            sonda.forEach((b)=>{
                //console.log("b.datacad"+b.sonda_datacad)
                let datacad = new Date(b.sonda_data)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.sonda_data=fulldate;
                
                //console.log("b.dataana"+b.sonda_datasondaese)
                datacad = new Date(b.sonda_datasondaese)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.sonda_datacad=fulldate;

                //console.log("d.dataanaedi"+d.sonda_dataedi)
                datacad = new Date(b.sonda_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.sonda_dataedi=fulldate;
            })

            //console.log("sonda:");
            //console.log(sonda);
            //console.log("Listagem Realizada das Sondaeses!")
                Bene.find().then((bene)=>{
                    //console.log("Listagem Realizada bene!")
                    Usuario.find().then((usuario)=>{
                        //console.log("Listagem Realizada Usuário!")
                        /*if(resposta.sucesso == ""){
                            console.log(' objeto vazio');
                            flash.texto = ""
                            flash.sucesso = ""
                        } else {
                            console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                            flash.texto = resposta.texto
                            flash.sucesso = resposta.sucesso
                        }*/
            res.render('area/aba/sonda/sondaLis', {sondas: sonda, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaSondaimp(req, res){
        Sonda.findById(req.params.id).then((sonda) =>{
            console.log("sonda:");
            console.log(sonda);
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/aba/sonda/sondaLis', {sondas: sonda, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}