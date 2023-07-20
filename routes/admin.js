const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const {autenticador} = require("../helpers/autenticador")
let application = require('../routes/admin')

//funções gerais
const fncGeral = require("../functions/fncGeral")

//empresa
const empresaClass = require("../models/empresa")
const Empresa = mongoose.model("tb_empresa")
const fncEmpresa = require("../functions/fncEmpresa")

//especialidade
const especialidadeClass = require("../models/especialidade")
const Especialidade = mongoose.model("tb_especialidade")
const fncEspecialidade = require("../functions/fncEspecialidade")

//especializacao
const especializacaoClass = require("../models/especializacao")
const Especializacao = mongoose.model("tb_especializacao")
const fncEspecializacao = require("../functions/fncEspecializacao")

//escola
const escolaClass = require("../models/escola")
const Escola = mongoose.model("tb_escola")
const fncEscola = require("../functions/fncEscola")

//funções, cargos dos funcionários
const funcaoClass = require("../models/funcao")
const Funcao = mongoose.model("tb_funcao")
const fncFuncao = require("../functions/fncFuncao")

//horario Agenda
const horaageClass = require("../models/horaAge")
const Horaage = mongoose.model("tb_horaage")
const fncHoraAge = require("../functions/fncHoraAge")

//perfil, níveis de acesso
const perfilClass = require("../models/perfil")
const Perfil = mongoose.model("tb_perfil")
const fncPerfil = require("../functions/fncPerfil")

//sala, onde são realizadas os atendimentos
const salaClass = require("../models/sala")
const Sala = mongoose.model("tb_sala")
const fncSala = require("../functions/fncSala")

//terapia, tipos de terapias realiazadas
const terapiaClass = require("../models/terapia")
const Terapia = mongoose.model("tb_terapia")
const fncTerapia = require("../functions/fncTerapia")

//estado, cadastro das unidades federativas brasileira
const estadoClass = require("../models/estado")
const Estado = mongoose.model("tb_estado")
const fncEstado = require("../functions/fncEstado")

//usuario, cadastro dos usuários
const usuarioClass = require("../models/usuario")
const Usuario = mongoose.model("tb_usuario")
const fncUsuario = require("../functions/fncUsuario")

//beneficiario, clientes
const beneClass = require("../models/bene")
const Bene = mongoose.model("tb_bene")
const fncBene = require("../functions/fncBene")

//Evolução Atendimento
const evoatendClass = require("../models/evoatend")
const Evoatend = mongoose.model("tb_evoatend")
const fncEvoatend = require("../functions/fncEvoatend")

//Agenda Técnicos
const agendaTecClass = require("../models/agenda")
const AgendaTec = mongoose.model("tb_agenda")
const fncAgendaTec = require("../functions/fncAgendaTec")

//Anamnese
const anamnClass = require("../models/anamn")
const Anamn = mongoose.model("tb_anamn")
const fncAnamn = require("../functions/fncAnamn")

//Diário de Bordo
const bordoClass = require("../models/bordo")
const Bordo = mongoose.model("tb_bordo")
const fncBordo = require("../functions/fncBordo")


//plano Tratamento
const tratClass = require("../models/trat")
const Trat = mongoose.model("tb_trat")
const fncTrat = require("../functions/fncTrat")

//Laudo
const laudoClass = require("../models/laudo")
const Laudo = mongoose.model("tb_laudo")
const fncLaudo = require("../functions/fncLaudo")

//VB-Mapp's
const mappClass = require("../models/mapp")
const Mapp = mongoose.model("tb_mapp")
const fncMapp = require("../functions/fncMapp")

//ABLLS-R
const abllsrClass = require("../models/abllsr")
const Abllsr = mongoose.model("tb_abllsr")
const fncAbllsr = require("../functions/fncAbllsr")

//VB-Mapabll
const mapabllClass = require("../models/mapabll")
const Mapabll = mongoose.model("tb_mapabll")
const fncMapabll = require("../functions/fncMapabll")

//Laudo
const evolClass = require("../models/evol")
const Evol = mongoose.model("tb_evol")
const fncEvol = require("../functions/fncEvol")

//Sonda - ABA
const sondaClass = require("../models/sonda")
const Sonda = mongoose.model("tb_sonda")
const fncSonda = require("../functions/fncSonda")

//Programa - ABA
const progClass = require("../models/prog")
const Prog = mongoose.model("tb_prog")
const fncProg = require("../functions/fncProg")

//Gráfico do Programa - ABA
const grafprogClass = require("../models/grafprog")
const Grafprog = mongoose.model("tb_grafprog")
const fncGrafprog = require("../functions/fncGrafprog")

//SET - ABA
const setClass = require("../models/set")
const Set = mongoose.model("tb_set")
const fncSet = require("../functions/fncSet")

//NAT - ABA
const natClass = require("../models/nat")
const Nat = mongoose.model("tb_nat")
const fncNat = require("../functions/fncNat")

//CARS - ABA
const carsClass = require("../models/cars")
const Cars = mongoose.model("tb_cars")
const fncCars = require("../functions/fncCars")


//ATA - ABA
const ataClass = require("../models/ata")
const Ata = mongoose.model("tb_ata")
const fncAta = require("../functions/fncAta")


//ATEC - ABA
const atecClass = require("../models/atec")
const Atec = mongoose.model("tb_atec")
const fncAtec = require("../functions/fncAtec")


//NotaSup
const notasupClass = require("../models/notasup")
const Notasup = mongoose.model("tb_notasup")
const fncNotasup = require("../functions/fncNotasup")


//Folha Registro - ABA
const folregClass = require("../models/folreg")
const Folreg = mongoose.model("tb_folreg")
const fncFolreg = require("../functions/fncFolreg")

//Gráfico ABC - ABA
const grafabcClass = require("../models/grafabc")
const Grafabc = mongoose.model("tb_grafabc")
const fncGrafabc = require("../functions/fncGrafabc")

//Análise funcional do comportamento
const anafuncompClass = require("../models/anafuncomp")
const Anafuncomp = mongoose.model("tb_anafuncomp")
const fncAnafuncomp = require("../functions/fncAnafuncomp")

//Evolucao
const evolucaoClass = require("../models/atend")
const Evolucao = mongoose.model("tb_atend")
const fncEvolucao = require("../functions/fncEvolucao")

//Sessao, Tabela com quantidades de Terapias que o beneficiario podera realizar semanalmente
const sessaoClass = require("../models/sessao")
const Sessao = mongoose.model("tb_sessao")

//convenio, planos de saúde e particular
const convClass = require("../models/conv")
const Conv = mongoose.model("tb_conv")
const fncConv = require("../functions/fncConv")

//convcre, Recebimentos pela terapia realizada ao beneficiário
const convcreClass = require("../models/convCre")
const Convcre = mongoose.model("tb_convcre")
const fncConvcre = require("../functions/fncConvcre")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const convdebClass = require("../models/convDeb")
const Convdeb = mongoose.model("tb_convdeb")
const fncConvdeb = require("../functions/fncConvdeb")

//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
const Atend = mongoose.model("tb_atend")
const fncAtend = require("../functions/fncAtend")
   
//AtendAdm, Atendimento Administrativo
const fncAtendAdm = require("../functions/fncAtendAdm")


//AGENDA, Agendamentos Padrão
const agendaClass = require("../models/agenda")
const Agenda = mongoose.model("tb_agenda")
const fncAgenda = require("../functions/fncAgenda")




//Debit, Débitos (parcialmente vinculadas ao Atendimento)
const debitClass = require("../models/debit")
const Debit = mongoose.model("tb_debit")
const fncDebit = require("../functions/fncDebit")

//Credit, Créditos (parcialmente vinculadas ao Atendimento)
const creditClass = require("../models/credit")
const Credit = mongoose.model("tb_credit")
const fncCredit = require("../functions/fncCredit")

//Tabil, Balanço contábil (parcialmente vinculadas ao Atendimento)
const tabilClass = require("../models/tabil")
const Tabil = mongoose.model("tb_tabil")

//Corrente, Conta Analise financeira pessoal de cada Terapeuta (vinculadas ao Atendimento)
const correnteClass = require("../models/corrente")
const Corrente = mongoose.model("tb_corrente")
const fncCorrente = require("../functions/fncCorrente")

//RESPOSTA
const respostaClass = require("../models/resposta")
const Resposta = mongoose.model("tb_resposta")

//Fornecedor, Para cadastrar novas Depesas independentemente dos Atendimentos
const fornecClass = require("../models/fornec")
const Fornec = mongoose.model("tb_fornec")
const fncFornec = require("../functions/fncFornec")

//Categoria, Para cadastrar novas Depesas independentemente dos Atendimentos
const debitCategClass = require("../models/debitCateg")
const debitCateg = mongoose.model("tb_debitcateg")
const fncDebitCateg = require("../functions/fncDebitCateg")

//Categoria, Para cadastrar novas Depesas independentemente dos Atendimentos
const debitSubcategClass = require("../models/debitSubcateg")
const debitSubcateg = mongoose.model("tb_debitsubcateg")
const fncDebitSubcateg = require("../functions/fncDebitSubcateg")

const fncSessao = require('../functions/fncSessao')
const passport = require('passport')

//Financeiro
const fncFinanceiro = require("../functions/fncFinanceiro")


/*
//Referencias de Atendimentos (vinculadas diretamente aos Atendimantos)
const refAtendClass = require("../models/refAtend")
const RefAtend = mongoose.model("tb_refatend")
*/

/*
    Classes para Administração da Rota
*/
class PoteBiscoito{
    constructor(
        lvlUsu,
        idUsu
        ){
        this.lvlUsu = lvlUsu,
        this.idUsu = idUsu
    }
}



//Rota Base '/'
router.get('/', (req,res) =>{
    res.render("admin/index")
})

//Rota Página em Branco
router.get('/branco', (req,res) =>{
    let lvl = 0;
    res.render("admin/branco", {nivel: lvl})
})

//Rota Página com Erro!
router.get('/erro', (req,res) =>{
    res.render("admin/erro")
})

//Rota cad usu
/*
router.get('/usuarioCad', fncGeral.IsAuthenticated, (req,res)=>{
    res.render("ferramentas/usuario/usuarioCad")
})
*/

//Rota Login
router.get('/login', (req,res)=>{
    console.log("LOGIN")
    lvl = "x";
    res.render("ferramentas/usuario/login", {nivel: lvl})
})

//Rota Alterar Senhas ou recuperar Senha ou Esqueci Senha
router.get('/recuperarSenha', (req,res)=>{
    console.log("recuperarSenha")
    lvl = "x";
    res.render("/menu/ferramentas/usuario/mudarSenha", {nivel: lvl})
})

/*
router.post('/login', fncGeral.IsAuthenticated, (req,res,next)=>{
    console.log("---------")
    console.log("email:")
    console.log(req.body.email)
    console.log("senha:")
    console.log(req.body.senha)
    console.log("---------")
    console.log("routerLogin")
    passport.authenticate("local", {
        successRedirect: "/menu/",
        failureRedirect: "/menu/login",
        failureFlash: true
    })(req,res,next)
})
*/
/* Login old
router.post('/login', (req,res,next)=>{
    
    passport.authenticate("local", {
        successRedirect: "/menu/",
        failureRedirect: "/menu/login",
        failureFlash: true
    })(req,res,next)
})
*/

router.post('/login', passport.authenticate('local', { failureRedirect: '/menu/login', failureMessage: true }), function(req, res) {
    let lvl;
    let idUsu;
    let perfilId;
    let ativo;
//Gerar cookie vazio aqui...?
    Usuario.findOne({usuario_email: req.body.email, usuario_senha: req.body.senha}).then((usu)=>{
        console.log(usu);
        perfilId = usu.usuario_perfilid;
        idUsu = usu._id;
        ativo = usu.usuario_status;
        console.log("ativo:")
        console.log(ativo)
        if (ativo == "Ativo"){
            console.log("VERDADEIRO")
            if (perfilId == "62421801a12aa557219a0fb9" || perfilId == "62421857a12aa557219a0fc1" || perfilId == "624218f5a12aa557219a0fd0") {//Adm e Finan
                res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + (24*3600000))/*, httpOnly: true */});//comentado, paleativo
                res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + (24*3600000))/*, httpOnly: true */});//comentado, paleativo // 3600000 Hora
            } else {
                res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + (2*3600000))/*, httpOnly: true */});//comentado, paleativo
                res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + (2*3600000))/*, httpOnly: true */});//comentado, paleativo // 3600000 Hora
            }

            /*
            switch (perfilId){
                case "62421801a12aa557219a0fb9":
                    //Admin
                    lvl = 0;
                    break;
                case "62421857a12aa557219a0fc1":
                    //Sócios
                    lvl = 1;
                    break;
                case "624218f5a12aa557219a0fd0":
                    //Administrador & Financeiro
                    lvl = 2;
                    break;
                case "62421903a12aa557219a0fd3":
                    //terapeutas
                    lvl = 3;
                    break;
                case "6242190fa12aa557219a0fd6":
                    //Recepcionistas
                    lvl = 4;
                    break;
                case "6242191fa12aa557219a0fd9":
                    //Visitantes e Outros
                    lvl = 5;
                    break;
                default:
                    //ERROR
                    res.redirect("/menu/admin/erro")
                    break;
            }
            */
            res.redirect("/menu/branco");
            /*
            if(lvl == 0){
                res.redirect("/menu/branco")
            } else if (lvl == 1){
                res.redirect("/menuT/")
            } else if (lvl == 2){
                res.redirect("/menuT/")
            } else if (lvl == 3){
                res.redirect("/menuT/")
            } else if (lvl == 4){
                res.redirect("/menuT/")
            } else if (lvl == 5){
                res.redirect("/menuT/")
            } else {
                res.redirect("/menuV/")
            }
            */
        } else {
            console.log("DISGRACA")
            let lvl = "x";
            res.render("ferramentas/usuario/login", {nivel: lvl});
        }
    })
});

router.get('/menuT', (req,res)=>{
    let lvl = 3;
    res.render("/menu", {nivel: lvl})
})

router.get('/menu/', (req,res)=>{
    console.log("MENU")
    let lvl = 0;
    res.render("/menu", {nivel: lvl})
})

/*
    passport.authenticate('local', { failureRedirect: '/login', failureMessage: true }),
    function(req, res) {
        console.log("EXECUTANDO")
        let lvl = fncUsuario.getNivelUsuario(req,res);
        let treco;
        
        //lvl.then((resposta)=>{
        //    console.log(resposta)
        //    treco = resposta;
        //})
        
        if (lvl == 0) {
            res.redirect('/menu/');
        } else if (lvl == 2) {
            res.redirect('/menuTerapeuta/');
        } else {
            res.redirect("/menu/branco")
        }
        
    });

*/


router.get('/logout', function(req, res, next) {
    req.logout(function(err) {
        if (err) {
            return next(err);
        } else {
            res.redirect('/menu/login');
        }
    });
});

//Menu DashBoard

//Menu Agenda
router.get("/agenda/lis", fncGeral.IsAuthenticated, function(req,res){//direciona o cadstro de Agenda, com Ufs e Convênios.
    fncAgenda.listaAgenda(req, res);
})

router.get("/auth", fncGeral.IsAuthenticated, (req,res)=>{
    res.render("admin/index")
})

router.get("/agenda/cadT", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Agenda, com Ufs e Convênios.
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        let resposta = new Resposta()
        resposta.texto = ""
        resposta.sucesso = ""
        fncAgenda.carregaAgendaCadastro(req, res, resposta);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get("/agenda/cadF/:dia/:mes/:ano/:hora", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Agenda, com Ufs e Convênios.
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.carregaAgendaEdiF(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get("/agenda/lisL/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda com FILTROS, FILTRADA.
    fncAgenda.carregaAgendaL(req, res);
})

router.get("/agenda/lisG/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Geral.
    fncAgenda.carregaAgendaG(req, res);
})

router.post("/agenda/filG/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Geral.
    fncAgenda.carregaAgendaFilG(req, res);
})

router.get("/agenda/lisS/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal.
    fncAgenda.carregaAgendaS(req, res);
})

router.get("/agenda/lisSB/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda de Beneficiario  Semanal.
    fncAgenda.carregaAgendaSB(req, res);
})

router.post("/agenda/filSB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de beneficiarios Semanal.
    fncAgenda.carregaAgendaFilSB(req, res);
})

router.get("/agenda/lisTB/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda de Terapeuta Semanal.
    fncAgenda.carregaAgendaTB(req, res);
})

router.post("/agenda/filTB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de terapeuta Semanal.
    fncAgenda.carregaAgendaFilTB(req, res);
})

router.post("/agenda/filS/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal.
    fncAgenda.carregaAgendaFilS(req, res);
})

router.get("/agenda/lisB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de beneficiarios.
    fncAgenda.carregaAgendaB(req, res);//CARREGAAGENDABENE
})

router.post("/agenda/filB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de beneficiarios.
    fncAgenda.carregaAgendaFilB(req, res);
})

router.get("/agenda/resp", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de beneficiarios.
    fncAgenda.carregaAgendaResp(req, res);//CARREGAAGENDABENE
})

router.post("/agenda/filResp", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de beneficiarios.
    fncAgenda.carregaAgendaFilResp(req, res);
})

router.get("/agenda/lisT", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de terapeutas.
    fncAgenda.carregaAgendaT(req, res);
})

router.post("/agenda/filT", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de terapeutas.
    fncAgenda.carregaAgendaFilT(req, res);
})

router.get("/agenda/lisSala/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Sala.
    console.log("Agenda Sala")
    fncAgenda.carregaAgendaSala(req, res);
})

router.post("/agenda/filSala/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Sala.
    console.log("Agenda Filtra Sala")
    fncAgenda.carregaAgendaFilSala(req, res);
})

router.get("/agenda/lisA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem.
    fncAgenda.filtraAgendaA(req, res);
})

router.post("/agenda/filA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de filtro.
    fncAgenda.filtraAgendaA(req, res);
})

router.get("/agenda/lisF", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Fixa.
    fncAgenda.carregaAgendaF(req, res);
})

router.post("/agenda/filF", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de filtro de Fixa.
    fncAgenda.carregaAgendaFilF(req, res);
})

router.post("/agenda/filL", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Agenda, com Ufs e Convênios.
    fncAgenda.filtraAgendaL(req, res);
})

router.post('/agenda/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.cadastraAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})


router.get('/agenda/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.deletaAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.carregaAgendaEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/ediTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.carregaAgendaEdiTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/atualizaTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.atualizaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/cadTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.carregaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/addTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para salvar a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.cadastraAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/cadE/atualiza', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.atualizaAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/deleteall', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        //fncAgenda.deletarTodosAtendimentos(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/deleteall/Teste2342022', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        //fncAgenda.deletarTodosAtendimentos2(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})
/*
router.get('/agenda/atualiza/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.atualizaAgendaCadE(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})
*/

router.post('/agenda/copiaSemana', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.copiaSemanaAgendaGeral(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})


router.post('/agenda/converteDia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAgenda.converteAgendaEmAtend(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/area/magenda/lisDia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaDTerapeuta(req, res);
})

router.get('/area/magenda/lisSemana', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaSTerapeuta(req, res);
})

router.get('/agenda/lisPessoal', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaPessoal(req, res);
})

router.post('/agenda/filPessoal', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.filtraAgendaPessoal(req, res);
})

router.get('/agenda/lisPessoalSemanal', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaPessoalSemanal(req, res);
})

router.post('/agenda/filPessoalSemanal', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.filtraAgendaPessoalSemanal(req, res);
})

router.get('/agenda/evolucao/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaEvolucao(req, res);
})

router.get('/agenda/evolucaoTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaEvolucaoTemp(req, res);
})

router.post('/agenda/evolucao', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.atualizaEvolucao(req, res);
})

//Cadastro Pontual de Faltas
//Ao cadastrar a falta, ele acessa a agenda, e muda o status do(s) agendamento(s) para aquele dia definido, para falta, 
//tanto por beneficiário como por terapeuta
//
router.get('/agenda/cadFaltas', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaCadFaltas(req, res);
})
//Substitução de Terpias
//Substitui terapias cadastradas ou associadas a terapeutas/beneficiários de forma equivocada
//
router.get('/agenda/cadSubterapia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaSubterapia(req, res);
})

// Visualizar Agenda
/*
router.get("/agenda/vis", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro A AGENDA.
    fncAgenda.carregaAgendaVis(req, res);
})
*/



//Menu Atendimento   

router.get("/atendimento/lis", fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtend.listaAtend(req, res);
})

router.post("/atendimento/lisF", fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtend.filtraAtend(req, res);
})

router.post("/atendimento/copiaAtends", fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtend.copiarAtends(req,res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/cad', fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtend.carregaAtend(req,res);
})

router.post('/atendimento/add', fncGeral.IsAuthenticated,(req,res) =>{//adiciona atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtend.cadastraAtend(req,res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/deleteMany/:id', fncGeral.IsAuthenticated,(req,res) =>{//deleta atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        //fncAtend.deletaVariosAtend(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/deleteAll/', fncGeral.IsAuthenticated,(req,res) =>{//deleta atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtend.deletaVariosAtends(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/edi/:id', fncGeral.IsAuthenticated,(req,res) =>{//direciona para a edição de atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtend.carregaAtendEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Atendimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtend.atualizaAtend(req , res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

  

//Relatório de Atendimentos por Convênio.
//pagos pelos convênios, incluindo particular, num determinado período de tempo.
    router.get('/atendimento/relatendval', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoVal(req,res)
    })

    router.post('/atendimento/relatendvals', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoValFiltro(req,res)
    })

//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
    router.get('/atendimento/relatendbene', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBene(req,res)
    })

    router.post('/atendimento/relatendbenes', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneFiltro(req,res)
    })
//Relatório Consolidado de Atendimentos por Beneficiário.
//Emite uma consolidado de todos os atendimentos realizados com Valores pelo beneficiário num determinado período de tempo.
    router.get('/atendimento/relatendbenecons', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneCons(req,res)
    })

    router.post('/atendimento/relatendvalconss', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneConsFiltro(req,res)
    })

//Relatório de Atendimentos por Terapeutas.
//para pagamentos aos Terapeutas, num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendterapiacons', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendterapiacons(req,res)
})

router.post('/atendimento/atendreltera/relatendterapiaconss', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendterapiaconsFiltro(req,res)
})

//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendteraana', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraana(req,res)
})

router.post('/atendimento/atendreltera/relatendteraanas', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraanaFiltro(req,res)
})
//Relatório Consolidado de Atendimentos por Beneficiário.
//Emite uma consolidado de todos os atendimentos realizados com Valores pelo beneficiário num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendteracons', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteracons(req,res)
})

router.post('/atendimento/atendreltera/relatendteraconss', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraconsFiltro(req,res)
})



//Relatório Emissão NF.
//Emite uma consolidado consolidado por beneficiário com os valores com formatação para emissão de NF ba prefeitura de recife.
router.get('/atendimento/relatendvalnf', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendimentoValNf(req,res)
})

router.post('/atendimento/relatendvalnfs', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendimentoValNfFiltro(req,res)
})

//Menu Financeiro / AtendAdm
//Menu AtendAdm   


router.get("/atendimento/atendadm/lis", fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtendAdm.listarAtendAdm(req,res);
})





router.get('/atendimento/atendadm/cad', fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtendAdm.carregaAtendAdm(req,res);
})


router.post('/atendimento/atendadm/add', fncGeral.IsAuthenticated,(req,res) =>{//adiciona atend
    //let potinho = Object.assign(new PoteBiscoito, req.cookies);
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        switch (req.body.atendCategoria) {
            case 'Padrão':
                fncAtendAdm.cadastraAtendAdm(req,res);
                break;
            case 'Falta':
                fncAtendAdm.cadastraAtendAdmFalta(req,res);
                break;
            case 'Apoio':
                fncAtendAdm.cadastraAtendAdmApoio(req,res);
                break;
            case 'Supervisão':
                fncAtendAdm.cadastraAtendAdmSupervisao(req,res);
                break;
            case 'Pais':
                fncAtendAdm.cadastraAtendAdmPais(req,res);
                break;
            case 'Substituto':
                fncAtendAdm.cadastraAtendAdmSubstituto(req,res);
                break;
            case 'Glosa':
                fncAtendAdm.cadastraAtendAdmGlosa(req,res);
                break;
            case 'Extra':
                fncAtendAdm.cadastraAtendAdmExtra(req,res);
                break;
            default:
                res.redirect('admin/erro')
                break;
        }
        /*
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
    */
})

router.get('/atendimento/atendadm/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtendAdm.deletaAtendAdm(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/atendadm/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de atend
    //let potinho = Object.assign(new PoteBiscoito, req.cookies);
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtendAdm.carregaAtendAdmEdi(req,res);
    //} else {
    //    console.log("Acesso NEGADO!");
    //    let lvl = "x";
    //    res.render("ferramentas/usuario/login", {nivel: lvl});
    //}
    /*
    Atend.findById(req.params.id).then((atend) =>{
        res.render('financeiro/atendadm/atendAdmEdi', atend)
    }).catch((err) =>{
        console.log(err)
        res.render('admin/erro')
    })
    */
})

router.post('/atendimento/atendadm/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Atendimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncAtendAdm.atualizaAtendAdm(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

//Financeiro / Fornecedor
//Menu Fornecedor   
router.get('/financeiro/fornecedor/lis', fncGeral.IsAuthenticated,(req,res) =>{//lista todas fornecs
    fncFornec.listaFornec(req, res);
})

router.get('/financeiro/fornecedor/cad', fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de fornec.
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncFornec.carregaFornecCad(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/financeiro/fornecedor/add', fncGeral.IsAuthenticated,(req,res) =>{//adiciona fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncFornec.cadastraFornec(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/financeiro/fornecedor/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncFornec.deletaFornec(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/financeiro/fornecedor/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncFornec.carregaFornecEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/financeiro/fornecedor/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Fornecimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0") {
        fncFornec.atualizaFornec(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

//Financeiro / categoria
router.get('/financeiro/despesa/categoria/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas categorias
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncDebitCateg.listaDebitcateg(req, res, resposta);
})

router.get('/financeiro/despesa/categoria/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de categoria
    fncDebitCateg.carregaDebitcateg(req, res);
})

router.post('/financeiro/despesa/categoria/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona categoria
    fncDebitCateg.cadastraDebitcateg(req, res);
})

router.get('/financeiro/despesa/categoria/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta categoria
    fncDebitCateg.deletaDebitcateg(req, res);
})

router.get('/financeiro/despesa/categoria/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de categoria
    fncDebitCateg.carregaDebitcategEdi(req, res);
})

router.post('/financeiro/despesa/categoria/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da categoria
    fncDebitCateg.atualizaDebitcateg(req, res);
})

//Financeiro / sub-categoria
router.get('/financeiro/despesa/subcategoria/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas subcategorias
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncDebitSubcateg.listaDebitsubcateg(req, res, resposta);
})

router.get('/financeiro/despesa/subcategoria/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de subcategoria
    fncDebitSubcateg.carregaDebitsubcateg(req, res);
})

router.post('/financeiro/despesa/subcategoria/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona subcategoria
    console.log("passando")
    fncDebitSubcateg.cadastraDebitsubcateg(req, res);
})

router.get('/financeiro/despesa/subcategoria/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta subcategoria
    fncDebitSubcateg.deletaDebitsubcateg(req, res);
})

router.get('/financeiro/despesa/subcategoria/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de subcategoria
    fncDebitSubcateg.carregaDebitsubcategEdi(req, res);
})

router.post('/financeiro/despesa/subcategoria/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da subcategoria
    fncDebitSubcateg.atualizaDebitsubcateg(req, res);
})

//Financeiro / Crédito
//Menu Crédito   
router.get('/financeiro/receita/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas credits
    fncCredit.listar(req,res);
})

router.get('/financeiro/receita/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de credit
    res.render("financeiro/receita/creditCad")
})

router.post('/financeiro/receita/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona credit
    fncCredit.adicionar(req,res);
})

router.get('/financeiro/receita/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta credit[]
    fncCredit.delete(req,res);
})

router.get('/financeiro/receita/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de credit
    fncCredit.carregaEditar(req,res);
})

router.post('/financeiro/receita/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Creditimento
    fncCredit.atualizar(req,res);
})

//Financeiro / Débito
//Menu Débito   
router.get('/financeiro/despesa/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas debits      
    fncDebit.listar(req,res);
})

router.get('/financeiro/despesa/ges', fncGeral.IsAuthenticated, (req,res) =>{//lista todas debits      
    fncFinanceiro.listaRelContasAPagar(req,res);
})

router.get('/financeiro/despesa/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de debit
    fncDebit.carregaDebit(req,res)
})

router.post('/financeiro/despesa/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona debit
    fncDebit.adicionar(req,res);
})

router.get('/financeiro/despesa/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta debit
    fncDebit.listar(req,res)
})

router.get('/financeiro/despesa/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de debit
    fncDebit.carregaEditar(req,res)
})

router.post('/financeiro/despesa/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Debitimento
    fncDebit.atualizar(req,res)
})

//Menu Beneficiario
//Bene    
    router.get('/beneficiario/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas benes
        fncBene.listaBene(req, res);        
    })

    router.get('/beneficiario/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de bene, com Ufs e Convênios.
        fncBene.carregaBene(req, res); 
    })

    router.get('/beneficiario/imp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de bene
        fncBene.listaBeneImp(req, res); 
    })

    router.post('/beneficiario/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona bene
      fncBene.cadastraBene(req, res); 
    })

    router.get('/beneficiario/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta bene
      fncBene.deletaBene(req, res); 
    })

    router.get('/beneficiario/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de bene
       fncBene.carregaBeneEdi(req, res); 
    })

    router.post('/beneficiario/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneficiario
        fncBene.atualizaBene(req, res); 
    })

//Evolucao
    router.get('/beneficiario/evolucao/lis', fncGeral.IsAuthenticated, (req,res) =>{
        fncEvolucao.listaEvolucao(req, res); 
    })

//Menu Beneficiario Escola
router.get('/beneficiario/escola/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas escolas
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncEscola.listaEscola(req, res, resposta);        
})

router.get('/beneficiario/escola/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de escolas
    fncEscola.carregaEscola(req, res);//coment
})

router.get('/beneficiario/escola/imp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escola
    fncEscola.listaEscola(req, res); 
})

router.post('/beneficiario/escola/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona escola
    console.log("post")
    fncEscola.cadastraEscola(req, res); 
})

router.get('/beneficiario/escola/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta escola
    fncEscola.deletaEscola(req, res); 
})

router.get('/beneficiario/escola/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escola
    fncEscola.carregaEscolaEdi(req, res); 
})

router.post('/beneficiario/escola/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da escola
    fncEscola.atualizaEscola(req, res); 
})

//Menu Beneficiario /Sessao
//Tabela de Requisição de Atendimentos.
//cria uma tabela com as necessidades de cada beneficiário segundo as especialidades,
//Essa tabela de acompanhamento é atualizada cada atendimento realizado.
//A tabela de ananmese é a base para a geração da agenda.
router.get('/beneficiario/sessao/cad', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.carregaSessao(req, res);
})


router.post('/beneficiario/sessao/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona bene
fncSessao.cadastraSessao(req, res);
})

router.get('/beneficiario/sessao/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta bene
fncSessao.deletaSessao(req, res);
})



//Menu Beneficiario /Sessaoese
//Edita a Requisição de Atendimentos.
router.get('/beneficiario/sessao/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{
 fncSessao.carregaSessaoEdi(req, res);
})

router.post('/beneficiario/sessao/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneimento
 fncSessao.atualizaSessao(req, res);
})


//Menu Beneficiario /Sessaos
//Lista de Requisição de Atendimentos.
router.get('/beneficiario/sessao/lis', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.listaSessao(req, res);
})


//Lista de Requisição de Tabela com QT de Atendimentos por beneficiario.
router.get('/beneficiario/sessao/listab/:id', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.listaSessaoTab(req, res); 
})

//Menu Evolução dos Atendimentos ** Area Tecnicos   
//Lista Todos os Atendimentos por Data Atual e Beneficiário vinculados pela AGENDA do Dia
router.get('/area/evoatendlis', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncEvoatend.listaEvoatend(req, res);
})

router.post('/area/evoatendfil', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncEvoatend.filtraEvoatend(req, res);
})

//Menu Minha Agenda Area Tecnicos
router.get("/area/magenda/LisD", fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Agenda dos técnicos Do Dia.
    fncAgendaTec.carregaAgendaTecDia(req, res);
})

router.get("/area/magenda/LisS", fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Agenda dos técnicos Da Semana.
    fncAgendaTec.carregaAgendaTecSem(req, res);
})


//Menu Anamnese ** Area Tecnicos   
//Lista Todos as anamneses por Data, Beneficiário
router.get('/area/anamn/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a lista de anamneses
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncAnamn.listaAnamn(req, res, resposta);
})
//Carrega Cadastro de Anamnese
router.get('/area/anamn/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro da Anamneses
    fncAnamn.carregaAnamn(req, res);
})
//Adiciona Registro de Anamnese
router.post('/area/anamn/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Anamnese
    console.log("post")
    fncAnamn.cadastraAnamn(req, res); 
})
//Atualiza registro de Anamnese Selecionada
router.post('/area/anamn/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneimento
    fncAnamn.atualizaAnamn(req, res);
})
//Carrega Editar Anamnese Selecionada
router.get('/area/anamn/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escola
    fncAnamn.carregaAnamnEdi(req, res); 
})

//Menu Bordo ** Area Tecnicos   
//Lista Todos os Diários de Bordo por Data, Beneficiário
router.get('/area/bordo/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.listaBordo(req, res);
})
//Carrega Cadastro de Diário de Bordo
router.get('/area/bordo/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.carregaBordo(req,res);
})
//Carrega Editar Selecionado de Diário de Bordo
router.get('/area/bordo/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncBordo.carregaBordoedi(req,res);
})
//Adiciona Diário de Bordo Registro
router.post('/area/bordo/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncBordo.cadastraBordo(req,res);
})
//Atualiza Diario de Bordo
router.post('/area/bordo/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza Diário de Bordo Padrao
    fncBordo.atualizaBordo(req , res);
})
//Deleta bordo Selecionado
router.get('/area/bordo/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncBordo.deletaBordo(req,res);
})
//Carrega Mapa de Bordo Selecionado
router.get('/area/bordo/mapabordo', fncGeral.IsAuthenticated, (req,res) =>{//Abre o Mapa de Bordo com filtro para filtrar e definir mapa a ser exibido
    fncBordo.carregaBordomapa(req,res);
})
//Menu Plano de Tratamentos ** Area Tecnicos   
//Lista Todos Planos de Tratamento
router.get('/area/plano/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Plano de Tratamentos, com Ufs e Convênios.
    fncTrat.listaTrat(req, res);
})
//Carrega Cadastro de Plano de Tratamento
router.get('/area/plano/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Plano de Tratamentos, com Ufs e Convênios.
    fncTrat.carregaTrat(req,res);
})
//Carrega Editar de Plano de Tratamento Selecionado
router.get('/area/plano/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Plano de Tratamentos Padrao
    fncTrat.carregaTratedi(req,res);
})
//Adiciona Registro de Plano de Tratamento
router.post('/area/plano/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Plano de Tratamentos Padrao
    fncTrat.cadastraTrat(req,res);
})
//Atualiza Regitros de Plano de Tratamento 
router.post('/area/plano/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o Plano de Tratamentos Padrao
    fncTrat.atualizaTrat(req , res);
})
//Deleta plano Selecionado
router.get('/area/plano/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncTrat.deletaTrat(req, res);
})



//Menu Laudos ** Area Tecnicos   
//Carrega Cadastro de Laudo 
router.get('/area/laudo/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncLaudo.carregaLaudo(req,res);
})
//Adiciona Registro de Laudo
router.post('/area/laudo/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncLaudo.cadastraLaudo(req,res);
})
//Carrega Laudo para Edição
router.get('/area/laudo/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.carregaLaudoedi(req,res);
})
//Atualiza Laudo selecionado editado
router.get('/area/laudo/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.atualizaLaudo(req,res);
})
//Lista todos os Laudos
router.get('/area/laudo/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.listaLaudo(req,res);
})
//Deleta Laudo Selecionado
router.get('/area/laudo/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncLaudo.deletaLaudo(req,res);
})

//Menu Evoluções ** Area Tecnicos   
//Carrega Cadastro de Relatório Evolutivo
router.get('/area/evol/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncEvol.carregaEvol(req, res);
})
//Adiciona Registro de Relatório Evolutivo
router.post('/area/evol/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncEvol.cadastraEvol(req,res);
})
//Lista Todos os Relatório Evolutivo
router.get('/area/evol/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.listaEvol(req, res);
})
//Carrega Relatório Evolutivo Selecionado para Edição
router.get('/area/evol/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.carregaEvoledi(req, res);
})
//Atualiza Relatório Evolutivo Selecionado
router.get('/area/evol/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.atualizaEvol(req, res);
})
//Deleta Exclui Relatório Evolutivo
router.get('/area/evol/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncEvol.deletaEvol(req, res);
})

//Menu VB-MAPPS ** Area Tecnicos   
//Carrega Cadastro de Mapp
router.get('/area/mapp/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncMapp.carregaMapp(req, res);
})
//Adiciona Registro de Mapp
router.post('/area/mapp/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncMapp.cadastraMapp(req,res);
})
//Carrega o Mapp Selecionado para Edição
router.get('/area/mapp/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapp.carregaMappedi(req, res);
})
//atualiza o Mapp Editado
router.get('/area/mapp/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapp.atualizaMapp(req, res);
})
//Lista Todos os Mapss
router.get('/area/mapp/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapp.listaMapp(req, res);
})
//Deleta Exclui o Mapp Selecionado
router.get('/area/mapp/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncMapp.deletaMapp(req, res);
})

//Menu ABLLS-R ** Area Tecnicos   
//Carrega Cadastro de ABLLS-R
router.get('/area/abllsr/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncAbllsr.carregaAbllsr(req, res);
})
//Adiciona Registro de ABLLS-R
router.post('/area/abllsr/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncAbllsr.cadastraAbllsr(req,res);
})
//Carrega o ABLLS-R Selecionado para Edição
router.get('/area/abllsr/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncAbllsr.carregaAbllsr(req, res);
})
//atualiza o ABLLS-R Editado
router.get('/area/abllsr/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncAbllsr.atualizaAbllsr(req, res);
})
//Lista os ABLLS-R
router.get('/area/abllsr/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncAbllsr.listaAbllsr(req, res);
})
//Deleta Exclui o ABLLS-R Selecionado
router.get('/area/abllsr/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncAbllsr.deletaAbllsr(req, res);
})

//Menu MapAbll ** Area Tecnicos   
//Carrega Cadastro de MapAbll
router.get('/area/mapabll/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncMapabll.carregaMapabll(req, res);
})
//Adiciona Registro de MapAbll
router.post('/area/mapabll/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncMapabll.cadastraMapabll(req,res);
})
//Carrega o MapAbll Selecionado para Edição
router.get('/area/mapabll/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapabll.carregaMapablledi(req, res);
})
//atualiza o MapAbll Editado
router.get('/area/mapabll/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapabll.atualizaMapabll(req, res);
})
//Lista Todos os MapAbll
router.get('/area/mapabll/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncMapabll.listaMapabll(req, res);
})
//Deleta Exclui o MapAbll Selecionado
router.get('/area/mapabll/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncMapabll.deletaMapabll(req, res);
})


//Menu Sonda ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/sonda/sondacad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncSonda.carregaSonda(req, res);
})

//Lista Sonda por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/sonda/sondalis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncSonda.listaSonda(req, res);
})

//Menu Programas ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/prog/progcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncProg.carregaProg(req, res);
})

//Lista Progrmas por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/prog/proglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncProg.listaProg(req, res);
})

//Menu Gráfico do Programa ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/grafprog/grafprogcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncGrafprog.carregaGrafprog(req, res);
})

//Lista Sonda por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/grafprog/grafproglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncGrafprog.listaGrafprog(req, res);
})

//Menu SET ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/set/setcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncSet.carregaSet(req, res);
})

//Lista SET por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/set/setlis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncSet.listaSet(req, res);
})

//Menu NAT ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/nat/natcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncNat.carregaNat(req, res);
})

//Lista NAT por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/nat/natlis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncNat.listaNat(req, res);
})

//Menu ATEC ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/atec/ateccad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncAtec.carregaAtec(req, res);
})

//Lista ATEC por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/atec/ateclis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncAtec.listaAtec(req, res);
})

//Menu ATA ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/ata/atacad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncAta.carregaAta(req, res);
})

//Lista ATA por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/ata/atalis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncAta.listaAta(req, res);
})

//Menu CARS ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/cars/carscad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncCars.carregaCars(req, res);
})

//Lista CARS por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/cars/carslis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncCars.listaCars(req, res);
})

//Menu Notasup ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/notasup/notasupcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario Nota Supervisor
    fncNotasup.carregaNotasup(req, res);
})

//Lista Notasup por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/notasup/notasuplis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista para o Formulario Nota Supervisor
    fncNotasup.listaNotasup(req, res);
})

//Menu Folha de Registro ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/folreg/folregcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de registros
    fncFolreg.carregaFolreg(req, res);
})

//Lista Folha Registro ** Area Tecnicos e ABA
router.get('/area/aba/folreg/folreglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista de registros
    fncFolreg.listaFolreg(req, res);
})

//Menu Gráfico ABC ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/grafabc/grafabccad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro ddo grafico abc,
    fncGrafabc.carregaGrafabc(req, res);
})

//Lista Gráfico ABC por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/grafabc/grafabclis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista o grafico abc.
    fncGrafabc.listaGrafabc(req, res);
})

//Menu Análise Funcional do Comportamento ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/anafuncomp/anafuncompcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona ao cadastro de Análise funcional de comportamento
    fncAnafuncomp.carregaAnafuncomp(req, res);
})

//Lista Lista
router.get('/area/aba/anafuncomp/anafuncomplis', fncGeral.IsAuthenticated, (req,res) =>{//direciona ao lista de Análise funcional de comportamento
    fncAnafuncomp.listaAnafuncomp(req, res);
})


//Menu Convenio
//Sub Menu Conv
    
router.get('/convenio/conv/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas os registros dos convênios
fncConv.listaConv(req, res);    
})

router.get('/convenio/conv/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona para o cadastro de novos convênios
fncConv.carregaConv(req, res); 
})

router.post('/convenio/conv/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro no Convênio
fncConv.cadastraConv(req, res); 

})

router.get('/convenio/conv/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta registro do convênio
fncConv.deletaConv(req, res); 
})

router.get('/convenio/conv/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de registro no convênio
fncConv.carregaConvEdi(req, res); 
})

router.post('/convenio/conv/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza no convênio
fncConv.atualizaConv(req, res);
})


//Relatório Individual de Valores de Atendimento por Beneficiário.
//Emite uma relação de todos os valores de atendimentos realizados pelo beneficiário
//pagos pelos convênios, incluindo particular, num determinado período de tempo.
router.get('/convenio/conv/relatendconvval', fncGeral.IsAuthenticated, (req,res) =>{
    res.render("convenio/conv/relatendconvval")
})


//Menu Convenio/ConvCre 
    //convcre
    router.get('/convenio/convcre/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas convcres
        fncConvcre.listaConvcre(req,res);
    })

    router.get('/convenio/convcre/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de bene, com Ufs e Convênios.
        fncConvcre.carregaConvcre(req,res);
    })

    router.post('/convenio/convcre/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona convcre
        fncConvcre.cadastraConvcre(req,res);
    })

    router.get('/convenio/convcre/del/:id' ,fncGeral.IsAuthenticated, (req,res) =>{//deleta convcre
        fncConvcre.deletaConvcre(req,res);
    })

    router.get('/convenio/convcre/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de convcre
        fncConvcre.carregaConvcreEdi(req,res);
    })

    router.post('/convenio/convcre/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Convcreimento
        fncConvcre.editaConvcre(req, res);
    })

//Menu Convenio/Convdeb 
    //convdeb
    router.get('/convenio/convdeb/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas convdebs
        fncConvdeb.listaConvdeb(req,res);
    })

    router.get('/convenio/convdeb/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Convdeb, com Ufs e Convênios.
        fncConvdeb.carregaConvdeb(req,res);
    })

    router.post('/convenio/convdeb/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona convdeb
        fncConvdeb.cadastraConvdeb(req,res);
    })

    router.get('/convenio/convdeb/del/:id', (req,res) =>{//deleta convdeb
        fncConvdeb.deletaConvdeb(req,res);
    })

    router.get('/convenio/convdeb/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de convdeb
        fncConvdeb.carregaConvdebEdi(req,res);
    })

    router.post('/convenio/convdeb/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da convdeb
        fncConvdeb.editarConvdev(req,res);
    })


//Menu Financeiro
//Menu Conrrente, conta
    
router.get('/financeiro/corrente/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista toda os registros da conta corrente
    fncCorrente.listaCorrente(req, res);           
})

router.get('/financeiro/corrente/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona para o cadastro de conta corrente
    fncCorrente.carregaCorrente(req, res);     
})


router.post('/financeiro/corrente/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro a conta corrente
    fncCorrente.cadastraCorrente(req, res);
})

router.get('/financeiro/corrente/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta registro na conta corrente 
    fncCorrente.deletaCorrente(req, res);
})

router.get('/financeiro/corrente/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição dos registros na conta corrente
    fncCorrente.carregaCorrenteEdi(req, res);
})

router.post('/financeiro/corrente/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o registro na conta corrente
    fncCorrente.atualizaCorrente(req, res);
})




//Menu Ferramentas
    //sala
        router.get('/ferramentas/sala/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas salas
            fncSala.listaSala(req, res);
        })

        router.get('/ferramentas/sala/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de sala
            fncSala.carregaSala(req, res);
        })

        router.post('/ferramentas/sala/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona sala
            fncSala.cadastraSala(req, res);
        })

        router.get('/ferramentas/sala/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta sala
            fncSala.deletaSala(req, res);
        })

        router.get('/ferramentas/sala/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de sala
            fncSala.carregaSalaEdi(req, res);
        })

        router.post('/ferramentas/sala/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Salaimento
            fncSala.atualizaSala(req, res);
        })
        
        

//Menu Ferramentas
    //Empresa
        router.get('/ferramentas/empresa/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas empresas
            fncEmpresa.listaEmpresa(req, res);
        })
        
        router.get('/ferramentas/empresa/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de empresa.
            fncEmpresa.carregaEmpresa(req, res);
        })

        router.post('/ferramentas/empresa/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona empresa
        fncEmpresa.cadastraEmpresa(req, res);

        })
        
        router.get('/ferramentas/empresa/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta empresa
            fncEmpresa.deletaEmpresa(req, res);
        })
        
        router.get('/ferramentas/empresa/edi/:id', fncGeral.IsAuthenticated, (req, res) =>{//direciona a edição de empresa
            fncEmpresa.carregaEmpresaEdi(req, res);
        })
   
        router.post('/ferramentas/empresa/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Empresa
            fncEmpresa.atualizaEmpresa(req, res);
        })

//Menu Ferramentas
    //Especialidade
        router.get('/ferramentas/especialidade/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas especialidades
            let resposta = new Resposta()
            resposta.texto = ""
            resposta.sucesso = ""
            fncEspecialidade.listaEspecialidade(req, res, resposta);
            
        })

        router.get('/ferramentas/especialidade/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de especialidade
            fncEspecialidade.carregaEspecialidade(req, res);
        })
        
        router.post('/ferramentas/especialidade/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona especialidade
            fncEspecialidade.cadastraEspecialidade(req, res);
        })
        
        router.get('/ferramentas/especialidade/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta especialidade
            fncEspecialidade.deletaEspecialidade(req, res);
        })
        
        router.get('/ferramentas/especialidade/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de especialidade
            fncEspecialidade.carregaEspecialidadeEdi(req, res);
        })

        router.post('/ferramentas/especialidade/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Especialidadeimento
            fncEspecialidade.atualizaEspecialidade(req, res);
        })

//Menu Ferramentas
    //Especializacao
    router.get('/ferramentas/especializacao/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas especializacaos
        let resposta = new Resposta()
        resposta.texto = ""
        resposta.sucesso = ""
        fncEspecializacao.listaEspecializacao(req, res, resposta);
    })

    router.get('/ferramentas/especializacao/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de especializacao
        fncEspecializacao.carregaEspecializacao(req, res);
    })
    
    router.post('/ferramentas/especializacao/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona especializacao
        fncEspecializacao.cadastraEspecializacao(req, res);
    })
    
    router.get('/ferramentas/especializacao/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta especializacao
        fncEspecializacao.deletaEspecializacao(req, res);
    })
    
    router.get('/ferramentas/especializacao/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de especializacao
        fncEspecializacao.carregaEspecializacaoEdi(req, res);
    })

    router.post('/ferramentas/especializacao/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Especializacaoimento
        fncEspecializacao.atualizaEspecializacao(req, res);
    })

//Menu Ferramentas
    //Terapia
        router.get('/ferramentas/terapia/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas terapias
            fncTerapia.listaTerapia(req, res);
            
        })

        router.get('/ferramentas/terapia/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de terapia
            fncTerapia.carregaTerapia(req, res);
        })
        
        router.post('/ferramentas/terapia/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona terapia
        fncTerapia.cadastraTerapia(req, res);

        })
        
        router.get('/ferramentas/terapia/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta terapia
            fncTerapia.deletaTerapia(req, res);
        })
        
        router.get('/ferramentas/terapia/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de terapia
            fncTerapia.carregaTerapiaEdi(req, res);
        })
        


        router.post('/ferramentas/terapia/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Terapiaimento
            fncTerapia.atualizaTerapia(req, res);
        })
        
        
   





//Menu Ferramentas
    //Funcao
        router.get('/ferramentas/funcao/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas funcaos
        fncFuncao.listaFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de funcao
            fncFuncao.carregaFuncao(req, res);
        })
        
        router.post('/ferramentas/funcao/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona funcao
            fncFuncao.cadastraFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta funcao
            fncFuncao.deletaFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de funcao
            fncFuncao.carregaFuncaoEdi(req, res);
        })
        


        router.post('/ferramentas/funcao/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Funcaoimento
            fncFuncao.atualizaFuncao(req, res);
        })
        
        
    
//Menu Ferramentas
    //Horario
        router.get('/ferramentas/horaage/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas horarios
            fncHoraAge.listaHoraage(req, res);
            
        }),

        router.get('/ferramentas/horaage/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de horario
            fncHoraAge.carregaHoraage(req, res);
        }),
        
        router.post('/ferramentas/horaage/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona horario
            fncHoraAge.cadastraHoraage(req, res);

        }),
        
        router.get('/ferramentas/horaage/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta horario
            fncHoraAge.deletaHoraage(req, res);
     
        }),
        
        router.get('/ferramentas/horaage/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de horario
            fncHoraAge.carregaHoraageEdi(req, res);
        }),
        


        router.post('/ferramentas/horaage/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Horarioimento
            fncHoraAge.atualizaHoraage(req, res);
        })
        
        

//Menu Ferramentas
    //Perfil
        router.get('/ferramentas/perfil/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas perfils
            fncPerfil.listaPerfil(req,res);
            
        })

        router.get('/ferramentas/perfil/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de perfil
            fncPerfil.carregaPerfil(req,res);
        })
        
        router.post('/ferramentas/perfil/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona perfil
            fncPerfil.cadastraPerfil(req,res);
        })
        
        router.get('/ferramentas/perfil/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta perfil
            fncPerfil.deletaPerfil(req,res);
        })
        
        router.get('/ferramentas/perfil/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de perfil
            fncPerfil.carregaPerfilEdi(req,res);
        })
        
 

        router.post('/ferramentas/perfil/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Perfilimento
            fncPerfil.atualizaPerfil(req,res);
        })



        //Menu Ferramentas
        //estado
        router.get('/ferramentas/estado/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas estados
            fncEstado.listaEstado(req, res);        
        })

        router.get('/ferramentas/estado/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de estado

            fncEstado.carregaEstado(req, res);
        })

        router.post('/ferramentas/estado/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona estado
            fncEstado.cadastraEstado(req, res);
        })

        router.get('/ferramentas/estado/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta estado
            fncEstado.deletaEstado(req, res);
        })

        router.get('/ferramentas/estado/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de estado
            fncEstado.carregaEstadoEdi(req, res);
        })

        router.post('/ferramentas/estado/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Estadoimento
            fncEstado.atualizaEstado(req, res);
        })
    
    



//Menu Ferramentas
    //Usuario
        router.get('/ferramentas/usuario/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas usuarios
          fncUsuario.listaUsuario(req, res); 
        })

        router.get('/ferramentas/usuario/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Usuário, com Ufs e Convênios.
        fncUsuario.carregaUsuario(req, res); 
        })

        router.post('/ferramentas/usuario/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona usuario
        fncUsuario.cadastraUsuario(req, res); 
        })
        
        router.get('/ferramentas/usuario/del/:id', (req,res) =>{//deleta usuario
        fncUsuario.deletaUsuario(req, res); 
        })
        
        router.get('/ferramentas/usuario/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de usuario
          fncUsuario.carregaUsuarioEdi(req, res); 
        })

        router.post('/ferramentas/usuario/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Usuarioimento
           fncUsuario.atualizaUsuario(req, res); 
        })

        router.post('/ferramentas/usuario/carregaMudarsenha', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Usuarioimento
            fncUsuario.carregaMudarsenha(req, res); 
         })

//Menu Ferramentas
    //Ajuda
        router.get('/ferramentas/ajuda', fncGeral.IsAuthenticated, (req,res) =>{
            res.render("ferramentas/ajuda")
        })
    
    //Tabela Tese
    router.get('/ferramentas/tbteste', fncGeral.IsAuthenticated, (req,res) =>{
        res.render("ferramentas/tables")
    })


 

module.exports = router


/*
Lembrar que o mês é calculado de 0 a 11 !!!
let dataAtual = new Date()
let dtNasc = new Date()
dtNasc.setFullYear(1972,10,12)
*/