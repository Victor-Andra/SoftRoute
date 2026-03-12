const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const TratSchema = mongoose.Schema({
    //identificação do plano de tratamento
    trat_id:{ type: ObjectId, required: false },
    trat_planotipo :{ type: String, required: true },
    trat_beneid :{ type: ObjectId, required: true },
    trat_beneidade :{ type: String, required: false },
    trat_benedatanasc :{ type: String, required: false },
    trat_tratdata :{ type: Date, required: true },
    trat_tratdatavigencia:{ type: Date, required: false },
    trat_diagnostico :{ type: String, required: false },
    //plano padrao
    trat_especialidadepad :{ type: String, required: false },
    trat_terapeutaidpad  :{ type: ObjectId, required: false },
    trat_regconselhopad :{ type: String, required: false },
    trat_historicopad :{ type: String, required: false },
    trat_objgeralpad :{ type: String, required: false },
    trat_objespecificopad :{ type: String, required: false },
    trat_estrategiapad :{ type: String, required: false },
    trat_obspad :{ type: String, required: false },
    //plano de tratamento TO e IS
    trat_diagnosticoocup :{ type: String, required: false },
    //plano de tratamento IS
    trat_especialidadeis :{ type: String, required: false },
    trat_terapeutaidis :{ type: ObjectId, required: false },
    trat_regconselhois :{ type: String, required: false },
    trat_metacurtois :{ type: String, required: false },
    trat_metamediois :{ type: String, required: false },
    trat_metalongois :{ type: String, required: false },
    trat_objetivois :{ type: String, required: false },
    //plano de tratamento AVD
    trat_especialidadeavd:{ type: String, required: false },
    trat_terapeutaidavd :{ type: ObjectId, required: false },
    trat_regconselhoavd :{ type: String, required: false },
    trat_metacurtoavd :{ type: String, required: false },
    trat_metamedioavd :{ type: String, required: false },
    trat_metalongoavd :{ type: String, required: false },
    trat_objetivoavd :{ type: String, required: false },
    //Dados para de Sistema, quem fez, data criação e quem alterou
    trat_usuidcad :{ type: ObjectId, required: false },
    trat_usuidedi :{ type: ObjectId, required: false },
    trat_datacad :{ type: Date, required: false },
    trat_dataedi :{ type: Date, required: false },
    //Dados para remocao logica do registro
    trat_usuidlixo :{ type: ObjectId, required: false },  // ID do usuário que enviou pra lixeira
    trat_datalixo :{ type: Date, required: false },        // Data/hora do envio pra lixeira
    trat_lixomotivo :{ type: String, required: false },    // Motivo informado pelo usuário
    trat_lixo :{ type: String, required: false, default: "false" } // "true" = na lixeira, "false" = ativo
})

class Trat{
    constructor(
        //identificação do plano de tratamento
        trat_id,
        trat_planotipo,
        trat_beneid,
        trat_beneidade,
        trat_benedatanasc,
        trat_tratdata,
        trat_tratdatavigencia,
        trat_diagnostico,
        //plano padrao
        trat_especialidadepad,
        trat_terapeutaidpad,
        trat_regconselhopad,
        trat_historicopad,
        trat_objgeralpad,
        trat_objespecificopad,
        trat_estrategiapad,
        trat_obspad,
        //plano de tratamento TOAVD e IS
        trat_diagnosticoocup,
        //plano de tratamento IS
        trat_especialidadeis,
        trat_terapeutaidis,
        trat_regconselhois,
        trat_metacurtois,
        trat_metamediois,
        trat_metalongois,
        trat_objetivois,
        //plano de tratamento AVD
        trat_especialidadeavd,
        trat_terapeutaidavd,
        trat_regconselhoavd,
        trat_metacurtoavd,
        trat_metamedioavd,
        trat_metalongoavd,
        trat_objetivoavd,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuidcad,
        trat_datacad,
        trat_usuidedi,
        trat_dataedi,
        trat_lixomotivo,
        trat_lixo,

        ){
        this.trat_id = trat_id,
        this.trat_planotipo = trat_planotipo,
        this.trat_beneid = trat_beneid,
        this.trat_beneidade = trat_beneidade,
        this.trat_benedatanasc = trat_benedatanasc,
        this.trat_tratdata = trat_tratdata,
        this.trat_tratdatavigencia = trat_tratdatavigencia,
        this.trat_diagnostico = trat_diagnostico,
        //plano padrao
        this.trat_especialidadepad = trat_especialidadepad,
        this.trat_terapeutaidpad = trat_terapeutaidpad,
        this.trat_regconselhopad = trat_regconselhopad
        this.trat_historicopad = trat_historicopad,
        this.trat_objgeralpad = trat_objgeralpad,
        this.trat_objespecificopad = trat_objespecificopad,
        this.trat_estrategiapad = trat_estrategiapad,
        this.trat_obspad = trat_obspad,
        //plano de tratamento TO IS e AVD
        this.trat_diagnosticoocup = trat_diagnosticoocup,
        //plano de tratamento IS
        this.trat_especialidadeis = trat_especialidadeis,
        this.trat_terapeutaidis = trat_terapeutaidis,
        this.trat_regconselhois = trat_regconselhois,
        this.trat_metacurtois = trat_metacurtois,
        this.trat_metamediois = trat_metamediois,
        this.trat_metalongois = trat_metalongois,
        this.trat_objetivois = trat_objetivois,
        //plano de tratamento AVD
        this.trat_especialidadeavd = trat_especialidadeavd,
        this.trat_terapeutaidavd = trat_terapeutaidavd,
        this.trat_regconselhoavd = trat_regconselhoavd,
        this.trat_metacurtoavd = trat_metacurtoavd,
        this.trat_metamedioavd = trat_metamedioavd,
        this.trat_metalongoavd = trat_metalongoavd,
        this.trat_objetivoavd = trat_objetivoavd,
        
        //Dados para de Sistema, quem fez, data criação e quem alterou
        this.trat_usuidcad = trat_usuidcad,
        this.trat_datacad = trat_datacad,
        this.trat_usuidedi = trat_usuidedi,
        this.trat_dataedi = trat_dataedi,
        
        this.trat_lixomotivo = trat_lixomotivo,
        this.trat_lixo = trat_lixo
    }
}

TratSchema.loadClass(Trat)
var TratModel = getModel("softroute", 'tb_trat', TratSchema)
module.exports = {
    TratModel,
    TratSchema,

    tratEditar: async (req, res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        TratModel = getModel(db, 'tb_trat', TratSchema)
        //;
        
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let usuarioAtual = req.cookies['idUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let tratId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("tratId:"+tratId)
        
        //Realiza Atualização
        await TratModel.findByIdAndUpdate(req.body.tratId, 
            {$set: {
                //identificação do plano de tratamento
        trat_planotipo : req.body.tratPlanotipo,
        trat_beneid : req.body.tratBeneid,
        trat_beneidade : req.body.tratBeneidade,
        trat_benedatanasc : req.body.tratBenedatanasc,
        trat_tratdata : req.body.tratTratdata,
        trat_tratdatavigencia : req.body.tratTratdatavigencia,
        trat_diagnostico : req.body.tratDiagnostico,
        //plano padrao
        trat_especialidadepad : req.body.tratEspecialidadepad,
        trat_terapeutaidpad : req.body.tratTerapeutaidpad,
        trat_regconselhopad : req.body.tratRegconselhopad,
        trat_historicopad : req.body.tratHistoricopad,
        trat_objgeralpad : req.body.tratObjgeralpad,
        trat_objespecificopad : req.body.tratObjespecificopad,
        trat_estrategiapad : req.body.tratEstrategiapad,
        trat_obspad : req.body.tratObspad,
        //plano de tratamento TO AVD e IS
        trat_diagnosticoocup : req.body.tratDiagnosticoocup,
        //plano de tratamento IS
        trat_especialidadeis : req.body.tratEspecialidadeis,
        trat_terapeutaidis : req.body.tratTerapeutaidis,
        trat_regconselhois : req.body.tratRegconselhois,
        trat_metacurtois : req.body.tratMetacurtois,
        trat_metamediois : req.body.tratMetamediois,
        trat_metalongois : req.body.tratMetalongois,
        trat_objetivois : req.body.tratObjetivois,
        //plano de tratamento AVD
        trat_especialidadeavd : req.body.tratEspecialidadeavd,
        trat_terapeutaidavd : req.body.tratTerapeutaidavd,
        trat_regconselhoavd : req.body.tratRegconselhoavd,
        trat_metacurtoavd : req.body.tratMetacurtoavd,
        trat_metamedioavd : req.body.tratMetamedioavd,
        trat_metalongoavd : req.body.tratMetalongoavd,
        trat_objetivoavd : req.body.tratObjetivoavd,
        //Dados para de Sistema, quem fez, data criação e quem alterou
        trat_usuidedi: usuarioAtual,
        trat_dataedi : dataAtual,
        trat_lixo : "false"
        
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
    tratAdicionar: async (req,res) => {

        //Estrutura Multiempresa
        let db = req.cookies['preferredDb'];
        TratModel = getModel(db, 'tb_trat', TratSchema)
        //;

        console.log("tratmodel");
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
       
        const newTrat = new TratModel({
            trat_planotipo : req.body.tratPlanotipo,
            trat_beneid : req.body.tratBeneid,
            trat_beneidade : req.body.tratBeneidade,
            trat_benedatanasc : req.body.tratBenedatanasc,
            trat_tratdata : req.body.tratTratdata,
            trat_tratdatavigencia : req.body.tratTratdatavigencia,
            trat_diagnostico : req.body.tratDiagnostico,
            //plano padrao
            trat_especialidadepad : req.body.tratEspecialidadepad,
            trat_terapeutaidpad : req.body.tratTerapeutaidpad,
            trat_regconselhopad : req.body.tratRegconselhopad,
            trat_historicopad : req.body.tratHistoricopad,
            trat_objgeralpad : req.body.tratObjgeralpad,
            trat_objespecificopad : req.body.tratObjespecificopad,
            trat_estrategiapad : req.body.tratEstrategiapad,
            trat_obspad : req.body.tratObspad,
            //plano de tratamento TO AVD e IS
            trat_diagnosticoocup : req.body.tratDiagnosticoocup,
            //plano de tratamento IS
            trat_especialidadeis : req.body.tratEspecialidadeis,
            trat_terapeutaidis : req.body.tratTerapeutaidis,
            trat_regconselhois : req.body.tratRegconselhois,
            trat_metacurtois : req.body.tratMetacurtois,
            trat_metamediois : req.body.tratMetamediois,
            trat_metalongois : req.body.tratMetalongois,
            trat_objetivois : req.body.tratObjetivois,
            //plano de tratamento AVD
            trat_especialidadeavd : req.body.tratEspecialidadeavd,
            trat_terapeutaidavd : req.body.tratTerapeutaidavd,
            trat_regconselhoavd : req.body.tratRegconselhoavd,
            trat_metacurtoavd : req.body.tratMetacurtoavd,
            trat_metamedioavd : req.body.tratMetamedioavd,
            trat_metalongoavd : req.body.tratMetalongoavd,
            trat_objetivoavd : req.body.tratObjetivoavd,
            //Dados para de Sistema, quem fez, data criação e quem alterou
            trat_usuidcad : usuarioAtual,
            trat_datacad : dataAtual,
            trat_lixo : "false"
            
        });
        console.log("newTrat save");
        await newTrat.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    tratLixo: async (req, res) => {
        console.log('🔍 [tratLixo] Iniciando função de exclusão lógica');
        console.log('🔍 [tratLixo] req.params.id:', req.params.id);
        console.log('🔍 [tratLixo] req.query.motivo:', req.query.motivo);
        console.log('🔍 [tratLixo] req.cookies.idUsu:', req.cookies['idUsu']);
        
        try {
            // Estrutura Multiempresa
            let db = req.cookies['preferredDb'];
            console.log('🔍 [tratLixo] Database selecionada:', db);
            
            // ✅ CORREÇÃO: usar TratSchema (variável local deste arquivo)
            // NÃO usar tratClass.TratSchema aqui!
            const TratModel = getModel(db, 'tb_trat', TratSchema);

            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            const tratId = req.params.id;

            console.log('🔍 [tratLixo] Dados para atualização:');
            console.log('  - tratId:', tratId);
            console.log('  - usuarioAtual:', usuarioAtual);
            console.log('  - dataAtual:', dataAtual.toISOString());

            const motivo = req.query.motivo || req.body.motivo || 'Motivo não informado';
            console.log('🔍 [tratLixo] Motivo da exclusão:', motivo);

            console.log('🔍 [tratLixo] Executando findByIdAndUpdate...');
            
            const resultado = await TratModel.findByIdAndUpdate(
                tratId,
                {
                    $set: {
                        trat_usuidlixo: usuarioAtual,
                        trat_datalixo: dataAtual,
                        trat_lixomotivo: motivo,
                        trat_lixo: "true",
                        trat_dataedi: dataAtual,
                        trat_usuidedi: usuarioAtual
                    }
                },
                { new: true }
            );

            console.log('🔍 [tratLixo] Resultado do update:', resultado ? 'OK' : 'NULO');

            if (!resultado) {
                console.error('❌ [tratLixo] Registro não encontrado para ID:', tratId);
                throw new Error('Registro não encontrado');
            }

            console.log('✅ [tratLixo] Registro enviado para lixeira com sucesso!');
            return { sucesso: true, dados: resultado };

        } catch (err) {
            console.error('❌ [tratLixo] ERRO ao enviar para lixeira:', err.message);
            console.error('❌ [tratLixo] Stack:', err.stack);
            return { sucesso: false, erro: err.message };
        }
    },

    tratRestaurar: async (req, res) => {
        console.log('🔍 [tratRestaurar] Iniciando função de restauração');
        console.log('🔍 [tratRestaurar] req.params.id:', req.params.id);
        
        try {
            let db = req.cookies['preferredDb'];
            console.log('🔍 [tratRestaurar] Database:', db);
            
            // ✅ CORREÇÃO: usar TratSchema (variável local)
            const TratModel = getModel(db, 'tb_trat', TratSchema);

            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];
            const tratId = req.params.id || req.body.tratId;

            console.log('🔍 [tratRestaurar] Dados para restauração:');
            console.log('  - tratId:', tratId);
            console.log('  - usuarioAtual:', usuarioAtual);

            console.log('🔍 [tratRestaurar] Executando findByIdAndUpdate para restaurar...');
            
            const resultado = await TratModel.findByIdAndUpdate(
                tratId,
                {
                    $set: {
                        trat_lixo: "false",
                        trat_usuidlixo: null,
                        trat_datalixo: null,
                        trat_lixomotivo: null,
                        trat_dataedi: dataAtual,
                        trat_usuidedi: usuarioAtual
                    }
                },
                { new: true }
            );

            console.log('🔍 [tratRestaurar] Resultado do restore:', resultado ? 'OK' : 'NULO');

            if (!resultado) {
                console.error('❌ [tratRestaurar] Registro não encontrado para ID:', tratId);
                throw new Error('Registro não encontrado');
            }

            console.log('✅ [tratRestaurar] Registro restaurado com sucesso!');
            return { sucesso: true, dados: resultado };

        } catch (err) {
            console.error('❌ [tratRestaurar] ERRO ao restaurar:', err.message);
            console.error('❌ [tratRestaurar] Stack:', err.stack);
            return { sucesso: false, erro: err.message };
        }
    }
};