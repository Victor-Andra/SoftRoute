const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const UsufuncSchema = mongoose.Schema({
    usufunc_codigo: { type: String, unique: true, required: true },
    usufunc_nome: { type: String, required: true},
    usufunc_descricao: { type: String, required: true},
    usufunc_status: { type: String, required: false },
     // ✅ Campos novos — opcionais, retrocompatíveis
    usufunc_icone: { type: String, default: "fa-circle-o", required: false },
    usufunc_cor: { type: String, default: "gray",required: false },
    usufunc_ordem: { type: Number, default: 999, required: false },
    usufunc_rota: { type: String, required: false },
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
        usufunc_icone,
        usufunc_cor,
        usufunc_ordem,
        usufunc_rota,
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
        this.usufunc_icone = usufunc_icone,
        this.usufunc_cor = usufunc_cor,
        this.usufunc_ordem = usufunc_ordem,
        this.usufunc_rota = usufunc_rota,
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
const UsufuncModel = getModel("PortalDoUsuario", 'tb_usufunc', UsufuncSchema)
module.exports = {
    UsufuncModel,
    UsufuncSchema,

    usufuncEditar: async (req, res) => {

        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;

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
                // novos campos (se enviados)
                usufunc_icone: req.body.usufuncIcone,
                usufunc_cor: req.body.usufuncCor,
                usufunc_ordem: req.body.usufuncOrdem,
                usufunc_rota: req.body.usufuncRota,
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

        //Estrutura Multiempresa não usa para essa Schema pois ele acessa direto 
        //;
       
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
                // novos campos (se enviados)
                usufunc_icone: req.body.usufuncIcone || "fa-circle-o",
                usufunc_cor: req.body.usufuncCor || "gray",
                usufunc_ordem: req.body.usufuncOrdem ? parseInt(req.body.usufuncOrdem) : 999,
                usufunc_rota: req.body.usufuncRota,
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