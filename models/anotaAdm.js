const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// Esquema AnotaAdm
// Criado por: Wagner Cintra
// Criado em: 2026/02/03
// Criado por conta de Uso indevido do cadastro dos beneficiários, cadastrando evento como beneficiário (Bloqueio, Reunião etc)
// causando erro de Modelagem, erro em relatórios diversos, erros em listagem.
// Editado em: 
const AnotaAdmSchema = mongoose.Schema({
    anotaAdm_tipo: {type: String, required: true},
    anotaAdm_nome: {type: String, unique: true, required: true},
    anotaAdm_descricao: {type: String, required: false},
    //controle
    anotaAdm_datacad: { type: Date, required: false },
    anotaAdm_usuidcad: { type: ObjectId, required: false },
    anotaAdm_dataedi: { type: Date, required: false },
    anotaAdm_usuidedi: { type: ObjectId, required: false },
    anotaAdm_lixo :{ type: String, required: false },
    anotaAdm_datalixo: { type: String, required: false },
    anotaAdm_usuidlixo: { type: ObjectId, required: false }
})

// Construtor AnotaAdm
// Criado por: Wagner Cintra
// Criado em: 2026/02/03
// Editado em: 
class AnotaAdm{
    constructor(
        anotaAdm_tipo,
        anotaAdm_nome,
        anotaAdm_descricao,
        //Controle
        anotaAdm_datacad,
        anotaAdm_usuidcad,
        anotaAdm_dataedi,
        anotaAdm_usuidedi,
        anotaAdm_lixo,
        anotaAdm_datalixo,
        anotaAdm_usuidlixo,
        ){
        this.anotaAdm_tipo = anotaAdm_tipo,
        this.anotaAdm_nome = anotaAdm_nome,
        this.anotaAdm_descricao = anotaAdm_descricao,
        //Controle
        this.anotaAdm_datacad = anotaAdm_datacad,
        this.anotaAdm_usuidcad = anotaAdm_usuidcad,
        this.anotaAdm_dataedi = anotaAdm_dataedi,
        this.anotaAdm_usuidedi = anotaAdm_usuidedi,
        this.anotaAdm_lixo = anotaAdm_lixo,
        this.anotaAdm_datalixo = anotaAdm_datalixo,
        this.anotaAdm_usuidlixo = anotaAdm_usuidlixo
    }
}

AnotaAdmSchema.loadClass(AnotaAdm)
const AnotaAdmModel = getModel("PortalDoUsuario", 'tb_anotaAdm', AnotaAdmSchema)
module.exports = {
    AnotaAdmModel,
    AnotaAdmSchema,
    
    // AnotaAdm
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em:
    anotaAdmAdicionar: async (req,res) => {
        let anotaAdmExiste = await AnotaAdmModel.findOne({anotaAdm_nome: req.body.anotaAdmNome});
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        if(anotaAdmExiste){
            return "O AnotaAdm atribuído já existe no Sistema!";
        } else {
            console.log("anotaAdmmodel");
            const newAnotaAdm = new AnotaAdmModel({
                anotaAdm_tipo: req.body.anotaAdmTipo,
                anotaAdm_nome: req.body.anotaAdmNome,
                anotaAdm_descricao: req.body.anotaAdmDescricao,
                //Controles
                anotaAdm_datacad: dataAtual,
                anotaAdm_usuidcad: usuarioAtual,
                anotaAdm_lixo: "false",
            });
            console.log("newAnotaAdm save");
            
            try {
                await newAnotaAdm.save();
                console.log("Cadastro realizado!");
                return true;  // ✅ Agora retorna corretamente
            } catch (err) {
                console.log(err);
                return err;   // ✅ Agora retorna corretamente
            }
        }
    },
    
    // AnotaAdm Editar
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em:
    anotaAdmEditar: async (req, res) => {

         //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        //Pega data atual
        
        //Realiza Atualização
        await AnotaAdmModel.findByIdAndUpdate(req.body.anotaAdmId, 
            {$set: {
                anotaAdm_tipo: req.body.anotaAdmTipo,
                anotaAdm_nome: req.body.anotaAdmNome,
                anotaAdm_descricao: req.body.anotaAdmDescricao,
                //Controles
                anotaAdm_dataedi: dataAtual,
                anotaAdm_usuidedi: usuarioAtual,
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
    
    // AnotaAdm Deletar (com Lixeira)
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em: 
    anotaAdmDeletar: async (anotaAdmId, req, res) => { // Recebe o ID como parâmetro

        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        console.log("ID recebido na classe anotaAdmDeletar:", anotaAdmId); // Verificação
      
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];
      
        try {
          // Usa o ID recebido diretamente
          const resultado = await AnotaAdmModel.findByIdAndUpdate(
            anotaAdmId,
            {
              $set: {
                anotaAdm_lixo: "true",
                anotaAdm_datalixo: dataAtual,
                anotaAdm_usuidlixo: usuarioAtual
              }
            },
            { new: true } // Retorna o documento atualizado
          );
      
          console.log("Registro atualizado:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro no anotaAdmDeletar:", err);
          throw err;
        }
      },
};