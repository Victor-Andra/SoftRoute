//Programa ABA
//Semelhante ao plano de tratamento, para mudar agora no desenvolvimento definitivo
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgSchema = mongoose.Schema({
    prog_beneid :{ type: ObjectId, required: false },
    prog_tipo :{ type: String, required: false },
    prog_nivel :{ type: String, required: false },
    prog_data :{ type: String, required: false },
    prog_objetivo :{ type: String, required: false },
    prog_alvo :{ type: String, required: false },
    prog_estrutura :{ type: String, required: false },
    prog_materiais :{ type: String, required: false },
    prog_procedimento :{ type: String, required: false },
    prog_exemplo :{ type: String, required: false },
    prog_pchave :{ type: String, required: false },
    prog_dicatipo :{ type: String, required: false },
    prog_dicaproced :{ type: String, required: false },
    prog_dicahiera :{ type: String, required: false },
    prog_dicasequen :{ type: String, required: false },
    prog_dicaimplement :{ type: String, required: false },
    prog_obs :{ type: String, required: false },
    //Atributos de controle
    prog_usuidcad :{ type: ObjectId, required: false },
    prog_usuidedi :{ type: ObjectId, required: false },
    prog_datacad :{ type: String, required: false },
    prog_dataedi :{ type: String, required: false }

})

class Prog{
    constructor(
        prog_beneid,
        prog_tipo,
        prog_nivel,
        prog_data,
        prog_objetivo,
        prog_alvo,
        prog_estrutura,
        prog_materiais,
        prog_procedimento,
        prog_exemplo,
        prog_pchave,
        prog_dicatipo,
        prog_dicaproced,
        prog_dicahiera,
        prog_dicasequen,
        prog_dicaimplement,
        prog_obs,
        //Atributos de controle
        prog_usuidcad,
        prog_usuidedi,
        prog_datacad,
        prog_dataedi
        ){
        this.prog_beneid = prog_beneid,
        this.prog_tipo = prog_tipo,
        this.prog_nivel = prog_nivel,
        this.prog_data = prog_data,
        this.prog_objetivo = prog_objetivo,
        this.prog_alvo = prog_alvo,
        this.prog_estrutura = prog_estrutura,
        this.prog_materiais = prog_materiais,
        this.prog_procedimento = prog_procedimento,
        this.prog_exemplo = prog_exemplo,
        this.prog_pchave = prog_pchave,
        this.prog_dicatipo = prog_dicatipo,
        this.prog_dicaproced = prog_dicaproced,
        this.prog_dicahiera = prog_dicahiera,
        this.prog_dicasequen = prog_dicasequen,
        this.prog_dicaimplement = prog_dicaimplement,
        this.prog_obs = prog_obs,
        //Atributos de controle
        this.prog_usuidcad = prog_usuidcad,
        this.prog_usuidedi = prog_usuidedi,
        this.prog_datacad = prog_datacad,
        this.prog_dataedi = prog_dataedi
    }
}

ProgSchema.loadClass(Prog)
const ProgModel = mongoose.model('tb_prog', ProgSchema)
module.exports = {ProgModel,ProgSchema,
    progEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await ProgModel.findByIdAndUpdate(req.body.progId, 
            {$set: {
                prog_beneid : req.body.progBeneid,
                prog_tipo : req.body.progTipo,
                prog_nivel : req.body.progNivel,
                prog_data : req.body.progData,
                prog_objetivo : req.body.progObjetivo,
                prog_alvo : req.body.progAlvo,
                prog_estrutura : req.body.progEstrutura,
                prog_materiais : req.body.progMateriais,
                prog_procedimento : req.body.progProcedimento,
                prog_exemplo : req.body.progExemplo,
                prog_pchave : req.body.progPchave,
                prog_dicatipo : req.body.progDicatipo,
                prog_dicaproced : req.body.progDicaproced,
                prog_dicahiera : req.body.progDicahiera,
                prog_dicasequen : req.body.progDicasequen,
                prog_dicaimplement : req.body.progDicaimplement,
                prog_obs : req.body.progObs,
                //Atributos de controle
                prog_usuidedi : req.body.progUsuidedi,
                prog_dataedi : dataAtual.toISOString()
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
    progAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("progmodel");
        console.log("req.body.progdata:")
        console.log(req.body.progdata)
        const NewProg = new ProgModel({
            prog_beneid : req.body.progBeneid,
            prog_tipo : req.body.progTipo,
            prog_nivel : req.body.progNivel,
            prog_data : req.body.progData,
            prog_objetivo : req.body.progObjetivo,
            prog_alvo : req.body.progAlvo,
            prog_estrutura : req.body.progEstrutura,
            prog_materiais : req.body.progMateriais,
            prog_procedimento : req.body.progProcedimento,
            prog_exemplo : req.body.progExemplo,
            prog_pchave : req.body.progPchave,
            prog_dicatipo : req.body.progDicatipo,
            prog_dicaproced : req.body.progDicaproced,
            prog_dicahiera : req.body.progDicahiera,
            prog_dicasequen : req.body.progDicasequen,
            prog_dicaimplement : req.body.progDicaimplement,
            prog_obs : req.body.progObs,
            //Atributos de controle
            prog_usuidcad : req.body.progUsuidcad,
            prog_datacad : dataAtual.toISOString()
            
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