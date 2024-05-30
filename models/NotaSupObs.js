const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const NotaSupObsSchema = mongoose.Schema({
    notaSupObs_beneid :{
        type: ObjectId,
        required: true
    },
    notaSupObs_progId :{
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
    }
})

class NotaSupObs{
    constructor(
        notaSupObs_beneid,
        notaSupObs_progId,
        notaSupObs_analise,   
        notaSupObs_sugestao
        ){
        this.notaSupObs_beneid = notaSupObs_beneid,
        this.notaSupObs_progId = notaSupObs_progId,
        this.notaSupObs_analise = notaSupObs_analise,   
        this.notaSupObs_sugestao = notaSupObs_sugestao
    }
}

NotaSupObsSchema.loadClass(NotaSupObs)
const NotaSupObsModel = mongoose.model('tb_notaSupObs', NotaSupObsSchema)
module.exports = {NotaSupObsModel,NotaSupObsSchema,
    notaSupObsEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await NotaSupObsModel.findByIdAndUpdate(req.body.notaSupObsId, 
            {$set: {
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notaSupObsProgid,
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
    notaSupObsAdicionarMuitos: async (req,res) => {
        let dataAtual = new Date();
        console.log("notaSupObsmodel");
        //trabalhar a func aqui
        let qtdTrNotasupObs = req.body.qtdTrNotasupObs;
        let newidId;
        let arrayNewIds = "";
        let qtd = parseInt((""+qtdTrNotasupObs+""));
        
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("qtd: "+qtd)
        console.log("req.body.notasupObsprogid_1 != undefined && qtd >= 1: "+(req.body.notasupObsprogid_1 != undefined && qtd >= 1))
        if (req.body.notasupObsprogid_1 != undefined && qtd >= 1){
            newidId = new ObjectId();
            arrayNewIds = ""+newidId+"";

            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_1,
                notaSupObs_analise: req.body.notasupObsana_1,   
                notaSupObs_sugestao: req.body.notasupObssugest_1
            });

            console.log("newNotaSupObs save1");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_2 != undefined && qtd >= 2: "+req.body.notasupObsprogid_2 != undefined && qtd >= 2)
        if (req.body.notasupObsprogid_2 != undefined && qtd >= 2){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";

            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_2,
                notaSupObs_analise: req.body.notasupObsana_2,   
                notaSupObs_sugestao: req.body.notasupObssugest_2
            });

            console.log("newNotaSupObs save2");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_3 != undefined && qtd >= 3: "+(req.body.notasupObsprogid_3 != undefined && qtd >= 3))
        if (req.body.notasupObsprogid_3 != undefined && qtd >= 3){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";

            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_3,
                notaSupObs_analise: req.body.notasupObsana_3,   
                notaSupObs_sugestao: req.body.notasupObssugest_3
            });

            console.log("newNotaSupObs save3");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_4 != undefined && qtd >= 4? "+(req.body.notasupObsprogid_4 != undefined && qtd >= 4))
        if (req.body.notasupObsprogid_4 != undefined && qtd >= 4){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_4,
                notaSupObs_analise: req.body.notasupObsana_4,   
                notaSupObs_sugestao: req.body.notasupObssugest_4
            });

            console.log("newNotaSupObs save4");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }
        
        console.log("req.body.notasupObsprogid_5 != undefined && qtd >= 5: "+(req.body.notasupObsprogid_5 != undefined && qtd >= 5))
        if (req.body.notasupObsprogid_5 != undefined && qtd >= 5){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_5,
                notaSupObs_analise: req.body.notasupObsana_5,   
                notaSupObs_sugestao: req.body.notasupObssugest_5
            });

            console.log("newNotaSupObs save5");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_6 != undefined && qtd >= 6: "+(req.body.notasupObsprogid_6 != undefined && qtd >= 6))
        if (req.body.notasupObsprogid_6 != undefined && qtd >= 6){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_6,
                notaSupObs_analise: req.body.notasupObsana_6,   
                notaSupObs_sugestao: req.body.notasupObssugest_6
            });

            console.log("newNotaSupObs save6");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_7 != undefined && qtd >= 7: "+(req.body.notasupObsprogid_7 != undefined && qtd >= 7))
        if (req.body.notasupObsprogid_7 != undefined && qtd >= 7){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_7,
                notaSupObs_analise: req.body.notasupObsana_7,   
                notaSupObs_sugestao: req.body.notasupObssugest_7
            });

            console.log("newNotaSupObs save7");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }
        
        console.log("req.body.notasupObsprogid_8 != undefined && qtd >= 8: "+(req.body.notasupObsprogid_8 != undefined && qtd >= 8))
        if (req.body.notasupObsprogid_8 != undefined && qtd >= 8){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_8,
                notaSupObs_analise: req.body.notasupObsana_8,   
                notaSupObs_sugestao: req.body.notasupObssugest_8
            });

            console.log("newNotaSupObs save8");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_9 != undefined && qtd >= 9? "+(req.body.notasupObsprogid_9 != undefined && qtd >= 9))
        if (req.body.notasupObsprogid_9 != undefined && qtd >= 9){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_9,
                notaSupObs_analise: req.body.notasupObsana_9,   
                notaSupObs_sugestao: req.body.notasupObssugest_9
            });

            console.log("newNotaSupObs save9");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("req.body.notasupObsprogid_10 != undefined && qtd >= 10???????? "+(req.body.notasupObsprogid_10 != undefined && qtd >= 10));
        if (req.body.notasupObsprogid_10 != undefined && qtd >= 10){
            newidId = new ObjectId();
            arrayNewIds = arrayNewIds+","+newidId+"";
            
            const newNotaSupObs = new NotaSupObsModel({
                _id: newidId,
                notaSupObs_beneid : req.body.notasupBeneid,
                notaSupObs_progId: req.body.notasupObsprogid_10,
                notaSupObs_analise: req.body.notasupObsana_10,   
                notaSupObs_sugestao: req.body.notasupObssugest_10
            });

            console.log("newNotaSupObs save10");
            await newNotaSupObs.save().then(()=>{
                
            }).catch((err) => {
                console.log("ERRO: "+err);
                return err;
            });
        }

        console.log("Cadastro realizado!");
        return arrayNewIds;
    }
};