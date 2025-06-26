//Exports
const mongoose = require("mongoose")

//beneFotos  
const Benefoto = mongoose.model("tb_benefoto")
const benefotoClass = require("../models/benefoto")
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")
const beneClass = require("../models/bene")
const Bene = mongoose.model("tb_bene")



module.exports = {
   listabeneFoto(req, res) {
        console.log('listando beneFotos');
        Benefoto.find().then((beneFotos) => {
            // Função auxiliar para formatar data
            function formatDateToBR(date) {
                const d = new Date(date);
                const dia = String(d.getDate()).padStart(2, '0');
                const mes = String(d.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
                const ano = d.getFullYear();
                const hora = String(d.getHours()).padStart(2, '0');
                const minuto = String(d.getMinutes()).padStart(2, '0');

                return `${dia}/${mes}/${ano} h${hora}:${minuto}`;
            }

            // Processa cada beneFoto para adicionar as datas formatadas
            beneFotos.forEach((beneFoto) => {
                // Formata data de cadastro
                if (beneFoto.beneFoto_datacad) {
                    beneFoto.datacad = formatDateToBR(beneFoto.beneFoto_datacad);
                } else {
                    beneFoto.datacad = "--/--/---- h--:--";
                }

                // Formata data de edição
                if (beneFoto.beneFoto_dataedi && beneFoto.beneFoto_dataedi !== "undefined") {
                    beneFoto.dataedi = formatDateToBR(beneFoto.beneFoto_dataedi);
                } else {
                    beneFoto.dataedi = "--/--/---- h--:--";
                }
            });

            console.log("Listagem Realizada!");
            res.render('beneficiario/beneLis', { beneFotos });
        }).catch((err) => {
            console.error(err);
            req.flash("error_message", "Houve um erro ao listar beneFotos");
            res.redirect('/admin/erro');
        });
    },
    carregabeneFoto(req, res, bene_id) {
        Benefoto.find().then((benefoto) => {
             Bene.find().then((bene)=>{
             bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por ordem alfabética 
                console.log("Listagem Realizada de Ufs!");

            // Renderiza a view passando o _id recebido
            res.render("beneficiario/beneFoto", {
                benefotos: benefoto,
                benes: bene,
                _id: bene_id // Aqui você passa o ID para a view
            })});
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "Houve um erro ao listar beneFotos");
            res.render('admin/erro');
        });
    },
    carregabeneFotoEdi(req, res){
        let base64Image
        Benefoto.findOne({_id: req.params.id}).then((beneFoto) =>{
            //console.log(beneFoto)
            if (beneFoto.beneFoto_bandeira != 'undefined' && beneFoto.beneFoto_bandeira != undefined){
            base64Image = new Buffer.from(beneFoto.beneFoto_bandeira, 'binary').toString('base64');
            }
            res.render("beneficiario/beneFotoEdi", {beneFoto, base64Image})
        }).catch((err) =>{
            console.log(err)
            res.render('admin/erro')
        })

    },
    async cadastrabeneFoto(req, res) {
        let resposta = new Resposta();

        try {
            const result = await benefotoClass.benefotoAdicionar(req, res);

            console.log("Cadastro Realizado!!!");

            resposta.texto = "Cadastrado com sucesso!";
            resposta.sucesso = true;
            req.flash("success_message", "Cadastro realizado com sucesso!");
            this.listabeneFoto(req, res);

        } catch (err) {
            console.error("ERRO AO CADASTRAR:", err.message);

            resposta.texto = err.message;
            resposta.sucesso = false;
            req.flash("error_message", "Houve um erro ao salvar!");
            res.render("admin/erro", resposta);
        }
    },
    async sobrescrevebeneFoto(req, res) {
        let resposta = new Resposta();

        try {
            const result = await benefotoClass.benefotoAtualizar(req, res);

            console.log("Atualização realizada!!!");

            resposta.texto = "Foto atualizada com sucesso!";
            resposta.sucesso = true;
            req.flash("success_message", "Foto atualizada com sucesso!");
            this.listabeneFoto(req, res);

        } catch (err) {
            console.error("ERRO AO ATUALIZAR:", err.message);

            resposta.texto = err.message;
            resposta.sucesso = false;
            req.flash("error_message", "Houve um erro ao atualizar!");
            res.render("admin/erro", resposta);
        }
    },
    atualizabeneFoto(req,res){
        let resposta;
        try{
            beneFotoClass.beneFotoEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resposta = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resposta = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resposta == 'true'){
                    //Volta para a beneFoto de listagem
                    beneFoto.find().then((beneFoto) =>{
                        res.render('ferramentas/beneFoto/beneFotoLis', {beneFotos: beneFoto})
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
    deletabeneFoto(req,res){
        beneFoto.deleteOne({_id: req.params.id}).then(() =>{
            beneFoto.find().then((beneFoto) =>{
                req.flash("success_message", "beneFoto deletada!")
                this.listabeneFoto(req,res)
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar beneFotos")
                res.render('admin/erro')
            })
        })
    }


}