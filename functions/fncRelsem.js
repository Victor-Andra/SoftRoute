//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe  Plano de Relsemamento 
const relsemClass = require("../models/relsem")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const escolaClass = require("../models/escola")
const laudoClass = require("../models/laudo")
const anoClass = require("../models/ano")

//Tabela Plano de Relsemamento 
var Relsem = getModel("SoftRoute", 'tb_relsem', relsemClass.RelsemSchema)

//Tabelas Extrangeiras
var Bene = getModel("SoftRoute", 'tb_bene', beneClass.BeneSchema)
var Conv = getModel("SoftRoute", 'tb_conv', convClass.ConvSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Terapia = getModel("SoftRoute", 'tb_terapia', terapiaClass.TerapiaSchema)
var Escola = getModel("SoftRoute", 'tb_escola', escolaClass.EscolaSchema)
var Laudo = getModel("SoftRoute", 'tb_laudo', laudoClass.LaudoSchema)
var Ano = getModel("PortalDoUsuario", 'tb_ano', anoClass.AnoSchema)

//Funções auxiliares
const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;
const ObjectId = require('mongodb').ObjectId;

module.exports = {

async listaRelsem(req, res, resposta){
    try {
        console.log('🔍 [listaRelsem] Iniciando listagem...');
        let db = req.cookies['preferredDb'] || "softroute";
        
        // Modelos do banco principal (preferredDb)
        const Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema);
        const Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        
        // Modelo do banco externo (PortalDoUsuario) - para usuários
        const UsuarioPortal = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);
        
        let flash = new Resposta();

        // ✅ Busca TODOS os relsems, com populate apenas para campos do MESMO banco
        let relsems = await Relsem.find()
            .populate('relsem_beneid', 'bene_nome bene_status')  // ✅ mesmo banco
            .populate('relsem_convid', 'conv_nome')              // ✅ mesmo banco (se existir)
            .sort({ relsem_datacad: -1 })  // Ordena por mais recente
            .lean();

        console.log(`📊 [listaRelsem] ${relsems.length} registros encontrados`);

        // 🔁 Coleta IDs únicos para buscas em lote (performance)
        const terapeutaIds = [...new Set(
            relsems
                .map(r => r.relsem_terapeutaid)
                .filter(id => id && typeof id.toString === 'function' && id.toString().length === 24)
                .map(id => id.toString())
        )];

        const editorIds = [...new Set(
            relsems
                .flatMap(r => [r.relsem_usuidcad, r.relsem_usuidedi])
                .filter(id => id && typeof id.toString === 'function' && id.toString().length === 24)
                .map(id => id.toString())
        )];

        // 🔁 Busca usuários do banco externo (PortalDoUsuario) em lote
        let usuariosMap = {};
        const todosIdsExternos = [...new Set([...terapeutaIds, ...editorIds])];
        
        if (todosIdsExternos.length > 0) {
            const usuariosExternos = await UsuarioPortal.find({ _id: { $in: todosIdsExternos } })
                .select('_id usuario_nome')
                .lean();
            
            usuariosExternos.forEach(u => {
                usuariosMap[u._id.toString()] = u.usuario_nome;
            });
            console.log(`👥 [listaRelsem] ${usuariosExternos.length} usuários externos carregados`);
        }

        // 🔄 Helper para formatar data no padrão dd/mm/yyyy
        const formatarDataBR = (data) => {
            if (!data) return '—';
            const d = new Date(data);
            if (isNaN(d)) return '—';
            const dia = String(d.getUTCDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            return `${dia}/${mes}/${ano}`;
        };

        // 🔄 Processa cada registro para a view
        relsems = relsems.map(r => {
            // Terapeuta (banco externo)
            const terapeuta = usuariosMap[r.relsem_terapeutaid?.toString()];
            
            // Data do relatório (campo relsem_data - string ou date)
            let dataRelatorioFormatada = '—';
            if (r.relsem_data) {
                const d = new Date(r.relsem_data);
                if (!isNaN(d)) {
                    dataRelatorioFormatada = formatarDataBR(d);
                }
            }
            
            return {
                ...r,
                // ✅ Campos para o tooltip (cadastro/edição)
                usuarioCadNome: usuariosMap[r.relsem_usuidcad?.toString()] || 'Não informado',
                usuarioEdiNome: usuariosMap[r.relsem_usuidedi?.toString()] || 'Não informado',
                datacad_formatada: formatarDataBR(r.relsem_datacad),
                dataedi_formatada: formatarDataBR(r.relsem_dataedi),
                
                // ✅ Campos para exibição na tabela
                terapeuta_nome: terapeuta || 'Não identificado',
                relsem_data_formatada: dataRelatorioFormatada,
                
                // ✅ Nome do beneficiário (populate ou fallback)
                bene_nome_exib: r.relsem_beneid?.bene_nome || r.relsem_benenome || 'Não identificado'
            };
        });

        // 📋 Listas auxiliares para selects/filtros da view (se necessário)
        const benes = await Bene.find({ 
                bene_status: "Ativo", 
                bene_nome: { $not: /\./ } 
            })
            .sort({ bene_nome: 1 })
            .lean()
            .catch(err => {
                console.warn('⚠️ Erro ao carregar beneficiários:', err.message);
                return [];
            });

        console.log('✅ [listaRelsem] Renderizando view...');
        
        res.render('area/relsem/relsemLis', {
            relsems,           // ✅ Todos os registros processados
            benes: benes || [], 
            usuarios: [],      // Pode remover se não usar selects na view
            flash
        });

    } catch (err) {
        console.error('❌ [listaRelsem] ERRO CRÍTICO:', err);
        console.error('❌ Stack:', err.stack);
        req.flash("error_message", "Houve um erro ao listar os relatórios: " + err.message);
        res.redirect('/admin/erro');
    }
},

    carregaRelsem(req,res){
        let db = req.cookies['preferredDb'];
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        
        Escola = getModel(db, 'tb_escola', escolaClass.EscolaSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)

        let usuarioAtual = req.cookies['idUsu'];
        console.log("usuarioAtual:"+usuarioAtual)
        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
            terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
            Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((bene) => {
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                Laudo.find().then((laudo)=>{
                    Escola.find().sort({escola_nome: 1}).then((escola)=>{
                        escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome
                        res.render("area/relsem/relsemCad", {escolas: escola, laudos: laudo, terapeutas: terapeuta, benes: bene, usuarioAtual})
                })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os  Relsem")
            res.redirect('admin/erro')
        })
    },
    carregaRelsemedi(req,res){
        let db = req.cookies['preferredDb'];
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Escola = getModel(db, 'tb_escola', escolaClass.EscolaSchema)
        Laudo = getModel(db, 'tb_laudo', laudoClass.LaudoSchema)

        let usuarioAtual = req.cookies['idUsu'];
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((beneficiario) => {
                            beneficiario.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    Laudo.find().then((laudo)=>{
                                        res.render("area/relsem/relsemEdi", {relsem, laudos: laudo, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes: beneficiario})
        })})})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    cadastraRelsem(req,res){
        console.log("chegou")
        let resultado
        let flash = new Resposta();
        
        relsemClass.relsemAdicionar(req,res).then((result)=>{
            console.log("Cadastro realizado!")
            console.log(result)
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:")
        }).finally(()=>{
            if (resultado == true){
                flash.texto = "Relsem cadastrado com sucesso!"
                flash.sucesso = "true"
                console.log('verdadeiro')
                this.listaRelsem(req,res,flash)
            } else {
                flash.texto = resultado
                flash.sucesso = "false"
                console.log('falso')
                res.render('admin/erro', flash);
            }
        })
    },
    atualizaRelsem(req,res){
        let resultado
        let flash = new Resposta()
        try{
            relsemClass.relsemEditar(req,res).then((res)=>{
                console.log("Atualização realizada!")
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
                    console.log("Listagem realizada!")
                    flash.texto = "Atualizado com Sucesso!"
                    flash.sucesso = "true"
                    this.listaRelsem(req,res,flash)
                }else{
                    //passar classe de erro
                    console.log("error")
                    console.log(resultado)
                    flash.texto = resultado
                    flash.sucesso = "false"
                    this.listaRelsem(req,res,flash)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },
    deletaRelsem(req,res){
        let db = req.cookies['preferredDb'];
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)

        let resposta;
        let flash = new Resposta()
        Relsem.deleteOne({_id: req.params.id}).then(() =>{
            resposta = "true";
        }).catch((err) =>{
            resposta = err;
            console.log(err)
            req.flash("error_message", "houve um erro ao listar os Relsem")
            res.render('admin/erro')
        }).finally(()=>{
            if (resposta == "true"){
                flash.texto = "Relsem deletado!";
                flash.sucesso = "true";
            } else {
                flash.texto = "Erro ao deletar Relsem";
                flash.sucesso = "false";
            }
            this.listaRelsem(req,res, resposta)
        })
    },
    
    relsemImp(req,res){
        let db = req.cookies['preferredDb'];
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Escola = getModel(db, 'tb_escola', escolaClass.EscolaSchema)

        let usuarioAtual = req.cookies['idUsu'];
        let base64Image0; //Carimbo padrão de Roberta
        let base64Image1; //Carimbo terapeuta padrão
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((beneficiarios) => {
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                        //Busca nos usuários os carimbos dos Terapeutas identificados dentro do Plano de Tratamento incluindo o carimbo da Route
                                        Usuario.findOne({_id : '62e008adea444f5b7a02c04f'}).then((carRobertaRoute)=>{
                                            if (carRobertaRoute.usuario_carimbo != 'undefined' && carRobertaRoute.usuario_carimbo != undefined){
                                                base64Image0 = new Buffer.from(carRobertaRoute.usuario_carimbo, 'binary').toString('base64');
                                                }
                                                Usuario.findOne({_id: relsem.relsem_terapeutaid}).then((carTeraPad)=>{
                                                        if (carTeraPad.usuario_carimbo != 'undefined' && carTeraPad.usuario_carimbo != undefined){
                                                            base64Image1 = new Buffer.from(carTeraPad.usuario_carimbo, 'binary').toString('base64');
                                                            }
                                                        console.log(carTeraPad)
                                    res.render("area/relsem/relsemImp", {relsem, base64Image0, base64Image1, carTeraPad, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao abrir a impressão!")
            res.render('admin/erro')
        })
    },

    relsemImpcapa(req,res){
        let db = req.cookies['preferredDb'];
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)
        Conv = getModel(db, 'tb_conv', convClass.ConvSchema)
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema)
        Escola = getModel(db, 'tb_escola', escolaClass.EscolaSchema)

        let usuarioAtual = req.cookies['idUsu'];
        Relsem.findById(req.params.id).then((relsem) =>{console.log("ID: "+relsem._id)
            Conv.find().then((conv)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                    Usuario.find({"usuario_funcaoid":"6241030bfbcc51f47c720a0b"}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        terapeuta.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o terapeuta por nome
                        console.log("Listagem Realizada de Usuário")
                        Bene.find({bene_status: "Ativo", bene_nome: { $not: /\./ } }).then((beneficiarios) => {
                            Bene.findOne({_id: relsem.relsem_beneid}).then((bene)=>{
                                //bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                                console.log("Listagem Realizada de beneficiarios")
                                Escola.find().then((escola) =>{
                                    escola.sort((a,b) => (a.escola_nome > b.escola_nome) ? 1 : ((b.escola_nome > a.escola_nome) ? -1 : 0));//Ordena o bene por nome        
                                    res.render("area/relsem/relsemImpcapa", {relsem, convs: conv, escolas: escola, terapias: terapia, terapeutas: terapeuta, bene, usuarioAtual, benes:  beneficiarios})
        })})})})})})}).catch((err) =>{
        
            console.log(err)
            req.flash("error_message", "houve um erro ao abrir a impressão da capa!")
            res.render('admin/erro')
        })
    },

    relsemImpFiltro(req,res){
        let db = req.cookies['preferredDb'];
        Relsem = getModel(db, 'tb_relsem', relsemClass.RelsemSchema)
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema)

        Relsem.find({relsem_beneid: req.body.relsemBeneid}).then((relsem) =>{
            Bene.find().then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                res.render('area/relsem/relsemImp', {relsems: relsem, benes: bene})
        })})
    }
}