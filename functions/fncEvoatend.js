//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Evoatendamento 

//Houve alteração na Estrutura e Banco da evolução de atendimentos, eles agora são vinculados à Agenda e Não ao Atendimento.
const evoatendClass = require("../models/agenda")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const fncGeral = require("./fncGeral")

//Tabela Plano de Evoatendamento 
const Evoatend = mongoose.model("tb_agenda")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")


//Funções auxiliares


module.exports = {
    listaEvoatend(req, res){
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let carregaFiltro = "false";
        let idsAgendasEx;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg);
        console.log("sex:"+sex);
        //let agora = seg.toISOString();
        //let depois = sex.toISOString();
        //console.log("Listagem Realizada de Atendimentos!")
        Evoatend.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idTerapeuta }).then((evoatend)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Terapia")
                        let agendamentos = evoatend;
                        console.log(agendamentos.length);
                        agendamentos.forEach((e)=>{
                            e.agenda_data_dia = fncGeral.getData(e.agenda_data);
                            console.log("HORA: "+e.agenda_hora);

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
                            if(e.agenda_temp){
                                idsAgendasEx.push(e.agenda_tempId.toString());
                            }
                        })
                        if (idsAgendasEx > 0){
                            idsAgendasEx.forEach((i)=>{
                                agenda = agenda.filter(a => a.id != i);
                                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                            })
                        }
                        res.render("area/evol/evoatendlis", { evoatends: evoatend, benes: bene, terapeutas: terapeuta, terapias: terapia, carregaFiltro})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    filtraEvoatend(req, res){
        let isAgendaTerapeuta = false;
        let lvlUsu = req.cookies['lvlUsu'];
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                isAgendaTerapeuta = true;
            }
        })
        let idTerapeuta = req.cookies['idUsu'];
        let carregaFiltro = "false";
        let idsAgendasEx;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        console.log("seg:"+seg);
        console.log("sex:"+sex);
        //let agora = seg.toISOString();
        //let depois = sex.toISOString();
        //console.log("Listagem Realizada de Atendimentos!")
        Evoatend.find({ agenda_data: { $gte : fncGeral.getDateToIsostring(seg), $lte:  fncGeral.getDateToIsostring(sex) }, agenda_usuid : idTerapeuta }).then((evoatend)=>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Terapia")
                        let agendamentos = evoatend;
                        console.log(agendamentos.length);
                        agendamentos.forEach((e)=>{
                            e.agenda_data_dia = fncGeral.getData(e.agenda_data);
                            console.log("HORA: "+e.agenda_hora);

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
                            if(e.agenda_temp){
                                idsAgendasEx.push(e.agenda_tempId.toString());
                            }
                        })
                        if (idsAgendasEx > 0){
                            idsAgendasEx.forEach((i)=>{
                                agenda = agenda.filter(a => a.id != i);
                                //vai reatribuir o array de ageendas, sem o registro a ser substituido pela diaria
                            })
                        }
                        res.render("area/evol/evoatendlis", { evoatends: evoatend, benes: bene, terapeutas: terapeuta, terapias: terapia, carregaFiltro})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaEvoatend(req,res){
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/evoatendCad", {terapias: terapia, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },

    carregaEvoatendEdi(req,res){
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                            console.log("Listagem Realizada de beneficiarios")
                                res.render("area/evoatendEdi", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraEvoatend(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        
        evoatendClass.cadastraEvoatendFisio(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEvoatend(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },
}