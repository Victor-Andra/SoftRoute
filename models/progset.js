const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgprogsetSchema = mongoose.Schema({
    progset_progid :{ type: ObjectId, required: false },
    progset_beneid :{ type: ObjectId, required: false },
    progset_progtipoid :{ type: ObjectId, required: false },
    progset_prognivelid :{ type: ObjectId, required: false },
    progset_num :{ type: String, required: false },
    progset_dataset :{ type: String, required: false },
    progset_dataini :{ type: String, required: false },
    progset_datafin :{ type: String, required: false },
    progset_desc :{ type: String, required: false },
    progset_esta :{ type: String, required: false },
    progset_estb :{ type: String, required: false },
    progset_estc :{ type: String, required: false },
    progset_estd :{ type: String, required: false },
    progset_este :{ type: String, required: false },
    progset_estf :{ type: String, required: false },
    progset_estg :{ type: String, required: false },
    progset_esth :{ type: String, required: false },
    progset_esti :{ type: String, required: false },
    progset_estj :{ type: String, required: false },
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
        progset_num,
        progset_dataset,
        progset_dataini,
        progset_datafin,
        progset_desc,
        progset_esta,
        progset_estb,
        progset_estc,
        progset_estd,
        progset_este,
        progset_estf,
        progset_estg,
        progset_esth,
        progset_esti,
        progset_estj,
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
            this.progset_num = progset_num,
            this.progset_dataset = progset_dataset,
            this.progset_dataini = progset_dataini,
            this.progset_datafin = progset_datafin,
            this.progset_desc = progset_desc,
            this.progset_esta = progset_esta,
            this.progset_estb = progset_estb,
            this.progset_estc = progset_estc,
            this.progset_estd = progset_estd,
            this.progset_este = progset_este,
            this.progset_estf = progset_estf,
            this.progset_estg = progset_estg,
            this.progset_esth = progset_esth,
            this.progset_esti = progset_esti,
            this.progset_estj = progset_estj,
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
       //Pega data atual
       let dataAtual = new Date();
       //Pega Usuário Atual
       let usuarioAtual = req.cookies['idUsu'];
       let resultado;
       //Realiza Atualização
        await ProgprogsetModel.findByIdAndUpdate(req.body.progsetId, 
            {$progset: {
                progset_progid : req.body.progsetProgid,
                progset_beneid : req.body.progsetBeneid,
                progset_progtipoid : req.body.progsetProgtipoid,
                progset_prognivelid : req.body.progsetPrognivelid,
                progset_num : req.body.progsetNum,
                progset_dataset : req.body.progsetDataset,
                progset_dataini : req.body.progsetDataini,
                progset_datafin : req.body.progsetDatafin,
                progset_desc : req.body.progsetDesc,
                progset_esta : req.body.progsetEsta,
                progset_estb : req.body.progsetEstb,
                progset_estc : req.body.progsetEstc,
                progset_estd : req.body.progsetEstd,
                progset_este : req.body.progsetEste,
                progset_estf : req.body.progsetEstf,
                progset_estg : req.body.progsetEstg,
                progset_esth : req.body.progsetEsth,
                progset_esti : req.body.progsetEsti,
                progset_estj : req.body.progsetEstj,
                progset_obs : req.body.progsetObs,
                //Atributos de controle
                progset_usuidedi : usuarioAtual,
                progset_dataedi : dataAtual.toISOString(),
                progset_lixo : "false"

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
        //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Realiza Atualização
            console.log("progsetmodel");
            const newProgprogset = new ProgprogsetModel({
                progset_progid : req.body.progsetProgid,
                progset_beneid : req.body.progsetBeneid,
                progset_progtipoid : req.body.progsetProgtipoid,
                progset_prognivelid : req.body.progsetPrognivelid,
                progset_num : req.body.progsetNum,
                progset_dataset : req.body.progsetDataset,
                progset_dataini : req.body.progsetDataini,
                progset_datafin : req.body.progsetDatafin,
                progset_desc : req.body.progsetDesc,
                progset_esta : req.body.progsetEsta,
                progset_estb : req.body.progsetEstb,
                progset_estc : req.body.progsetEstc,
                progset_estd : req.body.progsetEstd,
                progset_este : req.body.progsetEste,
                progset_estf : req.body.progsetEstf,
                progset_estg : req.body.progsetEstg,
                progset_esth : req.body.progsetEsth,
                progset_esti : req.body.progsetEsti,
                progset_estj : req.body.progsetEstj,
                progset_obs : req.body.progsetObs,
                //Atributos de controle
                progset_usuidcad : usuarioAtual,
                progset_datacad : dataAtual.toISOString(),
                progset_lixo : "false"
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