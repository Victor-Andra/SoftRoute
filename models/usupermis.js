const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const UsupermisSchema = mongoose.Schema({
    usupermis_usuid: { type: ObjectId, required: false },
    usupermis_codfunc: { type: String, required: true},
    usupermis_tipo: { type: String, required: false },// 1 = sem acesso; 2 = ver; 3 = Listar; 4 = Criar; 5 = Editar; 6 = Total.
    //controle CRUD
    usupermis_datacad: { type: Date, required: false  },
    usupermis_dataedi: { type: Date, required: false  },
    usupermis_usuidcad: { type: ObjectId, required: false },
    usupermis_usuidedi: { type: ObjectId, required: false },
    usupermis_lixo :{ type: String, required: false },
    usupermis_datalixo: { type: String, required: false },
    usupermis_usuidlixo: { type: ObjectId, required: false }
    
})

class Usupermis{
    constructor(
        usupermis_usuid,
        usupermis_codfunc,
        usupermis_tipo,// 1 = sem acesso; 2 = ver; 3 = Listar; 4 = Criar; 5 = Editar; 6 = Total.
        //controle CRUD
        usupermis_datacad,
        usupermis_dataedi,
        usupermis_usuidcad,
        usupermis_usuidedi,
        usupermis_lixo,
        usupermis_datalixo,
        usupermis_usuidlixo
        ){
        this.usupermis_usuid = usupermis_usuid,
        this.usupermis_codfunc = usupermis_codfunc,
        this.usupermis_tipo = usupermis_tipo,// 1 = sem acesso; 2 = ver; 3 = Listar; 4 = Criar; 5 = Editar; 6 = Total.
        //controle CRUD
        this.usupermis_datacad = usupermis_datacad,
        this.usupermis_dataedi = usupermis_dataedi,
        this.usupermis_usuidcad = usupermis_usuidcad,
        this.usupermis_usuidedi = usupermis_usuidedi,
        this.usupermis_lixo = usupermis_lixo,
        this.usupermis_datalixo = usupermis_datalixo,
        this.usupermis_usuidlixo = usupermis_usuidlixo
    }
}

UsupermisSchema.loadClass(Usupermis)
const UsupermisModel = mongoose.model('tb_usupermis', UsupermisSchema)
module.exports = {UsupermisModel,UsupermisSchema,
    usupermisEditar: async (req, res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await UsupermisModel.findByIdAndUpdate(req.body.usupermisId, 
            {$set: {
                usupermis_usuid: req.body.usupermisUsuid,
                usupermis_codfunc: req.body.usupermisCodfunc,
                usupermis_tipo: req.body.usupermisTipo,// 1 = sem acesso; 2 = ver; 3 = Listar; 4 = Criar; 5 = Editar; 6 = Total.
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
                usupermis_usuid: req.body.usupermisUsuid,
                usupermis_codfunc: req.body.usupermisCodfunc,// 1 = sem acesso; 2 = ver; 3 = Listar; 4 = Criar; 5 = Editar; 6 = Total.
                usupermis_tipo: req.body.usupermisTipo,
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