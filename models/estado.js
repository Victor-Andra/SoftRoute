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
        this.estado_datacad = estado_datacad,
        this.estado_dataedi = estado_dataedi
    }
}

EstadoSchema.loadClass(Estado)
const EstadoModel = mongoose.model('tb_estado', EstadoSchema)
module.exports = {EstadoModel,EstadoSchema,
    estadoEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await EstadoModel.findByIdAndUpdate(req.body.estadoId, 
            {$set: {
                estado_nome: req.body.estadoNome,
                estado_codigo:  req.body.estadoCodigo,
                estado_uf:  req.body.estadoUf,
                estado_dataedi: dataAtual
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





    estadoAdicionar: async (req,res) => {
        let estadoExiste =  await EstadoModel.findOne({estado_nome: req.body.estadoNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(estadoExiste){//se tiver null cai no else
            return "O nome da estado já existe";
            //programar alert
        } else {
            console.log("estadomodel");
            const newEstado = new EstadoModel({
                estado_nome: req.body.estadoNome,
                estado_codigo:  req.body.estadoCodigo,
                estado_uf:  req.body.estadoUf,
                estado_datacad: dataAtual
            });
            console.log("newEstado save");
            await newEstado.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};