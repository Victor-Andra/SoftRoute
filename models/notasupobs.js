const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const notasupobsSchema = mongoose.Schema({
    notaSupObs_beneid :{
        type: ObjectId,
        required: true
    },
    notaSupObs_progid :{
        type: ObjectId,
        required: true
    },
    notaSupObs_analise :{
        type: String,
        required: false
    },
    notaSupObs_sugestao :{
        type: String,
        required: false
    },
    notaSup_id :{
        type: ObjectId,
        required: true
    }
})

class notasupobs{
    constructor(
        notaSupObs_beneid,
        notaSupObs_progid,
        notaSupObs_analise,   
        notaSupObs_sugestao,
        notaSup_id
        ){
        this.notaSupObs_beneid = notaSupObs_beneid,
        this.notaSupObs_progid = notaSupObs_progid,
        this.notaSupObs_analise = notaSupObs_analise,
        this.notaSupObs_sugestao = notaSupObs_sugestao,
        this.notaSup_id = notaSup_id
    }
}

notasupobsSchema.loadClass(notasupobs)
var notasupobsModel = getModel("softroute", 'tb_notasupobs', notasupobsSchema)
module.exports = {
    notasupobsModel,
    notasupobsSchema,

    notaSupObsEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        notasupobsModel = getModel(db, 'tb_notasupobs', notasupobsSchema)
        //;

        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await notasupobsModel.findByIdAndUpdate(req.body.notaSupObsId, 
            {$set: {
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notaSupObsProgid,
                notaSupObs_analise: req.body.notaSupObsAnalise,   
                notaSupObs_sugestao: req.body.notaSupObsSugestao
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log("ERRO: "+err);
            resultado = err;
        })
        return resultado;
    },
    notaSupObsAdicionarMuitos: async (req,res,notaSup_id) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        notasupobsModel = getModel(db, 'tb_notasupobs', notasupobsSchema)
        //;

        let dataAtual = new Date();
        console.log("notaSupObsmodel");
        //trabalhar a func aqui
        let qtdTrNotasupObs = req.body.qtdTrNotasupObs;
        let newidId;
        let arrayNewIds = "";
        let qtd = parseInt((""+qtdTrNotasupObs+""));

        //console.log("req.body.notasupObsprogid_1 != undefined && qtd >= 1: "+(req.body.notasupObsprogid_1 != undefined && qtd >= 1))
        if (req.body.notasupObsprogid_1 != undefined && qtd >= 1){
            newidId = new ObjectId();
            arrayNewIds = ""+newidId+"";

            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_1,
                notaSupObs_analise: req.body.notasupObsana_1,
                notaSupObs_sugestao: req.body.notasupObssugest_1,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save1");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_2 != undefined && qtd >= 2: "+req.body.notasupObsprogid_2 != undefined && qtd >= 2)
        if (req.body.notasupObsprogid_2 != undefined && qtd >= 2){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";

            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_2,
                notaSupObs_analise: req.body.notasupObsana_2,
                notaSupObs_sugestao: req.body.notasupObssugest_2,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save2");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_3 != undefined && qtd >= 3: "+(req.body.notasupObsprogid_3 != undefined && qtd >= 3))
        if (req.body.notasupObsprogid_3 != undefined && qtd >= 3){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";

            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_3,
                notaSupObs_analise: req.body.notasupObsana_3,
                notaSupObs_sugestao: req.body.notasupObssugest_3,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save3");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_4 != undefined && qtd >= 4? "+(req.body.notasupObsprogid_4 != undefined && qtd >= 4))
        if (req.body.notasupObsprogid_4 != undefined && qtd >= 4){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_4,
                notaSupObs_analise: req.body.notasupObsana_4,
                notaSupObs_sugestao: req.body.notasupObssugest_4,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save4");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }
        
        console.log("req.body.notasupObsprogid_5 != undefined && qtd >= 5: "+(req.body.notasupObsprogid_5 != undefined && qtd >= 5))
        if (req.body.notasupObsprogid_5 != undefined && qtd >= 5){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_5,
                notaSupObs_analise: req.body.notasupObsana_5,
                notaSupObs_sugestao: req.body.notasupObssugest_5,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save5");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_6 != undefined && qtd >= 6: "+(req.body.notasupObsprogid_6 != undefined && qtd >= 6))
        if (req.body.notasupObsprogid_6 != undefined && qtd >= 6){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_6,
                notaSupObs_analise: req.body.notasupObsana_6,
                notaSupObs_sugestao: req.body.notasupObssugest_6,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save6");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_7 != undefined && qtd >= 7: "+(req.body.notasupObsprogid_7 != undefined && qtd >= 7))
        if (req.body.notasupObsprogid_7 != undefined && qtd >= 7){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_7,
                notaSupObs_analise: req.body.notasupObsana_7,
                notaSupObs_sugestao: req.body.notasupObssugest_7,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save7");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }
        
        console.log("req.body.notasupObsprogid_8 != undefined && qtd >= 8: "+(req.body.notasupObsprogid_8 != undefined && qtd >= 8))
        if (req.body.notasupObsprogid_8 != undefined && qtd >= 8){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_8,
                notaSupObs_analise: req.body.notasupObsana_8,
                notaSupObs_sugestao: req.body.notasupObssugest_8,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save8");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_9 != undefined && qtd >= 9? "+(req.body.notasupObsprogid_9 != undefined && qtd >= 9))
        if (req.body.notasupObsprogid_9 != undefined && qtd >= 9){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_9,
                notaSupObs_analise: req.body.notasupObsana_9,
                notaSupObs_sugestao: req.body.notasupObssugest_9,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save9");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_10 != undefined && qtd >= 10???????? "+(req.body.notasupObsprogid_10 != undefined && qtd >= 10));
        if (req.body.notasupObsprogid_10 != undefined && qtd >= 10){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newnotasupobs = new notasupobsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progid: req.body.notasupObsprogid_10,
                notaSupObs_analise: req.body.notasupObsana_10,
                notaSupObs_sugestao: req.body.notasupObssugest_10,
                notaSup_id : notaSup_id
            });

            console.log("newnotasupobs save10");
            await newnotasupobs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("Cadastro realizado!");
        return arrayNewIds;
    }
};