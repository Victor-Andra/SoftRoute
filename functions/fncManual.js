// functions/fncManual.js
const mongoose = require("mongoose");
const { getModel } = require('./fncGeral');

// Classes
const manualClass = require("../models/manual");
const usuarioClass = require("../models/usuario");
const estadoClass = require("../models/estado");

var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
// Função auxiliar para formatar data como dd/mm/yyyy hHH:MM
function formatDateToBR(date) {
    if (!date) return "--/--/---- h--:--";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "--/--/---- h--:--";
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const minuto = String(d.getMinutes()).padStart(2, '0');
    return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
}

module.exports = {
   
    // ✅ Nova função: listarManual (GET)
    listarManual(req, res) {
        let db = req.cookies['PortalDoUsuario'];

        Manual = getModel(db, 'tb_manual', manualClass.ManualSchema);

        // Função auxiliar para formatar data como dd/mm/yyyy hhh:mm
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
        function formatOnlyDateBR(date) {
            if (!date) return "--/--/----";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

        Promise.all([
            Manual.find({ man_lixo: { $ne: "true" } }),   // corrigido
            Usuario.find()
        ])
        .then(([manualList, usuarioList]) => {

            // Mapa de usuários
            const usuarioMap = usuarioList.reduce((acc, u) => {
                acc[u._id.toString()] = u;
                return acc;
            }, {});

            // Enriquecer cada manual
            manualList.forEach(s => {

                // Datas corretas:
                s.datacad = s.man_datacad ? formatDateToBR(s.man_datacad) : "--/--/---- h--:--";
                s.dataedi = s.man_dataedi ? formatDateToBR(s.man_dataedi) : "--/--/---- h--:--";
                s.dataversao = formatOnlyDateBR(s.man_versaodata);
                

                // Usuários corretos:
                const usuarioCad = usuarioMap[s.man_usuidcad?.toString()];
                const usuarioEdi = usuarioMap[s.man_usuidedi?.toString()];

                s.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "Não informado";
                s.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "Não informado";
            });

            res.render('ferramentas/manual/manualLis', { manuals: manualList });
        })
        .catch((err) => {
            console.error("Erro em listaManual:", err);
            res.redirect('/admin/erro');
        });
    },

    // ✅ Formulário unificado (cadastro OU edição)
    carregarFormularioOLD: async function(req, res) {
        try {
            const db = req.cookies['PortalDoUsuario'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
            const EstadoModel = getModel(db, 'tb_estado', estadoClass.EstadoSchema);

            const estados = await EstadoModel.find().lean();
            let manual = null;
            let modo = 'cadastro';

            if (req.params.id) {
                manual = await ManualModel.findById(req.params.id).lean();
                if (!manual || manual.man_lixo === "true") {
                    req.flash("error_message", "Manual não encontrado.");
                    return res.redirect('/admin/erro');
                }
                modo = 'edicao';
            }

            const manualJSON = manual ? JSON.stringify(manual) : 'null';
            res.render('ferramentas/manual/manualForm', { modo, manualJSON, estados });
        } catch (err) {
            console.error("carregarFormulario:", err);
            req.flash("error_message", "Erro ao carregar formulário.");
            res.redirect('/admin/erro');
        }
    },
    carregarFormularioOLD2: async function(req, res) {
        try {
            const db = req.cookies['PortalDoUsuario'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
            const EstadoModel = getModel(db, 'tb_estado', estadoClass.EstadoSchema);

            const estados = await EstadoModel.find().lean();
            let manual = null;
            let modo = 'cadastro';

            if (req.params.id) {
                manual = await ManualModel.findById(req.params.id).lean();
                if (!manual || manual.man_lixo === "true") {
                    req.flash("error_message", "Manual não encontrado.");
                    return res.redirect('/admin/erro');
                }
                modo = 'edicao';
            }

            // 👇 ENVIA O OBJETO manual REAL para a view
            res.render('ferramentas/manual/manualForm', { modo, manual, estados });

        } catch (err) {
            console.error("carregarFormulario:", err);
            req.flash("error_message", "Erro ao carregar formulário.");
            res.redirect('/admin/erro');
        }
    },
    carregarFormulario: async function(req, res) {
        try {
            const db = req.cookies['PortalDoUsuario'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);

            const manuals = await ManualModel.find().lean();

            return res.render('ferramentas/manual/manualForm', {
                modo: 'cadastro',
                manuals
            });

        } catch (err) {
            console.error("carregarFormulario:", err);
            req.flash("error_message", "Erro ao carregar formulário.");
            res.redirect('/admin/erro');
        }
    },

    // Mantemos as funções antigas (mas corrigidas para async/await)
    // Se quiser, posso refatorar também carregaManual, etc., mas você pediu só listar.

    carregaManual(req, res) {
        let db = req.cookies['PortalDoUsuario'];
        const EstadoModel = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);

        EstadoModel.find().then((estados) => {
            console.log("Listagem Realizada de UFs!");
            res.render("ferramentas/manual/manualCad", { estados });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar UFs.");
            res.redirect('/admin/erro');
        });
    },

    carregarFormularioEdiOLD: async function(req, res) {
        try {
            const db = req.cookies['PortalDoUsuario'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
            const EstadoModel = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);

            const estados = await EstadoModel.find().lean();

            let manual = await ManualModel.findById(req.params.id).lean();

            if (!manual || manual.man_lixo === "true") {
                req.flash("error_message", "Manual não encontrado.");
                return res.redirect('/admin/erro');
            }

            return res.render('ferramentas/manual/manualFormEdi', {
                modo: 'edicao',
                manual,
                estados
            });

        } catch (err) {
            console.error("carregarFormularioEdi:", err);
            req.flash("error_message", "Erro ao carregar formulário.");
            res.redirect('/admin/erro');
        }
    },
carregarFormularioEdi: async function(req, res) {
    try {
        const db = req.cookies['PortalDoUsuario'];
        const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);

        console.log("📥 REQ PARAMS:", req.params);

        let manual = null;
        let modo = 'edicao';

        if (req.params.id) {
            manual = await ManualModel.findById(req.params.id).lean();

            console.log("\n\n==================== 📌 MANUAL RAW DO MONGO ====================");
            console.log(JSON.stringify(manual, null, 2));
            console.log("================================================================\n\n");

            if (!manual) {
                console.log("❌ Manual não encontrado no banco");
                req.flash("error_message", "Manual não encontrado.");
                return res.redirect('/admin/erro');
            }

            if (manual.man_lixo === "true") {
                console.log("⚠️ Manual marcado como lixo");
                req.flash("error_message", "Manual não encontrado.");
                return res.redirect('/admin/erro');
            }
        }

        // 🔍 Se segmentos vierem undefined, substitui por []
        if (!manual.segmentos) {
            console.log("⚠️ Manual.segmentos veio undefined! Ajustando para []");
            manual.segmentos = [];
        }

        // DEBUG DE CADA SEGMENTO
        console.log("\n======= 🧩 DEBUG — SEGMENTOS =======");
        manual.segmentos.forEach((seg, i) => {
            console.log(`SEGMENTO ${i}:`, JSON.stringify(seg, null, 2));

            if (!seg.descricoes) {
                console.log(`⚠️ descricoes do segmento ${i} vieram undefined. Ajustando.`);
                seg.descricoes = [];
            }

            seg.descricoes.forEach((desc, j) => {
                console.log(`  → DESCRIÇÃO ${j}:`, JSON.stringify(desc, null, 2));
            });
        });
        console.log("===================================\n");

        // ENVIA PARA A VIEW
        console.log("\n\n==================== 📤 ENVIANDO PARA O HANDLEBARS ====================");
        console.log("Modo:", modo);
        console.log("manual enviado:", JSON.stringify(manual, null, 2));
        console.log("========================================================================\n\n");
        // 🔹 Pré-calcula índices para evitar {{../@index}} no Handlebars
        if (manual.segmentos && Array.isArray(manual.segmentos)) {
            manual.segmentos = manual.segmentos.map((seg, segIndex) => ({
                ...seg,
                segIndex: segIndex,
                descricoes: (seg.descricoes || []).map((desc, descIndex) => ({
                    ...desc,
                    segIndex: segIndex,
                    descIndex: descIndex
                }))
            }));
        }
        res.render('ferramentas/manual/manualFormEdi', {
            modo,
            manual
        });

    } catch (err) {
        console.error("\n\n❌ ERRO em carregarFormularioEdi:", err, "\n\n");
        req.flash("error_message", "Erro ao carregar formulário.");
        res.redirect('/admin/erro');
    }
},
carregarFormularioVer: async function(req, res) {
    try {
        // ✅ USA O BANCO DO COOKIE (igual as outras funções)
        const db = req.cookies['PortalDoUsuario'];
        const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);

        console.log("📥 REQ PARAMS:", req.params);

        let manual = null;
        let modo = 'edicao';

        if (req.params.id) {
            manual = await ManualModel.findById(req.params.id).lean();

            console.log("\n\n==================== 📌 MANUAL RAW DO MONGO ====================");
            console.log(JSON.stringify(manual, null, 2));
            console.log("================================================================\n\n");

            if (!manual) {
                console.log("❌ Manual não encontrado no banco");
                req.flash("error_message", "Manual não encontrado.");
                return res.redirect('/admin/erro');
            }

            if (manual.man_lixo === "true") {
                console.log("⚠️ Manual marcado como lixo");
                req.flash("error_message", "Manual não encontrado.");
                return res.redirect('/admin/erro');
            }
        }

        if (!manual.segmentos) {
            console.log("⚠️ Manual.segmentos veio undefined! Ajustando para []");
            manual.segmentos = [];
        }

        console.log("\n======= 🧩 DEBUG — SEGMENTOS =======");
        manual.segmentos.forEach((seg, i) => {
            console.log(`SEGMENTO ${i}:`, JSON.stringify(seg, null, 2));

            if (!seg.descricoes) {
                console.log(`⚠️ descricoes do segmento ${i} vieram undefined. Ajustando.`);
                seg.descricoes = [];
            }

            seg.descricoes.forEach((desc, j) => {
                console.log(`  → DESCRIÇÃO ${j}:`, JSON.stringify(desc, null, 2));
            });
        });
        console.log("===================================\n");

        if (manual.segmentos && Array.isArray(manual.segmentos)) {
            manual.segmentos = manual.segmentos.map((seg, segIndex) => ({
                ...seg,
                segIndex: segIndex,
                descricoes: (seg.descricoes || []).map((desc, descIndex) => ({
                    ...desc,
                    segIndex: segIndex,
                    descIndex: descIndex
                }))
            }));
        }

        console.log("\n\n==================== 📤 ENVIANDO PARA O HANDLEBARS ====================");
        console.log("Modo:", modo);
        console.log("manual enviado:", JSON.stringify(manual, null, 2));
        console.log("========================================================================\n\n");

        res.render('ferramentas/manual/manualFormVer', {
            modo,
            manual
        });

    } catch (err) {
        console.error("\n\n❌ ERRO em carregarFormularioVer:", err, "\n\n");
        req.flash("error_message", "Erro ao carregar formulário.");
        res.redirect('/admin/erro');
    }
},
    cadastraManual(req, res) {
        manualClass.manualAdicionar(req, res)
            .then(() => {
                req.flash("success_message", "Cadastro realizado com sucesso!");
                this.listarManual(req, res); // ← usar listarManual (novo nome)
            })
            .catch((err) => {
                console.error("Erro em cadastraManual:", err);
                req.flash("error_message", "Erro ao cadastrar manual.");
                res.render('admin/erro');
            });
    },

    atualizaManual(req, res) {
        manualClass.manualEditar(req, res)
            .then(() => {
                req.flash("success_message", "Atualização realizada com sucesso!");
                this.listarManual(req, res);
            })
            .catch((err) => {
                console.error("Erro em atualizaManual:", err);
                req.flash("error_message", "Erro ao atualizar manual.");
                res.render('admin/erro');
            });
    },
    // ✅ Nova função unificada: salvarManual (substitui cadastraManual + atualizaManual)
    salvarManual: async function(req, res) {
        console.log("🟢 POST /ferramentas/manual/save → salvarManual() chamado");

        try {
            const db = req.cookies['PortalDoUsuario'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);

            const {
                manualId,
                manNome,
                manTitulo,
                manIntro,
                manVersao,
                manVersaodata
            } = req.body;

            if (!manNome?.trim()) {
                throw new Error("Nome do manual é obrigatório.");
            }

            // Campos principais
            const updateData = {
                man_nome: manNome.trim(),
                man_titulo: manTitulo?.trim() || '',
                man_intro: manIntro?.trim() || '',
                man_versao: manVersao?.trim() || '',
                man_versaodata: manVersaodata ? new Date(manVersaodata) : null,
                man_dataedi: new Date(),
                man_usuidedi: req.user?._id
            };

            // ✅ Função auxiliar pra gerar IDs válidos
            const ensureObjectId = (val) => {
                if (!val || typeof val !== 'string') return new mongoose.Types.ObjectId();
                // Se é um ID temporário do front
                if (val.startsWith('temp_')) return new mongoose.Types.ObjectId();
                // Se é válido no formato 24 hex chars
                if (/^[0-9a-fA-F]{24}$/.test(val)) return new mongoose.Types.ObjectId(val);
                // Senão, cria novo
                return new mongoose.Types.ObjectId();
            };

            // ✅ Processa segmentos (suporta array ou objeto)
            if (req.body.segmentos) {
                const segmentosBrutos = Array.isArray(req.body.segmentos)
                    ? req.body.segmentos
                    : Object.values(req.body.segmentos);

                const segmentos = segmentosBrutos
                    .map((seg, idx) => {
                        if (!seg || !seg.man_segtitulo) return null;

                        const descricoesBrutas = Array.isArray(seg.descricoes)
                            ? seg.descricoes
                            : Object.values(seg.descricoes || {});

                        const descricoes = descricoesBrutas
                            .filter(desc => desc && desc.man_segdescr)
                            .map(desc => ({
                                man_segdescr_id: ensureObjectId(desc.man_segdescr_id),
                                man_segnumalf: desc.man_segnumalf?.trim() || '',
                                man_segdescr: desc.man_segdescr?.trim() || ''
                            }));

                        return {
                            man_segid: ensureObjectId(seg.man_segid),
                            man_segordem: parseInt(seg.man_segordem) || idx + 1,
                            man_segtitulo: seg.man_segtitulo?.trim() || '',
                            man_segintro: seg.man_segintro?.trim() || '',
                            man_segobs: seg.man_segobs?.trim() || '',
                            descricoes
                        };
                    })
                    .filter(Boolean);

                updateData.segmentos = segmentos;
            }

            console.log("🧩 updateData final:", JSON.stringify(updateData, null, 2));

            let result;
            if (manualId) {
                console.log(`✏️ Atualizando manual: ${manualId}`);
                result = await ManualModel.findByIdAndUpdate(
                    manualId,
                    { $set: updateData },
                    { new: true, runValidators: true }
                );
                if (!result) {
                    throw new Error(`Manual com ID ${manualId} não encontrado.`);
                }
                console.log("🟦 Documento ATUALIZADO:", JSON.stringify(result, null, 2));
                req.flash("success_message", "Manual atualizado com sucesso!");
            } else {
                console.log("➕ Criando novo manual");
                updateData.man_datacad = new Date();
                updateData.man_usuidcad = req.user?._id;
                updateData.man_lixo = "false";

                result = await ManualModel.create(updateData);
                console.log("🟩 Documento CRIADO:", JSON.stringify(result, null, 2));
                req.flash("success_message", "Manual criado com sucesso!");
            }

            console.log("✅ Salvamento realizado com sucesso. Redirecionando para listagem...");
            this.listarManual(req, res);

        } catch (err) {
            console.error("🔴 Erro em salvarManual:", err);
            req.flash("error_message", `Erro ao salvar manual: ${err.message || 'erro desconhecido'}`);
            res.render('admin/erro');
        }
    },

    deletaManual(req, res) {
        manualClass.manualDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    req.flash("success_message", "Manual movido para a lixeira.");
                    this.listarManual(req, res);
                } else {
                    req.flash("error_message", "Manual não encontrado.");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em deletaManual:", err);
                req.flash("error_message", "Erro ao excluir manual.");
                res.render('admin/erro');
            });
    }
};