const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AtendSchema = mongoose.Schema({
    atend_org :{ type: String, required: true },
    atend_categoria :{ type: String, required: true },
    atend_beneid :{ type: ObjectId, required: false },
    atend_convid :{ type: ObjectId, required: true },
    atend_usuid :{ type: String, required: true },
    atend_atenddata :{ type: Date, required: true },
    atend_atendhora :{ type: String, required: false },
    atend_terapeutaid :{ type: ObjectId, required: true },
    atend_terapiaid :{ type: ObjectId, required: true },
    atend_salaid :{ type: ObjectId, required: true },
    atend_valorcre :{ type: String, required: true },
    atend_valordeb :{ type: String, required: true },
    atend_mergeterapeutaid :{ type: ObjectId, required: false },
    atend_mergeterapiaid :{ type: ObjectId, required: false },
    atend_mergevalorcre :{ type: String, required: false },
    atend_mergevalordeb :{ type: String, required: false },
    atend_fixo :{ type: String, required: false },
    atend_fixoterapeutaid :{ type: ObjectId, required: false },
    atend_fixoterapiaid :{ type: ObjectId, required: false },
    atend_fixovalorcre :{ type: String, required: false },
    atend_fixovalordeb :{ type: String, required: false },
    atend_evolucao :{ type: String, required: false },
    atend_obs :{ type: String, required: false },
    atend_num :{ type: Number, required: true },
    atend_rel :{ type: String, required: false },
    atend_agenda_f_id_orig :{ type: ObjectId, required: false },
    atend_agenda_s_id_orig :{ type: ObjectId, required: false },
    atend_numnf :{ type: String, required: false },
    atend_extraid:{ type: ObjectId, required: false },//Armazena o extraid para gestão, Wagner Cintra, 14/04/2025 
    atend_datacad :{ type: Date, required: false },
    atend_usuidedi :{ type: ObjectId, required: false }, //novo campo para rastrear alterações de quem fez a edição 25/04/2025
    atend_dataedi :{ type: Date, required: false }
})

class Atend{
    constructor(
        atend_org,
        atend_categoria,
        atend_beneid,
        atend_convid,
        atend_usuid,
        atend_atenddata,
        atend_atendhora,
        atend_terapeutaid,
        atend_terapiaid,
        atend_salaid,
        atend_valorcre,
        atend_valordeb,
        atend_mergeterapeutaid,
        atend_mergeterapiaid,
        atend_mergevalorcre,
        atend_mergevalordeb,
        atend_fixo,
        atend_fixoterapeutaid,
        atend_fixoterapiaid,
        atend_fixovalorcre,
        atend_fixovalordeb,
        atend_evolucao,
        atend_obs,
        atend_num,
        atend_numnf,
        atend_extraid,//Armazena o extraid para gestão, Wagner Cintra, 14/04/2025 
        atend_rel,
        atend_datacad,
        atend_usuidedi, //novo campo para rastrear alterações de quem fez a edição 25/04/2025
        atend_dataedi
        ){
        this.atend_org = atend_org,
        this.atend_categoria = atend_categoria,
        this.atend_beneid = atend_beneid,
        this.atend_convid = atend_convid,
        this.atend_usuid = atend_usuid,
        this.atend_atenddata = atend_atenddata,
        this.atend_atendhora = atend_atendhora,
        this.atend_terapeutaid = atend_terapeutaid,
        this.atend_terapiaid = atend_terapiaid,
        this.atend_salaid = atend_salaid,
        this.atend_valorcre = atend_valorcre,
        this.atend_valordeb = atend_valordeb,
        this.atend_mergeterapeutaid = atend_mergeterapeutaid,
        this.atend_mergeterapiaid = atend_mergeterapiaid,
        this.atend_mergevalorcre = atend_mergevalorcre,
        this.atend_mergevalordeb = atend_mergevalordeb,
        this.atend_fixo = atend_fixo,
        this.atend_fixoterapeutaid = atend_fixoterapeutaid,
        this.atend_fixoterapiaid = atend_fixoterapiaid,
        this.atend_fixovalorcre = atend_fixovalorcre,
        this.atend_fixovalordeb = atend_fixovalordeb,
        this.atend_evolucao = atend_evolucao,
        this.atend_obs = atend_obs,
        this.atend_num = atend_num,
        this.atend_numnf = atend_numnf,
        this.atend_extraid = atend_extraid,//Armazena o extraid para gestão, Wagner Cintra, 14/04/2025 
        this.atend_rel = atend_rel,
        this.atend_datacad = atend_datacad,
        this.atend_usuidedi = atend_usuidedi, //novo campo para rastrear alterações de quem fez a edição 25/04/2025
        this.atend_dataedi = atend_dataedi
    }
}

AtendSchema.loadClass(Atend)
const AtendModel = mongoose.model('tb_atend', AtendSchema)
module.exports = {AtendModel,AtendSchema,
    atendEditar: async (req, res) => {
        let usuarioAtual = req.cookies['idUsu'];
        let dataAtual = new Date();
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        console.log("req.body.atendMergeTerapiaid:"+req.body.atendMergeTerapiaid);
        await AtendModel.findByIdAndUpdate(req.body.atendId, 
            {$set: {
                atend_org : req.body.atendOrg,
                atend_categoria : req.body.atendCategoria,
                atend_beneid : req.body.atendBeneid,
                atend_convid : req.body.atendConvid,
                atend_usuid : req.body.atendUsuid,
                atend_atenddata : req.body.atendAtenddata,
                atend_atendhora : req.body.atendHora,
                atend_terapeutaid : req.body.atendTerapeutaid,
                atend_terapiaid : req.body.atendTerapiaid,
                atend_salaid : req.body.atendSalaid,
                atend_valorcre : req.body.atendValorcre,
                atend_valordeb : req.body.atendValordeb,
                atend_mergeterapeutaid : req.body.atendMergeTerapeutaid,
                atend_mergeterapiaid : req.body.atendMergeTerapiaid,
                atend_mergevalorcre : req.body.atendMergevalorcre,
                atend_mergevalordeb : req.body.atendMergevalordeb,
                atend_fixo : req.body.atendFixo,
                atend_fixoterapeutaid : req.body.atendFixoTerapeutaid,
                atend_fixoterapiaid : req.body.atendFixoTerapiaid,
                atend_fixovalorcre : req.body.atendFixovalorcre,
                atend_fixovalordeb : req.body.atendFixovalordeb,
                atend_obs : req.body.atendObs,
                atend_usuidedi : usuarioAtual, //novo campo para rastrear alterações de quem fez a edição 25/04/2025
                atend_dataedi : dataAtual.toISOString()
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
    atendAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("atendmodel");
        console.log("req.body.atendAtenddata:")
        console.log(req.body.atendAtenddata)
        const newAtend = new AtendModel({
            atend_org : req.body.atendOrg,
            atend_categoria : req.body.atendCategoria,
            atend_beneid : req.body.atendBeneid,
            atend_convid : req.body.atendConvid,
            atend_usuid : req.body.atendUsuid,
            atend_atenddata : req.body.atendAtenddata,
            atend_atendhora : req.body.atendHora,
            atend_terapeutaid : req.body.atendTerapeutaid,
            atend_terapiaid : req.body.atendTerapiaid,
            atend_salaid : req.body.atendSalaid,
            atend_valorcre : req.body.atendValorcre,
            atend_valordeb : req.body.atendValordeb,
            atend_mergeterapeutaid : req.body.atendMergeTerapeutaid,
            atend_mergeterapiaid : req.body.atendMergeTerapiaid,
            atend_mergevalorcre : req.body.atendMergevalorcre,
            atend_mergevalordeb : req.body.atendMergevalordeb,
            atend_obs : req.body.atendObs,
            atend_num : req.body.nextNum,
            atend_numnf : req.body.atendNumnf,
            atend_extraid : req.body.atendExtraid,
            atend_datacad : dataAtual.toISOString()
            
        });
        console.log("newAtend save");
        await newAtend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },
    montaAtend(req,res){
        const newAtend = new AtendModel({
            atend_org : req.body.atendOrg,
            atend_categoria : req.body.atendCategoria,
            atend_beneid : req.body.atendBeneid,
            atend_convid : req.body.atendConvid,
            atend_usuid : req.body.atendUsuid,
            atend_atenddata : req.body.atendAtenddata,
            atend_atendhora : req.body.atendHora,
            atend_terapeutaid : req.body.atendTerapeutaid,
            atend_terapiaid : req.body.atendTerapiaid,
            atend_salaid : req.body.atendSalaid,
            atend_valorcre : req.body.atendValorcre,
            atend_valordeb : req.body.atendValordeb,
            atend_mergeterapeutaid : req.body.atendMergeTerapeutaid,
            atend_mergeterapiaid : req.body.atendMergeTerapiaid,
            atend_mergevalorcre : req.body.atendMergevalorcre,
            atend_mergevalordeb : req.body.atendMergevalordeb,
            atend_obs : req.body.atendObs,
            atend_num : req.body.nextNum,
            atend_numnf : req.body.atendNumnf,
            atend_datacad : dataAtual.toISOString()
        });

        return newAtend;
    },
    gerarAtend: async (atend) => {
        console.log("cadastrando novo atend!");
        console.log("atend: "+atend);
        await atend.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
    ,atendUpdateCampos: async (req,res) => {
        let resultado;
        let busca;
        let troca;
        let ini;
        let fim;
        let usuarioAtual = req.cookies['idUsu']; //novo campo para rastrear alterações de quem fez a edição 25/04/2025
        //-dataini
        let dt = new Date(req.body.agendaDataIni);
        
        let mes = (dt.getUTCMonth()+1).toString();
        let dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }

        let data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        let ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        let formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(0);
        formatData.setMinutes(0);
        formatData.setSeconds(0);
        ini = formatData;
        //-dataini
        //-datafim
        dt = new Date(req.body.agendaDataFim);
        
        mes = (dt.getUTCMonth()+1).toString();
        dia = (dt.getUTCDate()).toString();
        if (mes.length == 1){
            mes = "0"+mes;
        }
        if (dia.length == 1){
            dia = "0"+dia;
        }
        
        data = (dt.getFullYear()).toString()+'-'+mes+'-'+dia;
        ano = data.substring(0,4);
        mes = data.substring(5,7);
        dia = data.substring(8,10);

        formatData = new Date();
        formatData.setFullYear(ano);
        //console.log("formatData1:"+formatData)
        formatData.setUTCMonth((parseInt(mes)-1).toString());//recebendo o mes 1-12 passando para 0-11;
        //console.log("formatData2:"+formatData)
        formatData.setDate(dia);
        //console.log("formatData3:"+formatData)
        formatData.setHours(23);
        formatData.setMinutes(59);
        formatData.setSeconds(59);
        fim = formatData;
        //-datafim
        
        console.log("ini: "+ini.toISOString());
        console.log("fim: "+fim.toISOString());
        //hexadecimal de void123456id
        var voidId = new mongoose.mongo.ObjectId('766f69643132333435366964');
        //Ta com o nome de agenda pq vem da agenda, mas o id é esse
        let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
        let terapeutaidx = req.body.agendaTerapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let terapiaidx = req.body.agendaTeraFindid;//new ObjectId("624130e4f49e4506a6fa4df6");//terapia a ser substituida certo
        let convidx = req.body.agendaConvid;//new ObjectId("62477742e416141415ff7a88");//particular

        //Não esqueça de alterar os valores a Débito e Crédito
        let novoterapeutaidx = req.body.agendaTerapeutaSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novaterapiaidx = req.body.agendaTpiaSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let novoconvidx = req.body.agendaConvSubsid;//new ObjectId("62477742e416141415ff7a88");//particular
        let novomergeteraidx = req.body.agendaTerapeutaMergeSubsid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
        let novamergetpiaidx = req.body.agendaTerapiaMergeSubsid;//new ObjectId("63b8315c41a2918c14381a4d");//Nova Terapia ok
        let categoriaidx = req.body.agendaCategoria;
        //let novaconvidx = new ObjectId("624dee503339548ba06c4adc");//amil

        if (beneidx != "-") {
            let novavalorcrex = req.body.atendValorcre;
            let novavalordebx = req.body.atendValordeb;
            
            if (categoriaidx != "-"){
                if (categoriaidx == "Glosa"){
                    console.log("entro aqui")
                    busca = { atend_atenddata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, atend_beneid: beneidx , agenda_categoria: categoriaidx };
                } else {
                    busca = { atend_atenddata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, atend_terapiaid: terapiaidx, atend_beneid: beneidx, atend_terapeutaid: terapeutaidx };
                }
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                busca = { atend_atenddata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, atend_terapiaid: terapiaidx, atend_beneid: beneidx, atend_terapeutaid: terapeutaidx };
            } else if (terapeutaidx != "-" && terapiaidx != "-"){
                busca = { atend_atenddata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, atend_terapiaid: terapiaidx, atend_terapeutaid: terapeutaidx , atend_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx != "-"){
                busca = { atend_atenddata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, atend_terapiaid: terapiaidx, atend_beneid: beneidx };
            } else if (terapeutaidx != "-" && terapiaidx == "-"){
                busca = { atend_atenddata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, atend_terapeutaid: terapeutaidx , atend_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx == "-"){
                busca = { atend_atenddata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, atend_beneid: beneidx };
            }

            if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                troca = {'atend_mergeterapeutaid': novomergeteraidx, 'atend_mergeterapiaid': novamergetpiaidx, 'atend_mergevalorcre': novavalorcrex, 'atend_valordeb': novavalordebx, 'atend_categoria': 'SubstitutoFixo', 'atend_org': 'Administrativo', 'atend_mergevalordeb': novavalordebx, 'atend_valorcre': novavalorcrex, 'atend_valorcre': novavalorcrex, 'atend_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//todos
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_valorcre': novavalorcrex, 'atend_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//todos
                troca = {'atend_valorcre': novavalorcrex, 'atend_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-"){//convenio
                troca = {'atend_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta
                troca = {'atend_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia
                troca = {'atend_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//todos
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-"){//convenio
                troca = {'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalordebx != "-"){//convenio
                troca = {'atend_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta
                troca = {'atend_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia
                troca = {'atend_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-"){//convenio
                troca = {'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//todos
                troca = {'atend_terapeutaid': novoterapeutaidx, 'atend_terapiaid': novaterapiaidx, 'atend_convid': novoconvidx, 'atend_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'atend_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'atend_valorcre': novavalorcrex};
            }
            /*AtendModel.find(busca).then((atends)=>{
                console.log("atendsat:"+atends.length)
            })*/
            await AtendModel.updateMany(
                busca,{$set: troca}
            ).then((res) =>{
                console.log("Trocado")
                resultado = "OK"
            }).catch((err) =>{
                resultado = err
                console.log("erro mongo:")
                console.log(err)
            });
            return resultado;
        } else {
            resultado = "Campos de busca vazios!"
        }
    },

    atendFaltaDia: async (req, res) => {
            let usuarioAtual = req.cookies['idUsu'];
            var retorno;
            let arrayAgendasNovas = [];
            let dataAtual = new Date();
            let arrayIds =[];
            let agendaFinal = [];
            let resultado = "true";
            let busca;
            let agendaS;
            let dataIni = fncGeral.getDateFromString(req.body.agendaData, "ini");
            let dataFim = fncGeral.getDateFromString(req.body.agendaData, "fim");
            let beneidx = req.body.agendaBeneid;//new ObjectId("62d814b1ea444f5b7a02687e");//beneficiario à localizar certo
            let teraidx = req.body.agendaMergeterapeutaid;//new ObjectId("62d94c7fea444f5b7a0275fc");//terapeuta à localizar certoOk
            //console.log("ini: "+fncGeral.getDateToIsostring(dataIni));
            //console.log("fim: "+fncGeral.getDateToIsostring(dataFim));
            let horasTurnoManha = ["08:00","08:40","09:20","10:00","10:40","11:20"];
            let horasTurnoTarde = ["13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
            let horasTurnoCompleto = ["08:00","08:40","09:20","10:00","10:40","11:20","13:20","14:00","14:40","15:20","16:00","16:40","17:20","18:00"];
            //Calculetodos
            let turno = [];
            
            if (req.body.agendaTurnoFalta == "Manhã"){
                turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoManha);
                
                console.log("dataIni? "+dataIni)
                console.log("dataFim? "+dataFim)
                dataFim.setHours(12);
                console.log("dataIni? "+dataIni)
                console.log("dataFim? "+dataFim)
                turnoIni = fncGeral.getDateToIsostring(dataIni);
                turnoFim = fncGeral.getDateToIsostring(dataFim);
                console.log("turnoIni? "+turnoIni)
                console.log("turnoFim? "+turnoFim)
            } else if (req.body.agendaTurnoFalta == "Tarde"){
                console.log("TARDE")
                turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoTarde);
    
                console.log("dataIni? "+dataIni)
                console.log("dataFim? "+dataFim)
                dataIni.setHours(12);
                console.log("dataIni? "+dataIni)
                console.log("dataFim? "+dataFim)
                turnoIni = fncGeral.getDateToIsostring(dataIni);
                turnoFim = fncGeral.getDateToIsostring(dataFim);
                console.log("turnoIni? "+turnoIni)
                console.log("turnoFim? "+turnoFim)
            } else {
                turno = fncGeral.getDateHoursToIsostring(dataIni,horasTurnoCompleto);
    
                turnoIni = fncGeral.getDateToIsostring(dataIni);
                turnoFim = fncGeral.getDateToIsostring(dataFim);
                console.log("turnoIni? "+turnoIni)
                console.log("turnoFim? "+turnoFim)
            }
            console.log("req.body.agendaCateg: "+req.body.agendaCateg);
            if (beneidx == "-" && req.body.agendaMergeterapeutaid == "-") {
                resultado = "false";
            } else if (beneidx != "-" && teraidx == "-") {
                busca = { atend_atenddata: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_beneid: beneidx };
            } else if (beneidx == "-" && teraidx != "-") {
                console.log("falta terapeuta")
                busca = { agenda_data: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx };
            } else {
                console.log("falta de um bene para um terapeuta")
                busca = { agenda_data: { $gte : turnoIni, $lte:  turnoFim }, agenda_temp: false, agenda_extra: false, agenda_usuid: teraidx , agenda_beneid: beneidx };
            }
            if (resultado != "false"){
                await AgendaModel.find(busca).then((agenda)=>{
                    console.log("agenda:"+agenda.length);
                    agenda.forEach(a => {
                        arrayIds.push(a._id);
                    })
                    AgendaModel.find({agenda_tempId: {$in: arrayIds}}).then((agendaSemanal)=>{
                        console.log("agendaSemanal:"+agendaSemanal.length);
                        agendaSemanal.forEach(as => {
                            agendaFinal.push(as);
                        })
                        agenda.forEach((a)=>{
                            let add = "true";
                            agendaSemanal.forEach(as => {
                                if ((""+as.agenda_tempId+"") == (""+a._id+"")){
                                    add = "false";
                                }
                            })
                            if (add == "true"){
                                agendaFinal.push(a);
                            }
                        })
                        agendaFinal.forEach(a => {
                            if (a.agenda_tempId == undefined || a.agenda_tempId == "undefined"){
                                agendaS = "false";
                            } else {
                                agendaS = "true";
                            }
                            
                            if (agendaS == "true"){
                                arrayAgendasNovas.push(a);
                                AgendaModel.findByIdAndUpdate(a._id, 
                                    {$set: {
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_usucad : usuarioAtual ,
                                        agenda_dataedi : dataAtual ,
                                        agenda_faltaId : req.body.agendaFaltaId ,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta 
                                    }}
                                ).then((res) =>{
                                    //console.log("Salvo")
                                    resultado = true;
                                }).catch((err) =>{
                                    console.log("erro mongo:")
                                    console.log(err)
                                    resultado = err;
                                    //res.redirect('admin/branco')
                                })
                            } else {
                                if (a.agenda_mergeterapeutaid != undefined){
                                    let newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_mergeterapeutaid : a.agenda_mergeterapeutaid ,
                                        agenda_mergeterapiaid : a.agenda_mergeterapiaid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_copia : false,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                    arrayAgendasNovas.push(newAgenda)
                                    newAgenda.save().then((resultado)=>{
                                        console.log("Resultado: "+resultado)
                                    }).catch((err)=>{
                                        console.log("err: "+err)
                                    })
                                    console.log("salvo!")
                                } else {
                                    let newAgenda = new AgendaModel({
                                        agenda_data : a.agenda_data ,
                                        agenda_beneid : a.agenda_beneid ,
                                        agenda_convid : a.agenda_convid ,
                                        agenda_salaid : a.agenda_salaid ,
                                        agenda_terapiaid : a.agenda_terapiaid ,
                                        agenda_usuid : a.agenda_usuid ,
                                        agenda_migrado : false ,
                                        agenda_categoria : req.body.agendaCateg ,
                                        agenda_org : "Administrativo" ,
                                        agenda_obs : a.agenda_obs ,
                                        agenda_temp : true ,
                                        agenda_tempId : new mongoose.mongo.ObjectId(a._id) ,
                                        agenda_tempmotivo : a.agenda_tempmotivo ,
                                        agenda_selo : false ,
                                        agenda_copia : false,
                                        agenda_faltaId : req.body.agendaFaltaId,
                                        agenda_falta : req.body.agendaAlvoFalta ,
                                        agenda_turnoFalta : req.body.agendaTurnoFalta,
                                        agenda_usucad : usuarioAtual,
                                        agenda_datacad : dataAtual
                                    });
                                    arrayAgendasNovas.push(newAgenda)
                                    newAgenda.save().then((resultado)=>{
                                        console.log("Resultado: "+resultado)
                                    }).catch((err)=>{
                                        console.log("err: "+err)
                                    })
                                    console.log("salvo2!")
                                }
                            }
                        });
                    })
                }).catch((err) =>{
                    retorno = err
                    console.log("erro mongo:");
                    console.log(err);
                }).finally(()=>{
                    //console.log("arrayAgendasNovas: "+arrayAgendasNovas.length)
                    
                    retorno = "true";
                    return retorno;
                })
            }
        }
};