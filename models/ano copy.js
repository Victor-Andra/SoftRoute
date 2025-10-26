const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// Esquema Ano
// Criado por: Wagner Cintra
// Criado em: 2025/03/20
// Editado em: 
const AnoSchema = mongoose.Schema({
    ano_nome: {type: String, unique: true, required: true},
    ano_descricao: {type: String, required: false},
    //controle
    ano_datacad: { type: Date, required: false },
    ano_usuidcad: { type: ObjectId, required: false },
    ano_dataedi: { type: Date, required: false },
    ano_usuidedi: { type: ObjectId, required: false },
    ano_lixo :{ type: String, required: false },
    ano_datalixo: { type: String, required: false },
    ano_usuidlixo: { type: ObjectId, required: false }
})

// Construtor Ano
// Criado por: Wagner Cintra
// Criado em: 2025/03/20
// Editado em: 
class Ano{
    constructor(
        ano_nome,
        ano_descricao,
        //Controle
        ano_datacad,
        ano_usuidcad,
        ano_dataedi,
        ano_usuidedi,
        ano_lixo,
        ano_datalixo,
        ano_usuidlixo,
        ){
        this.ano_nome = ano_nome,
        this.ano_descricao = ano_descricao,
        //Controle
        this.ano_datacad = ano_datacad,
        this.ano_usuidcad = ano_usuidcad,
        this.ano_dataedi = ano_dataedi,
        this.ano_usuidedi = ano_usuidedi,
        this.ano_lixo = ano_lixo,
        this.ano_datalixo = ano_datalixo,
        this.ano_usuidlixo = ano_usuidlixo
    }
}

AnoSchema.loadClass(Ano)
const AnoModel = getModel("PortalDoUsuario", 'tb_ano', AnoSchema)
module.exports = {
    AnoModel,
    AnoSchema,
    
    // Ano
    // Criado por: Wagner Cintra
    // Criado em: 2025/03/20
    // Editado em: 2025/10/03
    anoAdicionar: async (req,res) => {

         //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        let anoExiste =  await AnoModel.findOne({ano_nome: req.body.anoNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        if(anoExiste){//se tiver null cai no else
            return "O Ano atribuído já existe no Sistema!";
            //programar alert
        } else {
            console.log("anomodel");
            const newAno = new AnoModel({
                ano_nome: req.body.anoNome,
                ano_descricao: req.body.anoDescricao,
                //Controles
                ano_datacad: dataAtual,
                ano_usuidcad: usuarioAtual,
                ano_lixo: "false",
            });
            console.log("newAno save");
            await newAno.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    
    // Ano Editar
    // Criado por: Wagner Cintra
    // Criado em: 2025/03/20
    // Editado em: 2025/10/03
    anoEditar: async (req, res) => {

         //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        //Pega data atual
        
        //Realiza Atualização
        await AnoModel.findByIdAndUpdate(req.body.anoId, 
            {$set: {
                ano_nome: req.body.anoNome,
                ano_descricao: req.body.anoDescricao,
                //Controles
                ano_dataedi: dataAtual,
                ano_usuidedi: usuarioAtual,
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
    
    // Ano Deletar (com Lixeira)
    // Criado por: Wagner Cintra
    // Criado em: 2025/03/20
    // Editado em: 2025/10/03
    anoDeletar: async (anoId, req, res) => { // Recebe o ID como parâmetro

        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        console.log("ID recebido na classe anoDeletar:", anoId); // Verificação
      
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];
      
        try {
          // Usa o ID recebido diretamente
          const resultado = await AnoModel.findByIdAndUpdate(
            anoId,
            {
              $set: {
                ano_lixo: "true",
                ano_datalixo: dataAtual,
                ano_usuidlixo: usuarioAtual
              }
            },
            { new: true } // Retorna o documento atualizado
          );
      
          console.log("Registro atualizado:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro no anoDeletar:", err);
          throw err;
        }
      },
};