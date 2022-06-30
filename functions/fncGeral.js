module.exports = {
    //Adiciona 0 A datas do sistema.
    adicionaZero(numero){
        if (numero <= 9) 
            return "0" + numero;
        else
            return numero; 
    }


}