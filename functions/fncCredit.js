//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const creditClass = require("../models/credit");
const terapiaClass = require("../models/terapia")

const Credit = mongoose.model("tb_credit")
const Terapia = mongoose.model("tb_terapia")

//Funções auxiliares
const fncCredit = require("../functions/fncCredit")
const fncGeral = require("../functions/fncGeral")

class CreditLis{
    constructor(
        credit_convid,
        credit_terapiaid,
        credit_datavenci,
        credit_datapg,
        credit_valorprev,
        credit_valorpg,
        credit_pg
        ){
        this.credit_convid = credit_convid,
        this.credit_terapiaid = credit_terapiaid,
        this.credit_datavenci = credit_datavenci,
        this.credit_datapg = credit_datapg,
        this.credit_valorprev = credit_valorprev,
        this.credit_valorpg = credit_valorpg,
        this.credit_pg = credit_pg
    }
}

module.exports = {
    creditAdicionarApoio: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Apoio" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendMergevalorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarExtra: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Extra" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarFalta: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Falta" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarGlosa: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Glosa" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarPadrão: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Padrão" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarPais: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Pais" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarSubstituto: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Substituto" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    creditAdicionarSupervisao: async (req,res) => {
        let creditExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.creditNome == undefined){//mudar o campo
            creditExiste = await CreditModel.findOne({credit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            creditExiste =  await CreditModel.findOne({credit_nome: req.body.creditNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : "Supervisao" ,
                credit_terapiaid : req.body.atendTerapiaid ,
                credit_terapeutaid : req.body.atendTerapeutaid ,
                credit_convid : req.body.atendConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : dtEvento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.atendValorcre ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_datacad : dataAtual
            });
            console.log("newCredit save");
            await newCredit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    delete(req,res){
        Credit.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "Credit deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        Credit.findById(req.params.id).then((credit) =>{
            res.render('financeiro/receita/creditEdi', credit)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizar(req,res){
        let resposta;
        try{
            creditClass.creditEditar(req,res).then((res)=>{
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
                    //Volta para a credit de listagem
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
        let cadastro = creditClass.creditAdicionar(req,res);//variavel para armazenar a função que armazena o async
        if(cadastro == true){
            console.log('verdadeiro')
            res.render('financeiro/receita/creditCad');
        } else {
            console.log(cadastro)
            res.render('admin/erro');
        }
    },
    listar(req,res){
        let cl = new CreditLis();
        let listaCredito = [];
        let dt;
        Terapia.find().then((terapia)=>{
            Credit.find().then((credit) =>{
                credit.forEach(c=>{
                    cl.credit_convid = c.credit_convid;
                    cl.credit_terapiaid = c.credit_terapiaid;
                    cl.credit_datavenci = fncGeral.getData(c.credit_datavenci);
                    cl.credit_datapg =  fncGeral.getData(c.credit_datapg);
                    cl.credit_valorprev = c.credit_valorprev;
                    cl.credit_valorpg = c.credit_valorpg;
                    if(c.credit_pg){
                        cl.credit_pg = "Sim";
                    } else {
                        cl.credit_pg = "Não";
                    }
                    listaCredito.push(cl);
                    console.log("cl.credit_convid:"+cl.credit_convid)
                    console.log("c.credit_convid:"+c.credit_convid)
                    console.log("cl.credit_terapiaid:"+cl.credit_terapiaid)
                    console.log("c.credit_terapiaid:"+c.credit_terapiaid)
                    cl = new CreditLis();
                })
                console.log("Listagem Realizada!")
                res.render('financeiro/receita/creditLis', {listaCreditos: listaCredito, terapias: terapia})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Credits")
                res.redirect('admin/erro')
            })
        })
    },
    creditAtendEditar(req,res){
        Credit.findOne({credit_atendnum: req.body.nextNum}).then((cre)=>{
            switch (req.body.atendCategoria){
                case "Apoio":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Extra":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Falta":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Falta Justificada":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendMergevalorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Glosa":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Padrão":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Pais":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Substituição":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendMergevalorcre;
                    cre.credit_dataedi = new Date();
                    break;
                case "Supervisão":
                    cre.credit_dataevento = new Date(req.body.atendAtenddata);
                    cre.credit_valorprev = req.body.atendValorcre;
                    cre.credit_dataedi = new Date();
                    break;
            }
        })
    }
}