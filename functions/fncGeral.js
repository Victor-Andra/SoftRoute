//Exports
const mongoose = require("mongoose")
const con = require("../serverConnection")

class Resposta{
    constructor(
        texto,
        sucesso
        ){
        this.texto = texto,
        this.sucesso = sucesso
    }
}
const connections = {};
class Filtros{
    constructor(
        nome,
        valor
        ){
        this.nome = nome,
        this.valor = valor
    }
}

function getConnection(dbName) {
    return con.getConnection(dbName);
}
/*
function getModel(dbName, modelName, schema) {
    const db = getConnection(dbName);
    return db.models[modelName] || db.model(modelName, schema);
}
*/
module.exports = {Filtros, Resposta,
    getModel(dbName, modelName, schema) {
        const db = getConnection(dbName);
        return db.models[modelName] || db.model(modelName, schema);
    },
    //Adiciona 0 A datas do sistema.
    adicionaZero(numero){
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero; 
    },
    IsAuthenticated(req,res,next){
        //Passport creates a function to your session called isAuthenticated(), so you can use it to verify if the user really login in the app
        //console.log("AUTENTICADO?"+req.isAuthenticated())
        if(req.isAuthenticated()){
            //So, here you are saying that if the route called had any other function, it will goes to the next one ( which is rendering the HTML )
            next();
        }else{
            let flash = new Resposta()
            //Or else, goes back to login page
            flash.texto = "Você precisa estar logado para acessar o sistema!";
            flash.sucesso = "false";
            res.render('ferramentas/usuario/login',{flash});
        }
    },
    verificarExistencia(arrayString, val){//verifica a existencia de uma string em um arraystring;
        let boo = false;
        arrayString.some((v) => {
            console.log("val == v: "+val +"=="+ v + " : "+(val == v))
            if(val == v){
                boo = true;
                return true;
            }
            return false;
        });
        return boo;
    },
    getDiaSemana(dt){
        let dat = new Date(dt);
        switch (dat.getUTCDay()){
            case 0:
                return "dom"
            case 1:
                return "seg"
            case 2:
                return "ter"
            case 3:
                return "qua"
            case 4:
                return "qui"
            case 5:
                return "sex"
            case 6:
                return "sab"
            default:
                return "dom"
        }
    },
    getData(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dia+'/'+mes+'/'+dt.getFullYear()).toString();
    },
    getDataDiaMes(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        let semana;

        switch (dt.getUTCDay()){
            case 1:
                semana = "Segunda";
                break;
            case 2:
                semana = "Terça";
                break;
            case 3:
                semana = "Quarta";
                break;
            case 4:
                semana = "Quinta";
                break;
            case 5:
                semana = "Sexta";
                break;
            default:
                semana = "Dom";
                break;
        }
        
        return (semana+" - "+dia+'/'+mes).toString();
    },
    getDataContra(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dt.getFullYear()+'/'+mes+'/'+dia).toString();
    },
    getDataInvert(dt){//yyyy-mm-dd -> dd-mm-yyyy
        let dia = dt.substring(8,10);
        let mes = dt.substring(5,7);
        let ano = dt.substring(0,4);

        return (dia+"-"+mes+"-"+ano);
    },
    getDataRevert(dt){//dd-mm-yyyy -> yyyy-mm-dd
        let dia = dt.substring(0,2);
        let mes = dt.substring(3,5);
        let ano = dt.substring(6,10);
        
        return (ano+"-"+mes+"-"+dia);
    },
    getDateFromString(dt, iniFim){//Passa data yyyy-MM-dd para Date setando os valores em um date vazio separadamente, iniFim serve para definir se vai definir o horario em 00:00:00 ou 23:59:59. Trabalha com mês 1-12.
        data = dt;
        ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        let formatData;
        if(iniFim == "ini"){
            formatData = new Date(ano, (parseInt(mes)-1), dia, 0, 0, 0, 0);
        } else if (iniFim == "fim"){
            formatData = new Date(ano, (parseInt(mes)-1), dia, 23, 59, 59, 0);
        }
        /*
        formatData.setFullYear(ano);
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        formatData.setDate(dia);
        */
        /*
        if(iniFim == "ini"){
            formatData.setHours(0);
            formatData.setMinutes(0);
            formatData.setSeconds(0);
        } else if (iniFim == "fim"){
            formatData.setHours(23);
            formatData.setMinutes(59);
            formatData.setSeconds(59);
        }
        */
        //console.log("formatData4:"+formatData)
        return formatData;
    },
    getDateToIsostring(dt){
        data = dt;
        let isoString = "";

        let mes = (dt.getMonth()+1).toString();
        let dia = (dt.getDate()).toString();
        let ano = (dt.getFullYear()).toString();

        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }

        let hora = (dt.getHours()).toString();
        let mins = (dt.getMinutes()).toString();
        let segs = (dt.getSeconds()).toString();

        if (hora.length == 1){
            hora = "0"+hora;
        }
        if (mins.length == 1){
            mins = "0"+mins;
        }
        if (segs.length == 1){
            segs = "0"+segs;
        }

        isoString = ano.toString()+"-"+mes.toString()+"-"+dia.toString()+"T"+hora+":"+mins+":"+segs+".000Z";
        return isoString;
    },
    getDataFMT(data){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
    },
    getDataFMTOption(data, opt){
        let dt = new Date(data);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        return (dt.getFullYear()).toString()+opt+mes+opt+dia;
    },
    getDiaSemana(dt){
        let dat = new Date(dt);
        switch (dat.getUTCDay()){
            case 0:
                return "dom"
            case 1:
                return "seg"
            case 2:
                return "ter"
            case 3:
                return "qua"
            case 4:
                return "qui"
            case 5:
                return "sex"
            case 6:
                return "sab"
            default:
                return "dom"
        }
    },
    capitalizarNome(nome) {
        // Lista de preposições a serem excluídas
        const preposicoesExcluir = ["da", "de", "dos", "das"];
      
        // Divida o nome em palavras
        const palavras = nome.toLowerCase().split(" ");
      
        // Capitalize a primeira letra de cada palavra, excluindo as preposições
        const resultado = palavras.map((palavra, index) => {
          if (index === 0 || !preposicoesExcluir.includes(palavra)) {
            return palavra.charAt(0).toUpperCase() + palavra.slice(1);
          } else {
            return palavra;
          }
        });
      
        // Junte as palavras de volta em uma string
        return resultado.join(" ");
      },
      getDateHoursToIsostring(dt,hr){
        let horas = hr
        let isoString = [];

        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getDate()).toString();
        let ano = (dt.getFullYear()).toString();

        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }

        let hora = (dt.getHours()).toString();
        let mins = (dt.getMinutes()).toString();
        let segs = (dt.getSeconds()).toString();

        if (hora.length == 1){
            hora = "0"+hora;
        }
        if (mins.length == 1){
            mins = "0"+mins;
        }
        if (segs.length == 1){
            segs = "0"+segs;
        }
        hr.forEach(horario => {
            isoString.push(ano.toString()+"-"+mes.toString()+"-"+dia.toString()+"T"+horario+":"+segs+".000Z")
        });
        return isoString;
    },
    diasNoMes(mes, ano) {
        var data = new Date(ano, mes, 0);
        return data.getDate();
    },
    mascaraValores(val){
        //Esta mascara só vai até Milhões
        let t = val.toString();
        if(val == "0" || val == "0,00"){
            t = "0,00";
        } else {
            if (t.length >= 9){
                t = t.substring(0,t.length-8)+"."+t.substring(t.length-8,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else if (t.length >= 6){
                t = t.substring(0,t.length-5)+"."+t.substring(t.length-5,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            } else {
                t = t.substring(0,(t.length - 2))+","+t.substring((t.length - 2),t.length)
            }
        }

        return t;
    },
    // Funções auxiliares
    calcularIdade(dataNascimento) {
        const hoje = new Date();
        let idadeAnos = hoje.getFullYear() - dataNascimento.getFullYear();
        const aniversarioEsteAno = new Date(
            hoje.getFullYear(),
            dataNascimento.getMonth(),
            dataNascimento.getDate()
        );

        if (hoje < aniversarioEsteAno) {
            idadeAnos -= 1;
        }

        const idadeMeses = (hoje.getMonth() - dataNascimento.getMonth() + 12) % 12;

        return `${idadeAnos} anos e ${idadeMeses} meses`;
    },
    formatarData(data) {
        const dia = String(data.getUTCDate()).padStart(2, '0');
        const mes = String(data.getUTCMonth() + 1).padStart(2, '0');
        const ano = data.getUTCFullYear();
        return `${ano}-${mes}-${dia}`;
    },
    ordenarPorNome(campo) {
        return (a, b) => {
            const nomeA = a[campo].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
            const nomeB = b[campo].normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
            return nomeA.localeCompare(nomeB);
        };
    },
    formatarReal(valorEmCentavos) {
        // Aceita número ou string; converte para inteiro em centavos
        if (typeof valorEmCentavos === 'string') {
            // Remove tudo exceto dígitos e converte para número inteiro de centavos
            const limpo = valorEmCentavos.replace(/\D/g, '');
            valorEmCentavos = limpo ? parseInt(limpo, 10) : 0;
        } else if (typeof valorEmCentavos !== 'number' || isNaN(valorEmCentavos)) {
            valorEmCentavos = 0;
        }

        const sinal = valorEmCentavos < 0 ? '-' : '';
        const abs = Math.abs(valorEmCentavos);
        const inteiros = Math.floor(abs / 100);
        const centavos = (abs % 100).toString().padStart(2, '0');

        // Formata parte inteira com separador de milhar (.)
        let inteirosFmt = inteiros.toString();
        if (inteirosFmt.length > 3) {
            inteirosFmt = inteirosFmt.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
        }

        return `${sinal}${inteirosFmt},${centavos}`;
    },
    definirVisual(catFinal) {
        switch(catFinal) {
            case "Falta":
            case "Falta Justificada":
                return { corBorda: "orange", corFundo: "#fff3e0", icone: "fa-ban" };
            case "Falta Absoluta":
                return { corBorda: "orange", corFundo: "#ffe0b2", icone: "fa-ban" };
            case "Feriado":
                return { corBorda: "orange", corFundo: "#ffe0b2", icone: "fa-ban" };
            case "Substituição":
                return { corBorda: "#9b59b6", corFundo: "#f8f4fc", icone: "fa-exchange" };
            default:
                return { corBorda: "lightgreen", corFundo: "transparent", icone: "fa-pencil" };
        }
    },
    obterPeriodoMes(anoString, mesString) {
        // mes: 0-11
        let ano = parseInt(anoString);
        let mes = parseInt(mesString);

        const dataIni = new Date(Date.UTC(
            ano, mes, 1,
            0, 0, 0, 0
        ));

        mes = mes + 1;
        const dataFim = new Date(Date.UTC(
            ano, mes, 0,
            23, 59, 59, 0
        ));

        return { dataIni, dataFim };
    },
    obterSemanaUtil(data) {
        let dataBase = new Date(data);

        // Sempre UTC
        let diaSemana = dataBase.getUTCDay();

        let segunda = new Date(dataBase);

        switch (diaSemana) {
            case 0: // domingo
                segunda.setUTCDate(dataBase.getUTCDate() + 1);
                break;
            case 1: // segunda
                break;
            case 2: // terça
                segunda.setUTCDate(dataBase.getUTCDate() - 1);
                break;
            case 3: // quarta
                segunda.setUTCDate(dataBase.getUTCDate() - 2);
                break;
            case 4: // quinta
                segunda.setUTCDate(dataBase.getUTCDate() - 3);
                break;
            case 5: // sexta
                segunda.setUTCDate(dataBase.getUTCDate() - 4);
                break;
            case 6: // sábado
                segunda.setUTCDate(dataBase.getUTCDate() - 5);
                break;
        }

        segunda.setUTCHours(0, 0, 0, 0);

        let sexta = new Date(segunda);
        sexta.setUTCDate(segunda.getUTCDate() + 4);
        sexta.setUTCHours(23, 59, 59, 999);

        return {
            dataIni: segunda,
            dataFim: sexta
        };
    },
    obterPeriodoDia(dataStr) {
        let [ano, mes, dia] = dataStr.split('-').map(Number);
        let mesInt = (mes - 1);

        let dataIni = new Date(Date.UTC(
            ano, mesInt, dia,
            0, 0, 0, 0
        ));

        let dataFim = new Date(Date.UTC(
            ano, mesInt, dia,
            23, 59, 59, 999
        ));

        return { dataIni, dataFim };
    }
}