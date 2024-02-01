const { data } = require('jquery')
const mongoose = require('mongoose')
const usuario = require('./usuario')
const ObjectId = mongoose.Types.ObjectId

//Biblioteca de gestão de Imagens para o banco
const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });


const BenefotoSchema = mongoose.Schema({
    benefoto_beneid: { type: ObjectId, required: false },
    benefoto_foto: { type: Buffer, required: false, },// Utiliza Buffer para armazenar dados binários da imagem
    benefoto_obs: { type: String, required: false, },
    benefoto_datacad: { type: Date, required: false },
    benefoto_dataedi: { type: Date, required: false }
})

class Benefoto{
    constructor(
        benefoto_beneid,
        benefoto_foto,
        benefoto_obs,
        benefoto_datacad,
        benefoto_dataedi
    ){
        this.benefoto_beneid = benefoto_beneid,
        this.benefoto_foto = benefoto_foto,
        this.benefoto_obs = benefoto_obs,
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
                benefoto_beneid: req.body.benefotoBeneId,
                benefoto_foto: req.body.benefotoFoto,
                benefoto_obs: req.body.benefotoObs,
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
    benefotoAdicionar: async (req, res) => {
        try {
            console.log('Iniciando benefotoAdicionar...');
    
            let benefotoExiste = await BenefotoModel.findOne({benefoto_beneid: req.body.benefotoBeneId});//quando não acha fica null
    
            console.log('Verificando se benefotoExiste:', benefotoExiste);
    
            if (benefotoExiste) {//se tiver null cai no else
                console.log('A foto para o beneficiário já existe');
                return "A foto para o beneficiário já existe";
            } else {
                const newBene = new BenefotoModel({
                    benefoto_beneid: req.body.benefotoBeneid,
                    benefoto_foto: req.body.benefotoFoto,
                    benefoto_obs: req.body.benefotoObs,
                    benefoto_datacad: new Date()
                });
    
                await newBene.save();
                console.log('Cadastro realizado!');
                return true;
            }
        } catch (err) {
            console.error('Erro em benefotoAdicionar:', err);
            return err;
        }
    }
};