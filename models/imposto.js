const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ImpostoSchema = mongoose.Schema({
    imposto_id:{ type: ObjectId, required: false },
    imposto_nome :{ type: String, required: true },
    imposto_esfera :{ type: String, required: false},
    imposto_alqpad:{ type: String, required: false },
    imposto_status :{ type: Boolean, required: false },
    imposto_data :{ type: String, required: false },
    imposto_usuid :{ type: ObjectId, required: false },
    imposto_datacad :{ type: String, required: false },
    imposto_usuidedi :{ type: ObjectId, required: false },
    imposto_dataedi :{ type: String, required: false }
})

class Imposto{
    constructor(
        imposto_id,
        imposto_nome,
        imposto_esfera,   
        imposto_alqpad,
        imposto_status,
        imposto_data,
        imposto_usuid,
        imposto_datacad,
        imposto_usuidedi,
        imposto_dataedi
        ){
        this.imposto_id = imposto_id,
        this.imposto_nome = imposto_nome,
        this.imposto_esfera = imposto_esfera,   
        this.imposto_alqpad = imposto_alqpad,
        this.imposto_status = imposto_status,
        this.imposto_data = imposto_data,
        this.imposto_usuid = imposto_usuid,
        this.imposto_datacad = imposto_datacad,
        this.imposto_usuidedi = imposto_usuidedi,
        this.imposto_dataedi = imposto_dataedi       
    }
}

ImpostoSchema.loadClass(Imposto)
const ImpostoModel = mongoose.model('tb_imposto', ImpostoSchema)
module.exports = {ImpostoModel,ImpostoSchema,
    impostoEditar: async (req, response) => {
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
        let impostoId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("impostoId:"+impostoId)
        //Realiza Atualização
        await ImpostoModel.findByIdAndUpdate(new ObjectId(req.body.id), 
        {$set: {
            imposto_id : req.body.impostoId,
            imposto_nome : req.body.impostoNome,
            imposto_esfera : req.body.impostoEsfera,   
            imposto_alqpad : req.body.impostoAlqpad,
            imposto_status : req.body.impostoStatus,
            imposto_data : req.body.impostoData,
            imposto_usuid : req.body.impostoUsuid,
            imposto_datacad : req.body.impostoDatacad,
            imposto_usuidedi : idUsu,
            imposto_dataedi : dataAtual
                }}
            ).then((res) => {
                console.log("Salvo")
                resultado = true;
            }).catch((err) => {
                console.log("erro mongo:")
                console.log(err)
                resultado = err;
            });

            return resultado;
        },
        
    impostoAdicionar: async (req,res) => {
        //Validar se a Impostoese existe
        console.log("impostomodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newImposto = new ImpostoModel({
            imposto_id : req.body.impostoId,
            imposto_nome : req.body.impostoNome,
            imposto_esfera : req.body.impostoEsfera,   
            imposto_alqpad : req.body.impostoAlqpad,
            imposto_status : req.body.impostoStatus,
            imposto_data : req.body.impostoData,
            imposto_usuid : idUsu,
            imposto_datacad : dataAtual
                
        });
        console.log("newImposto save");
        await newImposto.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};