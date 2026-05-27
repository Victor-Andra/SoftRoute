//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//saudecolabs - CARREGA DIRETAMENTE DO SCHEMA QUE JÁ USA PORTALDOUSUARIO
const saudecolabClass = require("../models/saudecolab")
const SaudecolabModel = saudecolabClass.SaudecolabModel  // ✅ Usa o modelo já configurado para PortalDoUsuario

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras - PortalDoUsuario
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {

listaSaudecolabOLD2(req, res, resposta) {
    let flash = new Resposta();
    flash = resposta;
    
    const usuarioAtual = req.cookies['idUsu'];
    let lvlUsu = req.cookies['lvlUsu'];
    
    // 🔹 IDs dos usuários "super" que acessam a view completa
    const idsSuper = [
        "681ba2369a565e1f979b7e10", 
        "62d95222ea444f5b7a0276bc", 
        "62e008adea444f5b7a02c04f"
    ];
    
    const idsPerfil =[ // 🔹 IDs dos Perfik que pode ver a saudecolabLis e sem lupa
      "6242190fa12aa557219a0fd6"
    ];

    // 🔹 Define a view e o filtro conforme o tipo de usuário
    const ehSuper = idsSuper.includes(usuarioAtual);
    console.log("Inicializando Variaveis de ambiente e carregado a view!")
    console.log("ehSuper: "+ehSuper)
    console.log("usuarioAtual:" +usuarioAtual)
    console.log("idsSuper: "+idsSuper)
    console.log("lvlUsu: "+lvlUsu)
    
    const viewDestino = ehSuper 
        ? 'ferramentas/saudecolab/saudecolabLis_Completo'  // View completa para super
        : 'ferramentas/saudecolab/saudecolabLis';           // View padrão para comum
    
    const filtro = ehSuper 
        ? {}  // Super: vê todos os registros
        : { saudecolab_saudecolabusuid: usuarioAtual };  // Comum: vê só os seus

    // 🔹 Busca paralela dos dados
    Promise.all([
        SaudecolabModel.find(filtro).lean(),
        Usuario.find().lean()
    ])
    .then(([saudecolabs, usuarios]) => {
        res.render(viewDestino, {
            saudecolabs: saudecolabs,
            usuarios: usuarios,
            flash,
            idUsu: usuarioAtual,
            podeVerLupa: "true"  // Mantém compatibilidade com Handlebars
        });
    })
    .catch((err) => {
        console.error('💥 ERRO ao listar Saudecolabs:', err);
        req.flash("error_message", "Houve um erro ao listar os registros.");
        res.redirect('/admin/erro');
    });
},
listaSaudecolab(req, res, resposta) {
    let flash = new Resposta();
    flash = resposta;
    
    const usuarioAtual = req.cookies['idUsu'];
    const lvlUsu = req.cookies['lvlUsu'];
    
    // 🔹 IDs dos usuários "super" → view completa, vê tudo, com lupa
    const idsSuper = [
        "681ba2369a565e1f979b7e10", 
        "62d95222ea444f5b7a0276bc", 
        "62e008adea444f5b7a02c04f"
    ];
    
    // 🔹 IDs de perfil "consulta global" → view normal, vê tudo, SEM lupa
    const idsPerfil = [
        "6242190fa12aa557219a0fd6"
    ];

    console.log("=== Inicializando listagem Saudecolab ===");
    console.log("usuarioAtual: " + usuarioAtual);
    console.log("lvlUsu: " + lvlUsu);
    console.log("ehSuper: " + idsSuper.includes(usuarioAtual));
    console.log("ehPerfilGlobal: " + idsPerfil.includes(lvlUsu));

    // 🔹 Classifica o tipo de acesso do usuário
    const ehSuper = idsSuper.includes(usuarioAtual);
    const ehPerfilGlobal = idsPerfil.includes(lvlUsu);
    
    // 🔹 Define view, filtro e permissão de lupa conforme o perfil
    let viewDestino, filtro, podeVerLupa;
    
    if (ehSuper) {
        // 🦸 Super: view completa, vê tudo, pode editar
        viewDestino = 'ferramentas/saudecolab/saudecolabLis_Completo';
        filtro = {};
        podeVerLupa = true;
        
    } else if (ehPerfilGlobal) {
        // 👁️ Perfil global: view normal, vê tudo, NÃO pode editar
        viewDestino = 'ferramentas/saudecolab/saudecolabLis';
        filtro = {};  // ✅ Vê todos os registros
        podeVerLupa = false;  // ❌ Sem lupa
        
    } else {
        // 👤 Usuário comum: view normal, vê só os seus, pode editar os seus
        viewDestino = 'ferramentas/saudecolab/saudecolabLis';
        filtro = { saudecolab_saudecolabusuid: usuarioAtual };
        podeVerLupa = true;
    }

    // 🔹 Busca paralela dos dados
    Promise.all([
        SaudecolabModel.find(filtro).lean(),
        Usuario.find().lean()
    ])
    .then(([saudecolabs, usuarios]) => {
        res.render(viewDestino, {
            saudecolabs: saudecolabs,
            usuarios: usuarios,
            flash,
            idUsu: usuarioAtual,
            podeVerLupa: String(podeVerLupa)  // Handlebars precisa de string
        });
    })
    .catch((err) => {
        console.error('💥 ERRO ao listar Saudecolabs:', err);
        req.flash("error_message", "Houve um erro ao listar os registros.");
        res.redirect('/admin/erro');
    });
},
    carregaSaudecolab(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        SaudecolabModel.find().then((saudecolab)=>{
            Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            console.log("Listagem Realizada! - PortalDoUsuario")
            res.render("ferramentas/saudecolab/saudecolabCad", {saudecolabs: saudecolab, usuarios: usuario, usuarioAtual})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Saudecolabs")
            res.redirect('admin/erro')
        })
    },
    
    carregaSaudecolabEdi(req,res){
        let usuarioAtual = req.cookies['idUsu'];
        SaudecolabModel.findById(req.params.id).then((saudecolab) =>{
            console.log(saudecolab)
                Estado.find().then((estado)=>{
                    Usuario.find({"usuario_status":"Ativo"}).then((usuario)=>{//Usuário 
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuario
            res.render('ferramentas/saudecolab/saudecolabEdi', {saudecolab, estados: estado, usuarios: usuario, usuarioAtual})
        })})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    
    cadastraSaudecolab(req,res){
        let resposta;
        let flash = new Resposta();
        let existe;
        let usuarioAtual = req.cookies['idUsu'];
        if ((""+usuarioAtual+"") == (""+req.body.saudecolabSaudecolabusuid+"")){
            SaudecolabModel.find({saudecolab_saudecolabusuid: req.body.saudecolabSaudecolabusuid}).then((resultado)=>{
                if (resultado.length == 0){
                    existe = "false";
                } else {
                    existe = "true";
                }
                if (existe == "true"){
                    flash.texto = "Já existe um registro para esse colaborador!";
                    flash.sucesso = "false";
                    this.listaSaudecolab(req,res, flash);
                } else {
                    let cadastro = saudecolabClass.saudecolabAdicionar(req,res);//variavel para armazenar a função que armazena o async
                
                    cadastro.then((result)=>{
                        resposta = true;
                    }).catch((err)=>{
                        resposta = err
                        console.log("ERRO:"+err)
                    }).finally(()=>{
                        if (resposta == true){
                            flash.texto = "Cadastro realizado com sucesso!";
                            flash.sucesso = "true";
                            this.listaSaudecolab(req,res, flash);
                        } else {
                            flash.texto = resposta;
                            flash.sucesso = "false";
                            this.listaSaudecolab(req,res, flash);
                        }
                    })
                }
            })
        }
    },
    
    atualizaSaudecolab(req,res){
        let resposta;
        try{
            saudecolabClass.saudecolabEditar(req,res).then((res)=>{
                console.log("Atualização Realizada! - PortalDoUsuario")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta){
                    //Volta para a saudecolab de listagem
                    console.log('verdadeiro')
                    this.listaSaudecolab(req,res)
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
    
    deletaSaudecolab(req,res){
        SaudecolabModel.deleteOne({_id: req.params.id}).then(() =>{
            SaudecolabModel.find().then((saudecolab) =>{
                req.flash("success_message", "Saudecolab deletada!")
                res.render('ferramentas/saudecolab/saudecolabLis', {saudecolabs: saudecolab})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Saudecolabs")
                res.render('admin/erro')
            })
        })
    }
}