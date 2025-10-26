//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');

//usupermiss
const usupermisClass = require("../models/usupermis")
var Usupermis = getModel("PortalDoUsuario", 'tb_usupermis', usupermisClass.UsupermisSchema)

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")
const usufuncClass = require("../models/usufunc")
const empresaClass = require("../models/empresa")

//Tabelas Extrangeiras
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
var Usufunc = getModel("PortalDoUsuario", 'tb_usufunc', usufuncClass.UsufuncSchema)
var Empresa = getModel("PortalDoUsuario", 'tb_empresa', empresaClass.EmpresaSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaUsupermis(req,res){
        console.log('listando usupermiss')
        Usupermis.find().then((usupermis) =>{
            Usuario.find().then((usuario) =>{
                     usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena Usuario por nome 
                Usufunc.find().then((usufunc) =>{
                    Empresa.find().then((empresa) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/usupermis/usupermisLis', {usupermiss: usupermis, empresas: empresa, usuarios: usuario, usufuncs: usufunc})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usupermiss")
            res.redirect('admin/erro')
        })

    },
    carregaUsupermis(req,res){
        Usupermis.find().then((usupermis) =>{
            Usuario.find().then((usuario) =>{
                     usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena Usuario por nome 
                Usufunc.find().then((usufunc) =>{
                    Empresa.find().then((empresa) =>{
            console.log("Listagem Realizada!")
            res.render("ferramentas/usupermis/usupermisCad", {usupermiss: usupermis, empresas: empresa, usuarios: usuario, usufuncs: usufunc})
        })})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Usupermiss")
            res.redirect('admin/erro')
        })

    },
    carregaUsupermisEdi(req,res){
        Usupermis.findById(req.params.id).then((usupermis) =>{
            Usuario.find().then((usuario) =>{
                usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena Usuario por nome 
                Usufunc.find().then((usufunc) =>{
                    Empresa.find().then((empresa) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/usupermis/usupermisEdi', {usupermiss: usupermis, empresas: empresa, usuarios: usuario, usufuncs: usufunc})
        })})})}).catch((err) =>{
            console.log(err);
            req.flash("error_message", "houve um erro ao Realizar as listas!");
            res.render('admin/erro');
        });
    },
    cadastraUsupermis(req,res){
        let resposta;
        let cadastro = usupermisClass.usupermisAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaUsupermis(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    atualizaUsupermis(req,res){
        let resposta;
        try{
            usupermisClass.usupermisEditar(req,res).then((res)=>{
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
                    //Volta para a usupermis de listagem
                    console.log('verdadeiro')
                    this.listaUsupermis(req,res)
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
    deletaUsupermis(req,res){
        Usupermis.deleteOne({_id: req.params.id}).then(() =>{
            Usupermis.find().then((usupermis) =>{
                req.flash("success_message", "Usupermis deletada!")
                res.render('ferramentas/usupermis/usupermisLis', {usupermiss: usupermis})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Usupermiss")
                res.render('admin/erro')
            })
        })
    },
    // NOVAS FUNÇÕES: GESTÃO EM MASSA
    // 1. Carregar tela de gestão em massa
    gestaoMassa(req, res){
        Usuario.find().then((usuario) => {
        usuario.sort((a,b) => (a.usuario_nome > b.usuario_nome) ? 1 : ((b.usuario_nome > a.usuario_nome) ? -1 : 0));//Ordena Usuario por nome 
            Empresa.find().then((empresas) => {
                Usufunc.find({ usufunc_status: 'Ativo' }).then((usufuncs) => {
                    res.render('ferramentas/usupermis/usupermisMassa', {
                        usuarios: usuario, empresas, usufuncs
                    });
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    },
    // 2. API: Listar permissões atuais de um usuário
    apiPermissoesUsuario(req, res){
        const { usuid, empid } = req.query;

        Usupermis.find({
            usupermis_usuid: usuid,
            usupermis_empresaid: empid
        }).then(permissoes => {
            const map = {};
            permissoes.forEach(p => {
                map[p.usupermis_codfunc.toString()] = p.usupermis_tipo;
            });
            res.json(map);
        }).catch(err => res.json({}));
    },
    // 3. Salvar todas as permissões de uma vez
    // 3. Salvar todas as permissões de uma vez (sem async/await)
    salvarEmMassa(req, res) {
        const { usupermis_usuid, usupermis_empresaid, permissoes } = req.body;
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];

        if (!usupermis_usuid || !usupermis_empresaid) {
            req.flash("error_message", "Usuário ou empresa não informados.");
            return res.redirect('/menu/ferramentas/usupermis/massa');
        }

        // Buscar todas as funcionalidades ativas
        Usufunc.find({ usufunc_status: 'Ativo' })
            .then(usufuncs => {
                const operacoes = [];

                usufuncs.forEach(func => {
                    const tipo = permissoes[func._id] || '1'; // Padrão: sem acesso

                    operacoes.push({
                        updateOne: {
                            filter: {
                                usupermis_usuid: usupermis_usuid,
                                usupermis_empresaid: usupermis_empresaid,
                                usupermis_codfunc: func._id
                            },
                            update: {
                                $set: {
                                    usupermis_tipo: tipo,
                                    usupermis_nomefunc: func.usufunc_nome,
                                    usupermis_codigofunc: func.usufunc_codigo,
                                    usupermis_usuidedi: usuarioAtual,
                                    usupermis_dataedi: dataAtual,
                                    usupermis_lixo: "false"
                                },
                                $setOnInsert: {
                                    usupermis_datacad: dataAtual,
                                    usupermis_usuidcad: usuarioAtual
                                }
                            },
                            upsert: true
                        }
                    });
                });

                // Executar todas as operações
                return Usupermis.bulkWrite(operacoes);
            })
            .then(() => {
                req.flash("success_message", "Permissões salvas com sucesso!");
                res.redirect('/menu/ferramentas/usuario/lis');
            })
            .catch(err => {
                console.error("Erro ao salvar em massa:", err);
                req.flash("error_message", "Erro ao salvar permissões.");
                res.redirect('/menu/ferramentas/usuario/lis');
            });
    },
    salvarEmMassauformOLD(req, res) {
        const { usupermis_usuid, usupermis_empresaid, permissoes } = req.body;
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];

        if (!usupermis_usuid || !usupermis_empresaid) {
            req.flash("error_message", "Usuário ou empresa não informados.");
            return res.redirect('/menu/ferramentas/usupermis/massa');
        }

        // Buscar todas as funcionalidades ativas
        Usufunc.find({ usufunc_status: 'Ativo' })
            .then(usufuncs => {
                const operacoes = [];

                usufuncs.forEach(func => {
                    const tipo = permissoes[func._id] || '1'; // Padrão: sem acesso

                    operacoes.push({
                        updateOne: {
                            filter: {
                                usupermis_usuid: usupermis_usuid,
                                usupermis_empresaid: usupermis_empresaid,
                                usupermis_codfunc: func._id
                            },
                            update: {
                                $set: {
                                    usupermis_tipo: tipo,
                                    usupermis_nomefunc: func.usufunc_nome,
                                    usupermis_codigofunc: func.usufunc_codigo,
                                    usupermis_usuidedi: usuarioAtual,
                                    usupermis_dataedi: dataAtual,
                                    usupermis_lixo: "false"
                                },
                                $setOnInsert: {
                                    usupermis_datacad: dataAtual,
                                    usupermis_usuidcad: usuarioAtual
                                }
                            },
                            upsert: true
                        }
                    });
                });

                // Executar todas as operações
                return Usupermis.bulkWrite(operacoes);
            })
            .then(() => {
                req.flash("success_message", "Permissões salvas com sucesso!");
                res.redirect('/menu/ferramentas/usuario/lis');
            })
            .catch(err => {
                console.error("Erro ao salvar em massa:", err);
                req.flash("error_message", "Erro ao salvar permissões.");
                res.redirect('/menu/ferramentas/usuario/lis');
            });
    },
    salvarEmMassauform(req, res) {
        const { usupermis_usuid, permissoes } = req.body;
        const dataAtual = new Date();
        const usuarioAtual = req.cookies['idUsu'];

        if (!usupermis_usuid) {
            req.flash("error_message", "ID do usuário não informado.");
            return res.redirect('/menu/ferramentas/usuario/lis');
        }

        // Valida se `permissoes` é um objeto
        if (!permissoes || typeof permissoes !== 'object') {
            req.flash("error_message", "Nenhuma permissão enviada.");
            return res.redirect('/menu/ferramentas/usuario/lis');
        }

        // Buscar todas as funcionalidades ativas (para validar IDs)
        return Usufunc.find({ usufunc_status: 'Ativo' })
            .then(usufuncs => {
                const funcIds = usufuncs.map(f => f._id.toString());
                const operacoes = [];

                // Percorre todas as funcionalidades ativas
                usufuncs.forEach(func => {
                    const funcId = func._id.toString();

                    // Verifica se há permissões para esta funcionalidade
                    if (permissoes[funcId] && typeof permissoes[funcId] === 'object') {
                        // Para cada empresa associada a esta funcionalidade
                        for (const empId in permissoes[funcId]) {
                            const tipo = permissoes[funcId][empId] || '1';

                            // Valida tipo (1 a 6)
                            if (!['1','2','3','4','5','6'].includes(tipo)) continue;

                            operacoes.push({
                                updateOne: {
                                    filter: {
                                        usupermis_usuid: new mongoose.Types.ObjectId(usupermis_usuid),
                                        usupermis_empresaid: new mongoose.Types.ObjectId(empId),
                                        usupermis_codfunc: new mongoose.Types.ObjectId(funcId)
                                    },
                                    update: {
                                        $set: {
                                            usupermis_tipo: tipo,
                                            usupermis_nomefunc: func.usufunc_nome,
                                            usupermis_codigofunc: func.usufunc_codigo,
                                            usupermis_usuidedi: new mongoose.Types.ObjectId(usuarioAtual),
                                            usupermis_dataedi: dataAtual,
                                            usupermis_lixo: "false"
                                        },
                                        $setOnInsert: {
                                            usupermis_datacad: dataAtual,
                                            usupermis_usuidcad: new mongoose.Types.ObjectId(usuarioAtual)
                                        }
                                    },
                                    upsert: true
                                }
                            });
                        }
                    }
                });

                // Executa todas as operações
                if (operacoes.length === 0) {
                    req.flash("warning_message", "Nenhuma permissão válida para salvar.");
                    return res.redirect(`/menu/ferramentas/usuario/edi/${usupermis_usuid}`);
                }

                return Usupermis.bulkWrite(operacoes);
            })
            .then(() => {
                req.flash("success_message", "Permissões salvas com sucesso!");
                res.redirect(`/menu/ferramentas/usuario/edi/${usupermis_usuid}`);
            })
            .catch(err => {
                console.error("Erro ao salvar permissões em massa:", err);
                req.flash("error_message", "Erro ao salvar permissões.");
                res.redirect(`/menu/ferramentas/usuario/edi/${usupermis_usuid}`);
            });
    },
    // 4. Carregar permissões do usuário por empresa (tela de edição)
    // functions/fncUsupermis.js
    // fncUsupermis.js
    carregaPermissoesPorUsuario(req, res) {
        const usuarioId = req.params.id; // ID do documento usupermis
        console.log('🔹 Iniciando carregaPermissoesPorUsuario com ID:', usuarioId);

        Usupermis.findById(usuarioId).then((usupermis) => {
            if (!usupermis) {
                console.log('❌ Usuário permissão não encontrado com ID:', usuarioId);
                req.flash("error_message", "Permissão do usuário não encontrada.");
                return res.redirect('/menu/ferramentas/usupermis/lis');
            }

            console.log('✅ Usuário permissão encontrado:', usupermis);

            return Promise.all([
                Usuario.find().sort({ usuario_nome: 1 }), // Ordenado por nome
                Usufunc.find(), // Todas funcionalidades
                Empresa.find() // Todas empresas
            ]).then(([usuarios, usufuncs, empresas]) => {
                console.log(`✅ Dados carregados: ${usuarios.length} usuários, ${usufuncs.length} funcionalidades, ${empresas.length} empresas`);

                // Enviar dados para a view
                res.render('ferramentas/usupermis/usupermisEdi', {
                    usupermis: usupermis, // Registro atual
                    usuarios: usuarios,
                    usufuncs: usufuncs,
                    empresas: empresas,
                    // Converter permissões para objeto acessível no template
                    permissoes: usupermis.usupermis_permissoes || {}
                });
            });
        })
        .catch((err) => {
            console.log('❌ Erro ao carregar permissões:', err);
            req.flash("error_message", "Houve um erro ao carregar os dados!");
            res.redirect('/menu/ferramentas/usupermis/lis');
        });
    }
}