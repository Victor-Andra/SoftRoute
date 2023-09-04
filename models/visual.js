const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const VisualSchema = mongoose.Schema({
    visual_id:{ type: ObjectId, required: false },
    visual_terapeutaid:{type: ObjectId, required: true},
    visual_beneid:{type: ObjectId, required: true},
    visual_data: { type: String, required: false },
    visual_mes: { type: String, required: false },
    visual_tipo: { type: String, required: false },
    visual_fase: { type: String, required: false },
    visual_andamento: { type: String, required: false },
    //controle
    visual_datacad: { type: Date, required: false },
    visual_usuidcad: { type: ObjectId, required: false },
    visual_dataedi: { type: Date, required: false },
    visual_usuidedi: { type: ObjectId, required: false },
    
})

class Visual{
    constructor(
        visual_id,
        visual_terapeutaid,
        visual_beneid,
        visual_data, 
        visual_mes, 
        visual_tipo,
        visual_fase, 
        visual_andamento, 
        visual_datacad, 
        visual_usuidcad, 
        visual_dataedi, 
        visual_usuidedi 
   
         ){
            this.visual_id = visual_id,
            this.visual_terapeutaid = visual_terapeutaid, 
            this.visual_beneid = visual_beneid, //Ok
            this.visual_data = visual_data, //Ok
            this.visual_mes = visual_mes,
            this.visual_tipo = visual_tipo,
            this.visual_fase = visual_fase,
            this.visual_andamento = visual_andamento,
            this.visual_datacad = visual_datacad,
            this.visual_usuidcad = visual_usuidcad,
            this.visual_dataedi = visual_dataedi,
            this.visual_usuidedi = visual_usuidedi

    }
}

VisualSchema.loadClass(Visual)
const VisualModel = mongoose.model('tb_visual', VisualSchema)
module.exports = {VisualModel,VisualSchema,
    visualEditar: async (req, res) => {
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
        let visualId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("visualId:"+visualId)
        //Realiza Atualização
        await VisualModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                visual_terapeutaid : req.body.visualTerapeutaid,
                visual_beneid : req.body.visualBeneid,
                visual_data : req.body.visualData,
                visual_mes : req.body.visualMes,
                visual_tipo : req.body.visualTipo,
                visual_fase : req.body.visualFase,
                visual_andamento : req.body.visualAndamento,
                
                visual_dataedi : dataAtual, 
                visual_usuidedi : idUsu
                
                
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
    visualAdicionar: async (req,res) => {
        //Validar se a Visualese existe
        console.log("visualmodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newVisual = new VisualModel({
                visual_id: req.body.visualId,
                visual_terapeutaid : req.body.visualTerapeutaid,
                visual_beneid : req.body.visualBeneid,
                visual_data : req.body.visualData,
                visual_mes : req.body.visualMes,
                visual_tipo : req.body.visualTipo,
                visual_fase : req.body.visualFase,
                visual_andamento : req.body.visualAndamento,
                visual_datacad : dataAtual, 
                visual_usuidcad : idUsu
                
        });
        console.log("newVisual save");
        await newVisual.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};