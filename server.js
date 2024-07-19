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

//Multer Upload de arquivos
const multer = require('multer');

// Configuração do Multer
const storage = multer.memoryStorage(); // ou escolha o storage adequado para o seu caso
const upload = multer({ storage: storage });

// ... outras configurações e middlewares ...

// Exemplo de rota que usa o Multer para upload
app.post('/upload', upload.single('file'), (req, res) => {
  // Lógica para manipular o arquivo enviado
  const fileBuffer = req.file.buffer;
  // ... faça algo com o arquivo ...

  res.send('Upload concluído com sucesso!');
});

// ... outras rotas ...



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
                ifEqual: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1+"="+v2+"/");
                    if ((""+v1+"") === (""+v2+"")) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                compareThis: function (v1, v2, options) {//Verifica 1 atributo vindo do banco que não seja String com uma String
                    console.log("/"+v1+"="+v2+"/")
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
                    if (retornaData(v1) < dataAtual) {
                        return options.fn(this);
                    } else {
                        //console.log("/false")
                        return options.inverse(this);
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
                }
            }
        }));
        app.set('view engine', 'handlebars');
        app.set("views", "./views");
    //Mongoose
        mongoose.connect("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/softroute").then(() => {
            console.log("Conectado com sucesso!");
        }).catch((err) => {
            console.log("Erro do conectar com o mongoose:"+err);
        });
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
const PORT = 8081
app.listen(PORT, () => {
    //console.log("Servidor rodando")
})

