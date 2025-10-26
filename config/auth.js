const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const { getModel } = require('../functions/fncGeral');
//const bcrypt = require("bcryptjs")
const passport = require("passport")
const usuarioClass = require("../models/usuario")

//Model usuario
require("../models/usuario")
const Usuario = getModel("PortalDoUsuario", 'tb_usuario', usuarioClass.UsuarioSchema)

module.exports = 
    function(passport){
        passport.use(new localStrategy({usernameField: 'email', passwordField: "senha"}, (email, senha, done) =>{
            Usuario.findOne({usuario_email: email}).then((usuario) =>{
                console.log("start")
                if(!usuario){
                    console.log("null")
                    return done(null, false, {message: "Esta conta não existe"})
                }
                if(senha == usuario.usuario_senha){
                    console.log("true")
                    return done(null, usuario)
                } else {
                    console.log("false")
                    return done(null, false, {message: "Senha incorreta"})
                }
                //bcrypt.comparesenha, usuario.usuario_senha, (erro, batem) =>{if(batem){return done(null, user)}else{return done(null, false, {message: "Usuario ou senha incorreto"})}}
            })
        }))

        passport.serializeUser((usuario, done) => {
            done(null, usuario._id)
        })

        passport.deserializeUser((id, done) => {
            Usuario.findById(id, (err, usuario)=>{
                done(err,usuario)
            })
        })
}