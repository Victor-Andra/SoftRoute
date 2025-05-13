const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const FuncionalidadeSchema = mongoose.Schema({
    funcionalidade_codigo: {type: String, unique: true, required: true},
    funcionalidade_nome: {type: String, unique: true, required: true},
    funcionalidade_descricao: {type: String, required: false},
    //controle
    funcionalidade_datacad: { type: Date, required: false },
    funcionalidade_usuidcad: { type: ObjectId, required: false },
    funcionalidade_dataedi: { type: Date, required: false },
    funcionalidade_usuidedi: { type: ObjectId, required: false },
    funcionalidade_lixo :{ type: String, required: false },
    funcionalidade_datalixo: { type: String, required: false },
    funcionalidade_usuidlixo: { type: ObjectId, required: false }
})

class Funcionalidade{
    constructor(
        funcionalidade_codigo,
        funcionalidade_nome,
        funcionalidade_descricao,
        //Controle
        funcionalidade_datacad,
        funcionalidade_usuidcad,
        funcionalidade_dataedi,
        funcionalidade_usuidedi,
        funcionalidade_lixo,
        funcionalidade_datalixo,
        funcionalidade_usuidlixo,
        ){
        this.funcionalidade_codigo = funcionalidade_codigo,
        this.funcionalidade_nome = funcionalidade_nome,
        this.funcionalidade_descricao = funcionalidade_descricao,
        //Controle
        this.funcionalidade_datacad = funcionalidade_datacad,
        this.funcionalidade_usuidcad = funcionalidade_usuidcad,
        this.funcionalidade_dataedi = funcionalidade_dataedi,
        this.funcionalidade_usuidedi = funcionalidade_usuidedi,
        this.funcionalidade_lixo = funcionalidade_lixo,
        this.funcionalidade_datalixo = funcionalidade_datalixo,
        this.funcionalidade_usuidlixo = funcionalidade_usuidlixo
    }
}

FuncionalidadeSchema.loadClass(Funcionalidade)
const FuncionalidadeModel = mongoose.model('tb_funcionalidade', FuncionalidadeSchema)
module.exports = {FuncionalidadeModel,FuncionalidadeSchema,
    funcionalidadeAdicionar: async (req,res) => {
        let funcionalidadeExiste =  await FuncionalidadeModel.findOne({funcionalidade_nome: req.body.funcionalidadeNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        if(funcionalidadeExiste){//se tiver null cai no else
            return "O Funcionalidade atribuído já existe no Sistema!";
            //programar alert
        } else {
            console.log("funcionalidademodel");
            const newFuncionalidade = new FuncionalidadeModel({
                funcionalidade_codigo: req.body.funcionalidadeCodigo,
                funcionalidade_nome: req.body.funcionalidadeNome,
                funcionalidade_descricao: req.body.funcionalidadeDescricao,
                //Controles
                funcionalidade_datacad: dataAtual,
                funcionalidade_usuidcad: usuarioAtual,
                funcionalidade_lixo: "false",
            });
            console.log("newFuncionalidade save");
            await newFuncionalidade.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    funcionalidadeEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        //Pega data atual
        
        //Realiza Atualização
        await FuncionalidadeModel.findByIdAndUpdate(req.body.funcionalidadeId, 
            {$set: {
                funcionalidade_codigo: req.body.funcionalidadeCodigo,
                funcionalidade_nome: req.body.funcionalidadeNome,
                funcionalidade_descricao: req.body.funcionalidadeDescricao,
                //Controles
                funcionalidade_dataedi: dataAtual,
                funcionalidade_usuidedi: usuarioAtual,
                }}
        ).then((res) =>{
            console.log("Alteração Salva!")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },
    funcionalidadeDeletar: async (funcionalidadeId, req, res) => { // Recebe o ID como parâmetro
        console.log("ID recebido na classe funcionalidadeDeletar:", funcionalidadeId); // Verificação
      
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];
      
        try {
          // Usa o ID recebido diretamente
          const resultado = await FuncionalidadeModel.findByIdAndUpdate(
            funcionalidadeId,
            {
              $set: {
                funcionalidade_lixo: "true",
                funcionalidade_datalixo: dataAtual,
                funcionalidade_usuidlixo: usuarioAtual
              }
            },
            { new: true } // Retorna o documento atualizado
          );
      
          console.log("Registro atualizado:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro no funcionalidadeDeletar:", err);
          throw err;
        }
      },
};