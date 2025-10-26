const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const RefAtendSchema = mongoose.Schema({
    next_num :{
        type: ObjectId,
        required: true
    }
})

class RefAtend{
    constructor(
        next_num
        ){
        this.next_num = next_num
    }
}

RefAtendSchema.loadClass(RefAtend)
var RefAtendModel = getModel("softroute", 'tb_refatend', RefAtendSchema)
module.exports = {
    RefAtendModel,
    RefAtendSchema,

    refAtendEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        RefAtendModel = getModel(db, 'tb_refatend', RefAtendSchema)
        //;

        let resultado;
        /*
        //Pega data atual
        //Realiza Atualização
        await RefAtendModel.findByIdAndUpdate(req.body.refAtendId, 
            {$set: {
                atend_id: req.body.atendId,
                credit_id: req.body.creditId,
                debit_id: debitId,
                corrente_id: req.body.correnteId,
                tabil_id: req.body.tabilId
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
        */
    },
    refAtendAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        RefAtendModel = getModel(db, 'tb_refatend', RefAtendSchema)
        //;
        
        let RefAtendExiste =  await RefAtendModel.findOne({atend_id: req.body.atendId});//quando não acha fica null
        if(RefAtendExiste){//se tiver null cai no else
            return "O relacionamento já existe";
            //programar alert
        } else {
            console.log("salamodel");
            const newRefAtend = new RefAtendModel({
                next_num: req.body.nextNum
            });
            console.log("newSala save");
            await newRefAtend.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },
    refAtendNextNum: async (req,res) => {
        let nextNum =  await RefAtendModel.find().sort({atend_num : -1}).limit(1);
        nextNum.atend_id = nextNum.atend_id + 1;
        return nextNum;
    }
};
//.find().sort({atend_id : -1}).limit(1);