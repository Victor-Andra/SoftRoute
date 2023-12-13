const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket } = require('mongodb');
const ObjectId = mongoose.Types.ObjectId;

const EstadoSchema = mongoose.Schema({
  estado_nome: {
    type: String,
    unique: true,
    required: true
  },
  estado_codigo: {
    type: String,
    required: true
  },
  estado_uf: {
    type: String,
    required: true
  },
  estado_bandeira: {
    type: ObjectId,
    required: false
  },
  estado_datacad: {
    type: Date
  },
  estado_dataedi: {
    type: Date
  }
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

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = {
  EstadoModel,
  EstadoSchema,

  estadoAdicionar: async (req, res) => {
    try {
      let estadoExiste = await EstadoModel.findOne({ estado_nome: req.body.estadoNome });
      let dataAtual = new Date();

      if (estadoExiste) {
        return res.send("O nome do estado já existe");
      } else {
        const newEstado = new EstadoModel({
          estado_nome: req.body.estadoNome,
          estado_codigo: req.body.estadoCodigo,
          estado_uf: req.body.estadoUf,
          estado_datacad: dataAtual
        });

        upload.single('estadoBandeira')(req, res, async (err) => {
          if (err) {
            console.error(err);
            return res.render('error');
          }

          if (req.file) {
            const bucket = new GridFSBucket(mongoose.connection.db, {
              bucketName: 'bandeiras'
            });

            const uploadStream = bucket.openUploadStream(req.file.originalname);
            uploadStream.end(req.file.buffer);

            newEstado.estado_bandeira = uploadStream.id;
          }

          await newEstado.save();
          console.log("Cadastro realizado!");
          return res.redirect('/admin');
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).render('error');
    }
  },

  estadoEditar: async (req, res) => {
    try {
        let dataAtual = new Date();

        upload.single('estadoBandeira')(req, res, async (err) => {
            if (err) {
                console.error(err);
                return res.render('error');
            }

            if (req.file) {
                const bucket = new GridFSBucket(mongoose.connection.db, {
                    bucketName: 'bandeiras'
                });

                const uploadStream = bucket.openUploadStream(req.file.originalname);
                uploadStream.end(req.file.buffer);

                await EstadoModel.findByIdAndUpdate(req.body.estadoId, {
                    $set: {
                        estado_nome: req.body.estadoNome,
                        estado_codigo: req.body.estadoCodigo,
                        estado_uf: req.body.estadoUf,
                        estado_bandeira: uploadStream.id,
                        estado_dataedi: dataAtual
                    },
                });
            } else {
                await EstadoModel.findByIdAndUpdate(req.body.estadoId, {
                    $set: {
                        estado_nome: req.body.estadoNome,
                        estado_codigo: req.body.estadoCodigo,
                        estado_uf: req.body.estadoUf,
                        estado_dataedi: dataAtual
                    },
                });
            }

            return res.redirect('/admin');
        });
    } catch (error) {
        console.error(error);
        return res.status(500).render('error');
    }
  },
};