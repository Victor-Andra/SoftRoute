//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');

//estados e unidades federativas    
const estadoClass = require("../models/estado")

var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;


module.exports = {
  
  // === VALIDAÇÃO: Período já está fechado? ===
  async validarPeriodoFechado(req, beneId, dataAtendimento) {
    const db = req.cookies['preferredDb'];
    const AtendFecha = atendFechaClass.getModelAtendFecha(db);
    
    const ano = dataAtendimento.getFullYear();
    const mes = dataAtendimento.getMonth(); // 0-11
    
    const fechamento = await AtendFecha.findOne({
      fech_beneid: beneId,
      fech_ano_referencia: ano,
      fech_mes_referencia: mes,
      fech_status: { $in: ['FECHADO', 'RETIFICADO'] }
    });
    
    if (fechamento) {
      return {
        permitido: false,
        mensagem: `Período ${mes+1}/${ano} já está fechado para este beneficiário.`,
        fechamento: {
          id: fechamento._id,
          id_unico: fechamento.fech_id_unico,
          tipo: fechamento.fech_tipo,
          versao: fechamento.fech_num_versao,
          dataFechamento: fechamento.fech_datacad
        }
      };
    }
    
    return { permitido: true };
  },
  
  // === GERAR FECHAMENTO CONSOLIDADO + ANALÍTICOS ===
  async gerarFechamento(req, res) {
    try {
      const db = req.cookies['preferredDb'];
      const AtendFecha = atendFechaClass.getModelAtendFecha(db);
      const AtendModel = getModel(db, 'tb_atend', atendClass.AtendSchema);
      const Bene = getModel(db, 'tb_bene', require('../models/bene').BeneSchema);
      const Conv = getModel(db, 'tb_conv', require('../models/conv').ConvSchema);
      const Terapia = getModel(db, 'tb_terapia', require('../models/terapia').TerapiaSchema);
      
      const {
        beneid, bene_nome, convid, conv_nome,
        dataIni, dataFim, ano_referencia, mes_referencia,
        itens, totais, qt_atendimentos,
        analitico_comum, analitico_assinatura
      } = req.body;
      
      // === VALIDAÇÃO 1: Permissão (apenas gerente) ===
      const usuarioAtual = req.cookies['idUsu'];
      // TODO: Implementar verificação real de perfil
      // if (!usuarioTemPerfil(usuarioAtual, 'gerente')) {
      //   return res.status(403).json({ erro: 'Apenas gerentes podem fechar relatórios' });
      // }
      
      // === VALIDAÇÃO 2: Período já fechado? ===
      const fechamentoExistente = await AtendFecha.buscarVigente(db, beneid, ano_referencia, mes_referencia);
      
      if (fechamentoExistente) {
        return res.status(400).json({
          erro: `Período ${mes_referencia+1}/${ano_referencia} já está fechado.`,
          fechamento_id: fechamentoExistente._id,
          tipo: fechamentoExistente.fech_tipo,
          versao: fechamentoExistente.fech_num_versao
        });
      }
      
      // === VALIDAÇÃO 3: Conferir atendimentos ===
      const atendimentos = await AtendModel.find({
        atend_beneid: beneid,
        atend_atenddata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }
      });
      
      if (atendimentos.length !== parseInt(qt_atendimentos)) {
        return res.status(400).json({
          erro: 'Quantidade de atendimentos divergente. Atualize a página e tente novamente.'
        });
      }
      
      // === GERAR ID ÚNICO ===
      const proximaVersao = 1; // Sempre 1 para ORIGINAL
      const fech_id_unico = AtendFecha.gerarIdUnico(
        beneid, ano_referencia, mes_referencia, 'ORIGINAL', proximaVersao
      );
      
      // === SALVAR OS 3 FECHAMENTOS ===
      const fechamentosSalvos = [];
      
      // 1. CONSOLIDADO
      const fechConsolidado = new AtendFecha({
        fech_id_unico,
        fech_tipo_relatorio: 'CONSOLIDADO',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'ORIGINAL',
        fech_num_versao: proximaVersao,
        fech_id_pai: null,
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_itens: itens,
        fech_totais: totais,
        fech_qt_atendimentos: qt_atendimentos,
        fech_analitico_ids: []
      });
      await fechConsolidado.save();
      fechamentosSalvos.push(fechConsolidado);
      
      // 2. ANALÍTICO (comum)
      const fechAnalitico = new AtendFecha({
        fech_id_unico: fech_id_unico.replace('CONS', 'ANAL'),
        fech_tipo_relatorio: 'ANALITICO',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'ORIGINAL',
        fech_num_versao: proximaVersao,
        fech_id_pai: null,
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_corpo: analitico_comum,
        fech_qt_atendimentos: qt_atendimentos
      });
      await fechAnalitico.save();
      fechamentosSalvos.push(fechAnalitico);
      
      // 3. ANALÍTICO ASSINATURA
      const fechAnaliticoAss = new AtendFecha({
        fech_id_unico: fech_id_unico.replace('CONS', 'ANAS'),
        fech_tipo_relatorio: 'ANALITICO_ASS',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'ORIGINAL',
        fech_num_versao: proximaVersao,
        fech_id_pai: null,
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_corpo: analitico_assinatura,
        fech_qt_atendimentos: qt_atendimentos
      });
      await fechAnaliticoAss.save();
      fechamentosSalvos.push(fechAnaliticoAss);
      
      // === ATUALIZAR VÍNCULO ENTRE CONSOLIDADO E ANALÍTICOS ===
      fechConsolidado.fech_analitico_ids = [fechAnalitico._id, fechAnaliticoAss._id];
      await fechConsolidado.save();
      
      // === ATUALIZAR ATENDIMENTOS COM VÍNCULO ===
      await AtendModel.updateMany(
        {
          atend_beneid: beneid,
          atend_atenddata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }
        },
        {
          $push: { atend_fechid: fechConsolidado._id }
        }
      );
      
      // === LOG ===
      console.log(`✅ Fechamento criado: ${fech_id_unico} | ${qt_atendimentos} atendimentos`);
      
      // === RETORNO ===
      res.json({
        sucesso: true,
        fech_id_unico,
        fech_id: fechConsolidado._id,
        analiticos: [fechAnalitico._id, fechAnaliticoAss._id],
        mensagem: 'Relatórios fechados com sucesso!'
      });
      
    } catch (err) {
      console.error('❌ Erro ao fechar relatório:', err);
      res.status(500).json({ erro: 'Erro interno ao processar fechamento' });
    }
  },
  
  // === GERAR RETIFICAÇÃO ===
  async gerarRetificacao(req, res) {
    try {
      const db = req.cookies['preferredDb'];
      const AtendFecha = atendFechaClass.getModelAtendFecha(db);
      const AtendModel = getModel(db, 'tb_atend', atendClass.AtendSchema);
      
      const {
        fech_id_original,
        beneid, bene_nome, convid, conv_nome,
        dataIni, dataFim, ano_referencia, mes_referencia,
        itens, totais, qt_atendimentos,
        analitico_comum, analitico_assinatura,
        observacoes
      } = req.body;
      
      // === VALIDAÇÃO: Buscar fechamento original ===
      const fechOriginal = await AtendFecha.findById(fech_id_original);
      if (!fechOriginal || fechOriginal.fech_status !== 'FECHADO') {
        return res.status(400).json({ erro: 'Fechamento original não encontrado ou não está fechado.' });
      }
      
      // === GERAR ID ÚNICO DA RETIFICAÇÃO ===
      const proximaVersao = fechOriginal.fech_num_versao + 1;
      const fech_id_unico = AtendFecha.gerarIdUnico(
        beneid, ano_referencia, mes_referencia, 'RET', proximaVersao
      );
      
      const usuarioAtual = req.cookies['idUsu'];
      
      // === SALVAR OS 3 FECHAMENTOS RETIFICADOS ===
      const fechamentosSalvos = [];
      
      // 1. CONSOLIDADO RETIFICADO
      const fechConsolidado = new AtendFecha({
        fech_id_unico,
        fech_tipo_relatorio: 'CONSOLIDADO',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'RETIFICADORA',
        fech_num_versao: proximaVersao,
        fech_id_pai: fechOriginal._id,
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_itens: itens,
        fech_totais: totais,
        fech_qt_atendimentos: qt_atendimentos,
        fech_observacoes: observacoes,
        fech_analitico_ids: []
      });
      await fechConsolidado.save();
      fechamentosSalvos.push(fechConsolidado);
      
      // 2. ANALÍTICO RETIFICADO
      const fechAnalitico = new AtendFecha({
        fech_id_unico: fech_id_unico.replace('CONS', 'ANAL'),
        fech_tipo_relatorio: 'ANALITICO',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'RETIFICADORA',
        fech_num_versao: proximaVersao,
        fech_id_pai: fechOriginal.fech_analitico_ids[0],
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_corpo: analitico_comum,
        fech_qt_atendimentos: qt_atendimentos
      });
      await fechAnalitico.save();
      fechamentosSalvos.push(fechAnalitico);
      
      // 3. ANALÍTICO ASSINATURA RETIFICADO
      const fechAnaliticoAss = new AtendFecha({
        fech_id_unico: fech_id_unico.replace('CONS', 'ANAS'),
        fech_tipo_relatorio: 'ANALITICO_ASS',
        fech_beneid: beneid,
        fech_benenome: bene_nome,
        fech_convid: convid,
        fech_convnome: conv_nome,
        fech_ano_referencia: ano_referencia,
        fech_mes_referencia: mes_referencia,
        fech_dataini: new Date(dataIni),
        fech_datafim: new Date(dataFim),
        fech_tipo: 'RETIFICADORA',
        fech_num_versao: proximaVersao,
        fech_id_pai: fechOriginal.fech_analitico_ids[1],
        fech_usuid: usuarioAtual,
        fech_usu_nome: req.cookies['nomeUsu'] || 'Sistema',
        fech_status: 'FECHADO',
        fech_corpo: analitico_assinatura,
        fech_qt_atendimentos: qt_atendimentos
      });
      await fechAnaliticoAss.save();
      fechamentosSalvos.push(fechAnaliticoAss);
      
      // === ATUALIZAR VÍNCULO ENTRE CONSOLIDADO E ANALÍTICOS ===
      fechConsolidado.fech_analitico_ids = [fechAnalitico._id, fechAnaliticoAss._id];
      await fechConsolidado.save();
      
      // === ATUALIZAR ATENDIMENTOS: ADICIONAR NOVO VÍNCULO ===
      await AtendModel.updateMany(
        {
          atend_beneid: beneid,
          atend_atenddata: { $gte: new Date(dataIni), $lte: new Date(dataFim) }
        },
        {
          $push: { atend_fechid: fechConsolidado._id }
        }
      );
      
      // === ATUALIZAR STATUS DO ORIGINAL PARA RETIFICADO ===
      await AtendFecha.updateMany(
        { _id: { $in: fechOriginal.fech_analitico_ids } },
        { $set: { fech_status: 'RETIFICADO' } }
      );
      await AtendFecha.findByIdAndUpdate(fechOriginal._id, {
        $set: { fech_status: 'RETIFICADO' }
      });
      
      // === LOG ===
      console.log(`✅ Retificação criada: ${fech_id_unico} (versão ${proximaVersao})`);
      
      // === RETORNO ===
      res.json({
        sucesso: true,
        fech_id_unico,
        fech_id: fechConsolidado._id,
        versao: proximaVersao,
        mensagem: 'Retificação realizada com sucesso!'
      });
      
    } catch (err) {
      console.error('❌ Erro ao gerar retificação:', err);
      res.status(500).json({ erro: 'Erro interno ao processar retificação' });
    }
  },
  
  // === LISTAR FECHAMENTOS COM FILTROS ===
  async listarFechamentos(req, res) {
    try {
      const db = req.cookies['preferredDb'];
      const AtendFecha = atendFechaClass.getModelAtendFecha(db);
      
      const {
        beneid,
        ano,
        mes,
        status,
        tipo,
        usuid,
        pagina = 1,
        limite = 50
      } = req.query;
      
      const filtro = {};
      
      if (beneid) filtro.fech_beneid = beneid;
      if (ano) filtro.fech_ano_referencia = parseInt(ano);
      if (mes) filtro.fech_mes_referencia = parseInt(mes);
      if (status) filtro.fech_status = status;
      if (tipo) filtro.fech_tipo = tipo;
      if (usuid) filtro.fech_usuid = usuid;
      
      // Buscar apenas consolidados (os analíticos são vinculados)
      filtro.fech_tipo_relatorio = 'CONSOLIDADO';
      
      const total = await AtendFecha.countDocuments(filtro);
      const fechamentos = await AtendFecha.find(filtro)
        .sort({ fech_datacad: -1 })
        .skip((pagina - 1) * limite)
        .limit(parseInt(limite))
        .populate('fech_beneid', 'bene_nome')
        .populate('fech_convid', 'conv_nome')
        .populate('fech_usuid', 'usuario_nome');
      
      res.json({
        sucesso: true,
        total,
        pagina: parseInt(pagina),
        limite: parseInt(limite),
        fechamentos: fechamentos.map(f => ({
          _id: f._id,
          fech_id_unico: f.fech_id_unico,
          bene_nome: f.fech_benenome,
          conv_nome: f.fech_convnome,
          periodo: `${f.fech_mes_referencia+1}/${f.fech_ano_referencia}`,
          tipo: f.fech_tipo,
          versao: f.fech_num_versao,
          status: f.fech_status,
          dataFechamento: f.fech_datacad,
          usuario: f.fech_usu_nome,
          qt_atendimentos: f.fech_qt_atendimentos,
          valor_total: f.fech_totais?.valor_total
        }))
      });
      
    } catch (err) {
      console.error('❌ Erro ao listar fechamentos:', err);
      res.status(500).json({ erro: 'Erro interno ao listar fechamentos' });
    }
  },
  
  // === BUSCAR FECHAMENTO PARA REIMPRESSÃO ===
  async buscarFechamento(req, res) {
    try {
      const db = req.cookies['preferredDb'];
      const AtendFecha = atendFechaClass.getModelAtendFecha(db);
      const { fech_id } = req.params;
      
      const fechamento = await AtendFecha.findById(fech_id)
        .populate('fech_beneid')
        .populate('fech_convid')
        .populate('fech_usuid');
      
      if (!fechamento) {
        return res.status(404).json({ erro: 'Fechamento não encontrado' });
      }
      
      // Buscar analíticos vinculados
      const analiticos = await AtendFecha.find({
        _id: { $in: fechamento.fech_analitico_ids }
      });
      
      res.json({
        sucesso: true,
        consolidado: fechamento,
        analiticos: analiticos
      });
      
    } catch (err) {
      console.error('❌ Erro ao buscar fechamento:', err);
      res.status(500).json({ erro: 'Erro interno ao buscar fechamento' });
    }
  }
  
};