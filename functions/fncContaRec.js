//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const contaRecClass = require("../models/contaRec");

const ContaRec = mongoose.model("tb_contarec")
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuClass = require("../models/usuario")
const convImpClass = require("../models/convImp")
const impostoClass = require("../models/imposto")
const respostaClass = require("../models/resposta")
//Tabela Ata


//tabelas Extrangeira
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const ConvImp = mongoose.model("tb_convimp")
const Imposto = mongoose.model("tb_imposto")
const Resposta = mongoose.model("tb_resposta")

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
    carregaCadastro(req, res) {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
    
        ContaRec.find().then((contaRec) => {
            Bene.find().then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Conv.find().then((conv) => {
                    ConvImp.find().then((convimp) => {
                        res.render('financeiro/receita/contaRecCad', { convimps: convimp, benes: bene, convs: conv, contaRecs: contaRec, usuarioAtual, dataAtual })
                    })
                })
            })
        }).catch((err) => {
            console.log(err)
            res.render('admin/erro')
        })
    },
    
    atualizar(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            contaRecClass.contarecEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para lista de Nf´s
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listar(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listar(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    adicionar(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        contaRecClass.contarecAdicionar(req, res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "NF cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listar(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    
   
    listar(req, res){
        ContaRec.find().then((conta) =>{
            conta.forEach((b)=>{
                //console.log("b.dataevento"+b.dataevento)
                let dataevento = new Date();
                if(b.contarec_dataevento){
                dataevento = new Date(b.contarec_dataevento);
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
                }else{
                dataemprest = "";
                }
            })
            conta.forEach((b)=>{
                //console.log("b.dataemprest"+b.dataemprest)
                let dataemprest = new Date();
                if(b.contarec_dataemprest){
                dataemprest = new Date(b.contarec_dataemprest);
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
                }else{
                dataemprest = "";
                }
            })
            conta.forEach((b)=>{
                //console.log("b.datadev"+b.datadev)
                
                let datadev = new Date();
                if(b.contarec_dataadevol){
                datadev = new Date(b.contarec_dataadevol);
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
                }else{
                datadev = "";
                }
            })
            conta.forEach((b)=>{
                //console.log("b.dataprev"+b.dataprev)
                let dataprev = new Date();
                if(b.contarec_dataprev){
                dataprev = new Date(b.contarec_dataprev);
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
                }else{
                dataprev = "";
                }
            })
            conta.forEach((b)=>{
                //console.log("b.datapg"+b.dataevento)
                let datapg = new Date();
                if(b.contarec_datapg){
                datapg = new Date(b.contarec_datapg)
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
            Imposto.find().then((imposto)=>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/contaRecLis', {contas: conta, convs: conv, impostos: imposto})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    }
    
}