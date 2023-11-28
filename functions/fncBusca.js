//Exports
const mongoose = require("mongoose")

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
const Anamn = mongoose.model("tb_anamn")
const Trat = mongoose.model("tb_trat")
const Laudo = mongoose.model("tb_laudo")
const Relsem = mongoose.model("tb_relsem")


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
    listaBusca(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Area')
        Anamn.find().then((anamn) =>{
            Laudo.find().then((laudo) =>{
                Trat.find().then((trat) =>{
                    Relsem.find().then((relsem) =>{
                         //console.log('listando primárias')
                            Bene.find({bene_status:"Ativo"}).then((bene) =>{
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
    },
   
}