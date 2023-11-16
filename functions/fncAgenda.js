//Exports
const mongoose = require("mongoose")

//Agenda
const Agenda = mongoose.model("tb_agenda")
const agendaClass = require("../models/agenda")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const creClass = require("../models/credit")
const debClass = require("../models/debit")
const convcreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia") 
const horaageClass = require("../models/horaAge")
const salaClass = require("../models/sala")
const estadoClass = require("../models/estado")
const atendClass = require("../models/atend")
const especialidadeClass = require("../models/especialidade")
const especializacaoClass = require("../models/especializacao")
const extraClass = require("../models/extra")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Cre = mongoose.model("tb_credit")
const Deb = mongoose.model("tb_debit")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Tabil = mongoose.model("tb_tabil")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Horaage = mongoose.model("tb_horaage")
const Sala = mongoose.model("tb_sala")
const Estado = mongoose.model("tb_estado")
const Atend = mongoose.model("tb_atend")
const Especialidade = mongoose.model("tb_especialidade")
const Especializacao = mongoose.model("tb_especializacao")
const Extra = mongoose.model("tb_extra")

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const atendFnc = require("../functions/fncAtend")
const fncGeral = require("./fncGeral")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    getData(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dia+'/'+mes+'/'+dt.getFullYear()).toString();
    },
    getDataDiaMes(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        let semana;

        switch (dt.getUTCDay()){
            case 1:
                semana = "Segunda";
                break;
            case 2:
                semana = "Terça";
                break;
            case 3:
                semana = "Quarta";
                break;
            case 4:
                semana = "Quinta";
                break;
            case 5:
                semana = "Sexta";
                break;
            default:
                semana = "Dom";
                break;
        }
        
        return (semana+" - "+dia+'/'+mes).toString();
    },
    getDataFMT(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
    },
    formataData(data){
        let dia = data.toString().substring(0,2);
        let mes = data.toString().substring(3,5);
        let prs = parseInt(mes,10);
        prs=prs-1;
        //console.log("prs:"+prs)
        let mesformat
        if(prs<=9){
            mesformat = "0"+prs+""
        } else {
            mesformat = ""+prs+""
        }
        let ano = data.toString().substring(6,10);
        let dt = new Date(ano,mesformat,dia,0,0,0,0)
        dt.setHours(0);
        dt.setMinutes(0);
        dt.setSeconds(0);
        return dt;
    },
    getDiaSemana(dt){
        let dat = new Date(dt);
        switch (dat.getUTCDay()){
            case 0:
                return "dom"
            case 1:
                return "seg"
            case 2:
                return "ter"
            case 3:
                return "qua"
            case 4:
                return "qui"
            case 5:
                return "sex"
            case 6:
                return "sab"
            default:
                return "dom"
        }
    },
    carregaAgendaGAntiga(req,res){//AbreAgendaFiltro
        let dtFill;
        let seg = new Date();
        let sex = new Date();
        //seg.setUTCDate(seg.getUTCDate() - 15);
        //sex.setUTCDate(sex.getUTCDate() - 15);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        //console.log("seg::")
        //console.log(seg)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        e.agenda_data_semana = "dom"
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaG(req,res){//AbreAgendaGeralAntiga
        let aux = 1;
        let is = false;
        let dtFill;
        let seg = new Date();
        let sex = new Date();
        //seg.setUTCDate(seg.getUTCDate() - 22);
        //sex.setUTCDate(sex.getUTCDate() - 22);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                e.agenda_aux = aux;
                aux++;
                
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){//Verifica se tem ao menos 1 registro no dia
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let tela = "agenda/agendaGeral"
                                    res.render(tela, {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilG(req,res){//FiltraAgendaGeral
        let aux = 1;
        let is = false;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                //console.log("aux:"+aux)
                e.agenda_aux = aux;
                aux++;
                
                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            agenda.sort(function(a, b) {
                let h1 = a.agenda_hora.substring(0,2);
                let m1 = a.agenda_hora.substring(3,5);
                let h2 = b.agenda_hora.substring(0,2);
                let m2 = b.agenda_hora.substring(3,5);
                if(h1 == h2){
                    if(m1 < m2) {
                        return -1;
                    } else {
                        return true;
                    }
                } else {
                    if(h1 < h2) {
                        return -1;
                    } else {
                        return true;
                    }
                }
            });
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaT(req,res){
        let aux = 1;
        let dtFill;
        let is = false;
        let usunomefnc;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeFisio;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu)=>{//Apenas 1
            //console.log("usu.usuario_obs:"+usu.usuario_obs)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
                nomeUsu = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
                nomeUsu = usu.usuario_nomecompleto;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: usu._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            //console.log("benenomeconv:"+usunomefnc)
                                            res.render("agenda/agendaTerapeuta", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilT(req,res){//FiltraAgendaFiltro
        let aux = 1;
        let is = false;
        let usunomefnc;
        let usuObs;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({_id:req.body.agendaTeraid, usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu) =>{
            //console.log("usu:"+usu)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: req.body.agendaTeraid, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem Realizada de Terapia")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            //console.log("Listagem Realizada de Horario")
                            let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                            var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                            
                            let z = "seg"

                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            //console.log("Tem "+z+"?"+haddia)
                            if(haddia){
                                horaage.forEach((h)=>{
                                    is = true
                                    
                                    agenda.forEach((e)=>{
                                        if(e.agenda_data_semana == z){
                                            if (h.horaage_hora == e.agenda_hora){
                                                is = false
                                            }
                                        }
                                    });
                                    // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                    
                                    if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    }
                                })
                            } else {
                                horaage.forEach((h)=>{
                                    let daty;
                                    semana.forEach((y)=>{
                                        if(y.dia == z){
                                            daty = y.data
                                        }
                                    });

                                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                    
                                    agendaVoid = new Agenda({
                                        agenda_hora : h.horaage_hora,
                                        agenda_data_semana : z,
                                        agenda_data_dia : dty,
                                        agenda_aux : aux,
                                        agenda_salaid : voidId,
                                        agenda_beneid : voidId,
                                        agenda_convid : voidId,
                                        agenda_terapiaid : voidId,
                                        agenda_usuid : voidId,
                                        agenda_mergeterapeutaid : voidId,
                                        agenda_mergeterapiaid : voidId 
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "ter"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            //console.log("Tem "+z+"?"+haddia)
                            if(haddia){
                                horaage.forEach((h)=>{
                                    is = true
                                    
                                    agenda.forEach((e)=>{
                                        if(e.agenda_data_semana == z){
                                            if (h.horaage_hora == e.agenda_hora){
                                                is = false
                                            }
                                        }
                                    });
                                    // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                    
                                    if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    }
                                })
                            } else {
                                horaage.forEach((h)=>{
                                    let daty;
                                    semana.forEach((y)=>{
                                        if(y.dia == z){
                                            daty = y.data
                                        }
                                    });

                                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                    
                                    agendaVoid = new Agenda({
                                        agenda_hora : h.horaage_hora,
                                        agenda_data_semana : z,
                                        agenda_data_dia : dty,
                                        agenda_aux : aux,
                                        agenda_salaid : voidId,
                                        agenda_beneid : voidId,
                                        agenda_convid : voidId,
                                        agenda_terapiaid : voidId,
                                        agenda_usuid : voidId,
                                        agenda_mergeterapeutaid : voidId,
                                        agenda_mergeterapiaid : voidId 
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "qua"
                                                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            //console.log("Tem "+z+"?"+haddia)
                            if(haddia){
                                horaage.forEach((h)=>{
                                    is = true
                                    
                                    agenda.forEach((e)=>{
                                        if(e.agenda_data_semana == z){
                                            if (h.horaage_hora == e.agenda_hora){
                                                is = false
                                            }
                                        }
                                    });
                                    // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                    
                                    if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    }
                                })
                            } else {
                                horaage.forEach((h)=>{
                                    let daty;
                                    semana.forEach((y)=>{
                                        if(y.dia == z){
                                            daty = y.data
                                        }
                                    });

                                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                    
                                    agendaVoid = new Agenda({
                                        agenda_hora : h.horaage_hora,
                                        agenda_data_semana : z,
                                        agenda_data_dia : dty,
                                        agenda_aux : aux,
                                        agenda_salaid : voidId,
                                        agenda_beneid : voidId,
                                        agenda_convid : voidId,
                                        agenda_terapiaid : voidId,
                                        agenda_usuid : voidId,
                                        agenda_mergeterapeutaid : voidId,
                                        agenda_mergeterapiaid : voidId 
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "qui"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            //console.log("Tem "+z+"?"+haddia)
                            if(haddia){
                                horaage.forEach((h)=>{
                                    is = true
                                    
                                    agenda.forEach((e)=>{
                                        if(e.agenda_data_semana == z){
                                            if (h.horaage_hora == e.agenda_hora){
                                                is = false
                                            }
                                        }
                                    });
                                    // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                    
                                    if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    }
                                })
                            } else {
                                horaage.forEach((h)=>{
                                    let daty;
                                    semana.forEach((y)=>{
                                        if(y.dia == z){
                                            daty = y.data
                                        }
                                    });

                                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                    
                                    agendaVoid = new Agenda({
                                        agenda_hora : h.horaage_hora,
                                        agenda_data_semana : z,
                                        agenda_data_dia : dty,
                                        agenda_aux : aux,
                                        agenda_salaid : voidId,
                                        agenda_beneid : voidId,
                                        agenda_convid : voidId,
                                        agenda_terapiaid : voidId,
                                        agenda_usuid : voidId,
                                        agenda_mergeterapeutaid : voidId,
                                        agenda_mergeterapiaid : voidId 
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "sex"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            //console.log("Tem "+z+"?"+haddia)
                            if(haddia){
                                horaage.forEach((h)=>{
                                    is = true
                                    
                                    agenda.forEach((e)=>{
                                        if(e.agenda_data_semana == z){
                                            if (h.horaage_hora == e.agenda_hora){
                                                is = false
                                            }
                                        }
                                    });
                                    // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                    
                                    if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    }
                                })
                            } else {
                                horaage.forEach((h)=>{
                                    let daty;
                                    semana.forEach((y)=>{
                                        if(y.dia == z){
                                            daty = y.data
                                        }
                                    });

                                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                    
                                    agendaVoid = new Agenda({
                                        agenda_hora : h.horaage_hora,
                                        agenda_data_semana : z,
                                        agenda_data_dia : dty,
                                        agenda_aux : aux,
                                        agenda_salaid : voidId,
                                        agenda_beneid : voidId,
                                        agenda_convid : voidId,
                                        agenda_terapiaid : voidId,
                                        agenda_usuid : voidId,
                                        agenda_mergeterapeutaid : voidId,
                                        agenda_mergeterapiaid : voidId 
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                            agenda.sort(function(a, b) {
                                let h1 = a.agenda_hora.substring(0,2);
                                let m1 = a.agenda_hora.substring(3,5);
                                let h2 = b.agenda_hora.substring(0,2);
                                let m2 = b.agenda_hora.substring(3,5);
                                if(h1 == h2){
                                    if(m1 < m2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    if(h1 < h2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });
                            Sala.find().then((sala)=>{
                                sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                //console.log("Listagem Realizada de Terapia")
                                Especialidade.find().then((especialidade)=>{
                                    
                                    especialidade.forEach((e)=>{//graduação
                                        //console.log("Listagem Realizada de Especialidade")
                                        //console.log("TESTE:"+e._id+"/"+idFnc)
                                        if(e._id == idFnc){
                                            nomeFnc = e.especialidade_nome;
                                        }
                                    })
                                    Especializacao.find().then((especializacao)=>{//Terapia
                                        //console.log("Listagem Realizada de Especializacao")
                                        especializacao.forEach((ez)=>{//especializacao
                                            //console.log("TESTE:"+ez._id+"/"+idEsp)
                                            if(ez._id == idEsp){
                                                nomeEsp = ez.especializacao_nome;
                                            }
                                        })
                                        if(!(typeof nomeFnc === "undefined")){
                                            usunomefnc += " / " + nomeFnc
                                        }
                                        if(!(typeof nomeEsp === "undefined")){
                                            usunomefnc += " ("+nomeEsp+")"
                                        }
                                        //console.log("usunomefnc:"+usunomefnc)
                                        res.render("agenda/agendaTerapeuta", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu, usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaB(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find({bene_status:"Ativo"}).then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiario", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilB(req,res){
        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("req.body.dataFinal:"+req.body.dataFinal);
        //console.log("sex1:"+sex);
        //console.log("seg1:"+seg);
        //console.log("sex1:"+sex);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        let busca;
        console.log("req.body.soFixo:"+req.body.soFixo)
        if (req.body.soFixo == "true"){
            busca = { "agenda_data": { $gte : agora, $lte:  depois }, "agenda_beneid": req.body.agendaBeneid, "agenda_temp": false, "agenda_categoria": "SubstitutoFixo" };
        } else {
            busca = { "agenda_data": { $gte : agora, $lte:  depois }, "agenda_beneid": req.body.agendaBeneid, "agenda_temp": false };
        }
        Bene.find({_id:req.body.agendaBeneid}).then((b) =>{
            b.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Agenda.find(busca).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find({bene_status:"Ativo"}).then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Bene.find({_id: req.body.agendaBeneid}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];

                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    benenomeconv = nomeBene+" / "+nomeConv;
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiario", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaResp(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaResp", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilResp(req,res){
        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.find({_id:req.body.agendaBeneid}).then((b) =>{
            b.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Bene.find({_id: req.body.agendaBeneid}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true;
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaResp", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaS(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaSB(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiarioSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSB(req,res){
        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let agendaTempArr = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.findOne({_id:req.body.agendaBeneid}).then((bene) =>{
            nomeBene = bene.bene_nome
            beneConvid = bene.bene_convid
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid }).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                console.log("agenda.length:"+agenda.length)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
                    let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                    let min = ""+dat.getMinutes();
                    if (hora.length == 1){hora = "0" + hora + "";}
                    if (min.length == 1){min = "0" + min + "";}
                    e.agenda_hora = hora+":"+min;
                    e.agenda_aux = aux;
                    aux++;

                    switch (dat.getUTCDay()){
                        case 0:
                            e.agenda_data_semana = "dom"
                            break;
                        case 1:
                            e.agenda_data_semana = "seg"
                            break;
                        case 2:
                            e.agenda_data_semana = "ter"
                            break;
                        case 3:
                            e.agenda_data_semana = "qua"
                            break;
                        case 4:
                            e.agenda_data_semana = "qui"
                            break;
                        case 5:
                            e.agenda_data_semana = "sex"
                            break;
                        case 6:
                            e.agenda_data_semana = "sab"
                            break;
                        default:
                            
                            console.log("erro");
                            break;
                    }
                })

                agenda.forEach((as)=>{
                    if ((""+as.agenda_temp+"") == "true"){
                        agendaTempArr.push(as.agenda_tempId);
                    }
                })
                
                agenda.forEach((a)=>{
                    manter = "true";
                    agendaTempArr.forEach((atr)=>{
                        if ((""+atr+"") == (""+a._id+"")){
                            manter = "false";
                        }
                    })
                    if (manter == "true"){
                        idsAgendasEx.push(a);
                    }
                })

                Bene.find().then((benef)=>{
                    benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    Conv.find({_id: beneConvid}).then((conv)=>{
                                        conv.forEach(e => {
                                            nomeConv = e.conv_nome
                                        });
                                        benenomeconv = nomeBene+" / "+nomeConv;
                                        res.render("agenda/agendaBeneficiarioSemanal", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaST(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((t) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: t._id}).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Sala.find().then((sala)=>{
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    //console.log("Listagem Realizada de Horario")
                                    let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                    let segASex = ["seg","ter","qua","qui","sex"];
                                    
                                    segASex.forEach((diaDaSemana)=>{
                                        haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                        //console.log("Tem "+z+"?"+haddia)
                                        this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                    })

                                    agenda.sort(function(a, b) {
                                        let h1 = a.agenda_hora.substring(0,2);
                                        let m1 = a.agenda_hora.substring(3,5);
                                        let h2 = b.agenda_hora.substring(0,2);
                                        let m2 = b.agenda_hora.substring(3,5);
                                        if(h1 == h2){
                                            if(m1 < m2) {
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        } else {
                                            if(h1 < h2) {
                                                return -1;
                                            } else {
                                                return true;
                                            }
                                        }
                                    });
                                    res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilST(req,res){
        let aux = 1;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let nomeUsu;
        let nomeFnc;
        let nomeEsp;
        let idEsp;
        let usunomefnc;
        let agendaTempArr = [];
        let idsAgendasEx = [];
        let manter;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        //Pensar em como carregar quando for merge
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: req.body.agendaTerapeutaid }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })

            agenda.forEach((as)=>{
                if ((""+as.agenda_temp+"") == "true"){
                    agendaTempArr.push(as.agenda_tempId);
                }
            })
            
            agenda.forEach((a)=>{
                manter = "true";
                agendaTempArr.forEach((atr)=>{
                    if ((""+atr+"") == (""+a._id+"")){
                        manter = "false";
                    }
                })
                if (manter == "true"){
                    idsAgendasEx.push(a);
                }
            })

            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem Realizada de Terapia")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            //console.log("Listagem Realizada de Horario")
                            let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                            let segASex = ["seg","ter","qua","qui","sex"];
                            
                            segASex.forEach((diaDaSemana)=>{
                                haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                //console.log("Tem "+z+"?"+haddia)
                                this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                            })

                            agenda.sort(function(a, b) {
                                let h1 = a.agenda_hora.substring(0,2);
                                let m1 = a.agenda_hora.substring(3,5);
                                let h2 = b.agenda_hora.substring(0,2);
                                let m2 = b.agenda_hora.substring(3,5);
                                if(h1 == h2){
                                    if(m1 < m2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                } else {
                                    if(h1 < h2) {
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });
                            Sala.find().then((sala)=>{
                                Usuario.findOne({_id:req.body.agendaTerapeutaid}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                    console.log("usuario:"+usuario.usuario_nome);
                                    nomeUsu = ""+usuario.usuario_nome;
                                    console.log("nomeUsu:"+nomeUsu);
                                    //console.log("usuario:"+usuario)
                                    
                                    if(typeof usuario.usuario_nome === undefined){
                                        usunomefnc = usuario.usuario_nomecompleto;
                                    } else {
                                        usunomefnc = usuario.usuario_nome;
                                    }
                                    if(!(typeof usuario.usuario_graduacao === undefined)){
                                        idFnc = usuario.usuario_graduacao;
                                    }
                                    if(!(typeof usuario.usuario_especializacao === undefined)){
                                        idEsp = usuario.usuario_especializacao;
                                    }
                                    if(!(typeof usuario.usuario_obs === undefined)){
                                        usuObs = usuario.usuario_obs;
                                    } else {
                                        usuObs = " - "
                                    }
                                    Especialidade.find().then((especialidade)=>{
                                
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: idsAgendasEx, benes: benef, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, usunomefnc})
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaTB(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        seg.setFullYear(2020);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        sex.setFullYear(2020);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }}).then((agenda) =>{
            //console.log(agenda)
            Bene.find().then((bene)=>{
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    //console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilTB(req,res){
        let aux = 1;
        let is = false;
        let nomeBene;
        let nomeSup;
        let nomeConv;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let beneConvid;
        let benenomeconv;
        let idsAgendasEx = [];
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("req.body.dataFinal:"+req.body.dataFinal);
        //console.log("sex1:"+sex);
        //console.log("seg1:"+seg);
        //console.log("sex1:"+sex);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                //console.log("seg:"+seg);
                //console.log("sex:"+sex);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        //console.log("AGORA:"+agora);
        //console.log("depois:"+depois);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Bene.find({_id:req.body.agendaBeneid}).then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
            Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid}).then((agenda) =>{
                //console.log("Listagem Realizada de agendamentos!")
                //console.log(agenda)
                agenda.forEach((e)=>{
                    let dat = new Date(e.agenda_data);
                    e.agenda_data_dia = this.getDataFMT(dat);
                    let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                    let min = ""+dat.getMinutes();
                    if (hora.length == 1){hora = "0" + hora + "";}
                    if (min.length == 1){min = "0" + min + "";}
                    e.agenda_hora = hora+":"+min;
                    e.agenda_aux = aux;
                    aux++;

                    switch (dat.getUTCDay()){
                        case 0:
                            e.agenda_data_semana = "dom"
                            break;
                        case 1:
                            e.agenda_data_semana = "seg"
                            break;
                        case 2:
                            e.agenda_data_semana = "ter"
                            break;
                        case 3:
                            e.agenda_data_semana = "qua"
                            break;
                        case 4:
                            e.agenda_data_semana = "qui"
                            break;
                        case 5:
                            e.agenda_data_semana = "sex"
                            break;
                        case 6:
                            e.agenda_data_semana = "sab"
                            break;
                        default:
                            
                            console.log("erro");
                            break;
                    }
                    idsAgendasEx.push(mongoose.Types.ObjectId(e._id));
                })
                //console.log(agenda)
                Agenda.find({'_id': { $in: idsAgendasEx}}).then((agendaS)=>{
                    Bene.find().then((benef)=>{
                        benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Beneficiários!")
                        Conv.find({_id: beneConvid}).then((conv)=>{
                            conv.forEach(e => {
                                nomeConv = e.conv_nome
                            });
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                                    //console.log("Listagem Realizada de Terapia")
                                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                        //console.log("Listagem Realizada de Horario")
                                        let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                        let segASex = ["seg","ter","qua","qui","sex"];
                                        
                                        segASex.forEach((diaDaSemana)=>{
                                            haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                            //console.log("Tem "+z+"?"+haddia)
                                            this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                        })

                                        agenda.sort(function(a, b) {
                                            let h1 = a.agenda_hora.substring(0,2);
                                            let m1 = a.agenda_hora.substring(3,5);
                                            let h2 = b.agenda_hora.substring(0,2);
                                            let m2 = b.agenda_hora.substring(3,5);
                                            if(h1 == h2){
                                                if(m1 < m2) {
                                                    return -1;
                                                } else {
                                                    return true;
                                                }
                                            } else {
                                                if(h1 < h2) {
                                                    return -1;
                                                } else {
                                                    return true;
                                                }
                                            }
                                        });
                                        Sala.find().then((sala)=>{
                                            //console.log("Listagem Realizada de Terapia")
                                            benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                            //console.log("benenomeconv:"+benenomeconv)
                                            res.render("agenda/agendaTerapeutaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta, agendaSemanais: agendaS})
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilS(req,res){
        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        let idsAgendasEx = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }

                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => (""+a.id+"") != (""+i+""));
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            //console.log(idsAgendasEx)
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaDTerapeuta(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("area/magenda/agendaTecSem", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaSTerapeuta(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("area/magenda/agendaTecSem", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaPessoal(req,res){
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let isSemanal = "false";
        let agendaTemp =  [];
        let idsDel = [];
        let idTerapeuta = req.cookies['idUsu'];
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let hoje;
        let seg = new Date();
        seg.setSeconds(0); 
        seg.setMinutes(0);
        seg.setHours(0);

        let sex = new Date();
        sex.setSeconds(59);
        sex.setMinutes(59);
        sex.setHours(23);

        console.log("ISO: "+fncGeral.getDateToIsostring(seg));
        console.log("ISO: "+fncGeral.getDateToIsostring(sex));

        let diaSemana = new Date();
        diaSemana.setSeconds(0);
        diaSemana.setMinutes(0);
        diaSemana.setHours(0);

        diaSemana.setDate(diaSemana.getDate()+1);

        switch (seg.getUTCDay()){
            case 0://DOM
                hoje = "dom";
                diaSemana.setUTCDate(diaSemana.getUTCDate() + 1);
                break;
            case 1://SEG
                hoje = "seg";
                diaSemana.setUTCDate(diaSemana.getUTCDate() + 4);
                break;
            case 2://TER
                hoje = "ter";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 1);
                break;
            case 3://QUA
                hoje = "qua";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 2);
                break;
            case 4://QUI
                hoje = "qui";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 3);
                break;
            case 5://SEX
                hoje = "sex";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 4);
                break;
            case 6://SAB
                hoje = "sab";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 5);
                break;
            default:
                hoje = "dom";
                diaSemana.setUTCDate(diaSemana.getUTCDate() - 6);
                break;
        }
        console.log("SEG:"+seg);

        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-5));
        console.log("segunda:"+segunda)
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);

        Agenda.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idFiltro }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda.length)
            agenda.forEach((e)=>{
                if (e.agenda_temp == true){
                    agendaTemp.push(e.agenda_tempId);
                }
                
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //T1 Trecho para remover agenda fixa quando ha temp.
            agenda.forEach((ag)=>{
                agendaTemp.forEach((id)=>{
                    console.log("ag._id == id:  "+ag._id+" == "+id)
                    if ((""+ag._id+"") == (""+id+"")){
                        console.log("1");
                        idsDel.push(ag._id);
                    }
                })
            })
            console.log("agendalengthafter: "+agenda.length)
            idsDel.forEach((d)=>{
                agenda = agenda.filter((item) => item._id !== d);
            })
            console.log("agendalengthbefore: "+agenda.length)
            //T1 Fim
           
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaPessoal(req,res){
        //console.log("cookie: "+req.cookies['idUsu'])//idUsu - lvlUsu
        let isSemanal = "false";
        let idTerapeuta = req.cookies['idUsu'];
        let dataFinal = req.body.dataFinal;
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let idsSubs = [];
        let seg = fncGeral.getDateFromString(req.body.dataFinal, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFinal, "fim");
        let agora = fncGeral.getDateFromString(req.body.dataFinal, "ini");
        let depois = fncGeral.getDateFromString(req.body.dataFinal, "fim");
        let hoje;
        switch(seg.getDay()){
            case 0://DOM
                hoje = "dom";
                break;
            case 1://SEG
                hoje = "seg";
                break;
            case 2://TER
                hoje = "ter";
                break;
            case 3://QUA
                hoje = "qua";
                break;
            case 4://QUI
                hoje = "qui";
                break;
            case 5://SEX
                hoje = "sex";
                break;
            case 6://SAB
                hoje = "sab";
                break;
            default:
                hoje = "dom";
                break;
        }
        
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }

        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        //let idTera = new ObjectId('636e5e85c276219d41aee9ea');//apenas para teste, trocar depois por idTerapeuta

        Agenda.find({ agenda_data: { $gte : agora, $lte: depois }, agenda_usuid : idTerapeuta }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda.length)
            
            agenda.forEach((e)=>{
                if (e.agenda_temp){
                    idsSubs.push(e.agenda_tempId);
                }
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
          
            idsSubs.forEach((id)=>{
                function comparaIds(agendaArray){//tem que converter em string pq objectids não são comparados corretamente entre si.
                    return ((""+agendaArray._id) != (""+id));
                }
                agenda = agenda.filter(comparaIds);
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, hoje, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaPessoalSemanal(req,res){
        //console.log("cookie: "+req.cookies['idUsu'])//idUsu - lvlUsu
        let idTerapeuta = req.cookies['idUsu'];
        let dataFinal = fncGeral.getDataContra(new Date());
        let idsAgendasEx = [];
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let idsSubs = [];
        let isSemanal = "true";
        let seg = fncGeral.getDateFromString(dataFinal, "ini");
        let sex = fncGeral.getDateFromString(dataFinal, "fim");
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = fncGeral.getDateToIsostring(seg);
        let depois = fncGeral.getDateToIsostring(sex);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        console.log("agora:"+agora);
        console.log("depois:"+depois);
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid : idTerapeuta }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            console.log("agenda.length: "+agenda.length);
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => a.id != i);
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                
                let newAgenda = agenda.filter(a => a.id != i);
                console.log("newAgenda.length: "+newAgenda.length);
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaPessoalSemanal(req,res){
        //console.log("cookie: "+req.cookies['idUsu'])//idUsu - lvlUsu
        let idTerapeuta = req.cookies['idUsu'];
        let dataFinal = req.body.dataFinal;
        let idsAgendasEx = [];
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let idsSubs = [];
        let isSemanal = "true";
        let seg = fncGeral.getDateFromString(req.body.dataFinal, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFinal, "fim");
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = fncGeral.getDateToIsostring(seg);
        let depois = fncGeral.getDateToIsostring(sex);
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        console.log("agora:"+agora);
        console.log("depois:"+depois);
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid : idTerapeuta }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
                if(e.agenda_temp){
                    idsAgendasEx.push(e.agenda_tempId.toString());
                }
            })
            idsAgendasEx.forEach((i)=>{
                agenda = agenda.filter(a => a.id != i);
                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                let segASex = ["seg","ter","qua","qui","sex"];
                                
                                segASex.forEach((diaDaSemana)=>{
                                    haddia = agenda.some(a => a.agenda_data_semana === diaDaSemana);
                                    //console.log("Tem "+z+"?"+haddia)
                                    this.temDia(haddia,horaage,agenda,semana,diaDaSemana);
                                })
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaPessoal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta, isSemanal})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaF(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        dtFill = seg.toISOString();
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false, agenda_extra: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaFixa", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilF(req,res){
        //agendaClass.agendaUpdateCampos(req,res);
        //atendClass.atendUpdateCampos(req,res);
        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill;
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        console.log("seg dtf: "+seg);
        console.log("sex dtf: "+sex);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg aft: "+seg)
        console.log("sex aft: "+sex)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                //console.log("seg: "+seg)
                //console.log("sex: "+sex)
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        dtFill = seg.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        let idxtestecunt = 0;
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois } }).then((agenda2) =>{
            console.log("agenda2.length => "+agenda2.length)
            
        })
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false, agenda_extra: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            console.log("agenda.length:"+agenda.length)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaFixa", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaSala(req,res){
        let aux = 1;
        let is = false;
        let dtFill;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSala", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilSala(req,res){
        let aux = 1;
        let is = false;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let dtFill = new Date(req.body.dataFinal);
        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        //console.log("Listagem Realizada de Usuário")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });

                                agenda.forEach((e)=>{
                                    if (e.agenda_temp) {

                                    }
                                })
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSala", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaLRefatorado(req,res){//AbreAgendaFiltroRefatorado
        let dtFill;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    //Montar estrutura da linha baseada no horario da agenda
                                    let linha;
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaLRefatorado(req,res){//FiltraAgendaFiltroRefatorado
        let dtTemp = new Date(req.body.dataFinal);
        dtTemp.setHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        //console.log("req.body.dataFinal:"+req.body.dataFinal)
        //console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        //console.log("dtFill")
        //console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        let filtro;
        switch (req.body.tipoFil){
            case "bene":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_beneid: req.body.agendaBeneid, agenda_temp: false }
                break;
            case "sala":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_salaid: req.body.agendaSalaid, agenda_temp: false }
                break;
            case "tera":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.agendaTerapeutaid, agenda_temp: false }
                break;
        }
        Agenda.find(filtro).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        e.agenda_data_semana = "dom"
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaL(req,res){//AbreAgendaFiltro
        let dtFill;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                dtFill = {dia: "seg"};
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                dtFill = {dia: this.getDiaSemana(seg)};
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                dtFill = {dia: "seg"};
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                dtFill = {dia: "seg"};
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaL(req,res){//FiltraAgendaFiltro
        let dtTemp = new Date(req.body.dataFinal);
        dtTemp.setHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        //console.log("req.body.dataFinal:"+req.body.dataFinal)
        //console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        //console.log("dtFill")
        //console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        let filtro;
        switch (req.body.tipoFil){
            case "bene":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_beneid: req.body.agendaBeneid, agenda_temp: false }
                break;
            case "sala":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_salaid: req.body.agendaSalaid, agenda_temp: false }
                break;
            case "tera":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.agendaTerapeutaid, agenda_temp: false }
                break;
        }
        Agenda.find(filtro).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        e.agenda_data_semana = "dom"
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                    //console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    cadastraAgenda(req,res){//AdicionaAgenda
        let flash = new Resposta()
        let resultado;
        //console.log(req.body.dataAg)
        //console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionar(req,res);
        cadastro.then((res) =>{
            //console.log(res)
            resultado = true;
        }).catch((err) =>{
            console.log(err)
            resultado = false;
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        }).finally(() =>{
            //console.log("resultado")
            //console.log(resultado);
            if (resultado == true){
                flash.texto = "Cadastrado com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.carregaAgendaCadastro(req,res,flash);
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                //console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', flash);
            }
        })
    },
    carregaCadFaltas(req,res,resposta){//Carrega o cadastro de faltas pontuais
        let flash = new Resposta()
        let resultado;
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                    //console.log("Listagem terapeutas!")
                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                        if(resposta.sucesso == ""){
                            //console.log(' objeto vazio');
                            flash.texto = "";
                            flash.sucesso = "";
                        } else {
                            //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                            flash.texto = resposta.texto;
                            flash.sucesso = resposta.sucesso;
                        }
                        res.render('agenda/agendaCadFaltas', {benes: bene, convs: conv, terapeutas: terapeuta, flash})
        })})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaSubterapia(req,res){//Carrega as Substituição de Categoria lançada errada
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapeutas!")
                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                            res.render('agenda/agendaSubTerapia', {benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia})
    })})})})}).catch((err) =>{
        console.log(err)
        res.render('admin/erro')
    })
},
    carregaAgendaTemp(req, res){//CarregaEdiçãoAgenda
        let agenda_tempId = req.params.id;
        Agenda.findById(req.params.id).then((agenda) =>{
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaCadTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, agenda_tempId})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraAgendaTemp(req,res){//AdicionaAgenda
        let flash = new Resposta()
        let resultado;
        //console.log(req.body.dataAg)
        //console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionarTemp(req,res);
        cadastro.then((res) =>{
            //console.log(res)
            flash.sucesso = "true";
            flash.texto = "Cadastro Agenda Diária realizado com sucesso!";
        }).catch((err) =>{
            console.log(err)
            flash.sucesso = "false"
            flash.texto = "houve um erro ao Realizar as listas!"
        }).finally(() =>{
            //console.log("resultado")
            //console.log(resultado);
            if (flash.sucesso == "true"){
                console.log('verdadeiro')
                res.render('admin/branco', {flash});
            } else {
                console.log('ERRO')
                res.render('admin/erro', {flash});
            }
        })
    },
    carregaAgendaEdiTemp(req, res){//CarregaEdiçãoAgenda
        let isAgendaTerapeuta = false;
        let selo = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        let id;
        if(req.params.id){
            id = req.params.id;
        } else {
            id = req.body.agendaId;
        }
        
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaEdiTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizaAgendaTemp(req, res){//EditaAgenda
        let flash = new Resposta()
        let resposta;
        try{
            agendaClass.agendaEditarTemp(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log(res)
                resposta = true;
            }).catch((err) =>{
                console.log("error")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta== true){
                    //Volta para a agenda de listagem
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //console.log('verdadeiro')
                    this.carregaAgendaEdiTemp(req,res,flash);
                }else{
                    //passar classe de erro
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.carregaAgendaEdiTemp(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    deletaAgenda(req, res){
        let flash = new Resposta();
        Agenda.find({_id:req.params.id}).then((agenda)=>{
            if (agenda.length > 0){
                agenda.forEach((a)=>{
                    Agenda.deleteOne({_id: a._id}).then(() =>{
                        //this.carregaAgendaF(req,res);
                        console.log("Deletado:"+req.params.id);
                        flash.sucesso = "true";
                        flash.texto = "Agenda deletada!";
                        res.render("admin/branco",{flash});
                    }).catch((err)=>{
                        console.log(err)
                        flash.sucesso = "false"
                        flash.texto = "Houve um erro ao deletar a Agenda Semanal!"
                        res.render("admin/branco",{flash});
                    })
                })
            } else {
                Agenda.find({agenda_tempId:req.params.id}).then((agenda)=>{
                    if (agenda.length > 0){
                        agenda.forEach((a)=>{
                            Agenda.deleteOne({_id: a._id}).then(() =>{
                                //this.carregaAgendaF(req,res);
                                console.log("Deletado:"+req.params.id);
                                flash.sucesso = "true";
                                flash.texto = "Agenda deletada!";
                                res.render("admin/branco",{flash});
                            }).catch((err)=>{
                                console.log(err)
                                flash.sucesso = "false"
                                flash.texto = "Houve um erro ao deletar a Agenda Semanal!"
                                res.render("admin/branco",{flash});
                            })
                        })
                    } else {
                        console.log("Não achou pelo id")
                        flash.sucesso = "false"
                        flash.texto = "A agenda não foi encontrada!"
                        res.render("admin/branco",{flash});
                    }
                })
            }
        })
    },
    atualizaAgenda(req, res){//EditaAgenda
        let flash = new Resposta()
        let resultado;
        try{
            agendaClass.agendaEditar(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log("res")
                resultado = true;
            }).catch((err) =>{
                console.log("error")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                //console.log("Finally")
                if(resultado == true){
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    this.carregaAgendaEdi(req,res,flash);
                    //this.carregaAgendaCadastro(req,res,flash);//como tava antes
                }else{
                    //console.log("Erro ao editar agenda!")
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.carregaAgendaCadastro(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    carregaEvolucao(req, res, atrazo, resposta){
        let selo;
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        console.log("isAgendaTerapeuta:"+isAgendaTerapeuta);
        let flash = new Resposta()
        let resultado;
        let id = req.params.id;
        if (id == '' || id == undefined || id == 'undefined' || id == null){
            id = req.body.id
        }
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    res.render('agenda/agendaEvolucao', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo, atrazo})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaEvolucaoTemp(req, res, atrazo, resposta){//CarregaEdiçãoAgenda
        let isAgendaTerapeuta = false;
        let selo = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })

        let id;
        if(req.params.id){
            id = req.params.id;
        } else {
            id = req.body.id;
        }
        
        Agenda.findById(id).then((agenda) =>{
            selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaEvolucaoTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo, atrazo})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizaEvolucao(req, res){//EditaAgenda
        let flash = new Resposta()
        let resultado;
        try{
            agendaClass.evolucao(req,res).then((res)=>{
                //console.log("Atualização Realizada!")
                //console.log("res")
                console.log("res:"+res)
                resultado = res;
                console.log("resultado:"+resultado)
            }).catch((err) =>{
                console.log("error")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                //console.log("Finally")
                if(resultado == true){
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    if (req.body.agendaTemp == "true"){
                        this.carregaEvolucaoTemp(req,res);
                    } else {
                        this.carregaEvolucao(req,res);
                    }
                    //this.carregaAgendaCadastro(req,res,flash);//como tava antes
                }else{
                    //console.log("Erro ao editar agenda!")
                    flash.texto = "Erro ao editar agenda!"
                    flash.sucesso = "false"
                    this.carregaAgendaCadastro(req,res,flash);
                }
            })
        } catch(err1){
            //console.log(err1)
        }
    },
    carregaAgendaEdi(req, res, resposta){//CarregaEdiçãoAgenda
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        console.log("isAgendaTerapeuta:"+isAgendaTerapeuta);
        let flash = new Resposta()
        let resultado;
        let id = req.params.id;
        if (id == '' || id == undefined || id == 'undefined' || id == null){
            id = req.body.id
        }
        Agenda.findById(id).then((agenda) =>{
            let selo = agenda.agenda_selo;
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                        //console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            //console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                                //console.log("Listagem terapeutas!")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    res.render('agenda/agendaEdi', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, isAgendaTerapeuta, selo})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaEdiF(req, res){
        let dat = new Date(req.params.mes+"/"+req.params.dia+"/"+req.params.ano);
        //console.log("dat:"+dat)
        //console.log("hora:"+req.params.hora)
        let agenda_hora = req.params.hora;
        let agenda_data_dia = {"dia":req.params.dia,"mes":req.params.mes,"ano":req.params.ano};
        let agenda = {"data":agenda_data_dia,"hora":agenda_hora}
        //console.log(agenda.data)
        //console.log(agenda.hora)
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{
                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                    //console.log("Listagem salas!")
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                            //console.log("Listagem terapeutas!")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
        res.render('agenda/agendaCadF', {agenda,benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaCadE(req, res){
        Agenda.find({_id: req.params.id}).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia
                                //console.log("Listagem Realizada de Terapia")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                                        //console.log("Listagem Realizada de Terapia")
                                res.render("agenda/agendaCadE", {salas: sala, agenda, benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaCadastro(req,res,resposta){
        let flash = new Resposta()
        Bene.find().then((bene) =>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            //console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                //console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{
                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena as salas
                    //console.log("Listagem salas!")
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        //console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b", usuario_status:"Ativo"}).then((terapeuta)=>{
                            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                            //console.log("Listagem terapeutas!")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                if(resposta.sucesso == ""){
                                    //console.log(' objeto vazio');
                                    flash.texto = ""
                                    flash.sucesso = ""
                                } else {
                                    //console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                                    flash.texto = resposta.texto
                                    flash.sucesso = resposta.sucesso
                                }
                                res.render('agenda/agendaCadT', {benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, flash})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaTecDia(req,res){
        let aux = 1;
        let dtFill;
        let is = false;
        let usunomefnc;
        let nomeFnc;
        let nomeEsp;
        let idFnc;
        let idEsp;
        let nomeFisio;
        let segunda;
        let terca;
        let quarta;
        let quinta;
        let sexta;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                dtFill = {dia: this.getDiaSemana(seg)};
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                dtFill = {dia: "seg"};
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        
        segunda = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()-4));
        terca = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quarta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        quinta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));
        sexta = this.getDataDiaMes(diaSemana.setDate(diaSemana.getDate()+1));

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu)=>{//Apenas 1
            //console.log("usu.usuario_obs:"+usu.usuario_obs)
            if(typeof usu.usuario_nome === undefined){
                usunomefnc = usu.usuario_nomecompleto;
                nomeUsu = usu.usuario_nomecompleto;
            } else {
                usunomefnc = usu.usuario_nome;
                nomeUsu = usu.usuario_nomecompleto;
            }
            if(!(typeof usu.usuario_graduacao === undefined)){
                idFnc = usu.usuario_graduacao;
            }
            if(!(typeof usu.usuario_especializacao === undefined)){
                idEsp = usu.usuario_especializacao;
            }
            if(!(typeof usu.usuario_obs === undefined)){
                usuObs = usu.usuario_obs;
            } else {
                usuObs = " - "
            }
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: usu._id, agenda_temp: false }).then((agenda) =>{
            //console.log("Listagem Realizada de agendamentos!")
            //console.log(agenda)
            agenda.forEach((e)=>{
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = this.getDataFMT(dat);
                let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
                let min = ""+dat.getMinutes();
                if (hora.length == 1){hora = "0" + hora + "";}
                if (min.length == 1){min = "0" + min + "";}
                e.agenda_hora = hora+":"+min;
                e.agenda_aux = aux;
                aux++;

                switch (dat.getUTCDay()){
                    case 0:
                        e.agenda_data_semana = "dom"
                        break;
                    case 1:
                        e.agenda_data_semana = "seg"
                        break;
                    case 2:
                        e.agenda_data_semana = "ter"
                        break;
                    case 3:
                        e.agenda_data_semana = "qua"
                        break;
                    case 4:
                        e.agenda_data_semana = "qui"
                        break;
                    case 5:
                        e.agenda_data_semana = "sex"
                        break;
                    case 6:
                        e.agenda_data_semana = "sab"
                        break;
                    default:
                        
                        console.log("erro");
                        break;
                }
            })
            //console.log(agenda)
            Bene.find().then((benef)=>{
                benef.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                        //console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            //console.log("Listagem Realizada de Terapia")
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                //console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                            
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                //console.log("Tem "+z+"?"+haddia)
                                if(haddia){
                                    horaage.forEach((h)=>{
                                        is = true
                                        
                                        agenda.forEach((e)=>{
                                            if(e.agenda_data_semana == z){
                                                if (h.horaage_hora == e.agenda_hora){
                                                    is = false
                                                }
                                            }
                                        });
                                        // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                                        
                                        if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                                            let daty;
                                            semana.forEach((y)=>{
                                                if(y.dia == z){
                                                    daty = y.data
                                                }
                                            });

                                            let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                            
                                            agendaVoid = new Agenda({
                                                agenda_hora : h.horaage_hora,
                                                agenda_data_semana : z,
                                                agenda_data_dia : dty,
                                                agenda_aux : aux,
                                                agenda_salaid : voidId,
                                                agenda_beneid : voidId,
                                                agenda_convid : voidId,
                                                agenda_terapiaid : voidId,
                                                agenda_usuid : voidId,
                                                agenda_mergeterapeutaid : voidId,
                                                agenda_mergeterapiaid : voidId 
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        }
                                    })
                                } else {
                                    horaage.forEach((h)=>{
                                        let daty;
                                        semana.forEach((y)=>{
                                            if(y.dia == z){
                                                daty = y.data
                                            }
                                        });

                                        let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                                        
                                        agendaVoid = new Agenda({
                                            agenda_hora : h.horaage_hora,
                                            agenda_data_semana : z,
                                            agenda_data_dia : dty,
                                            agenda_aux : aux,
                                            agenda_salaid : voidId,
                                            agenda_beneid : voidId,
                                            agenda_convid : voidId,
                                            agenda_terapiaid : voidId,
                                            agenda_usuid : voidId,
                                            agenda_mergeterapeutaid : voidId,
                                            agenda_mergeterapiaid : voidId 
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                //Feito serapadamente porque o foreach de semana não estava afim de funcionar

                                agenda.sort(function(a, b) {
                                    let h1 = a.agenda_hora.substring(0,2);
                                    let m1 = a.agenda_hora.substring(3,5);
                                    let h2 = b.agenda_hora.substring(0,2);
                                    let m2 = b.agenda_hora.substring(3,5);
                                    if(h1 == h2){
                                        if(m1 < m2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    } else {
                                        if(h1 < h2) {
                                            return -1;
                                        } else {
                                            return true;
                                        }
                                    }
                                });
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    //console.log("Listagem Realizada de Terapia");
                                    Especialidade.find().then((especialidade)=>{
                                    
                                        especialidade.forEach((e)=>{//graduação
                                            //console.log("Listagem Realizada de Especialidade")
                                            //console.log("TESTE:"+e._id+"/"+idFnc)
                                            if(e._id == idFnc){
                                                nomeFnc = e.especialidade_nome;
                                            }
                                        })
                                        Especializacao.find().then((especializacao)=>{//Terapia
                                            //console.log("Listagem Realizada de Especializacao")
                                            especializacao.forEach((ez)=>{//especializacao
                                                //console.log("TESTE:"+ez._id+"/"+idEsp)
                                                if(ez._id == idEsp){
                                                    nomeEsp = ez.especializacao_nome;
                                                }
                                            })
                                            if(!(typeof nomeFnc === "undefined")){
                                                usunomefnc += " / " + nomeFnc
                                            }
                                            if(!(typeof nomeEsp === "undefined")){
                                                usunomefnc += " ("+nomeEsp+")"
                                            }
                                            //console.log("benenomeconv:"+usunomefnc)
                                            res.render("area/magenda/agendaTecDia", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    converteAgendaEmAtend(req,res){//Converte a Agenda em Atendimento
        //console.log("----------CÓPIA----------")
        //console.log("dia:"+req.body.dataFil)
        let convcreval;
        let convdebval;
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaFinal;
        let idSubstituidas = [];
        let agendaSubstituida = [];
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convCreCpfCnpj;
        let convDebCpfCnpj;
        let convcreTes;
        let convdebTes;
        let newTabil;
        let nextNum;
        let temp;
        let aux;
        let auxId;
        let teraContrato;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let temAgendaSub;
        let hora;
        let data;
        let hor;
        let min;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        console.log("START CONVERT");
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        //console.log("dataIni: "+dataIni);
        //console.log("dataFim: "+dataFim);
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, agenda_extra: false}).then((agendaFixa)=>{
            Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: true, agenda_extra: false}).then((agendaSemanal)=>{
            //-------------------------
            //console.log(agenda)
            Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                //console.log("validação caso seja o primeiro registro")
                atendimento.forEach(e => {atend = e});
                nextNum = atend.atend_num;
                        agendaFixa.forEach((a)=>{
                            agendaSub = '';
                            convcreval = "0,00";
                            convdebval = "0,00";
                            /*
                            if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            }
                            */
                            //console.log("a.agenda_categoria:"+a.agenda_categoria);

                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                agendaSemanal.forEach((s)=>{
                                    if (""+a._id === ""+s.agenda_tempId){
                                        agendaSub = s;
                                    }
                                })

                                if (agendaSub != ''){
                                    data = agendaSub.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;

                                    switch (agendaSub.agenda_categoria){
                                        case "Apoio"://ANALISE
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Apoio",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Apoio" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Apoio" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : req.body.debitConvid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Extra":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Extra",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                //atend_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                //atend_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Extra" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Extra" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : arguments.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Falta":

                                            agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })
                                            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,//mesmo terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,//recebe pelo plano pois não foi avisado previamente
                                                atend_mergevalordeb : "0,00",//Não paga pois o terapeuita não atende ninguem
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                atend_terapiaid : agendaSub.agenda_usuid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                atend_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                atend_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                atend_mergeterapiaid : a.agenda_usuid,
                                                atend_mergevalorcre : convcreval,//recebe pelo novo bene
                                                atend_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Falta Justificada" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convcreval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Glosa":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Glosa",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Convenio não paga
                                                atend_valordeb : "0,00",//Paga ao musico
                                                //atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                //atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Glosa" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Glosa" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : a.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Pais":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Pais",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : a.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Convenio não paga
                                                atend_valordeb : "0,00",//Paga ao musico
                                                atend_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Pais" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//Convenio não paga
                                                atend_valordeb : "0,00",//Paga ao musico
                                                atend_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : convdebval,//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Substituição" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Substituição" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "SubstitutoFixo":
                                            //console.log("SUBFIX1");
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            //console.log("convdebval:"+convdebval)
                                            //console.log("convcreval:"+convcreval)
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "SubstitutoFixo" ,
                                                credit_terapiaid : a.agenda_mergeterapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : a.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "SubstitutoFixo" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : a.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        case "Supervisão":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Supervisão",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//Recebe pelo atendimento
                                                atend_valordeb : convdebval,//Paga ao terapeuta
                                                atend_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : "0,00",//Não recebe pela supervisão
                                                atend_mergevalordeb : convdebval,//Paga a supervsão
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Supervisão" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Supervisão" ,
                                                debit_terapiaid : agendaSub.agenda_terapiaid ,
                                                debit_terapeutaid : agendaSub.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })
                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : roberta._id,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : "0,00",
                                                atend_mergevalordeb : "0,00",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":
                                            if(a.agenda_beneid+"" === "62d17a1eea444f5b7a02323c"){
                                                //console.log("ESSE DAQUI Ó:")
                                                //console.log("a:"+a)
                                                //console.log("agendaSub:"+agendaSub)
                                            }
                                            
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : agendaSub.agenda_beneid,//
                                                atend_convid : agendaSub.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,
                                                atend_mergevalordeb : convdebval,
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Padrão" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : agendaSub.agenda_data,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Padrão" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                        default:

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : agendaSub.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//
                                                atend_terapiaid : a.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//
                                                atend_valordeb : convdebval,//
                                                atend_categoria : "Padrão",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                convcre_atendnum : nextNum ,
                                                convcre_categoria : "Padrão" ,
                                                convcre_terapiaid : a.agenda_terapiaid ,
                                                convcre_terapeutaid : a.agenda_usuid ,
                                                credit_convid : agendaSub.agenda_convid ,
                                                convcre_nome : "Atendimento Auto" ,
                                                convcre_cpfcnpj : convCreCpfCnpj ,
                                                convcre_dataevento : agendaSub.agenda_data,
                                                convcre_datavenci : dataVenci ,
                                                convcre_valorprev : convcreval ,
                                                convcre_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                debit_atendnum : nextNum ,
                                                debit_categoria : "Padrão" ,
                                                debit_terapiaid : a.agenda_terapiaid ,
                                                debit_terapeutaid : a.agenda_usuid ,
                                                debit_convid : agendaSub.agenda_convid ,
                                                debit_nome : "Atendimento "+nextNum ,
                                                debit_cpfcnpj : convCreCpfCnpj ,
                                                debit_dataevento : agendaSub.agenda_data,
                                                debit_datavenci : dataVenci ,
                                                debit_valorprev : convdebval ,
                                                debit_datacad : dataAtual
                                            })

                                            break;
                                    }
                                } else {
                                    data = a.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    
                                    if (a.agenda_categoria == "SubstitutoFixo") {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                            if( convcreTes == agendacreTes){
                                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                convcreval = ccre.convcre_valor;
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                        convdeb.forEach((cdeb)=>{
                                            if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                convdebval = "0,00";
                                            } else {
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                            }
                                        })

                                        Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                            if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                convdebval = "0,00";
                                            }
                                        })
        
                                        newAtend = new Atend({
                                            atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                            atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                            atend_beneid : a.agenda_beneid,//
                                            atend_convid : a.agenda_convid,//
                                            atend_usuid : "Usuario Atual",
                                            atend_atenddata : a.agenda_data,//
                                            atend_atendhora : hora,//
                                            atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                            atend_terapiaid : a.agenda_terapiaid,//Musica
                                            atend_salaid : a.agenda_salaid,//
                                            atend_valorcre : convcreval,//Convenio não paga
                                            atend_valordeb : convdebval,//Paga ao musico
                                            atend_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                            atend_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                            atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                            atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                            atend_num : nextNum,
                                            atend_datacad : dataAtual.toISOString()
                                        });

                                        newCre = new Cre({
                                            credit_atendnum : nextNum ,
                                            credit_categoria : "SubstitutoFixo" ,
                                            credit_terapiaid : a.agenda_mergeterapiaid ,
                                            credit_terapeutaid : a.agenda_usuid ,
                                            credit_convid : a.agenda_convid ,
                                            credit_nome : "Atendimento "+nextNum ,
                                            credit_cpfcnpj : convCreCpfCnpj ,
                                            credit_dataevento : a.agenda_data,
                                            credit_datavenci : dataVenci ,
                                            credit_valorprev : convcreval ,
                                            credit_datacad : dataAtual
                                        })

                                        newDeb = new Deb({
                                            debit_atendnum : nextNum ,
                                            debit_categoria : "SubstitutoFixo" ,
                                            debit_terapiaid : a.agenda_terapiaid ,
                                            debit_terapeutaid : a.agenda_usuid ,
                                            debit_convid : a.agenda_convid ,
                                            debit_nome : "Atendimento "+nextNum ,
                                            debit_cpfcnpj : convCreCpfCnpj ,
                                            debit_dataevento : a.agenda_data,
                                            debit_datavenci : dataVenci ,
                                            debit_valorprev : convdebval ,
                                            debit_datacad : dataAtual
                                        })
                                    } else {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                        if( convcreTes == agendacreTes){
                                            //console.log("if ("+convcreTes+" == "+agendacreTes)
                                            convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                            convcreval = ccre.convcre_valor;
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convdeb.forEach((cdeb)=>{
                                        if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                            convdebval = "0,00";
                                        } else {
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                        }
                                    })

                                    Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                        if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                            convdebval = "0,00";
                                        }
                                    })
    
                                    newAtend = new Atend({
                                        atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                        atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                        atend_beneid : a.agenda_beneid,//
                                        atend_convid : a.agenda_convid,//
                                        atend_usuid : "Usuario Atual",
                                        atend_atenddata : a.agenda_data,//
                                        atend_atendhora : hora,//
                                        atend_terapeutaid : a.agenda_usuid,//
                                        atend_terapiaid : a.agenda_terapiaid,//
                                        atend_salaid : a.agenda_salaid,//
                                        atend_valorcre : convcreval,//
                                        atend_valordeb : convdebval,//
                                        atend_num : nextNum,
                                        atend_datacad : dataAtual.toISOString()
                                    });

                                    newCre = new Cre({
                                        credit_atendnum : nextNum ,
                                        credit_categoria : "Padrão" ,
                                        credit_terapiaid : a.agenda_terapiaid ,
                                        credit_terapeutaid : a.agenda_usuid ,
                                        credit_convid : agendaSub.agenda_convid ,
                                        credit_nome : "Atendimento "+nextNum ,
                                        credit_cpfcnpj : convCreCpfCnpj ,
                                        credit_dataevento : a.agenda_data ,
                                        credit_datavenci : dataVenci ,
                                        credit_valorprev : convcreval ,
                                        credit_datacad : dataAtual
                                    })

                                    newDeb = new Deb({
                                        debit_atendnum : nextNum ,
                                        debit_categoria : "Padrão" ,
                                        debit_terapiaid : a.agenda_terapiaid ,
                                        debit_terapeutaid : a.agenda_usuid ,
                                        debit_convid : agendaSub.agenda_convid ,
                                        debit_nome : "Atendimento "+nextNum ,
                                        debit_cpfcnpj : convCreCpfCnpj ,
                                        debit_dataevento : a.agenda_data ,
                                        debit_datavenci : dataVenci ,
                                        debit_valorprev : convdebval ,
                                        debit_datacad : dataAtual
                                    })
                                    }
                                    
                                }
                                //console.log("newAtend:"+newAtend)
                                nextNum = nextNum ++;
                                //console.log("newAtend save");
                                this.geraAtend(newAtend);
                                if(newCre != ""){
                                    this.GeraCre(newCre);
                                    newCre == "";
                                }
                                if(newDeb != ""){
                                    this.GeraDeb(newDeb);
                                    newDeb == "";
                                }
                                //console.log("Setar migrado")
                                Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: true }})
                                //Agenda.findById(a._id)
                                //console.log("setou migrado")
                            }
                            })
                        })
                    })
                //})
                })
            })
            console.log("END CONVERT");
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    copiaExtraordinario(req,res){//Converte a Extraordinarios em Extra
        let convcreval;
        let convdebval;
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convCreCpfCnpj;
        let convcreTes;
        let convdebTes;
        let nextNum;
        let teraContrato;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let hora;
        let data;
        let hor;
        let min;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        console.log("START CONVERT");
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        //console.log("dataIni: "+dataIni);
        //console.log("dataFim: "+dataFim);
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
                Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, agenda_extra: false}).then((agendaFixa)=>{
                    Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: true, agenda_extra: false}).then((agendaSemanal)=>{
                    //-------------------------
                    //console.log(agenda)
                    
                        //console.log("validação caso seja o primeiro registro")
                        nextNum = 1;
                        agendaFixa.forEach((a)=>{
                            agendaSub = '';
                            convcreval = "0,00";
                            convdebval = "0,00";
                            /*
                            if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            }
                            */
                            //console.log("a.agenda_categoria:"+a.agenda_categoria);

                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                agendaSemanal.forEach((s)=>{
                                    if (""+a._id === ""+s.agenda_tempId){
                                        agendaSub = s;
                                    }
                                })

                                if (agendaSub != ''){
                                    data = agendaSub.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;

                                    switch (agendaSub.agenda_categoria){
                                        case "Apoio"://ANALISE
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Apoio",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Extra":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Extra",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                //extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                //extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Falta":

                                            agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })
                                            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : a.agenda_usuid,//mesmo terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : convcreval,//recebe pelo plano pois não foi avisado previamente
                                                extra_mergevalordeb : "0,00",//Não paga pois o terapeuita não atende ninguem
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                extra_terapiaid : agendaSub.agenda_usuid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                extra_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                extra_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                extra_mergeterapiaid : a.agenda_usuid,
                                                extra_mergevalorcre : convcreval,//recebe pelo novo bene
                                                extra_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Glosa":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Glosa",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                //extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                //extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Pais":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Pais",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: a.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : a.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                extra_mergeterapeutaid : agendaSub.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : agendaSub.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : "0,00",//Paga ao musico
                                                extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : convdebval,//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "SubstitutoFixo":
                                            //console.log("SUBFIX1");
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_mergeterapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })

                                            //console.log("convdebval:"+convdebval)
                                            //console.log("convcreval:"+convcreval)
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//Convenio não paga
                                                extra_valordeb : convdebval,//Paga ao musico
                                                extra_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                                extra_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                extra_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Supervisão":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: agendaSub.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Supervisão",//Para quando o convenio não paga o que deve
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//Recebe pelo atendimento
                                                extra_valordeb : convdebval,//Paga ao terapeuta
                                                extra_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                extra_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                extra_mergevalorcre : "0,00",//Não recebe pela supervisão
                                                extra_mergevalordeb : convdebval,//Paga a supervsão
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";
                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : roberta._id,
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : "0,00",
                                                extra_mergevalordeb : "0,00",
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":
                                            if(a.agenda_beneid+"" === "62d17a1eea444f5b7a02323c"){
                                                //console.log("ESSE DAQUI Ó:")
                                                //console.log("a:"+a)
                                                //console.log("agendaSub:"+agendaSub)
                                            }
                                            
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : agendaSub.agenda_beneid,//
                                                extra_convid : agendaSub.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : agendaSub.agenda_usuid,//
                                                extra_terapiaid : agendaSub.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : "0,00",//
                                                extra_valordeb : "0,00",//
                                                extra_mergeterapeutaid : a.agenda_usuid,
                                                extra_mergeterapiaid : a.agenda_terapiaid,
                                                extra_mergevalorcre : convcreval,
                                                extra_mergevalordeb : convdebval,
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        default:

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                                if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                    convdebval = "0,00";
                                                }
                                            })
            
                                            newAtend = new Extra({
                                                extra_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                extra_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                extra_beneid : a.agenda_beneid,//
                                                extra_convid : a.agenda_convid,//
                                                extra_usuid : "Usuario Atual",
                                                extra_data: agendaSub.agenda_data,//
                                                extra_hora : hora,//
                                                extra_terapeutaid : a.agenda_usuid,//
                                                extra_terapiaid : a.agenda_terapiaid,//
                                                extra_salaid : a.agenda_salaid,//
                                                extra_valorcre : convcreval,//
                                                extra_valordeb : convdebval,//
                                                extra_categoria : "Padrão",
                                                extra_num : nextNum,
                                                extra_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                    }
                                } else {
                                    data = a.agenda_data;
                                    hor = data.getUTCHours();
                                    min = data.getMinutes();

                                    if((""+min).length == 1){
                                        min = "0"+min;
                                    }

                                    if((""+hor).length == 1){
                                        hor = "0"+hor;
                                    }

                                    hora = hor+":"+min;
                                    
                                    if (a.agenda_categoria == "SubstitutoFixo") {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_mergeterapiaid+""
                                        convcre.forEach((ccre)=>{
                                            convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                            if( convcreTes == agendacreTes){
                                                //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                convcreval = ccre.convcre_valor;
                                            }
                                        })

                                        agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                        convdeb.forEach((cdeb)=>{
                                            if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                convdebval = "0,00";
                                            } else {
                                                convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                if(convdebTes == agendadebTes){
                                                    //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                    convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                    convdebval = cdeb.convdeb_valor;
                                                }
                                            }
                                        })

                                        Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                            if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                                convdebval = "0,00";
                                            }
                                        })
        
                                        newAtend = new Extra({
                                            atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                            atend_categoria : "SubstitutoFixo",//Para quando o convenio não paga o que deve
                                            atend_beneid : a.agenda_beneid,//
                                            atend_convid : a.agenda_convid,//
                                            atend_usuid : "Usuario Atual",
                                            atend_atenddata : a.agenda_data,//
                                            atend_atendhora : hora,//
                                            atend_terapeutaid : a.agenda_usuid,//Terapeuta Principal(Musico)
                                            atend_terapiaid : a.agenda_terapiaid,//Musica
                                            atend_salaid : a.agenda_salaid,//
                                            atend_valorcre : convcreval,//Convenio não paga
                                            atend_valordeb : convdebval,//Paga ao musico
                                            atend_mergeterapeutaid : a.agenda_mergeterapeutaid,//Outro Terapeuta
                                            atend_mergeterapiaid : a.agenda_mergeterapiaid,//ABA
                                            atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                            atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                            atend_num : nextNum,
                                            atend_datacad : dataAtual.toISOString()
                                        });

                                        newCre = "";
                                        newDeb = "";
                                    } else {
                                        agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                        if( convcreTes == agendacreTes){
                                            //console.log("if ("+convcreTes+" == "+agendacreTes)
                                            convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                            convcreval = ccre.convcre_valor;
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convdeb.forEach((cdeb)=>{
                                        if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                            convdebval = "0,00";
                                        } else {
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                        }
                                    })

                                    Usuario.find({_id: a.agenda_usuid}).then((u)=>{
                                        if(u.usuario_contrato == "CNPJ Fixo" || u.usuario_contrato == "CLT"){
                                            convdebval = "0,00";
                                        }
                                    })
    
                                    newAtend = new Extra({
                                        atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                        atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                        atend_beneid : a.agenda_beneid,//
                                        atend_convid : a.agenda_convid,//
                                        atend_usuid : "Usuario Atual",
                                        atend_atenddata : a.agenda_data,//
                                        atend_atendhora : hora,//
                                        atend_terapeutaid : a.agenda_usuid,//
                                        atend_terapiaid : a.agenda_terapiaid,//
                                        atend_salaid : a.agenda_salaid,//
                                        atend_valorcre : convcreval,//
                                        atend_valordeb : convdebval,//
                                        atend_num : nextNum,
                                        atend_datacad : dataAtual.toISOString()
                                    });

                                    
                                    }
                                }
                                //console.log("newAtend save");
                                this.geraExtra(newAtend);
                            }
                            })
                        })
                    })
                //})
                })
            console.log("END CONVERT");
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    geraAtend: async (newAtend,res) => {
        //console.log("newAtend save");
        //console.log(newAtend.atend_num)
        await newAtend.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    geraExtra: async (newExtra,res) => {
        //console.log("newExtra save");
        //console.log(newExtra)
        await newExtra.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    GeraCre: async (newCre,res) => {
        //console.log("newCre save");
        await newCre.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    GeraDeb: async (newDeb,res) => {
        //console.log("newDeb save");
        await newDeb.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    copiaDiaAgendaFill(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        //console.log("----------CÓPIA----------")
        //console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(this.formataData(req.body.data));
        
        dataIni.setHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(this.formataData(req.body.data));
        
        dataFim.setHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        //console.log("dataIni"+dataIni);
        //console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false }).then((agenda)=>{
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setUTCDate(dataaux.getUTCDate()+7);
                //console.log("date")
                //console.log(dataaux)
                a.agenda_data = dataaux.toISOString();
                const newAgenda = new Agenda({
                    agenda_data : a.agenda_data,//
                    agenda_beneid : a.agenda_beneid,//
                    agenda_convid : a.agenda_convid,//
                    agenda_salaid : a.agenda_salaid,//
                    agenda_terapiaid : a.agenda_terapiaid,//
                    agenda_usuid : a.agenda_usuid,//
                    agenda_datacad: dataAtual//
                });
                this.salvaAgenda(newAgenda);
            })
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaL(req,res);
        })
    },
    copiaSemanaAgendaGeral(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        //console.log("-------------------------")
        //console.log("----------CÓPIA----------")
        //console.log("-------------------------")
        //console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(req.body.data);//deve retornar uma segunda-feira
        dataIni.setHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(req.body.data);
        
        dataFim.setHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim.setDate(dataFim.getDate()+4)//+4 dias na segunda-feira para chegar a sexta
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        console.log("dataIni"+dataIni);
        console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false, agenda_extra: false}).then((agenda)=>{
            console.log("agenda:"+agenda.length)
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setDate(dataaux.getDate()+7);
                a.agenda_data = dataaux.toISOString();
                var newAgenda;
                if (a.agenda_categoria == "SubstitutoFixo"){
                    newAgenda = new Agenda({
                        agenda_data : a.agenda_data,//
                        agenda_beneid : a.agenda_beneid,//
                        agenda_convid : a.agenda_convid,//
                        agenda_salaid : a.agenda_salaid,//
                        agenda_terapiaid : a.agenda_terapiaid,//
                        agenda_usuid : a.agenda_usuid,//
                        agenda_categoria : a.agenda_categoria,//
                        agenda_org : a.agenda_org,//
                        agenda_obs : a.agenda_obs,//
                        agenda_temp : a.agenda_temp,//
                        agenda_extra : a.agenda_extra,//
                        agenda_datacad: dataAtual,//
                        agenda_mergeterapiaid: a.agenda_mergeterapiaid,//
                        agenda_mergeterapeutaid: a.agenda_mergeterapeutaid//
                    });
                } else {
                    newAgenda = new Agenda({
                        agenda_data : a.agenda_data,//
                        agenda_beneid : a.agenda_beneid,//
                        agenda_convid : a.agenda_convid,//
                        agenda_salaid : a.agenda_salaid,//
                        agenda_terapiaid : a.agenda_terapiaid,//
                        agenda_usuid : a.agenda_usuid,//
                        agenda_categoria : a.agenda_categoria,//
                        agenda_org : a.agenda_org,//
                        agenda_obs : a.agenda_obs,//
                        agenda_temp : a.agenda_temp,//
                        agenda_extra : a.agenda_extra,//
                        agenda_datacad: dataAtual//
                    });
                }
                
                this.salvaAgenda(newAgenda);
            })
            //console.log(agenda)
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro');
        }).finally(()=>{
            //console.log("-------------------------")
            //console.log("-----------FIM-----------")
            //console.log("-------------------------")
            this.carregaAgendaF(req,res);
        })
    },
    salvaAgenda: async (newAgenda,res) => {
        //console.log("newAgenda save");
        await newAgenda.save().then(()=>{
            //console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    sleep(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    agendaAtualizaTerapia(req,res){
        switch (req.body.agendaAbra){
            case "-":
                //NADA
                res.render("admin/branco");
                break;
            case "agenda":
                agendaClass.agendaUpdateCampos(req,res);
                res.render("admin/branco");
                break;
            case "atend":
                atendClass.atendUpdateCampos(req,res);
                res.render("admin/branco");
                break;
            case "ambos":
                agendaClass.agendaUpdateCampos(req,res);
                atendClass.atendUpdateCampos(req,res);
                res.render("admin/branco");
                break;
        }
    },
    agendaFaltaDiaFill(req,res){
        let flash = new Resposta();
        let resultado = "true";
        let busca;
        let dataIni = fncGeral.getDateFromString(req.body.agendaData, "ini");
        let dataFim = fncGeral.getDateFromString(req.body.agendaData, "fim");
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let teraidx = req.body.agendaMergeterapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let tpiaidx = req.body.agendaTeraFindid;//new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        console.log("ini: "+fncGeral.getDateToIsostring(dataIni));
        console.log("fim: "+fncGeral.getDateToIsostring(dataFim));
        let stringo ;
        console.log("beneidx:"+beneidx)
        if (beneidx == "-" && req.body.agendaMergeterapeutaid == "-") {
            resultado = "false";
        } else if (beneidx != "-" && teraidx == "-") {
            console.log("falta bene")
            busca = { agenda_data: { $gte : new Date(dataIni), $lte: new Date(dataFim) }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx };
            Agenda.find({ agenda_data: { $gte : dataIni.toISOString(), $lte:  dataFim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx }).then((agenda)=>{
                console.log("agenda.length"+agenda.length);
            })
        } else if (beneidx == "-" && teraidx != "-") {
            console.log("falta terapeuta")
            busca = { agenda_data: { $gte : fncGeral.getDateToIsostring(dataIni), $lte:  fncGeral.getDateToIsostring(dataFim) }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx };
            Agenda.find({ agenda_data: { $gte : dataIni.toISOString(), $lte:  dataFim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx }).then((agenda)=>{
                console.log("agenda.length"+agenda.length);
            })
        } else {
            console.log("falta de um bene para um terapeuta")
            busca = { agenda_data: { $gte : fncGeral.getDateToIsostring(dataIni), $lte:  fncGeral.getDateToIsostring(dataFim) }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx };
            Agenda.find({ agenda_data: { $gte : dataIni.toISOString(), $lte:  dataFim.toISOString() }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx }).then((agenda)=>{
                console.log("agenda.length"+agenda.length);
            })
        }
        console.log("resultado:"+resultado)
        if (resultado == "true"){
            agendaClass.agendaFaltaDia(req,res,busca);
            if (res.retorno = "true") {
                flash.sucesso = "true"
                flash.texto = "Cadastro de faltas realizados!"
                this.carregaCadFaltas(req,res,flash);
            } else {
                flash.sucesso = "false"
                flash.texto = "Erro ao realizar faltas: "+res.retorno
                this.carregaCadFaltas(req,res,flash);
            }
        } else {
            flash.sucesso = "false"
            flash.texto = "É necessário selecionar um beneficiário ou um terapeuta para a falta!"
            this.carregaCadFaltas(req,res,flash);
        }
    },
    /*
    deletaAgendaAtend(req, res){
        let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{
            a.forEach(a=>{
                Cre.find({credit_atendnum: a.atend_num}).then((cr)=>{
                    cr.forEach((c)=>{
                        Cre.deleteOne({_id: c._id}).catch((err) =>{
                            console.log(err)
                        })
                    })
                    Deb.find({debit_atendnum: a.atend_num}).then((de)=>{
                        de.forEach((d)=>{
                            Deb.deleteOne({_id: d._id}).catch((err) =>{
                                console.log(err)
                            })
                        })
                        Tabil.find({tabil_atendnum: a.atend_num}).then((tab)=>{
                            tab.forEach((t)=>{
                                Tabil.deleteOne({_id: t._id}).catch((err) =>{
                                    console.log(err)
                                })
                            })
                            Atend.deleteOne({_id: a._id}).then(()=>{
                                //console.log("DELETED!");
                            })
                        })
                    })
                })
            })
        })
    },
    */
    deletarTodosAtendimentos(req,res){
        /*
        if (senha == "Teste@#$2022"){
            let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{a.forEach(a=>{Atend.deleteOne({_id: a._id}).then(()=>{/*console.log("DELETED!");/})})})
            let deletar2 = Cre.find({credit_atendnum: {$gte: 2}}).then((c)=>{c.forEach(c=>{Cre.deleteOne({_id: c._id}).then(()=>{/*console.log("DELETED!");/})})})
            let deletar3 = Deb.find({debit_atendnum: {$gte: 2}}).then((d)=>{d.forEach(d=>{Deb.deleteOne({_id: d._id}).then(()=>{/*console.log("DELETED!");/})})})
            console.log("Finish");
        }
        */
        console.log("Desativado");
        res.render("admin/branco");
    },
    deletarTodosAtendimentos2(req,res){
        /*
        let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{a.forEach(a=>{Atend.deleteOne({_id: a._id}).then(()=>{/*console.log("DELETED!");/})})})
        let deletar2 = Cre.find({credit_atendnum: {$gte: 2}}).then((c)=>{c.forEach(c=>{Cre.deleteOne({_id: c._id}).then(()=>{/*console.log("DELETED!");/})})})
        let deletar3 = Deb.find({debit_atendnum: {$gte: 2}}).then((d)=>{d.forEach(d=>{Deb.deleteOne({_id: d._id}).then(()=>{/*console.log("DELETED!");/})})})
        console.log("Finish");
        */
        console.log("Desativado");
        res.render("admin/branco");
    },
    temDia(haddia,horaage,agenda,semana,aux,diaDaSemana){
        let voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
        if(haddia){
            horaage.forEach((h)=>{
                let is = true;
                
                agenda.forEach((e)=>{
                    if(e.agenda_data_semana == diaDaSemana){
                        if (h.horaage_hora == e.agenda_hora){
                            is = false
                        }
                    }
                });
                // se não achar pelomenos 1 horario compativel com o horaage do dia ele cria o horario vazio para preencher a agenda.
                
                if(is){//is verifica se é para fazer um novo cadastro ou não, por padrão é para fazer, marcado como falso caso ja tenha um cadastro nesse horario
                    let daty;
                    semana.forEach((y)=>{
                        if(y.dia == diaDaSemana){
                            daty = y.data
                        }
                    });

                    let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                    
                    agendaVoid = new Agenda({
                        agenda_hora : h.horaage_hora,
                        agenda_data_semana : diaDaSemana,
                        agenda_data_dia : dty,
                        agenda_aux : aux,
                        agenda_salaid : voidId,
                        agenda_beneid : voidId,
                        agenda_convid : voidId,
                        agenda_terapiaid : voidId,
                        agenda_usuid : voidId,
                        agenda_mergeterapeutaid : voidId,
                        agenda_mergeterapiaid : voidId 
                    });
                    agenda.push(agendaVoid);
                    aux++;
                }
            })
        } else {
            horaage.forEach((h)=>{
                let daty;
                semana.forEach((y)=>{
                    if(y.dia == diaDaSemana){
                        daty = y.data
                    }
                });

                let dty = new Date(this.getData(daty));//this.getDataFMT(daty)formataData
                
                agendaVoid = new Agenda({
                    agenda_hora : h.horaage_hora,
                    agenda_data_semana : diaDaSemana,
                    agenda_data_dia : dty,
                    agenda_aux : aux,
                    agenda_salaid : voidId,
                    agenda_beneid : voidId,
                    agenda_convid : voidId,
                    agenda_terapiaid : voidId,
                    agenda_usuid : voidId,
                    agenda_mergeterapeutaid : voidId,
                    agenda_mergeterapiaid : voidId 
                });
                agenda.push(agendaVoid);
                aux++;
            })
        }
    }
}
/*
let atualizar = agendaClass.agendaAddNovosCampos(req,res);
atualizar.then((res) =>{
    //console.log(res)
    resultado = true;
}).catch((err) =>{
    console.log(err)
    resultado = false;
}).finally(() =>{
    //console.log("resultado")
    //console.log(resultado);
})

let deletar = Atend.find({atend_num: {$gte: 2}}).then((a)=>{
    a.forEach(a=>{Atend.deleteOne({_id: a._id}).then(()=>{//console.log("DELETED!");})})
})
*/
/*
converteAgendaEmAtend2(req,res){//Converte a Agenda em Atendimento
        //console.log("----------CÓPIA----------")
        //console.log("dia:"+req.body.dataFil)
        let convcreval;
        let convdebval;
        let dataAtual = new Date();
        let dataVenci = dataAtual;
        dataVenci.setDate(dataVenci.getDate()+30);
        let seg = new Date(req.body.dataFil);
        let sex = new Date(req.body.dataFil);
        let agendaFinal;
        let idSubstituidas = [];
        let agendaSubstituida = [];
        let agendaSub;
        let newAtend;
        let newCre;
        let newDeb;
        let convCreCpfCnpj;
        let convDebCpfCnpj;
        let convcreTes;
        let convdebTes;
        let newTabil;
        let nextNum;
        let temp;
        let aux;
        let auxId;
        let teraContrato;
        let roberta;
        let atend;
        let agendacreTes;
        let agendadebTes;
        let temAgendaSub;
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        //console.log("seg:"+seg)
        //console.log("sex:"+sex)
        switch (seg.getUTCDay()){
            case 0://DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1://SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2://TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3://QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4://QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5://SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6://SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }
        let dataIni = seg.toISOString();
        let dataFim = sex.toISOString();
        //console.log("dataIni: "+dataIni);
        //console.log("dataFim: "+dataFim);
        let cc = convcreClass.convcreCarregarTodos(req,res);
        let cd = convdebClass.convdebCarregarTodos(req,res);

        cc.then((convcre)=>{
            convcre.forEach((c)=>{
                Conv.findOne({_id: c.convcre_convid}).then((conv)=>{
                    c.convcre_convCpfCnpj = conv.conv_cnpj;
                })
            })
            //console.log(convcre)
            cd.then((convdeb)=>{
                convdeb.forEach((d)=>{
                    Conv.findOne({_id: d.convdeb_convid}).then((conv)=>{
                        d.convdeb_convCpfCnpj = conv.conv_cnpj;
                    })
                })
                //console.log(convdeb)
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}}).then((agenda)=>{
            //-------------------------
            //console.log(agenda)
            Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                //console.log("validação caso seja o primeiro registro")
                atendimento.forEach(e => {atend = e});
                nextNum = atend.atend_num;
                //this.sleep(10000).then(() => {
                    
                        //let tamanho = agenda.length;
                        agenda.forEach((agendaFull)=>{
                            if(agendaFull){
                                Usuario.findOne({_id: agendaFull.agenda_usuid}).then((terapeuta)=>{
                                    teraContrato = terapeuta.usuario_contrato;
                                })
                                temp = agendaFull.agenda_tempId;
                                
                                if (temp != undefined){

                                    idSubstituidas.push(temp);
                                    
                                }
                            } else {
                                //console.log("undefined")
                            }
                        })

                        idSubstituidas.forEach((a)=>{
                            auxId = ""+a+"";
                            agenda.some((g)=>{
                                aux = ""+g._id+"";
                                if(auxId===auxId){
                                    agendaSubstituida.push(g);
                                    agenda.splice(agenda.findIndex(agenda => agenda._id == a), 1);
                                    return true;
                                }
                                return false;
                            })
                        })
                        //agendaSubstituida.forEach((s)=>{//console.log("aSub:"+s)})
                        let hora;
                        let data;
                        agenda.forEach((a)=>{
                            if(a.agenda_migrado != undefined){
                                //console.log("migrado?"+a.agenda_migrado)
                            }
                            if(!a.agenda_migrado){
                                nextNum = nextNum + 1;
                                temp = a.agenda_tempId;
                                //console.log("nextNum: "+nextNum)
                                convcreval = "0,00";
                                convdebval = "0,00";
                                if (temp != undefined){
                                    //agendaSub = agendaSubstituida.filter(as => as._id == temp)
                                    
                                    agendaSubstituida.some((s)=>{
                                        aux = s._id
                                        if((""+aux) === (""+temp)){
                                            agendaSub = s;
                                            temAgendaSub = true;
                                            //console.log("HORA:"+agendaSub)
                                            //console.log("achou!!!")
                                            return true;
                                        }
                                        return false;
                                    })

                                    if(!temAgendaSub){
                                        data = new Date(a.agenda_data)
                                        let hora = ""+data.getHours();
                                        let min = ""+data.getMinutes();

                                        if (hora.length == 1){
                                            hora = "0"+hora;
                                        }

                                        if (min.length == 1){
                                            min = "0"+min;
                                        }

                                        let horaAgenda = hor+":"+min;
                                        console.log("HORA:"+horaAgenda);
                                        hora = horaAgenda;
                                        console.log("AGENDA1 ERRO:"+a)
                                    } else {
                                        data = new Date(agendaSub.agenda_data);
                                        let hora = data.getHours();
                                        let min = data.getMinutes();

                                        if (hora.length = 1){
                                            hora = "0"+hora;
                                        }

                                        if (min.length = 1){
                                            min = "0"+min;
                                        }
                                        let horaAgenda = data.getHours()+":"+data.getMinutes();
                                        console.log("HORA:"+horaAgenda);
                                        hora = horaAgenda;
                                        console.log("AGENDA2 ERRO:"+agendaSub)
                                    }

                                    switch (a.agenda_tempmotivo){
                                        case "Falta":

                                            agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })
                                            console.log("a:"+a)
                                            console.log("agendaSub:"+agendaSub)
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou sem aviso prévio
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,//mesmo terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,//recebe pelo plano pois não foi avisado previamente
                                                atend_mergevalordeb : "0,00",//Não paga pois o terapeuita não atende ninguem
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = "";
                                            
                                            break;
                                        case "Falta Justificada":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+""
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })

                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Falta Justificada",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//Faltou e outro foi alocado
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_terapiaid,//Atenderá o outro bene pelo merge
                                                atend_terapiaid : agendaSub.agenda_usuid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//não recebe pois foi avisado previamente
                                                atend_valordeb : "0,00",//não paga porque não atendeu ao bene em questão
                                                atend_mergeterapeutaid : a.agenda_terapiaid,//Atendendo outro bene
                                                atend_mergeterapiaid : a.agenda_usuid,
                                                atend_mergevalorcre : convcreval,//recebe pelo novo bene
                                                atend_mergevalordeb : convdebval,//paga pelo atendimento do novo bene
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        case "Substituição":
                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+""
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+"";
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Substituição",//Para quando o convenio não paga o que deve
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//Terapeuta Principal(Musico)
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//Musica
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//Convenio não paga
                                                atend_valordeb : convdebval,//Paga ao musico
                                                atend_mergeterapeutaid : a.agenda_usuid,//Outro Terapeuta
                                                atend_mergeterapiaid : a.agenda_terapiaid,//ABA
                                                atend_mergevalorcre : convcreval,//Recebe pela terapia ABA
                                                atend_mergevalordeb : "0,00",//Não paga ao outro Terapeuta
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : agendaSub.agenda_terapiaid ,
                                                credit_terapeutaid : agendaSub.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        case "Roberta Disponivel":
                                            let idRoberta = new ObjectId("62e008adea444f5b7a02c04f");
                                            Usuario.findOne({_id: idRoberta}).then((usu)=>{
                                                roberta = usu;
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Roberta Disponivel",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : roberta._id,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : "0,00",
                                                atend_mergevalordeb : "0,00",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = "";
                                            newDeb = "";

                                            break;
                                        case "Nenhuma Observação":

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Administrativo",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Nenhuma Observação",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : agendaSub.agenda_usuid,//
                                                atend_terapiaid : agendaSub.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : "0,00",//
                                                atend_valordeb : "0,00",//
                                                atend_mergeterapeutaid : a.agenda_usuid,
                                                atend_mergeterapiaid : a.agenda_terapiaid,
                                                atend_mergevalorcre : convcreval,
                                                atend_mergevalordeb : convdebval,
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convcreval ,
                                                credit_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                        default:

                                            agendacreTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convcre.forEach((ccre)=>{
                                                convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                                if( convcreTes == agendacreTes){
                                                    //console.log("if ("+convcreTes+" == "+agendacreTes)
                                                    convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                                    convcreval = ccre.convcre_valor;
                                                }
                                            })

                                            agendadebTes = ""+agendaSub.agenda_convid + agendaSub.agenda_terapiaid+"";
                                            convdeb.forEach((cdeb)=>{
                                                if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                                    convdebval = "0,00";
                                                } else {
                                                    convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                                    if(convdebTes == agendadebTes){
                                                        //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                        convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                        convdebval = cdeb.convdeb_valor;
                                                    }
                                                }
                                            })
            
                                            newAtend = new Atend({
                                                atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                                atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                                atend_beneid : a.agenda_beneid,//
                                                atend_convid : a.agenda_convid,//
                                                atend_usuid : "Usuario Atual",
                                                atend_atenddata : a.agenda_data,//
                                                atend_atendhora : hora,//
                                                atend_terapeutaid : a.agenda_usuid,//
                                                atend_terapiaid : a.agenda_terapiaid,//
                                                atend_salaid : a.agenda_salaid,//
                                                atend_valorcre : convcreval,//
                                                atend_valordeb : convdebval,//
                                                atend_categoria : "Nenhuma Observação",
                                                atend_num : nextNum,
                                                atend_datacad : dataAtual.toISOString()
                                            });

                                            newCre = new Cre({
                                                convcre_atendnum : nextNum ,
                                                convcre_categoria : "Falta Justificada" ,
                                                convcre_terapiaid : a.agenda_terapiaid ,
                                                convcre_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                convcre_nome : "Atendimento Auto" ,
                                                convcre_cpfcnpj : convCreCpfCnpj ,
                                                convcre_dataevento : a.agenda_data ,
                                                convcre_datavenci : dataVenci ,
                                                convcre_valorprev : convcreval ,
                                                convcre_datacad : dataAtual
                                            })

                                            newDeb = new Deb({
                                                credit_atendnum : nextNum ,
                                                credit_categoria : "Falta Justificada" ,
                                                credit_terapiaid : a.agenda_terapiaid ,
                                                credit_terapeutaid : a.agenda_usuid ,
                                                //credit_convid : req.body.creditConvid ,
                                                credit_nome : "Atendimento "+nextNum ,
                                                credit_cpfcnpj : convCreCpfCnpj ,
                                                credit_dataevento : a.agenda_data ,
                                                credit_datavenci : dataVenci ,
                                                credit_valorprev : convdebval ,
                                                credit_datacad : dataAtual
                                            })

                                            break;
                                    }
                                } else {

                                    agendacreTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convcre.forEach((ccre)=>{
                                        convcreTes = ""+ccre.convcre_convid + ccre.convcre_terapiaid+""
                                        if( convcreTes == agendacreTes){
                                            //console.log("if ("+convcreTes+" == "+agendacreTes)
                                            convCreCpfCnpj = ccre.convcre_convCpfCnpj;
                                            convcreval = ccre.convcre_valor;
                                        }
                                    })

                                    agendadebTes = ""+a.agenda_convid + a.agenda_terapiaid+"";
                                    convdeb.forEach((cdeb)=>{
                                        if(teraContrato == 'CLT' || teraContrato == 'CNPJ Fixo'){
                                            convdebval = "0,00";
                                        } else {
                                            convdebTes = ""+cdeb.convdeb_convid + cdeb.convdeb_terapiaid+"";
                                            if(convdebTes == agendadebTes){
                                                //console.log("if ("+convdebTes+" == "+agendadebTes)
                                                convDebCpfCnpj = cdeb.convdeb_convCpfCnpj;
                                                convdebval = cdeb.convdeb_valor;
                                            }
                                        }
                                    })
    
                                    newAtend = new Atend({
                                        atend_org : "Padrão",//depende do lançamento na agenda semanal, se houver observação. ele é administrativo
                                        atend_categoria : "Padrão",//depende do lançamento na agenda semanal, se for administrativo, pode ser supervisão, substituição
                                        atend_beneid : a.agenda_beneid,//
                                        atend_convid : a.agenda_convid,//
                                        atend_usuid : "Usuario Atual",
                                        atend_atenddata : new Date(a.agenda_data),//
                                        atend_atendhora : a.agenda_hora,
                                        atend_terapeutaid : a.agenda_usuid,//
                                        atend_terapiaid : a.agenda_terapiaid,//
                                        atend_salaid : a.agenda_salaid,//
                                        atend_valorcre : convcreval,//
                                        atend_valordeb : convdebval,//
                                        atend_num : nextNum,
                                        atend_datacad : dataAtual.toISOString()
                                    });

                                    newCre = new Cre({
                                        credit_atendnum : nextNum ,
                                        credit_categoria : "Falta Justificada" ,
                                        credit_terapiaid : a.agenda_terapiaid ,
                                        credit_terapeutaid : a.agenda_usuid ,
                                        //credit_convid : req.body.creditConvid ,
                                        credit_nome : "Atendimento "+nextNum ,
                                        credit_cpfcnpj : convCreCpfCnpj ,
                                        credit_dataevento : a.agenda_data ,
                                        credit_datavenci : dataVenci ,
                                        credit_valorprev : convcreval ,
                                        credit_datacad : dataAtual
                                    })

                                    newDeb = new Deb({
                                        credit_atendnum : nextNum ,
                                        credit_categoria : "Falta Justificada" ,
                                        credit_terapiaid : a.agenda_terapiaid ,
                                        credit_terapeutaid : a.agenda_usuid ,
                                        //credit_convid : req.body.creditConvid ,
                                        credit_nome : "Atendimento "+nextNum ,
                                        credit_cpfcnpj : convCreCpfCnpj ,
                                        credit_dataevento : a.agenda_data ,
                                        credit_datavenci : dataVenci ,
                                        credit_valorprev : convdebval ,
                                        credit_datacad : dataAtual
                                    })
                                }
                                //console.log("newAtend:"+newAtend)
                                nextNum = nextNum ++;
                                //console.log("newAtend save");
                                this.geraAtend(newAtend);
                                if(newCre != ""){
                                    this.GeraCre(newCre);
                                    newCre == "";
                                }
                                if(newDeb != ""){
                                    this.GeraDeb(newDeb);
                                    newDeb == "";
                                }
                                //console.log("Setar migrado")
                                Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: true }})
                                //Agenda.findById(a._id)
                                //console.log("setou migrado")
                            }
                            })
                        })
                    })
                //})
            })
            //console.log("END COPIA")
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    */
   /*
        let aaa = new Date();
        aaa.setDate(aaa.getDate()-4);
        console.log("AAA:"+aaa);
        let bbb = new Date();
        bbb.setDate(bbb.getDate()+2);
        console.log("BBB:"+bbb);
        Agenda.find({agenda_data: { $gte : aaa, $lte:  bbb }}).then((del)=>{
            console.log("del.length"+del.length);
            del.forEach((item)=>{
                Agenda.findByIdAndDelete(item._id, function (err, docs) {
                    if (err){
                        console.log(err)
                    }else{
                        console.log("DETETED!");
                    }
                });
            })
        })
   */