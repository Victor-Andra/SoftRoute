//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//convenio
const convClass = require("../models/conv")
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    //Função que Carrega view para cadastro novo
    carregaConv(req,res){
        let db = req.cookies['preferredDb'];
        Estado = getModel(db, 'tb_estado', estadoClass.EstadoSchema)
        
        

        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("convenio/conv/convCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })
    },
    //Função que controla Classe para salvar
    cadastraConv(req,res){
        let cadastro = convClass.convAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('verdadeiro')
            res.render('convenio/conv/convCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }
    },

    //Função que controla Classe para Deletar
    deletaConv(req, res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        Conv.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv) =>{
                req.flash("success_message", "Conv deletada!")
                res.render('convenio/conv/convLis', {convs: conv})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Convs")
                res.render('admin/erro')
            })
        })
    },
    
    //Função que controla Classe para Atualizar registro
    atualizaConv(req, res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        let resposta;
        try{
            convClass.convEditar(req,res).then((res)=>{
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
                    //Volta para a conv de listagem
                    Conv.find().then((conv) =>{
                        console.log("Listagem Realizada!")
                        res.render('convenio/conv/convLis', {convs: conv})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
        } 
    },

    //Função que Carrega view para Editar Registro
    carregaConvEdi(req, res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        

        Conv.findById(req.params.id).then((conv) =>{
            Estado.find().then((estado)=>{
                res.render("convenio/conv/convEdi", {conv, estados: estado})
        })
    }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },

    //Função que Carrega view para Listar registros
    listaConvOLD(req, res){
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)

        console.log('listando convs')
        let qtregs;

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
        Conv.find().then((conv) =>{
            console.log("Listagem Realizada!")
            convClass.qtregs(req,res).then((res)=>{
                qtregs = res;
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Convs")
                res.redirect('admin/erro')
            }).finally(()=>{
                res.render('convenio/conv/convLis', {convs: conv, qtregs})
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Convs")
            res.redirect('admin/erro')
        })     
      
    },

    listaConv(req, res) {
        let db = req.cookies['preferredDb'];
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema);
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

        Conv.find({ conv_lixo: { $ne: "true" } }).then(async (convList) => {
            let qtregs;

            try {
                // Carregar total de registros (mantendo sua lógica)
                qtregs = await convClass.qtregs(req, res);

                // Carregar usuários para mapeamento
                const usuarioList = await Usuario.find();
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                // Processar cada convênio
                convList.forEach(c => {
                    c.datacad = c.conv_datacad ? formatDateToBR(c.conv_datacad) : "--/--/---- h--:--";
                    c.dataedi = c.conv_dataedi ? formatDateToBR(c.conv_dataedi) : "--/--/---- h--:--";

                    const usuarioCad = usuarioMap[c.conv_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[c.conv_usuidedi?.toString()];

                    c.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                    c.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
                });

                // Ordenar (opcional, mas recomendado)
                convList.sort((a, b) => 
                    a.conv_nome.localeCompare(b.conv_nome, 'pt', { sensitivity: 'base' })
                );

                res.render('convenio/conv/convLis', { convs: convList, qtregs });

            } catch (err) {
                console.error("Erro ao carregar dados para listaConv:", err);
                req.flash("error_message", "Houve um erro ao listar Convênios");
                res.redirect('/admin/erro');
            }

        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Convênios");
            res.redirect('/admin/erro');
        });
    },
    deletaConv(req, res) {
        convClass.convDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    this.listaConv(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaConv:", err);
                res.render('admin/erro');
            });
    }
}