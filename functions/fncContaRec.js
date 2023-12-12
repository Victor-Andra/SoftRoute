//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const contarecClass = require("../models/contaRec");

const ContaRec = mongoose.model("tb_contarec")

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
    conatrecAtribuirNNFparaAtendimentos: async (req, res) => {
        // Essa função vai dixar cadastra o Número da Nota Fiscal em cada Atendimento a ela pertencente, assim futuramente se pode auditar cada atendomento que gerou a NF
        //Deve ser chamada também ao gerar a NF.
    },
    contarecCarregaEdi: async (req,res) => {
        
    },
    delete(req,res){
        Credit.deleteOne({_id: req.params.id}).then(() =>{
            req.flash("success_message", "Credit deletada!")
            this.listar(req,res);
        })
    },
    carregaEditar(req,res){
        Bene.findById(req.params.id).then((bene) =>{
            Conv.find().then((conv)=>{
                    Credit.findById(req.params.id).then((credit) =>{
                        res.render('financeiro/receita/creditEdi', {benes: bene, convs: conv, credit})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaCadastro(req,res){
        Bene.findById(req.params.id).then((bene) =>{
                Conv.find().then((conv)=>{
                        Credit.findById(req.params.id).then((credit) =>{
                            res.render('financeiro/receita/creditcad', {benes: bene, convs: conv, credit})
        })})}).catch((err) =>{
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
   
    listar(req, res){
    //Carregar Variáveis para os totais Mês a Mês para as:
    //VlrNF; VlrPg; VlrDif; VlrImpostos
    //Final de cada Linha: total Geral das somas dos meses.
        Terapia.findOne().then((terapia) =>{
            console.log("Listagem Realizada!")
            res.render('financeiro/receita/creditLis', {terapias: terapia})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Correntes")
            res.redirect('admin/erro')
        })
    },
    
}