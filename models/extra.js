const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const ExtraSchema = mongoose.Schema({
    extra_tipo :{ type: String, required: false },
    extra_auditado :{ type: String, required: false },
    extra_exportado :{ type: String, required: false },
    
    extra_org :{type: String, required: false },
    extra_categoria :{type: String, required: false },
    extra_beneid :{ type: ObjectId, required: false },
    extra_convid :{type: ObjectId, required: false },
    extra_usuid :{type: String, required: false },
    extra_data :{type: Date, required: false },
    extra_data_dia :{type: String, required: false },
    extra_hora :{type: String, required: false },
    extra_terapeutaid :{type: ObjectId, required: false },
    extra_terapiaid :{type: ObjectId, required: false },
    extra_salaid :{type: ObjectId, required: false },
    extra_valorcre :{type: String, required: false },
    extra_valordeb :{type: String, required: false },
    extra_mergeterapeutaid :{type: ObjectId, required: false },
    extra_mergeterapiaid :{type: ObjectId, required: false },
    extra_mergevalorcre :{type: String, required: false },
    extra_mergevalordeb :{type: String, required: false },
    extra_evolucao :{type: String, required: false },
    extra_obs :{type: String, required: false },
    extra_num :{type: Number, required: false },
    extra_datacad :{type: Date, required: false },
    extra_dataedi :{type: Date, required: false },

    extra_orgcop :{type: String, required: false },
    extra_categoriacop :{type: String, required: false },
    extra_beneidcop :{ type: ObjectId, required: false },
    extra_convidcop :{type: ObjectId, required: false },
    extra_usuidcop :{type: String, required: false },
    extra_tacop :{type: Date, required: false },
    extra_horacop :{type: String, required: false },
    extra_terapeutaidcop :{type: ObjectId, required: false },
    extra_terapiaidcop :{type: ObjectId, required: false },
    extra_salaidcop :{type: ObjectId, required: false },
    extra_valorcrecop :{type: String, required: false },
    extra_valordebcop :{type: String, required: false },
    extra_mergeterapeutaidcop :{type: ObjectId, required: false },
    extra_mergeterapiaidcop :{type: ObjectId, required: false },
    extra_mergevalorcrecop :{type: String, required: false },
    extra_mergevalordebcop :{type: String, required: false },
    extra_evolucaocop :{type: String, required: false },
    extra_obscop :{type: String, required: false },
    extra_numcop :{type: Number, required: false },
    extra_datacadcop :{type: Date, required: false },
    extra_dataedicop :{type: Date, required: false }
})

class Extra{
    constructor(
        extra_tipo,
        extra_auditado,
        extra_exportado,
        
        extra_org,
        extra_categoria,
        extra_beneid,
        extra_convid,
        extra_usuid,
        extra_data,
        extra_data_dia,
        extra_hora,
        extra_terapeutaid,
        extra_terapiaid,
        extra_salaid,
        extra_valorcre,
        extra_valordeb,
        extra_mergeterapeutaid,
        extra_mergeterapiaid,
        extra_mergevalorcre,
        extra_mergevalordeb,
        extra_evolucao,
        extra_obs,
        extra_num,
        extra_datacad,
        extra_dataedi,

        extra_orgcop,
        extra_categoriacop,
        extra_beneidcop,
        extra_convidcop,
        extra_usuidcop,
        extra_datacop,
        extra_horacop,
        extra_terapeutaidcop,
        extra_terapiaidcop,
        extra_salaidcop,
        extra_valorcrecop,
        extra_valordebcop,
        extra_mergeterapeutaidcop,
        extra_mergeterapiaidcop,
        extra_mergevalorcrecop,
        extra_mergevalordebcop,
        extra_evolucaocop,
        extra_obscop,
        extra_numcop,
        extra_datacadcop,
        extra_dataedicop

        ){
            this.extra_tipo = extra_tipo,
            this.extra_auditado = extra_auditado,
            this.extra_exportado = extra_exportado,
            
            this.extra_org = extra_org,
            this.extra_categoria = extra_categoria,
            this.extra_beneid = extra_beneid,
            this.extra_convid = extra_convid,
            this.extra_usuid = extra_usuid,
            this.extra_data = extra_data,
            this.extra_hora = extra_hora,
            this.extra_terapeutaid = extra_terapeutaid,
            this.extra_terapiaid = extra_terapiaid,
            this.extra_salaid = extra_salaid,
            this.extra_valorcre = extra_valorcre,
            this.extra_valordeb = extra_valordeb,
            this.extra_mergeterapeutaid = extra_mergeterapeutaid,
            this.extra_mergeterapiaid = extra_mergeterapiaid,
            this.extra_mergevalorcre = extra_mergevalorcre,
            this.extra_mergevalordeb = extra_mergevalordeb,
            this.extra_evolucao = extra_evolucao,
            this.extra_obs = extra_obs,
            this.extra_num = extra_num,
            this.extra_datacad = extra_datacad,
            this.extra_dataedi = extra_dataedi,

            this.extra_orgcop = extra_orgcop,
            this.extra_categoriacop = extra_categoriacop,
            this.extra_beneidcop = extra_beneidcop,
            this.extra_convidcop = extra_convidcop,
            this.extra_usuidcop = extra_usuidcop,
            this.extra_datacop = extra_datacop,
            this.extra_horacop = extra_horacop,
            this.extra_terapeutaidcop = extra_terapeutaidcop,
            this.extra_terapiaidcop = extra_terapiaidcop,
            this.extra_salaidcop = extra_salaidcop,
            this.extra_valorcrecop = extra_valorcrecop,
            this.extra_valordebcop = extra_valordebcop,
            this.extra_mergeterapeutaidcop = extra_mergeterapeutaidcop,
            this.extra_mergeterapiaidcop = extra_mergeterapiaidcop,
            this.extra_mergevalorcrecop = extra_mergevalorcrecop,
            this.extra_mergevalordebcop = extra_mergevalordebcop,
            this.extra_evolucaocop = extra_evolucaocop,
            this.extra_obscop = extra_obscop,
            this.extra_numcop = extra_numcop,
            this.extra_datacadcop = extra_datacadcop,
            this.extra_dataedicop = extra_dataedicop

    }
}

ExtraSchema.loadClass(Extra)
const ExtraModel = mongoose.model('tb_extra', ExtraSchema)
module.exports = {ExtraModel,ExtraSchema,
    extraEditar: async (req, res) => {
        let dataAtual = new Date();
        let resultado;
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        let extraId = new ObjectId(req.body.id);
        //Pega data atual
        console.log("req.body.id:"+req.body.id)
        console.log("extraId:"+extraId)
        //Realiza Atualização
        await ExtraModel.findByIdAndUpdate(new ObjectId(req.body.id), 
            {$set: {
                extra_tipo : req.body.extraTipo,
                extra_auditado : req.body.extraAuditado,
                extra_exportado : req.body.extraExportado,
                
                extra_org : req.body.extraOrg,
                extra_categoria : req.body.extraCategoria,
                extra_beneid : req.body.extraBeneid,
                extra_convid : req.body.extraConvid,
                extra_usuid : req.body.extraUsuid,
                extra_data : req.body.extraData,
                extra_hora : req.body.extraHora,
                extra_terapeutaid : req.body.extraTerapeutaid,
                extra_terapiaid : req.body.extraTerapiaid,
                extra_salaid : req.body.extraSalaid,
                extra_valorcre : req.body.extraValorcre,
                extra_valordeb : req.body.extraValordeb,
                extra_mergeterapeutaid : req.body.extraMergeTerapeutaid,
                extra_mergeterapiaid : req.body.extraMergeTerapiaid,
                extra_mergevalorcre : req.body.extraMergevalorcre,
                extra_mergevalordeb : req.body.extraMergevalordeb,
                extra_obs : req.body.extraObs,
                extra_dataedi : dataAtual.toISOString(),
                
                extra_orgcop : req.body.extraOrgcop,
                extra_categoriacop : req.body.extraCategoriacop,
                extra_beneidcop : req.body.extraBeneidcop,
                extra_convidcop: req.body.extraConvidcop,
                extra_usuidcop : req.body.extraUsuidcop,
                extra_extradatacop : req.body.extraDatacop,
                extra_extrahoracop : req.body.extraHoracop,
                extra_terapeutaidcop : req.body.extraTerapeutaidcop,
                extra_terapiaidcop : req.body.extraTerapiaidcop,
                extra_salaidcop : req.body.extraSalaidcop,
                extra_valorcrecop : req.body.extraValorcrecop,
                extra_valordebcop : req.body.extraValordebcop,
                extra_mergeterapeutaidcop : req.body.extraMergeTerapeutaidcop,
                extra_mergeterapiaidcop : req.body.extraMergeTerapiaidcop,
                extra_mergevalorcrecop : req.body.extraMergevalorcrecop,
                extra_mergevalordebcop : req.body.extraMergevalordebcop,
                extra_obscop : req.body.extraObscop,
                extra_dataedicop : dataAtual.toISOString()
                
                }}
                ).then((res) =>{
                    console.log("Salvo")
                    resultado = true;
                }).catch((err) =>{
                    console.log("erro mongo:")
                    console.log(err)
                    resultado = err;
                })
                return resultado;
            
    },
    extraAdicionar: async (req,res) => {
        //Validar se a Extraese existe
        console.log("extramodel");
        let dataAtual = new Date();
        let lvlUsu = req.cookies['lvlUsu'];
        let idUsu;
        let arrayIds = ['62421801a12aa557219a0fb9','62421903a12aa557219a0fd3'];//,'62421857a12aa557219a0fc1','624218f5a12aa557219a0fd0'
        arrayIds.forEach((id)=>{
            if(id == lvlUsu){
                idUsu = id;
            }
        })
        const newExtra = new ExtraModel({
            extra_tipo : req.body.extraTipo,
            extra_auditado : req.body.extraAuditado,
            extra_exportado : req.body.extraExportado,
            
            extra_org : req.body.extraOrg,
            extra_categoria : req.body.extraCategoria,
            extra_beneid : req.body.extraBeneid,
            extra_convid : req.body.extraConvid,
            extra_usuid : req.body.extraUsuid,
            extra_extradata : req.body.extraData,
            extra_extrahora : req.body.extraHora,
            extra_terapeutaid : req.body.extraTerapeutaid,
            extra_terapiaid : req.body.extraTerapiaid,
            extra_salaid : req.body.extraSalaid,
            extra_valorcre : req.body.extraValorcre,
            extra_valordeb : req.body.extraValordeb,
            extra_mergeterapeutaid : req.body.extraMergeTerapeutaid,
            extra_mergeterapiaid : req.body.extraMergeTerapiaid,
            extra_mergevalorcre : req.body.extraMergevalorcre,
            extra_mergevalordeb : req.body.extraMergevalordeb,
            extra_obs : req.body.extraObs,
            extra_num : req.body.nextNum,
            extra_datacad : dataAtual.toISOString(),
            
            extra_orgcop : req.body.extraOrgcop,
            extra_categoriacop : req.body.extraCategoriacop,
            extra_beneidcop : req.body.extraBeneidcop,
            extra_convidcop: req.body.extraConvidcop,
            extra_usuidcop : req.body.extraUsuidcop,
            extra_extradatacop : req.body.extraDatacop,
            extra_extrahoracop : req.body.extraHoracop,
            extra_terapeutaidcop : req.body.extraTerapeutaidcop,
            extra_terapiaidcop : req.body.extraTerapiaidcop,
            extra_salaidcop : req.body.extraSalaidcop,
            extra_valorcrecop : req.body.extraValorcrecop,
            extra_valordebcop : req.body.extraValordebcop,
            extra_mergeterapeutaidcop : req.body.extraMergeTerapeutaidcop,
            extra_mergeterapiaidcop : req.body.extraMergeTerapiaidcop,
            extra_mergevalorcrecop : req.body.extraMergevalorcrecop,
            extra_mergevalordebcop : req.body.extraMergevalordebcop,
            extra_obscop : req.body.extraObscop,
            extra_numcop : req.body.nextNumcop,
            extra_datacadcop : dataAtual.toISOString()
                
                
        });
        console.log("newExtra save");
        await newExtra.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    },

    montaExtra(req,res){
        const newExtra = new ExtraModel({
            extra_tipo : req.body.extraTipo,
            extra_auditado : req.body.extraAuditado,
            extra_org : req.body.extraOrg,
            extra_exportado : req.body.extraExportado,
            extra_categoria : req.body.extraCategoria,
            extra_beneid : req.body.extraBeneid,
            extra_convid : req.body.extraConvid,
            extra_usuid : req.body.extraUsuid,
            extra_extradata : req.body.extraData,
            extra_extrahora : req.body.extraHora,
            extra_terapeutaid : req.body.extraTerapeutaid,
            extra_terapiaid : req.body.extraTerapiaid,
            extra_salaid : req.body.extraSalaid,
            extra_valorcre : req.body.extraValorcre,
            extra_valordeb : req.body.extraValordeb,
            extra_mergeterapeutaid : req.body.extraMergeTerapeutaid,
            extra_mergeterapiaid : req.body.extraMergeTerapiaid,
            extra_mergevalorcre : req.body.extraMergevalorcre,
            extra_mergevalordeb : req.body.extraMergevalordeb,
            extra_obs : req.body.extraObs,
            extra_num : req.body.nextNum,
            extra_datacad : dataAtual.toISOString(),

            extra_orgcop : req.body.extraOrgcop,
            extra_categoriacop : req.body.extraCategoriacop,
            extra_beneidcop : req.body.extraBeneidcop,
            extra_convidcop: req.body.extraConvidcop,
            extra_usuidcop : req.body.extraUsuidcop,
            extra_extradatacop : req.body.extraDatacop,
            extra_extrahoracop : req.body.extraHoracop,
            extra_terapeutaidcop : req.body.extraTerapeutaidcop,
            extra_terapiaidcop : req.body.extraTerapiaidcop,
            extra_salaidcop : req.body.extraSalaidcop,
            extra_valorcrecop : req.body.extraValorcrecop,
            extra_valordebcop : req.body.extraValordebcop,
            extra_mergeterapeutaidcop : req.body.extraMergeTerapeutaidcop,
            extra_mergeterapiaidcop : req.body.extraMergeTerapiaidcop,
            extra_mergevalorcrecop : req.body.extraMergevalorcrecop,
            extra_mergevalordebcop : req.body.extraMergevalordebcop,
            extra_obscop : req.body.extraObscop,
            extra_numcop : req.body.nextNumcop,
            extra_datacadcop : dataAtual.toISOString()
        });

        return newExtra;
    },
    gerarExtra: async (extra) => {
        console.log("cadastrando novo extra!");
        console.log("extra: "+extra);
        await extra.save().then(()=>{
            console.log("Cadastro realizado!");
            return true;
        }).catch((err) => {
            console.log(err)
            return err;
        });
    }
    
    ,extraUpdateCampos: async (req,res) => {
        let resultado;
        let busca;
        let troca;
        let ini;
        let fim;
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
            let novavalorcrex = req.body.extraValorcre;
            let novavalordebx = req.body.extraValordeb;
            
            if (categoriaidx != "-"){
                busca = { extra_extradata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, extra_terapiaid: terapiaidx, extra_beneid: beneidx, extra_terapeutaid: terapeutaidx };
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                busca = { extra_extradata: {$gte : ini.toISOString(), $lte: fim.toISOString()}, extra_terapiaid: terapiaidx, extra_beneid: beneidx, extra_terapeutaid: terapeutaidx };
            } else if (terapeutaidx != "-" && terapiaidx != "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapiaid: terapiaidx, extra_terapeutaid: terapeutaidx , extra_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx != "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapiaid: terapiaidx, extra_beneid: beneidx };
            } else if (terapeutaidx != "-" && terapiaidx == "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_terapeutaid: terapeutaidx , extra_beneid: beneidx };
            } else if (terapeutaidx == "-" && terapiaidx == "-"){
                busca = { extra_extradata: { $gte : ini.toISOString(), $lte:  fim.toISOString() }, extra_beneid: beneidx };
            }

            if (categoriaidx != "-") {
                if (categoriaidx == "Padrão") {
                    troca = {'extra_categoria': categoriaidx, 'extra_org': 'Padrão'};
                } else {
                    troca = {'extra_categoria': categoriaidx, 'extra_org': 'Administrativo'};
                }
            } else if (novomergeteraidx != "-" && novamergetpiaidx != "-"){
                troca = {'extra_mergeterapeutaid': novomergeteraidx, 'extra_mergeterapiaid': novamergetpiaidx, 'extra_mergevalorcre': novavalorcrex, 'extra_valordeb': novavalordebx, 'extra_categoria': 'SubstitutoFixo', 'extra_org': 'Administrativo', 'extra_mergevalordeb': novavalordebx, 'extra_valorcre': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-"){//convenio
                troca = {'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx == "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-"){//convenio
                troca = {'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalordebx != "-"){//convenio
                troca = {'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-"){//convenio
                troca = {'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e terapia
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx == "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapeuta e convenio
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//terapia e convenio
                troca = {'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx != "-" && novaterapiaidx != "-" && novoconvidx != "-" && novavalorcrex != "-" && novavalordebx != "-") {//todos
                troca = {'extra_terapeutaid': novoterapeutaidx, 'extra_terapiaid': novaterapiaidx, 'extra_convid': novoconvidx, 'extra_valordeb': novavalorcrex};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex == "-" && novavalordebx != "-") {//todos
                troca = {'extra_valordeb': novavalordebx};
            } else if (novoterapeutaidx == "-" && novaterapiaidx == "-" && novoconvidx == "-" && novavalorcrex != "-" && novavalordebx == "-") {//todos
                troca = {'extra_valorcre': novavalorcrex};
            }

            await ExtraModel.updateMany(
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
    }
};