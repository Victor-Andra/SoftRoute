//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classes Extrangeiras
const ObjectId = require('mongodb').ObjectId;
const usuarioClass = require("../models/usuario")
const convClass = require("../models/conv")//convenio
const beneClass = require("../models/bene")
const atendClass = require("../models/atend")
const terapiaClass = require("../models/terapia")

const anoClass = require("../models/ano");
const agendaClass = require("../models/agenda");

//Tabelas Extrangeiras
var Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Ano  = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)
var Agenda  = getModel("SoftRoute", 'tb_agenda', agendaClass.AgendaSchema)



//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

class RelObjvalor{
    constructor(
        idlocal,
        campo,
        valor,
        total
        ){
        this.idlocal = idlocal,
        this.campo = campo,
        this.valor = valor,
        this.total = total
    }
}
    
module.exports = {
   // Substitua a função carregaRelQtdBene no arquivo fncEstatistica.js por esta versão

carregaRelQtdBene(req, res) {
    let db = req.cookies['preferredDb'];
    const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    const Conv = getModel(db, 'tb_conv', convClass.ConvSchema);

    // === Definir ano (filtro ou ano corrente) ===
    const anoFiltro = req.query.ano ? parseInt(req.query.ano) : new Date().getFullYear();
    console.log(`[RelQtdBene] Ano selecionado: ${anoFiltro}`);

    // === Carregar convênios ===
    Conv.find().sort('conv_nome').then((convs) => {
        console.log(`[RelQtdBene] Convênios carregados: ${convs.length}`);

        // === Carregar TODOS os beneficiários (ativos e inativos) para análise ===
        Bene.find().lean().then((todosBene) => {
            console.log(`[RelQtdBene] Total de beneficiários encontrados: ${todosBene.length}`);

            // === Função auxiliar para parse de datas ===
            const parseDateSafe = (val) => {
                if (!val) return null;
                const d = new Date(val);
                return isNaN(d.getTime()) ? null : d;
            };

            // === Processar beneficiários ===
            const benesProcessados = todosBene.map(b => {
                const regDate = parseDateSafe(b.bene_dtaini) || parseDateSafe(b.bene_datacad) || null;
                const endDate = parseDateSafe(b.bene_dtafim) || null;
                const status = (b.bene_status || '').trim();
                const convid = String(b.bene_convid);
                const liminar = b.bene_liminar || 'Não';
                return { regDate, endDate, status, convid, liminar };
            });

            // ========================================
            // ANÁLISE 1: EVOLUÇÃO MENSAL DE BENEFICIÁRIOS
            // ========================================
            const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 
                               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
            
            const novosMes = new Array(12).fill(0);
            const descontinuadosMes = new Array(12).fill(0);
            const totalEvolucao = new Array(12).fill(0);

            // Calcular base anterior (beneficiários ativos antes do ano selecionado)
            let totalBaseAnterior = benesProcessados.filter(b => {
                return b.regDate && b.regDate.getFullYear() < anoFiltro && b.status === "Ativo";
            }).length;

            console.log(`[RelQtdBene] Base anterior ao ano ${anoFiltro}: ${totalBaseAnterior}`);

            // Contar novos e descontinuados por mês
            for (let m = 0; m < 12; m++) {
                const monthStart = new Date(anoFiltro, m, 1, 0, 0, 0, 0);
                const monthEnd = new Date(anoFiltro, m + 1, 0, 23, 59, 59, 999);
                
                benesProcessados.forEach(b => {
                    const { regDate, endDate, status } = b;
                    
                    // Novos beneficiários no mês
                    if (regDate && regDate >= monthStart && regDate <= monthEnd) {
                        novosMes[m]++;
                    }
                    
                    // Beneficiários que saíram (inativaram) no mês
                    if (endDate && endDate >= monthStart && endDate <= monthEnd && status === "Inativo") {
                        descontinuadosMes[m]++;
                    }
                });
            }

            // Calcular total acumulado mês a mês
            let acumuladoNovos = 0;
            let acumuladoDescontinuados = 0;
            for (let m = 0; m < 12; m++) {
                acumuladoNovos += novosMes[m];
                acumuladoDescontinuados += descontinuadosMes[m];
                totalEvolucao[m] = totalBaseAnterior + acumuladoNovos - acumuladoDescontinuados;
                if (totalEvolucao[m] < 0) totalEvolucao[m] = 0;
            }

            // Montar array para a tabela
            const evolucaoMensal = monthNames.map((mes, i) => ({
                mes: mes,
                novos: novosMes[i],
                descontinuados: descontinuadosMes[i],
                total: totalEvolucao[i]
            }));

            // Calcular totais anuais
            const totalNovosAno = novosMes.reduce((a, b) => a + b, 0);
            const totalDescontinuadosAno = descontinuadosMes.reduce((a, b) => a + b, 0);
            const totalFinalAno = totalEvolucao[11]; // Último mês do ano

            console.log(`[RelQtdBene] Evolução mensal calculada para ${anoFiltro}`);

            // ========================================
            // ANÁLISE 2: BENEFICIÁRIOS POR CONVÊNIO
            // ========================================
            const beneAtivos = benesProcessados.filter(b => b.status === "Ativo");
            
            const benesPorConvenio = convs.map(c => {
                const qt = beneAtivos.filter(b => b.convid === String(c._id)).length;
                return {
                    conv_nome: c.conv_nome,
                    quantidade: qt
                };
            }).filter(item => item.quantidade > 0) // Apenas convênios com beneficiários
              .sort((a, b) => a.conv_nome.localeCompare(b.conv_nome));

            // Calcular total de beneficiários por convênio
            const totalBeneConvenio = benesPorConvenio.reduce((acc, item) => acc + item.quantidade, 0);

            console.log(`[RelQtdBene] Beneficiários por convênio calculados: ${benesPorConvenio.length} convênios com beneficiários`);

            // ========================================
            // ANÁLISE 3: BENEFICIÁRIOS POR TIPO
            // ========================================
            const ID_PARTICULAR = "62477742e416141415ff7a88";
            let qtParticular = 0, qtLiminar = 0, qtConvenio = 0;

            beneAtivos.forEach(b => {
                if (b.convid === ID_PARTICULAR) {
                    qtParticular++;
                } else if (b.liminar === "Sim") {
                    qtLiminar++;
                } else {
                    qtConvenio++;
                }
            });

            const benesPorTipo = [
                { tipo: 'Convênio', quantidade: qtConvenio, classe: 'tipo-convenio' },
                { tipo: 'Particular', quantidade: qtParticular, classe: 'tipo-particular' },
                { tipo: 'Liminar', quantidade: qtLiminar, classe: 'tipo-liminar' }
            ];

            // Calcular total de beneficiários por tipo
            const totalBeneTipo = qtConvenio + qtParticular + qtLiminar;

            console.log(`[RelQtdBene] Beneficiários por tipo: Convênio=${qtConvenio}, Particular=${qtParticular}, Liminar=${qtLiminar}`);

            // ========================================
            // RENDERIZAR VIEW
            // ========================================
            res.render("atendimento/atendreltera/gestao/relqtbene", {
                anoFiltro: anoFiltro,
                evolucaoMensal: evolucaoMensal,
                totalNovosAno: totalNovosAno,
                totalDescontinuadosAno: totalDescontinuadosAno,
                totalFinalAno: totalFinalAno,
                benesPorConvenio: benesPorConvenio,
                totalBeneConvenio: totalBeneConvenio,
                benesPorTipo: benesPorTipo,
                totalBeneTipo: totalBeneTipo,
                totalBeneAtivos: beneAtivos.length
            });

            console.log(`[RelQtdBene] View renderizada com sucesso!`);

        }).catch(err => {
            console.error("[RelQtdBene] Erro ao buscar beneficiários:", err);
            req.flash("error_message", "Houve um erro ao carregar os beneficiários.");
            res.redirect("/admin/erro");
        });

    }).catch(err => {
        console.error("[RelQtdBene] Erro ao carregar convênios:", err);
        req.flash("error_message", "Houve um erro ao carregar os convênios.");
        res.redirect("/admin/erro");
    });
}
}
