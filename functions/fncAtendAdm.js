//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//Atendimentos Administrativos 
const atendClass = require("../models/atend")
var Atend = getModel("SoftRoute", 'tb_atend', atendClass.AtendSchema)

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const convdebClass = require("../models/convDeb")
const convcreClass = require("../models/convCre")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const tabilClass = require("../models/tabil")
const debitClass = require("../models/debit")
const salaClass = require("../models/sala")
const horaageClass = require("../models/horaAge")
const anoClass = require("../models/ano")

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Convdeb = getModel("SoftRoute", 'tb_convdeb', convdebClass.ConvdebSchema)
var Convcre = getModel("SoftRoute", 'tb_convcre', convcreClass.ConvcreSchema)
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)
var Horaage = getModel("SoftRoute", 'tb_horaage', horaageClass.HoraageSchema)
var Ano = getModel("PortalDoUsuario",'tb_ano', anoClass.AnoSchema)

//Funções Auxiliares
const fncCredit = require("../functions/fncCredit")
const fncDebit = require("../functions/fncDebit")
const fncGeral = require("./fncGeral")
const Resposta = fncGeral.Resposta;

module.exports = {
    carregaAtendAdm(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let lvlUsu = req.cookies['lvlUsu'];
        let atend;
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            atend.atend_num = atend.atend_num+1;
            console.log("Listagem Realizada de NextNum")
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find({ terapia_status: "Ativo", terapia_lixo: { $ne: "true" }}).then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));
                                    console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                        Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                            res.render('atendimento/atendadm/atendAdmCad', {atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala, horaages: horaage, lvlUsu})
        })})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAtendAdmExtra: (req, res) => {
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let lvlUsu = req.cookies['lvlUsu'];
        let atend = {
            atend_num: 0, // valor inicial, NÃO PODE SER 0 AO ENVIAR PRA TELA
            atend_extraid: req.params.id // <<<--- Atribuição do ID recebido pela URL
        };

        // Busca o último atendimento para incrementar o número
        Atend.find().sort({ atend_num: -1 }).limit(1).then((atendimento) => {
                if (atendimento.length > 0) {
                    atend.atend_num = atendimento[0].atend_num + 1;
                }

                console.log("Listagem Realizada de NextNum");

                Bene.find({ "bene_status": "Ativo" })
                    .then((bene) => {
                        bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);

                        console.log("Listagem Realizada de Beneficiários!");

                        Conv.find({ "conv_status": "Ativo" })
                            .then((conv) => {
                                conv.sort((a, b) => (a.conv_nome > b.conv_nome) ? 1 : -1);

                                console.log("Listagem Realizada de Convenios");

                                Convcre.find()
                                    .then((convcre) => {
                                        Convdeb.find()
                                            .then((convdeb) => {
                                                Usuario.find({
                                                    "usuario_status": "Ativo",
                                                    $or: [
                                                        { "usuario_funcaoid": "6241030bfbcc51f47c720a0b" },
                                                        { "usuario_perfilid": { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                                                    ]
                                                })
                                                .then((usuario) => {
                                                    usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : -1);

                                                    console.log("Listagem Realizada de Usuário");

                                                    Terapia.find({ "terapia_status": "Ativo" })
                                                        .then((terapia) => {
                                                            terapia.sort((a, b) => (a.terapia_nome > b.terapia_nome) ? 1 : -1);

                                                            console.log("Listagem Realizada de Terapias");

                                                            Sala.find()
                                                                .then((sala) => {
                                                                    sala.sort((a, b) => (a.sala_nome > b.sala_nome) ? 1 : -1);

                                                                    Horaage.find().sort({ horaage_turno: 1, horaage_ordem: 1 })
                                                                        .then((horaage) => {
                                                                            res.render('atendimento/atendadm/atendAdmCadExtra', {
                                                                                atend,
                                                                                benes: bene,
                                                                                convs: conv,
                                                                                usuarios: usuario,
                                                                                terapias: terapia,
                                                                                convcres: convcre,
                                                                                convdebs: convdeb,
                                                                                salas: sala,
                                                                                horaages: horaage,
                                                                                lvlUsu
                                                                            });
                                                                        });
                                                                });
                                                        });
                                                });
                                            });
                                    });
                            });
                    });
            })
            .catch((err) => {
                console.log(err);
                req.flash("error_message", "Houve um erro ao realizar as listas!");
                res.redirect('/admin/erro');
            });
    },
    cadastraAtendExtra: async (req, res) => {//Nova função para cadastrar o atendimento pertencente ao Extra vinculado o ID do Extra ao atendimento possibilitando sua gestão
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)

        try {
            const {
                atendExtraid,
                atendBeneid,
                atendConvid,
                atendTerapiaid,
                atendTerapeutaid,
                // outros campos do formulário que você precisa
            } = req.body;

            // Aqui você pega o usuário logado, se necessário
            const usuarioAtual = req.cookies.idUsu;

            // Cria uma nova instância do modelo Atend
            const novoAtendimento = new Atend({
                atend_num: req.body.atendNum, // ou o nome correto do campo
                atend_extraid: atendExtraid, // <<<--- Campo que veio do botão plus
                atend_beneid: atendBeneid,
                atend_convid: atendConvid,
                atend_terapiaid: atendTerapiaid,
                atend_terapeutaid: atendTerapeutaid,
                // outros campos do formulário...
                atend_usucad: usuarioAtual,
                atend_datacad: new Date(),
            });

            // Salva no banco
            await novoAtendimento.save();

            console.log("Atendimento cadastrado com sucesso!");
            req.flash("success_message", "Atendimento salvo com sucesso!");
            res.redirect("/menu/atendimento/extra/ctrlextra"); // ou outra rota de sucesso
        } catch (err) {
            console.error("Erro ao cadastrar atendimento:", err);
            req.flash("error_message", "Erro ao salvar o atendimento.");
            res.redirect("/admin/erro");
        }
    },
    carregaAtendAdmEdi(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Convcre = getModel(db, 'tb_convcre', convcreClass.ConvcreSchema)
        Convdeb = getModel(db, 'tb_convdeb', convdebClass.ConvdebSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        let atend;
        let nextNumEdi;
        let lvlUsu = req.cookies['lvlUsu'];
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            //atendimento.forEach(e => {atend = e});
            //atend.atend_num = atend.atend_num+1;
            //console.log("Listagem Realizada de NextNum")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas//, usuario_status:"Ativo"
                                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));
                                    console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        sala.sort((a,b) => (a.sala_nome > b.sala_nome) ? 1 : ((b.sala_nome > a.sala_nome) ? -1 : 0));//Ordena a sala por nome
                                        Atend.findById(req.params.id).then((atendEdi)=>{
                                            //console.log(atendEdi.atend_num);
                                            nextNumEdi = atendEdi.atend_num;
                                            //console.log("atendEdi.atend_atenddata:"+atendEdi.atend_atenddata);
                                            Convcre.find({credit_atendnum : nextNumEdi}).then((convcreEdi) =>{
                                                Convdeb.find({debit_atendnum : nextNumEdi}).then((convdebEdi) =>{
                                                    Horaage.find().sort({horaage_turno: 1,horaage_ordem: 1}).then((horaage)=>{
                                                        res.render('atendimento/atendadm/atendAdmEdi', {atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, atendEdi, convcreEdi, convdebEdi, salas: sala, horaages: horaage, lvlUsu})
        })})})})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    cadastraAtendAdm(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarPadrão(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionar(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{
                        console.log(res)
                        retornoTab = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtendAdm(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    cadastraAtendAdmApoio(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarApoio(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionar(req,res);
        let cadastroDebApoio = debitClass.debitAdicionarApoio(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroDebApoio.then((res)=>{
                        console.log(res)
                        retornoDeb = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoDeb = err;
                    }).finally(() => {
                        cadastroTab.then((res)=>{
                            console.log(res)
                            retornoTab = true;
                        }).catch((err) => {
                            console.log(err)
                            retornoTab = err;
                        }).finally(() => {
                            console.log(retorno)
                            console.log(retornoCre)
                            console.log(retornoDeb)
                            console.log(retornoTab)
                            if (retorno && retornoCre && retornoDeb && retornoTab){
                                this.carregaAtendAdm(req,res);
                            } else {
                                res.render('admin/branco');
                            }
                        })
                    })
                })
            })
        })
    },
    cadastraAtendAdmExtra(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarExtra(req,res);//variavel para armazenar a função que armazena o async
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroTab.then((res)=>{
                    console.log(res)
                    retornoTab = true;
                }).catch((err) => {
                    console.log(err)
                    retornoTab = err;
                }).finally(() => {
                    console.log(retorno)
                    console.log(retornoCre)
                    console.log(retornoDeb)
                    console.log(retornoTab)
                    if (retorno && retornoCre && retornoDeb && retornoTab){
                        this.carregaAtendAdm(req,res);
                    } else {
                        res.render('admin/branco');
                    }
                })
            })
        })
    },
    cadastraAtendAdmFalta(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarFalta(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionarFalta(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{
                        console.log(res)
                        retornoTab = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtendAdm(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    cadastraAtendAdmGlosa(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarGlosa(req,res);//variavel para armazenar a função que armazena o async
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            if(retorno){
                cadastroCre.then((res)=>{
                    console.log(res)
                    retornoCre = true;
                }).catch((err) => {
                    console.log(err)
                    retornoCre = err;
                }).finally(() => {
                    if(retornoCre){
                        cadastroTab.then((res)=>{
                            console.log(res)
                            retornoTab = true;
                        }).catch((err) => {
                            console.log(err)
                            retornoTab = err;
                        }).finally(() => {
                            console.log(retorno)
                            console.log(retornoCre)
                            console.log(retornoDeb)
                            console.log(retornoTab)
                            if (retorno && retornoCre && retornoDeb && retornoTab){
                                this.carregaAtendAdm(req,res);
                            } else {
                                res.render('admin/branco');
                            }
                        })
                    }
                })
            }
        })
    },
    cadastraAtendAdmPais(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarPais(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionarPais(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{
                        console.log(res)
                        retornoTab = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtendAdm(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    cadastraAtendAdmSubstituto(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarSubstituto(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionarSubstituto(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{
                        console.log(res)
                        retornoTab = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtendAdm(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    cadastraAtendAdmSupervisao(req,res){
        let retorno;
        let retornoCre;
        let retornoDeb;
        let retornoTab;
        let cadastro = atendClass.atendAdicionar(req,res);//variavel para armazenar a função que armazena o async - Ok
        let cadastroCre = fncCredit.creditAdicionarSupervisao(req,res);//variavel para armazenar a função que armazena o async
        let cadastroDeb = debitClass.debitAdicionarSupervisao(req,res);
        let cadastroTab = tabilClass.tabilAdicionar(req,res);
        
        cadastro.then((res)=>{
            console.log(res)
            retorno = true;
        }).catch((err) => {
            console.log(err)
            retorno = err;
        }).finally(() => {
            cadastroCre.then((res)=>{
                console.log(res)
                retornoCre = true;
            }).catch((err) => {
                console.log(err)
                retornoCre = err;
            }).finally(() => {
                cadastroDeb.then((res)=>{
                    console.log(res)
                    retornoDeb = true;
                }).catch((err) => {
                    console.log(err)
                    retornoDeb = err;
                }).finally(() => {
                    cadastroTab.then((res)=>{
                        console.log(res)
                        retornoTab = true;
                    }).catch((err) => {
                        console.log(err)
                        retornoTab = err;
                    }).finally(() => {
                        console.log(retorno)
                        console.log(retornoCre)
                        console.log(retornoDeb)
                        console.log(retornoTab)
                        if (retorno && retornoCre && retornoDeb && retornoTab){
                            this.carregaAtendAdm(req,res);
                        } else {
                            res.render('admin/branco');
                        }
                    })
                })
            })
        })
    },
    listarAtendAdm(req,res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Horaage = getModel(db, 'tb_horaage', horaageClass.HoraageSchema)
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        Atend.findOne().then((atend) =>{
            console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                        Terapia.find().then((terapia)=>{
                            console.log("Listagem Realizada de Terapia")
                            res.render("atendimento/atendadm/atendAdmLis", {atends: atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    deletaAtendAdm(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)

        Atend.deleteOne({_id: req.params.id}).then(() =>{
            Atend.find().limit(2).then((atend) =>{
                req.flash("success_message", "Atend deletada!")
                res.render('atendimento/atendadm/atendAdmLis', {atends: atend})
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },
    atualizaAtendAdm(req, res){
        let resposta;
        try{
            //console.log("req.body.atendId:"+req.body.atendId)
            atendClass.atendEditar(req,res).then((result)=>{
                console.log("Atualização Realizada!")
                console.log(result)
                resposta = result;
                //criar metodo atualiza cascata cre e deb
                fncCredit.creditAtendEditar(req,res);
                fncDebit.debitAtendEditar(req,res);
                if(resposta == true){
                    //Volta para a atend de listagem
                    this.listaAtend(req,res);
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resposta)
                    res.render('admin/erro')
                }
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
               
            })
        } catch(err1){
            console.log(err1)
        }
    },
    listaAtend2(req, res){
        let db = req.cookies['preferredDb'];
        Atend = getModel(db, 'tb_atend', atendClass.AtendSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let carregaFiltro = "false";
        let fulldate;
        let seg = new Date();
        let sex = new Date();
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let agora = seg.toISOString();
        let depois = sex.toISOString();
        
        Atend.find({atend_atenddata: { $gte : agora, $lte:  depois }}).then((atend) =>{
            atend.forEach((b)=>{
                if(b.atend_atenddata){
                } else {
                    b.atend_atenddata=new Date();
                }
                    
                let data = new Date(b.atend_atenddata)
                let mes = (data.getMonth()+1).toString();
                let dia = (data.getUTCDate()).toString();

                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }

                let hora = (data.getHours()).toString();
                let minuto = (data.getMinutes()).toString();

                if (hora.length == 1){
                    hora = "0"+hora;
                }
                if (minuto.length == 1){
                    minuto = "0"+minuto;
                }

                fulldate=(data.getFullYear()+"-"+mes+"-"+dia).toString();
                b.data=fulldate;
                b.hora = hora + ":" + minuto;
            })
            var tamanho = atend.length;
            var qtdAtends = {qtd: tamanho}
            //console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Convenios")
                    Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                                //console.log("Listagem Realizada de Terapia")
                                res.render("atendimento/atendLis", {atends: atend, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends, carregaFiltro})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    listaAtend(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)

        let carregaFiltro = "false";
        let atend = [];
        let qtdAtends = 0;
        Bene.find().then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
            Conv.find().then((conv)=>{
                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Convenios")
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                    terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                    //console.log("Listagem Realizada de Usuário")
                    Terapia.find().then((terapia)=>{
                        terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                        //console.log("Listagem Realizada de Terapia")
                         Ano.find().then((ano)=>{
                        res.render("atendimento/atendLis", {atends: atend, anos: ano, benes: bene, convs: conv, terapeutas: terapeuta, terapias: terapia, qtdAtends, carregaFiltro})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    }
}