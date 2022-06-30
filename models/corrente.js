const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const CorrenteSchema = mongoose.Schema({
    corrente_atendid :{ //Chave estrangeira que vem da tabela Atend (Não é Obrigatório)
        type: ObjectId, 
        required: false 
    },
    corrente_usuid :{ //Chave estrangeira que vem da tabela Terapia (Não é Obrigatório)
        type: ObjectId,
         required: false 
        },
    corrente_atendorgtipo :{ 
        type: String, 
        required: false 
    },
    corrente_atendterapia :{ 
        type: ObjectId, 
        required: false 
    },
    corrente_atendvalordeb :{ 
        type: String, 
        required: false 
    },
    corrente_atenddata :{ 
        type: String, 
        required: false 
    },
    corrente_pg :{ 
        type: String, 
        required: false 
    },
    corrente_datacad :{
         type: String, 
         required: false 
        },
    corrente_dataedi :{ 
        type: String, 
        required: false 
    }
    
})

class Corrente{
    constructor(
        corrente_atendid ,
        corrente_usuid ,
        corrente_atendorgtipo ,
        corrente_atendterapia ,
        corrente_valordeb ,
        corrente_atenddata ,
        corrente_pg ,
        corrente_datacad ,
        corrente_dataedi
        
              
        ){

            this.corrente_atendid = corrente_atendid ,
            this.corrente_usuid = corrente_usuid ,
            this.corrente_atendorgtipo = corrente_atendorgtipo ,
            this.corrente_atendterapia = corrente_atendterapia ,
            this.corrente_atendvalordeb = corrente_atendvalordeb ,
            this.corrente_atenddata = corrente_atenddata ,
            this.corrente_pg = corrente_pg ,
            this.corrente_datacad = corrente_datacad ,
            this.corrente_dataedi = corrente_dataedi
            
            
            
            
    }
}


CorrenteSchema.loadClass(Corrente)
const CorrenteModel = mongoose.model('tb_corrente', CorrenteSchema)
module.exports = {CorrenteModel,CorrenteSchema,
    correnteEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await CorrenteModel.findByIdAndUpdate(req.body.correnteId, 
            {$set: {
    
                corrente_atendid : req.body.correnteAtendid ,
                corrente_usuid : req.body.correnteUsuid ,
                corrente_atendorgtipo : req.body.correnteAtendorgtipo ,
                corrente_atendterapia : req.body.correnteAtendterapia ,
                corrente_atendvalordeb : req.body.correnteAtendvalordeb ,
                corrente_atenddata : req.body.correntAtenddata ,
                corrente_pg : req.body.correntePg ,
                corrente_edi : dataAtual

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






    correnteAdicionar: async (req,res) => {
        let correnteExiste =  await CorrenteModel.findOne({corrente_nome: req.body.correnteNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(correnteExiste){//se tiver null cai no else
            return "O nome da corrente já existe";
            //programar alert
        } else {
            console.log("correntemodel");
            const newCorrente = new CorrenteModel({
                corrente_atendid : req.body.correnteAtendid ,
                corrente_usuid : req.body.correnteUsuid ,
                corrente_atendorgtipo : req.body.correnteAtendorgtipo ,
                corrente_atendterapia : req.body.correnteAtendterapia ,
                corrente_atendvalordeb : req.body.correnteAtendvalordeb ,
                corrente_atenddata : req.body.correntAtenddata ,
                corrente_pg : req.body.correntePg ,
                corrente_datacad : dataAtual

                
               
            });
            console.log("newCorrente save");
            await newCorrente.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};