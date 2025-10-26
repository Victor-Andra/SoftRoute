//Avaliação Fisioterapeutica (Funções)
//Criado em: 2025-09-26 Wagner Cintra
//Editado em:

//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Avafisio e Bene
const avafisioClass = require("../models/avafisio")


//Classes Extrangeiras, Beneficiários, Usuários, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")


//Tabela Avafisio
var Avafisio = getModel("SoftRoute", 'tb_avafisio', avafisioClass.AvafisioSchema)

//Tabelas Extrangeiras, Beneficiários, Usuários, (Técnicos e Usuários)
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Funções Auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    //Abre formulário de cadastro
    carregaAvafisio(req, res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            console.log("Listagem Realizada de Usuário")
                Bene.find({bene_status: "Ativo"}).then((bene)=>{
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada de beneficiarios")
                    res.render("area/avafisio/avafisioCad", {usuarios: usuario, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },
    
    //Salva cadastro
    cadastraAvafisio(req,res){
        console.log("chegou")
        let resultado
        let resposta = new Resposta()
        
        avafisioClass.AvafisioAdicionar(req,res).then((result)=>{
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
                this.listaAvafisio(req,res,resposta)
            } else {
                resposta.texto = resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    //Deleta um cadastro existente, será atualizada para enviar para lixeira
    deletaAvafisio(req,res){
        let db = req.cookies['preferredDb'];
        Avafisio = getModel(db, 'tb_avafisio', avafisioClass.AvafisioSchema)

        Avafisio.deleteOne({_id: req.params.id}).then(() =>{
            Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                console.log("Listagem Realizada de Usuário")
                req.flash("success_message", "Avafisioese deletada!")
                this.listaAvafisio(req,res);
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao deletar a avafisioese")
                res.render('admin/erro')
            })
        })
    },

    //Edita um cadastro existente
    atualizaAvafisio(req,res){
        let resposta;
        try{
            avafisioClass.AvafisioEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
            }).finally(() =>{
                if(resposta){
                    //Volta para a Avafisio de listagem
                    this.listaAvafisio(req,res);
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

    //Abre formulário de Edição
    carregaAvafisioEdi(req, res){
        let db = req.cookies['preferredDb'];
        Avafisio = getModel(db, 'tb_avafisio', avafisioClass.AvafisioSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let base64Image;
        Avafisio.findById(req.params.id).then((avafisio) =>{console.log("ID: "+avafisio._id)
            let datanasc2 = new Date(avafisio.avafisio_benedatanasc);
            avafisio.avafisio_benedatanasc = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000)//add 3h ao gtm
            Bene.find().sort({bene_nome: 1}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    if (usuario.usuario_carimbo != 'undefined' && usuario.usuario_carimbo != undefined){
                        base64Image = new Buffer.from(usuario.usuario_carimbo, 'binary').toString('base64');
                    }     
                    res.render('area/avafisio/avafisioEdi', {avafisio, usuarios: usuario, benes: bene, base64Image})
        })})}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },
    
    //Abre formulário de lista
    listaAvafisio(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Avafisio = getModel(db, 'tb_avafisio', avafisioClass.AvafisioSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
        //console.log('listando Avafisioeses')
        Avafisio.find().then((avafisio) =>{
            avafisio.sort((a,b) => (((a.avafisio_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > ((b.avafisio_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : ((((b.avafisio_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > ((a.avafisio_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
            avafisio.forEach((b)=>{
                let datanasc2 = new Date(b.avafisio_datacad);
                let datacad = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000)//add 3h ao gtm
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.avafisio_data=fulldate;
                
                datanasc2 = new Date(b.avafisio_dataavafisioese);
                datacad = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000)//add 3h ao gtm
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.avafisio_dataavafisio=fulldate;

                //console.log("d.dataanaedi"+d.avafisio_dataedi)
                datanasc2 = new Date(b.avafisio_dataedi);
                datacad = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000)//add 3h ao gtm
                mes = (datacad.getMonth()+1).toString();
                dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.avafisio_edi=fulldate;

            })

            //console.log("avafisio:");
            //console.log(avafisio);
            //console.log("Listagem Realizada das Avafisioeses!")
            Bene.find().then((bene) => { //Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                bene.forEach((b) => {
                    //console.log("b.datanasc"+b.bene_datanasc)
                    let datanasc2 = new Date(b.bene_datanasc);
                    let datanasc = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000)//add 3h ao gtm
                    let mes = (datanasc.getMonth()+1).toString();
                    let dia = (datanasc.getUTCDate()).toString();
                    if (mes.length == 1){
                        mes = "0"+mes;
                    }
                    if (dia.length == 1){
                        dia = "0"+dia;
                    }
                    let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                    b.datanasc=fulldate;
    
                    // Data atual
                    const hoje = new Date();
                    let idade = new Date(b.bene_idade);
    
                    // Data de aniversário
                    let aniversario = datanasc;
    
                    // Cálculo da idade
                    let idadeAnos = hoje.getFullYear() - aniversario.getFullYear();
                    let idadeMeses = hoje.getMonth() - aniversario.getMonth();
                    let idadedias = hoje.getDay() - aniversario.getDay();
    
                    // Ajuste caso o dia de aniversário ainda não tenha ocorrido este ano
                    if (hoje.getDate() < aniversario.getDate()) {
                        idadeMeses--;
                    }
    
                    // Se o mês do aniversário for maior que o mês atual, ajusta a idade
                    if (idadeMeses < 0) {
                        idadeAnos--;
                        idadeMeses += 12;
                    }
                    let fullidade = (idadeAnos + " anos e " + (""+idadeMeses+"").replace("-","") + " meses.");
                    b.idade = fullidade;
                
                
                });
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
            res.render('area/avafisio/avafisioLis', {avafisios: avafisio, usuarios: usuario, benes: bene, flash})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    //Abre formulário de lista para impressão
    listaAvafisioImp(req, res){
        let db = req.cookies['preferredDb'];
        Avafisio = getModel(db, 'tb_avafisio', avafisioClass.AvafisioSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Avafisio.findById(req.params.id).then((avafisio) =>{
            console.log("avafisio:");
            console.log(avafisio);
            Bene.findById(req.params.id).then((bene) =>{
                console.log("Listagem Realizada bene!")
                res.render('area/avafisio/avafisioLis', {avafisios: avafisio, benes: bene})
        })}).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}