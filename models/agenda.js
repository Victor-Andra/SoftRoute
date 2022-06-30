const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const AgendaSchema = mongoose.Schema({
    agenda_data :{ type: Date, required: false },
    agenda_hora :{ type: String, required: false },
    agenda_data_semana :{ type: String, required: false },
    agenda_data_dia :{ type: String, required: false },
    agenda_beneid :{ type: ObjectId, required: false },
    agenda_convid :{ type: ObjectId, required: false },
    agenda_salaid :{ type: ObjectId, required: false },
    agenda_terapiaid :{ type: ObjectId, required: false },
    agenda_usuid :{ type: ObjectId, required: false }, //Id do terapeuta
    agenda_migrado :{ type: String, required: false }, //Status se o agendamento gerou agendamento
    agenda_datacad :{ type: String, required: false },
    agenda_dataedi :{ type: String, required: false }
})

class Agenda{
    constructor(
        agenda_data,
        agenda_hora,
        agenda_data_semana,
        agenda_data_dia,
        agenda_beneid,
        agenda_convid,
        agenda_salaid,
        agenda_terapiaid,
        agenda_usuid,
        agenda_migrado,
        agenda_datacad,
        agenda_dataedi

        ){
        this.agenda_data = agenda_data,
        this.agenda_hora = agenda_hora,
        this.agenda_data_semana = agenda_data_semana,
        this.agenda_data_dia = agenda_data_dia,
        this.agenda_beneid = agenda_beneid,
        this.agenda_convid = agenda_convid,
        this.agenda_salaid = agenda_salaid,
        this.agenda_terapiaid = agenda_terapiaid,
        this.agenda_usuid = agenda_usuid,
        this.agenda_migrado = agenda_migrado,
        this.agenda_datacad = agenda_datacad,
        this.agenda_dataedi = agenda_dataedi
                 
    }
}

AgendaSchema.loadClass(Agenda)
const AgendaModel = mongoose.model('tb_agenda', AgendaSchema)
module.exports = {AgendaModel,AgendaSchema,
    agendaEditar: async (req, res) => {
        let dataAtual = new Date();
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+data.getUTCHours()+':'+data.getMinutes()+':00.000Z');
        console.log(dataAgenda);
        let resultado;
        //Pega data atual
        
        //Realiza Atualização
        await AgendaModel.findByIdAndUpdate(req.body.agendaId, 
            {$set: {
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_migrado : req.body.agendaMigrado ,
                agenda_dataedi : dataAtual

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
    agendaAdicionar: async (req,res) => {
        let dataAtual = new Date();
        console.log("req.body.agendaData:"+req.body.agendaData)
        let data = new Date(req.body.agendaData);
        let dataAgenda = new Date(data.getFullYear()+'-'+(data.getMonth()+1)+'-'+data.getDate()+' '+req.body.agendaHora+':00.000Z');
        //console.log(dataAgenda);
        console.log("data:"+data);
        console.log("dataAgenda:"+dataAgenda);
        console.log("agendamodel");
            const newAgenda = new AgendaModel({
                agenda_data : dataAgenda ,
                agenda_beneid : req.body.agendaBeneid ,
                agenda_convid : req.body.agendaConvid ,
                agenda_salaid : req.body.agendaSalaid ,
                agenda_terapiaid : req.body.agendaTerapiaid ,
                agenda_usuid : req.body.agendaUsuid ,
                agenda_migrado : req.body.agendaMigrado ,
                agenda_datacad : dataAtual
            });
            console.log("newAgenda save");
            await newAgenda.save().then(()=>{
                console.log("Cadastro realizado!");
                return true;
            }).catch((err) => {
                console.log(err)
                return err;
            });
        
    }
};