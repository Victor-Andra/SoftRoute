//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Extraamento 
const extraClass = require("../models/extra")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convecreClass = require("../models/convCre")
const convdebClass = require("../models/convDeb")
const tabilClass = require("../models/tabil")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const creditClass = require("../models/credit")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")
const horaageClass = require("../models/horaAge")
const agendaClass = require("../models/agenda")

//Tabela Plano de Extra 
const Extra = mongoose.model("tb_extra")

//Tabelas Extrangeiras
const Agenda = mongoose.model("tb_agenda")
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Convcre = mongoose.model("tb_convcre")
const Convdeb = mongoose.model("tb_convdeb")
const Credit = mongoose.model("tb_credit")
const Debit = mongoose.model("tb_debit")
const Tabil = mongoose.model("tb_tabil")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Sala = mongoose.model("tb_sala")
const Horaage = mongoose.model("tb_horaage")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncCredit = require("../functions/fncCredit")
const fncDebit = require("../functions/fncDebit")
const fncGeral = require("../functions/fncGeral")
const fncAtendAdm = require("./fncAtendAdm")
const fncAgenda = require("./fncAgenda")
const ObjectId = require('mongodb').ObjectId;

module.exports = {
    mascaraValores(val){
        //Esta mascara só vai até Milhões
        let t = val.toString();
        if(val == "0" || val == "0,00"){
            t = "0,00";
        } else {
            if (t.length >= 9){
                t = t.substring(0,t.length-8)+"."+t.substring(t.length-8,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else if (t.length >= 6){
                t = t.substring(0,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else {
                t = t.substring(0,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            }
        }

        return t;
    },
    listaExtra(req, res, resposta) {
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // Definir início e fim da semana (segunda à sexta)
        let seg = new Date();
        let sex = new Date();

        seg.setHours(0, 0, 0, 0);
        sex.setHours(23, 59, 59, 999);

        switch (seg.getUTCDay()) {
            case 0: // DOM
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
            case 1: // SEG
                sex.setUTCDate(sex.getUTCDate() + 4);
                break;
            case 2: // TER
                seg.setUTCDate(seg.getUTCDate() - 1);
                sex.setUTCDate(sex.getUTCDate() + 3);
                break;
            case 3: // QUA
                seg.setUTCDate(seg.getUTCDate() - 2);
                sex.setUTCDate(sex.getUTCDate() + 2);
                break;
            case 4: // QUI
                seg.setUTCDate(seg.getUTCDate() - 3);
                sex.setUTCDate(sex.getUTCDate() + 1);
                break;
            case 5: // SEX
                seg.setUTCDate(seg.getUTCDate() - 4);
                break;
            case 6: // SAB
                seg.setUTCDate(seg.getUTCDate() - 5);
                sex.setUTCDate(sex.getUTCDate() - 1);
                break;
            default:
                seg.setUTCDate(seg.getUTCDate() + 1);
                sex.setUTCDate(sex.getUTCDate() + 5);
                break;
        }

        const dataIni = seg.toISOString();
        const dataFim = sex.toISOString();

        // Aplicando filtro agenda_extra = true e agenda_cobrarextra = true
        Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        })
        .then((agendas) => {
            agendas.forEach((a) => {
                const data = new Date(a.agenda_data);
                let hor = data.getUTCHours().toString().padStart(2, '0');
                let min = data.getUTCMinutes().toString().padStart(2, '0');
                a.extra_hora = `${hor}:${min}`;
                a.extra_data_dia = fncGeral.getDataFMT(data); // Formata data como string legível
            });

            Bene.find()
            .then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                })
                .then((terapeuta) => {
                    terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome));

                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                    .then((horaage) => {
                        Sala.find()
                        .then((salas) => {
                            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome));

                            Terapia.find()
                            .then((terapias) => {
                                Conv.find()
                                .then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome));
                                    res.render('atendimento/extra/extraLis', {
                                        extras: agendas, // Agora estamos passando agendas como extras
                                        benes: bene,
                                        terapeutas: terapeuta,
                                        horaages: horaage,
                                        salas: salas,
                                        terapias: terapias,
                                        convs: convs,
                                        flash
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    filtraExtra(req, res, resposta) {
        if (!resposta || typeof resposta !== 'object') {
            resposta = {
                texto: '',
                sucesso: false
            };
        }
        let flash = new Resposta();
        flash.texto = resposta.texto;
        flash.sucesso = resposta.sucesso;

        // Receber dados do formulário
        const tipoData = req.body.tipoData;
        const anoAtend = req.body.anoAtend;
        const mesAtend = req.body.mesAtend; // valor numérico como string (ex: "3")
        const dataFil = req.body.dataFil; // usado em Semana / Dia

        let dataIni, dataFim;

        if (tipoData === "Ano/Mes") {
            // Filtrar por mês inteiro
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend); // ex: Abril = 3 (começa do 0)
            const primeiroDia = new Date(Date.UTC(ano, mes, 1));
            const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));
            dataIni = primeiroDia.toISOString();
            dataFim = ultimoDia.toISOString();

        } else if (tipoData === "Semana") {
            // Definir início e fim da semana (segunda à sexta) com base na data selecionada
            const seg = new Date(dataFil);
            seg.setUTCHours(0, 0, 0, 0);
            const sex = new Date(dataFil);
            sex.setUTCHours(23, 59, 59, 999);

            switch (seg.getUTCDay()) {
                case 0: // DOM
                    seg.setUTCDate(seg.getUTCDate() + 1);
                    sex.setUTCDate(sex.getUTCDate() + 5);
                    break;
                case 1: // SEG
                    sex.setUTCDate(sex.getUTCDate() + 4);
                    break;
                case 2: // TER
                    seg.setUTCDate(seg.getUTCDate() - 1);
                    sex.setUTCDate(sex.getUTCDate() + 3);
                    break;
                case 3: // QUA
                    seg.setUTCDate(seg.getUTCDate() - 2);
                    sex.setUTCDate(sex.getUTCDate() + 2);
                    break;
                case 4: // QUI
                    seg.setUTCDate(seg.getUTCDate() - 3);
                    sex.setUTCDate(sex.getUTCDate() + 1);
                    break;
                case 5: // SEX
                    seg.setUTCDate(seg.getUTCDate() - 4);
                    break;
                case 6: // SAB
                    seg.setUTCDate(seg.getUTCDate() - 5);
                    sex.setUTCDate(sex.getUTCDate() - 1);
                    break;
                default:
                    seg.setUTCDate(seg.getUTCDate() + 1);
                    sex.setUTCDate(sex.getUTCDate() + 5);
                    break;
            }

            dataIni = seg.toISOString();
            dataFim = sex.toISOString();

        } else if (tipoData === "Dia") {
            // Apenas um único dia (filtrar apenas aquele dia)
            const dataSelecionada = new Date(dataFil);
            dataIni = new Date(Date.UTC(
                dataSelecionada.getUTCFullYear(),
                dataSelecionada.getUTCMonth(),
                dataSelecionada.getUTCDate(),
                0, 0, 0, 0
            )).toISOString();

            dataFim = new Date(Date.UTC(
                dataSelecionada.getUTCFullYear(),
                dataSelecionada.getUTCMonth(),
                dataSelecionada.getUTCDate(),
                23, 59, 59, 999
            )).toISOString();
        }

        console.log("dataIni:", dataIni);
        console.log("dataFim:", dataFim);

        // Aplicar filtro agenda_extra = true e agenda_cobrarextra = true
        Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        })
        .then((agendas) => {
            agendas.forEach((a) => {
                const data = new Date(a.agenda_data);
                let hor = data.getUTCHours().toString().padStart(2, '0');
                let min = data.getUTCMinutes().toString().padStart(2, '0');
                a.extra_hora = `${hor}:${min}`;
                a.extra_data_dia = fncGeral.getDataFMT(data); // Formata data como string legível
            });

            Bene.find()
            .then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b.bene_nome));

                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                })
                .then((terapeuta) => {
                    terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b.usuario_nome));

                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                    .then((horaage) => {
                        Sala.find()
                        .then((salas) => {
                            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome));

                            Terapia.find()
                            .then((terapias) => {
                                Conv.find()
                                .then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome));

                                    res.render('atendimento/extra/extraLis', {
                                        extras: agendas,
                                        benes: bene,
                                        terapeutas: terapeuta,
                                        horaages: horaage,
                                        salas: salas,
                                        terapias: terapias,
                                        convs: convs,
                                        flash,
                                        // Adicione estas variáveis para exibir que tipo de pesquisa foi realizado:
                                        filtroTipo: tipoData,
                                        filtroAno: anoAtend,
                                        filtroMes: mesAtend ? parseInt(mesAtend) : null,
                                        filtroData: dataFil ? new Date(dataFil) : null
                                    });
                                });
                            });
                        });
                    });
                });
            });
        })
        .catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    listaExtractrl(req, res, resposta){ //
        let flash = new Resposta();
        Extra.find().then((extra) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    Terapia.find().then((terapia)=>{
                                        Conv.find().then((conv)=>{
                                            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        res.render('atendimento/extra/extraLisctrl', {extras: extra, benes: bene, usuarios: usuario, horaages: horaage, salas: sala, terapias: terapia, convs: conv, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    filtraExtractrl(req, res, resposta){
    let flash = new Resposta();
    //console.log('listando Extraeses')
    Extra.find({extra_beneid: req.body.extraBeneid}).then((extra) =>{
        extra.sort((a,b) => (a.extra_benenome > b.extra_benenome) ? 1 : ((b.extra_benenome > a.extra_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista extraese 
        extra.forEach((c)=>{
            //console.log("c.datacad"+c.extra_datacad)
            let datacad = new Date(c.extra_data)
            let mes = (datacad.getMonth()+1).toString();
            let dia = (datacad.getUTCDate()).toString();
            if (mes.length == 1){
                mes = "0"+mes;
            }
            if (dia.length == 1){
                dia = "0"+dia;
            }
            let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
            c.extra_data=fulldate;
            

        })

        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            Usuario.find().then((usuario)=>{
                //console.log("Listagem Realizada Usuário!")
                /*if(resposta.sucesso == ""){
                    console.log(' objeto vazio');
                    flash.texto = ""
                    flash.sucesso = ""
                } else {
                    console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                    flash.texto = resposta.texto
                    flash.sucesso = resposta.sucesso
                }*/
                res.render('atendimento/extra/extraLis', {extras: extra, usuarios: usuario, benes: bene, flash})
    })})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar!")
        res.redirect('admin/erro')
    })
    },
    
  
    controleExtra(req, res, resposta) {
        let flash = new Resposta();

        console.log("Passo 1: Iniciando busca dos dados básicos...");

        // Pega mês e ano atual para filtragem
        const hoje = new Date();
        const mesAtual = hoje.getMonth();  // 0 - Janeiro até 11 - Dezembro
        const anoAtual = hoje.getFullYear();

        Promise.all([
            Extra.find(),
            Bene.find(),
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            }),
            Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }),
            Sala.find(),
            Terapia.find(),
            Conv.find()
        ]).then(([extras, benes, usuarios, horaages, salas, terapias, convs]) => {

            console.log("Passo 2: Dados coletados com sucesso.");
            console.log(`Passo 3: Filtrando registros do mês ${mesAtual + 1}/${anoAtual}...`);

            // Ordenações iniciais
            benes.sort((a, b) =>
                a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(
                    b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                )
            );

            usuarios.sort((a, b) =>
                a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "").localeCompare(
                    b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
                )
            );

            salas.sort((a, b) => a.sala_nome.localeCompare(b.sala_nome));
            convs.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome));

            // Filtra por mês e ano atual com base em extra_data
            const extrasFiltrados = extras.filter(extra => {
                if (!extra.extra_data) return false;

                const data = new Date(extra.extra_data);
                return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
            });

            console.log(`Passo 4: Foram encontrados ${extrasFiltrados.length} registros no mês atual.`);

            // Mapeia os extras populados com informações tratadas
            const extrasPopulados = extrasFiltrados.map(extra => {
                const bene = benes.find(b => b._id.toString().trim() === extra.extra_beneid?.toString().trim());
                const conv = convs.find(c => c._id.toString().trim() === extra.extra_convid?.toString().trim());
                const terapia = terapias.find(t => t._id.toString().trim() === extra.extra_terapiaid?.toString().trim());

                // Busca terapeuta com segurança
                let idTerapeuta = extra.extra_terapeutaid ? extra.extra_terapeutaid.toString().trim() : null;
                const isValidId = idTerapeuta && /^[a-fA-F0-9]{24}$/.test(idTerapeuta);
                const terapeuta = idTerapeuta
                    ? usuarios.find(u => u._id.toString().trim() === idTerapeuta)
                    : null;

                // Outros usuários
                const usuarioCad = extra.extra_usuidcad
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usuidcad.toString().trim())
                    : null;

                const usuarioEdi = extra.extra_usuidedi
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usuidedi.toString().trim())
                    : null;

                const usuario = extra.extra_usuid
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usuid.toString().trim())
                    : null;

                return {
                    ...extra.toObject(),
                    extraDatafor: extra.extra_data ? new Date(extra.extra_data).toISOString().slice(0, 10) : "",
                    extraDatacadfor: extra.extra_datacad ? new Date(extra.extra_datacad).toISOString().slice(0, 10) : "",
                    extraDataedifor: extra.extra_dataedi ? new Date(extra.extra_dataedi).toISOString().slice(0, 10) : "",

                    extraTeraputa: terapeuta ? terapeuta.usuario_nome : "N/A",
                    extraUsunome: usuario ? usuario.usuario_nome : "N/A",
                    extraUsucadnome: usuarioCad ? usuarioCad.usuario_nome : "N/A",
                    extrausuedinome: usuarioEdi ? usuarioEdi.usuario_nome : "N/A",

                    bene_nome: bene ? bene.bene_nome : "N/A",
                    conv_nome: conv ? conv.conv_nome : "N/A",
                    terapia_nome: terapia ? terapia.terapia_nome : "N/A"
                };
            });

            console.log("Passo 5: Extras populados com sucesso.");

            res.render('atendimento/extra/extraControle', {
                extras: extrasPopulados,
                benes,
                usuarios,
                horaages,
                salas,
                terapias,
                convs,
                flash
            });

        }).catch(err => {
            console.error("Erro no processo:", err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    controleExtraFil(req, res, resposta){ //Extras exportados para o controle dos extras, aguardando auditoria e exporta para os atendimentos(filtrado)
        let flash = new Resposta();
        Extra.find().then((extra) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                            Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                Sala.find().then((sala)=>{
                                    sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                    Terapia.find().then((terapia)=>{
                                        Conv.find().then((conv)=>{
                                            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        res.render('atendimento/extra/extraControleFil', {extras: extra, benes: bene, usuarios: usuario, horaages: horaage, salas: sala, terapias: terapia, convs: conv, flash})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    carregaExtra(req,res){
        let atend;
        Extra.find().then((atend)=>{
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        //console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            //console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                    //console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                        res.render("atendimento/extra/extraCad", {horaages: horaage, atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala
                                        })
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaExtraedi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        Extra.findById(req.params.id).then((extra) =>{console.log("ID: "+extra._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: extra.extra_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                    res.render("atendimento/extra/extraEdi", {horaages: horaege, extra, convs: conv, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraExtra(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        extraClass.extraAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Extra cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaExtractrl(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
  
  
    /**
     * Função que copia agendamentos extras com base nos filtros do formulário
     */
   extraCopiar: async (req, res) => {
    try {
        const { tipoData, anoAtend, mesAtend, dataFil } = req.body;

        let dataIni, dataFim;

        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);

            const primeiroDia = new Date(Date.UTC(ano, mes, 1));
            const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

            dataIni = primeiroDia.toISOString();
            dataFim = ultimoDia.toISOString();

        } else if (tipoData === "Semana") {
            const seg = new Date(dataFil);
            seg.setUTCHours(0, 0, 0, 0);
            const sex = new Date(dataFil);
            sex.setUTCHours(23, 59, 59, 999);

            switch (seg.getUTCDay()) {
                case 0: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
                case 1: sex.setUTCDate(sex.getUTCDate() + 4); break;
                case 2: seg.setUTCDate(seg.getUTCDate() - 1); sex.setUTCDate(sex.getUTCDate() + 3); break;
                case 3: seg.setUTCDate(seg.getUTCDate() - 2); sex.setUTCDate(sex.getUTCDate() + 2); break;
                case 4: seg.setUTCDate(seg.getUTCDate() - 3); sex.setUTCDate(sex.getUTCDate() + 1); break;
                case 5: seg.setUTCDate(seg.getUTCDate() - 4); break;
                case 6: seg.setUTCDate(seg.getUTCDate() - 5); sex.setUTCDate(sex.getUTCDate() - 1); break;
                default: seg.setUTCDate(seg.getUTCDate() + 1); sex.setUTCDate(sex.getUTCDate() + 5); break;
            }

            dataIni = seg.toISOString();
            dataFim = sex.toISOString();

        } else if (tipoData === "Dia") {
            const dataSelecionada = new Date(dataFil);
            dataIni = new Date(Date.UTC(
                dataSelecionada.getUTCFullYear(),
                dataSelecionada.getUTCMonth(),
                dataSelecionada.getUTCDate(),
                0, 0, 0, 0
            )).toISOString();

            dataFim = new Date(Date.UTC(
                dataSelecionada.getUTCFullYear(),
                dataSelecionada.getUTCMonth(),
                dataSelecionada.getUTCDate(),
                23, 59, 59, 999
            )).toISOString();
        }

        // 🔍 LOGS PARA VERIFICAR FILTRO
        console.log("🔍 [extraCopiar] Aplicando filtro:");
        console.log("Tipo de filtro:", tipoData);
        console.log("Data Inicial:", dataIni);
        console.log("Data Final:", dataFim);

        // Busca os agendamentos extras com base no filtro
        const agendas = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim }, // 👈 Aqui estava errado: era agenda_
            agenda_extra: true,
            agenda_cobrarextra: true
        });

        // ✅ LOG DA QUANTIDADE DE REGISTROS ENCONTRADOS
        console.log(`✅ [extraCopiar] Total de agendamentos encontrados: ${agendas.length}`);

        if (!agendas.length) {
            return res.status(404).json({ sucesso: false, texto: 'Nenhum agendamento encontrado.' });
        }

        const usuarioId = req.user._id; // ajuste conforme sua autenticação
        const agora = new Date();

        // Mapeia e cria objetos Extra
        const extrasParaInserir = agendas.map(a => {
            const dataAgenda = new Date(a.agenda_data);
            const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
            const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');

            const extra_copiado = `${dataAgenda.toISOString().split('T')[0]}_${hora}:${minuto}_${a.agenda_beneid}`;

            return new ExtraModel({
                extra_data: a.agenda_data, // ✅ correto
                extra_hora: `${hora}:${minuto}`,
                extra_data_semana: a.agenda_data_semana,
                extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                extra_beneid: a.agenda_beneid,
                extra_convid: a.agenda_convid,
                extra_salaid: a.agenda_salaid,
                extra_terapiaid: a.agenda_terapiaid,
                extra_usuid: a.agenda_usuid,
                extra_mergeterapeutaid: a.agenda_mergeterapeutaid,
                extra_mergeterapiaid: a.agenda_mergeterapiaid,
                extra_migrado: a.agenda_migrado,
                extra_datacad: a.agenda_datacad,
                extra_dataedi: a.agenda_dataedi,
                extra_categoria: a.agenda_categoria,
                extra_org: a.agenda_org,
                extra_obs: a.agenda_obs,
                extra_aux: a.agenda_aux,
                extra_temp: a.agenda_temp,
                extra_tempId: a.agenda_tempId,
                extra_tempmotivo: a.agenda_tempmotivo,
                extra_extra: a.agenda_extra,
                extra_cobrarextra: a.agenda_cobrarextra,
                extra_evolucao: a.agenda_evolucao,
                extra_copia: true,
                extra_selo: a.agenda_selo,
                extra_dataSelo: a.agenda_dataSelo,
                extra_atrazo: a.agenda_atrazo,
                extra_rel: a.agenda_rel,
                extra_turnoFalta: a.agenda_turnoFalta,
                extra_faltaId: a.agenda_faltaId,
                extra_falta: a.agenda_falta,
                extra_usuedi: a.agenda_usuedi,
                extra_log: a.agenda_log,
                extra_usucad: a.agenda_usucad,

                // Campos exclusivos para Extra
                extra_tipo: "Padrão",
                extra_auditado: false,
                extra_auditadoObs: "",
                extra_copiado,
                extra_dtaExportado: agora.toISOString().split('T')[0],
                extra_horaExportado: `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`,
                extra_usuidExportou: usuarioId,
                extra_extraStatus: "Aguardando",
                extra_extraStatusPg: false
            });
        });

        // Tenta inserir cada registro evitando duplicidades
        const resultados = [];
        for (const extra of extrasParaInserir) {
            try {
                await extra.save();
                resultados.push({ sucesso: true, extraId: extra._id });
            } catch (err) {
                if (err.code === 11000) {
                    console.log(`❌ [extraCopiar] Registro duplicado ignorado: ${extra.extra_copiado}`);
                    resultados.push({ sucesso: false, erro: `Já existe cópia para: ${extra.extra_copiado}` });
                } else {
                    console.error(err);
                    resultados.push({ sucesso: false, erro: 'Erro ao salvar registro.' });
                }
            }
        }

        req.flash("success_message", "Cópias realizadas com sucesso!");
        res.redirect('/atendimento/extra/lisF');

    } catch (error) {
        console.error("❌ Erro em extraCopiar:", error);
        req.flash("error_message", "Houve um erro ao copiar os registros.");
        res.redirect('/admin/erro');
    }
},

    atualizaExtra(req,res){
        let resultado
        let flash = new Resposta()
        try{
            extraClass.extraEditar(req,res).then((res)=>{
                console.log("Atualização realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaExtra(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaExtra(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaExtra(req,res){
        let resposta;
        let flash = new Resposta()
        Extra.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Extra")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Extra deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Extra";
                flash.sucesso = "false";
            }
            this.listaExtra(req,res, resposta)
        })
    }
}