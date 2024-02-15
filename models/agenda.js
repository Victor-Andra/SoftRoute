const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId

const AgendaSchema = mongoose.Schema({
    agenda_data :{ type: Date, required: false },
    agenda_hora :{ type: String, required: false },
    agenda_data_semana :{ type: String, required: false },
    agenda_data_dia :{ type: String, required: false },
    agenda_beneid :{ type: ObjectId, required: false },
    agenda_convid :{ type: ObjectId, required: false },
    agenda_salaid :{ type: ObjectId, required: false },
    agenda_terapiaid :{ type: ObjectId, required: false },
    agenda_usuid :{ type: ObjectId, required: false }, //Id do terapeuta
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
    agenda_evolucao :{ type: String, require: false },
    agenda_copia :{ type: Boolean, require: false }, //Status de copia, para cria gerenciamento anti-copia duplicada
    agenda_selo :{ type: Boolean, require: false },
    agenda_dataSelo :{ type: String, require: false },
    agenda_atrazo :{ type: Boolean, require: false },
    agenda_rel :{ type: String, require: false }, //{'-':'todos', 'Beneficiario':'apenas_beneficiario', 'Terapeuta':'apenas_Terapeuta', 'Nenhum':'nenhum'}
    agenda_turnoFalta :{ type: String, require: false },
    agenda_faltaId :{ type: ObjectId, require: false },
    agenda_usuedi :{ type: String, require: false }, //Usuário adm que alterou
    agenda_log :{ type: String, require: false }, //Log das alterações
    agenda_usucad :{ type: String, require: false }
    
})

class Agenda{
    constructor(
        agenda_data,
        agenda_hora,
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
        agenda_usuedi, //Usuário adm que alterou
        agenda_log, //Log das alterações
        agenda_usucad,
        ){
        this.agenda_data = agenda_data,
        this.agenda_hora = agenda_hora,
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
        this.agenda_usuedi = agenda_usuedi, //Usuário adm que alterou
        this.agenda_log = agenda_log, //Log das alterações
        this.agenda_usucad = agenda_usucad
    }
}

AgendaSchema.loadClass(Agenda)
const AgendaModel = mongoose.model('tb_agenda', AgendaSchema)
module.exports = {AgendaModel,AgendaSchema,
    agendaEditar: async (req, res) => {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        console.log(dataAgenda);
        let resultado;
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                agenda_data : dataAgenda ,
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
                agenda_usuedi: req.body.agendaUsuedi , //Usuário adm que alterou
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
        return resultado;
    },
    agendaAdicionar: async (req,res) => {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let agenda_temp = false;
        let extra = false;
        //console.log("req.body.agendaData:"+req.body.agendaData)
        //console.log("req.body.agendaExtra:"+req.body.agendaExtra);
        if (req.body.agendaExtra == true || req.body.agendaExtra == "true"){
            extra = true;
        }

        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        //console.log(dataAgenda);
        //console.log("data:"+data);
        //console.log("dataAgenda:"+dataAgenda);
        //console.log("agendamodel");
        const newAgenda = new AgendaModel({
            agenda_data : dataAgenda ,
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
    },
    agendaAdicionarTemp: async (req,res) => {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let agendaTempId = new mongoose.mongo.ObjectId(req.body.agendaIdTemp);
        //console.log("agendaTempId:"+agendaTempId)
        //console.log("req.body.agendaData:"+req.body.agendaData)
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        //console.log(dataAgenda);
        //console.log("data:"+data);
        //console.log("dataAgenda:"+dataAgenda);
        //console.log("agendamodel");
        const newAgenda = new AgendaModel({
            agenda_data : dataAgenda ,
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
    },
    agendaEditarTemp: async (req, res) => {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        console.log(dataAgenda);
        let resultado;
        //Pega data atual
        
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(req.body.agendaId, 
            {$set: {
                agenda_data : dataAgenda ,
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
                agenda_temp : true ,
                agenda_tempmotivo : req.body.agendaTempMotivo ,
                agenda_copia : req.body.agendaCopia ,
                agenda_usucad : usuarioAtual,
                agenda_usuedi: req.body.agendaUsuedi ,
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
        return resultado;
    },
    agendaFindOne: async (id, res) => {
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
    evolucao: async (req, res) => {
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
    }
    , agendaFaltaDia: async (req, res) => {
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
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = req.body.agendaMergeterapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        //console.log("ini: "+fncGeral.getDateToIsostring(dataIni));
        //console.log("fim: "+fncGeral.getDateToIsostring(dataFim));
        let horasTurnoManha = ["08:00","08:40","09:20","10:00","10:40","11:20"];
        let horasTurnoTarde = ["13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
        let horasTurnoCompleto = ["08:00","08:40","09:20","10:00","10:40","11:20","13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
        //Calculetodos
        let turno = [];
        
        if (req.body.agendaTurnoFalta == "Manhã"){
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoManha);
        } else if (req.body.agendaTurnoFalta == "Tarde"){
            console.log("TARDE")
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoTarde);
        } else {
            turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoCompleto);
        }
        
        if (beneidx == "-" && req.body.agendaMergeterapeutaid == "-") {
            resultado = "false";
        } else if (beneidx != "-" && teraidx == "-") {
            busca = { agenda_data: {$in: turno}, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx };
        } else if (beneidx == "-" && teraidx != "-") {
            console.log("falta terapeuta")
            busca = { agenda_data: {$in: turno}, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx };
        } else {
            console.log("falta de um bene para um terapeuta")
            busca = { agenda_data: {$in: turno}, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx };
        }

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
                        arrayAgendasNovas.push(a);
                        AgendaModel.findByIdAndUpdate(a._id, 
                            {$set: {
                                agenda_categoria : req.body.agendaCateg ,
                                agenda_org : "Administrativo" ,
                                agenda_usucad : usuarioAtual ,
                                agenda_dataedi : dataAtual ,
                                agenda_faltaId : req.body.agendaFaltaId ,
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
                    } else {
                        if (a.agenda_mergeterapeutaid != undefined){
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
                                agenda_faltaId : req.body.agendaFaltaId,
                                agenda_turnoFalta : req.body.agendaTurnoFalta,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                            newAgenda.save()
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
                                agenda_faltaId : req.body.agendaFaltaId,
                                agenda_turnoFalta : req.body.agendaTurnoFalta,
                                agenda_usucad : usuarioAtual,
                                agenda_datacad : dataAtual
                            });
                            arrayAgendasNovas.push(newAgenda)
                            newAgenda.save()
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
    agendaUpdateCampos: async (req,res) => {
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
    removeEvolucao : async (id, res) => {
        let resultado;
        //Pega data atual
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(id, 
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
    ,kaskopstusagenda: async (id) => {
        //console.log("id:"+id)
        //Realiza Atualização - Atualização não faz alteração temporaria
        await AgendaModel.findByIdAndUpdate(id, 
            {$set: {
                agenda_extra : false
                }}
        ).then(() =>{
            //console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    }
    */
    /*    
    ,agendaAddNovosCampos: async (req,res) => {
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