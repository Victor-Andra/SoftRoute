const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AnamnSchema = mongoose.Schema({
    anamn_id:{ type: ObjectId, required: false },
    anamn_data: { type: String, required: false }, //Ok
    anamn_hora: { type: String, required: false }, //Ok
    anamn_beneid: { type: ObjectId, required: true }, //Ok
    anamn_benenome: { type: String, required: false }, //Ok
    anamn_beneapelido: { type: String, required: false }, //Ok
    anamn_benedatanasc: { type: String, required: false }, //Ok
    anamn_beneidade: { type: String, required: false }, //Ok
    anamn_painome: { type: String, required: false }, //Ok
    anamn_maenome: { type: String, required: false }, //Ok
    anamn_respnome: { type: String, required: false }, //Ok
    anamn_indica: { type: String, required: false }, //Ok
    anamn_queixapri: { type: String, required: false }, //Ok
    anamn_diag: { type: String, required: false }, //Ok
    anamn_houvetratengrav: { type: String, required: false }, //Ok
    anamn_houvetratengravdesc: { type: String, required: false }, //Ok
    anamn_houveplanfami: { type: String, required: false }, //Ok
    anamn_houveplanfamidesc: { type: String, required: false }, //Ok
    anamn_ameacatenaborto: { type: String, required: false }, //Ok
    anamn_ameacatenabortodesc: { type: String, required: false }, //Ok
    anamn_bebeoufumagesta: { type: String, required: false }, //Ok
    anamn_bebeoufumagestadesc: { type: String, required: false }, //Ok
    anamn_traumafispsiinfec: { type: String, required: false }, //Ok
    anamn_traumafispsiinfecdesc: { type: String, required: false }, //Ok
    anamn_usotranquil: { type: String, required: false }, //Ok
    anamn_usotranquildesc: { type: String, required: false }, //Ok
    anamn_adocao: { type: String, required: false }, //Ok
    anamn_obsgesta: { type: String, required: false }, //Ok
    //Parto
    anamn_partoqual: { type: String, required: false }, //Ok
    anamn_partoqualdesc: { type: String, required: false }, //Ok
    anamn_tempogestacional: { type: String, required: false }, //Ok
    anamn_tempogestacionaldesc: { type: String, required: false }, //Ok
    anamn_anorexiaperiparto: { type: String, required: false }, //Ok
    anamn_anorexiaperipartodesc: { type: String, required: false }, //Ok
    anamn_apgar: { type: String, required: false }, //Ok
    //inclusao adicional em 20/07/23
    anamn_apgargrau: { type: String, required: false }, //Incluido
    anamn_apgardesc: { type: String, required: false }, //Ok
    anamn_chorounasc: { type: String, required: false }, //Ok
    anamn_chorounascdesc: { type: String, required: false }, //Ok
    anamn_ictericia: { type: String, required: false }, //Ok
    anamn_ictericiadesc: { type: String, required: false }, //Ok
    anamn_fototerapia: { type: String, required: false }, //Ok
    anamn_fototerapiadesc: { type: String, required: false }, //Ok
    anamn_uti: { type: String, required: false }, //Ok
    anamn_utitempo: { type: String, required: false }, //Ok
    anamn_complica: { type: String, required: false }, //Ok 
    anamn_complicadesc: { type: String, required: false }, //Ok
    anamn_paipresentenasc: { type: String, required: false },  //Ok
    anamn_paipresentenascdesc: { type: String, required: false }, //Ok
    anamn_descrparto: { type: String, required: false }, //Ok
    anamn_reacbebe: { type: String, required: false }, //Ok
    anamn_obsparto: { type: String, required: false }, //Ok
    //Parto
    anamn_pessmoracasa: { type: String, required: false }, //Ok
    anamn_irmaosmoracasa: { type: String, required: false }, //Ok
    anamn_irmaospartemae: { type: String, required: false }, //Ok
    anamn_irmaospartpai: { type: String, required: false }, //Ok
    anamn_maetrab: { type: String, required: false }, //Ok
    anamn_maetrabquemfica: { type: String, required: false }, //Ok
    anamn_obsfami: { type: String, required: false }, //Ok
    //Ambiente familiar
    anamn_paisvivemjuntosbem: { type: String, required: false }, //Ok
    anamn_paisvivemjuntosbemdesc: { type: String, required: false }, //Ok
    anamn_discussoesfreq: { type: String, required: false }, //Ok
    anamn_discussoesfreqdesc: { type: String, required: false }, //Ok
    anamn_comofoisepara: { type: String, required: false }, //Ok
    anamn_reacaocrianca: { type: String, required: false }, //Ok
    anamn_quemcedefacil: { type: String, required: false }, //Ok
    anamn_quemcedefacildesc: { type: String, required: false }, //Ok
    anamn_criancatratdif: { type: String, required: false }, //Ok
    anamn_criancatratdifcomo: { type: String, required: false }, //Ok
    anamn_relacirmaos: { type: String, required: false }, //Ok
    anamn_ambientefami: { type: String, required: false }, //Ok
    anamn_obsfamiambiente: { type: String, required: false }, //Ok
    //Religião
    anamn_haeducarelig: { type: String, required: false }, //Ok
    anamn_haeducareligqual: { type: String, required: false }, //Ok
    anamn_devpreccumpr: { type: String, required: false }, //Ok
    anamn_devpreccumprdesc: { type: String, required: false }, //Ok
    anamn_obsreligiao: { type: String, required: false }, //Ok
    //Enfermidades
    anamn_sarampo: { type: String, required: false }, //Ok
    anamn_catapora: { type: String, required: false }, //Ok
    anamn_caxumba: { type: String, required: false }, //Ok
    anamn_rubeola: { type: String, required: false }, //Ok
    anamn_cpqueluche: { type: String, required: false }, //Ok
    anamn_meningite: { type: String, required: false }, //Ok
    anamn_complicavacina: { type: String, required: false }, //Ok
    //Inclusoes adcionais em 20/07/23
    anamn_dengue: { type: String, required: false }, //Incluir
    anamn_zica: { type: String, required: false }, //Incluir
    anamn_chikun: { type: String, required: false }, //Incluir
    anamn_covid: { type: String, required: false }, //Incluir
    anamn_tce: { type: String, required: false }, //Incluir
    anamn_obssaude: { type: String, required: false }, //Incluir
    anamn_zoonoses: { type: String, required: false },
    anamn_otite: { type: String, required: false }, //Ok
    anamn_adenoide: { type: String, required: false }, //Ok
    anamn_amigdalites: { type: String, required: false }, //Ok
    anamn_alergias: { type: String, required: false }, //Ok
    anamn_acidentes: { type: String, required: false }, //Ok
    anamn_convulsoes: { type: String, required: false }, //Ok
    anamn_internacoes: { type: String, required: false }, //Ok
    anamn_cirurgia: { type: String, required: false }, //Ok
    //Enfermidades, antecedentes
    anamn_avaliacaoneuro: { type: String, required: false }, //Ok
    anamn_avaliacaoneurodesc: { type: String, required: false }, //Ok nome do Médico
    anamn_avaliacaoneurotel: { type: String, required: false }, //Ok
    anamn_avaliacaopsico: { type: String, required: false }, //Ok
    anamn_avaliacaopsicodesc: { type: String, required: false }, //Ok nome psic
    anamn_avaliacaopsicotel: { type: String, required: false }, //Ok
    anamn_quem: { type: String, required: false },
    anamn_contatotel: { type: String, required: false },
    anamn_examesrealiza: { type: String, required: false }, //Ok
    anamn_medicacaoquais: { type: String, required: false }, //Ok
    anamn_quandodiag: { type: String, required: false }, //Ok
    anamn_antecfamidesc: { type: String, required: false }, //Ok
    //Enfermidades, antecedente familiar 
    anamn_nervoso: { type: String, required: false }, //Ok
    anamn_deficiente: { type: String, required: false }, //Ok
    anamn_viciado: { type: String, required: false }, //Ok
    anamn_ataques: { type: String, required: false }, //Ok
    anamn_dislexia: { type: String, required: false }, //Ok
    anamn_TDAH: { type: String, required: false }, //Ok
    anamn_nervosodesc: { type: String, required: false }, //Incluir
    anamn_deficientedesc: { type: String, required: false }, //Incluir
    anamn_viciadodesc: { type: String, required: false }, //Incluir
    anamn_ataquesdesc: { type: String, required: false }, //Incluir
    anamn_tdahdesc: { type: String, required: false }, //Incluir
    anamn_esquizofrenia: { type: String, required: false }, //Incluir
    anamn_esquizofreniadesc: { type: String, required: false }, //Incluir
    anamn_outros: { type: String, required: false }, //Ok
    anamn_outrosdesc: { type: String, required: false }, //Ok
    anamn_obssaude2: { type: String, required: false }, //Ok
    //Linguagem
    anamn_pripalavrasidade: { type: String, required: false }, //Ok
    anamn_limguagemcompre: { type: String, required: false }, //Ok
    anamn_inicioufalaparou: { type: String, required: false }, //Ok
    anamn_inicioufalaparoudesc: { type: String, required: false }, //Ok
    anamn_gdiscluverbalgagueira: { type: String, required: false }, //Ok
    anamn_dislalia: { type: String, required: false }, //Ok
    anamn_dislaliaqual: { type: String, required: false }, //Ok
    
    anamn_falavocal: { type: String, required: false }, //Ok
    anamn_compreendeordem: { type: String, required: false }, //Ok
    anamn_cumpreordens: { type: String, required: false },
    anamn_ecolaliaimediata: { type: String, required: false }, //Ok
    anamn_ecolaliatardia: { type: String, required: false }, //Ok
    anamn_aponta: { type: String, required: false }, //Ok
    anamn_pede: { type: String, required: false }, //Ok
    anamn_nomeiadescenas: { type: String, required: false }, //Ok
    anamn_pergunta: { type: String, required: false }, //Ok
    anamn_respondepergunta: { type: String, required: false }, //Ok
    anamn_solicitabrincar: { type: String, required: false }, //Ok
    anamn_solicitairbanheiro: { type: String, required: false }, //Ok
    anamn_solicitabeber: { type: String, required: false }, //Ok
    anamn_solicitacomer: { type: String, required: false }, //Ok
    anamn_rouco: { type: String, required: false }, //Incluir
    anamn_realizasombocainativ: { type: String, required: false }, //Ok 
    anamn_realizasombocaativ: { type: String, required: false }, //Ok
    anamn_falavocaldesc: { type: String, required: false }, //Ok
    anamn_compreendeordemdesc: { type: String, required: false }, //Ok
    anamn_cumpreordensdesc: { type: String, required: false },
    anamn_ecolaliaimediatadesc: { type: String, required: false }, //Ok
    anamn_ecolaliatardiadesc: { type: String, required: false }, //Ok
    anamn_apontadesc: { type: String, required: false }, //Ok
    anamn_pededesc: { type: String, required: false }, //Ok
    anamn_nomeiadescenasdesc: { type: String, required: false }, //Ok
    anamn_perguntadesc: { type: String, required: false }, //Ok
    anamn_respondeperguntadesc: { type: String, required: false }, //Ok
    anamn_solicitabrincardesc: { type: String, required: false }, //Ok
    anamn_solicitairbanheirodesc: { type: String, required: false }, //Ok
    anamn_solicitabeberdesc: { type: String, required: false }, //Ok
    anamn_solicitacomerdesc: { type: String, required: false }, //Ok
    anamn_roucodesc: { type: String, required: false }, //Incluir
    anamn_realizasombocainativdesc: { type: String, required: false }, //Ok 
    anamn_realizasombocaativdesc: { type: String, required: false }, //Ok
    
    anamn_frasequantaspalavras: { type: String, required: false }, //Ok
    anamn_obslibguagem: { type: String, required: false }, //Ok
    //Sexualidade
    anamn_curiosidadesex: { type: String, required: false }, //Ok
    anamn_curiosidadesexdesc: { type: String, required: false }, //Ok
    anamn_masturbase: { type: String, required: false }, //Ok
    anamn_masturbasedesc: { type: String, required: false }, //Ok
    anamn_percebedifsex: { type: String, required: false }, //Ok
    anamn_percebedifsexdesc: { type: String, required: false }, //Ok
    anamn_obssex: { type: String, required: false }, //Ok
    //Rel emocionais
    anamn_comoreaproibi: { type: String, required: false }, //Ok
    anamn_comoreafrustra: { type: String, required: false }, //Ok
    anamn_comoreacastig: { type: String, required: false }, //Ok
    anamn_comoreanovasituacao: { type: String, required: false }, //Ok
    anamn_agressivocomquem: { type: String, required: false },
    anamn_defendeseagressao: { type: String, required: false },
    anamn_defendeseagressaocomo: { type: String, required: false },//Ok
    anamn_autolesivo: { type: String, required: false }, //Ok
    anamn_autolesivodesc: { type: String, required: false }, //Ok
    anamn_agressivo: { type: String, required: false }, //Ok
    anamn_agressivodesc: { type: String, required: false }, //Ok
    anamn_dependente: { type: String, required: false }, //Ok
    anamn_dependentedesc: { type: String, required: false }, //Incluir
    anamn_carinho: { type: String, required: false }, //Ok
    anamn_carinhodesc: { type: String, required: false }, //Incluir
    anamn_autoritario: { type: String, required: false }, //Ok
    anamn_autoritariodesc: { type: String, required: false }, //Incluir
    anamn_malcriado: { type: String, required: false }, //Ok
    anamn_malcriadodesc: { type: String, required: false }, //Incluir
    anamn_exibicionista: { type: String, required: false }, //Ok
    anamn_exibicionistadesc: { type: String, required: false }, //Incluir
    anamn_ansioso: { type: String, required: false }, //Ok
    anamn_ansiosodesc: { type: String, required: false }, //Incluir
    anamn_calado: { type: String, required: false }, //Ok
    anamn_caladodesc: { type: String, required: false }, //Incluir
    anamn_falante: { type: String, required: false }, //Ok
    anamn_falantedesc: { type: String, required: false }, //Incluir
    anamn_esteriotipiasquandoocorre: { type: String, required: false }, //Ok
    anamn_obscomportamento: { type: String, required: false }, //Ok
    //Manipulações e Tiques
    anamn_chupeta: { type: String, required: false }, //Ok
    anamn_chupetatempo: { type: String, required: false }, //Ok
    anamn_dedo: { type: String, required: false }, //Ok
    anamn_dedotempo: { type: String, required: false }, //Ok
    anamn_roeuouroiunhas: { type: String, required: false }, //Ok
    anamn_roeuouroiunhastempo: { type: String, required: false },//Ok
    anamn_puxaorelhascabelo: { type: String, required: false }, //Ok
    anamn_puxaorelhascabelotempo: { type: String, required: false }, //Ok
    anamn_mordelabios: { type: String, required: false }, //Ok
    anamn_mordelabiostempo: { type: String, required: false }, //Ok
    anamn_batepes: { type: String, required: false }, //Ok
    anamn_batepestempo: { type: String, required: false }, //Ok
    anamn_batecabeca: { type: String, required: false }, //Ok
    anamn_batecabecadesc: { type: String, required: false }, //Ok
    anamn_temmedos: { type: String, required: false }, //Ok
    anamn_temmedosdesc: { type: String, required: false }, //Ok
    anamn_mentejamentiu: { type: String, required: false }, //Ok
    anamn_mentejamentiudesc: { type: String, required: false }, //Ok
    anamn_atiraobjetos: { type: String, required: false }, //Ok
    anamn_atiraobjetosdesc: { type: String, required: false }, //Ok
    anamn_desligase: { type: String, required: false }, //Ok
    anamn_desligasetempo: { type: String, required: false }, //Ok
    anamn_objetonuncalarga: { type: String, required: false }, //Ok
    anamn_objetonuncalargaqual: { type: String, required: false }, //Ok
    anamn_tique: { type: String, required: false }, //Ok
    anamn_tiquedesc: { type: String, required: false }, //Ok
    anamn_repeteacao: { type: String, required: false }, //Ok
    anamn_repeteacaoqual: { type: String, required: false }, //Ok
    anamn_obstiques: { type: String, required: false }, //Ok
    //sono
    anamn_dormecomquem: { type: String, required: false }, //Ok
    anamn_vaissozinhocama: { type: String, required: false }, //Ok
    anamn_vaissozinhocamadesc: { type: String, required: false }, //Ok
    anamn_dromequantotempo: { type: String, required: false }, //Ok
    anamn_vaiparacamapais: { type: String, required: false }, //Ok
    anamn_vaiparacamapaisdesc: { type: String, required: false }, //Ok
    
    anamn_choranoite: { type: String, required: false }, //Ok
    anamn_falanoite: { type: String, required: false }, //Ok
    anamn_gritanoite: { type: String, required: false }, //Ok
    anamn_rangedenteanoite: { type: String, required: false }, //Ok
    anamn_insonianoite: { type: String, required: false }, //Ok
    anamn_babanoite: { type: String, required: false }, //Ok
    anamn_pesadelo: { type: String, required: false }, //Ok
    anamn_sudorese: { type: String, required: false }, //Ok
    anamn_terrornoturno: { type: String, required: false }, //Ok
    anamn_ronca: { type: String, required: false }, //Ok
    anamn_respiraoral: { type: String, required: false }, //Ok
    anamn_proximoolhos: { type: String, required: false }, //Ok
    anamn_proximoolhosdesc: { type: String, required: false }, //Ok
    anamn_choranoitedesc: { type: String, required: false }, //Ok
    anamn_falanoitedesc: { type: String, required: false }, //Ok
    anamn_gritanoitedesc: { type: String, required: false }, //Ok
    anamn_rangedenteanoitedesc: { type: String, required: false }, //Ok
    anamn_insonianoitedesc: { type: String, required: false }, //Ok
    anamn_babanoitedesc: { type: String, required: false }, //Ok
    anamn_pesadelodesc: { type: String, required: false }, //Ok
    anamn_sudoresedesc: { type: String, required: false }, //Ok
    anamn_terrornoturnodesc: { type: String, required: false }, //Ok
    anamn_roncadesc: { type: String, required: false }, //Ok
    anamn_respiraoraldesc: { type: String, required: false }, //Ok
    
    anamn_sono: { type: String, required: false }, //Ok
    anamn_sonodesc: { type: String, required: false }, //Inserir
    anamn_obssono: { type: String, required: false }, //Ok
    //Aleitamento
    anamn_aleitamaterno: { type: String, required: false }, //Ok
    anamn_tempoaleitamaterno: { type: String, required: false }, //Ok
    anamn_boasuccaoamamenta: { type: String, required: false }, //Ok
    anamn_boasuccaoamamentadesc: { type: String, required: false }, //ok
    anamn_tempoomamadeira: { type: String, required: false }, //Ok
    anamn_tempoomamadeiradesc: { type: String, required: false }, //Ok
    anamn_durefeicao: { type: String, required: false }, //Ok
    anamn_durefeicaodesc: { type: String, required: false }, //Ok
    anamn_restricaoalimentar: { type: String, required: false }, //Ok
    anamn_aliso: { type: String, required: false }, //Ok
    anamn_alisodesc: { type: String, required: false }, //Ok
    anamn_utilizatalher: { type: String, required: false }, //Ok
    anamn_utilizatalherdesc: { type: String, required: false }, //Ok
    anamn_usacopo: { type: String, required: false }, //Ok
    anamn_usacopodesc: { type: String, required: false }, //Ok
    anamn_mastiga: { type: String, required: false }, //Ok
    anamn_mastigadesc: { type: String, required: false }, //Ok
    anamn_alimentaseliqui: { type: String, required: false }, //Ok
    anamn_alimentasepasto: { type: String, required: false }, //Ok
    anamn_alimentasesolido: { type: String, required: false }, //Ok
    anamn_alimentacom: { type: String, required: false }, //Incluir
    anamn_dificuldadetipocheiro: { type: String, required: false }, //Ok
    anamn_dificuldadetipocheiroquais: { type: String, required: false }, //Ok
    anamn_comportamentorefeicao: { type: String, required: false }, //Ok
    anamn_degluticaoquadroengasgo: { type: String, required: false }, //Ok
    anamn_degluticaoquadroengasgodesc: { type: String, required: false }, //Ok
    anamn_dificuldadetextura: { type: String, required: false }, //Ok
    anamn_dificuldadetexturadesc: { type: String, required: false }, //Ok
    anamn_obsalimentacao: { type: String, required: false }, //Ok
    //Controle esfincteriano!
    anamn_controlefezesdiurna: { type: String, required: false }, //Ok
    anamn_controlefezesnoturna: { type: String, required: false }, //Ok
    anamn_controlefezesdesc: { type: String, required: false }, //Incluir
    anamn_controleurinadiurna: { type: String, required: false }, //Ok
    anamn_controleurinanoturna: { type: String, required: false }, //Ok
    anamn_controleurinadesc: { type: String, required: false }, //Alterado
    anamn_obsesficteriano: { type: String, required: false }, //Ok
    //Auto cuidado e higiene
    anamn_usovaso: { type: String, required: false }, //Ok
    anamn_limpaso: { type: String, required: false }, //Incluir
    anamn_banhoso: { type: String, required: false }, //Ok
    anamn_escovaso: { type: String, required: false }, //Incluir
    anamn_lavamaos: { type: String, required: false }, //Ok
    anamn_penteaso: { type: String, required: false }, //Incluir
    anamn_despesvestese: { type: String, required: false }, //Ok
    anamn_vestese: { type: String, required: false }, //Ok
    anamn_calcar: { type: String, required: false }, //Ok
    anamn_deixacortarcabelo: { type: String, required: false }, //Ok
    anamn_abotoaso: { type: String, required: false }, //Ok
    anamn_lacarso: { type: String, required: false }, //Ok
    anamn_deixacortarunhas: { type: String, required: false }, //Ok
    anamn_obsvestirhigi: { type: String, required: false }, //Ok
    //Visão
    anamn_problemavisao: { type: String, required: false }, //Ok
    anamn_problemavisaodesc: { type: String, required: false }, //Ok
    anamn_olhaobjetivoatividade: { type: String, required: false }, //Ok
    anamn_olhaobjetivoatividadedesc: { type: String, required: false }, //Ok
    anamn_usaoculos: { type: String, required: false }, //Ok
    anamn_usaoculosmotivo: { type: String, required: false }, //Ok
    anamn_usaoculosquando: { type: String, required: false }, //Ok
    anamn_prefereambienteescuro: { type: String, required: false }, //Ok
    anamn_imcomodamuitaluzcor: { type: String, required: false }, //Ok
    anamn_fazconatatovisual: { type: String, required: false }, //Ok
    anamn_permanececontatovisual: { type: String, required: false }, //Ok
    anamn_obsvisao: { type: String, required: false }, //Ok
    //Audição
    anamn_duvidacapaccitaauditiva: { type: String, required: false }, //Ok
    anamn_duvidacapaccitaauditivadesc: { type: String, required: false }, //Ok
    anamn_jaexpostoruidoexplosao: { type: String, required: false }, //Ok
    anamn_jaexpostoruidoexplosaodesc: { type: String, required: false }, //Ok
    
    anamn_voz: { type: String, required: false }, //Ok
    anamn_audiometria: { type: String, required: false }, //Ok
    anamn_localizasons: { type: String, required: false }, //Ok
    anamn_tampaouvidosruido: { type: String, required: false }, //Ok
    anamn_aproximaruidos: { type: String, required: false }, //Ok
    anamn_asustafacil: { type: String, required: false }, //Ok
    
    anamn_vozdesc: { type: String, required: false }, //Ok
    anamn_audiometriadesc: { type: String, required: false }, //Ok
    anamn_localizasonsdesc: { type: String, required: false }, //Ok
    anamn_tampaouvidosruidodesc: { type: String, required: false }, //Ok
    anamn_aproximaruidosdesc: { type: String, required: false }, //Ok
    anamn_asustafacildesc: { type: String, required: false }, //Ok

    anamn_seicomodapessoasfalando: { type: String, required: false }, //Ok
    anamn_seicomodapessoasfalandodesc: { type: String, required: false }, //Ok
    anamn_escutachamado: { type: String, required: false }, //Ok
    anamn_escutachamadodesc: { type: String, required: false }, //Ok
    anamn_obsaudicao: { type: String, required: false }, //Ok
    //Desenvolvimento Psicomotor
    anamn_controlacabeca: { type: String, required: false }, //Ok
    anamn_rolou: { type: String, required: false }, //Ok
    anamn_engatinhou: { type: String, required: false }, //Ok
    anamn_usouandaja: { type: String, required: false }, //Ok
    anamn_andou: { type: String, required: false }, //Ok
    anamn_andoudesc: { type: String, required: false }, //Ok
    anamn_usaescada: { type: String, required: false }, //Ok
    anamn_pulacorre: { type: String, required: false }, //Ok
    anamn_andapontadope: { type: String, required: false }, //Ok
    anamn_medotirarpesdochao: { type: String, required: false }, //Ok
    anamn_medotirarpesdochaodesc: { type: String, required: false }, //Incluir
    anamn_desastrado: { type: String, required: false }, //Ok
    anamn_seescondeembaixoobj: { type: String, required: false }, //Ok
    anamn_escalasobeobj: { type: String, required: false }, //Ok
    anamn_mostramedoexp: { type: String, required: false }, //Ok
    anamn_mostramedoexpdesc: { type: String, required: false }, //Incluir
    anamn_evitanovasposicoes: { type: String, required: false }, //Ok
    anamn_evitanovasposicoesdesc: { type: String, required: false }, //Incluir
    anamn_reacaoemotivaexessi: { type: String, required: false }, //Ok
    anamn_reacaoemotivaexessidesc: { type: String, required: false }, //Incluir
    anamn_movisecuidado: { type: String, required: false }, //Ok
    anamn_movisecuidadodesc: { type: String, required: false }, //Incluir
    anamn_temexpnegativamov: { type: String, required: false }, //Ok
    anamn_temexpnegativamovdesc: { type: String, required: false }, //Incluir
    anamn_obspsicomotor: { type: String, required: false }, //Ok
    //Desenvolvimento Tatil
    anamn_recusapisargrama: { type: String, required: false }, //Ok
    anamn_recusapisarmolhado: { type: String, required: false }, //Ok
    anamn_recusaareia: { type: String, required: false }, //Ok
    anamn_recusatinta: { type: String, required: false }, //Ok
    anamn_recusaplastilina: { type: String, required: false }, //Ok
    anamn_recusaamoeba: { type: String, required: false }, //Ok
    anamn_evitatoqueleve: { type: String, required: false }, //Ok
    anamn_aceitaabreco: { type: String, required: false }, //Ok
    anamn_aceitaabrecodesc: { type: String, required: false }, //Ok
    anamn_tocapessoasobjconsta: { type: String, required: false }, //Ok
    anamn_batecaisemnocao: { type: String, required: false }, //Ok
    anamn_seguraobj: { type: String, required: false }, //Ok
    anamn_buscaatvpuxaremp: { type: String, required: false }, //Ok
    anamn_mastigaobjroupa: { type: String, required: false }, //Ok
    anamn_tocapessoasobjconstadesc: { type: String, required: false }, //Incluir
    anamn_batecaisemnocaodesc: { type: String, required: false }, //Incluir
    anamn_seguraobjdesc: { type: String, required: false }, //Incluir
    anamn_buscaatvpuxarempdesc: { type: String, required: false }, //Incluir
    anamn_mastigaobjroupadesc: { type: String, required: false }, //Incluir
    anamn_obstatil: { type: String, required: false }, //Ok
    //Sociabilidade
    anamn_preferebrincarcom: { type: String, required: false }, //Ok
    anamn_preferebrincaridade: { type: String, required: false }, //Ok
    anamn_preferebrincarcomdesc: { type: String, required: false }, //Ok
    
    anamn_fazamigosfacil: { type: String, required: false }, //Ok
    anamn_emprestabrinquedos: { type: String, required: false }, //Ok
    anamn_brincacooperado: { type: String, required: false }, //Ok
    anamn_gostamandar: { type: String, required: false }, //Ok
    anamn_gostasubmeter: { type: String, required: false }, //Ok
    
    anamn_fazamigosfacildesc: { type: String, required: false }, //Ok
    anamn_emprestabrinquedosdesc: { type: String, required: false }, //Ok
    anamn_brincacooperadodesc: { type: String, required: false }, //Ok
    anamn_gostamandardesc: { type: String, required: false }, //Ok
    anamn_gostasubmeterdesc: { type: String, required: false }, //Ok

    anamn_gostamusica: { type: String, required: false }, //Ok
    anamn_gostamusicaquais: { type: String, required: false }, //Ok
    
    anamn_socializapares: { type: String, required: false }, //Ok
    anamn_brincaparque: { type: String, required: false }, //Ok
    anamn_brincarfuncional: { type: String, required: false }, //Ok
    anamn_criabrincadeiras: { type: String, required: false }, //Ok
    anamn_recusaengajardemanda: { type: String, required: false }, //Ok

    anamn_socializaparesdesc: { type: String, required: false }, //Ok
    anamn_brincaparquedesc: { type: String, required: false }, //Ok
    anamn_brincarfuncionaldesc: { type: String, required: false }, //Ok
    anamn_criabrincadeirasdesc: { type: String, required: false }, //Ok
    anamn_recusaengajardemandadesc: { type: String, required: false }, //Ok
    
    anamn_brinquedopreferidosquais: { type: String, required: false }, //Ok
    anamn_obssocial: { type: String, required: false }, //Ok
    //Escolaridade
    anamn_escola: { type: String, required: false }, //Ok
    anamn_tempo: { type: String, required: false }, //Ok
    anamn_turno: { type: String, required: false }, //Ok
    anamn_serie: { type: String, required: false }, //Ok
    anamn_escolaanterior: { type: String, required: false }, //Ok
    anamn_paisestudamcomcrianca: { type: String, required: false }, //Ok
    anamn_localadequadoestudo: { type: String, required: false }, //Ok
    anamn_executatarefascaseiras: { type: String, required: false }, //Ok
    anamn_temautonomiaestuda: { type: String, required: false }, //Ok
    anamn_necessitaorienta: { type: String, required: false }, //Ok
    anamn_usamuitaborracha: { type: String, required: false }, //Ok
    anamn_rendimentoescolarbaixo: { type: String, required: false }, //Ok
    anamn_reprovado: { type: String, required: false }, //Ok
    anamn_pulouserie: { type: String, required: false }, //Ok
    anamn_pulouseriedesc: { type: String, required: false }, //Ok
    anamn_idadealfa: { type: String, required: false }, //Ok
    anamn_comofoialfabet: { type: String, required: false }, //Ok
    anamn_dificuldadeescolar: { type: String, required: false }, //Ok
    anamn_dificuldademateriaquais: { type: String, required: false }, //Ok
    anamn_ler: { type: String, required: false }, //Ok
    anamn_lerobs: { type: String, required: false }, //Ok
    anamn_escreve: { type: String, required: false }, //Ok
    anamn_escreveobs: { type: String, required: false }, //Ok
    anamn_motrici: { type: String, required: false }, //Ok
    anamn_motriciobs: { type: String, required: false }, //Ok
    anamn_contar: { type: String, required: false }, //Ok
    anamn_contarobs: { type: String, required: false }, //Ok
    anamn_calcular: { type: String, required: false }, //Ok
    anamn_calcularobs: { type: String, required: false }, //Ok
    anamn_atencao: { type: String, required: false }, //Ok
    anamn_atencaoobs: { type: String, required: false }, //Ok
    anamn_profparticular: { type: String, required: false }, //Ok
    anamn_profparticularnome: { type: String, required: false }, //Ok
    anamn_ativiextra: { type: String, required: false }, //Ok
    anamn_ativiextrahorario: { type: String, required: false }, //Ok
    anamn_obsescola: { type: String, required: false }, //Ok
    //Rotinas
    anamn_rotanadiasemanal: { type: String, required: false }, //Ok
    anamn_anotaextra: { type: String, required: false }, //Ok
    anamn_dataanamnese:{ type: Date, required: false }, //incluir data que a anamnese foi criada
    anamn_datacad: { type: Date, required: false }, //Ok
    anamn_usuidcad: { type: ObjectId, required: false }, //Ok
    anamn_dataedi: { type: Date, required: false }, //Ok
    anamn_usuidedi: { type: ObjectId, required: false }, //Ok
    anamn_terapeutaid: { type: ObjectId, required: false } //Ok
})

class Anamn{
    constructor(
    anamn_id,
    anamn_data, //Ok
    anamn_hora, //Ok
    anamn_beneid, //Ok
    anamn_benenome, //Ok
    anamn_beneapelido, //Ok
    anamn_benedatanasc, //Ok
    anamn_beneidade, //Ok
    anamn_painome, //Ok
    anamn_maenome, //Ok
    anamn_respnome, //Ok
    anamn_indica, //Ok
    anamn_queixapri, //Ok
    anamn_diag, //Ok
    anamn_houvetratengrav, //Ok
    anamn_houvetratengravdesc, //Ok
    anamn_houveplanfami, //Ok
    anamn_houveplanfamidesc, //Ok
    anamn_ameacatenaborto, //Ok
    anamn_ameacatenabortodesc, //Ok
    anamn_bebeoufumagesta, //Ok
    anamn_bebeoufumagestadesc, //Ok
    anamn_traumafispsiinfec, //Ok
    anamn_traumafispsiinfecdesc, //Ok
    anamn_usotranquil, //Ok
    anamn_usotranquildesc, //Ok
    anamn_adocao, //Ok
    anamn_obsgesta, //Ok
    //Parto
    anamn_partoqual, //Ok
    anamn_partoqualdesc, //Ok
    anamn_tempogestacional, //Ok
    anamn_tempogestacionaldesc, //Ok
    anamn_anorexiaperiparto, //Ok
    anamn_anorexiaperipartodesc, //Ok
    anamn_apgar, //Ok
    //inclusao adicional em 20/07/23
    anamn_apgargrau, //Incluido
    anamn_apgardesc, //Ok
    anamn_chorounasc, //Ok
    anamn_chorounascdesc, //Ok
    anamn_ictericia, //Ok
    anamn_ictericiadesc, //Ok
    anamn_fototerapia, //Ok
    anamn_fototerapiadesc, //Ok
    anamn_uti, //Ok
    anamn_utitempo, //Ok
    anamn_complica, //Ok 
    anamn_complicadesc, //Ok
    anamn_paipresentenasc,  //Ok
    anamn_paipresentenascdesc, //Ok
    anamn_descrparto, //Ok
    anamn_reacbebe, //Ok
    anamn_obsparto, //Ok
    //Parto
    anamn_pessmoracasa, //Ok
    anamn_irmaosmoracasa, //Ok
    anamn_irmaospartemae, //Ok
    anamn_irmaospartpai, //Ok
    anamn_maetrab, //Ok
    anamn_maetrabquemfica, //Ok
    anamn_obsfami, //Ok
    //Ambiente familiar
    anamn_paisvivemjuntosbem, //Ok
    anamn_paisvivemjuntosbemdesc, //Ok
    anamn_discussoesfreq, //Ok
    anamn_discussoesfreqdesc, //Ok
    anamn_comofoisepara, //Ok
    anamn_reacaocrianca, //Ok
    anamn_quemcedefacil, //Ok
    anamn_quemcedefacildesc, //Ok
    anamn_criancatratdif, //Ok
    anamn_criancatratdifcomo, //Ok
    anamn_relacirmaos, //Ok
    anamn_ambientefami, //Ok
    anamn_obsfamiambiente, //Ok
    //Religião
    anamn_haeducarelig, //Ok
    anamn_haeducareligqual, //Ok
    anamn_devpreccumpr, //Ok
    anamn_devpreccumprdesc, //Ok
    anamn_obsreligiao, //Ok
    //Enfermidades
    anamn_sarampo, //Ok
    anamn_catapora, //Ok
    anamn_caxumba, //Ok
    anamn_rubeola, //Ok
    anamn_cpqueluche, //Ok
    anamn_meningite, //Ok
    anamn_complicavacina, //Ok
    //Inclusoes adcionais em 20/07/23
    anamn_dengue, //Incluir
    anamn_zica, //Incluir
    anamn_chikun, //Incluir
    anamn_covid, //Incluir
    anamn_tce, //Incluir
    anamn_obssaude, //Incluir
    anamn_zoonoses,
    anamn_otite, //Ok
    anamn_adenoide, //Ok
    anamn_amigdalites, //Ok
    anamn_alergias, //Ok
    anamn_acidentes, //Ok
    anamn_convulsoes, //Ok
    anamn_internacoes, //Ok
    anamn_cirurgia, //Ok
    //Enfermidades,
    anamn_avaliacaoneuro, //Ok
    anamn_avaliacaoneurodesc, //Ok nome do Médico
    anamn_avaliacaoneurotel, //Ok
    anamn_avaliacaopsico, //Ok
    anamn_avaliacaopsicodesc, //Ok nome psic
    anamn_avaliacaopsicotel, //Ok
    anamn_quem,
    anamn_contatotel,
    anamn_examesrealiza, //Ok
    anamn_medicacaoquais, //Ok
    anamn_quandodiag, //Ok
    anamn_antecfamidesc, //Ok
    //Enfermidades, antecedente familiar 
    anamn_nervoso, //Ok
    anamn_deficiente, //Ok
    anamn_viciado, //Ok
    anamn_ataques, //Ok
    anamn_dislexia, //Ok
    anamn_TDAH, //Ok
    anamn_nervosodesc, //Incluir
    anamn_deficientedesc, //Incluir
    anamn_viciadodesc, //Incluir
    anamn_ataquesdesc, //Incluir
    anamn_tdahdesc, //Incluir
    anamn_esquizofrenia, //Incluir
    anamn_esquizofreniadesc, //Incluir
    anamn_outros, //Ok
    anamn_outrosdesc, //Ok
    anamn_obssaude2, //Ok
    //Linguagem
    anamn_pripalavrasidade, //Ok
    anamn_limguagemcompre, //Ok
    anamn_inicioufalaparou, //Ok
    anamn_inicioufalaparoudesc, //Ok
    anamn_gdiscluverbalgagueira, //Ok
    anamn_dislalia, //Ok
    anamn_dislaliaqual, //Ok
   
    anamn_falavocal, //Ok
    anamn_compreendeordem, //Ok
    anamn_cumpreordens,
    anamn_ecolaliaimediata, //Ok
    anamn_ecolaliatardia, //Ok
    anamn_aponta, //Ok
    anamn_pede, //Ok
    anamn_nomeiadescenas, //Ok
    anamn_pergunta, //Ok
    anamn_respondepergunta, //Ok
    anamn_solicitabrincar, //Ok
    anamn_solicitairbanheiro, //Ok
    anamn_solicitabeber, //Ok
    anamn_solicitacomer, //Ok
    anamn_rouco, //Incluir
    anamn_realizasombocainativ, //Ok 
    anamn_realizasombocaativ, //Ok

    anamn_falavocaldesc, //Ok
    anamn_compreendeordemdesc, //Ok
    anamn_cumpreordensdesc,
    anamn_ecolaliaimediatadesc, //Ok
    anamn_ecolaliatardiadesc, //Ok
    anamn_apontadesc, //Ok
    anamn_pededesc, //Ok
    anamn_nomeiadescenasdesc, //Ok
    anamn_perguntadesc, //Ok
    anamn_respondeperguntadesc, //Ok
    anamn_solicitabrincardesc, //Ok
    anamn_solicitairbanheirodesc, //Ok
    anamn_solicitabeberdesc, //Ok
    anamn_solicitacomerdesc, //Ok
    anamn_roucodesc, //Incluir
    anamn_realizasombocainativdesc, //Ok 
    anamn_realizasombocaativdesc, //Ok

    anamn_frasequantaspalavras, //Ok
    anamn_obslibguagem, //Ok
    //Sexualidade
    anamn_curiosidadesex, //Ok
    anamn_curiosidadesexdesc, //Ok
    anamn_masturbase, //Ok
    anamn_masturbasedesc, //Ok
    anamn_percebedifsex, //Ok
    anamn_percebedifsexdesc,
    anamn_obssex, //Ok
    //Rel emocionais
    anamn_comoreaproibi, //Ok
    anamn_comoreafrustra, //Ok
    anamn_comoreacastig, //Ok
    anamn_comoreanovasituacao, //Ok
    anamn_agressivocomquem,
    anamn_defendeseagressao,
    anamn_defendeseagressaocomo,//Ok
    anamn_autolesivo, //Ok
    anamn_autolesivodesc, //Ok
    anamn_agressivo, //Ok
    anamn_agressivodesc, //Ok
    anamn_dependente, //Ok
    anamn_dependentedesc, //Incluir
    anamn_carinho, //Ok
    anamn_carinhodesc, //Incluir
    anamn_autoritario, //Ok
    anamn_autoritariodesc, //Incluir
    anamn_malcriado, //Ok
    anamn_malcriadodesc, //Incluir
    anamn_exibicionista, //Ok
    anamn_exibicionistadesc, //Incluir
    anamn_ansioso, //Ok
    anamn_ansiosodesc, //Incluir
    anamn_calado, //Ok
    anamn_caladodesc, //Incluir
    anamn_falante, //Ok
    anamn_falantedesc, //Incluir
    anamn_esteriotipiasquandoocorre, //Ok
    anamn_obscomportamento, //Ok
    //Manipulações e Tiques
    anamn_chupeta, //Ok
    anamn_chupetatempo, //Ok
    anamn_dedo, //Ok
    anamn_dedotempo, //Ok
    anamn_roeuouroiunhas, //Ok
    anamn_roeuouroiunhastempo,//Ok
    anamn_puxaorelhascabelo, //Ok
    anamn_puxaorelhascabelotempo, //Ok
    anamn_mordelabios, //Ok
    anamn_mordelabiostempo, //Ok
    anamn_batepes, //Ok
    anamn_batepestempo, //Ok
    anamn_batecabeca, //Ok
    anamn_batecabecadesc, //Ok
    anamn_temmedos, //Ok
    anamn_temmedosdesc, //Ok
    anamn_mentejamentiu, //Ok
    anamn_mentejamentiudesc, //Ok
    anamn_atiraobjetos, //Ok
    anamn_atiraobjetosdesc, //Ok
    anamn_desligase, //Ok
    anamn_desligasetempo, //Ok
    anamn_objetonuncalarga, //Ok
    anamn_objetonuncalargaqual, //Ok
    anamn_tique, //Ok
    anamn_tiquedesc, //Ok
    anamn_repeteacao, //Ok
    anamn_repeteacaoqual, //Ok
    anamn_obstiques, //Ok
    //sono
    anamn_dormecomquem, //Ok
    anamn_vaissozinhocama, //Ok
    anamn_vaissozinhocamadesc, //Ok
    anamn_dromequantotempo, //Ok
    anamn_vaiparacamapais, //Ok
    anamn_vaiparacamapaisdesc, //Ok
    
    anamn_choranoite, //Ok
    anamn_falanoite, //Ok
    anamn_gritanoite, //Ok
    anamn_rangedenteanoite, //Ok
    anamn_insonianoite, //Ok
    anamn_babanoite, //Ok
    anamn_pesadelo, //Ok
    anamn_sudorese, //Ok
    anamn_terrornoturno, //Ok
    anamn_ronca, //Ok
    anamn_respiraoral, //Ok

    anamn_choranoitedesc, //Ok
    anamn_falanoitedesc, //Ok
    anamn_gritanoitedesc, //Ok
    anamn_rangedenteanoitedesc, //Ok
    anamn_insonianoitedesc, //Ok
    anamn_babanoitedesc, //Ok
    anamn_pesadelodesc, //Ok
    anamn_sudoresedesc, //Ok
    anamn_terrornoturnodesc, //Ok
    anamn_roncadesc, //Ok
    anamn_respiraoraldesc, //Ok
    anamn_proximoolhos, //Ok
    anamn_proximoolhosdesc, //Ok
    anamn_sono, //Ok
    anamn_sonodesc, //Inserir
    anamn_obssono, //Ok
    //Aleitamento
    anamn_aleitamaterno, //Ok
    anamn_tempoaleitamaterno, //Ok
    anamn_boasuccaoamamenta, //Ok
    anamn_boasuccaoamamentadesc, //ok
    anamn_tempoomamadeira, //Ok
    anamn_tempoomamadeiradesc, //Ok
    anamn_durefeicao, //Ok
    anamn_durefeicaodesc, //Ok
    anamn_restricaoalimentar, //Ok
    anamn_aliso, //Ok
    anamn_alisodesc, //Ok
    anamn_utilizatalher, //Ok
    anamn_utilizatalherdesc, //Ok
    anamn_usacopo, //Ok
    anamn_usacopodesc, //Ok
    anamn_mastiga, //Ok
    anamn_mastigadesc, //Ok
    anamn_alimentaseliqui, //Ok
    anamn_alimentasepasto, //Ok
    anamn_alimentasesolido, //Ok
    anamn_alimentacom, //Incluir
    anamn_dificuldadetipocheiro, //Ok
    anamn_dificuldadetipocheiroquais, //Ok
    anamn_comportamentorefeicao, //Ok
    anamn_degluticaoquadroengasgo, //Ok
    anamn_degluticaoquadroengasgodesc, //Ok
    anamn_dificuldadetextura, //Ok
    anamn_dificuldadetexturadesc, //Ok
    anamn_obsalimentacao, //Ok
    //Controle esfincteriano!
    anamn_controlefezesdiurna, //Ok
    anamn_controlefezesnoturna, //Ok
    anamn_controlefezesdesc, //Incluir
    anamn_controleurinadiurna, //Ok
    anamn_controleurinanoturna, //Ok
    anamn_controleurinadesc, //Alterado
    anamn_obsesficteriano, //Ok
    //Auto cuidado e higiene
    anamn_usovaso, //Ok
    anamn_limpaso, //Incluir
    anamn_banhoso, //Ok
    anamn_escovaso, //Incluir
    anamn_lavamaos, //Ok
    anamn_penteaso, //Incluir
    anamn_despesvestese, //Ok
    anamn_vestese, //Ok
    anamn_calcar, //Ok
    anamn_deixacortarcabelo, //Ok
    anamn_abotoaso, //Ok
    anamn_lacarso, //Ok
    anamn_deixacortarunhas, //Ok
    anamn_obsvestirhigi, //Ok
    //Visão
    anamn_problemavisao, //Ok
    anamn_problemavisaodesc, //Ok
    anamn_olhaobjetivoatividade, //Ok
    anamn_olhaobjetivoatividadedesc, //Ok
    anamn_usaoculos, //Ok
    anamn_usaoculosmotivo, //Ok
    anamn_usaoculosquando, //Ok
    anamn_prefereambienteescuro, //Ok
    anamn_imcomodamuitaluzcor, //Ok
    anamn_fazconatatovisual, //Ok
    anamn_permanececontatovisual, //Ok
    anamn_obsvisao, //Ok
    //Audição
    anamn_duvidacapaccitaauditiva, //Ok
    anamn_duvidacapaccitaauditivadesc, //Ok
    anamn_jaexpostoruidoexplosao, //Ok
    anamn_jaexpostoruidoexplosaodesc, //Ok
    
    anamn_voz, //Ok
    anamn_audiometria, //Ok
    anamn_localizasons, //Ok
    anamn_tampaouvidosruido, //Ok
    anamn_aproximaruidos, //Ok
    anamn_asustafacil, //Ok

    anamn_vozdesc, //Ok
    anamn_audiometriadesc, //Ok
    anamn_localizasonsdesc, //Ok
    anamn_tampaouvidosruidodesc, //Ok
    anamn_aproximaruidosdesc, //Ok
    anamn_asustafacildesc, //Ok

    anamn_seicomodapessoasfalando, //Ok
    anamn_seicomodapessoasfalandodesc, //Ok
    anamn_escutachamado, //Ok
    anamn_escutachamadodesc, //Ok
    anamn_obsaudicao, //Ok
    //Desenvolvimento Psicomotor
    anamn_controlacabeca, //Ok
    anamn_rolou, //Ok
    anamn_engatinhou, //Ok
    anamn_usouandaja, //Ok
    anamn_andou, //Ok
    anamn_andoudesc, //Ok
    anamn_usaescada, //Ok
    anamn_pulacorre, //Ok
    anamn_andapontadope, //Ok
    anamn_medotirarpesdochao, //Ok
    anamn_medotirarpesdochaodesc, //Incluir
    anamn_desastrado, //Ok
    anamn_seescondeembaixoobj, //Ok
    anamn_escalasobeobj, //Ok
    anamn_mostramedoexp, //Ok
    anamn_mostramedoexpdesc, //Incluir
    anamn_evitanovasposicoes, //Ok
    anamn_evitanovasposicoesdesc, //Incluir
    anamn_reacaoemotivaexessi, //Ok
    anamn_reacaoemotivaexessidesc, //Incluir
    anamn_movisecuidado, //Ok
    anamn_movisecuidadodesc, //Incluir
    anamn_temexpnegativamov, //Ok
    anamn_temexpnegativamovdesc, //Incluir
    anamn_obspsicomotor, //Ok
    //Desenvolvimento Tatil
    anamn_recusapisargrama, //Ok
    anamn_recusapisarmolhado, //Ok
    anamn_recusaareia, //Ok
    anamn_recusatinta, //Ok
    anamn_recusaplastilina, //Ok
    anamn_recusaamoeba, //Ok
    anamn_evitatoqueleve, //Ok
    anamn_aceitaabreco, //Ok
    anamn_aceitaabrecodesc, //Incluir
    anamn_tocapessoasobjconsta, //Ok
    anamn_batecaisemnocao, //Ok
    anamn_seguraobj, //Ok
    anamn_buscaatvpuxaremp, //Ok
    anamn_mastigaobjroupa, //Ok
    anamn_tocapessoasobjconstadesc, //Incluir
    anamn_batecaisemnocaodesc, //Incluir
    anamn_seguraobjdesc, //Incluir
    anamn_buscaatvpuxarempdesc, //Incluir
    anamn_mastigaobjroupadesc, //Incluir
    anamn_obstatil, //Ok
    //Sociabilidade
    anamn_preferebrincarcom, //Ok
    anamn_preferebrincaridade, //Ok
    anamn_preferebrincarcomdesc, //Ok
    
    anamn_fazamigosfacil, //Ok
    anamn_emprestabrinquedos, //Ok
    anamn_brincacooperado, //Ok
    anamn_gostamandar, //Ok
    anamn_gostasubmeter, //Ok
    
    anamn_fazamigosfacildesc, //Ok
    anamn_emprestabrinquedosdesc, //Ok
    anamn_brincacooperadodesc, //Ok
    anamn_gostamandardesc, //Ok
    anamn_gostasubmeterdesc, //Ok
    
    anamn_gostamusica, //Ok
    anamn_gostamusicaquais, //Ok

    anamn_socializapares, //Ok
    anamn_brincaparque, //Ok
    anamn_brincarfuncional, //Ok
    anamn_criabrincadeiras, //Ok
    anamn_recusaengajardemanda, //Ok
    
    anamn_socializaparesdesc, //Ok
    anamn_brincaparquedesc, //Ok
    anamn_brincarfuncionaldesc, //Ok
    anamn_criabrincadeirasdesc, //Ok
    anamn_recusaengajardemandadesc, //Ok

    anamn_brinquedopreferidosquais, //Ok
    anamn_obssocial, //Ok
    //Escolaridade
    anamn_escola, //Ok
    anamn_tempo, //Ok
    anamn_turno, //Ok
    anamn_serie, //Ok
    anamn_escolaanterior, //Ok
    anamn_paisestudamcomcrianca, //Ok
    anamn_localadequadoestudo, //Ok
    anamn_executatarefascaseiras, //Ok
    anamn_temautonomiaestuda, //Ok
    anamn_necessitaorienta, //Ok
    anamn_usamuitaborracha, //Ok
    anamn_rendimentoescolarbaixo, //Ok
    anamn_reprovado, //Ok
    anamn_pulouserie, //Ok
    anamn_pulouseriedesc, //Ok
    anamn_idadealfa, //Ok
    anamn_comofoialfabet, //Ok
    anamn_dificuldadeescolar, //Ok
    anamn_dificuldademateriaquais, //Ok
    anamn_ler, //Ok
    anamn_lerobs, //Ok
    anamn_escreve, //Ok
    anamn_escreveobs, //Ok
    anamn_motrici, //Ok
    anamn_motriciobs, //Ok
    anamn_contar, //Ok
    anamn_contarobs, //Ok
    anamn_calcular, //Ok
    anamn_calcularobs, //Ok
    anamn_atencao, //Ok
    anamn_atencaoobs, //Ok
    anamn_profparticular, //Ok
    anamn_profparticularnome, //Ok
    anamn_ativiextra, //Ok
    anamn_ativiextrahorario, //Ok
    anamn_obsescola, //Ok
    //Rotinas
    anamn_rotanadiasemanal, //Ok
    anamn_anotaextra, //Ok
    anamn_dataanamnese,
    anamn_datacad, //Ok
    anamn_dataedi, //Ok
    anamn_usuidcad, //Ok
    anamn_usuidedi, //Ok
    anamn_terapeutaid //Ok
         ){
            this.anamn_id = anamn_id, 
            this.anamn_data = anamn_data, //Ok
            this.anamn_hora = anamn_hora, //Ok
            this.anamn_beneid = anamn_beneid,
            this.anamn_benefoto = anamn_benefoto,
            this.anamn_benenome = anamn_benenome,
            this.anamn_beneapelido = anamn_beneapelido,
            this.anamn_benedatanasc = anamn_benedatanasc,
            this.anamn_beneidade = anamn_beneidade,
            this.anamn_painome = anamn_painome,
            this.anamn_maenome = anamn_maenome,
            this.anamn_respnome = anamn_respnome,
            this.anamn_indica = anamn_indica,
            this.anamn_queixapri = anamn_queixapri,
            this.anamn_diag = anamn_diag,
            this.anamn_houvetratengrav = anamn_houvetratengrav,
            this.anamn_houvetratengravdesc = anamn_houvetratengravdesc,
            this.anamn_houveplanfami = anamn_houveplanfami,
            this.anamn_houveplanfamidesc = anamn_houveplanfamidesc,
            this.anamn_ameacatenaborto = anamn_ameacatenaborto,
            this.anamn_ameacatenabortodesc = anamn_ameacatenabortodesc,
            this.anamn_bebeoufumagesta = anamn_bebeoufumagesta,
            this.anamn_bebeoufumagestadesc = anamn_bebeoufumagestadesc,
            this.anamn_traumafispsiinfec = anamn_traumafispsiinfec,
            this.anamn_traumafispsiinfecdesc = anamn_traumafispsiinfecdesc,
            this.anamn_usotranquil = anamn_usotranquil,
            this.anamn_usotranquildesc = anamn_usotranquildesc,
            this.anamn_adocao = anamn_adocao,
            this.anamn_obsgesta = anamn_obsgesta,
            //Parto
            this.anamn_partoqual = anamn_partoqual,
            this.anamn_partoqualdesc = anamn_partoqualdesc,
            this.anamn_tempogestacional = anamn_tempogestacional,
            this.anamn_tempogestacionaldesc = anamn_tempogestacionaldesc,
            this.anamn_anorexiaperiparto = anamn_anorexiaperiparto,
            this.anamn_anorexiaperipartodesc = anamn_anorexiaperipartodesc,
            this.anamn_apgar = anamn_apgar,
            //inclusao adicional em 20/07/23
            this.anamn_apgargrau = anamn_apgargrau,
            this.anamn_apgardesc = anamn_apgardesc,
            this.anamn_chorounasc = anamn_chorounasc,
            this.anamn_chorounascdesc = anamn_chorounascdesc,
            this.anamn_ictericia = anamn_ictericia,
            this.anamn_ictericiadesc = anamn_ictericiadesc,
            this.anamn_fototerapia = anamn_fototerapia,
            this.anamn_fototerapiadesc = anamn_fototerapiadesc,
            this.anamn_uti = anamn_uti,
            this.anamn_utitempo = anamn_utitempo,
            this.anamn_complica = anamn_complica,
            this.anamn_complicadesc = anamn_complicadesc,
            this.anamn_paipresentenasc = anamn_paipresentenasc,
            this.anamn_paipresentenascdesc = anamn_paipresentenascdesc,
            this.anamn_descrparto = anamn_descrparto,
            this.anamn_reacbebe = anamn_reacbebe,
            this.anamn_obsparto = anamn_obsparto,
            //Parto
            this.anamn_pessmoracasa = anamn_pessmoracasa,
            this.anamn_irmaosmoracasa = anamn_irmaosmoracasa,
            this.anamn_irmaospartemae = anamn_irmaospartemae,
            this.anamn_irmaospartpai = anamn_irmaospartpai,
            this.anamn_maetrab = anamn_maetrab,
            this.anamn_maetrabquemfica = anamn_maetrabquemfica,
            this.anamn_obsfami = anamn_obsfami,
            //Ambiente familiar
            this.anamn_paisvivemjuntosbem = anamn_paisvivemjuntosbem,
            this.anamn_paisvivemjuntosbemdesc = anamn_paisvivemjuntosbemdesc,
            this.anamn_discussoesfreq = anamn_discussoesfreq,
            this.anamn_discussoesfreqdesc = anamn_discussoesfreqdesc,
            this.anamn_comofoisepara = anamn_comofoisepara,
            this.anamn_reacaocrianca = anamn_reacaocrianca,
            this.anamn_quemcedefacil = anamn_quemcedefacil,
            this.anamn_quemcedefacildesc = anamn_quemcedefacildesc,
            this.anamn_criancatratdif = anamn_criancatratdif,
            this.anamn_criancatratdifcomo = anamn_criancatratdifcomo,
            this.anamn_relacirmaos = anamn_relacirmaos,
            this.anamn_ambientefami = anamn_ambientefami,
            this.anamn_obsfamiambiente = anamn_obsfamiambiente,
            //Religião
            this.anamn_haeducarelig = anamn_haeducarelig,
            this.anamn_haeducareligqual = anamn_haeducareligqual,
            this.anamn_devpreccumpr = anamn_devpreccumpr,
            this.anamn_devpreccumprdesc = anamn_devpreccumprdesc,
            this.anamn_obsreligiao = anamn_obsreligiao,
            //Enfermidades
            this.anamn_sarampo = anamn_sarampo,
            this.anamn_catapora = anamn_catapora,
            this.anamn_caxumba = anamn_caxumba,
            this.anamn_rubeola = anamn_rubeola,
            this.anamn_cpqueluche = anamn_cpqueluche,
            this.anamn_meningite = anamn_meningite,
            this.anamn_complicavacina = anamn_complicavacina,
            //Inclusoes adcionais em 20/07/23
            this.anamn_dengue = anamn_dengue,
            this.anamn_zica = anamn_zica,
            this.anamn_chikun = anamn_chikun,
            this.anamn_covid = anamn_covid,
            this.anamn_tce = anamn_tce,
            this.anamn_obssaude = anamn_obssaude,
            this.anamn_zoonoses = anamn_zoonoses,
            this.anamn_otite = anamn_otite,
            this.anamn_adenoide = anamn_adenoide,
            this.anamn_amigdalites = anamn_amigdalites,
            this.anamn_alergias = anamn_alergias,
            this.anamn_acidentes = anamn_acidentes,
            this.anamn_convulsoes = anamn_convulsoes,
            this.anamn_internacoes = anamn_internacoes,
            this.anamn_cirurgia = anamn_cirurgia,
            //Enfermidades, antecedentes
            this.anamn_avaliacaoneuro = anamn_avaliacaoneuro,
            this.anamn_avaliacaoneurodesc = anamn_avaliacaoneurodesc,
            this.anamn_avaliacaoneurotel = anamn_avaliacaoneurotel,
            this.anamn_avaliacaopsico = anamn_avaliacaopsico,
            this.anamn_avaliacaopsicodesc = anamn_avaliacaopsicodesc,
            this.anamn_avaliacaopsicotel = anamn_avaliacaopsicotel,
            this.anamn_quem = anamn_quem,
            this.anamn_contatotel = anamn_contatotel,
            this.anamn_examesrealiza = anamn_examesrealiza,
            this.anamn_medicacaoquais = anamn_medicacaoquais,
            this.anamn_quandodiag = anamn_quandodiag,
            this.anamn_antecfamidesc = anamn_antecfamidesc,
            this.//Enfermidades = //Enfermidades,
            this.anamn_nervoso = anamn_nervoso,
            this.anamn_deficiente = anamn_deficiente,
            this.anamn_viciado = anamn_viciado,
            this.anamn_ataques = anamn_ataques,
            this.anamn_dislexia = anamn_dislexia,
            this.anamn_TDAH = anamn_TDAH,
            this.anamn_nervosodesc = anamn_nervosodesc,
            this.anamn_deficientedesc = anamn_deficientedesc,
            this.anamn_viciadodesc = anamn_viciadodesc,
            this.anamn_ataquesdesc = anamn_ataquesdesc,
            this.anamn_tdahdesc = anamn_tdahdesc,
            this.anamn_esquizofrenia = anamn_esquizofrenia,
            this.anamn_esquizofreniadesc = anamn_esquizofreniadesc,
            this.anamn_outros = anamn_outros,
            this.anamn_outrosdesc = anamn_outrosdesc,
            this.anamn_obssaude2 = anamn_obssaude2,
            //Linguagem
            this.anamn_pripalavrasidade = anamn_pripalavrasidade,
            this.anamn_limguagemcompre = anamn_limguagemcompre,
            this.anamn_inicioufalaparou = anamn_inicioufalaparou,
            this.anamn_inicioufalaparoudesc = anamn_inicioufalaparoudesc,
            this.anamn_gdiscluverbalgagueira = anamn_gdiscluverbalgagueira,
            this.anamn_dislalia = anamn_dislalia,
            this.anamn_dislaliaqual = anamn_dislaliaqual,
            
            this.anamn_falavocal = anamn_falavocal,
            this.anamn_compreendeordem = anamn_compreendeordem,
            this.anamn_cumpreordens = anamn_cumpreordens,
            this.anamn_ecolaliaimediata = anamn_ecolaliaimediata,
            this.anamn_ecolaliatardia = anamn_ecolaliatardia,
            this.anamn_aponta = anamn_aponta,
            this.anamn_pede = anamn_pede,
            this.anamn_nomeiadescenas = anamn_nomeiadescenas,
            this.anamn_pergunta = anamn_pergunta,
            this.anamn_respondepergunta = anamn_respondepergunta,
            this.anamn_solicitabrincar = anamn_solicitabrincar,
            this.anamn_solicitairbanheiro = anamn_solicitairbanheiro,
            this.anamn_solicitabeber = anamn_solicitabeber,
            this.anamn_solicitacomer = anamn_solicitacomer,
            this.anamn_rouco = anamn_rouco,
            this.anamn_realizasombocainativ = anamn_realizasombocainativ,
            this.anamn_realizasombocaativ = anamn_realizasombocaativ,

            this.anamn_falavocaldesc = anamn_falavocaldesc,
            this.anamn_compreendeordemdesc = anamn_compreendeordemdesc,
            this.anamn_cumpreordensdesc = anamn_cumpreordensdesc,
            this.anamn_ecolaliaimediatadesc = anamn_ecolaliaimediatadesc,
            this.anamn_ecolaliatardiadesc = anamn_ecolaliatardiadesc,
            this.anamn_apontadesc = anamn_apontadesc,
            this.anamn_pededesc = anamn_pededesc,
            this.anamn_nomeiadescenasdesc = anamn_nomeiadescenasdesc,
            this.anamn_perguntadesc = anamn_perguntadesc,
            this.anamn_respondeperguntadesc = anamn_respondeperguntadesc,
            this.anamn_solicitabrincardesc = anamn_solicitabrincardesc,
            this.anamn_solicitairbanheirodesc = anamn_solicitairbanheirodesc,
            this.anamn_solicitabeberdesc = anamn_solicitabeberdesc,
            this.anamn_solicitacomerdesc = anamn_solicitacomerdesc,
            this.anamn_roucodesc = anamn_roucodesc,
            this.anamn_realizasombocainativdesc = anamn_realizasombocainativdesc,
            this.anamn_realizasombocaativdesc = anamn_realizasombocaativdesc,

            this.anamn_frasequantaspalavras = anamn_frasequantaspalavras,
            this.anamn_obslibguagem = anamn_obslibguagem,
            //Sexualidade
            this.anamn_curiosidadesex = anamn_curiosidadesex,
            this.anamn_curiosidadesexdesc = anamn_curiosidadesexdesc,
            this.anamn_masturbase = anamn_masturbase,
            this.anamn_masturbasedesc = anamn_masturbasedesc,
            this.anamn_percebedifsex = anamn_percebedifsex,
            this.anamn_percebedifsexdesc = anamn_percebedifsexdesc,
            this.anamn_obssex = anamn_obssex,
            //Rel emocionais
            this.anamn_comoreaproibi = anamn_comoreaproibi,
            this.anamn_comoreafrustra = anamn_comoreafrustra,
            this.anamn_comoreacastig = anamn_comoreacastig,
            this.anamn_comoreanovasituacao = anamn_comoreanovasituacao,
            this.anamn_agressivocomquem = anamn_agressivocomquem,
            this.anamn_defendeseagressao = anamn_defendeseagressao,
            this.anamn_defendeseagressaocomo = anamn_defendeseagressaocomo,
            this.anamn_autolesivo = anamn_autolesivo,
            this.anamn_autolesivodesc = anamn_autolesivodesc,
            this.anamn_agressivo = anamn_agressivo,
            this.anamn_agressivodesc = anamn_agressivodesc,           
            this.anamn_dependente = anamn_dependente,
            this.anamn_dependentedesc = anamn_dependentedesc,
            this.anamn_carinho = anamn_carinho,
            this.anamn_carinhodesc = anamn_carinhodesc,
            this.anamn_autoritario = anamn_autoritario,
            this.anamn_autoritariodesc = anamn_autoritariodesc,
            this.anamn_malcriado = anamn_malcriado,
            this.anamn_malcriadodesc = anamn_malcriadodesc,
            this.anamn_exibicionista = anamn_exibicionista,
            this.anamn_exibicionistadesc = anamn_exibicionistadesc,
            this.anamn_ansioso = anamn_ansioso,
            this.anamn_ansiosodesc = anamn_ansiosodesc,
            this.anamn_calado = anamn_calado,
            this.anamn_caladodesc = anamn_caladodesc,
            this.anamn_falante = anamn_falante,
            this.anamn_falantedesc = anamn_falantedesc,
            this.anamn_esteriotipiasquandoocorre = anamn_esteriotipiasquandoocorre,
            this.anamn_obscomportamento = anamn_obscomportamento,
            //Manipulações e Tiques
            this.anamn_chupeta = anamn_chupeta,
            this.anamn_chupetatempo = anamn_chupetatempo,
            this.anamn_dedo = anamn_dedo,
            this.anamn_dedotempo = anamn_dedotempo,
            this.anamn_roeuouroiunhas = anamn_roeuouroiunhas,
            this.anamn_roeuouroiunhastempo = anamn_roeuouroiunhastempo,
            this.anamn_puxaorelhascabelo = anamn_puxaorelhascabelo,
            this.anamn_puxaorelhascabelotempo = anamn_puxaorelhascabelotempo,
            this.anamn_mordelabios = anamn_mordelabios,
            this.anamn_mordelabiostempo = anamn_mordelabiostempo,
            this.anamn_batepes = anamn_batepes,
            this.anamn_batepestempo = anamn_batepestempo,
            this.anamn_batecabeca = anamn_batecabeca,
            this.anamn_batecabecadesc = anamn_batecabecadesc,
            this.anamn_temmedos = anamn_temmedos,
            this.anamn_temmedosdesc = anamn_temmedosdesc,
            this.anamn_mentejamentiu = anamn_mentejamentiu,
            this.anamn_mentejamentiudesc = anamn_mentejamentiudesc,
            this.anamn_atiraobjetos = anamn_atiraobjetos,
            this.anamn_atiraobjetosdesc = anamn_atiraobjetosdesc,
            this.anamn_desligase = anamn_desligase,
            this.anamn_desligasetempo = anamn_desligasetempo,
            this.anamn_objetonuncalarga = anamn_objetonuncalarga,
            this.anamn_objetonuncalargaqual = anamn_objetonuncalargaqual,
            this.anamn_tique = anamn_tique,
            this.anamn_tiquedesc = anamn_tiquedesc,
            this.anamn_repeteacao = anamn_repeteacao,
            this.anamn_repeteacaoqual = anamn_repeteacaoqual,
            this.anamn_obstiques = anamn_obstiques,
            //sono
            this.anamn_dormecomquem = anamn_dormecomquem,
            this.anamn_vaissozinhocama = anamn_vaissozinhocama,
            this.anamn_vaissozinhocamadesc = anamn_vaissozinhocamadesc,
            this.anamn_dromequantotempo = anamn_dromequantotempo,
            this.anamn_vaiparacamapais = anamn_vaiparacamapais,
            this.anamn_vaiparacamapaisdesc = anamn_vaiparacamapaisdesc,
            
            this.anamn_choranoite = anamn_choranoite,
            this.anamn_falanoite = anamn_falanoite,
            this.anamn_gritanoite = anamn_gritanoite,
            this.anamn_rangedenteanoite = anamn_rangedenteanoite,
            this.anamn_insonianoite = anamn_insonianoite,
            this.anamn_babanoite = anamn_babanoite,
            this.anamn_pesadelo = anamn_pesadelo,
            this.anamn_sudorese = anamn_sudorese,
            this.anamn_terrornoturno = anamn_terrornoturno,
            this.anamn_ronca = anamn_ronca,
            this.anamn_respiraoral = anamn_respiraoral,
            this.anamn_proximoolhos = anamn_proximoolhos,
            this.anamn_proximoolhosdesc = anamn_proximoolhosdesc,
            this.anamn_choranoitedesc = anamn_choranoitedesc,
            this.anamn_falanoitedesc = anamn_falanoitedesc,
            this.anamn_gritanoitedesc = anamn_gritanoitedesc,
            this.anamn_rangedenteanoitedesc = anamn_rangedenteanoitedesc,
            this.anamn_insonianoitedesc = anamn_insonianoitedesc,
            this.anamn_babanoitedesc = anamn_babanoitedesc,
            this.anamn_pesadelodesc = anamn_pesadelodesc,
            this.anamn_sudoresedesc = anamn_sudoresedesc,
            this.anamn_terrornoturnodesc = anamn_terrornoturnodesc,
            this.anamn_roncadesc = anamn_roncadesc,
            this.anamn_respiraoraldesc = anamn_respiraoraldesc,

            this.anamn_sono = anamn_sono,
            this.anamn_sonodesc = anamn_sonodesc,
            this.anamn_obssono = anamn_obssono,
            //Aleitamento
            this.anamn_aleitamaterno = anamn_aleitamaterno,
            this.anamn_tempoaleitamaterno = anamn_tempoaleitamaterno,
            this.anamn_boasuccaoamamenta = anamn_boasuccaoamamenta,
            this.anamn_boasuccaoamamentadesc = anamn_boasuccaoamamentadesc,
            this.anamn_tempoomamadeira = anamn_tempoomamadeira,
            this.anamn_tempoomamadeiradesc = anamn_tempoomamadeiradesc,
            this.anamn_durefeicao = anamn_durefeicao,
            this.anamn_durefeicaodesc = anamn_durefeicaodesc,
            this.anamn_restricaoalimentar = anamn_restricaoalimentar,
            this.anamn_aliso = anamn_aliso,
            this.anamn_alisodesc = anamn_alisodesc,
            this.anamn_utilizatalher = anamn_utilizatalher,
            this.anamn_utilizatalherdesc = anamn_utilizatalherdesc,
            this.anamn_usacopo = anamn_usacopo,
            this.anamn_usacopodesc = anamn_usacopodesc,
            this.anamn_mastiga = anamn_mastiga,
            this.anamn_mastigadesc = anamn_mastigadesc,
            this.anamn_alimentaseliqui = anamn_alimentaseliqui,
            this.anamn_alimentasepasto = anamn_alimentasepasto,
            this.anamn_alimentasesolido = anamn_alimentasesolido,
            this.anamn_alimentacom = anamn_alimentacom,
            this.anamn_dificuldadetipocheiro = anamn_dificuldadetipocheiro,
            this.anamn_dificuldadetipocheiroquais = anamn_dificuldadetipocheiroquais,
            this.anamn_comportamentorefeicao = anamn_comportamentorefeicao,
            this.anamn_degluticaoquadroengasgo = anamn_degluticaoquadroengasgo,
            this.anamn_degluticaoquadroengasgodesc = anamn_degluticaoquadroengasgodesc,
            this.anamn_dificuldadetextura = anamn_dificuldadetextura,
            this.anamn_dificuldadetexturadesc = anamn_dificuldadetexturadesc,
            this.anamn_obsalimentacao = anamn_obsalimentacao,
            //Controle esfincteriano!
            this.anamn_controlefezesdiurna = anamn_controlefezesdiurna,
            this.anamn_controlefezesnoturna = anamn_controlefezesnoturna,
            this.anamn_controlefezesdesc = anamn_controlefezesdesc,
            this.anamn_controleurinadiurna = anamn_controleurinadiurna,
            this.anamn_controleurinanoturna = anamn_controleurinanoturna,
            this.anamn_controleurinadesc = anamn_controleurinadesc,
            this.anamn_obsesficteriano = anamn_obsesficteriano,
            //Auto cuidado e higiene
            this.anamn_usovaso = anamn_usovaso,
            this.anamn_limpaso = anamn_limpaso,
            this.anamn_banhoso = anamn_banhoso,
            this.anamn_escovaso = anamn_escovaso,
            this.anamn_lavamaos = anamn_lavamaos,
            this.anamn_penteaso = anamn_penteaso,
            this.anamn_despesvestese = anamn_despesvestese,
            this.anamn_vestese = anamn_vestese,
            this.anamn_calcar = anamn_calcar,
            this.anamn_deixacortarcabelo = anamn_deixacortarcabelo,
            this.anamn_abotoaso = anamn_abotoaso,
            this.anamn_lacarso = anamn_lacarso,
            this.anamn_deixacortarunhas = anamn_deixacortarunhas,
            this.anamn_obsvestirhigi = anamn_obsvestirhigi,
            //Visão
            this.anamn_problemavisao = anamn_problemavisao,
            this.anamn_problemavisaodesc = anamn_problemavisaodesc,
            this.anamn_olhaobjetivoatividade = anamn_olhaobjetivoatividade,
            this.anamn_olhaobjetivoatividadedesc = anamn_olhaobjetivoatividadedesc,
            this.anamn_usaoculos = anamn_usaoculos,
            this.anamn_usaoculosmotivo = anamn_usaoculosmotivo,
            this.anamn_usaoculosquando = anamn_usaoculosquando,
            this.anamn_prefereambienteescuro = anamn_prefereambienteescuro,
            this.anamn_imcomodamuitaluzcor = anamn_imcomodamuitaluzcor,
            this.anamn_fazconatatovisual = anamn_fazconatatovisual,
            this.anamn_permanececontatovisual = anamn_permanececontatovisual,
            this.anamn_obsvisao = anamn_obsvisao,
            //Audição
            this.anamn_duvidacapaccitaauditiva = anamn_duvidacapaccitaauditiva,
            this.anamn_duvidacapaccitaauditivadesc = anamn_duvidacapaccitaauditivadesc,
            this.anamn_jaexpostoruidoexplosao = anamn_jaexpostoruidoexplosao,
            this.anamn_jaexpostoruidoexplosaodesc = anamn_jaexpostoruidoexplosaodesc,
            
            this.anamn_voz = anamn_voz,
            this.anamn_audiometria = anamn_audiometria,
            this.anamn_localizasons = anamn_localizasons,
            this.anamn_tampaouvidosruido = anamn_tampaouvidosruido,
            this.anamn_aproximaruidos = anamn_aproximaruidos,
            this.anamn_asustafacil = anamn_asustafacil,

            this.anamn_vozdesc = anamn_vozdesc,
            this.anamn_audiometriadesc = anamn_audiometriadesc,
            this.anamn_localizasonsdesc = anamn_localizasonsdesc,
            this.anamn_tampaouvidosruidodesc = anamn_tampaouvidosruidodesc,
            this.anamn_aproximaruidosdesc = anamn_aproximaruidosdesc,
            this.anamn_asustafacildesc = anamn_asustafacildesc,

            this.anamn_seicomodapessoasfalando = anamn_seicomodapessoasfalando,
            this.anamn_seicomodapessoasfalandodesc = anamn_seicomodapessoasfalandodesc,
            this.anamn_escutachamado = anamn_escutachamado,
            this.anamn_escutachamadodesc = anamn_escutachamadodesc,
            this.anamn_obsaudicao = anamn_obsaudicao,
            //Desenvolvimento Psicomotor
            this.anamn_controlacabeca = anamn_controlacabeca,
            this.anamn_rolou = anamn_rolou,
            this.anamn_engatinhou = anamn_engatinhou,
            this.anamn_usouandaja = anamn_usouandaja,
            this.anamn_andou = anamn_andou,
            this.anamn_andoudesc = anamn_andoudesc,
            this.anamn_usaescada = anamn_usaescada,
            this.anamn_pulacorre = anamn_pulacorre,
            this.anamn_andapontadope = anamn_andapontadope,
            this.anamn_medotirarpesdochao = anamn_medotirarpesdochao,
            this.anamn_medotirarpesdochaodesc = anamn_medotirarpesdochaodesc,
            this.anamn_desastrado = anamn_desastrado,
            this.anamn_seescondeembaixoobj = anamn_seescondeembaixoobj,
            this.anamn_escalasobeobj = anamn_escalasobeobj,
            this.anamn_mostramedoexp = anamn_mostramedoexp,
            this.anamn_mostramedoexpdesc = anamn_mostramedoexpdesc,
            this.anamn_evitanovasposicoes = anamn_evitanovasposicoes,
            this.anamn_evitanovasposicoesdesc = anamn_evitanovasposicoesdesc,
            this.anamn_reacaoemotivaexessi = anamn_reacaoemotivaexessi,
            this.anamn_reacaoemotivaexessidesc = anamn_reacaoemotivaexessidesc,
            this.anamn_movisecuidado = anamn_movisecuidado,
            this.anamn_movisecuidadodesc = anamn_movisecuidadodesc,
            this.anamn_temexpnegativamov = anamn_temexpnegativamov,
            this.anamn_temexpnegativamovdesc = anamn_temexpnegativamovdesc,
            this.anamn_obspsicomotor = anamn_obspsicomotor,
            //Desenvolvimento Tatil
            this.anamn_recusapisargrama = anamn_recusapisargrama,
            this.anamn_recusapisarmolhado = anamn_recusapisarmolhado,
            this.anamn_recusaareia = anamn_recusaareia,
            this.anamn_recusatinta = anamn_recusatinta,
            this.anamn_recusaplastilina = anamn_recusaplastilina,
            this.anamn_recusaamoeba = anamn_recusaamoeba,
            this.anamn_evitatoqueleve = anamn_evitatoqueleve,
            this.anamn_aceitaabreco = anamn_aceitaabreco,
            this.anamn_aceitaabrecodesc = anamn_aceitaabrecodesc,
            this.anamn_tocapessoasobjconsta = anamn_tocapessoasobjconsta,
            this.anamn_batecaisemnocao = anamn_batecaisemnocao,
            this.anamn_seguraobj = anamn_seguraobj,
            this.anamn_buscaatvpuxaremp = anamn_buscaatvpuxaremp,
            this.anamn_mastigaobjroupa = anamn_mastigaobjroupa,
            this.anamn_tocapessoasobjconstadesc = anamn_tocapessoasobjconstadesc,
            this.anamn_batecaisemnocaodesc = anamn_batecaisemnocaodesc,
            this.anamn_seguraobjdesc = anamn_seguraobjdesc,
            this.anamn_buscaatvpuxarempdesc = anamn_buscaatvpuxarempdesc,
            this.anamn_mastigaobjroupadesc = anamn_mastigaobjroupadesc,
            this.anamn_obstatil = anamn_obstatil,
            //Sociabilidade
            this.anamn_preferebrincarcom = anamn_preferebrincarcom,
            this.anamn_preferebrincaridade = anamn_preferebrincaridade,
            this.anamn_preferebrincarcomdesc = anamn_preferebrincarcomdesc,

            this.anamn_fazamigosfacil = anamn_fazamigosfacil,
            this.anamn_emprestabrinquedos = anamn_emprestabrinquedos,
            this.anamn_brincacooperado = anamn_brincacooperado,
            this.anamn_gostamandar = anamn_gostamandar,
            this.anamn_gostasubmeter = anamn_gostasubmeter,
            
            this.anamn_fazamigosfacildesc = anamn_fazamigosfacildesc,
            this.anamn_emprestabrinquedosdesc = anamn_emprestabrinquedosdesc,
            this.anamn_brincacooperadodesc = anamn_brincacooperadodesc,
            this.anamn_gostamandardesc = anamn_gostamandardesc,
            this.anamn_gostasubmeterdesc = anamn_gostasubmeterdesc,

            this.anamn_gostamusica = anamn_gostamusica,
            this.anamn_gostamusicaquais = anamn_gostamusicaquais,

            this.anamn_socializapares = anamn_socializapares,
            this.anamn_brincaparque = anamn_brincaparque,
            this.anamn_brincarfuncional = anamn_brincarfuncional,
            this.anamn_criabrincadeiras = anamn_criabrincadeiras,
            this.anamn_recusaengajardemanda = anamn_recusaengajardemanda,
            
            this.anamn_socializaparesdesc = anamn_socializaparesdesc,
            this.anamn_brincaparquedesc = anamn_brincaparquedesc,
            this.anamn_brincarfuncionaldesc = anamn_brincarfuncionaldesc,
            this.anamn_criabrincadeirasdesc = anamn_criabrincadeirasdesc,
            this.anamn_recusaengajardemandadesc = anamn_recusaengajardemandadesc,

            this.anamn_brinquedopreferidosquais = anamn_brinquedopreferidosquais,
            this.anamn_obssocial = anamn_obssocial,
            //Escolaridade
            this.anamn_escola = anamn_escola,
            this.anamn_tempo = anamn_tempo,
            this.anamn_turno = anamn_turno,
            this.anamn_serie = anamn_serie,
            this.anamn_escolaanterior = anamn_escolaanterior,
            this.anamn_paisestudamcomcrianca = anamn_paisestudamcomcrianca,
            this.anamn_localadequadoestudo = anamn_localadequadoestudo,
            this.anamn_executatarefascaseiras = anamn_executatarefascaseiras,
            this.anamn_temautonomiaestuda = anamn_temautonomiaestuda,
            this.anamn_necessitaorienta = anamn_necessitaorienta,
            this.anamn_usamuitaborracha = anamn_usamuitaborracha,
            this.anamn_rendimentoescolarbaixo = anamn_rendimentoescolarbaixo,
            this.anamn_reprovado = anamn_reprovado,
            this.anamn_pulouserie = anamn_pulouserie,
            this.anamn_pulouseriedesc = anamn_pulouseriedesc,
            this.anamn_idadealfa = anamn_idadealfa,
            this.anamn_comofoialfabet = anamn_comofoialfabet,
            this.anamn_dificuldadeescolar = anamn_dificuldadeescolar,
            this.anamn_dificuldademateriaquais = anamn_dificuldademateriaquais,
            this.anamn_ler = anamn_ler,
            this.anamn_lerobs = anamn_lerobs,
            this.anamn_escreve = anamn_escreve,
            this.anamn_escreveobs = anamn_escreveobs,
            this.anamn_motrici = anamn_motrici,
            this.anamn_motriciobs = anamn_motriciobs,
            this.anamn_contar = anamn_contar,
            this.anamn_contarobs = anamn_contarobs,
            this.anamn_calcular = anamn_calcular,
            this.anamn_calcularobs = anamn_calcularobs,
            this.anamn_atencao = anamn_atencao,
            this.anamn_atencaoobs = anamn_atencaoobs,
            this.anamn_profparticular = anamn_profparticular,
            this.anamn_profparticularnome = anamn_profparticularnome,
            this.anamn_ativiextra = anamn_ativiextra,
            this.anamn_ativiextrahorario = anamn_ativiextrahorario,
            this.anamn_obsescola = anamn_obsescola,
            //Rotinas
            this.anamn_rotanadiasemanal = anamn_rotanadiasemanal,
            this.anamn_anotaextra = anamn_anotaextra,
            this.anamn_dataanamnese = anamn_dataanamnese,
            this.anamn_datacad = anamn_datacad,
            this.anamn_dataedi = anamn_dataedi,
            this.anamn_usuidcad = anamn_usuidcad,
            this.anamn_usuidedi = anamn_usuidedi,
            this.anamn_terapeutaid = anamn_terapeutaid

    }
}

AnamnSchema.loadClass(Anamn)
const AnamnModel = mongoose.model('tb_anamn', AnamnSchema)
module.exports = {AnamnModel,AnamnSchema,
    anamnEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let anamnId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("anamnId:"+anamnId)
        //Realiza Atualização
        await AnamnModel.findByIdAndUpdate(req.body.id, 
            {$set: {
                anamn_benenome: req.body.anamnBenenome,
                anamn_beneid: req.body.anamnBeneid,
                anamn_beneapelido: req.body.anamnBeneapelido,
                anamn_benedatanasc: req.body.anamnBenedatanasc,
                anamn_beneidade: req.body.anamnBeneidade,
                anamn_painome: req.body.anamnPainome,
                anamn_maenome: req.body.anamnMaenome,
                anamn_respnome: req.body.anamnRespnome,
                anamn_indica: req.body.anamnIndica,
                anamn_queixapri: req.body.anamnQueixapri,
                anamn_diag: req.body.anamnDiag,
                anamn_houvetratengrav: req.body.anamnHouvetratengrav,
                anamn_houvetratengravdesc: req.body.anamnHouvetratengravdesc,
                anamn_houveplanfami: req.body.anamnHouveplanfami,
                anamn_houveplanfamidesc: req.body.anamnHouveplanfamidesc,
                anamn_ameacatenaborto: req.body.anamnAmeacatenaborto,
                anamn_ameacatenabortodesc: req.body.anamnAmeacatenabortodesc,
                anamn_bebeoufumagesta: req.body.anamnBebeoufumagesta,
                anamn_bebeoufumagestadesc: req.body.anamnBebeoufumagestadesc,
                anamn_traumafispsiinfec: req.body.anamnTraumafispsiinfec,
                anamn_traumafispsiinfecdesc: req.body.anamnTraumafispsiinfecdesc,
                anamn_usotranquil: req.body.anamnUsotranquil,
                anamn_usotranquildesc: req.body.anamnUsotranquildesc,
                anamn_adocao: req.body.anamnAdocao,
                anamn_obsgesta: req.body.anamnObsgesta,
                //Parto
                anamn_partoqual: req.body.anamnPartoqual,
                anamn_partoqualdesc: req.body.anamnPartoqualdesc,
                anamn_tempogestacional: req.body.anamnTempogestacional,
                anamn_tempogestacionaldesc: req.body.anamnTempogestacionaldesc,
                anamn_anorexiaperiparto: req.body.anamnAnorexiaperiparto,
                anamn_anorexiaperipartodesc: req.body.anamnAnorexiaperipartodesc,
                anamn_apgar: req.body.anamnApgar,
                //inclusao: req.body.anamnUsao,
                anamn_apgargrau: req.body.anamnApgargrau,
                anamn_apgardesc: req.body.anamnApgardesc,
                anamn_chorounasc: req.body.anamnChorounasc,
                anamn_chorounascdesc: req.body.anamnChorounascdesc,
                anamn_ictericia: req.body.anamnIctericia,
                anamn_ictericiadesc: req.body.anamnIctericiadesc,
                anamn_fototerapia: req.body.anamnFototerapia,
                anamn_fototerapiadesc: req.body.anamnFototerapiadesc,
                anamn_uti: req.body.anamnUti,
                anamn_utitempo: req.body.anamnUtitempo,
                anamn_complica: req.body.anamnComplica,
                anamn_complicadesc: req.body.anamnComplicadesc,
                anamn_paipresentenasc: req.body.anamnPaipresentenasc,
                anamn_paipresentenascdesc: req.body.anamnPaipresentenascdesc,
                anamn_descrparto: req.body.anamnDescrparto,
                anamn_reacbebe: req.body.anamnReacbebe,
                anamn_obsparto: req.body.anamnObsparto,
                //Parto
                anamn_pessmoracasa: req.body.anamnPessmoracasa,
                anamn_irmaosmoracasa: req.body.anamnIrmaosmoracasa,
                anamn_irmaospartemae: req.body.anamnIrmaospartemae,
                anamn_irmaospartpai: req.body.anamnIrmaospartpai,
                anamn_maetrab: req.body.anamnMaetrab,
                anamn_maetrabquemfica: req.body.anamnMaetrabquemfica,
                anamn_obsfami: req.body.anamnObsfami,
                //Ambiente familiar
                anamn_paisvivemjuntosbem: req.body.anamnPaisvivemjuntosbem,
                anamn_paisvivemjuntosbemdesc: req.body.anamnPaisvivemjuntosbemdesc,
                anamn_discussoesfreq: req.body.anamnDiscussoesfreq,
                anamn_discussoesfreqdesc: req.body.anamnDiscussoesfreqdesc,
                anamn_comofoisepara: req.body.anamnComofoisepara,
                anamn_reacaocrianca: req.body.anamnReacaocrianca,
                anamn_quemcedefacil: req.body.anamnQuemcedefacil,
                anamn_quemcedefacildesc: req.body.anamnQuemcedefacildesc,
                anamn_criancatratdif: req.body.anamnCriancatratdif,
                anamn_criancatratdifcomo: req.body.anamnCriancatratdifcomo,
                anamn_relacirmaos: req.body.anamnRelacirmaos,
                anamn_ambientefami: req.body.anamnAmbientefami,
                anamn_obsfamiambiente: req.body.anamnObsfamiambiente,
                //Religião
                anamn_haeducarelig: req.body.anamnHaeducarelig,
                anamn_haeducareligqual: req.body.anamnHaeducareligqual,
                anamn_devpreccumpr: req.body.anamnDevpreccumpr,
                anamn_devpreccumprdesc: req.body.anamnDevpreccumprdesc,
                anamn_obsreligiao: req.body.anamnObsreligiao,
                //Enfermidades
                anamn_sarampo: req.body.anamnSarampo,
                anamn_catapora: req.body.anamnCatapora,
                anamn_caxumba: req.body.anamnCaxumba,
                anamn_rubeola: req.body.anamnRubeola,
                anamn_cpqueluche: req.body.anamnCpqueluche,
                anamn_meningite: req.body.anamnMeningite,
                anamn_complicavacina: req.body.anamnComplicavacina,
                //Inclusoes adcionais em 20/07/23
                anamn_dengue: req.body.anamnDengue,
                anamn_zica: req.body.anamnZica,
                anamn_chikun: req.body.anamnChikun,
                anamn_covid: req.body.anamnCovid,
                anamn_tce: req.body.anamnTce,
                anamn_obssaude: req.body.anamnObssaude,
                anamn_zoonoses: req.body.anamnZoonoses,
                anamn_otite: req.body.anamnOtite,
                anamn_adenoide: req.body.anamnAdenoide,
                anamn_amigdalites: req.body.anamnAmigdalites,
                anamn_alergias: req.body.anamnAlergias,
                anamn_acidentes: req.body.anamnAcidentes,
                anamn_convulsoes: req.body.anamnConvulsoes,
                anamn_internacoes: req.body.anamnInternacoes,
                anamn_cirurgia: req.body.anamnCirurgia,
                //Enfermidades
                anamn_avaliacaoneuro: req.body.anamnAvaliacaoneuro,
                anamn_avaliacaoneurodesc: req.body.anamnAvaliacaoneurodesc,
                anamn_avaliacaoneurotel: req.body.anamnAvaliacaoneurotel,
                anamn_avaliacaopsico: req.body.anamnAvaliacaopsico,
                anamn_avaliacaopsicodesc: req.body.anamnAvaliacaopsicodesc,
                anamn_avaliacaopsicotel: req.body.anamnAvaliacaopsicotel,
                anamn_quem: req.body.anamnQuem,
                anamn_contatotel: req.body.anamnContatotel,
                anamn_examesrealiza: req.body.anamnExamesrealiza,
                anamn_medicacaoquais: req.body.anamnMedicacaoquais,
                anamn_quandodiag: req.body.anamnQuandodiag,
                anamn_antecfamidesc: req.body.anamnAntecfamidesc,
                //Enfermidades, antecedente familiar 
                anamn_nervoso: req.body.anamnNervoso,
                anamn_deficiente: req.body.anamnDeficiente,
                anamn_viciado: req.body.anamnViciado,
                anamn_ataques: req.body.anamnAtaques,
                anamn_dislexia: req.body.anamnDislexia,
                anamn_TDAH: req.body.anamnTdah,
                anamn_nervosodesc: req.body.anamnNervosodesc,
                anamn_deficientedesc: req.body.anamnDeficientedesc,
                anamn_viciadodesc: req.body.anamnViciadodesc,
                anamn_ataquesdesc: req.body.anamnAtaquesdesc,
                anamn_tdahdesc: req.body.anamnTdahdesc,
                anamn_esquizofrenia: req.body.anamnEsquizofrenia,
                anamn_esquizofreniadesc: req.body.anamnEsquizofreniadesc,
                anamn_outros: req.body.anamnOutros,
                anamn_outrosdesc: req.body.anamnOutrosdesc,
                anamn_obssaude2: req.body.anamnObssaude2,
                //Linguagem
                anamn_pripalavrasidade: req.body.anamnPripalavrasidade,
                anamn_limguagemcompre: req.body.anamnLimguagemcompre,
                anamn_inicioufalaparou: req.body.anamnInicioufalaparou,
                anamn_inicioufalaparoudesc: req.body.anamnInicioufalaparoudesc,
                anamn_gdiscluverbalgagueira: req.body.anamnGdiscluverbalgagueira,
                anamn_dislalia: req.body.anamnDislalia,
                anamn_dislaliaqual: req.body.anamnDislaliaqual,
                
                anamn_falavocal: req.body.anamnFalavocal,
                anamn_compreendeordem: req.body.anamnCompreendeordem,
                anamn_cumpreordens: req.body.anamnCumpreordens,
                anamn_ecolaliaimediata: req.body.anamnEcolaliaimediata,
                anamn_ecolaliatardia: req.body.anamnEcolaliatardia,
                anamn_aponta: req.body.anamnAponta,
                anamn_pede: req.body.anamnPede,
                anamn_nomeiadescenas: req.body.anamnNomeiadescenas,
                anamn_pergunta: req.body.anamnPergunta,
                anamn_respondepergunta: req.body.anamnRespondepergunta,
                anamn_solicitabrincar: req.body.anamnSolicitabrincar,
                anamn_solicitairbanheiro: req.body.anamnSolicitairbanheiro,
                anamn_solicitabeber: req.body.anamnSolicitabeber,
                anamn_solicitacomer: req.body.anamnSolicitacomer,
                anamn_rouco: req.body.anamnRouco,
                anamn_realizasombocainativ: req.body.anamnRealizasombocainativ,
                anamn_realizasombocaativ: req.body.anamnRealizasombocaativ,

                anamn_falavocaldesc: req.body.anamnFalavocaldesc,
                anamn_compreendeordemdesc: req.body.anamnCompreendeordemdesc,
                anamn_cumpreordensdesc: req.body.anamnCumpreordensdesc,
                anamn_ecolaliaimediatadesc: req.body.anamnEcolaliaimediatadesc,
                anamn_ecolaliatardiadesc: req.body.anamnEcolaliatardiadesc,
                anamn_apontadesc: req.body.anamnApontadesc,
                anamn_pededesc: req.body.anamnPededesc,
                anamn_nomeiadescenasdesc: req.body.anamnNomeiadescenasdesc,
                anamn_perguntadesc: req.body.anamnPerguntadesc,
                anamn_respondeperguntadesc: req.body.anamnRespondeperguntadesc,
                anamn_solicitabrincardesc: req.body.anamnSolicitabrincardesc,
                anamn_solicitairbanheirodesc: req.body.anamnSolicitairbanheirodesc,
                anamn_solicitabeberdesc: req.body.anamnSolicitabeberdesc,
                anamn_solicitacomerdesc: req.body.anamnSolicitacomerdesc,
                anamn_roucodesc: req.body.anamnRoucodesc,
                anamn_realizasombocainativdesc: req.body.anamnRealizasombocainativdesc,
                anamn_realizasombocaativdesc: req.body.anamnRealizasombocaativdesc,

                anamn_frasequantaspalavras: req.body.anamnFrasequantaspalavras,
                anamn_obslibguagem: req.body.anamnObslibguagem,
                //Sexualidade
                anamn_curiosidadesex: req.body.anamnCuriosidadesex,
                anamn_curiosidadesexdesc: req.body.anamnCuriosidadesexdesc,
                anamn_masturbase: req.body.anamnMasturbase,
                anamn_masturbasedesc: req.body.anamnMasturbasedesc,
                anamn_percebedifsex: req.body.anamnPercebedifsex,
                anamn_percebedifsexdesc: req.body.anamnPercebedifsexdesc,
                anamn_obssex: req.body.anamnObssex,
                //Rel emocionais
                anamn_comoreaproibi: req.body.anamnComoreaproibi,
                anamn_comoreafrustra: req.body.anamnComoreafrustra,
                anamn_comoreacastig: req.body.anamnComoreacastig,
                anamn_comoreanovasituacao: req.body.anamnComoreanovasituacao,
                anamn_agressivocomquem: req.body.anamnAgressivocomquem,
                anamn_defendeseagressao: req.body.anamnDefendeseagressao,
                anamn_defendeseagressaocomo: req.body.anamnDefendeseagressaocomo,
                anamn_autolesivo: req.body.anamnAutolesivo,
                anamn_autolesivodesc: req.body.anamnAutolesivodesc,
                anamn_agressivo: req.body.anamnAgressivo,
                anamn_agressivodesc: req.body.anamnAgressivodesc,                
                anamn_dependente: req.body.anamnDependente,
                anamn_dependentedesc: req.body.anamnDependentedesc,
                anamn_carinho: req.body.anamnCarinho,
                anamn_carinhodesc: req.body.anamnCarinhodesc,
                anamn_autoritario: req.body.anamnAutoritario,
                anamn_autoritariodesc: req.body.anamnAutoritariodesc,
                anamn_malcriado: req.body.anamnMalcriado,
                anamn_malcriadodesc: req.body.anamnMalcriadodesc,
                anamn_exibicionista: req.body.anamnExibicionista,
                anamn_exibicionistadesc: req.body.anamnExibicionistadesc,
                anamn_ansioso: req.body.anamnAnsioso,
                anamn_ansiosodesc: req.body.anamnAnsiosodesc,
                anamn_calado: req.body.anamnCalado,
                anamn_caladodesc: req.body.anamnCaladodesc,
                anamn_falante: req.body.anamnFalante,
                anamn_falantedesc: req.body.anamnFalantedesc,
                anamn_esteriotipiasquandoocorre: req.body.anamnEsteriotipiasquandoocorre,
                anamn_obscomportamento: req.body.anamnObscomportamento,
                //Manipulações e Tiques
                anamn_chupeta: req.body.anamnChupeta,
                anamn_chupetatempo: req.body.anamnChupetatempo,
                anamn_dedo: req.body.anamnDedo,
                anamn_dedotempo: req.body.anamnDedotempo,
                anamn_roeuouroiunhas: req.body.anamnRoeuouroiunhas,
                anamn_roeuouroiunhastempo: req.body.anamnRoeuouroiunhastempo,
                anamn_puxaorelhascabelo: req.body.anamnPuxaorelhascabelo,
                anamn_puxaorelhascabelotempo: req.body.anamnPuxaorelhascabelotempo,
                anamn_mordelabios: req.body.anamnMordelabios,
                anamn_mordelabiostempo: req.body.anamnMordelabiostempo,
                anamn_batepes: req.body.anamnBatepes,
                anamn_batepestempo: req.body.anamnBatepestempo,
                anamn_batecabeca: req.body.anamnBatecabeca,
                anamn_batecabecadesc: req.body.anamnBatecabecadesc,
                anamn_temmedos: req.body.anamnTemmedos,
                anamn_temmedosdesc: req.body.anamnTemmedosdesc,
                anamn_mentejamentiu: req.body.anamnMentejamentiu,
                anamn_mentejamentiudesc: req.body.anamnMentejamentiudesc,
                anamn_atiraobjetos: req.body.anamnAtiraobjetos,
                anamn_atiraobjetosdesc: req.body.anamnAtiraobjetosdesc,
                anamn_desligase: req.body.anamnDesligase,
                anamn_desligasetempo: req.body.anamnDesligasetempo,
                anamn_objetonuncalarga: req.body.anamnObjetonuncalarga,
                anamn_objetonuncalargaqual: req.body.anamnObjetonuncalargaqual,
                anamn_tique: req.body.anamnTique,
                anamn_tiquedesc: req.body.anamnTiquedesc,
                anamn_repeteacao: req.body.anamnRepeteacao,
                anamn_repeteacaoqual: req.body.anamnRepeteacaoqual,
                anamn_obstiques: req.body.anamnObstiques,
                //sono
                anamn_dormecomquem: req.body.anamnDormecomquem,
                anamn_vaissozinhocama: req.body.anamnVaissozinhocama,
                anamn_vaissozinhocamadesc: req.body.anamnVaissozinhocamadesc,
                anamn_dromequantotempo: req.body.anamnDromequantotempo,
                anamn_vaiparacamapais: req.body.anamnVaiparacamapais,
                anamn_vaiparacamapaisdesc: req.body.anamnVaiparacamapaisdesc,
                
                anamn_choranoite: req.body.anamnChoranoite,
                anamn_falanoite: req.body.anamnFalanoite,
                anamn_gritanoite: req.body.anamnGritanoite,
                anamn_rangedenteanoite: req.body.anamnRangedenteanoite,
                anamn_insonianoite: req.body.anamnInsonianoite,
                anamn_babanoite: req.body.anamnBabanoite,
                anamn_pesadelo: req.body.anamnPesadelo,
                anamn_sudorese: req.body.anamnSudorese,
                anamn_terrornoturno: req.body.anamnTerrornoturno,
                anamn_ronca: req.body.anamnRonca,
                anamn_respiraoral: req.body.anamnRespiraoral,
                anamn_proximoolhos: req.body.anamnProximoolhos,
                anamn_proximoolhosdesc: req.body.anamnProximoolhosdesc,
                anamn_choranoitedesc: req.body.anamnChoranoitedesc,
                anamn_falanoitedesc: req.body.anamnFalanoitedesc,
                anamn_gritanoitedesc: req.body.anamnGritanoitedesc,
                anamn_rangedenteanoitedesc: req.body.anamnRangedenteanoitedesc,
                anamn_insonianoitedesc: req.body.anamnInsonianoitedesc,
                anamn_babanoitedesc: req.body.anamnBabanoitedesc,
                anamn_pesadelodesc: req.body.anamnPesadelodesc,
                anamn_sudoresedesc: req.body.anamnSudoresedesc,
                anamn_terrornoturnodesc: req.body.anamnTerrornoturnodesc,
                anamn_roncadesc: req.body.anamnRoncadesc,
                anamn_respiraoraldesc: req.body.anamnRespiraoraldesc,

                anamn_sono: req.body.anamnSono,
                anamn_sonodesc: req.body.anamnSonodesc,
                anamn_obssono: req.body.anamnObssono,
                //Aleitamento
                anamn_aleitamaterno: req.body.anamnAleitamaterno,
                anamn_tempoaleitamaterno: req.body.anamnTempoaleitamaterno,
                anamn_boasuccaoamamenta: req.body.anamnBoasuccaoamamenta,
                anamn_boasuccaoamamentadesc: req.body.anamnBoasuccaoamamentadesc,
                anamn_tempoomamadeira: req.body.anamnTempoomamadeira,
                anamn_tempoomamadeiradesc: req.body.anamnTempoomamadeiradesc,
                anamn_durefeicao: req.body.anamnDurefeicao,
                anamn_durefeicaodesc: req.body.anamnDurefeicaodesc,
                anamn_restricaoalimentar: req.body.anamnRestricaoalimentar,
                anamn_aliso: req.body.anamnAliso,
                anamn_alisodesc: req.body.anamnAlisodesc,
                anamn_utilizatalher: req.body.anamnUtilizatalher,
                anamn_utilizatalherdesc: req.body.anamnUtilizatalherdesc,
                anamn_usacopo: req.body.anamnUsacopo,
                anamn_usacopodesc: req.body.anamnUsacopodesc,
                anamn_mastiga: req.body.anamnMastiga,
                anamn_mastigadesc: req.body.anamnMastigadesc,
                anamn_alimentaseliqui: req.body.anamnAlimentaseliqui,
                anamn_alimentasepasto: req.body.anamnAlimentasepasto,
                anamn_alimentasesolido: req.body.anamnAlimentasesolido,
                anamn_alimentacom: req.body.anamnAlimentacom,
                anamn_dificuldadetipocheiro: req.body.anamnDificuldadetipocheiro,
                anamn_dificuldadetipocheiroquais: req.body.anamnDificuldadetipocheiroquais,
                anamn_comportamentorefeicao: req.body.anamnComportamentorefeicao,
                anamn_degluticaoquadroengasgo: req.body.anamnDegluticaoquadroengasgo,
                anamn_degluticaoquadroengasgodesc: req.body.anamnDegluticaoquadroengasgodesc,
                anamn_dificuldadetextura: req.body.anamnDificuldadetextura,
                anamn_dificuldadetexturadesc: req.body.anamnDificuldadetexturadesc,
                anamn_obsalimentacao: req.body.anamnObsalimentacao,
                //Controle esfincteriano!
                anamn_controlefezesdiurna: req.body.anamnControlefezesdiurna,
                anamn_controlefezesnoturna: req.body.anamnControlefezesnoturna,
                anamn_controlefezesdesc: req.body.anamnControlefezesdesc,
                anamn_controleurinadiurna: req.body.anamnControleurinadiurna,
                anamn_controleurinanoturna: req.body.anamnControleurinanoturna,
                anamn_controleurinadesc: req.body.anamnControleurinadesc,
                anamn_obsesficteriano: req.body.anamnObsesficteriano,
                //Auto cuidado e higiene
                anamn_usovaso: req.body.anamnUsovaso,
                anamn_limpaso: req.body.anamnLimpaso,
                anamn_banhoso: req.body.anamnBanhoso,
                anamn_escovaso: req.body.anamnEscovaso,
                anamn_lavamaos: req.body.anamnLavamaos,
                anamn_penteaso: req.body.anamnPenteaso,
                anamn_despesvestese: req.body.anamnDespesvestese,
                anamn_vestese: req.body.anamnVestese,
                anamn_calcar: req.body.anamnCalcar,
                anamn_deixacortarcabelo: req.body.anamnDeixacortarcabelo,
                anamn_abotoaso: req.body.anamnAbotoaso,
                anamn_lacarso: req.body.anamnLacarso,
                anamn_deixacortarunhas: req.body.anamnDeixacortarunhas,
                anamn_obsvestirhigi: req.body.anamnObsvestirhigi,
                //Visão
                anamn_problemavisao: req.body.anamnProblemavisao,
                anamn_problemavisaodesc: req.body.anamnProblemavisaodesc,
                anamn_olhaobjetivoatividade: req.body.anamnOlhaobjetivoatividade,
                anamn_olhaobjetivoatividadedesc: req.body.anamnOlhaobjetivoatividadedesc,
                anamn_usaoculos: req.body.anamnUsaoculos,
                anamn_usaoculosmotivo: req.body.anamnUsaoculosmotivo,
                anamn_usaoculosquando: req.body.anamnUsaoculosquando,
                anamn_prefereambienteescuro: req.body.anamnPrefereambienteescuro,
                anamn_imcomodamuitaluzcor: req.body.anamnImcomodamuitaluzcor,
                anamn_fazconatatovisual: req.body.anamnFazconatatovisual,
                anamn_permanececontatovisual: req.body.anamnPermanececontatovisual,
                anamn_obsvisao: req.body.anamnObsvisao,
                //Audição
                anamn_duvidacapaccitaauditiva: req.body.anamnDuvidacapaccitaauditiva,
                anamn_duvidacapaccitaauditivadesc: req.body.anamnDuvidacapaccitaauditivadesc,
                anamn_jaexpostoruidoexplosao: req.body.anamnJaexpostoruidoexplosao,
                anamn_jaexpostoruidoexplosaodesc: req.body.anamnJaexpostoruidoexplosaodesc,
                
                anamn_voz: req.body.anamnVoz,
                anamn_audiometria: req.body.anamnAudiometria,
                anamn_localizasons: req.body.anamnLocalizasons,
                anamn_tampaouvidosruido: req.body.anamnTampaouvidosruido,
                anamn_aproximaruidos: req.body.anamnAproximaruidos,
                anamn_asustafacil: req.body.anamnAsustafacil,

                anamn_vozdesc: req.body.anamnVozdesc,
                anamn_audiometriadesc: req.body.anamnAudiometriadesc,
                anamn_localizasonsdesc: req.body.anamnLocalizasonsdesc,
                anamn_tampaouvidosruidodesc: req.body.anamnTampaouvidosruidodesc,
                anamn_aproximaruidosdesc: req.body.anamnAproximaruidosdesc,
                anamn_asustafacildesc: req.body.anamnAsustafacildesc,

                anamn_seicomodapessoasfalando: req.body.anamnSeicomodapessoasfalando,
                anamn_seicomodapessoasfalandodesc: req.body.anamnSeicomodapessoasfalandodesc,
                anamn_escutachamado: req.body.anamnEscutachamado,
                anamn_escutachamadodesc: req.body.anamnEscutachamadodesc,
                anamn_obsaudicao: req.body.anamnObsaudicao,
                //Desenvolvimento Psicomotor
                anamn_controlacabeca: req.body.anamnControlacabeca,
                anamn_rolou: req.body.anamnRolou,
                anamn_engatinhou: req.body.anamnEngatinhou,
                anamn_usouandaja: req.body.anamnUsouandaja,
                anamn_andou: req.body.anamnAndou,
                anamn_andoudesc: req.body.anamnAndoudesc,
                anamn_usaescada: req.body.anamnUsaescada,
                anamn_pulacorre: req.body.anamnPulacorre,
                anamn_andapontadope: req.body.anamnAndapontadope,
                anamn_medotirarpesdochao: req.body.anamnMedotirarpesdochao,
                anamn_medotirarpesdochaodesc: req.body.anamnMedotirarpesdochaodesc,
                anamn_desastrado: req.body.anamnDesastrado,
                anamn_seescondeembaixoobj: req.body.anamnSeescondeembaixoobj,
                anamn_escalasobeobj: req.body.anamnEscalasobeobj,
                anamn_mostramedoexp: req.body.anamnMostramedoexp,
                anamn_mostramedoexpdesc: req.body.anamnMostramedoexpdesc,
                anamn_evitanovasposicoes: req.body.anamnEvitanovasposicoes,
                anamn_evitanovasposicoesdesc: req.body.anamnEvitanovasposicoesdesc,
                anamn_reacaoemotivaexessi: req.body.anamnReacaoemotivaexessi,
                anamn_reacaoemotivaexessidesc: req.body.anamnReacaoemotivaexessidesc,
                anamn_movisecuidado: req.body.anamnMovisecuidado,
                anamn_movisecuidadodesc: req.body.anamnMovisecuidadodesc,
                anamn_temexpnegativamov: req.body.anamnTemexpnegativamov,
                anamn_temexpnegativamovdesc: req.body.anamnTemexpnegativamovdesc,
                anamn_obspsicomotor: req.body.anamnObspsicomotor,
                //Desenvolvimento Tatil
                anamn_recusapisargrama: req.body.anamnRecusapisargrama,
                anamn_recusapisarmolhado: req.body.anamnRecusapisarmolhado,
                anamn_recusaareia: req.body.anamnRecusaareia,
                anamn_recusatinta: req.body.anamnRecusatinta,
                anamn_recusaplastilina: req.body.anamnRecusaplastilina,
                anamn_recusaamoeba: req.body.anamnRecusaamoeba,
                anamn_evitatoqueleve: req.body.anamnEvitatoqueleve,
                anamn_aceitaabreco: req.body.anamnAceitaabreco,
                anamn_aceitaabrecodesc: req.body.anamnAceitaabrecodesc,
                anamn_tocapessoasobjconsta: req.body.anamnTocapessoasobjconsta,
                anamn_batecaisemnocao: req.body.anamnBatecaisemnocao,
                anamn_seguraobj: req.body.anamnSeguraobj,
                anamn_buscaatvpuxaremp: req.body.anamnBuscaatvpuxaremp,
                anamn_mastigaobjroupa: req.body.anamnMastigaobjroupa,
                anamn_tocapessoasobjconstadesc: req.body.anamnTocapessoasobjconstadesc,
                anamn_batecaisemnocaodesc: req.body.anamnBatecaisemnocaodesc,
                anamn_seguraobjdesc: req.body.anamnSeguraobjdesc,
                anamn_buscaatvpuxarempdesc: req.body.anamnBuscaatvpuxarempdesc,
                anamn_mastigaobjroupadesc: req.body.anamnMastigaobjroupadesc,
                anamn_obstatil: req.body.anamnObstatil,
                //Sociabilidade
                anamn_preferebrincarcom: req.body.anamnPreferebrincarcom,
                anamn_preferebrincaridade: req.body.anamnPreferebrincaridade,
                anamn_preferebrincarcomdesc: req.body.anamnPreferebrincarcomdesc,

                anamn_fazamigosfacil: req.body.anamnFazamigosfacil,
                anamn_emprestabrinquedos: req.body.anamnEmprestabrinquedos,
                anamn_brincacooperado: req.body.anamnBrincacooperado,
                anamn_gostamandar: req.body.anamnGostamandar,
                anamn_gostasubmeter: req.body.anamnGostasubmeter,

                anamn_fazamigosfacildesc: req.body.anamnFazamigosfacildesc,
                anamn_emprestabrinquedosdesc: req.body.anamnEmprestabrinquedosdesc,
                anamn_brincacooperadodesc: req.body.anamnBrincacooperadodesc,
                anamn_gostamandardesc: req.body.anamnGostamandardesc,
                anamn_gostasubmeterdesc: req.body.anamnGostasubmeterdesc,

                anamn_gostamusica: req.body.anamnGostamusica,
                anamn_gostamusicaquais: req.body.anamnGostamusicaquais,

                anamn_socializapares: req.body.anamnSocializapares,
                anamn_brincaparque: req.body.anamnBrincaparque,
                anamn_brincarfuncional: req.body.anamnBrincarfuncional,
                anamn_criabrincadeiras: req.body.anamnCriabrincadeiras,
                anamn_recusaengajardemanda: req.body.anamnRecusaengajardemanda,

                anamn_socializaparesdesc: req.body.anamnSocializaparesdesc,
                anamn_brincaparquedesc: req.body.anamnBrincaparquedesc,
                anamn_brincarfuncionaldesc: req.body.anamnBrincarfuncionaldesc,
                anamn_criabrincadeirasdesc: req.body.anamnCriabrincadeirasdesc,
                anamn_recusaengajardemandadesc: req.body.anamnRecusaengajardemandadesc,

                anamn_brinquedopreferidosquais: req.body.anamnBrinquedopreferidosquais,
                anamn_obssocial: req.body.anamnObssocial,
                //Escolaridade
                anamn_escola: req.body.anamnEscola,
                anamn_tempo: req.body.anamnTempo,
                anamn_turno: req.body.anamnTurno,
                anamn_serie: req.body.anamnSerie,
                anamn_escolaanterior: req.body.anamnEscolaanterior,
                anamn_paisestudamcomcrianca: req.body.anamnPaisestudamcomcrianca,
                anamn_localadequadoestudo: req.body.anamnLocaladequadoestudo,
                anamn_executatarefascaseiras: req.body.anamnExecutatarefascaseiras,
                anamn_temautonomiaestuda: req.body.anamnTemautonomiaestuda,
                anamn_necessitaorienta: req.body.anamnNecessitaorienta,
                anamn_usamuitaborracha: req.body.anamnUsamuitaborracha,
                anamn_rendimentoescolarbaixo: req.body.anamnRendimentoescolarbaixo,
                anamn_reprovado: req.body.anamnReprovado,
                anamn_pulouserie: req.body.anamnPulouserie,
                anamn_pulouseriedesc: req.body.anamnPulouseriedesc,
                anamn_idadealfa: req.body.anamnIdadealfa,
                anamn_comofoialfabet: req.body.anamnComofoialfabet,
                anamn_dificuldadeescolar: req.body.anamnDificuldadeescolar,
                anamn_dificuldademateriaquais: req.body.anamnDificuldademateriaquais,
                anamn_ler: req.body.anamnLer,
                anamn_lerobs: req.body.anamnLerobs,
                anamn_escreve: req.body.anamnEscreve,
                anamn_escreveobs: req.body.anamnEscreveobs,
                anamn_motrici: req.body.anamnMotrici,
                anamn_motriciobs: req.body.anamnMotriciobs,
                anamn_contar: req.body.anamnContar,
                anamn_contarobs: req.body.anamnContarobs,
                anamn_calcular: req.body.anamnCalcular,
                anamn_calcularobs: req.body.anamnCalcularobs,
                anamn_atencao: req.body.anamnAtencao,
                anamn_atencaoobs: req.body.anamnAtencaoobs,
                anamn_profparticular: req.body.anamnProfparticular,
                anamn_profparticularnome: req.body.anamnProfparticularnome,
                anamn_ativiextra: req.body.anamnAtiviextra,
                anamn_ativiextrahorario: req.body.anamnAtiviextrahorario,
                anamn_obsescola: req.body.anamnObsescola,
                //Rotinas
                anamn_rotanadiasemanal: req.body.anamnRotanadiasemanal,
                anamn_anotaextra: req.body.anamnAnotaextra,
                anamn_dataanamnese: req.body.anamnDataanamnese,
                //anamn_datacad: req.body.anamnDatacad, //Somente leitura
                anamn_dataedi: dataAtual,
                //anamn_usuidcad: req.body.anamnUsuidcad, //Somente leitura
                anamn_usuidedi: idUsu,
                anamn_terapeutaid: req.body.anamnTerapeutaid
                
                }}
                ).then((res) =>{
                    console.log("Salvo")
                    resultado = true;
                }).catch((err) =>{
                    console.log("erro mongo:")
                    console.log(err)
                    resultado = err;
                })
                return resultado;
            
    },
    anamnAdicionar: async (req,res) => {
        //Validar se a Anamnese existe
        console.log("anamnmodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newAnamn = new AnamnModel({
            anamn_id: req.body.anamnId,
            anamn_beneid: req.body.anamnBeneid,
            anamn_benenome: req.body.anamnBenenome,
            anamn_beneapelido: req.body.anamnBeneapelido,
            anamn_benedatanasc: req.body.anamnBenedatanasc+"T00:00:00.000Z",
            anamn_beneidade: req.body.anamnBeneidade,
            anamn_painome: req.body.anamnPainome,
            anamn_maenome: req.body.anamnMaenome,
            anamn_respnome: req.body.anamnRespnome,
            anamn_indica: req.body.anamnIndica,
            anamn_queixapri: req.body.anamnQueixapri,
            anamn_diag: req.body.anamnDiag,
            anamn_houvetratengrav: req.body.anamnHouvetratengrav,
            anamn_houvetratengravdesc: req.body.anamnHouvetratengravdesc,
            anamn_houveplanfami: req.body.anamnHouveplanfami,
            anamn_houveplanfamidesc: req.body.anamnHouveplanfamidesc,
            anamn_ameacatenaborto: req.body.anamnAmeacatenaborto,
            anamn_ameacatenabortodesc: req.body.anamnAmeacatenabortodesc,
            anamn_bebeoufumagesta: req.body.anamnBebeoufumagesta,
            anamn_bebeoufumagestadesc: req.body.anamnBebeoufumagestadesc,
            anamn_traumafispsiinfec: req.body.anamnTraumafispsiinfec,
            anamn_traumafispsiinfecdesc: req.body.anamnTraumafispsiinfecdesc,
            anamn_usotranquil: req.body.anamnUsotranquil,
            anamn_usotranquildesc: req.body.anamnUsotranquildesc,
            anamn_adocao: req.body.anamnAdocao,
            anamn_obsgesta: req.body.anamnObsgesta,
            //Parto
            anamn_partoqual: req.body.anamnPartoqual,
            anamn_partoqualdesc: req.body.anamnPartoqualdesc,
            anamn_tempogestacional: req.body.anamnTempogestacional,
            anamn_tempogestacionaldesc: req.body.anamnTempogestacionaldesc,
            anamn_anorexiaperiparto: req.body.anamnAnorexiaperiparto,
            anamn_anorexiaperipartodesc: req.body.anamnAnorexiaperipartodesc,
            anamn_apgar: req.body.anamnApgar,
            //inclusao: req.body.anamnUsao,
            anamn_apgargrau: req.body.anamnApgargrau,
            anamn_apgardesc: req.body.anamnApgardesc,
            anamn_chorounasc: req.body.anamnChorounasc,
            anamn_chorounascdesc: req.body.anamnChorounascdesc,
            anamn_ictericia: req.body.anamnIctericia,
            anamn_ictericiadesc: req.body.anamnIctericiadesc,
            anamn_fototerapia: req.body.anamnFototerapia,
            anamn_fototerapiadesc: req.body.anamnFototerapiadesc,
            anamn_uti: req.body.anamnUti,
            anamn_utitempo: req.body.anamnUtitempo,
            anamn_complica: req.body.anamnComplica,
            anamn_complicadesc: req.body.anamnComplicadesc,
            anamn_paipresentenasc: req.body.anamnPaipresentenasc,
            anamn_paipresentenascdesc: req.body.anamnPaipresentenascdesc,
            anamn_descrparto: req.body.anamnDescrparto,
            anamn_reacbebe: req.body.anamnReacbebe,
            anamn_obsparto: req.body.anamnObsparto,
            //Parto
            anamn_pessmoracasa: req.body.anamnPessmoracasa,
            anamn_irmaosmoracasa: req.body.anamnIrmaosmoracasa,
            anamn_irmaospartemae: req.body.anamnIrmaospartemae,
            anamn_irmaospartpai: req.body.anamnIrmaospartpai,
            anamn_maetrab: req.body.anamnMaetrab,
            anamn_maetrabquemfica: req.body.anamnMaetrabquemfica,
            anamn_obsfami: req.body.anamnObsfami,
            //Ambiente familiar
            anamn_paisvivemjuntosbem: req.body.anamnPaisvivemjuntosbem,
            anamn_paisvivemjuntosbemdesc: req.body.anamnPaisvivemjuntosbemdesc,
            anamn_discussoesfreq: req.body.anamnDiscussoesfreq,
            anamn_discussoesfreqdesc: req.body.anamnDiscussoesfreqdesc,
            anamn_comofoisepara: req.body.anamnComofoisepara,
            anamn_reacaocrianca: req.body.anamnReacaocrianca,
            anamn_quemcedefacil: req.body.anamnQuemcedefacil,
            anamn_quemcedefacildesc: req.body.anamnQuemcedefacildesc,
            anamn_criancatratdif: req.body.anamnCriancatratdif,
            anamn_criancatratdifcomo: req.body.anamnCriancatratdifcomo,
            anamn_relacirmaos: req.body.anamnRelacirmaos,
            anamn_ambientefami: req.body.anamnAmbientefami,
            anamn_obsfamiambiente: req.body.anamnObsfamiambiente,
            //Religião
            anamn_haeducarelig: req.body.anamnHaeducarelig,
            anamn_haeducareligqual: req.body.anamnHaeducareligqual,
            anamn_devpreccumpr: req.body.anamnDevpreccumpr,
            anamn_devpreccumprdesc: req.body.anamnDevpreccumprdesc,
            anamn_obsreligiao: req.body.anamnObsreligiao,
            //Enfermidades
            anamn_sarampo: req.body.anamnSarampo,
            anamn_catapora: req.body.anamnCatapora,
            anamn_caxumba: req.body.anamnCaxumba,
            anamn_rubeola: req.body.anamnRubeola,
            anamn_cpqueluche: req.body.anamnCpqueluche,
            anamn_meningite: req.body.anamnMeningite,
            anamn_complicavacina: req.body.anamnComplicavacina,
            anamn_dengue: req.body.anamnDengue,
            anamn_zica: req.body.anamnZica,
            anamn_chikun: req.body.anamnChikun,
            anamn_covid: req.body.anamnCovid,
            anamn_tce: req.body.anamnTce,
            anamn_obssaude: req.body.anamnObssaude,
            anamn_zoonoses: req.body.anamnZoonoses,
            anamn_otite: req.body.anamnOtite,
            anamn_adenoide: req.body.anamnAdenoide,
            anamn_amigdalites: req.body.anamnAmigdalites,
            anamn_alergias: req.body.anamnAlergias,
            anamn_acidentes: req.body.anamnAcidentes,
            anamn_convulsoes: req.body.anamnConvulsoes,
            anamn_internacoes: req.body.anamnInternacoes,
            anamn_cirurgia: req.body.anamnCirurgia,
            //Enfermidades
            anamn_avaliacaoneuro: req.body.anamnAvaliacaoneuro,
            anamn_avaliacaoneurodesc: req.body.anamnAvaliacaoneurodesc,
            anamn_avaliacaoneurotel: req.body.anamnAvaliacaoneurotel,
            anamn_avaliacaopsico: req.body.anamnAvaliacaopsico,
            anamn_avaliacaopsicodesc: req.body.anamnAvaliacaopsicodesc,
            anamn_avaliacaopsicotel: req.body.anamnAvaliacaopsicotel,
            anamn_quem: req.body.anamnQuem,
            anamn_contatotel: req.body.anamnContatotel,
            anamn_examesrealiza: req.body.anamnExamesrealiza,
            anamn_medicacaoquais: req.body.anamnMedicacaoquais,
            anamn_quandodiag: req.body.anamnQuandodiag,
            anamn_antecfamidesc: req.body.anamnAntecfamidesc,
            //Enfermidades, antecedente familiar 
            anamn_nervoso: req.body.anamnNervoso,
            anamn_deficiente: req.body.anamnDeficiente,
            anamn_viciado: req.body.anamnViciado,
            anamn_ataques: req.body.anamnAtaques,
            anamn_dislexia: req.body.anamnDislexia,
            anamn_TDAH: req.body.anamnTdah,
            anamn_nervosodesc: req.body.anamnNervosodesc,
            anamn_deficientedesc: req.body.anamnDeficientedesc,
            anamn_viciadodesc: req.body.anamnViciadodesc,
            anamn_ataquesdesc: req.body.anamnAtaquesdesc,
            anamn_tdahdesc: req.body.anamnTdahdesc,
            anamn_esquizofrenia: req.body.anamnEsquizofrenia,
            anamn_esquizofreniadesc: req.body.anamnEsquizofreniadesc,
            anamn_outros: req.body.anamnOutros,
            anamn_outrosdesc: req.body.anamnOutrosdesc,
            anamn_obssaude2: req.body.anamnObssaude2,
            //Linguagem
            anamn_pripalavrasidade: req.body.anamnPripalavrasidade,
            anamn_limguagemcompre: req.body.anamnLimguagemcompre,
            anamn_inicioufalaparou: req.body.anamnInicioufalaparou,
            anamn_inicioufalaparoudesc: req.body.anamnInicioufalaparoudesc,
            anamn_gdiscluverbalgagueira: req.body.anamnGdiscluverbalgagueira,
            anamn_dislalia: req.body.anamnDislalia,
            anamn_dislaliaqual: req.body.anamnDislaliaqual,
            anamn_falavocal: req.body.anamnFalavocal,
            anamn_compreendeordem: req.body.anamnCompreendeordem,
            anamn_cumpreordens: req.body.anamnCumpreordens,
            anamn_ecolaliaimediata: req.body.anamnEcolaliaimediata,
            anamn_ecolaliatardia: req.body.anamnEcolaliatardia,
            anamn_aponta: req.body.anamnAponta,
            anamn_pede: req.body.anamnPede,
            anamn_nomeiadescenas: req.body.anamnNomeiadescenas,
            anamn_pergunta: req.body.anamnPergunta,
            anamn_respondepergunta: req.body.anamnRespondepergunta,
            anamn_solicitabrincar: req.body.anamnSolicitabrincar,
            anamn_solicitairbanheiro: req.body.anamnSolicitairbanheiro,
            anamn_solicitabeber: req.body.anamnSolicitabeber,
            anamn_solicitacomer: req.body.anamnSolicitacomer,
            anamn_rouco: req.body.anamnRouco,
            anamn_realizasombocainativ: req.body.anamnRealizasombocainativ,
            anamn_realizasombocaativ: req.body.anamnRealizasombocaativ,
            anamn_falavocaldesc: req.body.anamnFalavocaldesc,
            anamn_compreendeordemdesc: req.body.anamnCompreendeordemdesc,
            anamn_cumpreordensdesc: req.body.anamnCumpreordensdesc,
            anamn_ecolaliaimediatadesc: req.body.anamnEcolaliaimediatadesc,
            anamn_ecolaliatardiadesc: req.body.anamnEcolaliatardiadesc,
            anamn_apontadesc: req.body.anamnApontadesc,
            anamn_pededesc: req.body.anamnPededesc,
            anamn_nomeiadescenasdesc: req.body.anamnNomeiadescenasdesc,
            anamn_perguntadesc: req.body.anamnPerguntadesc,
            anamn_respondeperguntadesc: req.body.anamnRespondeperguntadesc,
            anamn_solicitabrincardesc: req.body.anamnSolicitabrincardesc,
            anamn_solicitairbanheirodesc: req.body.anamnSolicitairbanheirodesc,
            anamn_solicitabeberdesc: req.body.anamnSolicitabeberdesc,
            anamn_solicitacomerdesc: req.body.anamnSolicitacomerdesc,
            anamn_roucodesc: req.body.anamnRoucodesc,
            anamn_realizasombocainativdesc: req.body.anamnRealizasombocainativdesc,
            anamn_realizasombocaativdesc: req.body.anamnRealizasombocaativdesc,
            anamn_frasequantaspalavras: req.body.anamnFrasequantaspalavras,
            anamn_obslibguagem: req.body.anamnObslibguagem,
            //Sexualidade
            anamn_curiosidadesex: req.body.anamnCuriosidadesex,
            anamn_curiosidadesexdesc: req.body.anamnCuriosidadesexdesc,
            anamn_masturbase: req.body.anamnMasturbase,
            anamn_masturbasedesc: req.body.anamnMasturbasedesc,
            anamn_percebedifsex: req.body.anamnPercebedifsex,
            anamn_percebedifsexdesc: req.body.anamnPercebedifsexdesc,
            anamn_obssex: req.body.anamnObssex,
            //Rel emocionais
            anamn_comoreaproibi: req.body.anamnComoreaproibi,
            anamn_comoreafrustra: req.body.anamnComoreafrustra,
            anamn_comoreacastig: req.body.anamnComoreacastig,
            anamn_comoreanovasituacao: req.body.anamnComoreanovasituacao,
            anamn_agressivocomquem: req.body.anamnAgressivocomquem,
            anamn_defendeseagressao: req.body.anamnDefendeseagressao,
            anamn_defendeseagressaocomo: req.body.anamnDefendeseagressaocomo,
            anamn_autolesivo: req.body.anamnAutolesivo,
            anamn_autolesivodesc: req.body.anamnAutolesivodesc,
            anamn_agressivo: req.body.anamnAgressivo,
            anamn_agressivodesc: req.body.anamnAgressivodesc,            
            anamn_dependente: req.body.anamnDependente,
            anamn_dependentedesc: req.body.anamnDependentedesc,
            anamn_carinho: req.body.anamnCarinho,
            anamn_carinhodesc: req.body.anamnCarinhodesc,
            anamn_autoritario: req.body.anamnAutoritario,
            anamn_autoritariodesc: req.body.anamnAutoritariodesc,
            anamn_malcriado: req.body.anamnMalcriado,
            anamn_malcriadodesc: req.body.anamnMalcriadodesc,
            anamn_exibicionista: req.body.anamnExibicionista,
            anamn_exibicionistadesc: req.body.anamnExibicionistadesc,
            anamn_ansioso: req.body.anamnAnsioso,
            anamn_ansiosodesc: req.body.anamnAnsiosodesc,
            anamn_calado: req.body.anamnCalado,
            anamn_caladodesc: req.body.anamnCaladodesc,
            anamn_falante: req.body.anamnFalante,
            anamn_falantedesc: req.body.anamnFalantedesc,
            anamn_esteriotipiasquandoocorre: req.body.anamnEsteriotipiasquandoocorre,
            anamn_obscomportamento: req.body.anamnObscomportamento,
            //Manipulações e Tiques
            anamn_chupeta: req.body.anamnChupeta,
            anamn_chupetatempo: req.body.anamnChupetatempo,
            anamn_dedo: req.body.anamnDedo,
            anamn_dedotempo: req.body.anamnDedotempo,
            anamn_roeuouroiunhas: req.body.anamnRoeuouroiunhas,
            anamn_roeuouroiunhastempo: req.body.anamnRoeuouroiunhastempo,
            anamn_puxaorelhascabelo: req.body.anamnPuxaorelhascabelo,
            anamn_puxaorelhascabelotempo: req.body.anamnPuxaorelhascabelotempo,
            anamn_mordelabios: req.body.anamnMordelabios,
            anamn_mordelabiostempo: req.body.anamnMordelabiostempo,
            anamn_batepes: req.body.anamnBatepes,
            anamn_batepestempo: req.body.anamnBatepestempo,
            anamn_batecabeca: req.body.anamnBatecabeca,
            anamn_batecabecadesc: req.body.anamnBatecabecadesc,
            anamn_temmedos: req.body.anamnTemmedos,
            anamn_temmedosdesc: req.body.anamnTemmedosdesc,
            anamn_mentejamentiu: req.body.anamnMentejamentiu,
            anamn_mentejamentiudesc: req.body.anamnMentejamentiudesc,
            anamn_atiraobjetos: req.body.anamnAtiraobjetos,
            anamn_atiraobjetosdesc: req.body.anamnAtiraobjetosdesc,
            anamn_desligase: req.body.anamnDesligase,
            anamn_desligasetempo: req.body.anamnDesligasetempo,
            anamn_objetonuncalarga: req.body.anamnObjetonuncalarga,
            anamn_objetonuncalargaqual: req.body.anamnObjetonuncalargaqual,
            anamn_tique: req.body.anamnTique,
            anamn_tiquedesc: req.body.anamnTiquedesc,
            anamn_repeteacao: req.body.anamnRepeteacao,
            anamn_repeteacaoqual: req.body.anamnRepeteacaoqual,
            anamn_obstiques: req.body.anamnObstiques,
            //sono
            anamn_dormecomquem: req.body.anamnDormecomquem,
            anamn_vaissozinhocama: req.body.anamnVaissozinhocama,
            anamn_vaissozinhocamadesc: req.body.anamnVaissozinhocamadesc,
            anamn_dromequantotempo: req.body.anamnDromequantotempo,
            anamn_vaiparacamapais: req.body.anamnVaiparacamapais,
            anamn_vaiparacamapaisdesc: req.body.anamnVaiparacamapaisdesc,
            
            anamn_choranoite: req.body.anamnChoranoite,
            anamn_falanoite: req.body.anamnFalanoite,
            anamn_gritanoite: req.body.anamnGritanoite,
            anamn_rangedenteanoite: req.body.anamnRangedenteanoite,
            anamn_insonianoite: req.body.anamnInsonianoite,
            anamn_babanoite: req.body.anamnBabanoite,
            anamn_pesadelo: req.body.anamnPesadelo,
            anamn_sudorese: req.body.anamnSudorese,
            anamn_terrornoturno: req.body.anamnTerrornoturno,
            anamn_ronca: req.body.anamnRouco,
            anamn_respiraoral: req.body.anamnRespiraoral,
            anamn_proximoolhos: req.body.anamnProximoolhos,
            anamn_proximoolhosdesc: req.body.anamnProximoolhosdesc,
            anamn_choranoitedesc: req.body.anamnChoranoitedesc,
            anamn_falanoitedesc: req.body.anamnFalanoitedesc,
            anamn_gritanoitedesc: req.body.anamnGritanoitedesc,
            anamn_rangedenteanoitedesc: req.body.anamnRangedenteanoitedesc,
            anamn_insonianoitedesc: req.body.anamnInsonianoitedesc,
            anamn_babanoitedesc: req.body.anamnBabanoitedesc,
            anamn_pesadelodesc: req.body.anamnPesadelodesc,
            anamn_sudoresedesc: req.body.anamnSudoresedesc,
            anamn_terrornoturnodesc: req.body.anamnTerrornoturnodesc,
            anamn_roncadesc: req.body.anamnRoncadesc,
            anamn_respiraoraldesc: req.body.anamnRespiraoraldesc,

            anamn_sono: req.body.anamnSono,
            anamn_sonodesc: req.body.anamnSonodesc,
            anamn_obssono: req.body.anamnObssono,
            //Aleitamento
            anamn_aleitamaterno: req.body.anamnAleitamaterno,
            anamn_tempoaleitamaterno: req.body.anamnTempoaleitamaterno,
            anamn_boasuccaoamamenta: req.body.anamnBoasuccaoamamenta,
            anamn_boasuccaoamamentadesc: req.body.anamnBoasuccaoamamentadesc,
            anamn_tempoomamadeira: req.body.anamnTempoomamadeira,
            anamn_tempoomamadeiradesc: req.body.anamnTempoomamadeiradesc,
            anamn_durefeicao: req.body.anamnDurefeicao,
            anamn_durefeicaodesc: req.body.anamnDurefeicaodesc,
            anamn_restricaoalimentar: req.body.anamnRestricaoalimentar,
            anamn_aliso: req.body.anamnAliso,
            anamn_alisodesc: req.body.anamnAlisodesc,
            anamn_utilizatalher: req.body.anamnUtilizatalher,
            anamn_utilizatalherdesc: req.body.anamnUtilizatalherdesc,
            anamn_usacopo: req.body.anamnUsacopo,
            anamn_usacopodesc: req.body.anamnUsacopodesc,
            anamn_mastiga: req.body.anamnMastiga,
            anamn_mastigadesc: req.body.anamnMastigadesc,
            anamn_alimentaseliqui: req.body.anamnAlimentaseliqui,
            anamn_alimentasepasto: req.body.anamnAlimentasepasto,
            anamn_alimentasesolido: req.body.anamnAlimentasesolido,
            anamn_alimentacom: req.body.anamnAlimentacom,
            anamn_dificuldadetipocheiro: req.body.anamnDificuldadetipocheiro,
            anamn_dificuldadetipocheiroquais: req.body.anamnDificuldadetipocheiroquais,
            anamn_comportamentorefeicao: req.body.anamnComportamentorefeicao,
            anamn_degluticaoquadroengasgo: req.body.anamnDegluticaoquadroengasgo,
            anamn_degluticaoquadroengasgodesc: req.body.anamnDegluticaoquadroengasgodesc,
            anamn_dificuldadetextura: req.body.anamnDificuldadetextura,
            anamn_dificuldadetexturadesc: req.body.anamnDificuldadetexturadesc,
            anamn_obsalimentacao: req.body.anamnObsalimentacao,
            //Controle esfincteriano!
            anamn_controlefezesdiurna: req.body.anamnControlefezesdiurna,
            anamn_controlefezesnoturna: req.body.anamnControlefezesnoturna,
            anamn_controlefezesdesc: req.body.anamnControlefezesdesc,
            anamn_controleurinadiurna: req.body.anamnControleurinadiurna,
            anamn_controleurinanoturna: req.body.anamnControleurinanoturna,
            anamn_controleurinadesc: req.body.anamnControleurinadesc,
            anamn_obsesficteriano: req.body.anamnObsesficteriano,
            //Auto cuidado e higiene
            anamn_usovaso: req.body.anamnUsovaso,
            anamn_limpaso: req.body.anamnLimpaso,
            anamn_banhoso: req.body.anamnBanhoso,
            anamn_escovaso: req.body.anamnEscovaso,
            anamn_lavamaos: req.body.anamnLavamaos,
            anamn_penteaso: req.body.anamnPenteaso,
            anamn_despesvestese: req.body.anamnDespesvestese,
            anamn_vestese: req.body.anamnVestese,
            anamn_calcar: req.body.anamnCalcar,
            anamn_deixacortarcabelo: req.body.anamnDeixacortarcabelo,
            anamn_abotoaso: req.body.anamnAbotoaso,
            anamn_lacarso: req.body.anamnLacarso,
            anamn_deixacortarunhas: req.body.anamnDeixacortarunhas,
            anamn_obsvestirhigi: req.body.anamnObsvestirhigi,
            //Visão
            anamn_problemavisao: req.body.anamnProblemavisao,
            anamn_problemavisaodesc: req.body.anamnProblemavisaodesc,
            anamn_olhaobjetivoatividade: req.body.anamnOlhaobjetivoatividade,
            anamn_olhaobjetivoatividadedesc: req.body.anamnOlhaobjetivoatividadedesc,
            anamn_usaoculos: req.body.anamnUsaoculos,
            anamn_usaoculosmotivo: req.body.anamnUsaoculosmotivo,
            anamn_usaoculosquando: req.body.anamnUsaoculosquando,
            anamn_prefereambienteescuro: req.body.anamnPrefereambienteescuro,
            anamn_imcomodamuitaluzcor: req.body.anamnImcomodamuitaluzcor,
            anamn_fazconatatovisual: req.body.anamnFazconatatovisual,
            anamn_permanececontatovisual: req.body.anamnPermanececontatovisual,
            anamn_obsvisao: req.body.anamnObsvisao,
            //Audição
            anamn_duvidacapaccitaauditiva: req.body.anamnDuvidacapaccitaauditiva,
            anamn_duvidacapaccitaauditivadesc: req.body.anamnDuvidacapaccitaauditivadesc,
            anamn_jaexpostoruidoexplosao: req.body.anamnJaexpostoruidoexplosao,
            anamn_jaexpostoruidoexplosaodesc: req.body.anamnJaexpostoruidoexplosaodesc,
            
            anamn_voz: req.body.anamnVoz,
            anamn_audiometria: req.body.anamnAudiometria,
            anamn_localizasons: req.body.anamnLocalizasons,
            anamn_tampaouvidosruido: req.body.anamnTampaouvidosruido,
            anamn_aproximaruidos: req.body.anamnAproximaruidos,
            anamn_asustafacil: req.body.anamnAsustafacil,
            
            anamn_vozdesc: req.body.anamnVozdesc,
            anamn_audiometriadesc: req.body.anamnAudiometriadesc,
            anamn_localizasonsdesc: req.body.anamnLocalizasonsdesc,
            anamn_tampaouvidosruidodesc: req.body.anamnTampaouvidosruidodesc,
            anamn_aproximaruidosdesc: req.body.anamnAproximaruidosdesc,
            anamn_asustafacildesc: req.body.anamnAsustafacildesc,

            anamn_seicomodapessoasfalando: req.body.anamnSeicomodapessoasfalando,
            anamn_seicomodapessoasfalandodesc: req.body.anamnSeicomodapessoasfalandodesc,
            anamn_escutachamado: req.body.anamnEscutachamado,
            anamn_escutachamadodesc: req.body.anamnEscutachamadodesc,
            anamn_obsaudicao: req.body.anamnObsaudicao,
            //Desenvolvimento Psicomotor
            anamn_controlacabeca: req.body.anamnControlacabeca,
            anamn_rolou: req.body.anamnRolou,
            anamn_engatinhou: req.body.anamnEngatinhou,
            anamn_usouandaja: req.body.anamnUsouandaja,
            anamn_andou: req.body.anamnAndou,
            anamn_andoudesc: req.body.anamnAndoudesc,
            anamn_usaescada: req.body.anamnUsaescada,
            anamn_pulacorre: req.body.anamnPulacorre,
            anamn_andapontadope: req.body.anamnAndapontadope,
            anamn_medotirarpesdochao: req.body.anamnMedotirarpesdochao,
            anamn_medotirarpesdochaodesc: req.body.anamnMedotirarpesdochaodesc,
            anamn_desastrado: req.body.anamnDesastrado,
            anamn_seescondeembaixoobj: req.body.anamnSeescondeembaixoobj,
            anamn_escalasobeobj: req.body.anamnEscalasobeobj,
            anamn_mostramedoexp: req.body.anamnMostramedoexp,
            anamn_mostramedoexpdesc: req.body.anamnMostramedoexpdesc,
            anamn_evitanovasposicoes: req.body.anamnEvitanovasposicoes,
            anamn_evitanovasposicoesdesc: req.body.anamnEvitanovasposicoesdesc,
            anamn_reacaoemotivaexessi: req.body.anamnReacaoemotivaexessi,
            anamn_reacaoemotivaexessidesc: req.body.anamnReacaoemotivaexessidesc,
            anamn_movisecuidado: req.body.anamnMovisecuidado,
            anamn_movisecuidadodesc: req.body.anamnMovisecuidadodesc,
            anamn_temexpnegativamov: req.body.anamnTemexpnegativamov,
            anamn_temexpnegativamovdesc: req.body.anamnTemexpnegativamovdesc,
            anamn_obspsicomotor: req.body.anamnObspsicomotor,
            //Desenvolvimento Tatil
            anamn_recusapisargrama: req.body.anamnRecusapisargrama,
            anamn_recusapisarmolhado: req.body.anamnRecusapisarmolhado,
            anamn_recusaareia: req.body.anamnRecusaareia,
            anamn_recusatinta: req.body.anamnRecusatinta,
            anamn_recusaplastilina: req.body.anamnRecusaplastilina,
            anamn_recusaamoeba: req.body.anamnRecusaamoeba,
            anamn_evitatoqueleve: req.body.anamnEvitatoqueleve,
            anamn_aceitaabreco: req.body.anamnAceitaabreco,
            anamn_aceitaabrecodesc: req.body.anamnAceitaabrecodesc,
            anamn_tocapessoasobjconsta: req.body.anamnTocapessoasobjconsta,
            anamn_batecaisemnocao: req.body.anamnBatecaisemnocao,
            anamn_seguraobj: req.body.anamnSeguraobj,
            anamn_buscaatvpuxaremp: req.body.anamnBuscaatvpuxaremp,
            anamn_mastigaobjroupa: req.body.anamnMastigaobjroupa,
            anamn_tocapessoasobjconstadesc: req.body.anamnTocapessoasobjconstadesc,
            anamn_batecaisemnocaodesc: req.body.anamnBatecaisemnocaodesc,
            anamn_seguraobjdesc: req.body.anamnSeguraobjdesc,
            anamn_buscaatvpuxarempdesc: req.body.anamnBuscaatvpuxarempdesc,
            anamn_mastigaobjroupadesc: req.body.anamnMastigaobjroupadesc,
            anamn_obstatil: req.body.anamnObstatil,
            //Sociabilidade
            anamn_preferebrincarcom: req.body.anamnPreferebrincarcom,
            anamn_preferebrincaridade: req.body.anamnPreferebrincaridade,
            anamn_preferebrincarcomdesc: req.body.anamnPreferebrincarcomdesc,

            anamn_fazamigosfacil: req.body.anamnFazamigosfacil,
            anamn_emprestabrinquedos: req.body.anamnEmprestabrinquedos,
            anamn_brincacooperado: req.body.anamnBrincacooperado,
            anamn_gostamandar: req.body.anamnGostamandar,
            anamn_gostasubmeter: req.body.anamnGostasubmeter,

            anamn_fazamigosfacildesc: req.body.anamnFazamigosfacildesc,
            anamn_emprestabrinquedosdesc: req.body.anamnEmprestabrinquedosdesc,
            anamn_brincacooperadodesc: req.body.anamnBrincacooperadodesc,
            anamn_gostamandardesc: req.body.anamnGostamandardesc,
            anamn_gostasubmeterdesc: req.body.anamnGostasubmeterdesc,

            anamn_gostamusica: req.body.anamnGostamusica,
            anamn_gostamusicaquais: req.body.anamnGostamusicaquais,

            anamn_socializapares: req.body.anamnSocializapares,
            anamn_brincaparque: req.body.anamnBrincaparque,
            anamn_brincarfuncional: req.body.anamnBrincarfuncional,
            anamn_criabrincadeiras: req.body.anamnCriabrincadeiras,
            anamn_recusaengajardemanda: req.body.anamnRecusaengajardemanda,

            anamn_socializaparesdesc: req.body.anamnSocializaparesdesc,
            anamn_brincaparquedesc: req.body.anamnBrincaparquedesc,
            anamn_brincarfuncionaldesc: req.body.anamnBrincarfuncionaldesc,
            anamn_criabrincadeirasdesc: req.body.anamnCriabrincadeirasdesc,
            anamn_recusaengajardemandadesc: req.body.anamnRecusaengajardemandadesc,

            anamn_brinquedopreferidosquais: req.body.anamnBrinquedopreferidosquais,
            anamn_obssocial: req.body.anamnObssocial,
            //Escolaridade
            anamn_escola: req.body.anamnEscola,
            anamn_tempo: req.body.anamnTempo,
            anamn_turno: req.body.anamnTurno,
            anamn_serie: req.body.anamnSerie,
            anamn_escolaanterior: req.body.anamnEscolaanterior,
            anamn_paisestudamcomcrianca: req.body.anamnPaisestudamcomcrianca,
            anamn_localadequadoestudo: req.body.anamnLocaladequadoestudo,
            anamn_executatarefascaseiras: req.body.anamnExecutatarefascaseiras,
            anamn_temautonomiaestuda: req.body.anamnTemautonomiaestuda,
            anamn_necessitaorienta: req.body.anamnNecessitaorienta,
            anamn_usamuitaborracha: req.body.anamnUsamuitaborracha,
            anamn_rendimentoescolarbaixo: req.body.anamnRendimentoescolarbaixo,
            anamn_reprovado: req.body.anamnReprovado,
            anamn_pulouserie: req.body.anamnPulouserie,
            anamn_pulouseriedesc: req.body.anamnPulouseriedesc,
            anamn_idadealfa: req.body.anamnIdadealfa,
            anamn_comofoialfabet: req.body.anamnComofoialfabet,
            anamn_dificuldadeescolar: req.body.anamnDificuldadeescolar,
            anamn_dificuldademateriaquais: req.body.anamnDificuldademateriaquais,
            anamn_ler: req.body.anamnLer,
            anamn_lerobs: req.body.anamnLerobs,
            anamn_escreve: req.body.anamnEscreve,
            anamn_escreveobs: req.body.anamnEscreveobs,
            anamn_motrici: req.body.anamnMotrici,
            anamn_motriciobs: req.body.anamnMotriciobs,
            anamn_contar: req.body.anamnContar,
            anamn_contarobs: req.body.anamnContarobs,
            anamn_calcular: req.body.anamnCalcular,
            anamn_calcularobs: req.body.anamnCalcularobs,
            anamn_atencao: req.body.anamnAtencao,
            anamn_atencaoobs: req.body.anamnAtencaoobs,
            anamn_profparticular: req.body.anamnProfparticular,
            anamn_profparticularnome: req.body.anamnProfparticularnome,
            anamn_ativiextra: req.body.anamnAtiviextra,
            anamn_ativiextrahorario: req.body.anamnAtiviextrahorario,
            anamn_obsescola: req.body.anamnObsescola,
            //Rotinas
            anamn_rotanadiasemanal: req.body.anamnRotanadiasemanal,
            anamn_anotaextra: req.body.anamnAnotaextra,
            anamn_dataanamnese: req.body.anamnDataanamnese,
            anamn_datacad: dataAtual,
            //anamn_dataedi: dataAtual, //somente na edição é habilitado
            anamn_usuidcad: idUsu,
            //anamn_usuidedi: idUsu, //somente na edição é habilitado
            anamn_terapeutaid: req.body.anamnTerapeutaid 
        });
        console.log("newAnamn save");
        await newAnamn.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
};