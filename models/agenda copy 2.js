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
                            let trocaUpdate = false;
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
    }