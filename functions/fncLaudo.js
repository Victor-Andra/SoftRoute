//Exports
const mongoose = require("mongoose")
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Laudoamento 
const laudoClass = require("../models/laudo")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")

//Tabela Plano de Laudoamento 
const Laudo = mongoose.model("tb_laudo")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Escola = mongoose.model("tb_escola")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaLaudoold(req, res, resposta){
        let flash = new Resposta();
        let laudo;
        Bene.find().then((bene) => {
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Conv.find().then((conv)=>{
                conv.sort((a,b) => ((a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o Convênio por nome
                Usuario.find().then((usuario)=>{
                    Laudo.find().then((laudo)=>{
                        let beneLaudo;
                        let convBene;
                        let i = 1;
                        laudo.forEach((l)=>{
                            console.log("LAudO "+i);
                            i++;
                            beneLaudo = bene.find(a => (""+a._id+"") === (""+l.laudo_beneid+""));
                            if (beneLaudo != undefined && beneLaudo != "undefined" && (""+beneLaudo.bene_convid+"") != "undefined" && (""+beneLaudo.bene_convid+"") != undefined){
                                convBene = conv.find(a => (""+a._id+"") === (""+beneLaudo.bene_convid+""));
                                console.log(convBene);
                                if ((""+convBene.conv_cobralaudo+"") != ""){
                                    if (convBene.conv_cobralaudo == "6 Meses" || convBene.conv_cobralaudo == "12 Meses"){
                                        let laudoPrazo = new Date(l.laudo_data);
                                        l.laudo_dataString = fncGeral.getData(laudoPrazo);
                                        laudoPrazo.setMonth(laudoPrazo.getMonth() + (convBene.conv_cobralaudo == "6 Meses" ? 6 : (convBene.conv_cobralaudo == "12 Meses" ? 12 : 0)));
                                        l.laudo_prazo = fncGeral.getData(laudoPrazo);
                                        l.laudo_periodoValidade = convBene.conv_cobralaudo;
                                        let laudo_dataEdi = new Date(l.laudo_dataedi);
                                        l.laudo_dataediString = (fncGeral.getData(laudo_dataEdi) == "NaN/NaN/NaN" ? "" : fncGeral.getData(laudo_dataEdi));
                                    }
                                }
                            }
                        })
                    res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, convs: conv, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaLaudo(req, res, resposta) {
        let flash = new Resposta();

        Bene.find({ bene_status: "Ativo" }).then((bene) => {
                // Ordena por nome sem localeCompare (mantém seu método original)
                bene.sort((a, b) => {
                    return ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                        (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 :
                        (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                            (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0);
                });
                Conv.find().then((conv) => {
                    conv.sort((a, b) => {
                        return ((a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                            (b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 :
                            (((b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                                (a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0);
                    });
                    Usuario.find().then((usuario) => {
                        Laudo.find().then((laudo) => {
                            let beneLaudo;
                            let convBene;
                            let i = 1;
                            // Filtra os laudos para exibir somente os de beneficiários ativos
                            const laudosFiltrados = [];
                            laudo.forEach((l) => {
                                //console.log("LAUDÓ " + i);
                                i++;
                                beneLaudo = bene.find(a => "" + a._id + "" === "" + l.laudo_beneid + "");
                                if (beneLaudo && beneLaudo.bene_convid) {
                                    convBene = conv.find(a => "" + a._id + "" === "" + beneLaudo.bene_convid + "");

                                    if (convBene && convBene.conv_cobralaudo && convBene.conv_cobralaudo !== "") {
                                        if (convBene.conv_cobralaudo === "6 Meses" || convBene.conv_cobralaudo === "12 Meses") {
                                            let laudoPrazo = new Date(l.laudo_data);
                                            l.laudo_dataString = fncGeral.getData(laudoPrazo);

                                            laudoPrazo.setMonth(laudoPrazo.getMonth() + (convBene.conv_cobralaudo === "6 Meses" ? 6 : 12));
                                            l.laudo_prazo = fncGeral.getData(laudoPrazo);
                                            l.laudo_periodoValidade = convBene.conv_cobralaudo;

                                            let laudo_dataEdi = new Date(l.laudo_dataedi);
                                            l.laudo_dataediString = (fncGeral.getData(laudo_dataEdi) === "NaN/NaN/NaN" ? "" : fncGeral.getData(laudo_dataEdi));
                                            console.log("FINAL meses")
                                        }
                                    }
                                    // Adiciona à lista filtrada somente se o bene for ativo (já está garantido acima)
                                    laudosFiltrados.push(l);
                                }
                            });

                            res.render('area/laudo/laudoLis', {
                                laudos: laudosFiltrados,
                                usuarios: usuario,
                                benes: bene,
                                convs: conv,
                                flash
                            });
                        }).catch((err) => {
                            console.log(err);
                            req.flash("error_message", "Houve um erro ao buscar os laudos!");
                            res.redirect('/admin/erro');
                        });
                    }).catch((err) => {
                        console.log(err);
                        req.flash("error_message", "Houve um erro ao buscar os usuários!");
                        res.redirect('/admin/erro');
                    });
                }).catch((err) => {
                    console.log(err);
                    req.flash("error_message", "Houve um erro ao buscar os convênios!");
                    res.redirect('/admin/erro');
                });
            }).catch((err) => {
                console.log(err);
                req.flash("error_message", "Houve um erro ao listar os beneficiários!");
                res.redirect('/admin/erro');
            });
    },
    carregaLaudo(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    Conv.find().then((conv)=>{
                        conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o bene por nome
                        res.render("area/laudo/laudoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, convs: conv, usuarioAtual})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Laudo")
            res.redirect('admin/erro')
        })
    },
    carregaLaudoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Laudo.findById(req.params.id).then((laudo) =>{console.log("ID: "+laudo._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: laudo.laudo_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("area/laudo/laudoEdi", {laudo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    filtraLaudoold(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Laudoeses')
        Laudo.find({laudo_beneid: req.body.laudoBeneid}).then((laudo) =>{
            laudo.sort((a,b) => (a.laudo_benenome > b.laudo_benenome) ? 1 : ((b.laudo_benenome > a.laudo_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista laudoese 
            laudo.forEach((c)=>{
               //console.log("c.datacad"+c.laudo_datacad)
               let datacad = new Date(c.laudo_data)
               let mes = (datacad.getMonth()+1).toString();
               let dia = (datacad.getUTCDate()).toString();
               if (mes.length == 1){
                   mes = "0"+mes;
               }
               if (dia.length == 1){
                   dia = "0"+dia;
               }
               let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
               c.laudo_data=fulldate;
                

            })

            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
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
                    res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraLaudoold2(req, res, resposta){
        let flash = new Resposta();
        let laudo;
        Bene.find().then((bene) => {
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Conv.find().then((conv)=>{
                conv.sort((a,b) => ((a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o Convênio por nome
                Usuario.find().then((usuario)=>{
                    Laudo.find().then((laudo)=>{
                        let beneLaudo;
                        let convBene;
                        let i = 1;
                        laudo.forEach((l)=>{
                            console.log("LAudO "+i);
                            i++;
                            beneLaudo = bene.find(a => (""+a._id+"") === (""+l.laudo_beneid+""));
                            if (beneLaudo != undefined && beneLaudo != "undefined" && (""+beneLaudo.bene_convid+"") != "undefined" && (""+beneLaudo.bene_convid+"") != undefined){
                                convBene = conv.find(a => (""+a._id+"") === (""+beneLaudo.bene_convid+""));
                                console.log(convBene);
                                if ((""+convBene.conv_cobralaudo+"") != ""){
                                    if (convBene.conv_cobralaudo == "6 Meses" || convBene.conv_cobralaudo == "12 Meses"){
                                        let laudoPrazo = new Date(l.laudo_data);
                                        l.laudo_dataString = fncGeral.getData(laudoPrazo);
                                        laudoPrazo.setMonth(laudoPrazo.getMonth() + (convBene.conv_cobralaudo == "6 Meses" ? 6 : (convBene.conv_cobralaudo == "12 Meses" ? 12 : 0)));
                                        l.laudo_prazo = fncGeral.getData(laudoPrazo);
                                        l.laudo_periodoValidade = convBene.conv_cobralaudo;
                                        let laudo_dataEdi = new Date(l.laudo_dataedi);
                                        l.laudo_dataediString = (fncGeral.getData(laudo_dataEdi) == "NaN/NaN/NaN" ? "" : fncGeral.getData(laudo_dataEdi));
                                    }
                                }
                            }
                        })
                    res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, convs: conv, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraLaudo(req, res, resposta) {
        let flash = new Resposta();
        let mostraInativos = req.body.mostraInativos;

        // Passo 1: Buscar beneficiários (ativos ou todos)
        let queryBene = {};
        if (!mostraInativos) {
            queryBene.bene_status = "Ativo";
        }

        Bene.find(queryBene).then((beneList) => {
            beneList.sort((a, b) =>
                ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 :
                (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));

            Conv.find().then((convList) => {
                convList.sort((a, b) =>
                    ((a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                    (b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 :
                    (((b.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) >
                    (a.conv_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));

                Usuario.find().then((usuarioList) => {

                    // Passo 2: Buscar todos os laudos
                    Laudo.find().then((laudoList) => {

                        // Passo 3: Filtrar os laudos com base no status do bene
                        const laudosFiltrados = [];

                        laudoList.forEach((l) => {
                            // Procura o bene associado ao laudo
                            const beneLaudo = beneList.find(a => a._id.toString() === l.laudo_beneid.toString());

                            if (beneLaudo) {
                                // Se mostrar inativos OU bene for ativo, inclui o laudo
                                if (mostraInativos || beneLaudo.bene_status === "Ativo") {
                                    // Processamento adicional (datas, validade etc.)
                                    const convBene = convList.find(c => c._id.toString() === beneLaudo.bene_convid.toString());

                                    if (convBene && ["6 Meses", "12 Meses"].includes(convBene.conv_cobralaudo)) {
                                        let laudoPrazo = new Date(l.laudo_data);
                                        l.laudo_dataString = fncGeral.getData(laudoPrazo);

                                        laudoPrazo.setMonth(laudoPrazo.getMonth() + (convBene.conv_cobralaudo === "6 Meses" ? 6 : 12));
                                        l.laudo_prazo = fncGeral.getData(laudoPrazo);
                                        l.laudo_periodoValidade = convBene.conv_cobralaudo;

                                        let laudo_dataEdi = new Date(l.laudo_dataedi);
                                        l.laudo_dataediString = (fncGeral.getData(laudo_dataEdi) === "NaN/NaN/NaN" ? "" : fncGeral.getData(laudo_dataEdi));
                                    }

                                    laudosFiltrados.push(l);
                                }
                            }
                        });

                        res.render('area/laudo/laudoLis', {
                            laudos: laudosFiltrados,
                            usuarios: usuarioList,
                            benes: beneList,
                            convs: convList,
                            flash,
                            mostraInativos: !!mostraInativos
                        });
                    }).catch(err => {
                        console.log(err);
                        req.flash("error_message", "Houve um erro ao listar os laudos!");
                        res.redirect('/admin/erro');
                    });
                });
            });
        }).catch(err => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar os beneficiários!");
            res.redirect('/admin/erro');
        });
    },
    cadastraLaudo(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        laudoClass.laudoAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Laudo cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaLaudo(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaLaudo(req,res){
        let resultado
        let flash = new Resposta()
        try{
            laudoClass.laudoEditar(req,res).then((res)=>{
                console.log("Atualização realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaLaudo(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaLaudo(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaLaudo(req,res){
        let resposta;
        let flash = new Resposta()
        Laudo.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log("Err:"+err)
            req.flash("error_message", "houve um erro ao listar os Laudo")
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Laudo deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Laudo";
                flash.sucesso = "false";
            }
            this.listaLaudo(req,res, flash)
        })
    }
}