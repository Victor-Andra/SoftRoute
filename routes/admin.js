const express = require('express')
const router = express.Router()
const multer = require('multer')
const mongoose = require("mongoose")
const $ = require('jquery')
const {autenticador} = require("../helpers/autenticador")
let application = require('./admin')
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

//Compali - Escala LABIRINTO
const compaliClass = require("../models/compali")
var Compali = getModel("softroute", 'tb_compali', compaliClass.CompaliSchema)
const fncCompali = require("../functions/fncCompali")

//Ebai - Escala EBAI
const ebaiClass = require("../models/ebai")
var Ebai = getModel("softroute", 'tb_ebai', ebaiClass.EbaiSchema)
const fncEbai = require("../functions/fncEbai")

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

//manual, 
const manualClass = require("../models/manual")
var Manual = getModel("softroute", 'tb_manual', manualClass.ManualSchema);
const fncManual = require("../functions/fncManual")

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

//agendaEvento, cadastro dos AgendaEventos de Atividades 
const agendaEventoClass = require("../models/agendaEvento")
var AgendaEvento = getModel("softroute", 'tb_agendaEvento', agendaEventoClass.AgendaEventoSchema);//getModel("softroute", 'tb_agendaEvento', agendaEventoClass.AgendaEventoSchema)
const fncAgendaEvento = require("../functions/fncAgendaevento")

//AnotaAdm, cadastro dos Anotações administrativas de Atividades como festa route, tipos de relatórios, lembretes etc
const anotaAdmClass = require("../models/anotaAdm")
var AnotaAdm = getModel("softroute", 'tb_anotaAdm', anotaAdmClass.AnotaAdmSchema);//getModel("softroute", 'tb_agendaEvento', agendaEventoClass.AgendaEventoSchema)
const fncAnotaAdm = require("../functions/fncAnotaadm")

//Ajuda
const ajudaClass = require("../models/ajuda")
var Ajuda = getModel("PortalDoUsuario", 'tb_ajuda', ajudaClass.AjudaSchema);//Wagner cintra 16/11/2025
const fncAjuda = require("../functions/fncAjuda")

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

//Guias de Atendimento
//Guias numeros e datas sao inseridas dentro do agendamento, semelhante a evolucao
const guiaClass = require("../models/evoatend")
var Evoatend = getModel("softroute", 'tb_evoatend', evoatendClass.EvoatendSchema);//getModel("softroute", 'tb_evoatend', evoatendClass.EvoatendSchema)
const fncGuia= require("../functions/fncGuia")

//Lote de Guias de Atendimento
//Lotes sao um cabecalho que contem inumeras guias (atreladas ao agendamento)
const guialoteClass = require("../models/guialote")
var Guialote = getModel("softroute", 'tb_guialote', guialoteClass.GuialoteSchema);//getModel("softroute", 'tb_evoatend', evoatendClass.EvoatendSchema)
const fncGuialote= require("../functions/fncGuialote")

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
const notasupobsClass = require("../models/notasupobs.js")
var Notasupobs = getModel("softroute", 'tb_notasupobs', notasupobsClass.notasupobsSchema);//getModel("softroute", 'tb_notasupobs', notasupobsClass.notasupobsSchema)
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

//convPar, Receitas e pagamentos pela terapia realizada pelo Terapeuta (simultaneamente) Wagner Cintra 2025/11/12
const fncConvPar = require("../functions/fncConvPar");

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

//Estatisticas para Gestão
const fncEstatistica = require('../functions/fncEstatistica')



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

//faturamento mensal
const faturamensalClass = require("../models/faturamensal")
var FaturaMensal = getModel("softroute", 'tb_faturamensal', faturamensalClass.FaturaMensalSchema)
const fncFaturaMensal = require("../functions/fncFaturamensal")

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

// ============================================
// FUNÇÃO AUXILIAR: Buscar evoluções pendentes 
// Período: Dia 01 do mês atual até a DATA ATUAL
// ============================================
async function buscarEvolucoesPendentesMesOld(db, idTerapeuta) {
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    
    // Calcular período: dia 01 do mês atual até HOJE (UTC)
    const hoje = new Date();
    const inicioMes = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1, 0, 0, 0, 0));
    
    // ✅ AJUSTE: fimMes é HOJE (não mais o último dia do mês)
    const fimMes = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), 23, 59, 59, 999));
    
    console.log(`\n🔍 [EVOLUÇÕES PENDENTES] Período: ${inicioMes.toISOString()} até ${fimMes.toISOString()}`);
    
    try {
        // 1️⃣ Buscar agendamentos PAIS do período (agenda_temp: false)
        const agendasRaw = await Agenda.find({
            agenda_data: { $gte: inicioMes, $lte: fimMes },
            agenda_usuid: mongoose.Types.ObjectId(idTerapeuta),
            agenda_temp: false  // Apenas pais
        }).lean();
        
        console.log(`   📦 Pais encontrados no período: ${agendasRaw.length}`);
        
        if (agendasRaw.length === 0) {
            console.log(`   ✅ Evoluções pendentes: 0 (sem agendamentos no período)`);
            return 0;
        }
        
        // 2️⃣ Buscar filhos (substituições) que apontam para esses pais
        const idsPais = agendasRaw.map(a => a._id);
        const filhosRaw = await Agenda.find({ 
            agenda_tempId: { $in: idsPais } 
        }).lean();
        
        console.log(`   🔗 Filhos (substituições) encontrados: ${filhosRaw.length}`);
        
        // 3️⃣ Montar mapa de filhos por pai
        const mapaFilhos = new Map();
        filhosRaw.forEach(f => {
            const tempId = "" + f.agenda_tempId;
            if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
            mapaFilhos.get(tempId).push(f);
        });
        
        // 4️⃣ Helper: normalizar boolean
        const normalizeBoolean = (value) => {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") return value.toLowerCase() === "true";
            return false;
        };
        
        // 5️⃣ Processar cada registro aplicando as 8 regras
        let contadorPendentes = 0;
        
        for (const reg of agendasRaw) {
            // REGRA 1: Já foi evoluído? → PULA
            if (normalizeBoolean(reg.agenda_selo)) continue;
            
            // REGRA 2: Categoria bloqueada? → PULA
            const cat = (reg.agenda_categoria || "").toString().trim();
            if (cat === "Falta Absoluta" || cat === "Feriado") continue;
            
            // REGRA 3: Verificar cadeia de substituição
            const filhos = mapaFilhos.get("" + reg._id) || [];
            let registroResponsavel = reg; // por padrão, o pai é o responsável
            
            if (filhos.length > 0) {
                // Existe cadeia → o responsável é o ÚLTIMO da cadeia
                registroResponsavel = filhos[filhos.length - 1];
            }
            
            // REGRA 4: Só conta se o terapeuta logado é o responsável atual
            if (registroResponsavel.agenda_usuid?.toString() !== idTerapeuta) continue;
            
            // REGRA 5: Verificar categoria final (do responsável)
            const catFinal = (registroResponsavel.agenda_categoria || "").toString().trim();
            if (catFinal === "Falta Absoluta" || catFinal === "Feriado") continue;
            
            // REGRA 6: Verificar agenda_selo do RESPONSÁVEL FINAL
            if (normalizeBoolean(registroResponsavel.agenda_selo)) continue;
            
            // Se passou em todas as regras → É PENDENTE
            contadorPendentes++;
        }
        
        console.log(`   ✅ Evoluções pendentes (01 até hoje): ${contadorPendentes}`);
        
        return contadorPendentes;
    } catch (err) {
        console.error("❌ Erro ao buscar evoluções pendentes:", err);
        return 0;
    }
}

async function buscarEvolucoesPendentesMes(db, idTerapeuta) {
    var Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    
    // Calcular período: dia 01 do mês atual até HOJE (UTC)
    var hoje = new Date();
    var inicioMes = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1, 0, 0, 0, 0));
    
    // ✅ AJUSTE: fimMes é HOJE (não mais o último dia do mês)
    var fimMes = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), 23, 59, 59, 999));
    
    console.log(`\n🔍 [EVOLUÇÕES PENDENTES] Período: ${inicioMes.toISOString()} até ${fimMes.toISOString()}`);
    
    try {
        // 1️⃣ Buscar agendamentos PAIS do período (agenda_temp: false)
        var agendasRaw = await Agenda.find({
            agenda_data: { $gte: inicioMes, $lte: fimMes },
            agenda_usuid: mongoose.Types.ObjectId(idTerapeuta),
            agenda_temp: false  // Apenas pais
        }).lean();
        
        console.log(`   📦 Pais encontrados no período: ${agendasRaw.length}`);
        
        if (agendasRaw.length === 0) {
            console.log(`   ✅ Evoluções pendentes: 0 (sem agendamentos no período)`);
            return 0;
        }
        
        // 2️⃣ Buscar filhos (substituições) que apontam para esses pais
        var idsPais = agendasRaw.map(a => a._id);
        var filhosRaw = await Agenda.find({
            //agenda_tempId: { $in: idsPais }
            $or: [
                {
                    agenda_data: { $gte: inicioMes, $lte: fimMes },
                    agenda_usuid: mongoose.Types.ObjectId(idTerapeuta),
                    agenda_temp: true,
                    agenda_tempId: {
                        $nin: idsPais
                    }
                },
                {
                    agenda_tempId: {
                        $in: idsPais
                    }
                }
            ]
        }).lean();


        agendasRaw = agendasRaw.filter(
            agenda => !filhosRaw.some(
                filho => String(filho.agenda_tempId) === String(agenda._id)
            )
        );

        filhosRaw = filhosRaw.filter(f => String(f.agenda_usuid) === String(idTerapeuta));
        
        console.log(`   🔗 Filhos (substituições) encontrados: ${filhosRaw.length}`);

        var registros = agendasRaw.concat(filhosRaw);

        function normalizeBoolean(value) {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") return value.toLowerCase() === "true";
            return false;
        }

        var contadorPendentes = 0;

        for (var reg of registros) {

            if (normalizeBoolean(reg.agenda_selo))
                continue;

            var categoria = (reg.agenda_categoria || "").trim();

            if (categoria === "Falta Absoluta" ||  categoria === "Feriado") {
                continue;
            }

            if (reg.agenda_usuid?.toString() !== String(idTerapeuta)) continue;

            contadorPendentes++;
        }

        /*
        // Refazer o trecho abaixo
        // O codigo esta gerando informacoes com falso verdadeiro
        // Deve ser alterado o for e este foreach, o filtro ja foi feito mas exige melhora.
        // Lembrete !!!
        // A estrutura acima nao deve ser alterada

        // 3️⃣ Montar mapa de filhos por pai
        var mapaFilhos = new Map();
        filhosRaw.forEach(f => {
            var tempId = "" + f.agenda_tempId;
            if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
            mapaFilhos.get(tempId).push(f);
        });
        
        // 4️⃣ Helper: normalizar boolean
        var normalizeBoolean = (value) => {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") return value.toLowerCase() === "true";
            return false;
        };
        
        // 5️⃣ Processar cada registro aplicando as 8 regras
        let contadorPendentes = 0;
        
        for (var reg of agendasRaw) {
            // REGRA 1: Já foi evoluído? → PULA
            if (normalizeBoolean(reg.agenda_selo)) continue;
            
            // REGRA 2: Categoria bloqueada? → PULA
            var cat = (reg.agenda_categoria || "").toString().trim();
            if (cat === "Falta Absoluta" || cat === "Feriado") continue;
            
            // REGRA 3: Verificar cadeia de substituição
            var filhos = mapaFilhos.get("" + reg._id) || [];
            let registroResponsavel = reg; // por padrão, o pai é o responsável
            
            if (filhos.length > 0) {
                // Existe cadeia → o responsável é o ÚLTIMO da cadeia
                registroResponsavel = filhos[filhos.length - 1];
            }
            
            // REGRA 4: Só conta se o terapeuta logado é o responsável atual
            if (registroResponsavel.agenda_usuid?.toString() !== idTerapeuta) continue;
            
            // REGRA 5: Verificar categoria final (do responsável)
            var catFinal = (registroResponsavel.agenda_categoria || "").toString().trim();
            if (catFinal === "Falta Absoluta" || catFinal === "Feriado") continue;
            
            // REGRA 6: Verificar agenda_selo do RESPONSÁVEL FINAL
            if (normalizeBoolean(registroResponsavel.agenda_selo)) continue;
            
            // Se passou em todas as regras → É PENDENTE
            contadorPendentes++;
        }
        
        console.log(`   ✅ Evoluções pendentes (01 até hoje): ${contadorPendentes}`);
        */
        
        return contadorPendentes;
    } catch (err) {
        console.error("❌ Erro ao buscar evoluções pendentes:", err);
        return 0;
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
/**
 * ============================================================================
 * 🔍 FUNÇÃO AUXILIAR: Buscar Evoluções Faltantes (últimos 15 dias)
 * ============================================================================
 * Objetivo: Listar atendimentos passados que o terapeuta ainda não evoluiu
 * Regras de negócio aplicadas:
 *   - agenda_selo = false (não evoluído)
 *   - agenda_categoria NÃO pode ser "Falta Absoluta" ou "Feriado" (bloqueados)
 *   - Considera cadeia de substituição (só o atual responsável evolui)
 *   - Filtra pelo terapeuta logado
 *   - Ordena por data/hora (mais antigo primeiro)
 * ============================================================================
 */
async function buscarEvolucoesFaltantes(db, idTerapeuta, benesFull, salas, terapias) {
    const Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    
    // Intervalo de 15 dias para trás
    var hoje = new Date();
    var dataIsoIni = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1, 0, 0, 0, 0));
    
    // ✅ AJUSTE: fimMes é HOJE (não mais o último dia do mês)
    var dataIsoFim = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate(), 23, 59, 59, 999));
    
    console.log("\n🔍 [buscarEvolucoesFaltantes] Buscando últimos 15 dias...");
    console.log(`   📆 Período: ${dataIsoIni} até ${dataIsoFim}`);
    
    // 1️⃣ Buscar agendamentos PAIS do período (agenda_temp: false)
        var agendasRaw = await Agenda.find({
            agenda_data: { $gte: dataIsoIni, $lte: dataIsoFim },
            agenda_usuid: mongoose.Types.ObjectId(idTerapeuta),
            agenda_temp: false  // Apenas pais
        }).lean();
        
        console.log(`   📦 Pais encontrados no período: ${agendasRaw.length}`);
        
        if (agendasRaw.length === 0) {
            console.log(`   ✅ Evoluções pendentes: 0 (sem agendamentos no período)`);
            return 0;
        }
        
        // 2️⃣ Buscar filhos (substituições) que apontam para esses pais
        var idsPais = agendasRaw.map(a => a._id);
        var filhosRaw = await Agenda.find({
            //agenda_tempId: { $in: idsPais }
            $or: [
                {
                    agenda_data: { $gte: dataIsoIni, $lte: dataIsoFim },
                    agenda_usuid: mongoose.Types.ObjectId(idTerapeuta),
                    agenda_temp: true,
                    agenda_tempId: {
                        $nin: idsPais
                    }
                },
                {
                    agenda_tempId: {
                        $in: idsPais
                    }
                }
            ]
        }).lean();


        agendasRaw = agendasRaw.filter(
            agenda => !filhosRaw.some(
                filho => String(filho.agenda_tempId) === String(agenda._id)
            )
        );

        filhosRaw = filhosRaw.filter(f => String(f.agenda_usuid) === String(idTerapeuta));
        
        console.log(`   🔗 Filhos (substituições) encontrados: ${filhosRaw.length}`);

        var registros = agendasRaw.concat(filhosRaw);

        function normalizeBoolean(value) {
            if (typeof value === "boolean") return value;
            if (typeof value === "string") return value.toLowerCase() === "true";
            return false;
        }
    
    // 5️⃣ Processar cada registro aplicando regras de negócio
    const resultado = [];
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("reguistros "+registros.length);
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    console.log("aaaaaaaaaa")
    for (const reg of registros) {
        // Regra 1: Já foi evoluído? → PULA
        if (normalizeBoolean(reg.agenda_selo)) continue;
        
        // Regra 2: Categoria bloqueada? → PULA
        const cat = (reg.agenda_categoria || "").toString().trim();
        if (cat === "Falta Absoluta" || cat === "Feriado") continue;
        
        // Regra 4: Só mostra se o terapeuta logado é o responsável atual
        if (reg.agenda_usuid?.toString() !== idTerapeuta) continue;
        
        if (normalizeBoolean(reg.agenda_selo))
            continue;

        var categoria = (reg.agenda_categoria || "").trim();

        if (categoria === "Falta Absoluta" ||  categoria === "Feriado") {
            continue;
        }
        
        // 6️⃣ Enriquecer com nomes (sala, beneficiário, terapia)
        const dat = new Date(reg.agenda_data);
        const hora = String(dat.getUTCHours()).padStart(2, '0');
        const minuto = String(dat.getUTCMinutes()).padStart(2, '0');
        
        const sala = salas.find(s => String(s._id) === String(reg.agenda_salaid));
        const bene = benesFull.find(b => String(b._id) === String(reg.agenda_beneid));
        const terapia = terapias.find(t => String(t._id) === String(reg.agenda_terapiaid));
        
        // Chave de ordenação: YYYYMMDDHHmm
        const chaveOrdem = `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${hora}${minuto}`;
        
        resultado.push({
            _id: reg._id,
            agenda_data: fncGeral.getDataFMTOption ? fncGeral.getDataFMTOption(dat, "/") : dat.toLocaleDateString('pt-BR'),
            agenda_hora: `${hora}:${minuto}`,
            agenda_data_dia: fncGeral.getDataFMT(dat),
            agenda_data_semana: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()],
            sala_nome: sala?.sala_nome || "Sala não encontrada",
            bene_apelido: bene?.bene_apelido || bene?.bene_nome || "Beneficiário não encontrado",
            terapia_nomecid: terapia?.terapia_nomecid || "Terapia não encontrada",
            dia_hora_ordenação: chaveOrdem,
            agenda_categoria: categoria
        });
    }
    
    // 7️⃣ Ordenar: mais antigo primeiro (pendências mais urgentes no topo)
    resultado.sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));
    
    console.log(`   ✅ Evoluções faltantes: ${resultado.length}`);
    if (resultado.length > 0) {
        console.log(`   📋 Primeira: ${resultado[0].agenda_data} ${resultado[0].agenda_hora} - ${resultado[0].bene_apelido}`);
    }
    
    return resultado;
}
/**
 * ============================================================================
 * 🔄 ROTAS DE LOGIN - BACKUP
 * Esta rota é chamada após autenticação bem-sucedida via Passport.
 * VIEW DESTINO: "branco.handlebars" (container mestre que carrega _navbar dinâmico)
 * CONTAINERS DA VIEW (3 widgets principais):
 * ┌─────────────────────────────────────────────────────────────┐
 * │ 1️⃣ Widget "Faltaevo" (id="Faltaevo")                        │
 * │    → Tabela: "Evoluções Ausentes do dia"                    │
 * │    → Dados: agendaFinal (agendas sem selo, ordenadas)       │
 * │    → Ação: Link para evolucaoTemp/{{_id}}                   │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 2️⃣ Widget "Pontage" (id="Pontage")                          │
 * │    → Alert Vermelho: Observações da agenda (agenda_obs)     │
 * │    → Alert Amarelo: Lista de evolucaoFaltante com ação      │
 * │    → Dados: agendas (para obs) + evolucaoFaltante (lista)   │
 * ├─────────────────────────────────────────────────────────────┤
 * │ 3️⃣ Widget "percep" (id="percep")                            │
 * │    → Tabela: Aniversariantes da Semana (Beneficiários)      │
 * │    → Tabela: Aniversariantes da Semana (Colaboradores)      │
 * │    → Dados: aniversariantesDaSemanaBene + Usuario           │
 * └─────────────────────────────────────────────────────────────┘
 * 
 * DADOS GLOBAIS ENVIADOS:
 * - flash: Mensagem de login (sucesso/erro)
 * - terapias, benes, salas, usuarios: Para preenchimento de selects/labels
 * - agendasSemanaiss: Alias de agendaFinal (compatibilidade com view)
 */

router.post('/login/backup', passport.authenticate('local', {
    failureRedirect: '/menu/login',
    failureMessage: true
}), async function (req, res) {
    let db = req.cookies['preferredDb'];
    Bene = getModel(db, 'tb_bene', beneClass.BeneSchema);
    Agenda = getModel(db, 'tb_agenda', agendaClass.AgendaSchema);
    Sala = getModel(db, 'tb_sala', salaClass.SalaSchema);
    Terapia = getModel(db, 'tb_terapia', terapiaClass.TerapiaSchema);
    Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema);

    let aux = 1;
    let agendaFinal = [];
    let evolucaoFaltante = [];

    const hoje = new Date();
    const diaAtual = String(hoje.getUTCDate()).padStart(2, '0');
    const mesAtual = String(hoje.getUTCMonth() + 1).padStart(2, '0');

    // Calcular domingo (início da semana)
    const domingo = new Date(hoje);
    domingo.setDate(hoje.getDate() - hoje.getDay());

    // Construir dias da semana
    const semanaDias = Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(domingo);
        d.setDate(domingo.getDate() + i);
        return {
            dia: String(d.getUTCDate()).padStart(2, '0'),
            mes: String(d.getUTCMonth() + 1).padStart(2, '0')
        };
    });

    try {
        const benesGeral = await Bene.find({ bene_status: "Ativo" });
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
        const nomeUsu = usu.usuario_nome;

        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000)
            : (2 * 60 * 60 * 1000);

        res.cookie('lvlUsu', usu.usuario_perfilid, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('fncUsu', usu.usuario_funcaoid, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('nomeUsu', nomeUsu, { expires: new Date(Date.now() + tempoCookie) });

        const aniversariantesDaSemanaUsuario = usuarioClass.filtrarAniversariantes("usuario", semanaDias);
        const aniversariantesDaSemanaBene = beneClass.filtrarAniversariantes(req, "bene", semanaDias);

                    // ========================================================================
            // 📋 AGENDAS SEMANAIS (Lógica adaptada da carregaAgendaPessoal)
            // ========================================================================
            console.log("\n" + "=".repeat(80));
            console.log("📋 [AGENDAS SEMANAIS] Processando substituições (cadeia + dedup)");
            console.log("=".repeat(80));

            const inicioSemana = new Date(domingo);
            const fimSemana = new Date(domingo);
            fimSemana.setDate(domingo.getDate() + 6);

            // 🔹 1. Buscar agendas brutas do usuário logado
            const agendasBrutas = await Agenda.find({
                agenda_data: { $gte: inicioSemana, $lte: fimSemana },
                agenda_usuid: usu._id
            });
            console.log(`\n📦 1. Agendas brutas: ${agendasBrutas.length}`);

            // 🔹 2. Formatação básica (igual à Fase 3 da carregaAgendaPessoal)
            agendasBrutas.forEach((e) => {
                const dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                const h = String(dat.getUTCHours()).padStart(2, '0');
                const m = String(dat.getUTCMinutes()).padStart(2, '0');
                e.agenda_hora = `${h}:${m}`;
                e.agenda_data_semana = ["dom","seg","ter","qua","qui","sex","sab"][dat.getUTCDay()];
            });

            // 🔹 3. Buscar FILHOS (substituições) - igual à Fase 4
            const idsAtuais = agendasBrutas.map(a => a._id);
            const filhosEncontrados = await Agenda.find({
                agenda_temp: true,
                agenda_tempId: { $in: idsAtuais },
                agenda_data: { $gte: inicioSemana, $lte: fimSemana }
            });
            console.log(`🔗 3. Filhos encontrados: ${filhosEncontrados.length}`);

            // 🔹 4. Criar mapa: tempId → [filhos]
            const mapaFilhos = new Map();
            filhosEncontrados.forEach(f => {
                const tempId = f.agenda_tempId?.toString();
                if (tempId) {
                    if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                    mapaFilhos.get(tempId).push(f);
                }
            });

            // 🔹 5. Buscar dados auxiliares (para enriquecimento)
            const [salas, terapias, benesFull, usuariosNomes] = await Promise.all([
                Sala.find(),
                Terapia.find(),
                Bene.find(),
                Usuario.find({ _id: { $in: [...new Set([...agendasBrutas, ...filhosEncontrados].map(r => r.agenda_usuid))] } }, 'usuario_nome')
            ]);

            // Mapa de nomes de terapeutas
            const mapaNomes = {};
            usuariosNomes.forEach(u => { mapaNomes[u._id.toString()] = u.usuario_nome; });

            // 🔹 6. Função para resolver cadeia (simples: pai → filho)
            function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                let cadeia = [registroInicial];
                const idAtual = registroInicial._id.toString();
                
                if (visitados.has(idAtual) || nivel >= 2) return cadeia;
                visitados.add(idAtual);
                
                const cat = registroInicial.agenda_categoria;
                if (["Falta Justificada", "Falta Absoluta", "Feriado"].includes(cat)) return cadeia;
                
                const proximos = mapaFilhos.get(idAtual) || [];
                if (proximos.length > 0) {
                    const subCadeia = resolverCadeia(proximos[0], nivel + 1, visitados);
                    cadeia = cadeia.concat(subCadeia);
                }
                return cadeia;
            }

            // 🔹 7. Processar CADA registro (igual à Fase 5 da carregaAgendaPessoal)
            console.log("\n🧠 7. Processando registros com regras de substituição...");
            
            for (let idx = 0; idx < agendasBrutas.length; idx++) {
                const reg = agendasBrutas[idx];
                const idReg = reg._id.toString();
                const idUsuReg = reg.agenda_usuid?.toString();
                const temFilhos = mapaFilhos.has(idReg) && mapaFilhos.get(idReg).length > 0;

                if (!temFilhos) {
                    // 🟢 Sem cadeia: registro normal
                    reg._cadeia = { tamanho: 1, ultimoCategoria: reg.agenda_categoria };
                    reg._deveAparecer = (idUsuReg === idUsu);
                    reg._origem = 'normal';
                    console.log(`   [${idx+1}] ${reg.agenda_hora} | 🟢 Normal | Categoria: ${reg.agenda_categoria}`);
                    continue;
                }

                // 🔗 Tem cadeia: resolver
                const cadeia = resolverCadeia(reg);
                const ultimo = cadeia[cadeia.length - 1];
                const catFinal = ultimo.agenda_categoria;
                const idUltimoUsu = ultimo.agenda_usuid?.toString();

                // 👉 Monta histórico para debug
                const historicoNomes = cadeia.map((c, i) => {
                    const nivelTxt = i === 0 ? "Original" : `Subst.${i}`;
                    const nome = mapaNomes[c.agenda_usuid?.toString()] || "Desconhecido";
                    return `${nivelTxt}: ${nome} (${c.agenda_categoria})`;
                });

                // 👉 Texto para substituição
                let textoSubstituicao = "";
                if (cadeia.length >= 2 && catFinal === "Substituição") {
                    const nomeOriginal = mapaNomes[cadeia[0].agenda_usuid?.toString()] || "?";
                    const nomeSubstituto = mapaNomes[cadeia[1].agenda_usuid?.toString()] || "?";
                    textoSubstituicao = `${nomeOriginal} → ${nomeSubstituto}`;
                }

                // Armazena metadados no registro
                reg._cadeia = {
                    tamanho: cadeia.length,
                    ultimoId: ultimo._id,
                    ultimoCategoria: catFinal,
                    historico: historicoNomes,
                    textoSubstituicao
                };

                // 👉 REGRA PRINCIPAL: Quem deve aparecer?
                const ehUltimo = ultimo._id.toString() === reg._id.toString();
                const mesmoTerapeuta = idUltimoUsu === idUsu;
                
                if (idUsuReg === idUsu) {
                    // 👤 Logado é o ORIGINAL (substituído) → mostra PAI
                    reg._deveAparecer = true;
                    reg._registroParaView = reg;  // Usa o próprio registro (pai)
                    reg._origem = 'pai_substituido';
                    console.log(`   [${idx+1}] ${reg.agenda_hora} | 👤 Substituído → Exibe PAI | ${textoSubstituicao || catFinal}`);
                } 
                else if (idUltimoUsu === idUsu && !ehUltimo) {
                    // 👤 Logado é o SUBSTITUTO → mostra FILHO (último da cadeia)
                    reg._deveAparecer = true;
                    reg._registroParaView = ultimo;  // Usa o último da cadeia (filho)
                    reg._origem = 'filho_substituto';
                    console.log(`   [${idx+1}] ${reg.agenda_hora} | 👤 Substituto → Exibe FILHO | ${textoSubstituicao || catFinal}`);
                } 
                else {
                    // Não é para este usuário
                    reg._deveAparecer = false;
                    console.log(`   [${idx+1}] ${reg.agenda_hora} | ⏭️  Não aparece para este usuário`);
                }
            }

            // 🔹 8. Filtrar apenas o que deve aparecer (igual à Fase 6)
            console.log("\n🎯 8. Filtrando registros para exibição...");
            let agendaParaView = agendasBrutas.filter(r => r._deveAparecer === true);
            console.log(`   ✅ Registros que aparecerão: ${agendaParaView.length}`);

            // 🔹 9. Deduplicação: remover pai quando filho existe no mesmo slot (Fase 5.5 adaptada)
            console.log("\n🧹 9. Deduplicação: Pai vs Filho no mesmo slot...");
            
            const grupos = new Map();
            agendaParaView.forEach(reg => {
                const chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                if (!grupos.has(chave)) grupos.set(chave, []);
                grupos.get(chave).push(reg);
            });

            const idsParaRemover = new Set();
            grupos.forEach((registros, chave) => {
                if (registros.length < 2) return;
                
                const pais = registros.filter(r => !r.agenda_temp);
                const filhos = registros.filter(r => r.agenda_temp);
                
                if (filhos.length > 0 && pais.length > 0) {
                    const temSubstituicao = registros.some(r => r.agenda_categoria === "Substituição");
                    if (!temSubstituicao) {
                        // Remove pai, mantém filho
                        pais.forEach(pai => idsParaRemover.add(pai._id.toString()));
                        console.log(`   🗑️ Remove PAI | Slot: ${chave}`);
                        console.log(`   ✅ Mantém FILHO | Slot: ${chave}`);
                    }
                }
            });

            agendaParaView = agendaParaView.filter(reg => !idsParaRemover.has(reg._id.toString()));
            console.log(`   📊 Após dedup: ${agendaParaView.length} registros`);

            // 🔹 10. Enriquecer e formatar PARA A VIEW (estrutura igual ao original)
            console.log("\n✨ 10. Enriquecendo registros para a view...");
            aux = 1;
            
            agendaFinal = agendaParaView.map(reg => {
                // Usa o registro correto (pai ou filho) conforme regra
                const registroParaExibir = reg._registroParaView || reg;
                const dat = new Date(registroParaExibir.agenda_data);
                const hora = String(dat.getUTCHours()).padStart(2, '0');
                const minuto = String(dat.getUTCMinutes()).padStart(2, '0');

                // Enriquecimento com lookup nos arrays
                const sala = salas.find(s => String(s._id) === String(registroParaExibir.agenda_salaid));
                const bene = benesFull.find(b => String(b._id) === String(registroParaExibir.agenda_beneid));
                const terapia = terapias.find(t => String(t._id) === String(registroParaExibir.agenda_terapiaid));

                // 👇 RETORNO EXATO QUE A VIEW ESPERA
                return {
                    _id: registroParaExibir._id,
                    agenda_data: fncGeral.getDataFMTOption(dat, "/"),
                    agenda_hora: `${hora}:${minuto}`,
                    agenda_data_dia: fncGeral.getDataFMT(dat),
                    agenda_aux: aux++,
                    agenda_data_semana: ["dom", "seg", "ter", "qua", "qui", "sex", "sab"][dat.getUTCDay()],
                    
                    // Campos que a view usa diretamente
                    agenda_categoria: registroParaExibir.agenda_categoria,
                    agenda_selo: registroParaExibir.agenda_selo,
                    agenda_obs: registroParaExibir.agenda_obs,
                    agenda_salaid: registroParaExibir.agenda_salaid,
                    agenda_beneid: registroParaExibir.agenda_beneid,
                    agenda_terapiaid: registroParaExibir.agenda_terapiaid,
                    
                    // Dados enriquecidos (para exibir sem helpers)
                    sala_nome: sala?.sala_nome || "Sala não encontrada",
                    bene_apelido: bene?.bene_apelido || "Beneficiário não encontrado",
                    bene_nome: bene?.bene_nome || "Sem nome",
                    terapia_nomecid: terapia?.terapia_nomecid || "Terapia não encontrada",
                    
                    // Metadados (para lógica futura / debug)
                    _origem: reg._origem,
                    _cadeia: reg._cadeia,
                    
                    // Ordenação (igual ao original)
                    dia_hora_ordenação: `${dat.getUTCFullYear()}${String(dat.getUTCMonth() + 1).padStart(2, '0')}${String(dat.getUTCDate()).padStart(2, '0')}${hora}${minuto}`
                };
            });

            // Ordenar por hora
            agendaFinal.sort((a, b) => a.dia_hora_ordenação.localeCompare(b.dia_hora_ordenação));

            // 🔹 11. Montar evolucaoFaltante (igual ao original)
            evolucaoFaltante = agendaFinal
                .filter(a => !a.agenda_selo)
                .map(a => ({
                    ...a,
                    linkAcao: `/menu/agenda/evolucaoTemp/${a._id}`
                }));
            
            console.log(`\n📋 11. evolucaoFaltante: ${evolucaoFaltante.length} pendentes`);

            // 🔹 12. Debug final
            console.log("\n🔍 [DEBUG] Amostra de agendaFinal:");
            agendaFinal.slice(0, 5).forEach((a, i) => {
                console.log(`   [${i+1}] ${a.agenda_hora} | ${a.bene_apelido} | ${a.agenda_categoria} | Sala: ${a.sala_nome} | Origem: ${a._origem}`);
            });
            console.log("=".repeat(80) + "\n");

        // 🔹 7. Montar evolucaoFaltante (igual ao original)
        evolucaoFaltante = agendaFinal
            .filter(a => !a.agenda_selo)
            .map(a => ({
                ...a,
                linkAcao: `/menu/agenda/evolucaoTemp/${a._id}`
            }));
        
        console.log(`\n📋 7. evolucaoFaltante: ${evolucaoFaltante.length} pendentes`);

        // 🔹 8. Debug final
        console.log("\n🔍 [DEBUG] Amostra de agendaFinal (primeiros 5):");
        agendaFinal.slice(0, 5).forEach((a, i) => {
            console.log(`   [${i+1}] ${a.agenda_hora} | ${a.bene_apelido} | ${a.agenda_categoria} | Sala: ${a.sala_nome} | Origem: ${a._origem}`);
        });
        console.log("=".repeat(80) + "\n");

        // ========================================================================
        // 📦 DADOS GLOBAIS (igual ao original)
        // ========================================================================
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

        // ========================================================================
        // 🎯 MENSAGEM FLASH
        // ========================================================================
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

        // ========================================================================
        // 🎬 RENDERIZAR VIEW (igual ao original)
        // ========================================================================
        console.log("\n🎬 [RENDER] Enviando dados para view 'branco':");
        console.log(`   • agendas: ${agendaFinal.length}`);
        console.log(`   • evolucaoFaltante: ${evolucaoFaltante.length}`);
        console.log(`   • aniversariantesBene: ${aniversariantesDaSemanaBene.length}`);
        console.log(`   • aniversariantesUsuario: ${aniversariantesDaSemanaUsuario.length}`);
        console.log("=".repeat(80) + "\n");
        
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
            usuarios: usuarios2,
            usuario_nomeabrev: nomeUsu
        });

    } catch (err) {
        console.error("❌ [ERRO CRÍTICO] /login/backup:", err);
        console.error("   Stack:", err.stack);
        req.flash("error_message", "Erro ao autenticar o usuário.");
        res.redirect('/menu/login');
    }
}),
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
            if (!usu || usu.usuario_status !== "Ativo") {
                req.flash("error_message", "Usuário ou senha inválidos ou inativo.");
                return res.redirect('/menu/login');
            }
            if (usu.usuario_empresaids != undefined) {
                if (usu.usuario_empresaids.length == 1 && usu.usuario_empresaids[0] != null){
                    Empresa.findOne({_id: usu.usuario_empresaids[0]}).then((empresa)=>{
                        if (empresa.empresa_chavedb == null){
                            let dbEscolhida = "SoftRoute";
                            return login(req,res,dbEscolhida);
                        } else {
                            let dbEscolhida = empresa.empresa_chavedb;
                            return login(req,res,dbEscolhida);
                        }
                    })
                } else if (usu.usuario_empresaids.length > 1) {
                    Empresa.find({_id: {$in:usu.usuario_empresaids}}).then((empresa)=>{
                        let email = req.body.email;
                        let senha = req.body.senha;
                        lvl = "x";
                        res.render("ferramentas/usuario/loginDB", {nivel: lvl, email , senha, empresas: empresa})
                    })
                } else {
                    login(req,res,"SoftRoute");
                }
            } else {
                login(req,res,"SoftRoute");
            }
        });
    } catch (err) {
        console.error("Erro no login:", err);
        req.flash("error_message", "Erro ao autenticar o usuário.");
    }
});

router.post('/loginDB', passport.authenticate('local', { //redirecionado se tiver credencial para acessar mais de um banco (empresa)
    failureRedirect: '/menu/login',
    failureMessage: true
}), async function (req, res) {
    try {
        let dbEscolhida = req.body.dbEscolhida;
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
        var nomeUsu = usu.usuario_nome;
        // Definir tempo de expiração do cookie
        const tempoCookie = ["62421801a12aa557219a0fb9", "62421857a12aa557219a0fc1", "624218f5a12aa557219a0fd0"].includes(perfilId)
            ? (5 * 60 * 60 * 1000) // 5 horas
            : (2 * 60 * 60 * 1000); // 2 horas

        res.cookie('lvlUsu', perfilId, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('idUsu', idUsu, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('preferredDb', db, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('fncUsu', usu.usuario_funcaoid, { expires: new Date(Date.now() + tempoCookie) });
        res.cookie('nomeUsu', nomeUsu, { expires: new Date(Date.now() + tempoCookie) });

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

        // ✅ CÓDIGO CORRIGIDO:
        // Usar perfilId e idUsu que JÁ foram obtidos do usuário
        let isAgendaTerapeuta = false;
        const arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];
        arrayIds.forEach((id) => { 
            if (id == perfilId) isAgendaTerapeuta = true;  // 👈 Usa perfilId, não lvlUsu
        });

        let isSemanal = "false";
        let idTerapeuta = usu._id.toString();  // 👈 Usa idUsu já validado, não cookie
        aux = 1;
        let dtFill, segunda, terca, quarta, quinta, sexta, agora;
    
                // ========================================================================
        // 📅 FASE 1: Definir Período da Semana + Data para Filtro
        // ========================================================================
        console.log("\n📅 [FASE 1] Definindo período da semana");
        
        let seg = new Date(); seg.setHours(0,0,0,0);
        let sex = new Date(); sex.setHours(23,59,59,999);
        let diaSemana = new Date(seg);
    
        switch (seg.getUTCDay()) {
            case 0: agora = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() + 1); break;
            case 1: agora = "seg"; break;
            case 2: agora = "ter"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 1); break;
            case 3: agora = "qua"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 2); break;
            case 4: agora = "qui"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 3); break;
            case 5: agora = "sex"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 4); break;
            case 6: agora = "sab"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 5); break;
            default: agora = "dom"; diaSemana.setUTCDate(diaSemana.getUTCDate() - 6); break;
        }
    
        let diaDeHoje = new Date(diaSemana);
        let semana = [
            {dia: "seg", data: fncGeral.getData(diaSemana)},
            {dia: "ter", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qua", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "qui", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))},
            {dia: "sex", data: fncGeral.getData(diaSemana.setDate(diaSemana.getDate()+1))}
        ];
        
        let diaBase = new Date(diaDeHoje);
        segunda = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()-4));
        terca = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quarta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        quinta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
        sexta = fncGeral.getDataDiaMes(diaBase.setDate(diaBase.getDate()+1));
    
        let dataFiltro = seg.toISOString().slice(0, 10);
        console.log(`   📆 Período: ${seg.toISOString()} até ${sex.toISOString()} | dataFiltro: ${dataFiltro}`);
        console.log(`   📍 Dia de hoje na semana: ${agora}`);
    
        // ========================================================================
        // 🔍 FASE 2: Buscar Registros do Terapeuta Logado
        // ========================================================================
        console.log("\n🔍 [FASE 2] Buscando registros do terapeuta logado");
        
        let idFiltro = mongoose.Types.ObjectId(idTerapeuta);
        let dataIsoSeg = fncGeral.getDateToIsostring(seg);
        let dataIsoSex = fncGeral.getDateToIsostring(sex);
    
        return Agenda.find({
            agenda_data: { $gte: dataIsoSeg, $lte: dataIsoSex },
            agenda_usuid: idFiltro
        }, 'agenda_data agenda_usuid agenda_categoria agenda_temp agenda_tempId agenda_salaid agenda_beneid agenda_obs agenda_terapiaid agenda_selo agenda_evolucao').then((agenda) => {
            
            // 🔥 CONVERSÃO IMEDIATA PARA OBJETOS SIMPLES (essencial para campos customizados)
            let agendaObj = JSON.parse(JSON.stringify(agenda));
            
            console.log(`   📦 Registros brutos encontrados: ${agendaObj.length}`);
            if (agendaObj.length > 0) {
                console.log(`   🔍 Primeiro registro: obs="${agendaObj[0].agenda_obs || '(vazio)'}" | cat="${agendaObj[0].agenda_categoria}"`);
            }
            
            agendaObj.sort((a, b) => new Date(a.agenda_data) - new Date(b.agenda_data));
    
            // ========================================================================
            // 📝 FASE 3: Formatação dos Campos
            // ========================================================================
            console.log("\n📝 [FASE 3] Formatando campos dos registros");
            
            agendaObj.forEach((e) => {
                let dat = new Date(e.agenda_data);
                e.agenda_data_dia = fncGeral.getDataFMT(dat);
                let h = String(dat.getUTCHours()).padStart(2, '0');
                let m = String(dat.getMinutes()).padStart(2, '0');
                e.agenda_hora = `${h}:${m}`;
                e.agenda_aux = aux++;
                const dias = ["dom","seg","ter","qua","qui","sex","sab"];
                e.agenda_data_semana = dias[dat.getUTCDay()];
            });
            
            console.log(`   ✅ Formatados: ${agendaObj.length} registros`);
    
            // ========================================================================
            // 🔗 FASE 4: Detectar Filhos e Netos
            // ========================================================================
            console.log("\n🔗 [FASE 4] Detectando filhos e netos para resolução de cadeia");
            
            let idsAtuais = agendaObj.map(a => a._id);
            console.log(`   🔎 Buscando filhos que apontam para ${idsAtuais.length} registros...`);
    
            return Agenda.find({ agenda_tempId: { $in: idsAtuais } }).lean().then((filhosEncontrados) => {
                
                console.log(`   📦 Filhos encontrados no banco: ${filhosEncontrados.length}`);
                
                // Converter filhos para objetos simples também
                const filhosObj = JSON.parse(JSON.stringify(filhosEncontrados));
                
                let mapaFilhos = new Map();
                filhosObj.forEach(f => {
                    let tempId = "" + f.agenda_tempId;
                    if (tempId) {
                        if (!mapaFilhos.has(tempId)) mapaFilhos.set(tempId, []);
                        mapaFilhos.get(tempId).push(f);
                    }
                });
    
                // ========================================================================
                // 🧠 FASE 5: Resolver Cadeia + Buscar Nomes dos Terapeutas
                // ========================================================================
                console.log("\n🧠 [FASE 5] Resolvendo cadeia e buscando nomes dos terapeutas");
    
                let idsTerapeutas = new Set();
                agendaObj.forEach(r => idsTerapeutas.add(r.agenda_usuid?.toString()));
                filhosObj.forEach(f => idsTerapeutas.add(f.agenda_usuid?.toString()));
    
                return Usuario.find({ _id: { $in: Array.from(idsTerapeutas) } }, 'usuario_nome').lean().then((terapeutasNomes) => {
                    
                    let mapaNomes = {};
                    terapeutasNomes.forEach(t => { mapaNomes[t._id.toString()] = t.usuario_nome; });
                    console.log(`   👥 Nomes carregados: ${Object.keys(mapaNomes).length} terapeutas`);
    
                    // Função recursiva para seguir a cadeia
                    function resolverCadeia(registroInicial, nivel = 0, visitados = new Set()) {
                        let cadeia = [registroInicial];
                        let idAtual = "" + registroInicial._id;
                        if (visitados.has(idAtual) || nivel >= 2) return cadeia;
                        visitados.add(idAtual);
                        let cat = "" + registroInicial.agenda_categoria;
                        if (cat === "Falta Justificada" || cat === "Falta Absoluta" || cat === "Feriado") return cadeia;
                        let proximos = mapaFilhos.get(idAtual) || [];
                        if (proximos.length > 0) {
                            cadeia = cadeia.concat(resolverCadeia(proximos[0], nivel + 1, visitados));
                        }
                        return cadeia;
                    }
    
                    // 🎨 Helper badgeStyle (COR LARANJA PARA FALTA JUSTIFICADA)
                    function getBadgeStyle(cat) {
                        const map = {
                            "Falta": "yellow",
                            "Falta Justificada": "orange",  // ✅ CORRIGIDO: LARANJA
                            "Falta Absoluta": "orange",
                            "Substituição": "cyan",
                            "SubstitutoFixo": "transparent", // ✅ Tratado como padrão
                            "Feriado": "orange",
                            "default": "transparent"
                        };
                        const bg = map[cat] || map.default;
                        return `background-color: ${bg} !important; border: 1px solid transparent; color: #212529; display: inline-block; padding: 2px 6px; font-size: 9px; font-weight: 500; border-radius: 3px; white-space: nowrap; line-height: 1.3;`;
                    }
    
                    // ========================================================================
                    // 🔄 PROCESSA CADA REGISTRO DA AGENDA (LÓGICA CORRIGIDA)
                    // ========================================================================
                    agendaObj.forEach((reg, idx) => {
                        
                        let temFilhos = mapaFilhos.has("" + reg._id) && mapaFilhos.get("" + reg._id).length > 0;
                        
                        if (!temFilhos) {
                            // CASO 1: Sem cadeia
                            let cat = reg.agenda_categoria || "";
                            reg.cadeia = { nivel: 0, tamanho: 1, ultimoCategoria: cat };
                            reg.badgeStyle = getBadgeStyle(cat);
                            reg.deveAparecer = true;
                            
                            // 🟢 REGRA ESPECÍFICA PARA SUBSTITUTOFIXO
                            let isSubstFixo = (cat === "SubstitutoFixo");
                            let bloqueado = (cat === "Falta Absoluta" || cat === "Feriado");
                            
                            reg.ui = {
                                icone: bloqueado ? "ban" : "pencil",
                                tooltipTitulo: isSubstFixo ? "Padrão" : cat,
                                tooltipTexto: isSubstFixo ? "Clique para evoluir" : (
                                    {
                                        "Falta Absoluta": "Sem evolução possível",
                                        "Feriado": "Agenda fechada",
                                        "Falta Justificada": "Aguardando confirmação",
                                        "Falta": "Aguardando justificativa"
                                    }[cat] || "Clique para evoluir"
                                ),
                                temLink: !bloqueado
                            };
                            // ========================================================================
                            // 🚨 DETECÇÃO DE EVOLUÇÃO INDEVIDA (Falta Absoluta + evolução preenchida)
                            // ========================================================================
                            reg.temEvolucaoIndevida = false;
                            reg.podeApagarEvolucao = false;

                            if (cat === "Falta Absoluta" &&  // ← CORRIGIDO: usar 'cat' em vez de 'catFinal'
                                reg.agenda_evolucao && 
                                reg.agenda_evolucao.toString().trim() !== "") {
                                
                                reg.temEvolucaoIndevida = true;
                                reg.podeApagarEvolucao = true;
                                
                                // Sobrescrever tooltip para explicar a situação
                                reg.ui.tooltipTitulo = "⚠️ Evolução Indevida";
                                reg.ui.tooltipTexto = "Falta Absoluta com evolução registrada.\nClique na borracha para apagar.";
                                
                                console.log(`   🚨 [${idx+1}] EVOLUÇÃO INDEVIDA DETECTADA | Bene: ${reg.beneNome} | Evolução: "${reg.agenda_evolucao.substring(0, 30)}..."`);
                            }
                            return;
                        }
                        
                        // CASO 2: Com cadeia
                        let cadeia = resolverCadeia(reg);
                        let ultimo = cadeia[cadeia.length - 1];
                        let catFinal = (ultimo.agenda_categoria || "").toString().trim() || reg.agenda_categoria;
                        
                        reg.cadeia = {
                            nivel: cadeia.indexOf(reg),
                            tamanho: cadeia.length,
                            ultimoCategoria: catFinal,
                            historico: cadeia.map((c, i) => {
                                let nome = mapaNomes[c.agenda_usuid?.toString()] || "Desconhecido";
                                return `${i===0?"Original":`Subst.${i}`}: ${nome} (${c.agenda_categoria})`;
                            })
                        };
                        
                        reg.badgeStyle = getBadgeStyle(catFinal);
                        
                        // 🟢 DETECÇÃO ESTRITA: APENAS "Substituição" dispara lógica especial
                        let temSubstituicao = cadeia.some(c => c.agenda_categoria === "Substituição");
                        let isPaiOriginal = (cadeia[0]._id.toString() === reg._id.toString());
    
                        // 🟢 TOOLTIP: IDÊNTICO PARA PAI E FILHO (SE FOR SUBSTITUIÇÃO)
                        let tooltipTexto = "";
                        let tooltipTitulo = cadeia.length > 1 ? "🔗 Cadeia" : catFinal;
    
                        if (temSubstituicao) {
                            let nomeOrig = mapaNomes[cadeia[0].agenda_usuid?.toString()] || "Terapeuta A";
                            let regSubst = cadeia.find(c => c.agenda_categoria === "Substituição");
                            let nomeSubst = mapaNomes[regSubst?.agenda_usuid?.toString()] || "Terapeuta B";
                            tooltipTexto = `Substituição\n${nomeOrig} por ${nomeSubst}`;
                            tooltipTitulo = "🔁 Substituição";
                        } else {
                            let isSubstFixo = (catFinal === "SubstitutoFixo");
                            tooltipTitulo = isSubstFixo ? "Padrão" : tooltipTitulo;
                            tooltipTexto = isSubstFixo ? "Clique para evoluir" : (
                                catFinal === "Falta Absoluta" ? "Sem evolução possível" :
                                catFinal === "Feriado" ? "Agenda fechada" :
                                catFinal === "Falta Justificada" ? "Aguardando confirmação" :
                                catFinal === "Falta" ? "Aguardando justificativa" :
                                "Clique para evoluir"
                            );
                        }
    
                        // 🟢 ÍCONE E LINK: PAI = BAN, FILHO = PENCIL (APENAS EM SUBSTITUIÇÃO)
                        let iconeTipo = "pencil";
                        let podeEditar = true;
    
                        if (temSubstituicao) {
                            if (isPaiOriginal) {
                                iconeTipo = "ban";       
                                podeEditar = false;
                            } else {
                                iconeTipo = "pencil";    
                                podeEditar = true;
                            }
                        } else if (catFinal === "Falta Absoluta" || catFinal === "Feriado") {
                            iconeTipo = "ban";
                            podeEditar = false;
                        }
    
                        reg.deveAparecer = reg.agenda_usuid?.toString() === idTerapeuta;
                        reg.ui = {
                            icone: iconeTipo,
                            tooltipTitulo: tooltipTitulo,
                            tooltipTexto: tooltipTexto,
                            temLink: podeEditar
                        };
                        
                        console.log(`   [${idx+1}] 🔗 Cadeia(${cadeia.length}) | Pos: ${isPaiOriginal ? 'PAI' : 'FILHO'} | CatFinal: ${catFinal} | Sub? ${temSubstituicao} | Icone: ${iconeTipo}`);
                    });
    
                    // ========================================================================
                    // 🧹 FASE 5.5: Remover duplicados
                    // ========================================================================
                    console.log("\n🧹 [FASE 5.5] Removendo duplicados");
    
                    let grupos = new Map();
                    agendaObj.forEach(reg => {
                        let chave = `${reg.agenda_data_semana}_${reg.agenda_hora}_${reg.agenda_salaid}_${reg.agenda_beneid}`;
                        if (!grupos.has(chave)) grupos.set(chave, []);
                        grupos.get(chave).push(reg);
                    });
    
                    let idsParaRemover = new Set();
                    grupos.forEach((registros) => {
                        if (registros.length < 2) return;
                        let pais = registros.filter(r => !r.agenda_temp);
                        let filhos = registros.filter(r => r.agenda_temp);
                        if (filhos.length > 0 && pais.length > 0) {
                            let temSubstituicao = registros.some(r => r.agenda_categoria === "Substituição");
                            if (!temSubstituicao) {
                                pais.forEach(pai => idsParaRemover.add("" + pai._id));
                            }
                        }
                    });
    
                    agendaObj = agendaObj.filter(reg => !idsParaRemover.has("" + reg._id));
                    console.log(`   📊 Duplicados removidos: ${agenda.length - agendaObj.length}`);
    
                    // ========================================================================
                    // 🎯 FASE 6: Filtrar para exibição + enriquecer
                    // ========================================================================
                    console.log("\n🎯 [FASE 6] Filtrando e enriquecendo registros");
                    let agendasParaView = agendaObj.filter(r => r.deveAparecer === true);
                    
                    // Injetar beneNome e beneClass
                    agendasParaView.forEach(reg => {
                        const beneEncontrado = benesFull.find(b => b._id.toString() === reg.agenda_beneid?.toString());
                        reg.beneNome = beneEncontrado?.bene_nome || 'Sem beneficiário';
                        reg.beneApelido = beneEncontrado?.bene_apelido || reg.beneNome;
                        
                        // beneClass para compatibilidade com view antiga
                        const catFinal = reg.cadeia?.ultimoCategoria || reg.agenda_categoria;
                        reg.beneClass = (() => {
                            switch(catFinal) {
                                case "Falta": return "bene-yellow";
                                case "Falta Justificada": return "bene-orange"; // ✅ LARANJA
                                case "Falta Absoluta": case "Feriado": return "bene-orange";
                                case "Substituição": return "bene-cyan";
                                default: return "bene-default";
                            }
                        })();
                        
                       

                        // 🚨 ADICIONAR SÍMBOLO DE ALERTA SE FOR EVOLUÇÃO INDEVIDA
                        if (reg.temEvolucaoIndevida) {
                            reg.simboloAlerta = "⚠️";
                            reg.tooltipAlerta = "O atendimento virou Falta Absoluta. Você deve limpar a evolução clicando no ícone da borracha.";
                        } else {
                            reg.simboloAlerta = "";
                            reg.tooltipAlerta = "";
                        }
                        if (reg.cadeia?.tamanho > 1 && reg.agenda_usuid?.toString() !== idTerapeuta) {
                            reg.ui.temLink = false; reg.ui.icone = "ban";
                        }
                    });
    
                    console.log(`   ✅ Registros para view: ${agendasParaView.length}`);
                    // 🧠 FASE 6.5: REGRA ABSOLUTA DE EVOLUÇÃO (SOBRESCREVE TUDO)
                        console.log("\n🧠 [FASE 6.5] Aplicando redefinição de evolução (agenda_selo)");

                        agendasParaView = agendasParaView.map(reg => redefinicaoEvolucao(reg));

                        // ========================================================================
                        // 🚨 SOBRESCREVER COR APÓS redefinicaoEvolucao (PARA EVOLUÇÃO INDEVIDA)
                        // ========================================================================
                        agendasParaView.forEach(reg => {
                            // Se for evolução indevida, FORÇAR cor laranja (mesmo que redefinicaoEvolucao tenha colocado verde)
                            if (reg.temEvolucaoIndevida) {
                                reg.badgeStyle = `
                                    background-color: orange !important;
                                    color: #212529 !important;
                                    border: 1px solid transparent;
                                    display: inline-block;
                                    padding: 2px 6px;
                                    font-size: 9px;
                                    font-weight: 500;
                                    border-radius: 3px;
                                    white-space: nowrap;
                                    line-height: 1.3;
                                `;
                                reg.simboloAlerta = "⚠️";
                                reg.tooltipAlerta = "O atendimento virou Falta Absoluta. Você deve limpar a evolução clicando no ícone da borracha.";
                            } else {
                                reg.simboloAlerta = "";
                                reg.tooltipAlerta = "";
                            }
                        });
    
                    // ========================================================================
                    // 📋 FASE 7: Log Final
                    // ========================================================================
                    console.log("\n📋 [FASE 7] Resumo dos registros para a view");
                    agendasParaView.forEach((a, i) => {
                        let tipo = a.agenda_temp ? "FILHO" : "PAI";
                        let cadeiaTxt = a.cadeia?.tamanho > 1 ? `🔗${a.cadeia.tamanho}` : "🟢";
                        console.log(`   [${i+1}] ${tipo} | ${a.agenda_hora} | selo:${a.agenda_selo} | cat:${a.agenda_categoria} | bene:${a.beneNome} | class:${a.beneClass} | tooltip:"${a.ui?.tooltipTexto}"`);
                    });
    
                    // ========================================================================
                    // 📦 FASE 8: Buscar dados adicionais e renderizar
                    // ========================================================================
                    console.log("\n📦 [FASE 8] Carregando dados auxiliares");
                    
                    return Promise.all([
                        Terapia.find().lean(),
                        Bene.find({ bene_status: "Ativo" }).lean(),
                        Usuario.find({
                            usuario_status: "Ativo",
                            $or: [
                                { usuario_funcaoid: "6241030bfbcc51f47c720a0b" },
                                { usuario_perfilid: { $in: ["6578ab5248bfdf9fe1b2c8d8", "62421903a12aa557219a0fd3"] } }
                            ]
                        }).lean()
                    ]).then(async ([terapias2, benes2, usuarios2]) => {
                        
                        benes2.sort((a,b) => a.bene_nome?.localeCompare(b.bene_nome, 'pt-BR')||0);
                        usuarios2.sort((a,b) => a.usuario_nome?.localeCompare(b.usuario_nome, 'pt-BR')||0);
    
                        const flash = new Resposta();
                        if (!usu.usuario_palavrachave || usu.usuario_palavrachave === "undefined") {
                            flash.sucesso = "almost";
                            flash.texto = "Você ainda não cadastrou sua Palavra Chave.";
                        } else {
                            flash.sucesso = "true";
                            flash.texto = "Logado com sucesso!";
                        }
                        
                        // 🔍 BUSCAR EVOLUÇÕES FALTANTES (últimos 15 dias) - código existente
                        let evolucaoFaltante = [];
                        try {
                            evolucaoFaltante = await buscarEvolucoesFaltantes(
                                db, 
                                idTerapeuta, 
                                benesFull,
                                salas,
                                terapias2
                            );
                        } catch (err) {
                            console.error("❌ Erro ao buscar evoluções faltantes:", err);
                            evolucaoFaltante = [];
                        }

                        // ========================================================================
                        // 🆕 NOVO: Contar evoluções pendentes do mês corrente + verificar perfil
                        // ========================================================================
                        console.log("\n🔔 [MODAL EVOLUÇÕES] Verificando pendências do mês");

                        // IDs dos perfis que NÃO devem ver o modal (master/supervisor/root)
                        const perfisSemModal = ['644743aa78166939169f8486', '62421801a12aa557219a0fb9', '644742e378166939169f82a1'];
                        const mostrarModalEvolucoes = !perfisSemModal.includes(perfilId);

                        let evolucoesPendentesMes = 0;
                        if (mostrarModalEvolucoes) {
                            try {
                                evolucoesPendentesMes = await buscarEvolucoesPendentesMes(db, idTerapeuta);
                                console.log(`   🔔 Modal será exibido: ${mostrarModalEvolucoes} | Pendências: ${evolucoesPendentesMes}`);
                            } catch (err) {
                                console.error("❌ Erro ao contar evoluções pendentes:", err);
                                evolucoesPendentesMes = 0;
                            }
                        } else {
                            console.log(`   ⏭️ Perfil ${perfilId} não exibe modal de evoluções`);
                        }
                        // ========================================================================

                        console.log("\n✅ [SUCESSO] Renderizando view branco");
                        let dataDeHoje = new Date();
                        res.render("branco", {
                            flash,
                            aniversariantesDaSemanaUsuario,
                            aniversariantesDaSemanaBene,
                            agendas: agendasParaView,
                            evolucaoFaltante: evolucaoFaltante,
                            terapias: terapias2,
                            benes: benes2,
                            salas,
                            usuarios: usuarios2,
                            dataDeHoje,
                            mostrarModalEvolucoes: mostrarModalEvolucoes,
                            evolucoesPendentesMes: evolucoesPendentesMes,
                            usuId: idTerapeuta,
                            // ✅ ADICIONAR ESTAS LINHAS
                            funcUsuario: usu.usuario_funcaoid,
                            perfilUsuario: usu.usuario_perfilid
                        });
                    });
                });
            });
        });
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

function redefinicaoEvolucao(reg) {

    const selo = (reg.agenda_selo === true || reg.agenda_selo === "true");

    const temEvolucao =
        reg.agenda_evolucao !== null &&
        reg.agenda_evolucao !== undefined &&
        String(reg.agenda_evolucao).trim() !== "";

    // 🚨 REGRA FINAL ABSOLUTA
    if (selo || temEvolucao) {

        reg.ui = {
            icone: "check",
            tooltipTitulo: "Evolução",
            tooltipTexto: "Evolução realizada",
            temLink: false
        };

        reg.badgeStyle = `
            background-color: #c8e6c9 !important;
            color: #2e7d32 !important;
            border: 1px solid #a5d6a7;
            font-weight: 600;
        `;

        reg.beneClass = "bene-success";

        // opcional debug
        reg._evoluido = true;
    }

    return reg;
}
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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

//Controle do Agendamento Fixo por Beneficiário com funcionalidades adicionais para equipe de Atendimento e Fechamento
router.get("/agenda/lisSBFixo/", fncGeral.IsAuthenticated, (req,res) =>{// Abre Agedamento Semanal por Beneficiário Especial
    fncAgenda.carregaAgendaSBFixo(req, res);
})

router.post("/agenda/filSBFixo", fncGeral.IsAuthenticated, (req,res) =>{// Filtra o Agedamento Semanal por Beneficiário Especial
    fncAgenda.carregaAgendaFilSBFixo(req, res);
})

//--------------------------------------------------------------------
//Controle do Agendamento Semanal com Fixos 
router.get("/agenda/lisSFixo/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal com Fixos.
    fncAgenda.carregaAgendaSFixo(req, res);
})
router.post("/agenda/filSFixo/", fncGeral.IsAuthenticated, (req,res) =>{//direciona a listagem de Agenda Semanal filtrada com Fixos.
    fncAgenda.carregaAgendaFilSFixo(req, res);
})

//--------------------------------------------------------------------

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

// === Agenda Mensal por Beneficiário ===
router.get("/agenda/lisMensal", fncGeral.IsAuthenticated, (req, res) => {
    // Carrega a view com filtros vazios (mês atual, TODOS beneficiários, sem filtro SubFix)
    req.body.dataFinal = new Date().toISOString().split('T')[0]; // hoje como padrão
    req.body.agendaBeneid = 'TODOS';
    req.body.soFixo = 'true';
    fncAgenda.carregaTabdimAgendaMes(req, res);
})

router.post("/agenda/filMensal", fncGeral.IsAuthenticated, (req, res) => {
    // Processa os filtros enviados pelo form
    fncAgenda.carregaTabdimAgendaMes(req, res);
})

// === Relatório Mensal Consolidado - Apenas Fixos ===
router.get("/agenda/lisMesFixo", fncGeral.IsAuthenticated, (req, res) => {
    // Carrega com mês atual e TODOS beneficiários
    req.body.dataFinal = new Date().toISOString().split('T')[0];
    req.body.agendaBeneid = 'TODOS';
    fncAgenda.carregaAgendaMesFixo(req, res);
})

router.post("/agenda/filMesFixo", fncGeral.IsAuthenticated, (req, res) => {
    // Processa filtros do form
    fncAgenda.carregaAgendaMesFixo(req, res);
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAgenda.carregaAgendaEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/ediTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAgenda.carregaAgendaEdiTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/atualizaTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAgenda.atualizaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.get('/agenda/cadTemp/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAgenda.carregaAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/addTemp', fncGeral.IsAuthenticated, (req,res) =>{//direciona para salvar a edição de agenda diária
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAgenda.cadastraAgendaTemp(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/agenda/cadE/atualiza', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    let usuariosAutorizados = ["62422397cf2fd2bb541f918e","6247ba1cfe2181047dc7c965","627163e1a5fc3fa857f47924","6247c4192d0b03c5ada4feb4"];
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



router.get('/agenda/apagarEvolucaobranco/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncAgenda.apagarEvolucaoIndevidabranco(req, res);
})

// 👉 NOVA ROTA: Filtra agenda pessoal por dia específico
router.post('/agenda/filPessoalDia', fncGeral.IsAuthenticated, (req,res) => {
    fncAgenda.filtraAgendaPessoalDia(req, res);
});

router.get('/agenda/apagarEvolucaoagendapessoal/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncAgenda.apagarEvolucaoIndevidaagendapessoal(req, res);
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

//Agenda em Lista 
router.get('/agenda/agendaListaGeral', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a edição de agenda
    fncAgenda.carregaAgendaListaGeral(req, res);
})

// 👉 ROTA GET: carrega lista do mês atual
router.get('/agenda/lisGeral', fncGeral.IsAuthenticated, (req, res) => {
    let resposta = new Resposta();
    resposta.sucesso = "";
    resposta.texto = "";
    fncAgenda.carregaAgendaListaGeral(req, res, false, resposta);
});

// 👉 ROTA POST: filtra por mês selecionado
router.post('/agenda/lisGeral', fncGeral.IsAuthenticated, (req, res) => {
    let resposta = new Resposta();
    resposta.sucesso = "";
    resposta.texto = "";
    fncAgenda.carregaAgendaListaGeral(req, res, false, resposta);
});

// 👉 ROTA GET: carrega lista do mês atual
router.get('/agenda/lisGeralFixa', fncGeral.IsAuthenticated, (req, res) => {
    let resposta = new Resposta();
    resposta.sucesso = "";
    resposta.texto = "";
    fncAgenda.carregaAgendaListaGeralFixa(req, res, false, resposta);
});

// 👉 ROTA POST: filtra por mês selecionado
router.post('/agenda/lisGeralFixa', fncGeral.IsAuthenticated, (req, res) => {
    let resposta = new Resposta();
    resposta.sucesso = "";
    resposta.texto = "";
    fncAgenda.carregaAgendaListaGeralFixa(req, res, false, resposta);
});


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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAtend.carregaAtendEdi(req, res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})

router.post('/atendimento/atualizar', fncGeral.IsAuthenticated,(req,res) =>{//atualiza o cadastro da Atendimento
    let potinho = Object.assign(new PoteBiscoito, req.cookies);
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
        fncAtend.atualizaAtend(req , res);
    } else {
        console.log("Acesso NEGADO!");
        let lvl = "x";
        res.render("ferramentas/usuario/login", {nivel: lvl});
    }
})
//Estatistica e Gestão
//###############################################################################################

// Rota para Relatório Quantitativo de Beneficiários
router.get('/atendimento/atendreltera/gestao/relqtbene', fncGeral.IsAuthenticated, function(req, res) {
    fncEstatistica.carregaRelQtdBene(req, res);
});

//faturamento Mensal
//###############################################################################################

router.get('/financeiro/fatura/lis', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.listaFatura(req, res);
})

router.get('/financeiro/fatura/cad', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.carregaFatura(req, res);
})

router.post('/financeiro/fatura/processar', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.processarFaturamento(req, res);
})

router.post('/financeiro/fatura/salvar', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.salvarFaturamento(req, res);
})

router.get('/financeiro/fatura/anual', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.relatorioAnual(req, res);
})

router.get('/financeiro/fatura/edi/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.carregaFaturaEdi(req, res);
})

router.post('/financeiro/fatura/atualizar', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.atualizaFatura(req, res);
})

router.get('/financeiro/fatura/del/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncFaturaMensal.deletaFatura(req, res);
})
  

//Relatório de Atendimentos por Convênio.
//pagos pelos convênios, incluindo particular, num determinado período de tempo.
    router.get('/atendimento/relatendval', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoVal(req,res);
    })

    router.post('/atendimento/relatendvals', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoValFiltro(req,res);
    })


/**
 * TABDIM - Tabelas Dinâmicas de Atendimento
 * Criado por: Wagner Cintra
 * Data Criação: 04-02-2026
 * 
 * Padrão de nomenclatura:
 * - tabdim_{Agrupamento}Atendval → Carrega view (GET)
 * - tabdim_{Agrupamento}AtendvalFiltro → Processa filtro (POST)
 */

// ============================================
// 1. Convênio e Terapia
// ============================================
router.get('/atendimento/tabdimConvTeraAtendval', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvTeraAtendval(req, res);
});

router.post('/atendimento/tabdimConvTeraAtendvalFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvTeraAtendvalFiltro(req, res);
});

// ============================================
// 2. Beneficiário e Terapeuta
// ============================================
router.get('/atendimento/tabdimBeneTeraAtendval', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimBeneTeraAtendval(req, res);
});

router.post('/atendimento/tabdimBeneTeraAtendvalFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimBeneTeraAtendvalFiltro(req, res);
});

// ============================================
// 3. Terapeuta e Beneficiário
// ============================================
router.get('/atendimento/tabdimTeraBeneAtendval', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimTeraBeneAtendval(req, res);
});

router.post('/atendimento/tabdimTeraBeneAtendvalFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimTeraBeneAtendvalFiltro(req, res);
});

// ============================================
// 4. Convênio e Beneficiário
// ============================================
router.get('/atendimento/tabdimConvBeneAtendval', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvBeneAtendval(req, res);
});

router.post('/atendimento/tabdimConvBeneAtendvalFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvBeneAtendvalFiltro(req, res);
});

// ============================================
// 4. Beneficiário e Terapia (semelhante ao Ana. Benefinciario)
// ============================================
router.get('/atendimento/tabdimBeneVal', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimBeneVal(req, res);
});

router.post('/atendimento/tabdimBeneValFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimBeneValFiltro(req, res);
});




// ============================================
// 6. Convênio, Beneficiário e Terapeuta (3 níveis)
// ============================================
router.get('/atendimento/tabdimConvBeneTeraAtendval', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvBeneTeraAtendval(req, res);
});

router.post('/atendimento/tabdimConvBeneTeraAtendvalFiltro', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.tabdimConvBeneTeraAtendvalFiltro(req, res);
});

//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
    router.get('/atendimento/relatendbene', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBene(req,res);
    })
    router.post('/atendimento/relatendbenes', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneFiltro(req,res);
    })
//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo 
//com espaço para assinataura individual, tanto responsável quanto do terapeuta
    router.get('/atendimento/relatendbeneassin', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassin(req,res);
    })
    router.post('/atendimento/relatendbeneassins', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinFiltro(req,res);
    })
//Relatório Individual de Atendimentos por Beneficiário Atualizado para horario AT.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
//Criado: 06/02/2026
    router.get('/atendimento/relatendbeneAT', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneAT(req,res);
    })
    router.post('/atendimento/relatendbeneAT', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneFiltroAT(req,res);
    })

    router.get('/atendimento/relatendbeneATNovo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneATNovo(req,res);
    })
    router.post('/atendimento/relatendbeneFiltroATNovo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneFiltroATNovo(req,res);
    })




//Relatório Individual de Atendimentos por Beneficiário Atualizado para horario AT.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo 
//com espaço para assinataura individual, tanto responsável quanto do terapeuta
//Criado: 06/02/2026
    router.get('/atendimento/relatendbeneassinAT', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinAT(req,res);
    })
    router.post('/atendimento/relatendbeneassinsAT', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinFiltroAT(req,res);
    })

    router.get('/atendimento/relatendbeneassinAT_Novo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinAT_Novo(req,res);
    })
    router.post('/atendimento/relatendbeneassinsAT_Novo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneassinFiltroAT_Novo(req,res);
    })

    //Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo e com sessões de terapia 05/12/2025.
    router.get('/atendimento/relatendbenesec', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBenessec(req,res);
    })
    router.post('/atendimento/relatendbenesecs', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBenesecFiltro(req,res);
    })

    //Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo e com sessões de terapia 05/12/2025.
    router.get('/atendimento/relatendbenesec_novo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBenessecNovo(req,res);
    })
    router.post('/atendimento/relatendbenesecs_novo', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBenesecFiltroNovo(req,res);
    })

//Relatório Consolidado de Atendimentos por Beneficiário.
//Emite uma consolidado de todos os atendimentos realizados com Valores pelo beneficiário num determinado período de tempo.
    router.get('/atendimento/relatendbenecons', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneCons(req,res);
    })

    router.post('/atendimento/relatendvalconss', fncGeral.IsAuthenticated,(req,res) =>{
        fncAtend.relAtendimentoBeneConsFiltro(req,res);
    })

//Relatório de Atendimentos por Terapeutas.
//para pagamentos aos Terapeutas, num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendterapiacons', fncGeral.IsAuthenticated,(req,res) =>{
    res.render("atendimento/atendreltera/relatendterapiacons");
})

router.post('/atendimento/atendreltera/relatendterapiaconss', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendterapiaconsFiltro(req,res);
})

//Relatório Individual de Atendimentos por Beneficiário.
//Emite uma relação de todos os atendimentos realizados pelo beneficiário num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendteraana', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraana(req,res);
})

router.post('/atendimento/atendreltera/relatendteraanas', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraanaFiltro(req,res)
})

router.post('/atendimento/atendreltera/relatendteraanasfiltrotodos', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraanafiltrotodos(req,res)
})

router.get('/atendimento/atendreltera/relatendteraananovo', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraananovo(req,res);
})
router.post('/atendimento/atendreltera/relatendteraanasnovo', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraanaFiltronovo(req,res)
})

// Rota GET: carrega formulário vazio
router.get('/atendimento/atendreltera/relatendteraanatodos', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relAtendteraanatodos(req, res);
});
//Relatório Consolidado de Atendimentos por Beneficiário.
//Emite uma consolidado de todos os atendimentos realizados com Valores pelo beneficiário num determinado período de tempo.
router.get('/atendimento/atendreltera/relatendteracons', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteracons(req,res)
})

router.post('/atendimento/atendreltera/relatendteraconss', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraconsFiltro(req,res)
})

router.get('/atendimento/atendreltera/relatendteraconsnovo', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraconsnovo(req,res)
})

router.post('/atendimento/atendreltera/relatendteraconssnovo', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.relAtendteraconsFiltronovo(req,res)
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

//Gestão - Consolidado dos Atendimentos e convenio periodo
router.get('/atendimento/atendreltera/gestao/relterapiaconvfec', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relterapiaconvfec(req, res)
});

//Gestão - Consolidado dos Atendimentos e convenio periodo
router.get('/atendimento/atendreltera/gestao/relterapiaconvfecdet', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relterapiaconvfecdet(req, res)
});

//Gestão - Relatório de Faltas Por Beneficiário e Indice de Prejuízo no Tratamento
router.get('/atendimento/atendreltera/gestao/relfaltasbene', fncGeral.IsAuthenticated, (req, res) => {
    fncAtend.relfaltasbene(req, res)
});

//Relatório Calendario Fixo para Auxilio de Fechamento
router.get('/agenda/calendar/listaCalendarioMensal', fncGeral.IsAuthenticated,(req,res) =>{
    res.render("agenda/calendar/listaCalendarioMensal");
})

router.post('/agenda/calendar/filtralistaCalendarioMensal', fncGeral.IsAuthenticated,(req,res) =>{
    fncAtend.filtraCalendarioMensal(req,res);
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
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    //if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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
    if (potinho.lvlUsu == "62421801a12aa557219a0fb9" || potinho.lvlUsu == "62421857a12aa557219a0fc1" || potinho.lvlUsu == "624218f5a12aa557219a0fd0" || potinho.lvlUsu == "677704b1a358ba19d0c8eb51" || potinho.lvlUsu == "677704a8a358ba19d0c8eb27" || potinho.lvlUsu == "6578ab5248bfdf9fe1b2c8d8") {
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

//Menu NUTRIÇÃO
//Menu Compali - Escala LABIRINTO
router.get('/nutricao/compali/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas as escalas LABIRINTO      
    fncCompali.listaCompali(req,res);
})

router.get('/nutricao/compali/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de escala LABIRINTO
    fncCompali.carregaCompali(req,res)
})

router.post('/nutricao/compali/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona escala LABIRINTO
    fncCompali.cadastraCompali(req,res);
})

router.get('/nutricao/compali/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta escala LABIRINTO
    fncCompali.deletaCompali(req,res)
})

router.get('/nutricao/compali/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escala LABIRINTO
    fncCompali.carregaCompaliEdi(req,res)
})

router.post('/nutricao/compali/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da escala LABIRINTO
    fncCompali.atualizaCompali(req,res)
})

//Menu Ebai - Escala EBAI
router.get('/nutricao/ebai/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas as escalas EBAI      
    fncEbai.listaEbai(req,res);
})

router.get('/nutricao/ebai/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadastro de escala EBAI
    fncEbai.carregaEbai(req,res)
})

router.post('/nutricao/ebai/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona escala EBAI
    fncEbai.cadastraEbai(req,res);
})

router.get('/nutricao/ebai/del/:id', fncGeral.IsAuthenticated, (req,res) =>{//deleta escala EBAI
    fncEbai.deletaEbai(req,res)
})

router.get('/nutricao/ebai/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//direciona a edição de escala EBAI
    fncEbai.carregaEbaiEdi(req,res)
})

router.post('/nutricao/ebai/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da escala EBAI
    fncEbai.atualizaEbai(req,res)
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

router.get('/agenda/apagarEvolucaoIndevidaevoatendlis/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncAgenda.apagarEvolucaoIndevidaevoatend(req, res);
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


//Menu Guia ** Area Administrativa   
//Carrega Area de GUIA
//------------------------------------------------------------------------------------------------
router.get('/guia/guiaLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de agendamentos para atrelar as guias.
    fncGuia.listaGuia(req, res);
})

router.post('/guia/guiaLilfil', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncGuia.filtraGuialis(req, res);
})

router.post('/guia/addguia', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncGuia.adicionarGuia(req, res);
})

// ✅ NOVA ROTA: SALVAR GUIA EM MASSA com segurança (evita sobrescrita de dados já cadastrados na base)
// Criado por: Wagner Cintra
// Data: 04-02-2026
router.post('/guia/addguia/massa', fncGeral.IsAuthenticated, (req,res) => {
    fncGuia.adicionarGuiaMassa(req, res);
})

//Carrega Area de Guialote
//------------------------------------------------------------------------------------------------
router.get('/guia/lote/loteLis', fncGeral.IsAuthenticated, (req,res) =>{//direciona para a Lista de Guialotes.
    fncGuialote.listaGuialote(req, res);
})

router.post('/guia/lote/guialotefil', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncGuialote.filtraGuialotelis(req, res);
})

router.post('/guia/lote/addlote', fncGeral.IsAuthenticated, (req,res) =>{//direciona aLista de agendamentos com Beneficiários do dia.
    fncGuialote.adicionarGuialote(req, res);
})

// Criado por: Wagner Cintra
// Data: 05-02-2026
router.post('/guia/lote/alterar', fncGeral.IsAuthenticated, (req,res) =>{
     fncGuialote.alterarLote(req, res);
}) 

router.post('/guia/lote/remover', fncGeral.IsAuthenticated, (req,res) =>{
     fncGuialote.removerLote(req, res);
})

router.post('/guia/lote/verificar-integridade', fncGeral.IsAuthenticated, (req,res) =>{
    fncGuialote.verificarIntegridadeLotes(req, res);
})

// ✅ NOVA ROTA: SALVAR GUIA EM MASSA com segurança (evita sobrescrita de dados já cadastrados na base)
// Criado por: Wagner Cintra
// Data: 16-02-2026
router.post('/guia/lote/addlote/massa', fncGeral.IsAuthenticated, (req,res) => {
    fncGuialote.adicionarGuialoteMassa(req, res);
})

// Cria o Lote efetivamente (vincula os agendamentos)
router.post('/guia/lote/criarLote', fncGeral.IsAuthenticated, (req,res) => {
    fncGuialote.criarLote(req, res);
})

// Buscar lote para edição
router.get('/guia/lote/buscar/:id', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.buscarGuialotePorId(req, res);
})

// Editar lote
router.post('/guia/lote/editar', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.editarGuialote(req, res);
})

// Gestão de Lotes - Tela inicial
router.get('/guia/lote/gestao', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.gestaoGuialote(req, res);
})

// Gestão de Lotes - Filtrar
router.post('/guia/lote/gestaofil', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.filtragestaoGuialote(req, res);
})

// Consolidado de Lotes - Tela inicial
router.get('/guia/lote/consolidado', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.consolidadoGuialote(req, res);
})

// Consolidado de Lotes - Filtrar
router.post('/guia/lote/consolidadofil', fncGeral.IsAuthenticated, (req, res) => {
    fncGuialote.filtraconsolidadoGuialote(req, res);
})
//------------------------------------------------------------------------------------------------

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
router.post('/area/bordo/lisF', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.filtraBordo(req, res);
})
router.get('/area/bordo/bordosuplis', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.bordoSuplis(req, res);
})
//Carrega Cadastro de Diário de Bordo
router.get('/area/bordo/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de Diário de Bordo.
    fncBordo.carregaBordo(req,res);
})
//Carrega Editar Selecionado de Diário de Bordo
router.get('/area/bordo/edi/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncBordo.carregaBordoedi(req,res);
})
//Carrega Impressao Selecionado de Diário de Bordo
router.get('/area/bordo/imp/:id', fncGeral.IsAuthenticated, (req,res) =>{//adiciona Diário de Bordo Padrao
    fncBordo.carregaBordoimp(req,res);
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

// ✅ ROTA DE EXCLUSÃO LÓGICA - MÉTODO GET (como você prefere)
router.get('/area/plano/lixo/:id', fncGeral.IsAuthenticated, (req,res) =>{
    fncTrat.lixoTrat(req, res);
})

// === NOVA ROTA: LISTAR LIXEIRA (apenas perfis autorizados) ===
router.get('/area/plano/lixeira', fncGeral.IsAuthenticated, (req,res) =>{
    fncTrat.listaLixeira(req, res);
})

// === NOVA ROTA: RESTAURAR DA LIXEIRA ===
router.get('/area/plano/restaurar/:id', fncGeral.IsAuthenticated, (req,res) =>{
    fncTrat.restaurarTrat(req, res);
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


//Lista Programas ABA para filtrar por Programa
router.get('/area/aba/prog/proglispro', fncGeral.IsAuthenticated, (req,res) =>{//direciona o filtro da lista do ABA.
    console.log("Programa ID recebido:", req.params.id);
    let resposta = new Resposta()
    resposta.texto = ""
    resposta.sucesso = ""
    fncProg.listaProgpro(req, res, resposta);
})

//Lista Programas ABA filtrado por Programa carregado com id do programas
router.get('/area/aba/prog/proglisproF/:id', fncGeral.IsAuthenticated, (req, res) => {
    console.log("Programa ID recebido:", req.params.id);
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncProg.listaProgprofiltro(req, '', res, resposta);
});
//Lista Programas ABA filtrado por TIPO DE PROGRAMA (NOVA ROTA)
router.get('/area/aba/prog/proglisproTipo/:id', fncGeral.IsAuthenticated, (req, res) => {
    console.log("Tipo de Programa ID recebido:", req.params.id);
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    // Chama a nova função que criaremos no controller
    fncProg.listaProgprofiltroPorTipo(req, res, resposta); 
});

//Lista Programas ABA filtrado pelo Programa em MANUTENÇÃO
router.get('/area/aba/prog/proglisproM/:id', fncGeral.IsAuthenticated, (req, res) => {
    console.log("Beneficiário ID recebido:", req.params.id);
    let resposta = new Resposta();
    resposta.texto = "";
    resposta.sucesso = "";
    fncProg.listaProgprofiltroManut(req, res, resposta);
});
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

    //Menu Convpar gera o debito e crédito simultaneo sem alterar nos condigos existentes
    //Wagner cintra 2025/11/12
    // =============== PAR CONVÊNIO (CRÉDITO + DÉBITO) ===============

    router.get('/convenio/convpar/cad', fncGeral.IsAuthenticated, (req, res) => {
        fncConvPar.carregaConvPar(req, res);
    });

    router.post('/convenio/convpar/add', fncGeral.IsAuthenticated, (req, res) => {
        fncConvPar.cadastraConvPar(req, res);
    });

    router.get('/convenio/convpar/lis', fncGeral.IsAuthenticated, (req, res) => {
        fncConvPar.listaConvPar(req, res);
    });

    // (opcional) Edição futura
    // router.get('/convenio/convpar/edi/:id', fncGeral.IsAuthenticated, (req, res) => {
    //     fncConvPar.carregaConvParEdi(req, res);
    // });

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
    //Manual 2025/11/10 11:13 por Wagner Cintra Rotas atualizadas com view nova que cadastrar e edita se haver _id válido.
    // ✅ ÚNICA rota para carregar formulário (cadastro OU edição)
    //    - /ferramentas/manual/form          → cadastro
    //    - /ferramentas/manual/form/6701...  → edição
        
         // ✅ Salvar (POST)
        router.post('/ferramentas/manual/save', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.salvarManual(req, res);
        })

        // ✅ Exclusão LÓGICA via GET (compatível com seu <a href="/del/id">)
        router.get('/ferramentas/manual/del/:id', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.deletaManual(req, res); // ← sua função já trata req.params.id
        })

        // ✅ Listar manuais (GET)
        router.get('/ferramentas/manual/lis', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.listarManual(req, res);
        });
        // Cadastro
        router.get('/ferramentas/manual/form', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.carregarFormulario(req, res);
        });

        // Edição
        router.get('/ferramentas/manual/form/:id', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.carregarFormularioEdi(req, res);
        });
         // Ver
        router.get('/ferramentas/manual/formver/:id', fncGeral.IsAuthenticated, (req, res) => {
            fncManual.carregarFormularioVer(req, res);
        });

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
    //AgendaEvento
    router.get('/ferramentas/agendaEvento/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas empresas
        fncAgendaEvento.listaAgendaEvento(req, res);
    })
    
    router.get('/ferramentas/agendaEvento/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de empresa.
        fncAgendaEvento.carregaAgendaEvento(req, res);
    })

    router.post('/ferramentas/agendaEvento/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona empresa
        fncAgendaEvento.cadastraAgendaEvento(req, res);

    })
    
    router.get('/ferramentas/agendaEvento/del/:id', fncGeral.IsAuthenticated, async (req, res) => {
        try {
          const agendaEventoId = req.params.id;
          await fncAgendaEvento.deletaAgendaEvento(agendaEventoId, req, res);
          // Redireciona para a listagem após a deleção
          res.redirect('/menu/ferramentas/agendaEvento/lis'); // URL da listagem
        } catch (err) {
          console.error(err);
          res.render('admin/erro');
        }
      })
    
    router.get('/ferramentas/agendaEvento/edi/:id', fncGeral.IsAuthenticated, (req, res) =>{//direciona a edição de empresa
        fncAgendaEvento.carregaAgendaEventoEdi(req, res);
    })

    router.post('/ferramentas/agendaEvento/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Empresa
        fncAgendaEvento.atualizaAgendaEvento(req, res);
    })
//Menu Ferramentas
    //AnotaAdm - Anotações Administraticas para Quadros de Adriana e Equipe
    router.get('/ferramentas/AnotaAdm/lis', fncGeral.IsAuthenticated, (req,res) =>{//lista todas empresas
        fncAnotaAdm.listaAnotaAdm(req, res);
    })
    
    router.get('/ferramentas/AnotaAdm/cad', fncGeral.IsAuthenticated, (req,res) =>{//direciona o cadstro de empresa.
        fncAnotaAdm.carregaAnotaAdm(req, res);
    })

    router.post('/ferramentas/AnotaAdm/add', fncGeral.IsAuthenticated, (req,res) =>{//adiciona empresa
        fncAnotaAdm.cadastraAnotaAdm(req, res);

    })
    
    router.get('/ferramentas/AnotaAdm/del/:id', fncGeral.IsAuthenticated, async (req, res) => {
        try {
          const anotaAdmId = req.params.id;
          await fncAnotaAdm.deletaAnotaAdm(anotaAdmId, req, res);
          // Redireciona para a listagem após a deleção
          res.redirect('/menu/ferramentas/AnotaAdm/lis'); // URL da listagem
        } catch (err) {
          console.error(err);
          res.render('admin/erro');
        }
      })
    
    router.get('/ferramentas/AnotaAdm/edi/:id', fncGeral.IsAuthenticated, (req, res) =>{//direciona a edição de empresa
        fncAnotaAdm.carregaAnotaAdmEdi(req, res);
    })

    router.post('/ferramentas/agendaEvento/atualizar', fncGeral.IsAuthenticated, (req,res) =>{//atualiza o cadastro da Empresa
        fncAnotaAdm.atualizaAnotaAdm(req, res);
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
            fncAjuda.listaAjuda(req, res);
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