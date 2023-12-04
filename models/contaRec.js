const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
//Parte dos campos que serão preenchidos pelo relatorio de NF + campos propostos no ato
//da criação da nf no site da prefeitura de recife.
const ContaRecSchema = mongoose.Schema({
    contarec_nfnum :{ type: Number, required: true, unique: true},
    contarec_beneid :{ type: ObjectId, required: true },
    contarec_convid :{ type: ObjectId, required: true },
    contarec_benenome :{ type: String, required: false },
    contarec_cpfcnpj :{ type: String, required: false },
    
    contarec_dataevento :{ type: Date, required: false },

    contarec_vlrprev :{ type: String, required: false },
    contarec_vlrjuros :{ type: String, required: false },
    contarec_vlrmulta :{ type: String, required: false },
    contarec_vlradianta :{ type: String, required: false },
    contarec_dataadianta :{ type: Date, required: false },
    contarec_datavenci :{ type: Date, required: false },
    contarec_vlrpg :{ type: String, required: false },
    contarec_vlrdiferenca :{ type: String, required: false },
    contarec_vlrtipo :{ type: String, required: false },
    contarec_datapg :{ type: Date, required: false },
    contarec_pg :{ type: Boolean, required: false },
    contarec_descr :{ type: String, required: false },
    contarec_usuidcad :{ type: ObjectId, required: false },
    contarec_datacad :{ type: String, required: false },
    contarec_usuidedi :{ type: ObjectId, required: false },
    contarec_dataedi :{ type: String, required: false },
    
})

class ContaRec{
    constructor(
        contarec_nfnum,
        contarec_beneid,
        contarec_convid,
        contarec_benenome,
        contarec_cpfcnpj,
        contarec_dataevento,
        contarec_vlrprev,
        contarec_vlrjuros,
        contarec_vlrmulta,
        contarec_vlradianta,
        contarec_dataadianta,
        contarec_datavenci,
        contarec_vlrpg,
        contarec_vlrdiferenca,
        contarec_vlrtipo,
        contarec_datapg,
        contarec_pg,
        contarec_descr,
        contarec_usuidcad,
        contarec_datacad,
        contarec_usuidedi,
        contarec_dataedi
        
        ){
          
            this.contarec_nfnum = contarec_nfnum,
            this.contarec_beneid = contarec_beneid,
            this.contarec_convid = contarec_convid,
            this.contarec_benenome = contarec_benenome,
            this.contarec_cpfcnpj = contarec_cpfcnpj,
            this.contarec_dataevento = contarec_dataevento,
            this.contarec_vlrprev = contarec_vlrprev,
            this.contarec_vlrjuros = contarec_vlrjuros,
            this.contarec_vlrmulta = contarec_vlrmulta,
            this.contarec_vlradianta = contarec_vlradianta,
            this.contarec_dataadianta = contarec_dataadianta,
            this.contarec_datavenci = contarec_datavenci,
            this.contarec_vlrpg = contarec_vlrpg,
            this.contarec_vlrdiferenca = contarec_vlrdiferenca,
            this.contarec_vlrtipo = contarec_vlrtipo,
            this.contarec_datapg = contarec_datapg,
            this.contarec_pg = contarec_pg,
            this.contarec_descr = contarec_descr,
            this.contarec_usuidcad = contarec_usuidcad,
            this.contarec_datacad = contarec_datacad,
            this.contarec_usuidedi = contarec_usuidedi,
            this.contarec_dataedi = contarec_dataedi 
            
    }
}


ContaRecSchema.loadClass(ContaRec)
const ContaRecModel = mongoose.model('tb_contarec', ContaRecSchema)
module.exports = {ContaRecModel,ContaRecSchema,
    contarecEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ContaRecModel.findByIdAndUpdate(req.body.contarecId, 
            {$set: {
                contarec_nfnum : req.body.contarecNfnum ,
                contarec_beneid : req.body.contarecNfnum ,
                contarec_convid : req.body.contarecConvid ,
                contarec_benenome : req.body.contarecBenenome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : req.body.contarecDataevento ,
                contarec_vlrprev : req.body.contarecVlrprev ,
                contarec_vlrjuros : req.body.contarecVlrjuros ,
                contarec_vlrmulta : req.body.contarecVlrmulta ,
                contarec_vlradianta : req.body.contarecVlradianta ,
                contarec_dataadianta : req.body.contarecDataadianta ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_vlrpg : req.body.contarecVlrpg ,
                contarec_vlrdiferenca : req.body.contarecVlrdiferenca ,
                contarec_vlrtipo : req.body.contarecVlrtipo ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_pg : req.body.contarecPg ,
                contarec_Descr : req.body.contarecDescr ,
                contarec_usuidcad : req.body.contarecUsuidcad ,
                contarec_datacad : req.body.contarecDatacad ,
                contarec_usuidedi : req.body.contarecUsuidedi ,
                contarec_dataedi : dataAtual
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
            console.log("contarecmodel");
            const newContaRec = new ContaRecModel({
                contarec_nfnum : req.body.contarecNfnum ,
                contarec_beneid : req.body.contarecNfnum ,
                contarec_convid : req.body.contarecConvid ,
                contarec_benenome : req.body.contarecBenenome ,
                contarec_cpfcnpj : req.body.contarecCpfcnpj ,
                contarec_dataevento : req.body.contarecDataevento ,
                contarec_vlrprev : req.body.contarecVlrprev ,
                contarec_vlrjuros : req.body.contarecVlrjuros ,
                contarec_vlrmulta : req.body.contarecVlrmulta ,
                contarec_vlradianta : req.body.contarecVlradianta ,
                contarec_dataadianta : req.body.contarecDataadianta ,
                contarec_datavenci : req.body.contarecDatavenci ,
                contarec_vlrpg : req.body.contarecVlrpg ,
                contarec_vlrdiferenca : req.body.contarecVlrdiferenca ,
                contarec_vlrtipo : req.body.contarecVlrtipo ,
                contarec_datapg : req.body.contarecDatapg ,
                contarec_pg : req.body.contarecPg ,
                contarec_Descr : req.body.contarecDescr ,
                contarec_usuidcad : dataAtual,
                contarec_datacad : req.body.contarecDatacad ,
                
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