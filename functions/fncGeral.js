const { RespostaModel } = require("../models/resposta");

module.exports = {
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
            let flash = new RespostaModel()
            //Or else, goes back to login page
            flash.texto = "Você precisa estar logado para acessar o sistema!";
            flash.texto = "false";
            res.render('ferramentas/usuario/login',{flash});
        }
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
        
        return (dia+"-"+mes+"-"+ano);
    }
}