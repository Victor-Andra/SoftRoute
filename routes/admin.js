const express = require('express')
const router = express.Router()
const multer = require('multer')
const mongoose = require("mongoose")
const $ = require('jquery')
const {autenticador} = require("../helpers/autenticador")
let application = require('../routes/admin')
const connections = require('../serverConnection');
//funções gerais
const fncGeral = require("../functions/fncGeral")
const { getModel } = require('../functions/fncGeral');
//Aviso - Dashboard
const avisoClass = require("../models/aviso")
var Aviso = getModel("softroute", 'tb_aviso', avisoClass.AvisoSchema);//getModel("softroute", 'tb_aviso', avisoClass.AvisoSchema)
const fncAviso = require("../functions/fncAviso")

//empresa
const empresaClass = require("../models/empresa")
var Empresa = getModel("PortalDoUsuario", 'tb_empresa', empresaClass.EmpresaSchema);//getModel("softroute", 'tb_empresa', empresaClass.EmpresaSchema)
const fncEmpresa = require("../functions/fncEmpresa")

//especialidade
const especialidadeClass = require("../models/especialidade")
var Especialidade = getModel("softroute", 'tb_especialidade', especialidadeClass.EspecialidadeSchema);//getModel("softroute", 'tb_especialidade', especialidadeClass.EspecialidadeSchema)
const fncEspecialidade = require("../functions/fncEspecialidade")

//especialidade do Plano de Tratamento
const especialidadePlanoClass = require("../models/especialidadePlano")
var EspecialidadePlano = getModel("softroute", 'tb_especialidadePlano', especialidadePlanoClass.EspecialidadePlanoSchema);//getModel("softroute", 'tb_especialidadePlano', especialidadePlanoClass.EspecialidadePlanoSchema)
const fncEspecialidadePlano = require("../functions/fncEspecialidadePlano")

//especializacao
const especializacaoClass = require("../models/especializacao")
var Especializacao = getModel("softroute", 'tb_especializacao', especializacaoClass.EspecializacaoSchema);//getModel("softroute", 'tb_especializacao', especializacaoClass.EspecializacaoSchema)
const fncEspecializacao = require("../functions/fncEspecializacao")

//Método, Metodo, metodo
const metodoClass = require("../models/metodo")
var Metodo = getModel("softroute", 'tb_metodo', metodoClass.MetodoSchema);//getModel("softroute", 'tb_metodo', metodoClass.MetodoSchema)
const fncMetodo = require("../functions/fncMetodo")

//Métout, Metout, metout, Outros Métodos, 
const metoutClass = require("../models/metout")
var Metout = getModel("softroute", 'tb_metout', metoutClass.MetoutSchema);//getModel("softroute", 'tb_metout', metoutClass.MetoutSchema)
const fncMetout = require("../functions/fncMetout")

//escola
const escolaClass = require("../models/escola")
var Escola = getModel("softroute", 'tb_escola', escolaClass.EscolaSchema);//getModel("softroute", 'tb_escola', escolaClass.EscolaSchema)
const fncEscola = require("../functions/fncEscola")

//funções, cargos dos funcionários
const funcaoClass = require("../models/funcao")
var Funcao = getModel("softroute", 'tb_funcao', funcaoClass.FuncaoSchema);//getModel("softroute", 'tb_funcao', funcaoClass.FuncaoSchema)
const fncFuncao = require("../functions/fncFuncao")

//horario Agenda
const horaageClass = require("../models/horaAge")
var Horaage = getModel("softroute", 'tb_horaage', horaageClass.HoraageSchema);//getModel("softroute", 'tb_horaage', horaageClass.HoraageSchema)
const fncHoraAge = require("../functions/fncHoraAge")

//perfil, níveis de acesso
const perfilClass = require("../models/perfil")
var Perfil = getModel("softroute", 'tb_perfil', perfilClass.PerfilSchema);//getModel("softroute", 'tb_perfil', perfilClass.PerfilSchema)
const fncPerfil = require("../functions/fncPerfil")

//usufunc, funcionalidades que os usuários podem ter acesso
const usufuncClass = require("../models/usufunc")
var Usufunc = getModel("PortalDoUsuario", 'tb_usufunc', usufuncClass.UsufuncSchema);//getModel("softroute", 'tb_usufunc', usufuncClass.UsufuncSchema)
const fncUsufunc = require("../functions/fncUsufunc")

//usufunc, funcionalidades que os usuários podem ter acesso
const usupermisClass = require("../models/usupermis")
var Usupermis = getModel("PortalDoUsuario", 'tb_usupermis', usupermisClass.UsupermisSchema);//getModel("PortalDoUsuario", 'tb_usupermis', usupermisClass.UsupermisSchema)
const fncUsupermis = require("../functions/fncUsupermis")

//sala, onde são realizadas os atendimentos
const salaClass = require("../models/sala")
var Sala = getModel("softroute", 'tb_sala', salaClass.SalaSchema);//getModel("softroute", 'tb_sala', salaClass.SalaSchema)
const fncSala = require("../functions/fncSala")

//Saúde dos colaboradores Ficha, onde são cadastrados as informações de saúde dos colaboradores
//Para emergência médica e hospitalar/SAMU
const saudecolabClass = require("../models/saudecolab")
var Saudecolab = getModel("softroute", 'tb_saudecolab', saudecolabClass.SaudecolabSchema);//getModel("softroute", 'tb_saudecolab', saudecolabClass.SaudecolabSchema)
const fncSaudecolab= require("../functions/fncSaudecolab")

//terapia, tipos de terapias realiazadas
const terapiaClass = require("../models/terapia")
var Terapia = getModel("softroute", 'tb_terapia', terapiaClass.TerapiaSchema);//getModel("softroute", 'tb_terapia', terapiaClass.TerapiaSchema)
const fncTerapia = require("../functions/fncTerapia")

//estado, cadastro das unidades federativas brasileira
const estadoClass = require("../models/estado")
var Estado = getModel("PortalDoUsuario", 'tb_estado', estadoClass.EstadoSchema);//getModel("softroute", 'tb_estado', estadoClass.EstadoSchema)
const fncEstado = require("../functions/fncEstado")

//ano, cadastro dos Anos de Atividades 
const anoClass = require("../models/ano")
var Ano = getModel("softroute", 'tb_ano', anoClass.AnoSchema);//getModel("softroute", 'tb_ano', anoClass.AnoSchema)
const fncAno = require("../functions/fncAno")

//usuario, cadastro dos usuários
const usuarioClass = require("../models/usuario")
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);//getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)
const fncUsuario = require("../functions/fncUsuario")

//beneficiario, clientes
const beneClass = require("../models/bene")
var Bene = getModel("softroute", 'tb_bene', beneClass.BeneSchema);//getModel("softroute", 'tb_bene', beneClass.BeneSchema)
const fncBene = require("../functions/fncBene")

//Exceções, Peculiaridades da Fichas de Frequência
const excecaoClass = require("../models/excecao")
var Excecao = getModel("softroute", 'tb_excecao', excecaoClass.ExcecaoSchema);//getModel("softroute", 'tb_excecao', excecaoClass.ExcecaoSchema)
const fncExcecao = require("../functions/fncExcecao")

//Exceções para Terapeuras
const excecaoteraClass = require("../models/excecaotera")
var Excecaotera = getModel("softroute", 'tb_excecaotera', excecaoteraClass.ExcecaoteraSchema);//getModel("softroute", 'tb_excecaotera', excecaoteraClass.ExcecaoteraSchema)
const fncExcecaotera = require("../functions/fncExcecaotera")

//Fotos dos beneficiarios
//As fotos dos beneficiários ficam em tabela e função a parte para não pesar listagens e outras fuções do sistema
//Só em rarissimas esceções ele é chamado para exibir a foto, no formulário do Dossiê
const benefotoClass = require("../models/benefoto")
var Benefoto = getModel("softroute", 'tb_benefoto', benefotoClass.BenefotoSchema);//getModel("softroute", 'tb_benefoto', benefotoClass.BenefotoSchema)
const fncBenefoto = require("../functions/fncBenefoto")

// Extraia apenas o que for necessário
const upload = benefotoClass.upload; // ✅ Importa o upload do Multer

//Evolução Atendimento
const evoatendClass = require("../models/evoatend")
var Evoatend = getModel("softroute", 'tb_evoatend', evoatendClass.EvoatendSchema);//getModel("softroute", 'tb_evoatend', evoatendClass.EvoatendSchema)
const fncEvoatend = require("../functions/fncEvoatend")

//Agenda Técnicos
const agendaTecClass = require("../models/agenda")
var AgendaTec = getModel("softroute", 'tb_agenda', agendaTecClass.AgendaSchema);//getModel("softroute", 'tb_agenda', agendaTecClass.AgendaSchema)
const fncAgendaTec = require("../functions/fncAgendaTec")

//Busca
const fncBusca = require("../functions/fncBusca")

//Anamnese
const anamnClass = require("../models/anamn")
var Anamn = getModel("softroute", 'tb_anamn', anamnClass.AnamnSchema);//getModel("softroute", 'tb_anamn', anamnClass.AnamnSchema)
const fncAnamn = require("../functions/fncAnamn")

//Avaliação Fisioterapeutica (Avafisio)
//Criado em: 2025-09-26 Wagner Cintra
//Editado em:
const avafisioClass = require("../models/avafisio")
var Avafisio = getModel("softroute", 'tb_avafisio', avafisioClass.AvafisioSchema);//getModel("softroute", 'tb_avafisio', avafisioClass.AvafisioSchema)
const fncAvafisio = require("../functions/fncAvafisio")
//falta criar as rotas

//Configurações dos Textos pardrões para Evoluções dos Supervisores (Evolucaoconf)
//Criado em: 2025-09-26 Wagner Cintra
//Editado em:
const evolucaoconfClass = require("../models/evolucaoconf")
var Evolucaoconf = getModel("softroute", 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema);//getModel("softroute", 'tb_evolucaoconf', evolucaoconfClass.EvolucaoconfSchema)
const fncEvolucaoconf = require("../functions/fncEvolucaoconf")
//falta criar as rotas


//Diário de Bordo
const bordoClass = require("../models/bordo")
var Bordo = getModel("softroute", 'tb_bordo', bordoClass.BordoSchema);//getModel("softroute", 'tb_bordo', bordoClass.BordoSchema)
const fncBordo = require("../functions/fncBordo")


//plano Tratamento
const tratClass = require("../models/trat")
var Trat = getModel("softroute", 'tb_trat', tratClass.TratSchema);//getModel("softroute", 'tb_trat', tratClass.TratSchema)
const fncTrat = require("../functions/fncTrat")

//Extra
const extraClass = require("../models/extra")
var Extra = getModel("softroute", 'tb_extra', extraClass.ExtraSchema);//getModel("softroute", 'tb_extra', extraClass.ExtraSchema)
const fncExtra = require("../functions/fncExtra")

//Laudo
const laudoClass = require("../models/laudo")
var Laudo = getModel("softroute", 'tb_laudo', laudoClass.LaudoSchema);//getModel("softroute", 'tb_laudo', laudoClass.LaudoSchema)
const fncLaudo = require("../functions/fncLaudo")

//VB-Mapp's
const mappClass = require("../models/mapp")
var Mapp = getModel("softroute", 'tb_mapp', mappClass.MappSchema);//getModel("softroute", 'tb_mapp', mappClass.MappSchema)
const fncMapp = require("../functions/fncMapp")

//ABLLS-R
const abllsrClass = require("../models/abllsr")
var Abllsr = getModel("softroute", 'tb_abllsr', abllsrClass.AbllsrSchema);//getModel("softroute", 'tb_abllsr', abllsrClass.AbllsrSchema)
const fncAbllsr = require("../functions/fncAbllsr")

//VB-Mapabll
const mapabllClass = require("../models/mapabll")
var Mapabll = getModel("softroute", 'tb_mapabll', mapabllClass.MapabllSchema);//getModel("softroute", 'tb_mapabll', mapabllClass.MapabllSchema)
const fncMapabll = require("../functions/fncMapabll")

//Evolução
const evolClass = require("../models/evol")
var Evol = getModel("softroute", 'tb_evol', evolClass.EvolSchema);//getModel("softroute", 'tb_evol', evolClass.EvolSchema)
const fncEvol = require("../functions/fncEvol")

//Sonda - ABA
const sondaClass = require("../models/sonda")
var Sonda = getModel("softroute", 'tb_sonda', sondaClass.SondaSchema);//getModel("softroute", 'tb_sonda', sondaClass.SondaSchema)
const fncSonda = require("../functions/fncSonda")

//Programa - ABA
const progClass = require("../models/prog")
var Prog = getModel("softroute", 'tb_prog', progClass.ProgSchema);//getModel("softroute", 'tb_prog', progClass.ProgSchema)
const fncProg = require("../functions/fncProg")

//Programa tipo - ABA
const progtipoClass = require("../models/progtipo")
var Progtipo = getModel("softroute", 'tb_progtipo', progtipoClass.ProgtipoSchema);//getModel("softroute", 'tb_progtipo', progtipoClass.ProgtipoSchema)
const fncProgtipo = require("../functions/fncProgtipo")

//Programa nivel - ABA
const prognivelClass = require("../models/prognivel")
var Prognivel = getModel("softroute", 'tb_prognivel', prognivelClass.PrognivelSchema);//getModel("softroute", 'tb_prognivel', prognivelClass.PrognivelSchema)
const fncPrognivel = require("../functions/fncPrognivel")

//Programa dica - ABA
const progdicaClass = require("../models/progdica")
var Progdica = getModel("softroute", 'tb_progdica', progdicaClass.ProgdicaSchema);//getModel("softroute", 'tb_progdica', progdicaClass.ProgdicaSchema)
const fncProgdica = require("../functions/fncProgdica")

//Gráfico do Programa - ABA
const grafprogClass = require("../models/grafprog")
var Grafprog = getModel("softroute", 'tb_grafprog', grafprogClass.GrafprogSchema);//getModel("softroute", 'tb_grafprog', grafprogClass.GrafprogSchema)
const fncGrafprog = require("../functions/fncGrafprog")

//SET - ABA
const progsetClass = require("../models/progset")
var Progset = getModel("softroute", 'tb_progset', progsetClass.ProgsetSchema);//getModel("softroute", 'tb_progset', progsetClass.ProgsetSchema)
const fncProgset = require("../functions/fncProgset")

//NAT - ABA
const natClass = require("../models/nat")
var Nat = getModel("softroute", 'tb_nat', natClass.NatSchema);//getModel("softroute", 'tb_nat', natClass.NatSchema)
const fncNat = require("../functions/fncNat")

//CARS - ABA
const carsClass = require("../models/cars")
var Cars = getModel("softroute", 'tb_cars', carsClass.CarsSchema);//getModel("softroute", 'tb_cars', carsClass.CarsSchema)
const fncCars = require("../functions/fncCars")


//ATA - ABA
const ataClass = require("../models/ata")
var Ata = getModel("softroute", 'tb_ata', ataClass.AtaSchema);//getModel("softroute", 'tb_ata', ataClass.AtaSchema)
const fncAta = require("../functions/fncAta")


//ATEC - ABA
const atecClass = require("../models/atec")
var Atec = getModel("softroute", 'tb_atec', atecClass.AtecSchema);//getModel("softroute", 'tb_atec', atecClass.AtecSchema)
const fncAtec = require("../functions/fncAtec")


//NotaSup
const notasupClass = require("../models/notasup")
var Notasup = getModel("softroute", 'tb_notasup', notasupClass.NotasupSchema);//getModel("softroute", 'tb_notasup', notasupClass.NotasupSchema)
const fncNotasup = require("../functions/fncNotasup")

//NotaSup
const notasupobsClass = require("../models/notasupobs")
var Notasupobs = getModel("softroute", 'tb_notasupobs', notasupobsClass.NotaSupObsSchema);//getModel("softroute", 'tb_notasupobs', notasupobsClass.NotaSupObsSchema)
const fncNotasupobs = require("../functions/fncNotasupobs")

//PECS
const pecsClass = require("../models/pecs")
var Pecs = getModel("softroute", 'tb_pecs', pecsClass.PecsSchema);//getModel("softroute", 'tb_pecs', pecsClass.PecsSchema)
const fncPecs = require("../functions/fncPecs")

//Visual
const visualClass = require("../models/visual")
var Visual = getModel("softroute", 'tb_visual', visualClass.VisualSchema);//getModel("softroute", 'tb_visual', visualClass.VisualSchema)
const fncVisual = require("../functions/fncVisual")

//Relsem
const relsemClass = require("../models/relsem")
var Relsem = getModel("softroute", 'tb_relsem', relsemClass.RelsemSchema);//getModel("softroute", 'tb_relsem', relsemClass.RelsemSchema)
const fncRelsem = require("../functions/fncRelsem")


//Acompanhamento, devolutiva e reuniões
const acompClass = require("../models/acomp")
var Acomp = getModel("softroute", 'tb_acomp', acompClass.AcompSchema);//getModel("softroute", 'tb_acomp', acompClass.AcompSchema)
const fncAcomp = require("../functions/fncAcomp")

//Folha Registro - ABA
const folregClass = require("../models/folreg")
var Folreg = getModel("softroute", 'tb_folreg', folregClass.FolregSchema);//getModel("softroute", 'tb_folreg', folregClass.FolregSchema)
const fncFolreg = require("../functions/fncFolreg")

//Gráfico ABC - ABA
const grafabcClass = require("../models/grafabc")
var Grafabc = getModel("softroute", 'tb_grafabc', grafabcClass.GrafabcSchema);//getModel("softroute", 'tb_grafabc', grafabcClass.GrafabcSchema)
const fncGrafabc = require("../functions/fncGrafabc")

//Análise funcional do comportamento
const anafuncompClass = require("../models/anafuncomp")
var Anafuncomp = getModel("softroute", 'tb_anafuncomp', anafuncompClass.AnafuncompSchema);//getModel("softroute", 'tb_anafuncomp', anafuncompClass.AnafuncompSchema)
const fncAnafuncomp = require("../functions/fncAnafuncomp")

//Evolucao
const evolucaoClass = require("../models/atend")
var Evolucao = getModel("softroute", 'tb_atend', evolucaoClass.EmpresaSchema);//getModel("softroute", 'tb_atend', evolucaoClass.EmpresaSchema)
const fncEvolucao = require("../functions/fncEvolucao")

//Sessao, Tabela com quantidades de Terapias que o beneficiario podera realizar semanalmente
const sessaoClass = require("../models/sessao")
var Sessao = getModel("softroute", 'tb_sessao', sessaoClass.SessaoSchema);//getModel("softroute", 'tb_sessao', sessaoClass.SessaoSchema)

//convenio, planos de saúde e particular
const convClass = require("../models/conv")
var Conv = getModel("softroute", 'tb_conv', convClass.ConvSchema);//getModel("softroute", 'tb_conv', convClass.ConvSchema)
const fncConv = require("../functions/fncConv")

//convcre, Recebimentos pela terapia realizada ao beneficiário
const convcreClass = require("../models/convCre")
var Convcre = getModel("softroute", 'tb_convcre', convcreClass.ConvcreSchema);//getModel("softroute", 'tb_convcre', convcreClass.ConvcreSchema)
const fncConvcre = require("../functions/fncConvcre")


//convdeb, Pagamentos pela terapia realizada pelo Terapeuta
const convdebClass = require("../models/convDeb")
var Convdeb = getModel("softroute", 'tb_convdeb', convdebClass.ConvdebSchema);//getModel("softroute", 'tb_convdeb', convdebClass.ConvdebSchema)
const fncConvdeb = require("../functions/fncConvdeb")

//convimp, Impostos ligados ao convênio
const convimpClass = require("../models/convImp")
var Convimp = getModel("softroute", 'tb_convimp', convimpClass.ConvimpSchema);//getModel("softroute", 'tb_convimp', convimpClass.ConvimpSchema)
const fncConvimp = require("../functions/fncConvimp")

//Atend, Atendimento Padrão 
const atendClass = require("../models/atend")
var Atend = getModel("softroute", 'tb_atend', atendClass.AtendSchema);//getModel("softroute", 'tb_atend', atendClass.AtendSchema)
const fncAtend = require("../functions/fncAtend")
   
//AtendAdm, Atendimento Administrativo
const fncAtendAdm = require("../functions/fncAtendAdm")


//AGENDA, Agendamentos Padrão
const agendaClass = require("../models/agenda")
var Agenda = getModel("softroute", 'tb_agenda', agendaClass.AgendaSchema);//getModel("softroute", 'tb_agenda', agendaTecClass.AgendaSchema)
const fncAgenda = require("../functions/fncAgenda")




//Debit, Débitos (parcialmente vinculadas ao Atendimento)
const debitClass = require("../models/debit")
var Debit = getModel("softroute", 'tb_debit', debitClass.DebitSchema);//getModel("softroute", 'tb_debit', debitClass.DebitSchema)
const fncDebit = require("../functions/fncDebit")

//Credit, Créditos (parcialmente vinculadas ao Atendimento)
const creditClass = require("../models/credit")
var Credit = getModel("softroute", 'tb_credit', creditClass.CreditSchema);//getModel("softroute", 'tb_credit', creditClass.CreditSchema)
const fncCredit = require("../functions/fncCredit")

//Contas a receber (contaRec, contarec)
//Migração do Credit para o contaRec (contas a Receber)
const contaRecClass = require("../models/contaRec")
var ContaRec = getModel("softroute", 'tb_contarec', contaRecClass.ContaRecSchema);//getModel("softroute", 'tb_contarec', contaRecClass.ContaRecSchema)
const fncContaRec = require("../functions/fncContaRec")


//Tabil, Balanço contábil (parcialmente vinculadas ao Atendimento)
const tabilClass = require("../models/tabil")
var Tabil = getModel("softroute", 'tb_tabil', tabilClass.TabilSchema);//getModel("softroute", 'tb_tabil', tabilClass.TabilSchema)

//Corrente, Conta Analise financeira pessoal de cada Terapeuta (vinculadas ao Atendimento)
const correnteClass = require("../models/corrente")
var Corrente = getModel("softroute", 'tb_corrente', correnteClass.CorrenteSchema);//getModel("softroute", 'tb_corrente', correnteClass.CorrenteSchema)
const fncCorrente = require("../functions/fncCorrente")

//Imposto
const ImpostoClass = require("../models/imposto")
var Imposto = getModel("softroute", 'tb_imposto', ImpostoClass.ImpostoSchema);//getModel("softroute", 'tb_imposto', ImpostoClass.ImpostoSchema)
const fncImposto = require("../functions/fncImposto")

//RESPOSTA
const respostaClass = require("../models/resposta")
var Resposta = getModel("softroute", 'tb_resposta', respostaClass.RespostaSchema);//getModel("softroute", 'tb_resposta', respostaClass.RespostaSchema)

//Fornecedor, Para cadastrar novas Depesas independentemente dos Atendimentos
const fornecClass = require("../models/fornec")
var Fornec = getModel("softroute", 'tb_fornec', fornecClass.FornecSchema);//getModel("softroute", 'tb_fornec', fornecClass.FornecSchema)
const fncFornec = require("../functions/fncFornec")

//Categoria, Para cadastrar novas Depesas independentemente dos Atendimentos
const debitCategClass = require("../models/debitCateg")
var debitCateg = getModel("softroute", 'tb_debitcateg', debitCategClass.DebitcategSchema);//getModel("softroute", 'tb_debitcateg', debitCategClass.DebitcategSchema)
const fncDebitCateg = require("../functions/fncDebitCateg")

//Categoria, Para cadastrar novas Depesas independentemente dos Atendimentos
const debitSubcategClass = require("../models/debitSubcateg")
var debitSubcateg = getModel("softroute", 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema);//getModel("softroute", 'tb_debitsubcateg', debitSubcategClass.DebitsubcategSchema)
const fncDebitSubcateg = require("../functions/fncDebitSubcateg")

const fncSessao = require('../functions/fncSessao')
const passport = require('passport')

//Financeiro
const fncFinanceiro = require("../functions/fncFinanceiro")

//Dashboards
const fncDash = require("../functions/fncDash")

/*
//Referencias de Atendimentos (vinculadas diretamente aos Atendimantos)
const refAtendClass = require("../models/refAtend")
const RefAtend = getModel("softroute", 'tb_refatend', refAtendClass.RefAtendSchema);//getModel("softroute", 'tb_refatend', refAtendClass.RefAtendSchema)
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
    console.log("Estou sendo carregado corretamente!");
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
    lvl = "x";
    res.render("ferramentas/usuario/login", {nivel: lvl})
})

//Rota Alterar Senhas ou recuperar Senha ou Esqueci Senha
router.get('/recuperarSenha', (req,res)=>{
    console.log("recuperarSenha")
    lvl = "x";
    res.render("/menu/ferramentas/usuario/mudarSenha", {nivel: lvl})
})

//Carregar Mudar Senha Ok
router.get("/ferramentas/usuario/carregaMudarsenha", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a Mudar Senha
    fncUsuario.carregaMudarsenha(req, res);
})

//Mudar Senha
router.post("/ferramentas/usuario/mudarSenha", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a cadastrar Senha
    fncUsuario.mudarSenha(req, res);
})

//Cadastrar Chave
router.get("/ferramentas/usuario/carregaCadastrarchave", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a cadastrar Senha
    fncUsuario.carregaCadastrarchave(req, res);
})

//Cadastrar Chave
router.post("/ferramentas/usuario/cadastraChave", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a cadastrar Senha
    fncUsuario.cadastrarchave(req, res);
})

//Cadastrar Carimbo e Assinatura via Listagem (carregando automaticamente o Id)
router.get("/ferramentas/usuario/carregaCarimboLis/:id", fncGeral.IsAuthenticated, (req,res) =>{//Direciona form de upload de carimbo via lista
    fncUsuario.carregaCarimboLis(req, res);
})

//Cadastrar Carimbo e Assinatura
router.post("/ferramentas/usuario/cadastrarCarimbo", fncGeral.IsAuthenticated, (req,res) =>{//cadatra carimbo via upload
    fncUsuario.cadastrarCarimbo(req, res);
})

//Resetar Chave
router.get("/ferramentas/usuario/carregaResetarchave", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a resetar chave
    fncUsuario.carregaResetarchave(req, res);
})

router.post("/ferramentas/usuario/resetarchave", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a resetar chave
    fncUsuario.resetarChave(req, res);
})

//Lista Aniversariantes Usuários e Terapeutas
router.get("/area/relaniverUsu", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a Lista de usuário
    fncUsuario.relaniverUsu(req, res);
})

//Lista Aniversariantes do DIA Usuários e Terapeutas
router.get("/area/relaniverdiaUsu", fncGeral.IsAuthenticated, (req,res) =>{//Direciona a Lista de usuário
    fncUsuario.relaniverdiaUsu(req, res);
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

//Carregar Esqueci Minha Senha
router.post("/ferramentas/usuario/esqueciMinhaSenha", (req,res) =>{//Direciona a Mudar Senha
    fncUsuario.carregaEsqueciMinhasenha(req, res);
})

router.post('/ferramentas/usuario/definirSenha', (req,res)=>{
    fncUsuario.definirSenha(req, res);
})


router.post('/login/backup', passport.authenticate('local', {
    failureRedirect: '/menu/login',
    failureMessage: true
}), async function (req, res) {
    let db = req.cookies['preferredDb'];
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);

    let lvl, idUsu, perfilId, ativo;
    let aux = 1;
    let agendaFinal = [];

    const hoje = new Date();
    const diaAtual = String(hoje.getUTCDate()).padStart(2, '0');
    const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0');

    // Calcular domingo (início da semana)
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay()); // 0 = domingo

    // Construir dias da semana: domingo a sábado
    const semanaDias = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(domingo);
        d.setDate(domingo.getDate() + i);
        return {
            dia: String(d.getUTCDate()).padStart(2, '0'),
            mes: String(d.getUTCMonth() + 1).padStart(2, '0')
        };
    });

    // Função auxiliar: filtrar aniversariantes da semana

    try {
        const benesGeral = await Bene.find({ bene_status: "Ativo" });
        const usu = await Usuario.findOne({ usuario_email: req.body.email, usuario_senha: req.body.senha });

        if (!usu || usu.usuario_status !== "Ativo") {
            req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
            return res.redirect('/menu/login');
        }

        perfilId = usu.usuario_perfilid;
        idUsu = usu._id;

        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000)
            : (2 * 60 * 60 * 1000);

        res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });

        const aniversariantesDaSemanaUsuario = usuarioClass.filtrarAniversariantes("usuario");
        const aniversariantesDaSemanaBene = beneClass.filtrarAniversariantes(req, "bene");

        // Agendas semanais
        const inicioSemana = new Date(domingo);
        const fimSemana = new Date(domingo);
        fimSemana.setDate(domingo.getDate() + 6);

        const agendasSemanais = await Agenda.find({
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_usuid: idUsu
        });

        const [salas, terapias, benesFull] = await Promise.all([
            Sala.find(),
            Terapia.find(),
            Bene.find()
        ]);

        const evolucaoFaltante = agendasSemanais
            .filter(a => !a.agenda_selo)
            .map(a => {
                const dat = new Date(a.agenda_data);
                const hora = String(dat.getUTCHours()).padStart(2, '0');
                const minuto = String(dat.getUTCMinutes()).padStart(2, '0');
                const sala = salas.find(s => String(s._id) === String(a.agenda_salaid));
                const bene = benesFull.find(b => String(b._id) === String(a.agenda_beneid));
                const terapia = terapias.find(t => String(t._id) === String(a.agenda_terapiaid));

                return {
                    _id: a._id,
                    agenda_data: fncGeral.getDataFMTOption(dat, "/"),
                    agenda_hora: `${hora}:${minuto}`,
                    agenda_data_dia: fncGeral.getDataFMT(dat),
                    agenda_aux: aux++,
                    agenda_data_semana: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()],
                    sala_nome: sala?.sala_nome || "Sala não encontrada",
                    bene_apelido: bene?.bene_apelido || "Beneficiário não encontrado",
                    terapia_nomecid: terapia?.terapia_nomecid || "Terapia não encontrada",
                    dia_hora_ordenação: `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${hora}${minuto}`
                };
            }).sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

        // Agendas do dia (com filtro)
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date();
        fimDia.setHours(23, 59, 59, 999);

        let agendas = await Agenda.find({
            agenda_data: { $gte: inicioDia, $lte: fimDia },
            agenda_usuid: idUsu,
            agenda_temp: false
        });

        agendas = agendas.filter(a => a.atend_categoria !== "Feriado");

        agendas.forEach(a => {
            const dat = new Date(a.agenda_data);
            a.agenda_data_dia = fncGeral.getDataFMT(dat);
            a.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_aux = aux++;
            a.dia_hora_ordenação = `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${String(dat.getUTCHours()).padStart(2, '0')}${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_data_semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()];
        });

        agendaFinal = agendas;

        const [terapias2, benes2, usuarios2] = await Promise.all([
            Terapia.find(),
            Bene.find(),
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            })
        ]);

        const flash = new Resposta();
        if (!usu.usuario_palavrachave || usu.usuario_palavrachave === "undefined") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não cadastrou sua Palavra Chave.";
        } else if (usu.usuario_senha === "123456789") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não alterou sua senha temporária.";
        } else {
            flash.sucesso = "true";
            flash.texto = "Logado com sucesso!";
        }

        res.render("branco", {
            flash,
            aniversariantesDaSemanaUsuario,
            aniversariantesDaSemanaBene,
            agendas: agendaFinal,
            evolucaoFaltante,
            terapias: terapias2,
            agendasSemanaiss: agendaFinal,
            benes: benesGeral,
            salas,
            usuarios: usuarios2
        });

    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        res.redirect('/menu/login');
    }
});

//inicio conjunto de roteamento e processamento para multiempresa
//Criado por: Victor Andrade
//2025-09-19
router.post('/login', passport.authenticate('local', {//Abre portal Login e senha
    failureRedirect: '/menu/login',
    failureMessage: true
}), async function (req, res) {
    try {
        // Verificar usuário e perfil
        Usuario.findOne({ usuario_email: req.body.email, usuario_senha: req.body.senha }).then((usu)=>{
            console.log("CHUVA!");
            if (!usu || usu.usuario_status !== "Ativo") {
                console.log("INATIVO OU SEM")
                req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
                return res.redirect('/menu/login');
            }
            console.log("FODASSE?")
            if (usu.usuario_empresaids != undefined) {
                console.log("FODASSE 2")
                if (usu.usuario_empresaids.length == 1){
                    console.log("apenas 1");
                    Empresa.findOne({_id: usu.usuario_empresaids[0]}).then((empresa)=>{
                        let dbEscolhida = empresa.empresa_chavedb;
                        return login(req,res,dbEscolhida);
                    })
                } else if (usu.usuario_empresaids.length > 1) {
                    console.log("+ de 1");
                    Empresa.find({_id: {$in:usu.usuario_empresaids}}).then((empresa)=>{
                        let email = req.body.email;
                        let senha = req.body.senha;
                        lvl = "x";
                        res.render("ferramentas/usuario/loginDB", {nivel: lvl, email , senha, empresas: empresa})
                    })
                }
            } else {
                console.log("nem 1");
                login(req,res,"SoftRoute");
                /*
                console.log("NAO TEM")
                req.flash("error_message", "Usuário sem vínculo organizacional ou inativo.");
                return res.redirect('/menu/login');
                */
            }
        });
    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        //return res.redirect('/menu/login');
    }
});

router.post('/loginDB', passport.authenticate('local', { //redirecionado se tiver credencial para acessar mais de um banco (empresa)
    failureRedirect: '/menu/login',
    failureMessage: true
}), async function (req, res) {
    try {
        let dbEscolhida = req.body.dbEscolhida;
        console.log("dbEscolhida? "+dbEscolhida)
        login(req,res, dbEscolhida);
    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        res.redirect('/menu/login');
    }
});

async function login(req, res, dbEscolhida) { // Processa após verificação de credenciais
    try {
        //let db = req.cookies['preferredDb'];
        let db = dbEscolhida;
        Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
        Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
        Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
        Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
        
        /*
        //console.log("LOGIN??");
        // Usuário
        const usu = await Usuario.findOne({
            usuario_email: req.body.email, 
            usuario_senha: req.body.senha 
        });

        if (!usu || usu.usuario_status !== "Ativo") {
            req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
            return res.redirect('/menu/login');
        }

        const perfilId = usu.usuario_perfilid;
        const idUsu = usu._id;
        let base = dbEscolhida;
        console.log("base? "+base);
        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000)
            : (2 * 60 * 60 * 1000);

        res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('preferredDb', base, { expires: new Date(Date.now() + tempoCookie) });

        // Buscar dados em paralelo
        const [salas] = await Promise.all([
            Sala.find()
        ]);

        // Agendas semanais
        const hoje = new Date();
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - hoje.getDay());
        const inicioSemana = new Date(domingo);
        const fimSemana = new Date(domingo);
        fimSemana.setDate(domingo.getDate() + 6);

        const agendasSemanais = await Agenda.find({
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_usuid: idUsu
        });

        // Agendas do dia
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date();
        fimDia.setHours(23, 59, 59, 999);

        let agendas = await Agenda.find({
            agenda_data: { $gte: inicioDia, $lte: fimDia },
            agenda_usuid: idUsu,
            agenda_temp: false
        });

        agendas = agendas.filter(a => a.atend_categoria !== "Feriado");

        // Buscar dados adicionais
        const [terapias2, benes2, usuarios2] = await Promise.all([
            Terapia.find(),
            Bene.find(),
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            })
        ]);

        var diaAtual = String(hoje.getUTCDate()).padStart(2, '0');
        var mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0');

        
        // Flash
        const flash = new Resposta();
        if (!usu.usuario_palavrachave || usu.usuario_palavrachave === "undefined") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não cadastrou sua Palavra Chave.";
        } else if (usu.usuario_senha === "123456789") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não alterou sua senha temporária.";
        } else {
            flash.sucesso = "true";
            flash.texto = "Logado com sucesso!";
        }

        // Buscar aniversariantes (usuários e beneficiários ativos)
        const [usuariosAtivos, benesAtivos] = await Promise.all([
            Usuario.find({ usuario_status: "Ativo" }),
            Bene.find({ bene_status: "Ativo" })
        ]);

        const aniversariantesDaSemanaUsuario = fncUsuario.filtrarAniversariantesDaSemana(usuariosAtivos, 'usuario');
        const aniversariantesDaSemanaBene = fncUsuario.filtrarAniversariantesDaSemana(benesAtivos, 'bene');
*/
// Variáveis iniciais
        let aux = 1;
        const hoje = new Date();
        const diaAtual = String(hoje.getUTCDate()).padStart(2, '0');
        const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0');

        // Calcular domingo (início da semana)
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - hoje.getDay()); // 0 = domingo

        // Construir dias da semana: domingo a sábado
        const semanaDias = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(domingo);
            d.setDate(domingo.getDate() + i);
            return {
                dia: String(d.getUTCDate()).padStart(2, '0'),
                mes: String(d.getUTCMonth() + 1).padStart(2, '0')
            };
        });

        // Função auxiliar: filtrar aniversariantes da semana
        function filtrarAniversariantes(lista, tipo, campoNomeOriginal) {
            return lista
                .map(p => {
                    const dataNasc = new Date(p[`${tipo}_datanasc`]);
                    const dia = String(dataNasc.getUTCDate()).padStart(2, '0');
                    const mes = String(dataNasc.getUTCMonth() + 1).padStart(2, '0');
                    return {
                        dtnasc: dataNasc,
                        diaNascimento: dia,
                        mesNascimento: mes,
                        hoje: dia === diaAtual && mes === mesAtual,
                        ...(tipo === 'usuario' ? { usuario_nome: p.usuario_nome } : { bene_nome: p.bene_nome })
                    };
                })
                .filter(p =>
                    semanaDias.some(s =>
                        s.dia === p.diaNascimento && s.mes === p.mesNascimento
                    )
                )
                .sort((a, b) => {
                    if (a.mesNascimento !== b.mesNascimento) return a.mesNascimento - b.mesNascimento;
                    return a.diaNascimento - b.diaNascimento;
                });
        }

        // Função para normalizar o campo agenda_selo
        function normalizeBoolean(value) {
            if (typeof value === "boolean") {
                return value; // Já é um booleano, retorna como está
            }
            if (typeof value === "string") {
                return value.toLowerCase() === "true"; // Converte strings "true" ou "false" para booleano
            }
            return false; // Caso padrão (se for null, undefined ou outro tipo)
        }

        // Verificar usuário e perfil
        const usu = await Usuario.findOne({ usuario_email: req.body.email, usuario_senha: req.body.senha });
        if (!usu || usu.usuario_status !== "Ativo") {
            req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
            return res.redirect('/menu/login');
        }

        const perfilId = usu.usuario_perfilid;
        const idUsu = usu._id;

        // Definir tempo de expiração do cookie
        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000) // 5 horas
            : (2 * 60 * 60 * 1000); // 2 horas

        res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('preferredDb', db, { expires: new Date(Date.now() + tempoCookie) });

        // Buscar dados gerais
        const [usuariosAtivos, benesAtivos, salas, terapias, benesFull] = await Promise.all([
            Usuario.find({ usuario_status: "Ativo" }),
            Bene.find({ bene_status: "Ativo" }),
            Sala.find(),
            Terapia.find(),
            Bene.find()
        ]);
        
        const aniversariantesDaSemanaUsuario = fncUsuario.filtrarAniversariantesDaSemana(usuariosAtivos, 'usuario');
        const aniversariantesDaSemanaBene = fncUsuario.filtrarAniversariantesDaSemana(benesAtivos, 'bene');

        // Agendas semanais
        const inicioSemana = new Date(domingo);
        const fimSemana = new Date(domingo);
        fimSemana.setDate(domingo.getDate() + 6);

        const agendasSemanais = await Agenda.find({
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_usuid: idUsu
        });

        const evolucaoFaltante = agendasSemanais
            .filter(a => !normalizeBoolean(a.agenda_selo)) // Normaliza o campo agenda_selo
            .map(a => {
                const dat = new Date(a.agenda_data);
                const hora = String(dat.getUTCHours()).padStart(2, '0');
                const minuto = String(dat.getUTCMinutes()).padStart(2, '0');
                const sala = salas.find(s => String(s._id) === String(a.agenda_salaid));
                const bene = benesFull.find(b => String(b._id) === String(a.agenda_beneid));
                const terapia = terapias.find(t => String(t._id) === String(a.agenda_terapiaid));
                return {
                    _id: a._id,
                    agenda_data: fncGeral.getDataFMTOption(dat, "/"),
                    agenda_hora: `${hora}:${minuto}`,
                    agenda_data_dia: fncGeral.getDataFMT(dat),
                    agenda_aux: aux++,
                    agenda_data_semana: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()],
                    sala_nome: sala?.sala_nome || "Sala não encontrada",
                    bene_apelido: bene?.bene_apelido || "Beneficiário não encontrado",
                    terapia_nomecid: terapia?.terapia_nomecid || "Terapia não encontrada",
                    dia_hora_ordenação: `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${hora}${minuto}`,
                    agenda_selo: normalizeBoolean(a.agenda_selo) // Normaliza o campo agenda_selo
                };
            }).sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

        // Agendas do dia (com filtro)
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date();
        fimDia.setHours(23, 59, 59, 999);

        let agendas = await Agenda.find({
            agenda_data: { $gte: inicioDia, $lte: fimDia },
            agenda_usuid: idUsu,
            agenda_temp: false
        });

        agendas = agendas.filter(a => a.atend_categoria !== "Feriado");

        agendas.forEach(a => {
            const dat = new Date(a.agenda_data);
            a.agenda_data_dia = fncGeral.getDataFMT(dat);
            a.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_aux = aux++;
            a.dia_hora_ordenação = `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${String(dat.getUTCHours()).padStart(2, '0')}${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_data_semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()];
            a.agenda_selo = normalizeBoolean(a.agenda_selo); // Normaliza o campo agenda_selo
        });

        const agendaFinal = agendas.sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

        // Buscar dados adicionais
        const [terapias2, benes2, usuarios2] = await Promise.all([
            Terapia.find(),
            Bene.find(),
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            })
        ]);

        const flash = new Resposta();
        if (!usu.usuario_palavrachave || usu.usuario_palavrachave === "undefined") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não cadastrou sua Palavra Chave.";
        } else
        /*
         if (usu.usuario_senha === "123456789") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não alterou sua senha temporária.";
        } else
        */
            {
            flash.sucesso = "true";
            flash.texto = "Logado com sucesso!";
        }

        console.log("TA CHEGANDO AQUI");
        res.render("branco", {
            flash,
            aniversariantesDaSemanaUsuario,
            aniversariantesDaSemanaBene,
            agendas,
            terapias: terapias2,
            benes: benes2,
            salas,
            usuarios: usuarios2
        });
        //console.log("Aniversariantes Bene:", aniversariantesDaSemanaBene);
        //console.log("Aniversariantes Usuário:", aniversariantesDaSemanaUsuario);

    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        res.redirect('/menu/login');
    }
}
//fim conjunto roteamento login

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
            res.clearCookie('lvlUsu', { path: '/' })
            res.clearCookie('idUsu', { path: '/' })
            res.redirect('/menu/login');
        }
    });
});

//Menu DashBoard
router.get("/dash/dashFinan", fncGeral.IsAuthenticated, function(req,res){//direciona Dash.
    fncDash.carregaDashfinan(req, res);
})
router.get("/dash/dashAdminin", fncGeral.IsAuthenticated, function(req,res){//direciona Dash.
    fncDash.carregaDashadminin(req, res);
})
router.get("/dash/dashEstatis", fncGeral.IsAuthenticated, function(req,res){//direciona Dash.
    fncDash.carregaDashestatis(req, res);
})
router.get("/dash/cad", fncGeral.IsAuthenticated, function(req,res){//direciona Novo Aviso.
    fncAviso.carregaAviso(req, res);
})


//Menu Agenda
router.get("/agenda/lis", fncGeral.IsAuthenticated, function(req,res){//direciona o cadstro de Agenda, com Ufs e Convênios.
    fncAgenda.listaAgenda(req, res);
})

router.get("/auth", fncGeral.IsAuthenticated, (req,res)=>{
    res.render("admin/index")
})

router.get("/agenda/cadT", fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Agenda, com Ufs e Convênios.
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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

//nova
router.get("/agenda/lisSemBM", fncGeral.IsAuthenticated, (req,res) =>{//Minha Agenda,Agenda semanal por beneficiário
    fncAgenda.carregaAgendaSBMinhaage(req, res);
})
router.post("/agenda/filSemBM", fncGeral.IsAuthenticated, (req,res) =>{//Minha Agenda,Filtro Agenda semanal por beneficiário.
    fncAgenda.carregaAgendaFilSBMinhaage(req, res);
})

router.get("/agenda/lisST/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda de Beneficiario  Semanal.
    fncAgenda.carregaAgendaST(req, res);
})

router.post("/agenda/filST", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem agendamento de filtro de beneficiarios Semanal.
    fncAgenda.carregaAgendaFilST(req, res);
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
    //console.log("Agenda Filtra Sala")
    fncAgenda.carregaAgendaFilSala(req, res);
})
/*
router.get("/agenda/lisA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem.
    fncAgenda.filtraAgendaA(req, res);
})

router.post("/agenda/filA", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de filtro.
    fncAgenda.filtraAgendaA(req, res);
})
*/
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.cadastraAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})


router.get('/agenda/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.deletaAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.carregaAgendaEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/ediTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.carregaAgendaEdiTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/atualizaTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.atualizaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/cadTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.carregaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/addTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para salvar a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.cadastraAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/cadE/atualiza', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.atualizaAgenda(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/deleteall', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        //fncAgenda.deletarTodosAtendimentos(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/deleteall/Teste2342022', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    let usuariosAutorizados = ["62422397cf2fd2bb541f918e","6247ba1cfe2181047dc7c965","627163e1a5fc3fa857f47924"];
    if (usuariosAutorizados.includes(req.cookies['idUsu']) && (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27")) {
        fncAgenda.copiaSemanaAgendaGeral(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/converteDia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    let usuariosAutorizados = ["62422397cf2fd2bb541f918e","6247ba1cfe2181047dc7c965","627163e1a5fc3fa857f47924"];
    if (usuariosAutorizados.includes(req.cookies['idUsu']) && (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27")) {
        fncAgenda.converteAgendaEmAtend(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/copiaExtraordinario', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAgenda.copiaExtraordinario(req, res);
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
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncAgenda.carregaEvolucao(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncAgenda.carregaEvolucaoTemp(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoA/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = true;
    fncAgenda.carregaEvolucao(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoTempA/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = true;
    fncAgenda.carregaEvolucaoTemp(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoCorrecao/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo;
    fncAgenda.carregaEvolucao(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoSemanalCorrecao/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo;
    fncAgenda.carregaEvolucaoTemp(req, res, atrazo, resposta);
})

router.post('/agenda/evolucaosup/', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncAgenda.carregaEvolucaosup(req, res, atrazo, resposta);
})

router.get('/agenda/evolucaoRemoverA/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncAgenda.removeEvolucaoA(req, res, atrazo, resposta);
})

router.post('/agenda/evolucaoRemoverF/', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncEvoatend.removeEvolucaoF(req, res, atrazo, resposta);
})

router.post('/agenda/evolucaoRemoverGeral/', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    let atrazo = false;
    fncEvoatend.removeEvolucaoFinal(req, res, atrazo, resposta);
})

router.post('/agenda/evolucao', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncEvoatend.atualizaEvolucao(req, res);
})

//Cadastro Pontual de Faltas
//Ao cadastrar a falta, ele acessa a agenda, e muda o status do(s) agendamento(s) para aquele dia definido, para falta, 
//tanto por beneficiário como por terapeuta
//
router.get('/agenda/cadFaltas', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncAgenda.carregaCadFaltas(req, res, resposta);
})
//Substitução de Terpias
router.post('/agenda/addFaltas', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.agendaFaltaDiaFill(req, res);
})
//Substitui terapias cadastradas ou associadas a terapeutas/beneficiários de forma equivocada
//agendaAddFaltas
router.get('/agenda/cadSubterapia', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    fncAgenda.carregaSubterapia(req, res);
})
router.post('/agenda/agendaSubTerapiaEdi', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.agendaAtualizaTerapia(req, res);
})
// Visualizar Agenda
/*filtraAtend
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAtend.cadastraAtend(req,res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/addExtra', fncGeral.IsAuthenticated, (req, res) => {
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    const nvlAcesso = [
        "62421801a12aa557219a0fb9",
        "62421857a12aa557219a0fc1",
        "624218f5a12aa557219a0fd0",
        "677704b1a358ba19d0c8eb51",
        "677704a8a358ba19d0c8eb27"
    ];

    if (nvlAcesso.includes(potinho.lvlUsu)) {
        fncAtend.cadastraAtendExtra(req, res); // <<<--- Garanta que esta função existe
    } else {
        console.log("Acesso NEGADO!");
        res.render("ferramentas/usuario/login", { nivel: "x" });
    }
});

router.get('/atendimento/deleteMany/:id', fncGeral.IsAuthenticated,(req,res) =>{//deleta atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        //fncAtend.deletaVariosAtend(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/deleteAll/', fncGeral.IsAuthenticated,(req,res) =>{//deleta atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAtend.deletaVariosAtends(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/edi/:id', fncGeral.IsAuthenticated,(req,res) =>{//direciona para a edição de atend
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAtend.carregaAtendEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Atendimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo 
//com espaço para assinataura individual, tanto responsável quanto do terapeuta
    router.get('/atendimento/relatendbeneassin', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassin(req,res)
    })
    router.post('/atendimento/relatendbeneassins', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinFiltro(req,res)
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
    res.render("atendimento/atendreltera/relatendterapiacons")
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

//Gestão - Analitico dos Atendimentos por periodo
router.get('/atendimento/atendreltera/gestao/relatendgestaoana', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relatendgestaoana(req, res)
});

//Gestão - Consolidado dos Atendimentos por periodo
router.get('/atendimento/atendreltera/gestao/relatendgestaocons', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relatendgestaocons(req, res)
});

//Gestão - Consolidado dos Atendimentos por periodo
router.get('/atendimento/atendreltera/gestao/relatendgestaoconsfechado', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relatendgestaoconsfechado(req, res)
});

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

router.get('/atendimento/atendadmextra/cad/:id', fncGeral.IsAuthenticated,(req,res) =>{//direciona o cadstro de Atend, com Ufs e Convênios.
    fncAtendAdm.carregaAtendAdmExtra(req,res);
})

router.post('/atendimento/atendadm/addExtra', fncGeral.IsAuthenticated, (req, res) => {
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    const nvlAcesso = [
        "62421801a12aa557219a0fb9",
        "62421857a12aa557219a0fc1",
        "624218f5a12aa557219a0fd0",
        "677704b1a358ba19d0c8eb51",
        "677704a8a358ba19d0c8eb27"
    ];

    if (nvlAcesso.includes(potinho.lvlUsu)) {
        fncAtend.cadastraAtendExtra(req, res); // <<<--- Garanta que esta função existe
    } else {
        console.log("Acesso NEGADO!");
        res.render("ferramentas/usuario/login", { nivel: "x" });
    }
});

router.post('/atendimento/atendadm/addExtra', fncGeral.IsAuthenticated,(req,res) =>{//adiciona atend
    //let potinho = Object.assign(new PoteBiscoito, req.cookies);
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncAtendAdm.deletaAtendAdm(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/atendimento/atendadm/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de atend
    //let potinho = Object.assign(new PoteBiscoito, req.cookies);
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncFornec.carregaFornecCad(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/financeiro/fornecedor/add', fncGeral.IsAuthenticated,(req,res) =>{//adiciona fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncFornec.cadastraFornec(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/financeiro/fornecedor/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncFornec.deletaFornec(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/financeiro/fornecedor/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de fornec
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
        fncFornec.carregaFornecEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/financeiro/fornecedor/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Fornecimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
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



//Menu Contas à Receber (contRec)
router.get('/financeiro/receita/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas credits
    fncContaRec.listar(req,res);
})

router.get('/financeiro/receita/cad', fncGeral.IsAuthenticated, (req,res) =>{//adiciona credit
    fncContaRec.carregaCadastro(req,res);
})
router.post('/financeiro/receita/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona credit
    fncContaRec.adicionar(req,res);
})

router.get('/financeiro/receita/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta credit[]
    fncContaRec.delete(req,res);
})

router.get('/financeiro/receita/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de credit
    fncContaRec.carregaEditar(req,res);
})

router.post('/financeiro/receita/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Creditimento
    fncContaRec.atualizar(req,res);
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
        let potinho = Object.assign(new PoteBiscoito, req.cookies);
        if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27") {
            fncBene.deletaBene(req, res); 
        } else {
            console.log("Acesso NEGADO!");
            let lvl = "x";
            res.render("ferramentas/usuario/login", {nivel: lvl});
        }
    })

    router.get('/beneficiario/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de bene
       fncBene.carregaBeneEdi(req, res); 
    })

    router.post('/beneficiario/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneficiario
        fncBene.atualizaBene(req, res);
    })
    
    router.get('/beneficiario/resplis', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneficiario
        fncBene.listaResp(req, res);
    })

    router.get('/beneficiario/foto/:id', fncGeral.IsAuthenticated, (req, res) => {
        const bene_id = req.params.id;

        // Valida se é um ObjectId válido
        if (!mongoose.Types.ObjectId.isValid(bene_id)) {
            req.flash("error_message", "ID inválido!");
            return res.redirect("/menu/beneficiario/lista");
        }

        // Chama a função carregabeneFoto passando o ID
        fncBenefoto.carregabeneFoto(req, res, bene_id);
    })

    router.post('/beneficiario/foto/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona beneFoto
        fncBenefoto.cadastrabeneFoto(req, res);
    })

    // Rota para salvar com opção de sobrescrever (POST)
    router.post('/beneficiario/foto/sobrescrever', fncGeral.IsAuthenticated, (req, res) => {
        fncBenefoto.sobrescrevebeneFoto(req, res);
    })

   
    // Lista e edição de beneficiários para supervisores e coordenadores pode ver mas limitado  salvar apoenas a sessão escola
    router.get('/beneficiario/lissup', fncGeral.IsAuthenticated, (req,res) =>{//lista todas benes
        fncBene.listaBenesup(req, res);        
    })

    router.get('/beneficiario/edisup/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de bene
        fncBene.carregaBenesupEdi(req, res); 
     })

     router.post('/beneficiario/atualizarsup', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneficiario
        fncBene.atualizaBenesup(req, res);
    })
    //Lista de Aniversáriantes mensal dos beneficiários
    router.get('/beneficiario/relaniverbene', fncGeral.IsAuthenticated, (req,res) =>{//lista todas benes
        fncBene.relaniverBene(req, res);        
    })
    //Planilha de Beneficiarios com Substituição Fixa 
    router.get('/beneficiario/plansubsfixo', fncGeral.IsAuthenticated, (req,res) =>{//lista todas benes
        fncAgenda.plansubsfixo(req, res);        
    })

    router.post('/beneficiario/plansubsfixoFill', fncGeral.IsAuthenticated, (req,res) =>{//lista todas benes
        fncAgenda.listaPlansubsfixo(req, res);        
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



//Menu Beneficiario /Sessoes
// Agora vamos usar o ID da sessão, não do beneficiário
router.get('/beneficiario/sessao/edi/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncSessao.carregaSessaoEdi(req, res);
})

router.post('/beneficiario/sessao/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Beneimento
 fncSessao.atualizaSessao(req, res);
})


//Menu Beneficiario /Sessaos
//Lista de Tabela de Sessões.
router.get('/beneficiario/sessao/lis', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.listaSessao(req, res);
})

//Rota que carrega a view com fltro de sessões para um beneficiário individual
router.get('/beneficiario/sessao/lisind', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.pesquisaind(req, res);
})

//sessões para um beneficiário individual filtrado
router.post('/beneficiario/sessao/lisindfil', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.pesquisaindfil(req, res);
})

// Rota que recebe a data do formulário
router.get('/beneficiario/sessao/lisF', fncGeral.IsAuthenticated, (req, res) => {
    fncSessao.listaSessaofil(req, res);
})

//Lista de sessões OBSOLETO
router.get('/beneficiario/sessao/listab/:id', fncGeral.IsAuthenticated, (req,res) =>{
fncSessao.listaSessaoTab(req, res); 
})

//Menu Evolução dos Atendimentos ** Atendimento 
//Lista Todos os Atendimentos por Data Atual e Beneficiário vinculados pela AGENDA do Dia
router.get('/area/evoatendLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncEvoatend.listaEvoatend(req, res);
})

router.get('/area/evoatendabertoLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de agendamentos sem evolução.
    fncEvoatend.listaEvoatendaberto(req, res);
})

router.get('/area/evoatendfechadoLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de agendamentos com evolução.
    fncEvoatend.listaEvoatendfechado(req, res);
})

router.post('/area/evoatendabertofil', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de agendamentos sem evolução.
    fncEvoatend.filtraEvoatendaberto(req, res);
})

router.post('/area/evoatendfechadofil', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de agendamentos com evolução.
    fncEvoatend.filtraEvoatendfechado(req, res);
})

router.post('/area/evoatendfil', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncEvoatend.filtraEvoatend(req, res);
})
//Lista Geral Fechado e Aberto com sinalizações coloridas
router.get('/area/evol/evoatendgeralLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de evoluções.
    fncEvoatend.listaEvoatendgeral(req, res);
})

router.post('/area/evol/evoatendgeralFil', fncGeral.IsAuthenticated, (req,res) =>{//direciona para o filtro da Lista de evoluções.
    fncEvoatend.filtraEvoatendgeral(req, res);
})
//Lista de Ranking
router.get('/area/evol/evoatendrankingLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista Ranking de evoluções
    fncEvoatend.listaEvoatendranking(req, res);
})

router.post('/area/evol/evoatendrankingFil', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de Ranking de evoluções.
    fncEvoatend.filtraEvoatendranking(req, res);
})



//Menu Minha Agenda Area Tecnicos
router.get("/area/magenda/LisD", fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Agenda dos técnicos Do Dia.
    fncAgendaTec.carregaAgendaTecDia(req, res);
})

router.get("/area/magenda/LisS", fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Agenda dos técnicos Da Semana.
    fncAgendaTec.carregaAgendaTecSem(req, res);
})
//Menu Busca ** Area Terapeutas
router.get('/area/busca', fncGeral.IsAuthenticated, (req,res) =>{//direciona para busca
    fncBusca.listaBusca(req, res);
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
//Carrega deletar Anamnese Selecionada
router.get('/area/anamn/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escola
    fncAnamn.deletaAnamn(req, res); 
})
//Menu Bordo ** Area Tecnicos   
//Lista Todos os Diários de Bordo por Data, Beneficiário
router.get('/area/bordo/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncBordo.listaBordo(req, res, resposta);
})
router.get('/area/bordo/bordosuplis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.bordoSuplis(req, res);
})
router.post('/area/bordo/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.filtraBordo(req, res);
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
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "true";
    fncTrat.listaTrat(req, res, resposta);
})
//Filtra Todos Planos de Tratamento
router.post('/area/plano/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Plano de Tratamentos, com Ufs e Convênios.
    fncTrat.filtraTrat(req, res);
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
//Imprime plano tratamento trat
router.get('/area/plano/imp/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona plano de tratamento
    fncTrat.tratImp(req,res);
})
//Deleta plano Selecionado
router.get('/area/plano/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta plano de tratamento
    fncTrat.deletaTrat(req, res);
})
//Envia para Lixeira o plano Selecionado
router.get('/area/plano/lixo/:id', fncGeral.IsAuthenticated, (req,res) =>{//envia o plano de tratamento para lixeira
    fncTrat.lixoTrat(req, res);
})

//Menu Extras ** Area Atendimentos Extras   
//Carrega Cadastro de Extra 
router.get('/atendimento/extra/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Extra, com  bene e data.
    fncExtra.carregaExtra(req,res);
})
//Adiciona Registro de Extra
router.post('/atendimento/extra/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Extra
    fncExtra.cadastraExtra(req,res);
})
//Carrega Extra para Edição
router.get('/atendimento/extra/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.carregaExtraedi(req,res);
})
//Atualiza Extra selecionado editado
router.post('/atendimento/extra/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.atualizaExtra(req,res);
})
//Lista todos os Extras
router.get('/atendimento/extra/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncExtra.listaExtra(req,res,resposta);
})
//Lista todos os Extras
router.post('/atendimento/extra/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.filtraExtra(req,res);
})

//Lista todos os Extras da agenda depois de realizar a copia quem chama essa rota é a função extraCopia
// Rota GET para exibir a lista com filtros
router.get('/atendimento/extra/controleF', fncGeral.IsAuthenticated, (req, res) => {
    fncExtra.filtraExtra(req, res, new Resposta());
});

//controle de Extras vindo da Agenda Fixa
router.get("/atendimento/extra/extraLis", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Fixa.
    fncAgenda.carregaControleextrasF(req, res);
})

//Lista todos os Extras Controles
router.get('/atendimento/extra/lisctrl', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.listaExtractrl(req,res);
})
//Lista controle extra pelo menu
router.get('/atendimento/extra/ctrlextra', fncGeral.IsAuthenticated, (req,res) =>{
    fncExtra.controleExtra(req,res);
})

//Lista todos os Extras
router.post('/atendimento/extra/ctrlextraF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.controleExtraFil(req,res);
})
//Lista todos os Extras
router.post('/atendimento/extra/lisctrlF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Extra, com bene e data.
    fncExtra.filtraExtractrl(req,res);
})
//Deleta Extra Selecionado
router.get('/extra/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Extra
    fncExtra.deletaExtra(req,res);
})

router.post('/atendimento/extra/extraCopia', fncGeral.IsAuthenticated, async (req, res) => {
    try {
        await fncExtra.extraCopiar(req, res);
    } catch (error) {
        console.error('Erro na rota /extra/extraCopia:', error);
        req.flash('error_message', 'Erro interno ao processar a cópia.');
        return res.redirect('/admin/erro');
    }
})

// ROTA: PATCH /menu/atendimento/extra/auditare/:id
router.patch('/atendimento/extra/auditare/:id', fncGeral.IsAuthenticated, (req, res) => {
    // Apenas chama a função — ela já lida com req e res
    fncExtra.auditaEGeraExtra(req, res);
}),

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
router.post('/area/laudo/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.atualizaLaudo(req,res);
})
//Lista todos os Laudos
router.get('/area/laudo/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.listaLaudo(req,res);
})
//Filtro da Lista dos Laudos
router.post('/area/laudo/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncLaudo.filtraLaudo(req,res);
})
//Deleta Laudo Selecionado
router.get('/area/laudo/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncLaudo.deletaLaudo(req,res);
})

//Menu Area Terapeutas ** Avaliação de Fisioterapia
//Criado em: 2025-10-02
//por: Wagner Cintra
//------------------------------------------------------------------------------------------------
router.get('/area/avafisio/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona para o formulário de cadastro
    fncAvafisio.carregaAvafisio(req, res);
})
//Cadastrar
router.post('/area/avafisio/add', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro ao banco
    fncAvafisio.cadastraAvafisio(req, res);
})

//Lista Avaliação de Fisioterapia por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/avafisio/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a lista de Avaliação de FisioterapiaARS
    fncAvafisio.listaAvafisio(req, res);
})
//carrega registro para edição Avaliação de Fisioterapia
router.get('/area/avafisio/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//carrega o cadastro para o Formulario de Edição
    fncAvafisio.carregaAvafisioEdi(req, res);
})

router.post('/area/avafisio/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza Avaliação de Fisioterapia 
    fncAvafisio.atualizaAvafisio(req, res);
})

//Deleta Avaliação de Fisioterapia Selecionado
router.get('/area/avafisio/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Avaliação de Fisioterapia
   fncAvafisio.deletaAvafisio(req,res);
})

//------------------------------------------------------------------------------------------------


//Menu Evoluções ** Area Tecnicos   
//Carrega Cadastro de Relatório Semestral
//------------------------------------------------------------------------------------------------
router.get('/area/evol/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncEvol.carregaEvol(req, res);
})
//Adiciona Registro de Relatório Semestral
router.post('/area/evol/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncEvol.cadastraEvol(req,res);
})
//Lista Todos os Relatório Semestral
router.get('/area/evol/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.listaEvol(req, res);
})
//Carrega Relatório Semestral Selecionado para Edição
router.get('/area/evol/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.carregaEvoledi(req, res);
})
//Atualiza Relatório Semestral Selecionado
router.get('/area/evol/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncEvol.atualizaEvol(req, res);
})
//Deleta Exclui Relatório Semestral
router.get('/area/evol/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Laudo
    fncEvol.deletaEvol(req, res);
})
//------------------------------------------------------------------------------------------------

//Menu VB-MAPPS ** Area Tecnicos   
//Carrega Cadastro de Mapp
//------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------


//Menu ABLLS-R ** Area Tecnicos   
//Carrega Cadastro de ABLLS-R
//------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------


//Menu MapAbll ** Area Tecnicos   
//Carrega Cadastro de MapAbll
//------------------------------------------------------------------------------------------------
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
//------------------------------------------------------------------------------------------------

//Menu Sonda ** Area Tecnicos e ABA 
//Carrega Cadastro sonda (DELETAR)
//------------------------------------------------------------------------------------------------
router.get('/area/aba/sonda/sondacad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de sonda, com  bene e data.
    fncSonda.carregaSonda(req, res);
})

//Lista Sonda por Tipo, Beneficiário. Tecnico, Medico e data (DELETAR)
router.get('/area/aba/sonda/sondalis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de sonda, com bene e data.
    fncSonda.listaSonda(req, res);
})

//------------------------------------------------------------------------------------------------

//Menu Programas ** Area Tecnicos e ABA 
//Carrega Cadastro ABA
//------------------------------------------------------------------------------------------------
router.get('/area/aba/prog/progcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro  de ABA, com  bene e data.
    fncProg.carregaProg(req, res);
})

router.get('/area/aba/prog/progcadBene/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de ABA, com  bene e data.
    fncProg.carregaProg(req, res);
})

//Lista Programas ABA
router.get('/area/aba/prog/proglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o filtro da lista do ABA.
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncProg.listaProg(req, res, resposta);
})

//Lista Programas ABA filtrado pelo beneficiário carregado com id
router.get('/area/aba/prog/proglisF/:id', fncGeral.IsAuthenticated, (req, res) => {
    console.log("Beneficiário ID recebido:", req.params.id);
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncProg.listaProgfiltro(req, '', res, resposta);
});

//Lista Programas ABA filtrado pelo beneficiário carregado com id MANUTENÇÃO
router.get('/area/aba/prog/proglisM/:id', fncGeral.IsAuthenticated, (req, res) => {
    console.log("Beneficiário ID recebido:", req.params.id);
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncProg.listaProgfiltroManut(req, res, resposta);
});

//Filtra Programas ABA
router.post('/area/aba/prog/progfil', fncGeral.IsAuthenticated, (req,res) =>{//direciona lista do ABA.
    let resposta = new Resposta();
    resposta.texto = ""
    resposta.sucesso = ""
    fncProg.filtraProg(req, res, resposta);
})

router.post('/area/aba/prog/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona ABA
    fncProg.cadastraProg(req, res);
})

router.get('/area/aba/prog/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta ABA
    fncProg.deletaProg(req, res);
})

router.get('/area/aba/prog/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do ABA
    fncProg.carregaProgEdi(req, res);
})

router.post('/area/aba/prog/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do ABA
    fncProg.atualizaProg(req, res);
})
//-------------------------------------------------------------------------------------------

//Menu Dicas ** Area Tecnicos e ABA 
//Carrega Cadastro de Dicas programa ABA
//-------------------------------------------------------------------------------------------
router.get('/area/aba/progdica/progdicacad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de dicas
    fncProgdica.carregaProgdica(req, res);
})

//Lista Dicas do Programas ABA
router.get('/area/aba/progdica/progdicalis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de dica
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncProgdica.listaProgdica(req, res, resposta);
})

router.post('/area/aba/progdica/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona metodo
    fncProgdica.cadastraProgdica(req, res);
})

router.get('/area/aba/progdica/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta metodo
    fncProgdica.deletaProgdica(req, res);
})

router.get('/area/aba/progdica/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncProgdica.carregaProgdicaEdi(req, res);
})

router.get('/area/aba/progdica/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncProgdica.atualizaProgdica(req, res);
})
//------------------------------------------------------------------------------------------------


//Menu Nivel ** Area Tecnicos e ABA 
//Carrega Cadastro de Nivel dos programa ABA
router.get('/area/aba/prognivel/prognivelcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de dicas
    fncPrognivel.carregaPrognivel(req, res);
})

//Lista Nivel do Programas ABA
router.get('/area/aba/prognivel/prognivellis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de dica
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncPrognivel.listaPrognivel(req, res, resposta);;
})

router.post('/area/aba/prognivel/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona metodo
    fncPrognivel.cadastraPrognivel(req, res);
})

router.get('/area/aba/prognivel/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta metodo
    fncPrognivel.deletaPrognivel(req, res);
})

router.get('/area/aba/prognivel/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncPrognivel.carregaPrognivelEdi(req, res);
})

router.get('/area/aba/prognivel/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncPrognivel.atualizaPrognivel(req, res);
})
//----------------------------------------------------------------------------------------------

//Menu Tipo ** Area Tecnicos e ABA 
//Carrega Cadastro de Tipos dos programa ABA
router.get('/area/aba/progtipo/progtipocad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de dicas
    fncProgtipo.carregaProgtipo(req, res);
})

//Lista Tipo do Programas ABA
router.get('/area/aba/progtipo/progtipolis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de dica
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncProgtipo.listaProgtipo(req, res, resposta);;
})

router.post('/area/aba/progtipo/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona metodo
    fncProgtipo.cadastraProgtipo(req, res);
})

router.get('/area/aba/progtipo/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta metodo
    fncProgtipo.deletaProgtipo(req, res);
})

router.get('/area/aba/progtipo/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncProgtipo.carregaProgtipoEdi(req, res);
})

router.post('/area/aba/progtipo/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
    fncProgtipo.atualizaProgtipo(req, res);
})
//------------------------------------------------------------------------------------------------
//Menu Gráfico do Programa ** Area Tecnicos e ABA (DELETAR)
//Carrega Cadastro (DELETAR)
router.get('/area/aba/grafprog/grafprogcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de diário de bordo, com  bene e data.
    fncGrafprog.carregaGrafprog(req, res);
})

//Lista Grafico Programa ABA (DELETAR)
router.get('/area/aba/grafprog/grafproglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de diário de bordo, com bene e data.
    fncGrafprog.listaGrafprog(req, res);
})

//------------------------------------------------------------------------------------------------
//Menu SET ** Area Tecnicos e ABA 
//Carrega Cadastro

//Lista SET por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/progset/progsetlis', fncGeral.IsAuthenticated, (req,res) =>{//carrega a Lista.
    fncProgset.listaProgset(req, res);
})

router.get('/area/aba/progset/progsetcad', fncGeral.IsAuthenticated, (req,res) =>{//carrega o Formulario de cadastro.
    fncProgset.carregaProgset(req, res);
})

router.get('/area/aba/progset/progsetprecad/:id', fncGeral.IsAuthenticated, (req,res) =>{//carrega o Formulario de cadastro.
    fncProgset.preCarregaProgset(req, res);
})

//adiciona registro
router.post('/area/aba/progset/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro.
    fncProgset.cadastraProgset(req, res);
})

//carrega registro para edição
router.get('/area/aba/progset/progsetedi/:id', fncGeral.IsAuthenticated, (req,res) =>{//carrega o Formulario de edição.
    fncProgset.carregaProgsetEdi(req, res);
})

router.post('/area/aba/progset/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o registro.
    fncProgset.atualizaProgset(req, res);
})

//------------------------------------------------------------------------------------------------
//Menu NAT ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/nat/natcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncNat.carregaNat(req, res);
})

//Lista NAT por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/aba/nat/natlis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario NAT - Naturalístico
    fncNat.listaNat(req, res);
})

//------------------------------------------------------------------------------------------------

//Menu ATEC ** Area Tecnicos e Escalas 
//Carrega Cadastro
router.get('/area/escalas/atec/ateccad', fncGeral.IsAuthenticated, (req,res) =>{//carrega Cadastro Atec
    fncAtec.carregaAtec(req, res);
})
//adiciona registro
router.post('/area/escalas/atec/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro Atec
    fncAtec.cadastraAtec(req, res);
})

router.post('/area/escalas/atec/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza no Atec
    fncAtec.atualizaAtec(req, res);
})

//Lista ATEC por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/escalas/atec/ateclis', fncGeral.IsAuthenticated, (req,res) =>{//carrega Lista ATEC
    fncAtec.listaAtec(req, res);
})
//carrega registro para edição
router.get('/area/escalas/atec/atecedi/:id', fncGeral.IsAuthenticated, (req,res) =>{//carrega o cadastro para o Formulario de Edição
    fncAtec.carregaAtecEdi(req, res);
})

//Deleta Atec Selecionado
router.get('/area/escalas/atec/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta 
    fncAtec.deletaAtec(req,res);
})

//------------------------------------------------------------------------------------------------

//Menu Exceções ** 
//Carrega Cadastro
router.get('/beneficiario/excecao/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para novo
    fncExcecao.carregaExcecao(req, res);
})

router.get('/beneficiario/excecao/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para novo
    fncExcecao.carregaExcecaoEdi(req, res);
})

//adiciona registro
router.post('/beneficiario/excecao/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro
    fncExcecao.cadastraExcecao(req, res);
})

router.post('/beneficiario/excecao/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza no convênio
fncExcecao.atualizaExcecao(req, res);
})

//Lista Exceção por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/beneficiario/excecao/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para lista
    fncExcecao.listaExcecao(req, res);
})
//Deleta Excecao Selecionado
router.get('/beneficiario/excecao/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta 
    fncExcecao.deletaExcecao(req,res);
})

//------------------------------------------------------------------------------------------------

//Menu Exceções de terapeutas que independente do beneficiário devem ter substituição fixa 
//Carrega Cadastro 
router.get('/beneficiario/excecaotera/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para novo
    fncExcecaotera.carregaExcecaotera(req, res);
})
//carrega o editar
router.get('/beneficiario/excecaotera/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para novo
    fncExcecaotera.carregaExcecaoteraEdi(req, res);
})

//Adiciona registro
router.post('/beneficiario/excecaotera/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona registro
    fncExcecaotera.cadastraExcecaotera(req, res);
})

//Edita o registro
router.post('/beneficiario/excecaotera/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza no 
fncExcecaotera.atualizaExcecaotera(req, res);
})

//Carrega a lista
router.get('/beneficiario/excecaotera/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para lista
    fncExcecaotera.listaExcecaotera(req, res);
})

//Deleta Selecionado
router.get('/beneficiario/excecaotera/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta 
    fncExcecaotera.deletaExcecaotera(req,res);
})

//------------------------------------------------------------------------------------------------

// **Menu ATA - Área Técnicos e Escalas**

// Carrega formulário de cadastro
router.get('/area/escalas/ata/atacad', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `carregaAta` para carregar os dados necessários para o formulário de cadastro
    fncAta.carregaAta(req, res);
})

// Adiciona um novo registro
router.post('/area/escalas/ata/add', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `cadastraAta` para salvar os dados do formulário no banco de dados
    fncAta.cadastraAta(req, res);
})

// Atualiza um registro existente
router.post('/area/escalas/ata/atualizar', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `atualizaAta` para atualizar os dados de um ATA existente
    fncAta.atualizaAta(req, res);
})

// Carrega formulário de edição
router.get('/area/escalas/ata/ataedi/:id', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `carregaAtaEdi` para carregar os dados de um ATA específico para edição
    fncAta.carregaAtaEdi(req, res);
})

// Lista ATAs por tipo, beneficiário, técnico, médico e data
router.get('/area/escalas/ata/atalis', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `listaAta` para exibir uma lista de ATAs cadastrados
    fncAta.listaAta(req, res);
})

// Deleta um ATA (marca como lixo)
router.get('/area/escalas/ata/del/:id', fncGeral.IsAuthenticated, (req, res) => {
    // Chama a função `deletaAta` para marcar um ATA como "lixo" no banco de dados
    fncAta.deletaAta(req, res);
})

//------------------------------------------------------------------------------------------------

//Menu CARS ** Area Tecnicos e Escalas 
//Carrega Cadastro
router.get('/area/escalas/cars/carscad', fncGeral.IsAuthenticated, (req,res) =>{//direciona para o formulário de cadastro
    fncCars.carregaCars(req, res);
})
//Cadastrar
router.post('/area/escalas/cars/add', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro ao banco
    fncCars.cadastraCars(req, res);
})

//Lista CARS por Tipo, Beneficiário. Tecnico, Medico e data
router.get('/area/escalas/cars/carslis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a lista de CARS
    fncCars.listaCars(req, res);
})
//carrega registro para edição
router.get('/area/escalas/cars/carsedi/:id', fncGeral.IsAuthenticated, (req,res) =>{//carrega o cadastro para o Formulario de Edição
    fncCars.carregaCarsEdi(req, res);
})

router.post('/area/escalas/cars/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza no 
    fncCars.atualizaCars(req, res);
})

//Deleta CARS Selecionado
router.get('/area/escalas/cars/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta 
    fncCars.deletaCars(req,res);
})

//------------------------------------------------------------------------------------------------
//Menu Evolucaoconf ** Area Supervisão
//Criado por: Wagner Cintra
//Criado em: 06/10/2025

//Carrega Cadastro Evolução de Supervisores
router.get('/area/evolucaoconf/evolucaoconfcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de registros
    fncEvolucaoconf.carregaEvolucaoconf(req, res);
})

//Carrega o Editar da Evolução de Supervisores
router.get('/area/evolucaoconf/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncEvolucaoconf.carregaEvolucaoconfEdi(req,res);
})

//Carrega Lista Evolução de Supervisores
router.get('/area/evolucaoconf/evolucaoconflis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista de Nota de Supervisão
    fncEvolucaoconf.listaEvolucaoconf(req, res);
})

// Add Evolução de Supervisores
router.post('/area/evolucaoconf/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncEvolucaoconf.cadastraEvolucaoconf(req, res); 
})

//Atualiza Evolução de Supervisores
router.post('/area/evolucaoconf/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncEvolucaoconf.atualizaEvolucaoconf(req,res);
})

//Lixeira Evolução de Supervisores (Envia para lixeira)
router.get('/area/evolucaoconf/del/:id', fncGeral.IsAuthenticated, async (req, res) => {
    try {
        await fncEvolucaoconf.deletaEvolucaoconf(req.params.id, req, res);
        req.flash("success_message", "Registro movido para a lixeira.");
    } catch (err) {
        console.error(err);
        req.flash("error_message", "Erro ao excluir registro.");
    }
    res.redirect('/menu/area/evolucaoconf/evolucaoconflis');
});


//------------------------------------------------------------------------------------------------

//Menu Notasup ** Area Tecnicos e ABA 

router.get('/area/aba/notasup/notasupcad/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Nota de Supervisão
    fncNotasup.carregaNotasup(req, res);
})

//Carrega Cadastro Nota Supervisão com informações adicionais
router.get('/area/aba/notasup/notasupPrecad/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de registros
    fncNotasup.preCarregaNotasup(req, res);
})

//Menu Notasup ** Area Tecnicos e ABA 
router.get('/area/aba/notasup/folreglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista de Nota de Supervisão
    fncNotasup.listaFolreg(req, res);
})

//Adiciona Notasup** Area Tecnicos e ABA 
router.post('/area/aba/notasup/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncNotasup.cadastraNotasup(req, res); 
})

//Carrega Editar Notasup
router.get('/area/aba/notasup/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncNotasup.carregaNotasupEdi(req,res);
})

//Carrega Atualizar Notasup
router.post('/area/aba/notasup/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Nota de Supervisão
    fncNotasup.atualizaNotasup(req,res);
})
//-----------------------------------------------------------------------------

//Menu Folha de Registro ** Area Tecnicos e ABA 
//Carrega Cadastro
router.get('/area/aba/folreg/folregcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de registros
    fncFolreg.carregaFolreg(req, res);
})

//Carrega Cadastro folha de registro com informações adicionais
router.get('/area/aba/folreg/folregPrecad/:id/:idProg', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de registros
    fncFolreg.preCarregaFolreg(req, res);
})

//Lista Folha Registro ** Area Tecnicos e ABA
router.get('/area/aba/folreg/folreglis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista de registros
    fncFolreg.listaFolreg(req, res);
})

//Adiciona Registro Pecs
router.post('/area/aba/folreg/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona pecs
    fncFolreg.cadastraFolreg(req, res); 
})

//Carrega Editar Pecs
router.get('/area/aba/folreg/edi/:id/:idProg', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncFolreg.carregaFolregEdi(req,res);
})

//Carrega Atualizar Pecs
router.post('/area/aba/folreg/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncFolreg.atualizaFolreg(req,res);
})
//-----------------------------------------------------------------------------

//Menu pecs ** Area Tecnicos e ABA 
//Carrega Cadastro pecs
router.get('/area/aba/pecs/pecscad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario Nota Supervisor
    fncPecs.carregaPecs(req, res);
})

//Lista Pecs
router.get('/area/aba/pecs/pecslis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista para o Formulario Nota Supervisor
    fncPecs.listaPecs(req, res);
})

//Adiciona Registro Pecs
router.post('/area/aba/pecs/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona pecs
    console.log("post")
    fncPecs.cadastraPecs(req, res); 
})

//Carrega Editar Pecs
router.get('/area/aba/pecs/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncPecs.carregaPecsedi(req,res);
})

//Carrega Atualizar Pecs
router.post('/area/aba/pecs/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncPecs.atualizaPecs(req,res);
})
//-----------------------------------------------------------------------------

//Menu visual ** Area Tecnicos e ABA 
//Carrega Cadastro visual
router.get('/area/aba/visual/visualcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario Nota Supervisor
    fncVisual.carregaVisual(req, res);
})
//Carrega Editar Visual
router.get('/area/aba/visual/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncVisual.carregaVisualedi(req,res);
})

//Lista Visual
router.get('/area/aba/visual/visuallis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista para o Formulario Nota Supervisor
    fncVisual.listaVisual(req, res);
})

//Adiciona Registro Visual
router.post('/area/aba/visual/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Visual
    console.log("post")
    fncVisual.cadastraVisual(req, res); 
})

//Carrega Atualizar Visual
router.post('/area/aba/visual/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncVisual.atualizaVisual(req,res);
})
//-----------------------------------------------------------------------------

//Menu Relsem ** Area Terapeutas
//Carrega Cadastro Relsem
router.get('/area/relsem/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario Relsem
    fncRelsem.carregaRelsem(req, res);
})

//Lista Relsem
router.get('/area/relsem/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista para o Relsem
    fncRelsem.listaRelsem(req, res);
})

//Lista todos os Relsem
router.post('/area/relsem/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Laudo, com bene e data.
    fncRelsem.filtraRelsem(req,res);
})

//Adiciona Registro Relsem
router.post('/area/relsem/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem
    console.log("post")
    fncRelsem.cadastraRelsem(req, res); 
})

//Carrega Editar Relsem
router.get('/area/relsem/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem Padrao
    fncRelsem.carregaRelsemedi(req,res);
})

//Carrega Atualizar Relsem
router.post('/area/relsem/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem Padrao
    fncRelsem.atualizaRelsem(req,res);
})

router.get('/area/relsem/imp/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem Padrao
    fncRelsem.relsemImp(req,res);
})
router.get('/area/relsem/capa/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem Padrao
    fncRelsem.relsemImpcapa(req,res);
})

router.post('/area/relsem/impFil', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Relsem Padrao
    fncRelsem.relsemImpFiltro(req,res);
})
//-----------------------------------------------------------------------------

//Menu Acompanhamento devolutivas e reuniões ** Area Tecnicos e ABA 
//Carrega Cadastro Acompanhamento, devolutivas e reuniões
router.get('/area/aba/acomp/acompcad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro para o Formulario Nota Supervisor
    fncAcomp.carregaAcomp(req, res);
})

//Lista Acomp
router.get('/area/aba/acomp/acomplis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o lista para o Formulario Nota Supervisor
    fncAcomp.listaAcomp(req, res);
})

//Adiciona Registro Acomp
router.post('/area/aba/acomp/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona pecs
    console.log("post")
    fncAcomp.cadastraAcomp(req, res); 
})

//Carrega Editar Acomp
router.get('/area/aba/acomp/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncAcomp.carregaAcompedi(req,res);
})

//Carrega Atualizar Acomp
router.post('/area/aba/acomp/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncAcomp.atualizaAcomp(req,res);
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

    //Menu Convenio/Convimp 
    //Impostos pertencentes aos convênios
    router.get('/convenio/convimp/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas convimp
        fncConvimp.listaConvimp(req,res);
    })

    router.get('/convenio/convimp/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Convdeb, com Ufs e Convênios.
        fncConvimp.carregaConvimp(req,res);
    })

    router.post('/convenio/convimp/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona convimp
        fncConvimp.cadastraConvimp(req,res);
    })

    router.get('/convenio/convimp/del/:id', (req,res) =>{//deleta convimp
        fncConvimp.deletaConvimp(req,res);
    })

    router.get('/convenio/convimp/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de convimp
        fncConvimp.carregaConvimpEdi(req,res);
    })

    router.post('/convenio/convimp/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da convimp
        fncConvimp.editarConvimp(req,res);
    })


//Menu Financeiro

//Menu Impostos **   
//Carrega Cadastro de Impostos 
router.get('/financeiro/imposto/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Laudo, com  bene e data.
    fncImposto.carregaImposto(req,res);
})
//Adiciona Registro de Imposto
router.post('/financeiro/imposto/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Laudo
    fncImposto.cadastraImposto(req,res);
})
//Carrega Imposto para Edição
router.get('/financeiro/imposto/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Imposto.
    fncImposto.carregaImpostoedi(req,res);
})
//Atualiza Imposto selecionado editado
router.post('/financeiro/imposto/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de LaImpostoudo.
    fncImposto.atualizaImposto(req,res);
})
//Lista todos os Imposto
router.get('/financeiro/imposto/lis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Imposto.
    fncImposto.listaImposto(req,res);
})
//Filtro da Lista dos Imposto
router.post('/financeiro/imposto/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de Imposto
    fncImposto.filtraImposto(req,res);
})
//Deleta Imposto Selecionado
router.get('/financeiro/imposto/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Imposto
    fncImposto.deletaImposto(req,res);
})
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

        //Saudecolab, Ficha Médica dos colaboradores
        router.get('/ferramentas/saudecolab/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas Saudecolab
            let resposta = new Resposta()
            resposta.texto = ""
            resposta.sucesso = ""
            fncSaudecolab.listaSaudecolab(req, res, resposta);
        })

        router.get('/ferramentas/saudecolab/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Saudecolab
            fncSaudecolab.carregaSaudecolab(req, res);
        })

        router.post('/ferramentas/saudecolab/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Saudecolab
            fncSaudecolab.cadastraSaudecolab(req, res);
        })

        router.get('/ferramentas/saudecolab/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta Saudecolab
            fncSaudecolab.deletaSaudecolab(req, res);
        })

        router.get('/ferramentas/saudecolab/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de Saudecolab
            fncSaudecolab.carregaSaudecolabEdi(req, res);
        })

        router.post('/ferramentas/saudecolab/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Saudecolab
            fncSaudecolab.atualizaSaudecolab(req, res);
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
    //Ano
    router.get('/ferramentas/ano/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas empresas
        fncAno.listaAno(req, res);
    })
    
    router.get('/ferramentas/ano/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de empresa.
        fncAno.carregaAno(req, res);
    })

    router.post('/ferramentas/ano/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona empresa
    fncAno.cadastraAno(req, res);

    })
    
    router.get('/ferramentas/ano/del/:id', fncGeral.IsAuthenticated, async (req, res) => {
        try {
          const anoId = req.params.id;
          await fncAno.deletaAno(anoId, req, res);
          // Redireciona para a listagem após a deleção
          res.redirect('/menu/ferramentas/ano/lis'); // URL da listagem
        } catch (err) {
          console.error(err);
          res.render('admin/erro');
        }
      })
    
    router.get('/ferramentas/ano/edi/:id', fncGeral.IsAuthenticated, (req, res) =>{//direciona a edição de empresa
        fncAno.carregaAnoEdi(req, res);
    })

    router.post('/ferramentas/ano/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Empresa
        fncAno.atualizaAno(req, res);
    })

//Menu Ferramentas
    //Especialidade do Plano de tratamento
        router.get('/ferramentas/especialidadePlano/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas especialidadePlanos
            let resposta = new Resposta()
            resposta.texto = ""
            resposta.sucesso = ""
            fncEspecialidadePlano.listaEspecialidadePlano(req, res, resposta);
            
        })

        router.get('/ferramentas/especialidadePlano/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de especialidadePlano
            fncEspecialidadePlano.carregaEspecialidadePlano(req, res);
        })

        router.post('/ferramentas/especialidadePlano/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona especialidadePlano
            fncEspecialidadePlano.cadastraEspecialidadePlano(req, res);
        })

        router.get('/ferramentas/especialidadePlano/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta especialidadePlano
            fncEspecialidadePlano.deletaEspecialidadePlano(req, res);
        })

        router.get('/ferramentas/especialidadePlano/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de especialidadePlano
            fncEspecialidade.carregaEspecialidadeEdi(req, res);
        })

        router.post('/ferramentas/especialidadePlano/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Especialidadeimento
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
    //Submenu Grade Curricular, grade
    //Método, Metodo
    router.get('/ferramentas/metodo/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas Métodos
        let resposta = new Resposta()
        resposta.texto = ""
        resposta.sucesso = ""
        fncMetodo.listaMetodo(req, res, resposta);
    })

    router.get('/ferramentas/metodo/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de metodo
        fncMetodo.carregaMetodo(req, res);
    })

    router.post('/ferramentas/metodo/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona metodo
        fncMetodo.cadastraMetodo(req, res);
    })

    router.get('/ferramentas/metodo/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta metodo
        fncMetodo.deletaMetodo(req, res);
    })

    router.get('/ferramentas/metodo/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metodo
        fncMetodo.carregaMetodoEdi(req, res);
    })

    router.post('/ferramentas/metodo/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro do Metodo
        fncMetodo.atualizaMetodo(req, res);
    })

//Menu Ferramentas
    //Submenu Grade Curricular, grade
    //Métout, Metout
    router.get('/ferramentas/metout/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas Métodos
        let resposta = new Resposta()
        resposta.texto = ""
        resposta.sucesso = ""
        fncMetout.listaMetout(req, res, resposta);
    })

    router.get('/ferramentas/metout/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de metout
        fncMetout.carregaMetout(req, res);
    })

    router.post('/ferramentas/metout/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona metout
        fncMetout.cadastraMetout(req, res);
    })

    router.get('/ferramentas/metout/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta metout
        fncMetout.deletaMetout(req, res);
    })

    router.get('/ferramentas/metout/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição do metout
        fncMetout.carregaMetoutEdi(req, res);
    })

    router.post('/ferramentas/metout/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro do Metout
        fncMetout.atualizaMetout(req, res);
    })

//Menu Ferramentas
    //Terapia
        router.get('/ferramentas/terapia/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todos as Terapias
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
            
        })

        router.get('/ferramentas/horaage/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de horario
            fncHoraAge.carregaHoraage(req, res);
        })
        
        router.post('/ferramentas/horaage/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona horario
            fncHoraAge.cadastraHoraage(req, res);

        })
        
        router.get('/ferramentas/horaage/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta horario
            fncHoraAge.deletaHoraage(req, res);
     
        })
        
        router.get('/ferramentas/horaage/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de horario
            fncHoraAge.carregaHoraageEdi(req, res);
        })
        
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

        router.post('/ferramentas/usuario/carregaResetarchave', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Usuarioimento
            fncUsuario.carregaResetarchave(req, res); 
        })

        router.get('/ferramentas/usuario/carregaMudarNomeTerapeuta', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de usuario
            let resposta = new Resposta()
            resposta.texto = ""
            resposta.sucesso = ""
            fncUsuario.carregaMudarNomeTerapeuta(req, res, resposta);
        })

        router.post('/ferramentas/usuario/mudarNomeTerapeuta', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Usuarioimento
            fncUsuario.mudarNomeTerapeuta(req, res);
        })
//Menu Ferramentas
        //Usufunc - Funcionalidades dos usuários podem acessar
        router.get('/ferramentas/usufunc/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas salas
            fncUsufunc.listaUsufunc(req, res);
        })

        router.get('/ferramentas/usufunc/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de sala
            fncUsufunc.carregaUsufunc(req, res);
        })

        router.post('/ferramentas/usufunc/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona sala
            fncUsufunc.cadastraUsufunc(req, res);
        })

        router.get('/ferramentas/usufunc/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta sala
            fncUsufunc.deletaUsufunc(req, res);
        })

        router.get('/ferramentas/usufunc/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de sala
            fncUsufunc.carregaUsufuncEdi(req, res);
        })

        router.post('/ferramentas/usufunc/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Salaimento
            fncUsufunc.atualizaUsufunc(req, res);
        })
//Menu Ferramentas
        //Usupermis - Permissão de Acesso aos usuários
        router.get('/ferramentas/usupermis/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas salas
            fncUsupermis.listaUsupermis(req, res);
        })

        router.get('/ferramentas/usupermis/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de sala
            fncUsupermis.carregaUsupermis(req, res);
        })

        router.post('/ferramentas/usupermis/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona sala
            fncUsupermis.cadastraUsupermis(req, res);
        })

        router.get('/ferramentas/usupermis/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta sala
            fncUsupermis.deletaUsupermis(req, res);
        })

        router.get('/ferramentas/usupermis/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de sala
            fncUsupermis.carregaUsupermisEdi(req, res);
        })

        router.post('/ferramentas/usupermis/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Salaimento
            fncUsupermis.atualizaUsupermis(req, res);
        })

       // Novas rotas para gestão em massa
        router.get('/ferramentas/usupermis/massa', fncGeral.IsAuthenticated, (req, res) => {
            fncUsupermis.gestaoMassa(req, res);
        })

        router.get('/ferramentas/usupermis/api/permissoes', fncGeral.IsAuthenticated, (req, res) => {
            fncUsupermis.apiPermissoesUsuario(req, res);
        })

        router.post('/ferramentas/usupermis/salvar-massa', fncGeral.IsAuthenticated, (req, res) => {
            fncUsupermis.salvarEmMassa(req, res);
        })
        router.post('/ferramentas/usupermis/salvar-massa-uform', fncGeral.IsAuthenticated, (req, res) => {
            fncUsupermis.salvarEmMassauform(req, res);
        });

       // Rota: Editar permissões do usuário
        router.get('/ferramentas/usupermis/edi/:id', fncGeral.IsAuthenticated, (req, res) => {
            console.log('🔹 Rota /usupermis/edi chamada com ID:', req.params.id);
            fncUsupermis.carregaPermissoesPorUsuario(req, res);
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

/*
function login(req,res, dbEscolhida){
    try {
        console.log("LOGIN??")
        // Variáveis iniciais
        let aux = 1;
        const hoje = new Date();
        const diaAtual = String(hoje.getUTCDate()).padStart(2, '0');
        const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0');

        // Calcular domingo (início da semana)
        const domingo = new Date(hoje);
        domingo.setDate(hoje.getDate() - hoje.getDay()); // 0 = domingo

        // Construir dias da semana: domingo a sábado
        const semanaDias = Array.from({ length: 7 }).map((_, i) => {
            const d = new Date(domingo);
            d.setDate(domingo.getDate() + i);
            return {
                dia: String(d.getUTCDate()).padStart(2, '0'),
                mes: String(d.getUTCMonth() + 1).padStart(2, '0')
            };
        });

        // Função auxiliar: filtrar aniversariantes da semana
        function filtrarAniversariantes(lista, tipo, campoNomeOriginal) {
            return lista
                .map(p => {
                    const dataNasc = new Date(p[`${tipo}_datanasc`]);
                    const dia = String(dataNasc.getUTCDate()).padStart(2, '0');
                    const mes = String(dataNasc.getUTCMonth() + 1).padStart(2, '0');
                    return {
                        dtnasc: dataNasc,
                        diaNascimento: dia,
                        mesNascimento: mes,
                        hoje: dia === diaAtual && mes === mesAtual,
                        ...(tipo === 'usuario' ? { usuario_nome: p.usuario_nome } : { bene_nome: p.bene_nome })
                    };
                })
                .filter(p =>
                    semanaDias.some(s =>
                        s.dia === p.diaNascimento && s.mes === p.mesNascimento
                    )
                )
                .sort((a, b) => {
                    if (a.mesNascimento !== b.mesNascimento) return a.mesNascimento - b.mesNascimento;
                    return a.diaNascimento - b.diaNascimento;
                });
        }

        // Função para normalizar o campo agenda_selo
        function normalizeBoolean(value) {
            if (typeof value === "boolean") {
                return value; // Já é um booleano, retorna como está
            }
            if (typeof value === "string") {
                return value.toLowerCase() === "true"; // Converte strings "true" ou "false" para booleano
            }
            return false; // Caso padrão (se for null, undefined ou outro tipo)
        }

        // Verificar usuário e perfil
        const usu = Usuario.findOne({ usuario_email: req.body.email, usuario_senha: req.body.senha });
        if (!usu || usu.usuario_status !== "Ativo") {
            req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
            return res.redirect('/menu/login');
        }

        const perfilId = usu.usuario_perfilid;
        const idUsu = usu._id;
        const base = req.body.preferredBase;

        // Definir tempo de expiração do cookie
        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000) // 5 horas
            : (2 * 60 * 60 * 1000); // 2 horas

        res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('preferredDb', base, { expires: new Date(Date.now() + tempoCookie) });

        // Buscar dados gerais
        const [usuarios, benes, salas, terapias, benesFull] = Promise.all([
            Usuario.find({ usuario_status: "Ativo" }),
            Bene.find({ bene_status: "Ativo" }),
            Sala.find(),
            Terapia.find(),
            Bene.find()
        ]);

        // Filtrar aniversariantes da semana
        const aniversariantesDaSemanaUsuario = filtrarAniversariantes(usuarios, "usuario", "nome");
        const aniversariantesDaSemanaBene = filtrarAniversariantes(benes, "bene", "nome");

        // Agendas semanais
        const inicioSemana = new Date(domingo);
        const fimSemana = new Date(domingo);
        fimSemana.setDate(domingo.getDate() + 6);

        const agendasSemanais = Agenda.find({
            agenda_data: { $gte: inicioSemana, $lte: fimSemana },
            agenda_usuid: idUsu
        });

        const evolucaoFaltante = agendasSemanais
            .filter(a => !normalizeBoolean(a.agenda_selo)) // Normaliza o campo agenda_selo
            .map(a => {
                const dat = new Date(a.agenda_data);
                const hora = String(dat.getUTCHours()).padStart(2, '0');
                const minuto = String(dat.getUTCMinutes()).padStart(2, '0');
                const sala = salas.find(s => String(s._id) === String(a.agenda_salaid));
                const bene = benesFull.find(b => String(b._id) === String(a.agenda_beneid));
                const terapia = terapias.find(t => String(t._id) === String(a.agenda_terapiaid));
                return {
                    _id: a._id,
                    agenda_data: fncGeral.getDataFMTOption(dat, "/"),
                    agenda_hora: `${hora}:${minuto}`,
                    agenda_data_dia: fncGeral.getDataFMT(dat),
                    agenda_aux: aux++,
                    agenda_data_semana: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()],
                    sala_nome: sala?.sala_nome || "Sala não encontrada",
                    bene_apelido: bene?.bene_apelido || "Beneficiário não encontrado",
                    terapia_nomecid: terapia?.terapia_nomecid || "Terapia não encontrada",
                    dia_hora_ordenação: `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${hora}${minuto}`,
                    agenda_selo: normalizeBoolean(a.agenda_selo) // Normaliza o campo agenda_selo
                };
            }).sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

        // Agendas do dia (com filtro)
        const inicioDia = new Date();
        inicioDia.setHours(0, 0, 0, 0);
        const fimDia = new Date();
        fimDia.setHours(23, 59, 59, 999);

        let agendas = Agenda.find({
            agenda_data: { $gte: inicioDia, $lte: fimDia },
            agenda_usuid: idUsu,
            agenda_temp: false
        });

        agendas = agendas.filter(a => a.atend_categoria !== "Feriado");

        agendas.forEach(a => {
            const dat = new Date(a.agenda_data);
            a.agenda_data_dia = fncGeral.getDataFMT(dat);
            a.agenda_hora = `${String(dat.getUTCHours()).padStart(2, '0')}:${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_aux = aux++;
            a.dia_hora_ordenação = `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${String(dat.getUTCHours()).padStart(2, '0')}${String(dat.getUTCMinutes()).padStart(2, '0')}`;
            a.agenda_data_semana = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()];
            a.agenda_selo = normalizeBoolean(a.agenda_selo); // Normaliza o campo agenda_selo
        });

        const agendaFinal = agendas.sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

        // Buscar dados adicionais
        const [terapias2, benes2, usuarios2] = Promise.all([
            Terapia.find(),
            Bene.find(),
            Usuario.find({
                usuario_status: "Ativo",
                $or: [
                    { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                    { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                ]
            })
        ]);

        // Mensagem de feedback
        const flash = new Resposta();
        if (!usu.usuario_palavrachave || usu.usuario_palavrachave === "undefined") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não cadastrou sua Palavra Chave.";
        } else if (usu.usuario_senha === "123456789") {
            flash.sucesso = "almost";
            flash.texto = "Você ainda não alterou sua senha temporária.";
        } else {
            flash.sucesso = "true";
            flash.texto = "Logado com sucesso!";
        }
console.log("TA CHEGANDO AQUI")
        // Renderizar a view
        res.render("branco", {
            flash,
            aniversariantesDaSemanaUsuario,
            aniversariantesDaSemanaBene,
            agendas: agendaFinal,
            evolucaoFaltante,
            terapias: terapias2,
            agendasSemanaiss: agendaFinal,
            benes: benes,
            salas,
            usuarios: usuarios2
        });
    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        res.redirect('/menu/login');
    }
}
*/