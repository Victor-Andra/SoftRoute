//Exports
const mongoose = require("mongoose")

//Foto dos beneficiarios
const Benefoto = mongoose.model("tb_benefoto")
const benefotoClass = require("../models/benefoto")

//Classes Extrangeiras
const beneClass = require("../models/bene")
const usuarioClass = require("../models/usuario")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Usuario = mongoose.model("tb_usuario")


module.exports = {
    carregaFotoLis(req,res){
        let base64Image;
        Bene.findOne({_id: req.params.id}).then((bene) =>{
            Benefoto.findOne({_id: req.params.id}).then((benefoto) =>{
                if (benefoto && benefoto.bene_foto != 'undefined' && benefoto.bene_foto != undefined){
                    base64Image = Buffer.from(benefoto.bene_foto, 'binary').toString('base64');
                }
                //console.log(base64Image);
                res.render("beneficiario/beneFoto", {bene, benefoto, base64Image})
        })}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar a foto")
            res.redirect('admin/erro')
        })
    },
    cadastrarFoto(req,res){
        let flash = new Resposta();
        let resposta = false;
        benefotoClass.beneCadastrarfoto(req,res).then((ok)=>{
            if (ok == "true"){
                resposta = true;
            }
        }).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao acessar o Cadastrar a foto")
            res.redirect('admin/erro')
        }).finally(()=>{
            if(resposta== true){
                //Volta para a agenda de listagem
                flash.texto = "Foto cadastrada com sucesso!"
                flash.sucesso = "true"
                //console.log('verdadeiro')
                res.render('admin/branco', {flash});
            }else{
                //passar classe de erro
                flash.texto = "Erro ao cadastrar a foto!"
                flash.sucesso = "false"
                res.render('admin/branco', {flash});
            }
        })
    }
   
}