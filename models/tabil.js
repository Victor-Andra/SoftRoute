const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const TabilSchema = mongoose.Schema({
    tabil_atendnum :{ type: String, required: false },
    tabil_atendid :{ type: ObjectId, required: false },
    tabil_categoria :{ type: String, required: false },
    tabil_terapiaid :{ type: ObjectId, required: false },
    tabil_convid :{ type: ObjectId, required: false },
    tabil_terapeutaid :{ type: ObjectId, required: false },
    tabil_fornecid :{ type: ObjectId, required: false },
    tabil_nome :{ type: String, required: false },
    tabil_cpfcnpj :{ type: String, required: false },
    tabil_dataevento :{ type: String, required: false },
    tabil_datavenci :{ type: String, required: false },
    tabil_datapg :{ type: String, required: false },
    tabil_pg :{ type: String, required: false },
    tabil_valorCredit :{ type: String, required: false },
    tabil_valorDebit :{ type: String, required: false },
    tabil_saldo :{ type: String, required: false },
    tabil_datacad :{ type: String, required: false },
    tabil_dataedi :{ type: String, required: false }

    
})

class Tabil{
    constructor(
        tabil_atendnum,
        tabil_atendid,
        tabil_categoria,
        tabil_terapiaid,
        tabil_convid,
        tabil_terapeutaid,
        tabil_fornecid,
        tabil_nome,
        tabil_dataevento,
        tabil_datavenci,
        tabil_datapg,
        tabil_pg,
        tabil_valorCredit,
        tabil_valorDebit,
        tabil_saldo,
        tabil_datacad,
        tabil_dataedi
        ){
            this.tabil_atendnum = tabil_atendnum,
            this.tabil_atendid = tabil_atendid,
            this.tabil_categoria = tabil_categoria,
            this.tabil_terapiaid = tabil_terapiaid,
            this.tabil_convid = tabil_convid,
            this.tabil_terapeuta_id = tabil_terapeuta_id,
            this.tabil_fornec_id = tabil_fornec_id,
            this.tabil_nome = tabil_nome,
            this.tabil_cpfcnpj = tabil_cpfcnpj,
            this.tabil_dataevento = tabil_dataevento,
            this.tabil_datavenci = tabil_datavenci,
            this.tabil_datapg = tabil_datapg,
            this.tabil_pg = tabil_pg,
            this.tabil_valorCredit = tabil_valorCredit,
            this.tabil_valorDebit = tabil_valorDebit,
            this.tabil_saldo = tabil_saldo,
            this.tabil_datacad = tabil_datacad,
            this.tabil_dataedi = tabil_dataedi
            

            
    }
}

TabilSchema.loadClass(Tabil)
const TabilModel = mongoose.model('tb_tabil', TabilSchema)
module.exports = {TabilModel,TabilSchema,
    tabilEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await TabilModel.findByIdAndUpdate(req.body.tabilId, 
            {$set: {
                tabil_atendnum : req.body.nextNum ,
                tabil_atendid : req.body.tabilAtendid ,
                tabil_categoria : req.body.tabilCategoria ,
                tabil_terapiaid : req.body.tabilTerapiaid ,
                tabil_convid : req.body.tabilConvid ,
                tabil_terapeutaid : req.body.tabilTerapeutaId ,
                tabil_fornecid : req.body.tabilFornecId ,
                tabil_nome : req.body.tabilNome ,
                tabil_cpfcnpj : req.body.tabilCpfcnpj ,
                tabil_dataevento : req.body.tabilDataevento ,
                tabil_datavenci : req.body.tabilDatavenci ,
                tabil_datapg : req.body.tabilDatapg ,
                tabil_pg : req.body.tabilPg ,
                tabil_valorCredit : req.body.tabilValorcredit ,
                tabil_valorDebit : req.body.tabilValordebit ,
                tabil_saldo : req.body.tabilSaldo ,
                tabil_datacad : req.body.tabilDatacad ,
                tabil_dataedi : dataAtual
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    tabilEditarMerge: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await TabilModel.findByIdAndUpdate(req.body.tabilMergeId, 
            {$set: {
                tabil_atendnum : req.body.nextNum ,
                tabil_atendid : req.body.tabilAtendid ,
                tabil_categoria : req.body.tabilCategoria ,
                tabil_terapiaid : req.body.tabilMergeTerapiaid ,
                tabil_convid : req.body.tabilConvid ,
                tabil_terapeutaid : req.body.tabilMergeTerapeutaId ,
                tabil_fornecid : req.body.tabilMergeFornecId ,
                tabil_nome : req.body.tabilMergeNome ,
                tabil_cpfcnpj : req.body.tabilMergeCpfcnpj ,
                tabil_dataevento : req.body.tabilMergeDataevento ,
                tabil_datavenci : req.body.tabilMergeDatavenci ,
                tabil_datapg : req.body.tabilMergeDatapg ,
                tabil_pg : req.body.tabilMergePg ,
                tabil_valorCredit : req.body.tabilMergeValorcredit ,
                tabil_valorDebit : req.body.tabilMergeValordebit ,
                tabil_saldo : req.body.tabilMergeSaldo ,
                tabil_datacad : req.body.tabilMergeDatacad ,
                tabil_dataedi : dataAtual
                }}
        ).then((res) =>{
            console.log("MergeSalvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },
    tabilAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("tabilmodel");
        const newTabil = new TabilModel({
            tabil_atendnum : req.body.nextNum ,
            tabil_convid : req.body.tabilConvid ,
            tabil_terapeutaid : req.body.tabilTerapeutaId ,
            tabil_fornecid : req.body.tabilFornecId ,
            tabil_dataevento : req.body.tabilDataevento ,
            tabil_datavenci : req.body.tabilDatavenci ,
            tabil_datapg : req.body.tabilDatapg ,
            tabil_pg : req.body.tabilPg ,
            tabil_valorCredit : req.body.tabilValorcredit ,
            tabil_valorDebit : req.body.tabilValordebit ,
            tabil_saldo : req.body.tabilSaldo ,
            tabil_datacad : dataAtual
        });
        console.log("newTabil save");
        await newTabil.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    tabilAdicionarMerge: async (req,res) => {
        let dataAtual = new Date();
        console.log("tabilmodel");
        const newTabil = new TabilModel({
            tabil_atendnum : req.body.nextNum ,
            tabil_convid : req.body.tabilConvid ,
            tabil_terapeutaid : req.body.tabilMergeTerapeutaId ,
            tabil_fornecid : req.body.tabilMergeFornecId ,
            tabil_dataevento : req.body.tabilMergeDataevento ,
            tabil_datavenci : req.body.tabilMergeDatavenci ,
            tabil_datapg : req.body.tabilMergeDatapg ,
            tabil_pg : req.body.tabilMergePg ,
            tabil_valorCredit : req.body.tabilMergeValorcredit ,
            tabil_valorDebit : req.body.tabilMergeValordebit ,
            tabil_saldo : req.body.tabilSaldo ,
            tabil_datacad : dataAtual
        });
        console.log("newTabilMerge save");
        await newTabil.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};