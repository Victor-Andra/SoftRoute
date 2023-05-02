const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const NatSchema = mongoose.Schema({
    nat_planotipo :{
        type: String,
        required: true
    },
    nat_beneid :{
        type: ObjectId,
        required: true
    },
    nat_beneidade :{
        type: String,
        required: false
    },
    nat_convid :{
        type: ObjectId,
        required: true
    },
    nat_usuid :{
        type: String,
        required: true
    },
    nat_natdata :{
        type: Date,
        required: true
    },
    nat_terapeutaid :{
        type: ObjectId,
        required: true
    },
    nat_terapiaid :{
        type: ObjectId,
        required: false
    },
     nat_num :{
        type: Number,
        required: true
    },
    nat_diagnostico :{
        type: String,
        required: false
    },
    nat_histclinico:{
        type: String,
        required: false
    },
    nat_metacurto :{
        type: String,
        required: false
    },
    nat_metamedio :{
        type: String,
        required: false
    },
    nat_metalongo :{
        type: String,
        required: false
    },
    nat_objetivo :{
        type: String,
        required: false
    },
    nat_datacad :{
        type: Date,
        required: false
    },
    nat_dataedi :{
        type: Date,
        required: false
    }
})

class Nat{
    constructor(
        nat_planotipo,
        nat_beneidade,
        nat_beneid,
        nat_convid,
        nat_usuid,
        nat_natdata,
        nat_terapeutaid,
        nat_terapiaid,
        nat_num,
        nat_diagnostico,
        nat_histclinico,
        nat_metacurto,
        nat_metamedio,
        nat_metalongo,
        nat_objetivo,
        nat_datacad,
        nat_dataedi
        ){
        this.nat_planotipo = nat_planotipo,
        this.nat_beneidade = nat_beneidade,
        this.nat_beneid = nat_beneid,
        this.nat_convid = nat_convid,
        this.nat_usuid = nat_usuid,
        this.nat_natdata = nat_natdata,
        this.nat_terapeutaid = nat_terapeutaid,
        this.nat_terapiaid = nat_terapiaid,
        this.nat_num = nat_num,
        this.nat_diagnostico = diagnostico,
        this.nat_histclinico = nat_histclinico,
        this.nat_metacurto = nat_metacurto,
        this.nat_metamedio = nat_metamedio,
        this.nat_metalongo = nat_metalongo,
        this.nat_objetivo = nat_objetivo,
        this.nat_datacad = nat_datacad,
        this.nat_dataedi = nat_dataedi       
    }
}

NatSchema.loadClass(Nat)
const NatModel = mongoose.model('tb_nat', NatSchema)
module.exports = {NatModel,NatSchema,
    natEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await NatModel.findByIdAndUpdate(req.body.natId, 
            {$nat: {
                nat_planotipo : req.body.natPlanotipo,
                nat_beneidade : req.body.natIdade,
                nat_beneid : req.body.natBeneid,
                nat_convid : req.body.natConvid,
                nat_usuid : req.body.natUsuid,
                nat_natdata : req.body.natdata,
                nat_terapeutaid : req.body.natTerapeutaid,
                nat_terapiaid : req.body.natTerapiaid,
                nat_diagnostico : req.body.natDiagnostico,
                nat_histclinico : req.body.natHistclinico,
                nat_metacurto : req.body.natMetacurto,
                nat_metamedio : req.body.natMetamedio,
                nat_metalongo : req.body.natMetalongo,
                nat_objetivo : req.body.natObjetivo,
                nat_dataedi : dataAtual.toISOString()
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
    natAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("natmodel");
        console.log("req.body.natdata:")
        console.log(req.body.natdata)
        const NewNat = new NatModel({
            nat_planotipo : req.body.natPlanotipo,
            nat_beneidade : req.body.natBeneidade,
            nat_beneid : req.body.natBeneid,
            nat_convid : req.body.natConvid,
            nat_usuid : req.body.natUsuid,
            nat_natdata : req.body.natdata,
            nat_terapeutaid : req.body.natTerapeutaid,
            nat_terapiaid : req.body.natTerapiaid,
            nat_num : req.body.nextNum,
            nat_diagnostico : req.body.natDiagnostico,
            nat_histclinico : req.body.natHistclinico,
            nat_metacurto : req.body.natMetacurto,
            nat_metamedio : req.body.natMetamedio,
            nat_metalongo : req.body.natMetalongo,
            nat_objetivo : req.body.natObjetivo,
            nat_datacad : dataAtual.toISOString()
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};