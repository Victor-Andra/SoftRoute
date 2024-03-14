const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const BenefotoSchema = mongoose.Schema({

    //Dados do Registro
    benefoto_beneid: { type: ObjectId, required: false },
    beneFoto_foto: { type: Buffer, required: false },
    benefoto_obs: { type: String, required: false, },
    benefoto_datacad:{ type: Date, required: false },
    benefoto_usuidcad:{ type: ObjectId, required: false },
    benefoto_usuidedi:{ type: ObjectId, required: false },
    benefoto_dataedi:{ type: Date, required: false }
})

class Benefoto{
    constructor(
    //Dados do Registro
    benefoto_beneid,
    benefoto_foto,
    benefoto_obs,
    benefoto_datacad,
    benefoto_usuidcad,
    benefoto_usuidedi,
    benefoto_dataedi
    ){
    //Dados do Registro
    this.benefoto_beneid = benefoto_beneid,
    this.benefoto_foto = benefoto_foto,
    this.benefoto_obs = benefoto_obs,
    this.benefoto_datacad = benefoto_datacad,
    this.benefoto_usuidcad = benefoto_usuidcad,
    this.benefoto_usuidedi = benefoto_usuidedi,
    this.benefoto_dataedi = benefoto_dataedi
                
    }
}

BenefotoSchema.loadClass(Benefoto)
const BenefotoModel = mongoose.model('tb_benefoto', BenefotoSchema)
module.exports = {BenefotoModel,BenefotoSchema,
    
    benefotoEditar: async (req, res) => {
        let dataAtual = new Date(); //Pega data atual
        let resultado;
        let usuarioAtual = req.cookies['idUsu']; //Pega usuário atual
        
        //Realiza Atualização
        await BenefotoModel.findByIdAndUpdate(req.body.benefotoId, 
            {$set: {
                benefoto_beneid: req.body.benefotoBeneId,
                benefoto_foto: req.body.benefotoFoto,
                benefoto_obs: req.body.benefotoObs,
                benefoto_usuidedi: usuarioAtual,
                benefoto_dataedi: dataAtual

                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },

    beneFotoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu']; //Pega usuário atual
        //Realiza Inserção
        const newBenefoto = new BenefotoModel({
            benefoto_beneid: req.body.benefotoBeneId,
            benefoto_foto: req.body.benefotoFoto,
            benefoto_obs: req.body.benefotoObs,
            benefoto_usuidcad: usuarioAtual,
            benefoto_datacad: dataAtual
            
        });
        console.log("newBenefoto save");
        await newBenefoto.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log("err:"+err)
            return err;
        });
    }
};