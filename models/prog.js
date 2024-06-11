//Programa ABA
//Semelhante ao plano de tratamento, para mudar agora no desenvolvimento definitivo
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ProgSchema = mongoose.Schema({
    prog_beneid :{ type: ObjectId, required: false },
    prog_tipo :{ type: ObjectId, required: false },
    prog_nivel :{ type: ObjectId, required: false },
    prog_data :{ type: String, required: false },
    prog_dataini :{ type: String, required: false },
    prog_status :{ type: String, required: false },
    prog_datastatus :{ type: String, required: false },
    prog_objetivo :{ type: String, required: false },
    prog_alvo :{ type: String, required: false },
    prog_estrutura :{ type: String, required: false },
    prog_materiais :{ type: String, required: false },
    prog_materiaisout :{ type: String, required: false },
    prog_procedimento :{ type: String, required: false },
    prog_exemplo :{ type: String, required: false },
    prog_pchave :{ type: String, required: false },
    prog_dicatipo :{ type: String, required: false },
    prog_dicatipotext :{ type: String, required: false },
    prog_dicaproced :{ type: String, required: false },
    prog_dicahiera :{ type: String, required: false },
    prog_dicasequen :{ type: String, required: false },
    prog_dicaimplement :{ type: String, required: false },
    prog_obs :{ type: String, required: false },
    //Atributos de controle
    prog_usuidcad :{ type: ObjectId, required: false },
    prog_usuidedi :{ type: ObjectId, required: false },
    prog_datacad :{ type: String, required: false },
    prog_dataedi :{ type: String, required: false },
    prog_lixo :{ type: String, required: false }
})

class Prog{
    constructor(
        prog_beneid,
        prog_tipo,
        prog_nivel,
        prog_data,
        prog_dataini,
        prog_status,
        prog_datastatus,
        prog_objetivo,
        prog_alvo,
        prog_estrutura,
        prog_materiais,
        prog_materiaisout,
        prog_procedimento,
        prog_exemplo,
        prog_pchave,
        prog_dicatipo,
        prog_dicatipotext,
        prog_dicaproced,
        prog_dicahiera,
        prog_dicasequen,
        prog_dicaimplement,
        prog_obs,
        //Atributos de controle
        prog_usuidcad,
        prog_usuidedi,
        prog_datacad,
        prog_dataedi,
        prog_lixo
        ){
        this.prog_beneid = prog_beneid,
        this.prog_tipo = prog_tipo,
        this.prog_nivel = prog_nivel,
        this.prog_data = prog_data,
        this.prog_dataini = prog_dataini,
        this.prog_status = prog_status,
        this.prog_datastatus = prog_datastatus,
        this.prog_objetivo = prog_objetivo,
        this.prog_alvo = prog_alvo,
        this.prog_estrutura = prog_estrutura,
        this.prog_materiais = prog_materiais,
        this.prog_materiaisout = prog_materiaisout,
        this.prog_procedimento = prog_procedimento,
        this.prog_exemplo = prog_exemplo,
        this.prog_pchave = prog_pchave,
        this.prog_dicatipo = prog_dicatipo,
        this.prog_dicatipotext = prog_dicatipotext,
        this.prog_dicaproced = prog_dicaproced,
        this.prog_dicahiera = prog_dicahiera,
        this.prog_dicasequen = prog_dicasequen,
        this.prog_dicaimplement = prog_dicaimplement,
        this.prog_obs = prog_obs,
        //Atributos de controle
        this.prog_usuidcad = prog_usuidcad,
        this.prog_usuidedi = prog_usuidedi,
        this.prog_datacad = prog_datacad,
        this.prog_dataedi = prog_dataedi,
        this.prog_lixo = prog_lixo
    }
}

ProgSchema.loadClass(Prog)
const ProgModel = mongoose.model('tb_prog', ProgSchema)
module.exports = {ProgModel,ProgSchema,
    progEditar: async (req, res) => {
        //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        await ProgModel.findByIdAndUpdate(req.body.progId, 
            {$set: {
                prog_beneid : req.body.progBeneid,
                prog_tipo : req.body.progTipo,
                prog_nivel : req.body.progNivel,
                prog_data : req.body.progData,
                prog_dataini : req.body.progDataini,
                prog_status : req.body.progStatus,
                prog_datastatus : req.body.progDatastatus,
                prog_objetivo : req.body.progObjetivo,
                prog_alvo : req.body.progAlvo,
                prog_estrutura : req.body.progEstrutura,
                prog_materiais : req.body.progMateriais,
                prog_materiaisout : req.body.progMateriaisout,
                prog_procedimento : req.body.progProcedimento,
                prog_exemplo : req.body.progExemplo,
                prog_pchave : req.body.progPontoChave,
                prog_dicatipo : req.body.progDicatipo,
                prog_dicatipotext : req.body.progDicatipotext,
                prog_dicaproced : req.body.progDicaproced,
                prog_dicahiera : req.body.progDicahiera,
                prog_dicasequen : req.body.progDicasequen,
                prog_dicaimplement : req.body.progDicaimplement,
                prog_obs : req.body.progObs,
                //Atributos de controle
                prog_usuidedi : usuarioAtual,
                prog_dataedi : dataAtual.toISOString(),
                prog_lixo : "false"
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
        //Pega data atual
        let dataAtual = new Date();
        //Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
           const newProg = new ProgModel({
                prog_beneid : req.body.progBeneid,
                prog_tipo : req.body.progTipo,
                prog_nivel : req.body.progNivel,
                prog_data : req.body.progData,
                prog_dataini : req.body.progDataini,
                prog_status : req.body.progStatus,
                prog_datastatus : req.body.progDatastatus,
                prog_objetivo : req.body.progObjetivo,
                prog_alvo : req.body.progAlvo,
                prog_estrutura : req.body.progEstrutura,
                prog_materiais : req.body.progMateriais,
                prog_materiaisout : req.body.progMateriaisout,
                prog_procedimento : req.body.progProcedimento,
                prog_exemplo : req.body.progExemplo,
                prog_pchave : req.body.progPontoChave,
                prog_dicatipo : req.body.progDicatipo,
                prog_dicatipotext : req.body.progDicatipotext,
                prog_dicaproced : req.body.progDicaproced,
                prog_dicahiera : req.body.progDicahiera,
                prog_dicasequen : req.body.progDicasequen,
                prog_dicaimplement : req.body.progDicaimplement,
                prog_obs : req.body.progObs,
                //Atributos de controle
                prog_usuidcad : usuarioAtual,
                prog_datacad : dataAtual.toISOString(),
                prog_lixo : "false"
           });
           console.log("newProg save");
           await newProg.save().then(()=>{
               console.log("Cadastro realizado!");
               return true;
           }).catch((err) => {
               console.log(err)
               return err;
           });
    }

};