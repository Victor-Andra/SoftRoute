//Configurações dos Textos pardrões para Evoluções dos Supervisores (Funções)
//Criado em: 2025-09-26 Wagner Cintra
//Editado em:

//Exports
const mongoose = require("mongoose")
const { getModel } = require('./fncGeral');
//As classe tem que ser declaradas antes das tabelas
//Classe
const evolucaoconfClass = require("../models/evolucaoconf")

//Classes Extrangeiras
const usuarioClass = require("../models/usuario")

//Tabelas
//evolucaoconfs
var Evolucaoconf = getModel("SoftRoute", 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

//Tabelas Extrangeiras
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaEvolucaoconfOLD(req,res){
        let db = req.cookies['preferredDb'];
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

        console.log('listando evolucaoconfs')
        Usuario.find({"usuario_status":{$in: ["Ativo","Inativo"]} , $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{
        Evolucaoconf.find({ evolucaoconf_lixo: "false" }) // Filtra pelo campo
        .sort({ evolucaoconf: 1 }) // Ordena por evolucaoconf crescente (opcional)
        .then((evolucaoconf) => {
            evolucaoconf.forEach((b)=>{
            dataedi = new Date(b.evolucaoconf_dataedi)
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
            })
            console.log("Listagem Realizada!")
            res.render('area/evolucaoconf/evolucaoconfLis', {evolucaoconfs: evolucaoconf, usuarios: usuario})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Evolucaoconfs")
            res.redirect('admin/erro')
        })

    },

    listaEvolucaoconf(req, res) {
        let db = req.cookies['preferredDb'];
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema);
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema); // Certifique-se do DB correto

        // Função auxiliar para formatar data
        const formatDate = (date) => {
            if (!date) return null;
            const d = new Date(date);
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            return `${day}/${month}/${year}`;
        };

        Evolucaoconf.find({
                            $or: [
                                { evolucaoconf_lixo: "false" },
                                { evolucaoconf_lixo: { $exists: false } },
                                { evolucaoconf_lixo: null }
                            ]
                            })
            .sort({ evolucaoconf_categoria: 1 })
            .then(async (evolucaoconfs) => {
                // Para cada evolucaoconf, buscar os nomes dos usuários
                const evolucaoconfsComNomes = await Promise.all(
                    evolucaoconfs.map(async (item) => {
                        let usuarioCadNome = "Não informado";
                        let usuarioEdiNome = "Não informado";

                        // Buscar usuário que cadastrou
                        if (item.evolucaoconf_usuidcad) {
                            const userCad = await Usuario.findById(item.evolucaoconf_usuidcad).exec();
                            if (userCad) {
                                usuarioCadNome = userCad.usuario_nome || userCad.usuario_login || "Usuário";
                            }
                        }

                        // Buscar usuário que editou
                        if (item.evolucaoconf_usuidedi) {
                            const userEdi = await Usuario.findById(item.evolucaoconf_usuidedi).exec();
                            if (userEdi) {
                                usuarioEdiNome = userEdi.usuario_nome || userEdi.usuario_login || "Usuário";
                            }
                        }

                        // Formatar datas
                        const datacad = item.evolucaoconf_datacad ? formatDate(item.evolucaoconf_datacad) : null;
                        const dataedi = item.evolucaoconf_dataedi ? formatDate(item.evolucaoconf_dataedi) : null;

                        // Retornar cópia do item com os novos campos
                        return {
                            ...item.toObject(), // Converte o documento Mongoose em objeto JS puro
                            usuarioCadNome,
                            usuarioEdiNome,
                            datacad,
                            dataedi
                        };
                    })
                );

                console.log("Listagem Realizada!");
                res.render('area/evolucaoconf/evolucaoconfLis', {
                    evolucaoconfs: evolucaoconfsComNomes,
                    // Remova 'usuarios' se não for usado na view
                });
            })
            .catch((err) => {
                console.log(err);
                req.flash("error_message", "Houve um erro ao listar Evolucaoconfs");
                res.redirect('admin/erro');
            });
    },

    carregaEvolucaoconf(req,res){
        let db = req.cookies['preferredDb'];
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)

        Evolucaoconf.find().then((evolucaoconf)=>{
            console.log("Listagem Realizada de Evolucaoconfs de Uso!")
            res.render("area/evolucaoconf/evolucaoconfCad", {evolucaoconfs: evolucaoconf})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Evolucaoconfs")
            res.redirect('admin/erro')
        })

    },


    carregaEvolucaoconfEdi(req, res) {
        let db = req.cookies['preferredDb'];
        Evolucaoconf = getModel(db, 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema);

        Evolucaoconf.findById(req.params.id).then((evolucaoconf) => {
            if (!evolucaoconf) {
                req.flash("error_message", "Registro não encontrado!");
                return res.redirect('/menu/area/evolucaoconf'); // ou página de erro
            }
            console.log("ID: " + evolucaoconf._id);
            console.log(evolucaoconf);
            res.render('area/evolucaoconf/evolucaoconfEdi', { evolucaoconf: evolucaoconf });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao carregar o registro!");
            res.render('admin/erro');
        });
    },

    cadastraEvolucaoconfOLD(req,res){
        let resposta
        let cadastro = evolucaoconfClass.evolucaoconfAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaEvolucaoconf(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },

    async cadastraEvolucaoconf(req, res) {
        try {
            const resultado = await evolucaoconfClass.evolucaoconfAdicionar(req, res);
            if (resultado === true) {
                req.flash("success_message", "Cadastro realizado com sucesso!");
            }
            this.listaEvolucaoconf(req, res);
        } catch (err) {
            console.log("ERRO no cadastro:", err);
            req.flash("error_message", "Houve um erro ao realizar o cadastro!");
            res.render('admin/erro');
        }
    },

    atualizaEvolucaoconf(req,res){
        let resposta;
        try{
            evolucaoconfClass.evolucaoconfEditar(req,res).then((res)=>{
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
                    //Volta para a evolucaoconf de listagem
                    console.log('verdadeiro')
                    this.listaEvolucaoconf(req,res)
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

    deletaEvolucaoconf: async (evolucaoconfId, req, res) => {
        console.log("ID recebido na função deletaEvolucaoconf:", evolucaoconfId);
        try {
            // Passa apenas os dados necessários, NÃO o req inteiro
            const db = req.cookies['preferredDb'];
            const usuarioAtual = req.cookies['idUsu'];
            const resultado = await evolucaoconfClass.evolucaoconfDeletar(evolucaoconfId, db, usuarioAtual);
            console.log("Resultado da deleção:", resultado);
            return resultado;
        } catch (err) {
            console.error("Erro em deletaEvolucaoconf:", err);
            throw err;
        }
    }
   
}