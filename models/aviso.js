const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AvisoSchema = mongoose.Schema({
   
    aviso_avisodata :{
        type: Date,
        required: true
    },
    aviso_tipo :{
        type: String,
        required: false
    },
     aviso_desc :{
        type: String,
        required: true
    },
    aviso_grau :{
        type: String,
        required: false
    },
    aviso_concluido:{
        type: String,
        required: false
    },
    aviso_usuid :{
        type: ObjectId,
        required: true
    },
    aviso_datacad :{
        type: Date,
        required: false
    },
    aviso_usuidedi :{
        type: ObjectId,
        required: false
    },
    aviso_dataedi :{
        type: Date,
        required: false
    }
})

class Aviso{
    constructor(
        aviso_avisodata,
        aviso_tipo,
        aviso_desc,
        aviso_grau,
        aviso_concluido,
        aviso_usuid,
        aviso_datacad,
        aviso_usuidedi,
        aviso_dataedi
        ){
        this.aviso_avisodata = aviso_avisodata,
        this.aviso_tipo = aviso_tipo,
        this.aviso_desc = aviso_desc,
        this.aviso_grau = aviso_grau,
        this.aviso_concluido = aviso_concluido,
        this.aviso_usuid = aviso_usuid,
        this.aviso_datacad = aviso_datacad,
        this.aviso_usuidedi = aviso_usuidedi,
        this.aviso_dataedi = aviso_dataedi
             
    }
}

AvisoSchema.loadClass(Aviso)
const AvisoModel = mongoose.model('tb_aviso', AvisoSchema)
module.exports = {AvisoModel,AvisoSchema,
    avisoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AvisoModel.findByIdAndUpdate(req.body.avisoId, 
            {$set: {
                aviso_avisodata : req.body.avisoAvisodata,
                aviso_tipo : req.body.avisoTipo,
                aviso_desc : req.body.avisoDesc,
                aviso_grau : req.body.aviso_Grau,
                aviso_concluido : req.body.avisoConcluido,
                aviso_usuid : req.body.avisoUsuid,
                aviso_datacad : req.body.avisoDatacad,
                aviso_usuidedi : req.body.avisoUsuidedi,
                aviso_dataedi :  dataAtual.toISOString()
                
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
    avisoAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("avisomodel");
        console.log("req.body.avisodata:")
        console.log(req.body.avisodata)
        const NewAviso = new AvisoModel({
            aviso_avisodata : req.body.avisoAvisodata,
                aviso_tipo : req.body.avisoTipo,
                aviso_desc : req.body.avisoDesc,
                aviso_grau : req.body.aviso_Grau,
                aviso_concluido : req.body.avisoConcluido,
                aviso_usuid : req.body.avisoUsuid,
                aviso_datacad : dataAtual.toISOString(),
                aviso_usuidedi : req.body.avisoUsuidedi,
                aviso_dataedi : req.body.avisoDataedi
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};