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
    getInicioFimSemana(data) {
        const dia = data.getDay(); // 0 = domingo, 1 = segunda...
        const inicioSemana = new Date(data);
        inicioSemana.setDate(data.getDate() - dia); // volta para domingo
        inicioSemana.setHours(0, 0, 0, 0);

        const fimSemana = new Date(inicioSemana);
        fimSemana.setDate(inicioSemana.getDate() + 6);
        fimSemana.setHours(23, 59, 59, 999);

        return { inicio: inicioSemana, fim: fimSemana };
    },
  

formatDateToBR(date) {
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
},
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
            console.log("sessao: "+sessao)
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
   
    listaSessaoOld(req, res) {
        console.log('listando Sessao');

        // Função para pegar início e fim da semana
        function getInicioFimSemana(data) {
            const dia = data.getDay();
            const diff = data.getDate() - dia + (dia === 0 ? -6 : 1); // ajusta para segunda-feira
            const inicioSemana = new Date(data);
            inicioSemana.setDate(diff);
            inicioSemana.setHours(0, 0, 0, 0);

            const fimSemana = new Date(inicioSemana);
            fimSemana.setDate(inicioSemana.getDate() + 6);
            fimSemana.setHours(23, 59, 59, 999);

            return { inicio: inicioSemana, fim: fimSemana };
        }

        // Formata data para dd/mm/yyyy
        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToBR(inicio);
        const datafimSemana = formatDateToBR(fim);

        Sessao.find().then(async (sessaoList) => {
            // Formatação das datas de cadastro e edição
            sessaoList.forEach((b) => {
                let datacad = new Date(b.sessao_datacad);
                let mes = String(datacad.getMonth() + 1).padStart(2, '0');
                let dia = String(datacad.getUTCDate()).padStart(2, '0');
                b.datacad = `${datacad.getFullYear()}-${mes}-${dia}`;

                datacad = new Date(b.sessao_dataedi);
                mes = String(datacad.getMonth() + 1).padStart(2, '0');
                dia = String(datacad.getUTCDate()).padStart(2, '0');
                b.dataedi = `${datacad.getFullYear()}-${mes}-${dia}`;
            });

            console.log("Listagem Realizada Sessão!");

            Bene.find({ bene_status: "Ativo" }).then(async (beneList) => {
                beneList.sort((a, b) => {
                    const nomeA = a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    const nomeB = b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    return nomeA.localeCompare(nomeB);
                });
                console.log("Listagem Realizada Bene!");

                Conv.find().then(async (convList) => {
                    Terapia.find().then(async (terapiaList) => {
                        Usuario.find().then(async (usuarioList) => {

                            // Adicionando countSessaos
                            beneList.forEach((b) => {
                                b.countSessaos = sessaoList.filter((s) => s.sessao_beneid.toString() === b._id.toString()).length;
                            });

                            // Para cada sessão, busca agenda e conta terapias
                            for (const sessao of sessaoList) {
                                const beneId = sessao.sessao_beneid;

                                // Busca agendas do beneficiário dentro da semana
                                const agendas = await Agenda.find({
                                    agenda_beneid: beneId,
                                    agenda_data: {
                                        $gte: inicio,
                                        $lte: fim
                                    }
                                });

                                // Adicionar datas da semana para uso no front
                                sessao.datainiSemana = datainiSemana;
                                sessao.datafimSemana = datafimSemana;

                                // Processar campos de terapiaid01 até 25
                                for (let i = 1; i <= 25; i++) {
                                    const fieldTerapiaId = `sessao_terapiaid${i.toString().padStart(2, '0')}`;
                                    const idTerapia = sessao[fieldTerapiaId];

                                    // Verifica se o ID é inválido ou vazio
                                    if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                                        continue;
                                    }

                                    // Conta quantas vezes essa terapia aparece nas agendas
                                    const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;

                                    if (totalAgenda === 0) {
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "Não Localizado, favor corrigir a tabela de sessões ou a agenda!";
                                        continue;
                                    }

                                    // Se válido, salva quantidade
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = totalAgenda;
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "";

                                    // Pega valor previsto
                                    const qtPrevField = `sessao_qtterapiaprev${i.toString().padStart(2, '0')}`;
                                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                                    // Calcula saldo com sinal
                                    let saldoFinal = "";
                                    if (!isNaN(qtPrev) && !isNaN(totalAgenda)) {
                                        const diferenca = qtPrev - totalAgenda;

                                        if (diferenca > 0) {
                                            saldoFinal = "+" + diferenca;
                                        } else if (diferenca < 0) {
                                            saldoFinal = "" + diferenca;
                                        } else {
                                            saldoFinal = "0";
                                        }
                                    }

                                    sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = saldoFinal;
                                }
                            }

                            res.render("beneficiario/sessao/sessaoLis", {
                                sessaos: sessaoList,
                                usuarios: usuarioList,
                                terapias: terapiaList,
                                convs: convList,
                                benes: beneList,
                                datainiSemana: datainiSemana, // Adicionado aqui
                                datafimSemana: datafimSemana  // Adicionado aqui
                            });

                        }).catch(err => {
                            console.error(err);
                            req.flash("error_message", "Houve um erro ao listar usuários");
                            res.redirect('/admin/erro');
                        });

                    }).catch(err => {
                        console.error(err);
                        req.flash("error_message", "Houve um erro ao listar terapias");
                        res.redirect('/admin/erro');
                    });

                }).catch(err => {
                    console.error(err);
                    req.flash("error_message", "Houve um erro ao listar convênios");
                    res.redirect('/admin/erro');
                });

            }).catch(err => {
                console.error(err);
                req.flash("error_message", "Houve um erro ao listar beneficiários");
                res.redirect('/admin/erro');
            });

        }).catch(err => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        });
    },
    listaSessaoOld2(req, res) {
        console.log('listando Sessao');

        // Função corrigida para pegar início e fim da semana começando no domingo
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

        function formatDateToBR(date) {
            return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
        }

        const hoje = new Date();
        const { inicio, fim } = getInicioFimSemana(hoje);
        const datainiSemana = formatDateToBR(inicio);
        const datafimSemana = formatDateToBR(fim);

        Sessao.find().then(async (sessaoList) => {
            // Formatação das datas de cadastro e edição
            sessaoList.forEach((b) => {
                let datacad = new Date(b.sessao_datacad);
                let mes = String(datacad.getMonth() + 1).padStart(2, '0');
                let dia = String(datacad.getUTCDate()).padStart(2, '0');
                b.datacad = `${datacad.getFullYear()}-${mes}-${dia}`;

                datacad = new Date(b.sessao_dataedi);
                mes = String(datacad.getMonth() + 1).padStart(2, '0');
                dia = String(datacad.getUTCDate()).padStart(2, '0');
                b.dataedi = `${datacad.getFullYear()}-${mes}-${dia}`;
            });

            console.log("Listagem Realizada Sessão!");

            Bene.find({ bene_status: "Ativo" }).then(async (beneList) => {
                beneList.sort((a, b) => {
                    const nomeA = a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    const nomeB = b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                    return nomeA.localeCompare(nomeB);
                });
                console.log("Listagem Realizada Bene!");

                Conv.find().then(async (convList) => {
                    Terapia.find().then(async (terapiaList) => {
                        Usuario.find().then(async (usuarioList) => {

                            // Adicionando countSessaos
                            beneList.forEach((b) => {
                                b.countSessaos = sessaoList.filter((s) => s.sessao_beneid.toString() === b._id.toString()).length;
                            });

                            // Para cada sessão, busca agenda e conta terapias
                            for (const sessao of sessaoList) {
                                const beneId = sessao.sessao_beneid;

                                // Busca agendas do beneficiário dentro da semana
                                const agendas = await Agenda.find({
                                    agenda_beneid: beneId,
                                    agenda_data: {
                                        $gte: inicio,
                                        $lte: fim
                                    }
                                });

                                // Adicionar datas da semana para uso no front
                                sessao.datainiSemana = datainiSemana;
                                sessao.datafimSemana = datafimSemana;

                                // Processar campos de terapiaid01 até 25
                                for (let i = 1; i <= 25; i++) {
                                    const fieldTerapiaId = `sessao_terapiaid${i.toString().padStart(2, '0')}`;
                                    const idTerapia = sessao[fieldTerapiaId];

                                    // Verifica se o ID é inválido ou vazio
                                    if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                                        continue;
                                    }

                                    // Conta quantas vezes essa terapia aparece nas agendas
                                    const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;

                                    if (totalAgenda === 0) {
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = "";
                                        sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "Não Localizado, favor corrigir a tabela de sessões ou a agenda!";
                                        continue;
                                    }

                                    // Se válido, salva quantidade
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = totalAgenda;
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "";

                                    // Pega valor previsto
                                    const qtPrevField = `sessao_qtterapiaprev${i.toString().padStart(2, '0')}`;
                                    const qtPrev = parseInt(sessao[qtPrevField]) || 0;

                                    // Calcula saldo com sinal
                                    let saldoFinal = "";
                                    if (!isNaN(qtPrev) && !isNaN(totalAgenda)) {
                                        const diferenca = qtPrev - totalAgenda;

                                        if (diferenca > 0) {
                                            saldoFinal = "+" + diferenca;
                                        } else if (diferenca < 0) {
                                            saldoFinal = "" + diferenca;
                                        } else {
                                            saldoFinal = "0";
                                        }
                                    }

                                    sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = saldoFinal;
                                }
                            }

                            res.render("beneficiario/sessao/sessaoLis", {
                                sessaos: sessaoList,
                                usuarios: usuarioList,
                                terapias: terapiaList,
                                convs: convList,
                                benes: beneList,
                                datainiSemana: datainiSemana,
                                datafimSemana: datafimSemana
                            });

                        }).catch(err => {
                            console.error(err);
                            req.flash("error_message", "Houve um erro ao listar usuários");
                            res.redirect('/admin/erro');
                        });

                    }).catch(err => {
                        console.error(err);
                        req.flash("error_message", "Houve um erro ao listar terapias");
                        res.redirect('/admin/erro');
                    });

                }).catch(err => {
                    console.error(err);
                    req.flash("error_message", "Houve um erro ao listar convênios");
                    res.redirect('/admin/erro');
                });

            }).catch(err => {
                console.error(err);
                req.flash("error_message", "Houve um erro ao listar beneficiários");
                res.redirect('/admin/erro');
            });

        }).catch(err => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar sessões");
            res.redirect('/admin/erro');
        });
    },
    listaSessaoOld3funcional(req, res) {
    console.log('listando Sessao');

    // Função corrigida para pegar início e fim da semana começando no domingo
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

    function formatDateToBR(date) {
        return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    }

    const hoje = new Date();
    const { inicio, fim } = getInicioFimSemana(hoje);
    const datainiSemana = formatDateToBR(inicio);
    const datafimSemana = formatDateToBR(fim);

    Sessao.find().then(async (sessaoList) => {
        // Formatação das datas de cadastro e edição
        sessaoList.forEach((b) => {
            let datacad = new Date(b.sessao_datacad);
            let mes = String(datacad.getMonth() + 1).padStart(2, '0');
            let dia = String(datacad.getUTCDate()).padStart(2, '0');
            b.datacad = `${datacad.getFullYear()}-${mes}-${dia}`;

            datacad = new Date(b.sessao_dataedi);
            mes = String(datacad.getMonth() + 1).padStart(2, '0');
            dia = String(datacad.getUTCDate()).padStart(2, '0');
            b.dataedi = `${datacad.getFullYear()}-${mes}-${dia}`;
        });

        console.log("Listagem Realizada Sessão!");

        Bene.find({ bene_status: "Ativo" }).then(async (beneList) => {
            beneList.sort((a, b) => {
                const nomeA = a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });
            console.log("Listagem Realizada Bene!");

            Conv.find().then(async (convList) => {
                Terapia.find().then(async (terapiaList) => {
                    Usuario.find().then(async (usuarioList) => {

                        // Adicionando countSessaos
                        beneList.forEach((b) => {
                            b.countSessaos = sessaoList.filter((s) => s.sessao_beneid.toString() === b._id.toString()).length;
                        });

                        // Para cada sessão, busca agenda e conta terapias
                        for (const sessao of sessaoList) {
                            const beneId = sessao.sessao_beneid;

                            // Busca agendas do beneficiário dentro da semana
                            const agendas = await Agenda.find({
                                agenda_beneid: beneId,
                                agenda_data: {
                                    $gte: inicio,
                                    $lte: fim
                                }
                            });

                            // Adicionar datas da semana para uso no front
                            sessao.datainiSemana = datainiSemana;
                            sessao.datafimSemana = datafimSemana;

                            // Processar campos de terapiaid01 até 25
                            for (let i = 1; i <= 25; i++) {
                                const fieldTerapiaId = `sessao_terapiaid${i.toString().padStart(2, '0')}`;
                                const idTerapia = sessao[fieldTerapiaId];

                                // Verifica se o ID é inválido ou vazio
                                if (!idTerapia || idTerapia.toString() === '766f69643132333435366964') {
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = "";
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = "";
                                    sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "Campo vazio ou inválido!";
                                    continue;
                                }

                                // Conta quantas vezes essa terapia aparece nas agendas
                                const totalAgenda = agendas.filter(a => a.agenda_terapiaid.toString() === idTerapia.toString()).length;
                                const qtAgenda = totalAgenda || 0;

                                sessao[`terapiaid${i.toString().padStart(2, '0')}qt`] = qtAgenda;
                                sessao[`terapiaid${i.toString().padStart(2, '0')}incons`] = "";

                                // Pega valor previsto
                                const qtPrevField = `sessao_qtterapiaprev${i.toString().padStart(2, '0')}`;
                                const qtPrev = parseInt(sessao[qtPrevField]) || 0;

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

                                sessao[`terapiaid${i.toString().padStart(2, '0')}saldo`] = saldoFinal;
                            }
                        }

                        res.render("beneficiario/sessao/sessaoLis", {
                            sessaos: sessaoList,
                            usuarios: usuarioList,
                            terapias: terapiaList,
                            convs: convList,
                            benes: beneList,
                            datainiSemana: datainiSemana,
                            datafimSemana: datafimSemana
                        });

                    }).catch(err => {
                        console.error(err);
                        req.flash("error_message", "Houve um erro ao listar usuários");
                        res.redirect('/admin/erro');
                    });

                }).catch(err => {
                    console.error(err);
                    req.flash("error_message", "Houve um erro ao listar terapias");
                    res.redirect('/admin/erro');
                });

            }).catch(err => {
                console.error(err);
                req.flash("error_message", "Houve um erro ao listar convênios");
                res.redirect('/admin/erro');
            });

        }).catch(err => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar beneficiários");
            res.redirect('/admin/erro');
        });

    }).catch(err => {
        console.error(err);
        req.flash("error_message", "Houve um erro ao listar sessões");
        res.redirect('/admin/erro');
    });
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

        // Agora processa contagens e saldos
        for (let i = 0; i < sessaoList.length; i++) {
            const sessao = sessaoList[i];
            const agendas = agendasList[i];

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
}
}