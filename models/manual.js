//Gerador de Manuais da Route
//Diretoria e Gestão consegue gerar manuais e informativos dentro do SISROUTE
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

// Subschema: Descrições (subitens de um segmento)
const DescricaoSchema = new mongoose.Schema({
  man_segdescr_id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  man_segnumalf: { type: String, required: false },
  man_segdescr: { type: String, required: false }
}, { _id: false });

// Subschema: Segmentos
const SegmentoSchema = new mongoose.Schema({
  man_segid: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId()
  },
  man_segordem: { type: Number, required: true, default: 0 }, // número para ordenar
  man_segtitulo: { type: String, required: false },
  man_segintro: { type: String, required: false },
  man_segobs: { type: String, required: false },
  descricoes: [DescricaoSchema]
}, { _id: false });

// Schema Principal: Manual
const ManualSchema = new mongoose.Schema({
  man_nome: { type: String, required: false },
  man_titulo: { type: String, required: false },
  man_intro: { type: String, required: false },
  man_versao: { type: String, required: false },
  man_versaodata: { type: Date, required: false },

  // Hierarquia embutida: segmentos com subitens
  segmentos: [SegmentoSchema],

  // Atributos de controle (todos com prefixo man_)
  man_usuidcad: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  man_usuidedi: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false },
  man_datacad: { type: Date, required: false },
  man_dataedi: { type: Date, required: false },
  man_lixo: { type: String, default: "false" },
  man_datalixo: { type: Date, required: false },
  man_usuidlixo: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: false }
}, {
  // Opcional: auto-atualiza createdAt/updatedAt, mas respeitamos seus campos
  // timestamps: { createdAt: 'man_datacad', updatedAt: 'man_dataedi' }
});

// Classe (opcional, mas mantida para compatibilidade)
class Manual {
  constructor(data = {}) {
    Object.assign(this, data);
  }
}

ManualSchema.loadClass(Manual);

// Exporta modelo genérico (será instanciado por db no runtime)
module.exports = {
  ManualSchema,
  ManualModel: null, // será definido dinamicamente em fncManual.js

  // Métodos de CRUD (serão usados por fncManual.js)
  async manualAdicionar(req) {
    const db = req.cookies['PortalDoUsuario'];
    const ManualModel = getModel(db, 'tb_manual', ManualSchema);

    const usuarioAtual = req.cookies['idUsu'];
    const dataAtual = new Date();

    // ✅ Processa segmentos no cadastro (antes estava ignorando!)
    let segmentos = [];
    if (Array.isArray(req.body.segmentos)) {
        segmentos = req.body.segmentos.map(seg => ({
            man_segid: seg.man_segid || new mongoose.Types.ObjectId(),
            man_segordem: parseInt(seg.man_segordem) || 0,
            man_segtitulo: seg.man_segtitulo || '',
            man_segintro: seg.man_segintro || '',
            man_segobs: seg.man_segobs || '',
            descricoes: (seg.descricoes || []).map(desc => ({
                man_segdescr_id: desc.man_segdescr_id || new mongoose.Types.ObjectId(),
                man_segnumalf: desc.man_segnumalf || '',
                man_segdescr: desc.man_segdescr || ''
            }))
        }));
    }

    const newManual = new ManualModel({
        man_nome: req.body.manNome || '',
        man_titulo: req.body.manTitulo || '',
        man_intro: req.body.manIntro || '',
        man_versao: req.body.manVersao || '',
        man_versaodata: req.body.manVersaodata ? new Date(req.body.manVersaodata) : null,
        segmentos, // ✅ Agora com os segmentos!
        man_usuidcad: usuarioAtual,
        man_datacad: dataAtual,
        man_lixo: "false"
    });

    return await newManual.save();
},
  async manualEditar(req) {
    const db = req.cookies['PortalDoUsuario'];
    const ManualModel = getModel(db, 'tb_manual', ManualSchema);

    const usuarioAtual = req.cookies['idUsu'];
    const dataAtual = new Date();
    const manualId = req.body.manualId;

    if (!manualId) throw new Error("manualId é obrigatório");

    // Atualiza campos raiz + marca edição
    const update = {
      man_nome: req.body.manNome,
      man_titulo: req.body.manTitulo,
      man_intro: req.body.manIntro,
      man_versao: req.body.manVersao,
      man_versaodata: req.body.manVersaodata ? new Date(req.body.manVersaodata) : null,

      man_usuidedi: usuarioAtual,
      man_dataedi: dataAtual
    };

    // Se segmentos forem enviados como array (ex: edição completa), atualiza
    if (Array.isArray(req.body.segmentos)) {
      update.segmentos = req.body.segmentos.map(seg => ({
        man_segid: seg.man_segid || new mongoose.Types.ObjectId(),
        man_segordem: parseInt(seg.man_segordem) || 0,
        man_segtitulo: seg.man_segtitulo || '',
        man_segintro: seg.man_segintro || '',
        man_segobs: seg.man_segobs || '',
        descricoes: (seg.descricoes || []).map(desc => ({
          man_segdescr_id: desc.man_segdescr_id || new mongoose.Types.ObjectId(),
          man_segnumalf: desc.man_segnumalf || '',
          man_segdescr: desc.man_segdescr || ''
        }))
      }));
    }

    const result = await ManualModel.findByIdAndUpdate(
      manualId,
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!result) throw new Error("Manual não encontrado");
    return result;
  },

  async manualDeletar(req) {
    const db = req.cookies['PortalDoUsuario'];
    const ManualModel = getModel(db, 'tb_manual', ManualSchema);

    const usuarioAtual = req.cookies['idUsu'];
    const dataAtual = new Date();
    const manualId = req.params.id || req.body.manualId;

    if (!manualId) throw new Error("ID do manual não fornecido");

    const result = await ManualModel.findByIdAndUpdate(
      manualId,
      {
        $set: {
          man_lixo: "true",
          man_datalixo: dataAtual,
          man_usuidlixo: usuarioAtual
        }
      },
      { new: true }
    );

    return !!result; // true se encontrado e atualizado
  },

  // Métodos utilitários para segmentos/descrições (opcionais, mas úteis)
  async adicionarSegmento(req) {
    const db = req.cookies['PortalDoUsuario'];
    const ManualModel = getModel(db, 'tb_manual', ManualSchema);

    const { manualId, segmento } = req.body;
    const usuarioAtual = req.cookies['idUsu'];
    const dataAtual = new Date();

    const novoSeg = {
      man_segid: new mongoose.Types.ObjectId(),
      man_segordem: parseInt(segmento.man_segordem) || 0,
      man_segtitulo: segmento.man_segtitulo || '',
      man_segintro: segmento.man_segintro || '',
      man_segobs: segmento.man_segobs || '',
      descricoes: []
    };

    const res = await ManualModel.findByIdAndUpdate(
      manualId,
      {
        $push: { segmentos: novoSeg },
        $set: { man_usuidedi: usuarioAtual, man_dataedi: dataAtual }
      },
      { new: true }
    );
    return res;
  },

  async adicionarDescricao(req) {
    const db = req.cookies['PortalDoUsuario'];
    const ManualModel = getModel(db, 'tb_manual', ManualSchema);

    const { manualId, segId, descricao } = req.body;
    const usuarioAtual = req.cookies['idUsu'];
    const dataAtual = new Date();

    const novaDesc = {
      man_segdescr_id: new mongoose.Types.ObjectId(),
      man_segnumalf: descricao.man_segnumalf || '',
      man_segdescr: descricao.man_segdescr || ''
    };

    const res = await ManualModel.findOneAndUpdate(
      { _id: manualId, "segmentos.man_segid": segId },
      {
        $push: { "segmentos.$.descricoes": novaDesc },
        $set: { man_usuidedi: usuarioAtual, man_dataedi: dataAtual }
      },
      { new: true }
    );
    return res;
  }
};