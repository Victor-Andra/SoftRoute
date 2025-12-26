//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//progs
const progClass = require("../models/prog")

const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

const progsetClass = require("../models/progset")
const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")

const folregClass = require("../models/folreg")
const notasupClass = require("../models/notasup")
const notasupobsClass = require("../models/notasupobs")

//prog, tipos de prog 
var Prog = getModel("SoftRoute", 'tb_prog', progClass.ProgSchema)

var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)

var Progset = getModel("SoftRoute", 'tb_progset', progsetClass.ProgsetSchema)
var Progdica = getModel("SoftRoute", 'tb_progdica', progdicaClass.ProgdicaSchema)
var Prognivel = getModel("SoftRoute", 'tb_prognivel', prognivelClass.PrognivelSchema)
var Progtipo = getModel("SoftRoute", 'tb_progtipo', progtipoClass.ProgtipoSchema)

var Folreg = getModel("SoftRoute", 'tb_folreg', folregClass.FolregSchema)
var Notasup = getModel("SoftRoute", 'tb_notasup', notasupClass.NotasupSchema)
var Notasupobs = getModel("SoftRoute", 'tb_notasupobs', notasupobsClass.NotaSupObsSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
   
    filtraProg(req, res, resposta) {
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Notasup = getModel(db, 'tb_notasup', notasupClass.NotasupSchema)

        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        let dataAtual = new Date();
        let idUsu;
        let filtra = "true";
        let beneFiltro;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let perfilAtual = req.cookies['lvlUsu'];

        Prog.find().then((prog) => {
            // Variáveis para contar os programas adquiridos e não adquiridos
            let countProgs = 0;
            let countProgsC = 0;
            let countProgsA = 0;
    
            prog.forEach((b) => {
                // Formatação da Exibição da Data de cadastro
                let datacad = new Date(b.prog_datacad);
                let mes = (datacad.getMonth() + 1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                let fulldate = (datacad.getFullYear() + "-" + mes + "-" + dia).toString();
                b.datacad = fulldate;
    
                dataedi = new Date(b.prog_dataedi);
                mes = (dataedi.getMonth() + 1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                fulldate = (dataedi.getFullYear() + "-" + mes + "-" + dia).toString();
                b.dataedi = fulldate;
            });
    
            Bene.find({ _id: req.body.abaBeneid }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));

                bene.forEach((b) => {
                    b.countProgs = prog.filter((s) => s.prog_beneid.toString() === b._id.toString()).length;
                    // Contagem de progs adquiridos e não adquiridos
                    b.countProgsC += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status === "Adquirido").length;
                    b.countProgsA += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status !== "Adquirido").length;
                
                    //console.log("b.datanasc"+b.bene_datanasc)
                    let datanasc = new Date(b.bene_datanasc);
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
    
                    // Data atual
                    const hoje = new Date();
                    let idade = new Date(b.bene_idade);
    
                    // Data de aniversário
                    let aniversario = datanasc;
    
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
                    b.idade = fullidade;
                
                    if ((""+b._id+"") == req.body.abaBeneid){
                        console.log("ACHGOU")
                        beneFiltro = b;
                    }
                });
                // Aqui, você pode usar as variáveis countProgs e countProgsA como quiser
                // Por exemplo, enviá-las para sua view junto com outros dados
                //console.log("b.datanasc"+b.bene_datanasc)
                
    
                Usuario.find().then((usuario) => {
                    usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                                        
                    Prog.find().then((prog) => {
                        Progdica.find().then((progdica)=>{
                            progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                            Progtipo.find().then((progtipo)=>{
                                progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Prognivel.find().then((prognivel)=>{
                                    prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Progset.find().then((progset) => {
                                        prog.forEach((p)=>{
                                            let total = 0;
                                            progset.forEach((ps)=>{
                                                if ((""+ps.progset_progid+"") == (""+p._id+"")){
                                                    total += parseInt(ps.progset_qtest);
                                                }
                                            })
                                            p.prog_total_estimulos = total;
                                        })
                                        Folreg.find().then((folreg) => {
                                            Notasup.find().then((notasup) => {
                                                console.log("Finish");
                                                res.render('area/aba/prog/progLis', {
                                                    progs: prog,
                                                    progsets: progset,
                                                    usuarios: usuario,
                                                    benes: bene,
                                                    perfilAtual,
                                                    flash,
                                                    progdicas: progdica,
                                                    progtipos: progtipo,
                                                    prognivels: prognivel,
                                                    countProgs, // Envia a contagem de progs adquiridos
                                                    countProgsA, // Envia a contagem de progs não adquiridos
                                                    countProgsC,
                                                    dataAtual,
                                                    folregs: folreg,
                                                    notasups: notasup,
                                                    beneFiltro,
                                                    filtra
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    listaProg_Backup(req, res, resposta) {//original
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Notasup = getModel(db, 'tb_notasup', notasupClass.NotasupSchema)

        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        let dataAtual = new Date();
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let perfilAtual = req.cookies['lvlUsu'];
    
        Prog.find().then((prog) => {
            // Variáveis para contar os programas adquiridos e não adquiridos
            let countProgs = 0;
            let countProgsC = 0;
            let countProgsA = 0;
    
            prog.forEach((b) => {
                // Formatação da Exibição da Data de cadastro
                let datacad = new Date(b.prog_datacad);
                let mes = (datacad.getMonth() + 1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                let fulldate = (datacad.getFullYear() + "-" + mes + "-" + dia).toString();
                b.datacad = fulldate;
    
                dataedi = new Date(b.prog_dataedi);
                mes = (dataedi.getMonth() + 1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                fulldate = (dataedi.getFullYear() + "-" + mes + "-" + dia).toString();
                b.dataedi = fulldate;
            });
    
            Bene.find({ bene_status: "Ativo", bene_aba: "Sim" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                bene.forEach((b) => {
                    b.countProgs = prog.filter((s) => s.prog_beneid.toString() === b._id.toString()).length;
                    // Contagem de progs adquiridos e não adquiridos
                    b.countProgsC += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status === "Adquirido").length;
                    b.countProgsA += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status !== "Adquirido").length;
                
                    //console.log("b.datanasc"+b.bene_datanasc)
                    let datanasc = new Date(b.bene_datanasc);
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
    
                    // Data atual
                    const hoje = new Date();
                    let idade = new Date(b.bene_idade);
    
                    // Data de aniversário
                    let aniversario = datanasc;
    
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
                    b.idade = fullidade;
                
                
                });
    
                // Aqui, você pode usar as variáveis countProgs e countProgsA como quiser
                // Por exemplo, enviá-las para sua view junto com outros dados
                //console.log("b.datanasc"+b.bene_datanasc)
                
    
                Usuario.find().then((usuario) => {
                    usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                                        
                    Prog.find().then((prog) => {
                        Progdica.find().then((progdica)=>{
                            progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                            Progtipo.find().then((progtipo)=>{
                                progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Prognivel.find().then((prognivel)=>{
                                    prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Progset.find().then((progset) => {
                                        prog.forEach((p)=>{
                                            let total = 0;
                                            progset.forEach((ps)=>{
                                                if ((""+ps.progset_progid+"") == (""+p._id+"")){
                                                    total += parseInt(ps.progset_qtest);
                                                }
                                            })
                                            p.prog_total_estimulos = total;
                                        })
                                        Folreg.find().then((folreg) => {
                                            Notasup.find().then((notasup) => {
                                                res.render('area/aba/prog/progLis', {
                                                    progs: prog,
                                                    progsets: progset,
                                                    usuarios: usuario,
                                                    benes: bene,
                                                    perfilAtual,
                                                    flash,
                                                    progdicas: progdica,
                                                    progtipos: progtipo,
                                                    prognivels: prognivel,
                                                    countProgs, // Envia a contagem de progs adquiridos
                                                    countProgsA, // Envia a contagem de progs não adquiridos
                                                    countProgsC,
                                                    dataAtual,
                                                    folregs: folreg,
                                                    notasups: notasup,
                                                    progs: prog
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },
    
    listaProgfiltro_Backup(req, res, resposta) {//Novo lista prog A Lista deve primeiramente buscar o beneficiário, se somente se, o usuário for de ABA
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Notasup = getModel(db, 'tb_notasup', notasupClass.NotasupSchema)

        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        //let abaUsu = req.cookies['abaUsu'];//Novo cookies novo campo no cadastro do usuário, para somente quem tiver "Sim" nesse campo para acessar o ABA
        let dataAtual = new Date();
        let idUsu;
        let qualBene;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let perfilAtual = req.cookies['lvlUsu'];
    
            Bene.findOne({ _id: req.params.id, bene_status: "Ativo", bene_aba: "Sim" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                bene.forEach((b) => {
                    b.countProgs = prog.filter((s) => s.prog_beneid.toString() === b._id.toString()).length;
                    // Contagem de progs adquiridos e não adquiridos
                    b.countProgsC += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status === "Adquirido").length;
                    b.countProgsA += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status !== "Adquirido").length;
                
                    //console.log("b.datanasc"+b.bene_datanasc)
                    let datanasc = new Date(b.bene_datanasc);
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
    
                    // Data atual
                    const hoje = new Date();
                    let idade = new Date(b.bene_idade);
    
                    // Data de aniversário
                    let aniversario = datanasc;
    
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
                    b.idade = fullidade;
                
                
                });
                
                Prog.find().then((prog) => {
                    // Variáveis para contar os programas adquiridos e não adquiridos
                    let countProgs = 0;
                    let countProgsC = 0;
                    let countProgsA = 0;
    
                    prog.forEach((b) => {
                        // Formatação da Exibição da Data de cadastro
                        let datacad = new Date(b.prog_datacad);
                        let mes = (datacad.getMonth() + 1).toString();
                        let dia = (datacad.getUTCDate()).toString();
                        if (mes.length == 1) {
                            mes = "0" + mes;
                        }
                        if (dia.length == 1) {
                            dia = "0" + dia;
                        }
                        let fulldate = (datacad.getFullYear() + "-" + mes + "-" + dia).toString();
                        b.datacad = fulldate;
            
                        dataedi = new Date(b.prog_dataedi);
                        mes = (dataedi.getMonth() + 1).toString();
                        dia = (dataedi.getUTCDate()).toString();
                        if (mes.length == 1) {
                            mes = "0" + mes;
                        }
                        if (dia.length == 1) {
                            dia = "0" + dia;
                        }
                        fulldate = (dataedi.getFullYear() + "-" + mes + "-" + dia).toString();
                        b.dataedi = fulldate;
                    });
                // Aqui, você pode usar as variáveis countProgs e countProgsA como quiser
                // Por exemplo, enviá-las para sua view junto com outros dados
                //console.log("b.datanasc"+b.bene_datanasc)
                
    
                Usuario.find().then((usuario) => {
                    usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                                        
                    Prog.find().then((prog) => {
                        Progdica.find().then((progdica)=>{
                            progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                            Progtipo.find().then((progtipo)=>{
                                progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Prognivel.find().then((prognivel)=>{
                                    prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Progset.find().then((progset) => {
                                        prog.forEach((p)=>{
                                            let total = 0;
                                            progset.forEach((ps)=>{
                                                if ((""+ps.progset_progid+"") == (""+p._id+"")){
                                                    total += parseInt(ps.progset_qtest);
                                                }
                                            })
                                            p.prog_total_estimulos = total;
                                        })
                                        Folreg.find().then((folreg) => {
                                            Notasup.find().then((notasup) => {
                                                res.render('area/aba/prog/progLisfiltrado', {
                                                    progs: prog,
                                                    progsets: progset,
                                                    usuarios: usuario,
                                                    benes: bene,
                                                    perfilAtual,
                                                    flash,
                                                    progdicas: progdica,
                                                    progtipos: progtipo,
                                                    prognivels: prognivel,
                                                    countProgs, // Envia a contagem de progs adquiridos
                                                    countProgsA, // Envia a contagem de progs não adquiridos
                                                    countProgsC,
                                                    dataAtual,
                                                    folregs: folreg,
                                                    notasups: notasup,
                                                    progs: prog
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });

          

        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },

    xlistaProgfiltroOLD(req, res, resposta) {//Lista ABA ANDAMENTO, Filtrada dos Programas por Beneficiário escolhido no form anterior
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Notasup = getModel(db, 'tb_notasup', notasupClass.NotasupSchema)

        console.log("Chamando listaProgfiltro para o ID:", req.params.id);
        const perfilAtual = req.cookies['lvlUsu'];
        const dataAtual = new Date();
        
        // Busca o beneficiário selecionado
        Bene.findOne({ _id: req.params.id, bene_status: "Ativo", bene_aba: "Sim" }).then((bene) => {
            if (!bene) {
                return res.status(404).json({ error: "Beneficiário não encontrado!" });
            }

            // Cálculo de idade e datas relacionadas
            const datanasc = new Date(bene.bene_datanasc);
            bene.datanasc = fncGeral.formatarData(datanasc);
            bene.idade = fncGeral.calcularIdade(datanasc);
            //
            // Busca as tabelas dependentes
            Prog.find({ prog_beneid: bene._id , prog_status: { $ne: "Adquirido" }}).then((prog) => {
                
                // Variáveis para contar os programas adquiridos e não adquiridos
                let countProgs = 0;
                let countProgsC = 0;
                let countProgsA = 0;

                prog.forEach((p) => {
                    p.datacad = fncGeral.formatarData(new Date(p.prog_datacad));
                    p.dataedi = fncGeral.formatarData(new Date(p.prog_dataedi));
                });
                

                Progdica.find().then((progdica) => {
                    progdica.sort(fncGeral.ordenarPorNome('progdica_nome'));

                    Progtipo.find().then((progtipo) => {
                        progtipo.sort(fncGeral.ordenarPorNome('progtipo_nome'));

                        Prognivel.find().then((prognivel) => {
                            prognivel.sort(fncGeral.ordenarPorNome('prognivel_nome'));

                            Progset.find().then((progset) => {
                                prog.forEach((p) => {
                                    let total = 0;
                                    progset.forEach((ps) => {
                                        if (ps.progset_progid.toString() === p._id.toString()) {
                                            total += parseInt(ps.progset_qtest || 0);
                                        }
                                    });
                                    p.prog_total_estimulos = total;
                                });

                                Folreg.find().then((folreg) => {
                                    Notasup.find().then((notasup) => {
                                        Usuario.find().then((usuario) => {
                                            usuario.sort(fncGeral.ordenarPorNome('usuario_nome'));

                                            // Renderização do formulário com os dados filtrados
                                            res.render('area/aba/prog/progLisfiltrado', {
                                                progs: prog,
                                                progsets: progset,
                                                usuarios: usuario,
                                                benes: [bene],
                                                perfilAtual,
                                                flash: resposta,
                                                progdicas: progdica,
                                                progtipos: progtipo,
                                                prognivels: prognivel,
                                                dataAtual,
                                                folregs: folreg,
                                                notasups: notasup
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },

   
    listaProgfiltro: async (req, beneId, res, flash) => {
        let db = req.cookies['preferredDb'];

        const Prog       = getModel(db, 'tb_prog',       progClass.ProgSchema);
        const Bene       = getModel(db, 'tb_bene',       beneClass.BeneSchema);
        const Progset    = getModel(db, 'tb_progset',    progsetClass.ProgsetSchema);
        const Progdica   = getModel(db, 'tb_progdica',   progdicaClass.ProgdicaSchema);
        const Prognivel  = getModel(db, 'tb_prognivel',  prognivelClass.PrognivelSchema);
        const Progtipo   = getModel(db, 'tb_progtipo',   progtipoClass.ProgtipoSchema);
        const Folreg     = getModel(db, 'tb_folreg',     folregClass.FolregSchema);
        const Notasup    = getModel(db, 'tb_notasup',    notasupClass.NotasupSchema);
        const Notasupobs = getModel(db, 'tb_notasupobs', notasupobsClass.NotaSupObsSchema);
        const Usuario    = getModel(db, 'tb_usuario',    usuarioClass.UsuarioSchema);

        flash = flash || {};
        flash.sucesso = "true";

        const perfilAtual = req.cookies['lvlUsu'];
        const dataAtual = new Date();
        const idBene = beneId || req.params.id;

        console.log("▶ listaProgfiltro chamada para beneId:", idBene);

        let dados = {};

        try {
            const bene = await Bene.findOne({
                _id: idBene,
                bene_status: "Ativo",
                bene_aba: "Sim"
            }).lean();

            if (!bene) {
                flash.sucesso = "false";
                flash.texto = "Beneficiário não encontrado ou inativo no ABA.";
                throw new Error("Beneficiário não encontrado");
            }

            const dn = new Date(bene.bene_datanasc);
            bene.datanasc = fncGeral.formatarData(dn);
            bene.idade = fncGeral.calcularIdade(dn);

            // ✅ Busca em paralelo
            const [
                prog,
                notasup,
                progdica,
                progtipo,
                prognivel,
                progset,
                folreg,
                usuario
            ] = await Promise.all([
                Prog.find({ prog_beneid: bene._id, prog_status: { $ne: "Adquirido" } }).lean(),
                Notasup.find({ notasup_beneid: bene._id }).lean(),
                Progdica.find().lean(),
                Progtipo.find().lean(),
                Prognivel.find().lean(),
                Progset.find({ progset_beneid: bene._id }).lean(),
                Folreg.find({ folreg_beneid: bene._id }).lean(),
                Usuario.find().lean()
            ]);

            // Ordenações
            progdica.sort(fncGeral.ordenarPorNome('progdica_nome'));
            progtipo.sort(fncGeral.ordenarPorNome('progtipo_nome'));
            prognivel.sort(fncGeral.ordenarPorNome('prognivel_nome'));
            usuario.sort(fncGeral.ordenarPorNome('usuario_nome'));

            // ✅ Observações de supervisão
            const notasupIds = notasup.map(n => n._id);
            const notasupobs = notasupIds.length
                ? await Notasupobs.find({ notaSupObs_notasupId: { $in: notasupIds } }).lean()
                : [];

            // ✅ Enriquece prog com data + total_estimulos
            prog.forEach(p => {
                p.datacad = fncGeral.formatarData(new Date(p.prog_datacad));
                p.dataedi = fncGeral.formatarData(new Date(p.prog_dataedi));
                p.prog_total_estimulos = progset
                    .filter(ps => ps.progset_progid && ps.progset_progid.toString() === p._id.toString())
                    .reduce((acc, ps) => acc + (parseInt(ps.progset_qtest, 10) || 0), 0);
            });

            // ✅ ========== ANÁLISE POR BENEFICIÁRIO ==========
            const analytics = {
                progs: {
                    total: prog.length,
                    porStatus: {},
                    detalhes: []
                },
                progsets: {
                    total: progset.length,
                    porStatus: {},
                    porProg: {}
                },
                folregs: {
                    total: folreg.length,
                    porProg: {},
                    porProgSet: {}
                }
            };

            // --- Progs ---
            prog.forEach(p => {
                // Total por status
                analytics.progs.porStatus[p.prog_status] = (analytics.progs.porStatus[p.prog_status] || 0) + 1;

                // Map SETs por prog
                const setsDoProg = progset.filter(ps => ps.progset_progid && ps.progset_progid.toString() === p._id.toString());
                const folregsDoProg = folreg.filter(fr => fr.folreg_progid && fr.folreg_progid.toString() === p._id.toString());

                analytics.progs.detalhes.push({
                    _id: p._id,
                    prog_nome: p.prog_nome || 'Sem nome',
                    status: p.prog_status,
                    sets: setsDoProg,
                    folregs: folregsDoProg
                });

                analytics.progsets.porProg[p._id] = setsDoProg;
                analytics.folregs.porProg[p._id] = folregsDoProg;
            });

            // --- SETs ---
            progset.forEach(ps => {
                analytics.progsets.porStatus[ps.progset_status] = (analytics.progsets.porStatus[ps.progset_status] || 0) + 1;

                if (ps.progset_id) {
                    analytics.folregs.porProgSet[ps.progset_id] = folreg.filter(fr =>
                        fr.folreg_progsetid && fr.folreg_progsetid.toString() === ps.progset_id.toString()
                    );
                }
            });

            // --- Folregs ---
            folreg.forEach(fr => {
                if (fr.folreg_progsetid && !analytics.folregs.porProgSet[fr.folreg_progsetid]) {
                    analytics.folregs.porProgSet[fr.folreg_progsetid] = [];
                }
                if (fr.folreg_progsetid) {
                    analytics.folregs.porProgSet[fr.folreg_progsetid].push(fr);
                }
            });

            // ✅ ========== LOG VISUAL (tabelinha no console) ==========
            console.log('\n📊 ANÁLISE PARA BENEFICIÁRIO:', bene.bene_nome);
            console.log('┌───────────────────────────────────────────────┐');
            console.log(`│ Total de Programas    : ${String(analytics.progs.total).padStart(3)} │`);
            Object.entries(analytics.progs.porStatus).forEach(([status, qtd]) => {
                console.log(`│   → ${status.padEnd(15)} : ${String(qtd).padStart(3)} │`);
            });
            console.log(`│ Total de SETs         : ${String(analytics.progsets.total).padStart(3)} │`);
            Object.entries(analytics.progsets.porStatus).forEach(([status, qtd]) => {
                console.log(`│   → ${status.padEnd(15)} : ${String(qtd).padStart(3)} │`);
            });
            console.log(`│ Total de Folhas       : ${String(analytics.folregs.total).padStart(3)} │`);
            console.log('└───────────────────────────────────────────────┘');

            // ✅ Monta dados finais
            dados = {
                bene,
                prog,
                progset,
                folreg,
                notasup,
                notasupobs,
                progdica,
                progtipo,
                prognivel,
                usuario,
                countProgs: prog.length,
                countProgsets: progset.length,
                countFolregs: folreg.length,
                countNotasups: notasup.length,
                analytics // ← inclui tudo para views avançadas
            };

        } catch (err) {
            console.error("❌ Erro em listaProgfiltro:", err);
            flash.sucesso = "false";
            flash.texto = err.message || "Houve um erro ao listar os dados do beneficiário.";
        } finally {
            if (flash.sucesso === "true") {
                return res.render('area/aba/prog/progLisfiltrado', {
                    bene: dados.bene,
                    progs: dados.prog,
                    progsets: dados.progset,
                    folregs: dados.folreg,
                    notasups: dados.notasup,
                    notasupobss: dados.notasupobs,
                    usuarios: dados.usuario,
                    benes: [dados.bene],
                    perfilAtual,
                    flash,
                    progdicas: dados.progdica,
                    progtipos: dados.progtipo,
                    prognivels: dados.prognivel,
                    dataAtual,
                    countProgs: dados.countProgs,
                    countProgsets: dados.countProgsets,
                    countFolregs: dados.countFolregs,
                    countNotasups: dados.countNotasups,
                    // ✅ Inclui analytics na view (opcional — só se precisar de detalhe fino)
                    analytics: dados.analytics
                });
            } else {
                // Fallback: lista geral de bene
                try {
                    const benes = await Bene.find({
                        bene_status: "Ativo",
                        bene_nome: { $not: /\./ },
                        bene_aba: "Sim"
                    }).lean();
                    benes.sort((a, b) =>
                        a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(
                            b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                        )
                    );
                    return res.render('area/aba/prog/progLis', {
                        benes,
                        perfilAtual,
                        flash,
                        dataAtual
                    });
                } catch (err2) {
                    console.error("❌ Erro no fallback:", err2);
                    return res.redirect('/admin/erro');
                }
            }
        }
    },
    listaProgfiltroManut(req, res, resposta) {//Lista ABA MANUTENÇÃO, Filtrada dos Programas por Beneficiário escolhido no form anterior 
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Progset = getModel(db, 'tb_progset', progsetClass.ProgsetSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)
        Folreg = getModel(db, 'tb_folreg', folregClass.FolregSchema)
        Notasup = getModel(db, 'tb_notasup', notasupClass.NotasupSchema)

        console.log("Chamando listaProgfiltro para o ID:", req.params.id);
        const perfilAtual = req.cookies['lvlUsu'];
        const dataAtual = new Date();
        
        // Busca o beneficiário selecionado
        Bene.findOne({ _id: req.params.id, bene_status: "Ativo", bene_aba: "Sim" })
            .then((bene) => {
                if (!bene) {
                    return res.status(404).json({ error: "Beneficiário não encontrado!" });
                }
    
                // Cálculo de idade e datas relacionadas
                const datanasc = new Date(bene.bene_datanasc);
                bene.datanasc = formatarData(datanasc);
                bene.idade = calcularIdade(datanasc);
                //
                // Funções auxiliares
            function calcularIdade(dataNascimento) {
                const hoje = new Date();
                let idadeAnos = hoje.getFullYear() - dataNascimento.getFullYear();
                const aniversarioEsteAno = new Date(
                    hoje.getFullYear(),
                    dataNascimento.getMonth(),
                    dataNascimento.getDate()
                );

                if (hoje < aniversarioEsteAno) {
                    idadeAnos -= 1;
                }

                const idadeMeses = (hoje.getMonth() - dataNascimento.getMonth() + 12) % 12;

                return `${idadeAnos} anos e ${idadeMeses} meses`;
            }

            function formatarData(data) {
                const dia = String(data.getUTCDate()).padStart(2, '0');
                const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
                const ano = data.getUTCFullYear();
                return `${ano}-${mes}-${dia}`;
            }

            function ordenarPorNome(campo) {
                return (a, b) => {
                    const nomeA = a[campo].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    const nomeB = b[campo].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    return nomeA.localeCompare(nomeB);
                };
            }
                // Busca as tabelas dependentes
                Prog.find({ prog_beneid: bene._id, prog_status:"Adquirido" }).then((prog) => {
                    //Filtrar os programas em manutenção, somente programas, folhas de registros e SETS não compoem esse resultado
                    // Variáveis para contar os programas adquiridos e não adquiridos
                    let countProgs = 0;
                    let countProgsC = 0;
                    let countProgsA = 0;

                    prog.forEach((p) => {
                        p.datacad = formatarData(new Date(p.prog_datacad));
                        p.dataedi = formatarData(new Date(p.prog_dataedi));
                    });
                    
                    
                    
                    
                    Progdica.find().then((progdica) => {
                        progdica.sort(ordenarPorNome('progdica_nome'));
    
                        Progtipo.find().then((progtipo) => {
                            progtipo.sort(ordenarPorNome('progtipo_nome'));
    
                            Prognivel.find().then((prognivel) => {
                                prognivel.sort(ordenarPorNome('prognivel_nome'));
    
                                Progset.find().then((progset) => {
                                    prog.forEach((p) => {
                                        let total = 0;
                                        progset.forEach((ps) => {
                                            if (ps.progset_progid.toString() === p._id.toString()) {
                                                total += parseInt(ps.progset_qtest || 0);
                                            }
                                        });
                                        p.prog_total_estimulos = total;
                                    });
    
                                    Folreg.find().then((folreg) => {
                                        Notasup.find().then((notasup) => {
                                            Usuario.find().then((usuario) => {
                                                usuario.sort(ordenarPorNome('usuario_nome'));
    
                                                // Renderização do formulário com os dados filtrados
                                                res.render('area/aba/prog/progLisfiltradomanut', {
                                                    progs: prog,
                                                    progsets: progset,
                                                    usuarios: usuario,
                                                    benes: [bene],
                                                    perfilAtual,
                                                    flash: resposta,
                                                    progdicas: progdica,
                                                    progtipos: progtipo,
                                                    prognivels: prognivel,
                                                    dataAtual,
                                                    folregs: folreg,
                                                    notasups: notasup
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            })
            .catch((err) => {
                console.error(err);
                req.flash("error_message", "Houve um erro ao listar!");
                res.redirect('admin/erro');
            });
    },

    listaProg : async (req, res, resposta) => {//lista prog abrir primeiro para filtrar
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        //let abaUsu = req.cookies['abaUsu'];//Novo cookies novo campo no cadastro do usuário, para somente quem tiver "Sim" nesse campo para acessar o ABA
        let dataAtual = new Date();
        let idUsu;
        let qualBene;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let perfilAtual = req.cookies['lvlUsu'];
    
            Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ }, bene_aba: "Sim" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                    res.render('area/aba/prog/progLis', {
                       
                        benes: bene,
                        perfilAtual,
                        flash,
                        dataAtual,
                    });
                
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('admin/erro');
        });
    },

    carregaProg(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)

        let idBene;
        if (req.params.id){
            idBene = req.params.id;
        } else {
            idBene = "766f69643132333435366964";
        }
        
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")    
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            Progdica.find().then((progdica)=>{
                                progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Progtipo.find().then((progtipo)=>{
                                    progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Prognivel.find().then((prognivel)=>{
                                        prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                res.render("area/aba/prog/progCad", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, idBene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },

    carregaProgEdi(req,res){
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Progdica = getModel(db, 'tb_progdica', progdicaClass.ProgdicaSchema)
        Prognivel = getModel(db, 'tb_prognivel', prognivelClass.PrognivelSchema)
        Progtipo = getModel(db, 'tb_progtipo', progtipoClass.ProgtipoSchema)

        let idBene = "";
        let perfilAtual = req.cookies['lvlUsu'];
        Prog.findById(req.params.id).then((prog) =>{
            idBene = prog.prog_beneid;
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")    
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            Progdica.find().then((progdica)=>{
                                progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Progtipo.find().then((progtipo)=>{
                                    progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Prognivel.find().then((prognivel)=>{
                                        prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                        console.log(prog)
                                        res.render('area/aba/prog/progEdi', {prog, terapias: terapia, usuarios: usuario, benes: bene, idBene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta, perfilAtual})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProg(req,res){
        let resultado
        let resposta = new Resposta()
        
        let cadastro = progClass.progAdicionar(req,res);//variavel para armazenar a função que armazena o async
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                let beneId = req.body.progBeneid;
                this.listaProgfiltro(req, beneId, res, resposta);
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                let beneId = req.body.progBeneid;
                this.listaProgfiltro(req, beneId, res, resposta);
            }
        })
    },

    atualizaProg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progClass.progEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    let beneId = req.body.progBeneid;
                    this.listaProgfiltro(req, beneId, res, resposta);
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    let beneId = req.body.progBeneid;
                    this.listaProgfiltro(req, beneId, res, resposta);
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProg(req,res){
        let db = req.cookies['preferredDb'];
        Prog = getModel(db, 'tb_prog', progClass.ProgSchema)
        let resposta = new Resposta()

        Prog.deleteOne({_id: req.params.id}).then(() =>{
            Prog.find().then((prog) =>{
                console.log("Deletado!")
                console.log(prog)
                resultado = prog;
            }).catch((err) =>{
                console.log(err)
                resultado = err;
            }).finally(() =>{
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    this.listaProgF(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaProg(req,res,resposta)
                }
            })
        })
    }

}