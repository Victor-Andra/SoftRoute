const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const PermissaoSchema = mongoose.Schema({
    permissao_data: { type: String, required: false },
    permissao_tipo: { type: String, required: false },
    permissao_datacad: { type: Date, required: false },
    permissao_usuidedi: { type: ObjectId, required: false },
    permissao_usuidedi: [
        {
            _id: { type: mongoose.Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId() },
            permissao_dataedi: { type: Date, required: false }
        }
    ]
})

class Permissao{
    constructor(
        permissao_data, 
        permissao_tipo,
        permissao_datacad, 
        permissao_usuidcad, 
        permissao_dataedi, 
        permissao_usuidedi 
         ){
            this.permissao_data = permissao_data, //Ok
            this.permissao_tipo = permissao_tipo,
            this.permissao_datacad = permissao_datacad,
            this.permissao_usuidcad = permissao_usuidcad,
            this.permissao_dataedi = permissao_dataedi,
            this.permissao_usuidedi = permissao_usuidedi

    }
}

PermissaoSchema.loadClass(Permissao)
var PermissaoModel = getModel("softroute", 'tb_permissao', PermissaoSchema)
module.exports = {
    PermissaoModel,
    PermissaoSchema,

    permissaoEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        PermissaoModel = getModel(db, 'tb_permissao', PermissaoSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let permissaoId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("permissaoId:"+permissaoId)
        //Realiza Atualização
        await PermissaoModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                permissao_terapeutaid : req.body.permissaoTerapeutaid,
                permissao_beneid : req.body.permissaoBeneid,
                permissao_data : req.body.permissaoData,
                permissao_mes : req.body.permissaoMes,
                permissao_tipo : req.body.permissaoTipo,
                permissao_resp : req.body.permissaoResp,
                permissao_andamento : req.body.permissaoAndamento,
                permissao_dataedi : dataAtual, 
                permissao_usuidedi : idUsu
                }}
                ).then((res) =>{
                    console.log("Salvo")
                    resultado = true;
                }).catch((err) =>{
                    console.log("erro mongo:")
                    console.log(err)
                    resultado = err;
                })
                return resultado;
            
    },
    permissaoAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        PermissaoModel = getModel(db, 'tb_permissao', PermissaoSchema)
        //;

        //Validar se a Permissaoese existe
        console.log("permissaomodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newPermissao = new PermissaoModel({
                permissao_id: req.body.permissaoId,
                permissao_terapeutaid : req.body.permissaoTerapeutaid,
                permissao_beneid : req.body.permissaoBeneid,
                permissao_data : req.body.permissaoData,
                permissao_mes : req.body.permissaoMes,
                permissao_tipo : req.body.permissaoTipo,
                permissao_resp : req.body.permissaoResp,
                permissao_andamento : req.body.permissaoAndamento,
                permissao_datacad : dataAtual, 
                permissao_usuidcad : idUsu
                
        });
        console.log("newPermissao save");
        await newPermissao.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};