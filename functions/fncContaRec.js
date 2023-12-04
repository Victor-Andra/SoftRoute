//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const contarecClass = require("../models/contaRec");

const ContaRec = mongoose.model("tb_contarec")

//Funções auxiliares
const fncContaRec = require("./fncContaRec")

module.exports = {
    contarecAdicionarApoio: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Apoio" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendMergevalorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarExtra: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Extra" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarFalta: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Falta" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarGlosa: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Glosa" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarPadrão: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Padrão" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarPais: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Pais" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarSubstituto: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Substituto" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    contarecAdicionarSupervisao: async (req,res) => {
        let contarecExiste;
        let dtEvento = new Date(req.body.atendAtenddata);
        if(req.body.contarecNome == undefined){//mudar o campo
            contarecExiste = await ContaRecModel.findOne({contarec_atendnum: req.body.nextNum});//quando não acha fica null
        } else {
            contarecExiste =  await ContaRecModel.findOne({contarec_nome: req.body.contarecNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(contarecExiste){//se tiver null cai no else
            return "O nome da contarec já existe";
            //programar alert
        } else {
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_atendnum : req.body.nextNum ,
                contarec_categoria : "Supervisao" ,
                contarec_terapiaid : req.body.atendTerapiaid ,
                contarec_terapeutaid : req.body.atendTerapeutaid ,
                contarec_convid : req.body.atendConvid ,
                contarec_nome : req.body.contarecNome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : dtEvento ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_valorprev : req.body.atendValorcre ,
                contarec_juros : req.body.contarecJuros ,
                contarec_multa : req.body.contarecMulta ,
                contarec_adianta : req.body.contarecAdianta ,
                contarec_valorpg : req.body.contarecValorpg ,
                contarec_pg : req.body.contarecPg ,
                contarec_datacad : dataAtual
            });
            console.log("newContaRec save");
            await newContaRec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    delete(req,res){
        ContaRec.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "ContaRec deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        ContaRec.findById(req.params.id).then((contarec) =>{
            res.render('financeiro/receita/contarecEdi', contarec)
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizar(req,res){
        let resposta;
        try{
            contarecClass.contarecEditar(req,res).then((res)=>{
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
                    //Volta para a contarec de listagem
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
        let cadastro = contarecClass.contarecAdicionar(req,res);//variavel para armazenar a função que armazena o async
        if(cadastro == true){
            console.log('verdadeiro')
            res.render('financeiro/receita/contarecCad');
        } else {
            console.log(cadastro)
            res.render('admin/erro');
        }
    },
    listar(req, res){
        Terapia.findOne().then((terapia) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/contarecLis', {terapias: terapia})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    },
    contarecAtendEditar(req,res){
        let dataEvento;
        let valorPrev;
        let dataEdi;
        ContaRec.findOne({contarec_atendnum: req.body.nextNum}).then((cre)=>{
            if (cre){
                switch (req.body.atendCategoria){
                    case "Apoio":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Extra":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Falta":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Falta Justificada":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendMergevalorcre;
                        dataEdi = new Date();
                        break;
                    case "Glosa":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Padrão":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Pais":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                    case "Substituição":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendMergevalorcre;
                        dataEdi = new Date();
                        break;
                    case "Supervisão":
                        dataEvento = new Date(req.body.atendAtenddata);
                        valorPrev = req.body.atendValorcre;
                        dataEdi = new Date();
                        break;
                }
                ContaRec.findByIdAndUpdate(cre._id, { $set: {contarec_dataevento : dataEvento, contarec_valorprev : valorPrev, contarec_dataedi : dataEdi}})
            }
        })
    }
}