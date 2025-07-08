const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ConvdebSchema = mongoose.Schema({

    convdeb_convid :{ type: ObjectId, required: true },
    convdeb_convCpfCnpj :{ type: String, required: false },
    convdeb_convnome :{ type: String, required: false },
    convdeb_terapiaid :{ type: ObjectId, required: true },
    convdeb_data :{ type: String, required: true },
    convdeb_valor :{type: String, required: true },
    convdeb_obs :{type: String, required: false},
    //Atributos de controle
    convdeb_datacad :{type: Date, required: false },
    convdeb_dataedi :{type: Date, required: false },
    convcre_usuidcad :{ type: ObjectId, required: false },//Wagner C. 18/06/2025
    convcre_usuidedi :{ type: ObjectId, required: false },//Wagner C. 18/06/2025
    convcre_usuidlixo :{ type: ObjectId, required: false },//Wagner C. 18/06/2025
    convcre_datalixo :{ type: String, required: false },//Wagner C. 18/06/2025
    convcre_lixo :{ type: String, required: false }//Wagner C. 18/06/2025
    
})

class Convdeb{
    constructor(
        convdeb_convid,
        convdeb_convCpfCnpj,
        convdeb_convnome,
        convdeb_terapiaid,
        convdeb_data,
        convdeb_valor,
        convdeb_obs,
        //Atributos de controle
        convdeb_datacad,
        convdeb_dataedi,
        convdeb_usuidcad,
        convdeb_usuidedi,
        convdeb_usuidlixo,
        convdeb_datalixo,
        convdeb_lixo
        ){
            this.convdeb_convid = convdeb_convid, //vem da tabela Convenio
            this.convdeb_convCpfCnpj = convdeb_convCpfCnpj, 
            this.convdeb_convnome = convdeb_convnome, //Facilitar identificação do convenio pelo nome
            this.convdeb_terapiaid = convdeb_terapiaid, //Vem da Tabela Terapia
            this.convdeb_data = convdeb_data,
            this.convdeb_valor = convdeb_valor,
            this.convdeb_obs = convdeb_obs,
            //Atributos de controle
            this.convdeb_datacad = convdeb_datacad,
            this.convdeb_dataedi = convdeb_dataedi,
            this.convdeb_usuidcad = convdeb_usuidcad,
            this.convdeb_usuidedi = convdeb_usuidedi,
            this.convdeb_usuidlixo = convdeb_usuidlixo,
            this.convdeb_datalixo = convdeb_datalixo,
            this.convdeb_lixo = convdeb_lixo
          
    }
}


ConvdebSchema.loadClass(Convdeb)
const ConvdebModel = mongoose.model('tb_convdeb', ConvdebSchema)
module.exports = {ConvdebModel,ConvdebSchema,
    convdebEditar: async (req, res) => {
        let dataAtual = new Date();//Pega data atual
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];//Pega usuario atual
        //Realiza Atualização
        await ConvdebModel.findByIdAndUpdate(req.body.convdebId, 
            {$set: {
                convdeb_convid : req.body.convdebConvid ,
                convdeb_convnome : req.body.convdebConvnome ,
                convdeb_terapiaid : req.body.convdebTerapiaid ,
                convdeb_data : req.body.convdebData ,
                convdeb_valor : req.body.convdebValor ,
                convdeb_obs : req.body.convdebObs ,
                convdeb_dataedi : dataAtual,
                convdeb_usuidedi : usuarioAtual,
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


    convdebAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];//Pega usuario atual
        let convdebExiste =  await ConvdebModel.findOne({
            convdeb_convid : req.body.convdebConvid ,
            convdeb_terapiaid : req.body.convdebTerapiaid ,
            convdeb_data : req.body.convdebData ,
            convdeb_valor : req.body.convdebValor
        });//quando não acha fica null
        
        if(convdebExiste){//se tiver null cai no else
            console.log("O nome da convdeb já existe")
            console.log(convdebExiste)
            return "O nome da convdeb já existe";
            //programar alert
        } else {
            console.log("convdebmodel");
            const newConvdeb = new ConvdebModel({
                convdeb_convid : req.body.convdebConvid ,
                convdeb_convnome : req.body.convdebConvnome ,
                convdeb_terapiaid : req.body.convdebTerapiaid ,
                convdeb_data : req.body.convdebData ,
                convdeb_valor : req.body.convdebValor ,
                convdeb_obs : req.body.convdebObs ,
                convdeb_datacad : dataAtual,
                convdeb_usuidcad : usuarioAtual,
                convdeb_lixo : "false"
            });
            console.log("newConvdeb save");
            await newConvdeb.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    convdebCarregarTodos: async (req,res) => {
        let convdebs;
        await ConvdebModel.find({}).then((convdeb) => {
            convdebs = convdeb;
        });
        
        return convdebs;
    }
};