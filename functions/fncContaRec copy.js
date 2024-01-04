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
    adicionar(req,res){
        let cadastro = contaRecClass.contarecAdicionar(req,res);//variavel para armazenar a função que armazena o async
        if(cadastro == true){
            console.log('verdadeiro')
            res.render('financeiro/receita/contaRecCad');
        } else {
            console.log(cadastro)
            res.render('admin/erro');
        }
    },
   
    listar(req, res){
    //Carregar Variáveis para os totais Mês a Mês para as:
    //VlrNF; VlrPg; VlrDif; VlrImpostos
    //Final de cada Linha: total Geral das somas dos meses.
        ContaRec.findOne().then((contarec) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/contaRecLis', {contarec: contarecs})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    },
    
}