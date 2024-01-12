const { data } = require('jquery')
const mongoose = require('mongoose')
const usuario = require('./usuario')
const ObjectId = mongoose.Types.ObjectId

const BenefotoSchema = mongoose.Schema({
    benefoto_beneId:{ type: ObjectId, required: true },
    benefoto_foto: { type: Buffer, required: false, },// Utiliza Buffer para armazenar dados binários da imagem
    benefoto_datacad:{ type: Date, required: false },
    benefoto_dataedi:{ type: Date, required: false }
})

class Benefoto{
    constructor(
        benefoto_beneId,
        benefoto_foto,
        benefoto_datacad,
        benefoto_dataedi
    ){
        this.benefoto_beneId = benefoto_beneId,
        this.benefoto_foto = benefoto_foto,
        this.benefoto_datacad = benefoto_datacad,
        this.benefoto_dataedi = benefoto_dataedi
    }
}

BenefotoSchema.loadClass(Benefoto)
const BenefotoModel = mongoose.model('tb_benefoto', BenefotoSchema)
module.exports = {BenefotoModel,BenefotoSchema,
    benefotoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await BenefotoModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                benefoto_beneId: req.body.benefotoBeneId,
                benefoto_foto: req.body.benefotoFoto,
                benefoto_dataedi: dataAtual
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
    benefotoAdicionar: async (req,res) => {
        let benefotoExiste =  await BenefotoModel.findOne({benefoto_beneId: req.body.benefotoBeneId});//quando não acha fica null
        let dataAtual = new Date();
        
        if(benefotoExiste){//se tiver null cai no else
            return "A foto para o beneficiário já existe";
        } else {
            console.log("benemodel");
            const newBene = new BeneModel({
                benefoto_beneId: req.body.benefotoBeneId,
                benefoto_foto: req.body.benefotoFoto,
                benefoto_datacad: dataAtual                
            });
            console.log("newBene save");
            await newBene.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};