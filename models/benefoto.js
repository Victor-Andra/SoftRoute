const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });

const BenefotoSchema = mongoose.Schema({
  benefoto_beneid: {type: ObjectId, required: false },
  benefoto_nome: {type: String, unique: true, required: true,},
  benefoto_codigo: {type: String, required: true,},
  benefoto_uf: {type: String, required: true,},
  benefoto_bandeira: {type: Buffer,  required: false, },// Utiliza Buffer para armazenar dados binários da imagem
  //controle CRUD
  benefoto_datacad: {type: Date,  required: false, },
  benefoto_dataedi: {type: Date, required: false,},
  benefoto_usuidcad: {type: ObjectId, required: false },
  benefoto_usuidedi: {type: ObjectId, required: false },
  benefoto_lixo :{ type: String, required: false },
  benefoto_datalixo: { type: Date, required: false },
  benefoto_usuidlixo: { type: ObjectId, required: false }
})

class Benefoto {
  constructor(
    benefoto_beneid,
    benefoto_nome,
    benefoto_foto,
    //Controle CRUD
    benefoto_datacad,
    benefoto_dataedi,
    benefoto_usuidcad,
    benefoto_usuidedi,
    benefoto_lixo,
    benefoto_datalixo,
    benefoto_usuidlixo
  ) {
    this.benefoto_beneid = benefoto_beneid,
    this.benefoto_nome = benefoto_nome,
    this.benefoto_foto = benefoto_foto,
    //Controle CRUD
    this.benefoto_datacad = benefoto_datacad,
    this.benefoto_dataedi = benefoto_dataedi,
    this.benefoto_usuidcad = benefoto_usuidcad,
    this.benefoto_usuidedi = benefoto_usuidedi,
    this.benefoto_lixo = benefoto_lixo,
    this.benefoto_datalixo = benefoto_datalixo,
    this.benefoto_usuidlixo = benefoto_usuidlixo
  }
}

BenefotoSchema.loadClass(Benefoto);
const BenefotoModel = mongoose.model('tb_benefoto', BenefotoSchema);

module.exports = {
  BenefotoModel,
  BenefotoSchema,

    benefotoAdicionar: async (req, res) => {
        try {
            // Processa o upload antes de acessar req.body
            await new Promise((resolve, reject) => {
                upload.single('benefotoBandeira')(req, res, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });

            const { benefotoBeneid, benefotoNome, benefotoCodigo, benefotoUf } = req.body;

            // Validação do ID
            if (!benefotoBeneid || !mongoose.Types.ObjectId.isValid(benefotoBeneid)) {
                throw new Error("ID inválido para beneficiário");
            }

            const usuarioAtual = req.cookies['idUsu'];
            const dataAtual = new Date();

            // Monta os dados da foto
            const dadosFoto = {
                benefoto_beneid: benefotoBeneid,
                benefoto_nome: benefotoNome,
                benefoto_datacad: dataAtual,
                benefoto_foto: req.file ? req.file.buffer : undefined,
                benefoto_usuidcad: usuarioAtual,
                benefoto_lixo: "false"
            };

            // Substitui o registro (atualiza ou insere se não existir)
            const resultado = await BenefotoModel.findOneAndReplace(
                { benefoto_beneid: benefotoBeneid },
                dadosFoto,
                { upsert: true, new: true }
            );

            console.log("Cadastro/Atualização realizada com sucesso:", resultado);
            return 'true';

        } catch (error) {
            console.error("Erro ao cadastrar/atualizar:", error.message);
            throw error;
        }
    },
    benefotoEditar: async (req, res) => {
        try {
            let dataAtual = new Date();
            let usuarioAtual = req.cookies['idUsu'];
            // Transforme o middleware do Multer em uma Promise
            const uploadMiddleware = (req, res) => {
                return new Promise((resolve, reject) => {
                    upload.single('benefotoBandeira')(req, res, (err) => {
                        if (err) reject(err);
                        else resolve();
                    });
                });
            };

            // Aguarde o upload do arquivo, se houver
            await uploadMiddleware(req, res);

            const updateData = {
                $set: {
                    benefoto_nome: req.body.benefotoNome,
                    benefoto_dataedi: dataAtual,
                    benefoto_usuidedi: usuarioAtual,
                }
            };

            // Verifique se há um arquivo enviado antes de tentar acessar req.file
            if (req.file) {
                updateData.$set.benefoto_foto = req.file.buffer;
            }

            await BenefotoModel.findByIdAndUpdate(req.body.benefotoId, updateData);

            return "true";
        } catch (error) {
            console.error(error);
            return "false";
        }
    },
    benefotoAtualizar: async (req, res) => {
        try {
            // Processa o upload antes de acessar req.body
            await new Promise((resolve, reject) => {
                upload.single('benefotoBandeira')(req, res, (err) => {
                    if (err) return reject(err);
                    resolve();
                });
            });

            const { benefotoBeneid, benefotoNome, benefotoCodigo, benefotoUf } = req.body;

            // Validação do ID
            if (!benefotoBeneid || !mongoose.Types.ObjectId.isValid(benefotoBeneid)) {
                throw new Error("ID inválido para beneficiário");
            }

            const usuarioAtual = req.cookies['idUsu'];
            const dataAtual = new Date();

            // Atualiza ou insere novo registro
            const updatedBenefoto = {
                benefoto_beneid: benefotoBeneid,
                benefoto_nome: benefotoNome,
               
                benefoto_dataedi: dataAtual,
                benefoto_foto: req.file ? req.file.buffer : undefined,
                benefoto_usuidedi: usuarioAtual,
                benefoto_lixo: "false"
            };

            const result = await BenefotoModel.findOneAndUpdate(
                { benefoto_beneid: benefotoBeneid },
                updatedBenefoto,
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );

            console.log("Atualização realizada:", result);
            return 'true';

        } catch (error) {
            console.error("Erro ao atualizar:", error.message);
            throw error;
        }
    }
};