//Exports
const mongoose = require("mongoose")

//Foto dos beneficiarios
const Benefoto = mongoose.model("tb_benefoto")
const benefotoClass = require("../models/benefoto")
const Resposta = mongoose.model("tb_resposta")

//Classes Extrangeiras
const respostaClass = require("../models/resposta")
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
        console.log('Iniciando cadastrarFoto...');
        let resposta
        let cadastro = benefotoClass.beneFotoAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resposta = true;
        }).catch((err)=>{
            resposta = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resposta == true){
                
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                
            } else {
                console.log('falso')
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro');
            }
        })
    }
   
    
}