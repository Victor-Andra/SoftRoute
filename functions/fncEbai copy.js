//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe Ebai 
const ebaiClass = require("../models/ebai")


//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const beneClass = require("../models/bene")

//Tabela Ebai 
var Ebai = getModel("SoftRoute", 'tb_ebai', ebaiClass.EbaiSchema)

//Tabelas Extrangeiras
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;
const ObjectId = require('mongodb').ObjectId;

module.exports = {
   //Função que Carrega view para cadastro novo
    carregaEbai(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
        
        //Carrega beneficiários para o select
        Bene.find({ bene_lixo: { $ne: "true" } }).sort({ bene_nome: 1 }).then((beneficiarios)=>{
            console.log("Listagem Realizada de Beneficiários!")
            
            //Busca dados do usuário logado
            Usuario.findById(req.cookies['idUsu']).then((usuarioLogado)=>{
                res.render("nutricao/ebai/ebaiCad", {
                    beneficiarios: beneficiarios,
                    usuario: {
                        id: req.cookies['idUsu'],
                        nome: usuarioLogado ? usuarioLogado.usuario_nome : ''
                    }
                })
            }).catch((err)=>{
                console.log(err)
                //Mesmo com erro, renderiza com ID do cookie
                res.render("nutricao/ebai/ebaiCad", {
                    beneficiarios: beneficiarios,
                    usuario: {
                        id: req.cookies['idUsu'],
                        nome: ''
                    }
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "Houve um erro ao listar beneficiários")
            res.redirect('/admin/erro')
        })
    },
    
    //Função que controla Classe para salvar
    cadastraEbai(req,res){
        let cadastro = ebaiClass.ebaiAdicionar(req,res);//variavel para armazenar a função que armazena o async

        if(cadastro){
            console.log('Cadastro realizado com sucesso!')
            req.flash("success_message", "Escala EBAI cadastrada com sucesso!")
            res.redirect('/menu/nutricao/ebai/lis')
        } else {
            console.log('Erro ao cadastrar')
            req.flash("error_message", "Houve um erro ao cadastrar Escala EBAI")
            res.redirect('/admin/erro')
        }
    },
    
    //Função que controla Classe para Deletar
    deletaEbai(req, res){
        ebaiClass.ebaiDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    req.flash("success_message", "Escala EBAI excluída com sucesso!")
                    this.listaEbai(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    req.flash("error_message", "Houve um erro ao excluir Escala EBAI")
                    res.redirect('/admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaEbai:", err);
                req.flash("error_message", "Houve um erro ao excluir Escala EBAI")
                res.redirect('/admin/erro');
            });
    },
    
    //Função que controla Classe para Atualizar registro
    atualizaEbai(req, res){
        let db = req.cookies['preferredDb'];
        Ebai = getModel(db, 'tb_ebai', ebaiClass.EbaiSchema)

        let resposta;
        try{
            ebaiClass.ebaiEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.redirect('/admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a lista de ebai
                    req.flash("success_message", "Escala EBAI atualizada com sucesso!")
                    this.listaEbai(req, res)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    req.flash("error_message", "Houve um erro ao atualizar Escala EBAI")
                    res.redirect('/admin/erro')
                }
            })
        } catch(err1){
            console.log(err1)
            req.flash("error_message", "Houve um erro ao atualizar Escala EBAI")
            res.redirect('/admin/erro')
        } 
    },
    
    //Função que Carrega view para Editar Registro
    carregaEbaiEdi(req, res){
        let db = req.cookies['preferredDb'];
        Ebai = getModel(db, 'tb_ebai', ebaiClass.EbaiSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
        
        Ebai.findById(req.params.id).then((ebai) =>{
            if(!ebai){
                req.flash("error_message", "Registro não encontrado!")
                res.redirect('/menu/nutricao/ebai/lis')
                return;
            }
            
            //Carrega beneficiários para o select
            Bene.find({ bene_lixo: { $ne: "true" } }).sort({ bene_nome: 1 }).then((beneficiarios)=>{
                //Busca dados do terapeuta que aplicou
                Usuario.findById(ebai.ebai_terapeutaid).then((terapeutaAplicador)=>{
                    res.render("nutricao/ebai/ebaiEdi", {
                        ebai: ebai,
                        beneficiarios: beneficiarios,
                        terapeutaAplicador: {
                            id: ebai.ebai_terapeutaid,
                            nome: terapeutaAplicador ? terapeutaAplicador.usuario_nome : ''
                        }
                    })
                }).catch((err)=>{
                    console.log(err)
                    res.render("nutricao/ebai/ebaiEdi", {
                        ebai: ebai,
                        beneficiarios: beneficiarios,
                        terapeutaAplicador: {
                            id: ebai.ebai_terapeutaid,
                            nome: ''
                        }
                    })
                })
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "Houve um erro ao carregar beneficiários")
                res.redirect('/menu/nutricao/ebai/lis')
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "Houve um erro ao carregar registro")
            res.redirect('/menu/nutricao/ebai/lis')
        })
    },
    
   //Função que Lista os registros
    listaEbai(req, res) {
        let db = req.cookies['preferredDb'];
        Ebai = getModel(db, 'tb_ebai', ebaiClass.EbaiSchema);

        function formatDateToBR(date) {
            if(!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        function formatDateOnlyToBR(date) {
            if(!date) return "--/--/----";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        }

        Ebai.find({ ebai_lixo: { $ne: "true" } }).sort({ ebai_datacad: -1 }).then(async (ebaiList) => {
            let qtregs;

            try {
                // Carregar total de registros
                qtregs = await ebaiClass.qtregs(req, res);

                // Carregar usuários para mapeamento
                const usuarioList = await Usuario.find();
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                // Carregar beneficiários para mapeamento
                const beneList = await Bene.find();
                const beneMap = beneList.reduce((acc, b) => {
                    acc[b._id.toString()] = b;
                    return acc;
                }, {});

                // Processar cada registro
                ebaiList.forEach(e => {
                    e.datacad = e.ebai_datacad ? formatDateToBR(e.ebai_datacad) : "--/--/---- h--:--";
                    e.dataedi = e.ebai_dataedi ? formatDateToBR(e.ebai_dataedi) : "--/--/---- h--:--";
                    e.dataaplica = e.ebai_dataaplica ? formatDateOnlyToBR(e.ebai_dataaplica) : "--/--/----";

                    const usuarioCad = usuarioMap[e.ebai_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[e.ebai_usuidedi?.toString()];
                    const beneficiario = beneMap[e.ebai_beneid?.toString()];

                    e.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                    e.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
                    e.beneficiarioNome = beneficiario ? beneficiario.bene_nome : "--";
                });

                res.render('nutricao/ebai/ebaiLis', { ebais: ebaiList, qtregs });

            } catch (err) {
                console.error("Erro ao carregar dados para listaEbai:", err);
                req.flash("error_message", "Houve um erro ao listar Escalas EBAI");
                res.redirect('/admin/erro');
            }

        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Escalas EBAI");
            res.redirect('/admin/erro');
        });
    }
}