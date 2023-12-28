const mongoose = require('mongoose');
const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });

const EstadoSchema = mongoose.Schema({
  estado_nome: {
    type: String,
    unique: true,
    required: true,
  },
  estado_codigo: {
    type: String,
    required: true,
  },
  estado_uf: {
    type: String,
    required: true,
  },
  estado_bandeira: {
    type: Buffer, // Utiliza Buffer para armazenar dados binários da imagem
    required: false,
  },
  estado_datacad: {
    type: Date,
  },
  estado_dataedi: {
    type: Date,
  },
});

class Estado {
  constructor(
    estado_nome,
    estado_codigo,
    estado_uf,
    estado_bandeira,
    estado_datacad,
    estado_dataedi
  ) {
    this.estado_nome = estado_nome;
    this.estado_codigo = estado_codigo;
    this.estado_uf = estado_uf;
    this.estado_bandeira = estado_bandeira;
    this.estado_datacad = estado_datacad;
    this.estado_dataedi = estado_dataedi;
  }
}

EstadoSchema.loadClass(Estado);
const EstadoModel = mongoose.model('tb_estado', EstadoSchema);

module.exports = {
  EstadoModel,
  EstadoSchema,

   estadoAdicionar: async (req, res) => {
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
      });
  
      await newEstado.save();
      console.log("Cadastro realizado!");
      return res.redirect('/admin');
    } catch (error) {
      console.error(error);
      return res.status(500).render('error');
    }
  },
  
  
  
  estadoEditar: async (req, res) => {
    try {
      let dataAtual = new Date();

      const updateData = {
        $set: {
          estado_nome: req.body.estadoNome,
          estado_codigo: req.body.estadoCodigo,
          estado_uf: req.body.estadoUf,
          estado_dataedi: dataAtual,
        }
      };

      if (req.file) {
        updateData.$set.estado_bandeira = req.file.buffer;
      }

      await EstadoModel.findByIdAndUpdate(req.body.estadoId, updateData);

    } catch (error) {
      console.error(error);
    }
  },
};