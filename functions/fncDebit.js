//Exports
const mongoose = require("mongoose")

//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const debitClass = require("../models/debit")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const fornecClass = require("../models/fornec")

const Debit = mongoose.model("tb_debit")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Fornec = mongoose.model("tb_fornec")

module.exports = {
    debitAdicionarApoio: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Apoio" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendMergevalorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Extra" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Falta" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Glosa" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Padrão" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Pais" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Substituto" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                debit_categoria : "Supervisao" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.atendAtenddata ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValorcre ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
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
        Debit.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "Debit deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        Debit.findById(req.params.id).then((debit) =>{
            res.render('financeiro/receita/debitEdi', debit)
        }).catch((err) =>{
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
        let resultado
        let cadastro = debitClass.debitAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            if(resposta){
                console.log('verdadeiro')
                this.listar(req,res);
            } else {
                console.log(cadastro)
                res.render('admin/erro');
            }
        })
    },
    listar(req,res){
        Debit.find().then((debit) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/debitLis', {debits: debit})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Debits")
            res.redirect('admin/erro')
        })
    },
    carregaDebit(req,res){
        Bene.find({"bene_status":"Ativo"}).then((bene)=>{
            console.log("Listagem Realizada de Beneficiários!")
            Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                console.log("Listagem Realizada de Convenios")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        console.log("Listagem Realizada de Convenios")
                            Fornec.find().sort({fornec_nome: 1}).then((fornec)=>{
                                console.log("Listagem Realizada de Fornecedores")
                        res.render("financeiro/despesa/debitCad", {convs: conv, usuarios: usuario, terapias: terapia, fornecs: fornec})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    }
}