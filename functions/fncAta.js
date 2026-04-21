//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Analise funcional do comportamento
const ataClass = require("../models/ata")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")
//Tabela Ata
var Ata = getModel("SoftRoute", 'tb_ata', ataClass.AtaSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaAta(req, res, resposta){
        let db = req.cookies['preferredDb'];
        Ata = getModel(db, 'tb_ata', ataClass.AtaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Ata.find().then((ata) =>{

            ata.forEach((b)=>{
                let datacad = new Date(b.ata_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                dataedi = new Date(b.ata_dataedi)
                mes = (dataedi.getMonth()+1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(dataedi.getFullYear()+"-"+mes+"-"+dia).toString();
                b.dataedi=fulldate;

                datacorrec= new Date(b.ata_correcdata)
                mes = (datacorrec.getMonth()+1).toString();
                dia = (datacorrec.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                fulldate=(datacorrec.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacorrec=fulldate;
            })

            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
                    Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        
                        res.render('area/escalas/ata/ataLis', {Atas: ata, terapeutas: terapeuta, usuarios: usuario, benes: bene, perfilAtual, flash})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },



    carregaAta(req,res){
        let db = req.cookies['preferredDb'];

        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((bene) => {
            bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            //console.log("Listagem Realizada de Beneficiários!")
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                //console.log("Listagem Realizada de Usuário")
                res.render("area/escalas/ata/ataCad", {Benes: bene, Terapeutas: terapeuta})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })

    },
    carregaAtaEdiOLD(req,res){
        let db = req.cookies['preferredDb'];
        Ata = getModel(db, 'tb_ata', ataClass.AtaSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let perfilAtual = req.cookies['lvlUsu'];
        Ata.findOne({_id : req.params.id}).then((ata)=>{
            console.log("Listagem Realizada de Planos de Tratamento")
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena por ordem alfabética 
                Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((bene) => {
                    bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                    console.log("Listagem Realizada de beneficiarios")
                    res.render("area/escalas/ata/ataEdi", {ata, Terapeutas: terapeuta, Benes: bene, usuarioAtual, perfilAtual})
            })})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao Realizar as listas!")
                res.render('admin/erro')
            })
        },
        carregaAtaEdi(req, res) {
            let db = req.cookies['preferredDb'];
            Ata = getModel(db, 'tb_ata', ataClass.AtaSchema);
            Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

            let usuarioAtual = req.cookies['idUsu'];
            let perfilAtual = req.cookies['lvlUsu'];

            // 1️⃣ Busca o ATA pelo ID único (correto ✅)
            Ata.findOne({ _id: req.params.id })
                .then((ata) => {
                    if (!ata) {
                        req.flash("error_message", "Registro ATA não encontrado!");
                        return res.redirect('/menu/area/escalas/ata/lis');
                    }

                    console.log("=== DEBUG ATA EDIÇÃO ===");
                    console.log("ATA encontrado:", ata._id);
                    console.log("Beneficiário vinculado:", ata.ata_beneid);
                    console.log("=== FIM DEBUG ===");

                    // 2️⃣ Busca TODOS os terapeutas (mantido)
                    Usuario.find({ usuario_funcaoid: "6241030bfbcc51f47c720a0b" })
                        .then((terapeuta) => {
                            terapeuta.sort((a, b) => 
                                a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                                b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ? 1 : -1
                            );

                            // 3️⃣ 🔧 CORREÇÃO: Busca TODOS os beneficiários (remove filtro "Ativo")
                            // Mantém apenas o filtro de nome com ponto (dados inválidos)
                            Bene.find({ bene_nome: { $not: /\./ } })
                                .then((bene) => {
                                    bene.sort((a, b) => 
                                        a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") > 
                                        b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "") ? 1 : -1
                                    );

                                    console.log(`Beneficiários carregados: ${bene.length}`);
                                    
                                    // Verifica se o beneficiário do ATA está na lista
                                    const beneEncontrado = bene.find(b => 
                                        b._id.toString() === ata.ata_beneid?.toString()
                                    );
                                    if (!beneEncontrado) {
                                        console.warn("⚠️ Beneficiário do ATA não encontrado na lista!");
                                    }

                                    // 4️⃣ Renderiza a view com todos os dados
                                    res.render("area/escalas/ata/ataEdi", {
                                        ata,
                                        Terapeutas: terapeuta,
                                        Benes: bene,  // ← Lista COMPLETA, incluindo inativos
                                        usuarioAtual,
                                        perfilAtual
                                    });
                                })
                                .catch(err => {
                                    console.error("Erro ao buscar beneficiários:", err);
                                    req.flash("error_message", "Erro ao carregar beneficiários!");
                                    res.render('admin/erro');
                                });
                        })
                        .catch(err => {
                            console.error("Erro ao buscar terapeutas:", err);
                            req.flash("error_message", "Erro ao carregar terapeutas!");
                            res.render('admin/erro');
                        });
                })
                .catch((err) => {
                    console.error("Erro ao buscar ATA:", err);
                    req.flash("error_message", "Erro ao realizar a edição!");
                    res.render('admin/erro');
                });
        },
    cadastraAta(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        ataClass.ataAdicionar(req,res).then((result)=>{
            console.log("Cadastro Realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "ATA cadastrada com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaAta(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },

    atualizaAta(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            ataClass.ataEditar(req,res).then((res)=>{
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
                    this.listaAta(req,res,resposta)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    this.listaAta(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },

    deletaAtaold(req,res){
        let db = req.cookies['preferredDb'];
        Ata = getModel(db, 'tb_ata', ataClass.AtaSchema)

        let resposta;
        let flash = new Resposta()
        Ata.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar as ATAS")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "ATA deletada!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar a ATA";
                flash.sucesso = "false";
            }
            this.listaAta(req,res, resposta)
        })
    },
    
    deletaAta(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        let resposta;
        let flash = new Resposta()
        Ata.findByIdAndUpdate(req.params.id,{$set: {'ata_lixo': 'true', 'ata_usuidedi': usuarioAtual}}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os formulários ATA")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Formulário ATA deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar o formulário ATA";
                flash.sucesso = "false";
            }
            this.listaAta(req,res, resposta)
        })
    }


}