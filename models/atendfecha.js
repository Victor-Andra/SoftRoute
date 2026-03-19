const mongoose = require('mongoose')
const fncGeral = require('../functions/fncGeral')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const AtendFechaSchema = new mongoose.Schema({
  // === IDENTIFICAÇÃO ÚNICA ===
  fech_id_unico: { 
    type: String, 
    required: true, 
    unique: true,
    // Formato: "FCB-202506-BEN123-ORIG-001"
  },
  
  fech_tipo_relatorio: { 
    type: String, 
    enum: ['CONSOLIDADO', 'ANALITICO', 'ANALITICO_ASS'], 
    required: true 
  },
  
  // === VÍNCULOS ===
  fech_beneid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Bene', 
    required: true,
    index: true 
  },
  fech_benenome: { type: String, required: true },
  
  fech_convid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Conv' 
  },
  fech_convnome: { type: String },
  
  // === PERÍODO DE REFERÊNCIA ===
  fech_ano_referencia: { type: Number, required: true, index: true },
  fech_mes_referencia: { type: Number, required: true, index: true }, // 0-11
  fech_dataini: { type: Date, required: true },
  fech_datafim: { type: Date, required: true },
  
  // === CONTROLE DE VERSÃO ===
  fech_tipo: { 
    type: String, 
    enum: ['ORIGINAL', 'RETIFICADORA'], 
    default: 'ORIGINAL',
    index: true
  },
  fech_num_versao: { type: Number, required: true },
  fech_id_pai: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'AtendFecha' // NULL se for ORIGINAL
  },
  
  // === AUDITORIA ===
  fech_usuid: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Usuario', 
    required: true 
  },
  fech_usu_nome: { type: String },
  fech_datacad: { type: Date, default: Date.now },
  
  // === STATUS ===
  fech_status: { 
    type: String, 
    enum: ['RASCUNHO', 'FECHADO', 'RETIFICADO'], 
    default: 'RASCUNHO',
    index: true
  },
  
  // === CORPO DO CONSOLIDADO (RESUMO) ===
  fech_itens: [{
    terapia_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Terapia' },
    terapia_nomecid: { type: String, required: true },
    qt_sessoes: { type: Number, required: true },
    valor_unitario: { type: String, required: true },
    subtotal: { type: String, required: true }
  }],
  
  fech_totais: {
    qt_total_sessoes: { type: Number, required: true },
    valor_total: { type: String, required: true }
  },
  
  // === METADADOS ===
  fech_qt_atendimentos: { type: Number },
  fech_observacoes: { type: String },
  
  // === VÍNCULO COM ANALÍTICOS ===
  fech_analitico_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AtendFecha'
  }]
  
}, { 
  timestamps: true,
  collection: 'tb_atendfecha'
});

// Índices compostos para busca rápida
AtendFechaSchema.index({ 
  fech_beneid: 1, 
  fech_ano_referencia: 1, 
  fech_mes_referencia: 1,
  fech_status: 1 
});

class AtendFecha {
  // Método estático para gerar ID único
  static gerarIdUnico(beneId, ano, mes, tipo, versao) {
    const tipoCod = tipo === 'ORIGINAL' ? 'ORIG' : 'RET';
    const beneShort = beneId.toString().slice(-6).toUpperCase();
    const mesStr = String(mes + 1).padStart(2, '0');
    const versaoStr = String(versao).padStart(3, '0');
    return `FCB-${ano}${mesStr}-${beneShort}-${tipoCod}-${versaoStr}`;
  }
  
  // Método para buscar fechamento vigente
  static async buscarVigente(db, beneId, ano, mes) {
    const AtendFechaModel = getModel(db, 'tb_atendfecha', AtendFechaSchema);
    return await AtendFechaModel.findOne({
      fech_beneid: beneId,
      fech_ano_referencia: ano,
      fech_mes_referencia: mes,
      fech_status: { $in: ['FECHADO', 'RETIFICADO'] }
    }).sort({ fech_num_versao: -1 });
  }
}

AtendFechaSchema.loadClass(AtendFecha);

module.exports = {
  AtendFechaSchema,
  getModelAtendFecha: (db) => getModel(db, 'tb_atendfecha', AtendFechaSchema)
};