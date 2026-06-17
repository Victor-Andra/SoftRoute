//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe Compali 
const compaliClass = require("../models/compali")


//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const beneClass = require("../models/bene")

//Tabela Compali 
var Compali = getModel("SoftRoute", 'tb_compali', compaliClass.CompaliSchema)

//Tabelas Extrangeiras
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;
const ObjectId = require('mongodb').ObjectId;

module.exports = {
   //Função que Carrega view para cadastro novo
    carregaCompali(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
        
        //Carrega beneficiários para o select
        Bene.find({ bene_lixo: { $ne: "true" } }).sort({ bene_nome: 1 }).then((beneficiarios)=>{
            console.log("Listagem Realizada de Beneficiários!")
            
            //Busca dados do usuário logado
            Usuario.findById(req.cookies['idUsu']).then((usuarioLogado)=>{
                res.render("nutricao/compali/compaliCad", {
                    beneficiarios: beneficiarios,
                    usuario: {
                        id: req.cookies['idUsu'],
                        nome: usuarioLogado ? usuarioLogado.usuario_nome : ''
                    }
                })
            }).catch((err)=>{
                console.log(err)
                //Mesmo com erro, renderiza com ID do cookie
                res.render("nutricao/compali/compaliCad", {
                    beneficiarios: beneficiarios,
                    usuario: {
                        id: req.cookies['idUsu'],
                        nome: ''
                    }
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "Houve um erro ao listar beneficiários")
            res.redirect('/admin/erro')
        })
    },
    
    //Função que controla Classe para salvar
    cadastraCompali(req,res){
        let cadastro = compaliClass.compaliAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('Cadastro realizado com sucesso!')
            req.flash("success_message", "Escala LABIRINTO cadastrada com sucesso!")
            res.redirect('/menu/nutricao/compali/lis')
        } else {
            console.log('Erro ao cadastrar')
            req.flash("error_message", "Houve um erro ao cadastrar Escala LABIRINTO")
            res.redirect('/admin/erro')
        }
    },
    
    //Função que controla Classe para Deletar
    deletaCompali(req, res){
        compaliClass.compaliDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    req.flash("success_message", "Escala LABIRINTO excluída com sucesso!")
                    this.listaCompali(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    req.flash("error_message", "Houve um erro ao excluir Escala LABIRINTO")
                    res.redirect('/admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaCompali:", err);
                req.flash("error_message", "Houve um erro ao excluir Escala LABIRINTO")
                res.redirect('/admin/erro');
            });
    },
    
    //Função que controla Classe para Atualizar registro
    atualizaCompali(req, res){
        let db = req.cookies['preferredDb'];
        Compali = getModel(db, 'tb_compali', compaliClass.CompaliSchema)

        let resposta;
        try{
            compaliClass.compaliEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.redirect('/admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a lista de compali
                    req.flash("success_message", "Escala LABIRINTO atualizada com sucesso!")
                    this.listaCompali(req, res)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    req.flash("error_message", "Houve um erro ao atualizar Escala LABIRINTO")
                    res.redirect('/admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
            req.flash("error_message", "Houve um erro ao atualizar Escala LABIRINTO")
            res.redirect('/admin/erro')
        } 
    },
    
    //Função que Carrega view para Editar Registro
    carregaCompaliEdi(req, res){
        let db = req.cookies['preferredDb'];
        Compali = getModel(db, 'tb_compali', compaliClass.CompaliSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
        
        Compali.findById(req.params.id).then((compali) =>{
            if(!compali){
                req.flash("error_message", "Registro não encontrado!")
                res.redirect('/nutricao/compali/lis')
                return;
            }
            
            //Carrega beneficiários para o select
            Bene.find({ bene_lixo: { $ne: "true" } }).sort({ bene_nome: 1 }).then((beneficiarios)=>{
                //Busca dados do terapeuta que aplicou
                Usuario.findById(compali.compali_terapeutaid).then((terapeutaAplicador)=>{
                    res.render("nutricao/compali/compaliEdi", {
                        compali: compali,
                        beneficiarios: beneficiarios,
                        terapeutaAplicador: {
                            id: compali.compali_terapeutaid,
                            nome: terapeutaAplicador ? terapeutaAplicador.usuario_nome : ''
                        }
                    })
                }).catch((err)=>{
                    console.log(err)
                    res.render("nutricao/compali/compaliEdi", {
                        compali: compali,
                        beneficiarios: beneficiarios,
                        terapeutaAplicador: {
                            id: compali.compali_terapeutaid,
                            nome: ''
                        }
                    })
                })
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "Houve um erro ao carregar beneficiários")
                res.redirect('/nutricao/compali/lis')
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "Houve um erro ao carregar registro")
            res.redirect('/nutricao/compali/lis')
        })
    },
    
   //Função que Lista os registros
   
    //Função que Lista os registros
    listaCompali_old(req, res) {
        let db = req.cookies['preferredDb'];
        Compali = getModel(db, 'tb_compali', compaliClass.CompaliSchema);

        function formatDateToBR(date) {
            if(!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        function formatDateOnlyToBR(date) {
            if(!date) return "--/--/----";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

        Compali.find({ compali_lixo: { $ne: "true" } }).sort({ compali_datacad: -1 }).then(async (compaliList) => {
            let qtregs;

            try {
                // Carregar total de registros
                qtregs = await compaliClass.qtregs(req, res);

                // Carregar usuários para mapeamento
                const usuarioList = await Usuario.find();
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                // Carregar beneficiários para mapeamento
                const beneList = await Bene.find();
                const beneMap = beneList.reduce((acc, b) => {
                    acc[b._id.toString()] = b;
                    return acc;
                }, {});

                // Processar cada registro
                compaliList.forEach(c => {
                    c.datacad = c.compali_datacad ? formatDateToBR(c.compali_datacad) : "--/--/---- h--:--";
                    c.dataedi = c.compali_dataedi ? formatDateToBR(c.compali_dataedi) : "--/--/---- h--:--";
                    c.dataaplica = c.compali_dataaplica ? formatDateOnlyToBR(c.compali_dataaplica) : "--/--/----";

                    const usuarioCad = usuarioMap[c.compali_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[c.compali_usuidedi?.toString()];
                    const beneficiario = beneMap[c.compali_beneid?.toString()];

                    c.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                    c.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
                    c.beneficiarioNome = beneficiario ? beneficiario.bene_nome : "--";
                    
                    // ✅ NOVOS CAMPOS - Totais dos Fatores
                    c.fator1 = c.compali_totmotricidademastigacao || 0;
                    c.fator2 = c.compali_totseletividadealimentar || 0;
                    c.fator3 = c.compali_tothabilidadesrefeicoes || 0;
                    c.fator4 = c.compali_totcomportinadequadorefeicoes || 0;
                    c.fator5 = c.compali_totcomportrigidosalimentacao || 0;
                    c.fator6 = c.compali_totcomportopositoralimentacao || 0;
                    c.fator7 = c.compali_totalergiasintolerancia || 0;
                    c.totalGeral = c.compali_tottotalgeral || 0;
                });

                res.render('nutricao/compali/compaliLis', { compalis: compaliList, qtregs });

            } catch (err) {
                console.error("Erro ao carregar dados para listaCompali:", err);
                req.flash("error_message", "Houve um erro ao listar Escalas LABIRINTO");
                res.redirect('/admin/erro');
            }

        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Escalas LABIRINTO");
            res.redirect('/admin/erro');
        });
    },
    //Função que Lista os registros
    listaCompali(req, res) {
        let db = req.cookies['preferredDb'];
        Compali = getModel(db, 'tb_compali', compaliClass.CompaliSchema);

        function formatDateToBR(date) {
            if(!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        function formatDateOnlyToBR(date) {
            if(!date) return "--/--/----";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

        Compali.find({ compali_lixo: { $ne: "true" } }).sort({ compali_datacad: -1 }).then(async (compaliList) => {
            let qtregs;

            try {
                // Carregar total de registros
                qtregs = await compaliClass.qtregs(req, res);

                // Carregar usuários para mapeamento
                const usuarioList = await Usuario.find();
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                // Carregar beneficiários para mapeamento
                const beneList = await Bene.find();
                const beneMap = beneList.reduce((acc, b) => {
                    acc[b._id.toString()] = b;
                    return acc;
                }, {});

                // ✅ AGRUPAR POR BENEFICIÁRIO PARA COMPARAÇÃO
                const avaliacoesPorBene = {};
                compaliList.forEach(c => {
                    const beneId = c.compali_beneid?.toString();
                    if (!avaliacoesPorBene[beneId]) {
                        avaliacoesPorBene[beneId] = [];
                    }
                    avaliacoesPorBene[beneId].push(c);
                });

                // ✅ PARA CADA BENEFICIÁRIO, ORDENAR POR DATA E CALCULAR COMPARAÇÕES
                Object.keys(avaliacoesPorBene).forEach(beneId => {
                    const avaliacoes = avaliacoesPorBene[beneId];
                    
                    // Ordenar do mais antigo para o mais recente
                    avaliacoes.sort((a, b) => new Date(a.compali_datacad) - new Date(b.compali_datacad));
                    
                    // Para cada avaliação, calcular comparação com a anterior
                    avaliacoes.forEach((avaliacao, index) => {
                        if (index === 0) {
                            // Primeira avaliação - todos os ícones são traço
                            avaliacao.setaFator1 = '-';
                            avaliacao.setaFator2 = '-';
                            avaliacao.setaFator3 = '-';
                            avaliacao.setaFator4 = '-';
                            avaliacao.setaFator5 = '-';
                            avaliacao.setaFator6 = '-';
                            avaliacao.setaFator7 = '-';
                            avaliacao.setaTotal = '-';
                        } else {
                            // Comparar com avaliação anterior
                            const anterior = avaliacoes[index - 1];
                            
                            avaliacao.setaFator1 = calcularSeta(avaliacao.compali_totmotricidademastigacao, anterior.compali_totmotricidademastigacao);
                            avaliacao.setaFator2 = calcularSeta(avaliacao.compali_totseletividadealimentar, anterior.compali_totseletividadealimentar);
                            avaliacao.setaFator3 = calcularSeta(avaliacao.compali_tothabilidadesrefeicoes, anterior.compali_tothabilidadesrefeicoes);
                            avaliacao.setaFator4 = calcularSeta(avaliacao.compali_totcomportinadequadorefeicoes, anterior.compali_totcomportinadequadorefeicoes);
                            avaliacao.setaFator5 = calcularSeta(avaliacao.compali_totcomportrigidosalimentacao, anterior.compali_totcomportrigidosalimentacao);
                            avaliacao.setaFator6 = calcularSeta(avaliacao.compali_totcomportopositoralimentacao, anterior.compali_totcomportopositoralimentacao);
                            avaliacao.setaFator7 = calcularSeta(avaliacao.compali_totalergiasintolerancia, anterior.compali_totalergiasintolerancia);
                            avaliacao.setaTotal = calcularSeta(avaliacao.compali_tottotalgeral, anterior.compali_tottotalgeral);
                        }
                    });
                });

                // Função para calcular seta
                function calcularSeta(valorAtual, valorAnterior) {
                    const atual = valorAtual || 0;
                    const anterior = valorAnterior || 0;
                    
                    if (atual > anterior) return 'up';    // Piorou - seta para cima
                    if (atual < anterior) return 'down';  // Melhorou - seta para baixo
                    return 'same';                         // Inalterado - traço
                }

                // Processar cada registro
                compaliList.forEach(c => {
                    c.datacad = c.compali_datacad ? formatDateToBR(c.compali_datacad) : "--/--/---- h--:--";
                    c.dataedi = c.compali_dataedi ? formatDateToBR(c.compali_dataedi) : "--/--/---- h--:--";
                    c.dataaplica = c.compali_dataaplica ? formatDateOnlyToBR(c.compali_dataaplica) : "--/--/----";

                    const usuarioCad = usuarioMap[c.compali_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[c.compali_usuidedi?.toString()];
                    const beneficiario = beneMap[c.compali_beneid?.toString()];

                    c.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                    c.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
                    c.beneficiarioNome = beneficiario ? beneficiario.bene_nome : "--";
                    
                    // Totais dos Fatores
                    c.fator1 = c.compali_totmotricidademastigacao || 0;
                    c.fator2 = c.compali_totseletividadealimentar || 0;
                    c.fator3 = c.compali_tothabilidadesrefeicoes || 0;
                    c.fator4 = c.compali_totcomportinadequadorefeicoes || 0;
                    c.fator5 = c.compali_totcomportrigidosalimentacao || 0;
                    c.fator6 = c.compali_totcomportopositoralimentacao || 0;
                    c.fator7 = c.compali_totalergiasintolerancia || 0;
                    c.totalGeral = c.compali_tottotalgeral || 0;
                });

                res.render('nutricao/compali/compaliLis', { compalis: compaliList, qtregs });

            } catch (err) {
                console.error("Erro ao carregar dados para listaCompali:", err);
                req.flash("error_message", "Houve um erro ao listar Escalas LABIRINTO");
                res.redirect('/admin/erro');
            }

        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Escalas LABIRINTO");
            res.redirect('/admin/erro');
        });
    }
}