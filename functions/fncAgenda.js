//Exports
const mongoose = require("mongoose")

//Agenda
const Agenda = mongoose.model("tb_agenda")
const agendaClass = require("../models/agenda")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia") 
const horaageClass = require("../models/horaAge")
const salaClass = require("../models/sala")
const estadoClass = require("../models/estado")
const atendClass = require("../models/atend")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Horaage = mongoose.model("tb_horaage")
const Sala = mongoose.model("tb_sala")
const Estado = mongoose.model("tb_estado")
const Atend = mongoose.model("tb_atend")



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
        console.log("prs:"+prs)
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
    carregaAgendaL(req,res){
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
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).then((agenda) =>{
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

    carregaAgendaG(req,res){
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
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).then((agenda) =>{
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
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAgendaG2(req,res){
        let dtFill;
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
        //Seg
        let seg2 = seg;
        seg2.setUTCHours(23);
        seg2.setMinutes(59);
        seg2.setSeconds(59);
        //Ter
        let ter = (seg.getUTCDate() + 1);
        let ter2 = ter;
        ter2.setUTCHours(23);
        ter2.setMinutes(59);
        ter2.setSeconds(59);
        //Qua
        let qua = (seg.getUTCDate() + 2);
        let qua2 = ter;
        qua2.setUTCHours(23);
        qua2.setMinutes(59);
        qua2.setSeconds(59);
        //Qui
        let qui = (seg.getUTCDate() + 3);
        let qui2 = ter;
        qui2.setUTCHours(23);
        qui2.setMinutes(59);
        qui2.setSeconds(59);
        //Sex
        let sex2 = sex;
        sex2.setUTCHours(23);
        sex2.setMinutes(59);
        sex2.setSeconds(59);
        //Continua
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        let diaSemana = seg;
        let semana = [{dia: "seg", data: this.getData(diaSemana)},{dia: "ter", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},
        {dia: "qua", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "qui", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))},{dia: "sex", data: this.getData(diaSemana.setDate(diaSemana.getDate()+1))}];
        Bene.findOne().then((b) =>{
        //Agenda.find({ agenda_data: { $gte : seg, $lte:  seg2 }, agenda_beneid: b._id}).then((agenda) =>{
        //Agenda.find({ agenda_data: { $gte : ter, $lte:  ter2 }, agenda_beneid: b._id}).then((agenda) =>{
        //Agenda.find({ agenda_data: { $gte : qua, $lte:  qua2 }, agenda_beneid: b._id}).then((agenda) =>{
        //Agenda.find({ agenda_data: { $gte : qui, $lte:  qui2 }, agenda_beneid: b._id}).then((agenda) =>{
        //Agenda.find({ agenda_data: { $gte : sex, $lte:  sex2 }, agenda_beneid: b._id}).then((agenda) =>{
        Agenda.find({ agenda_data: { $gte : agora, $lte:  depois }, agenda_beneid: b._id}).then((agenda) =>{
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
                                    res.render("agenda/agendaGeral", {salas: sala, horaages: horaage, agendas: agenda, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, semanas: semana, dtFill})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },



    filtraAgendaL(req,res){
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
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_beneid: req.body.agendaBeneid}
                break;
            case "sala":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_salaid: req.body.agendaSalaid}
                break;
            case "tera":
                filtro = {agenda_data: { $gte : agora, $lte:  depois },agenda_usuid: req.body.agendaTerapeutaid}
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
    cadastraAgenda(req,res){
        let resposta;
        let respostaLis;
        console.log(req.body.dataAg)
        console.log(req.body.agendaHora)
        let cadastro = agendaClass.agendaAdicionar(req,res);
        cadastro.then((res) =>{
            resposta = true;
        }).catch((err) =>{
            console.log(err)
            resposta = false;
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        }).finally(() =>{
            console.log("resposta")
            console.log(resposta);
            if(resposta){
                this.carregaAgendaL(req,res);
            } else {
                console.log(resposta)
                res.render('admin/erro');
            }
        })
    },
    deletaAgenda(req, res){
        Agenda.deleteOne({_id: req.params.id}).then(() =>{
            
        })
    },
    atualizaAgenda(req, res){
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
                    this.carregaAgendaL(req,res);
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
    carregaAgendaEdi(req, res){
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
    carregaAgendaCadastro(req,res){
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
        res.render('agenda/agendaCadT', {benes: bene, convs: conv, salas: sala, terapias: terapia, terapeutas: terapeuta, horaages: horaage})
        })})})})})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    copiaDiaAgenda(req,res){
        console.log("----------CÓPIA----------")
        console.log("dia:"+req.body.data)
        
        let dataIni = this.formataData(req.body.data);
        let dataFim = dataIni;
        dataFim.setUTCHours(23);
        dataFim.setMinutes(59);
        dataFim.setSeconds(59);
        let dataAtual = new Date();
        let nextNum;
        Agenda.find({agenda_data: { $gte: dataIni}, agenda_data: { $lte: dataFim}}).then((agenda)=>{
            //-------------------------
            console.log(agenda)
            console.log("atendmodel");
            Atend.findOne().sort({atend_num : -1}).then((atendimento) =>{
                nextNum = atendimento.atend_num + 1;
                console.log(nextNum)
            })
            console.log("size:"+agenda.length)
            agenda.forEach((a)=>{
                console.log("migrado?")
                console.log(a.agenda_migrado)
                console.log("mi")
                if(a.agenda_migrado != undefined){
                    console.log("T")
                }
                if(a.agenda_migrado != "true"){
                    const newAtend = new AtendModel({
                        atend_org : "Padrão",//
                        atend_categoria : "Padrão",//
                        atend_beneid : a.agenda_beneid,//
                        atend_convid : a.agenda_convid,//
                        //atend_usuid : req.body.atendUsuid,
                        atend_atenddata : req.body.agenda_data,//
                        atend_terapeutaid : a.agenda_usuid,//
                        atend_terapiaid : a.agenda_terapiaid,//
                        //atend_valorcre : req.body.atendValorcre,
                        //atend_valordeb : req.body.atendValordeb,
                        atend_num : nextNum,
                        atend_datacad : dataAtual.toISOString()
                    });
                    nextNum = nextNum + 1;
                    console.log("newAtend save");
                    geraAtend(newAtend);
                    Agenda.findByIdAndUpdate(a._id, { $set: { agenda_migrado: "true" }})
                }
            })
            console.log("END COPIA")
        }).catch((err)=>{
            console.log(err)
            res.render('admin/erro')
        }).finally(()=>{
            this.carregaAgendaL(req,res);
        })
    }, geraAtend: async (newAtend,res) => {
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
}