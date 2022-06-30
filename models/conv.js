const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ConvSchema = mongoose.Schema({
    conv_nome : {
        type: String,
        unique: true,
        required: true
    },

    conv_razao : {
        type: String,
        unique: true,
        required: false
    },

    conv_contrato: {
        type: String,
        required: false
    },
    conv_cnpj : {
        type: String,
        required: true
    },
    conv_end : {
        type: String,
        required: false
    },
    conv_endcompl : {
        type: String,
        required: false
    },
    conv_endbairro : {
        type: String,
        required: false
    },
    conv_endcidade : {
        type: String,
        required: false
    },
    conv_enduf : {
        type: String,
        required: false
    },
    conv_endcep : {
        type: String,
        required: false
    },
    conv_whatsapp : {
        type: String,
        required: false
    },
    conv_fixo : {
        type: String,
        required: false
    },
    conv_email : {
        type: String,
        required: false
    },
    conv_site : {
        type: String,
        required: false
    },
    conv_status : {
        type: String,
        required: false
    },
    conv_obs : {
        type: String,
        required: false
    },
    conv_datacad: {
        type: Date,
        required: false
    },
    conv_dataedi: {
        type: Date,
        required: false
    }
    
})

class Conv{
    constructor(conv_nome,conv_razao,conv_contrato,conv_cnpj,
        conv_end,conv_endcompl,conv_endbairro,conv_endcidade,
        conv_enduf,conv_endcep,conv_whatsapp,conv_cel,conv_fixo,
        conv_email,conv_site,conv_status,conv_obs,conv_datacad,conv_dataedi 
        ){
        this.conv_nome  = conv_nome,
        this.conv_razao = conv_razao,
        this.conv_contrato  = conv_contrato,
        this.conv_cnpj  = conv_cnpj,
        this.conv_end  = conv_end,
        this.conv_endcompl  = conv_endcompl,
        this.conv_endbairro  = conv_endbairro,
        this.conv_endcidade  = conv_endcidade,
        this.conv_enduf  = conv_enduf,
        this.conv_endcep  = conv_endcep,
        this.conv_whatsapp  = conv_whatsapp,
        this.conv_cel  = conv_cel,
        this.conv_fixo  = conv_fixo,
        this.conv_email  = conv_email,
        this.conv_site  = conv_site,
        this.conv_status  = conv_status,
        this.conv_obs  = conv_obs,
        this.conv_datacad  = conv_datacad,
        this.conv_dataedi  = conv_dataedi
            
    }
}


ConvSchema.loadClass(Conv)
const ConvModel = mongoose.model('tb_conv', ConvSchema)
module.exports = {ConvModel,ConvSchema,
    convEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ConvModel.findByIdAndUpdate(req.body.convId, 
            {$set: {
                conv_nome: req.body.convNome,
                conv_razao: req.body.convRazao,
                conv_contrato: req.body.convContrato,
                conv_cnpj: req.body.convCnpj,
                conv_end: req.body.convEnd,
                conv_endcompl: req.body.convEndcompl,
                conv_endbairro: req.body.convEndbairro,
                conv_endcidade: req.body.convEndcidade,
                conv_enduf: req.body.convEnduf,
                conv_endcep: req.body.convEndcep,
                conv_whatsapp: req.body.convWhatsapp,
                conv_cel: req.body.convCel,
                conv_fixo: req.body.convFixo,
                conv_email: req.body.convEmail,
                conv_site: req.body.convSite,
                conv_status: req.body.convStatus,
                conv_obs: req.body.convObs,
                conv_dataedi: dataAtual
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







    convAdicionar: async (req,res) => {
        let convExiste =  await ConvModel.findOne({conv_nome: req.body.convNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(convExiste){//se tiver null cai no else
            return "O nome da conv já existe";
        } else {
            console.log("convmodel");
            const newConv = new ConvModel({
                conv_nome: req.body.convNome,
                conv_razao: req.body.convRazao,
                conv_contrato: req.body.convContrato,
                conv_cnpj: req.body.convCnpj,
                conv_end: req.body.convEnd,
                conv_endcompl: req.body.convEndcompl,
                conv_endbairro: req.body.convEndbairro,
                conv_endcidade: req.body.convEndcidade,
                conv_enduf: req.body.convEnduf,
                conv_endcep: req.body.convEndcep,
                conv_whatsapp: req.body.convWhatsapp,
                conv_cel: req.body.convCel,
                conv_fixo: req.body.convFixo,
                conv_email: req.body.convEmail,
                conv_site: req.body.convSite,
                conv_status: req.body.convStatus,
                conv_obs: req.body.convObs,
                conv_datacad: dataAtual
            });
            console.log("newConv save");
            await newConv.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },

    qtregs: async(req, res)=>{
        const qtregs = await ConvModel.estimatedDocumentCount();
        return qtregs;
    }


};