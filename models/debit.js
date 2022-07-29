const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const DebitSchema = mongoose.Schema({
    debit_atendnum :{ //Chave estrangeira que vem da tabela Atend (Não é Obrigatório)
        type: Number, 
        required: false 
    },
/*
    debit_categoria :{ 
        type: String, 
        required: false 
    },
    debit_terapiaid :{ //Chave estrangeira que vem da tabela Terapia (Não é Obrigatório)
        type: ObjectId, 
        required: false 
    },
    debit_terapeutaid :{
        type: ObjectId, 
        required: false 
    },
    debit_convid :{ //Chave estrangeira que vem da tabela Conv (Não é Obrigatório)
        type: ObjectId, 
        required: false 
    },
    */
    debit_nome :{ 
        type: String, 
        required: false 
    },
    debit_cpfcnpj :{ 
        type: String, 
        required: false 
    },
    debit_dataevento :{ 
        type: String, 
        required: false 
    },
    debit_datavenci :{ 
        type: String, 
        required: false 
    },
    debit_datapg :{ 
        type: String, 
        required: false 
    },
    debit_valorprev :{ 
        type: String, 
        required: false 
    },
    debit_juros :{ 
        type: String, 
        required: false 
    },
    debit_multa :{ 
        type: String, 
        required: false 
    },
    debit_adianta :{ 
        type: String, 
        required: false 
    },
    debit_valorpg :{ 
        type: String, 
        required: false 
    },
    debit_pg :{ 
        type: String, 
        required: false 
    },
    debit_fornecid :{ 
        type: ObjectId, 
        required: false 
    },
    debit_parcelado :{ 
        type: String, 
        required: false 
    },
    debit_recorrente :{ 
        type: String, 
        required: false 
    },
    debit_descr :{ 
        type: String, 
        required: false 
    },
    debit_categoriaid :{ 
        type: ObjectId, 
        required: false 
    },
    debit_subcategoriaid :{ 
        type: ObjectId, 
        required: false 
    },
    debit_notafiscal :{ 
        type: String, 
        required: false 
    },
    debit_datacad :{ 
        type: String, 
        required: false 
    },
    debit_dataedi :{ 
        type: String, 
        required: false 
    }
    
    
})

class Debit{
    constructor(
        debit_atendnum,
        /*
        debit_categoria,
        debit_terapiaid,
        debit_terapeutaid,
        debit_convid,
        */
        debit_nome,
        debit_cpfcnpj,
        debit_dataevento,
        debit_datavenci,
        debit_datapg,
        debit_valorprev,
        debit_juros,
        debit_multa,
        debit_adianta,
        debit_valorpg,
        debit_pg,
        debit_fornecid,
        debit_parcelado,
        debit_recorrente,
        debit_descr,
        debit_categoriaid,
        debit_subcategoriaid,
        debit_notafiscal,
        debit_datacad,
        debit_dataedi
        
        ){
            this.debit_atendnum = debit_atendnum,
            /*
            this.debit_categoria = debit_categoria,
            this.debit_terapiaid = debit_terapiaid,
            this.debit_terapeutaid = debit_terapeutaid,
            this.debit_convid = debit_convid,
            */
            this.debit_nome = debit_nome,
            this.debit_cpfcnpj = debit_cpfcnpj,
            this.debit_dataevento = debit_dataevento,
            this.debit_datavenci = debit_datavenci,
            this.debit_datapg = debit_datapg,
            this.debit_valorprev = debit_valorprev,
            this.debit_juros = debit_juros,
            this.debit_multa = debit_multa,
            this.debit_adianta = debit_adianta,
            this.debit_valorpg = debit_valorpg,
            this.debit_pg = debit_pg,
            this.debit_fornecid = debit_fornecid,
            this.debit_parcelado = debit_parcelado,
            this.debit_recorrente = debit_recorrente,
            this.debit_descr = debit_descr,
            this.debit_categoriaid = debit_categoriaid,
            this.debit_subcategoriaid = debit_subcategoriaid,
            this.debit_notafiscal = debit_notafiscal,
            this.debit_datacad = debit_datacad,
            this.debit_dataedi = debit_dataedi
            
    }
}

DebitSchema.loadClass(Debit)
const DebitModel = mongoose.model('tb_debit', DebitSchema)
module.exports = {DebitModel,DebitSchema,
    debitEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        console.log(req.body.debitId)
        //Realiza Atualização
        await DebitModel.findByIdAndUpdate(ObjectId(req.body.debitId), 
            {$set: {
                /*
                debit_categoria : req.body.debitCategoria ,
                debit_terapiaid : req.body.debitTerapiaid ,
                debit_terapeutaid : req.body.debitTerapeutaid,
                debit_convid : req.body.debitConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.debitValorprev ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_dataedi : dataAtual
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
    debitAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let atendnum
        if(req.body.nextNum == undefined || req.body.nextNum == "undefined"){
            atendnum = 0
        } else {
            atendnum = req.body.nextNum
        }
        
        console.log("debitmodel");
        const newDebit = new DebitModel({
            debit_atendnum : atendnum ,
            /*
            debit_categoria : req.body.debitCategoria ,
            debit_terapiaid : req.body.debitTerapiaid ,
            debit_convid : req.body.debitConvid ,
            */
            debit_nome : req.body.debitNome ,
            debit_cpfcnpj : req.body.debitCpfcnpj ,
            debit_dataevento : req.body.debitDataevento ,
            debit_datavenci : req.body.debitDatavenci ,
            debit_datapg : req.body.debitDatapg ,
            debit_valorprev : req.body.debitValorprev ,
            debit_juros : req.body.debitJuros ,
            debit_multa : req.body.debitMulta ,
            debit_adianta : req.body.debitAdianta ,
            debit_valorpg : req.body.debitValorpg ,
            debit_pg : req.body.debitPg ,
            debit_fornecid : req.body.debitFornecid ,
            debit_parcelado : req.body.debitParcelado ,
            debit_recorrente : req.body.debitRecorrente ,
            debit_descr : req.body.debitDescr ,
            debit_categoriaid : req.body.debitCategoriaid,
            debit_subcategoriaid : req.body.debitSubcategoriaid,
            debit_datacad : dataAtual
        });
        console.log("newDebit save");
        await newDebit.save().then(()=>{
            console.log("Cadastro realizado!");
            return "Cadastro realizado!";
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    debitAdicionarApoio: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Apoio" ,
                debit_terapiaid : req.body.atendMergeterapiaid ,
                debit_terapeutaid : req.body.atendMergeTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendMergevalordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarExtra: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Extra" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarFalta: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Falta" ,
                debit_terapiaid : req.body.debitTerapiaid ,
                debit_terapeutaid: req.body.atendMergeTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarGlosa: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Glosa" ,
                debit_terapiaid : req.body.atendTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendValordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarPais: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Pais" ,
                debit_terapiaid : req.body.atendMergeTerapiaid ,
                debit_terapeutaid : req.body.atendMergeTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendMergevalordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarSubstituto: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Substituto" ,
                debit_terapiaid : req.body.atendMergeTerapiaid ,
                debit_terapeutaid : req.body.atendMergeTerapeutaid ,
                debit_convid : req.body.atendConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.atendMergevalordeb ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    debitAdicionarSupervisao: async (req,res) => {
        let debitExiste;
        if(req.body.debitNome == undefined){//mudar o campo
            debitExiste = await DebitModel.findOne({debit_atendnum: req.body.nextNum});;//se nao tiver nome é do atendimento
        } else {
            debitExiste =  await DebitModel.findOne({debit_nome: req.body.debitNome});//quando não acha fica null
        }
        let dataAtual = new Date();
        if(debitExiste){//se tiver null cai no else
            return "O nome da debit já existe";
            //programar alert
        } else {
            console.log("debitmodel");
            const newDebit = new DebitModel({
                debit_atendnum : req.body.nextNum ,
                /*
                debit_categoria : "Supervisao" ,
                debit_terapiaid : req.body.debitTerapiaid ,
                debit_terapeutaid : req.body.atendTerapeutaid ,
                debit_convid : req.body.debitConvid ,
                */
                debit_nome : req.body.debitNome ,
                debit_cpfcnpj : req.body.debitCpfcnpj ,
                debit_dataevento : req.body.debitDataevento ,
                debit_datavenci : req.body.debitDatavenci ,
                debit_datapg : req.body.debitDatapg ,
                debit_valorprev : req.body.debitValorprev ,
                debit_juros : req.body.debitJuros ,
                debit_multa : req.body.debitMulta ,
                debit_adianta : req.body.debitAdianta ,
                debit_valorpg : req.body.debitValorpg ,
                debit_pg : req.body.debitPg ,
                debit_fornecid : req.body.debitFornecid ,
                debit_parcelado : req.body.debitParcelado ,
                debit_recorrente : req.body.debitRecorrente ,
                debit_descr : req.body.debitDescr ,
                debit_categoriaid : req.body.debitCategoriaid,
                debit_subcategoriaid : req.body.debitSubcategoriaid,
                debit_notafiscal : req.body.debitNotafiscal,
                debit_datacad : dataAtual
            });
            console.log("newDebit save");
            await newDebit.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};