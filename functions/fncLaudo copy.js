//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Controle de PECS
const laudoClass = require("../models/laudo")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela PECS
const Laudo = mongoose.model("tb_laudo")

//Tabelas Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")

//Funções Auxiliares
const respostaClass = require("../models/resposta")
const bene = require("../models/bene")
const Resposta = mongoose.model("tb_resposta")

module.exports = {
    carregaLaudo(req,res){
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                       res.render("area/laudo/laudoCad", {terapeutas: terapeuta, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.redirect('admin/erro')
        })

    },
    
        cadastraLaudo(req,res){
            console.log("chegou")
            let resultado
            let resposta = new Resposta()
            
            laudoClass.laudoAdicionar(req,res).then((result)=>{
                console.log("Cadastro Realizado!!!")
                //console.log(res)
                resultado = true;
            }).catch((err)=>{
                console.log("ERRO:");
                console.log(err);
                resultado = err
            }).finally(()=>{
                if (resultado == true){
                    resposta.texto = "Cadastrado com sucesso!"
                    resposta.sucesso = "true"
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    this.listaLaudo(req,res,resposta)
                } else {
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    console.log('falso')
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    res.render('admin/erro', resposta);
                }
            })
        },

    deletaLaudo(req,res){
        Laudo.deleteOne({_id: req.params.id}).then(() =>{
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                req.flash("success_message", "Laudoese deletada!")
                this.listaLaudo(req,res);
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar a laudoese")
                res.render('admin/erro')
            })
        })
    },

    atualizaLaudo(req,res){
        let resposta;
        try{
            laudoClass.laudoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
            }).finally(() =>{
                if(resposta){
                    //Volta para a Laudo de listagem
                    this.listaLaudo(req,res);
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

    carregaLaudoedi(req, res){
        Laudo.findById(req.params.id).then((laudo) =>{console.log("ID: "+laudo._id)
            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            res.render('area/laudo/laudoEdi', {laudo, terapeutas: terapeuta, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaLaudo(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Laudoeses')
        Laudo.find().then((laudo) =>{
            laudo.sort((a,b) => (a.laudo_benenome > b.laudo_benenome) ? 1 : ((b.laudo_benenome > a.laudo_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista laudoese 
            laudo.forEach((b)=>{
                //console.log("b.datacad"+b.laudo_datacad)
                let datacad = new Date(b.laudo_data)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.laudo_data=fulldate;
                
                //console.log("b.dataana"+b.laudo_datalaudoese)
                datacad = new Date(b.laudo_datalaudoese)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.laudo_datacad=fulldate;

                //console.log("d.dataanaedi"+d.laudo_dataedi)
                datacad = new Date(b.laudo_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.laudo_dataedi=fulldate;
            })

            //console.log("laudo:");
            //console.log(laudo);
            //console.log("Listagem Realizada das Laudoeses!")
                Bene.find().then((bene)=>{
                    //console.log("Listagem Realizada bene!")
                    Usuario.find().then((usuario)=>{
                        //console.log("Listagem Realizada Usuário!")
                        /*if(resposta.sucesso == ""){
                            console.log(' objeto vazio');
                            flash.texto = ""
                            flash.sucesso = ""
                        } else {
                            console.log(resposta.sucesso+' objeto com valor: '+resposta.texto);
                            flash.texto = resposta.texto
                            flash.sucesso = resposta.sucesso
                        }*/
            res.render('area/laudo/laudoLis', {laudos: laudo, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaLaudoimp(req, res){
        Laudo.findById(req.params.id).then((laudo) =>{
            console.log("laudo:");
            console.log(laudo);
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/laudo/laudoLis', {laudos: laudo, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}