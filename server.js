const express = require('express')
//const { engine } = require ('express-handlebars');
const expressHandlebars = require ('express-handlebars');
const handlebars = require('handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const bodyParser = require('body-parser')
const mongoose = require("mongoose")
const app = express()
const menu = require('./routes/admin')
const path = require('path')
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport");
require("./config/auth")(passport)
const cookieParser = require('cookie-parser');
const { ObjectId } = require("mongoose").Types;
const id_global = new ObjectId("6501d2f9a4b3c7e8d9f01234");
//Multer Upload de arquivos
const multer = require('multer');

// Configuração do Multer
const storage = multer.memoryStorage(); // ou escolha o storage adequado para o seu caso
const upload = multer({ storage: storage });

//Porta do servidor
const PORT = 3000
// ... outras configurações e middlewares ...

// Exemplo de rota que usa o Multer para upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Lógica para manipular o arquivo enviado
  const fileBuffer = req.file.buffer;
  // ... faça algo com o arquivo ...

  res.send('Upload concluído com sucesso!');
});

// ... outras rotas ...
//remover
const { getModel } = require('./functions/fncGeral');
const usuarioClass = require("./models/usuario")
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

//Configurações
    

    //Sessão
        app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true, cookie: {maxAge: 18000000}}));

        app.use(passport.initialize())
        app.use(passport.session())

        app.use(flash())
        
        app.use((req, res, next) =>{
            res.locals.success_msg = req.flash("success_msg")
            res.locals.error_msg = req.flash("error_msg")
            res.locals.error = req.flash("error")
            res.locals.usuario = req.usuario || null;
            next()
        })

        exports.IsAuthenticated = function(req,res,next){//Passport creates a function to your session called isAuthenticated(), so you can use it to verify if the user really login in the app
            //console.log("AUTENTICADO?"+req.isAuthenticated())

            if(req.isAuthenticated()){//So, here you are saying that if the route called had any other function, it will goes to the next one ( which is rendering the HTML )
                next();
            }else{//Or else, goes back to login page
                res.render('welcome/index',{message:'Ops! This route requires a login!'});
            }
        };
        
    //Body-Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Cookies
        app.use(cookieParser());
    //Handlebars
        //app.engine('handlebars', engine());
        //app.engine("handlebars", handlebars({   handlebars: allowInsecurePrototypeAccess(Handlebars) }));
        //app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.engine('handlebars', expressHandlebars({
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(handlebars),
            helpers: {
                /**
                 - Helper Handlebars: {{#ifEqual valor1 valor2}}
                 - Compara dois valores convertendo-os para string, garantindo compatibilidade entre tipos (ex: ObjectId, Number, String)
                 - Retorna o bloco interno se forem iguais, ou o bloco {{else}} se forem diferentes
                 - Exemplo:
                    {{#each ../../terapias}}
                        {{#ifEqual this._id ../sessao_terapiaid01}}
                            <td>{{terapia_nome}}</td>
                        {{/ifEqual}}
                    {{/each}}
                    O que isso faz:
                        Para cada terapia na lista ../../terapias (acessível via this._id):
                        Compara o this._id da terapia com o valor de ../sessao_terapiaid01 (um campo da sessão).
                        Se forem iguais, mostra o nome da terapia (<td>{{terapia_nome}}</td>).
                        Isso é usado para filtrar e mostrar apenas a terapia correta para aquele campo da sessão .
                 - Wagner Cintra 18/06/2025
                **/
                ifEqual: function (v1, v2, options) {
                    //console.log("/"+v1+"="+v2+"/");
                    if ((""+v1+"") === (""+v2+"")) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                compareThis: function (v1, v2, options) {//Verifica 1 atributo vindo do banco que não seja String com uma String
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1 == undefined){
                        return options.inverse(this);
                    } else {
                        if (v1.toString() === v2) {
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    }
                },
                // Função verificar se um campo do tipo string é indefinido ou vazio ou string vazia.
                verificarVazioOuIndefinido: function(campo, opcoes) {
                    if (campo === undefined || campo === null || campo === '') {
                    return opcoes.fn(this);
                    } else {
                    return opcoes.inverse(this);
                    }
                },
                compareString: function (v1, v2, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1 === v2) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                /**
                 * Helper: compareStringMore - Versão simplificada
                 * Compara um valor com múltiplas opções (OR lógico)
                 * Uso: {{#compareStringMore valor "op1" "op2" "op3"}}CONTEÚDO{{else}}DEFAULT{{/compareStringMore}}
                 */
                compareStringMore: function (value) {
                        // Pega todos os argumentos exceto o último (options)
                        const args = Array.prototype.slice.call(arguments, 1, -1);
                        const options = arguments[arguments.length - 1];
                        
                        // Verifica se o valor matcha com qualquer um dos casos
                        const matched = args.some(caseValue => ("" + value) === ("" + caseValue));
                        
                        if (matched) {
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    },
              
                compareUndefined: function (v1, v2, options) {//Verifica 1 atributo vindo do banco que não seja String com uma String
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1 == undefined){
                        return options.fn(this);
                    } else {
                        if (v1.toString() === v2) {
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    }
                },
                isTrue: function (v1, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                isNull: function (v1, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1 === null || v1 === "" || v1 === undefined || v1 === "undefined") {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                // Verifica se esta vazio e somente, sem comparacao
                ifEmpty: function(array, options) {
                    if (!array || array.length === 0) {
                        return options.fn(this);
                    }
                    return options.inverse(this);
                },
                dataInferior: function (v1, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1)///2023-11-14
                    function retornaData(data) {
                        if (data.includes("-")){
                            split = data.split('-');
                            //console.log(split[1] + "/" + split[2] + "/" + split[0])
                            return new Date(split[1] + "/" + split[2] + "/" + split[0]);
                        } else if (data.includes("/")){
                            split = data.split('/');
                            return new Date(split[1] + "/" + split[0] + "/" + split[2]);
                        } else {
                            if (!data) {
                                return data;
                            }
                        }
                    }
                
                    var dataAtual = new Date();
                    //console.log("/"+retornaData(v1)+" = "+dataAtual)
                    if (v1 != undefined){
                        if (retornaData(v1) < dataAtual) {
                            return options.fn(this);
                        } else {
                            //console.log("/false")
                            return options.inverse(this);
                        }
                    }
                },
                dataIgual: function (v1, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1)///2023-11-14
                    if (v1 == undefined || v1 == "undefined"){
                        return options.inverse(this);
                    }
                    function retornaData(data) {
                        if (data.includes("-")){
                            split = data.split('-');
                            return new Date(split[1] + "/" + split[2] + "/" + split[0]);
                        } else if (data.includes("/")){
                            split = data.split('/');
                            return new Date(split[1] + "/" + split[0] + "/" + split[2]);
                        } else {
                            if (!data) {
                                return data;
                            }
                        }
                    }
                
                    var dataAtual = new Date();
                    if (retornaData(v1).getDate() == dataAtual.getDate()) {
                        return options.fn(this);
                    } else {
                        //console.log("/false")
                        return options.inverse(this);
                    }
                },
                data24h: function (v1, options) {//Verifica 2 atributos que sejam de mesmo tipo e valor
                    //console.log("/"+v1)//2023-11-14
                    if (v1 == undefined || v1 == "undefined"){
                        return options.inverse(this);
                    }
                    let datav1;
                    datav1 = new Date(v1);
                    datav1.setDate(datav1.getDate()+1);
                    let hoje = new Date();
                    if (datav1 > hoje) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                menorOuigual: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1+"="+v2+"/")
                    if (parseInt(""+v1+"") <= parseInt(""+v2+"")) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                maiorOuigual: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1+"="+v2+"/")
                    if (parseInt(""+v1+"") >= parseInt(""+v2+"")) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                maiorQue: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1+"="+v2+"/")
                    if (parseInt(""+v1+"") > parseInt(""+v2+"")) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                contidoEmArray: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //O CODIGO SIMPLESMENTE NAO PASSA AQUI< ELE FINGE QUE ESSE HELPER NAO EXISTE
                    console.log("/"+v2+"/");
                    console.log("/"+v1+"="+v2+"/");
                    if (v1 != undefined && v1 != "undefined" && v1 != "" && v1 != "-"){
                        let resultado;
                        let existe = (objeto) => objeto == v2;
                        let novo_vetor = v1.split(",");
                        resultado = novo_vetor.some(existe);
                        console.log("resultado: "+resultado)
                        if (resultado){
                            return options.fn(this);
                        } else {
                            return options.inverse(this);
                        }
                    } else {
                        return options.inverse(this);
                    }
                },
                inc: function (v1) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1)
                    return v1 + 1;
                },
                ifIncludes: function (chave, array, options) {
                    console.log("chave: "+chave)
                    console.log("array: "+array)
                    if (array.includes(chave)) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                json: function(context) {
                    return JSON.stringify(context);
                },
                dataISOToDateOLD: function(date) {
                    if (!date) return '';
                    const d = new Date(date);
                    return d.toISOString().slice(0, 10); // YYYY-MM-DD
                },
                dataISOToDate: function(date) {
                    if (!date) return '';

                    const d = new Date(date);

                    // valida se é data válida
                    if (isNaN(d.getTime())) {
                        console.error('Data inválida recebida no helper:', date);
                        return '';
                    }

                    // garante formato YYYY-MM-DD sem depender de slice direto
                    const year = d.getUTCFullYear();
                    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
                    const day = String(d.getUTCDate()).padStart(2, '0');

                    return `${year}-${month}-${day}`;
                },
                /**
                 * Helper Handlebars: {{formataContabil valor}}
                 * Criado em 20/02/2026 às [HORÁRIO] por Wagner Cintra
                 * 
                 * Este helper formata números no padrão contábil brasileiro para exibição em views,
                 * convertendo o formato decimal americano (ponto como separador decimal) para o
                 * formato brasileiro (vírgula como separador decimal e ponto como separador de milhar).
                 * 
                 * Características:
                 * - Não adiciona símbolo de moeda (R$), apenas formatação numérica pura
                 * - Sempre exibe 2 casas decimais (ex: 100 → "100,00")
                 * - Aplica separador de milhar com ponto (.) conforme padrão ABNT
                 * - Retorna string vazia para valores nulos, indefinidos, vazios ou NaN
                 * - Compatível com strings numéricas, números inteiros e decimais
                 * 
                 * Exemplos de uso na view:
                 *   {{formataContabil 1326.79}}        → 1.326,79
                 *   {{formataContabil lote.valor}}     → 1.326,79 (se valor = 1326.79)
                 *   {{formataContabil "999.99"}}       → 999,99
                 *   {{formataContabil null}}           → '' (string vazia)
                 *   {{formataContabil 0}}              → 0,00
                 *   {{formataContabil 1234567.89}}     → 1.234.567,89
                 * 
                 * Importante:
                 * - O valor de entrada deve estar no formato decimal (ponto como separador)
                 * - Para cálculos, use o valor original do banco; este helper é APENAS para exibição
                 * - O retorno é uma string formatada, não um número (não usar em operações matemáticas)
                 * - Ideal para tooltips, relatórios e exibição de valores financeiros sem símbolo
                 */
                formataContabil: function(valor) {
                    const habilitarLog = false; // ⬅️ Use false para ocultar logs em produção

                    if (habilitarLog) {
                        console.log('[Helper formataContabil] Valor recebido:', valor, '| Tipo:', typeof valor);
                    }

                    // Tratamento de valores nulos, indefinidos ou vazios
                    if (valor === null || valor === undefined || valor === '') {
                        if (habilitarLog) console.log('[Helper formataContabil] Valor inválido, retornando string vazia');
                        return '';
                    }

                    // Converter para número, tratando strings numéricas
                    const numero = parseFloat(valor);

                    // Verificar se a conversão resultou em número válido
                    if (isNaN(numero)) {
                        if (habilitarLog) console.warn('[Helper formataContabil] NaN após parseFloat, retornando string vazia');
                        return '';
                    }

                    // Formatar no padrão brasileiro: 1326.79 → "1.326,79"
                    // toLocaleString com pt-BR já aplica ponto para milhar e vírgula para decimal
                    const formatado = numero.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    });

                    if (habilitarLog) {
                        console.log('[Helper formataContabil] Valor original:', numero, '| Formatado:', formatado);
                    }

                    return formatado;
                },
                
                // Helper ifCond
                /**
                 * Helper personalizado Handlebars: {{#ifCond}}
                 * 
                 * Permite realizar comparações lógicas em templates .hbs, já que o Handlebars
                 * não suporta operadores lógicos nativamente em blocos `if`.
                 * 
                 * Sintaxe:
                 * {{#ifCond valor1 "operador" valor2}}
                 *   <!-- conteúdo se VERDADEIRO -->
                 * {{else}}
                 *   <!-- conteúdo se FALSO -->
                 * {{/ifCond}}
                 * 
                 * Operadores suportados:
                 *   ==   -> Igualdade (não estrita)
                 *   ===  -> Igualdade estrita (valor e tipo)
                 *   !=   -> Diferente (não estrito)
                 *   !==  -> Diferente estrito
                 *   <    -> Menor que
                 *   <=   -> Menor ou igual
                 *   >    -> Maior que
                 *   >=   -> Maior ou igual
                 *   &&   -> AND lógico (E)
                 *   ||   -> OR lógico (OU)
                 * 
                 * Exemplos de uso no template:
                 * 
                 * 1. Comparar se o mês selecionado é Abril (valor 3):
                 *    {{#ifCond filtroMes "==" 3}}
                 *        <option value="3" selected>Abril</option>
                 *    {{else}}
                 *        <option value="3">Abril</option>
                 *    {{/ifCond}}
                 * 
                 * 2. Comparar se o ano é 2025:
                 *    {{#ifCond filtroAno "==" "2025"}}
                 *        selected
                 *    {{/ifCond}}
                 * 
                 * 3. Verificar se dois valores são estritamente iguais:
                 *    {{#ifCond status "===" "Ativo"}}
                 *        <span class="badge badge-success">Ativo</span>
                 *    {{/ifCond}}
                 * 
                 * 4. Usar "maior que" para validar dias:
                 *    {{#ifCond diasRestantes ">" 30}}
                 *        <span>Prazo longo</span>
                 *    {{/ifCond}}
                 * 
                 * 5. Combinar condições com AND (&&):
                 *    {{#ifCond (gt valor 10) "&&" (lt valor 20)}}
                 *        Valor entre 10 e 20
                 *    {{/ifCond}}
                 * 
                 * Importante:
                 * - Use aspas em strings e sem aspas em números, conforme o tipo do dado.
                 * - Certifique-se de que as variáveis (como `filtroMes`, `filtroAno`) estão
                 *   sendo passadas corretamente no `res.render()` do backend.
                 */
                ifCond: function(v1, operator, v2, options) {
                    switch (operator) {
                        case '==':
                            return (v1 == v2) ? options.fn(this) : options.inverse(this);
                        case '===':
                            return (v1 === v2) ? options.fn(this) : options.inverse(this);
                        case '!=':
                            return (v1 != v2) ? options.fn(this) : options.inverse(this);
                        case '!==':
                            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
                        case '<':
                            return (v1 < v2) ? options.fn(this) : options.inverse(this);
                        case '<=':
                            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
                        case '>':
                            return (v1 > v2) ? options.fn(this) : options.inverse(this);
                        case '>=':
                            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
                        case '&&':
                            return (v1 && v2) ? options.fn(this) : options.inverse(this);
                        case '||':
                            return (v1 || v2) ? options.fn(this) : options.inverse(this);
                        default:
                            return options.inverse(this);
                    }
                },
                /**
                 * Helper multiply (multiplicar)
                 * Data de criação: 28/11/2025
                 * Finalidade: Multiplica dois valores numéricos e retorna o resultado arredondado para inteiro.
                 *             Usado para converter proporções em porcentagens (ex: 0.85 → 85).
                 *             Compatível com strings numéricas e valores decimais.
                 * Exemplo: {{multiply indice_frequencia 100}} → retorna 85
                 */
                multiply: function (a, b) {
                    console.log("[Helper multiply] a:", a, "| b:", b);
                    const numA = parseFloat(a) || 0;
                    const numB = parseFloat(b) || 0;
                    const result = Math.round(numA * numB);
                    console.log("[Helper multiply] resultado:", result);
                    return result;
                },

                /**
                 * Helper maiorQueDecimal
                 * Data de criação: 28/11/2025
                 * Finalidade: Compara se v1 > v2 convertendo ambos para número com casas decimais (parseFloat).
                 *             Diferente de "maiorQue" (que usa parseInt), este suporta proporções como 0.85.
                 *             Retorna o bloco {{#maiorQueDecimal a b}} se verdadeiro, ou {{else}} se falso.
                 *             Ideal para índices de frequência, médias, taxas.
                 * Exemplo de uso:
                 *   {{#maiorQueDecimal indice_frequencia 0}}
                 *     {{multiply indice_frequencia 100}}%
                 *   {{else}}
                 *     —
                 *   {{/maiorQueDecimal}}
                 */
                maiorQueDecimal: function (v1, v2, options) {
                    console.log("[Helper maiorQueDecimal] v1:", v1, "| v2:", v2);
                    const num1 = parseFloat(v1) || 0;
                    const num2 = parseFloat(v2) || 0;
                    const result = num1 > num2;
                    console.log("[Helper maiorQueDecimal] resultado:", result);
                    return result ? options.fn(this) : options.inverse(this);
                },
                // helpers/handlebars.js
                formatarTextoBarra: function(texto) {
                    if (!texto) return '';
                    
                    // Substituir "/" por " / " (com espaços)
                    let textoFormatado = texto.replace(/\//g, ' / ');
                    
                    return textoFormatado;
                },
                                
                /**
                 * Helper Handlebars: {{formatDate "formato" data}}
                 * Criado em 26/06/2025 às 11:25 por Wagner Cintra
                 * 
                 * Este helper permite formatar datas diretamente na view sem precisar de tratamento no backend.
                 * É robusto e suporta:
                 * - Datas em formato string: "2024/1/13", "2024-01-13", "13/01/2024", ISO ("2025-06-26T03:00:00.000Z")
                 * - Objetos Date JavaScript
                 * - Valores numéricos (timestamp)
                 * 
                 * Caso a data seja inválida, nula ou indefinida, retorna uma string vazia ('').
                 * 
                 * Formatos aceitos:
                 *   yyyy = ano completo (ex: 2025)
                 *   yy   = últimos dois dígitos do ano (ex: 25)
                 *   MM   = mês com zero à esquerda (01 a 12)
                 *   M    = mês sem zero (1 a 12)
                 *   dd   = dia com zero à esquerda (01 a 31)
                 *   d    = dia sem zero (1 a 31)
                 *   HH   = hora (00 a 23)
                 *   mm   = minutos (00 a 59)
                 *   ss   = segundos (00 a 59)
                 * 
                 * Exemplos de uso na view:
                 *   {{formatDate "yyyy/mm/dd" agenda_data}} → 2025/06/26
                 *   {{formatDate "dd/mm/yyyy" agenda_data}} → 26/06/2025
                 *   {{formatDate "MM/dd" agenda_data}}       → 06/26
                 *   {{formatDate "yyyy-MM" agenda_data}}     → 2025-06
                 *   {{formatDate "HH:mm" agenda_data}}       → 00:00
                 */
              formatDate: function (_, value) {
                    const habilitarLog = false; // ⬅️ Use false para ocultar logs

                    if (habilitarLog) {
                        console.log('📥 Valor recebido:', value);
                        console.log('📎 Tipo:', typeof value);
                    }

                    let date;

                    try {
                        if (value instanceof Date) {
                            date = value;
                        } else if (typeof value === 'string' || typeof value === 'number') {
                            date = new Date(value);
                        } else if (value && typeof value === 'object') {
                            if (value.toISOString) {
                                date = new Date(value.toISOString());
                            } else {
                                const raw = value._date || value.data || value.date || value.toString();
                                date = new Date(typeof raw === 'function' ? raw() : raw);
                            }
                        }

                        if (!(date instanceof Date) || isNaN(date.getTime())) {
                            if (habilitarLog) console.warn('❌ Data inválida após parsing');
                            return '';
                        }
                    } catch (e) {
                        if (habilitarLog) console.error('❌ Erro ao converter data:', e.message);
                        return '';
                    }

                    const pad2 = (n) => (typeof n === 'number' && !isNaN(n) ? n.toString().padStart(2, '0') : '00');

                    const year = date.getFullYear();
                    const month = pad2(date.getMonth() + 1); // Janeiro = 0
                    const day = pad2(date.getDate());

                    const result = `${year}-${month}-${day}`;

                    if (habilitarLog) console.log('📤 Resultado final:', result);

                    return result;
                },
                /**
                 * Helper Handlebars: {{prepararDiasCalendario}}
                 * Criado em 07/02/2026
                 * Finalidade: Prepara os dados para renderizar o calendário mensal
                 * Parâmetros:
                 *   - agendas: Array de agendas formatadas
                 *   - mesAtend: Mês selecionado (0-11)
                 *   - anoAtend: Ano selecionado
                 *   - beneSelecionado: ID do beneficiário ou 'todos'
                 * 
                 * Retorna um objeto com:
                 *   - dias: Array de 42 dias (6 semanas)
                 *   - nomeMes: Nome do mês por extenso
                 *   - ano: Ano selecionado
                 * 
                 * Exemplo de uso na view:
                 *   {{#prepararDiasCalendario agendasCal mesAtend anoAtend beneSelecionado}}
                 *     {{#each dias}}
                 *       <div class="dia {{#if vazio}}vazio{{/if}} {{#if hoje}}hoje{{/if}}">
                 *         <div class="numero">{{dia}}</div>
                 *         {{#each agendamentos}}
                 *           <div class="agendamento {{classeCor}}">
                 *             <span class="hora">{{hora}}</span>
                 *             <span class="terapia">{{terapiaNome}}</span>
                 *             <span class="terapeuta">{{terapeutaNome}}</span>
                 *             <span class="codigo">{{codigo}}</span>
                 *           </div>
                 *         {{/each}}
                 *       </div>
                 *     {{/each}}
                 *   {{/prepararDiasCalendario}}
                 */
                prepararDiasCalendario: function(agendas, mesAtend, anoAtend, beneSelecionado, options) {
                    // Verificação inicial
                    if (!agendas || !Array.isArray(agendas)) {
                        console.warn('[Helper] agendas é undefined ou não é array');
                        return options.fn({ dias: [], nomeMes: '', ano: anoAtend });
                    }
                    
                    const nomesMeses = [
                        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                    ];
                    
                    const hoje = new Date();
                    const hojeDia = hoje.getDate();
                    const hojeMes = hoje.getMonth();
                    const hojeAno = hoje.getFullYear();
                    
                    // Converter mesAtend para número
                    const mesNum = parseInt(mesAtend);
                    const anoNum = parseInt(anoAtend);
                    
                    const primeiroDia = new Date(Date.UTC(anoNum, mesNum, 1));
                    const offset = primeiroDia.getUTCDay();
                    
                    const ultimoDia = new Date(Date.UTC(anoNum, mesNum + 1, 0));
                    const totalDiasMes = ultimoDia.getUTCDate();
                    
                    // Agrupar agendas por dia
                    const agendasPorDia = {};
                    for (let dia = 1; dia <= 31; dia++) {
                        agendasPorDia[dia] = [];
                    }
                    
                    agendas.forEach(agenda => {
                        const data = new Date(agenda.agenda_data);
                        const dia = data.getUTCDate();
                        const mes = data.getUTCMonth();
                        const ano = data.getUTCFullYear();
                        
                        if (mes === mesNum && ano === anoNum) {
                            if (!beneSelecionado || beneSelecionado === 'todos' || agenda.agenda_beneid?.toString() === beneSelecionado) {
                                let classeCor = 'padrao';
                                const categoria = agenda.agenda_categoria || '';
                                const ehAdministrativo = agenda.agenda_tipodia === 'Administrativo';
                                
                                if (categoria.includes('Falta')) {
                                    classeCor = 'falta';
                                } else if (categoria.includes('Substitui') && !categoria.includes('Fixo')) {
                                    classeCor = 'substituicao';
                                } else if (categoria.includes('Fixo') || categoria === 'SubstitutoFixo') {
                                    classeCor = 'subfixo';
                                } else if (ehAdministrativo) {
                                    classeCor = 'administrativo';
                                }
                                
                                const origem = ehAdministrativo ? 'A' : 'P';
                                let tipoCat = 'P';
                                if (categoria.includes('Falta')) tipoCat = 'F';
                                else if (categoria.includes('Substitui') && !categoria.includes('Fixo')) tipoCat = 'S';
                                else if (categoria.includes('Fixo') || categoria === 'SubstitutoFixo') tipoCat = 'F';
                                
                                const codigo = `[${origem}${tipoCat}]`;
                                
                                agendasPorDia[dia].push({
                                    hora: agenda.agenda_hora || '08:00',
                                    terapiaNome: agenda.terapiaNome || '—',
                                    terapeutaNome: agenda.terapeutaNome || '—',
                                    beneNome: agenda.beneNome || '—',
                                    categoria: categoria || 'Padrão',
                                    codigo: codigo,
                                    classeCor: classeCor,
                                    dataCompleta: `${('0' + dia).slice(-2)}/${('0' + (mes+1)).slice(-2)}/${ano} ${agenda.agenda_hora || ''}`,
                                    origemTexto: ehAdministrativo ? 'Administrativo' : 'Padrão',
                                    temSubstitutoFixo: !!agenda.agenda_fixoterapeutaid,
                                    substitutoFixoTerapeuta: agenda.substitutoFixoTerapeuta || '',
                                    substitutoFixoTerapia: agenda.substitutoFixoTerapia || ''
                                });
                            }
                        }
                    });
                    
                    // Construir array de dias
                    const dias = [];
                    
                    for (let i = 0; i < offset; i++) {
                        dias.push({ dia: '', vazio: true });
                    }
                    
                    for (let dia = 1; dia <= totalDiasMes; dia++) {
                        const ehHoje = (dia === hojeDia && mesNum == hojeMes && anoNum == hojeAno);
                        dias.push({
                            dia: dia,
                            vazio: false,
                            hoje: ehHoje,
                            feriado: false,
                            agendamentos: agendasPorDia[dia] || []
                        });
                    }
                    
                    while (dias.length < 42) {
                        dias.push({ dia: '', vazio: true });
                    }
                    
                    return options.fn({
                        dias: dias,
                        nomeMes: nomesMeses[mesNum] || '',
                        ano: anoNum
                    });
                }
            }//fim dos helpers
        }));//fim do app.engine
               
        app.set('view engine', 'handlebars');
        app.set("views", "./views");
    //Mongoose para atualizar 09/12/2024 implementar poolSize: 150, seNewUrlParser: true, e useUnifiedTopology: true. 
    //mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/softrouteFazendinha
    //mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/PortalDoUsuario
    /*
        mongoose.connect("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/PortalDoUsuario").then(() => {
            console.log("Conectado com sucesso!");
        }).catch((err) => {
            console.log("Erro do conectar com o mongoose:"+err);
        });
        */
    //Public
        app.use(express.static(__dirname + '/assets'));

//Rotas
    /*app.get('/', (req,res) => {
        res.send("outra pagina principal")
    })*/

    /*app.get('/posts', (req,res) => {
        res.send("outra pagina de posts")
    })*/

    app.use('/menu', menu);
//Outros
app.listen(PORT, () => {
    //console.log("Servidor rodando")
})