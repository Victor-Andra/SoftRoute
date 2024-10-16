//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Tratamento 
const tratClass = require("../models/trat")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const laudoClass = require("../models/laudo")
const fncGeral = require("./fncGeral")

//Tabela Plano de Tratamento 
const Trat = mongoose.model("tb_trat")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Laudo = mongoose.model("tb_laudo")

//Funções auxiliares
const Resposta = mongoose.model("tb_resposta")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaTrat(req, res, resposta){
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        //console.log('listando plano de tratamento')
        Trat.find().then((trat) =>{

            trat.forEach((b)=>{
                let datacad = new Date(b.trat_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                datacad = new Date(b.trat_tratdata)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.tratdata=fulldate;

                datacad = new Date(b.trat_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;
            })
            //console.log("trat:");
            //console.log(trat);
            //console.log("Listagem Realizada das Trateses!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        if(resposta.sucesso == ""){
                            console.log(' objeto vazio');
                            flash.texto = ""
                            flash.sucesso = ""
                        } else {
                            console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                            flash.texto = resposta.texto
                            flash.sucesso = resposta.sucesso
                        }
                        res.render('area/plano/tratLis', {trats: trat, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraTrat(req, res, resposta){
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        let tipoPessoa = req.body.tratTipoPessoa;
        let tipoData = req.body.tipoData;
        let dataIni;
        let dataFim;
        let seg;
        let sex;
        let busca;
        let data;
        let ano;
        let mes;
        let dia;
        let isAgendaTerapeuta = false;
        let idUsu = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421903a12aa557219a0fd3','6242191fa12aa557219a0fd9','6242190fa12aa557219a0fd6','624218f5a12aa557219a0fd0'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        switch (tipoData){
            case "Ano":
                dataIni = new Date();
                dataIni.setDate(01);
                dataIni.setFullYear(parseInt(req.body.anoBordo)-1);
                dataIni.setUTCMonth(1);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setDate(01);
                dataFim.setFullYear(parseInt(req.body.anoBordo)+1);
                dataFim.setUTCMonth(1);
                dataFim.setHours(0, 0, 0, 0);

                break;
            case "Ano/Mes":
                dataIni = new Date();
                console.log("req.body.mesBordo:"+req.body.mesBordo)
                let mesIni = parseInt(req.body.mesBordo);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoBordo);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                console.log("dataIni:"+dataIni)
                dataIni.setUTCMonth(mesIni);
                console.log("dataIni:"+dataIni)
                dataIni.setHours(0, 0, 0, 0);
                console.log("dataIni:"+dataIni)
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni+1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate()-1);
                dataFim.setHours(23, 59, 59, 0);

                break;
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(mes);
                seg.setDate(dia);
                seg.setHours(0, 0, 0, 0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(mes);
                sex.setDate(dia);
                sex.setHours(23, 59, 59, 0);

                switch (seg.getUTCDay()){
                    case 0://DOM
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                    case 1://SEG
                        sex.setUTCDate(sex.getUTCDate() + 4);
                        break;
                    case 2://TER
                        seg.setUTCDate(seg.getUTCDate() - 1);
                        sex.setUTCDate(sex.getUTCDate() + 3);
                        break;
                    case 3://QUA
                        seg.setUTCDate(seg.getUTCDate() - 2);
                        sex.setUTCDate(sex.getUTCDate() + 2);
                        break;
                    case 4://QUI
                        seg.setUTCDate(seg.getUTCDate() - 3);
                        sex.setUTCDate(sex.getUTCDate() + 1);
                        break;
                    case 5://SEX
                        seg.setUTCDate(seg.getUTCDate() - 4);
                        break;
                    case 6://SAB
                        seg.setUTCDate(seg.getUTCDate() - 5);
                        sex.setUTCDate(sex.getUTCDate() - 1);
                        break;
                    default:
                        seg.setUTCDate(seg.getUTCDate() + 1);
                        sex.setUTCDate(sex.getUTCDate() + 5);
                        break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();

                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(mes);
                dataIni.setDate(dia);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(mes);
                dataFim.setDate(dia);
                dataFim.setHours(23,59,59,0);

                break;
            default:
                
                break;
        }

        switch (tipoPessoa){
            case "Geral":
                if (isAgendaTerapeuta){
                    busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } , trat_terapeutaidpad: new ObjectId(idUsu) }
                } else {
                    busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } }
                }
                break;
            case "Beneficiario":
                if (isAgendaTerapeuta){
                    busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } , trat_beneid: req.body.tratBeneficiario , trat_terapeutaidpad: new ObjectId(idUsu) }
                } else {
                    busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } , trat_beneid: req.body.tratBeneficiario };
                }
                break;
            case "Terapeuta":
                /*
                if (isAgendaTerapeuta){
                    busca = { $or: [{ trat_terapeutaidpad: new ObjectId(idUsu) }, { trat_terapeutaidis: new ObjectId(idUsu) }, { trat_terapeutaidavd: new ObjectId(idUsu) }], $and: [{ trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } }] }
                    //busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } , trat_terapeutaidpad: new ObjectId(idUsu) }
                } else {
                */
                    busca = { $or: [{ trat_terapeutaidpad: req.body.tratTerapeuta }, { trat_terapeutaidis: req.body.tratTerapeuta }, { trat_terapeutaidavd: req.body.tratTerapeuta }], $and: [{ trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } }] }
                    //busca = { trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } , trat_terapeutaidpad: req.body.tratTerapeuta };
                /*
                }
                */
                break;
            default:
                break;
        }
        //console.log('listando plano de tratamento')
        Trat.find(busca).then((trat) =>{
            trat.forEach((b)=>{
                let datacad = new Date(b.trat_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                datacad = new Date(b.trat_tratdata)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.tratdata=fulldate;

                datacad = new Date(b.trat_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;
            })

            //console.log("trat:");
            //console.log(trat);
            //console.log("Listagem Realizada das Trateses!")
                Bene.find().then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    //console.log("Listagem Realizada bene!")
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Usuario.find().then((usuario)=>{
                            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        //console.log("Listagem Realizada Usuário!")
                        /*
                        if(resposta.sucesso == ""){
                            console.log(' objeto vazio');
                            flash.texto = ""
                            flash.sucesso = ""
                        } else {
                            console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                            flash.texto = resposta.texto
                            flash.sucesso = resposta.sucesso
                        }
                        */
                        flash.texto = ""
                        flash.sucesso = "true"
            res.render('area/plano/tratLis', {trats: trat, usuarios: usuario, terapeutas: terapeuta, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    carregaTrat(req,res){
        let idsBene = [];

        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                    bene.forEach((b)=>{
                                        idsBene.push(b._id)
                                    })
                                    Laudo.find({laudo_beneid: {$in:idsBene}}).then((laudo)=>{
                                        console.log("Listagem Realizada de beneficiarios")
                                        res.render("area/plano/tratCad", {laudos: laudo, convs: conv, terapias: terapia, usuarios: usuario, benes: bene})
             })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar plano de tratamento")
            res.redirect('admin/erro')
        })

    },

    carregaTratedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        Trat.findOne({_id : req.params.id}).then((trat)=>{
            console.log("Listagem Realizada de Planos de Tratamento")
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Laudo.find().then((laudo)=>{
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/plano/tratEdi", {trat, laudos: laudo,terapias: terapia, usuarios: usuario, benes: bene, usuarioAtual, perfilAtual})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    tratImp(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        let carimboUsuPad; //Carimbo padrão de Roberta
        let carimboUsuAvd; //Carimbo terapeuta padrão
        let carimboUsuIs; //Carimbo terapeuta IS
        let carimboRoute;
        Trat.findOne({_id : req.params.id}).then((trat)=>{
            let tratDataCadSimpleFormat = fncGeral.getData(trat.trat_datacad)
            Terapia.find().then((terapia)=>{
                Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    usuario.forEach((usu)=>{
                        if (trat.trat_planotipo == "Padrão" && (""+trat.trat_terapeutaidpad+"") == (""+usu._id+"")){
                            carimboUsuPad = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                        } else if (trat.trat_planotipo == "Ocupacional" && (""+trat.trat_terapeutaidis+"") == (""+usu._id+"")){
                            carimboUsuIs = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                        } else if (trat.trat_planotipo == "Ocupacional" && (""+trat.trat_terapeutaidavd+"") == (""+usu._id+"")){
                            carimboUsuAvd = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                        } else if ('62e008adea444f5b7a02c04f' == usu._id){
                            carimboRoute = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                        }
                    })
                    
                    Laudo.find().then((laudo)=>{
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                            //Busca nos usuários os carimbos dos Terapeutas identificados dentro do Plano de Tratamento incluindo o carimbo da Route
                            res.render("area/plano/tratImp", {trat, laudos: laudo,terapias: terapia, usuarios: usuario, benes: bene, usuarioAtual, perfilAtual, tratDataCadSimpleFormat, carimboRoute, carimboUsuPad, carimboUsuIs, carimboUsuAvd})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
   
    cadastraTrat(req,res){
        let resultado
        let flash = new Resposta();
        let cadastro = tratClass.tratAdicionar(req,res);//variavel para armazenar a função que armazena o async
        var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id

        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaTrat(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaTrat(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            tratClass.tratEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a lista de Plano de tratamento
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaTrat(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaTrat(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaTrat(req,res){
        let resposta = new Resposta()
        Trat.deleteOne({_id: req.params.id}).then(() =>{
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar o Plano de tratamento")
                res.render('admin/erro')
            }).finally(()=>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaTrat(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaTrat(req,res,resposta)
                }
            })
        })
    },

    lixoTrat(req,res){
        let resposta = new Resposta()
        let resultado
        try{
            tratClass.tratEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a lista de Plano de tratamento
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaTrat(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaTrat(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    }


}