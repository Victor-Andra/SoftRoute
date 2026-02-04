const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// Esquema AgendaEvento
// Criado por: Wagner Cintra
// Criado em: 2026/02/03
// Criado por conta de Uso indevido do cadastro dos beneficiários, cadastrando evento como beneficiário (Bloqueio, Reunião etc)
// causando erro de Modelagem, erro em relatórios diversos, erros em listagem.
// Editado em: 
const AgendaEventoSchema = mongoose.Schema({
    agendaEvento_nome: {type: String, unique: true, required: true},
    agendaEvento_descricao: {type: String, required: false},
    //controle
    agendaEvento_datacad: { type: Date, required: false },
    agendaEvento_usuidcad: { type: ObjectId, required: false },
    agendaEvento_dataedi: { type: Date, required: false },
    agendaEvento_usuidedi: { type: ObjectId, required: false },
    agendaEvento_lixo :{ type: String, required: false },
    agendaEvento_datalixo: { type: String, required: false },
    agendaEvento_usuidlixo: { type: ObjectId, required: false }
})

// Construtor AgendaEvento
// Criado por: Wagner Cintra
// Criado em: 2026/02/03
// Editado em: 
class AgendaEvento{
    constructor(
        agendaEvento_nome,
        agendaEvento_descricao,
        //Controle
        agendaEvento_datacad,
        agendaEvento_usuidcad,
        agendaEvento_dataedi,
        agendaEvento_usuidedi,
        agendaEvento_lixo,
        agendaEvento_datalixo,
        agendaEvento_usuidlixo,
        ){
        this.agendaEvento_nome = agendaEvento_nome,
        this.agendaEvento_descricao = agendaEvento_descricao,
        //Controle
        this.agendaEvento_datacad = agendaEvento_datacad,
        this.agendaEvento_usuidcad = agendaEvento_usuidcad,
        this.agendaEvento_dataedi = agendaEvento_dataedi,
        this.agendaEvento_usuidedi = agendaEvento_usuidedi,
        this.agendaEvento_lixo = agendaEvento_lixo,
        this.agendaEvento_datalixo = agendaEvento_datalixo,
        this.agendaEvento_usuidlixo = agendaEvento_usuidlixo
    }
}

AgendaEventoSchema.loadClass(AgendaEvento)
const AgendaEventoModel = getModel("PortalDoUsuario", 'tb_agendaEvento', AgendaEventoSchema)
module.exports = {
    AgendaEventoModel,
    AgendaEventoSchema,
    
    // AgendaEvento
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em:
    agendaEventoAdicionar: async (req,res) => {
        let agendaEventoExiste = await AgendaEventoModel.findOne({agendaEvento_nome: req.body.agendaEventoNome});
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        if(agendaEventoExiste){
            return "O AgendaEvento atribuído já existe no Sistema!";
        } else {
            console.log("agendaEventomodel");
            const newAgendaEvento = new AgendaEventoModel({
                agendaEvento_nome: req.body.agendaEventoNome,
                agendaEvento_descricao: req.body.agendaEventoDescricao,
                //Controles
                agendaEvento_datacad: dataAtual,
                agendaEvento_usuidcad: usuarioAtual,
                agendaEvento_lixo: "false",
            });
            console.log("newAgendaEvento save");
            
            try {
                await newAgendaEvento.save();
                console.log("Cadastro realizado!");
                return true;  // ✅ Agora retorna corretamente
            } catch (err) {
                console.log(err);
                return err;   // ✅ Agora retorna corretamente
            }
        }
    },
    
    // AgendaEvento Editar
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em:
    agendaEventoEditar: async (req, res) => {

         //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        //Pega data atual
        
        //Realiza Atualização
        await AgendaEventoModel.findByIdAndUpdate(req.body.agendaEventoId, 
            {$set: {
                agendaEvento_nome: req.body.agendaEventoNome,
                agendaEvento_descricao: req.body.agendaEventoDescricao,
                //Controles
                agendaEvento_dataedi: dataAtual,
                agendaEvento_usuidedi: usuarioAtual,
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
    
    // AgendaEvento Deletar (com Lixeira)
    // Criado por: Wagner Cintra
    // Criado em: 2026/02/03
    // Editado em: 
    agendaEventoDeletar: async (agendaEventoId, req, res) => { // Recebe o ID como parâmetro

        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

        console.log("ID recebido na classe agendaEventoDeletar:", agendaEventoId); // Verificação
      
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];
      
        try {
          // Usa o ID recebido diretamente
          const resultado = await AgendaEventoModel.findByIdAndUpdate(
            agendaEventoId,
            {
              $set: {
                agendaEvento_lixo: "true",
                agendaEvento_datalixo: dataAtual,
                agendaEvento_usuidlixo: usuarioAtual
              }
            },
            { new: true } // Retorna o documento atualizado
          );
      
          console.log("Registro atualizado:", resultado);
          return resultado;
        } catch (err) {
          console.error("Erro no agendaEventoDeletar:", err);
          throw err;
        }
      },
};