const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const SaudecolabSchema = mongoose.Schema({
    saudecolab_saudecolabid :{ type: ObjectId, required: false },
    saudecolab_saudecolabusuid :{ type: ObjectId, required: false, unique: true }, //Uduário id
    saudecolab_saudecolabdata :{ type: String, required: false },//Data que o formulário foi feito e pode ser diferente da data de cadastro do sistema já que o cadsatro pode ter sido feito por outros meios
    saudecolab_tiposangue :{ type: String, required: false },
    saudecolab_planosaude :{ type: String, required: false }, // Sim ou Não
    saudecolab_planosaudequal :{ type: String, required: false },
    saudecolab_hospitalqual :{ type: String, required: false },
    saudecolab_alergia :{ type: String, required: false },// Sim ou Não
    saudecolab_alergiaqual:{ type: String, required: false },
    saudecolab_medicamentonao :{ type: String, required: false },// Sim ou Não Medicamentos que não pode tormar
    saudecolab_medicamentonaoqual :{ type: String, required: false },
    saudecolab_medicamentosim :{ type: String, required: false },// Sim ou Não Medicamentos que não pode tormar
    saudecolab_medicamentosimqual :{ type: String, required: false },
    saudecolab_hipertenso :{ type: String, required: false },// Sim ou Não
    saudecolab_cardiaco :{ type: String, required: false },// Sim ou Não
    saudecolab_diabetico :{ type: String, required: false },// Sim ou Não
    saudecolab_insulina :{ type: String, required: false },// Sim ou Não
    saudecolab_condicaosaude :{ type: String, required: false }, //EX.: ASMA, DESMAIOS, CONVULSÃO, EPILEPSIA, ENTRE OUTRAS
    saudecolab_contato1 :{ type: String, required: false },// Primeiro Contato
    saudecolab_parentesco1 :{ type: String, required: false },
    saudecolab_celular1 :{ type: String, required: false },
    saudecolab_contato2 :{ type: String, required: false },// Segundo Contato
    saudecolab_parentesco2 :{ type: String, required: false },
    saudecolab_celular2 :{ type: String, required: false },
    saudecolab_obs :{ type: String, required: false },// Observações gerais
    saudecolab_aceitartermos :{ type: String, required: false },// Aveitar os termos de cadastro em meio digital e divulgação para emergência
    //Atributos de controle
    saudecolab_usuidcad :{ type: ObjectId, required: false },
    saudecolab_usuidedi :{ type: ObjectId, required: false },
    saudecolab_datacad :{ type: String, required: false },
    saudecolab_dataedi :{ type: String, required: false },
    saudecolab_lixo :{ type: String, required: false }
})

class Saudecolab{
    constructor(
        saudecolab_saudecolabid,
        saudecolab_saudecolabusuid,
        saudecolab_saudecolabdata,
        saudecolab_tiposangue,
        saudecolab_planosaude,
        saudecolab_planosaudequal,
        saudecolab_hospitalqual,
        saudecolab_alergia,
        saudecolab_alergiaqual,
        saudecolab_medicamentonao,
        saudecolab_medicamentonaoqual,
        saudecolab_medicamentosim,
        saudecolab_medicamentosimqual,
        saudecolab_hipertenso,
        saudecolab_cardiaco,
        saudecolab_diabetico,
        saudecolab_insulina,
        saudecolab_condicaosaude,
        saudecolab_contato1,
        saudecolab_parentesco1,
        saudecolab_celular1,
        saudecolab_contato2,
        saudecolab_parentesco2,
        saudecolab_celular2,
        saudecolab_obs,
        saudecolab_aceitartermos,
        //Atributos de controle
        saudecolab_usuidcad,
        saudecolab_usuidedi,
        saudecolab_datacad,
        saudecolab_dataedi,
        saudecolab_lixo
        ){
            this.saudecolab_saudecolabid = saudecolab_saudecolabid,
            this.saudecolab_saudecolabusuid = saudecolab_saudecolabusuid,
            this.saudecolab_saudecolabdata = saudecolab_saudecolabdata,
            this.saudecolab_tiposangue = saudecolab_tiposangue,
            this.saudecolab_planosaude = saudecolab_planosaude,
            this.saudecolab_planosaudequal = saudecolab_planosaudequal,
            this.saudecolab_hospitalqual = saudecolab_hospitalqual,
            this.saudecolab_alergia = saudecolab_alergia,
            this.saudecolab_alergiaqual = saudecolab_alergiaqual,
            this.saudecolab_medicamentonao = saudecolab_medicamentonao,
            this.saudecolab_medicamentonaoqual = saudecolab_medicamentonaoqual,
            this.saudecolab_medicamentosim = saudecolab_medicamentosim,
            this.saudecolab_medicamentosimqual = saudecolab_medicamentosimqual,
            this.saudecolab_hipertenso = saudecolab_hipertenso,
            this.saudecolab_cardiaco = saudecolab_cardiaco,
            this.saudecolab_diabetico = saudecolab_diabetico,
            this.saudecolab_insulina = saudecolab_insulina,
            this.saudecolab_condicaosaude = saudecolab_condicaosaude,
            this.saudecolab_contato1 = saudecolab_contato1,
            this.saudecolab_parentesco1 = saudecolab_parentesco1,
            this.saudecolab_celular1 = saudecolab_celular1,
            this.saudecolab_contato2 = saudecolab_contato2,
            this.saudecolab_parentesco2 = saudecolab_parentesco2,
            this.saudecolab_celular2 = saudecolab_celular2,
            this.saudecolab_obs = saudecolab_obs,
            this.saudecolab_aceitartermos = saudecolab_aceitartermos,
            //Atributos de controle
            this.saudecolab_usuidcad = saudecolab_usuidcad,
            this.saudecolab_usuidedi = saudecolab_usuidedi,
            this.saudecolab_datacad = saudecolab_datacad,
            this.saudecolab_dataedi = saudecolab_dataedi,
            this.saudecolab_lixo = saudecolab_lixo

    }
}


SaudecolabSchema.loadClass(Saudecolab)
var SaudecolabModel = getModel("PortalDoUsuario", 'tb_saudecolab', SaudecolabSchema)

module.exports = {
    SaudecolabModel,
    SaudecolabSchema,

    saudecolabEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = "PortalDoUsuario";
        SaudecolabModel = getModel(db, 'tb_saudecolab', SaudecolabSchema)
        //;

        // Pega data atual
        let dataAtual = new Date();
        // Pega Usuário Atual
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        // Realiza Atualização
        await SaudecolabModel.findByIdAndUpdate(req.body.saudecolabId, 
            {
                saudecolab_saudecolabid: req.body.saudecolab_Saudecolabid,
                saudecolab_saudecolabusuid: req.body.saudecolabSaudecolabusuid,
                saudecolab_saudecolabdata: req.body.saudecolabSaudecolabdata,
                saudecolab_tiposangue: req.body.saudecolabTiposangue,
                saudecolab_planosaude: req.body.saudecolabPlanosaude,
                saudecolab_planosaudequal: req.body.saudecolabPlanosaudequal,
                saudecolab_hospitalqual: req.body.saudecolabHospitalqual,
                saudecolab_alergia: req.body.saudecolabAlergia,
                saudecolab_alergiaqual: req.body.saudecolabAlergiaqual,
                saudecolab_medicamentonao: req.body.saudecolabMedicamentonao,
                saudecolab_medicamentonaoqual: req.body.saudecolabMedicamentonaoqual,
                saudecolab_medicamentosim: req.body.saudecolabMedicamentosim,
                saudecolab_medicamentosimqual: req.body.saudecolabMedicamentosimqual,
                saudecolab_hipertenso : req.body.saudecolabHipertenso,
                saudecolab_cardiaco: req.body.saudecolabCardiaco,
                saudecolab_diabetico: req.body.saudecolabDiabetico,
                saudecolab_insulina: req.body.saudecolabInsulina,
                saudecolab_condicaosaude: req.body.saudecolabCondicaosaude,
                saudecolab_contato1: req.body.saudecolabContato1,
                saudecolab_parentesco1: req.body.saudecolabParentesco1,
                saudecolab_celular1: req.body.saudecolabCelular1,
                saudecolab_contato2: req.body.saudecolabContato2,
                saudecolab_parentesco2: req.body.saudecolabParentesco2,
                saudecolab_celular2: req.body.saudecolabCelular2,
                saudecolab_obs: req.body.saudecolabObs,
                saudecolab_aceitartermos: req.body.saudecolabAceitartermos,
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

    saudecolabAdicionar: async (req, res) => {
        // Estrutura Multiempresa
         let db = "PortalDoUsuario" // ⚠️ ver item 3 abaixo!
        const SaudecolabModel = getModel(db, 'tb_saudecolab', SaudecolabSchema);

        // Dados
        const dataAtual = new Date().toISOString();
        const usuarioAtual = req.cookies?.['idUsu'];

        try {
            const newSaudecolab = new SaudecolabModel({
                saudecolab_saudecolabid: new mongoose.Types.ObjectId(), // opcional, se quiser pré-definir
                saudecolab_saudecolabusuid: req.body.saudecolabSaudecolabusuid,
                saudecolab_saudecolabdata: req.body.saudecolabSaudecolabdata,
                saudecolab_tiposangue: req.body.saudecolabTiposangue,
                saudecolab_planosaude: req.body.saudecolabPlanosaude,
                saudecolab_planosaudequal: req.body.saudecolabPlanosaudequal,
                saudecolab_hospitalqual: req.body.saudecolabHospitalqual,
                saudecolab_alergia: req.body.saudecolabAlergia,
                saudecolab_alergiaqual: req.body.saudecolabAlergiaqual,
                saudecolab_medicamentonao: req.body.saudecolabMedicamentonao,
                saudecolab_medicamentonaoqual: req.body.saudecolabMedicamentonaoqual,
                saudecolab_medicamentosim: req.body.saudecolabMedicamentosim,
                saudecolab_medicamentosimqual: req.body.saudecolabMedicamentosimqual,
                saudecolab_hipertenso: req.body.saudecolabHipertenso,
                saudecolab_cardiaco: req.body.saudecolabCardiaco,
                saudecolab_diabetico: req.body.saudecolabDiabetico,
                saudecolab_insulina: req.body.saudecolabInsulina,
                saudecolab_condicaosaude: req.body.saudecolabCondicaosaude,
                saudecolab_contato1: req.body.saudecolabContato1,
                saudecolab_parentesco1: req.body.saudecolabParentesco1,
                saudecolab_celular1: req.body.saudecolabCelular1,
                saudecolab_contato2: req.body.saudecolabContato2,
                saudecolab_parentesco2: req.body.saudecolabParentesco2,
                saudecolab_celular2: req.body.saudecolabCelular2,
                saudecolab_obs: req.body.saudecolabObs,
                saudecolab_aceitartermos: req.body.saudecolabAceitartermos,
                // Atributos de controle
                saudecolab_usuidcad: usuarioAtual,
                saudecolab_datacad: dataAtual,
                saudecolab_lixo: "false"
            });

            console.log("[saudecolabAdicionar] Salvando documento:", newSaudecolab);
            const saved = await newSaudecolab.save();
            console.log("[saudecolabAdicionar] ✅ Salvo com sucesso. ID:", saved._id);
            return { success: true, data: saved };

        } catch (err) {
            console.error("[saudecolabAdicionar] ❌ Erro ao salvar:", err);
            throw err; // ⚠️ Rejeita a Promise para o caller tratar
        }
    }
};