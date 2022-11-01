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


//Configurações
    //Sessão
        app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

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
        
    //Body-Parser
        app.use(bodyParser.urlencoded({extended: true}))
        app.use(bodyParser.json())
    //Handlebars
        //app.engine('handlebars', engine());
        //app.engine("handlebars", handlebars({   handlebars: allowInsecurePrototypeAccess(Handlebars) }));
        //app.engine('handlebars', handlebars({defaultLayout: 'main'}))
        app.engine('handlebars', expressHandlebars({
            defaultLayout: 'main',
            handlebars: allowInsecurePrototypeAccess(handlebars),
            helpers: {
                ifEqual: function (v1, v2, options) {//Verifica 2 atributos vindos do banco que não sejam String
                    //console.log("/"+v1+"="+v2+"/")
                    if (v1.toString() === v2.toString()) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
                    }
                },
                compareThis: function (v1, v2, options) {//Verifica 1 atributo vindo do banco que não seja String com uma String
                    //console.log("/"+v1.toString()+"="+v2.toString()+"/")
                    if (v1.toString() === v2) {
                        return options.fn(this);
                    } else {
                        return options.inverse(this);
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
    console.log("Servidor rodando")
})

