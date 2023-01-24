const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EmpresaSchema = mongoose.Schema({
    empresa_unidade : {
        type: String,
        unique: true,
        required: true
    },
    empresa_nome : {
        type: String,
        unique: true,
        required: true
    },
    empresa_fantasia : {
        type: String,

    },
    empresa_cnpj : {
        type: String,
        required: true
    },
    empresa_muni : {
        type: String,

    },
    empresa_estad : {
        type: String,

    },
    empresa_end : {
        type: String,
        required: true
    },
    empresa_endcompl : {
        type: String,

    },
    empresa_endbairro : {
        type: String,
        required: true
    },
    empresa_endcidade : {
        type: String,
        required: true
    },
    empresa_enduf : {
        type: String,
        required: true
    },
    empresa_endcep : {
        type: String,
        required: true
    },
    empresa_whatsapp : {
        type: String,
        required: true
    },
    empresa_cel : {
        type: String,

    },
    empresa_fixo : {
        type: String,

    },
    empresa_email : {
        type: String,
        required: true
    },
    empresa_site : {
        type: String,
    },
    empresa_obs : {
        type: String,
    },
    empresa_datacad: {
        type: Date
    },
    empresa_dataedi: {
        type: Date
    }
    
})

class Empresa{
    constructor(empresa_unidade,empresa_nome,empresa_fantasia,empresa_cnpj,empresa_muni
        ,empresa_estad,empresa_end,empresa_endcompl,empresa_endbairro,empresa_endcidade
        ,empresa_enduf,empresa_endcep,empresa_whatsapp,empresa_cel,empresa_fixo
        ,empresa_email,empresa_site,empresa_obs,empresa_datacad,empresa_dataedi 
        ){
        this.empresa_unidade  = empresa_unidade,
        this.empresa_nome  = empresa_nome,
        this.empresa_fantasia  = empresa_fantasia,
        this.empresa_cnpj  = empresa_cnpj,
        this.empresa_muni  = empresa_muni,
        this.empresa_estad  = empresa_estad,
        this.empresa_end  = empresa_end,
        this.empresa_endcompl  = empresa_endcompl,
        this.empresa_endbairro  = empresa_endbairro,
        this.empresa_endcidade  = empresa_endcidade,
        this.empresa_enduf  = empresa_enduf,
        this.empresa_endcep  = empresa_endcep,
        this.empresa_whatsapp  = empresa_whatsapp,
        this.empresa_cel  = empresa_cel,
        this.empresa_fixo  = empresa_fixo,
        this.empresa_email  = empresa_email,
        this.empresa_site  = empresa_site,
        this.empresa_obs  = empresa_obs,
        this.empresa_datacad  = empresa_datacad,
        this.empresa_dataedi  = empresa_dataedi
            
    }
}



EmpresaSchema.loadClass(Empresa)
const EmpresaModel = mongoose.model('tb_empresa', EmpresaSchema)
module.exports = {EmpresaModel,EmpresaSchema,
    empresaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EmpresaModel.findByIdAndUpdate(req.body.empresaId, 
            {$set: {
                empresa_unidade: req.body.empresaUnidade,
                empresa_nome: req.body.empresaNome,
                empresa_fantasia: req.body.empresaFantasia,
                empresa_cnpj: req.body.empresaCnpj,
                empresa_muni: req.body.empresaMuni,
                empresa_estad: req.body.empresaEstad,
                empresa_end: req.body.empresaEnd,
                empresa_endcompl: req.body.empresaEndcompl,
                empresa_endbairro: req.body.empresaEndbairro,
                empresa_endcidade: req.body.empresaEndcidade,
                empresa_enduf: req.body.empresaEnduf,
                empresa_endcep: req.body.empresaEndcep,
                empresa_whatsapp: req.body.empresaWhatsapp,
                empresa_cel: req.body.empresaCel,
                empresa_fixo: req.body.empresaFixo,
                empresa_email: req.body.empresaEmail,
                empresa_site: req.body.empresaSite,
                empresa_obs: req.body.empresaObs,
                empresa_dataedi: dataAtual
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





    empresaAdicionar: async (req,res) => {
        let empresaExiste =  await EmpresaModel.findOne({empresa_nome: req.body.empresaNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(empresaExiste){//se tiver null cai no else
            return "O nome da empresa já existe";
        } else {
            console.log("empresamodel");
            const newEmpresa = new EmpresaModel({
                empresa_unidade: req.body.empresaUnidade,
                empresa_nome: req.body.empresaNome,
                empresa_fantasia: req.body.empresaFantasia,
                empresa_cnpj: req.body.empresaCnpj,
                empresa_muni: req.body.empresaMuni,
                empresa_estad: req.body.empresaEstad,
                empresa_end: req.body.empresaEnd,
                empresa_endcompl: req.body.empresaEndcompl,
                empresa_endbairro: req.body.empresaEndbairro,
                empresa_endcidade: req.body.empresaEndcidade,
                empresa_enduf: req.body.empresaEnduf,
                empresa_endcep: req.body.empresaEndcep,
                empresa_whatsapp: req.body.empresaWhatsapp,
                empresa_cel: req.body.empresaCel,
                empresa_fixo: req.body.empresaFixo,
                empresa_email: req.body.empresaEmail,
                empresa_site: req.body.empresaSite,
                empresa_obs: req.body.empresaObs,
                empresa_datacad: dataAtual
            });
            console.log("newEmpresa save");
            await newEmpresa.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};