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
const anoClass = require("../models/ano")
const atendClass = require("../models/atend")

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
const Ano = mongoose.model("tb_ano")
const Atend = mongoose.model("tb_atend")

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
                            Ano.find().then((ano)=>{
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
                                        anos: ano,
                                        flash
                                        });
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
        console.log("  → anoAtend:", req.body.anoAtend);
        console.log("  → mesAtend:", req.body.mesAtend);
        let dataIni, dataFim;

        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            const primeiroDia = new Date(Date.UTC(ano, mes, 1));
            const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));
            dataIni = primeiroDia.toISOString();
            dataFim = ultimoDia.toISOString();
        } else {
            // Outros tipos de filtro (Semana, Dia) — mantenha seu código existente
            // ...
            return res.render('admin/erro', { message: "Tipo de filtro não suportado." });
        }

        console.log("dataIni:", dataIni);
        console.log("dataFim:", dataFim);

        Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        })
        .then((agendas) => {
            const extraIds = agendas.map(extra => extra._id);

            let atendimentosPromise;
            if (extraIds.length > 0) {
                atendimentosPromise = Atend.find({ atend_extraid: { $in: extraIds } }).exec();
            } else {
                atendimentosPromise = Promise.resolve([]);
            }

            agendas.forEach((a) => {
                const data = new Date(a.agenda_data);
                let hor = data.getUTCHours().toString().padStart(2, '0');
                let min = data.getUTCMinutes().toString().padStart(2, '0');
                a.extra_hora = `${hor}:${min}`;
                a.extra_data_dia = fncGeral.getDataFMT(data);
            });

            Bene.find()
            .then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b, 'pt-BR'));

                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                })
                .then((terapeuta) => {
                    terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b, 'pt-BR'));

                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                    .then((horaage) => {
                        Sala.find()
                        .then((salas) => {
                            salas.sort((a, b) => a.sala_nome.localeCompare(b, 'pt-BR'));
                            Terapia.find()
                            .then((terapias) => {
                                Conv.find()
                                .then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b, 'pt-BR'));
                                    Ano.find()
                                    .then((anos) => {
                                        atendimentosPromise.then((atendimentos) => {
                                            // ✅ AQUI: repassamos os valores do filtro para a view
                                            res.render('atendimento/extra/extraLis', {
                                                extras: agendas,
                                                benes: bene,
                                                terapeutas: terapeuta,
                                                horaages: horaage,
                                                salas: salas,
                                                terapias: terapias,
                                                convs: convs,
                                                anos: anos,
                                                atends: atendimentos,
                                                flash,

                                                // ✅ Valores do filtro para manter no formulário
                                                filtroTipo: tipoData,
                                                filtroAno: anoAtend,
                                                filtroMes: mesAtend
                                            });
                                        })
                                        .catch((err) => {
                                            console.error("Erro ao carregar atendimentos:", err);
                                            res.render('atendimento/extra/extraLis', {
                                                extras: agendas,
                                                benes: bene,
                                                terapeutas: terapeuta,
                                                horaages: horaage,
                                                salas: salas,
                                                terapias: terapias,
                                                convs: convs,
                                                anos: anos,
                                                atends: [],
                                                flash,
                                                filtroTipo: tipoData,
                                                filtroAno: anoAtend,
                                                filtroMes: mesAtend
                                            });
                                        });
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
            Ano.find().then((ano)=>{
                res.render('atendimento/extra/extraLisctrl', {
                    anos: ano, 
                    flash 
                })
        }).catch((err) =>{
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
            Ano.find().then((ano)=>{
                 Atend.find().then((atend)=>{
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
                res.render('atendimento/extra/extraLis', {extras: extra, anos: ano, atends: atend, usuarios: usuario, benes: bene, flash})
    })})})})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar!")
        res.redirect('admin/erro')
    })
    },
    controleExtraOld(req, res, resposta) {
        let flash = new Resposta();
        console.log("Passo 1: Iniciando busca dos dados básicos...");
        // Pega mês e ano atual para filtragem
        const hoje = new Date();
        const mesAtual = hoje.getMonth();  // 0 - Janeiro até 11 - Dezembro
        const anoAtual = hoje.getFullYear();

        // --- Adicionando Atend.find() ---
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
            Conv.find(),
            Ano.find(),
            // --- FETCH ATENDS HERE ---
            Atend.find() // Certifique-se de que 'Atend' é o nome correto do seu modelo Mongoose
        ]).then(([extras, benes, usuarios, horaages, salas, terapias, convs, anos, atends /* Recebe 'atends' aqui */]) => {
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
            // --- extrasFiltrados é definido aqui ---
            const extrasFiltrados = extras.filter(extra => {
                if (!extra.extra_data) return false;
                const data = new Date(extra.extra_data);
                return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
            });
            console.log(`Passo 4: Foram encontrados ${extrasFiltrados.length} registros no mês atual.`);

            // --- Lógica para filtrar atends com base em extrasFiltrados ---
            // Extrai os _ids dos extras filtrados para usar na filtragem de atends
            const extraIds = extrasFiltrados.map(extra => extra._id.toString());
            // Filtra os atends para incluir apenas aqueles vinculados aos extras filtrados
            // Isso reduz a quantidade de dados passados para a view, melhorando performance
            const atendsFiltrados = atends.filter(atend => {
                // Verifica se atend.atend_extraid existe e se o ID do extra está na lista de IDs filtrados
                return atend.atend_extraid && extraIds.includes(atend.atend_extraid.toString());
            });
            console.log(`Passo 4.5: Foram encontrados ${atendsFiltrados.length} atendimentos para os extras filtrados.`);

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
                const usuarioCad = extra.extra_usucad
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usucad.toString().trim())
                    : null;
                const usuarioEdi = extra.extra_usuedi
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usuedi.toString().trim())
                    : null;
                const usuario = extra.extra_usuid
                    ? usuarios.find(u => u._id.toString().trim() === extra.extra_usuid.toString().trim())
                    : null;

                // --- Calcula countAtends para este extra específico ---
                const countAtends = atendsFiltrados.filter(atend => atend.atend_extraid && atend.atend_extraid.toString().trim() === extra._id.toString().trim()).length;

                return {
                    ...extra.toObject(),
                    extraDatafor: extra.extra_data ? new Date(extra.extra_data).toISOString().slice(0, 10) : "",
                    extraDatacadfor: extra.extra_datacad ? new Date(extra.extra_datacad).toISOString().slice(0, 10) : "",
                    extraDataedifor: extra.extra_dataedi ? new Date(extra.extra_dataedi).toISOString().slice(0, 10) : "",
                    extraTeraputa: terapeuta ? terapeuta.usuario_nome : "N/A",
                    extraUsunome: usuario ? usuario.usuario_nome : "N/A",
                    extraUsucadnome: usuarioCad ? usuario.usuario_nome : "N/A",
                    extrausuedinome: usuarioEdi ? usuario.usuario_nome : "N/A",
                    bene_nome: bene ? bene.bene_nome : "N/A",
                    conv_nome: conv ? conv.conv_nome : "N/A",
                    terapia_nome: terapia ? terapia.terapia_nome : "N/A",
                    // --- Adiciona countAtends ao objeto extra populado ---
                    countAtends: countAtends
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
                anos,
                // --- Passa os atends FILTRADOS para a view ---
                atends: atendsFiltrados, // Passa apenas os atends relevantes
                flash
            });
        }).catch(err => {
            console.error("Erro no processo:", err);
            // Melhor prática: logar o erro completo para depuração
            console.error(err.stack);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('/admin/erro');
        });
    },
    controleExtraOLD(req, res, resposta) {
        const flash = new Resposta();

        try {
            console.log("🔧 Iniciando controle de extras - Buscando dados...");

            const hoje = new Date();
            const mesAtual = hoje.getMonth();      // 0 a 11
            const anoAtual = hoje.getFullYear();

            // --- Promises para buscar todos os dados necessários ---
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
                Conv.find(),
                Ano.find(),
                Atend.find() // Todos os atendimentos
            ])
            .then(([extras, benes, usuarios, horaages, salas, terapias, convs, anos, atends]) => {
                console.log(`✅ Dados carregados: ${extras.length} extras, ${atends.length} atendimentos`);

                // --- Converter todos os documentos Mongoose para objetos simples com _id como string ---
                const extrasObj = extras.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    if (obj.extra_beneid) obj.extra_beneid = obj.extra_beneid.toString();
                    if (obj.extra_convid) obj.extra_convid = obj.extra_convid.toString();
                    if (obj.extra_terapiaid) obj.extra_terapiaid = obj.extra_terapiaid.toString();
                    // ✅ Corrigido: campos de usuário
                    if (obj.extra_usuid) obj.extra_usuid = obj.extra_usuid.toString();       // Terapeuta do extra
                    if (obj.extra_usucad) obj.extra_usucad = obj.extra_usucad.toString();   // Quem cadastrou
                    if (obj.extra_usuedi) obj.extra_usuedi = obj.extra_usuedi.toString();   // Quem editou
                    return obj;
                });

                const usuariosObj = usuarios.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    return obj;
                });

                const benesObj = benes.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));
                const convsObj = convs.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));
                const terapiasObj = terapias.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));

                // --- Filtrar extras do mês atual ---
                const extrasFiltrados = extrasObj.filter(extra => {
                    if (!extra.extra_data) return false;
                    const data = new Date(extra.extra_data);
                    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
                });

                console.log(`📅 ${extrasFiltrados.length} extras encontrados no mês ${mesAtual + 1}/${anoAtual}`);

                // --- Criar mapa de atendimentos por extra_id para busca rápida ---
                const atendsObj = atends.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    if (obj.atend_extraid) obj.atend_extraid = obj.atend_extraid.toString();
                    if (obj.atend_beneid) obj.atend_beneid = obj.atend_beneid.toString();
                    if (obj.atend_convid) obj.atend_convid = obj.atend_convid.toString();
                    if (obj.atend_terapiaid) obj.atend_terapiaid = obj.atend_terapiaid.toString();
                    if (obj.atend_terapeutaid) obj.atend_terapeutaid = obj.atend_terapeutaid.toString();
                    if (obj.atend_usuidedi) obj.atend_usuidedi = obj.atend_usuidedi.toString();
                    // Formata a data do atendimento
                    obj.atendDataFor = obj.atend_atenddata
                        ? new Date(obj.atend_atenddata).toISOString().slice(0, 10)
                        : "";
                    return obj;
                });

                const atendsPorExtraId = new Map();
                atendsObj.forEach(atend => {
                    const extraId = atend.atend_extraid;
                    if (extraId) {
                        if (!atendsPorExtraId.has(extraId)) {
                            atendsPorExtraId.set(extraId, []);
                        }
                        atendsPorExtraId.get(extraId).push(atend);
                    }
                });

                // --- Função auxiliar para formatar data ---
                const formatarData = (data) => {
                    return data ? new Date(data).toISOString().slice(0, 10) : "";
                };

                // --- Mapear extras com dados populados ---
                const extrasPopulados = extrasFiltrados.map(extra => {
                    // Buscar entidades relacionadas usando IDs como string
                    const bene = benesObj.find(b => b._id === extra.extra_beneid);
                    const conv = convsObj.find(c => c._id === extra.extra_convid);
                    const terapia = terapiasObj.find(t => t._id === extra.extra_terapiaid);

                    // ✅ Corrigido: uso dos campos corretos
                    const terapeuta = usuariosObj.find(u => u._id === extra.extra_usuid);         // Terapeuta vinculado ao extra
                    const usuarioCad = usuariosObj.find(u => u._id === extra.extra_usucad);     // Quem cadastrou
                    const usuarioEdi = usuariosObj.find(u => u._id === extra.extra_usuedi);     // Quem editou
                    const usuario = usuariosObj.find(u => u._id === extra.extra_usuid);         // Mesmo que terapeuta

                    // Contar atendimentos associados
                    const atendsDoExtra = atendsPorExtraId.get(extra._id) || [];
                    const countAtends = atendsDoExtra.length;

                    return {
                        ...extra,
                        // Datas formatadas
                        extraDatafor: formatarData(extra.extra_data),
                        extraDatacadfor: formatarData(extra.extra_datacad),
                        extraDataedifor: formatarData(extra.extra_dataedi),
                        // Nomes populados
                        extraTeraputa: terapeuta?.usuario_nome || "N/A",        // Terapeuta do extra
                        extraUsunome: usuario?.usuario_nome || "N/A",           // Quem gerou (mesmo que terapeuta)
                        extraUsucadnome: usuarioCad?.usuario_nome || "N/A",     // Quem cadastrou
                        extrausuedinome: usuarioEdi?.usuario_nome || "N/A",     // Quem editou
                        bene_nome: bene?.bene_nome || "N/A",
                        conv_nome: conv?.conv_nome || "N/A",
                        terapia_nome: terapia?.terapia_nome || "N/A",
                        // Quantidade de atendimentos
                        countAtends
                    };
                });

                console.log(`✅ ${extrasPopulados.length} extras populados com sucesso.`);

                // --- Renderizar a view ---
                res.render('atendimento/extra/extraControle', {
                    extras: extrasPopulados,
                    benes: benesObj,
                    usuarios: usuariosObj,
                    horaages,
                    salas,
                    terapias: terapiasObj,
                    convs: convsObj,
                    anos,
                    atends: Array.from(atendsPorExtraId.values()).flat(),
                    flash
                });

            })
            .catch(err => {
                console.error("❌ Erro ao carregar dados:", err);
                console.error(err.stack);
                req.flash("error_message", "Erro ao carregar os dados. Tente novamente.");
                res.redirect('/admin/erro');
            });

        } catch (error) {
            console.error("❌ Erro inesperado no controleExtra:", error);
            req.flash("error_message", "Erro interno.");
            res.redirect('/admin/erro');
        }
    },
    controleExtra(req, res, resposta) {
        const flash = new Resposta();

        try {
            // ✅ Carrega apenas os anos (o que é necessário para o filtro)
            Ano.find()
                .sort({ ano_nome: 1 }) // Ordena por nome (ex: 2023, 2024, 2025)
                .then((anos) => {
                    console.log(`✅ ${anos.length} anos carregados para o filtro.`);
                    
                    // Renderiza a view com apenas os anos
                    res.render('atendimento/extra/extraControle', {
                        anos: anos,
                        flash: flash
                    });
                })
                .catch((err) => {
                    console.error("❌ Erro ao carregar anos:", err);
                    req.flash("error_message", "Erro ao carregar anos para o filtro.");
                    res.redirect('/admin/erro');
                });

        } catch (error) {
            console.error("❌ Erro inesperado no controleExtra:", error);
            req.flash("error_message", "Erro interno.");
            res.redirect('/admin/erro');
        }
    },
    controleExtraFil(req, res, resposta) {
        const flash = new Resposta();
        try {
            console.log("🔧 Iniciando controle de extras - Buscando dados...");

            // Receber mesAtend e anoAtend do corpo da requisição POST
            const { mesAtend, anoAtend } = req.body;

            // Converter para número
            const mesAtual = parseInt(mesAtend, 10);
            const anoAtual = parseInt(anoAtend, 10);

            // Validar se os valores são válidos
            if (isNaN(mesAtual) || isNaN(anoAtual) || mesAtual < 0 || mesAtual > 11) {
                req.flash("error_message", "Mês ou ano inválido fornecido.");
                return res.redirect('/admin/extra/controle'); // ajuste a rota conforme necessário
            }

            console.log(`📅 Filtrando extras para mês: ${mesAtual + 1}/${anoAtual}`);

            // --- Promises para buscar todos os dados necessários ---
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
                Conv.find(),
                Ano.find(),
                Atend.find() // Todos os atendimentos
            ])
            .then(([extras, benes, usuarios, horaages, salas, terapias, convs, anos, atends]) => {
                console.log(`✅ Dados carregados: ${extras.length} extras, ${atends.length} atendimentos`);

                // --- Converter todos os documentos Mongoose para objetos simples com _id como string ---
                const extrasObj = extras.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    if (obj.extra_beneid) obj.extra_beneid = obj.extra_beneid.toString();
                    if (obj.extra_convid) obj.extra_convid = obj.extra_convid.toString();
                    if (obj.extra_terapiaid) obj.extra_terapiaid = obj.extra_terapiaid.toString();
                    if (obj.extra_usuid) obj.extra_usuid = obj.extra_usuid.toString();       // Terapeuta do extra
                    if (obj.extra_usucad) obj.extra_usucad = obj.extra_usucad.toString();   // Quem cadastrou
                    if (obj.extra_usuedi) obj.extra_usuedi = obj.extra_usuedi.toString();   // Quem editou
                    return obj;
                });

                const usuariosObj = usuarios.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    return obj;
                });

                const benesObj = benes.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));
                const convsObj = convs.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));
                const terapiasObj = terapias.map(doc => ({ ...doc.toObject(), _id: doc._id.toString() }));

                // --- Filtrar extras com base no mês e ano recebidos do formulário ---
                const extrasFiltrados = extrasObj.filter(extra => {
                    if (!extra.extra_data) return false;
                    const data = new Date(extra.extra_data);
                    return data.getMonth() === mesAtual && data.getFullYear() === anoAtual;
                });

                console.log(`📅 ${extrasFiltrados.length} extras encontrados no mês ${mesAtual + 1}/${anoAtual}`);

                // --- Criar mapa de atendimentos por extra_id para busca rápida ---
                const atendsObj = atends.map(doc => {
                    const obj = doc.toObject();
                    obj._id = obj._id.toString();
                    if (obj.atend_extraid) obj.atend_extraid = obj.atend_extraid.toString();
                    if (obj.atend_beneid) obj.atend_beneid = obj.atend_beneid.toString();
                    if (obj.atend_convid) obj.atend_convid = obj.atend_convid.toString();
                    if (obj.atend_terapiaid) obj.atend_terapiaid = obj.atend_terapiaid.toString();
                    if (obj.atend_terapeutaid) obj.atend_terapeutaid = obj.atend_terapeutaid.toString();
                    if (obj.atend_usuidedi) obj.atend_usuidedi = obj.atend_usuidedi.toString();

                    // Formata a data do atendimento
                    obj.atendDataFor = obj.atend_atenddata
                        ? new Date(obj.atend_atenddata).toISOString().slice(0, 10)
                        : "";
                    return obj;
                });

                const atendsPorExtraId = new Map();
                atendsObj.forEach(atend => {
                    const extraId = atend.atend_extraid;
                    if (extraId) {
                        if (!atendsPorExtraId.has(extraId)) {
                            atendsPorExtraId.set(extraId, []);
                        }
                        atendsPorExtraId.get(extraId).push(atend);
                    }
                });

                // --- Função auxiliar para formatar data ---
                const formatarData = (data) => {
                    return data ? new Date(data).toISOString().slice(0, 10) : "";
                };

                // --- Mapear extras com dados populados ---
                const extrasPopulados = extrasFiltrados.map(extra => {
                    const bene = benesObj.find(b => b._id === extra.extra_beneid);
                    const conv = convsObj.find(c => c._id === extra.extra_convid);
                    const terapia = terapiasObj.find(t => t._id === extra.extra_terapiaid);

                    const terapeuta = usuariosObj.find(u => u._id === extra.extra_usuid);
                    const usuarioCad = usuariosObj.find(u => u._id === extra.extra_usucad);
                    const usuarioEdi = usuariosObj.find(u => u._id === extra.extra_usuedi);
                    const usuario = terapeuta; // Mesmo que terapeuta

                    const atendsDoExtra = atendsPorExtraId.get(extra._id) || [];
                    const countAtends = atendsDoExtra.length;

                    return {
                        ...extra,
                        extraDatafor: formatarData(extra.extra_data),
                        extraDatacadfor: formatarData(extra.extra_datacad),
                        extraDataedifor: formatarData(extra.extra_dataedi),
                        extraTeraputa: terapeuta?.usuario_nome || "N/A",
                        extraUsunome: usuario?.usuario_nome || "N/A",
                        extraUsucadnome: usuarioCad?.usuario_nome || "N/A",
                        extrausuedinome: usuarioEdi?.usuario_nome || "N/A",
                        bene_nome: bene?.bene_nome || "N/A",
                        conv_nome: conv?.conv_nome || "N/A",
                        terapia_nome: terapia?.terapia_nome || "N/A",
                        countAtends
                    };
                });

                console.log(`✅ ${extrasPopulados.length} extras populados com sucesso.`);

                // --- Renderizar a view com os dados ---
                res.render('atendimento/extra/extraControle', {
                    extras: extrasPopulados,
                    benes: benesObj,
                    usuarios: usuariosObj,
                    horaages,
                    salas,
                    terapias: terapiasObj,
                    convs: convsObj,
                    anos,
                    atends: Array.from(atendsPorExtraId.values()).flat(),
                    flash,
                    // Passar os valores selecionados de volta para o template (para manter o formulário preenchido)
                    mesAtend: mesAtual.toString(),
                    anoAtend: anoAtual
                });
            })
            .catch(err => {
                console.error("❌ Erro ao carregar dados:", err);
                console.error(err.stack);
                req.flash("error_message", "Erro ao carregar os dados. Tente novamente.");
                res.redirect('/admin/erro');
            });
        } catch (error) {
            console.error("❌ Erro inesperado no controleExtra:", error);
            req.flash("error_message", "Erro interno.");
            res.redirect('/admin/erro');
        }
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
                Sala.find().then((sala)=>{
                Terapia.find().then((terapia)=>{
                    Usuario.find().then((usuario)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find().then((beneficiarios)=>{
                            Bene.findOne({_id: extra.extra_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Horaage.find().then((horaage)=>{
                                    res.render("atendimento/extra/extraEdi", { usuarios: usuario, salas: sala, horaages: horaage, extra, convs: conv, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    carregaExtraediNew(req, res) {
        let usuarioAtual = req.cookies['idUsu'];
        Extra.findById(req.params.id).then((extra) => {
            console.log("ID: " + extra._id);
            Conv.find().then((conv) => {
                Terapia.find().then((terapia) => {
                    console.log("Listagem Realizada de terapias");
                    Usuario.find({ "usuario_funcaoid": "6241030bfbcc51f47c720a0b" }).then((terapeuta) => {
                        // Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0)); // Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário");
                        Bene.find().then((beneficiarios) => {
                            Bene.findOne({ _id: extra.extra_beneid }).then((bene) => {
                                // bene.sort(...); // Esta linha estava comentada e não é necessária aqui pois é um único documento
                                console.log("Listagem Realizada de beneficiario especifico");
                                Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 }).then((horaage) => { // 'horaage' é definida aqui
                                    console.log("Listagem Realizada de horarios");
                                    // Corrigido: 'horaege' -> 'horaage'
                                    res.render("atendimento/extra/extraEdi", {
                                        horaages: horaage, // <-- Corrigido aqui
                                        extra: extra,
                                        convs: conv,
                                        terapias: terapia,
                                        terapeutas: terapeuta,
                                        bene: bene,
                                        usuarioAtual: usuarioAtual,
                                        benes: beneficiarios
                                    });
                                }).catch((err) => { // Tratamento de erro para Horaage.find
                                    console.log("Erro ao buscar horários:", err);
                                    req.flash("error_message", "Houve um erro ao buscar os horários!");
                                    res.render('admin/erro'); // Ou redirecionar
                                });
                            }).catch((err) => { // Tratamento de erro para Bene.findOne
                                console.log("Erro ao buscar beneficiário específico:", err);
                                req.flash("error_message", "Houve um erro ao buscar o beneficiário!");
                                res.render('admin/erro');
                            });
                        }).catch((err) => { // Tratamento de erro para Bene.find
                            console.log("Erro ao buscar beneficiários:", err);
                            req.flash("error_message", "Houve um erro ao buscar os beneficiários!");
                            res.render('admin/erro');
                        });
                    }).catch((err) => { // Tratamento de erro para Usuario.find
                        console.log("Erro ao buscar terapeutas:", err);
                        req.flash("error_message", "Houve um erro ao buscar os terapeutas!");
                        res.render('admin/erro');
                    });
                }).catch((err) => { // Tratamento de erro para Terapia.find
                    console.log("Erro ao buscar terapias:", err);
                    req.flash("error_message", "Houve um erro ao buscar as terapias!");
                    res.render('admin/erro');
                });
            }).catch((err) => { // Tratamento de erro para Conv.find
                console.log("Erro ao buscar convênios:", err);
                req.flash("error_message", "Houve um erro ao buscar os convênios!");
                res.render('admin/erro');
            });
        }).catch((err) => { // Tratamento de erro para Extra.findById
            console.log("Erro ao buscar o extra para edição:", err);
            req.flash("error_message", "Houve um erro ao encontrar o registro para edição!");
            res.render('admin/erro');
        });
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
     * Função que copia agendamentos extras (agenda_extra e agenda_cobrarextra = true)
     * de um mês específico para a coleção tb_extra, evitando duplicidades.
     */
    extraCopiarOLD6: async (req, res) => {
        let flash = new Resposta()
        let resultado;
        console.log("Iniciando função de cópia de agendamentos extras para controle");

        try {
            const { anoAtend, mesAtend } = req.body;

            // ✅ Validação
            if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
                req.flash("error_message", "Ano ou mês inválido.");
                return res.redirect('/atendimento/extra/lisF');
            }

            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);

            const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
            const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

            console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

            const agendamentos = await Agenda.find({
                agenda_data: { $gte: dataIni, $lte: dataFim },
                agenda_extra: true,
                agenda_cobrarextra: true
            }).lean();

            if (agendamentos.length === 0) {
                req.flash("info_message", "Nenhum agendamento extra encontrado.");
                this.filtraExtra(req,res, flash);
            }

            console.log(`✅ Encontrados ${agendamentos.length} agendamentos para copiar.`);

            const usuarioId = req.user?._id || req.cookies['idUsu'];
            if (!usuarioId) {
                req.flash("error_message", "Usuário não autenticado.");
                return res.redirect('/atendimento/extra/lisF');
            }

            const agora = new Date();
            const dataExportacao = agora.toISOString().split('T')[0];
            const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

            // 🧠 Extrai os _id das agendas para verificar duplicatas
            const agendaIds = agendamentos.map(ag => ag._id); // _id já é ObjectId

            // 🔎 Verifica quais já foram copiados (pelo extra_copiado)
            const jaCopiados = await Extra.find({
                extra_copiado: { $in: agendaIds }
            }).select('extra_copiado');

            const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));
            console.log(`🔍 Já foram copiados: ${jaCopiadosSet.size} registros.`);

            // 🧮 Filtra: só os que ainda não foram copiados
            const novosExtras = agendamentos
                .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
                .map(ag => {
                    const dataAgenda = new Date(ag.agenda_data);
                    const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                    const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                    const horaFormatada = `${hora}:${minuto}`;

                    return new Extra({
                        // Campos copiados
                        extra_data: ag.agenda_data,
                        extra_hora: horaFormatada,
                        extra_data_semana: ag.agenda_data_semana,
                        extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                        extra_beneid: ag.agenda_beneid,
                        extra_convid: ag.agenda_convid,
                        extra_salaid: ag.agenda_salaid,
                        extra_terapiaid: ag.agenda_terapiaid,
                        extra_usuid: ag.agenda_usuid,
                        extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                        extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                        extra_migrado: ag.agenda_migrado,
                        extra_datacad: ag.agenda_datacad,
                        extra_dataedi: ag.agenda_dataedi,
                        extra_categoria: ag.agenda_categoria,
                        extra_org: ag.agenda_org,
                        extra_obs: ag.agenda_obs,
                        extra_aux: ag.agenda_aux,
                        extra_temp: ag.agenda_temp,
                        extra_tempId: ag.agenda_tempId,
                        extra_tempmotivo: ag.agenda_tempmotivo,
                        extra_extra: ag.agenda_extra,
                        extra_cobrarextra: ag.agenda_cobrarextra,
                        extra_evolucao: ag.agenda_evolucao,
                        extra_copia: ag.agenda_copia,
                        extra_selo: ag.agenda_selo,
                        extra_dataSelo: ag.agenda_dataSelo,
                        extra_atrazo: ag.agenda_atrazo,
                        extra_rel: ag.agenda_rel,
                        extra_turnoFalta: ag.agenda_turnoFalta,
                        extra_faltaId: ag.agenda_faltaId,
                        extra_falta: ag.agenda_falta,
                        extra_usuedi: ag.agenda_usuedi,
                        extra_log: ag.agenda_log,
                        extra_usucad: ag.agenda_usucad,

                        // Campos exclusivos
                        extra_tipo: "Padrão",
                        extra_auditado: false,
                        extra_auditadoObs: "",
                        extra_copiado: ag._id, // ✅ _id da Agenda (garante unicidade)
                        extra_dtaExportado: dataExportacao,
                        extra_horaExportado: horaExportacao,
                        extra_usuidExportou: usuarioId,
                        extra_extraStatus: "Aguardando",
                        extra_extraStatusPg: false
                    });
                });

            if (novosExtras.length === 0) {
                req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
                console.log("🟡 Nenhum novo registro para inserir.");
            } else {
                const extrainsert = await Extra.insertMany(novosExtras, { ordered: false });
                const inseridos = extrainsert.length;
                console.log(`✅ ${inseridos} novos registros copiados para tb_extra.`);
                req.flash("success_message", `Exportação concluída! ${inseridos} novos registros criados.`);
            }

            console.log("🏁 Processo de cópia finalizado com sucesso.");
            //res.render('/menu/atendimento/extra/controleF', {anoAtend, mesAtend});
            if (resultado === true) {
                flash.sucesso = "true";
                flash.texto = "Cópia dos extras!";
            } else {
                flash.sucesso = "false";
                flash.texto = "Erro ao cópia dos extras: " + res.retorno;
            }
            let aaa = extraClass.filtraExtra(req,res,flash);
            console.log(aaa);

        } catch (error) {
            console.error("❌ Erro ao copiar agendamentos:", error);

            flash.sucesso = "false";
            flash.texto = "Erro ao cópia dos extras: "+error;

            console.log("⚠️ Processo concluído com avisos.");
            this.filtraExtra(req,res,flash);
        }
    },
/**
 * Função que copia agendamentos extras (agenda_extra e agenda_cobrarextra = true)
 * de um mês específico para a coleção tb_extra, evitando duplicidades.
 * Após a cópia, chama filtraExtra para exibir os dados com os filtros aplicados.
 */
extraCopiarOLD2: async function (req, res) {
    const flash = new Resposta();
    console.log("Iniciando função de cópia de agendamentos extras para controle");

    try {
        const { anoAtend, mesAtend } = req.body;

        // ✅ Validação
        if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
            req.flash("error_message", "Ano ou mês inválido.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);

        const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

        console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

        const agendamentos = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).lean();

        if (agendamentos.length === 0) {
            req.flash("info_message", "Nenhum agendamento extra encontrado.");
            // Passa os filtros para manter na view
            flash.filtroAno = anoAtend;
            flash.filtroMes = mesAtend;
            return this.filtraExtra(req, res, flash);
        }

        console.log(`✅ Encontrados ${agendamentos.length} agendamentos para copiar.`);

        const usuarioId = req.user?._id || req.cookies['idUsu'];
        if (!usuarioId) {
            req.flash("error_message", "Usuário não autenticado.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const agora = new Date();
        const dataExportacao = agora.toISOString().split('T')[0];
        const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

        // 🧠 Extrai os _id das agendas para verificar duplicatas
        const agendaIds = agendamentos.map(ag => ag._id);

        // 🔎 Verifica quais já foram copiados
        const jaCopiados = await Extra.find({
            extra_copiado: { $in: agendaIds }
        }).select('extra_copiado');

        const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));
        console.log(`🔍 Já foram copiados: ${jaCopiadosSet.size} registros.`);

        // 🧮 Filtra: só os que ainda não foram copiados
        const novosExtras = agendamentos
            .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
            .map(ag => {
                const dataAgenda = new Date(ag.agenda_data);
                const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}`;

                return new Extra({
                    // Campos copiados da agenda
                    extra_data: ag.agenda_data,
                    extra_hora: horaFormatada,
                    extra_data_semana: ag.agenda_data_semana,
                    extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                    extra_beneid: ag.agenda_beneid,
                    extra_convid: ag.agenda_convid,
                    extra_salaid: ag.agenda_salaid,
                    extra_terapiaid: ag.agenda_terapiaid,
                    extra_usuid: ag.agenda_usuid,
                    extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                    extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                    extra_migrado: ag.agenda_migrado,
                    extra_datacad: ag.agenda_datacad,
                    extra_dataedi: ag.agenda_dataedi,
                    extra_categoria: ag.agenda_categoria,
                    extra_org: ag.agenda_org,
                    extra_obs: ag.agenda_obs,
                    extra_aux: ag.agenda_aux,
                    extra_temp: ag.agenda_temp,
                    extra_tempId: ag.agenda_tempId,
                    extra_tempmotivo: ag.agenda_tempmotivo,
                    extra_extra: ag.agenda_extra,
                    extra_cobrarextra: ag.agenda_cobrarextra,
                    extra_evolucao: ag.agenda_evolucao,
                    extra_copia: ag.agenda_copia,
                    extra_selo: ag.agenda_selo,
                    extra_dataSelo: ag.agenda_dataSelo,
                    extra_atrazo: ag.agenda_atrazo,
                    extra_rel: ag.agenda_rel,
                    extra_turnoFalta: ag.agenda_turnoFalta,
                    extra_faltaId: ag.agenda_faltaId,
                    extra_falta: ag.agenda_falta,
                    extra_usuedi: ag.agenda_usuedi,
                    extra_log: ag.agenda_log,
                    extra_usucad: ag.agenda_usucad,

                    // Campos exclusivos do Extra
                    extra_tipo: "Padrão",
                    extra_auditado: false,
                    extra_auditadoObs: "",
                    extra_copiado: ag._id,
                    extra_dtaExportado: dataExportacao,
                    extra_horaExportado: horaExportacao,
                    extra_usuidExportou: usuarioId,
                    extra_extraStatus: "Aguardando",
                    extra_extraStatusPg: false
                });
            });

        if (novosExtras.length === 0) {
            req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
            console.log("🟡 Nenhum novo registro para inserir.");
        } else {
            const resultado = await Extra.insertMany(novosExtras, { ordered: false });
            const inseridos = resultado.length;
            console.log(`✅ ${inseridos} novos registros copiados para tb_extra.`);
            req.flash("success_message", `Exportação concluída! ${inseridos} novos registros criados.`);
        }

        console.log("🏁 Processo de cópia finalizado com sucesso.");

        // ✅ Prepara flash com os filtros para manter na view
        flash.filtroAno = anoAtend;
        flash.filtroMes = mesAtend;
        flash.sucesso = "true";
        flash.texto = "Cópia dos extras realizada com sucesso!";

        // ✅ Chama filtraExtra com os dados do filtro
        return this.filtraExtra(req, res, flash);

    } catch (error) {
        console.error("❌ Erro ao copiar agendamentos:", error);

        // Define mensagem de erro
        if (error.code === 11000) {
            req.flash("info_message", "Alguns registros já foram copiados anteriormente (duplicatas ignoradas).");
        } else {
            req.flash("error_message", "Erro ao copiar os registros.");
        }

        // ✅ Passa filtros mesmo em caso de erro
        const { anoAtend, mesAtend } = req.body;
        const flash = new Resposta();
        flash.filtroAno = anoAtend;
        flash.filtroMes = mesAtend;
        flash.sucesso = "false";
        flash.texto = "Erro ao copiar os extras: " + error.message;

        return this.filtraExtra(req, res, flash);
    }
},
/**
 * Copia agendamentos extras para tb_extra e redireciona para controle com filtros
 */
extraCopiarOLD3: async (req, res) => {
    const flash = new Resposta();
    console.log("Iniciando função de cópia de agendamentos extras para controle");

    try {
        const { anoAtend, mesAtend } = req.body;

        // ✅ Validação
        if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
            req.flash("error_message", "Ano ou mês inválido.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);

        const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

        console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

        const agendamentos = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).lean();

        if (agendamentos.length === 0) {
            req.flash("info_message", "Nenhum agendamento extra encontrado.");
            // ✅ Chama filtraExtra com os filtros
            return fncExtra.filtraExtra(req, res, {
                ...flash,
                filtroAno: anoAtend,
                filtroMes: mesAtend
            });
        }

        console.log(`✅ Encontrados ${agendamentos.length} agendamentos para copiar.`);

        const usuarioId = req.user?._id || req.cookies['idUsu'];
        if (!usuarioId) {
            req.flash("error_message", "Usuário não autenticado.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const agora = new Date();
        const dataExportacao = agora.toISOString().split('T')[0];
        const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

        const agendaIds = agendamentos.map(ag => ag._id);
        const jaCopiados = await Extra.find({
            extra_copiado: { $in: agendaIds }
        }).select('extra_copiado');

        const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));
        console.log(`🔍 Já foram copiados: ${jaCopiadosSet.size} registros.`);

        const novosExtras = agendamentos
            .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
            .map(ag => {
                const dataAgenda = new Date(ag.agenda_data);
                const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}`;

                return new Extra({
                    extra_data: ag.agenda_data,
                    extra_hora: horaFormatada,
                    extra_data_semana: ag.agenda_data_semana,
                    extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                    extra_beneid: ag.agenda_beneid,
                    extra_convid: ag.agenda_convid,
                    extra_salaid: ag.agenda_salaid,
                    extra_terapiaid: ag.agenda_terapiaid,
                    extra_usuid: ag.agenda_usuid,
                    extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                    extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                    extra_migrado: ag.agenda_migrado,
                    extra_datacad: ag.agenda_datacad,
                    extra_dataedi: ag.agenda_dataedi,
                    extra_categoria: ag.agenda_categoria,
                    extra_org: ag.agenda_org,
                    extra_obs: ag.agenda_obs,
                    extra_aux: ag.agenda_aux,
                    extra_temp: ag.agenda_temp,
                    extra_tempId: ag.agenda_tempId,
                    extra_tempmotivo: ag.agenda_tempmotivo,
                    extra_extra: ag.agenda_extra,
                    extra_cobrarextra: ag.agenda_cobrarextra,
                    extra_evolucao: ag.agenda_evolucao,
                    extra_copia: ag.agenda_copia,
                    extra_selo: ag.agenda_selo,
                    extra_dataSelo: ag.agenda_dataSelo,
                    extra_atrazo: ag.agenda_atrazo,
                    extra_rel: ag.agenda_rel,
                    extra_turnoFalta: ag.agenda_turnoFalta,
                    extra_faltaId: ag.agenda_faltaId,
                    extra_falta: ag.agenda_falta,
                    extra_usuedi: ag.agenda_usuedi,
                    extra_log: ag.agenda_log,
                    extra_usucad: ag.agenda_usucad,

                    // Campos exclusivos
                    extra_tipo: "Padrão",
                    extra_auditado: false,
                    extra_auditadoObs: "",
                    extra_copiado: ag._id,
                    extra_dtaExportado: dataExportacao,
                    extra_horaExportado: horaExportacao,
                    extra_usuidExportou: usuarioId,
                    extra_extraStatus: "Aguardando",
                    extra_extraStatusPg: false
                });
            });

        if (novosExtras.length === 0) {
            req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
        } else {
            const resultado = await Extra.insertMany(novosExtras, { ordered: false });
            const inseridos = resultado.length;
            console.log(`✅ ${inseridos} novos registros copiados.`);
            req.flash("success_message", `Exportação concluída! ${inseridos} novos registros criados.`);
        }

        console.log("🏁 Processo de cópia finalizado com sucesso.");

        // ✅ Prepara flash com os filtros
        flash.filtroAno = anoAtend;
        flash.filtroMes = mesAtend;
        flash.sucesso = "true";
        flash.texto = "Cópia realizada com sucesso!";

        // ✅ Chama filtraExtra diretamente do módulo
        return fncExtra.filtraExtra(req, res, flash);

    } catch (error) {
        console.error("❌ Erro CRÍTICO em extraCopiar:", error);

        // ✅ Garante que o erro não quebre tudo
        req.flash("error_message", "Erro ao copiar agendamentos. Veja o console.");
        
        // ✅ Mesmo em erro, tenta chamar filtraExtra com dados
        const { anoAtend, mesAtend } = req.body;
        const flashErro = new Resposta();
        flashErro.filtroAno = anoAtend;
        flashErro.filtroMes = mesAtend;
        flashErro.sucesso = "false";
        flashErro.texto = "Erro: " + error.message;

        // ✅ Evita loop de erro
        try {
            return fncExtra.filtraExtra(req, res, flashErro);
        } catch (innerError) {
            console.error("❌ Erro ao chamar filtraExtra após falha:", innerError);
            return res.redirect('/admin/erro'); // fallback
        }
    }
},
/**
 * Função que copia agendamentos extras para tb_extra e chama filtraExtra com filtros
 */
extraCopiarOLD4: async function (req, res) { // ✅ async function, não arrow
    const flash = new Resposta();
    console.log("Iniciando função de cópia de agendamentos extras para controle");

    try {
        const { anoAtend, mesAtend } = req.body;

        // ✅ Validação
        if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
            req.flash("error_message", "Ano ou mês inválido.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);

        const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

        console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

        const agendamentos = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).lean();

        if (agendamentos.length === 0) {
            req.flash("info_message", "Nenhum agendamento extra encontrado.");
            flash.filtroAno = anoAtend;
            flash.filtroMes = mesAtend;
            return this.filtraExtra(req, res, flash); // ✅ this funciona agora
        }

        console.log(`✅ Encontrados ${agendamentos.length} agendamentos para copiar.`);

        const usuarioId = req.user?._id || req.cookies['idUsu'];
        if (!usuarioId) {
            req.flash("error_message", "Usuário não autenticado.");
            return res.redirect('/atendimento/extra/lisF');
        }

        const agora = new Date();
        const dataExportacao = agora.toISOString().split('T')[0];
        const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

        const agendaIds = agendamentos.map(ag => ag._id);
        const jaCopiados = await Extra.find({
            extra_copiado: { $in: agendaIds }
        }).select('extra_copiado');

        const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));
        console.log(`🔍 Já foram copiados: ${jaCopiadosSet.size} registros.`);

        const novosExtras = agendamentos
            .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
            .map(ag => {
                const dataAgenda = new Date(ag.agenda_data);
                const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}`;

                return new Extra({
                    extra_data: ag.agenda_data,
                    extra_hora: horaFormatada,
                    extra_data_semana: ag.agenda_data_semana,
                    extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                    extra_beneid: ag.agenda_beneid,
                    extra_convid: ag.agenda_convid,
                    extra_salaid: ag.agenda_salaid,
                    extra_terapiaid: ag.agenda_terapiaid,
                    extra_usuid: ag.agenda_usuid,
                    extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                    extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                    extra_migrado: ag.agenda_migrado,
                    extra_datacad: ag.agenda_datacad,
                    extra_dataedi: ag.agenda_dataedi,
                    extra_categoria: ag.agenda_categoria,
                    extra_org: ag.agenda_org,
                    extra_obs: ag.agenda_obs,
                    extra_aux: ag.agenda_aux,
                    extra_temp: ag.agenda_temp,
                    extra_tempId: ag.agenda_tempId,
                    extra_tempmotivo: ag.agenda_tempmotivo,
                    extra_extra: ag.agenda_extra,
                    extra_cobrarextra: ag.agenda_cobrarextra,
                    extra_evolucao: ag.agenda_evolucao,
                    extra_copia: ag.agenda_copia,
                    extra_selo: ag.agenda_selo,
                    extra_dataSelo: ag.agenda_dataSelo,
                    extra_atrazo: ag.agenda_atrazo,
                    extra_rel: ag.agenda_rel,
                    extra_turnoFalta: ag.agenda_turnoFalta,
                    extra_faltaId: ag.agenda_faltaId,
                    extra_falta: ag.agenda_falta,
                    extra_usuedi: ag.agenda_usuedi,
                    extra_log: ag.agenda_log,
                    extra_usucad: ag.agenda_usucad,

                    // Campos exclusivos
                    extra_tipo: "Padrão",
                    extra_auditado: false,
                    extra_auditadoObs: "",
                    extra_copiado: ag._id,
                    extra_dtaExportado: dataExportacao,
                    extra_horaExportado: horaExportacao,
                    extra_usuidExportou: usuarioId,
                    extra_extraStatus: "Aguardando",
                    extra_extraStatusPg: false
                });
            });

        if (novosExtras.length === 0) {
            req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
        } else {
            const resultado = await Extra.insertMany(novosExtras, { ordered: false });
            const inseridos = resultado.length;
            console.log(`✅ ${inseridos} novos registros copiados para tb_extra.`);
            req.flash("success_message", `Exportação concluída! ${inseridos} novos registros criados.`);
        }

        console.log("🏁 Processo de cópia finalizado com sucesso.");

        // ✅ Prepara flash com filtros
        flash.filtroAno = anoAtend;
        flash.filtroMes = mesAtend;
        flash.sucesso = "true";
        flash.texto = "Cópia realizada com sucesso!";

        // ✅ Chama filtraExtra do mesmo módulo
        return this.filtraExtra(req, res, flash);

    } catch (error) {
        console.error("❌ Erro ao copiar agendamentos:", error);

        const { anoAtend, mesAtend } = req.body;
        const flashErro = new Resposta();
        flashErro.filtroAno = anoAtend;
        flashErro.filtroMes = mesAtend;
        flashErro.sucesso = "false";
        flashErro.texto = "Erro: " + error.message;

        try {
            return this.filtraExtra(req, res, flashErro); // ✅ this funciona com async function
        } catch (innerError) {
            console.error("❌ Erro ao chamar filtraExtra:", innerError);
            return res.redirect('/admin/erro');
        }
    }
},
/**
 * Copia agendamentos extras para tb_extra e retorna para a mesma página
 */
extraCopiarOLD5: async (req, res) => {
    console.log("🚀 Iniciando cópia de agendamentos extras");

    try {
        const { anoAtend, mesAtend } = req.body;

        // ✅ Validação
        if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
            req.flash("error_message", "Ano ou mês inválido.");
            return res.redirect('back'); // Volta para a mesma página
        }

        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);

        const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

        console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

        const agendamentos = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).lean();

        if (agendamentos.length === 0) {
            req.flash("info_message", "Nenhum agendamento extra encontrado.");
            return res.redirect('back');
        }

        console.log(`✅ Encontrados ${agendamentos.length} agendamentos.`);

        const usuarioId = req.user?._id || req.cookies['idUsu'];
        if (!usuarioId) {
            req.flash("error_message", "Usuário não autenticado.");
            return res.redirect('back');
        }

        const agora = new Date();
        const dataExportacao = agora.toISOString().split('T')[0];
        const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

        // 🧠 IDs das agendas já copiadas
        const agendaIds = agendamentos.map(ag => ag._id);
        const jaCopiados = await Extra.find({ extra_copiado: { $in: agendaIds } }).select('extra_copiado');
        const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));

        // 🧮 Filtra os novos
        const novosExtras = agendamentos
            .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
            .map(ag => {
                const dataAgenda = new Date(ag.agenda_data);
                const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}`;

                return new Extra({
                    extra_data: ag.agenda_data,
                    extra_hora: horaFormatada,
                    extra_data_semana: ag.agenda_data_semana,
                    extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                    extra_beneid: ag.agenda_beneid,
                    extra_convid: ag.agenda_convid,
                    extra_salaid: ag.agenda_salaid,
                    extra_terapiaid: ag.agenda_terapiaid,
                    extra_usuid: ag.agenda_usuid,
                    extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                    extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                    extra_migrado: ag.agenda_migrado,
                    extra_datacad: ag.agenda_datacad,
                    extra_dataedi: ag.agenda_dataedi,
                    extra_categoria: ag.agenda_categoria,
                    extra_org: ag.agenda_org,
                    extra_obs: ag.agenda_obs,
                    extra_aux: ag.agenda_aux,
                    extra_temp: ag.agenda_temp,
                    extra_tempId: ag.agenda_tempId,
                    extra_tempmotivo: ag.agenda_tempmotivo,
                    extra_extra: ag.agenda_extra,
                    extra_cobrarextra: ag.agenda_cobrarextra,
                    extra_evolucao: ag.agenda_evolucao,
                    extra_copia: ag.agenda_copia,
                    extra_selo: ag.agenda_selo,
                    extra_dataSelo: ag.agenda_dataSelo,
                    extra_atrazo: ag.agenda_atrazo,
                    extra_rel: ag.agenda_rel,
                    extra_turnoFalta: ag.agenda_turnoFalta,
                    extra_faltaId: ag.agenda_faltaId,
                    extra_falta: ag.agenda_falta,
                    extra_usuedi: ag.agenda_usuedi,
                    extra_log: ag.agenda_log,
                    extra_usucad: ag.agenda_usucad,

                    // Campos exclusivos
                    extra_tipo: "Padrão",
                    extra_auditado: false,
                    extra_auditadoObs: "",
                    extra_copiado: ag._id,
                    extra_dtaExportado: dataExportacao,
                    extra_horaExportado: horaExportacao,
                    extra_usuidExportou: usuarioId,
                    extra_extraStatus: "Aguardando",
                    extra_extraStatusPg: false
                });
            });

        if (novosExtras.length === 0) {
            req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
        } else {
            const resultado = await Extra.insertMany(novosExtras, { ordered: false });
            const inseridos = resultado.length;
            req.flash("success_message", `✅ ${inseridos} novos registros copiados!`);
            console.log(`✅ ${inseridos} registros inseridos.`);
        }

        console.log("🏁 Cópia finalizada com sucesso.");
        return res.redirect('back'); // Volta para a mesma página

    } catch (error) {
        console.error("❌ Erro na cópia:", error);
        if (error.code === 11000) {
            req.flash("info_message", "Alguns registros já foram copiados (duplicatas ignoradas).");
        } else {
            req.flash("error_message", "Erro ao copiar os extras.");
        }
        return res.redirect('back'); // Volta sem quebrar
    }
},
/**
 * Copia agendamentos extras para tb_extra e retorna para a mesma página
 */
extraCopiar: async (req, res) => {
    console.log("🚀 Iniciando cópia de agendamentos extras");

    try {
        let flash = new Resposta();
        let resultado;

        const { anoAtend, mesAtend } = req.body;

        // ✅ Validação
        if (!anoAtend || !mesAtend || isNaN(anoAtend) || isNaN(mesAtend)) {
            //req.flash("error_message", "Ano ou mês inválido.");
            //return res.redirect('back'); // Volta para a mesma página
            flash.sucesso = "false";
            flash.texto = "Ano ou mês inválido.";
        }

        const ano = parseInt(anoAtend);
        const mes = parseInt(mesAtend);

        const dataIni = new Date(Date.UTC(ano, mes, 1, 0, 0, 0, 0));
        const dataFim = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));

        console.log(`🔍 Buscando agendamentos de ${dataIni.toISOString()} até ${dataFim.toISOString()}`);

        const agendamentos = await Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        }).lean();

        if (agendamentos.length === 0) {
            //req.flash("info_message", "Nenhum agendamento extra encontrado.");
            //return res.redirect('back');
            flash.sucesso = "false";
            flash.texto = "Nenhum agendamento extra encontrado.";
        }

        console.log(`✅ Encontrados ${agendamentos.length} agendamentos.`);

        const usuarioId = req.user?._id || req.cookies['idUsu'];
        if (!usuarioId) {
            //req.flash("error_message", "Usuário não autenticado.");
            //return res.redirect('back');
            flash.sucesso = "false";
            flash.texto = "Usuário não autenticado.";
        }

        const agora = new Date();
        const dataExportacao = agora.toISOString().split('T')[0];
        const horaExportacao = `${agora.getUTCHours().toString().padStart(2, '0')}:${agora.getUTCMinutes().toString().padStart(2, '0')}`;

        // 🧠 IDs das agendas já copiadas
        const agendaIds = agendamentos.map(ag => ag._id);
        const jaCopiados = await Extra.find({ extra_copiado: { $in: agendaIds } }).select('extra_copiado');
        const jaCopiadosSet = new Set(jaCopiados.map(e => e.extra_copiado.toString()));

        // 🧮 Filtra os novos
        const novosExtras = agendamentos
            .filter(ag => !jaCopiadosSet.has(ag._id.toString()))
            .map(ag => {
                const dataAgenda = new Date(ag.agenda_data);
                const hora = dataAgenda.getUTCHours().toString().padStart(2, '0');
                const minuto = dataAgenda.getUTCMinutes().toString().padStart(2, '0');
                const horaFormatada = `${hora}:${minuto}`;

                return new Extra({
                    extra_data: ag.agenda_data,
                    extra_hora: horaFormatada,
                    extra_data_semana: ag.agenda_data_semana,
                    extra_data_dia: fncGeral.getDataFMT(dataAgenda),
                    extra_beneid: ag.agenda_beneid,
                    extra_convid: ag.agenda_convid,
                    extra_salaid: ag.agenda_salaid,
                    extra_terapiaid: ag.agenda_terapiaid,
                    extra_usuid: ag.agenda_usuid,
                    extra_mergeterapeutaid: ag.agenda_mergeterapeutaid,
                    extra_mergeterapiaid: ag.agenda_mergeterapiaid,
                    extra_migrado: ag.agenda_migrado,
                    extra_datacad: ag.agenda_datacad,
                    extra_dataedi: ag.agenda_dataedi,
                    extra_categoria: ag.agenda_categoria,
                    extra_org: ag.agenda_org,
                    extra_obs: ag.agenda_obs,
                    extra_aux: ag.agenda_aux,
                    extra_temp: ag.agenda_temp,
                    extra_tempId: ag.agenda_tempId,
                    extra_tempmotivo: ag.agenda_tempmotivo,
                    extra_extra: ag.agenda_extra,
                    extra_cobrarextra: ag.agenda_cobrarextra,
                    extra_evolucao: ag.agenda_evolucao,
                    extra_copia: ag.agenda_copia,
                    extra_selo: ag.agenda_selo,
                    extra_dataSelo: ag.agenda_dataSelo,
                    extra_atrazo: ag.agenda_atrazo,
                    extra_rel: ag.agenda_rel,
                    extra_turnoFalta: ag.agenda_turnoFalta,
                    extra_faltaId: ag.agenda_faltaId,
                    extra_falta: ag.agenda_falta,
                    extra_usuedi: ag.agenda_usuedi,
                    extra_log: ag.agenda_log,
                    extra_usucad: ag.agenda_usucad,

                    // Campos exclusivos
                    extra_tipo: "Padrão",
                    extra_auditado: false,
                    extra_auditadoObs: "",
                    extra_copiado: ag._id,
                    extra_dtaExportado: dataExportacao,
                    extra_horaExportado: horaExportacao,
                    extra_usuidExportou: usuarioId,
                    extra_extraStatus: "Aguardando",
                    extra_extraStatusPg: false
                });
            });

        if (novosExtras.length === 0) {
            //req.flash("info_message", "Todos os agendamentos já foram exportados anteriormente.");
            flash.sucesso = "false";
            flash.texto = "Todos os agendamentos já foram exportados anteriormente.";
        } else {
            const resultado = await Extra.insertMany(novosExtras, { ordered: false });
            const inseridos = resultado.length;
            //req.flash("success_message", `✅ ${inseridos} novos registros copiados!`);
            flash.sucesso = "true"
            flash.texto = ("✅ "+resultado.length+" novos registros copiados!");
            console.log(`✅ ${inseridos} registros inseridos.`);
        }

        console.log("🏁 Cópia finalizada com sucesso.");
        //return res.redirect('back'); // Volta para a mesma página


//XXXXXXXXXXXXXXXX      não deletar      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX


        const tipoData = req.body.tipoData;
        console.log("  → anoAtend:", req.body.anoAtend);
        console.log("  → mesAtend:", req.body.mesAtend);

        if (tipoData === "Ano/Mes") {
            const ano = parseInt(anoAtend);
            const mes = parseInt(mesAtend);
            const primeiroDia = new Date(Date.UTC(ano, mes, 1));
            const ultimoDia = new Date(Date.UTC(ano, mes + 1, 0, 23, 59, 59, 999));
            dataIni = primeiroDia.toISOString();
            dataFim = ultimoDia.toISOString();
        } else {
            // Outros tipos de filtro (Semana, Dia) — mantenha seu código existente
            // ...O codigo ta terminando aqui abaixo victor 13/8/2025 16:35
            return res.render('admin/erro', { message: "Tipo de filtro não suportado." });
        }

        console.log("dataIni:", dataIni);
        console.log("dataFim:", dataFim);

        Agenda.find({
            agenda_data: { $gte: dataIni, $lte: dataFim },
            agenda_extra: true,
            agenda_cobrarextra: true
        })
        .then((agendas) => {
            const extraIds = agendas.map(extra => extra._id);

            let atendimentosPromise;
            if (extraIds.length > 0) {
                atendimentosPromise = Atend.find({ atend_extraid: { $in: extraIds } }).exec();
            } else {
                atendimentosPromise = Promise.resolve([]);
            }

            agendas.forEach((a) => {
                const data = new Date(a.agenda_data);
                let hor = data.getUTCHours().toString().padStart(2, '0');
                let min = data.getUTCMinutes().toString().padStart(2, '0');
                a.extra_hora = `${hor}:${min}`;
                a.extra_data_dia = fncGeral.getDataFMT(data);
            });

            Bene.find()
            .then((bene) => {
                bene.sort((a, b) => a.bene_nome.localeCompare(b, 'pt-BR'));

                Usuario.find({
                    usuario_status: "Ativo",
                    $or: [
                        { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                        { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                })
                .then((terapeuta) => {
                    terapeuta.sort((a, b) => a.usuario_nome.localeCompare(b, 'pt-BR'));
                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                    .then((horaage) => {
                        Sala.find()
                        .then((salas) => {
                            salas.sort((a, b) => a.sala_nome.localeCompare(b, 'pt-BR'));
                            Terapia.find()
                            .then((terapias) => {
                                Conv.find()
                                .then((convs) => {
                                    convs.sort((a, b) => a.conv_nome.localeCompare(b, 'pt-BR'));
                                    Ano.find()
                                    .then((anos) => {
                                        atendimentosPromise.then((atendimentos) => {
                                            // ✅ AQUI: repassamos os valores do filtro para a view
                                            res.render('atendimento/extra/extraLis', {
                                                extras: agendas,
                                                benes: bene,
                                                terapeutas: terapeuta,
                                                horaages: horaage,
                                                salas: salas,
                                                terapias: terapias,
                                                convs: convs,
                                                anos: anos,
                                                atends: atendimentos,
                                                flash,

                                                // ✅ Valores do filtro para manter no formulário
                                                filtroTipo: tipoData,
                                                filtroAno: anoAtend,
                                                filtroMes: mesAtend
                                            });
                                        })
                                        .catch((err) => {
                                            console.error("Erro ao carregar atendimentos:", err);
                                            res.render('atendimento/extra/extraLis', {
                                                extras: agendas,
                                                benes: bene,
                                                terapeutas: terapeuta,
                                                horaages: horaage,
                                                salas: salas,
                                                terapias: terapias,
                                                convs: convs,
                                                anos: anos,
                                                atends: [],
                                                flash,
                                                filtroTipo: tipoData,
                                                filtroAno: anoAtend,
                                                filtroMes: mesAtend
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar!");
            res.redirect('atendimento/extra/extraLis');
        });


//XXXXXXXXXXXXXXXX      não deletar      XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX



    } catch (error) {
        console.error("❌ Erro na cópia:", error);
        if (error.code === 11000) {
            //req.flash("info_message", "Alguns registros já foram copiados (duplicatas ignoradas).");
            flash.sucesso = "false";
            flash.texto = "Alguns registros já foram copiados (duplicatas ignoradas).";
        } else {
            //req.flash("error_message", "Erro ao copiar os extras.");
            flash.sucesso = "false";
            flash.texto = "Erro ao copiar os extras.";
        }
        //return res.redirect('back'); // Volta sem quebrar
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
                    this.controleExtra(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.controleExtra(req,res,flash)
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