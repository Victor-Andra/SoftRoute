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

//usuario, cadstro dos usuários
const usuarioClass = require("../models/usuario")
const Usuario = mongoose.model("tb_usuario")
const fncUsuario = require("../functions/fncUsuario")

//beneficiario, clientes
const beneClass = require("../models/bene")
const Bene = mongoose.model("tb_bene")
const fncBene = require("../functions/fncBene")

//Anamnese
const evoatendClass = require("../models/evoatend")
const Evoatend = mongoose.model("tb_evoatend")
const fncEvoatend = require("../functions/fncEvoatend")

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

//Folha Registro - ABA
const folregClass = require("../models/folreg")
const Folreg = mongoose.model("tb_folreg")
const fncFolreg = require("../functions/fncFolreg")

//Gráfico ABC - ABA
const grafabcClass = require("../models/grafabc")
const Grafabc = mongoose.model("tb_grafabc")
const fncGrafabc = require("../functions/fncGrafabc")

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

//Rota Base '/'
router.get('/', (req,res) =>{
    res.render("admin/index")
})

//Rota Página em Branco
router.get('/branco',(req,res) =>{
    res.render("admin/branco")
})

//Rota Página com Erro!
router.get('/erro',(req,res) =>{
    res.render("admin/erro")
})

//Rota cad usu
/*
router.get('/usuarioCad',(req,res)=>{
    res.render("ferramentas/usuario/usuarioCad")
})
*/

//Rota Login
router.get('/login',(req,res)=>{
    res.render("ferramentas/usuario/login")
})
/*
router.post('/login',(req,res,next)=>{
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
router.post('/login',(req,res,next)=>{
    
    passport.authenticate("local", {
        successRedirect: "/menu/",
        failureRedirect: "/menu/login",
        failureFlash: true
    })(req,res,next)
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
      if (err) { return next(err); }
      res.redirect('/menu/login');
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
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncAgenda.carregaAgendaCadastro(req, res, resposta);
})

router.get("/agenda/cadF/:dia/:mes/:ano/:hora", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Agenda, com Ufs e Convênios.
    fncAgenda.carregaAgendaEdiF(req, res);
})

router.get("/agenda/lisL/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda com FILTROS, FILTRADA.
    console.log("lista")
    fncAgenda.carregaAgendaL(req, res);
})

router.get("/agenda/lisG/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Geral.
    console.log("lista")
    fncAgenda.carregaAgendaG(req, res);
})

router.post("/agenda/filG/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Geral.
    console.log("lista")
    fncAgenda.carregaAgendaFilG(req, res);
})

router.get("/agenda/lisS/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal.
    console.log("Agenda Semanal")
    fncAgenda.carregaAgendaS(req, res);
})

router.post("/agenda/filS/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal.
    console.log("lista")
    fncAgenda.carregaAgendaFilS(req, res);
})

router.get("/agenda/lisB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de beneficiarios.
    console.log("Agenda Bene")
    fncAgenda.carregaAgendaB(req, res);//CARREGAAGENDABENE
})

router.post("/agenda/filB", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de beneficiarios.
    fncAgenda.carregaAgendaFilB(req, res);
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

router.get("/agenda/lisA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de laudos.
    fncAgenda.filtraAgendaA(req, res);
})

router.post("/agenda/filA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de filtro de laudos.
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

router.post('/agenda/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona fornec
    fncAgenda.cadastraAgenda(req, res);
})


router.get('/agenda/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta agenda
    fncAgenda.deletaAgenda(req, res);
})

router.get('/agenda/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaEdi(req, res);
})

router.get('/agenda/ediTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaAgendaEdiTemp(req, res);
})

router.post('/agenda/atualizaTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.atualizaAgendaTemp(req, res);
})

router.get('/agenda/cadTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaAgendaTemp(req, res);
})

router.post('/agenda/addTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para salvar a edição de agenda diária
    fncAgenda.cadastraAgendaTemp(req, res);
})

router.post('/agenda/cadE/atualiza', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.atualizaAgenda(req, res);
})

/*
router.get('/agenda/atualiza/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.atualizaAgendaCadE(req, res);
})
*/

router.post('/agenda/copiaSemana', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.copiaSemanaAgendaGeral(req, res);
})


router.post('/agenda/converteDia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.converteAgendaEmAtend(req, res);
})

// Visualizar Agenda
/*
router.get("/agenda/vis", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro A AGENDA.
    fncAgenda.carregaAgendaVis(req, res);
})
*/



//Menu Atendimento   

router.get("/atendimento/lis",(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtend.listaAtend(req, res);
})



router.get('/atendimento/cad',(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtend.carregaAtend(req,res);
})

router.post('/atendimento/add',(req,res) =>{//adiciona atend
    fncAtend.cadastraAtend(req,res);
})

router.get('/atendimento/del/:id', (req,res) =>{//deleta atend
    fncAtend.deletaAtend(req, res);
})

router.get('/atendimento/edi/:id', (req,res) =>{//direciona para a edição de atend
    fncAtend.carregaAtendEdi(req, res);
})

router.post('/atendimento/atualizar',(req,res) =>{//atualiza o cadastro da Atendimento
    fncAtend.atualizaAtend(req , res);
})

  

//Relatório Individual de Valores de Atendimento por Beneficiário.
//Emite uma relação de todos os valores de atendimentos realizados pelo beneficiário
//pagos pelos convênios, incluindo particular, num determinado período de tempo.
    router.get('/atendimento/relatendval',(req,res) =>{
        fncAtend.relAtendimentoVal(req,res)
    })

    router.post('/atendimento/relatendvals',(req,res) =>{
        fncAtend.relAtendimentoValFiltro(req,res)
    })

//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
router.get('/atendimento/relatendInd/:id',(req,res) =>{
        fncAtend.carregaAtendIndBene(req, res);
    })


//Menu Financeiro / AtendAdm
//Menu AtendAdm   


router.get("/financeiro/atendadm/lis",(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtendAdm.listarAtendAdm(req,res);
})





router.get('/financeiro/atendadm/cad',(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtendAdm.carregaAtendAdm(req,res);
})


router.post('/financeiro/atendadm/add',(req,res) =>{//adiciona atend
    
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
})

router.get('/financeiro/atendadm/del/:id', (req,res) =>{//deleta atend
    fncAtendAdm.deletaAtendAdm(req, res);
})

router.get('/financeiro/atendadm/edi/:id', (req,res) =>{//direciona a edição de atend
    fncAtendAdm.carregaAtendAdmEdi(req,res);
    /*
    Atend.findById(req.params.id).then((atend) =>{
        res.render('financeiro/atendadm/atendAdmEdi', atend)
    }).catch((err) =>{
        console.log(err)
        res.render('admin/erro')
    })
    */
})

router.post('/financeiro/atendadm/atualizar',(req,res) =>{//atualiza o cadastro da Atendimento
    fncAtendAdm.atualizaAtendAdm(req, res);
})

//Financeiro / Fornecedor
//Menu Fornecedor   
router.get('/financeiro/fornecedor/lis',(req,res) =>{//lista todas fornecs
    fncFornec.listaFornec(req, res);
})

router.get('/financeiro/fornecedor/cad',(req,res) =>{//direciona o cadstro de fornec.
    fncFornec.carregaFornecCad(req, res);
})

router.post('/financeiro/fornecedor/add',(req,res) =>{//adiciona fornec
    fncFornec.cadastraFornec(req, res);

})

router.get('/financeiro/fornecedor/del/:id', (req,res) =>{//deleta fornec
    fncFornec.deletaFornec(req, res);
})

router.get('/financeiro/fornecedor/edi/:id', (req,res) =>{//direciona a edição de fornec
    fncFornec.carregaFornecEdi(req, res);
})

router.post('/financeiro/fornecedor/atualizar',(req,res) =>{//atualiza o cadastro da Fornecimento
    fncFornec.atualizaFornec(req, res);
})

//Financeiro / categoria
router.get('/financeiro/despesa/categoria/lis',(req,res) =>{//lista todas categorias
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncDebitCateg.listaDebitcateg(req, res, resposta);
})

router.get('/financeiro/despesa/categoria/cad',(req,res) =>{//direciona o cadstro de categoria
    fncDebitCateg.carregaDebitcateg(req, res);
})

router.post('/financeiro/despesa/categoria/add',(req,res) =>{//adiciona categoria
    fncDebitCateg.cadastraDebitcateg(req, res);
})

router.get('/financeiro/despesa/categoria/del/:id', (req,res) =>{//deleta categoria
    fncDebitCateg.deletaDebitcateg(req, res);
})

router.get('/financeiro/despesa/categoria/edi/:id', (req,res) =>{//direciona a edição de categoria
    fncDebitCateg.carregaDebitcategEdi(req, res);
})

router.post('/financeiro/despesa/categoria/atualizar',(req,res) =>{//atualiza o cadastro da categoria
    fncDebitCateg.atualizaDebitcateg(req, res);
})

//Financeiro / sub-categoria
router.get('/financeiro/despesa/subcategoria/lis',(req,res) =>{//lista todas subcategorias
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncDebitSubcateg.listaDebitsubcateg(req, res, resposta);
})

router.get('/financeiro/despesa/subcategoria/cad',(req,res) =>{//direciona o cadstro de subcategoria
    fncDebitSubcateg.carregaDebitsubcateg(req, res);
})

router.post('/financeiro/despesa/subcategoria/add',(req,res) =>{//adiciona subcategoria
    console.log("passando")
    fncDebitSubcateg.cadastraDebitsubcateg(req, res);
})

router.get('/financeiro/despesa/subcategoria/del/:id', (req,res) =>{//deleta subcategoria
    fncDebitSubcateg.deletaDebitsubcateg(req, res);
})

router.get('/financeiro/despesa/subcategoria/edi/:id', (req,res) =>{//direciona a edição de subcategoria
    fncDebitSubcateg.carregaDebitsubcategEdi(req, res);
})

router.post('/financeiro/despesa/subcategoria/atualizar',(req,res) =>{//atualiza o cadastro da subcategoria
    fncDebitSubcateg.atualizaDebitsubcateg(req, res);
})

//Financeiro / Crédito
//Menu Crédito   
router.get('/financeiro/receita/lis',(req,res) =>{//lista todas credits
    fncCredit.listar(req,res);
})

router.get('/financeiro/receita/cad',(req,res) =>{//direciona o cadstro de credit
    res.render("financeiro/receita/creditCad")
})

router.post('/financeiro/receita/add',(req,res) =>{//adiciona credit
    fncCredit.adicionar(req,res);
})

router.get('/financeiro/receita/del/:id', (req,res) =>{//deleta credit[]
    fncCredit.delete(req,res);
})

router.get('/financeiro/receita/edi/:id', (req,res) =>{//direciona a edição de credit
    fncCredit.carregaEditar(req,res);
})

router.post('/financeiro/receita/atualizar',(req,res) =>{//atualiza o cadastro da Creditimento
    fncCredit.atualizar(req,res);
})

//Financeiro / Débito
//Menu Débito   
router.get('/financeiro/despesa/lis',(req,res) =>{//lista todas debits      
    fncDebit.listar(req,res);
})

router.get('/financeiro/despesa/ges',(req,res) =>{//lista todas debits      
    fncFinanceiro.listaRelContasAPagar(req,res);
})

router.get('/financeiro/despesa/cad',(req,res) =>{//direciona o cadstro de debit
    fncDebit.carregaDebit(req,res)
})

router.post('/financeiro/despesa/add',(req,res) =>{//adiciona debit
    fncDebit.adicionar(req,res);
})

router.get('/financeiro/despesa/del/:id', (req,res) =>{//deleta debit
    fncDebit.listar(req,res)
})

router.get('/financeiro/despesa/edi/:id', (req,res) =>{//direciona a edição de debit
    fncDebit.carregaEditar(req,res)
})

router.post('/financeiro/despesa/atualizar',(req,res) =>{//atualiza o cadastro da Debitimento
    fncDebit.atualizar(req,res)
})

//Menu Beneficiario
//Bene    
    router.get('/beneficiario/lis',(req,res) =>{//lista todas benes
        fncBene.listaBene(req, res);        
    })

    router.get('/beneficiario/cad',(req,res) =>{//direciona o cadastro de bene, com Ufs e Convênios.
        fncBene.carregaBene(req, res); 
    })

    router.get('/beneficiario/imp/:id', (req,res) =>{//direciona a edição de bene
        fncBene.listaBeneImp(req, res); 
    })

    router.post('/beneficiario/add',(req,res) =>{//adiciona bene
      fncBene.cadastraBene(req, res); 
    })

    router.get('/beneficiario/del/:id', (req,res) =>{//deleta bene
      fncBene.deletaBene(req, res); 
    })

    router.get('/beneficiario/edi/:id', (req,res) =>{//direciona a edição de bene
       fncBene.carregaBeneEdi(req, res); 
    })

    router.post('/beneficiario/atualizar',(req,res) =>{//atualiza o cadastro da Beneficiario
        fncBene.atualizaBene(req, res); 
    })

//Evolucao
    router.get('/beneficiario/evolucao/lis',(req,res) =>{
        fncEvolucao.listaEvolucao(req, res); 
    })

//Menu Beneficiario Escola
router.get('/beneficiario/escola/lis',(req,res) =>{//lista todas escolas
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncEscola.listaEscola(req, res, resposta);        
})

router.get('/beneficiario/escola/cad',(req,res) =>{//direciona o cadastro de escolas
    fncEscola.carregaEscola(req, res);//coment
})

router.get('/beneficiario/escola/imp/:id', (req,res) =>{//direciona a edição de escola
    fncEscola.listaEscola(req, res); 
})

router.post('/beneficiario/escola/add',(req,res) =>{//adiciona escola
    console.log("post")
    fncEscola.cadastraEscola(req, res); 
})

router.get('/beneficiario/escola/del/:id', (req,res) =>{//deleta escola
    fncEscola.deletaEscola(req, res); 
})

router.get('/beneficiario/escola/edi/:id', (req,res) =>{//direciona a edição de escola
    fncEscola.carregaEscolaEdi(req, res); 
})

router.post('/beneficiario/escola/atualizar',(req,res) =>{//atualiza o cadastro da escola
    fncEscola.atualizaEscola(req, res); 
})

//Menu Beneficiario /Sessao
//Tabela de Requisição de Atendimentos.
//cria uma tabela com as necessidades de cada beneficiário segundo as especialidades,
//Essa tabela de acompanhamento é atualizada cada atendimento realizado.
//A tabela de ananmese é a base para a geração da agenda.
router.get('/beneficiario/sessao/cad',(req,res) =>{
fncSessao.carregaSessao(req, res);
})


router.post('/beneficiario/sessao/add',(req,res) =>{//adiciona bene
fncSessao.cadastraSessao(req, res);
})

router.get('/beneficiario/sessao/del/:id', (req,res) =>{//deleta bene
fncSessao.deletaSessao(req, res);
})



//Menu Beneficiario /Sessaoese
//Edita a Requisição de Atendimentos.
router.get('/beneficiario/sessao/edi/:id', (req,res) =>{
 fncSessao.carregaSessaoEdi(req, res);
})

router.post('/beneficiario/sessao/atualizar',(req,res) =>{//atualiza o cadastro da Beneimento
 fncSessao.atualizaSessao(req, res);
})


//Menu Beneficiario /Sessaos
//Lista de Requisição de Atendimentos.
router.get('/beneficiario/sessao/lis',(req,res) =>{
fncSessao.listaSessao(req, res);
})


//Lista de Requisição de Tabela com QT de Atendimentos por beneficiario.
router.get('/beneficiario/sessao/listab/:id',(req,res) =>{
fncSessao.listaSessaoTab(req, res); 
})

//Menu Evolução dos Atendimentos ** Area Tecnicos   
//Lista Todos os Atendimentos por Data Atual e Beneficiário vinculados pela AGENDA do Dia
router.get('/area/evoatendlis',(req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncEvoatend.listaEvoatend(req, res);
})

//Menu Anamnese ** Area Tecnicos   
//Lista Todos as anamneses por Data, Beneficiário
router.get('/area/anamn/anamnlis',(req,res) =>{//direciona para a lista de anamneses
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncAnamn.listaAnamn(req, res, resposta);
})
//Carrega Cadastro
router.get('/area/anamn/anamncad',(req,res) =>{//direciona o cadstro da Anamneses
    fncAnamn.carregaAnamn(req, res);
})

router.post('/area/anamn/add',(req,res) =>{//adiciona Anamnese
    console.log("post")
    fncAnamn.cadastraAnamn(req, res); 
})

router.get('/area/anamn/edi/:id', (req,res) =>{//direciona a edição da Anemnese
    fncAnamn.carregaAnamnEdi(req, res); 
})

//Menu Bordo ** Area Tecnicos   
//Lista Todos os Diários de Bordo por Data, Beneficiário
router.get('/area/bordo/bordolis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncBordo.listaBordo(req, res);
})
//Carrega Cadastro
router.get('/area/bordo/bordocad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncBordo.carregaBordo(req, res);
})

//Menu Plano de Tratamentos ** Area Tecnicos   
//Lista Todos os Tipos de Tratamento num Relatório Só categorizado por Tipo, Data, Beneficiário
router.get('/area/plano/tratlis',(req,res) =>{//direciona o cadstro de Plano de Tratamentos, com Ufs e Convênios.
    fncTrat.listaTrat(req, res);
})
//Carrega Cadastro
router.get('/area/plano/tratcad',(req,res) =>{//direciona o cadstro de Plano de Tratamentos, com Ufs e Convênios.
    fncTrat.carregaTrat(req,res);
})
//Adiciona Registro
router.post('/area/plano/tratadd',(req,res) =>{//adiciona Plano de Tratamentos Padrao
    fncTrat.cadastraTrat(req,res);
})
//Atualiza Regitros
router.post('/area/plano/tratatualizar',(req,res) =>{//atualiza o Plano de Tratamentos Padrao
    fncTrat.atualizaTrat(req , res);
})

//Deleta Exclui Registros
router.get('/area/plano/tratdel/:id', (req,res) =>{//deleta Plano de Tratamentos Padrao
    fncTrat.deletaTrat(req, res);
})

//Menu Laudos ** Area Tecnicos   
//Carrega Cadastro
router.get('/area/laudo/laudocad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncLaudo.carregaLaudo(req, res);
})

//Lista Todos os Laudispor Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/laudo/laudolis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncLaudo.listaLaudo(req, res);
})

//Menu Evoluções ** Area Tecnicos   
//Carrega Cadastro
router.get('/area/evol/evolcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncEvol.carregaEvol(req, res);
})

//Lista Todos os Laudispor Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/evol/evollis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncEvol.listaEvol(req, res);
})

//Menu VB-MAPPS ** Area Tecnicos   
//Carrega Cadastro
router.get('/area/mapp/mappcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncMapp.carregaMapp(req, res);
})

//Lista Todos os VB-MAPP's Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/mapp/mapplis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncMapp.listaMapp(req, res);
})

//Menu Sonda ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/sonda/sondacad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncSonda.carregaSonda(req, res);
})

//Lista Sonda por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/sonda/sondalis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncSonda.listaSonda(req, res);
})

//Menu Programas ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/prog/progcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncProg.carregaProg(req, res);
})

//Lista Progrmas por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/prog/proglis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncProg.listaProg(req, res);
})

//Menu Gráfico do Programa ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/grafprog/grafprogcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncGrafprog.carregaGrafprog(req, res);
})

//Lista Sonda por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/grafprog/grafproglis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncGrafprog.listaGrafprog(req, res);
})

//Menu SET ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/set/setcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncSet.carregaSet(req, res);
})

//Lista SET por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/set/setlis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncSet.listaSet(req, res);
})

//Menu Folha de Registro ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/folreg/folregcad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncFolreg.carregaFolreg(req, res);
})

//Lista Folha Registro ** Area Tecnicos e ABA
router.get('/area/aba/folreg/folreglis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncFolreg.listaFolreg(req, res);
})

//Menu Gráfico ABC ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/grafabc/grafabccad',(req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncGrafabc.carregaGrafabc(req, res);
})

//Lista Gráfico ABC por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/grafabc/grafabclis',(req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncGrafabc.listaGrafabc(req, res);
})

//Menu Convenio
//Sub Menu Conv
    
router.get('/convenio/conv/lis',(req,res) =>{//lista todas os registros dos convênios
fncConv.listaConv(req, res);    
})

router.get('/convenio/conv/cad',(req,res) =>{//direciona para o cadastro de novos convênios
fncConv.carregaConv(req, res); 
})

router.post('/convenio/conv/add',(req,res) =>{//adiciona registro no Convênio
fncConv.cadastraConv(req, res); 

})

router.get('/convenio/conv/del/:id', (req,res) =>{//deleta registro do convênio
fncConv.deletaConv(req, res); 
})

router.get('/convenio/conv/edi/:id', (req,res) =>{//direciona a edição de registro no convênio
fncConv.carregaConvEdi(req, res); 
})

router.post('/convenio/conv/atualizar',(req,res) =>{//atualiza no convênio
fncConv.atualizaConv(req, res);
})


//Relatório Individual de Valores de Atendimento por Beneficiário.
//Emite uma relação de todos os valores de atendimentos realizados pelo beneficiário
//pagos pelos convênios, incluindo particular, num determinado período de tempo.
router.get('/convenio/conv/relatendconvval',(req,res) =>{
    res.render("convenio/conv/relatendconvval")
})


//Menu Convenio/ConvCre 
    //convcre
    router.get('/convenio/convcre/lis',(req,res) =>{//lista todas convcres
        fncConvcre.listaConvcre(req,res);
    })

    router.get('/convenio/convcre/cad',(req,res) =>{//direciona o cadstro de bene, com Ufs e Convênios.
        fncConvcre.carregaConvcre(req,res);
    })

    router.post('/convenio/convcre/add',(req,res) =>{//adiciona convcre
        fncConvcre.cadastraConvcre(req,res);
    })

    router.get('/convenio/convcre/del/:id', (req,res) =>{//deleta convcre
        fncConvcre.deletaConvcre(req,res);
    })

    router.get('/convenio/convcre/edi/:id', (req,res) =>{//direciona a edição de convcre
        fncConvcre.carregaConvcreEdi(req,res);
    })

    router.post('/convenio/convcre/atualizar',(req,res) =>{//atualiza o cadastro da Convcreimento
        fncConvcre.editaConvcre(req, res);
    })

//Menu Convenio/Convdeb 
    //convdeb
    router.get('/convenio/convdeb/lis',(req,res) =>{//lista todas convdebs
        fncConvdeb.listaConvdeb(req,res);
    })

    router.get('/convenio/convdeb/cad',(req,res) =>{//direciona o cadstro de Convdeb, com Ufs e Convênios.
        fncConvdeb.carregaConvdeb(req,res);
    })

    router.post('/convenio/convdeb/add',(req,res) =>{//adiciona convdeb
        fncConvdeb.cadastraConvdeb(req,res);
    })

    router.get('/convenio/convdeb/del/:id', (req,res) =>{//deleta convdeb
        fncConvdeb.deletaConvdeb(req,res);
    })

    router.get('/convenio/convdeb/edi/:id', (req,res) =>{//direciona a edição de convdeb
        fncConvdeb.carregaConvdebEdi(req,res);
    })

    router.post('/convenio/convdeb/atualizar',(req,res) =>{//atualiza o cadastro da convdeb
        fncConvdeb.editarConvdev(req,res);
    })


//Menu Financeiro
//Menu Conrrente, conta
    
router.get('/financeiro/corrente/lis',(req,res) =>{//lista toda os registros da conta corrente
    fncCorrente.listaCorrente(req, res);           
})

router.get('/financeiro/corrente/cad',(req,res) =>{//direciona para o cadastro de conta corrente
    fncCorrente.carregaCorrente(req, res);     
})


router.post('/financeiro/corrente/add',(req,res) =>{//adiciona registro a conta corrente
    fncCorrente.cadastraCorrente(req, res);
})

router.get('/financeiro/corrente/del/:id', (req,res) =>{//deleta registro na conta corrente 
    fncCorrente.deletaCorrente(req, res);
})

router.get('/financeiro/corrente/edi/:id', (req,res) =>{//direciona para a edição dos registros na conta corrente
    fncCorrente.carregaCorrenteEdi(req, res);
})

router.post('/financeiro/corrente/atualizar',(req,res) =>{//atualiza o registro na conta corrente
    fncCorrente.atualizaCorrente(req, res);
})




//Menu Ferramentas
    //sala
        router.get('/ferramentas/sala/lis',(req,res) =>{//lista todas salas
            fncSala.listaSala(req, res);
        })

        router.get('/ferramentas/sala/cad',(req,res) =>{//direciona o cadstro de sala
            fncSala.carregaSala(req, res);
        })

        router.post('/ferramentas/sala/add',(req,res) =>{//adiciona sala
            fncSala.cadastraSala(req, res);
        })

        router.get('/ferramentas/sala/del/:id', (req,res) =>{//deleta sala
            fncSala.deletaSala(req, res);
        })

        router.get('/ferramentas/sala/edi/:id', (req,res) =>{//direciona a edição de sala
            fncSala.carregaSalaEdi(req, res);
        })

        router.post('/ferramentas/sala/atualizar',(req,res) =>{//atualiza o cadastro da Salaimento
            fncSala.atualizaSala(req, res);
        })
        
        

//Menu Ferramentas
    //Empresa
        router.get('/ferramentas/empresa/lis',(req,res) =>{//lista todas empresas
            fncEmpresa.listaEmpresa(req, res);
        })
        
        router.get('/ferramentas/empresa/cad',(req,res) =>{//direciona o cadstro de empresa.
            fncEmpresa.carregaEmpresa(req, res);
        })

        router.post('/ferramentas/empresa/add',(req,res) =>{//adiciona empresa
        fncEmpresa.cadastraEmpresa(req, res);

        })
        
        router.get('/ferramentas/empresa/del/:id', (req,res) =>{//deleta empresa
            fncEmpresa.deletaEmpresa(req, res);
        })
        
        router.get('/ferramentas/empresa/edi/:id', (req, res) =>{//direciona a edição de empresa
            fncEmpresa.carregaEmpresaEdi(req, res);
        })
   
        router.post('/ferramentas/empresa/atualizar',(req,res) =>{//atualiza o cadastro da Empresa
            fncEmpresa.atualizaEmpresa(req, res);
        })

//Menu Ferramentas
    //Especialidade
        router.get('/ferramentas/especialidade/lis',(req,res) =>{//lista todas especialidades
            let resposta = new Resposta()
            resposta.texto = ""
            resposta.sucesso = ""
            fncEspecialidade.listaEspecialidade(req, res, resposta);
            
        })

        router.get('/ferramentas/especialidade/cad',(req,res) =>{//direciona o cadstro de especialidade
            fncEspecialidade.carregaEspecialidade(req, res);
        })
        
        router.post('/ferramentas/especialidade/add',(req,res) =>{//adiciona especialidade
            fncEspecialidade.cadastraEspecialidade(req, res);
        })
        
        router.get('/ferramentas/especialidade/del/:id', (req,res) =>{//deleta especialidade
            fncEspecialidade.deletaEspecialidade(req, res);
        })
        
        router.get('/ferramentas/especialidade/edi/:id', (req,res) =>{//direciona a edição de especialidade
            fncEspecialidade.carregaEspecialidadeEdi(req, res);
        })

        router.post('/ferramentas/especialidade/atualizar',(req,res) =>{//atualiza o cadastro da Especialidadeimento
            fncEspecialidade.atualizaEspecialidade(req, res);
        })

//Menu Ferramentas
    //Especializacao
    router.get('/ferramentas/especializacao/lis',(req,res) =>{//lista todas especializacaos
        let resposta = new Resposta()
        resposta.texto = ""
        resposta.sucesso = ""
        fncEspecializacao.listaEspecializacao(req, res, resposta);
    })

    router.get('/ferramentas/especializacao/cad',(req,res) =>{//direciona o cadstro de especializacao
        fncEspecializacao.carregaEspecializacao(req, res);
    })
    
    router.post('/ferramentas/especializacao/add',(req,res) =>{//adiciona especializacao
        fncEspecializacao.cadastraEspecializacao(req, res);
    })
    
    router.get('/ferramentas/especializacao/del/:id', (req,res) =>{//deleta especializacao
        fncEspecializacao.deletaEspecializacao(req, res);
    })
    
    router.get('/ferramentas/especializacao/edi/:id', (req,res) =>{//direciona a edição de especializacao
        fncEspecializacao.carregaEspecializacaoEdi(req, res);
    })

    router.post('/ferramentas/especializacao/atualizar',(req,res) =>{//atualiza o cadastro da Especializacaoimento
        fncEspecializacao.atualizaEspecializacao(req, res);
    })

//Menu Ferramentas
    //Terapia
        router.get('/ferramentas/terapia/lis',(req,res) =>{//lista todas terapias
            fncTerapia.listaTerapia(req, res);
            
        })

        router.get('/ferramentas/terapia/cad',(req,res) =>{//direciona o cadstro de terapia
            fncTerapia.carregaTerapia(req, res);
        })
        
        router.post('/ferramentas/terapia/add',(req,res) =>{//adiciona terapia
        fncTerapia.cadastraTerapia(req, res);

        })
        
        router.get('/ferramentas/terapia/del/:id', (req,res) =>{//deleta terapia
            fncTerapia.deletaTerapia(req, res);
        })
        
        router.get('/ferramentas/terapia/edi/:id', (req,res) =>{//direciona a edição de terapia
            fncTerapia.carregaTerapiaEdi(req, res);
        })
        


        router.post('/ferramentas/terapia/atualizar',(req,res) =>{//atualiza o cadastro da Terapiaimento
            fncTerapia.atualizaTerapia(req, res);
        })
        
        
   





//Menu Ferramentas
    //Funcao
        router.get('/ferramentas/funcao/lis',(req,res) =>{//lista todas funcaos
        fncFuncao.listaFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/cad',(req,res) =>{//direciona o cadstro de funcao
            fncFuncao.carregaFuncao(req, res);
        })
        
        router.post('/ferramentas/funcao/add',(req,res) =>{//adiciona funcao
            fncFuncao.cadastraFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/del/:id', (req,res) =>{//deleta funcao
            fncFuncao.deletaFuncao(req, res);
        })
        
        router.get('/ferramentas/funcao/edi/:id', (req,res) =>{//direciona a edição de funcao
            fncFuncao.carregaFuncaoEdi(req, res);
        })
        


        router.post('/ferramentas/funcao/atualizar',(req,res) =>{//atualiza o cadastro da Funcaoimento
            fncFuncao.atualizaFuncao(req, res);
        })
        
        
    
//Menu Ferramentas
    //Horario
        router.get('/ferramentas/horaage/lis',(req,res) =>{//lista todas horarios
            fncHoraAge.listaHoraage(req, res);
            
        }),

        router.get('/ferramentas/horaage/cad',(req,res) =>{//direciona o cadstro de horario
            fncHoraAge.carregaHoraage(req, res);
        }),
        
        router.post('/ferramentas/horaage/add',(req,res) =>{//adiciona horario
            fncHoraAge.cadastraHoraage(req, res);

        }),
        
        router.get('/ferramentas/horaage/del/:id', (req,res) =>{//deleta horario
            fncHoraAge.deletaHoraage(req, res);
     
        }),
        
        router.get('/ferramentas/horaage/edi/:id', (req,res) =>{//direciona a edição de horario
            fncHoraAge.carregaHoraageEdi(req, res);
        }),
        


        router.post('/ferramentas/horaage/atualizar',(req,res) =>{//atualiza o cadastro da Horarioimento
            fncHoraAge.atualizaHoraage(req, res);
        })
        
        

//Menu Ferramentas
    //Perfil
        router.get('/ferramentas/perfil/lis',(req,res) =>{//lista todas perfils
            fncPerfil.listaPerfil(req,res);
            
        })

        router.get('/ferramentas/perfil/cad',(req,res) =>{//direciona o cadstro de perfil
            fncPerfil.carregaPerfil(req,res);
        })
        
        router.post('/ferramentas/perfil/add',(req,res) =>{//adiciona perfil
            fncPerfil.cadastraPerfil(req,res);
        })
        
        router.get('/ferramentas/perfil/del/:id', (req,res) =>{//deleta perfil
            fncPerfil.deletaPerfil(req,res);
        })
        
        router.get('/ferramentas/perfil/edi/:id', (req,res) =>{//direciona a edição de perfil
            fncPerfil.carregaPerfilEdi(req,res);
        })
        
 

        router.post('/ferramentas/perfil/atualizar',(req,res) =>{//atualiza o cadastro da Perfilimento
            fncPerfil.atualizaPerfil(req,res);
        })



        //Menu Ferramentas
        //estado
        router.get('/ferramentas/estado/lis',(req,res) =>{//lista todas estados
            fncEstado.listaEstado(req, res);        
        })

        router.get('/ferramentas/estado/cad',(req,res) =>{//direciona o cadstro de estado

            fncEstado.carregaEstado(req, res);
        })

        router.post('/ferramentas/estado/add',(req,res) =>{//adiciona estado
            fncEstado.cadastraEstado(req, res);
        })

        router.get('/ferramentas/estado/del/:id', (req,res) =>{//deleta estado
            fncEstado.deletaEstado(req, res);
        })

        router.get('/ferramentas/estado/edi/:id', (req,res) =>{//direciona a edição de estado
            fncEstado.carregaEstadoEdi(req, res);
        })

        router.post('/ferramentas/estado/atualizar',(req,res) =>{//atualiza o cadastro da Estadoimento
            fncEstado.atualizaEstado(req, res);
        })
    
    



//Menu Ferramentas
    //Usuario
        router.get('/ferramentas/usuario/lis',(req,res) =>{//lista todas usuarios
          fncUsuario.listaUsuario(req, res); 
        })

        router.get('/ferramentas/usuario/cad',(req,res) =>{//direciona o cadstro de Usuário, com Ufs e Convênios.
        fncUsuario.carregaUsuario(req, res); 
        })

        router.post('/ferramentas/usuario/add',(req,res) =>{//adiciona usuario
        fncUsuario.cadastraUsuario(req, res); 
        })
        
        router.get('/ferramentas/usuario/del/:id', (req,res) =>{//deleta usuario
        fncUsuario.deletaUsuario(req, res); 
        })
        
        router.get('/ferramentas/usuario/edi/:id', (req,res) =>{//direciona a edição de usuario
          fncUsuario.carregaUsuarioEdi(req, res); 
        })

        router.post('/ferramentas/usuario/atualizar',(req,res) =>{//atualiza o cadastro da Usuarioimento
           fncUsuario.atualizaUsuario(req, res); 
        })

//Menu Ferramentas
    //Ajuda
        router.get('/ferramentas/ajuda',(req,res) =>{
            res.render("ferramentas/ajuda")
        })
    
    //Tabela Tese
    router.get('/ferramentas/tbteste',(req,res) =>{
        res.render("ferramentas/tables")
    })


 

module.exports = router


/*
Lembrar que o mês é calculado de 0 a 11 !!!
let dataAtual = new Date()
let dtNasc = new Date()
dtNasc.setFullYear(1972,10,12)
*/