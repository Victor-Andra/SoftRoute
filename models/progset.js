const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgprogsetSchema = mongoose.Schema({
    progset_progid :{ type: ObjectId, required: false },
    progset_beneid :{ type: ObjectId, required: false },
    progset_progtipoid :{ type: ObjectId, required: false },
    progset_prognivelid :{ type: ObjectId, required: false },
    progset_dataprogset :{ type: String, required: false },
    progset_dataini :{ type: String, required: false },
    progset_datafin :{ type: String, required: false },
    progset_desc :{ type: String, required: false },
    progset_intro :{ type: String, required: false },
    progset_acsicao :{ type: String, required: false },
    progset_obs :{ type: String, required: false },
    //Atributos de controle
    progset_usuidcad :{ type: ObjectId, required: false },
    progset_usuidedi :{ type: ObjectId, required: false },
    progset_datacad :{ type: String, required: false },
    progset_dataedi :{ type: String, required: false },
    progset_lixo :{ type: String, required: false }
})

class Progprogset{
    constructor(
        progset_progid,
        progset_beneid,
        progset_progtipoid,
        progset_prognivelid,
        progset_dataprogset,
        progset_dataini,
        progset_datafin,
        progset_desc,
        progset_intro,
        progset_acsicao,
        progset_obs,
        //Atributos de controle
        progset_usuidcad,
        progset_usuidedi,
        progset_datacad,
        progset_dataedi,
        progset_lixo
        ){
            this.progset_progid = progset_progid,
            this.progset_beneid = progset_beneid,
            this.progset_progtipoid = progset_progtipoid,
            this.progset_prognivelid = progset_prognivelid,
            this.progset_dataprogset = progset_dataprogset,
            this.progset_dataini = progset_dataini,
            this.progset_datafin = progset_datafin,
            this.progset_desc = progset_desc,
            this.progset_intro = progset_intro,
            this.progset_acsicao = progset_acsicao,
            this.progset_obs = progset_obs,
            //Atributos de controle
            this.progset_usuidcad = progset_usuidcad,
            this.progset_usuidedi = progset_usuidedi,
            this.progset_datacad = progset_datacad,
            this.progset_dataedi = progset_dataedi,
            this.progset_lixo = progset_lixo
    }
}


ProgprogsetSchema.loadClass(Progprogset)
const ProgprogsetModel = mongoose.model('tb_progset', ProgprogsetSchema)
module.exports = {ProgprogsetModel,ProgprogsetSchema,
    progsetEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ProgprogsetModel.findByIdAndUpdate(req.body.progsetId, 
            {$progset: {
                progset_progid : req.body.progsetProgid,
                progset_beneid : req.body.progsetBeneid,
                progset_progtipoid : req.body.progsetProgtipoid,
                progset_prognivelid : req.body.progsetPrognivelid,
                progset_dataprogset : req.body.progsetDataprogset,
                progset_dataini : req.body.progsetDataini,
                progset_datafin : req.body.progsetDatafin,
                progset_desc : req.body.progsetDesc,
                progset_intro : req.body.progsetIntro,
                progset_acsicao : req.body.progsetAcsicao,
                progset_obs : req.body.progsetObs,
                //Atributos de controle
                progset_usuidcad : req.body.progsetUsuidcad,
                progset_usuidedi : req.body.progsetUsuidedi,
                progset_datacad : req.body.progsetDatacad,
                progset_dataedi : req.body.progsetDataedi,
                progset_lixo : req.body.progsetLixo
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
    progsetAdicionar: async (req,res) => {
         let dataAtual = new Date();
            console.log("progsetmodel");
            const newProgprogset = new ProgprogsetModel({
                progset_progid : req.body.progsetProgid,
                progset_beneid : req.body.progsetBeneid,
                progset_progtipoid : req.body.progsetProgtipoid,
                progset_prognivelid : req.body.progsetPrognivelid,
                progset_dataprogset : req.body.progsetDataprogset,
                progset_dataini : req.body.progsetDataini,
                progset_datafin : req.body.progsetDatafin,
                progset_desc : req.body.progsetDesc,
                progset_intro : req.body.progsetIntro,
                progset_acsicao : req.body.progsetAcsicao,
                progset_obs : req.body.progsetObs,
                //Atributos de controle
                progset_usuidcad : req.body.progsetUsuidcad,
                progset_usuidedi : req.body.progsetUsuidedi,
                progset_datacad : req.body.progsetDatacad,
                progset_dataedi : req.body.progsetDataedi,
                progset_lixo : req.body.progsetLixo
            });
            console.log("newProgprogset save");
            await newProgprogset.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};