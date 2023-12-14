//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Bordoamento 
const bordoClass = require("../models/bordo")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")

//Tabela Plano de Bordoamento 
const Bordo = mongoose.model("tb_bordo")

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

class BordoMapa{
    constructor(
        dt,
        especialidade,
        profissional,
        escola
        ){
        this.dt = dt,
        this.especialidade = especialidade,
        this.profissional = profissional,
        this.escola = escola
    }
}

module.exports = {
    listaBordo(req, res, resposta){
        let flash = new Resposta()
        let resultado;
        let bordo = [];
        console.log('listando Diários de Bordo')
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Escola.find().then((escola) =>{
                escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena a escola por nome
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                    console.log("Listagem Realizada Usuário!")
                    if(resposta.sucesso == ""){
                        //console.log(' objeto vazio');
                        flash.texto = "";
                        flash.sucesso = "";
                    } else {
                        //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                        flash.texto = resposta.texto;
                        flash.sucesso = resposta.sucesso;
                    }
                    res.render('area/bordo/bordoLis', {escolas: escola, bordos: bordo, terapeutas: terapeuta, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Bordo")
            res.redirect('admin/erro')
        })
    },
    filtraBordo(req, res){
        let tipoPessoa = req.body.bordoTipoPessoa;
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
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesBordo);//UTCMonth = 0-11
                let anoIni = parseInt(req.body.anoBordo);
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setHours(0, 0, 0, 0);
                
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
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } , bordo_terapeutaid: new ObjectId(idUsu) }
                } else {
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } }
                }
                break;
            case "Beneficiario":
                if (isAgendaTerapeuta){
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } , bordo_beneid: req.body.bordoBeneficiario , bordo_terapeutaid: new ObjectId(idUsu) }
                } else {
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } , bordo_beneid: req.body.bordoBeneficiario };
                }
                break;
            case "Terapeuta":
                if (isAgendaTerapeuta){
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } , bordo_terapeutaid: new ObjectId(idUsu) }
                } else {
                    busca = { bordo_dataativ: { $gte :new Date(dataIni), $lte:  new Date(dataFim), } , bordo_terapeutaid: req.body.bordoTerapeuta };
                }
                break;
            default:
                break;
        }

        console.log('listando Diários de Bordo')
        Bordo.find(busca).then((bordo) =>{
            console.log("Listagem Realizada dos Diários de Bordo!")
            bordo.forEach((b)=>{
                b.bordo_data = fncGeral.getDataRevert(fncGeral.getData(b.bordo_datacad))
            })
            bordo.forEach((c)=>{
                c.bordo_ativ = fncGeral.getDataRevert(fncGeral.getData(c.bordo_dataativ))
            })
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().then((escola) =>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena a escola por nome
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeutasina)=>{//Usuário c/ filtro de função = Terapeutas
                            terapeutasina.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                            console.log("Listagem Realizada Usuário!")
                            res.render('area/bordo/bordoLis', {escolas: escola, bordos: bordo, terapeutas: terapeuta, terapeutasinas: terapeutasina, benes: bene})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Bordo")
            res.redirect('admin/erro')
        })
    },
    carregaBordo(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Escola.find().sort({escola_nome: 1}).then((escola)=>{
                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                    res.render("area/bordo/bordoCad", {escolas: escola, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.redirect('admin/erro')
        })

    },
    carregaBordomapa(req,res){
        let seg = new Date();
        let sex = new Date();
        let rel = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeutasina)=>{//Usuário c/ filtro de função = Terapeutas
                terapeutasina.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                console.log("terapeutasina: "+terapeutasina.length)
                console.log("Listagem Realizada de Usuário")
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        console.log("Listagem Realizada de beneficiarios")
                        Escola.find().then((escola) =>{
                            escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                res.render("area/bordo/bordoMapa", {escolas: escola, terapeutas: terapeuta, terapeutasinas: terapeutasina, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
        })
    },
    carregaBordomapaFiltro(req,res){
        let u;
        let teraID;
        let usuId;
        let rel = [];
        let dt;
        let bene_nome;
        let terapiaAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new BordoMapa();//objeto para fazer push em BordoMapa
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let filtroBordoMapa= {bordo_beneid: req.body.bordoBeneid, bordo_datacad: { $gte: seg, $lte: sex}}

        Atend.find(filtroBordoMapa).then((at)=>{
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética     
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeutasina)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeutasina.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                    console.log("terapeutasina: "+terapeutasina.length)
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        Bene.find().then((bene)=>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            bene.some((b)=>{
                                if((""+b._id) === (""+req.body.bordoBeneid)){
                                    bene_nome = b.bene_nome;
                                    return true;
                                }
                                return false;
                            })
                            Conv.findOne({_id: conv_id}).then((conv)=>{
                                conv_nome = conv.conv_nome;
                                at.sort(function(a, b) {
                                    let d1 = new Date(a.atend_atenddata);
                                    let d2 = new Date(b.atend_atenddata);
                                    d1.setHours(0);
                                    d1.setMinutes(0);
                                    d1.setSeconds(0);
                                    d2.setHours(0);
                                    d2.setMinutes(0);
                                    d2.setSeconds(0);
                                    if(d1 == d2){
                                        return true;
                                    } else {
                                        if(d1 < d2){
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                at.forEach((atend)=>{
                                    rab.dt = (fncGeral.getData(atend.atend_atenddata));
                                    categorias = atend.atend_cartegoria
                                    switch (categorias){
                                        case "Apoio":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Extra":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Falta":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Falta Justificada":
                                            terapiaAtend = atend.atend_mergeterapiaid
                                            terapeutaAtend = atend.atend_mergeterapeutaid;;
                                            break;
                                        case "Glosa":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Padrão":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Pais":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        case "Substituição":
                                            terapiaAtend = atend.atend_mergeterapiaid;
                                            terapeutaAtend = atend.atend_mergeterapeutaid;
                                            break;
                                        case "Supervisão":
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                        default:
                                            terapiaAtend = atend.atend_terapiaid;
                                            terapeutaAtend = atend.atend_terapeutaid;
                                            break;
                                    }
                                    rab.especialidade = terapiaAtend;
                                    rab.profissional = terapeutaAtend;

                                    rel.push(rab);
                                    rab = new BordoMapa();
                                });
                                res.render("area/bordo/bordoMapa", {benes: bene, terapeutas: terapeuta, terapias: terapia, terapeutasinas: terapeutasina, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome})
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    bordoSuplis(req, res){
        Bordo.find().then((bordo) =>{
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Escola.find().then((escola) =>{
                escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena a escola por nome
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                    res.render('area/bordo/bordoSuplis', {escolas: escola, bordos: bordo, terapeutas: terapeuta, benes: bene})
                })})})}).catch((err) =>{
            console.log(err)
            res.redirect('admin/erro')
        })
    },
    carregaBordoedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Bordo.findById(req.params.id).then((bordo) =>{console.log("ID: "+bordo._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                        res.render("area/bordo/bordoEdi", {bordo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, benes: bene, usuarioAtual})
        })})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    

    cadastraBordo(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        bordoClass.bordoAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Diário de Bordo cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaBordo(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaBordo(req,res){
        let resultado
        let flash = new Resposta()
        try{
            bordoClass.bordoEditar(req,res).then((res)=>{
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
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem Realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaBordo(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaBordo(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaBordo(req,res){
        let resposta;
        let flash = new Resposta()
        Bordo.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Diário Bordo deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Diário Bordo";
                flash.sucesso = "false";
            }
            this.listaBordo(req,res, resposta)
        })
    }
}