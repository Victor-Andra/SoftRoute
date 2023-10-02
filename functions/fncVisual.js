//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Controle de PECS
const visualClass = require("../models/visual")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela PECS
const Visual = mongoose.model("tb_visual")

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
    carregaVisual(req,res){
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                       res.render("area/aba/visual/visualCad", {terapeutas: terapeuta, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Diários de Bordo")
            res.redirect('admin/erro')
        })

    },
    
        cadastraVisual(req,res){
            console.log("chegou")
            let resultado
            let resposta = new Resposta()
            
            visualClass.visualAdicionar(req,res).then((result)=>{
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
                    this.listaVisual(req,res,resposta)
                } else {
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    console.log('falso')
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    res.render('admin/erro', resposta);
                }
            })
        },

    deletaVisual(req,res){
        Visual.deleteOne({_id: req.params.id}).then(() =>{
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                req.flash("success_message", "Visualese deletada!")
                this.listaVisual(req,res);
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar a visualese")
                res.render('admin/erro')
            })
        })
    },

    atualizaVisual(req,res){
        let resposta;
        try{
            visualClass.visualEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
            }).finally(() =>{
                if(resposta){
                    //Volta para a Visual de listagem
                    this.listaVisual(req,res);
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

    carregaVisualedi(req, res){
        Visual.findById(req.params.id).then((visual) =>{console.log("ID: "+visual._id)
            Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena o terapeuta por nome
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                        bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            res.render('area/aba/visual/visualEdi', {visual, terapeutas: terapeuta, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaVisual(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Visualeses')
        Visual.find().then((visual) =>{
            visual.sort((a,b) => (a.visual_benenome > b.visual_benenome) ? 1 : ((b.visual_benenome > a.visual_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista visualese 
            visual.forEach((b)=>{
                //console.log("b.datacad"+b.visual_datacad)
                let datacad = new Date(b.visual_data)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.visual_data=fulldate;
                
                //console.log("b.dataana"+b.visual_datavisualese)
                datacad = new Date(b.visual_datavisualese)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.visual_datacad=fulldate;

                //console.log("d.dataanaedi"+d.visual_dataedi)
                datacad = new Date(b.visual_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.visual_dataedi=fulldate;
            })

            //console.log("visual:");
            //console.log(visual);
            //console.log("Listagem Realizada das Visualeses!")
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
            res.render('area/aba/visual/visualLis', {visuals: visual, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaVisualimp(req, res){
        Visual.findById(req.params.id).then((visual) =>{
            console.log("visual:");
            console.log(visual);
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/aba/visual/visualLis', {visuals: visual, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}