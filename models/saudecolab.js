const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const SaudecolabSchema = mongoose.Schema({
    saudecolab_progid :{ type: ObjectId, required: false },
    saudecolab_beneid :{ type: ObjectId, required: false },
    saudecolab_teraid :{ type: ObjectId, required: false },
    saudecolab_progtipoid :{ type: ObjectId, required: false },
    saudecolab_prognivelid :{ type: ObjectId, required: false },
    saudecolab_num :{ type: String, required: false },
    saudecolab_dataset :{ type: String, required: false },
    saudecolab_dataini :{ type: String, required: false },
    saudecolab_datafin :{ type: String, required: false },
    saudecolab_datameta :{ type: String, required: false },
    saudecolab_status :{ type: String, required: false },
    saudecolab_tiporeg :{ type: String, required: false },
    saudecolab_desc :{ type: String, required: false },
    saudecolab_qtest :{ type: String, required: false },
    saudecolab_esta :{ type: String, required: false },
    saudecolab_estb :{ type: String, required: false },
    saudecolab_estc :{ type: String, required: false },
    saudecolab_estd :{ type: String, required: false },
    saudecolab_este :{ type: String, required: false },
    saudecolab_estf :{ type: String, required: false },
    saudecolab_estg :{ type: String, required: false },
    saudecolab_esth :{ type: String, required: false },
    saudecolab_esti :{ type: String, required: false },
    saudecolab_estj :{ type: String, required: false },
    saudecolab_metatipo :{ type: String, required: false },
    saudecolab_obs :{ type: String, required: false },
    //Atributos de controle
    saudecolab_usuidcad :{ type: ObjectId, required: false },
    saudecolab_usuidedi :{ type: ObjectId, required: false },
    saudecolab_datacad :{ type: String, required: false },
    saudecolab_dataedi :{ type: String, required: false },
    saudecolab_lixo :{ type: String, required: false }
})

class Saudecolab{
    constructor(
        saudecolab_progid,
        saudecolab_beneid,
        saudecolab_teraid,
        saudecolab_progtipoid,
        saudecolab_prognivelid,
        saudecolab_num,
        saudecolab_dataset,
        saudecolab_dataini,
        saudecolab_datafin,
        saudecolab_datameta,
        saudecolab_status,
        saudecolab_tiporeg,
        saudecolab_desc,
        saudecolab_qtest,
        saudecolab_esta,
        saudecolab_estb,
        saudecolab_estc,
        saudecolab_estd,
        saudecolab_este,
        saudecolab_estf,
        saudecolab_estg,
        saudecolab_esth,
        saudecolab_esti,
        saudecolab_estj,
        saudecolab_metatipo,
        saudecolab_obs,
        //Atributos de controle
        saudecolab_usuidcad,
        saudecolab_usuidedi,
        saudecolab_datacad,
        saudecolab_dataedi,
        saudecolab_lixo
        ){
            this.saudecolab_progid = saudecolab_progid,
            this.saudecolab_beneid = saudecolab_beneid,
            this.saudecolab_teraid = saudecolab_teraid,
            this.saudecolab_progtipoid = saudecolab_progtipoid,
            this.saudecolab_prognivelid = saudecolab_prognivelid,
            this.saudecolab_num = saudecolab_num,
            this.saudecolab_dataset = saudecolab_dataset,
            this.saudecolab_dataini = saudecolab_dataini,
            this.saudecolab_datafin = saudecolab_datafin,
            this.saudecolab_datameta = saudecolab_datameta,
            this.saudecolab_status = saudecolab_status,
            this.saudecolab_tiporeg = saudecolab_tiporeg,
            this.saudecolab_desc = saudecolab_desc,
            this.saudecolab_qtest = saudecolab_qtest,
            this.saudecolab_esta = saudecolab_esta,
            this.saudecolab_estb = saudecolab_estb,
            this.saudecolab_estc = saudecolab_estc,
            this.saudecolab_estd = saudecolab_estd,
            this.saudecolab_este = saudecolab_este,
            this.saudecolab_estf = saudecolab_estf,
            this.saudecolab_estg = saudecolab_estg,
            this.saudecolab_esth = saudecolab_esth,
            this.saudecolab_esti = saudecolab_esti,
            this.saudecolab_estj = saudecolab_estj,
            this.saudecolab_metatipo = saudecolab_metatipo,
            this.saudecolab_obs = saudecolab_obs,
            //Atributos de controle
            this.saudecolab_usuidcad = saudecolab_usuidcad,
            this.saudecolab_usuidedi = saudecolab_usuidedi,
            this.saudecolab_datacad = saudecolab_datacad,
            this.saudecolab_dataedi = saudecolab_dataedi,
            this.saudecolab_lixo = saudecolab_lixo

    }
}


SaudecolabSchema.loadClass(Saudecolab)
const SaudecolabModel = mongoose.model('tb_saudecolab', SaudecolabSchema)

module.exports = {
    SaudecolabModel,
    SaudecolabSchema,
    saudecolabEditar: async (req, res) => {
        // Pega data atual
        let dataAtual = new Date();
        // Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        // Realiza Atualização
        await SaudecolabModel.findByIdAndUpdate(req.body.saudecolabId, 
            {
                saudecolab_progid: req.body.saudecolabProgid,
                saudecolab_beneid: req.body.saudecolabBeneid,
                saudecolab_teraid: req.body.saudecolabTeraid,
                saudecolab_progtipoid: req.body.saudecolabProgtipoid,
                saudecolab_prognivelid: req.body.saudecolabPrognivelid,
                saudecolab_num: req.body.saudecolabNum.toUpperCase(),
                saudecolab_dataset: req.body.saudecolabDataset,
                saudecolab_dataini: req.body.saudecolabDataini,
                saudecolab_datafin: req.body.saudecolabDatafin,
                saudecolab_datameta: req.body.saudecolabDatameta,
                saudecolab_status: req.body.saudecolabStatus,
                saudecolab_tiporeg : req.body.saudecolabTiporeg,
                saudecolab_desc: req.body.saudecolabDesc,
                saudecolab_qtest: req.body.saudecolabQtest,
                saudecolab_esta: req.body.saudecolabEsta,
                saudecolab_estb: req.body.saudecolabEstb,
                saudecolab_estc: req.body.saudecolabEstc,
                saudecolab_estd: req.body.saudecolabEstd,
                saudecolab_este: req.body.saudecolabEste,
                saudecolab_estf: req.body.saudecolabEstf,
                saudecolab_estg: req.body.saudecolabEstg,
                saudecolab_esth: req.body.saudecolabEsth,
                saudecolab_esti: req.body.saudecolabEsti,
                saudecolab_estj: req.body.saudecolabEstj,
                saudecolab_metatipo: req.body.saudecolabMetatipo,
                saudecolab_obs: req.body.saudecolabObs,
                // Atributos de controle
                saudecolab_usuidedi: usuarioAtual,
                saudecolab_dataedi: dataAtual.toISOString(),
                saudecolab_lixo: "false"
            }
        ).then((res) => {
            console.log("Salvo")
            resultado = true;
        }).catch((err) => {
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },

    saudecolabAdicionar: async (req,res) => {
        //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        //Realiza Atualização
            console.log("saudecolabmodel");
            const newSaudecolab = new SaudecolabModel({
                saudecolab_progid : req.body.saudecolabProgid,
                saudecolab_beneid : req.body.saudecolabBeneid,
                saudecolab_teraid : req.body.saudecolabTeraid,
                saudecolab_progtipoid : req.body.saudecolabProgtipoid,
                saudecolab_prognivelid : req.body.saudecolabPrognivelid,
                saudecolab_num : req.body.saudecolabNum.toUpperCase(),
                saudecolab_dataset : req.body.saudecolabDataset,
                saudecolab_dataini : req.body.saudecolabDataini,
                saudecolab_datafin : req.body.saudecolabDatafin,
                saudecolab_datameta : req.body.saudecolabDatameta,
                saudecolab_status : req.body.saudecolabStatus,
                saudecolab_tiporeg : req.body.saudecolabTiporeg,
                saudecolab_desc : req.body.saudecolabDesc,
                saudecolab_qtest : req.body.saudecolabQtest,
                saudecolab_esta : req.body.saudecolabEsta,
                saudecolab_estb : req.body.saudecolabEstb,
                saudecolab_estc : req.body.saudecolabEstc,
                saudecolab_estd : req.body.saudecolabEstd,
                saudecolab_este : req.body.saudecolabEste,
                saudecolab_estf : req.body.saudecolabEstf,
                saudecolab_estg : req.body.saudecolabEstg,
                saudecolab_esth : req.body.saudecolabEsth,
                saudecolab_esti : req.body.saudecolabEsti,
                saudecolab_estj : req.body.saudecolabEstj,
                saudecolab_metatipo : req.body.saudecolabMetatipo,
                saudecolab_obs : req.body.saudecolabObs,
                //Atributos de controle
                saudecolab_usuidcad : usuarioAtual,
                saudecolab_datacad : dataAtual.toISOString(),
                saudecolab_lixo : "false"
            });
            console.log("newSaudecolab save");
            await newSaudecolab.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};