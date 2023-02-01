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
        console.log("AUTENTICADO?"+req.isAuthenticated())
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
    }
}