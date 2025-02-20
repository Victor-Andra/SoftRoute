//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const convClass = require("../models/conv")//convenio
const beneClass = require("../models/bene")

//Tabela NAT

//Tabelas Extrangeiras
const Usuario = mongoose.model("tb_usuario")
const Conv = mongoose.model("tb_conv")
const Bene = mongoose.model("tb_bene")


//Funções auxiliares
class RelObjvalor{
    constructor(
        idlocal,
        campo,
        valor,
        total
        ){
        this.idlocal = idlocal,
        this.campo = campo,
        this.valor = valor,
        this.total = total
    }
}

module.exports = {
    carregaDashfinan(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Financeiro!")
            res.render("dash/dashFinan", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Financeiro!")
            res.redirect('admin/erro')
        })
        
    },

    carregaDashadminin_Old(req,res){
        let qtregsbene;
        let arrayRelQtValor = [];
        let totalBene;
        let array = [];
        Usuario.find().then((usuario)=>{
              Conv.find().then((conv) =>{
                convClass.qtregsconvativos(req,res).then((qtTotReg)=>{
                qtregs = qtTotReg;//somente Convênios ativos
                Bene.find({bene_status: "Ativo"}).then((bene) =>{
                    totalBene = bene.length;
                    beneClass.qtregsbeneativos(req,res).then((qtTotRegbene)=>{
                        beneClass.qtregsbeneFiltrados(req,res).then((qtregsbenefiltrado)=>{
                            array = qtregsbenefiltrado;
                        qtregsbene = qtTotRegbene;//somente beneficiários ativos
                        conv.forEach((c)=>{
                            let obj = new RelObjvalor();
                            let qt = 0;
                            bene.forEach((b)=>{
                                if ((""+c._id+"") == (""+b.bene_convid+"")){
                                    
                                    qt++;
                                }
                            })
                            obj.campo = "qtBenepconv";
                            obj.idlocal = (""+c._id+"");
                            obj.valor = qt;
                            arrayRelQtValor.push(obj);
                        })
            res.render("dash/dashAdminin", {usuarios: usuario, convs: conv, qtregs, benes:bene, qtregsbene, arrayRelQtValors: arrayRelQtValor, totalBene, qtregsbenefiltrados:qtregsbenefiltrado, arrays: array})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Administrativo!")
            res.redirect('admin/erro')
        })
    },
    carregaDashadminin(req, res) {
        let qtregsbene;
        let arrayRelQtValor = [];
        let totalBene;
        let array = [];
    
        console.log("Iniciando carregamento do dashboard administrativo...");
    
        Usuario.find().then((usuario) => {
            console.log("Usuários carregados:", usuario.length);
    
            Conv.find().then((conv) => {
                console.log("Convênios carregados:", conv.length);
    
                convClass.qtregsconvativos(req, res).then((qtTotReg) => {
                    qtregs = qtTotReg; // Somente Convênios ativos
                    console.log("Quantidade de convênios ativos:", qtregs);
    
                    Bene.find({ bene_status: "Ativo" }).then((bene) => {
                        totalBene = bene.length;
                        console.log("Beneficiários ativos carregados:", totalBene);
    
                        beneClass.qtregsbeneativos(req, res).then((qtTotRegbene) => {
                            console.log("Quantidade de beneficiários ativos:", qtTotRegbene);
    
                            beneClass.qtregsbeneFiltrados(req, res).then((qtregsbenefiltrado) => {
                                console.log("Dados filtrados de beneficiários:", qtregsbenefiltrado);
                                array = qtregsbenefiltrado;
    
                                qtregsbene = qtTotRegbene; // Somente beneficiários ativos
    
                                conv.forEach((c) => {
                                    let obj = new RelObjvalor();
                                    let qt = 0;
                                    bene.forEach((b) => {
                                        if (("" + c._id + "") == ("" + b.bene_convid + "")) {
                                            qt++;
                                        }
                                    });
                                    obj.campo = "qtBenepconv";
                                    obj.idlocal = ("" + c._id + "");
                                    obj.valor = qt;
                                    arrayRelQtValor.push(obj);
                                });
    
                                console.log("Array de relação de beneficiários por convênio:", arrayRelQtValor);
    
                                // Renderiza a view com os dados
                                res.render("dash/dashAdminin", {
                                    usuarios: usuario,
                                    convs: conv,
                                    qtregs,
                                    benes: bene,
                                    qtregsbene,
                                    arrayRelQtValors: arrayRelQtValor,
                                    totalBene,
                                    qtregsbenefiltrados: qtregsbenefiltrado,
                                    arrays: array
                                });
    
                                console.log("Dashboard administrativo renderizado com sucesso!");
                            }).catch((err) => {
                                console.error("Erro ao carregar dados filtrados de beneficiários:", err);
                                req.flash("error_message", "Houve um erro ao carregar dados filtrados de beneficiários!");
                                res.redirect('admin/erro');
                            });
                        }).catch((err) => {
                            console.error("Erro ao carregar quantidade de beneficiários ativos:", err);
                            req.flash("error_message", "Houve um erro ao carregar quantidade de beneficiários ativos!");
                            res.redirect('admin/erro');
                        });
                    }).catch((err) => {
                        console.error("Erro ao carregar beneficiários ativos:", err);
                        req.flash("error_message", "Houve um erro ao carregar beneficiários ativos!");
                        res.redirect('admin/erro');
                    });
                }).catch((err) => {
                    console.error("Erro ao carregar quantidade de convênios ativos:", err);
                    req.flash("error_message", "Houve um erro ao carregar quantidade de convênios ativos!");
                    res.redirect('admin/erro');
                });
            }).catch((err) => {
                console.error("Erro ao carregar convênios:", err);
                req.flash("error_message", "Houve um erro ao carregar convênios!");
                res.redirect('admin/erro');
            });
        }).catch((err) => {
            console.error("Erro ao carregar usuários:", err);
            req.flash("error_message", "Houve um erro ao carregar usuários!");
            res.redirect('admin/erro');
        });
    },
    carregaDashestatis(req,res){
        Usuario.find().then((usuario)=>{
            console.log("Carrega Dashboard Estatístico!")
            res.render("dash/dashEstatis", {usuarios: usuario})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Carrega Dashboard Estatístico!")
            res.redirect('admin/erro')
        })

    }
}
