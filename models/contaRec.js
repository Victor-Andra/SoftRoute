const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
//Parte dos campos que serão preenchidos pelo relatorio de NF + campos propostos no ato
//da criação da nf no site da prefeitura de recife.
const CreditSchema = mongoose.Schema({
    credit_nfnum :{ type: Number, required: false },
    credit_beneid :{ type: ObjectId, required: false },
    credit_convid :{ type: ObjectId, required: false },
    credit_benenome :{ type: String, required: false },
    credit_cpfcnpj :{ type: String, required: false },
    
    credit_dataevento :{ type: Date, required: false },

    credit_vlrprev :{ type: String, required: false },
    credit_vlrjuros :{ type: String, required: false },
    credit_vlrmulta :{ type: String, required: false },
    credit_vlradianta :{ type: String, required: false },
    credit_dataadianta :{ type: Date, required: false },
    credit_datavenci :{ type: Date, required: false },
    credit_vlrpg :{ type: String, required: false },
    credit_vlrdiferenca :{ type: String, required: false },
    credit_vlrtipo :{ type: String, required: false },
    credit_datapg :{ type: Date, required: false },
    credit_pg :{ type: Boolean, required: false },
    credit_descr :{ type: String, required: false },
    credit_usuidcad :{ type: ObjectId, required: false },
    credit_datacad :{ type: String, required: false },
    credit_usuidedi :{ type: ObjectId, required: false },
    credit_dataedi :{ type: String, required: false },
    
})

class Credit{
    constructor(
        credit_nfnum,
        credit_beneid,
        credit_convid,
        credit_benenome,
        credit_cpfcnpj,
        credit_dataevento,
        credit_vlrprev,
        credit_vlrjuros,
        credit_vlrmulta,
        credit_vlradianta,
        credit_dataadianta,
        credit_datavenci,
        credit_vlrpg,
        credit_vlrdiferenca,
        credit_vlrtipo,
        credit_datapg,
        credit_pg,
        credit_descr,
        credit_usuidcad,
        credit_datacad,
        credit_usuidedi,
        credit_dataedi
        
        ){
          
            this.credit_nfnum = credit_nfnum,
            this.credit_beneid = credit_beneid,
            this.credit_convid = credit_convid,
            this.credit_benenome = credit_benenome,
            this.credit_cpfcnpj = credit_cpfcnpj,
            this.credit_dataevento = credit_dataevento,
            this.credit_vlrprev = credit_vlrprev,
            this.credit_vlrjuros = credit_vlrjuros,
            this.credit_vlrmulta = credit_vlrmulta,
            this.credit_vlradianta = credit_vlradianta,
            this.credit_dataadianta = credit_dataadianta,
            this.credit_datavenci = credit_datavenci,
            this.credit_vlrpg = credit_vlrpg,
            this.credit_vlrdiferenca = credit_vlrdiferenca,
            this.credit_vlrtipo = credit_vlrtipo,
            this.credit_datapg = credit_datapg,
            this.credit_pg = credit_pg,
            this.credit_descr = credit_descr,
            this.credit_usuidcad = credit_usuidcad,
            this.credit_datacad = credit_datacad,
            this.credit_usuidedi = credit_usuidedi,
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
                credit_nfnum : req.body.creditNfnum ,
                credit_beneid : req.body.creditNfnum ,
                credit_convid : req.body.creditConvid ,
                credit_benenome : req.body.creditBenenome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : req.body.creditDataevento ,
                credit_vlrprev : req.body.creditVlrprev ,
                credit_vlrjuros : req.body.creditVlrjuros ,
                credit_vlrmulta : req.body.creditVlrmulta ,
                credit_vlradianta : req.body.creditVlradianta ,
                credit_dataadianta : req.body.creditDataadianta ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_vlrpg : req.body.creditVlrpg ,
                credit_vlrdiferenca : req.body.creditVlrdiferenca ,
                credit_vlrtipo : req.body.creditVlrtipo ,
                credit_datapg : req.body.creditDatapg ,
                credit_pg : req.body.creditPg ,
                credit_Descr : req.body.creditDescr ,
                credit_usuidcad : req.body.creditUsuidcad ,
                credit_datacad : req.body.creditDatacad ,
                credit_usuidedi : req.body.creditUsuidedi ,
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
        let dataAtual = new Date();
            console.log("creditmodel");
            const newCredit = new CreditModel({
                credit_nfnum : req.body.creditNfnum ,
                credit_beneid : req.body.creditNfnum ,
                credit_convid : req.body.creditConvid ,
                credit_benenome : req.body.creditBenenome ,
                credit_cpfcnpj : req.body.creditCpfcnpj ,
                credit_dataevento : req.body.creditDataevento ,
                credit_vlrprev : req.body.creditVlrprev ,
                credit_vlrjuros : req.body.creditVlrjuros ,
                credit_vlrmulta : req.body.creditVlrmulta ,
                credit_vlradianta : req.body.creditVlradianta ,
                credit_dataadianta : req.body.creditDataadianta ,
                credit_datavenci : req.body.creditDatavenci ,
                credit_vlrpg : req.body.creditVlrpg ,
                credit_vlrdiferenca : req.body.creditVlrdiferenca ,
                credit_vlrtipo : req.body.creditVlrtipo ,
                credit_datapg : req.body.creditDatapg ,
                credit_pg : req.body.creditPg ,
                credit_Descr : req.body.creditDescr ,
                credit_usuidcad : dataAtual,
                credit_datacad : req.body.creditDatacad ,
                
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
};