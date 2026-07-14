//Exports
const mongoose = require("mongoose");
const { getModel } = require('../functions/fncGeral');

//Classes
const ajudaClass = require("../models/ajuda");
const usuarioClass = require("../models/usuario");
const manualClass = require("../models/manual")

// Tabelas — SEMPRE do PortalDoUsuario
const Ajuda = getModel("PortalDoUsuario", 'tb_ajuda', ajudaClass.AjudaSchema);
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
const Manual = getModel("PortalDoUsuario",'tb_manual',manualClass.ManualSchema);

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAjuda_OLD(req, res) {
        console.log('listando ajudas do PortalDoUsuario');
        
        // Busca usuários do PortalDoUsuario (não do softroute!)
        Usuario.find({
            "usuario_status": { $in: ["Ativo", "Inativo"] },
            $or: [
                { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
            ]
        }).then((usuarios) => {
            // Busca ajudas do PortalDoUsuario
            Ajuda.find({ ajuda_lixo: "false" })
                .sort({ ajuda_nome: 1 }) // Ordena por nome do ajuda
                .then((ajudas) => {
                    // Formata data de edição
                    ajudas.forEach((ajuda) => {
                        if (ajuda.ajuda_dataedi) {
                            const dataedi = new Date(ajuda.ajuda_dataedi);
                            const mes = String(dataedi.getMonth() + 1).padStart(2, '0');
                            const dia = String(dataedi.getUTCDate()).padStart(2, '0');
                            ajuda.dataedi = `${dataedi.getFullYear()}-${mes}-${dia}`;
                        } else {
                            ajuda.dataedi = '';
                        }
                    });
                    Manual.find().then((manual)=>{
                        manual.sort((a,b) => ((a.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.manual_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o manual por nome
                        //console.log("Listagem Realizada bene!")
                       
                    console.log("Listagem Realizada!");
                    res.render('ferramentas/ajuda', { ajudas, usuarios, manuals: manual  });
                })});
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Ajudas");
            res.redirect('/admin/erro');
        });
    },
    async listaAjuda(req, res) {
        console.log('🔍 listando ajudas do PortalDoUsuario');
        
        try {
            // ✅ CRIA O MODELO MANUAL BUSCANDO NO BANCO "softroute"
            const ManualModel = getModel("softroute", 'tb_manual', manualClass.ManualSchema);
            
            // 1. Busca usuários e ajudas simultaneamente
            const [usuarios, ajudas] = await Promise.all([
                Usuario.find({
                    "usuario_status": { $in: ["Ativo", "Inativo"] },
                    $or: [
                        { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                        { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                    ]
                }),
                Ajuda.find({ ajuda_lixo: "false" }).sort({ ajuda_nome: 1 })
            ]);

            console.log(`✅ Encontrados ${usuarios.length} usuários e ${ajudas.length} ajudas`);

            // Formata data de edição das ajudas
            ajudas.forEach((ajuda) => {
                if (ajuda.ajuda_dataedi) {
                    const dataedi = new Date(ajuda.ajuda_dataedi);
                    const mes = String(dataedi.getMonth() + 1).padStart(2, '0');
                    const dia = String(dataedi.getUTCDate()).padStart(2, '0');
                    ajuda.dataedi = `${dataedi.getFullYear()}-${mes}-${dia}`;
                } else {
                    ajuda.dataedi = '';
                }
            });

            // 2. Busca manuais no banco "softroute"
            console.log('🔎 Buscando manuais no banco softroute...');
            
            const manualList = await ManualModel.find({ man_lixo: { $ne: "true" } });
            console.log(`📚 Manuais encontrados: ${manualList.length}`);
            
            if (manualList.length > 0) {
                console.log('📋 Exemplo do primeiro manual:', JSON.stringify(manualList[0], null, 2));
            }

            const usuarioList = await Usuario.find();

            // Mapa de usuários
            const usuarioMap = usuarioList.reduce((acc, u) => {
                acc[u._id.toString()] = u;
                return acc;
            }, {});

            // Funções auxiliares de formatação
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

            function formatOnlyDateBR(date) {
                if (!date) return "--/--/----";
                const d = new Date(date);
                if (isNaN(d.getTime())) return "--/--/----";
                const dia = String(d.getDate()).padStart(2, '0');
                const mes = String(d.getMonth() + 1).padStart(2, '0');
                const ano = d.getFullYear();
                return `${dia}/${mes}/${ano}`;
            }

            // Enriquecer cada manual
            manualList.forEach(s => {
                s.datacad = s.man_datacad ? formatDateToBR(s.man_datacad) : "--/--/---- h--:--";
                s.dataedi = s.man_dataedi ? formatDateToBR(s.man_dataedi) : "--/--/---- h--:--";
                s.dataversao = formatOnlyDateBR(s.man_versaodata);

                const usuarioCad = usuarioMap[s.man_usuidcad?.toString()];
                const usuarioEdi = usuarioMap[s.man_usuidedi?.toString()];

                s.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "Não informado";
                s.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "Não informado";
            });

            // Ordenar manuais por nome
            manualList.sort((a, b) => {
                const nomeA = (a.man_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                const nomeB = (b.man_nome || '').normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                return nomeA.localeCompare(nomeB);
            });

            console.log(`✅ Enviando para view: ${manualList.length} manuais`);

            res.render('ferramentas/ajuda', { ajudas, usuarios, manuals: manualList });

        } catch (err) {
            console.error("❌ ERRO em listaAjuda:", err);
            req.flash("error_message", "Houve um erro ao listar Ajudas");
            res.redirect('/admin/erro');
        }
    },
    carregaAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ajuda.find({ ajuda_lixo: "false" }).then((ajudas) => {
            console.log("Listagem Realizada de Ajudas de Uso!");
            res.render("ferramentas/ajuda/ajudaCad", { ajudas });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Ajudas");
            res.redirect('/admin/erro');
        });
    },

    carregaAjudaEdi(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        Ajuda.findById(req.params.id).then((ajuda) => {
            if (!ajuda) {
                req.flash("error_message", "Ajuda não encontrado");
                return res.redirect('/admin/erro');
            }
            console.log("ID:", ajuda._id);
            res.render('ferramentas/ajuda/ajudaEdi', { ajudas: ajuda });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao carregar o ajuda para edição");
            res.render('admin/erro');
        });
    },

    cadastraAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        ajudaClass.ajudaAdicionar(req, res)
            .then((result) => {
                if (result === true) {
                    req.flash("success_message", "Cadastro realizado com sucesso!");
                    this.listaAjuda(req, res);
                } else {
                    // Se retornar uma string de erro
                    req.flash("error_message", result || "Erro desconhecido ao cadastrar ajuda");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro no cadastro:", err);
                req.flash("error_message", "Erro ao cadastrar ajuda");
                res.render('admin/erro');
            });
    },

    atualizaAjuda(req, res) {
        // Usa o modelo já configurado para PortalDoUsuario
        ajudaClass.ajudaEditar(req, res)
            .then((resultado) => {
                if (resultado === true) {
                    console.log("Atualização Realizada!");
                    req.flash("success_message", "Ajuda atualizado com sucesso!");
                    this.listaAjuda(req, res);
                } else {
                    console.error("Erro na atualização:", resultado);
                    req.flash("error_message", "Erro ao atualizar ajuda");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro em atualizaAjuda:", err);
                req.flash("error_message", "Erro ao atualizar ajuda");
                res.render('admin/erro');
            });
    },

    deletaAjuda: async (ajudaId, req, res) => {
        console.log("ID recebido na função deletaAjuda:", ajudaId);
        try {
            const resultado = await ajudaClass.ajudaDeletar(ajudaId, req, res);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaAjuda:", err);
            throw err;
        }
    }
};