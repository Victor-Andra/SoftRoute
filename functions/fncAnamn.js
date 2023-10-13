//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Anamnese e Beneficiários
const anamnClass = require("../models/anamn")


//Classes Extrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")


//Tabela Anamnese
const Anamn = mongoose.model("tb_anamn")

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
    carregaAnamn(req, res){
        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            console.log("Listagem Realizada de Usuário")
                Bene.find({bene_status: "Ativo"}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada de beneficiarios")
                        res.render("area/anamn/anamnCad", {usuarios: usuario, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },
    
        cadastraAnamn(req,res){
            console.log("chegou")
            let resultado
            let resposta = new Resposta()
            
            anamnClass.anamnAdicionar(req,res).then((result)=>{
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
                    this.listaAnamn(req,res,resposta)
                } else {
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    console.log('falso')
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    res.render('admin/erro', resposta);
                }
            })
        },

    deletaAnamn(req,res){
        Anamn.deleteOne({_id: req.params.id}).then(() =>{
                        Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                req.flash("success_message", "Anamnese deletada!")
                this.listaAnamn(req,res);
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar a anamnese")
                res.render('admin/erro')
            })
        })
    },

    atualizaAnamn(req,res){
        let resposta;
        try{
            anamnClass.anamnEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
            }).finally(() =>{
                if(resposta){
                    //Volta para a Anamn de listagem
                    this.listaAnamn(req,res);
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

    carregaAnamnEdi(req, res){
        Anamn.findById(req.params.id).then((anamn) =>{console.log("ID: "+anamn._id)
        Bene.find().sort({bene_nome: 1}).then((bene)=>{
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b", "usuario_status":"Ativo"}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));
                     res.render('area/anamn/anamnEdi', {anamn, usuarios: usuario, benes: bene})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

    listaAnamn(req, res, resposta){
        let flash = new Resposta();
        //console.log('listando Anamneses')
        Anamn.find().then((anamn) =>{
            anamn.sort((a,b) => (a.anamn_benenome > b.anamn_benenome) ? 1 : ((b.anamn_benenome > a.anamn_benenome) ? -1 : 0));//Ordena a nome do beneficiário na lista anamnese 
            anamn.sort((a,b) => ((a.anamn_benenome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.anamn_benenome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.anamn_benenome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.anamn_benenome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            anamn.forEach((b)=>{
                //console.log("b.datacad"+b.anamn_datacad)
                let datacad = new Date(b.anamn_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.anamn_data=fulldate;
                
                //console.log("b.dataana"+b.anamn_dataanamnese)
                datacad = new Date(b.anamn_dataanamnese)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.anamn_dataanamn=fulldate;

                //console.log("d.dataanaedi"+d.anamn_dataedi)
                datacad = new Date(b.anamn_dataedi)
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.anamn_edi=fulldate;
            })

            //console.log("anamn:");
            //console.log(anamn);
            //console.log("Listagem Realizada das Anamneses!")
                Bene.findById(req.params.id).then((bene) =>{
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
            res.render('area/anamn/anamnLis', {anamns: anamn, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    listaAnamnImp(req, res){
        Anamn.findById(req.params.id).then((anamn) =>{
            console.log("anamn:");
            console.log(anamn);
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/anamn/anamnLis', {anamns: anamn, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}