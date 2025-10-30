const mongoose = require('mongoose');

//Conexão
const connections = {
    SoftRouteFazendinha: mongoose.createConnection("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/softrouteFazendinha"),
    SoftRoute: mongoose.createConnection("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/softroute"),
    PortalDoUsuario: mongoose.createConnection("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/PortalDoUsuario"),
    TESTE: mongoose.createConnection("mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/TESTE")
};

function getDbByUser(usu) {
    if (usu.usuario_empresaids.some(id => id.equals(ObjectId(id_da_fazendinha)))) {
        return connections.SoftRouteFazendinha;
    }
    if (usu.usuario_empresaids.some(id => id.equals(ObjectId(id_da_route)))) {
        return connections.SoftRoute;
    }
    if (usu.usuario_empresaids.some(id => id.equals(ObjectId(id_global)))) {
        return connections.PortalDoUsuario;
    }
    if (usu.usuario_empresaids.some(id => id.equals(ObjectId(id_teste)))) {
        return connections.TESTE;
    }
    throw new Error("Usuário sem permissão");
}

function getConnection(dbName) {
    const name = dbName || "softroute";

    // Se já existir no dicionário, usa
    if (connections[name]) {
        return connections[name];
    }

    // Fallback: cria conexão on-demand
    connections[name] = mongoose.createConnection(
        `mongodb+srv://AdminSR:KKfafxcYLURWoPFe@softroute.tih48.mongodb.net/${name}`,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    return connections[name];
}

module.exports = { connections, getDbByUser, getConnection };