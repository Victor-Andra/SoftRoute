const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const versaoSchema = mongoose.Schema({
    versao_idver :{ type: ObjectId, required: false },
    versao_nver :{ type: String, required: false },
    versao_dataver :{ type: String, required: false },
    versao_status :{ type: String, required: false }, //Projeto, Iniciado, Andamento, Concluído, Testardo, Validado
    //Atributos de controle
    versao_usuidcad :{ type: ObjectId, required: false },
    versao_usuidedi :{ type: ObjectId, required: false },
    versao_datacad :{ type: String, required: false },
    versao_dataedi :{ type: String, required: false },
    versao_lixo : { type: String, required: false }
    
})

class versao{
    constructor(
        versao_idver,
        versao_nver,
        versao_dataver,
        versao_status,
        //Atributos de controle
        versao_usuidcad,
        versao_usuidedi,
        versao_datacad,
        versao_dataedi,
        versao_lixo
        ){
        this.versao_idver = versao_idver,
        this.versao_nver = versao_nver,
        this.versao_dataver = versao_dataver,
        this.versao_status = versao_status,
        //Atributos de controle
        this.versao_usuidcad = versao_usuidcad,
        this.versao_usuidedi = versao_usuidedi,
        this.versao_datacad = versao_datacad,
        this.versao_dataedi = versao_dataedi,
        this.versao_lixo = versao_lixo

    }
}

versaoSchema.loadClass(versao)
const versaoModel = mongoose.model('tb_versao', versaoSchema)
module.exports = {versaoModel,versaoSchema,
    versaoEditar: async (req, res) => {
        //Pega data atual
        let dataAtual = new Date();
        //Pega o usuario atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        
        //Realiza Atualização
        await versaoModel.findByIdAndUpdate(req.body.versaoId, 
            {$set: {
                versao_idver : req.body.versaoIdver,
                versao_nver : req.body.versaoNver,
                versao_dataver : req.body.versaoDataver,
                versao_status : req.body.versaoStatus,
                
                //Atributos de controle
                versao_usuidedi : usuarioAtual,
                versao_dataedi : dataAtual.toISOString()
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
    versaoAdicionar: async (req,res) => {
        //Pega data atual
        let dataAtual = new Date();
        //Pega o usuario atual
        let usuarioAtual = req.cookies['idUsu'];

        const newversao = new versaoModel({
            versao_idver : req.body.versaoIdver,
            versao_nver : req.body.versaoNver,
            versao_dataver : req.body.versaoDataver,
            versao_status : req.body.versaoStatus,
           
            //Atributos de controle
            versao_usuidcad : usuarioAtual,
            versao_datacad : dataAtual.toISOString(),
            versao_lixo : "false"
            
        });
        console.log("newversao save");
        await newversao.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};