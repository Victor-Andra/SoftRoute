const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const multer = require('multer');
const storage = multer.memoryStorage(); // Armazena a imagem na memória como um Buffer
const upload = multer({ storage: storage });

const UsuarioSchema = mongoose.Schema({
    usuario_login : { type: String, unique: true, required: true },
    usuario_nome : { type: String, required: true, unique: true },
    usuario_nomecompleto : { type: String, required: false },
    usuario_end : { type: String, required: false },
    usuario_endcompl : { type: String, required: false },
    usuario_endbairro : { type: String, required: false },
    usuario_endcidade : { type: String, required: false },
    usuario_enduf : { type: String, required: false },
    usuario_endcep : { type: String, required: false },
    usuario_ident : { type: String, required: false },
    usuario_cpf : { type: String, unique: false, required: false },
    usuario_nacionalidade : { type: String, required: false },
    usuario_naturalidade : { type: String, required: false },
    usuario_datanasc : { type: String, required: false },
    usuario_nomepai: { type: String, required: false },
    usuario_nomemae : { type: String, required: false },  
    usuario_email : { type: String, required: false },
    usuario_cel1 : { type: String, required: false },
    usuario_cel2 : { type: String, required: false },
    usuario_carimbo: { type: Buffer, required: false, },// Utiliza Buffer para armazenar dados binários da imagem
    usuario_banco: { type: String, required: false },
    usuario_agencia : { type: String, required: false },  
    usuario_conta : { type: String, required: false },
    usuario_contatipo : { type: String, required: false },
    usuario_contrato : { type: String, required: false },
    usuario_funcaoid : { type: ObjectId, required: true },
    usuario_perfilid : { type: String, required: false },
    usuario_status : {type: String, required: false },
    usuario_senha : { type: String, required: false },
    usuario_img : {  type: String, required: false },
    usuario_filhos :{ type: String, required: false },
    usuario_filhosqt :{ type: String, required: false },
    usuario_numconselho :{ type: String, required: false },
    usuario_escolaridade :{ type: String, required: false },
    usuario_graduacao :{ type: String, required: false },
    usuario_especializacao :{ type: String, required: false },
    usuario_pix :{ type: String, required: false },
    usuario_tipopix :{ type: String, required: false },
    usuario_obs :{ type: String, required: false },
    usuario_datacad: { type: Date, required: false },
    usuario_dataedi: { type: Date, required: false },
})

class Usuario{
    constructor(
        usuario_login,
        usuario_nome,
        usuario_nomecompleto,
        usuario_end,
        usuario_endcompl,
        usuario_endbairro,
        usuario_endcidade,
        usuario_enduf,
        usuario_endcep,
        usuario_ident,
        usuario_cpf,
        usuario_nacionalidade,
        usuario_naturalidade,
        usuario_datanasc,
        usuario_nomepai,
        usuario_nomemae,
        usuario_email,
        usuario_cel1,
        usuario_cel2,
        usuario_carimbo,
        usuario_banco,
        usuario_agencia,
        usuario_conta,
        usuario_contatipo,
        usuario_contrato,
        usuario_funcaoid,
        usuario_perfilid,
        usuario_status,
        usuario_senha,
        usuario_img,
        usuario_filhos,
        usuario_filhosqt,
        usuario_numconselho, 
        usuario_escolaridade,
        usuario_graduacao,
        usuario_especializacao,
        usuario_pix,
        usuario_obs,
        usuario_datacad, usuario_dataedi
    ){
        this.usuario_login = usuario_login ,
        this.usuario_nome = usuario_nome ,
        this.usuario_nomecompleto = usuario_nomecompleto,
        this.usuario_end = usuario_end ,
        this.usuario_endcompl = usuario_endcompl ,
        this.usuario_endbairro = usuario_endbairro ,
        this.usuario_endcidade = usuario_endcidade ,
        this.usuario_enduf = usuario_enduf ,
        this.usuario_endcep = usuario_endcep ,
        this.usuario_ident = usuario_ident ,
        this.usuario_cpf = usuario_cpf ,
        this.usuario_nacionalidade = usuario_nacionalidade ,
        this.usuario_naturalidade = usuario_naturalidade ,
        this.usuario_datanasc = usuario_datanasc ,
        this.usuario_nomepai = usuario_nomepai ,
        this.usuario_nomemae = usuario_nomemae ,
        this.usuario_email = usuario_email ,
        this.usuario_cel1 = usuario_cel1 ,
        this.usuario_cel2 = usuario_cel2 ,

        this.usuario_carimbo = usuario_carimbo,
        this.usuario_banco = usuario_banco ,
        this.usuario_agencia = usuario_agencia,
        this.usuario_conta = usuario_conta ,
        this.usuario_contatipo = usuario_contatipo ,
        this.usuario_contrato = usuario_contrato ,

        this.usuario_funcaoid = usuario_funcaoid ,
        this.usuario_perfilid = usuario_perfilid ,
        this.usuario_status = usuario_status ,
        this.usuario_senha = usuario_senha ,
        this.usuario_img = usuario_img ,

        this.usuario_filhos = usuario_filhos ,
        this.usuario_filhosqt = usuario_filhosqt ,
        this.usuario_numconselho = usuario_numconselho ,
        this.usuario_escolaridade = usuario_escolaridade ,
        this.usuario_graduacao = usuario_graduacao ,
        this.usuario_especializacao = usuario_especializacao ,
        this.usuario_tipopix = usuario_tipopix,
        this.usuario_pix = usuario_pix ,
        this.usuario_obs = usuario_obs ,
        this.usuario_datacad = usuario_datacad ,
        this.usuario_dataedi = usuario_dataedi
    }
}

UsuarioSchema.loadClass(Usuario)
const UsuarioModel = mongoose.model('tb_usuario', UsuarioSchema)
module.exports = {
    UsuarioModel,
    UsuarioSchema,
    
    usuarioEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        //Pega data atual

        console.log("req.body.usuarioNome: "+req.body.usuarioNome)
        let nome = ""+req.body.usuarioNome+"";

        
        while((nome.substring(nome.length - 1))==" "){
            nome = nome.substring(0, nome.length - 1)
        }

        let palavras = nome.split(" ");
        
        for (let i = 0; i < palavras.length; i++) {
            palavras[i] = palavras[i][0].toUpperCase() + palavras[i].substr(1).toLowerCase();
        }
        
        let nomeFinal = palavras.join(" ");
        console.log("req.body.usuarioId: "+req.body.usuarioId)

        //Realiza Atualização
        await UsuarioModel.findByIdAndUpdate(req.body.usuarioId, 
            {$set: {
                usuario_login : req.body.usuarioLogin ,
                usuario_nome : nomeFinal ,
                usuario_nomecompleto : req.body.usuarioNomeCompleto,
                usuario_end : req.body.usuarioEnd ,
                usuario_endcompl : req.body.usuarioEndcompl ,
                usuario_endbairro : req.body.usuarioEndbairro ,
                usuario_endcidade : req.body.usuarioEndcidade ,
                usuario_enduf : req.body.usuarioEnduf ,
                usuario_endcep : req.body.usuarioEndcep ,
                usuario_ident : req.body.usuarioIdent ,
                usuario_cpf : req.body.usuarioCpf ,
                usuario_nacionalidade : req.body.usuarioNacionalidade ,
                usuario_naturalidade : req.body.usuarioNaturalidade ,
                usuario_datanasc : req.body.usuarioDatanasc ,
                usuario_nomepai : req.body.usuarioNomepai ,
                usuario_nomemae : req.body.usuarioNomemae ,
                usuario_email : req.body.usuarioEmail ,
                usuario_cel1 : req.body.usuarioCel1 ,
                usuario_cel2 : req.body.usuarioCel2 ,

                usuario_banco : req.body.usuarioBanco,
                usuario_agencia : req.body.usuarioAgencia ,
                usuario_conta : req.body.usuarioConta ,
                usuario_contatipo : req.body.usuarioContaTipo,
                usuario_contrato : req.body.usuarioContrato ,

                usuario_funcaoid : req.body.usuarioFuncaoid ,
                usuario_perfilid : req.body.usuarioPerfilid ,
                usuario_status : req.body.usuarioStatus ,
                usuario_senha : req.body.usuarioSenha ,
                usuario_img : req.body.usuarioImg ,

                usuario_filhos : req.body.usuarioFilhos ,
                usuario_filhosqt : req.body.usuarioFilhosQt ,
                usuario_numconselho : req.body.usuarioNumConselho ,
                usuario_escolaridade : req.body.usuarioEscolaridade ,
                usuario_graduacao : req.body.usuarioGraduacao ,
                usuario_especializacao : req.body.usuarioEspecializacao ,
                usuario_tipopix : req.body.usuarioTipoPix,
                usuario_pix : req.body.usuarioPix ,
                usuario_obs : req.body.usuarioObs,
                usuario_dataedi : dataAtual
                }}
        ).then((res) =>{
            console.log("Salvo")
            resultado = true;
        }).catch((err) =>{
            console.log("erro mongo:")
            console.log(err)
            resultado = err;
            //res.redirect('admin/branco')
        })
        return resultado;
    },

    usuarioAdicionar: async (req,res) => {
        let usuarioExiste =  await UsuarioModel.findOne({usuario_nome: req.body.usuarioNome});//quando não acha fica null
        let dataAtual = new Date();
        
        if(usuarioExiste){//se tiver null cai no else
            return "O nome da usuario já existe";
        } else {
            console.log("usuariomodel");
            const newUsuario = new UsuarioModel({
            usuario_login : req.body.usuarioLogin ,
            usuario_nome : req.body.usuarioNome ,
            usuario_nomecompleto : req.body.usuarioNomeCompleto,
            usuario_end : req.body.usuarioEnd ,
            usuario_endcompl : req.body.usuarioEndcompl ,
            usuario_endbairro : req.body.usuarioEndbairro ,
            usuario_endcidade : req.body.usuarioEndcidade ,
            usuario_enduf : req.body.usuarioEnduf ,
            usuario_endcep : req.body.usuarioEndcep ,
            usuario_ident : req.body.usuarioIdent ,
            usuario_cpf : req.body.usuarioCpf ,
            usuario_nacionalidade : req.body.usuarioNacionalidade ,
            usuario_naturalidade : req.body.usuarioNaturalidade ,
            usuario_datanasc : req.body.usuarioDatanasc ,
            usuario_nomepai : req.body.usuarioNomepai ,
            usuario_nomemae : req.body.usuarioNomemae ,
            usuario_email : req.body.usuarioEmail ,
            usuario_cel1 : req.body.usuarioCel1 ,
            usuario_cel2 : req.body.usuarioCel2 ,
            usuario_carimbo: req.file ? req.file.buffer : undefined,
            usuario_banco : req.body.usuarioBanco,
            usuario_agencia : req.body.usuarioAgencia ,
            usuario_conta : req.body.usuarioConta ,
            usuario_contatipo : req.body.usuarioContaTipo,
            usuario_contrato : req.body.usuarioContrato ,

            usuario_funcaoid : req.body.usuarioFuncaoid ,
            usuario_perfilid : req.body.usuarioPerfilid ,
            usuario_status : req.body.usuarioStatus ,
            usuario_senha : req.body.usuarioSenha ,
            usuario_img : req.body.usuarioImg ,

            usuario_filhos : req.body.usuarioFilhos ,
            usuario_filhosqt : req.body.usuarioFilhosQt ,
            usuario_numconselho : req.body.usuarioNumConselho ,
            usuario_escolaridade : req.body.usuarioEscolaridade ,
            usuario_graduacao : req.body.usuarioGraduacao ,
            usuario_especializacao : req.body.usuarioEspecializacao ,
            usuario_tipopix : req.body.usuarioTipoPix,
            usuario_pix : req.body.usuarioPix ,
            usuario_obs : req.body.usuarioObs,
            usuario_datacad : dataAtual
            });
            console.log("newUsuario save");
            await newUsuario.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        }
    }
};