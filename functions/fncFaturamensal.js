const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
const fncGeral = require("./fncGeral");

//Classes
const faturamensalClass = require("../models/faturamensal")
const atendClass = require("../models/atend")
const convClass = require("../models/conv")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")

//Models
var FaturaMensal = getModel("softroute", 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)
var Atend = getModel("softroute", 'tb_atend', atendClass.AtendSchema)
var Conv = getModel("softroute", 'tb_conv', convClass.ConvSchema)
var Terapia = getModel("softroute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Usuario = getModel("softroute", 'tb_usuario', usuarioClass.UsuarioSchema)

module.exports = {
    listaFatura(req, res) {
        let db = req.cookies['preferredDb'];
        FaturaMensal = getModel(db, 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)
        Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema)

        function formatDateToBR(date) {
            if (!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        Promise.all([
            FaturaMensal.find({ fat_lixo: { $ne: "true" } }).sort({ fat_ano: -1, fat_mes: -1 }),
            Usuario.find(),
            Conv.find({ conv_lixo: { $ne: "true" } })
        ])
            .then(([faturaList, usuarioList, convList]) => {
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                const convMap = convList.reduce((acc, c) => {
                    acc[c._id.toString()] = c;
                    return acc;
                }, {});

                faturaList.forEach(f => {
                    f.datacad = f.fat_datacad ? formatDateToBR(f.fat_datacad) : "--/--/---- h--:--";
                    f.dataedi = f.fat_dataedi ? formatDateToBR(f.fat_dataedi) : "--/--/---- h--:--";

                    const usuarioCad = usuarioMap[f.fat_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[f.fat_usuidedi?.toString()];

                    f.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "Não informado";
                    f.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "Não informado";

                    f.convNome = f.fat_filtroconv === 'todos' 
                        ? 'Todos os Convênios' 
                        : (convMap[f.fat_filtroconv]?.conv_nome || '-');
                });

                res.render('financeiro/fatura/faturaLis', { faturas: faturaList });
            })
            .catch((err) => {
                console.error("Erro em listaFatura:", err);
                res.redirect('/admin/erro');
            });
    },

    carregaFatura(req, res) {
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Promise.all([
            Conv.find({ conv_lixo: { $ne: "true" } }).sort({ conv_nome: 1 }),
            Terapia.find({ terapia_lixo: { $ne: "true" } }).sort({ terapia_nome: 1 })
        ])
            .then(([convs, terapias]) => {
                res.render('financeiro/fatura/faturaCad', {
                    convs,
                    terapias,
                    anos: [],
                    filtro: {
                        dataIni: '',
                        dataFim: '',
                        convId: '766f69643132333435366964'
                    }
                });
            })
            .catch((err) => {
                console.error("Erro em carregaFatura:", err);
                res.redirect('/admin/erro');
            });
    },

    async processarFaturamento(req, res) {
        try {
            let db = req.cookies['preferredDb'];
            const Atend = getModel(db, 'tb_atend', atendClass.AtendSchema);
            const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
            const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

            const rawIni = req.body.dataIni;
            const rawFim = req.body.dataFim;
            const rawConv = req.body.relConvid;
            const tipoTerapia = req.body.tipoTerapia || 'Nome';
            
            const hojeStr = new Date().toISOString().replace('T', ' ').substring(0, 23) + 'Z';
            const safeDataIni = (typeof rawIni === 'string' && rawIni.trim() !== '') ? rawIni : hojeStr;
            const safeDataFim = (typeof rawFim === 'string' && rawFim.trim() !== '') ? rawFim : hojeStr;

            let seg, sex;
            try {
                seg = fncGeral.getDateFromString(safeDataIni, "ini");
                sex = fncGeral.getDateFromString(safeDataFim, "fim");
                if (!seg || isNaN(seg.getTime())) throw new Error('Data inicial inválida');
                if (!sex || isNaN(sex.getTime())) throw new Error('Data final inválida');
            } catch (err) {
                console.error('[ERRO conversão data]', { error: err.message, rawIni, rawFim });
                return res.status(400).send(`<script>alert("Erro ao processar as datas: ${err.message}"); history.back();</script>`);
            }

            const ID_PLACEHOLDER = '766f69643132333435366964';
            const buscarTodosConvenios = !rawConv || rawConv === ID_PLACEHOLDER || rawConv.trim() === '';

            const filtroAtend = {
                atend_atenddata: { $gte: seg, $lte: sex },
                atend_categoria: { $nin: ["Feriado", "Falta Absoluta"] }
            };

            if (!buscarTodosConvenios) {
                filtroAtend.atend_convid = rawConv;
            }

            const [convs, terapias, atendimentos] = await Promise.all([
                Conv.find({ conv_lixo: { $ne: "true" } }).sort({ conv_nome: 1 }).lean(),
                Terapia.find({ terapia_lixo: { $ne: "true" } }).sort({ terapia_nome: 1 }).lean(),
                Atend.find(filtroAtend).lean()
            ]);

            const getTerapiaIdField = (atend) => {
                const cat = atend.atend_categoria;
                const fixoId = atend.atend_fixoterapiaid ? String(atend.atend_fixoterapiaid).trim() : '';
                const hasFixo = fixoId !== '';
                if (cat === "SubstitutoFixo") return 'atend_fixoterapiaid';
                if (cat === "Substituição" && hasFixo) return 'atend_fixoterapiaid';
                if (cat === "Substituição" && !hasFixo) return 'atend_mergeterapiaid';
                return 'atend_terapiaid';
            };

            const getValorCreditoField = (atend) => {
                const cat = atend.atend_categoria;
                const fixoId = atend.atend_fixoterapiaid ? String(atend.atend_fixoterapiaid).trim() : '';
                const hasFixo = fixoId !== '';
                if (cat === "SubstitutoFixo") return 'atend_fixovalorcre';
                if (cat === "Substituição" && hasFixo) return 'atend_fixovalorcre';
                if (cat === "Substituição" && !hasFixo) return 'atend_mergevalorcre';
                return 'atend_valorcre';
            };

            const toCentavos = (valorStr) => {
                if (!valorStr || typeof valorStr !== 'string') return 0;
                const limpo = valorStr.replace(/\./g, '').replace(',', '.');
                const num = parseFloat(limpo);
                return isNaN(num) ? 0 : Math.round(num * 100);
            };

            const rel = [];
            let sessaoTot = 0;
            let valTotCentavos = 0;

            terapias.forEach((t) => {
                let qtdIds = 0;
                let valoresArray = [];
                let somaCredCentavos = 0;

                atendimentos.forEach((ats) => {
                    const terapiaField = getTerapiaIdField(ats);
                    const terapiaAtend = ats[terapiaField];

                    if (terapiaAtend && ("" + terapiaAtend) === ("" + t._id)) {
                        const valorField = getValorCreditoField(ats);
                        const valorCred = ats[valorField] || "0,00";
                        const vCredCent = toCentavos(valorCred);
                        
                        qtdIds++;
                        valoresArray.push(valorCred);
                        somaCredCentavos += vCredCent;
                    }
                });

                if (qtdIds > 0) {
                    const valorUnitarioCentavos = Math.round(somaCredCentavos / qtdIds);
                    const totalCredCentavos = somaCredCentavos;

                    rel.push({
                        sessoes: qtdIds,
                        valor: fncGeral.formatarReal(valorUnitarioCentavos),
                        total: fncGeral.formatarReal(totalCredCentavos),
                        nomecid: t._id,
                        terapiaNome: t.terapia_nome,
                        terapiaCid: t.terapia_nomecid,
                        valores: valoresArray
                    });

                    sessaoTot += qtdIds;
                    valTotCentavos += totalCredCentavos;
                }
            });

            const total = {
                sessoes: sessaoTot,
                total: fncGeral.formatarReal(valTotCentavos)
            };

            const periodoDe = fncGeral.getDataInvert(safeDataIni);
            const periodoAte = fncGeral.getDataInvert(safeDataFim);

            let conv_nome = buscarTodosConvenios
                ? 'Todos os Convênios'
                : (convs.find(c => ("" + c._id) === ("" + rawConv))?.conv_nome || '-');

            // Extrai ano e mês do período
            const dataIniObj = new Date(safeDataIni);
            const ano = dataIniObj.getFullYear();
            const mes = dataIniObj.getMonth() + 1;

            res.render('financeiro/fatura/faturaCad', {
                convs,
                terapias,
                rels: rel,
                total,
                periodoDe,
                periodoAte,
                conv_nome,
                filtro: {
                    dataIni: safeDataIni,
                    dataFim: safeDataFim,
                    convId: buscarTodosConvenios ? ID_PLACEHOLDER : rawConv,
                    tipoTerapia: tipoTerapia,
                    ano: ano,
                    mes: mes
                }
            });

        } catch (err) {
            console.error('ERRO CRÍTICO processarFaturamento:', err);
            res.status(500).send(`<script>alert("Erro interno ao processar faturamento."); history.back();</script>`);
        }
    },

    async salvarFaturamento(req, res) {
        try {
            let db = req.cookies['preferredDb'];
            FaturaMensal = getModel(db, 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)

            const { fat_ano, fat_mes, fat_periodoini, fat_periodofim, fat_filtroconv, fat_tipoterapia } = req.body;
            
            // Processa cada terapia do array rels
            const rels = JSON.parse(req.body.rels);
            const dataAtual = new Date();
            const usuarioAtual = req.cookies['idUsu'];

            for (let i = 0; i < rels.length; i++) {
                const rel = rels[i];
                const qualTerapia = fat_tipoterapia === 'Nome' ? rel.terapiaNome : rel.terapiaCid;

                const newFatura = new FaturaMensal({
                    fat_ano: parseInt(fat_ano),
                    fat_mes: parseInt(fat_mes),
                    fat_periodoini: new Date(fat_periodoini),
                    fat_periodofim: new Date(fat_periodofim),
                    fat_filtroconv: fat_filtroconv,
                    fat_tipoterapia: fat_tipoterapia,
                    fat_nterapias: i + 1,
                    fat_qualterapia: qualTerapia,
                    fat_qtdsessoes: rel.sessoes,
                    fat_valorsessao: rel.valores,
                    fat_valortotal: rel.total,
                    fat_datacad: dataAtual,
                    fat_usuidcad: usuarioAtual,
                    fat_lixo: "false"
                });

                await newFatura.save();
            }

            req.flash("success_message", "Faturamento salvo com sucesso!");
            res.redirect('/financeiro/fatura/lis');

        } catch (err) {
            console.error('ERRO CRÍTICO salvarFaturamento:', err);
            res.status(500).send(`<script>alert("Erro interno ao salvar faturamento."); history.back();</script>`);
        }
    },

    async relatorioAnual(req, res) {
        try {
            let db = req.cookies['preferredDb'];
            FaturaMensal = getModel(db, 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)

            const ano = parseInt(req.query.ano) || new Date().getFullYear();
            const tipoTerapia = req.query.tipoTerapia || 'Nome';

            const faturas = await FaturaMensal.find({
                fat_ano: ano,
                fat_tipoterapia: tipoTerapia,
                fat_lixo: { $ne: "true" }
            }).sort({ fat_mes: 1, fat_nterapias: 1 }).lean();

            // Agrupa por mês
            const meses = {};
            const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

            for (let i = 1; i <= 12; i++) {
                meses[i] = {
                    nome: nomesMeses[i - 1],
                    terapias: [],
                    totalSessoes: 0,
                    totalValor: 0
                };
            }

            faturas.forEach(f => {
                meses[f.fat_mes].terapias.push({
                    nTerapia: f.fat_nterapias,
                    qualTerapia: f.fat_qualterapia,
                    qtdSessoes: f.fat_qtdsessoes,
                    valorTotal: f.fat_valortotal
                });
                meses[f.fat_mes].totalSessoes += f.fat_qtdsessoes;
                meses[f.fat_mes].totalValor += parseFloat(f.fat_valortotal.replace(/\./g, '').replace(',', '.')) || 0;
            });

            // Formata total anual
            let totalAnual = 0;
            Object.values(meses).forEach(m => {
                totalAnual += m.totalValor;
            });

            res.render('financeiro/fatura/faturaAnual', {
                ano,
                tipoTerapia,
                meses,
                totalAnual: fncGeral.formatarReal(Math.round(totalAnual * 100))
            });

        } catch (err) {
            console.error('ERRO CRÍTICO relatorioAnual:', err);
            res.status(500).send(`<script>alert("Erro interno ao gerar relatório anual."); history.back();</script>`);
        }
    },

    carregaFaturaEdi(req, res) {
        let db = req.cookies['preferredDb'];
        FaturaMensal = getModel(db, 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Promise.all([
            FaturaMensal.findById(req.params.id),
            Conv.find({ conv_lixo: { $ne: "true" } }).sort({ conv_nome: 1 }),
            Terapia.find({ terapia_lixo: { $ne: "true" } }).sort({ terapia_nome: 1 })
        ])
            .then(([fatura, convs, terapias]) => {
                res.render('financeiro/fatura/faturaEdi', { fatura, convs, terapias });
            })
            .catch((err) => {
                console.error("Erro em carregaFaturaEdi:", err);
                res.redirect('/admin/erro');
            });
    },

    atualizaFatura(req, res) {
        let resposta;
        try {
            faturamensalClass.faturaEditar(req, res).then((res) => {
                console.log("Atualização Realizada!")
                resposta = res;
            }).catch((err) => {
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() => {
                if (resposta) {
                    console.log('verdadeiro')
                    this.listaFatura(req, res)
                } else {
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch (err1) {
            console.log(err1)
        }
    },

    deletaFatura(req, res) {
        faturamensalClass.faturaDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    this.listaFatura(req, res);
                } else {
                    console.log("Falha ao excluir");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaFatura:", err);
                res.render('admin/erro');
            });
    }
}