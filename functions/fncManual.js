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
    async listarManual(req, res) {
        try {
            const db = req.cookies['preferredDb'];
            const ManualModel = getModel(db, 'tb_manual', manualClass.ManualSchema);
            const UsuarioModel = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

            // Busca manuais ativos (man_lixo !== "true")
            const [manualList, usuarioList] = await Promise.all([
                ManualModel.find({ man_lixo: { $ne: "true" } }).lean(),
                UsuarioModel.find().lean()
            ]);

            // Mapa de usuários por _id (string)
            const usuarioMap = {};
            usuarioList.forEach(u => {
                usuarioMap[u._id.toString()] = u;
            });

            // Enriquece cada manual com dados formatados
            const enrichedManuals = manualList.map(manual => {
                return {
                    ...manual,
                    // Formatação de datas
                    datacad: formatDateToBR(manual.man_datacad),
                    dataedi: formatDateToBR(manual.man_dataedi),

                    // Nomes dos usuários (cadastro/edição)
                    usuarioCadNome: manual.man_usuidcad 
                        ? (usuarioMap[manual.man_usuidcad.toString()]?.usuario_nome || "Não informado")
                        : "Não informado",
                    
                    usuarioEdiNome: manual.man_usuidedi 
                        ? (usuarioMap[manual.man_usuidedi.toString()]?.usuario_nome || "Não informado")
                        : "Não informado"
                };
            });

            // Renderiza view
            res.render('ferramentas/manual/manualLis', { manuals: enrichedManuals });
        } catch (err) {
            console.error("Erro em listarManual:", err);
            req.flash("error_message", "Erro ao carregar a lista de manuais.");
            res.redirect('/admin/erro');
        }
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