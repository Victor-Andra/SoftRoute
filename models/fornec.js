const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const FornecSchema = mongoose.Schema({

    fornec_nome :{ 
        type: String, 
        unique: true, 
        required: true 
    },
    fornec_fantasia :{ 
        type: String,  
        required: false 
    },
    fornec_cnpj :{ 
        type: String,
        unique: true,  
        required: true 
    },
    fornec_muni :{ 
        type: String, 
        unique: true, 
        required: false 
    },
    fornec_estad :{ 
        type: String,  
        required: false 
    },
    fornec_contrato :{ 
        type: String,  
        required: false 
    },
    fornec_end :{ 
        type: String,  
        required: false 
    },
    fornec_endcompl :{ 
        type: String,  
        required: false 
    },
    fornec_endbairro :{ 
        type: String,  
        required: false 
    },
    fornec_endcidade :{ 
        type: String,  
        required: false 
    },
    fornec_enduf :{ 
        type: String,  
        required: false 
    },
    fornec_endcep :{ 
        type: String,  
        required: false 
    },
    fornec_contato :{ 
        type: String,  
        required: false 
    },
    fornec_whatsapp :{ 
        type: String,  
        required: false 
    },
    fornec_cel :{ 
        type: String,  
        required: false 
    },
    fornec_fixo :{ 
        type: String,  
        required: false 
    },
    fornec_email :{ 
        type: String,  
        required: false 
    },
    fornec_site :{ 
        type: String,  
        required: false 
    },
    fornec_status :{ 
        type: String,  
        required: false 
    },
    fornec_obs :{ 
        type: String,  
        required: false 
    },
    fornec_datacad :{ 
        type: String, 
         
        required: false 
    },
    fornec_dataedi :{ 
        type: String,  
        required: false 
    }
    
    
})

class Fornec{
    constructor(

        fornec_nome,
        fornec_fantasia,
        fornec_cnpj,
        fornec_muni,
        fornec_estad,
        fornec_contrato,
        fornec_end,
        fornec_endcompl,
        fornec_endbairro,
        fornec_endcidade,
        fornec_enduf,
        fornec_endcep,
        fornec_contato,
        fornec_whatsapp,
        fornec_cel,
        fornec_fixo,
        fornec_email,
        fornec_site,
        fornec_status,
        fornec_obs,
        fornec_datacad,
        fornec_dataedi
        
        ){

            this.fornec_nome = fornec_nome,
            this.fornec_fantasia = fornec_fantasia,
            this.fornec_cnpj = fornec_cnpj,
            this.fornec_muni = fornec_muni,
            this.fornec_estad = fornec_estad,
            this.fornec_contrato = fornec_contrato,
            this.fornec_end = fornec_end,
            this.fornec_endcompl = fornec_endcompl,
            this.fornec_endbairro = fornec_endbairro,
            this.fornec_endcidade = fornec_endcidade,
            this.fornec_enduf = fornec_enduf,
            this.fornec_endcep = fornec_endcep,
            this.fornec_contato = fornec_contato,
            this.fornec_whatsapp = fornec_whatsapp,
            this.fornec_cel = fornec_cel,
            this.fornec_fixo = fornec_fixo,
            this.fornec_email = fornec_email,
            this.fornec_site = fornec_site,
            fornec_status = fornec_status,
            this.fornec_obs = fornec_obs,
            this.fornec_datacad = fornec_datacad,
            this.fornec_dataedi = fornec_dataedi 
            
    }
}



FornecSchema.loadClass(Fornec)
const FornecModel = mongoose.model('tb_fornec', FornecSchema)
module.exports = {FornecModel,FornecSchema,
    fornecEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await FornecModel.findByIdAndUpdate(req.body.fornecId, 
            {$set: {
                 
                fornec_nome : req.body.fornecNome ,
                fornec_fantasia : req.body.fornecFantasia ,
                fornec_cnpj : req.body.fornecCnpj ,
                fornec_muni : req.body.fornecMuni ,
                fornec_estad : req.body.fornecEstad ,
                fornec_contrato : req.body.fornecContrato ,
                fornec_end : req.body.fornecEnd ,
                fornec_endcompl : req.body.fornecEndcompl ,
                fornec_endbairro : req.body.fornecEndbairro ,
                fornec_endcidade : req.body.fornecEndcidade ,
                fornec_enduf : req.body.fornecEnduf ,
                fornec_endcep : req.body.fornecEndcep ,
                fornec_contato : req.body.fornecContato ,
                fornec_whatsapp : req.body.fornecWhatsapp ,
                fornec_cel : req.body.fornecCel ,
                fornec_fixo : req.body.fornecFixo ,
                fornec_email : req.body.fornecEmail ,
                fornec_site : req.body.fornecSite ,
                fornec_status : req.body.fornecStatus ,
                fornec_obs : req.body.fornecObs ,
                fornec_dataedi : dataAtual
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



    fornecAdicionar: async (req,res) => {
        let fornecExiste =  await FornecModel.findOne({fornec_nome: req.body.fornecNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(fornecExiste){//se tiver null cai no else
            return "O nome da fornec já existe";
        } else {
            console.log("fornecmodel");
            const newFornec = new FornecModel({
                
                fornec_nome : req.body.fornecNome ,
                fornec_fantasia : req.body.fornecFantasia ,
                fornec_cnpj : req.body.fornecCnpj ,
                fornec_muni : req.body.fornecMuni ,
                fornec_estad : req.body.fornecEstad ,
                fornec_contrato : req.body.fornecContrato ,
                fornec_end : req.body.fornecEnd ,
                fornec_endcompl : req.body.fornecEndcompl ,
                fornec_endbairro : req.body.fornecEndbairro ,
                fornec_endcidade : req.body.fornecEndcidade ,
                fornec_enduf : req.body.fornecEnduf ,
                fornec_endcep : req.body.fornecEndcep ,
                fornec_contato : req.body.fornecContato ,
                fornec_whatsapp : req.body.fornecWhatsapp ,
                fornec_cel : req.body.fornecCel ,
                fornec_fixo : req.body.fornecFixo ,
                fornec_email : req.body.fornecEmail ,
                fornec_site : req.body.fornecSite ,
                fornec_status : req.body.fornecStatus ,
                fornec_obs : req.body.fornecObs ,
                fornec_datacad : dataAtual
                
                
            });
            console.log("newFornec save");
            await newFornec.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};