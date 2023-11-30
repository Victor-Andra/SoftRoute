const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


const ConvimpSchema = mongoose.Schema({
    convimp_convid :{ type: ObjectId, required: true },
    convimp_impid :{ type: ObjectId, required: true },
    convimp_impnome :{ type: String, required: false },
    convimp_impalq :{ type: String, required: true },
    convimp_data :{ type: String, required: false },
    convimp_datacad :{ type: Date, required: false },
    convimp_dataedi :{ type: Date, required: false },
})

class Convimp{
    constructor(
        convimp_convid,
        convimp_impid,
        convimp_impnome,
        convimp_impalq,
        convimp_data,
        convimp_datacad,
        convimp_dataedi
        ){
        this.convimp_convid = convimp_convid, //vem da tabela Convenio
        this.convimp_impid = convimp_impid, //Vem da Tabela Impostos
        this.convimp_impnome = convimp_impnome, //Facilitar identificação do Imposto pelo nome
        this.convimp_impalq = convimp_impalq, 
        this.convimp_data = convimp_data,
        this.convimp_datacad = convimp_datacad,
        this.convimp_dataedi = convimp_dataedi
    }
}


ConvimpSchema.loadClass(Convimp)
const ConvimpModel = mongoose.model('tb_convimp', ConvimpSchema)
module.exports = {ConvimpModel,ConvimpSchema,
    convimpEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        console.log("id:"+req.body.convimpId)
        await ConvimpModel.findByIdAndUpdate(req.body.convimpId, 
            {$set: {
                convimp_convid : req.body.convimpConvid ,
                convimp_impid : req.body.convimpImpid ,
                convimp_impnome: req.body.convimpImpnome,
                convimp_impalq : req.body.convimpImpalq ,
                convimp_data : req.body.convimpData ,
                convimp_dataedi : dataAtual
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
    convimpAdicionar: async (req, res) => {
        let dataAtual = new Date();
        let convimpExiste =  await ConvimpModel.findOne({
            convimp_convid : req.body.convimpConvid ,
            convimp_impid : req.body.convimpImpid ,
            convimp_impnome: req.body.convimpImpnome,
            convimp_impalq : req.body.convimpImpalq ,
            convimp_data : req.body.convimpData ,
            convimp_dataedi : dataAtual
        });//quando não acha fica null
        
        if(convimpExiste){//se tiver null cai no else
            console.log("O nome da convimp já existe")
            return "O nome da convimp já existe";
            //programar alert
        } else {
            console.log("convimpmodel");
            const newConvimp = new ConvimpModel({
            convimp_convid : req.body.convimpConvid ,
            convimp_impid : req.body.convimpImpid ,
            convimp_impnome: req.body.convimpImpnome,
            convimp_impalq : req.body.convimpImpalq ,
            convimp_data : req.body.convimpData ,
            convimp_datacad : dataAtual

            });
            console.log("newConvimp save");
            await newConvimp.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    convimpCarregarTodos: async (req,res) => {
        let convimps;
        await ConvimpModel.find({}).then((convimp) => {
            convimps = convimp;
        });
        
        return convimps;
    }
};