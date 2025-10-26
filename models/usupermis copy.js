// models/usupermis.js
const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const { getModel } = require('../functions/fncGeral');

// Definição do Schema
const UsupermisSchema = mongoose.Schema({
    usupermis_empresaid: { type: ObjectId, ref: 'tb_empresa', required: true },
    usupermis_usuid: { type: ObjectId, ref: 'tb_usuario', required: true },
    usupermis_codfunc: { type: ObjectId, ref: 'tb_usufunc', required: true },//ObjectId criado pelo moogose que define a funcionalidade
    usupermis_nomefunc: { type: String, required: true },
    usupermis_codigofunc: { type: String, required: false },//codigo criado pelo usuario para definir a funcionalidade exemplo: 2.01
    usupermis_tipo: { 
        type: String,
        enum: ['1', '2', '3', '4', '5', '6'],
        default: '1',
        required: true
    },
    // Controle
    usupermis_datacad: { type: Date, default: Date.now },
    usupermis_dataedi: { type: Date },
    usupermis_usuidcad: { type: ObjectId, ref: 'tb_usuario' },
    usupermis_usuidedi: { type: ObjectId, ref: 'tb_usuario' },
    usupermis_lixo: { type: String, default: "false" },
    usupermis_datalixo: { type: Date },
    usupermis_usuidlixo: { type: ObjectId, ref: 'tb_usuario' }
}, { collection: 'tb_usupermis' });


// Definição da classe Usupermis (opcional, para usar com .loadClass)
class Usupermis {
    constructor(
        usupermis_empresaid,
        usupermis_usuid,
        usupermis_codfunc,//ObjectId criado pelo moogose que define a funcionalidade
        usupermis_nomefunc,
        usupermis_codigofunc,//erro de campo
        usupermis_tipo,
        usupermis_datacad,
        usupermis_dataedi,
        usupermis_usuidcad,
        usupermis_usuidedi,
        usupermis_lixo,
        usupermis_datalixo,
        usupermis_usuidlixo
    ) {
        this.usupermis_empresaid = usupermis_empresaid;
        this.usupermis_usuid = usupermis_usuid;
        this.usupermis_codfunc = usupermis_codfunc;//ObjectId criado pelo moogose que define a funcionalidade
        this.usupermis_nomefunc = usupermis_nomefunc;
        this.usupermis_codigofunc = usupermis_codigofunc;//codigo criado pelo usuario para definir a funcionalidade exemplo: 2.01
        this.usupermis_tipo = usupermis_tipo;
        this.usupermis_datacad = usupermis_datacad;
        this.usupermis_dataedi = usupermis_dataedi;
        this.usupermis_usuidcad = usupermis_usuidcad;
        this.usupermis_usuidedi = usupermis_usuidedi;
        this.usupermis_lixo = usupermis_lixo;
        this.usupermis_datalixo = usupermis_datalixo;
        this.usupermis_usuidlixo = usupermis_usuidlixo;
    }
}

// Garante unicidade
UsupermisSchema.index({ usupermis_usuid: 1, usupermis_empresaid: 1, usupermis_codfunc: 1 }, { unique: true });

// Carrega a classe (opcional)
UsupermisSchema.loadClass(Usupermis);

// Cria o modelo
const UsupermisModel = getModel("PortalDoUsuario", 'tb_usupermis', UsupermisSchema)

// Exporta
module.exports = { 
    UsupermisModel, 
    UsupermisSchema,

    usupermisEditar: async (req, res) => {
    
        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;
    
            let dataAtual = new Date();
            let usuarioAtual = req.cookies['idUsu'];
            let resultado;
            //Pega data atual
            
            //Realiza Atualização
            await UsupermisModel.findByIdAndUpdate(req.body.usupermisId, 
                {$set: {
                    usupermis_nome: req.body.usupermisNome,
                    usupermis_descricao: req.body.usupermisDescricao,
                    usupermis_status: req.body.usupermisStatus,
                    usupermis_usuidedi : usuarioAtual, 
                    usupermis_dataedi: dataAtual,
                    usupermis_lixo : "false"
                    }}
            ).then((res) =>{
                console.log("Salvo")
                resultado = true;
            }).catch((err) =>{
                console.log("erro mongo:")
                console.log(err)
                resultado = err;
                //res.redirect('admin/branco')
            })
            return resultado;
        },
    
    
        usupermisAdicionar: async (req,res) => {
    
        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;
            
            let usupermisExiste =  await UsupermisModel.findOne({usupermis_nome: req.body.usupermisNome});//quando não acha fica null
            let dataAtual = new Date();
            let usuarioAtual = req.cookies['idUsu'];
            let resultado;
            if(usupermisExiste){//se tiver null cai no else
                return "O nome da usupermis já existe";
                //programar alert
            } else {
                console.log("usupermismodel");
                const newUsupermis = new UsupermisModel({
                    usupermis_nome: req.body.usupermisNome,
                    usupermis_descricao: req.body.usupermisDescricao,
                    usupermis_status: "Ativo",
                    usupermis_datacad: dataAtual,
                    usupermis_usuidcad : usuarioAtual, 
                });
                console.log("newUsupermis save");
                await newUsupermis.save().then(()=>{
                    console.log("Cadastro realizado!");
                    return true;
                }).catch((err) => {
                    console.log(err)
                    return err;
                });
            }
        }

};