//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Notasup
const notasupClass = require("../models/notasup")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const notaSupObsClass = require("../models/notasupobs")
const progClass = require("../models/prog")
const progtipoClass = require("../models/progtipo")
const terapiaClass = require("../models/terapia")
const fncProg = require("../functions/fncProg")


//Tabela Notasup 
const Notasup = mongoose.model("tb_notasup")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Prog = mongoose.model("tb_prog")
const Progtipo = mongoose.model("tb_progtipo")
const Terapia = mongoose.model("tb_terapia")
const Notasupobs = mongoose.model("tb_notasupobs")
const Resposta = mongoose.model("tb_resposta")

//Extrutura de Resposta
const respostaClass = require("../models/resposta")

module.exports = {
    listaNotasup(req, res){
        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let convs = new Array();
        //console.log('listando Diários de Notasup')
        Notasup.find().then((notasup) =>{
            //console.log("Listagem Realizada dos Diários de Notasup!")
                Bene.findById(req.params.id).then((bene) =>{
                    //console.log("Listagem Realizada bene!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                        fncProg.listaProg(req,res,flash)
        })})}).catch((err) =>{
            //console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Notasup")
            res.redirect('admin/erro')
        })
    },

    carregaNotasup(req,res){
        let beneid = req.params.id
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                //console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    //console.log("Listagem Realizada de Usuário")
                    Bene.find().then((bene)=>{
                        Bene.findOne({_id : req.params.id}).then((b)=>{
                         //console.log("b.datanasc"+b.bene_datanasc)
                            let datanasc = new Date(b.bene_datanasc);
                            //console.log("datanasc: "+datanasc);
                            let mes = (datanasc.getMonth()+1).toString();
                            let dia = (datanasc.getUTCDate()).toString();
                            if (mes.length == 1){
                                mes = "0"+mes;
                            }
                            if (dia.length == 1){
                                dia = "0"+dia;
                            }
                            let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                            b.datanasc=fulldate;
                            //datanasc = (dia+"-"+mes+"-"+datanasc.getFullYear()).toString();

                            // Data atual
                            const hoje = new Date();
                            let idade = new Date(b.bene_idade);

                            // Data de aniversário
                            let aniversario = new Date(b.bene_datanasc);

                            // Cálculo da idade
                            let idadeAnos = hoje.getFullYear() - aniversario.getFullYear();
                            let idadeMeses = hoje.getMonth() - aniversario.getMonth();
                            let idadedias = hoje.getDay() - aniversario.getDay();

                            // Ajuste caso o dia de aniversário ainda não tenha ocorrido este ano
                            if (hoje.getDate() < aniversario.getDate()) {
                                idadeMeses--;
                            }

                            // Se o mês do aniversário for maior que o mês atual, ajusta a idade
                            if (idadeMeses < 0) {
                                idadeAnos--;
                                idadeMeses += 12;
                            }
                            let fullidade = (idadeAnos + " anos e " + (""+idadeMeses+"").replace("-","") + " meses.");
                            bene.idade = fullidade;

                        //console.log("Listagem Realizada de beneficiarios")
                        Prog.find({ prog_beneid: b._id , prog_status: { $ne: "Adquirido" }}).then((prog)=>{
                            let idsUsados = [];
                            let progtiposFiltrados = [];
                            prog.forEach((p)=>{
                                idsUsados.push((""+p.prog_tipo+""));
                                //console.log("p.prog_tipo? "+p.prog_tipo);
                            })
                            Progtipo.find().then((progtipo)=>{
                                progtipo.forEach((pt)=>{
                                    if (idsUsados.includes((""+pt._id+""))){
                                        progtiposFiltrados.push(pt);
                                        //console.log("prog_tipo? "+pt);
                                    }
                                })
                                //progtiposFiltrados = progtipo.filter(pt => idsUsados.includes(pt._id));
                                res.render("area/aba/notasup/notasupCad", {Convs: conv, Terapias: terapia, Terapeutas: terapeuta, Benes: bene, Progtipos: progtiposFiltrados, Progs: prog, beneid, datanasc, fullidade, b})
        })})})})})})}).catch((err) =>{
            //console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },

    carregaNotasupEdi(req,res){
        let idBene = "";
        Notasup.findById(req.params.id).then((notasup) =>{
            idBene = notasup.notasup_beneid;
            Terapia.find().then((terapia)=>{
                //console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    //console.log("Listagem Realizada de Usuário")
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                            //console.log("Listagem Realizada de beneficiarios")
                            Notasupobs.find().then((notasupobs)=>{
                                Prog.find({ prog_beneid: idBene , prog_status: { $ne: "Adquirido" }}).then((prog) =>{
                                    let idsUsados = [];
                                    let progtiposFiltrados = [];
                                    prog.forEach((p)=>{
                                        idsUsados.push((""+p.prog_tipo+""));
                                        //console.log("p.prog_tipo? "+p.prog_tipo);
                                    })
                                    Progtipo.find().then((progtipo)=>{
                                        progtipo.forEach((pt)=>{
                                            if (idsUsados.includes((""+pt._id+""))){
                                                progtiposFiltrados.push(pt);
                                                //console.log("prog_tipo? "+pt);
                                            }
                                        })
                                        progtiposFiltrados.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                        
                                        res.render('area/aba/notasup/notasupEdi', {notasup, prog, terapias: terapia, usuarios: usuario, benes: bene, idBene, progtipos: progtiposFiltrados, terapeutas: terapeuta, notasupobss:notasupobs})
        })})})})})})})}).catch((err) =>{
            //console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
   
    cadastraNotasup(req,res){
        //console.log("GUCHS")
        let resposta = new Resposta();
        notasupClass.notaSupEObsAdicionar(req,res).then((resultado)=>{
            if (resultado == "true"){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                //console.log('retorno verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaNotasup(req,res,resposta)
            } else {
                resposta.texto = "Erro ao carastrar Notas de Supervisão. "+resultado;
                resposta.sucesso = "false"
                //console.log('retorno falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaNotasup(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            notasupClass.notasupEditar(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log(res)
                resultado = res;
            }).catch((err) =>{
                //console.log("error1")
                //console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    //console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaNotasup(req,res,resposta)
                }else{
                    //passar classe de erro
                    //console.log("error")
                    //console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaNotasup(req,res,resposta)
                }
            })
        } catch(err1){
            //console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaNotasup(req,res){
        Notasup.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    //console.log("Listagem Realizada de terapias")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    //console.log("Listagem Realizada de beneficiarios")
                req.flash("success_message", "Nota de Supervisão deletado!")
                res.render('area/aba/notasup/notasupLis', {Convs: conv, Terapias: terapia, Terapeutas: terapeuta, Benes: bene, flash})
            })})})}).catch((err) =>{
                //console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    },

    preCarregaNotasup(req,res){

    }


}