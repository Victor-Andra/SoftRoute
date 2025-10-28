//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');



//usuarios
const usuarioClass = require("../models/usuario")
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const perfilClass = require("../models/perfil")
const funcaoClass = require("../models/funcao")
const especialidadeClass = require("../models/especialidade")
const especializacaoClass = require("../models/especializacao")
const empresaClass = require("../models/empresa")
const metodoClass = require("../models/metodo")
const metoutClass = require("../models/metout")
const usufuncClass =  require("../models/usufunc")//base das funcionalidades do sistema
const usupermisClass = require("../models/usupermis")//funcionalidades que o usuário tem permissã e qual tipo de permissão

//Tabelas extrangeiras   
const Empresa = getModel("PortalDoUsuario", 'tb_empresa', empresaClass.EmpresaSchema)
const Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
const Perfil = getModel("PortalDoUsuario", 'tb_perfil', perfilClass.PerfilSchema)
const Funcao = getModel("PortalDoUsuario", 'tb_funcao', funcaoClass.FuncaoSchema)
const Especialidade = getModel("PortalDoUsuario", 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
const Especializacao = getModel("PortalDoUsuario", 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
const Metodo = getModel("SoftRoute", 'tb_metodo', metodoClass.MetodoSchema)
const Metout = getModel("SoftRoute", 'tb_metout', metoutClass.MetoutSchema)
const Usufunc = getModel("PortalDoUsuario", 'tb_usufunc', usufuncClass.UsufuncSchema)
const Usupermis = getModel("PortalDoUsuario", 'tb_usupermis', usupermisClass.UsupermisSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaUsuario(req,res){
        let db = req.cookies['preferredDb'];

        Perfil = getModel(db, 'tb_perfil', perfilClass.PerfilSchema)
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Metodo = getModel(db, 'tb_metodo', metodoClass.MetodoSchema)
        Metout = getModel(db, 'tb_metout', metoutClass.MetoutSchema)

        Usuario.find().then((usuario) =>{
            usuario.sort((a,b) => ((a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o usuário por nome completo
            Perfil.find().then((perfil)=>{
                Funcao.find().then((funcao) =>{
                    Especialidade.find().then((especialidade)=>{  //Graduação
                        especialidade.sort((a,b) => ((a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena as especialidades
                        Especializacao.find().then((especializacao)=>{ //Especialização
                            especializacao.sort((a,b) => ((a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena Especização
                            Metodo.find().then((metodo)=>{ //Métodos
                                metodo.sort((a,b) => ((a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Métodos
                                Metout.find().then((metout)=>{ //Métodos
                                    metout.sort((a,b) => ((a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Outros Métodos
                                    res.render('ferramentas/usuario/usuarioLis', {usuarios: usuario, funcaos: funcao, perfis:perfil})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usuarios")
            res.redirect('admin/erro')
        })

    },
    /*
    carregaUsuario(req,res){
        let db = req.cookies['preferredDb'];
        Perfil = getModel(db, 'tb_perfil', perfilClass.PerfilSchema)
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Metodo = getModel(db, 'tb_metodo', metodoClass.MetodoSchema)
        Metout = getModel(db, 'tb_metout', metoutClass.MetoutSchema)

        Usuario.find().then((usuario) =>{
            Estado.find().then((estado)=>{
                Perfil.find().then((perfil)=>{
                    Funcao.find().then((funcao)=>{
                        Especialidade.find().then((especialidade)=>{  //Graduação
                            especialidade.sort((a,b) => ((a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena as graduações
                            Especializacao.find().then((especializacao)=>{ //Especialização
                                especializacao.sort((a,b) => ((a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena Especização
                                Metodo.find().then((metodo)=>{ //Métodos
                                    metodo.sort((a,b) => ((a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Métodos
                                    Metout.find().then((metout)=>{ //Métodos
                                        metout.sort((a,b) => ((a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Outros Métodos
                                        Usufunc.find().then((usufunc)=>{
                                            Usupermis.find().then((usupermis)=>{
                                                res.render("ferramentas/usuario/usuarioCad", {usuarios: usuario, usupermiss:usupermis, usufuncs: usufunc, estados: estado, perfils: perfil, especialidades: especialidade, especializacaos: especializacao, metodos: metodo, metouts: metout, funcaos: funcao})
        })})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usuarios")
            res.redirect('admin/erro')
        })
    },
    */
    async carregaUsuario(req,res){
        let db = req.cookies['preferredDb'];

        try {
            const [
                usuarios, estados, perfils, funcaos, especialidades, especializacaos, metodos, metouts, usufuncs, usupermis
            ] = await Promise.all([
                Usuario.find(), // já tava aí antes
                Estado.find(),
                Perfil.find(),
                Funcao.find(),
                Especialidade.find().collation({ locale: "pt", strength: 1 }).sort({ especialidade_nome: 1 }),
                Especializacao.find().collation({ locale: "pt", strength: 1 }).sort({ especializacao_nome: 1 }),
                Metodo.find().collation({ locale: "pt", strength: 1 }).sort({ metodo_ordem: 1 }),
                Metout.find().collation({ locale: "pt", strength: 1 }).sort({ metout_ordem: 1 }),
                Usufunc.find(),
                Usupermis.find()
            ]);

            especialidades.sort((a,b) => ((a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena as graduações
            especializacaos.sort((a,b) => ((a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena Especização
            metodos.sort((a,b) => ((a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Métodos
            metouts.sort((a,b) => ((a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Outros Métodos
            
            res.render("ferramentas/usuario/usuarioCad", {
                usuarios,
                estados,
                perfils,
                funcaos,
                especialidades,
                especializacaos,
                metodos,
                metouts,
                usufuncs,
                usupermis
            });
        } catch (err) {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar os dados do usuário");
            res.redirect("/admin/erro");
        }
    },
    carregaUsuarioEdiOLD(req,res){
        let db = req.cookies['preferredDb'];
        Empresa = getModel("PortalDoUsuario", 'tb_empresa', empresaClass.EmpresaSchema)
        
        Perfil = getModel(db, 'tb_perfil', perfilClass.PerfilSchema)
        Funcao = getModel(db, 'tb_funcao', funcaoClass.FuncaoSchema)
        Especialidade = getModel(db, 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
        Especializacao = getModel(db, 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
        Metodo = getModel(db, 'tb_metodo', metodoClass.MetodoSchema)
        Metout = getModel(db, 'tb_metout', metoutClass.MetoutSchema)

        let base64Image;
        Usuario.findById(req.params.id).then((usuario) =>{
            Estado.find().then((estado)=>{
                Perfil.find().then((perfil)=>{
                    Funcao.find().then((funcao)=>{
                        Especialidade.find().then((especialidade)=>{//Graduação
                            especialidade.sort((a,b) => ((a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especialidade_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena agraduação
                            Especializacao.find().then((especializacao)=>{
                                especializacao.sort((a,b) => ((a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.especializacao_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena Especização
                                Metodo.find().then((metodo)=>{
                                    if (usuario.usuario_carimbo != 'undefined' && usuario.usuario_carimbo != undefined){
                                        base64Image = new Buffer.from(usuario.usuario_carimbo, 'binary').toString('base64');
                                    }
                                    metodo.sort((a,b) => ((a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metodo_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Métodos
                                    Metout.find().then((metout)=>{ //Métodos
                                        metout.sort((a,b) => ((a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.metout_ordem.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena os Outros Métodos
                                        Empresa.find().then((empresa)=>{
                                            Usufunc.find().then((usufunc)=>{
                                                Usupermis.find({ usupermis_usuid: new mongoose.Types.ObjectId(req.params.id) }).then((usupermis)=>{
                                            res.render('ferramentas/usuario/usuarioEdi', {usuario, usupermiss:usupermis, usufuncs: usufunc, estados: estado, perfils: perfil, especialidades: especialidade, especializacaos: especializacao, metodos: metodo, metouts: metout, funcaos: funcao, empresas: empresa, base64Image})
        })})})})})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },
    carregaUsuarioEdi(req, res) {
        const usuarioId = req.params.id;

        // Modelos do PortalDoUsuario
        const Metodo = getModel("PortalDoUsuario", 'tb_metodo', metodoClass.MetodoSchema);
        const Metout = getModel("PortalDoUsuario", 'tb_metout', metoutClass.MetoutSchema);

        let base64Image;

        Usuario.findById(usuarioId)
            .then(usuario => {
                if (!usuario) {
                    req.flash("error_message", "Usuário não encontrado.");
                    return res.redirect('/menu/ferramentas/usuario/lis');
                }

                if (usuario.usuario_carimbo) {
                    base64Image = Buffer.from(usuario.usuario_carimbo).toString('base64');
                }

                return Promise.all([
                    Estado.find(),
                    Perfil.find(),
                    Funcao.find(),
                    Especialidade.find().sort({ especialidade_nome: 1 }),
                    Especializacao.find().sort({ especializacao_nome: 1 }),
                    Metodo.find().sort({ metodo_ordem: 1 }),
                    Metout.find().sort({ metout_ordem: 1 }),
                    Empresa.find(),
                    Usufunc.find({ usufunc_status: 'Ativo' }),
                    Usupermis.find({ usupermis_usuid: new mongoose.Types.ObjectId(usuarioId) })
                ]).then(([estados, perfils, funcaos, especialidades, especializacaos, metodos, metouts, empresas, usufuncs, usupermis]) => {

                    // --- 1. Criar mapa de permissões: funcId → empresaId → tipo ---
                    const mapaPermissoes = {};
                    usupermis.forEach(p => {
                        const funcId = p.usupermis_codfunc.toString();
                        const empId = p.usupermis_empresaid ? p.usupermis_empresaid.toString() : null;
                        if (empId) {
                            if (!mapaPermissoes[funcId]) mapaPermissoes[funcId] = {};
                            mapaPermissoes[funcId][empId] = p.usupermis_tipo;
                        }
                    });

                    // --- 2. Permissões Habilitadas (≥2) → Tabela da Esquerda ---
                    const permissoesHabilitadas = [];
                    empresas.forEach(empresa => {
                        const funcsDaEmpresa = []; 
                        usufuncs.forEach(func => {
                            const tipo = mapaPermissoes[func._id.toString()]?.[empresa._id.toString()];
                            if (tipo && parseInt(tipo) >= 2) {
                                funcsDaEmpresa.push({
                                    func_id: func._id.toString(),
                                    func_codigo: func.usufunc_codigo,
                                    usufunc_nome: func.usufunc_nome,
                                    usupermis_tipo: tipo,
                                    empresa_id: empresa._id.toString() // ← ADICIONE ESTA LINHA
                                });
                            }
                        });
                        if (funcsDaEmpresa.length > 0) {
                            permissoesHabilitadas.push({
                                empresa_nome: empresa.empresa_nome,
                                empresa_id: empresa._id.toString(), // ← e esta aqui
                                funcionalidades: funcsDaEmpresa
                            });
                        }
                    });

                    // --- 3. Permissões para Habilitar (=1 ou ausentes) → Tabela da Direita ---
                    const permissoesParaHabilitar = [];
                    empresas.forEach(empresa => {
                        const funcsDaEmpresa = [];

                        usufuncs.forEach(func => {
                            const tipo = mapaPermissoes[func._id.toString()]?.[empresa._id.toString()] || "1";
                            if (parseInt(tipo) === 1) {
                                funcsDaEmpresa.push({
                                    func_id: func._id.toString(),
                                    func_codigo: func.usufunc_codigo,
                                    func_nome: func.usufunc_nome,
                                    empresa_id: empresa._id.toString(),
                                    empresa_nome: empresa.empresa_nome,
                                    tipo_atual: tipo
                                });
                            }
                        });

                        if (funcsDaEmpresa.length > 0) {
                            permissoesParaHabilitar.push({
                                empresa_nome: empresa.empresa_nome,
                                funcionalidades: funcsDaEmpresa
                            });
                        }
                    });

                    // Renderiza a view com todos os dados
                    res.render('ferramentas/usuario/usuarioEdi', {
                        usuario,
                        estados,
                        perfils,
                        funcaos,
                        especialidades,
                        especializacaos,
                        metodos,
                        metouts,
                        empresas,
                        usufuncs,
                        permissoesHabilitadas,
                        permissoesParaHabilitar,
                        base64Image
                    });
                });
            })
            .catch(err => {
                console.error("Erro ao carregar edição de usuário:", err);
                req.flash("error_message", "Erro ao carregar dados do usuário.");
                res.redirect('/menu/ferramentas/usuario/lis');
            });
    },
    cadastraUsuario(req,res){
        let cadastro = usuarioClass.usuarioAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            this.listaUsuario(req,res)
        } else {
            res.render('admin/erro')
        }
    },
    atualizaUsuario(req,res){
        let resposta;
        try{
            usuarioClass.usuarioEditar(req,res).then((res)=>{
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
                    //Volta para a usuario de listagem
                    this.listaUsuario(req,res);
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
    deletaUsuario(req, res){
        Usuario.deleteOne({_id: req.params.id}).then(() =>{
            Usuario.find().then((usuario) =>{
                req.flash("success_message", "Usuario deletada!")
                res.render('ferramentas/usuario/usuarioLis', {usuarios: usuario})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Usuarios")
                res.render('admin/erro')
            })
        })
    },
    carregaMudarsenha(req,res){
        Usuario.find().then((usuario)=>{
             res.render("ferramentas/usuario/mudarSenha", {usuarios: usuario})
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o mudar senha")
             res.redirect('admin/erro')
         })  
    },
    carregaEsqueciMinhasenha(req,res){
         Usuario.find().then((usuario)=>{
                 usuario.sort((a,b) => ((a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena  por nome
              res.render("ferramentas/usuario/esqueciMinhaSenha", {usuarios: usuario})
         }).catch((err) =>{
              console.log(err)
              req.flash("error_message", "houve um erro ao acessar o mudar senha")
              res.redirect('admin/erro')
         })  
    },
    definirSenha(req,res){
         let flash = new Resposta();
         let resposta = false;
         usuarioClass.usuarioDefinirSenha(req,res).then((retorno)=>{
             if (retorno == "true"){
                 resposta = true;
             } else {
                 resposta = retorno;
             }
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o Alterar Senha")
             res.redirect('admin/erro')
         }).finally(()=>{
             if(resposta== true){
                 //Volta para a agenda de listagem
                 flash.texto = "Senha alterada com sucesso!";
                 flash.sucesso = "true";
                 //console.log('verdadeiro')
                 res.render('admin/branco', {flash});
             }else{
                 //passar classe de erro
                 flash.texto = "Erro ao alterar senha! "+resposta;
                 flash.sucesso = "false";
                 res.render('admin/branco', {flash});
             }
         })
    },
    mudarSenha(req,res){
         let flash = new Resposta();
         let resposta = false;
         usuarioClass.usuarioMudarSenha(req,res).then((ok)=>{
             if (ok == "true"){
                 resposta = true;
             }
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o Alterar Senha")
             res.redirect('admin/erro')
         }).finally(()=>{
             if(resposta== true){
                 //Volta para a agenda de listagem
                 flash.texto = "Senha alterada com sucesso!"
                 flash.sucesso = "true"
                 //console.log('verdadeiro')
                 res.clearCookie('lvlUsu', { path: '/' })
                 res.clearCookie('idUsu', { path: '/' })
                 res.render('admin/branco', {flash});
             }else{
                 //passar classe de erro
                 flash.texto = "Erro ao alterar senha!"
                 flash.sucesso = "false"
                 res.render('admin/branco', {flash});
             }
         })
    },
    carregaResetarchave(req,res){
         Usuario.find().then((usuario)=>{
             usuario.sort((a,b) => ((a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome .normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena  por nome
             res.render("ferramentas/usuario/resetarChave", {usuarios: usuario})
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o resetar chave")
             res.redirect('admin/erro')
         })
    },
    resetarChave(req,res){
         let flash = new Resposta();
         let resposta = false;
         usuarioClass.usuarioDeletarPalavraChave(req,res).then((ok)=>{
             if (ok == "true"){
                 resposta = true;
             }
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o remover chave")
             res.redirect('admin/erro')
         }).finally(()=>{
             if(resposta== true){
                 //Volta para a agenda de listagem
                 flash.texto = "Chave removida com sucesso!"
                 flash.sucesso = "true"
                 //console.log('verdadeiro')
                 res.render('admin/branco', {flash});
             }else{
                 //passar classe de erro
                 flash.texto = "Chave removida com sucesso!";
                 flash.sucesso = "false"
                 res.render('admin/branco', {flash});
                 //CORRIGIR ERRO BIZONHO QUE TA RETORNANDO FALSE MEMSMO TENDO SALVO. MENSAGEM ERRADA!!!!!!!!!
                 /*
                 ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                 ooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooh
                 */
             }
         })
    },
    carregaCadastrarchave(req,res){
         Usuario.find().then((usuario)=>{
             usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome//Ordena o Usuário por nome 
             res.render("ferramentas/usuario/cadastrarChave", {usuarios: usuario})
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o Cadastrar chave")
             res.redirect('admin/erro')
         })
    },
    cadastrarchave(req,res){
         let flash = new Resposta();
         let resposta = false;
         usuarioClass.usuarioCadastrarPalavraChave(req,res).then((ok)=>{
             if (ok == "true"){
                 resposta = true;
             }
         }).catch((err) =>{
             console.log(err)
             req.flash("error_message", "houve um erro ao acessar o Cadastrar chave")
             res.redirect('admin/erro')
         }).finally(()=>{
             if(resposta== true){
                 //Volta para a agenda de listagem
                 flash.texto = "Palavra Chave cadastrada com sucesso!"
                 flash.sucesso = "true"
                 //console.log('verdadeiro')
                 res.render('admin/branco', {flash});
             }else{
                 //passar classe de erro
                 flash.texto = "Erro ao cadastrar chave!"
                 flash.sucesso = "false"
                 res.render('admin/branco', {flash});
             }
         })
    },
    getNivelUsuario(req,res){
        let usuPerfil;
        let lvl;
        Usuario.findOne({usuario_email: req.body.email, usuario_senha: req.body.senha}).then((usu)=>{
            usuPerfil = usu.usuario_perfilid
            switch (usuPerfil){
                case "62421801a12aa557219a0fb9":
                    lvl = 0;
                    break;
                case "62421857a12aa557219a0fc1":
                    lvl = 1;
                    break;
                case "624218f5a12aa557219a0fd0":
                    lvl = 2;
                    break;
                case "62421903a12aa557219a0fd3":
                    lvl = 3;
                    break;
                case "6242190fa12aa557219a0fd6":
                    lvl = 4;
                    break;
                //case "6242191fa12aa557219a0fd9":
                //    break;
            }
            console.log("LVL: "+lvl)

            return lvl;
        }).catch((err) =>{
            console.log(err)
        })
    },
    carregaMudarNomeTerapeuta(req,res){
        Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
            usuario.sort((a,b) => ((a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
            res.render('ferramentas/usuario/mudarNomeTerapeuta', {usuarios: usuario})
        })
    },
    mudarNomeTerapeuta(req,res){
        let flash = new Resposta();
        usuarioClass.mudarNome(req,res).then((res)=>{
            console.log("res")
        });
        let resultado = "true"
        console.log("resultado:"+resultado)
        if (resultado == "true"){
            flash.texto = "Nome alterado com sucesso";
            flash.sucesso = "true";
            Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
                Usuario.find({usuario_funcaoid:"6241030bfbcc51f47c720a0b"}).then((usuario)=>{
                    usuario.sort((a,b) => ((a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nomecompleto.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                    res.render('ferramentas/usuario/mudarNomeTerapeuta', {usuarios: usuario, flash})
            })})
        } else {
            console.log(resultado)
            flash.texto = resultado;
            flash.sucesso = "false";
            req.flash("error_message", "Houve um erro ao mudar o nome")
            res.render('admin/erro', {flash})
        }
    },
    relaniverUsu(req, res){
        let monthsUsu = {};
    
        console.log('Listando Resp');
    
        Usuario.find({usuario_status:"Ativo"}).then((usuario) => {
            usuario.forEach((b) => {
                let datanasc = new Date(b.usuario_datanasc);
                let mes = (datanasc.getUTCMonth() + 1).toString(); // Usar getUTCMonth
                let dia = (datanasc.getUTCDate()).toString(); // Usar getUTCDate
    
                if (mes.length === 1) {
                    mes = "0" + mes;
                }
    
                if (dia.length === 1) {
                    dia = "0" + dia;
                }
    
                b.mesNascimento = mes;
                b.diaNascimento = dia;
    
                // Cria a estrutura do objeto se o mês ainda não existe
                if (!monthsUsu[mes]) {
                    monthsUsu[mes] = [];
                }
    
                monthsUsu[mes].push(b);
            });
    
            // Ordena os meses em ordem crescente
            const sortedMonths = Object.keys(monthsUsu).sort();
    
            // Ordena os dias dentro de cada mês
            for (let month of sortedMonths) {
                monthsUsu[month].sort((a, b) => {
                    return a.diaNascimento.localeCompare(b.diaNascimento);
                });
            }
    
            // Cria uma lista ordenada dos meses
            const orderedMonths = sortedMonths.map(month => ({
                month: month,
                children: monthsUsu[month]
            }));
    
            res.render('area/relaniverUsu', { orderedMonths });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar Usuarios");
            res.redirect('admin/erro');
        });
    },
    relaniverdiaUsu(req, res) {
        const hoje = new Date(); // Data atual
        const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0'); // Mês atual (formatado com zero à esquerda)
        const diaAtual = String(hoje.getUTCDate()).padStart(2, '0'); // Dia atual (formatado com zero à esquerda)
    
        console.log('Listando Aniversariantes do Dia');
    
        Usuario.find({ usuario_status: "Ativo" }).then((usuarios) => {
            // Adiciona diaNascimento e mesNascimento a cada usuário
            usuarios.forEach((usuario) => {
                const datanasc = new Date(usuario.usuario_datanasc);
                usuario.mesNascimento = String(datanasc.getUTCMonth() + 1).padStart(2, '0'); // Mês com zero à esquerda
                usuario.diaNascimento = String(datanasc.getUTCDate()).padStart(2, '0'); // Dia com zero à esquerda
            });
        
            // Filtra os usuários cujo dia e mês de nascimento correspondem ao dia atual
            const aniversariantesDoDia = usuarios.filter((usuario) => {
                return usuario.mesNascimento === mesAtual && usuario.diaNascimento === diaAtual;
            });
        
            // Renderiza a página em branco com os aniversariantes do dia
            res.render('area/relaniverdiaUsu', { 
                nivel: lvl,
                aniversariantesDoDia: aniversariantesDoDia 
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar os aniversariantes do dia");
            res.redirect('admin/erro');
        });
    },
    carregaCarimboLis(req,res){
        let base64Image;
        Usuario.findOne({_id: req.params.id}).then((usuario) =>{
            if (usuario.usuario_carimbo != 'undefined' && usuario.usuario_carimbo != undefined){
                base64Image = new Buffer.from(usuario.usuario_carimbo, 'binary').toString('base64');
            }
            //console.log(base64Image);
            res.render("ferramentas/usuario/cadastrarCarimbo", {usuario, base64Image})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Cadastrar Carimbo")
            res.redirect('admin/erro')
        })
    },
    cadastrarCarimbo(req,res){
        let flash = new Resposta();
        let resposta = false;
        usuarioClass.usuarioCadastrarCarimbo(req,res).then((ok)=>{
            if (ok == "true"){
                resposta = true;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Cadastrar o Carimbo e Assinatura")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Carimbo cadastrado com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Erro ao cadastrar carimbo!"
                flash.sucesso = "false"
                res.render('admin/branco', {flash});
            }
        })
    },
    // fncUsuario.js

    // Função auxiliar: gera os dias da semana atual no formato { dia: '05', mes: '04' }
    getDiasDaSemana() {
        const hoje = new Date();
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - hoje.getDay()); // domingo da semana atual

        const dias = [];
        for (let i = 0; i < 7; i++) {
            const data = new Date(domingo);
            data.setDate(domingo.getDate() + i);
            const dia = String(data.getUTCDate()).padStart(2, '0');
            const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
            dias.push({ dia, mes });
        }
        return dias;
    },

    // Função auxiliar interna (não exportada diretamente, mas usada pelos métodos)
    getDiasDaSemana() {
        const hoje = new Date();
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - hoje.getDay());

        const dias = [];
        for (let i = 0; i < 7; i++) {
            const data = new Date(domingo);
            data.setDate(domingo.getDate() + i);
            const dia = String(data.getUTCDate()).padStart(2, '0');
            const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
            dias.push({ dia, mes });
        }
        return dias;
    },

    // Método público: filtra aniversariantes da semana (pode ser chamado de fora)
    filtrarAniversariantesDaSemana(lista, tipo) {
        const semanaDias = this.getDiasDaSemana(); // usa 'this' porque está dentro do objeto

        return lista
            .map(p => {
                const campoData = tipo === 'usuario' ? p.usuario_datanasc : p.bene_datanasc;
                if (!campoData) return null;

                const dataNasc = new Date(campoData);
                const dia = String(dataNasc.getUTCDate()).padStart(2, '0');
                const mes = String(dataNasc.getUTCMonth() + 1).padStart(2, '0');

                return {
                    ...p,
                    diaNascimento: dia,
                    mesNascimento: mes,
                    nome: tipo === 'usuario' ? p.usuario_nome : p.bene_nome
                };
            })
            .filter(p => p !== null)
            .filter(p =>
                semanaDias.some(s => s.dia === p.diaNascimento && s.mes === p.mesNascimento)
            )
            .sort((a, b) => {
                if (a.mesNascimento !== b.mesNascimento) return a.mesNascimento - b.mesNascimento;
                return a.diaNascimento - b.diaNascimento;
            });
    }
}; // <-- Este fecha o module.exports
