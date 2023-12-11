//Exports
const mongoose = require("mongoose")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const contarecClass = require("../models/contaRec");

const ContaRec = mongoose.model("tb_contarec")

//Funções auxiliares
const fncContaRec = require("./fncContaRec")

module.exports = {
    contarecAdicionar: async (req,res) => {
        
    },
    contarecEditar: async (req,res) => {
        
    },
    contarecListar: async (req,res) => {
        //Carregar Variáveis para os totais Mês a Mês para as:
        //VlrNF; VlrPg; VlrDif; VlrImpostos
        //Final de cada Linha: total Geral das somas dos meses.
    },
    contarecCarregaCad: async (req,res) => {
        
    },
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
    
}