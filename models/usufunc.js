const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const UsufuncSchema = mongoose.Schema({
    usufunc_codigo: { type: String, unique: true, required: true },
    usufunc_nome: { type: String, required: true},
    usufunc_descricao: { type: String, required: true},
    usufunc_status: { type: String, required: false },
    //controle CRUD
    usufunc_datacad: { type: Date, required: false  },
    usufunc_dataedi: { type: Date, required: false  },
    usufunc_usuidcad: { type: ObjectId, required: false },
    usufunc_usuidedi: { type: ObjectId, required: false },
    usufunc_lixo :{ type: String, required: false },
    usufunc_datalixo: { type: String, required: false },
    usufunc_usuidlixo: { type: ObjectId, required: false }
    
})

class Usufunc{
    constructor(
        usufunc_codigo,
        usufunc_nome,
        usufunc_descricao,
        usufunc_status,
        //controle CRUD
        usufunc_datacad,
        usufunc_dataedi,
        usufunc_usuidcad,
        usufunc_usuidedi,
        usufunc_lixo,
        usufunc_datalixo,
        usufunc_usuidlixo
        ){
        this.usufunc_codigo = usufunc_codigo,
        this.usufunc_nome = usufunc_nome,
        this.usufunc_descricao = usufunc_descricao,
        this.usufunc_status = usufunc_status,
        //controle CRUD
        this.usufunc_datacad = usufunc_datacad,
        this.usufunc_dataedi = usufunc_dataedi,
        this.usufunc_usuidcad = usufunc_usuidcad,
        this.usufunc_usuidedi = usufunc_usuidedi,
        this.usufunc_lixo = usufunc_lixo,
        this.usufunc_datalixo = usufunc_datalixo,
        this.usufunc_usuidlixo = usufunc_usuidlixo
    }
}

UsufuncSchema.loadClass(Usufunc)
const UsufuncModel = mongoose.model('tb_usufunc', UsufuncSchema)
module.exports = {UsufuncModel,UsufuncSchema,
    usufuncEditar: async (req, res) => {
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await UsufuncModel.findByIdAndUpdate(req.body.usufuncId, 
            {$set: {
                usufunc_codigo: req.body.usufuncCodigo,
                usufunc_nome: req.body.usufuncNome,
                usufunc_descricao: req.body.usufuncDescricao,
                usufunc_status: req.body.usufuncStatus,
                usufunc_usuidedi : usuarioAtual, 
                usufunc_dataedi: dataAtual,
                usufunc_lixo : "false"
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


    usufuncAdicionar: async (req,res) => {
        let usufuncExiste =  await UsufuncModel.findOne({usufunc_nome: req.body.usufuncNome});//quando não acha fica null
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        if(usufuncExiste){//se tiver null cai no else
            return "O nome da usufunc já existe";
            //programar alert
        } else {
            console.log("usufuncmodel");
            const newUsufunc = new UsufuncModel({
                usufunc_codigo: req.body.usufuncCodigo,
                usufunc_nome: req.body.usufuncNome,
                usufunc_descricao: req.body.usufuncDescricao,
                usufunc_status: "Ativo",
                usufunc_datacad: dataAtual,
                usufunc_usuidcad : usuarioAtual, 
            });
            console.log("newUsufunc save");
            await newUsufunc.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};