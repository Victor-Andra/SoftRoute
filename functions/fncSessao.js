//Exports
const mongoose = require("mongoose")

//Sessao
//As classe tem que ser declaradas antes das tabelas
const sessaoClass = require("../models/sessao")
const Sessao = mongoose.model("tb_sessao")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const respostaClass = require("../models/resposta")
const agendaClass = require("../models/agenda")
//tabelas Extrangeiras

const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Terapia = mongoose.model("tb_terapia")
const Usuario = mongoose.model("tb_usuario")
const Resposta = mongoose.model("tb_resposta")
const Agenda = mongoose.model("tb_agenda")

//Funções auxiliares

module.exports = {
  
    carregaSessao(req,res){
        let sessao = new Array();
        console.log('listando Sessao')
        Sessao.find().then((sessao) =>{
        console.log("Listagem Realizada Sessao!")
            Bene.find().then((bene) =>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada Bene!")
                        Conv.find().then((conv)=>{
                        console.log("Listagem Realizada Convênio!")
                                Terapia.find({terapia_status:"Ativo"}).then((terapia)=>{
                                    terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                                console.log("Listagem Realizada Terapia!")
                                    Usuario.find().then((usuario)=>{
                                    console.log("Listagem Realizada Usuário!")
                                res.render("beneficiario/sessao/sessaoCad", {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
        console.log(err)
        req.flash("error_message", "houve um erro ao listar Sessão")
        res.redirect('admin/erro')
        })
    },

    cadastraSessao(req,res){
        let cadastro = sessaoClass.sessaoAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            let sessao = new Array();
            console.log('listando Sessao')
            Sessao.find().then((sessao) =>{
            console.log("Listagem Realizada Sessao!")
                Bene.find().then((bene) =>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada Bene!")
                            Conv.find().then((conv)=>{
                            console.log("Listagem Realizada Convênio!")
                            Terapia.find({terapia_status:"Ativo"}).then((terapia)=>{
                                terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                                    console.log("Listagem Realizada Terapia!")
                                        Usuario.find().then((usuario)=>{
                                        console.log("Listagem Realizada Usuário!")
                                            res.render('beneficiario/sessao/sessaoCad' , {sessaos: sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene});
            })})})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Sessão")
                res.redirect('admin/erro')
                })
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    deletaSessao(req, res){
        Sessao.deleteOne({_id: req.params.id}).then(() =>{
            Sessao.find().then((sessao) =>{
                req.flash("success_message", "Sessão deletada!")
                res.render('beneficiario/sessao/sessaoLis', {sessaos: sessao})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Sessões")
                res.render('admin/erro')
            })
        })

    },

    atualizaSessao(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            sessaoClass.sessaoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaSessao(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaSessao(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    carregaSessaoEdi(req, res){
        Sessao.findOne({sessao_beneid: req.params.id}).then((sessao) =>{
            console.log("sessao atual para o beneficiário escolhido: "+sessao)
            Bene.find().then((bene) =>{
                   
                Conv.find().then((conv)=>{
                            Terapia.find({terapia_status:"Ativo"}).then((terapia)=>{
                                terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                                    Usuario.find().then((usuario)=>{
                                        res.render("beneficiario/sessao/sessaoEdi", {sessao, usuarios: usuario, terapias: terapia, convs: conv, benes: bene})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao gerar o editar Sessões")
            res.redirect('admin/erro')
        })
    },

    async listaSessao(req, res) {
        console.log('listando Sessao');

        // Função interna: calcula início e fim da semana (domingo a sábado)
        function getInicioFimSemana(data) {
            const dia = data.getDay(); // 0 = domingo
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia); // volta ao domingo
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        // Função interna: formata data como dd/mm/yyyy
        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToBR(inicio);
        const datafimSemana = formatDateToBR(fim);

        try {
            // Passo 1: Carregar todas as sessões da semana (filtrado no banco)
            const sessaoList = await Sessao.find({
                sessao_data: {
                    $gte: inicio,
                    $lte: fim
                }
            });

            if (!sessaoList.length) {
                return res.render("beneficiario/sessao/sessaoLis", {
                    sessaos: [],
                    usuarios: [],
                    terapias: [],
                    convs: [],
                    benes: [],
                    datainiSemana,
                    datafimSemana
                });
            }

            // Extrair todos os ids de beneficiários envolvidos
            const beneIds = [...new Set(sessaoList.map(s => s.sessao_beneid.toString()))];

            // Passo 2: Carregar todos os dados relacionados em paralelo
            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ _id: { $in: beneIds }, bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            // Mapear para acesso rápido
            const beneMap = beneList.reduce((acc, b) => {
                acc[b._id.toString()] = b;
                return acc;
            }, {});

            // Processar cada sessão
            const agendasPromises = [];

            for (const sessao of sessaoList) {
                agendasPromises.push(
                    Agenda.find({
                        agenda_beneid: sessao.sessao_beneid,
                        agenda_data: {
                            $gte: inicio,
                            $lte: fim
                        }
                    })
                );
            }

            const agendasList = await Promise.all(agendasPromises);

            // Agora processa contagens e saldos e formata as datas de cadastro e dição dentro da sessão
           for (let i = 0; i < sessaoList.length; i++) {
                const sessao = sessaoList[i];
                const agendas = agendasList[i];

                // Formatação das datas de cadastro e edição
                if (sessao.sessao_datacad) {
                    const datacad = new Date(sessao.sessao_datacad);
                    const diaCad = String(datacad.getDate()).padStart(2, '0');
                    const mesCad = String(datacad.getMonth() + 1).padStart(2, '0');
                    const anoCad = datacad.getFullYear();
                    const horaCad = String(datacad.getHours()).padStart(2, '0');
                    const minCad = String(datacad.getMinutes()).padStart(2, '0');

                    sessao.datacad = `${diaCad}/${mesCad}/${anoCad} h${horaCad}:${minCad}`;
                } else {
                    sessao.datacad = "--/--/---- h--:--";
                }

                if (sessao.sessao_dataedi) {
                    const dataedi = new Date(sessao.sessao_dataedi);
                    const diaEdi = String(dataedi.getDate()).padStart(2, '0');
                    const mesEdi = String(dataedi.getMonth() + 1).padStart(2, '0');
                    const anoEdi = dataedi.getFullYear();
                    const horaEdi = String(dataedi.getHours()).padStart(2, '0');
                    const minEdi = String(dataedi.getMinutes()).padStart(2, '0');

                    sessao.dataedi = `${diaEdi}/${mesEdi}/${anoEdi} h${horaEdi}:${minEdi}`;
                } else {
                    sessao.dataedi = "--/--/---- h--:--";
                }

                // Adicionar datas da semana para uso no front
                sessao.datainiSemana = datainiSemana;
                sessao.datafimSemana = datafimSemana;

                for (let j = 1; j <= 25; j++) {
                    const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                    const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;

                    const idTerapia = sessao[fieldTerapiaId];
                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                    if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                        sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                        continue;
                    }

                    // Conta quantas vezes essa terapia aparece nas agendas
                    const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;
                    const qtAgenda = totalAgenda || 0;

                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "";

                    // Calcula saldo com sinal
                    let saldoFinal = "";
                    if (!isNaN(qtPrev) && !isNaN(qtAgenda)) {
                        const diferenca = qtPrev - qtAgenda;

                        if (diferenca > 0) {
                            saldoFinal = "+" + diferenca;
                        } else if (diferenca < 0) {
                            saldoFinal = "" + diferenca;
                        } else {
                            saldoFinal = "0";
                        }
                    }

                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldoFinal;
                }
            }

            // Adiciona countSessaos aos beneficiários
            beneList.forEach(b => {
                b.countSessaos = sessaoList.filter(s => s.sessao_beneid.toString() === b._id.toString()).length;
            });

            res.render("beneficiario/sessao/sessaoLis", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana
            });

        } catch (err) {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        }
    },

    async pesquisaind(req, res) {
        console.log('Carregando view de filtro');

        // Função interna: calcula início e fim da semana (domingo a sábado)
        function getInicioFimSemana(data) {
            const dia = data.getDay(); // 0 = domingo
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia); // volta ao domingo
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        // Função interna: formata data como YYYY-MM-DD (para campos <input type="date">)
        function formatDateToISO(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToISO(inicio);
        const datafimSemana = formatDateToISO(fim);

        try {
            // Carregar BENEFICIÁRIOS ATIVOS para preencher o filtro
            const beneList = await Bene.find({ bene_status: "Ativo" });

            const [convList, terapiaList, usuarioList] = await Promise.all([
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            // Renderiza a view com todos os dados iniciais
            res.render("beneficiario/sessao/sessaoLisind", {
                sessaos: [],
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,     // Data inicial da semana (domingo)
                datafimSemana      // Data final da semana (sábado)
            });

        } catch (err) {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar a tela");
            res.redirect('/admin/erro');
        }
    },

    async pesquisaindfil(req, res) {
        console.log('Carregando view com filtro aplicado');

        const { bene_id, data_inicio, data_fim } = req.body;

        // Função interna: formata data como YYYY-MM-DD
        function formatDateToISO(date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }

        // Função interna: calcula início e fim da semana (domingo a sábado)
        function getInicioFimSemana(data) {
            const dia = data.getDay(); // 0 = domingo
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia); // volta ao domingo
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        let inicioPeriodo, fimPeriodo;

        if (data_inicio && data_fim) {
            // Se o usuário informou datas, usa elas
            inicioPeriodo = new Date(data_inicio);
            fimPeriodo = new Date(data_fim);
            fimPeriodo.setHours(23, 59, 59, 999);
        } else {
            // Senão, usa a semana atual
            const periodoAtual = getInicioFimSemana(new Date());
            inicioPeriodo = periodoAtual.inicio;
            fimPeriodo = periodoAtual.fim;
        }

        const datainiSemana = formatDateToISO(inicioPeriodo);
        const datafimSemana = formatDateToISO(fimPeriodo);

        try {
            // Carregar BENEFICIÁRIO SELECIONADO
            let beneList = [];
            let beneSelecionado = null;

            if (bene_id) {
                beneSelecionado = await Bene.findById(bene_id);
                if (beneSelecionado) {
                    beneList = [beneSelecionado]; // Mostra só esse
                }
            }

            // Se nenhum foi encontrado, carrega todos ativos (para caso de recarregar sem filtro)
            if (!beneSelecionado) {
                beneList = await Bene.find({ bene_status: "Ativo" });
            }

            // Carregar outros dados
            const [convList, terapiaList, usuarioList] = await Promise.all([
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            // Buscar sessões do beneficiário no período
            let sessaoList = [];

            if (bene_id) {
                sessaoList = await Sessao.find({
                    sessao_beneid: bene_id,
                    sessao_data: {
                        $gte: inicioPeriodo,
                        $lte: fimPeriodo
                    }
                });

                // Processar cada sessão (contar terapias, formatar datas, etc.)
                const agendasPromises = sessaoList.map(sessao =>
                    Agenda.find({
                        agenda_beneid: sessao.sessao_beneid,
                        agenda_data: {
                            $gte: inicioPeriodo,
                            $lte: fimPeriodo
                        }
                    })
                );

                const agendasList = await Promise.all(agendasPromises);

                for (let i = 0; i < sessaoList.length; i++) {
                    const sessao = sessaoList[i];
                    const agendas = agendasList[i];

                    // Formatar data de cadastro e edição
                    if (sessao.sessao_datacad) {
                        const datacad = new Date(sessao.sessao_datacad);
                        sessao.datacad = `${String(datacad.getDate()).padStart(2, '0')}/${String(datacad.getMonth() + 1).padStart(2, '0')}/${datacad.getFullYear()}`;
                    } else {
                        sessao.datacad = "--/--/----";
                    }

                    if (sessao.sessao_dataedi) {
                        const dataedi = new Date(sessao.sessao_dataedi);
                        sessao.dataedi = `${String(dataedi.getDate()).padStart(2, '0')}/${String(dataedi.getMonth() + 1).padStart(2, '0')}/${dataedi.getFullYear()}`;
                    } else {
                        sessao.dataedi = "--/--/----";
                    }

                    // Calcular saldo de terapias
                    for (let j = 1; j <= 25; j++) {
                        const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                        const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;

                        const idTerapia = sessao[fieldTerapiaId];
                        const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                        if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                            sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = "";
                            sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = "";
                            sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                            continue;
                        }

                        const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;
                        const qtAgenda = totalAgenda || 0;

                        sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                        sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "";

                        const diferenca = qtPrev - qtAgenda;
                        let saldoFinal = "0";
                        if (diferenca > 0) saldoFinal = "+" + diferenca;
                        else if (diferenca < 0) saldoFinal = "" + diferenca;

                        sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldoFinal;
                    }
                }
            }

            res.render("beneficiario/sessao/sessaoLisindfil", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana,
                bene_id: bene_id || ""
            });

        } catch (err) {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar a tela");
            res.redirect('/admin/erro');
        }
    },

    async listaSessaofil(req, res) {
        console.log('listando Sessao Filtrada pela data e semana determinada pelo formulário');

        // Função interna: calcula início e fim da semana (domingo a sábado)
        function getInicioFimSemana(data) {
            const dia = data.getDay(); // 0 = domingo
            const inicioSemana = new Date(data);
            inicioSemana.setDate(data.getDate() - dia); // volta ao domingo
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        // Função interna: formata data como dd/mm/yyyy hhh:mm
        function formatDateToBR(date) {
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const ano = date.getFullYear();
            const hora = String(date.getHours()).padStart(2, '0');
            const minuto = String(date.getMinutes()).padStart(2, '0');

            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        try {
            // Obter data do formulário (req.query ou req.body)
            let dataSelecionada = req.query.dataFil || req.body.dataFil;

            if (!dataSelecionada) {
                console.log("Nenhuma data informada — usando data atual");
                dataSelecionada = new Date(); // usar data atual como fallback
            } else {
                console.log(`Data selecionada no formulário: ${dataSelecionada}`);
            }

            const data = new Date(dataSelecionada);

            if (isNaN(data.getTime())) {
                console.error("Data inválida recebida no filtro");
                return res.status(400).send("Data inválida.");
            }

            const { inicio, fim } = getInicioFimSemana(data); // pega início e fim da semana com base na data fornecida
            const datainiSemana = formatDateToBR(inicio);
            const datafimSemana = formatDateToBR(fim);

            console.log(`Intervalo da semana: ${datainiSemana} até ${datafimSemana}`);

            // Passo 1: Carregar todas as sessões dentro da semana selecionada
            const sessaoList = await Sessao.find({
                sessao_data: {
                    $gte: inicio,
                    $lte: fim
                }
            });

            if (!sessaoList.length) {
                console.log("📭 Nenhuma sessão encontrada para essa semana");
                return res.render("beneficiario/sessao/sessaoLisfil", {
                    sessaos: [],
                    usuarios: [],
                    terapias: [],
                    convs: [],
                    benes: [],
                    datainiSemana,
                    datafimSemana
                });
            }

            // Extrair todos os ids de beneficiários envolvidos
            const beneIds = [...new Set(sessaoList.map(s => s.sessao_beneid.toString()))];

            // Passo 2: Carregar todos os dados relacionados em paralelo
            const [beneList, convList, terapiaList, usuarioList] = await Promise.all([
                Bene.find({ _id: { $in: beneIds }, bene_status: "Ativo" }),
                Conv.find(),
                Terapia.find(),
                Usuario.find()
            ]);

            // Mapear para acesso rápido
            const beneMap = beneList.reduce((acc, b) => {
                acc[b._id.toString()] = b;
                return acc;
            }, {});

            // Processar agendas por sessão
            const agendasPromises = [];

            for (const sessao of sessaoList) {
                agendasPromises.push(
                    Agenda.find({
                        agenda_beneid: sessao.sessao_beneid,
                        agenda_data: {
                            $gte: inicio,
                            $lte: fim
                        }
                    })
                );
            }

            const agendasList = await Promise.all(agendasPromises);

            // Agora processa contagens e saldos + formatação das datas
            for (let i = 0; i < sessaoList.length; i++) {
                const sessao = sessaoList[i];
                const agendas = agendasList[i];

                // Formatação das datas de cadastro e edição
                if (sessao.sessao_datacad) {
                    const datacad = new Date(sessao.sessao_datacad);
                    const diaCad = String(datacad.getDate()).padStart(2, '0');
                    const mesCad = String(datacad.getMonth() + 1).padStart(2, '0');
                    const anoCad = datacad.getFullYear();
                    const horaCad = String(datacad.getHours()).padStart(2, '0');
                    const minCad = String(datacad.getMinutes()).padStart(2, '0');

                    sessao.datacad = `${diaCad}/${mesCad}/${anoCad} h${horaCad}:${minCad}`;
                } else {
                    sessao.datacad = "--/--/---- h--:--";
                }

                if (sessao.sessao_dataedi) {
                    const dataedi = new Date(sessao.sessao_dataedi);
                    const diaEdi = String(dataedi.getDate()).padStart(2, '0');
                    const mesEdi = String(dataedi.getMonth() + 1).padStart(2, '0');
                    const anoEdi = dataedi.getFullYear();
                    const horaEdi = String(dataedi.getHours()).padStart(2, '0');
                    const minEdi = String(dataedi.getMinutes()).padStart(2, '0');

                    sessao.dataedi = `${diaEdi}/${mesEdi}/${anoEdi} h${horaEdi}:${minEdi}`;
                } else {
                    sessao.dataedi = "--/--/---- h--:--";
                }

                // Adicionar datas da semana para uso no front
                sessao.datainiSemana = datainiSemana;
                sessao.datafimSemana = datafimSemana;

                for (let j = 1; j <= 25; j++) {
                    const fieldTerapiaId = `sessao_terapiaid${j.toString().padStart(2, '0')}`;
                    const qtPrevField = `sessao_qtterapiaprev${j.toString().padStart(2, '0')}`;

                    const idTerapia = sessao[fieldTerapiaId];
                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                    if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                        sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = "";
                        sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                        continue;
                    }

                    // Conta quantas vezes essa terapia aparece nas agendas
                    const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;
                    const qtAgenda = totalAgenda || 0;

                    sessao[`terapiaid${j.toString().padStart(2, '0')}qt`] = qtAgenda;
                    sessao[`terapiaid${j.toString().padStart(2, '0')}incons`] = "";

                    // Calcula saldo com sinal
                    let saldoFinal = "";
                    if (!isNaN(qtPrev) && !isNaN(qtAgenda)) {
                        const diferenca = qtPrev - qtAgenda;

                        if (diferenca > 0) {
                            saldoFinal = "+" + diferenca;
                        } else if (diferenca < 0) {
                            saldoFinal = "" + diferenca;
                        } else {
                            saldoFinal = "0";
                        }
                    }

                    sessao[`terapiaid${j.toString().padStart(2, '0')}saldo`] = saldoFinal;
                }
            }

            // Adiciona countSessaos aos beneficiários
            beneList.forEach(b => {
                b.countSessaos = sessaoList.filter(s => s.sessao_beneid.toString() === b._id.toString()).length;
            });

            // Renderiza a view com os dados filtrados
            res.render("beneficiario/sessao/sessaoLisfil", {
                sessaos: sessaoList,
                usuarios: usuarioList,
                terapias: terapiaList,
                convs: convList,
                benes: beneList,
                datainiSemana,
                datafimSemana
            });

        } catch (err) {
            console.error(" Erro ao listar sessões:", err.message);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        }
    },
   
}