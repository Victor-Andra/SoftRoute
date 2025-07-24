// Exports
const mongoose = require("mongoose");

// Modelos Mongoose
const Terapia = mongoose.model("tb_terapia");
const Usuario = mongoose.model("tb_usuario");

// Classes e funções customizadas
const terapiaClass = require("../models/terapia");
const usuarioClass = require("../models/usuario");
const fncGeral = require("./fncGeral");


module.exports = {
   listaTerapia(req, res) {
        console.log('listando terapias');

        function formatDateToBR(date) {
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');

            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        Terapia.find({ terapia_status: "Ativo" }).then(async (terapiaList) => {
            if (!terapiaList.length) {
                return res.render("ferramentas/terapia/terapiaLis", { terapias: [] });
            }

            try {
                // Carregar todos os usuários para mapeamento
                const usuarioList = await Usuario.find();

                // Mapear usuários para acesso rápido
                const usuarioMap = usuarioList.reduce((acc, u) => {
                    acc[u._id.toString()] = u;
                    return acc;
                }, {});

                // Processar cada terapia
                for (const terapia of terapiaList) {
                    // Formatação das datas
                    terapia.datacad = terapia.terapia_datacad ? formatDateToBR(terapia.terapia_datacad) : "--/--/---- h--:--";
                    terapia.dataedi = terapia.terapia_dataedi ? formatDateToBR(terapia.terapia_dataedi) : "--/--/---- h--:--";

                    // Nome dos usuários
                    const usuarioCad = usuarioMap[terapia.terapia_usuidcad?.toString()];
                    const usuarioEdi = usuarioMap[terapia.terapia_usuidedi?.toString()];

                    terapia.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "--";
                    terapia.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "--";
                }

                // Renderiza a view com os dados formatados
                res.render("ferramentas/terapia/terapiaLis", {
                    terapias: terapiaList
                });

            } catch (err) {
                console.error("Erro ao carregar usuários:", err.message);
                req.flash("error_message", "Houve um erro ao carregar dados adicionais");
                res.redirect("/admin/erro");
            }

        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar Terapias");
            res.redirect("/admin/erro");
        });
    },


    carregaTerapiaEdi(req,res){
        Terapia.findById(req.params.id).then((terapia) =>{
            console.log(terapia)
            res.render('ferramentas/terapia/terapiaEdi', {terapia})
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },

   carregaTerapia(req, res) {
        try {
            res.render("ferramentas/terapia/terapiaCad");
        } catch (err) {
            console.error(err);
            res.render("admin/erro");
        }
    },

    cadastraTerapia(req,res){
        let cadastro = terapiaClass.terapiaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        if(cadastro){
            console.log('verdadeiro')
            res.render('ferramentas/terapia/terapiaCad');
        } else {
            console.log('falso')
            res.flash()
            res.render('admin/erro');
        }

    },

    editarTerapia(req,res){
        let resposta;
        try{
            terapiaClass.terapiaEditar(req,res).then((res)=>{
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
                    //Volta para a terapia de listagem
                    Terapia.find().then((terapia) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
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


    deletaTerapia(req,res){
        Terapia.deleteOne({_id: req.params.id}).then(() =>{
            Terapia.find().then((terapia) =>{
                req.flash("success_message", "Terapia deletada!")
                res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Terapias")
                res.render('admin/erro')
            })
        })

    },

    atualizaTerapia(req, res){
        let resposta;
        try{
            terapiaClass.terapiaEditar(req,res).then((res)=>{
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
                    //Volta para a Terapiaese de listagem
                    Terapia.find().then((terapia) =>{
                        console.log("Listagem Realizada!")
                        res.render('ferramentas/terapia/terapiaLis', {terapias: terapia})
                    }).catch((err) =>{
                        console.log("err:")
                        console.log(err)
                        res.render('admin/erro')
                    })
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



}