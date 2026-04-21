//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Anamnese e Beneficiários
const anamnClass = require("../models/anamn")

//Classes Estrangeiras, Convênios, Terapia, (Técnicos e Usuários)
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

//Funções Auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    carregaAnamn(req, res){
        let db = req.cookies['preferredDb'];
        const LocalBene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        const LocalUsuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

        LocalUsuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
            console.log("Listagem Realizada de Usuário")
            LocalBene.find({bene_status: "Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                console.log("Listagem Realizada de beneficiarios")
                res.render("area/anamn/anamnCad", {usuarios: usuario, benes: bene})
            })
        }).catch((err) =>{
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
            resultado = true;
        }).catch((err)=>{
            console.log("ERRO:");
            console.log(err);
            resultado = err
        }).finally(()=>{
            if (resultado === true){
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaAnamn(req,res, resposta)
            } else {
                resposta.texto = resultado?.message || resultado
                resposta.sucesso = "false"
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    deletaAnamn(req,res){
        let db = req.cookies['preferredDb'];
        const LocalAnamn = getModel(db, 'tb_anamn', anamnClass.AnamnSchema)

        LocalAnamn.deleteOne({_id: req.params.id}).then(() =>{
            const LocalUsuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
            LocalUsuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
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
                if(resposta === true){
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
        let db = req.cookies['preferredDb'];
        const LocalAnamn = getModel(db, 'tb_anamn', anamnClass.AnamnSchema)
        const LocalBene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        const LocalUsuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

        LocalAnamn.findById(req.params.id).then((anamn) =>{
            console.log("ID: "+anamn._id)
            // Ajuste de timezone para data de nascimento
            if(anamn.anamn_benedatanasc){
                let datanasc2 = new Date(anamn.anamn_benedatanasc);
                anamn.anamn_benedatanasc = new Date(datanasc2.getTime() + 3 * 60 * 60 * 1000) //add 3h ao gtm
            }
            // Formata datas para exibição na view (opcional, se a view precisar no formato string)
            if(anamn.anamn_dataanamnese){
                let dataAnamn = new Date(anamn.anamn_dataanamnese);
                anamn.anamn_dataanamnese_fmt = dataAnamn.toLocaleDateString('pt-BR');
            }
            
            LocalBene.find().sort({bene_nome: 1}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                
                LocalUsuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                    
                    // CORREÇÃO: usuario é array, precisa pegar o primeiro ou filtrar pelo ID correto
                    let base64Image = null;
                    // Se precisar do carimbo do terapeuta específico, filtre pelo ID correto
                    // Exemplo: const terapeuta = usuario.find(u => u._id == anamn.anamn_terapeutaid);
                    
                    res.render('area/anamn/anamnEdi', {anamn, usuarios: usuario, benes: bene, base64Image})
                })
            })
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    },

    listaAnamn(req, res, resposta){
        let db = req.cookies['preferredDb'];
        const LocalAnamn = getModel(db, 'tb_anamn', anamnClass.AnamnSchema)
        const LocalBene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        const LocalUsuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

        let flash = new Resposta();
        
        LocalAnamn.find().then((anamn) =>{
            anamn.sort((a,b) => (((a.anamn_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > ((b.anamn_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : ((((b.anamn_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > ((a.anamn_benenome+"").normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
            
            anamn.forEach((b)=>{
                // Formata datacad
                if(b.anamn_datacad){
                    let datacad = new Date(b.anamn_datacad);
                    datacad = new Date(datacad.getTime() + 3 * 60 * 60 * 1000) //add 3h ao gtm
                    let mes = (datacad.getMonth()+1).toString().padStart(2, '0');
                    let dia = (datacad.getDate()).toString().padStart(2, '0');
                    b.anamn_data = `${datacad.getFullYear()}-${mes}-${dia}`;
                }
                
                // Formata dataanamnese (novo campo)
                if(b.anamn_dataanamnese){
                    let dataAnamn = new Date(b.anamn_dataanamnese);
                    dataAnamn = new Date(dataAnamn.getTime() + 3 * 60 * 60 * 1000)
                    let mes = (dataAnamn.getMonth()+1).toString().padStart(2, '0');
                    let dia = (dataAnamn.getDate()).toString().padStart(2, '0');
                    b.anamn_dataanamn = `${dataAnamn.getFullYear()}-${mes}-${dia}`;
                }

                // Formata dataedi
                if(b.anamn_dataedi){
                    let dataEdi = new Date(b.anamn_dataedi);
                    dataEdi = new Date(dataEdi.getTime() + 3 * 60 * 60 * 1000)
                    let mes = (dataEdi.getMonth()+1).toString().padStart(2, '0');
                    let dia = (dataEdi.getDate()).toString().padStart(2, '0');
                    b.anamn_edi = `${dataEdi.getFullYear()}-${mes}-${dia}`;
                }
            })

            LocalBene.find().then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                bene.forEach((b) => {
                    if(b.bene_datanasc){
                        let datanasc = new Date(b.bene_datanasc);
                        datanasc = new Date(datanasc.getTime() + 3 * 60 * 60 * 1000)
                        let mes = (datanasc.getMonth()+1).toString().padStart(2, '0');
                        let dia = (datanasc.getDate()).toString().padStart(2, '0');
                        b.datanasc = `${datanasc.getFullYear()}-${mes}-${dia}`;
    
                        // Cálculo da idade
                        const hoje = new Date();
                        let idadeAnos = hoje.getFullYear() - datanasc.getFullYear();
                        let idadeMeses = hoje.getMonth() - datanasc.getMonth();
    
                        if (hoje.getDate() < datanasc.getDate()) {
                            idadeMeses--;
                        }
                        if (idadeMeses < 0) {
                            idadeAnos--;
                            idadeMeses += 12;
                        }
                        b.idade = `${idadeAnos} anos e ${Math.abs(idadeMeses)} meses.`;
                    }
                });
                
                LocalUsuario.find().then((usuario)=>{
                    res.render('area/anamn/anamnLis', {anamns: anamn, usuarios: usuario, benes: bene, flash})
                })
            })
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },
    
    listaAnamnImp(req, res){
        let db = req.cookies['preferredDb'];
        const LocalAnamn = getModel(db, 'tb_anamn', anamnClass.AnamnSchema)
        const LocalBene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        LocalAnamn.findById(req.params.id).then((anamn) =>{
            console.log("anamn:");
            console.log(anamn);
            LocalBene.findById(anamn.anamn_beneid).then((bene) =>{ // CORREÇÃO: usa beneid da anamnese, não o mesmo ID
                console.log("Listagem Realizada bene!")
                res.render('area/anamn/anamnImp', {anamn: anamn, bene: bene}) // CORREÇÃO: nomes das variáveis e template
            })
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })
    }
}