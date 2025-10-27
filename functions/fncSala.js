//Exports
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//salas
const salaClass = require("../models/sala")
var Sala = getModel("SoftRoute", 'tb_sala', salaClass.SalaSchema)

//Classes Extrangeiras
const estadoClass = require("../models/estado")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema)
var Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

const fncGeral = require("./fncGeral");
const Resposta = fncGeral.Resposta;

module.exports = {
    listaSalaOLD(req,res){
        let db = req.cookies['preferredDb'];
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        console.log('listando salas')
        Sala.find().then((sala) =>{
            console.log("Listagem Realizada!")
            res.render('ferramentas/sala/salaLis', {salas: sala})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Salas")
            res.redirect('admin/erro')
        })

    },
    listaSala(req, res) {
        let db = req.cookies['preferredDb'];
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema); // ← assumindo que o usuário está nesse banco

        // Função auxiliar para formatar data como dd/mm/yyyy hhh:mm
        function formatDateToBR(date) {
            if (!date) return "--/--/---- h--:--";
            const d = new Date(date);
            const dia = String(d.getDate()).padStart(2, '0');
            const mes = String(d.getMonth() + 1).padStart(2, '0');
            const ano = d.getFullYear();
            const hora = String(d.getHours()).padStart(2, '0');
            const minuto = String(d.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
        }

        Promise.all([
            Sala.find({ sala_lixo: { $ne: "true" } }),
            Usuario.find()
        ])
        .then(([salaList, usuarioList]) => {
            // Cria um mapa de usuários por _id
            const usuarioMap = usuarioList.reduce((acc, u) => {
                acc[u._id.toString()] = u;
                return acc;
            }, {});

            // Enriquece cada sala com dados formatados e nomes dos usuários
            salaList.forEach(s => {
                s.datacad = s.sala_datacad ? formatDateToBR(s.sala_datacad) : "--/--/---- h--:--";
                s.dataedi = s.sala_dataedi ? formatDateToBR(s.sala_dataedi) : "--/--/---- h--:--";

                const usuarioCad = usuarioMap[s.sala_usuidcad?.toString()];
                const usuarioEdi = usuarioMap[s.sala_usuidedi?.toString()];

                s.usuarioCadNome = usuarioCad ? usuarioCad.usuario_nome : "Não informado";
                s.usuarioEdiNome = usuarioEdi ? usuarioEdi.usuario_nome : "Não informado";
            });

            res.render('ferramentas/sala/salaLis', { salas: salaList });
        })
        .catch((err) => {
            console.error("Erro em listaSala:", err);
            res.redirect('/admin/erro');
        });
    },

    carregaSala(req,res){
        let db = req.cookies['preferredDb'];
        

        Estado.find().then((estado)=>{
            console.log("Listagem Realizada de Ufs!")
            res.render("ferramentas/sala/salaCad", {estados: estado})
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar Salas")
            res.redirect('admin/erro')
        })

    },


    carregaSalaEdi(req,res){
        let db = req.cookies['preferredDb'];
        
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema)

        Sala.findById(req.params.id).then((sala) =>{
            console.log(sala)
            Estado.find().then((estado)=>{
                console.log("Listagem Realizada de Estados")
                res.render('ferramentas/sala/salaEdi', {sala, estados: estado})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraSala(req,res){
        let resposta
        let cadastro = salaClass.salaAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                this.listaSala(req,res)
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    },
    atualizaSala(req,res){
        let resposta;
        try{
            salaClass.salaEditar(req,res).then((res)=>{
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
                    //Volta para a sala de listagem
                    console.log('verdadeiro')
                    this.listaSala(req,res)
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
    deletaSala(req, res) {
        salaClass.salaDeletar(req, res)
            .then((sucesso) => {
                if (sucesso) {
                    console.log("Registro enviado para Lixeira!");
                    this.listaSala(req, res); // redireciona para listagem
                } else {
                    console.log("Falha ao excluir");
                    res.render('admin/erro');
                }
            })
            .catch((err) => {
                console.error("Erro inesperado em deletaSala:", err);
                res.render('admin/erro');
            });
    }
}