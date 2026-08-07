const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');
const { GuiaSchema } = require('../models/guia');//Isto é um objeto de Guia
const { GuialoteSchema } = require('../models/guialote');//Isto é um objeto de Guia

// Esquema Agenda
// Criado por: Wagner Cintra
// Criado em: 2022/03/20
// Editado em: 2025/10/03
const AgendaSchema = mongoose.Schema({
    agenda_data :{ type: Date, required: false },
    agenda_hora :{ type: String, required: false },//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
    agenda_horafim :{ type: String, required: false },//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
    agenda_data_semana :{ type: String, required: false },
    agenda_data_dia :{ type: String, required: false },
    agenda_beneid :{ type: ObjectId, required: true },
    agenda_convid :{ type: ObjectId, required: true },
    agenda_salaid :{ type: ObjectId, required: true },
    agenda_terapiaid :{ type: ObjectId, required: false },
    agenda_usuid :{ type: ObjectId, required: false }, //Id do terapeuta padrão mas no antendimento foi alterado para atend_terapeutaid
    agenda_mergeterapeutaid :{type: ObjectId, required: false }, 
    agenda_mergeterapiaid :{type: ObjectId, required: false }, 
    agenda_migrado :{ type: Boolean, required: false }, //Status se o agendamento gerou agendamento
    agenda_datacad :{ type: String, required: false },
    agenda_dataedi :{ type: String, required: false },
    agenda_categoria :{ type: String, required: true },
    agenda_org :{ type: String, required: true },
    agenda_obs :{ type: String, required: false },
    agenda_aux :{ type: String, required: false },
    agenda_temp :{ type: Boolean, required: false },
    agenda_tempId :{ type: ObjectId, required: false },
    agenda_tempmotivo :{ type: String, required: false },
    agenda_extra :{ type: Boolean, required: false},
    agenda_cobrarextra :{ type: Boolean, required: false},
    agenda_evolucao :{ type: String, required: false },
    agenda_copia :{ type: Boolean, required: false }, //Status de copia, para cria gerenciamento anti-copia duplicada
    agenda_selo :{ type: Boolean, required: false },
    agenda_dataSelo :{ type: String, required: false },
    agenda_atrazo :{ type: Boolean, required: false },
    agenda_rel :{ type: String, required: false }, //{'-':'todos', 'Beneficiario':'apenas_beneficiario', 'Terapeuta':'apenas_Terapeuta', 'Nenhum':'nenhum'}
    agenda_turnoFalta :{ type: String, required: false },
    agenda_faltaId :{ type: ObjectId, required: false },
    agenda_falta :{ type: String, required: false },
    agenda_usuedi :{ type: String, required: false }, //Usuário adm que alterou
    agenda_log :{ type: String, required: false }, //Log das alterações
    agenda_usucad :{ type: String, required: false },
    //Guia e Senha para Pagamento Financeiro
    // ✅ DEPOIS (CORRETO)
    agenda_guia :{ type: GuiaSchema, required: false },
    agenda_loteid :{ type: mongoose.Schema.Types.ObjectId, ref: 'tb_guialote', required: false, default: null }
})

// Construtor Agenda
// Criado por: Wagner Cintra
// Criado em: 2022/03/20
// Editado em: 2025/10/03
class Agenda{
    constructor(
        agenda_data,
        agenda_hora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
        agenda_horafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
        agenda_data_semana,
        agenda_data_dia,
        agenda_beneid,
        agenda_convid,
        agenda_salaid,
        agenda_terapiaid,
        agenda_usuid,
        agenda_mergeterapeutaid,
        agenda_mergeterapiaid,
        agenda_migrado,
        agenda_datacad,
        agenda_dataedi,
        agenda_categoria,
        agenda_org,
        agenda_obs,
        agenda_aux,
        agenda_temp,
        agenda_tempId,
        agenda_tempmotivo,
        agenda_extra,
        agenda_cobrarextra,
        agenda_evolucao,
        agenda_copia,
        agenda_selo,
        agenda_dataSelo,
        agenda_atrazo,
        agenda_rel,
        agenda_turnoFalta,
        agenda_faltaId,
        agenda_falta,
        agenda_usuedi, //Usuário adm que alterou
        agenda_log, //Log das alterações
        agenda_usucad,
        agenda_guia,
        agenda_loteid
        ){
        this.agenda_data = agenda_data,
        this.agenda_hora = agenda_hora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
        this.agenda_horafim = agenda_horafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
        this.agenda_data_semana = agenda_data_semana,
        this.agenda_data_dia = agenda_data_dia,
        this.agenda_beneid = agenda_beneid,
        this.agenda_convid = agenda_convid,
        this.agenda_salaid = agenda_salaid,
        this.agenda_terapiaid = agenda_terapiaid,
        this.agenda_usuid = agenda_usuid,
        this.agenda_mergeterapeutaid = agenda_mergeterapeutaid,
        this.agenda_mergeterapiaid = agenda_mergeterapiaid,
        this.agenda_migrado = agenda_migrado,
        this.agenda_datacad = agenda_datacad,
        this.agenda_dataedi = agenda_dataedi,
        this.agenda_categoria = agenda_categoria
        this.agenda_org = agenda_org,
        this.agenda_obs = agenda_obs,
        this.agenda_aux = agenda_aux, 
        this.agenda_temp = agenda_temp, 
        this.agenda_tempId = agenda_tempId,
        this.agenda_tempmotivo = agenda_tempmotivo,
        this.agenda_extra = agenda_extra,
        this.agenda_cobrarextra = agenda_cobrarextra,
        this.agenda_evolucao = agenda_evolucao,
        this.agenda_copia = agenda_copia,
        this.agenda_selo = agenda_selo,
        this.agenda_dataSelo = agenda_dataSelo,
        this.agenda_atrazo = agenda_atrazo,
        this.agenda_rel = agenda_rel,
        this.agenda_turnoFalta = agenda_turnoFalta,
        this.agenda_faltaId = agenda_faltaId,
        this.agenda_falta = agenda_falta,
        this.agenda_usuedi = agenda_usuedi, //Usuário adm que alterou
        this.agenda_log = agenda_log, //Log das alterações
        this.agenda_usucad = agenda_usucad,
        this.agenda_guia = agenda_guia,//Isto é um objeto de Guia
        this.agenda_loteid = agenda_loteid //Isto é um objeto de Lote
    }
}

AgendaSchema.loadClass(Agenda)
var AgendaModel = getModel("softroute", 'tb_agenda', AgendaSchema)
module.exports = {
    AgendaModel,
    AgendaSchema,

    agendaEditar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)

        let agendamento = await AgendaModel.findById(req.body.id);
        if (!agendamento) {
            console.log("Agendamento não encontrado");
            return false;
        }

        let agora = new Date();
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(agora.getMonth() - 2);
        let agendaData = new Date(agendamento.agenda_data);
        let bloqueio = agendaData < doisMesesAtras;

        if (bloqueio){
            console.log("Bloqueada a edição devido ao fechamento!");
            return false;
        } else {
            let usuarioAtual = req.cookies['idUsu'];
            let dataAtual = new Date();
            let data = new Date(req.body.agendaData);
            let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
            console.log(dataAgenda);
            let resultado;

            //Realiza Atualização - Atualização não faz alteração temporaria
            if (req.body.agendaCateg == "Padrão"){
                await AgendaModel.findByIdAndUpdate(req.body.id, 
                    {$set: {
                        agenda_data : dataAgenda,
                        agenda_hora : req.body.agendaHora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                        agenda_horafim : req.body.agendaHorafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                        agenda_beneid : req.body.agendaBeneid ,
                        agenda_convid : req.body.agendaConvid ,
                        agenda_salaid : req.body.agendaSalaid ,
                        agenda_terapiaid : req.body.agendaTerapiaid ,
                        agenda_usuid : req.body.agendaUsuid ,
                        agenda_categoria : req.body.agendaCateg ,
                        agenda_org : req.body.agendaOrg ,
                        agenda_obs : req.body.agendaObs ,
                        agenda_copia : req.body.agendaCopia,
                        agenda_usuedi: usuarioAtual , //Usuário adm que alterou
                        agenda_log: req.body.agendaLog , //Log das alterações
                        agenda_dataedi : dataAtual
                        }}
                ).then((res) =>{
                    //console.log("Salvo")
                    resultado = true;
                }).catch((err) =>{
                    console.log("erro mongo:")
                    console.log(err)
                    resultado = err;
                    //res.redirect('admin/branco')
                })
            } else {
                await AgendaModel.findByIdAndUpdate(req.body.id, 
                    {$set: {
                        agenda_data : dataAgenda ,
                        agenda_hora : req.body.agendaHora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                        agenda_horafim : req.body.agendaHorafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                        agenda_beneid : req.body.agendaBeneid ,
                        agenda_convid : req.body.agendaConvid ,
                        agenda_salaid : req.body.agendaSalaid ,
                        agenda_terapiaid : req.body.agendaTerapiaid ,
                        agenda_usuid : req.body.agendaUsuid ,
                        agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,
                        agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,
                        agenda_categoria : req.body.agendaCateg ,
                        agenda_org : req.body.agendaOrg ,
                        agenda_obs : req.body.agendaObs ,
                        agenda_copia : req.body.agendaCopia,
                        agenda_usuedi: usuarioAtual , //Usuário adm que alterou
                        agenda_log: req.body.agendaLog , //Log das alterações
                        agenda_dataedi : dataAtual
                        }}
                ).then((res) =>{
                    //console.log("Salvo")
                    resultado = true;
                }).catch((err) =>{
                    console.log("erro mongo:")
                    console.log(err)
                    resultado = err;
                    //res.redirect('admin/branco')
                })
            }
            
            return resultado;
        }
        
    },

    // Add Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaAdicionarOLD: async (req,res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);
        let bloqueio = dataAgenda < doisMesesAtras;

        if (bloqueio){
            console.log("Bloqueada a criação devido ao fechamento!");
            return false;
        } else {
            let usuarioAtual = req.cookies['idUsu'];
            let dataAtual = new Date();
            let agenda_temp = false;
            let extra = false;
            //console.log("req.body.agendaData:"+req.body.agendaData)
            console.log("req.body.agendaExtra:"+req.body.agendaExtra);
            if (req.body.agendaExtra == true || req.body.agendaExtra == "true"){
                extra = true;
            }

            let data = new Date(req.body.agendaData);
            //console.log(dataAgenda);
            //console.log("data:"+data);
            //console.log("dataAgenda:"+dataAgenda);
            //console.log("agendamodel");
            const newAgenda = new AgendaModel({
                agenda_data : dataAgenda ,
                agenda_hora : req.body.agendaHora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                agenda_horafim : req.body.agendaHorafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,
                agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,
                agenda_migrado : false ,
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_temp : false ,
                agenda_extra: extra ,
                agenda_cobrarextra : req.body.agendaCobrarextra  ,
                agenda_selo : false ,
                agenda_copia: false ,
                agenda_log: req.body.agendaLog , //Log das alterações
                agenda_usucad : usuarioAtual,
                agenda_datacad : dataAtual
            });
            //console.log("newAgenda save");
            await newAgenda.save().then(()=>{
                //console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },

    // ========================================================================
    // ➕ Add Agenda - CADASTRAR NOVO AGENDAMENTO
    // Criado por: Wagner Cintra | Editado em: 2025/10/03
    // ========================================================================
    agendaAdicionar: async (req, res) => {

        // 📌 PASSO 1: Configurar estrutura multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema);

        // 📌 PASSO 2: Definir variáveis de data e hora (ORDEM CORRETA!)
        // 👉 IMPORTANTE: 'data' deve ser definida ANTES de ser usada em dataAgenda
        let data = new Date(req.body.agendaData);
        
        // 👉 CORREÇÃO: Chosen pode enviar array ['08:00'], garantir que é string
        let agendaHora = Array.isArray(req.body.agendaHora) 
            ? req.body.agendaHora[0] 
            : req.body.agendaHora;
        
        let agendaHoraFim = Array.isArray(req.body.agendaHoraFim) 
            ? req.body.agendaHoraFim[0] 
            : req.body.agendaHoraFim;

        // 📌 PASSO 3: Construir dataAgenda em formato ISO seguro (evita "Invalid Date")
        let dataAgenda = new Date(
            `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}T${agendaHora}:00.000Z`
        );

        // 📌 PASSO 4: Validação de segurança - rejeita se data for inválida
        if (isNaN(dataAgenda.getTime())) {
            console.error("❌ [agendaAdicionar] Data inválida:", { 
                reqBody: req.body.agendaData, 
                dataParsed: data, 
                dataAgenda 
            });
            return false;
        }

        // 📌 PASSO 5: Verificar bloqueio por fechamento (2 meses atrás)
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);
        let bloqueio = dataAgenda < doisMesesAtras;
/*
        if (bloqueio) {
            console.log("🔒 Bloqueada a criação devido ao fechamento!");
            return false;
        }
*/
        // 📌 PASSO 6: Preparar dados para o novo registro
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        
        // Normalizar campo extra (boolean ou string "true"/"false")
        let extra = (req.body.agendaExtra == true || req.body.agendaExtra == "true");

        // 📌 PASSO 7: Instanciar novo documento com todos os campos
        const newAgenda = new AgendaModel({
            // 📅 Dados de data/hora
            agenda_data: dataAgenda,
            agenda_hora: agendaHora,              // 👉 String garantida (não array)
            agenda_horafim: agendaHoraFim,        // 👉 String garantida (não array)
            
            // 👥 Relacionamentos
            agenda_beneid: req.body.agendaBeneid,
            agenda_convid: req.body.agendaConvid,
            agenda_salaid: req.body.agendaSalaid,
            agenda_terapiaid: req.body.agendaTerapiaid,
            agenda_usuid: req.body.agendaUsuid,
            agenda_mergeterapeutaid: req.body.agendaMergeterapeutaid,
            agenda_mergeterapiaid: req.body.agendaMergeterapiaid,
            
            // 📊 Metadados
            agenda_migrado: false,
            agenda_categoria: req.body.agendaCateg,
            agenda_org: req.body.agendaOrg,
            agenda_obs: req.body.agendaObs,
            agenda_temp: false,
            agenda_extra: extra,
            agenda_cobrarextra: req.body.agendaCobrarextra,
            agenda_selo: false,
            agenda_copia: false,
            
            // 📝 Auditoria
            agenda_log: req.body.agendaLog,
            agenda_usucad: usuarioAtual,          // 👉 Agora com required: false corrigido
            agenda_datacad: dataAtual.toISOString() // 👉 ISO string é mais seguro
        });

        // 📌 PASSO 8: Salvar no MongoDB com tratamento de erro
        return await newAgenda.save()
            .then(() => { 
                console.log("✅ [SUCESSO] Agendamento cadastrado!"); 
                return true; 
            })
            .catch((err) => { 
                console.error("❌ [ERRO] Falha ao salvar agendamento:", err); 
                return err; 
            });
    },

    // Add Temp Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaAdicionarTemp: async (req,res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;
        let [ano, mes, dia] = req.body.dataAg.split('-').map(Number);
        let data = new Date(ano, mes - 1, dia);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);
        let bloqueio = dataAgenda < doisMesesAtras;

        if (bloqueio){
            console.log("Bloqueada a criação devido ao fechamento!");
            return false;
        } else {
            let usuarioAtual = req.cookies['idUsu'];
            let dataAtual = new Date();
            let agendaTempId = new mongoose.mongo.ObjectId(req.body.agendaIdTemp);
            //console.log("agendaTempId:"+agendaTempId)
            //console.log("req.body.agendaData:"+req.body.agendaData)
            //console.log(dataAgenda);
            //console.log("data:"+data);
            //console.log("dataAgenda:"+dataAgenda);
            //console.log("agendamodel");
            const newAgenda = new AgendaModel({
                agenda_data : dataAgenda ,
                agenda_hora : req.body.agendaHora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                agenda_horafim : req.body.agendaHoraFim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_mergeterapeutaid : req.body.agendaMergeterapeutaid ,
                agenda_mergeterapiaid : req.body.agendaMergeterapiaid ,
                agenda_migrado : false ,
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_temp : true ,
                agenda_tempId : agendaTempId ,
                agenda_tempmotivo : req.body.agendaTempMotivo ,
                agenda_selo : false ,
                agenda_copia : false,
                agenda_turnoFalta : req.body.agendaTurnoFalta,
                //agenda_faltaId : req.body.agendaFaltaId,
                //agenda_falta : req.body.agendaAlvoFalta,
                agenda_log: req.body.agendaLog , //Log das alterações
                agenda_usucad : usuarioAtual,
                agenda_datacad : dataAtual,
            });
            //console.log("newAgenda save");
            await newAgenda.save().then(()=>{
                //console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },

    // ========================================================================
    // ➕ Add Temp Agenda - CADASTRAR AGENDAMENTO TEMPORÁRIO (SUBSTITUIÇÃO)
    // Criado por: Wagner Cintra | Editado em: 2025/10/03
    // ========================================================================
    agendaAdicionarTempQuebrada: async (req, res) => {

        // 📌 PASSO 1: Configurar estrutura multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema);

        // 📌 PASSO 2: Definir variáveis de data e hora (ORDEM CORRETA!)
        let data = new Date(req.body.agendaData);
        
        // 👉 CORREÇÃO: Sanitizar hora para evitar array do Chosen
        let agendaHora = Array.isArray(req.body.agendaHora) 
            ? req.body.agendaHora[0] 
            : req.body.agendaHora;
        
        let agendaHoraFim = Array.isArray(req.body.agendaHoraFim) 
            ? req.body.agendaHoraFim[0] 
            : req.body.agendaHoraFim;

        // 📌 PASSO 3: Construir dataAgenda em formato ISO seguro
        let dataAgenda = new Date(
            `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}T${agendaHora}:00.000Z`
        );

        // 📌 PASSO 4: Validação de segurança
        if (isNaN(dataAgenda.getTime())) {
            console.error("❌ [agendaAdicionarTemp] Data inválida:", dataAgenda);
            return false;
        }

        // 📌 PASSO 5: Verificar bloqueio por fechamento
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(doisMesesAtras.getMonth() - 2);
        let bloqueio = dataAgenda < doisMesesAtras;

        if (bloqueio) {
            console.log("🔒 Bloqueada a criação devido ao fechamento!");
            return false;
        }

        // 📌 PASSO 6: Preparar dados do registro temporário
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        
        // Converter agendaTempId para ObjectId do Mongoose
        let agendaTempId = new mongoose.mongo.ObjectId(req.body.agendaIdTemp);

        // 📌 PASSO 7: Instanciar novo documento TEMPORÁRIO
        const newAgenda = new AgendaModel({
            // 📅 Dados de data/hora
            agenda_data: dataAgenda,
            agenda_hora: agendaHora,              // 👉 String garantida
            agenda_horafim: agendaHoraFim,        // 👉 String garantida
            
            // 👥 Relacionamentos
            agenda_beneid: req.body.agendaBeneid,
            agenda_convid: req.body.agendaConvid,
            agenda_salaid: req.body.agendaSalaid,
            agenda_terapiaid: req.body.agendaTerapiaid,
            agenda_usuid: req.body.agendaUsuid,
            agenda_mergeterapeutaid: req.body.agendaMergeterapeutaid,
            agenda_mergeterapiaid: req.body.agendaMergeterapiaid,
            
            // 📊 Metadados
            agenda_migrado: false,
            agenda_categoria: req.body.agendaCateg,
            agenda_org: req.body.agendaOrg,
            agenda_obs: req.body.agendaObs,
            
            // 🔗 Campos específicos de TEMP
            agenda_temp: true,                    // 👉 Marca como temporário
            agenda_tempId: agendaTempId,          // 👉 ID do registro original
            agenda_tempmotivo: req.body.agendaTempMotivo,
            
            agenda_selo: false,
            agenda_copia: false,
            agenda_turnoFalta: req.body.agendaTurnoFalta,
            
            // 📝 Auditoria
            agenda_log: req.body.agendaLog,
            agenda_usucad: usuarioAtual,
            agenda_datacad: dataAtual.toISOString()
        });

        // 📌 PASSO 8: Salvar no MongoDB
        return await newAgenda.save()
            .then(() => { 
                console.log("✅ [SUCESSO] Agendamento temporário cadastrado!"); 
                return true; 
            })
            .catch((err) => { 
                console.error("❌ [ERRO] Falha ao salvar temp:", err); 
                return err; 
            });
    },
    
    // Editar Temp Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaEditarTempOLD: async (req, res) => {

         //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;
        let agendamento = await Agenda.findById(req.body.agendaId);
        if (!agendamento) {
            console.log("Agendamento não encontrado");
            return false;
        }

        let agora = new Date();
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(agora.getMonth() - 2);
        let agendaData = new Date(agendamento.agenda_data);
        let bloqueio = agendaData < doisMesesAtras;

        if (bloqueio){
            console.log("Bloqueada a edição devido ao fechamento!");
            return false;
        } else {
            let usuarioAtual = req.cookies['idUsu'];
            let dataAtual = new Date();
            let data = new Date(req.body.agendaData);
            let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
            let resultado;
            //Pega data atual
            //Realiza Atualização - Atualização não faz alteração temporaria
            await AgendaModel.findByIdAndUpdate(new ObjectId(req.body.agendaId), 
                {$set: {
                    agenda_data : dataAgenda ,
                    agenda_hora : req.body.agendaHora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                    agenda_horafim : req.body.agendaHorafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                    agenda_beneid : req.body.agendaBeneid ,
                    agenda_convid : req.body.agendaConvid ,
                    agenda_salaid : req.body.agendaSalaid ,
                    agenda_usuid : req.body.agendaUsuid ,
                    agenda_terapiaid : req.body.novaAgendaTerapiaid ,
                    agenda_categoria : req.body.agendaCateg ,
                    agenda_org : req.body.agendaOrg ,
                    agenda_obs : req.body.agendaObs ,
                    agenda_temp : true ,
                    agenda_usuedi: usuarioAtual ,
                    agenda_dataedi : dataAtual
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
        }
    },

    //Old
    agendaEditarTemp: async (req, res) => {
         //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;
        let agendamento = await AgendaModel.findById(req.body.agendaId);
        let agora = new Date();
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(agora.getMonth() - 2);
        let agendaData = new Date(agendamento.agenda_data);
        let bloqueio = agendaData < doisMesesAtras;

        if (bloqueio) {
            console.log("🔒 Bloqueada a edição devido ao fechamento!");
            return false;
        }

        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        let resultado;
        //Pega data atual
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(new ObjectId(req.body.agendaId), 
            {$set: {
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_terapiaid : req.body.novaAgendaTerapiaid ,
                agenda_categoria : req.body.agendaCateg ,
                agenda_org : req.body.agendaOrg ,
                agenda_obs : req.body.agendaObs ,
                agenda_temp : true ,
                agenda_usuedi: usuarioAtual ,
                agenda_dataedi : dataAtual
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
    // ========================================================================
    // ✏️ Editar Temp Agenda - ATUALIZAR AGENDAMENTO TEMPORÁRIO
    // Criado por: Wagner Cintra | Editado em: 2025/10/03
    // ========================================================================
    agendaEditarTempNew: async (req, res) => {

        // 📌 PASSO 1: Configurar estrutura multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema);

        // 📌 PASSO 2: Buscar registro existente para validação
        let agendamento = await Agenda.findById(req.body.agendaId);
        if (!agendamento) {
            console.log("❌ Agendamento temporário não encontrado");
            return false;
        }

        // 📌 PASSO 3: Verificar bloqueio por fechamento
        let agora = new Date();
        let doisMesesAtras = new Date();
        doisMesesAtras.setMonth(agora.getMonth() - 2);
        let agendaData = new Date(agendamento.agenda_data);
        let bloqueio = agendaData < doisMesesAtras;

        if (bloqueio) {
            console.log("🔒 Bloqueada a edição devido ao fechamento!");
            return false;
        }

        // 📌 PASSO 4: Preparar dados de atualização
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        
        // 👉 CORREÇÃO: Definir 'data' ANTES de usar
        let data = new Date(req.body.agendaData);
        
        // 👉 CORREÇÃO: Sanitizar hora
        let agendaHora = Array.isArray(req.body.agendaHora) 
            ? req.body.agendaHora[0] 
            : req.body.agendaHora;

        // 📌 PASSO 5: Construir dataAgenda em formato ISO seguro
        let dataAgenda = new Date(
            `${data.getFullYear()}-${String(data.getMonth()+1).padStart(2,'0')}-${String(data.getDate()).padStart(2,'0')}T${data.getUTCHours()}:${data.getMinutes()}:00.000Z`
        );

        let resultado;

        // 📌 PASSO 6: Atualizar registro TEMP com campos específicos
        await AgendaModel.findByIdAndUpdate(
            new mongoose.Types.ObjectId(req.body.agendaId), 
            { 
                $set: {
                    agenda_data: dataAgenda,
                    agenda_hora: agendaHora,              // 👉 String garantida
                    agenda_horafim: Array.isArray(req.body.agendaHoraFim) 
                        ? req.body.agendaHoraFim[0] 
                        : req.body.agendaHoraFim,
                    agenda_beneid: req.body.agendaBeneid,
                    agenda_convid: req.body.agendaConvid,
                    agenda_salaid: req.body.agendaSalaid,
                    agenda_usuid: req.body.agendaUsuid,
                    agenda_terapiaid: req.body.novaAgendaTerapiaid, // 👉 Campo específico temp
                    agenda_categoria: req.body.agendaCateg,
                    agenda_org: req.body.agendaOrg,
                    agenda_obs: req.body.agendaObs,
                    agenda_temp: true,                    // 👉 Mantém como temp
                    agenda_usuedi: usuarioAtual,
                    agenda_dataedi: dataAtual
                }
            }
        )
            .then(() => { 
                console.log("✅ [SUCESSO] Temp atualizado"); 
                resultado = true; 
            })
            .catch((err) => { 
                console.error("❌ [ERRO] Falha ao atualizar temp:", err); 
                resultado = err; 
            });

        // 📌 PASSO 7: Retornar resultado
        return resultado;
    },

    // Localizar um Temp Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaFindOne: async (id, res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        let resultado;
        //Pega data atual
        
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findOne({_id: id}).then((res) =>{
            //console.log("Salvo")
            resultado = res;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = undefined;
            //res.redirect('admin/branco')
        })
        return resultado;
    },

    // Evolução Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    evolucao: async (req, res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        var resultado;
        let selo;
        let selamento;
        let dataSelamento = "-";
        let atrazo = req.body.agendaAtrazo;
        await AgendaModel.find({_id: req.body.id}).then((a)=>{
            selo = a.agendaSelo;
            //console.log("req.body.agendaId:"+req.body.id)
        })
        //console.log("req.body.agendaSelamento:"+req.body.agendaSelamento)
        if (req.body.agendaSelamento == "true"){
            selamento = true;
            let hoje = new Date();

            dataSelamento = fncGeral.getDateToIsostring(hoje);
        } else {
            selamento = false;
        }
        //console.log("req.body.agendaEvolucao:"+req.body.agendaEvolucao)
        if(selo){
            resultado = "A Evolução já foi finalizada, não é possível editar as informações sem autorização administrativa!";
            console.log(resultado);
        } else {
            //console.log("SALVANDO!")
            await AgendaModel.findByIdAndUpdate(req.body.id, 
                {$set: {
                    agenda_evolucao : req.body.agendaEvolucao ,
                    agenda_atrazo : atrazo,
                    agenda_selo : selamento,
                    agenda_dataSelo : dataSelamento
                }}
            ).then((res) =>{
                //console.log("Salvo")
                resultado = true;
            }).catch((err) =>{
                console.log("erro mongo:")
                console.log(err)
                resultado = err;
                //res.redirect('admin/branco')
            })
        }
        await AgendaModel.find({_id: req.body.id}).then((a)=>{
            //console.log("agenda:"+a)
        })
        return resultado;
    },

    // Falta do Dia Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    // Editado em: 2026/08/07
    agendaFaltaDia: async (req, res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        let usuarioAtual = req.cookies['idUsu'];
        var retorno;
        let arrayAgendasNovas = [];
        let dataAtual = new Date();
        let arrayIds =[];
        let agendaFinal = [];
        let resultado = "true";
        let busca;
        let agendaS;
        let dataIni = fncGeral.getDateFromString(req.body.agendaData, "ini");
        let dataFim = fncGeral.getDateFromString(req.body.agendaData, "fim");
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = req.body.agendaMergeterapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        //console.log("ini: "+fncGeral.getDateToIsostring(dataIni));
        //console.log("fim: "+fncGeral.getDateToIsostring(dataFim));
        
        //Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
        //Não podem mais ter horarios especificos o que determinara manha e tarde e hoprario completo 
        //24:00 até 11:59 texto é manha, 12:00 ate 18:00 tarde, noite 18:01 ate 23:59
        //Agenda_hora e agenda_horafim definem o intervalo
        let horasTurnoManha = ["08:00","08:40","09:20","10:00","10:40","11:20"];
        let horasTurnoTarde = ["13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
        let horasTurnoCompleto = ["08:00","08:40","09:20","10:00","10:40","11:20","13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
        //Calculetodos
        let turno = [];
        
        if (req.body.agendaTurnoFalta == "Manhã"){
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoManha);
            
            console.log("dataIni? "+dataIni)
            console.log("dataFim? "+dataFim)
            dataFim.setHours(12);
            console.log("dataIni? "+dataIni)
            console.log("dataFim? "+dataFim)
            turnoIni = fncGeral.getDateToIsostring(dataIni);
            turnoFim = fncGeral.getDateToIsostring(dataFim);
            console.log("turnoIni? "+turnoIni)
            console.log("turnoFim? "+turnoFim)
        } else if (req.body.agendaTurnoFalta == "Tarde"){
            console.log("TARDE")
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoTarde);

            console.log("dataIni? "+dataIni)
            console.log("dataFim? "+dataFim)
            dataIni.setHours(12);
            console.log("dataIni? "+dataIni)
            console.log("dataFim? "+dataFim)
            turnoIni = fncGeral.getDateToIsostring(dataIni);
            turnoFim = fncGeral.getDateToIsostring(dataFim);
            console.log("turnoIni? "+turnoIni)
            console.log("turnoFim? "+turnoFim)
        } else {
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoCompleto);

            turnoIni = fncGeral.getDateToIsostring(dataIni);
            turnoFim = fncGeral.getDateToIsostring(dataFim);
            console.log("turnoIni? "+turnoIni)
            console.log("turnoFim? "+turnoFim)
        }
        console.log("req.body.agendaCateg: "+req.body.agendaCateg);
        if (beneidx == "-" && req.body.agendaMergeterapeutaid == "-") {
            resultado = "false";
        } else if (beneidx != "-" && teraidx == "-") {
            busca = { agenda_data: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx };
        } else if (beneidx == "-" && teraidx != "-") {
            console.log("falta terapeuta")
            busca = { agenda_data: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx };
        } else {
            console.log("falta de um bene para um terapeuta")
            busca = { agenda_data: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx };
        }
        if (resultado != "false"){
            await AgendaModel.find(busca).then((agenda)=>{
                console.log("agenda:"+agenda.length);
                agenda.forEach(a => {
                    arrayIds.push(a._id);
                })
                AgendaModel.find({agenda_tempId: {$in: arrayIds}}).then((agendaSemanal)=>{
                    console.log("agendaSemanal:"+agendaSemanal.length);
                    agendaSemanal.forEach(as => {
                        agendaFinal.push(as);
                    })
                    agenda.forEach((a)=>{
                        let add = "true";
                        agendaSemanal.forEach(as => {
                            if ((""+as.agenda_tempId+"") == (""+a._id+"")){
                                add = "false";
                            }
                        })
                        if (add == "true"){
                            agendaFinal.push(a);
                        }
                    })
                    agendaFinal.forEach(a => {
                        if (a.agenda_tempId == undefined || a.agenda_tempId == "undefined"){
                            agendaS = "false";
                        } else {
                            agendaS = "true";
                        }
                        if (agendaS == "true"){
                            arrayAgendasNovas.push(a);
                            let agendaFixa = agenda.find(ag => ag._id.toString() === a.agenda_tempId.toString());
                            let trocaUpdate = false;
                            if (agendaFixa.agenda_selo != undefined && agendaFixa.agenda_selo != "undefined" && agendaFixa.agenda_selo != null && agendaFixa.agenda_selo != "null") {
                                if (a.agenda_selo != undefined && a.agenda_selo != "undefined" && a.agenda_selo != null && a.agenda_selo != "null"){
                                    if (agendaFixa.agenda_selo && !a.agenda_selo){
                                        trocaUpdate = true;
                                    }
                                } else {
                                    trocaUpdate = true;
                                }
                            }
                            if (trocaUpdate) {
                                let evolucaoFinal = (agendaFixa.agenda_evolucao?.toString() || "") + (a.agenda_evolucao?.toString() || "");
                                AgendaModel.findByIdAndUpdate(a._id, 
                                    {$set: {
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_usucad : usuarioAtual ,
                                        agenda_dataedi : dataAtual ,
                                        agenda_faltaId : req.body.agendaFaltaId ,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta ,
                                        agenda_evolucao : evolucaoFinal ,
                                        agenda_selo : true ,
                                        agenda_dataSelo : agendaFixa.agenda_dataSelo 
                                    }}
                                ).then((res) =>{
                                    //console.log("Salvo")
                                    resultado = true;
                                }).catch((err) =>{
                                    console.log("erro mongo:")
                                    console.log(err)
                                    resultado = err;
                                    //res.redirect('admin/branco')
                                })
                            } else {
                                AgendaModel.findByIdAndUpdate(a._id, 
                                    {$set: {
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_usucad : usuarioAtual ,
                                        agenda_dataedi : dataAtual ,
                                        agenda_faltaId : req.body.agendaFaltaId ,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta 
                                    }}
                                ).then((res) =>{
                                    //console.log("Salvo")
                                    resultado = true;
                                }).catch((err) =>{
                                    console.log("erro mongo:")
                                    console.log(err)
                                    resultado = err;
                                    //res.redirect('admin/branco')
                                })
                            }
                        } else {
                            let trocaUpdate = false; // ✅ ADICIONEI AQUI WAGNER 07-08-2026
                            if (a.agenda_selo != undefined && a.agenda_selo != "undefined" && a.agenda_selo != null && a.agenda_selo != "null"){
                                if (a.agenda_selo){
                                    trocaUpdate = true;
                                }
                            } else {
                                trocaUpdate = true;
                            }
                            let newAgenda = {};
                            if (a.agenda_mergeterapeutaid != undefined){
                                if (trocaUpdate) {
                                    newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_mergeterapeutaid : a.agenda_mergeterapeutaid ,
                                        agenda_mergeterapiaid : a.agenda_mergeterapiaid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_copia : false,
                                        agenda_evolucao : a.agenda_evolucao ,
                                        agenda_selo : a.agenda_selo ,
                                        agenda_dataSelo : a.agenda_dataSelo ,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                } else {
                                    newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_mergeterapeutaid : a.agenda_mergeterapeutaid ,
                                        agenda_mergeterapiaid : a.agenda_mergeterapiaid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_copia : false,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                }
                                
                                arrayAgendasNovas.push(newAgenda)
                                newAgenda.save().then((resultado)=>{
                                    console.log("Resultado: "+resultado)
                                }).catch((err)=>{
                                    console.log("err: "+err)
                                })
                                console.log("salvo!")
                            } else {
                                let trocaUpdate = false; // ✅ ADICIONEI AQUI WAGNER 07-08-2026
                                if (a.agenda_selo != undefined && a.agenda_selo != "undefined" && a.agenda_selo != null && a.agenda_selo != "null"){
                                    if (a.agenda_selo){
                                        trocaUpdate = true;
                                    }
                                } else {
                                    trocaUpdate = true;
                                }
                                let newAgenda = {};
                                if (trocaUpdate) {
                                    newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_selo : a.agenda_selo ,
                                        agenda_dataSelo : a.agenda_dataSelo ,
                                        agenda_copia : false,
                                        agenda_evolucao : a.agenda_evolucao,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                } else {
                                    newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_copia : false,
                                        agenda_evolucao : a.agenda_evolucao,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                }
                                
                                arrayAgendasNovas.push(newAgenda)
                                newAgenda.save().then((resultado)=>{
                                    console.log("Resultado: "+resultado)
                                }).catch((err)=>{
                                    console.log("err: "+err)
                                })
                                console.log("salvo2!")
                            }
                        }
                    })
                })
            }).catch((err) =>{
                retorno = err
                console.log("erro mongo:");
                console.log(err);
            }).finally(()=>{
                //console.log("arrayAgendasNovas: "+arrayAgendasNovas.length)
                
                retorno = "true";
                return retorno;
            })
        }
        return "true"; // ✅ ADICIONEI Essa Linha pra retornar True na view, Wagner Cintra 07-08-2026
    },

    // Feriado do Dia Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaFeriadoOLD: async (req, res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        //console.log("req.body.agendaData: "+req.body.agendaData)
        let dataAtual = new Date();
        let seg = new Date(req.body.agendaData);
        seg.setHours(seg.getHours()+3);
        seg.setSeconds(0);
        seg.setMinutes(0);
        seg.setHours(0);
        //seg.setHours(seg.getHours()-3);


        let sex = new Date(req.body.agendaData);
        sex.setHours(sex.getHours()+3);
        sex.setSeconds(59);
        sex.setMinutes(59);
        sex.setHours(23);
        //sex.setHours(sex.getHours()-3);

        let agendaS;
        let usuarioAtual = req.cookies['idUsu'];
        let arrayAgendasNovas = [];
        var retorno;
        let arrayIds =[];
        let agendaFinal = [];
        let busca;
        console.log("ini: "+fncGeral.getDateToIsostring(seg));
        console.log("fim: "+fncGeral.getDateToIsostring(sex));

        busca = { agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_temp: false };

        await AgendaModel.find(busca).then((agenda)=>{
            agenda.forEach(a => {
                arrayIds.push(a._id);
            })
            AgendaModel.find({agenda_tempId: {$in: arrayIds}}).then((agendaSemanal)=>{
                agendaSemanal.forEach(as => {
                    agendaFinal.push(as);
                })
                agenda.forEach((a)=>{
                    let add = "true";
                    agendaSemanal.forEach(as => {
                        if ((""+as.agenda_tempId+"") == (""+a._id+"")){
                            add = "false";
                        }
                    })
                    if (add == "true"){
                        agendaFinal.push(a);
                    }
                })
                 
                agendaFinal.forEach(a => {
                    if (a.agenda_tempId == undefined || a.agenda_tempId == "undefined"){
                        agendaS = "false";
                    } else {
                        agendaS = "true";
                    }
                    
                    if (agendaS == "true"){
                        if (a.agenda_categoria != "Feriado"){
                            arrayAgendasNovas.push(a);
                            AgendaModel.findByIdAndUpdate(a._id, 
                                {$set: {
                                    agenda_categoria : "Feriado" ,
                                    agenda_org : "Administrativo" ,
                                    agenda_usucad : usuarioAtual ,
                                    agenda_dataedi : dataAtual ,
                                    agenda_tempmotivo : "Feriado" ,
                                    agenda_extra: false,
                                    agenda_turnoFalta : req.body.agendaTurnoFalta 
                                }}
                            ).then((res) =>{
                                //console.log("Salvo")
                                resultado = true;
                            }).catch((err) =>{
                                console.log("erro mongo:")
                                console.log(err)
                                resultado = err;
                                //res.redirect('admin/branco')
                            })
                        }
                    } else {
                        if (a.agenda_mergeterapeutaid != undefined){
                            let newAgenda = new AgendaModel({
                                agenda_data : a.agenda_data ,
                                agenda_hora : a.agenda_hora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                                agenda_horafim : a.agenda_horafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                                agenda_beneid : a.agenda_beneid ,
                                agenda_convid : a.agenda_convid ,
                                agenda_salaid : a.agenda_salaid ,
                                agenda_terapiaid : a.agenda_terapiaid ,
                                agenda_usuid : a.agenda_usuid ,
                                agenda_mergeterapeutaid : a.agenda_mergeterapeutaid ,
                                agenda_mergeterapiaid : a.agenda_mergeterapiaid ,
                                agenda_migrado : false ,
                                agenda_categoria : "Feriado" ,
                                agenda_org : "Administrativo" ,
                                agenda_obs : a.agenda_obs ,
                                agenda_temp : true ,
                                agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                agenda_tempmotivo : "Feriado" ,
                                agenda_selo : false ,
                                agenda_copia : false,
                                agenda_extra: false,
                                agenda_turnoFalta : req.body.agendaTurnoFalta,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                            newAgenda.save()
                        } else {
                            let newAgenda = new AgendaModel({
                                agenda_data : a.agenda_data ,
                                agenda_hora : a.agenda_hora,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                                agenda_horafim : a.agenda_horafim,//Novo campo Horario Livre, descontinuar tabela de horários 07-04-2026 10,45h Debora
                                agenda_beneid : a.agenda_beneid ,
                                agenda_convid : a.agenda_convid ,
                                agenda_salaid : a.agenda_salaid ,
                                agenda_terapiaid : a.agenda_terapiaid ,
                                agenda_usuid : a.agenda_usuid ,
                                agenda_migrado : false ,
                                agenda_categoria : "Feriado" ,
                                agenda_org : "Administrativo" ,
                                agenda_obs : a.agenda_obs ,
                                agenda_temp : true ,
                                agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                agenda_tempmotivo : "Feriado" ,
                                agenda_selo : false ,
                                agenda_copia : false,
                                agenda_extra: false,
                                agenda_turnoFalta : req.body.agendaTurnoFalta,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                            newAgenda.save();
                        }
                    }
                });
            })
        }).catch((err) =>{
            retorno = err
            console.log("erro mongo:");
            console.log(err);
        }).finally(()=>{
            //console.log("arrayAgendasNovas: "+arrayAgendasNovas.length)
            
            retorno = "true";
            return retorno;
        })
    },

    // ========================================================================
    // 🎉 Feriado do Dia Agenda - MARCAR AGENDAMENTOS COMO FERIADO
    // Criado por: Wagner Cintra | Editado em: 2025/10/03
    // ========================================================================
    agendaFeriado_old: async (req, res) => {

        // 📌 PASSO 1: Configurar estrutura multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema);

        // 📌 PASSO 2: Definir período do dia (00:00:00 até 23:59:59)
        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        
        let seg = new Date(req.body.agendaData);
        seg.setUTCHours(0, 0, 0, 0);  // 👉 Início do dia em UTC
        
        let sex = new Date(req.body.agendaData);
        sex.setUTCHours(23, 59, 59, 999);  // 👉 Fim do dia em UTC

        console.log("📅 Período feriado:", {
            ini: fncGeral.getDateToIsostring(seg),
            fim: fncGeral.getDateToIsostring(sex)
        });

        // 📌 PASSO 3: Buscar registros do dia (apenas pais, não temporários)
        let busca = { 
            agenda_data: { 
                $gte: fncGeral.getDateToIsostring(seg), 
                $lte: fncGeral.getDateToIsostring(sex) 
            }, 
            agenda_temp: false  // 👉 Ignora registros temporários
        };

        let arrayIds = [];
        let agendaFinal = [];
        let arrayAgendasNovas = [];

        // 📌 PASSO 4: Buscar pais e detectar filhos (cadeia)
        await AgendaModel.find(busca)
            .then((agenda) => {
                // Coletar IDs dos pais
                agenda.forEach(a => { arrayIds.push(a._id); });

                // Buscar filhos que apontam para esses pais
                return AgendaModel.find({ agenda_tempId: { $in: arrayIds } });
            })
            .then((agendaSemanal) => {
                // Unir pais + filhos na lista final
                agendaSemanal.forEach(as => { agendaFinal.push(as); });
                
                AgendaModel.forEach((a) => {
                    let add = "true";
                    agendaSemanal.forEach(as => {
                        if ("" + as.agenda_tempId + "" == "" + a._id + "") {
                            add = "false";  // 👉 Já está na lista como filho
                        }
                    });
                    if (add == "true") {
                        agendaFinal.push(a);
                    }
                });

                // 📌 PASSO 5: Processar cada registro para marcar como feriado
                agendaFinal.forEach(a => {
                    let agendaS = (a.agenda_tempId && a.agenda_tempId != "undefined") ? "true" : "false";
                    
                    if (agendaS == "true") {
                        // 👉 Filho: atualizar categoria diretamente
                        if (a.agenda_categoria != "Feriado") {
                            arrayAgendasNovas.push(a);
                            AgendaModel.findByIdAndUpdate(a._id, {
                                $set: {
                                    agenda_categoria: "Feriado",
                                    agenda_org: "Administrativo",
                                    agenda_usucad: usuarioAtual,
                                    agenda_dataedi: dataAtual,
                                    agenda_tempmotivo: "Feriado",
                                    agenda_extra: false,
                                    agenda_turnoFalta: req.body.agendaTurnoFalta
                                }
                            }).catch((err) => {
                                console.error("❌ Erro ao atualizar filho:", err);
                            });
                        }
                    } else {
                        // 👉 Pai: criar novo registro temporário como feriado
                        let newAgenda = new AgendaModel({
                            // 📅 Dados de data/hora (FERIADO não usa hora específica)
                            agenda_data: a.agenda_data,
                            agenda_hora: null,              // 👉 Feriado não tem hora
                            agenda_horafim: null,           // 👉 Feriado não tem hora fim
                            
                            // 👥 Relacionamentos (mantém do original)
                            agenda_beneid: a.agenda_beneid,
                            agenda_convid: a.agenda_convid,
                            agenda_salaid: a.agenda_salaid,
                            agenda_terapiaid: a.agenda_terapiaid,
                            agenda_usuid: a.agenda_usuid,
                            agenda_mergeterapeutaid: a.agenda_mergeterapeutaid,
                            agenda_mergeterapiaid: a.agenda_mergeterapiaid,
                            
                            // 📊 Metadados
                            agenda_migrado: false,
                            agenda_categoria: "Feriado",    // 👉 Marca como feriado
                            agenda_org: "Administrativo",
                            agenda_obs: a.agenda_obs,
                            
                            // 🔗 Campos de TEMP
                            agenda_temp: true,
                            agenda_tempId: new mongoose.Types.ObjectId(a._id),
                            agenda_tempmotivo: "Feriado",
                            
                            agenda_selo: false,
                            agenda_copia: false,
                            agenda_extra: false,
                            agenda_turnoFalta: req.body.agendaTurnoFalta,
                            
                            // 📝 Auditoria
                            agenda_usucad: usuarioAtual,
                            agenda_datacad: dataAtual.toISOString()
                        });
                        
                        arrayAgendasNovas.push(newAgenda);
                        
                        // Salvar o novo registro temporário
                        newAgenda.save().catch((err) => {
                            console.error("❌ Erro ao salvar temp feriado:", err);
                        });
                    }
                });
            })
            .catch((err) => {
                console.error("❌ [ERRO] agendaFeriado:", err);
            })
            .finally(() => {
                console.log(`✅ [FINAL] ${arrayAgendasNovas.length} registros processados como feriado`);
            });

        // 📌 PASSO 6: Retornar status
        return "true";
    },

    agendaFeriado: async (req, res) => {
        try {
            // 📌 PASSO 1: Configurar estrutura multiempresa
            let db = req.cookies['preferredDb'];
            let AgendaModel = getModel(db, 'tb_agenda', AgendaSchema); // 👈 Adicionado 'let' para não virar variável global

            // 📌 PASSO 2: Definir período do dia (00:00:00 até 23:59:59)
            let dataAtual = new Date();
            let usuarioAtual = req.cookies['idUsu'];
            
            let seg = new Date(req.body.agendaData);
            seg.setUTCHours(0, 0, 0, 0);  
            
            let sex = new Date(req.body.agendaData);
            sex.setUTCHours(23, 59, 59, 999);

            console.log("📅 Período feriado:", {
                ini: fncGeral.getDateToIsostring(seg),
                fim: fncGeral.getDateToIsostring(sex)
            });

            // 📌 PASSO 3: Buscar registros do dia (apenas pais, não temporários)
            let busca = {
                agenda_data: { 
                    $gte: fncGeral.getDateToIsostring(seg), 
                    $lte: fncGeral.getDateToIsostring(sex) 
                }, 
                agenda_temp: false  
            };

            let arrayIds = [];
            let agendaFinal = [];
            let arrayAgendasNovas = [];

            // 📌 PASSO 4: Buscar pais e detectar filhos (cadeia)
            // 👇 Busca os "pais" e guarda na variável 'agenda'
            let agenda = await AgendaModel.find(busca); 
            
            // Coletar IDs dos pais
            agenda.forEach(a => { arrayIds.push(a._id); });

            // 👇 Busca os "filhos" (se houver pais)
            let agendaSemanal = [];
            if (arrayIds.length > 0) {
                agendaSemanal = await AgendaModel.find({ agenda_tempId: { $in: arrayIds } });
            }

            // Unir filhos na lista final
            agendaSemanal.forEach(as => { agendaFinal.push(as); });
            
            // 👇 Adiciona os pais que NÃO estão na lista de filhos (Aqui estava o erro do AgendaModel.forEach)
            agenda.forEach((a) => { 
                let add = "true";
                agendaSemanal.forEach(as => {
                    if ("" + as.agenda_tempId + "" == "" + a._id + "") {
                        add = "false";  
                    }
                });
                if (add == "true") {
                    agendaFinal.push(a);
                }
            });

            // 📌 PASSO 5: Processar cada registro para marcar como feriado
            for (const a of agendaFinal) {
                const data = new Date(a.agenda_data);
                const totalMinutos = (data.getUTCHours() * 60) + data.getUTCMinutes();


                console.log("req.body.agendaTurnoFalta "+req.body.agendaTurnoFalta)
                console.log("data.getUTCHours()"+data.getUTCHours())
                console.log("data.getUTCMinutes()"+data.getUTCMinutes())
                console.log("totalMinutos"+totalMinutos)
                console.log("totalminutsogv "+(totalMinutos >= 720))
                console.log("mfiroenmgo "+(totalMinutos < 720))
                if (req.body.agendaTurnoFalta == "Manhã" && totalMinutos >= 720) {//12 x 60
                    console.log("FILHO DA PUTA")
                    continue;
                }

                if (req.body.agendaTurnoFalta == "Tarde" && totalMinutos < 720) {//12 x 60
                    console.log("ARROMBADO")
                    continue;
                }

                let agendaS = (a.agenda_tempId && a.agenda_tempId != "undefined") ? "true" : "false";
                
                if (agendaS == "true") {
                    // 👉 Filho: atualizar categoria diretamente
                    if (a.agenda_categoria != "Feriado") {
                        arrayAgendasNovas.push(a);
                        await AgendaModel.findByIdAndUpdate(a._id, {
                            $set: {
                                agenda_categoria: "Feriado",
                                agenda_org: "Administrativo",
                                agenda_usucad: usuarioAtual,
                                agenda_dataedi: dataAtual,
                                agenda_tempmotivo: "Feriado",
                                agenda_extra: false,
                                agenda_turnoFalta: req.body.agendaTurnoFalta
                            }
                        });
                    }
                } else {
                    // 👉 Pai: criar novo registro temporário como feriado
                    let newAgenda = new AgendaModel({
                        agenda_data: a.agenda_data,
                        agenda_hora: null,              
                        agenda_horafim: null,           
                        agenda_beneid: a.agenda_beneid,
                        agenda_convid: a.agenda_convid,
                        agenda_salaid: a.agenda_salaid,
                        agenda_terapiaid: a.agenda_terapiaid,
                        agenda_usuid: a.agenda_usuid,
                        agenda_mergeterapeutaid: a.agenda_mergeterapeutaid,
                        agenda_mergeterapiaid: a.agenda_mergeterapiaid,
                        agenda_migrado: false,
                        agenda_categoria: "Feriado",    
                        agenda_org: "Administrativo",
                        agenda_obs: a.agenda_obs,
                        agenda_temp: true,
                        agenda_tempId: new mongoose.Types.ObjectId(a._id),
                        agenda_tempmotivo: "Feriado",
                        agenda_selo: false,
                        agenda_copia: false,
                        agenda_extra: false,
                        agenda_turnoFalta: req.body.agendaTurnoFalta,
                        agenda_usucad: usuarioAtual,
                        agenda_datacad: dataAtual.toISOString()
                    });
                    
                    arrayAgendasNovas.push(newAgenda);
                    await newAgenda.save();
                }
            }

            console.log(`✅ [FINAL] ${arrayAgendasNovas.length} registros processados como feriado`);
            return "true";

        } catch (err) {
            console.error("❌ [ERRO] agendaFeriado:", err);
            return "false"; // 👈 Retorna false em caso de erro para o try/catch
        }
    },  
    /*
    agendaFaltaDia: async (req, res, busca, buscaSemanal) => {
        let usuarioAtual = req.cookies['idUsu'];
        var retorno;
        let arrayAgendasNovas = [];
        let dataAtual = new Date();
        console.log("req.body.agendaCateg:"+req.body.agendaCateg)
        await AgendaModel.find(busca).then((agenda)=>{
            //console.log("agenda.kength"+agenda.length);
            agenda.forEach(a => {
                AgendaModel.find({agenda_tempId: a._id}).then((agendaSemanal)=>{
                    if (agendaSemanal.length > 0){
                        agendaSemanal.forEach((as)=>{
                            AgendaModel.updateMany(
                                {_id: a._id},{$set: {agenda_categoria : req.body.agendaCateg, agenda_org : "Administrativo" ,agenda_tempmotivo : as.agenda_tempmotivo, agenda_usucad : usuarioAtual, agenda_dataedi : dataAtual}}
                            ).then((res) =>{
                                //console.log("Ok")
                            }).catch((err) =>{
                                console.log("erro mongo:")
                                console.log(err)
                            });
                        })
                    } else {
                        if (a.agenda_mergeterapeutaid == undefined){
                            let newAgenda = new AgendaModel({
                                agenda_data : a.agenda_data ,
                                agenda_beneid : a.agenda_beneid ,
                                agenda_convid : a.agenda_convid ,
                                agenda_salaid : a.agenda_salaid ,
                                agenda_terapiaid : a.agenda_terapiaid ,
                                agenda_usuid : a.agenda_usuid ,
                                agenda_mergeterapeutaid : a.agenda_mergeterapeutaid ,
                                agenda_mergeterapiaid : a.agenda_mergeterapiaid ,
                                agenda_migrado : false ,
                                agenda_categoria : req.body.agendaCateg ,
                                agenda_org : "Administrativo" ,
                                agenda_obs : a.agenda_obs ,
                                agenda_temp : true ,
                                agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                agenda_tempmotivo : a.agenda_tempmotivo ,
                                agenda_selo : false ,
                                agenda_copia : false,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                        } else {
                            let newAgenda = new AgendaModel({
                                agenda_data : a.agenda_data ,
                                agenda_beneid : a.agenda_beneid ,
                                agenda_convid : a.agenda_convid ,
                                agenda_salaid : a.agenda_salaid ,
                                agenda_terapiaid : a.agenda_terapiaid ,
                                agenda_usuid : a.agenda_usuid ,
                                agenda_migrado : false ,
                                agenda_categoria : req.body.agendaCateg ,
                                agenda_org : "Administrativo" ,
                                agenda_obs : a.agenda_obs ,
                                agenda_temp : true ,
                                agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                agenda_tempmotivo : a.agenda_tempmotivo ,
                                agenda_selo : false ,
                                agenda_copia : false,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                        }
                        AgendaModel.insertMany(arrayAgendasNovas).then((res) =>{
                            //console.log("XABLAU");
                            retorno = "true";
                        }).catch((err) =>{
                            retorno = err
                            console.log("erro mongo:");
                            console.log(err);
                        });
                    }
                });
            });
        })
    */

    // Atualizar Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    agendaUpdateCampos: async (req,res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        let usuarioAtual = req.cookies['idUsu'];
        let resultado;
        let busca;
        let troca;
        let ini;
        let fim;
        //-dataini
        let dt = new Date(req.body.agendaDataIni);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }

        let data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        let ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        let formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(0);
        formatData.setMinutes(0);
        formatData.setSeconds(0);
        ini = formatData;
        //-dataini
        //-datafim
        dt = new Date(req.body.agendaDataFim);
        
        mes = (dt.getUTCMonth()+1).toString();
        dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(23);
        formatData.setMinutes(59);
        formatData.setSeconds(59);
        fim = formatData;
        //-datafim
        //console.log("ini: "+ini.toISOString());
        //console.log("fim: "+fim.toISOString());
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = req.body.agendaTerapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let tpiaidx = req.body.agendaTeraFindid;//new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = req.body.agendaConvid;//new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        let novoteraidx = req.body.agendaTerapeutaSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novatpiaidx = req.body.agendaTpiaSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novoconvidx = req.body.agendaConvSubsid;//new ObjectId("62477742e416141415ff7a88");//particular
        let novomergeteraidx = req.body.agendaTerapeutaMergeSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novamergetpiaidx = req.body.agendaTerapiaMergeSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let categoriaidx = req.body.agendaCategoria;
        //let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil
        //console.log("beneidx:"+beneidx)
        if (beneidx != "-") {

            if (categoriaidx != "-") {
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx, agenda_terapiaid: tpiaidx, agenda_beneid: beneidx };
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx, agenda_terapiaid: tpiaidx, agenda_beneid: beneidx };
                //console.log("0")
            } else if (teraidx != "-" && tpiaidx != "-" && convidx == "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_terapiaid: tpiaidx, agenda_usuid: teraidx , agenda_beneid: beneidx };
                //console.log("1")
            } else if (teraidx == "-" && tpiaidx != "-" && convidx == "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_terapiaid: tpiaidx, agenda_beneid: beneidx };
                console.log("2")
            } else if (teraidx != "-" && tpiaidx == "-" && convidx == "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx };
                //console.log("3")
            } else if (teraidx == "-" && tpiaidx == "-" && convidx == "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx };
                //console.log("4")
            } else if (teraidx != "-" && tpiaidx != "-" && convidx != "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_terapiaid: tpiaidx, agenda_usuid: teraidx , agenda_beneid: beneidx, agenda_convid: convidx };
                //console.log("1-"+tpiaidx+"-"+teraidx)
            } else if (teraidx == "-" && tpiaidx != "-" && convidx != "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_terapiaid: tpiaidx, agenda_beneid: beneidx, agenda_convid: convidx };
                //console.log("2")
            } else if (teraidx != "-" && tpiaidx == "-" && convidx != "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx, agenda_convid: convidx };
                //console.log("3")
            } else if (teraidx == "-" && tpiaidx == "-" && convidx != "-"){
                busca = { agenda_data: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx, agenda_convid: convidx };
                //console.log("4")
            }

            if (categoriaidx != "-") {
                if (categoriaidx == "Padrão") {
                    troca = {'agenda_categoria': categoriaidx, 'agenda_org': 'Padrão', 'agenda_usucad': usuarioAtual};
                } else {
                    troca = {'agenda_categoria': categoriaidx, 'agenda_org': 'Administrativo', 'agenda_usucad': usuarioAtual};
                }
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-") {//subs fixo
                troca = {'agenda_mergeterapeutaid': novomergeteraidx, 'agenda_mergeterapiaid': novamergetpiaidx, 'agenda_categoria': 'SubstitutoFixo', 'agenda_org': 'Administrativo', 'agenda_usucad': usuarioAtual};
                console.log("0 TROCA SUBFIX")
            } else if (novoteraidx == "-" && novatpiaidx == "-" && novoconvidx != "-") {//convenio
                troca = {'agenda_convid': novoconvidx, agenda_usucad: usuarioAtual};
                //console.log("1")
            } else if (novoteraidx != "-" && novatpiaidx == "-" && novoconvidx == "-") {//terapeuta
                troca = {'agenda_usuid': novoteraidx, agenda_usucad: usuarioAtual};
                //console.log("2")
            } else if (novoteraidx == "-" && novatpiaidx != "-" && novoconvidx == "-") {//terapia
                troca = {'agenda_terapiaid': novatpiaidx, agenda_usucad: usuarioAtual};
                //console.log("3")
            } else if (novoteraidx != "-" && novatpiaidx != "-" && novoconvidx == "-") {//terapeuta e terapia
                troca = {'agenda_usuid': novoteraidx, 'agenda_terapiaid': novatpiaidx, agenda_usucad: usuarioAtual};
                //console.log("4")
            } else if (novoteraidx != "-" && novatpiaidx == "-" && novoconvidx != "-") {//terapeuta e convenio
                troca = {'agenda_usuid': novoteraidx, 'agenda_convid': novoconvidx, agenda_usucad: usuarioAtual};
                //console.log("5")
            } else if (novoteraidx == "-" && novatpiaidx != "-" && novoconvidx != "-") {//terapia e convenio
                troca = {'agenda_terapiaid': novatpiaidx, 'agenda_convid': novoconvidx, agenda_usucad: usuarioAtual};
                //console.log("6")
            } else if (novoteraidx != "-" && novatpiaidx != "-" && novoconvidx != "-") {//todos
                troca = {'agenda_usuid': novoteraidx, 'agenda_terapiaid': novatpiaidx, 'agenda_convid': novoconvidx, agenda_usucad: usuarioAtual};
                //console.log("7")
            }

            await AgendaModel.find(busca).then((ag)=>{console.log("ag.lenhgt"+ag.length)})
            await AgendaModel.updateMany(
                busca,{$set: troca}
            ).then((res) =>{
                //console.log("XABLAU")
                resultado = "OK"
            }).catch((err) =>{
                resultado = err
                console.log("erro mongo:")
                console.log(err)
            });
        } else {
            resultado = "Campos de busca vazios;"
        }

        return resultado;
    },

    // Remove Eolução Agenda
    // Criado por: Wagner Cintra
    // Criado em: 2022/03/20
    // Editado em: 2025/10/03
    removeEvolucao : async (req, res) => {

        //Estrura Multiempresa
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', AgendaSchema)
        //;

        let resultado;
        //Pega data atual
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(req.params.id, 
            {$set: {
                agenda_evolucao : "",
                agenda_atrazo : false,
                agenda_selo : false,
                agenda_dataSelo : ""
        }}).then((res) =>{
            //console.log("Salvo")
            resultado = "true";
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = undefined;
            //res.redirect('admin/branco')
        })
        return resultado;
    }
    /*    
    ,agendaAddNovosCampos: async (req,res) => {
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        let resultado;
        await AgendaModel.updateMany(
            {agenda_extra: undefined},
            {$set: {'agenda_extra': false}}
        ).then((res) =>{
            //console.log("XABLAU")
            resultado = "OK"
        }).catch((err) =>{
            resultado = err
            console.log("erro mongo:")
            console.log(err)
        });
        return resultado;
    }
    */
   /*
    ,agendaFaltaDia: async (req,res) => {
        let db = req.cookies['preferredDb'];
        AgendaModel = getModel(db, 'tb_agenda', agendaClass.AgendaSchema)

        let resultado;
        let diaini = new Date(req.body.dataFinal);
        let diafim = new Date(req.body.dataFinal);
        diaini.setUTCDate(1);
        diafim.setUTCDate(1);
        diaini.setUTCMonth(6);//0-11
        diafim.setUTCMonth(7);//0-11
        //console.log("diaini: "+diaini.toISOString());
        //console.log("diafim: "+diafim.toISOString());
        
        switch (tipoPessoa){
            case "Geral":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } }
                break;
            case "Beneficiario":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } , agenda_beneid: req.body.atendBeneficiario };
                break;
            case "Terapeuta":
                busca = { agenda_data: { $gte : diaini.toISOString(), $lte:  diafim.toISOString() } , agenda_usuid: req.body.atendTerapeuta };
                //console.log("req.body.atendTerapeuta:"+req.body.atendTerapeuta);
                break;
            default:
                break;
        }
        let beneidx = new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let tpiaidx = new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        //let novateraidx = new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil

        await AgendaModel.updateMany(
            busca,
            {$set: {'agenda_convid': novaconvidx}}
        ).then((res) =>{
            //console.log("XABLAU")
            resultado = "OK"
        }).catch((err) =>{
            resultado = err
            console.log("erro mongo:")
            console.log(err)
        });
        return resultado;
    }
    */
};