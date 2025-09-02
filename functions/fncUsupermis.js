//Exports
const mongoose = require("mongoose")

//usupermiss
const usupermisClass = require("../models/usupermis")
const Usupermis = mongoose.model("tb_usupermis")

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")
const usufuncClass = require("../models/usufunc")
const empresaClass = require("../models/empresa")

//Tabelas Extrangeiras
const Estado = mongoose.model("tb_estado")
const Usuario = mongoose.model("tb_usuario")
const Usufunc = mongoose.model("tb_usufunc")
const Empresa = mongoose.model("tb_empresa")

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
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraUsupermis(req,res){
        let resposta
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
                res.redirect('/menu/ferramentas/usupermis/massa');
            })
            .catch(err => {
                console.error("Erro ao salvar em massa:", err);
                req.flash("error_message", "Erro ao salvar permissões.");
                res.redirect('/menu/ferramentas/usupermis/massa');
            });
    },
    // 4. Carregar permissões do usuário por empresa (tela de edição)
  // functions/fncUsupermis.js

// fncUsupermis.js
carregaPermissoesPorUsuario(req, res) {
    const usuarioId = req.params.id; // ID do documento usupermis
    console.log('🔹 Iniciando carregaPermissoesPorUsuario com ID:', usuarioId);

    Usupermis.findById(usuarioId)
        .then((usupermis) => {
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