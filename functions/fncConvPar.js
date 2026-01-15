// functions/fncConvPar.js
const mongoose = require("mongoose");
const { getModel } = require('./fncGeral');

// ✅ Import CORRETO dos controllers (não dos models!)
const fncConvcre = require("./fncConvcre"); // ← controller de crédito
const fncConvdeb = require("./fncConvdeb"); // ← controller de débito

// Classes para models (schema)
const terapiaClass = require("../models/terapia");
const convClass = require("../models/conv");
const usuarioClass = require("../models/usuario");
const convcreClass = require("../models/convCre"); // ← schema crédito
const convdebClass = require("../models/convDeb"); // ← schema débito

var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

module.exports = {
    // ✅ LISTAGEM UNIFICADA — igual ao seu `listaConvcre`, `listaConvdeb`
    listaConvPar: (req, res) => {
        let db = req.cookies['preferredDb'];
        
        // Modelos dinâmicos
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema);
        const Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        

        // Função auxiliar: formata data igual ao seu sistema
        const formatDateToBR = (date) => {
            if (!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        };

        // Busca em paralelo
        Promise.all([
            Convcre.find({ convcre_lixo: { $ne: "true" } }),
            Convdeb.find({ convdeb_lixo: { $ne: "true" } }),
            Conv.find(),
            Terapia.find(),
            Usuario.find()
        ])
        .then(([convcreList, convdebList, convList, terapiaList, usuarioList]) => {
            // Mapa rápido de usuários
            const usuarioMap = {};
            usuarioList.forEach(u => {
                usuarioMap[u._id.toString()] = u;
            });

            // Enriquece créditos com dados de histórico
            convcreList.forEach(c => {
                c.datacad = formatDateToBR(c.convcre_datacad);
                c.dataedi = formatDateToBR(c.convcre_dataedi);
                c.usuarioCadNome = usuarioMap[c.convcre_usuidcad]?.usuario_nome || "--";
                c.usuarioEdiNome = usuarioMap[c.convcre_usuidedi]?.usuario_nome || "--";
            });

            // Enriquece débitos com dados de histórico
            convdebList.forEach(d => {
                d.datacad = formatDateToBR(d.convdeb_datacad);
                d.dataedi = formatDateToBR(d.convdeb_dataedi);
                d.usuarioCadNome = usuarioMap[d.convdeb_usuidcad]?.usuario_nome || "--";
                d.usuarioEdiNome = usuarioMap[d.convdeb_usuidedi]?.usuario_nome || "--";
            });

            // Mapas de lookup
            const convMap = {};
            convList.forEach(c => {
                convMap[c._id.toString()] = c.conv_nome;
            });

            const terapiaMap = {};
            terapiaList.forEach(t => {
                terapiaMap[t._id.toString()] = {
                    nome: t.terapia_nome || "?",
                    status: t.terapia_status || "Ativo"
                };
            });

            // ✅ CHAVE NATURAL CORRIGIDA: só convid + terapiaid
            const paresMap = {};

            // 1. Processa CRÉDITOS
            convcreList.forEach(c => {
                const key = `${c.convcre_convid}_${c.convcre_terapiaid}`;
                if (!paresMap[key]) {
                    paresMap[key] = {
                        credito: c,
                        debito: null,
                        conv_nome: convMap[c.convcre_convid?.toString()] || "?",
                        terapia_nome: terapiaMap[c.convcre_terapiaid?.toString()]?.nome || "?",
                        terapia_status: terapiaMap[c.convcre_terapiaid?.toString()]?.status || "Ativo",
                        data_br: c.convcre_data, // mantém a data do crédito para ordenação
                        inconsistente: true,
                        temCredito: true,
                        temDebito: false,
                        ehAtivo: false
                    };
                } else {
                    // Se já existe crédito? Sobrescrever (ou acumular? vamos manter o último)
                    paresMap[key].credito = c;
                    paresMap[key].data_br = c.convcre_data;
                    paresMap[key].temCredito = true;
                }
            });

            // 2. Processa DÉBITOS — usa só convid + terapiaid
            convdebList.forEach(d => {
                const key = `${d.convdeb_convid}_${d.convdeb_terapiaid}`;
                if (paresMap[key]) {
                    // Complementa o par existente
                    paresMap[key].debito = d;
                    paresMap[key].inconsistente = false;
                    paresMap[key].temDebito = true;
                    paresMap[key].ehAtivo = (
                        paresMap[key].credito?.convcre_status === "Ativo" &&
                        d.convdeb_status === "Ativo"
                    );
                    // Mantém a data do crédito (ou pode usar max/min se quiser)
                } else {
                    // Débito órfão
                    paresMap[key] = {
                        credito: null,
                        debito: d,
                        conv_nome: convMap[d.convdeb_convid?.toString()] || "?",
                        terapia_nome: terapiaMap[d.convdeb_terapiaid?.toString()]?.nome || "?",
                        terapia_status: terapiaMap[d.convdeb_terapiaid?.toString()]?.status || "Ativo",
                        data_br: d.convdeb_data,
                        inconsistente: true,
                        temCredito: false,
                        temDebito: true,
                        ehAtivo: false
                    };
                }
            });

            // Converter para array
            const pares = Object.values(paresMap);

            // Ordenações padrão
            convList.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt', { sensitivity: 'base' }));
            terapiaList.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome, 'pt', { sensitivity: 'base' }));
            pares.sort((a, b) => new Date(b.data_br) - new Date(a.data_br));

            // Renderiza
            res.render('convenio/convpar/convParLis', {
                pares: pares,
                convs: convList,
                terapias: terapiaList,
                flashMessages: {
                    success: req.flash('success_message'),
                    error: req.flash('error_message')
                }
            });
        })
        .catch((err) => {
            console.error("Erro em listaConvPar:", err);
            res.redirect('/admin/erro');
        });
    },

    // ✅ CARREGA FORMULÁRIO — sem alteração (só ajustei imports)
    carregaConvPar: async (req, res) => {
        const db = req.cookies['preferredDb'];
        const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
        const Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

        try {
            const [convs, terapias] = await Promise.all([
                Conv.find().sort({ conv_nome: 1 }),
                Terapia.find().sort({ terapia_nome: 1 })
            ]);
            res.render("convenio/convpar/convParCad", { convs, terapias });
        } catch (err) {
            console.error("Erro ao carregar ConvPar:", err);
            res.redirect("/admin/erro");
        }
    },

    // ✅ CADASTRA PAR — mantido (com ajuste: `fncConvcre` e `fncConvdeb` já importados no topo)
    cadastraConvPar: async (req, res) => {
        const bodyCredito = {
            convcreConvid: req.body.convConvid,
            convcreConvnome: "",
            convcreTerapiaid: req.body.terapiaid,
            convcreData: req.body.data,
            convcreValor: req.body.valorCredito,
            convcreStatus: req.body.status,
            convcreObs: req.body.obs
    };

        const bodyDebito = {
            convdebConvid: req.body.convConvid,
            convdebConvnome: "",
            convdebTerapiaid: req.body.terapiaid,
            convdebData: req.body.data,
            convdebValor: req.body.valorDebito,
            convdebStatus: req.body.status,
            convdebObs: req.body.obs
        };

        try {
            // ✅ Espera o crédito ser salvo
            const okCredito = await new Promise((resolve) => {
                fncConvcre.cadastraConvcre({ ...req, body: bodyCredito }, {
                    redirect: (url) => resolve(!url.includes('/admin/erro')),
                    render: (view) => resolve(view !== 'admin/erro')
                });
            });

            if (!okCredito) {
                req.flash("error_message", "Falha ao salvar crédito.");
                return res.redirect("/menu/convenio/convpar/cad");
            }

            // ✅ Espera o débito ser salvo
            const okDebito = await new Promise((resolve) => {
                fncConvdeb.cadastraConvdeb({ ...req, body: bodyDebito }, {
                    redirect: (url) => resolve(!url.includes('/admin/erro')),
                    render: (view) => resolve(view !== 'admin/erro')
                });
            });

            if (!okDebito) {
                req.flash("warning_message", "Débito não foi salvo. Crédito foi mantido.");
                return res.redirect("/menu/convenio/convcre/lis");
            }

            req.flash("success_message", "Par crédito/débito cadastrado com sucesso!");
            return res.redirect("/menu/convenio/convpar/lis");

        } catch (err) {
            console.error("Erro em cadastraConvPar:", err);
            req.flash("error_message", "Erro interno ao salvar par.");
            return res.redirect("/menu/convenio/convpar/cad");
        }
    }

};