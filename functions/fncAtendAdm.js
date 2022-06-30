//Exports
const mongoose = require("mongoose")

//Atendimentos Administrativos 
const atendClass = require("../models/atend")
const Atend = mongoose.model("tb_atend")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const estadoClass = require("../models/estado")
const terapiaClass = require("../models/terapia")
const usuarioClass = require("../models/usuario")
const tabilClass = require("../models/tabil")
const debitClass = require("../models/debit")
const creditClass = require("../models/credit")
const salaClass = require("../models/sala")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Estado = mongoose.model("tb_estado")
const Tabil = mongoose.model("tb_tabil")
const Convdeb = mongoose.model("tb_convdeb")
const Convcre = mongoose.model("tb_convcre")
const Sala = mongoose.model("tb_sala")

//Funções Auxiliares
const fncCredit = require("../functions/fncCredit")

module.exports = {
    carregaAtendAdm(req,res){
        let atend;
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            atend.atend_num = atend.atend_num+1;
            console.log("Listagem Realizada de NextNum")
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        res.render('financeiro/atendadm/atendAdmCad', {atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, salas: sala})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    carregaAtendAdmEdi(req,res){
        let atend;
        let nextNumEdi;
        Atend.find().sort({atend_num : -1}).limit(1).then((atendimento) =>{
            //validação caso seja o primeiro registro
            atendimento.forEach(e => {atend = e});
            atend.atend_num = atend.atend_num+1;
            console.log("Listagem Realizada de NextNum")
            Bene.find({"bene_status":"Ativo"}).then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find({"conv_status":"Ativo"}).then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Convcre.find().then((convcre) => {
                        console.log("Listagem Realizada de Convenios")
                        Convdeb.find().then((convdeb) => {
                            console.log("Listagem Realizada de Convenios")
                            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                                console.log("Listagem Realizada de Usuário")
                                Terapia.find().then((terapia)=>{
                                    console.log("Listagem Realizada de Convenios")
                                    Sala.find().then((sala)=>{
                                        Atend.findById(req.params.id).then((atendEdi)=>{
                                            console.log(atendEdi.atend_num)
                                            nextNumEdi = atendEdi.atend_num;
                                            Convcre.find({credit_atendnum : nextNumEdi}).then((convcreEdi) =>{
                                                Convdeb.find({debit_atendnum : nextNumEdi}).then((convdebEdi) =>{
                                                    res.render('financeiro/atendadm/atendAdmEdi', {atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia, convcres: convcre, convdebs: convdeb, atendEdi, convcreEdi, convdebEdi, salas: sala})
        })})})})})})})})})})}).catch((err) =>{
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
        let cadastroCre = fncCredit.creditAdicionar(req,res);//variavel para armazenar a função que armazena o async
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
        Atend.find().then((atend) =>{
            console.log("Listagem Realizada de Atendimentos!")
            Bene.find().then((bene)=>{
                console.log("Listagem Realizada de Beneficiários!")
                Conv.find().then((conv)=>{
                    console.log("Listagem Realizada de Convenios")
                    Usuario.find().then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")
                            Terapia.find().then((terapia)=>{
                                console.log("Listagem Realizada de Terapia")
                                res.render("financeiro/atendadm/atendAdmLis", {atends: atend, benes: bene, convs: conv, usuarios: usuario, terapias: terapia})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.redirect('admin/erro')
        })
    },
    deletaAtendAdm(req, res){
        Atend.deleteOne({_id: req.params.id}).then(() =>{
            Atend.find().then((atend) =>{
                req.flash("success_message", "Atend deletada!")
                res.render('financeiro/atendadm/atendAdmLis', {atends: atend})
            }).catch((err) =>{
                console.log(err)
                res.render('admin/erro')
            })
        })
    },
    atualizaAtendAdm(req, res){
        let resposta;
        try{
            atendClass.atendEditar(req,res).then((res)=>{
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
                    //Volta para a atend de listagem
                    Atend.find().then((atend) =>{
                        console.log("Listagem Realizada!")
                        res.render('financeiro/atendadm/atendAdmLis', {atends: atend})
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
}