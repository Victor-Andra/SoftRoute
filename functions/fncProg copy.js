//Exports
const mongoose = require("mongoose")

//As classe tem que ser declaradas antes das tabelas
//Classe Programa ABA
const progClass = require("../models/prog")


//Classes Extrangeiras
const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")
const respostaClass = require("../models/resposta")

const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")

//Tabela Programa ABA
const Prog = mongoose.model("tb_prog")

//Tabelas Extrangeiras
const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")
const Resposta = mongoose.model("tb_resposta")

const Progdica = mongoose.model("tb_progdica")
const Prognivel = mongoose.model("tb_prognivel")
const Progtipo = mongoose.model("tb_progtipo")
//Funções auxiliares


module.exports = {
    listaProg(req, res, resposta){
        let flash = new Resposta();
        let perfilAtual = req.cookies['lvlUsu'];
        Prog.find().then((prog) =>{
            prog.forEach((b)=>{
                //Formatação da Exibição da Data de cadastro
                let datacad = new Date(b.prog_datacad)
                let mes = (datacad.getMonth()+1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1){
                    mes = "0"+mes;
                }
                if (dia.length == 1){
                    dia = "0"+dia;
                }
                let fulldate=(datacad.getFullYear()+"-"+mes+"-"+dia).toString();
                b.datacad=fulldate;
                
                dataedi = new Date(b.prog_dataedi)
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
           
            Bene.find({bene_status:"Ativo"}).then((bene)=>{
                bene.sort((a,b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                //console.log("Listagem Realizada bene!")
                // Adicionando a propriedade countSessaos a cada bene
                
                bene.forEach((b) => {
                    b.countProgs = prog.filter((s) => s.prog_beneid.toString() === b._id.toString()).length;
                });

                prog.forEach((s) => {
                    console.log("s: " + s);
                    bene.forEach((b) => {
                        if (("" + b._id + "") == ("" + s.prog_beneid + "")) {
                            console.log("b.bene_nome: " + b.bene_nome);
                        }
                    });
                });
                    Usuario.find().then((usuario)=>{
                        usuario.sort((a,b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena o bene por nome
                        Terapia.find().then((terapia)=>{
                            terapia.sort((a,b) => ((a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.terapia_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena em OA
                            Conv.find().sort({conv_nome: 1}).then((conv)=>{
                                conv.sort((a,b) => (a.conv_nome > b.conv_nome) ? 1 : ((b.conv_nome > a.conv_nome) ? -1 : 0));//Ordena o convênio por nome 
                                res.render('area/aba/prog/progLis', {progs: prog, usuarios: usuario, terapias: terapia, convs: conv, benes: bene, perfilAtual, flash})
        })})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar!")
            res.redirect('admin/erro')
        })
    },

    carregaProg(req,res){
        let idBene;
        if (req.params.id){
            idBene = req.params.id;
        } else {
            idBene = "766f69643132333435366964";
        }
        
        Conv.find().then((conv)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")    
                    Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            Progdica.find().then((progdica)=>{
                                Progtipo.find().then((progtipo)=>{
                                    Prognivel.find().then((prognivel)=>{
                                res.render("area/aba/prog/progCad", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, idBene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },

    carregaProgEdi(req,res){
        Prog.find().then((prog)=>{
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            Progdica.find().then((progdica)=>{
                                Progtipo.find().then((progtipo)=>{
                                    Prognivel.find().then((prognivel)=>{
                                res.render("area/aba/prog/progEdi", {progs: prog, terapias: terapia, usuarios: usuario, benes: bene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel})
        })})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao Realizar as listas!")
            res.render('admin/erro')
        })
    },

    cadastraProg(req,res){
        let resultado
        let resposta = new Resposta()
        let cadastro = progClass.progAdicionar(req,res);//variavel para armazenar a função que armazena o async
        
        cadastro.then((result)=>{
            resultado = true;
        }).catch((err)=>{
            resultado = err
            console.log("ERRO:"+err)
        }).finally(()=>{
            if (resultado == true){
                console.log('verdadeiro')
                req.flash("success_message", "Cadastro realizado com sucesso!")
                resposta.texto = "Cadastrado com sucesso!"
                resposta.sucesso = "true"
                this.listaProg(req,res,resposta)
            } else {
                console.log('falso')
                resposta.texto = resultado
                resposta.sucesso = "false"
                req.flash("error_message", "houve um erro ao abrir o cadastro!")
                res.render('admin/erro', resposta);
            }
        })
    },

    atualizaProg(req,res){
        let resultado
        let resposta = new Resposta()
        try{
            progClass.progEditar(req,res).then((res)=>{
                console.log("Atualização Realizada!")
                console.log(res)
                resultado = res;
            }).catch((err) =>{
                console.log("error1")
                console.log(err)
                resultado = err;
                res.render('admin/erro')
            }).finally(() =>{
                if(resultado == true){
                    console.log("Listagem Realizada!")
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com Sucesso!"
                    resposta.sucesso = "true"
                    this.listaProg(req,res,resposta)
                }else{
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log(err1)
            res.render('admin/erro')
        }
    },


    deletaProg(req,res){
        Prog.deleteOne({_id: req.params.id}).then(() =>{
            prog.find().then((prog)=>{
                Terapia.find().then((terapia)=>{
                    console.log("Listagem Realizada de terapias")
                        Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                            console.log("Listagem Realizada de Usuário")
                                Bene.find().sort({bene_nome: 1}).then((bene)=>{
                                    console.log("Listagem Realizada de beneficiarios")
                req.flash("success_message", "Programa ABA deletado!")
                res.render('area/aba/prog/progLis', {progs: prog, terapias: terapia, usuarios: usuario, benes: bene, flash})
            })})})}).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar os Planos de Terapia")
                res.render('admin/erro')
            })
        })
    }


}