//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const convdebClass = require("../models/convDeb")
var Convdeb = getModel("SoftRoute", 'tb_convdeb', convdebClass.ConvdebSchema)

//Classes Extrangeiras
const terapiaClass = require("../models/terapia")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    listaConvdebOLD(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        // Função auxiliar para formatar data como dd/mm/yyyy hhh:mm
        function formatDateToBR(date) {
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');

            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        Convdeb.find().then((convdeb) =>{
            console.log("Listagem Realizada ConvDeb!")
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                console.log("Listagem Realizada Terapia!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                    console.log("Listagem Convênios!") 
                    res.render('convenio/convdeb/convDebLis', {convdebs: convdeb, terapias: terapia, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            //req.flash("error_message", "houve um erro ao listar Convdebs")
            res.redirect('admin/erro')
        })
    },
    listaConvdeb(req, res) {
    let db = req.cookies['preferredDb'];
    Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    Usuario = getModel(db, 'tb_usuario', usuarioClass.UsuarioSchema); // ← Adicionar

    function formatDateToBR(date) {
        const d = new Date(date);
        const dia = String(d.getDate()).padStart(2, '0');
        const mes = String(d.getMonth() + 1).padStart(2, '0');
        const ano = d.getFullYear();
        const hora = String(d.getHours()).padStart(2, '0');
        const minuto = String(d.getMinutes()).padStart(2, '0');
        return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
    }

    Promise.all([
        Convdeb.find({ convdeb_lixo: { $ne: "true" } }),
        Terapia.find(),
        Conv.find(),
        Usuario.find()
    ])
    .then(([convdebList, terapiaList, convList, usuarioList]) => {
        // Mapear usuários
        const usuarioMap = usuarioList.reduce((acc, u) => {
            acc[u._id.toString()] = u;
            return acc;
        }, {});

        // Processar cada convdeb
        convdebList.forEach(c => {
            c.datacad = c.convdeb_datacad ? formatDateToBR(c.convdeb_datacad) : "--/--/---- h--:--";
            c.dataedi = c.convdeb_dataedi ? formatDateToBR(c.convdeb_dataedi) : "--/--/---- h--:--";

            const usuarioCad = usuarioMap[c.convdeb_usuidcad?.toString()];
            const usuarioEdi = usuarioMap[c.convdeb_usuidedi?.toString()];

            c.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
            c.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
        });

        // Ordenações
        terapiaList.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome, 'pt', { sensitivity: 'base' }));
        convList.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt', { sensitivity: 'base' }));

        res.render('convenio/convdeb/convDebLis', {
            convdebs: convdebList,
            terapias: terapiaList,
            convs: convList
        });

    })
    .catch((err) => {
        console.error("Erro em listaConvdeb:", err);
        res.redirect('/admin/erro');
    });
},
    carregaConvdeb(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Conv.find().then((conv)=>{
            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
            console.log("Listagem Realizada de Convênios")
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                console.log("Listagem Realizada de Terapias")
                res.render("convenio/convdeb/convDebCad", {convs: conv, terapias: terapia})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaConvdebEdi(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Convdeb.findById(req.params.id).then((convdeb) =>{
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                    res.render('convenio/convdeb/convDebEdi', {convdeb, terapias: terapia, convs: conv})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraConvdeb(req,res){
        let cadastro = convdebClass.convdebAdicionar(req,res);//variavel para armazenar a função que armazena o async
        if(cadastro){
            console.log('verdadeiro')
            this.carregaConvdeb(req,res)
        } else {
            console.log("error")
            console.log(cadastro)
            res.render('admin/erro');
        }
    },
    editarConvdev(req,res){
        let resposta;
        convdebClass.convdebEditar(req,res).then((res)=>{
            console.log("Atualização Realizada!")
            console.log(res)
            resposta = res;
        }).catch((err) =>{
            console.log("error1")
            console.log(err)
            resposta = err;
            res.render('admin/erro')
        }).finally(() =>{
            if(resposta){
                this.carregaConvdeb(req,res);
            }else{
                //passar classe de erro
                console.log("error")
                console.log(resposta)
                res.render('admin/erro')
            }
        })
    },
    deletaConvdeb(req, res) {
        convdebClass.convdebDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    this.listaConvdeb(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaConvdeb:", err);
                res.render('admin/erro');
            });
    }
}