const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const FuncaoSchema = mongoose.Schema({
    funcao_nome: {
        type: String,
        unique: true,
        required: true
    },
    funcao_descricao: {
        type: String,
        required: true
    },
    funcao_datacad: {
        type: Date
    },
    funcao_dataedi: {
        type: Date
    }
    
})

class Funcao{
    constructor(funcao_nome,funcao_descricao,funcao_datacad,funcao_dataedi){
        this.funcao_nome = funcao_nome,
        this.funcao_descricao = funcao_descricao,
        this.funcao_datacad = funcao_datacad,
        this.funcao_dataedi = funcao_dataedi
    }
}


FuncaoSchema.loadClass(Funcao)
const FuncaoModel = mongoose.model('tb_funcao', FuncaoSchema)
module.exports = {FuncaoModel,FuncaoSchema,
    funcaoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await FuncaoModel.findByIdAndUpdate(req.body.funcaoId, 
            {$set: {
                funcao_nome: req.body.funcaoNome,
                funcao_descricao: req.body.funcaoDescricao,
                funcao_dataedi: dataAtual
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






    funcaoAdicionar: async (req,res) => {
        console.log('terapia/ dentro do add')
        let funcaoExiste =  await FuncaoModel.findOne({funcao_nome: req.body.funcaoNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(funcaoExiste){//se tiver null cai no else
            return "O nome da funcao já existe";
        } else {
            console.log("funcaomodel");
            const newFuncao = new FuncaoModel({
                funcao_nome: req.body.funcaoNome,
                funcao_descricao: req.body.funcaoDescricao,
                funcao_datacad: dataAtual
            });
            console.log("newFuncao save");
            await newFuncao.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};