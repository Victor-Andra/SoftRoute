//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const debitClass = require("../models/debit")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const debitSubcategClass = require("../models/debitSubcateg")
const debitCategClass = require("../models/debitCateg")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const fornecClass = require("../models/fornec")

var Debit = getModel("SoftRoute", 'tb_debit', debitClass.DebitSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Debitsubcateg = getModel("SoftRoute", 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema)
var Debitcateg = getModel("SoftRoute", 'tb_debitcateg', debitCategClass.DebitcategSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Fornec = getModel("SoftRoute", 'tb_fornec', fornecClass.FornecSchema)

const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    debitAdicionarApoio: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Apoio" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendMergevalorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarExtra: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Extra" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarFalta: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Falta" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarGlosa: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Glosa" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarPadrão: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Padrão" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarPais: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Pais" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarSubstituto: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Substituto" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarSupervisao: async (req,res) => {
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let debitExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        let dtVenci = new Date(req.body.debitDatavenci);
        let dtPg = new Date(req.body.debitDatapg);
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await Debit.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await Debit.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("Debit");
            const newDebit = new Debit({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Supervisao" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : dtEvento ,
                debit_datavenci : dtVenci ,
                debit_datapg : dtPg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    delete(req,res){
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        Debit.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "Debit deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)
        Debitsubcateg = getModel(db, 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema)
        Debitcateg = getModel(db, 'tb_debitcateg', debitCategClass.DebitcategSchema)
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        Debit.findById(req.params.id).then((debit) =>{
            Fornec.find().then((fornec)=>{
                console.log("Listagem Realizada de Fornecedores!")
                Debitcateg.find().then((categoria)=>{
                    console.log("Listagem Realizada de Categorias")
                    Debitsubcateg.find().then((subcategoria)=>{
                        console.log("Listagem Realizada de Subcategorias")
                        res.render('financeiro/despesa/debitEdi', {debit,categorias: categoria,subcategorias: subcategoria, fornecs: fornec})
        })})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizar(req,res){
        let resposta;
        try{
            debitClass.debitEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a debit de listagem
                    this.listar(req,res);
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
    adicionar(req,res){
        let resultado = false
        let cadastro = debitClass.debitAdicionar(req,res);//variavel para armazenar a função que armazena o async
        try{
            cadastro.then((res)=>{
                console.log(res)
                resultado = true;
            }).catch((err) => {
                console.log(err)
                resultado = err;
            }).finally(() => {
                console.log(resultado)
                if(resultado == true){
                    console.log('verdadeiro')
                    this.listar(req,res);
                } else {
                    console.log(cadastro)
                    res.render('admin/erro');
                }
            })
        } catch(err1){
            console.log(err1)
        }
    },
    listar(req,res){
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)
        Debitsubcateg = getModel(db, 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema)
        Debitcateg = getModel(db, 'tb_debitcateg', debitCategClass.DebitcategSchema)
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)

        Debit.find().then((debit) =>{
            console.log("Listagem Realizada!")
            Fornec.find().then((fornec)=>{
                console.log("Listagem Realizada de Fornecedores!")
                Debitcateg.find().then((categoria)=>{
                    console.log("Listagem Realizada de Categorias")
                    Debitsubcateg.find().then((subcategoria)=>{
                        console.log("Listagem Realizada de Subcategorias")
                res.render('financeiro/despesa/debitLis', {debits: debit, fornecs: fornec, categorias: categoria, subcategorias: subcategoria})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debits")
            res.redirect('admin/erro')
        })
    },
    carregaDebit(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Debitsubcateg = getModel(db, 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema)
        Debitcateg = getModel(db, 'tb_debitcateg', debitCategClass.DebitcategSchema)
        Fornec = getModel(db, 'tb_fornec', fornecClass.FornecSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Bene.find({"bene_status":"Ativo"}).then((bene)=>{
            console.log("Listagem Realizada de Beneficiários!")
            Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                console.log("Listagem Realizada de Convenios")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        console.log("Listagem Realizada de Convenios")
                            Fornec.find().sort({fornec_nome: 1}).then((fornec)=>{
                                console.log("Listagem Realizada de Fornecedores")
                                Debitcateg.find().then((categoria)=>{
                                    console.log("Listagem Realizada de Categorias")
                                    Debitsubcateg.find().then((subcategoria)=>{
                                        console.log("Listagem Realizada de Subcategorias")
                        res.render("financeiro/despesa/debitCad", {convs: conv, usuarios: usuario, terapias: terapia, fornecs: fornec, categorias: categoria, subcategorias: subcategoria})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    debitAtendEditar(req,res){
        let db = req.cookies['preferredDb'];
        Debit = getModel(db, 'tb_debit', debitClass.DebitSchema)

        let dataEvento;
        let valorPrev;
        let dataEdi;
        Debit.findOne({debit_atendnum: req.body.nextNum}).then((deb)=>{
            if (deb){
                switch (req.body.atendCategoria){
                    case "Apoio":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValordeb;
                        dataEdi = new Date();
                        break;
                    case "Extra":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = "0,00";
                        dataEdi = new Date();
                        break;
                    case "Falta":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = "0,00";
                        dataEdi = new Date();
                        break;
                    case "Falta Justificada":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendMergevalordeb;
                        dataEdi = new Date();
                        break;
                    case "Glosa":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = "0,00";
                        dataEdi = new Date();
                        break;
                    case "Padrão":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValordeb;
                        dataEdi = new Date();
                        break;
                    case "Pais":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValordeb;
                        dataEdi = new Date();
                        break;
                    case "Substituição":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendMergevalordeb;
                        dataEdi = new Date();
                        break;
                    case "Supervisão":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValordeb;
                        dataEdi = new Date();
                        break;
                }
                Debit.findByIdAndUpdate(deb._id, { $set: {debit_dataevento : dataEvento, debit_valorprev : valorPrev, debit_dataedi : dataEdi}})
            }
        })
    }
}
/*
            this.debit_atendnum = debit_atendnum,
            this.debit_nome = debit_nome,
            this.debit_cpfcnpj = debit_cpfcnpj,
            this.debit_dataevento = debit_dataevento,
            this.debit_datavenci = debit_datavenci,
            this.debit_datapg = debit_datapg,
            this.debit_valorprev = debit_valorprev,
            this.debit_juros = debit_juros,
            this.debit_multa = debit_multa,
            this.debit_adianta = debit_adianta,
            this.debit_valorpg = debit_valorpg,
            this.debit_pg = debit_pg,
            this.debit_fornecid = debit_fornecid,
            this.debit_parcelado = debit_parcelado,
            this.debit_recorrente = debit_recorrente,
            this.debit_descr = debit_descr,
            this.debit_categoriaid = debit_categoriaid,
            this.debit_subcategoriaid = debit_subcategoriaid,
            this.debit_credcategoriaid = debit_credcategoriaid,
            this.debit_credsubcategoriaid = debit_credsubcategoriaid,
            this.debit_notafiscal = debit_notafiscal,
            this.debit_datacad = debit_datacad,
            this.debit_dataedi = debit_dataedi
*/