const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId


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
        nome: String,
        path: String,
        required: false
    }, 
    estado_datacad: {
        type: Date
    },
    estado_dataedi: {
        type: Date
    }
    
})

class Estado{
    constructor(estado_nome,estado_codigo,estado_uf,estado_datacad,estado_dataedi){
        this.estado_nome = estado_nome,
        this.estado_codigo = estado_codigo,
        this.estado_uf = estado_uf,
        this.estado_bandeira = estado_bandeira,
        this.estado_datacad = estado_datacad,
        this.estado_dataedi = estado_dataedi
    }
}

const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

EstadoSchema.loadClass(Estado)
const EstadoModel = mongoose.model('tb_estado', EstadoSchema) 

module.exports = {EstadoModel,EstadoSchema,

    estadoAdicionar: async (req, res) => {
        let estadoExiste = await EstadoModel.findOne({ estado_nome: req.body.estadoNome });
        let dataAtual = new Date();
    
        if (estadoExiste) {
            return "O nome do estado já existe";
        } else {
            const newEstado = new EstadoModel({
                estado_nome: req.body.estadoNome,
                estado_codigo: req.body.estadoCodigo,
                estado_uf: req.body.estadoUf,
                estado_datacad: dataAtual,
            });
    
            if (req.file) {
                newEstado.estado_bandeira = {
                    nome: req.file.originalname,
                    path: '/uploads/' + req.file.filename,
                };
            }
    
            await newEstado.save().then(() => {
                console.log("Cadastro realizado!");
                res.redirect('/admin');
            }).catch((err) => {
                console.log(err);
                res.render('error');
            });
        }
    },

    estadoEditar: async (req, res) => {
        let dataAtual = new Date();
    
        // Processar o upload do arquivo usando o middleware
        upload.single('estadoBandeira')(req, res, async (err) => {
            if (err) {
                console.error(err);
                res.render('error');
                return;
            }
    
            // Atualizar o documento do estado com as informações da bandeira se houver uma nova imagem
            if (req.file) {
                await EstadoModel.findByIdAndUpdate(req.body.estadoId, {
                    $set: {
                        estado_nome: req.body.estadoNome,
                        estado_codigo: req.body.estadoCodigo,
                        estado_uf: req.body.estadoUf,
                        'estado_bandeira.nome': req.file.originalname,
                        'estado_bandeira.path': '/uploads/' + req.file.filename,
                        estado_dataedi: dataAtual,
                    },
                });
            } else {
                await EstadoModel.findByIdAndUpdate(req.body.estadoId, {
                    $set: {
                        estado_nome: req.body.estadoNome,
                        estado_codigo: req.body.estadoCodigo,
                        estado_uf: req.body.estadoUf,
                        estado_dataedi: dataAtual,
                    },
                });
            }
    
            res.redirect('/admin');
        });
    },
    
    
};