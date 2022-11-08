//Exports
const mongoose = require("mongoose")

//Agenda
const Agenda = mongoose.model("tb_agenda")
const agendaClass = require("../models/agenda")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convecreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia") 
const horaageClass = require("../models/horaAge")
const salaClass = require("../models/sala")
const estadoClass = require("../models/estado")
const atendClass = require("../models/atend")
const especialidadeClass = require("../models/especialidade")
const especializacaoClass = require("../models/especializacao")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Horaage = mongoose.model("tb_horaage")
const Sala = mongoose.model("tb_sala")
const Estado = mongoose.model("tb_estado")
const Atend = mongoose.model("tb_atend")
const Especialidade = mongoose.model("tb_especialidade")
const Especializacao = mongoose.model("tb_especializacao")

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

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
        dt.setUTCHours(0);
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        console.log("seg::")
        console.log(seg)
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    console.log("Listagem Realizada de Terapia")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
                console.log("aux:"+aux)
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Terapia")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
                console.log("aux:"+aux)
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Terapia")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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

        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usu)=>{
            console.log("usu.usuario_obs:"+usu.usuario_obs)
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
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_usuid: usu._id, agenda_temp: false }).then((agenda) =>{
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Usuario.findOne({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((tera)=>{
                            nomeUsu = tera.usuario_nome
                            Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada de Terapia")
                                Horaage.find().then((horaage)=>{
                                    console.log("Listagem Realizada de Horario")
                                    let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                    var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                    
                                    let z = "seg"

                                    haddia = agenda.some(a => a.agenda_data_semana === z);
                                    console.log("Tem "+z+"?"+haddia)
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
                                                    agenda_usuid : voidId
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
                                                agenda_usuid : voidId
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        })
                                    }
                                    z = "ter"
                                    
                                    haddia = agenda.some(a => a.agenda_data_semana === z);
                                    console.log("Tem "+z+"?"+haddia)
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
                                                    agenda_usuid : voidId
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
                                                agenda_usuid : voidId
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        })
                                    }
                                    z = "qua"
                                                                
                                    haddia = agenda.some(a => a.agenda_data_semana === z);
                                    console.log("Tem "+z+"?"+haddia)
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
                                                    agenda_usuid : voidId
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
                                                agenda_usuid : voidId
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        })
                                    }
                                    z = "qui"
                                    
                                    haddia = agenda.some(a => a.agenda_data_semana === z);
                                    console.log("Tem "+z+"?"+haddia)
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
                                                    agenda_usuid : voidId
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
                                                agenda_usuid : voidId
                                            });
                                            agenda.push(agendaVoid);
                                            aux++;
                                        })
                                    }
                                    z = "sex"
                                    
                                    haddia = agenda.some(a => a.agenda_data_semana === z);
                                    console.log("Tem "+z+"?"+haddia)
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
                                                    agenda_usuid : voidId
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
                                                agenda_usuid : voidId
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
                                        console.log("Listagem Realizada de Terapia");
                                        Especialidade.find().then((especialidade)=>{
                                        
                                            especialidade.forEach((e)=>{//graduação
                                                console.log("Listagem Realizada de Especialidade")
                                                //console.log("TESTE:"+e._id+"/"+idFnc)
                                                if(e._id == idFnc){
                                                    nomeFnc = e.especialidade_nome;
                                                }
                                            })
                                            Especializacao.find().then((especializacao)=>{//Terapia
                                                console.log("Listagem Realizada de Especializacao")
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
                                                console.log("benenomeconv:"+usunomefnc)
                                                res.render("agenda/agendaTerapeuta", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, usu ,usunomefnc, segunda, terca, quarta, quinta, sexta})
        })})})})})})})})})})}).catch((err) =>{
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("usu:"+usu)
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
                console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        console.log("Listagem Realizada de Terapia")
                        Horaage.find().then((horaage)=>{
                            console.log("Listagem Realizada de Horario")
                            let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                            var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                            
                            let z = "seg"

                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            console.log("Tem "+z+"?"+haddia)
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
                                            agenda_usuid : voidId
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
                                        agenda_usuid : voidId
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "ter"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            console.log("Tem "+z+"?"+haddia)
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
                                            agenda_usuid : voidId
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
                                        agenda_usuid : voidId
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "qua"
                                                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            console.log("Tem "+z+"?"+haddia)
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
                                            agenda_usuid : voidId
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
                                        agenda_usuid : voidId
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "qui"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            console.log("Tem "+z+"?"+haddia)
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
                                            agenda_usuid : voidId
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
                                        agenda_usuid : voidId
                                    });
                                    agenda.push(agendaVoid);
                                    aux++;
                                })
                            }
                            z = "sex"
                            
                            haddia = agenda.some(a => a.agenda_data_semana === z);
                            console.log("Tem "+z+"?"+haddia)
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
                                            agenda_usuid : voidId
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
                                        agenda_usuid : voidId
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
                                console.log("Listagem Realizada de Terapia")
                                Especialidade.find().then((especialidade)=>{
                                    
                                    especialidade.forEach((e)=>{//graduação
                                        console.log("Listagem Realizada de Especialidade")
                                        //console.log("TESTE:"+e._id+"/"+idFnc)
                                        if(e._id == idFnc){
                                            nomeFnc = e.especialidade_nome;
                                        }
                                    })
                                    Especializacao.find().then((especializacao)=>{//Terapia
                                        console.log("Listagem Realizada de Especializacao")
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
                                        console.log("usunomefnc:"+usunomefnc)
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                benef.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
            Bene.find({_id: b._id}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_apelido
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Terapia")
                                    let benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    console.log("benenomeconv:"+benenomeconv)
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: req.body.agendaBeneid, agenda_temp: false }).then((agenda) =>{
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
            Bene.find({_id: req.body.agendaBeneid}).then((bene)=>{
                bene.forEach(e => {
                    nomeBene = e.bene_nome
                    nomeSup = e.bene_supervisor
                    beneConvid = e.bene_convid
                });
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({_id: beneConvid}).then((conv)=>{
                    conv.forEach(e => {
                        nomeConv = e.conv_nome
                    });
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Terapia")
                                    benenomeconv = nomeBene+" / "+nomeConv + " ("+nomeSup+")";
                                    console.log("benenomeconv:"+benenomeconv)
                                    res.render("agenda/agendaBeneficiario", {salas: sala, horaages: horaage, agendas: agenda, benes: benef, bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill, benenomeconv, segunda, terca, quarta, quinta, sexta})
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
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
            console.log(idsAgendasEx)
            //console.log(agenda)
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaSemanal", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
                                    res.render("agenda/agendaFixa", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, terapeutas: terapeuta, semanas: semana, dtFill, segunda, terca, quarta, quinta, sexta})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaFilF(req,res){
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
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

        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_temp: false }).then((agenda) =>{
            console.log("Listagem Realizada de agendamentos!")
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
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                //Caso o horaage se desconfigure efetuar sort
                                //horaage.sort(horaage.horaage_hora); //sujeito a mudanças
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
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
                console.log("Listagem Realizada de Beneficiários!")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Horario")
                                let haddia//haddia foi criado para verificar se na agenda possui algum registro no dia da semana em questão
                                var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');//hexadecimal de void123456id
                                
                                let z = "seg"

                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "ter"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }

                                z = "qua"
                                                               
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "qui"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
                                        });
                                        agenda.push(agendaVoid);
                                        aux++;
                                    })
                                }
                                z = "sex"
                                
                                haddia = agenda.some(a => a.agenda_data_semana === z);
                                console.log("Tem "+z+"?"+haddia)
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
                                                agenda_usuid : voidId
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
                                            agenda_usuid : voidId
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
                                    console.log("Listagem Realizada de Salas")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    console.log("Listagem Realizada de Terapia")
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
        dtTemp.setUTCHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        console.log("req.body.dataFinal:"+req.body.dataFinal)
        console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        console.log("dtFill")
        console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
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
            console.log("Listagem Realizada de agendamentos!")
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    console.log("Listagem Realizada de Terapia")
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
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
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
            console.log("Listagem Realizada de agendamentos!")
            console.log(agenda)
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    console.log("Listagem Realizada de Terapia")
                                    res.render("agenda/agendaFiltro", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraAgendaL(req,res){//FiltraAgendaFiltro
        let dtTemp = new Date(req.body.dataFinal);
        dtTemp.setUTCHours(0);
        dtTemp.setMinutes(0);
        dtTemp.setSeconds(0);
        let dtFill;
        console.log("req.body.dataFinal:"+req.body.dataFinal)
        console.log("dtTemp.getUTCDay():"+dtTemp.getUTCDay())
        if(dtTemp.getUTCDay() == 0 || dtTemp.getUTCDay() == 6){
            dtFill = {dia: "seg"};
        } else {
            dtFill = {dia: this.getDiaSemana(dtTemp)};
        }
        console.log("dtFill")
        console.log(dtFill)

        let seg = new Date(req.body.dataFinal);
        let sex = new Date(req.body.dataFinal);
        seg.setUTCHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setUTCHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg)
        console.log("sex:"+sex)
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
            console.log("Listagem Realizada de agendamentos!")
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
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            Horaage.find().then((horaage)=>{
                                console.log("Listagem Realizada de Terapia")
                                Sala.find().then((sala)=>{
                                    console.log("Listagem Realizada de Terapia")
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
        console.log(req.body.dataAg)
        console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionar(req,res);
        cadastro.then((res) =>{
            console.log(res)
            resultado = true;
        }).catch((err) =>{
            console.log(err)
            resultado = false;
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        }).finally(() =>{
            console.log("resultado")
            console.log(resultado);
            if (resultado == true){
                flash.texto = "Cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.carregaAgendaCadastro(req,res,flash);
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', flash);
            }
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
                console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                console.log("Listagem terapeutas!")
                                Horaage.find().then((horaage)=>{
        res.render('agenda/agendaCadTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, agenda_tempId})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraAgendaTemp(req,res){//AdicionaAgenda
        let flash = new Resposta()
        let resultado;
        console.log(req.body.dataAg)
        console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionarTemp(req,res);
        cadastro.then((res) =>{
            console.log(res)
            resultado = true;
        }).catch((err) =>{
            console.log(err)
            resultado = false;
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        }).finally(() =>{
            console.log("resultado")
            console.log(resultado);
            if (resultado == true){
                flash.texto = "Cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro Agenda Diária realizado com sucesso!")
                this.carregaAgendaCadastro(req,res,flash);
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', flash);
            }
        })
    },
    carregaAgendaEdiTemp(req, res){//CarregaEdiçãoAgenda
        Agenda.findById(req.params.id).then((agenda) =>{
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{ 
                            console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                console.log("Listagem terapeutas!")
                                Horaage.find().then((horaage)=>{
        res.render('agenda/agendaEdiTemp', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    atualizaAgendaTemp(req, res){//EditaAgenda
        let flash = new Resposta()
        let resposta;
        try{
            agendaClass.agendaEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a agenda de listagem
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    console.log('verdadeiro')
                    req.flash("success_message", "Edição de Agenda Diária realizada com sucesso!")
                    this.carregaAgendaCadastro(req,res,flash);
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
        }
    },
    deletaAgenda(req, res){
        Agenda.deleteOne({_id: req.params.id}).then(() =>{
            this.carregaAgendaF(req,res);
        })
    },
    atualizaAgenda(req, res){//EditaAgenda
        let flash = new Resposta()
        let resultado;
        try{
            agendaClass.agendaEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = true;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    this.carregaAgendaCadastro(req,res,flash);
                }else{
                    flash.texto = "Cadastrado com sucesso!"
                    flash.sucesso = "true"
                    //Volta para a agenda de listagem
                    this.carregaAgendaCadastro(req,res,flash);
                }
            })
        } catch(err1){
            console.log(err1)
        }
    },
    carregaAgendaEdi(req, res, resposta){//CarregaEdiçãoAgenda
        let flash = new Resposta()
        let resultado;
        Agenda.findById(req.params.id).then((agenda) =>{
            let dat = new Date(agenda.agenda_data);
            let hora = ""+dat.getUTCHours();//UTC é necessário senão a hora fica desconfigurada
            let min = ""+dat.getMinutes();
            if (hora.length == 1){hora = "0" + hora + "";}
            if (min.length == 1){min = "0" + min + "";}
            agenda.agenda_hora = hora+":"+min;
            agenda.agenda_data_dia = this.getDataFMT(dat);
            Bene.find().then((bene) =>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Beneficiário!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Convenios!")
                    Sala.find().then((sala)=>{ 
                        console.log("Listagem salas!")
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                            console.log("Listagem terapia!")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                                console.log("Listagem terapeutas!")
                                Horaage.find().then((horaage)=>{
        res.render('agenda/agendaEdi', {agenda, benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaEdiF(req, res){
        let dat = new Date(req.params.mes+"/"+req.params.dia+"/"+req.params.ano);
        console.log("dat:"+dat)
        console.log("hora:"+req.params.hora)
        let agenda_hora = req.params.hora;
        let agenda_data_dia = {"dia":req.params.dia,"mes":req.params.mes,"ano":req.params.ano};
        let agenda = {"data":agenda_data_dia,"hora":agenda_hora}
        console.log(agenda.data)
        console.log(agenda.hora)
        Bene.find().then((bene) =>{
            console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{ 
                    console.log("Listagem salas!")
                    Terapia.find().then((terapia)=>{ 
                        console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{ 
                            console.log("Listagem terapeutas!")
                            Horaage.find().then((horaage)=>{
        res.render('agenda/agendaCadF', {agenda,benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    carregaAgendaCadE(req, res){
        Agenda.find({_id: req.params.id}).then((agenda) =>{
            console.log("Listagem Realizada de agendamentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada de Terapia")
                                    Sala.find().then((sala)=>{
                                        console.log("Listagem Realizada de Terapia")
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
            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
            console.log("Listagem Beneficiário!")
            Conv.find().then((conv)=>{
                console.log("Listagem Convenios!")
                Sala.find().then((sala)=>{ 
                    console.log("Listagem salas!")
                    Terapia.find().then((terapia)=>{ 
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena a terapia por nome 
                        console.log("Listagem terapia!")
                        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome 
                            console.log("Listagem terapeutas!")
                            Horaage.find().then((horaage)=>{
                                if(resposta.sucesso == ""){
                                    console.log(' objeto vazio');
                                    flash.texto = ""
                                    flash.sucesso = ""
                                } else {
                                    console.log(resposta.sucesso+' objeto com valor'+resposta.texto);
                                    flash.texto = resposta.texto
                                    flash.sucesso = resposta.sucesso
                                }
                                res.render('agenda/agendaCadT', {benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage, flash})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    converteAgendaEmAtend(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        console.log("----------CÓPIA----------")
        console.log("dia:"+req.body.dataFil)

        let convcreval;
        let convdebval;
        let dataIni = new Date(this.formataData(req.body.dataFil));
        
        dataIni.setUTCHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(this.formataData(req.body.dataFil));
        
        dataFim.setUTCHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        console.log("dataIni"+dataIni);
        console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}}).then((agenda)=>{
            //-------------------------
            console.log(agenda)
            console.log("atendmodel");
            let atend;
            Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
                console.log("validação caso seja o primeiro registro")
                atendimento.forEach(e => {atend = e});
                console.log("atendNum")
                console.log(atend.atend_num)
                atend.atend_num = atend.atend_num+1;
                console.log(atend.atend_num)
                console.log("Listagem Realizada de NextNum")
                console.log("size:"+agenda.length)
                agenda.forEach((a)=>{
                    console.log("migrado?")
                    console.log(a.agenda_migrado)
                    console.log("mi")
                    if(a.agenda_migrado != undefined){
                        console.log("T")
                    }
                    if(a.agenda_migrado != "true"){

                        Convcre.find({convcre_convid: a.agenda_convid, convcre_terapiaid: a.agenda_terapiaid}).then((convcre) => {
                            convcreval = convcre.convcre_valor;
                        })
                        if(convcreval == undefined || convcreval == "undefined"){
                            convcreval = "0,00";
                        }
                        Convdeb.find({convdeb_convid: a.agenda_convid, convdeb_terapiaid: a.agenda_terapiaid}).then((convdeb) => {
                            convdebval = convdeb.convdeb_valor;
                        })
                        if(convdebval == undefined || convcreval == "undefined"){
                            convdebval = "0,00";
                        }
                        const newAtend = new Atend({
                            atend_org : "Padrão",//
                            atend_categoria : "Padrão",//
                            atend_beneid : a.agenda_beneid,//
                            atend_convid : a.agenda_convid,//
                            atend_usuid : "Usuario Atual",
                            atend_atenddata : a.agenda_data,//
                            atend_terapeutaid : a.agenda_usuid,//
                            atend_terapiaid : a.agenda_terapiaid,//
                            atend_salaid : a.agenda_salaid,//
                            atend_valorcre : convcreval,//
                            atend_valordeb : convdebval,//
                            atend_num : atend.atend_num,
                            atend_datacad : dataAtual.toISOString()
                        });
                        
                        console.log("newAtend:"+newAtend)
                        nextNum = nextNum + 1;
                        console.log("newAtend save");
                        this.geraAtend(newAtend);
                        console.log("Setar migrado")
                        Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: "true" }})
                        Agenda.findById(a._id)
                        console.log("setou migrado")
                    }
                })
            })
            
            console.log("END COPIA")
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaF(req,res);
        })
    }, 
    geraAtend: async (newAtend,res) => {
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    copiaDiaAgendaFill(req,res){//Fazer ajuste para encontrar agendas diarias e substituir as fixas correspondentes.
        console.log("----------CÓPIA----------")
        console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(this.formataData(req.body.data));
        
        dataIni.setUTCHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(this.formataData(req.body.data));
        
        dataFim.setUTCHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        console.log("dataIni"+dataIni);
        console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}}).then((agenda)=>{
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setUTCDate(dataaux.getUTCDate()+7);
                console.log("date")
                console.log(dataaux)
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
        console.log("-------------------------")
        console.log("----------CÓPIA----------")
        console.log("-------------------------")
        console.log("dia:"+req.body.data)

        let dataaux;
        let dataIni = new Date(req.body.data);//deve retornar uma segunda-feira
        dataIni.setUTCHours(0);
        dataIni.setMinutes(0);
        dataIni.setSeconds(0);
        dataIni = dataIni.toISOString();
        let dataFim = new Date(req.body.data);
        
        dataFim.setUTCHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        dataFim.setDate(dataFim.getDate()+4)//+4 dias na segunda-feira para chegar a sexta
        dataFim = dataFim.toISOString();
        let dataAtual = new Date();
        let nextNum;
        console.log("dataIni"+dataIni);
        console.log("dataFim"+dataFim);
        Agenda.find({agenda_data: { $gte: dataIni, $lte: dataFim}, agenda_temp: false}).then((agenda)=>{
            agenda.forEach((a)=>{
                dataaux = new Date(a.agenda_data);
                dataaux.setDate(dataaux.getDate()+7);
                console.log("date")
                console.log(dataaux)
                a.agenda_data = dataaux.toISOString();
                const newAgenda = new Agenda({
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
                    agenda_datacad: dataAtual//
                });
                this.salvaAgenda(newAgenda);
            })
            console.log(agenda)
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro');
        }).finally(()=>{
            console.log("-------------------------")
            console.log("-----------FIM-----------")
            console.log("-------------------------")
            this.carregaAgendaF(req,res);
        })
    },
    salvaAgenda: async (newAgenda,res) => {
        console.log("newAgenda save");
        await newAgenda.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
}
/*
let atualizar = agendaClass.agendaAddNovosCampos(req,res);
atualizar.then((res) =>{
    console.log(res)
    resultado = true;
}).catch((err) =>{
    console.log(err)
    resultado = false;
}).finally(() =>{
    console.log("resultado")
    console.log(resultado);
})
*/