const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExcecaoteraSchema = mongoose.Schema({

    //Dados do Registro
    
    excecaotera_terapiaid :{ type: ObjectId, required: false },
    excecaotera_terapeutaid :{ type: ObjectId, required: false },
    excecaotera_obs :{ type: String, required: false },
    
    //Atributos de controle
    excecaotera_usuidcad :{ type: ObjectId, required: false },
    excecaotera_usuidedi :{ type: ObjectId, required: false },
    excecaotera_datacad :{ type: String, required: false },
    excecaotera_dataedi :{ type: String, required: false }
    
    
})

class Excecaotera{
    constructor(
       
        excecaotera_terapiaid,
        excecaotera_terapeutaid,
        excecaotera_obs,
        
        //Atributos de controle
        excecaotera_usuidcad,
        excecaotera_usuidedi,
        excecaotera_datacad,
        excecaotera_dataedi
        
            
    ){
    
    //Dados do Registro
    this.excecaotera_terapiaid = excecaotera_terapiaid,
    this.excecaotera_terapeutaid = excecaotera_terapeutaid,
    this.excecaotera_obs = excecaotera_obs,
    //Atributos de controle
    this.excecaotera_usuidcad = excecaotera_usuidcad,
    this.excecaotera_usuidedi = excecaotera_usuidedi,
    this.excecaotera_datacad = excecaotera_datacad,
    this.excecaotera_dataedi = excecaotera_dataedi

   
    }
}

ExcecaoteraSchema.loadClass(Excecaotera)
const ExcecaoteraModel = mongoose.model('tb_excecaotera', ExcecaoteraSchema)
module.exports = {ExcecaoteraModel,ExcecaoteraSchema,
    excecaoteraEditar: async (req, res) => {
        let dataAtual = new Date();//Pega data atual
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        console.log(usuarioAtual);
        
        //Realiza Atualização
        await ExcecaoteraModel.findByIdAndUpdate(req.body.excecaoteraId, 
            {$set: {
               
                excecaotera_terapiaid : req.body.excecaoteraTerapiaid,
                excecaotera_terapeutaid : req.body.excecaoteraTerapeutaid,
                excecaotera_obs : req.body.excecaoteraObs,
                //Atributos de controle
                excecaotera_usuidedi : usuarioAtual,
                excecaotera_dataedi : dataAtual.toISOString()
                

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
    excecaoteraAdicionar: async (req,res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        console.log(usuarioAtual);
        const newExcecaotera = new ExcecaoteraModel({
           
                excecaotera_terapiaid : req.body.excecaoteraTerapiaid,
                excecaotera_terapeutaid : req.body.excecaoteraTerapeutaid,
                excecaotera_obs : req.body.excecaoteraObs,
                //Atributos de controle
                excecaotera_usuidcad : usuarioAtual,
                excecaotera_datacad : dataAtual.toISOString()
            
            
        });
        console.log("newExcecaotera save");
        await newExcecaotera.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log("err:"+err)
            return err;
        });
    }
};