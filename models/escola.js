const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const EscolaSchema = mongoose.Schema({
    escola_nome : { type: String },
    escola_fantasia : { type: String },
    escola_end : { type: String },
    escola_endcompl : { type: String },
    escola_endbairro : { type: String },
    escola_endcidade : { type: String },
    escola_enduf : { type: String },
    escola_endcep : { type: String },
    escola_coordenador : { type: String },
    escola_coorwhatsapp : { type: String },
    escola_professor : { type: String },
    escola_profwhatsapp : { type: String },
    escola_fixo : { type: String },
    escola_obs : { type: String },
    escola_datacad : { type: Date },
    escola_dataedi : { type: Date }    
})

class Escola{
    constructor(escola_nome ,	escola_fantasia ,	
        escola_end ,	escola_endcompl ,	escola_endbairro ,	escola_endcidade ,	
        escola_enduf ,	escola_endcep ,	escola_coordenador ,	escola_coorwhatsapp ,	
        escola_professor ,	escola_profwhatsapp ,	escola_fixo ,	escola_obs ,	
        escola_datacad ,	escola_dataedi
        ){
            this.escola_nome = escola_nome ,
            this.escola_fantasia = escola_fantasia ,
            this.escola_end = escola_end ,
            this.escola_endcompl = escola_endcompl ,
            this.escola_endbairro = escola_endbairro ,
            this.escola_endcidade = escola_endcidade ,
            this.escola_enduf = escola_enduf ,
            this.escola_endcep = escola_endcep ,
            this.escola_coordenador = escola_coordenador ,
            this.escola_coorwhatsapp = escola_coorwhatsapp ,
            this.escola_professor = escola_professor ,
            this.escola_profwhatsapp = escola_profwhatsapp ,
            this.escola_fixo = escola_fixo ,
            this.escola_obs = escola_obs ,
            this.escola_datacad = dataAtual ,
            this.escola_dataedi = escola_dataedi
        }
}



EscolaSchema.loadClass(Escola)
const EscolaModel = mongoose.model('tb_escola', EscolaSchema)
module.exports = {EscolaModel,EscolaSchema,
    escolaEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EscolaModel.findByIdAndUpdate(req.body.escolaId, 
            {$set: {
                escola_nome : req.body.escolaNome ,
                escola_fantasia : req.body.escolaFantasia ,
                escola_end : req.body.escolaEnd ,
                escola_endcompl : req.body.escolaEndcompl ,
                escola_endbairro : req.body.escolaEndbairro ,
                escola_endcidade : req.body.escolaEndcidade ,
                escola_enduf : req.body.escolaEnduf ,
                escola_endcep : req.body.escolaEndcep ,
                escola_coordenador : req.body.escolaCoordenador ,
                escola_coorwhatsapp : req.body.escolaCoorwhatsapp ,
                escola_professor : req.body.escolaProfessor ,
                escola_profwhatsapp : req.body.escolaProfwhatsapp ,
                escola_fixo : req.body.escolaFixo ,
                escola_obs : req.body.escolaObs ,
                escola_dataedi: dataAtual
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





    escolaAdicionar: async (req,res) => {
        let escolaExiste =  await EscolaModel.findOne({escola_nome: req.body.escolaNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(escolaExiste){//se tiver null cai no else
            return "O nome da escola já existe";
        } else {
            console.log("escolamodel");
            const newEscola = new EscolaModel({
                escola_nome : req.body.escolaNome ,
                escola_fantasia : req.body.escolaFantasia ,
                escola_end : req.body.escolaEnd ,
                escola_endcompl : req.body.escolaEndcompl ,
                escola_endbairro : req.body.escolaEndbairro ,
                escola_endcidade : req.body.escolaEndcidade ,
                escola_enduf : req.body.escolaEnduf ,
                escola_endcep : req.body.escolaEndcep ,
                escola_coordenador : req.body.escolaCoordenador ,
                escola_coorwhatsapp : req.body.escolaCoorwhatsapp ,
                escola_professor : req.body.escolaProfessor ,
                escola_profwhatsapp : req.body.escolaProfwhatsapp ,
                escola_fixo : req.body.escolaFixo ,
                escola_obs : req.body.escolaObs ,
                escola_datacad: dataAtual
            });
            console.log("newEscola save");
            await newEscola.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};