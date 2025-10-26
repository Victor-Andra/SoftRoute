//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas

//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const anamnClass = require("../models/anamn")
const tratClass = require("../models/trat")
const laudoClass = require("../models/laudo")
const relsemClass = require("../models/relsem")

const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabelas da Área
var Anamn = getModel("SoftRoute", 'tb_anamn', anamnClass.AnamnSchema)
var Trat = getModel("SoftRoute", 'tb_trat', tratClass.TratSchema)
var Laudo = getModel("SoftRoute", 'tb_laudo', laudoClass.LaudoSchema)
var Relsem = getModel("SoftRoute", 'tb_relsem', relsemClass.RelsemSchema)


//Tabelas Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)

//Funções Auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    listaBusca(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Anamn = getModel(db, 'tb_anamn', anamnClass.AnamnSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let flash = new Resposta();
        //console.log('listando Area')
        Anamn.find().then((anamn) =>{
            Laudo.find().then((laudo) =>{
                Trat.find().then((trat) =>{
                    Relsem.find().then((relsem) =>{
                        //console.log('listando primárias')
                        Bene.find().then((bene) =>{
                            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Usuario.find().then((usuario) =>{
                                Terapia.find().then((terapia) =>{
                                    Conv.find().then((conv) =>{
                                        res.render('area/busca', {anamns: anamn, laudos: laudo, trats: trat, relsems: relsem, benes: bene, usuarios: usuario, terapias: terapia, convs: conv, flash})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    }
}