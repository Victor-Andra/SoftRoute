//Configurações dos Textos pardrões para Evoluções dos Supervisores (Modelo)
//Criado em: 2025-09-26 Wagner Cintra
//Editado em:
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const EvolucaoconfSchema = mongoose.Schema({
    evolucaoconf_categoria: {type: String, required: false},
    evolucaoconf_titulo: { type: String, required: false },
    evolucaoconf_evolucaopad: {type: String, required: false},
    //controle
    evolucaoconf_datacad: { type: Date, required: false },
    evolucaoconf_usuidcad: { type: ObjectId, required: false },
    evolucaoconf_dataedi: { type: Date, required: false },
    evolucaoconf_usuidedi: { type: ObjectId, required: false },
    evolucaoconf_lixo :{ type: String, required: false },
    evolucaoconf_datalixo: { type: String, required: false },
    evolucaoconf_usuidlixo: { type: ObjectId, required: false }
})

class Evolucaoconf{
    constructor(
        evolucaoconf_categoria,
        evolucaoconf_titulo,
        evolucaoconf_evolucaopad,
        //Controle
        evolucaoconf_datacad,
        evolucaoconf_usuidcad,
        evolucaoconf_dataedi,
        evolucaoconf_usuidedi,
        evolucaoconf_lixo,
        evolucaoconf_datalixo,
        evolucaoconf_usuidlixo,
        ){
        this.evolucaoconf_categoria = evolucaoconf_categoria,
        this.evolucaoconf_titulo = evolucaoconf_titulo,
        this.evolucaoconf_evolucaopad = evolucaoconf_evolucaopad,
        //Controle
        this.evolucaoconf_datacad = evolucaoconf_datacad,
        this.evolucaoconf_usuidcad = evolucaoconf_usuidcad,
        this.evolucaoconf_dataedi = evolucaoconf_dataedi,
        this.evolucaoconf_usuidedi = evolucaoconf_usuidedi,
        this.evolucaoconf_lixo = evolucaoconf_lixo,
        this.evolucaoconf_datalixo = evolucaoconf_datalixo,
        this.evolucaoconf_usuidlixo = evolucaoconf_usuidlixo
    }
}

EvolucaoconfSchema.loadClass(Evolucaoconf)
var EvolucaoconfModel = getModel("softroute", 'tb_evolucaoconf', EvolucaoconfSchema)
module.exports = {
    EvolucaoconfModel,
    EvolucaoconfSchema,

    evolucaoconfAdicionarOLD: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        EvolucaoconfModel = getModel(db, 'tb_evolucaoconf', EvolucaoconfSchema)
        //;

        let evolucaoconfExiste =  await EvolucaoconfModel.findOne({evolucaoconf_nome: req.body.evolucaoconfNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        if(evolucaoconfExiste){//se tiver null cai no else
            return "O Evolucaoconf atribuído já existe no Sistema!";
            //programar alert
        } else {
            console.log("evolucaoconfmodel");
            const newEvolucaoconf = new EvolucaoconfModel({
                evolucaoconf_categoria : req.body.evolucaoconfCategoria,
                evolucaoconf_titulo : req.body.evolucaoconfTitulo,
                evolucaoconf_evolucaopad : req.body.evolucaoconfEvolucaopad,
                //Controles
                evolucaoconf_datacad: dataAtual,
                evolucaoconf_usuidcad: usuarioAtual,
                evolucaoconf_lixo: "false",
            });
            console.log("newEvolucaoconf save");
            await newEvolucaoconf.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },

    evolucaoconfAdicionar: async (req, res) => {
        // Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        let usuarioAtual = req.cookies['idUsu'];
        EvolucaoconfModel = getModel(db, 'tb_evolucaoconf', EvolucaoconfSchema);

        const dataAtual = new Date();

        const newEvolucaoconf = new EvolucaoconfModel({
            evolucaoconf_categoria: req.body.evolucaoconfCategoria,
            evolucaoconf_titulo: req.body.evolucaoconfTitulo,
            evolucaoconf_evolucaopad: req.body.evolucaoconfEvolucaopad,
            evolucaoconf_datacad: dataAtual,
            evolucaoconf_usuidcad: usuarioAtual,
            evolucaoconf_lixo: "false",
        });

        try {
            await newEvolucaoconf.save();
            console.log("Cadastro realizado!");
            return true;
        } catch (err) {
            console.log("Erro ao salvar:", err);
            throw err; // Lança o erro para ser capturado
        }
    },
    evolucaoconfEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        EvolucaoconfModel = getModel(db, 'tb_evolucaoconf', EvolucaoconfSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        let usuarioAtual = req.cookies['idUsu'];
        //Pega data atual
        
        //Realiza Atualização
        await EvolucaoconfModel.findByIdAndUpdate(req.body.evolucaoconfId, 
            {$set: {
                evolucaoconf_categoria : req.body.evolucaoconfCategoria,
                evolucaoconf_titulo : req.body.evolucaoconfTitulo,
                evolucaoconf_evolucaopad : req.body.evolucaoconfEvolucaopad,
                //Controles
                evolucaoconf_dataedi: dataAtual,
                evolucaoconf_usuidedi: usuarioAtual,
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
    evolucaoconfDeletar: async (evolucaoconfId, db, usuarioAtual) => {
        // Não usa req nem res aqui — só dados puros
        EvolucaoconfModel = getModel(db, 'tb_evolucaoconf', EvolucaoconfSchema);

        const dataAtual = new Date();

        try {
            const resultado = await EvolucaoconfModel.findByIdAndUpdate(
                evolucaoconfId,
                {
                    $set: {
                        evolucaoconf_lixo: "true",
                        evolucaoconf_datalixo: dataAtual,
                        evolucaoconf_usuidlixo: usuarioAtual
                    }
                },
                { new: true }
            );
            return resultado;
        } catch (err) {
            console.error("Erro no evolucaoconfDeletar:", err);
            throw err;
        }
    }
};