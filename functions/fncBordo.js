//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Bordoamento 
const bordoClass = require("../models/bordo")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")

//Tabela Plano de Bordoamento 
const Bordo = mongoose.model("tb_bordo")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Escola = mongoose.model("tb_escola")

//Funções auxiliares
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const fncGeral = require("./fncGeral")

class BordoMapa{
    constructor(
        dt,
        especialidade,
        profissional,
        escola
        ){
        this.dt = dt,
        this.especialidade = especialidade,
        this.profissional = profissional,
        this.escola = escola
    }
}

module.exports = {
    listaBordo(req, res){
        console.log('listando Diários de Bordo')
        Bordo.find().then((bordo) =>{
            console.log("Listagem Realizada dos Diários de Bordo!")
            bordo.forEach((b)=>{
                b.bordo_data = fncGeral.getDataRevert(fncGeral.getData(b.bordo_datacad))
            })
            bordo.forEach((c)=>{
                c.bordo_ativ = fncGeral.getDataRevert(fncGeral.getData(c.bordo_dataativ))
            })
                Bene.find().then((bene) =>{
                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                        Escola.find().then((escola) =>{
                            escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena a escola por nome
                                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                                    terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                                        console.log("Listagem Realizada Usuário!")
                                            res.render('area/bordo/bordoLis', {escolas: escola, bordos: bordo, terapeutas: terapeuta, benes: bene})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Diários de Bordo")
            res.redirect('admin/erro')
        })
    },

    carregaBordo(req,res){
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                    Escola.find().sort({escola_nome: 1}).then((escola)=>{
                        escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                                    res.render("area/bordo/bordoCad", {escolas: escola, terapeutas: terapeuta, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.redirect('admin/erro')
        })

    },
    carregaBordomapa(req,res){
        let seg = new Date();
        let sex = new Date();
        let rel = [];
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
            console.log("Listagem Realizada de Usuário")
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada de beneficiarios")
                    Escola.find().then((escola) =>{
                        escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                            res.render("area/bordo/bordoMapa", {escolas: escola, terapeutas: terapeuta, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
        })
    },
    carregaBordomapaFiltro(req,res){
        let u;
        let teraID;
        let usuId;
        let rel = [];
        let dt;
        
        let bene_nome;
        let terapiaAtend;
        let terapeutaAtend;
        let periodoDe = fncGeral.getDataInvert(req.body.dataIni);//yyyy-mm-dd -> dd-mm-yyyy
        let periodoAte = fncGeral.getDataInvert(req.body.dataFim);//yyyy-mm-dd -> dd-mm-yyyy
        let rab = new BordoMapa();//objeto para fazer push em BordoMapa
        let seg = fncGeral.getDateFromString(req.body.dataIni, "ini");
        let sex = fncGeral.getDateFromString(req.body.dataFim, "fim");
        seg.setHours(0);
        seg.setMinutes(0);
        seg.setSeconds(0);
        sex.setHours(23);
        sex.setMinutes(59);
        sex.setSeconds(59);
        let filtroBordoMapa= {bordo_beneid: req.body.bordoBeneid, bordo_datacad: { $gte: seg, $lte: sex}}

        Atend.find(filtroBordomapa).then((at)=>{
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{
                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena por ordem alfabética     
                Terapia.find().then((terapia)=>{
                    terapia.sort((a,b) => (a.terapia_nome > b.terapia_nome) ? 1 : ((b.terapia_nome > a.terapia_nome) ? -1 : 0));//Ordena por ordem alfabética 
                    Bene.find().then((bene)=>{
                        bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                        bene.some((b)=>{
                            if((""+b._id) === (""+req.body.bordoBeneid)){
                                bene_nome = b.bene_nome;
                                return true;
                            }
                            return false;
                        })
                        Conv.findOne({_id: conv_id}).then((conv)=>{
                            conv_nome = conv.conv_nome;
                            at.sort(function(a, b) {
                                let d1 = new Date(a.atend_atenddata);
                                let d2 = new Date(b.atend_atenddata);
                                d1.setHours(0);
                                d1.setMinutes(0);
                                d1.setSeconds(0);
                                d2.setHours(0);
                                d2.setMinutes(0);
                                d2.setSeconds(0);
                                if(d1 == d2){
                                    return true;
                                } else {
                                    if(d1 < d2){
                                        return -1;
                                    } else {
                                        return true;
                                    }
                                }
                            });
                            at.forEach((atend)=>{
                                rab.dt = (fncGeral.getData(atend.atend_atenddata));
                                categorias = atend.atend_cartegoria
                                switch (categorias){
                                    case "Apoio":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Extra":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Falta":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Falta Justificada":
                                        terapiaAtend = atend.atend_mergeterapiaid
                                        terapeutaAtend = atend.atend_merdeterapeutaid;;
                                        break;
                                    case "Glosa":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Padrão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Pais":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    case "Substituição":
                                        terapiaAtend = atend.atend_mergeterapiaid;
                                        terapeutaAtend = atend.atend_mergeterapeutaid;
                                        break;
                                    case "Supervisão":
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                    default:
                                        terapiaAtend = atend.atend_terapiaid;
                                        terapeutaAtend = atend.atend_terapeutaid;
                                        break;
                                }
                                rab.especialidade = terapiaAtend;
                                rab.profissional = terapeutaAtend;

                                rel.push(rab);
                                rab = new BordoMapa();
                            });
                            res.render("area/bordo/bordoMapa", {benes: bene, terapeutas: terapeuta, terapias: terapia, rels: rel, periodoDe, periodoAte, conv_nome, bene_nome})
                        })
                    })
                })
            })
        }).catch((err) =>{
            console.log(err)
        })
    },
    carregaBordoedi(req,res){
        Bordo.findById(req.params.id).then((bordo) =>{console.log("ID: "+bordo._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                        res.render("area/bordo/bordoEdi", {bordo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, benes: bene})
        })})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    

    cadastraBordo(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta();
        
        bordoClass.bordoAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(res)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaBordo(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaBordo(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            bordoClass.bordoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    //Volta para a debitsubcateg de listagem
                    console.log("Listagem Realizada!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaBordo(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaBordo(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaBordo(req,res){
        Bordo.deleteOne({_id: req.params.id}).then(() =>{
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                            console.log("Listagem Realizada de Usuário")
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    bene.sort((a,b) => (a.bene_nome > b.bene_nome) ? 1 : ((b.bene_nome > a.bene_nome) ? -1 : 0));//Ordena o bene por nome
                                    console.log("Listagem Realizada de beneficiarios")
                                    Escola.find().then((escola) =>{
                                        escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                            //req.flash("success_message", "Diário de Bordo Deletado!")
                res.render('area/bordo/bordoLis', {convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, benes: bene})
            })})})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
                res.render('admin/erro')
            })
        })
    }


}