//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Tratamento 
const tratClass = require("../models/trat")


//Classes Extrangeiras
const anoClass = require("../models/ano")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const laudoClass = require("../models/laudo")

//Tabela Plano de Tratamento 
var Trat = getModel("SoftRoute", 'tb_trat', tratClass.TratSchema)

//Tabelas Extrangeiras
var Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Laudo = getModel("SoftRoute", 'tb_laudo', laudoClass.LaudoSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    listaTrat(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        let filtro = { trat_lixo: { $ne: "true" } }; // Exclui os que têm trat_lixo = "true"

        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Realizada bene!")
            Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
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
                        res.render('area/plano/tratLis', {anos: ano, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraTratOLD(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Trat = getModel(db, 'tb_trat', tratClass.TratSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

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
                console.log("data: "+data)
                console.log("ano: "+ano)
                console.log("mes: "+mes)
                console.log("dia: "+dia)

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(parseInt(mes)-1);
                seg.setDate(dia);
                seg.setHours(0, 0, 0, 0);

                console.log("seg: "+seg)
                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(parseInt(mes)-1);
                sex.setDate(dia);
                sex.setHours(23, 59, 59, 0);

                console.log("sex: "+sex)
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
                console.log("dataIni: "+dataIni)
                console.log("dataFim: "+dataFim)

                break;
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(parseInt(mes)-1);
                dataIni.setDate(dia);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(parseInt(mes)-1);
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
        Trat.find(busca).then((trat) =>{//console.log('listando plano de tratamento')
            trat.forEach((b)=>{
                let datacad = new Date(b.trat_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                datacad = new Date(b.trat_tratdata)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.tratdata=fulldate;

                datacad = new Date(b.trat_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;
            })

            Bene.find({bene_nome: { $not: /\./ }}).then((bene) => {
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    
                    // === BUSCA TERAPEUTAS (COM FILTRO ESPECÍFICO) ===
                    Usuario.find({
                        "usuario_status":{$in: ["Ativo","Inativo"]}, 
                        $or: [
                            {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                            {"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                        ]
                    }).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                        
                        // === BUSCA USUÁRIOS GERAL (para selects E modal) ===
                        Usuario.find().then((usuario)=>{
                            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                            
                            // === 👇 NOVO: BUSCAR NOME DO USUÁRIO LOGADO PARA O MODAL 👇 ===
                            const usuarioLogado = usuario.find(u => u._id.toString() === idUsu);
                            const usuarioNomeLogado = usuarioLogado 
                                ? (usuarioLogado.usuario_nomecompleto || usuarioLogado.usuario_nome || 'Usuário') 
                                : 'Usuário';
                            // === 👆 FIM DO BLOCO NOVO 👆 ===

                            flash.texto = "";
                            flash.sucesso = "true";
                            
                            // === 👇 RENDER COM TODAS AS VARIÁVEIS CORRETAS 👇 ===
                            res.render('area/plano/tratLis', {
                                anos: ano, 
                                trats: trat, 
                                usuarios: usuario,        // lista geral (para selects)
                                terapeutas: terapeuta,    // lista filtrada (para selects de terapeuta)
                                benes: bene, 
                                perfilAtual: perfilAtual, 
                                flash: flash,
                                usuarioNomeLogado: usuarioNomeLogado  // 👈 NOVO: nome para o modal
                            });
                            // === 👆 FIM DO RENDER 👆 ===
                            
                        }).catch((err) => {
                            console.log("Erro ao buscar usuários:", err);
                            req.flash("error_message", "Erro ao carregar usuários");
                            res.redirect('/admin/erro');
                        });
                        
                    }).catch((err) => {
                        console.log("Erro ao buscar terapeutas:", err);
                        req.flash("error_message", "Erro ao carregar terapeutas");
                        res.redirect('/admin/erro');
                    });
                    
                }).catch((err) => {
                    console.log("Erro ao buscar anos:", err);
                    req.flash("error_message", "Erro ao carregar anos");
                    res.redirect('/admin/erro');
                });
                
            }).catch((err) => {
                console.log("Erro ao buscar beneficiários:", err);
                req.flash("error_message", "Erro ao carregar beneficiários");
                res.redirect('/admin/erro');
            });
            
        }).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    filtraTrat_OLD(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Trat = getModel(db, 'tb_trat', tratClass.TratSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
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
        let arrayIds = ['62421903a12aa557219a0fd3','6242191fa12aa557219a0fd9','6242190fa12aa557219a0fd6','624218f5a12aa557219a0fd0'];
        let perfilAtual = req.cookies['lvlUsu'];

        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        // === DEFINIÇÃO DO PERÍODO (switch tipoData) ===
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
                let mesIni = parseInt(req.body.mesBordo);
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
                console.log("data: "+data)
                console.log("ano: "+ano)
                console.log("mes: "+mes)
                console.log("dia: "+dia)

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(parseInt(mes)-1);
                seg.setDate(dia);
                seg.setHours(0, 0, 0, 0);

                console.log("seg: "+seg)
                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(parseInt(mes)-1);
                sex.setDate(dia);
                sex.setHours(23, 59, 59, 0);

                console.log("sex: "+sex)
                switch (seg.getUTCDay()){
                    case 0: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                    case 1: sex.setUTCDate(sex.getUTCDate() + 4); break;
                    case 2: seg.setUTCDate(seg.getUTCDate() - 1); sex.setUTCDate(sex.getUTCDate() + 3); break;
                    case 3: seg.setUTCDate(seg.getUTCDate() - 2); sex.setUTCDate(sex.getUTCDate() + 2); break;
                    case 4: seg.setUTCDate(seg.getUTCDate() - 3); sex.setUTCDate(sex.getUTCDate() + 1); break;
                    case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
                    case 6: seg.setUTCDate(seg.getUTCDate() - 5); sex.setUTCDate(sex.getUTCDate() - 1); break;
                    default: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();
                console.log("dataIni: "+dataIni)
                console.log("dataFim: "+dataFim)
                break;
                
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0,4);
                mes = data.substring(5,7);
                dia = data.substring(8,10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(parseInt(mes)-1);
                dataIni.setDate(dia);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(parseInt(mes)-1);
                dataFim.setDate(dia);
                dataFim.setHours(23,59,59,0);
                break;
                
            default:
                break;
        }

        // === DEFINIÇÃO DO FILTRO POR PESSOA (switch tipoPessoa) ===
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
                busca = { $or: [{ trat_terapeutaidpad: req.body.tratTerapeuta }, { trat_terapeutaidis: req.body.tratTerapeuta }, { trat_terapeutaidavd: req.body.tratTerapeuta }], $and: [{ trat_tratdata: { $gte :new Date(dataIni), $lte:  new Date(dataFim) } }] }
                break;
                
            default:
                break;
        }
        
        // === 👇 NOVO: FILTRO PARA EXCLUIR REGISTROS DA LIXEIRA 👇 ===
        console.log('🔍 [filtraTrat] Busca antes do filtro lixeira:', JSON.stringify(busca));
        
        if (busca.$or || busca.$and) {
            // Se já tem operadores lógicos, combinamos com $and
            busca = {
                $and: [
                    busca,
                    { trat_lixo: { $ne: "true" } }
                ]
            };
        } else {
            // Busca simples: adiciona o filtro direto
            busca.trat_lixo = { $ne: "true" };
        }
        
        console.log('🔍 [filtraTrat] Busca FINAL com filtro lixeira:', JSON.stringify(busca));
        // === 👆 FIM DO FILTRO DE LIXEIRA 👆 ===

        // === EXECUTA A BUSCA COM OS FILTROS ===
        Trat.find(busca).then((trat) =>{
            console.log('🔍 [filtraTrat] Registros encontrados:', trat.length);
            
            trat.forEach((b)=>{
                let datacad = new Date(b.trat_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                datacad = new Date(b.trat_tratdata)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.tratdata=fulldate;

                datacad = new Date(b.trat_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){ mes = "0"+mes; }
                if (dia.length == 1){ dia = "0"+dia; }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;
            })

            Bene.find({bene_nome: { $not: /\./ }}).then((bene) => {
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                
                Ano.find().sort({ ano_nome: 1 }).then((ano)=>{
                    
                    // === BUSCA TERAPEUTAS (COM FILTRO ESPECÍFICO) ===
                    Usuario.find({
                        "usuario_status":{$in: ["Ativo","Inativo"]}, 
                        $or: [
                            {"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},
                            {"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}
                        ]
                    }).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                        
                        // === BUSCA USUÁRIOS GERAL (para selects E modal) ===
                        Usuario.find().then((usuario)=>{
                            usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                            
                            // === BUSCAR NOME DO USUÁRIO LOGADO PARA O MODAL ===
                            const usuarioLogado = usuario.find(u => u._id.toString() === idUsu);
                            const usuarioNomeLogado = usuarioLogado 
                                ? (usuarioLogado.usuario_nomecompleto || usuarioLogado.usuario_nome || 'Usuário') 
                                : 'Usuário';

                            flash.texto = "";
                            flash.sucesso = "true";
                            
                            console.log('🔍 [filtraTrat] Renderizando view com usuarioNomeLogado:', usuarioNomeLogado);
                             console.log('🔍 [filtraTrat] Renderizando view com pérfil do Usuário:', perfilAtual);
                           // === 👇 NOVO: PASSAR VALORES DOS FILTROS PARA PERSISTÊNCIA 👇 ===
                            res.render('area/plano/tratLis', {
                                anos: ano, 
                                trats: trat, 
                                usuarios: usuario,
                                terapeutas: terapeuta,
                                benes: bene, 
                                perfilAtual: perfilAtual, 
                                flash: flash,
                                usuarioNomeLogado: usuarioNomeLogado,
                                
                                // === VARIÁVEIS PARA PERSISTÊNCIA DE FILTROS ===
                                carregaFiltro: "true",                    // 👈 Ativa restauração no frontend
                                tipoData: req.body.tipoData,              // 👈 Ano/Mes, Semana, Dia
                                tipoPessoa: req.body.tratTipoPessoa,      // 👈 Geral, Beneficiario, Terapeuta
                                anoBordo: req.body.anoBordo,              // 👈 Valor do ano selecionado
                                mesBordo: req.body.mesBordo,              // 👈 Valor do mês selecionado
                                dataFinal: req.body.dataFinal,            // 👈 Data formatada
                                tratBeneficiario: req.body.tratBeneficiario,  // 👈 ID do beneficiário
                                tratTerapeuta: req.body.tratTerapeuta     // 👈 ID do terapeuta
                            });
                            // === 👆 FIM DO RENDER COM FILTROS 👆 ===
                            
                        }).catch((err) => {
                            console.log("Erro ao buscar usuários:", err);
                            req.flash("error_message", "Erro ao carregar usuários");
                            res.redirect('/admin/erro');
                        });
                        
                    }).catch((err) => {
                        console.log("Erro ao buscar terapeutas:", err);
                        req.flash("error_message", "Erro ao carregar terapeutas");
                        res.redirect('/admin/erro');
                    });
                    
                }).catch((err) => {
                    console.log("Erro ao buscar anos:", err);
                    req.flash("error_message", "Erro ao carregar anos");
                    res.redirect('/admin/erro');
                });
                
            }).catch((err) => {
                console.log("Erro ao buscar beneficiários:", err);
                req.flash("error_message", "Erro ao carregar beneficiários");
                res.redirect('/admin/erro');
            });
            
        }).catch((err) =>{
            console.log('❌ [filtraTrat] ERRO na busca principal:', err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
        listaTrat(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        let Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];

        Promise.all([
            Bene.find({ bene_nome: { $not: /\./ } }).sort({ bene_nome: 1 }),
            Ano.find().sort({ ano_nome: 1 }),
            Usuario.find({
                "usuario_status": { $in: ["Ativo", "Inativo"] },
                $or: [
                    { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                    { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            }).sort({ usuario_nome: 1 })
        ]).then(([bene, ano, terapeuta]) => {
            res.render('area/plano/tratLis', {
                anos: ano,
                terapeutas: terapeuta,
                usuarios: terapeuta,
                benes: bene,
                perfilAtual,
                flash: resposta.sucesso === "true" ? resposta : { sucesso: "", texto: "" },
                
                // Padrão universal de filtros vazios
                carregaFiltro: "false",
                filtroTipo: "Ano/Mes",
                filtroAno: new Date().getFullYear().toString(),
                filtroMes: new Date().getMonth().toString(),
                filtroData: "",
                filtroTipoPessoa: "Geral",
                filtroBeneficiario: "",
                filtroTerapeuta: ""
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },

    filtraTrat_OLD(req, res) {
        let db = req.cookies['preferredDb'];
        let Trat = getModel(db, 'tb_trat', tratClass.TratSchema);
        let Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        let flash = new Resposta();
        let tipoPessoa = req.body.atendTipoPessoa || "Geral";
        let tipoData = req.body.tipoData || "Ano/Mes";
        let dataIni, dataFim, seg, sex, busca;
        let isAgendaTerapeuta = false;
        let idUsu = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        let arrayIds = ['62421903a12aa557219a0fd3', '6242191fa12aa557219a0fd9', '6242190fa12aa557219a0fd6', '624218f5a12aa557219a0fd0'];

        arrayIds.forEach((id) => { if (id == lvlUsu) isAgendaTerapeuta = true; });

        // === 1. DEFINIÇÃO DO PERÍODO ===
        switch (tipoData) {
            case "Ano":
                dataIni = new Date(); dataIni.setDate(1); dataIni.setFullYear(parseInt(req.body.anoAtend) - 1); dataIni.setUTCMonth(1); dataIni.setHours(0, 0, 0, 0);
                dataFim = new Date(); dataFim.setDate(1); dataFim.setFullYear(parseInt(req.body.anoAtend) + 1); dataFim.setUTCMonth(1); dataFim.setHours(0, 0, 0, 0);
                break;
            case "Ano/Mes":
                dataIni = new Date(); dataIni.setDate(1); dataIni.setFullYear(parseInt(req.body.anoAtend)); dataIni.setUTCMonth(parseInt(req.body.mesAtend)); dataIni.setHours(0, 0, 0, 0);
                dataFim = new Date(); dataFim.setFullYear(parseInt(req.body.anoAtend)); dataFim.setUTCMonth(parseInt(req.body.mesAtend) + 1); dataFim.setDate(0); dataFim.setHours(23, 59, 59, 0);
                break;
            case "Semana":
                let dataS = req.body.dataFinal;
                let anoS = dataS.substring(0, 4), mesS = dataS.substring(5, 7), diaS = dataS.substring(8, 10);
                seg = new Date(); seg.setFullYear(anoS); seg.setUTCMonth(parseInt(mesS) - 1); seg.setDate(diaS); seg.setHours(0, 0, 0, 0);
                sex = new Date(); sex.setFullYear(anoS); sex.setUTCMonth(parseInt(mesS) - 1); sex.setDate(diaS); sex.setHours(23, 59, 59, 0);
                // (Mantenha sua lógica de ajuste de dias da semana original aqui)
                dataIni = seg.toISOString(); dataFim = sex.toISOString();
                break;
            case "Dia":
                let dD = req.body.dataFinal;
                let aD = dD.substring(0, 4), mD = dD.substring(5, 7), diD = dD.substring(8, 10);
                dataIni = new Date(); dataIni.setFullYear(aD); dataIni.setUTCMonth(parseInt(mD) - 1); dataIni.setDate(diD); dataIni.setHours(0, 0, 0, 0);
                dataFim = new Date(); dataFim.setFullYear(aD); dataFim.setUTCMonth(parseInt(mD) - 1); dataFim.setDate(diD); dataFim.setHours(23, 59, 59, 0);
                break;
        }

        // === 2. DEFINIÇÃO DO FILTRO POR PESSOA ===
        switch (tipoPessoa) {
            case "Geral":
                busca = isAgendaTerapeuta ? { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_terapeutaidpad: new ObjectId(idUsu) } : { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) } };
                break;
            case "Beneficiario":
                busca = isAgendaTerapeuta ? { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_beneid: req.body.atendBeneficiario, trat_terapeutaidpad: new ObjectId(idUsu) } : { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { $or: [{ trat_terapeutaidpad: req.body.atendTerapeuta }, { trat_terapeutaidis: req.body.atendTerapeuta }, { trat_terapeutaidavd: req.body.atendTerapeuta }], $and: [{ trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) } }] };
                break;
        }

        // Filtro de Lixeira
        busca = busca.$or || busca.$and ? { $and: [busca, { trat_lixo: { $ne: "true" } }] } : { ...busca, trat_lixo: { $ne: "true" } };

        // === 3. EXECUTA A BUSCA ===
        Trat.find(busca).then((trat) => {
            trat.forEach((b) => {
                let dCad = new Date(b.trat_datacad);
                b.datacad = `${dCad.getFullYear()}-${String(dCad.getMonth()+1).padStart(2,'0')}-${String(dCad.getUTCDate()).padStart(2,'0')}`;
                let dTrat = new Date(b.trat_tratdata);
                b.tratdata = `${dTrat.getFullYear()}-${String(dTrat.getMonth()+1).padStart(2,'0')}-${String(dTrat.getUTCDate()).padStart(2,'0')}`;
                let dEdi = new Date(b.trat_dataedi);
                b.dataedi = `${dEdi.getFullYear()}-${String(dEdi.getMonth()+1).padStart(2,'0')}-${String(dEdi.getUTCDate()).padStart(2,'0')}`;
            });

            Promise.all([
                Bene.find({ bene_nome: { $not: /\./ } }).sort({ bene_nome: 1 }),
                Ano.find().sort({ ano_nome: 1 }),
                Usuario.find({ "usuario_status": { $in: ["Ativo", "Inativo"] }, $or: [{ "usuario_funcaoid": "6241030bfbcc51f47c720a0b" }, { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }] }).sort({ usuario_nome: 1 }),
                Usuario.find().sort({ usuario_nome: 1 })
            ]).then(([bene, ano, terapeuta, usuarios]) => {
                
                const usuarioLogado = usuarios.find(u => u._id.toString() === idUsu);
                const usuarioNomeLogado = usuarioLogado ? (usuarioLogado.usuario_nomecompleto || usuarioLogado.usuario_nome || 'Usuário') : 'Usuário';

                res.render('area/plano/tratLis', {
                    anos: ano, trats: trat, usuarios: usuarios, terapeutas: terapeuta, benes: bene,
                    perfilAtual: perfilAtual, flash: { texto: "", sucesso: "true" },
                    usuarioNomeLogado: usuarioNomeLogado,
                    
                    // === VARIÁVEIS UNIVERSAIS DE FILTRO (Padrão Guia e Senha) ===
                    carregaFiltro: "true",
                    filtroTipo: req.body.tipoData,
                    filtroAno: req.body.anoAtend,
                    filtroMes: req.body.mesAtend,
                    filtroData: req.body.dataFinal ? req.body.dataFinal.split('T')[0] : "",
                    filtroTipoPessoa: req.body.atendTipoPessoa,
                    filtroBeneficiario: req.body.atendBeneficiario,
                    filtroTerapeuta: req.body.atendTerapeuta
                });
            }).catch(err => { console.log("Erro ao buscar dados auxiliares:", err); res.redirect('/admin/erro'); });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
        filtraTrat(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        let Trat = getModel(db, 'tb_trat', tratClass.TratSchema);
        let Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

        let flash = new Resposta();
        
        // === NOMES UNIVERSAIS DO FRONTEND ===
        let tipoPessoa = req.body.atendTipoPessoa || "Geral"; 
        let tipoData = req.body.tipoData || "Ano/Mes";
        
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
        let arrayIds = ['62421903a12aa557219a0fd3', '6242191fa12aa557219a0fd9', '6242190fa12aa557219a0fd6', '624218f5a12aa557219a0fd0'];
        let perfilAtual = req.cookies['lvlUsu'];

        arrayIds.forEach((id) => {
            if (id == lvlUsu) {
                isAgendaTerapeuta = true;
            }
        });

        // === DEFINIÇÃO DO PERÍODO (switch tipoData) ===
        switch (tipoData) {
            case "Ano":
                dataIni = new Date();
                dataIni.setDate(01);
                dataIni.setFullYear(parseInt(req.body.anoAtend) - 1); // UNIVERSAL: anoAtend
                dataIni.setUTCMonth(1);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setDate(01);
                dataFim.setFullYear(parseInt(req.body.anoAtend) + 1); // UNIVERSAL: anoAtend
                dataFim.setUTCMonth(1);
                dataFim.setHours(0, 0, 0, 0);
                break;
                
            case "Ano/Mes":
                dataIni = new Date();
                let mesIni = parseInt(req.body.mesAtend); // UNIVERSAL: mesAtend
                let anoIni = parseInt(req.body.anoAtend); // UNIVERSAL: anoAtend
                
                dataIni.setDate(01);
                dataIni.setFullYear(anoIni);
                dataIni.setUTCMonth(mesIni);
                dataIni.setHours(0, 0, 0, 0);
                
                dataFim = new Date();
                dataFim.setFullYear(anoIni);
                dataFim.setUTCMonth(mesIni + 1);
                dataFim.setDate(01);
                dataFim.setDate(dataFim.getDate() - 1);
                dataFim.setHours(23, 59, 59, 0);
                break;
                
            case "Semana":
                data = req.body.dataFinal;
                ano = data.substring(0, 4);
                mes = data.substring(5, 7);
                dia = data.substring(8, 10);

                seg = new Date();
                seg.setFullYear(ano);
                seg.setUTCMonth(parseInt(mes) - 1);
                seg.setDate(dia);
                seg.setHours(0, 0, 0, 0);

                sex = new Date();
                sex.setFullYear(ano);
                sex.setUTCMonth(parseInt(mes) - 1);
                sex.setDate(dia);
                sex.setHours(23, 59, 59, 0);

                switch (seg.getUTCDay()) {
                    case 0: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                    case 1: sex.setUTCDate(sex.getUTCDate() + 4); break;
                    case 2: seg.setUTCDate(seg.getUTCDate() - 1); sex.setUTCDate(sex.getUTCDate() + 3); break;
                    case 3: seg.setUTCDate(seg.getUTCDate() - 2); sex.setUTCDate(sex.getUTCDate() + 2); break;
                    case 4: seg.setUTCDate(seg.getUTCDate() - 3); sex.setUTCDate(sex.getUTCDate() + 1); break;
                    case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
                    case 6: seg.setUTCDate(seg.getUTCDate() - 5); sex.setUTCDate(sex.getUTCDate() - 1); break;
                    default: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                }
                dataIni = seg.toISOString();
                dataFim = sex.toISOString();
                break;
                
            case "Dia":
                data = req.body.dataFinal;
                ano = data.substring(0, 4);
                mes = data.substring(5, 7);
                dia = data.substring(8, 10);

                dataIni = new Date();
                dataIni.setFullYear(ano);
                dataIni.setUTCMonth(parseInt(mes) - 1);
                dataIni.setDate(dia);
                dataIni.setHours(0, 0, 0, 0);

                dataFim = new Date();
                dataFim.setFullYear(ano);
                dataFim.setUTCMonth(parseInt(mes) - 1);
                dataFim.setDate(dia);
                dataFim.setHours(23, 59, 59, 0);
                break;
                
            default:
                break;
        }

        // === DEFINIÇÃO DO FILTRO POR PESSOA (switch tipoPessoa) ===
        switch (tipoPessoa) {
            case "Geral":
                if (isAgendaTerapeuta) {
                    busca = { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_terapeutaidpad: new ObjectId(idUsu) };
                } else {
                    busca = { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) } };
                }
                break;
                
            case "Beneficiario":
                if (isAgendaTerapeuta) {
                    busca = { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_beneid: req.body.atendBeneficiario, trat_terapeutaidpad: new ObjectId(idUsu) }; // UNIVERSAL
                } else {
                    busca = { trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }, trat_beneid: req.body.atendBeneficiario }; // UNIVERSAL
                }
                break;
                
            case "Terapeuta":
                busca = { 
                    $or: [
                        { trat_terapeutaidpad: req.body.atendTerapeuta }, // UNIVERSAL
                        { trat_terapeutaidis: req.body.atendTerapeuta },  // UNIVERSAL
                        { trat_terapeutaidavd: req.body.atendTerapeuta }  // UNIVERSAL
                    ], 
                    $and: [{ trat_tratdata: { $gte: new Date(dataIni), $lte: new Date(dataFim) } }] 
                };
                break;
                
            default:
                break;
        }
        
        // === FILTRO PARA EXCLUIR REGISTROS DA LIXEIRA ===
        if (busca.$or || busca.$and) {
            busca = {
                $and: [
                    busca,
                    { trat_lixo: { $ne: "true" } }
                ]
            };
        } else {
            busca.trat_lixo = { $ne: "true" };
        }

        // === EXECUTA A BUSCA COM OS FILTROS ===
        Trat.find(busca).then((trat) => {
            trat.forEach((b) => {
                let datacad = new Date(b.trat_datacad);
                let mesCad = (datacad.getMonth() + 1).toString();
                let diaCad = (datacad.getUTCDate()).toString();
                if (mesCad.length == 1) { mesCad = "0" + mesCad; }
                if (diaCad.length == 1) { diaCad = "0" + diaCad; }
                b.datacad = (datacad.getFullYear() + "-" + mesCad + "-" + diaCad).toString();
                
                let datatrata = new Date(b.trat_tratdata);
                let mesTrat = (datatrata.getMonth() + 1).toString();
                let diaTrat = (datatrata.getUTCDate()).toString();
                if (mesTrat.length == 1) { mesTrat = "0" + mesTrat; }
                if (diaTrat.length == 1) { diaTrat = "0" + diaTrat; }
                b.tratdata = (datatrata.getFullYear() + "-" + mesTrat + "-" + diaTrat).toString();

                let dataedi = new Date(b.trat_dataedi);
                let mesEdi = (dataedi.getMonth() + 1).toString();
                let diaEdi = (dataedi.getUTCDate()).toString();
                if (mesEdi.length == 1) { mesEdi = "0" + mesEdi; }
                if (diaEdi.length == 1) { diaEdi = "0" + diaEdi; }
                b.dataedi = (dataedi.getFullYear() + "-" + mesEdi + "-" + diaEdi).toString();
            });

            Bene.find({ bene_nome: { $not: /\./ } }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                
                Ano.find().sort({ ano_nome: 1 }).then((ano) => {
                    Usuario.find({
                        "usuario_status": { $in: ["Ativo", "Inativo"] }, 
                        $or: [
                            { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                            { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                        ]
                    }).then((terapeuta) => {
                        terapeuta.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                        
                        Usuario.find().then((usuario) => {
                            usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);
                            
                            const usuarioLogado = usuario.find(u => u._id.toString() === idUsu);
                            const usuarioNomeLogado = usuarioLogado 
                                ? (usuarioLogado.usuario_nomecompleto || usuarioLogado.usuario_nome || 'Usuário') 
                                : 'Usuário';

                            flash.texto = "";
                            flash.sucesso = "true";
                            
                            // === RENDER COM VARIÁVEIS UNIVERSAIS DE FILTRO ===
                            res.render('area/plano/tratLis', {
                                anos: ano, 
                                trats: trat, 
                                usuarios: usuario,
                                terapeutas: terapeuta,
                                benes: bene, 
                                perfilAtual: perfilAtual, 
                                flash: flash,
                                usuarioNomeLogado: usuarioNomeLogado,
                                
                                // Padrão Universal (Prefixo filtro...)
                                carregaFiltro: "true",
                                filtroTipo: req.body.tipoData,
                                filtroAno: req.body.anoAtend,
                                filtroMes: req.body.mesAtend,
                                filtroData: req.body.dataFinal ? req.body.dataFinal.split('T')[0] : "",
                                filtroTipoPessoa: req.body.atendTipoPessoa,
                                filtroBeneficiario: req.body.atendBeneficiario,
                                filtroTerapeuta: req.body.atendTerapeuta
                            });
                            
                        }).catch((err) => {
                            console.log("Erro ao buscar usuários:", err);
                            req.flash("error_message", "Erro ao carregar usuários");
                            res.redirect('/admin/erro');
                        });
                        
                    }).catch((err) => {
                        console.log("Erro ao buscar terapeutas:", err);
                        req.flash("error_message", "Erro ao carregar terapeutas");
                        res.redirect('/admin/erro');
                    });
                    
                }).catch((err) => {
                    console.log("Erro ao buscar anos:", err);
                    req.flash("error_message", "Erro ao carregar anos");
                    res.redirect('/admin/erro');
                });
                
            }).catch((err) => {
                console.log("Erro ao buscar beneficiários:", err);
                req.flash("error_message", "Erro ao carregar beneficiários");
                res.redirect('/admin/erro');
            });
            
        }).catch((err) => {
            console.log('❌ [filtraTrat] ERRO na busca principal:', err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    carregaTrat(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)

        let idsBene = [];
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Bene.find({bene_nome: { $not: /\./ } }).then((bene) => {//bene_status: "Ativo", 
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
        let db = req.cookies['preferredDb'];
        Trat = getModel(db, 'tb_trat', tratClass.TratSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        Trat.findOne({_id : req.params.id}).then((trat)=>{
            console.log("Listagem Realizada de Planos de Tratamento")
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    Laudo.find().then((laudo)=>{
                        Bene.find({bene_nome: { $not: /\./ } }).then((bene) => {//bene_status: "Ativo", 
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/plano/tratEdi", {trat, laudos: laudo,terapias: terapia, usuarios: usuario, benes: bene, usuarioAtual, perfilAtual})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    tratImp_OLD(req,res){
        let db = req.cookies['preferredDb'];
        Trat = getModel(db, 'tb_trat', tratClass.TratSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)

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
                        if (usu.usuario_carimbo != undefined){
                            if (trat.trat_planotipo == "Padrão" && (""+trat.trat_terapeutaidpad+"") == (""+usu._id+"")){
                                carimboUsuPad = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                            } else if (trat.trat_planotipo == "Ocupacional" && (""+trat.trat_terapeutaidis+"") == (""+usu._id+"")){
                                carimboUsuIs = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                            } else if (trat.trat_planotipo == "Ocupacional" && (""+trat.trat_terapeutaidavd+"") == (""+usu._id+"")){
                                carimboUsuAvd = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                            } else if ('62e008adea444f5b7a02c04f' == usu._id){
                                carimboRoute = new Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                            }
                        }
                    })
                    
                    Laudo.find().then((laudo)=>{
                        Bene.find({bene_nome: { $not: /\./ } }).then((bene) => {//bene_status: "Ativo", 
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
    async tratImp(req, res) {
    try {
        // 1. Variáveis de contexto
        const db = req.cookies['preferredDb'];
        const usuarioAtual = req.cookies['idUsu'];
        const perfilAtual = req.cookies['lvlUsu'];
        
        // CAPTURA O FILTRO DA URL (se existir), senão deixa vazio
        const mesanoFiltro = req.query.mesano || ''; 

        // 2. Inicialização dos Models
        const Trat = getModel(db, 'tb_trat', tratClass.TratSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        const Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema);
        const Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema); // Ajuste o nome do model se for diferente

        // 3. Busca principal do tratamento
        const trat = await Trat.findOne({ _id: req.params.id });
        if (!trat) {
            req.flash("error_message", "Plano de tratamento não encontrado!");
            return res.redirect('/area/plano'); // Ou a rota de lista que você usar
        }

        const tratDataCadSimpleFormat = fncGeral.getData(trat.trat_datacad);

        // 4. Busca dos dados auxiliares em paralelo (muito mais rápido que um .then() dentro do outro)
        const [terapia, usuarios, laudo, bene] = await Promise.all([
            Terapia.find(),
            Usuario.find(),
            Laudo.find(),
            Bene.find({ bene_nome: { $not: /\./ } })
        ]);

        // 5. Ordenação (mantendo sua lógica original de normalização)
        usuarios.sort((a, b) => {
            const nomeA = a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            const nomeB = b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return nomeA > nomeB ? 1 : (nomeB > nomeA ? -1 : 0);
        });

        bene.sort((a, b) => {
            const nomeA = a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            const nomeB = b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
            return nomeA > nomeB ? 1 : (nomeB > nomeA ? -1 : 0);
        });

        // 6. Processamento dos Carimbos
        let carimboUsuPad, carimboUsuAvd, carimboUsuIs, carimboRoute;
        
        usuarios.forEach((usu) => {
            if (usu.usuario_carimbo) {
                const carimboBase64 = Buffer.from(usu.usuario_carimbo, 'binary').toString('base64');
                const idUsuString = String(usu._id);

                if (trat.trat_planotipo === "Padrão" && String(trat.trat_terapeutaidpad) === idUsuString) {
                    carimboUsuPad = carimboBase64;
                } else if (trat.trat_planotipo === "Ocupacional" && String(trat.trat_terapeutaidis) === idUsuString) {
                    carimboUsuIs = carimboBase64;
                } else if (trat.trat_planotipo === "Ocupacional" && String(trat.trat_terapeutaidavd) === idUsuString) {
                    carimboUsuAvd = carimboBase64;
                } else if (idUsuString === '62e008adea444f5b7a02c04f') {
                    carimboRoute = carimboBase64;
                }
            }
        });

        // 7. Renderização da View enviando o mesanoFiltro
        res.render("area/plano/tratImp", {
            trat,
            laudos: laudo,
            terapias: terapia,
            usuarios,
            benes: bene,
            usuarioAtual,
            perfilAtual,
            tratDataCadSimpleFormat,
            carimboRoute,
            carimboUsuPad,
            carimboUsuIs,
            carimboUsuAvd,
            mesanoFiltro // <-- NOVO: Envia o valor para a view
        });

    } catch (err) {
        console.error("Erro em tratImp:", err);
        req.flash("error_message", "Houve um erro ao realizar as listas!");
        res.render('admin/erro');
        // Ou res.redirect('/area/plano'); dependendo do seu fluxo de erro
    }
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

    lixoTratOLD(req, res) {
        console.log('🔍 [lixoTrat] Iniciando controlador de exclusão lógica');
        console.log('🔍 [lixoTrat] req.params.id:', req.params.id);
        console.log('🔍 [lixoTrat] req.query.motivo:', req.query.motivo);
        console.log('🔍 [lixoTrat] req.body (filtros):', req.body);
        
        let resposta = new Resposta();
        
        console.log('🔍 [lixoTrat] Chamando tratClass.tratLixo...');
        
        tratClass.tratLixo(req, res).then((retorno) => {
            console.log('🔍 [lixoTrat] Retorno de tratLixo:', retorno);
            
            if(retorno.sucesso){
                console.log('✅ [lixoTrat] Plano enviado para lixeira com sucesso!');
                req.flash("sucesso", "true");
                req.flash("texto", "Plano enviado para lixeira com sucesso!");
            } else {
                console.log('❌ [lixoTrat] Erro ao enviar para lixeira:', retorno.erro);
                req.flash("sucesso", "false");
                req.flash("texto", "Erro: " + retorno.erro);
            }
            
            // === 🔁 SOLUÇÃO: CHAMAR DIRETAMENTE filtraTrat COM OS MESMOS FILTROS ===
            // Em vez de redirecionar (que perde o body POST), chamamos a função
            // mantendo req.body com os filtros originais
            console.log('🔁 [lixoTrat] Chamando filtraTrat para manter filtros...');
            
            // Cria uma nova resposta para a listagem
            const respostaLista = new Resposta();
            respostaLista.texto = req.flash("texto") || "Plano enviado para lixeira com sucesso!";
            respostaLista.sucesso = req.flash("sucesso") || "true";
            
            // Chama filtraTrat com o mesmo req (mantém body com filtros)
            this.filtraTrat(req, res, respostaLista);
            // === 👆 FIM DA SOLUÇÃO 👆 ===
            
        }).catch((err) => {
            console.error('💥 [lixoTrat] Erro inesperado:', err);
            console.error('💥 [lixoTrat] Stack:', err.stack);
            req.flash("sucesso", "false");
            req.flash("texto", "Erro interno ao processar exclusão");
            
            // Fallback: chama lista geral
            const respostaLista = new Resposta();
            respostaLista.texto = "Erro interno";
            respostaLista.sucesso = "false";
            this.listaTrat(req, res, respostaLista);
        });
    },
    // === CONTROLADOR: ENVIAR PARA LIXEIRA COM VERIFICAÇÃO FAIL-SAFE ===
lixoTrat(req, res) {
    console.log('🔍 [lixoTrat] Iniciando controlador de exclusão lógica');
    console.log('🔍 [lixoTrat] URL original:', req.originalUrl);
    console.log('🔍 [lixoTrat] req.params.id:', req.params.id);
    
    // === 🔐 VERIFICAÇÃO DE PERMISSÃO (FAIL-SAFE) ===
    try {
        const perfilAtual = req.cookies['lvlUsu'];
        // IDs como string (ObjectId do MongoDB em formato string)
        const perfisPermitidos = ['62421801a12aa557219a0fb9', '62421857a12aa557219a0fc1'];
        
        console.log('🔍 [lixoTrat] perfilAtual:', perfilAtual);
        
        // ✅ FAIL-SAFE: Se não tiver perfil, ou não estiver na lista, NEGUE acesso
        if (!perfilAtual || !perfisPermitidos.includes(perfilAtual)) {
            console.log('🚫 [lixoTrat] Acesso NEGADO - perfil não autorizado ou ausente');
            req.flash("sucesso", "false");
            req.flash("texto", "Acesso negado: permissão insuficiente.");
            
            const referer = req.get('Referer');
            if (referer && referer.includes('/menu/area/plano/')) {
                res.redirect(referer);
            } else {
                res.redirect('/menu/area/plano/lis');
            }
            return; // ⚠️ INTERROMPE EXECUÇÃO AQUI
        }
        
        console.log('✅ [lixoTrat] Permissão confirmada - prosseguindo...');
        
    } catch (err) {
        // ✅ FAIL-SAFE: QUALQUER ERRO NA VERIFICAÇÃO = NEGAR ACESSO
        console.error('💥 [lixoTrat] ERRO na verificação de permissão:', err.message);
        req.flash("sucesso", "false");
        req.flash("texto", "Erro de validação de acesso.");
        
        const referer = req.get('Referer');
        if (referer && referer.includes('/menu/area/plano/')) {
            res.redirect(referer);
        } else {
            res.redirect('/menu/area/plano/lis');
        }
        return; // ⚠️ INTERROMPE EXECUÇÃO AQUI
    }
    // === 👆 FIM DA VERIFICAÇÃO FAIL-SAFE 👆 ===
    
    let resposta = new Resposta();
    
    console.log('🔍 [lixoTrat] Chamando tratClass.tratLixo...');
    console.log('🔍 [lixoTrat] req.query.motivo:', req.query.motivo);
    
    tratClass.tratLixo(req, res).then((retorno) => {
        console.log('🔍 [lixoTrat] Retorno de tratLixo:', retorno);
        
        if(retorno.sucesso){
            console.log('✅ [lixoTrat] Plano enviado para lixeira com sucesso!');
            req.flash("sucesso", "true");
            req.flash("texto", "Plano enviado para lixeira com sucesso!");
        } else {
            console.log('❌ [lixoTrat] Erro ao enviar para lixeira:', retorno.erro);
            req.flash("sucesso", "false");
            req.flash("texto", "Erro: " + retorno.erro);
        }
        
        // 🔁 Redirecionamento inteligente mantendo filtros
        const referer = req.get('Referer');
        console.log('🔍 [lixoTrat] Tentando redirecionar para referer:', referer);
        
        if (referer && referer.includes('/menu/area/plano/')) {
            console.log('✅ [lixoTrat] Redirecionando para referer (mantém filtros)');
            res.redirect(referer);
        } else {
            console.log('⚠️ [lixoTrat] Fallback: redirecionando para lista geral');
            res.redirect('/menu/area/plano/lis');
        }
        
    }).catch((err) => {
        console.error('💥 [lixoTrat] Erro inesperado no catch:', err);
        console.error('💥 [lixoTrat] Stack:', err.stack);
        req.flash("sucesso", "false");
        req.flash("texto", "Erro interno ao processar exclusão");
        
        const referer = req.get('Referer');
        if (referer && referer.includes('/menu/area/plano/')) {
            res.redirect(referer);
        } else {
            res.redirect('/menu/area/plano/lis');
        }
    });
},
    tratLixo_OLDErr: async (req, res) => {
        try {
            let db = req.cookies['preferredDb'];
            const TratModel = getModel(db, 'tb_trat', TratSchema);

            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            
            // Pega ID da URL (params) - como é rota GET
            const tratId = req.params.id;

            console.log(`🗑️ Enviando para lixeira - ID: ${tratId} | Usuário: ${usuarioAtual}`);

            // Pega motivo da query string (GET) ou fallback
            const motivo = req.query.motivo || req.body.motivo || 'Motivo não informado';

            const resultado = await TratModel.findByIdAndUpdate(
                tratId,
                {
                    $set: {
                        trat_usuidlixo: usuarioAtual,
                        trat_datalixo: dataAtual,
                        trat_lixomotivo: motivo,
                        trat_lixo: "true",
                        trat_dataedi: dataAtual,
                        trat_usuidedi: usuarioAtual
                    }
                },
                { new: true }
            );

            if (!resultado) {
                throw new Error('Registro não encontrado');
            }

            console.log('✅ Encaminhado para a Lixeira com sucesso');
            return { sucesso: true, dados: resultado };

        } catch (err) {
            console.error('❌ Erro ao enviar para lixeira:', err);
            return { sucesso: false, erro: err.message };
        }
    },
        lixoTrat(req, res) {
        console.log('🔍 [lixoTrat] Iniciando controlador de exclusão lógica');
        
        // === 1. VERIFICAÇÃO DE PERMISSÃO (FAIL-SAFE) ===
        try {
            const perfilAtual = req.cookies['lvlUsu'];
            const perfisPermitidos = ['62421801a12aa557219a0fb9', '62421857a12aa557219a0fc1'];
            
            if (!perfilAtual || !perfisPermitidos.includes(perfilAtual)) {
                console.log('🚫 [lixoTrat] Acesso NEGADO - perfil não autorizado');
                req.flash("error_message", "Acesso negado: permissão insuficiente.");
                return res.redirect('/menu/area/plano/lis'); // Redirecionamento seguro
            }
        } catch (err) {
            console.error('💥 [lixoTrat] ERRO na verificação de permissão:', err.message);
            req.flash("error_message", "Erro de validação de acesso.");
            return res.redirect('/menu/area/plano/lis');
        }

        // === 2. EXECUTA A EXCLUSÃO LÓGICA ===
        tratClass.tratLixo(req, res).then((retorno) => {
            if (retorno.sucesso) {
                console.log('✅ [lixoTrat] Plano enviado para lixeira com sucesso!');
                // Usamos success_message para ser capturado pelo sistema de flash padrão
                req.flash("success_message", "Plano enviado para lixeira com sucesso!");
            } else {
                console.log('❌ [lixoTrat] Erro ao enviar para lixeira:', retorno.erro);
                req.flash("error_message", "Erro: " + retorno.erro);
            }
            
            // === 3. REDIRECIONAMENTO SEGURO (CORREÇÃO DO ERRO) ===
            // Forçamos SEMPRE o retorno para a rota GET principal, ignorando o Referer.
            // Isso elimina 100% dos erros "Cannot GET /lisF"
            res.redirect('/menu/area/plano/lis');
            
        }).catch((err) => {
            console.error('💥 [lixoTrat] Erro inesperado no catch:', err);
            req.flash("error_message", "Erro interno ao processar exclusão");
            res.redirect('/menu/area/plano/lis');
        });
    },
    tratRestaurar: async (req, res) => {
        try {
            let db = req.cookies['preferredDb'];
            const TratModel = getModel(db, 'tb_trat', TratSchema);

            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            const tratId = req.params.id || req.body.tratId;

            console.log(`♻️ Restaurando registro - ID: ${tratId}`);

            const resultado = await TratModel.findByIdAndUpdate(
                tratId,
                {
                    $set: {
                        trat_lixo: "false",
                        trat_usuidlixo: null,
                        trat_datalixo: null,
                        trat_lixomotivo: null,
                        trat_dataedi: dataAtual,
                        trat_usuidedi: usuarioAtual
                    }
                },
                { new: true }
            );

            if (!resultado) {
                throw new Error('Registro não encontrado');
            }

            console.log('✅ Registro restaurado com sucesso');
            return { sucesso: true, dados: resultado };

        } catch (err) {
            console.error('❌ Erro ao restaurar:', err);
            return { sucesso: false, erro: err.message };
        }
    },
    listaLixeira: async (req, res) => {
        console.log('🔍 [listaLixeira] Iniciando listagem da lixeira');
        
        try {
            // === VERIFICA PERMISSÃO ===
            const perfilAtual = req.cookies['lvlUsu'];
            const perfisPermitidos = ['62421801a12aa557219a0fb9', '62421857a12aa557219a0fc1'];
            
            console.log('🔍 [listaLixeira] perfilAtual:', perfilAtual);
            console.log('🔍 [listaLixeira] perfisPermitidos:', perfisPermitidos);
            
            if (!perfisPermitidos.includes(perfilAtual)) {
                console.log('🚫 [listaLixeira] Acesso negado - perfil não autorizado');
                req.flash("sucesso", "false");
                req.flash("texto", "Acesso negado: você não tem permissão para visualizar a lixeira.");
                return res.redirect('/menu/area/plano/lis');
            }
            
            console.log('✅ [listaLixeira] Permissão confirmada - prosseguindo...');

            let db = req.cookies['preferredDb'];
            console.log('🔍 [listaLixeira] Database:', db);
            
            // ✅ CORREÇÃO: usar tratClass.TratSchema
            const TratModel = getModel(db, 'tb_trat', tratClass.TratSchema);
            
            // ✅ CORREÇÃO: usar usuarioClass.UsuarioSchema
            const UsuarioModel = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema);
            // ✅ CORREÇÃO: usar beneClass.BeneSchema
            const BeneModel = getModel(db, 'tb_bene', beneClass.BeneSchema);

            console.log('🔍 [listaLixeira] Buscando registros com trat_lixo = "true"...');
            
            // Busca APENAS registros da lixeira
            const tratsLixeira = await TratModel.find({ trat_lixo: "true" })
                .populate('trat_beneid', 'bene_nome')      // Nome do beneficiário
                .populate('trat_usuidlixo', 'usuario_nome usuario_nomecompleto') // Quem deletou
                .sort({ trat_datalixo: -1 })                // Mais recentes primeiro
                .exec();
                
            console.log('🔍 [listaLixeira] Quantidade de registros na lixeira:', tratsLixeira.length);

            console.log('🔍 [listaLixeira] Buscando beneficiários para selects...');
            const benes = await BeneModel.find({ bene_nome: { $not: /\./ } })
                .sort({ bene_nome: 1 })
                .exec();
                
            console.log('🔍 [listaLixeira] Buscando usuários para selects...');
            const usuarios = await UsuarioModel.find({ usuario_status: "Ativo" })
                .sort({ usuario_nome: 1 })
                .exec();

            console.log('🔍 [listaLixeira] Renderizando view admin/tratLixeira...');
            
            res.render('admin/tratLixeira', {
                trats: tratsLixeira,
                benes: benes,
                usuarios: usuarios,
                perfilAtual: perfilAtual,
                flash: req.flash()
            });
            
            console.log('✅ [listaLixeira] View renderizada com sucesso');

        } catch (err) {
            console.error('❌ [listaLixeira] ERRO ao listar lixeira:', err.message);
            console.error('❌ [listaLixeira] Stack:', err.stack);
            req.flash("sucesso", "false");
            req.flash("texto", "Erro ao carregar lixeira: " + err.message);
            res.redirect('/menu/area/plano/lis');
        }
    },
    restaurarTrat: async (req, res) => {
        console.log('🔍 [restaurarTrat] Iniciando controlador de restauração');
        console.log('🔍 [restaurarTrat] req.params.id:', req.params.id);
        
        try {
            // === VERIFICA PERMISSÃO ===
            const perfilAtual = req.cookies['lvlUsu'];
            const perfisPermitidos = ['62421801a12aa557219a0fb9', '62421857a12aa557219a0fc1'];
            
            console.log('🔍 [restaurarTrat] perfilAtual:', perfilAtual);
            console.log('🔍 [restaurarTrat] perfisPermitidos:', perfisPermitidos);
            
            if (!perfisPermitidos.includes(perfilAtual)) {
                console.log('🚫 [restaurarTrat] Acesso negado - perfil não autorizado');
                req.flash("sucesso", "false");
                req.flash("texto", "Acesso negado: você não tem permissão para restaurar registros.");
                return res.redirect('/menu/area/plano/lis');
            }
            
            console.log('✅ [restaurarTrat] Permissão confirmada - prosseguindo...');

            console.log('🔍 [restaurarTrat] Chamando tratClass.tratRestaurar...');
            const retorno = await tratClass.tratRestaurar(req, res);
            console.log('🔍 [restaurarTrat] Retorno de tratRestaurar:', retorno);

            if(retorno.sucesso){
                console.log('✅ [restaurarTrat] Plano restaurado com sucesso!');
                req.flash("sucesso", "true");
                req.flash("texto", "Plano restaurado com sucesso!");
            } else {
                console.log('❌ [restaurarTrat] Erro ao restaurar:', retorno.erro);
                req.flash("sucesso", "false");
                req.flash("texto", "Erro ao restaurar: " + retorno.erro);
            }
            
            console.log('🔁 [restaurarTrat] Redirecionando para /menu/area/plano/lixeira');
            res.redirect('/menu/area/plano/lixeira');

        } catch (err) {
            console.error('💥 [restaurarTrat] Erro inesperado:', err);
            console.error('💥 [restaurarTrat] Stack:', err.stack);
            req.flash("sucesso", "false");
            req.flash("texto", "Erro interno: " + err.message);
            res.redirect('/menu/area/plano/lixeira');
        }
    }
}