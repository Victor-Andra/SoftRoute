//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const creditClass = require("../models/credit")
const Credit = mongoose.model("tb_credit")

module.exports = {
    creditAdicionarApoio: async (req,res) => {
        let creditExiste;
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
                credit_dataevento : req.body.atendAtenddata ,
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
        Credit.find().then((credit) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/creditLis', {credits: credit})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Credits")
            res.redirect('admin/erro')
        })
    }
}