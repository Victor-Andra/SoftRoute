const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const { getModel } = require('../functions/fncGeral');

const FaturaMensalSchema = mongoose.Schema({
    fat_ano: { type: Number, required: true },
    fat_mes: { type: Number, required: true },
    fat_periodoini: { type: Date, required: true },
    fat_periodofim: { type: Date, required: true },
    fat_filtroconv: { type: String, required: true },
    fat_tipoterapia: { type: String, required: true },
    fat_nterapias: { type: Number, required: true },
    fat_qualterapia: { type: String, required: true },
    fat_qtdsessoes: { type: Number, required: true },
    fat_valorsessao: { type: [String], required: true },
    fat_valortotal: { type: String, required: true },
    //controle CRUD
    fat_datacad: { type: Date, required: false },
    fat_dataedi: { type: Date, required: false },
    fat_usuidcad: { type: ObjectId, required: false },
    fat_usuidedi: { type: ObjectId, required: false },
    fat_lixo: { type: String, required: false },
    fat_datalixo: { type: String, required: false },
    fat_usuidlixo: { type: ObjectId, required: false }
})

class FaturaMensal {
    constructor(
        fat_ano,
        fat_mes,
        fat_periodoini,
        fat_periodofim,
        fat_filtroconv,
        fat_tipoterapia,
        fat_nterapias,
        fat_qualterapia,
        fat_qtdsessoes,
        fat_valorsessao,
        fat_valortotal,
        //controle CRUD
        fat_datacad,
        fat_dataedi,
        fat_usuidcad,
        fat_usuidedi,
        fat_lixo,
        fat_datalixo,
        fat_usuidlixo
    ) {
        this.fat_ano = fat_ano,
        this.fat_mes = fat_mes,
        this.fat_periodoini = fat_periodoini,
        this.fat_periodofim = fat_periodofim,
        this.fat_filtroconv = fat_filtroconv,
        this.fat_tipoterapia = fat_tipoterapia,
        this.fat_nterapias = fat_nterapias,
        this.fat_qualterapia = fat_qualterapia,
        this.fat_qtdsessoes = fat_qtdsessoes,
        this.fat_valorsessao = fat_valorsessao,
        this.fat_valortotal = fat_valortotal,
        //controle CRUD
        this.fat_datacad = fat_datacad,
        this.fat_dataedi = fat_dataedi,
        this.fat_usuidcad = fat_usuidcad,
        this.fat_usuidedi = fat_usuidedi,
        this.fat_lixo = fat_lixo,
        this.fat_datalixo = fat_datalixo,
        this.fat_usuidlixo = fat_usuidlixo
    }
}

FaturaMensalSchema.loadClass(FaturaMensal)
var FaturaMensalModel = getModel("softroute", 'tb_faturamensal', FaturaMensalSchema)

module.exports = {
    FaturaMensalModel,
    FaturaMensalSchema,

    faturaEditar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        FaturaMensalModel = getModel(db, 'tb_faturamensal', FaturaMensalSchema)

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;

        await FaturaMensalModel.findByIdAndUpdate(req.body.faturaId,
            {
                $set: {
                    fat_ano: req.body.fat_ano,
                    fat_mes: req.body.fat_mes,
                    fat_periodoini: req.body.fat_periodoini,
                    fat_periodofim: req.body.fat_periodofim,
                    fat_filtroconv: req.body.fat_filtroconv,
                    fat_tipoterapia: req.body.fat_tipoterapia,
                    fat_nterapias: req.body.fat_nterapias,
                    fat_qualterapia: req.body.fat_qualterapia,
                    fat_qtdsessoes: req.body.fat_qtdsessoes,
                    fat_valorsessao: req.body.fat_valorsessao,
                    fat_valortotal: req.body.fat_valortotal,
                    fat_usuidedi: usuarioAtual,
                    fat_dataedi: dataAtual,
                    fat_lixo: "false"
                }
            }
        ).then((res) => {
            console.log("Fatura Atualizada")
            resultado = true;
        }).catch((err) => {
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
        })
        return resultado;
    },

    faturaAdicionar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        FaturaMensalModel = getModel(db, 'tb_faturamensal', FaturaMensalSchema)

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];
        let resultado;

        // Verifica se já existe fechamento para este mês/ano/tipo
        let faturaExiste = await FaturaMensalModel.findOne({
            fat_ano: req.body.fat_ano,
            fat_mes: req.body.fat_mes,
            fat_tipoterapia: req.body.fat_tipoterapia,
            fat_filtroconv: req.body.fat_filtroconv,
            fat_lixo: { $ne: "true" }
        });

        if (faturaExiste) {
            return "Já existe um fechamento para este período e tipo. Use a opção de refatorar.";
        } else {
            console.log("faturamensalmodel");
            const newFatura = new FaturaMensalModel({
                fat_ano: req.body.fat_ano,
                fat_mes: req.body.fat_mes,
                fat_periodoini: req.body.fat_periodoini,
                fat_periodofim: req.body.fat_periodofim,
                fat_filtroconv: req.body.fat_filtroconv,
                fat_tipoterapia: req.body.fat_tipoterapia,
                fat_nterapias: req.body.fat_nterapias,
                fat_qualterapia: req.body.fat_qualterapia,
                fat_qtdsessoes: req.body.fat_qtdsessoes,
                fat_valorsessao: req.body.fat_valorsessao,
                fat_valortotal: req.body.fat_valortotal,
                fat_datacad: dataAtual,
                fat_usuidcad: usuarioAtual,
                fat_lixo: "false"
            });
            console.log("newFatura save");
            await newFatura.save().then(() => {
                console.log("Faturamento realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    },

    faturaDeletar: async (req, res) => {
        let db = req.cookies['preferredDb'];
        FaturaMensalModel = getModel(db, 'tb_faturamensal', FaturaMensalSchema);

        let dataAtual = new Date();
        let usuarioAtual = req.cookies['idUsu'];

        const faturaId = req.params.id;

        if (!faturaId) {
            console.error("ID não fornecido para exclusão");
            return false;
        }

        try {
            const resultado = await FaturaMensalModel.findByIdAndUpdate(faturaId, {
                $set: {
                    fat_lixo: "true",
                    fat_datalixo: dataAtual,
                    fat_usuidlixo: usuarioAtual,
                }
            }, { new: true });

            console.log("Registro movido para lixeira:", faturaId);
            return true;
        } catch (err) {
            console.error("Erro ao mover para lixeira:", err);
            return false;
        }
    }
};