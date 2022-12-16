const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const ConvcreSchema = mongoose.Schema({
    convcre_convid :{
         type: ObjectId, 
         required: true 
        },
    convcre_convnome :{
         type: String, 
         required: false 
        },
    convcre_terapiaid :{
         type: ObjectId, 
         required: true 
        },
    convcre_data :{
         type: String, 
         required: true 
        },
    convcre_valor :{
         type: String, 
         required: true 
        },
    convcre_obs :{
         type: String, 
         required: false 
        },
    convcre_datacad :{
         type: Date, 
         required: false 
        },
    convcre_dataedi :{
         type: Date, 
         required: false 
        },
})

class Convcre{
    constructor(
        convcre_convid ,convcre_convnome ,convcre_terapiaid ,convcre_terapianome ,convcre_data,
        convcre_valor, convcre_obs, convcre_datacad, convcre_dataedi
        ){
            this.convcre_convid = convcre_convid, //vem da tabela Convenio
            this.convcre_convnome = convcre_convnome, //Facilitar identificação do convenio pelo nome
            this.convcre_terapiaid = convcre_terapiaid, //Vem da Tabela Terapia
            this.convcre_terapianome = convcre_terapianome,
            this.convcre_data = convcre_data,
            this.convcre_valor = convcre_valor,
            this.convcre_obs = convcre_obs,
            this.convcre_datacad = convcre_datacad,
            this.convcre_dataedi = convcre_dataedi
          
    }
}


ConvcreSchema.loadClass(Convcre)
const ConvcreModel = mongoose.model('tb_convcre', ConvcreSchema)
module.exports = {ConvcreModel,ConvcreSchema,
    convcreEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        console.log("id:"+req.body.convcreId)
        await ConvcreModel.findByIdAndUpdate(req.body.convcreId, 
            {$set: {
                convcre_nome: req.body.convcreConvnome,
                convcre_convid : req.body.convcreConvid ,
                convcre_terapiaid : req.body.convcreTerapiaid ,
                convcre_data : req.body.convcreData ,
                convcre_valor : req.body.convcreValor ,
                convcre_obs : req.body.convcreObs ,
                convcre_dataedi : dataAtual
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
    convcreAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let convcreExiste =  await ConvcreModel.findOne({
            convcre_nome: req.body.convcreNome, 
            convcre_convnome : req.body.convcreConvid ,
            convcre_terapiaid : req.body.convcreTerapiaid ,
            convcre_data : req.body.convcreData ,
            convcre_valor : req.body.convcreValor ,
            convcre_obs : req.body.convcreObs
        });//quando não acha fica null
        
        if(convcreExiste){//se tiver null cai no else
            console.log("O nome da convcre já existe")
            return "O nome da convcre já existe";
            //programar alert
        } else {
            console.log("convcremodel");
            const newConvcre = new ConvcreModel({
                convcre_convid : req.body.convcreConvid ,
                convcre_convnome : req.body.convcreConvnome ,
                convcre_terapiaid : req.body.convcreTerapiaid ,
                convcre_data : req.body.convcreData ,
                convcre_valor : req.body.convcreValor ,
                convcre_obs : req.body.convcreObs ,
                convcre_datacad : dataAtual

            });
            console.log("newConvcre save");
            await newConvcre.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};