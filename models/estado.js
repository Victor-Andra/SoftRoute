const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId

const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });

const EstadoSchema = mongoose.Schema({
  estado_nome: {type: String, unique: true, required: true,},
  estado_codigo: {type: String, required: true,},
  estado_uf: {type: String, required: true,},
  estado_bandeira: {type: Buffer,  required: false, },// Utiliza Buffer para armazenar dados binários da imagem
  //controle CRUD
  estado_datacad: {type: Date,  required: false, },
  estado_dataedi: {type: Date, required: false,},
  estado_usuidcad: {type: ObjectId, required: false },
  estado_usuidedi: {type: ObjectId, required: false },
  estado_lixo :{ type: String, required: false },
  estado_datalixo: { type: Date, required: false },
  estado_usuidlixo: { type: ObjectId, required: false }
})

class Estado {
  constructor(
    estado_nome,
    estado_codigo,
    estado_uf,
    estado_bandeira,
    //Controle CRUD
    estado_datacad,
    estado_dataedi,
    estado_usuidcad,
    estado_usuidedi,
    estado_lixo,
    estado_datalixo,
    estado_usuidlixo
  ) {
    this.estado_nome = estado_nome,
    this.estado_codigo = estado_codigo,
    this.estado_uf = estado_uf,
    this.estado_bandeira = estado_bandeira,
    //Controle CRUD
    this.estado_datacad = estado_datacad,
    this.estado_dataedi = estado_dataedi,
    this.estado_usuidcad = estado_usuidcad,
    this.estado_usuidedi = estado_usuidedi,
    this.estado_lixo = estado_lixo,
    this.estado_datalixo = estado_datalixo,
    this.estado_usuidlixo = estado_usuidlixo
  }
}

EstadoSchema.loadClass(Estado);
const EstadoModel = mongoose.model('tb_estado', EstadoSchema);

module.exports = {
  EstadoModel,
  EstadoSchema,

   estadoAdicionar: async (req, res) => {
    let resultado;
    //Pega data atual
    let usuarioAtual = req.cookies['idUsu'];
    //Realiza Atualização
    try {
      let estadoExiste = await EstadoModel.findOne({ estado_nome: req.body.estadoNome });
      let dataAtual = new Date();
  
      if (estadoExiste) {
        return res.send("O nome do estado já existe");
      }
  
      // Transforme o middleware do Multer em uma Promise
      const uploadMiddleware = (req, res) => {
        return new Promise((resolve, reject) => {
          upload.single('estadoBandeira')(req, res, (err) => {
            if (err) reject(err);
            else resolve();
          });
        });
      };
  
      // Aguarde o upload ser concluído antes de continuar
      await uploadMiddleware(req, res);
      
      const newEstado = new EstadoModel({
        estado_nome: req.body.estadoNome,
        estado_codigo: req.body.estadoCodigo,
        estado_uf: req.body.estadoUf,
        estado_datacad: dataAtual,
        estado_bandeira: req.file ? req.file.buffer : undefined,
        estado_usuidcad: usuarioAtual,
        estado_lixo: "false"
      });
      await newEstado.save();
      console.log("Cadastro realizado!");
      return 'true';
    } catch (error) {
      console.error(error);
      res.render('admin/erro')
    }
  },
  
  estadoEditar: async (req, res) => {
    try {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        // Transforme o middleware do Multer em uma Promise
        const uploadMiddleware = (req, res) => {
            return new Promise((resolve, reject) => {
                upload.single('estadoBandeira')(req, res, (err) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        };

        // Aguarde o upload do arquivo, se houver
        await uploadMiddleware(req, res);

        const updateData = {
            $set: {
                estado_nome: req.body.estadoNome,
                estado_codigo: req.body.estadoCodigo,
                estado_uf: req.body.estadoUf,
                estado_dataedi: dataAtual,
                estado_usuidedi: usuarioAtual,
            }
        };

        // Verifique se há um arquivo enviado antes de tentar acessar req.file
        if (req.file) {
            updateData.$set.estado_bandeira = req.file.buffer;
        }

        await EstadoModel.findByIdAndUpdate(req.body.estadoId, updateData);

        return "true";
    } catch (error) {
        console.error(error);
        return "false";
    }
  },
};