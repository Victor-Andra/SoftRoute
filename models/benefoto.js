// Arquivo: models/benefoto.js

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

// Schema da foto do beneficiário
const BenefotoSchema = mongoose.Schema({
    benefoto_beneid: { type: ObjectId, required: false },
    benefoto_foto: { type: Buffer, required: false }, // Armazena imagem como Buffer
    benefoto_obs: { type: String, required: false },
    benefoto_datacad: { type: Date, required: false },
    benefoto_dataedi: { type: Date, required: false }
});

class Benefoto {
    constructor(benefoto_beneid, benefoto_foto, benefoto_obs, benefoto_datacad, benefoto_dataedi) {
        this.benefoto_beneid = benefoto_beneid;
        this.benefoto_foto = benefoto_foto;
        this.benefoto_obs = benefoto_obs;
        this.benefoto_datacad = benefoto_datacad;
        this.benefoto_dataedi = benefoto_dataedi;
    }
}

BenefotoSchema.loadClass(Benefoto);

const BenefotoModel = mongoose.model('tb_benefoto', BenefotoSchema);

// Configuração do Multer
const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena em memória como Buffer
const upload = multer({ storage }).single('benefotoFoto');

module.exports = {
    BenefotoModel,
    BenefotoSchema,
    upload, // Agora exportando o middleware Multer

    /**
     * Função para cadastrar nova foto
     */
    beneFotoAdicionar: async (req, res) => {
        try {
            const { benefotoBeneId, benefotoObs } = req.body;

            // Verifica se já existe foto para este beneficiário
            let benefotoExiste = await BenefotoModel.findOne({ benefoto_beneid: benefotoBeneId });

            if (benefotoExiste) {
                return "Já existe uma foto cadastrada para este beneficiário";
            }

            // Verifica se foi enviada uma imagem
            if (!req.file || !req.file.buffer) {
                return "Nenhuma imagem foi enviada";
            }

            // Cria novo registro
            const newBene = new BenefotoModel({
                benefoto_beneid: benefotoBeneId,
                benefoto_foto: req.file.buffer,
                benefoto_obs: benefotoObs,
                benefoto_datacad: new Date()
            });

            await newBene.save();
            console.log('Cadastro realizado!');
            return true;

        } catch (err) {
            console.error('Erro em beneFotoAdicionar:', err.message);
            return err;
        }
    },

    /**
     * Função para editar foto existente
     */
    benefotoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;

        try {
            await BenefotoModel.findByIdAndUpdate(req.body.id, {
                $set: {
                    benefoto_beneid: req.body.benefotoBeneId,
                    benefoto_foto: req.file ? req.file.buffer : undefined,
                    benefoto_obs: req.body.benefotoObs,
                    benefoto_dataedi: dataAtual
                }
            }).then(() => {
                console.log("Salvo");
                resultado = true;
            }).catch((err) => {
                console.log("erro mongo:");
                console.log(err);
                resultado = err;
            });

            return resultado;

        } catch (err1) {
            console.error('Erro inesperado:', err1.message);
            return err1;
        }
    }
};