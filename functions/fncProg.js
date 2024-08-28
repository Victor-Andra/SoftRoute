//Exports
const mongoose = require("mongoose")

//progs
const progClass = require("../models/prog")
const respostaClass = require("../models/resposta")

const beneClass = require("../models/bene")
const convClass = require("../models/conv")
const usuarioClass = require("../models/usuario")
const terapiaClass = require("../models/terapia")

const progsetClass = require("../models/progset")
const progdicaClass = require("../models/progdica")
const prognivelClass = require("../models/prognivel")
const progtipoClass = require("../models/progtipo")

const folregClass = require("../models/folreg")
const notasupClass = require("../models/notasup")

//prog, tipos de prog 
const Prog = mongoose.model("tb_prog")
const Resposta = mongoose.model("tb_resposta")

const Bene = mongoose.model("tb_bene")
const Conv = mongoose.model("tb_conv")
const Usuario = mongoose.model("tb_usuario")
const Terapia = mongoose.model("tb_terapia")

const Progset = mongoose.model("tb_progset")
const Progdica = mongoose.model("tb_progdica")
const Prognivel = mongoose.model("tb_prognivel")
const Progtipo = mongoose.model("tb_progtipo")

const Folreg = mongoose.model("tb_folreg")
const Notasup = mongoose.model("tb_notasup")

module.exports = {
    listaProg(req, res, resposta) {
        let flash = new Resposta();
        let lvlUsu = req.cookies['lvlUsu'];
        let dataAtual = new Date();
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let perfilAtual = req.cookies['lvlUsu'];
    
        Prog.find().then((prog) => {
            // Variáveis para contar os programas adquiridos e não adquiridos
            let countProgs = 0;
            let countProgsC = 0;
            let countProgsA = 0;
    
            prog.forEach((b) => {
                // Formatação da Exibição da Data de cadastro
                let datacad = new Date(b.prog_datacad);
                let mes = (datacad.getMonth() + 1).toString();
                let dia = (datacad.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                let fulldate = (datacad.getFullYear() + "-" + mes + "-" + dia).toString();
                b.datacad = fulldate;
    
                dataedi = new Date(b.prog_dataedi);
                mes = (dataedi.getMonth() + 1).toString();
                dia = (dataedi.getUTCDate()).toString();
                if (mes.length == 1) {
                    mes = "0" + mes;
                }
                if (dia.length == 1) {
                    dia = "0" + dia;
                }
                fulldate = (dataedi.getFullYear() + "-" + mes + "-" + dia).toString();
                b.dataedi = fulldate;
            });
    
            Bene.find({ bene_status: "Ativo" }).then((bene) => {
                bene.sort((a, b) => ((a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.bene_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
    
                bene.forEach((b) => {
                    b.countProgs = prog.filter((s) => s.prog_beneid.toString() === b._id.toString()).length;
                    // Contagem de progs adquiridos e não adquiridos
                    b.countProgsC += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status === "Adquirido").length;
                    b.countProgsA += prog.filter((s) => s.prog_beneid.toString() === b._id.toString() && s.prog_status !== "Adquirido").length;
                
                    //console.log("b.datanasc"+b.bene_datanasc)
                    let datanasc = new Date(b.bene_datanasc);
                    let mes = (datanasc.getMonth()+1).toString();
                    let dia = (datanasc.getUTCDate()).toString();
                    if (mes.length == 1){
                        mes = "0"+mes;
                    }
                    if (dia.length == 1){
                        dia = "0"+dia;
                    }
                    let fulldate=(datanasc.getFullYear()+"-"+mes+"-"+dia).toString();
                    b.datanasc=fulldate;
    
                    // Data atual
                    const hoje = new Date();
                    let idade = new Date(b.bene_idade);
    
                    // Data de aniversário
                    let aniversario = datanasc;
    
                    // Cálculo da idade
                    let idadeAnos = hoje.getFullYear() - aniversario.getFullYear();
                    let idadeMeses = hoje.getMonth() - aniversario.getMonth();
                    let idadedias = hoje.getDay() - aniversario.getDay();
    
                    // Ajuste caso o dia de aniversário ainda não tenha ocorrido este ano
                    if (hoje.getDate() < aniversario.getDate()) {
                        idadeMeses--;
                    }
    
                    // Se o mês do aniversário for maior que o mês atual, ajusta a idade
                    if (idadeMeses < 0) {
                        idadeAnos--;
                        idadeMeses += 12;
                    }
                    let fullidade = (idadeAnos + " anos e " + (""+idadeMeses+"").replace("-","") + " meses.");
                    b.idade = fullidade;
                
                
                });
    
                // Aqui, você pode usar as variáveis countProgs e countProgsA como quiser
                // Por exemplo, enviá-las para sua view junto com outros dados
                //console.log("b.datanasc"+b.bene_datanasc)
                
    
                Usuario.find().then((usuario) => {
                    usuario.sort((a, b) => ((a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.usuario_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));
                                        
                    Prog.find().then((prog) => {
                        Progdica.find().then((progdica)=>{
                            progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                            Progtipo.find().then((progtipo)=>{
                                progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Prognivel.find().then((prognivel)=>{
                                    prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Progset.find().then((progset) => {
                                        prog.forEach((p)=>{
                                            let total = 0;
                                            progset.forEach((ps)=>{
                                                if ((""+ps.progset_progid+"") == (""+p._id+"")){
                                                    total += parseInt(ps.progset_qtest);
                                                }
                                            })
                                            p.prog_total_estimulos = total;
                                        })
                                        Folreg.find().then((folreg) => {
                                            Notasup.find().then((notasup) => {
                                                res.render('area/aba/prog/progLis', {
                                                    progs: prog,
                                                    progsets: progset,
                                                    usuarios: usuario,
                                                    benes: bene,
                                                    perfilAtual,
                                                    flash,
                                                    progdicas: progdica,
                                                    progtipos: progtipo,
                                                    prognivels: prognivel,
                                                    countProgs, // Envia a contagem de progs adquiridos
                                                    countProgsA, // Envia a contagem de progs não adquiridos
                                                    countProgsC,
                                                    dataAtual,
                                                    folregs: folreg,
                                                    notasups: notasup,
                                                    porgs: prog
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        }).catch((err) => {
            console.log(err);
            req.flash("error_message", "houve um erro ao listar!");
            res.redirect('admin/erro');
        });
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
                                progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Progtipo.find().then((progtipo)=>{
                                    progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Prognivel.find().then((prognivel)=>{
                                        prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                res.render("area/aba/prog/progCad", {convs: conv, terapias: terapia, usuarios: usuario, benes: bene, idBene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
        })})})})})})})}).catch((err) =>{
            console.log(err)
            req.flash("error_message", "houve um erro ao listar escolas")
            res.redirect('admin/erro')
        })
    },

    carregaProgEdi(req,res){
        let idBene = "";
        Prog.findById(req.params.id).then((prog) =>{
            idBene = prog.prog_beneid;
            Terapia.find().then((terapia)=>{
                console.log("Listagem Realizada de terapias")
                Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((usuario)=>{//Usuário c/ filtro de função = Terapeutas
                    console.log("Listagem Realizada de Usuário")
                    Usuario.find({"usuario_status":"Ativo", $or: [{"usuario_funcaoid":"6241030bfbcc51f47c720a0b"},{"usuario_perfilid":{$in: ["6578ab5248bfdf9fe1b2c8d8","62421903a12aa557219a0fd3"]}}]}).then((terapeuta)=>{//Usuário c/ filtro de função = Terapeutas
                        console.log("Listagem Realizada de Usuário")    
                        Bene.find().sort({bene_nome: 1}).then((bene)=>{
                            console.log("Listagem Realizada de beneficiarios")
                            Progdica.find().then((progdica)=>{
                                progdica.sort((a,b) => ((a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progdica_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                Progtipo.find().then((progtipo)=>{
                                    progtipo.sort((a,b) => ((a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.progtipo_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                    Prognivel.find().then((prognivel)=>{
                                        prognivel.sort((a,b) => ((a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? 1 : (((b.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "")) > (a.prognivel_nome.normalize('NFD').replace(/[\u0300-\u036f]/g, ""))) ? -1 : 0));//Ordena por nome
                                        console.log(prog)
                                        res.render('area/aba/prog/progEdi', {prog, terapias: terapia, usuarios: usuario, benes: bene, idBene, progdicas: progdica, progtipos: progtipo, prognivels: prognivel, terapeutas: terapeuta})
        })})})})})})})}).catch((err) =>{
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
                if (resultado == true){
                    console.log('verdadeiro')
                    req.flash("success_message", "Cadastro realizado com sucesso!")
                    resposta.texto = "Atualizado com sucesso!"
                    resposta.sucesso = "true"
                    this.listaProg(req,res,resposta)
                } else {
                    console.log('falso')
                    resposta.texto = resultado
                    resposta.sucesso = "false"
                    req.flash("error_message", "houve um erro ao abrir o cadastro!")
                    this.listaProg(req,res,resposta)
                }
            })
        } catch(err1){
            console.log("Erro TryCatch:"+err1)
            res.render('admin/erro');
        }
    },

    deletaProg(req,res){
        Prog.deleteOne({_id: req.params.id}).then(() =>{
            Prog.find().then((prog) =>{
                req.flash("success_message", "Método deletado!")
                res.render('area/aba/prog/progLis', {progs: prog})
            }).catch((err) =>{
                console.log(err)
                req.flash("error_message", "houve um erro ao listar Métodos")
                res.render('admin/erro')
            })
        })
    }

}