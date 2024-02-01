const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

//Biblioteca de gestão de Imagens para o banco
const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });

const BeneFotoSchema = mongoose.Schema({
    beneFoto_foto: {type: Buffer, required: false},
    beneFoto_beneid: { type: String, required: false },
    beneFoto_obs: { type: String, required: false },
    beneFoto_datacad: { type: Date },
    beneFoto_dataedi: { type: Date }
    
})

class BeneFoto{
    constructor(
        beneFoto_foto,
        beneFoto_beneid,
        beneFoto_obs,
        beneFoto_datacad,
        beneFoto_dataedi
        ){
        this.beneFoto_foto = beneFoto_foto,
        this.beneFoto_beneid = beneFoto_beneid,
        this.beneFoto_obs = beneFoto_obs,
        this.beneFoto_datacad = beneFoto_datacad,
        this.beneFoto_dataedi = beneFoto_dataedi
    }
}


BeneFotoSchema.loadClass(BeneFoto)
const BeneFotoModel = mongoose.model('tb_benefoto', BeneFotoSchema)
module.exports = {BeneFotoModel,BeneFotoSchema,
    beneFotoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await BeneFotoModel.findByIdAndUpdate(req.body.beneFotoId, 
            {$set: {
                beneFoto_foto: req.body.beneFotoFoto,
                beneFoto_beneid: req.body.beneFotoBeneid,
                beneFoto_obs: req.body.beneFotoObs,
                beneFoto_dataedi: dataAtual
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

    beneFotoAdicionar: async (req,res) => {
        
        let dataAtual = new Date();
        
        
            console.log("beneFotomodel");
            const newBeneFoto = new BeneFotoModel({
                beneFoto_foto: req.body.beneFotoFoto,
                beneFoto_beneid: req.body.beneFotoBeneid,
                beneFoto_obs: req.body.beneFotoObs,
                beneFoto_datacad: dataAtual
            });
            console.log("newBeneFoto save");
            await newBeneFoto.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};