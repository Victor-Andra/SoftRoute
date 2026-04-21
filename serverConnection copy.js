const mongoose = require('mongoose');

const { ObjectId } = mongoose.Types;

// ⚠️ IDs das empresas (ajuste conforme seu sistema)
const id_da_BibliaCluster = "689b60167618eba5663a7246";
const id_global = "";

// Config padrão
mongoose.set('bufferCommands', false);

// 🔌 Conexões armazenadas
const connections = {};

// 🔧 Função interna para criar conexão
function createConnection(name, uri) {
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    conn.on('connected', () => {
        console.log(`✅ MongoDB conectado: ${name}`);
    });

    conn.on('error', (err) => {
        console.error(`❌ Erro MongoDB (${name}):`, err);
    });

    conn.on('disconnected', () => {
        console.warn(`⚠️ MongoDB desconectado: ${name}`);
    });

    return conn;
}

// 🚀 Conexões iniciais
connections.BibliaCluster = createConnection(
    "BibliaCluster",
    "mongodb+srv://victorcintrafreitas_db_user:p0l7byEe7oo5g5au@bibliacluster.msdrwm5.mongodb.net/BibliaCluster"
);

connections.PortalDoUsuario = createConnection(
    "PortalDoUsuario",
    "mongodb+srv://victorcintrafreitas_db_user:p0l7byEe7oo5g5au@portaldousuario.ldfs6a.mongodb.net/PortalDoUsuario"
);

// 🔍 Retorna conexão baseada no usuário
function getDbByUser(usu) {
    if (!usu || !usu.usuario_empresaids) {
        throw new Error("Usuário inválido");
    }

    if (usu.usuario_empresaids.some(id => id.equals(new ObjectId(id_da_BibliaCluster)))) {
        return connections.BibliaCluster;
    }

    if (usu.usuario_empresaids.some(id => id.equals(new ObjectId(id_global)))) {
        return connections.PortalDoUsuario;
    }

    throw new Error("Usuário sem permissão");
}

// 🔄 Retorna conexão por nome (com fallback dinâmico)
function getConnection(dbName = "BibliaCluster") {
    if (connections[dbName]) {
        return connections[dbName];
    }

    // Define cluster conforme nome
    let clusterCode = (dbName === "BibliaCluster" ? "msdrwm5" : "ldfs6a");

    const uri = `mongodb+srv://victorcintrafreitas_db_user:p0l7byEe7oo5g5au@${dbName.toLowerCase()}.${clusterCode}.mongodb.net/${dbName}`;

    const conn = createConnection(dbName, uri);
    connections[dbName] = conn;

    return conn;
}

module.exports = {
    connections,
    getDbByUser,
    getConnection
};