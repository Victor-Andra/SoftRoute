const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
//Parte dos campos que serão preenchidos pelo relatorio de NF + campos propostos no ato
//da criação da nf no site da prefeitura de recife.
const ContaRecSchema = mongoose.Schema({
    //Registro de operadores
    contarec_usuidcad :{ type: ObjectId, required: false },
    contarec_datacad :{ type: String, required: false },
    contarec_usuidedi :{ type: ObjectId, required: false },
    contarec_dataedi :{ type: String, required: false },
    //Identificador da NF
    contarec_nfnum :{ type: String, required: true, unique: true},
    contarec_beneid :{ type: ObjectId, required: false },
    contarec_convid :{ type: ObjectId, required: false },
    contarec_benenome :{ type: String, required: false },
    contarec_tomador :{ type: String, required: false },
    contarec_cpfcnpj :{ type: String, required: false },
    contarec_retencao :{ type: String, required: false },
    //Informações da NF
    contarec_anomesatend :{ type: String, required: false },
    contarec_dataevento :{ type: Date, required: false },
    contarec_vlrnf :{ type: String, required: false },
    contarec_dataemprest :{ type: Date, required: false },
    contarec_dataadevol :{ type: Date, required: false },
    contarec_dataprev :{ type: Date, required: false },
    contarec_vlrpg :{ type: String, required: false },
    contarec_vlrdiferenca :{ type: String, required: false },
    contarec_formapg :{ type: String, required: false },
    contarec_datapg :{ type: Date, required: false },
    //Alíquota dos Impostos
    contarec_alqpis :{ type: String, required: false },
    contarec_alqcssl :{ type: String, required: false },
    contarec_alqcofins :{ type: String, required: false },
    contarec_alqirpf :{ type: String, required: false },
    contarec_alqriss :{ type: String, required: false },
    //valor Impostos
    contarec_vlrpis :{ type: String, required: false },
    contarec_vlrcssl :{ type: String, required: false },
    contarec_vlrcofins :{ type: String, required: false },
    contarec_vlrirpf :{ type: String, required: false },
    contarec_vlriss :{ type: String, required: false },
    //Observações
    contarec_pg :{ type: Boolean, required: false },
    contarec_descr :{ type: String, required: false },
    contarec_obs :{ type: String, required: false },
})
class ContaRec{
    constructor(
        //Registro de operadores
        contarec_usuidcad,
        contarec_datacad,
        contarec_usuidedi,
        contarec_dataedi,
        //Identificador da NF
        contarec_nfnum,
        contarec_beneid,
        contarec_convid,
        contarec_benenome,
        contarec_tomador,
        contarec_cpfcnpj,
        contarec_retencao,
        //Informações da NF
        contarec_anomesatend,
        contarec_dataevento,
        contarec_vlrnf,
        contarec_dataemprest,
        contarec_dataadevol,
        contarec_dataprev,
        contarec_vlrpg,
        contarec_vlrdiferenca,
        contarec_formapg,
        contarec_datapg,
        //valor dos Impostos
        contarec_alqpis,
        contarec_alqcssl,
        contarec_alqcofins,
        contarec_alqirpf,
        contarec_alqiss,
        //valor dos Impostos
        contarec_vlrpis,
        contarec_vlrcssl,
        contarec_vlrcofins,
        contarec_vlrirpf,
        contarec_vlriss,
        //Observações
        contarec_pg,
        contarec_descr,
        contarec_obs
        
        ){
        
        //Registro de operadores
        this.contarec_usuidcad = contarec_usuidcad,
        this.contarec_datacad = contarec_datacad,
        this.contarec_usuidedi = contarec_usuidedi,
        this.contarec_dataedi = contarec_dataedi,
        //Identificador da NF
        this.contarec_nfnum = contarec_nfnum,
        this.contarec_beneid = contarec_beneid,
        this.contarec_convid = contarec_convid,
        this.contarec_benenome = contarec_benenome,
        this.contarec_tomador = contarec_tomador,
        this.contarec_cpfcnpj = contarec_cpfcnpj,
        this.contarec_retencao = contarec_retencao,
        //Informações da NF
        this.contarec_anomesatend = contarec_anomesatend,
        this.contarec_dataevento = contarec_dataevento,
        this.contarec_vlrnf = contarec_vlrnf,
        this.contarec_dataemprest = contarec_dataemprest,
        this.contarec_dataadevol = contarec_dataadevol,
        this.contarec_dataprev = contarec_dataprev,
        this.contarec_vlrpg = contarec_vlrpg,
        this.contarec_vlrdiferenca = contarec_vlrdiferenca,
        this.contarec_formapg = contarec_formapg,
        this.contarec_datapg = contarec_datapg,
        //Alíquotas dos Impostos
        this.contarec_alqpis = contarec_alqpis,
        this.contarec_alqcssl = contarec_alqcssl,
        this.contarec_alqcofins = contarec_alqcofins,
        this.contarec_alqirpf = contarec_alqirpf,
        this.contarec_alqiss = contarec_alqiss,
        //Valor dos Impostos
        this.contarec_vlrpis = contarec_vlrpis,
        this.contarec_vlrcssl = contarec_vlrcssl,
        this.contarec_vlrcofins = contarec_vlrcofins,
        this.contarec_vlrirpf = contarec_vlrirpf,
        this.contarec_vlriss = contarec_vlriss,
        //Observações
        this.contarec_pg = contarec_pg,
        this.contarec_descr = contarec_descr,
        this.contarec_obs = contarec_obs
    }
}


ContaRecSchema.loadClass(ContaRec)
const ContaRecModel = mongoose.model('tb_contarec', ContaRecSchema)
module.exports = {ContaRecModel, ContaRecSchema,
    contarecEditar: async (req, res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ContaRecModel.findByIdAndUpdate(req.body.contarecId, 
            {$set: {
        //Registro de operadores
        contarec_usuidedi : usuarioAtual,
        contarec_dataedi : dataAtual,
        //Identificador da NF
        contarec_nfnum : req.body.contarecNfnum,
        contarec_beneid : req.body.contarecBeneid,
        contarec_convid : req.body.contarecConvid,
        contarec_benenome : req.body.contarecBenenome,
        contarec_tomador : req.body.contarecTomador,
        contarec_cpfcnpj : req.body.contarecCpfcnpj,
        contarec_retencao : req.body.contarecRetencao,
        //Informações da NF
        contarec_anomesatend : req.body.contarecAnomesatend,
        contarec_dataevento : req.body.contarecDataevento,
        contarec_vlrnf : req.body.contarecVlrnf,
        contarec_dataemprest : req.body.contarecDataemprest,
        contarec_dataadevol : req.body.contarecDataadevol,
        contarec_dataprev : req.body.contarecDataprev,
        contarec_vlrpg : req.body.contarecVlrpg,
        contarec_vlrdiferenca : req.body.contarecVlrdiferenca,
        contarec_formapg : req.body.contarecFormapg,
        contarec_datapg : req.body.contarecDatapg,
        //Alíquota dos Impostos
        contarec_alqpis : req.body.contarecAlqpis,
        contarec_alqcssl : req.body.contarecAlqcssl,
        contarec_alqcofins : req.body.contarecAlqcofins,
        contarec_alqirpf : req.body.contarecAlqirpf,
        contarec_alqiss : req.body.contarecAlqiss,
        //Valor dos Impostos
        contarec_vlrpis : req.body.contarecVlrpis,
        contarec_vlrcssl : req.body.contarecVlrcssl,
        contarec_vlrcofins : req.body.contarecVlrcofins,
        contarec_vlrirpf : req.body.contarecVlrirpf,
        contarec_vlriss : req.body.contarecVlriss,
        //Observações
        contarec_pg : req.body.contarecPg,
        contarec_descr : req.body.contarecDescr,
        contarec_obs : req.body.contarecObs
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
    contarecAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];

            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                //Registro de operadores
                contarec_usuidcad : usuarioAtual,
                contarec_datacad : dataAtual,
                //Identificador da NF
                contarec_nfnum : req.body.contarecNfnum,
                contarec_beneid : req.body.contarecBeneid,
                contarec_convid : req.body.contarecConvid,
                contarec_benenome : req.body.contarecBenenome,
                contarec_tomador : req.body.contarecTomador,
                contarec_cpfcnpj : req.body.contarecCpfcnpj,
                contarec_retencao : req.body.contarecRetencao,
                //Informações da NF
                contarec_anomesatend : req.body.contarecAnomesatend,
                contarec_dataevento : req.body.contarecDataevento,
                contarec_vlrnf : req.body.contarecVlrnf,
                contarec_dataemprest : req.body.contarecDataemprest,
                contarec_dataadevol : req.body.contarecDataadevol,
                contarec_dataprev : req.body.contarecDataprev,
                contarec_vlrpg : req.body.contarecVlrpg,
                contarec_vlrdiferenca : req.body.contarecVlrdiferenca,
                contarec_formapg : req.body.contarecFormapg,
                contarec_datapg : req.body.contarecDatapg,
                //Alíquota dos Impostos
                contarec_alqpis : req.body.contarecAlqpis,
                contarec_alqcssl : req.body.contarecAlqcssl,
                contarec_alqcofins : req.body.contarecAlqcofins,
                contarec_alqirpf : req.body.contarecAlqirpf,
                contarec_alqiss : req.body.contarecAlqiss,
                //Impostos
                contarec_vlrpis : req.body.contarecVlrpis,
                contarec_vlrcssl : req.body.contarecVlrcssl,
                contarec_vlrcofins : req.body.contarecVlrcofins,
                contarec_vlrirpf : req.body.contarecVlrirpf,
                contarec_vlriss : req.body.contarecVlriss,
                //Observações
                contarec_pg : req.body.contarecPg,
                contarec_descr : req.body.contarecDescr,
                contarec_obs : req.body.contarecObs
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
};

