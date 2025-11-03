//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//Créditos de planos de saúde e particular
const convcreClass = require("../models/convCre")
var Convcre = getModel("SoftRoute", 'tb_convcre', convcreClass.ConvcreSchema)

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
    listaConvcreOLD(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
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

        let convcres = new Array();
        Convcre.find().then((convcre) =>{
            console.log("Listagem Crédito de Convênios!")
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                console.log("Listagem Terapias!")      
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                    console.log("Listagem Convênios!")      
                    res.render('convenio/convcre/convCreLis', {convcres: convcre, terapias: terapia, convs: conv})
            })})}).catch((err) =>{
            console.log(err)
            //req.flash("error_message", "houve um erro ao listar Convcres")
            res.redirect('admin/erro')
        })
    },
    listaConvcre(req, res) {
    let db = req.cookies['preferredDb'];
    Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
    Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);

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
        Convcre.find({ convcre_lixo: { $ne: "true" } }),
        Terapia.find(),
        Conv.find(),
        Usuario.find()
    ])
    .then(async ([convcreList, terapiaList, convList, usuarioList]) => {
        // Mapear usuários
        const usuarioMap = usuarioList.reduce((acc, u) => {
            acc[u._id.toString()] = u;
            return acc;
        }, {});

        // Processar cada convcre
        convcreList.forEach(c => {
            c.datacad = c.convcre_datacad ? formatDateToBR(c.convcre_datacad) : "--/--/---- h--:--";
            c.dataedi = c.convcre_dataedi ? formatDateToBR(c.convcre_dataedi) : "--/--/---- h--:--";

            const usuarioCad = usuarioMap[c.convcre_usuidcad?.toString()];
            const usuarioEdi = usuarioMap[c.convcre_usuidedi?.toString()];

            c.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
            c.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
        });

        // Ordenações
        terapiaList.sort((a, b) => a.terapia_nome.localeCompare(b.terapia_nome, 'pt', { sensitivity: 'base' }));
        convList.sort((a, b) => a.conv_nome.localeCompare(b.conv_nome, 'pt', { sensitivity: 'base' }));

        res.render('convenio/convcre/convCreLis', {
            convcres: convcreList,
            terapias: terapiaList,
            convs: convList
        });

    })
    .catch((err) => {
        console.error("Erro em listaConvcre:", err);
        res.redirect('/admin/erro');
    });
},
    carregaConvcre(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Conv.find().then((conv)=>{
            conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
            console.log("Listagem Realizada de Convênios")
            Terapia.find().then((terapia)=>{
                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                console.log("Listagem Realizada de Terapias")
                res.render("convenio/convcre/convCreCad", {convs: conv, terapias: terapia})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaConvcreEdi(req,res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        Convcre.findById(req.params.id).then((convcre) =>{
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome .
                console.log("Listagem Realizada de Convênios")
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena as Terapias por nome 
                    console.log("Listagem Realizada de Terapias")
                    res.render('convenio/convcre/convCreEdi', {convcre, convs: conv, terapias: terapia})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },
    cadastraConvcre(req,res){
        let retorno
        let cadastro = convcreClass.convcreAdicionar(req,res);//variavel para armazenar a função que armazena o async
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            if(retorno == true){
                console.log('verdadeiro')
                this.listaConvcre(req,res)
            } else {
                console.log(cadastro)
                res.render('admin/erro');
            }
        })
    },
    editaConvcre(req,res){
        let resposta;
        convcreClass.convcreEditar(req,res).then((res)=>{
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
                //Volta para a convcre de listagem
                console.log("Abrir Lista")
                this.listaConvcre(req,res);
            }else{
                //passar classe de erro
                console.log("error")
                console.log(resposta)
                res.render('admin/erro')
            }
        })
    },
    deletaConvcre(req, res) {
        convcreClass.convcreDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    this.listaConvcre(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaConvcre:", err);
                res.render('admin/erro');
            });
    }
   
    
}