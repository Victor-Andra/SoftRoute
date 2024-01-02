const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
//essa tabela devera ser dropada e inseridos novos campos que serão preenchidos pelo relatorio de NF + campos propostos no ato
//da criação da nf no site da prefeitura de recife.
const CreditSchema = mongoose.Schema({
    credit_dataemissao :{ type: Date, required: false },
    credit_anomesref :{ type: ObjectId, required: false },
    credit_numeronota :{ type: ObjectId, required: false },
    credit_convid :{ type: ObjectId, required: false },
    credit_beneid :{ type: ObjectId, required: false },
    credit_benenome :{ type: String, required: false },
    credit_cpfcnpj :{ type: String, required: false },
    credit_tomadornome :{ type: String, required: false },
    credit_retencao :{ type: String, required: false },
    credit_valornota :{ type: String, required: false },
    credit_dataemprestimo :{ type: Date, required: false },
    credit_datadevolucao :{ type: Date, required: false },
    credit_dataprevpagamento :{ type: Date, required: false },
    credit_valorpg :{ type: String, required: false },
    credit_valordiferenca :{ type: String, required: false },
    credit_formapg :{ type: String, required: false },
    credit_datapg :{ type: Date, required: false },
    credit_pis :{ type: String, required: false },
    credit_cssl :{ type: String, required: false },
    credit_cofins :{ type: String, required: false },
    credit_irpf :{ type: String, required: false },
    credit_iss :{ type: String, required: false },
    credit_valorpis :{ type: String, required: false },
    credit_valorcssl :{ type: String, required: false },
    credit_valorcofins :{ type: String, required: false },
    credit_valorirpf :{ type: String, required: false },
    credit_valoriss :{ type: String, required: false },
    credit_descricaonota :{ type: String, required: false },
    credit_obsgeral :{ type: String, required: false },
    credit_datacad :{ type: String, required: false },
    credit_dataedi :{ type: String, required: false }
})

class Credit{
    constructor(
        credit_atendnum,
        credit_categoria,
        credit_terapiaid,
        credit_terapeutaid,
        credit_convid,
        credit_nome,
        credit_cpfcnpj,
        credit_dataevento,
        credit_datavenci,
        credit_datapg,
        credit_valorprev,
        credit_juros,
        credit_multa,
        credit_adianta,
        credit_valorpg,
        credit_pg,
        credit_datacad,
        credit_dataedi
        
        ){
            this.credit_atendnum = credit_atendnum,
            this.credit_categoria = credit_categoria,
            this.credit_terapiaid = credit_terapiaid,
            this.credit_terapeutaid = credit_terapeutaid,
            this.credit_convid = credit_convid,
            this.credit_nome = credit_nome,
            this.credit_cpfcnpj = credit_cpfcnpj,
            this.credit_dataevento = credit_dataevento,
            this.credit_datavenci = credit_datavenci,
            this.credit_datapg = credit_datapg,
            this.credit_valorprev = credit_valorprev,
            this.credit_juros = credit_juros,
            this.credit_multa = credit_multa,
            this.credit_adianta = credit_adianta,
            this.credit_valorpg = credit_valorpg,
            this.credit_pg = credit_pg,
            this.credit_datacad = credit_datacad,
            this.credit_dataedi = credit_dataedi
            
    }
}




CreditSchema.loadClass(Credit)
const CreditModel = mongoose.model('tb_credit', CreditSchema)
module.exports = {CreditModel,CreditSchema,
    creditEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await CreditModel.findByIdAndUpdate(req.body.creditId, 
            {$set: {
                credit_categoria : req.body.creditCategoria ,
                credit_terapiaid : req.body.creditTerapiaid ,
                credit_terapeutaid : req.body.creditTerapeutaid ,
                credit_convid : req.body.creditConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : req.body.creditDataevento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.creditValorprev ,
                credit_juros : req.body.creditJuros ,
                credit_multa : req.body.creditMulta ,
                credit_adianta : req.body.creditAdianta ,
                credit_valorpg : req.body.creditValorpg ,
                credit_pg : req.body.creditPg ,
                credit_dataedi : dataAtual
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },
    creditAdicionar: async (req,res) => {
        let creditExiste;
        
        let dataAtual = new Date();
        if(creditExiste){//se tiver null cai no else
            return "O nome da credit já existe";
            //programar alert
        } else {
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_atendnum : req.body.nextNum ,
                credit_categoria : req.body.creditCategoria ,
                credit_terapiaid : req.body.creditTerapiaid ,
                credit_terapeutaid : req.body.creditTerapeutaid ,
                //credit_convid : req.body.creditConvid ,
                credit_nome : req.body.creditNome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : req.body.creditDataevento ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_datapg : req.body.creditDatapg ,
                credit_valorprev : req.body.creditValorprev ,
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
    }
};