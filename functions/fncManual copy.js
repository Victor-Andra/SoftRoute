// functions/fncManual.js
const mongoose = require("mongoose");
const { getModel } = require('./fncGeral');

// Classes
const manualClass = require("../models/manual");
const usuarioClass = require("../models/usuario");
const estadoClass = require("../models/estado");

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
        let db = req.cookies['preferredDb'];

        Manual = getModel(db, 'tb_manual', manualClass.ManualSchema);
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

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
    carregarFormulario: async function(req, res) {
        try {
            const db = req.cookies['preferredDb'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
            const EstadoModel = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);

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
        
    // Mantemos as funções antigas (mas corrigidas para async/await)
    // Se quiser, posso refatorar também carregaManual, etc., mas você pediu só listar.

    carregaManual(req, res) {
        let db = req.cookies['preferredDb'];
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

    carregaManualEdi(req, res) {
        let db = req.cookies['preferredDb'];
        const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
        const EstadoModel = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);

        ManualModel.findById(req.params.id).then((manual) => {
            if (!manual || manual.man_lixo === "true") {
                req.flash("error_message", "Manual não encontrado ou excluído.");
                return res.redirect('/admin/erro');
            }
            return EstadoModel.find().then((estados) => {
                console.log("Listagem Realizada de Estados");
                res.render('ferramentas/manual/manualEdi', { manual, estados });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao carregar o manual.");
            res.render('admin/erro');
        });
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
            const db = req.cookies['preferredDb'];
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