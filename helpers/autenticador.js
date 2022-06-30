module.exports ={
    nivelUsuario: function(req,res,next){

        if(req.isAuthenticated() && req.usuario.perfilID == 0){
            return next();
        }
        req.flash("error_msg", "Você precisa ser um Admin!");
        res.redirect("/");
    }
}