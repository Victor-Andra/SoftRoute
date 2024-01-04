//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const contaRecClass = require("../models/contaRec");

const ContaRec = mongoose.model("tb_contarec")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuClass = require("../models/usuario")
//tabelas Extrangeira
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
//Funções auxiliares
const fncContaRec = require("./fncContaRec")

module.exports = {
    
    contarecGerarNF: async (req, res) => {
        // Essa função devera ser chamada no relatório de emissão de NF, no menu atendimento
    },
    contarecTravarmov: async (req, res) => {
        // Essa função vai dixar somente leitura todos os atendimentos que geram a NF e Impedir que seja deletada ou inserida novos atendimentos
        //Deve ser chamada também ao gerar a NF.
    },
    conatrecAtribuirNNFparaAtendicredvmentos: async (req, res) => {
        // Essa função vai dixar cadastra o Número da Nota Fiscal em cada Atendimento a ela pertencente, assim futuramente se pode auditar cada atendomento que gerou a NF
        //Deve ser chamada também ao gerar a NF.
    },
    
    delete(req,res){
        ContaRec.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "ContaRec deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        ContaRec.findById(req.params.id).then((contaRec) =>{
            Bene.find().then((bene)=>{
                Conv.find().then((conv)=>{
                        res.render('financeiro/receita/contaRecEdi', {benes: bene, convs: conv, contaRec})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaCadastro(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        console.log("usuarioAtual:"+usuarioAtual)
        ContaRec.find().then((contaRec) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Conv.find().then((conv)=>{
                    res.render('financeiro/receita/contaRecCad', {benes: bene, convs: conv, contaRecs: contaRec, usuarioAtual, dataAtual})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizar(req,res){
        let resposta;
        try{
            contaRecClass.contarecEditar(req,res).then((res)=>{
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
                    //Volta para a contaRec de listagem
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
    adicionar: async (req, res) => {
        try {
            let cadastro = await contaRecClass.contarecAdicionar(req, res);
    
            if (cadastro === true) {
                console.log('Cadastro realizado!');
                res.render('financeiro/receita/contaRecCad');
            } else {
                console.log(cadastro);
                res.render('admin/erro');
            }
        } catch (error) {
            console.error(error);
            res.render('admin/erro');
        }
    },
   
    listar(req, res){
        ContaRec.find().then((conta) =>{
            conta.forEach((b)=>{
                //console.log("b.dataevento"+b.dataevento)
                
                let dataevento = new Date(b.contarec_dataevento);
                let mes = (dataevento.getMonth()+1).toString();
                let dia = (dataevento.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(dataevento.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataevento=fulldate;
            })
            conta.forEach((b)=>{
                //console.log("b.dataemprest"+b.dataemprest)
                let dataemprest = new Date(b.contarec_dataemprest);
                let mes = (dataemprest.getMonth()+1).toString();
                let dia = (dataemprest.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(dataemprest.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataemprest=fulldate;
            })
            conta.forEach((b)=>{
                //console.log("b.datadev"+b.datadev)
                let datadev = new Date(b.contarec_dataadevol);
                let mes = (datadev.getMonth()+1).toString();
                let dia = (datadev.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datadev.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datadev=fulldate;
            })
            conta.forEach((b)=>{
                //console.log("b.dataprev"+b.dataprev)
                let dataprev = new Date(b.contarec_dataprev);
                let mes = (dataprev.getMonth()+1).toString();
                let dia = (dataprev.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(dataprev.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataprev=fulldate;
            })
            conta.forEach((b)=>{
                //console.log("b.datapg"+b.dataevento)
                let datapg = new Date();
                if(contarec_datapg){
                datapg = new Date(b.contarec_pg)
                let mes = (datapg.getMonth()+1).toString();
                let dia = (datapg.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datapg.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datapg=fulldate;
            }else{
                datapg = "";
            }
        })
            

            Conv.find().then((conv)=>{
            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/contaRecLis', {contas: conta, convs: conv})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    }
    
}